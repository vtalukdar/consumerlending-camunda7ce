import { BaseForm } from '../../utils/baseForm.js';

class LoanPropositionsForm extends BaseForm {
    constructor() {
        super();
        this.propositions = [];
    }

    async connectedCallback() {
        try {
            const variables = await this.loadTaskVariables();
            this.propositions = variables.loanPropositions || [];
            this.render();
        } catch (error) {
            console.error('Error loading propositions:', error);
        }
    }

    render() {
        this.innerHTML = `
      <div class="form-container">
        <h1 class="form-title">Loan Propositions</h1>
        <p>Review available loan propositions and select your preferred option:</p>
        
        <div class="propositions-list">
          ${this.propositions.map((prop, index) => `
            <div class="proposition-card" data-index="${index}">
              <h3>Proposition ${index + 1}</h3>
              <div class="prop-details">
                <p><strong>Loan Amount:</strong> €${prop.amount.toFixed(2)}</p>
                <p><strong>Interest Rate:</strong> ${prop.rate}%</p>
                <p><strong>Term:</strong> ${prop.term} months</p>
                <p><strong>Monthly Payment:</strong> €${prop.monthlyPayment.toFixed(2)}</p>
              </div>
              <button class="btn-primary select-btn" data-index="${index}">
                Select this proposition
              </button>
            </div>
          `).join('')}
        </div>

        <div class="form-buttons">
          <button class="btn-secondary" id="backBtn">Back</button>
        </div>
      </div>
    `;

        this.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectProposition(parseInt(btn.dataset.index)));
        });

        this.querySelector('#backBtn').addEventListener('click', () => window.history.back());
    }

    async selectProposition(index) {
        const selected = this.propositions[index];
        const variables = {
            selectedProposition: JSON.stringify(selected),
            selectedPropositionAmount: selected.amount,
            selectedPropositionRate: selected.rate,
            selectedPropositionTerm: selected.term
        };

        const success = await this.submitForm(variables);
        if (success) {
            alert('Proposition selected successfully!');
        }
    }
}

customElements.define('lion-loan-propositions', LoanPropositionsForm);
export default LoanPropositionsForm;