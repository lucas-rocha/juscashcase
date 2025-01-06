import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Kanban from "../../components/Kanban/Kanban";
import KanbanFilter from "../../components/KanbanFilter/KanbanFilter";
import "./dashboard.css";
import { getCardByFilter } from "../../services/kanban";
import CardModal from "../../components/CardModal/CardModal";
import { api } from "../../services/api";

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });
  const [kanbanData, setKanbanData] = useState({});
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [offset, setOffset] = useState(0); // Estado para o offset de carregamento incremental
  const [loading, setLoading] = useState(false); // Controla o estado de carregamento

  useEffect(() => {
    fetchFilteredData(); // Buscar dados iniciais
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Verifique se o usuário chegou ao final da página
      const isAtBottom =
        document.documentElement.scrollHeight - window.scrollY <= window.innerHeight + 50;

      if (isAtBottom && !loading) {
        fetchFilteredData(); // Carregar mais dados quando o usuário chega ao final
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Limpar o ouvinte quando o componente for desmontado
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const fetchFilteredData = async () => {
    if (loading) return; // Evita fazer múltiplas requisições simultâneas

    setLoading(true); // Define como "carregando" para bloquear novas requisições

    try {
      const response = await getCardByFilter({ ...filters, offset, limit: 10 });
      setKanbanData((prevData) => {
        const newData = { ...prevData, ...response };
        return newData;
      });
      setOffset((prevOffset) => prevOffset + 10); // Atualiza o offset
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false); // Libera o bloqueio de carregamento
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    setOffset(0); // Resetar o offset ao aplicar novos filtros
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
    fetchTaskDetails(id);
  };

  return (
    <>
      {selectedCard && <CardModal onClose={() => setSelectedCard(null)} taskDetails={selectedTaskDetails} />}
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
          <Kanban data={kanbanData} setKanbanData={setKanbanData} onCardClick={handleCardClick} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
