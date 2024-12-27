import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Definindo tipos para as tarefas e colunas
interface Task {
  id: string;
  processNumber: string;
  authors: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// Definindo um tipo para o estado de colunas
type Columns = {
  [key: string]: Column;
};

const Kanban: React.FC = () => {
  const [columns, setColumns] = useState<Columns>({
    "nova": { id: "nova", title: "Publicações Novas", tasks: [
      { id: "task1", processNumber: "12345", authors: "Autor 1", content: "Conteúdo 1" },
      { id: "task2", processNumber: "67890", authors: "Autor 2", content: "Conteúdo 2" },
    ] },
    "lida": { id: "lida", title: "Publicações Lidas", tasks: [
      { id: "task3", processNumber: "11223", authors: "Autor 3", content: "Conteúdo 3" },
    ] },
    "enviada_adv": { id: "enviada_adv", title: "Publicações Enviadas para ADV", tasks: [
      { id: "task4", processNumber: "44556", authors: "Autor 4", content: "Conteúdo 4" },
    ] },
    "concluida": { id: "concluida", title: "Concluídas", tasks: [
      { id: "task5", processNumber: "78901", authors: "Autor 5", content: "Conteúdo 5" },
    ] },
  });

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    // Se não houver destino, significa que o item foi arrastado para fora da área
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    // Validação de movimentação reversa
    if (
      (sourceColumn.id === "enviada_adv" && destColumn.id !== "lida") ||
      (sourceColumn.id === "lida" && destColumn.id !== "enviada_adv" && destColumn.id !== "concluida")
    ) {
      alert("Movimento inválido!");
      return;
    }

    // Copiar as tarefas das colunas de origem e destino para evitar mutação direta
    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);  // Remove a tarefa da coluna de origem

    const destTasks = Array.from(destColumn.tasks);
    destTasks.splice(destination.index, 0, movedTask);  // Adiciona a tarefa na posição correta da coluna de destino

    // Atualizar o estado local com as colunas atualizadas
    const updatedColumns = {
      ...columns,
      [sourceColumn.id]: { ...sourceColumn, tasks: sourceTasks },
      [destColumn.id]: { ...destColumn, tasks: destTasks },
    };

    // Atualiza o estado do Kanban
    setColumns(updatedColumns);

    // Atualizar o status no backend (por exemplo, se você precisar enviar a atualização para o servidor)
    // await axios.put(`/publications/${draggableId}`, { status: destColumn.id });
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: "#f4f4f4",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "250px",
                  minHeight: "300px",
                }}
              >
                <h3>{column.title}</h3>
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
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Kanban;
