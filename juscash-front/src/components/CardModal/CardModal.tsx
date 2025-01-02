import './cardModal.css'

type CardModalProps = {
  onClose: () => void;
  taskDetails: {
    processNumber: string;
    publicationDate: string;
    authors: string[];
    defendants: string[];
    lawyers: string[];
    grossValue: string;
    interestValue: string;
    attorneyFees: string;
    content: string;
  } | null;
};

const CardModal: React.FC<CardModalProps> = ({ onClose }) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
          <span className="sr-only">Close</span>
        </button>

        <div className="content-section">
          <h2 className="title">Publicação -</h2>
          <p className="text">
            Data de publicação no DJE:<br />
          </p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Autor:</h3>
          <ul className="list">
            {/* {taskDetails.authors.map((author, index) => (
              <li key={index}>{author}</li>
            ))} */}
            alsdlsd
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Réu:</h3>
          <ul className="list">
            {/* {taskDetails.defendants.map((defendant, index) => (
              <li key={index}>{defendant}</li>
            ))} */}
            asçdksad
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Advogado(os):</h3>
          <ul className="list">
            {/* {taskDetails.lawyers.map((lawyer, index) => (
              <li key={index}>{lawyer}</li>
            ))} */}
            askdçlaskd
          </ul>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor principal bruto/líquido</h3>
          <p className="text">asd</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor dos juros moratórios:</h3>
          <p className="text">ad</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Valor dos honorários advocatícios:</h3>
          <p className="text">asdasd</p>
        </div>

        <div className="content-section">
          <h3 className="subtitle">Conteúdo da Publicação:</h3>
          <p className="text">asdsdasd</p>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
