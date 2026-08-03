export const sanitizeUser = <T extends Record<string, any>>(user?: T | null): Omit<T, "password"> | null => {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
};
