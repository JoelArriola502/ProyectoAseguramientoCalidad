import { z } from 'zod';

const ValidationSession = z.object({

    Correo: z.string().email("Correo no válido.").min(1, "El correo es obligatorio."),
    Contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(255),
});

export { ValidationSession };