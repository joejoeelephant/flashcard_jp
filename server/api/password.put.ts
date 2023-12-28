import {prismaClient} from '../utils/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET_KEY

export default defineEventHandler(async (event) => {
    if(event.context.error) {
        throw createError(event.context.error)
    }

    const { password } = await readBody(event)

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Create a new user in the database
        const user  = await prismaClient.user.findFirst()
        if(!user) {
            throw "user not existed"
        }
        const updateResponse = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordHash: hashedPassword,
            },
        });
        
        // Return a success response
        return {
            statusCode: 200,
            statusMessage: 'password updated successful.'
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        })
    }
})