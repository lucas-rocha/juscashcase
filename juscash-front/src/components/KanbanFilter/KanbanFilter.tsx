import './kanbanFilter.css'

interface KanbanFilterProps {
  filters: {
    search: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onFilterSubmit: () => void;
}

const KanbanFilter: React.FC<KanbanFilterProps> = ({ filters, onFilterChange, onFilterSubmit }) => {
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
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <div className="kanban-filter__group">
          <label htmlFor="diary">Data do diário</label>
          <div className="kanban-filter__column">
            <p>De:</p>
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
            />
            <p>Até:</p>
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
            />
            <button type="button" onClick={onFilterSubmit}>ok</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanFilter;
