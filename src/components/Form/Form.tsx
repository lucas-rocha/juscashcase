import './form.css'

interface FormProps {
  children: React.ReactNode;
  buttonValue: string;
  onClick: (e: React.FormEvent) => void;
}

const Form: React.FC<FormProps> = ({ children, buttonValue, onClick }) => {
  return (
    <div className="form-container">
      <div className="logo">
        <img src="./assets/logo.png" alt="Logo da JusCash" />
      </div>
      
      <form className="form">
        {children}
      </form>

      <button type="submit" className="login-button" onClick={onClick}>
        {buttonValue}
      </button>

      <a href="#" className="signup-link">
        Nao possui uma conta? Cadastra-se
      </a>
    </div>
  )
}

export default Form