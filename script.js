document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const errorMessage = document.getElementById('error-message');

    let isFetching = false;

    async function fetchAddress(cep) {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            errorMessage.textContent = 'CEP inválido! Digite a quantidade certa de números';
            clearFields();
            return;
        }

        try {
            isFetching = true;
            errorMessage.textContent = 'Consultando CEP...';
            errorMessage.style.color = '#555'; 

            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.erro) {
                errorMessage.textContent = 'CEP não encontrado!';
                errorMessage.style.color = '#dc3545';
                clearFields();
            } else {
                errorMessage.textContent = '';
                fillFields(data);
            }
        } catch (error) {
            errorMessage.textContent = 'Não foi possível consultar o CEP. Tente novamente.';
            errorMessage.style.color = '#dc3545';
            clearFields();
        } finally {
            isFetching = false;
        }
    }

    function fillFields(data) {
        logradouroInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        ufInput.value = data.uf || '';
    }

    function clearFields() {
        logradouroInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        ufInput.value = '';
    }

    cepInput.addEventListener('input', (e) => {
        const value = e.target.value;

        if (value === '') {
            errorMessage.textContent = '';
            clearFields();
            return;
        }

        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length === 8 && !isFetching) {
            fetchAddress(value);
        } else if (cleanValue.length !== 8 && cleanValue.length > 0) {
            if (cleanValue.length > 8) {
                errorMessage.textContent = 'CEP inválido! Digite a quantidade certa de números';
                errorMessage.style.color = '#dc3545';
                clearFields();
            }
        }
    });


    cepInput.addEventListener('blur', () => {
        const value = cepInput.value;
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length > 0 && cleanValue.length !== 8) {
            errorMessage.textContent = 'CEP inválido! Digite a quantidade certa de números';
            errorMessage.style.color = '#dc3545';
            clearFields();
        }
    });
});
