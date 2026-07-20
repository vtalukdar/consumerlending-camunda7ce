import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { BaseForm } from '../base-form.js';

class CustomerInfoForm extends BaseForm {
    @property({ type: String }) processInstanceId = '';
    @property({ type: String }) taskId = '';
    @property({ type: Object }) formData = {};
    @property({ type: String }) errorMessage = '';
    @property({ type: String }) successMessage = '';

    static get is() {
        return 'customer-info-form';
    }

    constructor() {
        super();
        this.initFormData();
        this.extractProcessParams();
    }

    initFormData() {
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            income: '',
            maritalStatus: 'single',
            numberOfChildren: 0,
        };
    }

    extractProcessParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.processInstanceId = urlParams.get('processInstanceId');
        this.taskId = urlParams.get('taskId');
    }

    render() {
        return html`
      <div class="form-container ${this.isLoading ? 'loading' : ''}">
        <div class="form-title">Loan Application</div>
        <div class="form-description">
          Please provide your personal information to begin the lending application process.
        </div>

        ${this.successMessage ? html`<div class="success-message">${this.successMessage}</div>` : ''}
        ${this.errorMessage ? html`<div class="error-message">${this.errorMessage}</div>` : ''}

        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="section-title">Personal Information</div>

          <div class="form-group">
            <label for="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              class="lion-input"
              placeholder="Enter your full name"
              .value="${this.formData.fullName}"
              @input="${(e) => this.updateFormData('fullName', e.target.value)}"
              required
            />
            <small>Your legal full name as it appears on your ID</small>
          </div>

          <div class="form-group">
            <label for="email">Email Address *</label>
            <input
              id="email"
              type="email"
              class="lion-input"
              placeholder="Enter your email address"
              .value="${this.formData.email}"
              @input="${(e) => this.updateFormData('email', e.target.value)}"
              required
            />
            <small>We'll use this to send you updates about your application</small>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              class="lion-input"
              placeholder="Enter your phone number"
              .value="${this.formData.phone}"
              @input="${(e) => this.updateFormData('phone', e.target.value)}"
              required
            />
            <small>Include country code (e.g., +31612345678)</small>
          </div>
        </div>

        <!-- Financial Information Section -->
        <div class="form-section">
          <div class="section-title">Financial Information</div>

          <div class="form-group">
            <label for="income">Annual Income (€) *</label>
            <input
              id="income"
              type="number"
              class="lion-input"
              placeholder="Enter your annual income"
              .value="${this.formData.income}"
              @input="${(e) => this.updateFormData('income', e.target.value)}"
              min="0"
              step="1000"
              required
            />
            <small>Your gross annual income in Euros</small>
          </div>
        </div>

        <!-- Family Information Section -->
        <div class="form-section">
          <div class="section-title">Family Information</div>

          <div class="form-group">
            <label for="maritalStatus">Marital Status *</label>
            <select
              id="maritalStatus"
              class="lion-select"
              .value="${this.formData.maritalStatus}"
              @change="${(e) => this.updateFormData('maritalStatus', e.target.value)}"
              required
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="registered_partnership">Registered Partnership</option>
            </select>
