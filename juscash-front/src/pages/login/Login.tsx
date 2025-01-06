import React, { useContext, useState } from 'react';
import Form from '../../components/Form/Form';
import Input from '../../components/Input/Input';
import PasswordInput from '../../components/Input/PasswordInput';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { validateEmail } from '../../utils/formValidate';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Formato de e-mail inválido.");
      return;
    }
    
    setError(null);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      if(axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 400) {
            setError("Credenciais inválidas. Verifique o e-mail e a senha e tente novamente.");
          } else {
            setError("Ocorreu um problema. Tente novamente mais tarde.");
          }
        } else {
          setError("Erro de conexão. Verifique sua internet e tente novamente.");
        }
      } else {
        setError("Ocorreu um problema desconhecido. Tente novamente mais tarde.");
      }
      }
  };

  return (
    <Form buttonValue="Login" isLogin={true} onClick={(e) => handleSubmit(e)}>
      <Input
        label="E-mail:"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && error.includes("e-mail") && <p style={{ color: 'red' }}>{error}</p>}

      <PasswordInput
        label="Senha"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      {error && !error.includes("e-mail") && <p style={{ color: 'red' }}>{error}</p>}
    </Form>
  );
};

export default Login;
