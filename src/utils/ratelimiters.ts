import rateLimit from "express-rate-limit";

const LoginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const uploadLimiter = rateLimit({

    windowMs: 24 * 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

const logLimiter = rateLimit({

    windowMs: 1 * 60 * 1000,
    max: 250,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

export { LoginLimiter, uploadLimiter, logLimiter }