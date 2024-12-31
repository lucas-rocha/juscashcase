import { useAuth } from '../../hooks/useAuth'
import './header.css'

const Header: React.FC = () => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="header">
      <img src="./assets/logo-dash.png" alt="Logo da JusCash" className="header__logo" />
      <div className="header__actions" onClick={handleLogout}>
        <img src="./assets/logout-icon.png" alt="Sair" />
        <span>Sair</span>
      </div>
    </div>
  )
}

export default Header