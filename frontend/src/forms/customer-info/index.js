/**
 * Customer Information Form - Web Component Wrapper
 * This is a lightweight wrapper around the vanilla HTML form for reusability
 */

class CustomerInfoForm extends HTMLElement {
  constructor() {
    super();
    this.formData = {
      fullName: "",
      email: "",
      phone: "",
      income: "",
      maritalStatus: "",
      numberOfChildren: "",
    };
    this.isSubmitting = false;
  }

  connectedCallback() {
    try {
      this.render();
    } catch (error) {
      console.error("Error loading form:", error);
      this.renderError("Failed to load form");
    }
  }

  getTaskIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("taskId");
  }

  render() {
    this.innerHTML = `
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">Customer Information</h1>
          <p class="form-subtitle">Enter your personal and financial details to proceed with your loan application</p>
        </div>

        <form id="customerForm">
          <!-- Personal Information Section -->
          <div class="form-section">
            <h2 class="form-section-title">Personal Information</h2>
            
            <div class="form-field">
              <label for="fullName">
                Full Name
                <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                placeholder="John Doe"
                value="${this.escapeHtml(this.formData.fullName)}"
                maxlength="100"
                required
              />
              <div class="error-message" data-error="fullName"></div>
            </div>

            <div class="form-row">
              <div class="form-field form-field-half">
                <label for="email">
                  Email Address
                  <span class="required">*</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="john@example.com"
                  value="${this.escapeHtml(this.formData.email)}"
                  maxlength="100"
                  required
                />
                <div class="error-message" data-error="email"></div>
              </div>

              <div class="form-field form-field-half">
                <label for="phone">
                  Phone Number
                  <span class="required">*</span>
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  placeholder="+31 6 12345678"
                  value="${this.escapeHtml(this.formData.phone)}"
                  maxlength="20"
                  required
                />
                <div class="error-message" data-error="phone"></div>
              </div>
            </div>
          </div>

          <!-- Family & Financial Information Section -->
          <div class="form-section">
            <h2 class="form-section-title">Family & Financial Information</h2>

            <div class="form-row">
              <div class="form-field form-field-half">
                <label for="maritalStatus">
                  Marital Status
                  <span class="required">*</span>
                </label>
                <select 
                  id="maritalStatus" 
                  name="maritalStatus"
                  required
                >
                  <option value="">-- Select Marital Status --</option>
                  <option value="single" ${this.formData.maritalStatus === "single" ? "selected" : ""}>Single</option>
                  <option value="married" ${this.formData.maritalStatus === "married" ? "selected" : ""}>Married</option>
                  <option value="divorced" ${this.formData.maritalStatus === "divorced" ? "selected" : ""}>Divorced</option>
                  <option value="widowed" ${this.formData.maritalStatus === "widowed" ? "selected" : ""}>Widowed</option>
                  <option value="domestic_partnership" ${this.formData.maritalStatus === "domestic_partnership" ? "selected" : ""}>Domestic Partnership</option>
                </select>
                <div class="error-message" data-error="maritalStatus"></div>
              </div>

              <div class="form-field form-field-half">
                <label for="numberOfChildren">
                  Number of Children
                  <span class="required">*</span>
                </label>
                <input 
                  type="number" 
                  id="numberOfChildren" 
                  name="numberOfChildren"
                  min="0"
                  max="20"
                  placeholder="0"
                  value="${this.formData.numberOfChildren}"
                  required
                />
                <div class="error-message" data-error="numberOfChildren"></div>
              </div>
            </div>

            <div class="form-field">
              <label for="income">
                Annual Income (€)
                <span class="required">*</span>
              </label>
              <input 
                type="number" 
                id="income" 
                name="income"
                placeholder="50000"
                value="${this.formData.income}"
                min="0"
                step="0.01"
                required
              />
              <small class="form-hint">Please enter your gross annual income</small>
              <div class="error-message" data-error="income"></div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-buttons">
            <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
            <button type="submit" class="btn-primary" id="submitBtn">
              <span id="submitText">Continue to Next Step</span>
              <span id="submitSpinner" class="spinner" style="display: none;"></span>
            </button>
          </div>
        </form>

        <div id="successMessage" class="success-container" style="display: none;">
          <div class="success-icon">✓</div>
          <p>Your information has been submitted successfully</p>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = this.querySelector("#customerForm");
    const submitBtn = this.querySelector("#submitBtn");
    const cancelBtn = this.querySelector("#cancelBtn");

    // Form input change handlers
    form.querySelectorAll("input, select").forEach((field) => {
      field.addEventListener("change", () => this.handleFieldChange(field));
      field.addEventListener("blur", () => this.validateField(field));
    });

    // Form submission
    form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Cancel button
    cancelBtn.addEventListener("click", () => this.handleCancel());

    // Prevent double submission
    submitBtn.addEventListener("click", () => {
      if (this.isSubmitting) {
        submitBtn.disabled = true;
      }
    });
  }

  handleFieldChange(field) {
    const fieldName = field.name;
    let value = field.value;

    // Special handling for number fields
    if (field.type === "number") {
      value = value ? parseFloat(value) : "";
    }

    this.formData[fieldName] = value;
    this.clearFieldError(fieldName);
  }

  validateField(field) {
    const fieldName = field.name;
    const rules = this.getValidationRules();
    const fieldRules = rules[fieldName];

    if (!fieldRules) return true;

    const errors = this.validateFormField(
      fieldName,
      this.formData[fieldName],
      fieldRules,
    );

    if (errors) {
      this.showFieldError(fieldName, errors);
      return false;
    } else {
      this.clearFieldError(fieldName);
      return true;
    }
  }

  validateFormField(fieldName, value, rules) {
    if (rules.required && !value) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (rules.email && value && !this.isValidEmail(value)) {
      return "Please enter a valid email address";
    }

    if (rules.phone && value && !this.isValidPhone(value)) {
      return "Please enter a valid phone number (minimum 9 digits)";
    }

    if (rules.minLength && value && value.toString().length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }

    if (
      rules.min !== undefined &&
      value !== "" &&
      parseFloat(value) < rules.min
    ) {
      return `Minimum value is ${rules.min}`;
    }

    if (
      rules.max !== undefined &&
      value !== "" &&
      parseFloat(value) > rules.max
    ) {
      return `Maximum value is ${rules.max}`;
    }

    return null;
  }

  getValidationRules() {
    return {
      fullName: {
        required: true,
        minLength: 2,
      },
      email: {
        required: true,
        email: true,
      },
      phone: {
        required: true,
        phone: true,
      },
      income: {
        required: true,
        min: 0,
      },
      maritalStatus: {
        required: true,
      },
      numberOfChildren: {
        required: true,
        min: 0,
        max: 20,
      },
    };
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, "").length >= 9;
  }

  getFieldLabel(fieldName) {
    const labels = {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      income: "Annual Income",
      maritalStatus: "Marital Status",
      numberOfChildren: "Number of Children",
    };
    return labels[fieldName] || fieldName;
  }

  showFieldError(fieldName, errorMsg) {
    const errorEl = this.querySelector(`[data-error="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.style.display = "block";
    }
  }

  clearFieldError(fieldName) {
    const errorEl = this.querySelector(`[data-error="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    const taskId = this.getTaskIdFromUrl();
    if (!taskId) {
      alert("Task ID not found. Please access the form from Camunda.");
      return;
    }

    // Validate all fields
    const form = this.querySelector("#customerForm");
    const rules = this.getValidationRules();
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const field = form.elements[fieldName];
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.scrollToFirstError();
      return;
    }

    // Show loading state
    this.isSubmitting = true;
    const submitBtn = this.querySelector("#submitBtn");
    const submitText = this.querySelector("#submitText");
    const submitSpinner = this.querySelector("#submitSpinner");

    submitBtn.disabled = true;
    submitText.style.display = "none";
    submitSpinner.style.display = "inline-block";

    try {
      // Prepare variables for Camunda
      const variables = {
        customerFullName: this.formData.fullName,
        customerEmail: this.formData.email,
        customerPhone: this.formData.phone,
        customerIncome: parseFloat(this.formData.income),
        customerMaritalStatus: this.formData.maritalStatus,
        customerNumberOfChildren: parseInt(this.formData.numberOfChildren),
      };

      // Submit to Camunda
      const response = await fetch(`/engine-rest/task/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variables: Object.fromEntries(
            Object.entries(variables).map(([key, value]) => [key, { value }])
          ),
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      this.showSuccessMessage();
      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = "/camunda";
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      this.showErrorMessage("Failed to submit form. Please try again.");
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitText.style.display = "inline";
      submitSpinner.style.display = "none";
    }
  }

  handleCancel() {
    if (
      confirm(
        "Are you sure you want to cancel? Your information will not be saved.",
      )
    ) {
      window.history.back();
    }
  }

  showSuccessMessage() {
    const form = this.querySelector("#customerForm");
    const successMsg = this.querySelector("#successMessage");

    form.style.display = "none";
    successMsg.style.display = "block";
  }

  showErrorMessage(message) {
    const errorEl = document.createElement("div");
    errorEl.className = "alert alert-error";
    errorEl.textContent = message;
    errorEl.style.marginBottom = "1rem";

    const form = this.querySelector("#customerForm");
    if (form && form.parentElement) {
      form.parentElement.insertBefore(errorEl, form);
    } else {
      this.insertBefore(errorEl, this.querySelector("#successMessage"));
    }

    setTimeout(() => {
      errorEl.remove();
    }, 5000);
  }

  renderError(message) {
    this.innerHTML = `
      <div class="form-container">
        <div class="alert alert-error">
          <strong>Error:</strong> ${message}
        </div>
        <button class="btn-secondary" onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }

  scrollToFirstError() {
    const firstError = this.querySelector(".error-message:not(:empty)");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define("lion-customer-info", CustomerInfoForm);
export default CustomerInfoForm;
