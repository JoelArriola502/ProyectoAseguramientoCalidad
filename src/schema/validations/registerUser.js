import { optional, z } from 'zod';

const registerValidations = z.object({
    nombre: z.string().min(2, "El nombre es obligatorio."),
    apellido: z.string().min(2, "El apellido es obligatorio."),
    Correo: z.string().email("Correo no válido.").min(1, "El correo es obligatorio."),
    Contrasena: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(255, "La contraseña es demasiado larga.")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
        .regex(/[0-9]/, "La contraseña debe contener al menos un número.")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial."),
    estado: z.string().optional(), // Este campo es opcional
    idRol: z.number().optional(),
});

export { registerValidations };
