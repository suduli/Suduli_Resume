// Client Recommendation Summary Module
// Processes CSV data and displays current year recommendation count

class RecommendationSummary {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.csvPath = './Recommendations_Received.csv';
        this.containerId = 'recommendation-summary';
    }

    // Utilities are sourced from utils/recommendation-utils.js when available
    get utils() {
        // Prefer global in browser; support require in tests
        if (typeof RecommendationUtils !== 'undefined') return RecommendationUtils;
        try {
            // eslint-disable-next-line no-undef
            return require('./utils/recommendation-utils.js');
        } catch (_) {
            return null;
        }
    }

    // Process recommendations and count current year entries
    processRecommendations(data) {
        const currentYearRecommendations = [];
        const processedIds = new Set(); // To handle duplicates
        
        for (const row of data) {
            // Only count VISIBLE status recommendations
            if (row.Status !== 'VISIBLE') continue;
            
            const year = this.utils ? this.utils.extractYear(row['Creation Date']) : null;
            if (year === this.currentYear) {
                // Create unique ID to handle duplicates
                const uniqueId = `${row['First Name']}-${row['Last Name']}-${row.Company}`;
                if (!processedIds.has(uniqueId)) {
                    currentYearRecommendations.push(row);
                    processedIds.add(uniqueId);
                }
            }
        }
        
        return {
            currentYearCount: currentYearRecommendations.length,
            totalCount: data.filter(row => row.Status === 'VISIBLE').length,
            recommendations: currentYearRecommendations
        };
    }

    // Load and process CSV file
    async loadRecommendations() {
        try {
            const response = await fetch(this.csvPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            if (!csvText.trim()) {
                throw new Error('CSV file is empty');
            }
            
            const utils = this.utils;
            const data = utils ? utils.parseCSV(csvText) : [];
            if (data.length === 0) {
                throw new Error('No valid data found in CSV file');
            }
            
            return this.processRecommendations(data);
        } catch (error) {
            console.error('[RecommendationSummary] Error loading recommendations:', error);
            throw error;
        }
    }

    // Create HTML content for the summary
    createSummaryHTML(result) {
        return `
            <div class="recommendation-summary-content">
                <div class="recommendation-icon">
                    <i class="fas fa-thumbs-up"></i>
                </div>
                <div class="recommendation-info">
                    <h3 class="recommendation-title">Testimonial Received in ${this.currentYear}</h3>
                    <div class="recommendation-count">
                        <span class="count-number">${result.currentYearCount}</span>
                        <span class="count-label">Recommendations This Year</span>
                    </div>
                    <div class="recommendation-count" style="margin-top:10px;">
                        <span class="count-number">${result.totalCount}</span>
                        <span class="count-label">Total Recommendations Received</span>
                    </div>
                    <p class="recommendation-description">
                        Professional endorsements from colleagues and clients highlighting expertise in automotive testing and validation.
                    </p>
                </div>
            </div>
        `;
    }

    // Create error message HTML
    createErrorHTML(error) {
        return `
            <div class="recommendation-summary-content error">
                <div class="recommendation-icon error">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="recommendation-info">
                    <h3 class="recommendation-title">Testimonial</h3>
                    <div class="recommendation-error">
                        <span class="error-message">Unable to load recommendation data</span>
                        <span class="error-details">${error.message}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize and render the summary
    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`[RecommendationSummary] Container with ID '${this.containerId}' not found`);
            return;
        }

        // Show loading state
        container.innerHTML = `
            <div class="recommendation-summary-content loading">
                <div class="recommendation-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="recommendation-info">
                    <h3 class="recommendation-title">Loading Recommendations...</h3>
                </div>
            </div>
        `;

        try {
            const result = await this.loadRecommendations();
            container.innerHTML = this.createSummaryHTML(result);
            console.log(`[RecommendationSummary] Successfully loaded ${result.currentYearCount} recommendations for ${this.currentYear}`);
        } catch (error) {
            container.innerHTML = this.createErrorHTML(error);
            console.error('[RecommendationSummary] Failed to initialize:', error);
        }
    }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const recommendationSummary = new RecommendationSummary();
        recommendationSummary.init();
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecommendationSummary;
}