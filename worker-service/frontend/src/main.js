// Detect which form to load based on URL parameter
const urlParams = new URLSearchParams(window.location.search);
const formKey = urlParams.get('formKey');

async function loadForm() {
    try {
        const formName = formKey ? formKey.replace('embedded:app:forms/', '').replace('.html', '') : 'customer-info';

        const module = await import(`./forms/${formName}/index.js`);
        const FormComponent = module.default;

        const app = document.getElementById('app');
        const form = new FormComponent();
        app.appendChild(form);
    } catch (error) {
        console.error('Error loading form:', error);
        document.getElementById('app').innerHTML = '<p>Error loading form</p>';
    }
}

loadForm();