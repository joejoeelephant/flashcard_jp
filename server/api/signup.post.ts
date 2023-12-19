import {prismaClient} from '../utils/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET_KEY

const checkUserExist = async () => {
    try {
        const user = await prismaClient.user.findFirst()
        if(user) {
            throw 'user exist'
        }
    } catch (error) {
        throw JSON.stringify(error)
    }
}

export default defineEventHandler(async (event) => {
    
    const { email, password } = await readBody(event)

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existUser = await checkUserExist()
        // Create a new user in the database
        const user = await prismaClient.user.create({
          data: {
            email: email,
            passwordHash: hashedPassword,
          },
        });

        if (!jwtSecret) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Invalid JWT_SECRET_KEY.',
            })
        }

        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
            expiresIn: '36h', // Token expires in 36 hour
        });
    
        console.log("User created:", user);
        setCookie(event, 'token', token)
        
        // Return a success response
        return {
            statusCode: 200,
            statusMessage: 'Signup successful.',
            user: {
                id: user.id,
                email: user.email,
                token
            }
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(error),
        })
    }
})