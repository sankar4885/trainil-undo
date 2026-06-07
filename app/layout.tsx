import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trainil Undo? - Find Travel Partners on Indian Railways',
  description: 'Check live train status, delays, and connect with co-travelers on your journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-800 text-white mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p>© 2024 Trainil Undo? - Safe Travel Partner Discovery</p>
              <p className="text-sm mt-2 text-gray-400">Made for Indian Railways travelers</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}