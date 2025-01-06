import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { formatDate, timeSinceUpdate } from '../../utils/KanbanUtils'
import './kanban.css';
import { LuClock4 } from "react-icons/lu";
import { IoIosCalendar } from "react-icons/io";

import { api } from "../../services/api";

type Task = {
  id: string;
  processNumber: string;
  authors: string;
  availabilityData: string;
  defendant: string;
  lawyers: string;
  content: string;
  updatedAt: string;
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
  data: KanbanBoard;
  setKanbanData: React.Dispatch<React.SetStateAction<KanbanBoard>>;
  onCardClick: (value: string) => void
};

const Kanban: React.FC<KanbanProps> = ({ data, setKanbanData, onCardClick }) => {

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
  
    if (!destination) {
      console.log("Item arrastado para fora da área!");
      return;
    }
  
    const sourceColumn = data[source.droppableId];
    const destColumn = data[destination.droppableId];
  
    // Verificação das movimentações válidas
    if (
      (sourceColumn.id === "novas" && destColumn.id !== "lidas") ||
      (sourceColumn.id === "lidas" && destColumn.id !== "enviada_adv") ||
      (sourceColumn.id === "enviada_adv" &&
        destColumn.id !== "lidas" &&
        destColumn.id !== "concluida") ||
      (sourceColumn.id === "concluida") // Publicações concluídas não podem ser movidas
    ) {
      alert("Movimento inválido!");
      return;
    }
  
    // Copiar as tarefas para evitar mutação direta
    const sourceTasks = [...sourceColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1); // Remove a tarefa da coluna de origem
  
    const destTasks = [...destColumn.tasks];
    destTasks.splice(destination.index, 0, movedTask); // Adiciona a tarefa na posição correta da coluna de destino
  
    const updatedData = {
      ...data,
      [sourceColumn.id]: { ...sourceColumn, tasks: sourceTasks },
      [destColumn.id]: { ...destColumn, tasks: destTasks },
    };
  
    // Atualizar frontend imediatamente
    setKanbanData(updatedData);
  
    try {
      // Atualizar o status no backend e pegar a nova data
      const response = await api.put(`/publications/${draggableId}`, {
        status: destColumn.id,
      });
  
      // Atualiza o updatedAt com o novo valor do backend
      const updatedTask = {
        ...movedTask,
        updatedAt: response.data.updatedAt, // Atualiza com a nova data
      };
  
      const updatedDestTasks = [...destColumn.tasks];
      updatedDestTasks[destination.index] = updatedTask; // Atualiza a tarefa na coluna de destino
  
      const finalData = {
        ...updatedData,
        [destColumn.id]: { ...destColumn, tasks: updatedDestTasks },
      };
  
      // Atualiza o estado final após a resposta do backend
      setKanbanData(finalData);
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
                  backgroundColor: "#f1f3f4",
                  borderRadius: "5px",
                  flex: 1,
                  minHeight: "300px",
                }}
              >
                {column.title === 'Publicações Concluídas' ? (
                  <>
                    <h4 className="kanban__title kanban__title--finish">
                      {column.title}
                      <span>{column.tasks.length}</span>
                    </h4>
                  </>
                ):
                  <h4 className="kanban__title">
                    {column.title}
                    <span>{column.tasks.length}</span>
                  </h4>
                }
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
                          onClick={() => onCardClick(task.id)}
                        >
                          <p>{task.processNumber}</p>
                          <div className="kanban__status">
                            <span><LuClock4 color="#80929a" />{timeSinceUpdate(task.updatedAt)}</span>
                            <span><IoIosCalendar color="#80929a" />{formatDate(task.availabilityData)}</span>
                          </div>
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
