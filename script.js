document.getElementById('fatura').addEventListener('change', function () {
    let mensagemFatura = document.getElementById('mensagem-fatura');
    let faturaContainer = document.getElementById('faturaContainer');

    if (this.files.length > 0) {
        mensagemFatura.textContent = this.files[0].name;
        faturaContainer.style.display = "flex"; // Exibe a mensagem
    } else {
        faturaContainer.style.display = "none"; // Oculta caso não haja arquivo
    }
});

// Remover fatura
document.getElementById('removerFatura').addEventListener('click', function () {
    let faturaInput = document.getElementById('fatura');
    let faturaContainer = document.getElementById('faturaContainer');

    faturaInput.value = ""; // Limpa o input
    faturaContainer.style.display = "none"; // Esconde o aviso
});


document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio imediato

    const nome = document.getElementById('nome').value.trim();
    const ddd = document.getElementById('ddd').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const fatura = document.getElementById('fatura'); // Input de arquivo
    const botaoEnviar = document.getElementById('botao-enviar'); // Botão de envio
    const avisoStatus = document.getElementById('aviso-status'); // Elemento de aviso

    // Expressões Regulares para validação
    const dddRegex = /^[0-9]{2}$/; // Apenas dois números
    const telefoneRegex = /^[0-9]{5}-[0-9]{4}$/; // Formato 99999-9999
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato de e-mail válido

    let formularioValido = true; // Flag de controle

    // Validações
    if (nome === "") {
        alert("⚠️ Preencha o campo Nome.");
        formularioValido = false;
    }
    if (!dddRegex.test(ddd)) {
        alert("⚠️ O DDD deve conter 2 números.");
        formularioValido = false;
    }
    if (!telefoneRegex.test(telefone)) {
        alert("⚠️ O telefone está incompleto.");
        formularioValido = false;
    }
    if (!emailRegex.test(email)) {
        alert("⚠️ Insira um e-mail válido.");
        formularioValido = false;
    }
    if (fatura.files.length === 0) {
        alert("⚠️ É necessário anexar a fatura de energia.");
        formularioValido = false;
    }

    // Se qualquer validação falhou, impede o envio
    if (!formularioValido) {
        return;
    }

    // Mostra aviso de envio e desativa o botão
    avisoStatus.textContent = "⏳ Enviando o formulário, aguarde...";
    avisoStatus.style.display = "block";
    botaoEnviar.disabled = true;
    botaoEnviar.style.opacity = "0.6"; // Dá um efeito visual de desabilitado

    // Se chegou aqui, significa que todas as validações passaram, então envia
    const formData = new FormData(this);

    try {
        const response = await fetch('https://stadeliaenergia-io.onrender.com/enviar-email', { // URL correta do backend
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        avisoStatus.textContent = "✅ Formulário enviado com sucesso!";
        avisoStatus.style.color = "green";

        this.reset(); // Limpa o formulário após o envio

        // Esconde o aviso de fatura anexada
        document.getElementById('faturaContainer').style.display = "none"; 

    } catch (error) {
        console.error('Erro ao enviar:', error);
        avisoStatus.textContent = "❌ Erro ao enviar o formulário. Tente novamente.";
        avisoStatus.style.color = "red";
    } finally {
        // Reativa o botão de envio após a resposta do servidor
        botaoEnviar.disabled = false;
        botaoEnviar.style.opacity = "1"; // Retorna ao estado normal
    }
});
