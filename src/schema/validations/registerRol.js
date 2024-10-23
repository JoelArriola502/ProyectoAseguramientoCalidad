import { z } from 'zod'
export const validationRol = z.object({
    nombreRol: z.string().min(1, 'El rol es obligatiro'),
    idUsuarios: z.number().min(1, 'El id del usuarios es obligatiro'),
})