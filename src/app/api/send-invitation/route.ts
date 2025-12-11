import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import {
  ParentInvitationEmail,
  TeacherInvitationEmail,
} from "@/components/features";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { toEmail, childName } = await request.json();

    if (!toEmail) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios." },
        { status: 400 }
      );
    }

    const subject =
      `¡Bienvenido a Nido` + (childName ? `, ${childName} te espera!` : "!");

    const reactComponent = (
      childName
        ? ParentInvitationEmail({ childName })
        : TeacherInvitationEmail()
    ) as React.ReactElement;

    const htmlBody = await render(reactComponent);

    const mailOptions = {
      from: `Nido <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully. Message ID: %s", info.messageId);

    return NextResponse.json(
      {
        success: true,
        message: "Correo enviado exitosamente.",
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Nodemailer Error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al enviar el correo.";
    return NextResponse.json(
      { error: "Error interno del servidor.", details: errorMessage },
      { status: 500 }
    );
  }
}
