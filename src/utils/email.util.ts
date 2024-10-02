import nodemailer from "nodemailer";

interface EmailProps {
  assunto: string;
  destinatario: string;
  remetente: string;
  cc?: string[];
  bcc?: string[];
  corpo: string;
  anexos?: any;
}

const enviar = async (email: EmailProps) => {
  try {
    const transporter = obterTransport();
    await sender(transporter, email);
  } catch (erro) {
    console.log("Erro ao enviar email...", erro);
    throw erro;
  }
};

const enviarEmLote = async (emails: EmailProps[]) => {
  try {
    const transporter = obterTransport();
    for (const email of emails) {
      await sender(transporter, email);
    }
  } catch (erro) {
    console.log("Erro ao enviar email...", erro);
    throw erro;
  }
};

const sender = async (
  transporter,
  { assunto, destinatario, remetente, cc, bcc, corpo, anexos }: EmailProps
) => {
  await transporter.sendMail({
    subject: assunto,
    to: destinatario,
    from: remetente,
    bcc: bcc ? bcc : null,
    cc: cc ? [...cc] : null,
    attachments: anexos,
    html: corpo,
  });
};

const obterTransport = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true" ? true : false,
    tls: {
      rejectUnauthorized: Boolean(process.env.MAIL_TLS),
    },
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

export default {
  enviar,
  enviarEmLote,
};