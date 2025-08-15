// Date Difference Calculator JavaScript
class DateCalculator {
    constructor() {
        this.form = document.getElementById('dateForm');
        this.results = document.getElementById('results');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setDefaultDates();
    }

    setDefaultDates() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        // Set default start date to now
        startDateInput.value = this.formatDateTimeLocal(now);
        // Set default end date to tomorrow
        endDateInput.value = this.formatDateTimeLocal(tomorrow);
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const button = e.target.querySelector('.calculate-btn');
        
        // Add loading state
        button.classList.add('loading');
        
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        // Validate dates
        if (!this.validateDates(startDate, endDate)) {
            button.classList.remove('loading');
            return;
        }
        
        // Calculate difference
        setTimeout(() => {
            this.calculateDifference(startDate, endDate);
            this.showResults();
            button.classList.remove('loading');
        }, 300); // Small delay for better UX
    }

    validateDates(startDate, endDate) {
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('Please enter valid dates.');
            return false;
        }
        
        if (startDate >= endDate) {
            alert('End date must be after start date.');
            return false;
        }
        
        return true;
    }

    calculateDifference(startDate, endDate) {
        const diffInMs = endDate.getTime() - startDate.getTime();
        
        // Calculate total units
        const totalSeconds = Math.floor(diffInMs / 1000);
        const totalMinutes = Math.floor(diffInMs / (1000 * 60));
        const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        // Calculate breakdown
        const breakdown = this.calculateBreakdown(startDate, endDate);
        
        // Calculate business days
        const businessDays = DateUtils.getBusinessDays(startDate, endDate);
        
        // Update UI
        this.updateResults({
            totalDays,
            totalHours,
            totalMinutes,
            totalSeconds,
            breakdown,
            businessDays,
            startDate,
            endDate
        });
    }

    calculateBreakdown(startDate, endDate) {
        let years = 0;
        let months = 0;
        let days = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        
        // Clone start date for calculation
        let current = new Date(startDate.getTime());
        const end = new Date(endDate.getTime());
        
        // Calculate years
        while (current.getFullYear() < end.getFullYear()) {
            const nextYear = new Date(current.getTime());
            nextYear.setFullYear(current.getFullYear() + 1);
            
            if (nextYear <= end) {
                years++;
                current = nextYear;
            } else {
                break;
            }
        }
        
        // Calculate months
        while (current.getMonth() !== end.getMonth() || current.getFullYear() !== end.getFullYear()) {
            const nextMonth = new Date(current.getTime());
            nextMonth.setMonth(current.getMonth() + 1);
            
            if (nextMonth <= end) {
                months++;
                current = nextMonth;
            } else {
                break;
            }
        }
        
        // Calculate remaining time
        const remainingMs = end.getTime() - current.getTime();
        
        days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
        const remainingAfterDays = remainingMs % (1000 * 60 * 60 * 24);
        
        hours = Math.floor(remainingAfterDays / (1000 * 60 * 60));
        const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);
        
        minutes = Math.floor(remainingAfterHours / (1000 * 60));
        const remainingAfterMinutes = remainingAfterHours % (1000 * 60);
        
        seconds = Math.floor(remainingAfterMinutes / 1000);
        
        return { years, months, days, hours, minutes, seconds };
    }

    updateResults(data) {
        const { totalDays, totalHours, totalMinutes, totalSeconds, breakdown, businessDays, startDate, endDate } = data;
        
        // Update total values
        document.getElementById('totalDays').textContent = this.formatNumber(totalDays);
        document.getElementById('totalHours').textContent = this.formatNumber(totalHours);
        document.getElementById('totalMinutes').textContent = this.formatNumber(totalMinutes);
        document.getElementById('totalSeconds').textContent = this.formatNumber(totalSeconds);
        
        // Update breakdown
        document.getElementById('years').textContent = breakdown.years;
        document.getElementById('months').textContent = breakdown.months;
        document.getElementById('days').textContent = breakdown.days;
        document.getElementById('hours').textContent = breakdown.hours;
        document.getElementById('minutes').textContent = breakdown.minutes;
        document.getElementById('seconds').textContent = breakdown.seconds;
        
        // Update business days
        document.getElementById('businessDays').textContent = this.formatNumber(businessDays);
        
        // Update summary
        const summaryText = this.generateSummary(breakdown, startDate, endDate);
        document.getElementById('summaryText').textContent = summaryText;
    }

    generateSummary(breakdown, startDate, endDate) {
        const startStr = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const endStr = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let parts = [];
        
        if (breakdown.years > 0) {
            parts.push(`${breakdown.years} year${breakdown.years !== 1 ? 's' : ''}`);
        }
        
        if (breakdown.months > 0) {
            parts.push(`${breakdown.months} month${breakdown.months !== 1 ? 's' : ''}`);
        }
        
        if (breakdown.days > 0) {
            parts.push(`${breakdown.days} day${breakdown.days !== 1 ? 's' : ''}`);
        }
        
        if (breakdown.hours > 0) {
            parts.push(`${breakdown.hours} hour${breakdown.hours !== 1 ? 's' : ''}`);
        }
        
        if (breakdown.minutes > 0) {
            parts.push(`${breakdown.minutes} minute${breakdown.minutes !== 1 ? 's' : ''}`);
        }
        
        if (breakdown.seconds > 0) {
            parts.push(`${breakdown.seconds} second${breakdown.seconds !== 1 ? 's' : ''}`);
        }
        
        let timeString = '';
        if (parts.length > 0) {
            if (parts.length === 1) {
                timeString = parts[0];
            } else if (parts.length === 2) {
                timeString = parts.join(' and ');
            } else {
                timeString = parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
            }
        } else {
            timeString = 'less than a second';
        }
        
        return `From ${startStr} to ${endStr}, there is exactly ${timeString}.`;
    }

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    showResults() {
        this.results.classList.remove('hidden');
        this.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Utility functions for additional features
class DateUtils {
    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    static getDaysInMonth(year, month) {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month === 1 && this.isLeapYear(year)) {
            return 29;
        }
        return daysInMonth[month];
    }
    
    static getBusinessDays(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate.getTime());
        
        while (current < endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return count;
    }
    
    static addBusinessDays(date, days) {
        const result = new Date(date.getTime());
        let addedDays = 0;
        
        while (addedDays < days) {
            result.setDate(result.getDate() + 1);
            const dayOfWeek = result.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                addedDays++;
            }
        }
        
        return result;
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new DateCalculator();
});

// Reset function
function resetForm() {
    window.calculator.setDefaultDates();
    document.getElementById('results').classList.add('hidden');
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('dateForm').dispatchEvent(new Event('submit'));
        }
    });
    
    // Add date input validation
    const dateInputs = document.querySelectorAll('input[type="datetime-local"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', () => {
            const date = new Date(input.value);
            if (date < new Date('1900-01-01') || date > new Date('2100-12-31')) {
                alert('Please enter a date between 1900 and 2100.');
                input.focus();
            }
        });
    });
});