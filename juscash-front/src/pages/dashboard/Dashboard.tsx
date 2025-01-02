import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Kanban from "../../components/Kanban/Kanban";
import KanbanFilter from "../../components/KanbanFilter/KanbanFilter";
import "./dashboard.css";
import { getCardByFilter } from "../../services/kanban";
import CardModal from "../../components/CardModal/CardModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });
  const [kanbanData, setKanbanData] = useState({})
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null)

  useEffect(() => {
    // Buscar dados iniciais
    fetchFilteredData();
  }, []);

  const fetchFilteredData = async () => {
    try {
      const response = await getCardByFilter(filters);
      setKanbanData(response)
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    fetchFilteredData(); // Rebuscar dados com base nos filtros atualizados
  };

  const fetchTaskDetails = async (id: string) => {
    try {
      const response = await api.get(`/publications/${id}`);
      setSelectedTaskDetails(response.data); // Configura os detalhes da tarefa no estado
      setSelectedCard(id); // Mostra o modal
    } catch (error) {
      console.error("Erro ao buscar os detalhes:", error);
    }
  };

  const handleCardClick = (id: string) => {
    fetchTaskDetails(id)
  };

  return (
    <>
      {selectedCard && <CardModal onClose={() => setSelectedCard(null)}  taskDetails={selectedTaskDetails} />}
      <Header />
      <div className="dash__container">
        <div className="kanban-filter__container">
          <KanbanFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onFilterSubmit={handleFilterSubmit}
          />
        </div>
        <div className="kanban__container">
          <Kanban data={kanbanData} setKanbanData={setKanbanData} onCardClick={handleCardClick}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
