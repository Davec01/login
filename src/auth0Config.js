// src/auth0Config.js
export const auth0Config = {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: "http://localhost:3000/api/auth/callback",
    },
  };
  