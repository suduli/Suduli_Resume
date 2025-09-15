// moved from root recommendation-summary.js
class RecommendationSummary {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.csvPath = 'assets/data/Recommendations_Received.csv';
        this.containerId = 'recommendation-summary';
    }

    get utils() {
        if (typeof RecommendationUtils !== 'undefined') return RecommendationUtils;
        try {
            return require('../../utils/recommendation-utils.js');
        } catch (_) {
            return null;
        }
    }

    processRecommendations(data) {
        const currentYearRecommendations = [];
        const processedIds = new Set();
        for (const row of data) {
            if (row.Status !== 'VISIBLE') continue;
            const year = this.utils ? this.utils.extractYear(row['Creation Date']) : null;
            if (year === this.currentYear) {
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

    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`[RecommendationSummary] Container with ID '${this.containerId}' not found`);
            return;
        }
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
            
            // Dispatch a custom event to notify other components that the content is ready
            const event = new CustomEvent('recommendationSummaryReady', {
                detail: { result, container }
            });
            document.dispatchEvent(event);
        } catch (error) {
            container.innerHTML = this.createErrorHTML(error);
            console.error('[RecommendationSummary] Failed to initialize:', error);
        }
    }
}
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const recommendationSummary = new RecommendationSummary();
        recommendationSummary.init();
    });
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecommendationSummary;
}
