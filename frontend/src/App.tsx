import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Checklists from './pages/Checklists'
import Visits from './pages/Visits'
import Clients from './pages/Clients'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

