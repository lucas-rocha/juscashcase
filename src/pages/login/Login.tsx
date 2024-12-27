import React, { useContext, useState } from 'react'
import Form from '../../components/Form/Form'
import Input from '../../components/Input/Input'
import PasswordInput from '../../components/Input/PasswordInput'
import { AuthContext } from '../../contexts/AuthContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await login({ email, password })
  }

  return (
    <Form buttonValue="Criar conta" onClick={(e) => handleSubmit(e)}>
      <Input 
        label="E-mail:" 
        id="email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
      />

      <PasswordInput 
        label="Senha" 
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Form>
  )
}

export default Login