import { z } from 'zod';

const ValidationSession = z.object({

    Correo: z.string().min(1, "El correo es obligatorio."),
    Contrasena: z.string().min(1, "la contraseña es obligatoria").max(255),
});

export { ValidationSession };