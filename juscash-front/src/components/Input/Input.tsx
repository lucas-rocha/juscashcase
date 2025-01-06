import './input.css'

interface InputProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({ label, id, type, value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input 
        type={type}
        name={id}
        id={id}
        required={true}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Input