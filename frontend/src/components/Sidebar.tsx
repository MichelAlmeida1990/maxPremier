import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Calendar, Users } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/checklists', label: 'Checklists', icon: ClipboardList },
    { path: '/visits', label: 'Visitas', icon: Calendar },
    { path: '/clients', label: 'Clientes', icon: Users },
  ]

  return (
    <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-80px)]" data-tour="sidebar">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-maxpremier-blue-bright text-white'
                      : 'text-maxpremier-blue-dark hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

