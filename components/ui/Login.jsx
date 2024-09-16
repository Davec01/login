// components/ui/Login.jsx
"use client";

import { Button } from "./Button";
import { Label } from "./Label";
import { Input } from "./Input";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
// components/ui/Login.jsx
import { auth } from '../../src/firebaseConfig'; // Ruta ajustada para llegar a firebaseConfig
 // Importa la configuración de Firebase

export default function Login() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirige al usuario después de iniciar sesión correctamente
      router.push('/dashboard');
    } catch (error) {
      // Maneja los errores de autenticación
      console.error('Error al iniciar sesión:', error);
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
