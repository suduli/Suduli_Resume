// Client Recommendation Summary Module
// Processes CSV data and displays current year recommendation count

class RecommendationSummary {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.csvPath = './Recommendations_Received.csv';
        this.containerId = 'recommendation-summary';
    }

    // Parse CSV text into array of objects
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length === 0) return [];

        const headers = this.parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }

        return data;
    }

    // Parse a single CSV line handling quoted fields with commas
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let i = 0;

        while (i < line.length) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i - 1] === ',')) {
                inQuotes = true;
            } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
                i++;
                continue;
            } else {
                current += char;
            }
            i++;
        }
        
        result.push(current.trim());
        return result;
    }

    // Extract year from date string (formats: MM/DD/YY, MM/DD/YYYY)
    extractYear(dateString) {
        if (!dateString) return null;
        
        try {
            // Handle formats like "06/30/25, 12:37 PM" or "12/05/24, 02:33 PM"
            const datePart = dateString.split(',')[0].trim();
            const parts = datePart.split('/');
            
            if (parts.length === 3) {
                let year = parseInt(parts[2]);
                
                // Convert 2-digit year to 4-digit
                if (year < 50) {
                    year += 2000; // 00-49 becomes 2000-2049
                } else if (year < 100) {
                    year += 1900; // 50-99 becomes 1950-1999
                }
                
                return year;
            }
        } catch (error) {
            console.warn('[RecommendationSummary] Invalid date format:', dateString);
        }
        
        return null;
    }

    // Process recommendations and count current year entries
    processRecommendations(data) {
        const currentYearRecommendations = [];
        const processedIds = new Set(); // To handle duplicates
        
        for (const row of data) {
            // Only count VISIBLE status recommendations
            if (row.Status !== 'VISIBLE') continue;
            
            const year = this.extractYear(row['Creation Date']);
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
            
            const data = this.parseCSV(csvText);
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
                    <h3 class="recommendation-title">Client Recommendations Received in ${this.currentYear}</h3>
                    <div class="recommendation-count">
                        <span class="count-number">${result.currentYearCount}</span>
                        <span class="count-label">Recommendations This Year</span>
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
                    <h3 class="recommendation-title">Client Recommendations</h3>
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