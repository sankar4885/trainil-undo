'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-train-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚂</span>
            <span className="font-bold text-xl">Trainil Undo?</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/search" className="hover:text-train-secondary transition">
              Search Train
            </Link>
            <Link href="/dashboard" className="hover:text-train-secondary transition">
              Dashboard
            </Link>
            <Link href="/login" className="bg-white text-train-primary px-4 py-1 rounded-lg hover:bg-gray-100 transition">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            <div className="flex flex-col space-y-3">
              <Link href="/search" className="hover:text-train-secondary transition">
                Search Train
              </Link>
              <Link href="/dashboard" className="hover:text-train-secondary transition">
                Dashboard
              </Link>
              <Link href="/login" className="bg-white text-train-primary px-4 py-1 rounded-lg text-center">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}