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

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    let nome = document.getElementById('nome').value.trim();
    let ddd = document.getElementById('ddd').value.trim();
    let telefone = document.getElementById('telefone').value.trim();
    let email = document.getElementById('email').value.trim();
    
    // Regex para validar e-mail
    let emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (nome === "") {
        alert("❌ Preencha seu nome completo!");
        return;
    }

    if (!/^\d{2}$/.test(ddd)) {
        alert("❌ O DDD deve conter exatamente **2 números**!");
        return;
    }

    if (!/^\d{5}-\d{4}$/.test(telefone)) {
        alert("❌ O telefone deve estar no formato **99999-9999**!");
        return;
    }

    if (!emailValido) {
        alert("❌ Insira um e-mail válido!");
        return;
    }

    alert("✅ Formulário enviado com sucesso!");
    this.submit();
});

// Formatar DDD (Apenas 2 números)
document.getElementById('ddd').addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '').slice(0, 2); // Remove não números e limita 2 dígitos
});

// Formatar Telefone (99999-9999)
document.getElementById('telefone').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d{0,4})/, '$1-$2');
    }
    e.target.value = value;
});
