import './input.css'

interface InputProps {
  label: string;
  id: string;
  type: string;
}

const Input: React.FC<InputProps> = ({ label, id, type }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input 
        type="email"
        name="email"
        id={id}
        required
      />
    </div>
  )
}

export default Input