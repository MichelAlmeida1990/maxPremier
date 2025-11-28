import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Calendar, Users } from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/checklists', label: 'Checklists', icon: ClipboardList },
    { path: '/visits', label: 'Visitas', icon: Calendar },
    { path: '/clients', label: 'Clientes', icon: Users },
  ]

  const handleLinkClick = () => {
    // Fechar menu mobile ao clicar em um link
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 bg-white shadow-lg md:shadow-xl min-h-[calc(100vh-80px)] md:min-h-screen
          transform transition-transform duration-300 ease-in-out
          border-r border-gray-100
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        data-tour="sidebar"
      >
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-maxpremier-blue-bright to-[#00c4ff] text-white shadow-md scale-105'
                        : 'text-maxpremier-blue-dark hover:bg-gray-50 hover:scale-105 hover:shadow-sm'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-maxpremier-blue-dark'} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
