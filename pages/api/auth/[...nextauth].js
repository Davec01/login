// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Lógica para autenticar con FusionAuth
        const response = await fetch('http://localhost:9011/api/user/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.FUSIONAUTH_CLIENT_ID,
            client_secret: process.env.FUSIONAUTH_CLIENT_SECRET,
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password
          })
        });

        const user = await response.json();

        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});
