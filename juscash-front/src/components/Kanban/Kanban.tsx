import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './kanban.css';
import { api } from "../../services/api";

type Task = {
  id: string;
  processNumber: string;
  authors: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type KanbanBoard = {
  [status: string]: Column;
};

type KanbanProps = {
  data: KanbanBoard; // Dados do Kanban passados como props
  setKanbanData: React.Dispatch<React.SetStateAction<KanbanBoard>>; // Função para atualizar o estado
};

const Kanban: React.FC<KanbanProps> = ({ data, setKanbanData }) => {

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    // Se não houver destino, significa que o item foi arrastado para fora da área
    if (!destination) {
      console.log("Item arrastado para fora da área!");
      return;
    }
    const sourceColumn = data[source.droppableId];
    const destColumn = data[destination.droppableId];

    // Validação de movimentação reversa
    if (
      (sourceColumn.id === "enviada_adv" && destColumn.id !== "lida") || 
      (sourceColumn.id === "lida" && destColumn.id !== "enviada_adv" && destColumn.id !== "concluida") || 
      (destColumn.id === "concluida" && sourceColumn.id !== "enviada_adv")
    ) {
      alert("Movimento inválido!");
      return;
    }

    // Copiar as tarefas das colunas de origem e destino para evitar mutação direta
    const sourceTasks = [...sourceColumn.tasks]; // Evitar mutação
    const [movedTask] = sourceTasks.splice(source.index, 1);  // Remove a tarefa da coluna de origem

    const destTasks = [...destColumn.tasks]; // Evitar mutação
    destTasks.splice(destination.index, 0, movedTask);  // Adiciona a tarefa na posição correta da coluna de destino

    // Atualizar a data com as colunas atualizadas
    const updatedData = {
      ...data,
      [sourceColumn.id]: { ...sourceColumn, tasks: sourceTasks },
      [destColumn.id]: { ...destColumn, tasks: destTasks },
    };

    // Atualizar o estado do kanban no componente pai (Dashboard)
    setKanbanData(updatedData);

    // Atualizar o status no backend
    try {
      await api.put(`/publications/${draggableId}`, { status: destColumn.id });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", justifyContent: "space-between" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.values(data).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: "#f4f4f4",
                  borderRadius: "5px",
                  flex: 1,
                  minHeight: "300px",
                }}
              >
                <h3 className="kanban__title">{column.title}</h3>
                <div className="kanban__body">
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            backgroundColor: "#fff",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <p><strong>Processo:</strong> {task.processNumber}</p>
                          <p><strong>Autor(es):</strong> {task.authors}</p>
                          <p><strong>Conteúdo:</strong> {task.content}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Kanban;
