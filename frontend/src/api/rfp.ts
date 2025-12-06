const BASE_URL = "https://procurement-app-backend.onrender.com";

import type { Rfp } from "../types";

export async function getAllRfps(): Promise<Rfp[]> {
    try {
        const res = await fetch(`${BASE_URL}/rfps`);

        if (!res.ok) {
            throw new Error("Failed to fetch RFPs");
        }

        const data = await res.json();
        return data as Rfp[];
    } catch (error) {
        console.error("getAllRfps error", error);
        throw error;
    }
}


export async function createRfp(input: {
    title: string;
    naturalLanguageInput: string;
}): Promise<Rfp> {
    try {
        const res = await fetch(`${BASE_URL}/rfps/from-text`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: input.title,
                naturalLanguageInput: input.naturalLanguageInput,
            }),
        });

        if (!res.ok) {
            // optional: parse error JSON if you want
            throw new Error("Failed to create RFP");
        }

        const data = await res.json();
        return data as Rfp;
    } catch (error) {
        console.error("createRfp error", error);
        throw error;
    }
}
