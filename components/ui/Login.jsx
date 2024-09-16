// components/ui/Login.jsx
"use client"; // Indica que este es un componente del cliente

import { Button } from "./Button";
import { Label } from "./Label";
import { Input } from "./Input";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Aquí envías los datos a FusionAuth
    const response = await fetch('http://localhost:9011/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_SECRET,
        grant_type: 'password',
        username: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      // Aquí manejas el redireccionamiento después de iniciar sesión correctamente
      router.push('/dashboard');
    } else {
      // Aquí manejas los errores de autenticación
      alert('Error al iniciar sesión');
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
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <Button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
