import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'
import './Logout.css'

export default function Logout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="logout-page">
      <div className="logout-card">
        <h1>Sair do sistema</h1>
        <p>Tem certeza que deseja encerrar sua sessão?</p>

        <div className="logout-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </div>
    </main>
  )
}