import { LitElement, html, css } from 'lit';
import '@lion/form/define';
import '@lion/input/define';
import '@lion/textarea/define';
import '@lion/select/define';
import '@lion/button/define';
import axios from 'axios';

export class BaseForm extends LitElement {
    static styles = css`
    :host {
      --lion-primary-color: #003d82;
      --lion-secondary-color: #ff6b35;
      --lion-accent-color: #ffd23f;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: block;
      padding: 20px;
    }

    .form-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }

    .form-title {
      font-size: 28px;
      font-weight: 600;
      color: var(--lion-primary-color);
      margin-bottom: 10px;
      border-bottom: 3px solid var(--lion-secondary-color);
      padding-bottom: 15px;
    }

    .form-description {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .form-section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--lion-primary-color);
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .form-group small {
      display: block;
      color: #999;
      font-size: 12px;
      margin-top: 4px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 30px;
      justify-content: flex-end;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: var(--lion-primary-color);
      color: white;
    }

    .btn-primary:hover {
      background-color: #002a5f;
      box-shadow: 0 4px 12px rgba(0, 61, 130, 0.3);
    }

    .btn-secondary {
      background-color: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    .error-message {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
    }

    .success-message {
      background-color: #c8e6c9;
      color: #2e7d32;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-left: 4px solid #2e7d32;
    }

    .loading {
      opacity: 0.6;
      pointer-events: none;
    }
  `;

    constructor() {
        super();
        this.isLoading = false;
    }

    async submitForm(formData) {
        this.isLoading = true;
        try {
            const response = await axios.post('/api/form-submission', formData);
            return response.data;
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
}