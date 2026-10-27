import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Logout from './pages/Logout'

// Provisórias: serão substituídas pelas telas reais de login e início
const Login = () => <h1>Login (provisório)</h1>
const Inicio = () => (
  <>
    <h1>Início (provisório)</h1>
    <Link to="/logout">Sair</Link>
  </>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  )
}