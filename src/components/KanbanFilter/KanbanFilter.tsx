import './kanbanFilter.css'

const KanbanFilter: React.FC = () => {
  return (
    <div className="kanban-filter">
      <div className="kanban-filter__intro">
        <img src="./assets/adv-icon.png" alt="Advogacia" />
        <h2>Publicações</h2>
      </div>

      <div className="kanban-filter__inputs">
        <div className="kanban-filter__group">
          <label htmlFor="search">Pesquisar</label>
          <input 
            type="text"
            id="search"
          />
        </div>

        <div className="kanban-filter__group">
          <label htmlFor="search">Data do diário</label>
          <div className="kanban-filter__column">
            <p>De:</p>
            <input 
              type="date"
              id="search"
            />
            <p>Até:</p>
            <input 
              type="date"
              id="search"
            />
          <button type="button">ok</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default KanbanFilter