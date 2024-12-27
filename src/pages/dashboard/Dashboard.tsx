import Header from '../../components/Header/Header'
import Kanban from '../../components/Kanban/Kanban'
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
        <Kanban />
      </div>
    </>
  )
}

export default Dashboard