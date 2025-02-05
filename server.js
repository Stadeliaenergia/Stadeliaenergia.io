const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Render define automaticamente a porta

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configuração do CORS
app.use(cors());
app.use(express.json());

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/enviar-email', upload.single('fatura'), async (req, res) => {
    console.log("🚀 Recebendo requisição no backend...");

    try {
        const { nome, ddd, telefone, email } = req.body;

        if (!nome || !ddd || !telefone || !email || !req.file) {
            console.error("⚠️ Erro: Campos obrigatórios faltando!");
            return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
        }

        console.log(`📩 Enviando e-mail para: ${email}`);

        // Configurar e-mail
        const msg = {
            to: process.env.VERIFIED_RECEIVER, // Substitua pelo seu email real
            from: process.env.VERIFIED_SENDER, // Verifique se esse email está validado no SendGrid
            subject: 'Novo Cliente - Formulário de Economia',
            text: `Nome: ${nome}\nDDD: ${ddd}\nTelefone: ${telefone}\nEmail: ${email}`,
            attachments: [
                {
                    content: req.file.buffer.toString("base64"),
                    filename: req.file.originalname,
                    type: req.file.mimetype,
                    disposition: "attachment"
                }
            ]
        };

        await sgMail.send(msg);
        console.log("✅ E-mail enviado com sucesso!");

        res.status(200).json({ message: 'E-mail enviado com sucesso!' });

    } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error);
        res.status(500).json({ message: 'Erro ao enviar e-mail' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});