import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(2, { message: "nameMin" }).max(120),
    email: z.string().email({ message: "emailInvalid" }),
    message: z.string().min(10, { message: "messageMin" }).max(5000),
});


