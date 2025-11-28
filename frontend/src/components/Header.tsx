import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-maxpremier-blue-dark text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/logo.jpg" 
            alt="MAXPREMIER" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold">MAXPREMIER</span>
        </Link>
        <nav className="flex items-center space-x-6" data-tour="header-nav">
          <Link to="/" className="hover:text-maxpremier-blue-bright transition-colors">
            Dashboard
          </Link>
          <Link to="/checklists" className="hover:text-maxpremier-blue-bright transition-colors">
            Checklists
          </Link>
          <Link to="/visits" className="hover:text-maxpremier-blue-bright transition-colors">
            Visitas
          </Link>
          <Link to="/clients" className="hover:text-maxpremier-blue-bright transition-colors">
            Clientes
          </Link>
        </nav>
      </div>
    </header>
  )
}

