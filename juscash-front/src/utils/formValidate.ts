export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula.";
  if (!/[a-z]/.test(password)) return "A senha deve conter pelo menos uma letra minúscula.";
  if (!/\d/.test(password)) return "A senha deve conter pelo menos um número.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "A senha deve conter pelo menos um caractere especial.";
  return null;
}