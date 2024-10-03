"use client";

import { useState, useEffect } from 'react';

export default function Roles() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState({}); 
  
  const fetchUsers = async (query = '*') => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9011/api/user/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_FUSIONAUTH_API_KEY, 
        },
        body: JSON.stringify({
          search: {
            queryString: query,
          },
        }),
      });

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Maneja el cambio del rol seleccionado
  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles(prevRoles => ({
      ...prevRoles,
      [userId]: newRole,
    }));
  };

 
  const handleUpdateRole = async (userId) => {
    const newRole = selectedRoles[userId]; 

    if (!newRole) {
      alert('Por favor selecciona un rol antes de actualizar.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9011/api/user/registration/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_FUSIONAUTH_API_KEY, 
        },
        body: JSON.stringify({
          registration: {
            applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_APP_ID, 
            roles: [newRole], 
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de FusionAuth:', errorData);
        if (errorData.fieldErrors) {
          console.error('Detalles de los fieldErrors:', errorData.fieldErrors);
        }
        throw new Error('Error al actualizar el rol');
      }

      alert('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      alert('Hubo un problema al actualizar el rol');
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      fetchUsers(); // Si el campo de búsqueda está vacío, trae todos los usuarios
    } else {
      fetchUsers(searchQuery); // Realiza la búsqueda por correo
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuario</h1>

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Buscar por correo"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Buscar
        </button>
        <button
          onClick={() => fetchUsers()}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
        >
          Ver Todos
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol Actual</th>
              <th className="px-4 py-2">Cambiar Rol</th>
              <th className="px-4 py-2">Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    {user.roles && user.roles.length > 0 ? user.roles[0] : 'Sin rol'}
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={selectedRoles[user.id] || (user.roles && user.roles.length > 0 ? user.roles[0] : '')}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border rounded-md"
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Contratista">Contratista</option>
                      <option value="Director">Director</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleUpdateRole(user.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-2">No se encontraron usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
