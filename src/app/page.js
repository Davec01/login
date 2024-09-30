import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige a la página de login
  redirect('/login');
}
