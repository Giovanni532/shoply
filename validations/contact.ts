import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(2, { message: "nameMin" }),
    email: z.string().email({ message: "emailInvalid" }),
    message: z.string().min(10, { message: "messageMin" }),
});


