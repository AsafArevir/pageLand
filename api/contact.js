import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { name, email, phone, message } = req.body || {};

    if (!name || !message) {
        return res.status(400).json({
            success: false,
            message: "Nombre y mensaje son obligatorios"
        });
    }

    if (!email && !phone) {
        return res.status(400).json({
            success: false,
            message: "Debes proporcionar correo o teléfono"
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Formulario Web MiISP" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            replyTo: email || undefined,
            subject: "Nuevo mensaje desde el sitio web",
            text: `
Nombre: ${name}
Correo: ${email || "No proporcionado"}
Teléfono: ${phone || "No proporcionado"}

Mensaje:
${message}
      `
        });

        return res.status(200).json({
            success: true,
            message: "Mensaje enviado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al enviar el mensaje"
        });
    }
}
