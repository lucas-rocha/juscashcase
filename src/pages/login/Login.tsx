import React, { useState } from 'react'
import './login.css'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="login-container">
      <div className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" stroke="#2ECC71" strokeWidth="2"/>
          <path d="M12 6v6l4 4" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="logo-text">JusCash</span>
      </div>
      
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <div className="password-field">
            <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              name="password"
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {showPassword ? (
                  <path d="M12 4C7 4 2.73 7.11 1 12c1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8zm0 14c-3.79 0-7.17-2.13-8.82-6C4.83 8.13 8.21 6 12 6s7.17 2.13 8.82 6c-1.65 3.87-5.03 6-8.82 6z" fill="#999"/>
                ) : (
                  <path d="M12 4C7 4 2.73 7.11 1 12c1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8zm0 14c-3.79 0-7.17-2.13-8.82-6C4.83 8.13 8.21 6 12 6s7.17 2.13 8.82 6c-1.65 3.87-5.03 6-8.82 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#999"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <a href="#" className="signup-link">
        Nao possui uma conta? Cadastra-se
      </a>
    </div>
  )
}

export default Login