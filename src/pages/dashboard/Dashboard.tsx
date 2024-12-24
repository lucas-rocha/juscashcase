import Header from '../../components/Header/Header'
import KanbanFilter from '../../components/KanbanFilter/KanbanFilter'
import './dashboard.css'

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />
      <div className="dash__container">
        <div className="kanban-filter__container">
          <KanbanFilter />
        </div>
      </div>
    </>
  )
}

export default Dashboard