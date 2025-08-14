'use client'
import { toast } from "sonner"; // or any toast lib you're using

export type TToastValidation = Record<string, string[]>;

export const toastValidation = async (errors: unknown) => {
    if (!errors) return
    // Case 1: The expected structure (Record<string, string[]>)
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
        const entries = Object.entries(errors as Record<string, unknown>);

        if (entries.length > 0) {
            entries.forEach(([field, messages]) => {
                if (Array.isArray(messages)) {
                    messages.forEach((msg) => {
                        if (typeof msg === "string") {
                            toast.error(`${msg}`);
                        } else {
                            toast.error(`${JSON.stringify(msg)}`);
                        }
                    });
                } else if (typeof messages === "string") {
                    toast.error(`${messages}`);
                } else {
                    toast.error(`${JSON.stringify(messages)}`);
                }
            });
            return;
        }
    }

    // Case 2: The errors is just a string
    if (typeof errors === "string") {
        toast.error(errors);
        return;
    }

    // Case 3: Array of strings
    if (Array.isArray(errors) && errors.every((e) => typeof e === "string")) {
        (errors as string[]).forEach((msg) => toast.error(msg));
        return;
    }

    // Case 4: Anything else — fallback
    toast.error("An unknown error occurred");
};