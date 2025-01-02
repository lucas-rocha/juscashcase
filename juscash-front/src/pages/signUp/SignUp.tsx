import { useState } from "react"
import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import PasswordInput from "../../components/Input/PasswordInput"
import { api } from "../../services/api"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const SignUp: React.FC = () => {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post('users', {
        fullname,
        email,
        password,
      });
  
      if (response.status === 201) {
        const result = await Swal.fire({
          title: 'Usuário criado com sucesso!',
          text: 'Seu usuário foi criado com sucesso. Você será redirecionando para a tela de login.',
          confirmButtonText: 'Ir para o Login',
          icon: 'success', // Adicione um ícone de sucesso para um feedback visual claro.
        });
  
        if (result.isConfirmed) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao criar o usuário. Tente novamente mais tarde.',
        icon: 'error', // Adicione um ícone de erro para um feedback visual claro.
        confirmButtonText: 'Fechar',
      });
    }
  };
  

  return (
    <Form buttonValue="Criar conta" isCreate={true} onClick={(e) => handleSubmit(e)}>
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