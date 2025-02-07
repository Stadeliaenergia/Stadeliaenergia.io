require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors());

// Middleware para permitir JSON e FormData
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Multer para upload de arquivos (limite de 10MB)
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Configuração do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.get('/', (req, res) => {
    res.send("🚀 API rodando com sucesso!");
});

// Rota para envio de e-mail
app.post('/enviar-email', upload.single('fatura'), async (req, res) => {
    console.log("🔹 Requisição recebida para enviar e-mail!");
    console.log("📩 Destinatário:", req.body.email);
    console.log("📄 Fatura anexada:", req.file ? req.file.originalname : "Nenhuma fatura anexada!");

    const { nome, ddd, telefone, email, mensagem } = req.body;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome || !ddd || !telefone || !email || !req.file) {
        return res.status(400).json({ error: "⚠️ Todos os campos são obrigatórios, incluindo a fatura." });
    }

    // Conteúdo do e-mail
    const msg = {
        to: process.env.VERIFIED_RECEIVER, // Seu e-mail para receber as informações
        from: process.env.VERIFIED_SENDER, // O e-mail verificado no SendGrid
        subject: '📩 Novo Formulário Recebido',
        text: `Nome: ${nome}\nDDD: ${ddd}\nTelefone: ${telefone}\nEmail: ${email}\n\n💬 Mensagem: ${mensagem || "Nenhuma mensagem informada."}`,
        attachments: req.file ? [{
            content: req.file.buffer.toString("base64"),
            filename: req.file.originalname,
            type: req.file.mimetype,
            disposition: "attachment"
        }] : []
    };

    try {
        await sgMail.send(msg);
        console.log("✅ E-mail enviado com sucesso!");
        res.json({ message: "✅ Formulário enviado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error);
        res.status(500).json({ error: "❌ Falha ao enviar e-mail. Tente novamente mais tarde." });
    }
});

// Mantém o servidor ativo no Render
setInterval(() => {
    console.log("⏳ Mantendo o servidor ativo...");
    fetch('https://stadeliaenergia-io.onrender.com/')
        .then(res => res.text())
        .then(console.log)
        .catch(console.error);
}, 14 * 60 * 1000); // Pinga a cada 14 minutos

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
