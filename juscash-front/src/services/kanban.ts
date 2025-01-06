import { api } from "./api";

type CardFilter = {
  search: string;
  startDate: string;
  endDate: string;
  offset: number;
  limit: number;
};

type Task = {
  id: string;
  processNumber: string;
  authors: string;
  content: string;
  lawyers: string;
  defendant: string;
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
    const response = await api.get<KanbanResponse>("/publications", {
      params: {
        search: filters.search,
        dataInicio: filters.startDate,
        dataFim: filters.endDate,
        offset: filters.offset,
        limit: filters.limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do Kanban:", error);
    throw new Error("Não foi possível buscar os dados.");
  }
};
