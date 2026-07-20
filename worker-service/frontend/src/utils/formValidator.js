export class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 9;
    }

    static validateNumber(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    static validateRequired(value) {
        return value && value.toString().trim().length > 0;
    }

    static validate(fields, rules) {
        const errors = {};

        Object.entries(rules).forEach(([fieldName, fieldRules]) => {
            const value = fields[fieldName];

            if (fieldRules.required && !this.validateRequired(value)) {
                errors[fieldName] = `${fieldName} is required`;
                return;
            }

            if (fieldRules.email && value && !this.validateEmail(value)) {
                errors[fieldName] = `Invalid email format`;
                return;
            }

            if (fieldRules.phone && value && !this.validatePhone(value)) {
                errors[fieldName] = `Invalid phone format`;
                return;
            }

            if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
                errors[fieldName] = `Minimum length is ${fieldRules.minLength}`;
                return;
            }

            if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
                errors[fieldName] = `Maximum length is ${fieldRules.maxLength}`;
                return;
            }

            if (fieldRules.min !== undefined && value && !this.validateNumber(value, fieldRules.min)) {
                errors[fieldName] = `Minimum value is ${fieldRules.min}`;
                return;
            }

            if (fieldRules.max !== undefined && value && !this.validateNumber(value, 0, fieldRules.max)) {
                errors[fieldName] = `Maximum value is ${fieldRules.max}`;
                return;
            }

            if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
                errors[fieldName] = `Invalid format`;
                return;
            }
        });

        return errors;
    }
}