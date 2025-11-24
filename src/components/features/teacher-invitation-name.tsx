import * as React from "react";

export const TeacherInvitationEmail = () => (
  <div>
    <div>
      <h1>¡Bienvenido a Nido!</h1>
      <p></p>
      <p>
        Nos alegra que te unas a nuestra comunidad de educadores dedicados a
        brindar la mejor experiencia educativa a los niños.
      </p>
      <p>
        Para completar tu registro y configurar tu cuenta de maestro, haz clic
        en el siguiente enlace:
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
