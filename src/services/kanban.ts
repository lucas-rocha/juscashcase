import { api } from "./api";

type CardFilter = {
  search: string;
  startDate: string;
  endDate: string;
};

type Task = {
  id: string;
  processNumber: string;
  authors: string;
  content: string;
};

type KanbanResponse = {
  data: {
    [key: string]: {
      title: string;
      tasks: Task[];
    };
  };
};

export const getCardByFilter = async (filters: CardFilter): Promise<KanbanResponse> => {
  try {
    const response = await api.get<KanbanResponse>('/publications', {
      params: {
        search: filters.search,
        dataInicio: filters.startDate,
        dataFim: filters.endDate,
        offset: 0,
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do Kanban:", error);
    throw new Error("Não foi possível buscar os dados.");
  }
};
