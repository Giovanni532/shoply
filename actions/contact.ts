"use server";
import { safeAction, ActionError } from "@/lib/safe-action";
import { contactSchema } from "@/validations/contact";

export const sendContactMessage = safeAction
    .schema(contactSchema)
    .action(async ({ parsedInput }) => {
        // Here you can forward to email provider / DB etc.
        try {
            // simulate processing
            const { name, email, message } = parsedInput;
            const at = new Date().toISOString();
            const summary = `Message reçu de ${name} <${email}> (${message.length} caractères)`;
            return { ok: true as const, received: { name, email, message }, at, summary };
        } catch (e) {
            throw new ActionError("CONTACT_FAILED");
        }
    });


