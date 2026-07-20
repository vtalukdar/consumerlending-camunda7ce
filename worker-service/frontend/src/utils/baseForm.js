import camundaApi from './camundaApi.js';
import { FormValidator } from './formValidator.js';

/**
 * Base class for all Camunda forms
 * Provides common functionality like task submission and validation
 */
export class BaseForm extends HTMLElement {
    constructor() {
        super();
        this.taskId = this.getTaskIdFromUrl();
        this.loading = false;
        this.errors = {};
        this.formData = {};
    }

    getTaskIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('taskId');
    }

    async loadTaskVariables() {
        try {
            if (!this.taskId) {
                console.warn('No taskId in URL');
                return {};
            }
            const variables = await camundaApi.getTaskVariables(this.taskId);
            return Object.fromEntries(
                Object.entries(variables).map(([key, val]) => [key, val.value])
            );
        } catch (error) {
            console.error('Error loading task variables:', error);
            return {};
        }
    }

    validateForm(rules) {
        this.errors = FormValidator.validate(this.formData, rules);
        this.renderErrors();
        return Object.keys(this.errors).length === 0;
    }

    renderErrors() {
        Object.entries(this.errors).forEach(([fieldName, errorMsg]) => {
            const errorEl = this.querySelector(`[data-error="${fieldName}"]`);
            if (errorEl) {
                errorEl.textContent = errorMsg;
                errorEl.style.display = 'block';
            }
        });
    }

    async submitForm(variables, rules = {}) {
        if (!this.validateForm(rules)) {
            return false;
        }

        this.loading = true;
        try {
            const allVariables = { ...variables, ...this.formData };
            await camundaApi.completeTask(this.taskId, allVariables);
            return true;
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form: ' + error.message);
            return false;
        } finally {
            this.loading = false;
        }
    }

    setFormData(data) {
        this.formData = { ...this.formData, ...data };
    }

    clearErrors() {
        this.errors = {};
        this.querySelectorAll('[data-error]').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
    }
}