import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials?.username === "testuser" && credentials?.password === "testpassword") {
          return { 
            id: "1", 
            name: "Test User", 
            email: "testuser@example.com",
            username: "testuser"
          }
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.username = token.username
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }