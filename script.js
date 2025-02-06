document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('https://stadeliaenergia-io.onrender.com/enviar-email', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || '✅ Formulário enviado com sucesso!');
        this.reset();
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert(`❌ Erro ao enviar formulário: ${error.message}`);
    }
});

document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio imediato

    const nome = document.getElementById('nome').value.trim();
    const ddd = document.getElementById('ddd').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const fatura = document.getElementById('fatura'); // Input de arquivo

    // Expressões Regulares para validação
    const dddRegex = /^[0-9]{2}$/; // Apenas dois números
    const telefoneRegex = /^[0-9]{5}-[0-9]{4}$/; // Formato 99999-9999
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato de e-mail válido

    // Validações
    if (nome === "") {
        alert("⚠️ Preencha o campo Nome.");
        return;
    }
    if (!dddRegex.test(ddd)) {
        alert("⚠️ O DDD deve conter 2 números.");
        return;
    }
    if (!telefoneRegex.test(telefone)) {
        alert("⚠️ O telefone deve estar no formato 99999-9999.");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("⚠️ Insira um e-mail válido.");
        return;
    }
    if (fatura.files.length === 0) {
        alert("⚠️ É necessário anexar a fatura de energia.");
        return;
    }

    // Se todas as validações passaram, continua o envio
    const formData = new FormData(this);

    try {
        const response = await fetch('https://seu-servidor.com/enviar-email', { // Alterar para seu backend
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('✅ Formulário enviado com sucesso!');
            this.reset();
        } else {
            throw new Error(result.message || 'Erro ao enviar formulário.');
        }
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('❌ Erro ao enviar formulário. Tente novamente.');
    }
});
