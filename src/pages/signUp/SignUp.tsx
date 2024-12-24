import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import PasswordInput from "../../components/Input/PasswordInput"

const SignUp: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Submit")
  }

  return (
    <Form buttonValue="Criar conta" onClick={(e) => handleSubmit(e)}>
      <Input label="Seu nome completo:" id="name" type="text" />
      <Input label="E-mail:" id="email" type="email" />
      <PasswordInput label="Senha" id="password" />
      <PasswordInput label="Confirme sua senha" id="confirmPassword" />
    </Form>
  )
}

export default SignUp