"use client"; 

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleRolesClick = () => {
    router.push('/Roles'); 
  };

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-6">Bienvenido  Clectif</h1>
      <button 
        onClick={handleRolesClick} 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Gestión de Usuario
      </button>
    </div>
  );
}
