"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Importa signIn de next-auth
import { Button } from "./Button";
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setErrorMessage('');
    setShowAlert(false);

    try {
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

      if (response.ok && data.access_token) {
        router.push('/dashboard');
      } else {
        setErrorMessage(data.error_description || 'Usuario o contraseña incorrectos.');
        setShowAlert(true);
      }
    } catch (error) {
      setErrorMessage('Hubo un error en la conexión. Inténtalo más tarde.');
      setShowAlert(true);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google'); // Autenticación con Google
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 relative">
        <div className="mx-4 flex w-full max-w-md flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg sm:mx-0">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <img src="/logo.jpg" alt="Logo" className="w-70 h-70 object-contain" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Entrar</h2>
              <Button
                className="text-sm font-semibold border border-gray-300 rounded-md py-1 px-3 hover:bg-gray-100"
                onClick={handleRegisterClick}
              >
                Registro
              </Button>
            </div>

            {showAlert && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-blue-600 text-white rounded-md shadow-lg flex items-center space-x-2 w-11/12 max-w-sm">
                <i className="fas fa-info-circle text-xl"></i>
                <span>{errorMessage}</span>
                <button onClick={() => setShowAlert(false)} className="ml-auto text-white hover:text-gray-200 focus:outline-none">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user text-gray-500"></i>
                </span>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-500"></i>
                </span>
                <input 
                  id="password" 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <Button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                Entrar
              </Button>
            </form>

            <div className="mt-4 flex justify-center">
              <Button
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={handleGoogleLogin}
              >
                Iniciar sesión con Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

