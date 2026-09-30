import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreAdmin } from './store/slices/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import WorkersPage from './pages/WorkersPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import JobsPage from './pages/JobsPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, restoring } = useSelector((s) => s.auth);
  const [page, setPage] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [authPage, setAuthPage] = useState('login');

  useEffect(() => { dispatch(restoreAdmin()); }, [dispatch]);

  const navigate = (p, id = null) => {
    setPage(p);
    setSelectedId(id);
  };

  if (restoring) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb', marginBottom: 12 }}>KajAche Admin</div>
          <div style={{ color: '#64748b' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === 'register') {
      return <RegisterPage onShowLogin={() => setAuthPage('login')} />;
    }
    return <LoginPage onShowRegister={() => setAuthPage('register')} />;
  }

  // Detail pages don't use the Layout sidebar
  if (page === 'worker-detail') {
    return (
      <Layout page="workers" onNavigate={navigate}>
        <WorkerDetailPage id={selectedId} onBack={() => navigate('workers')} />
      </Layout>
    );
  }
  if (page === 'customer-detail') {
    return (
      <Layout page="customers" onNavigate={navigate}>
        <CustomerDetailPage id={selectedId} onBack={() => navigate('customers')} />
      </Layout>
    );
  }

  const pages = {
    dashboard: <DashboardPage onNavigate={navigate} />,
    workers:   <WorkersPage onNavigate={navigate} />,
    customers: <CustomersPage onNavigate={navigate} />,
    jobs:      <JobsPage />,
    analytics: <AnalyticsPage />,
  };

  return <Layout page={page} onNavigate={navigate}>{pages[page] || <DashboardPage />}</Layout>;
}
