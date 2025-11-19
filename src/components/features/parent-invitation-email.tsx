import * as React from "react";

interface ParentInvitationEmailProps {
  childName: string;
}

export const ParentInvitationEmail: React.FC<
  Readonly<ParentInvitationEmailProps>
> = ({ childName }) => (
  <div>
    <div>
      <h1>¡Bienvenido a Nido!</h1>
      <p>
        Has sido asignado como tutor de <strong>{childName}</strong>.
      </p>
      <p>
        Para ver el seguimiento diario, eventos y novedades, por favor descarga
        nuestra aplicación e inicia sesión con este correo electrónico.
      </p>
      <br />
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/ingresar`}>
        Ingresar a Nido
      </a>
    </div>
    <p>¡Te esperamos!</p>
    <p>
      <em>El equipo de Nido</em>
    </p>
  </div>
);
