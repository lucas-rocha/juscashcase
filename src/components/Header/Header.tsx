import './header.css'

const Header: React.FC = () => {
  return (
    <div className="header">
      <img src="./assets/logo-dash.png" alt="Logo da JusCash" className="header__logo" />
      <div className="header__actions">
        <img src="./assets/logout-icon.png" alt="Sair" />
        <span>Sair</span>
      </div>
    </div>
  )
}

export default Header