import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import TransactionsList from './pages/TransactionsList';
import TransactionDetail from './pages/TransactionDetail';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<TransactionsList />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
