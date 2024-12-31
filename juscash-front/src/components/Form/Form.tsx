import { Link } from 'react-router-dom';
import './form.css'

interface FormProps {
  children: React.ReactNode;
  buttonValue: string;
  isLogin?: boolean;
  isCreate?: boolean;
  onClick: (e: React.FormEvent) => void;
}

const Form: React.FC<FormProps> = ({ children, buttonValue, onClick, isLogin, isCreate }) => {
  return (
    <div className="form-container">
      <div className="logo">
        <img src="./assets/logo.png" alt="Logo da JusCash" />
      </div>
      
      <form className="form">
        {children}
      </form>

      {isCreate && (
        <Link to="/login" className="signup-link">Já possui uma conta? Fazer o login</Link>
      )}

      <button type="submit" className="login-button" onClick={onClick}>
        {buttonValue}
      </button>

      {isLogin && (
        <Link to="/criar-conta" className="signup-link">Nao possui uma conta? Cadastra-se</Link>
      )}
    </div>
  )
}

export default Form