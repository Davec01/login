// components/ui/Register.jsx
"use client"; // Indica que este es un componente del cliente

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Administrador');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Realiza la solicitud a FusionAuth
      const response = await fetch('http://localhost:9011/api/user/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `API-Key ${process.env.NEXT_PUBLIC_FUSIONAUTH_API_KEY}`,
        },
        body: JSON.stringify({
          registration: {
            applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_APP_ID,
            roles: [role],
          },
          user: {
            email: email,
            password: password,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Registro exitoso, ahora puedes iniciar sesión.');
      router.push('/');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario.');
    }
  };

  const handleLoginClick = () => {
    router.push('/');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="mx-4 flex w-full max-w-md flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg sm:mx-0">
        <h2 className="text-2xl font-bold text-center mb-4">Crear una cuenta</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          ¿Ya tienes una cuenta? <button onClick={handleLoginClick} className="text-indigo-600 hover:underline">Ingresar</button>
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Ingresa tu email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Selecciona el Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Administrador">Administrador</option>
              <option value="Contratista">Contratista</option>
              <option value="Empleador">Empleador</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
