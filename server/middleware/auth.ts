import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET_KEY;

interface DecodedToken extends JwtPayload {
    id: string;
    email: string;
}

const EXCLUDED_PATHS = ['/api/login', '/login', '/signup'];

function getTokenFromCookie(event: any) {
    return getCookie(event, 'token') || "";
}

function verifyToken(token: string) {
    if (!jwtSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Invalid JWT_SECRET_KEY.',
        });
    }
    return jwt.verify(token, jwtSecret);
}

export default defineEventHandler((event) => {
    if (EXCLUDED_PATHS.includes(event.path)) return;

    const token = getTokenFromCookie(event);
    if (!token) {
        event.context.error = {
            statusCode: 403,
            statusMessage: 'Authentication token missing.',
        }
        return;
    }

    try {
        const decodedToken = verifyToken(token);
        event.context.auth = { user: decodedToken };

    } catch (error) {
        // setCookie(event, 'token', '')
        event.context.error = {
            statusCode: 403,
            statusMessage: 'Invalid authentication token.',
        }
    }
});
