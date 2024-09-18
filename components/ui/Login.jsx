// components/ui/Login.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "./Button";
import { Label } from "./Label";
import { Input } from "./Input";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'password',
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
          username: email,
          password: password,
          scope: 'openid profile email',
          audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
          connection: 'Username-Password-Authentication' // Añade esta línea para especificar la conexión
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        router.push('/dashboard');
      } else {
        console.error('Error al iniciar sesión:', data.error, data.error_description);
        alert('Error al iniciar sesión: ' + data.error_description);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      alert('Error en el inicio de sesión.');
    }
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="mx-4 flex w-full max-w-md flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg sm:mx-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Entrar</h2>
            <Button 
              className="text-sm font-semibold border border-gray-300 rounded-md py-1 px-3 hover:bg-gray-100" 
              onClick={handleRegisterClick}
            >
              Registro
            </Button>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
