import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    // Configuración del proveedor de Google
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),

    // Configuración del proveedor de credenciales (FusionAuth)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Petición al servidor de FusionAuth para autenticar al usuario
        const res = await fetch('http://localhost:9011/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_SECRET,
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password,
          }),
        });

        // Procesar la respuesta de FusionAuth
        const data = await res.json();
        if (res.ok && data.access_token) {
          return { id: data.userId, accessToken: data.access_token, email: data.email };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    // Manejo del token JWT
    async jwt({ token, account, profile }) {
      // Si el proveedor es Google, guarda el token de acceso y la información del perfil
      if (account && account.provider === 'google') {
        token.accessToken = account.access_token;
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },

    // Manejo de la sesión
    async session({ session, token }) {
      // Mantén la información del usuario y el token en la sesión
      session.user = { email: token.email, name: token.name };
      session.accessToken = token.accessToken;
      return session;
    },

    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        try {
          // 1. Verificar si el usuario ya existe en FusionAuth
          const checkUserRes = await fetch(`http://localhost:9011/api/user?email=${profile.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.NEXT_PUBLIC_FUSIONAUTH_API_KEY,
            },
          });
    
          const checkUserData = await checkUserRes.json();
    
          // 2. Si el usuario ya existe, omitir el registro
          if (checkUserRes.ok && checkUserData.user) {
            console.log('Usuario ya registrado en FusionAuth:', checkUserData.user);
            return '/dashboard';  // Usuario ya existe, proceder a redirigir al dashboard
          }
    
          // 3. Si el usuario no existe, proceder con el registro
          const res = await fetch('http://localhost:9011/api/user/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.NEXT_PUBLIC_FUSIONAUTH_API_KEY,
            },
            body: JSON.stringify({
              registration: {
                applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_APP_ID,
              },
              user: {
                email: profile.email,
                firstName: profile.given_name || profile.name?.split(' ')[0],
                lastName: profile.family_name || profile.name?.split(' ')[1] || '',
                password: 'TemporaryPassword123!',  // Contraseña temporal
              },
            }),
          });
    
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const responseData = await res.json();
            if (!res.ok) {
              console.error('Error al registrar el usuario en FusionAuth:', responseData);
              return false;
            }
          } else {
            console.error('Respuesta inesperada del servidor');
            return false;
          }
    
          // 4. Registro exitoso, redirigir al dashboard
          return '/dashboard';
    
        } catch (error) {
          console.error('Error en el callback signIn:', error);
          return false;
        }
      }
      return '/dashboard';  // Redirige al dashboard después de inicio de sesión exitoso
    },        
  },

  // Definir las rutas personalizadas de NextAuth.js
  pages: {
    signIn: '/login',  // Página personalizada de inicio de sesión
  },
});
