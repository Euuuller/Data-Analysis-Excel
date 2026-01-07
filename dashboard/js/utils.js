/**
 * Utility Functions for Cohort Analysis Dashboard
 * Provides helper functions for formatting, calculations, and data manipulation
 */

const Utils = {
    /**
     * Format number as percentage
     * @param {number} value - Value to format (0-1 or 0-100)
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted percentage
     */
    formatPercentage(value, decimals = 1) {
        if (value === null || value === undefined || isNaN(value)) return '--';
        const percentage = value > 1 ? value : value * 100;
        return `${percentage.toFixed(decimals)}%`;
    },

    /**
     * Format number with thousands separator
     * @param {number} value - Value to format
     * @returns {string} Formatted number
     */
    formatNumber(value) {
        if (value === null || value === undefined || isNaN(value)) return '--';
        return new Intl.NumberFormat('pt-BR').format(value);
    },

    /**
     * Format currency value
     * @param {number} value - Value to format
     * @param {string} currency - Currency code (BRL, USD, EUR)
     * @returns {string} Formatted currency
     */
    formatCurrency(value, currency = 'BRL') {
        if (value === null || value === undefined || isNaN(value)) return '--';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(value);
    },

    /**
     * Format date to readable string
     * @param {Date|string} date - Date to format
     * @param {string} format - Format type ('short', 'long', 'month-year')
     * @returns {string} Formatted date
     */
    formatDate(date, format = 'short') {
        if (!date) return '--';
        const d = new Date(date);

        if (format === 'month-year') {
            return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        } else if (format === 'long') {
            return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        return d.toLocaleDateString('pt-BR');
    },

    /**
     * Get color for heatmap based on value
     * @param {number} value - Value (0-100)
     * @param {boolean} reverse - Reverse color scale (red=high, green=low)
     * @returns {string} RGB color string
     */
    getHeatmapColor(value, reverse = false) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'rgb(241, 245, 249)'; // Light gray for null values
        }

        // Normalize to 0-1
        const normalized = Math.max(0, Math.min(100, value)) / 100;
        const adjustedValue = reverse ? 1 - normalized : normalized;

        // Color interpolation: Red (0) -> Yellow (0.5) -> Green (1)
        let r, g, b;

        if (adjustedValue < 0.5) {
            // Red to Yellow
            r = 239;
            g = Math.round(68 + (187 * (adjustedValue * 2)));
            b = 68;
        } else {
            // Yellow to Green
            r = Math.round(251 - (235 * ((adjustedValue - 0.5) * 2)));
            g = Math.round(191 + (94 * ((adjustedValue - 0.5) * 2)));
            b = Math.round(36 + (93 * ((adjustedValue - 0.5) * 2)));
        }

        return `rgb(${r}, ${g}, ${b})`;
    },

    /**
     * Get text color (black/white) based on background color for contrast
     * @param {string} bgColor - Background color in rgb format
     * @returns {string} Text color (black or white)
     */
    getContrastColor(bgColor) {
        // Extract RGB values
        const rgb = bgColor.match(/\d+/g);
        if (!rgb) return '#000000';

        const [r, g, b] = rgb.map(Number);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#0f172a' : '#ffffff';
    },

    /**
     * Calculate average of array
     * @param {number[]} arr - Array of numbers
     * @returns {number} Average value
     */
    average(arr) {
        if (!arr || arr.length === 0) return 0;
        const validValues = arr.filter(v => v !== null && v !== undefined && !isNaN(v));
        if (validValues.length === 0) return 0;
        return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
    },

    /**
     * Calculate median of array
     * @param {number[]} arr - Array of numbers
     * @returns {number} Median value
     */
    median(arr) {
        if (!arr || arr.length === 0) return 0;
        const validValues = arr.filter(v => v !== null && v !== undefined && !isNaN(v));
        if (validValues.length === 0) return 0;

        const sorted = [...validValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    },

    /**
     * Download data as CSV file
     * @param {string} csvContent - CSV content
     * @param {string} filename - File name
     */
    downloadCSV(csvContent, filename = 'cohort-data.csv') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Download data as JSON file
     * @param {object} data - Data object
     * @param {string} filename - File name
     */
    downloadJSON(data, filename = 'cohort-data.json') {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Convert matrix to CSV format
     * @param {Array[]} matrix - 2D array
     * @param {string[]} headers - Column headers
     * @returns {string} CSV content
     */
    matrixToCSV(matrix, headers = []) {
        let csv = '';

        if (headers.length > 0) {
            csv += headers.join(',') + '\n';
        }

        matrix.forEach(row => {
            csv += row.map(cell => {
                // Handle cells with commas or quotes
                if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(',') + '\n';
        });

        return csv;
    },

    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Show notification/toast message
     * @param {string} message - Message to display
     * @param {string} type - Type of message ('success', 'error', 'info')
     */
    showNotification(message, type = 'info') {
        // Simple console log for now - can be enhanced with toast library
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} ${message}`);

        // You can add a toast library here for better UX
        // For now, using browser alert for errors
        if (type === 'error') {
            alert(message);
        }
    },

    /**
     * Validate cohort data structure
     * @param {Array} data - Data array to validate
     * @returns {object} Validation result {valid: boolean, errors: string[]}
     */
    validateCohortData(data) {
        const errors = [];

        if (!data || !Array.isArray(data)) {
            errors.push('Data must be an array');
            return { valid: false, errors };
        }

        if (data.length === 0) {
            errors.push('Data is empty');
            return { valid: false, errors };
        }

        // Check first row for headers
        const firstRow = data[0];
        if (!firstRow.Month && !firstRow.month) {
            errors.push('Missing "Month" column');
        }

        // Check for period columns (0-11)
        const periodColumns = Object.keys(firstRow).filter(key => !isNaN(key));
        if (periodColumns.length === 0) {
            errors.push('Missing period columns (0-11)');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
