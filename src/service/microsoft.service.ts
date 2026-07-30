import jwt from "jsonwebtoken"
export interface MicrosoftProfile {
    oid: string;
    email: string;
    name: string;
}

export async function verifyMicrosoftToken(
    token: string
) {
    const payload = jwt.decode(token) as Record<string, any> | null;
    return payload;
}