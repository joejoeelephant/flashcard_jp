import { prismaClient } from '../utils/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET_KEY

export default defineEventHandler(async (event) => {
    const { answer } = await readBody(event);
    if(!answer) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid answer',
        })
    }

    // Find the user in the database by email
    const user = await prismaClient.user.findUnique({
        where: {
            id: 1
        }
    });

    // If user not found, return error response
    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found.',
        })
    }

    // Check if the provided password matches the one in the database
    const isValidPassword = await bcrypt.compare(answer, user.securityAnswer);

    // If password is incorrect, return error response
    if (!isValidPassword) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials.',
        })
    }

    // Here, you would typically generate a JWT or a session cookie
    // and return it to the client

    if (!jwtSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Invalid JWT_SECRET_KEY.',
        })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
        expiresIn: '36h', // Token expires in 36 hour
    });
    
    setCookie(event, 'token', token)
    return {
        statusCode: 200,
        statusMessage: 'Answer successful.',
        user: {
            id: user.id,
            email: user.email,
            token
            // Do not return password hash or other sensitive data!
        }
    }
});
