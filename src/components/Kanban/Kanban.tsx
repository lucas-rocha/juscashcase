import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import axios from "axios";

const Kanban: React.FC = () => {
  // const [columns, setColumns] = useState({
  //   "nova": { id: "nova", title: "Publicações Novas", tasks: [] },
  //   "lida": { id: "lida", title: "Publicações Lidas", tasks: [] },
  //   "enviada_adv": { id: "enviada_adv", title: "Publicações Enviadas para ADV", tasks: [] },
  //   "concluida": { id: "concluida", title: "Concluídas", tasks: [] },
  // });

  // useEffect(() => {
  //   // Carregar publicações por status
  //   const fetchPublications = async () => {
  //     const statuses = Object.keys(columns);
  //     const newColumns = { ...columns };

  //     for (const status of statuses) {
  //       const response = await axios.get(`/publications?status=${status}`);
  //       newColumns[status].tasks = response.data;
  //     }

  //     setColumns(newColumns);
  //   };

  //   fetchPublications();
  // }, []);

  // const onDragEnd = async (result) => {
  //   const { source, destination, draggableId } = result;

  //   if (!destination) return;

  //   const sourceColumn = columns[source.droppableId];
  //   const destColumn = columns[destination.droppableId];

  //   // Validação de movimentação reversa
  //   if (
  //     (sourceColumn.id === "enviada_adv" && destColumn.id !== "lida") ||
  //     (sourceColumn.id === "lida" && destColumn.id !== "enviada_adv" && destColumn.id !== "concluida")
  //   ) {
  //     alert("Movimento inválido!");
  //     return;
  //   }

  //   const sourceTasks = Array.from(sourceColumn.tasks);
  //   const [movedTask] = sourceTasks.splice(source.index, 1);

  //   const destTasks = Array.from(destColumn.tasks);
  //   destTasks.splice(destination.index, 0, movedTask);

  //   // Atualizar estado local
  //   const updatedColumns = {
  //     ...columns,
  //     [sourceColumn.id]: { ...sourceColumn, tasks: sourceTasks },
  //     [destColumn.id]: { ...destColumn, tasks: destTasks },
  //   };

  //   setColumns(updatedColumns);

  //   // Atualizar status no backend
  //   // await axios.put(`/publications/${draggableId}`, { status: destColumn.id });
  // };

  return (
    <h1>lad</h1>
  );
};

export default Kanban;
