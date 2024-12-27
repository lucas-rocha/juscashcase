import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Kanban from "../../components/Kanban/Kanban";
import KanbanFilter from "../../components/KanbanFilter/KanbanFilter";
import "./dashboard.css";
import { getCardByFilter } from "../../services/kanban";

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });

  const [kanbanData, setKanbanData] = useState({})

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

  return (
    <>
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
          <Kanban data={kanbanData} setKanbanData={setKanbanData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
