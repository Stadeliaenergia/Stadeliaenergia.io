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

document.addEventListener("DOMContentLoaded", function () {
    const botaoEnviar = document.getElementById('botao-enviar');
    const avisoStatus = document.getElementById('aviso-status'); // Elemento de aviso
    const faturaInput = document.getElementById('fatura');
    const faturaContainer = document.getElementById('faturaContainer');
    const mensagemFatura = document.getElementById('mensagem-fatura');
    const removerFatura = document.getElementById('removerFatura');

    if (!botaoEnviar) {
        console.error("❌ Erro: O botão de envio não foi encontrado no DOM.");
        return;
    }

    // Exibir nome do arquivo anexado
    faturaInput.addEventListener('change', function () {
        if (this.files.length > 0) {
            mensagemFatura.textContent = this.files[0].name;
            faturaContainer.style.display = "flex";
        } else {
            faturaContainer.style.display = "none";
        }
    });

    // Remover fatura manualmente
    removerFatura.addEventListener('click', function () {
        faturaInput.value = "";
        faturaContainer.style.display = "none";
    });

    document.getElementById('formulario').addEventListener('submit', async function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const ddd = document.getElementById('ddd').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim(); // Campo de dúvidas

        // Expressões Regulares para validação
        const dddRegex = /^[0-9]{2}$/;
        const telefoneRegex = /^[0-9]{5}-[0-9]{4}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let formularioValido = true;

        if (nome === "") {
            alert("⚠️ Preencha o campo Nome.");
            formularioValido = false;
        }
        if (!dddRegex.test(ddd)) {
            alert("⚠️ O DDD deve conter 2 números.");
            formularioValido = false;
        }
        if (!telefoneRegex.test(telefone)) {
            alert("⚠️ O telefone deve estar no formato 99999-9999.");
            formularioValido = false;
        }
        if (!emailRegex.test(email)) {
            alert("⚠️ Insira um e-mail válido.");
            formularioValido = false;
        }
        if (faturaInput.files.length === 0) {
            alert("⚠️ É necessário anexar a fatura de energia.");
            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        // Mostra aviso de envio e desativa o botão
        avisoStatus.textContent = "⏳ Enviando o formulário, aguarde...";
        avisoStatus.style.display = "block";
        botaoEnviar.disabled = true;
        botaoEnviar.style.opacity = "0.6";

        const formData = new FormData(this);
        formData.append('mensagem', mensagem); // Adiciona a mensagem ao envio

        try {
            const response = await fetch('https://stadeliaenergia-io.onrender.com/enviar-email', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            avisoStatus.textContent = "✅ Formulário enviado com sucesso!";
            avisoStatus.style.color = "green";
            this.reset();

            // Remover fatura automaticamente após o envio
            faturaInput.value = "";
            faturaContainer.style.display = "none";

        } catch (error) {
            console.error('Erro ao enviar:', error);
            avisoStatus.textContent = "❌ Erro ao enviar o formulário. Tente novamente.";
            avisoStatus.style.color = "red";
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.style.opacity = "1";
        }
    });
});
