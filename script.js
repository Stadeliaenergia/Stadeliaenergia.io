document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('http://localhost:3000/enviar-email', {
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