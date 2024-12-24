import React from 'react'
import Form from '../../components/Form/Form'
import Input from '../../components/Input/Input'
import PasswordInput from '../../components/Input/PasswordInput'

const Login: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Submit")
  }

  return (
    <Form buttonValue="Criar conta" onClick={(e) => handleSubmit(e)}>
      <Input label="E-mail:" id="email" type="email" />
      <PasswordInput label="Senha" id="password" />
    </Form>
  )
}

export default Login