import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-maxpremier-blue-dark to-[#052a7a] text-white shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <img 
            src="/logo.jpg" 
            alt="MAXPREMIER" 
            className="h-8 sm:h-10 w-auto transition-transform group-hover:scale-105"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight">MAXPREMIER</span>
        </Link>
        
        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center space-x-1" data-tour="header-nav">
          <Link 
            to="/" 
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
          >
            Dashboard
          </Link>
          <Link 
            to="/checklists" 
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
          >
            Checklists
          </Link>
          <Link 
            to="/visits" 
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
          >
            Visitas
          </Link>
          <Link 
            to="/clients" 
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
          >
            Clientes
          </Link>
        </nav>

        {/* Botão Menu Mobile */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
    </header>
  )
}

