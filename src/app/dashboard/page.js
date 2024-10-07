"use client";

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';  // Importa signOut de NextAuth

export default function Dashboard() {
  const router = useRouter();

  const handleRolesClick = () => {
    router.push('/Roles'); 
  };

  const handleLogoutClick = () => {
    signOut({ callbackUrl: '/' });  // Redirige al usuario a la página de inicio después de cerrar sesión
  };

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-6">Bienvenido  Clectif</h1>
      
      <button 
        onClick={handleRolesClick} 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mb-4">
        Gestión de Usuario
      </button>

      <button 
        onClick={handleLogoutClick}  // Botón para cerrar sesión
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">
        Cerrar Sesión
      </button>
    </div>
  );
}
