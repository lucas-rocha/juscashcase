import './cardModal.css'

type CardModalProps = {
  onClose: () => void;
  taskDetails: {
    processNumber: string;
    availabilityData: string;
    authors: string[];
    defendants: string[];
    lawyers: string[];
    interestValue: string;
    principalValue: string;
    attorneyFees: string;
    content: string;
  } | null;
};

const CardModal: React.FC<CardModalProps> = ({ onClose, taskDetails }) => {
  const date = new Date(taskDetails?.availabilityData || '');
  const formattedDate = date.toLocaleDateString('pt-BR');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
          <span className="sr-only">Close</span>
        </button>

        <div className="content-section">
          <h2 className="title">Publicação - {taskDetails?.processNumber}</h2>
          <p className="text">
            Data de publicação no DJE:<br />
            {formattedDate}
          </p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Autor:</h3>
          <ul className="list">
            {taskDetails?.authors}
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Réu:</h3>
          <ul className="list">
            Ainda não tem
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Advogado(os):</h3>
          <ul className="list">
          {taskDetails?.lawyers}
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor principal bruto/líquido</h3>
          <p className="text">{taskDetails?.principalValue}</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor dos juros moratórios:</h3>
          <p className="text">{taskDetails?.interestValue}</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor dos honorários advocatícios:</h3>
          <p className="text">{taskDetails?.attorneyFees}</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Conteúdo da Publicação:</h3>
          <p className="text">{taskDetails?.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
