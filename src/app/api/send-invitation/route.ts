import { ParentInvitationEmail } from "@/components/features";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { toEmail, childName } = await request.json();

    const { data, error } = await resend.emails.send({
      // Asegúrate de que esta línea esté usando el dominio de onboarding.
      from: "Nido <onboarding@resend.dev>",
      to: [toEmail],
      subject: `¡Bienvenido a Nido, ${childName} te espera!`,
      react: ParentInvitationEmail({ childName }) as React.JSX.Element,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
