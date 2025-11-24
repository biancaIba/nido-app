interface InviteEmailProps {
  toEmail: string;
  childName?: string;
}

/**
 * Llama a nuestra API Route para enviar una invitación al padre/tutor.
 */
export const sendEmailInvitation = async ({
  toEmail,
  childName,
}: InviteEmailProps) => {
  // Hacemos una petición a nuestra propia API
  const response = await fetch("/api/send-invitation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ toEmail, childName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Lanzamos un error para que la función que llama sepa que algo salió mal.
    throw new Error(
      errorData.error || "Fallo al enviar el correo de invitación."
    );
  }

  return await response.json();
};
