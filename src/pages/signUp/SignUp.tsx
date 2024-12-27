import { useState } from "react"
import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import PasswordInput from "../../components/Input/PasswordInput"

const SignUp: React.FC = () => {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Submit")
  }

  return (
    <Form buttonValue="Criar conta" onClick={(e) => handleSubmit(e)}>
      <Input 
        label="Seu nome completo:" 
        id="name" 
        type="text"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)} 
      />
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
      <PasswordInput 
        label="Confirme sua senha" 
        id="confirmPassword"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)} 
      />
    </Form>
  )
}

export default SignUp