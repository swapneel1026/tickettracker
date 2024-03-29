import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const prisma=new PrismaClient()
const authHandler= NextAuth({
  theme:{
    colorScheme:"dark"
  }
  ,
  adapter:PrismaAdapter(prisma),
  providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],
      session:{
        strategy:'jwt'
      },
    })

export { authHandler as GET, authHandler as POST }

