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
