import { formatDate } from '../../utils/KanbanUtils';
import './cardModal.css'

type CardModalProps = {
  onClose: () => void;
  taskDetails: {
    processNumber: string;
    availabilityData: string;
    authors: string;
    defendants: string;
    lawyers: string;
    interestValue: string;
    principalValue: string;
    attorneyFees: string;
    content: string;
  } | null;
};

const CardModal: React.FC<CardModalProps> = ({ onClose, taskDetails }) => {
  const showField = (value: string | undefined) => (value ? value : "N/A");

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay"  onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
          <span className="sr-only">Close</span>
        </button>

        <div className="content-section">
          <h2 className="title">Publicação - {taskDetails?.processNumber}</h2>
          <p className="text">
            Data de publicação no DJE:<br />
            {formatDate(taskDetails?.availabilityData)}
          </p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Autor:</h3>
          <ul className="list">
            {showField(taskDetails?.authors)}
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Réu:</h3>
          <ul className="list">
            {showField(taskDetails?.defendants)}
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Advogado(os):</h3>
          <ul className="list">
          {showField(taskDetails?.lawyers)}
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor principal bruto/líquido</h3>
          <p className="text">{showField(taskDetails?.principalValue)}</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor dos juros moratórios:</h3>
          <p className="text">{showField(taskDetails?.interestValue)}</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor dos honorários advocatícios:</h3>
          <p className="text">{showField(taskDetails?.attorneyFees)}</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Conteúdo da Publicação:</h3>
          <p className="text">{showField(taskDetails?.content)}</p>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
