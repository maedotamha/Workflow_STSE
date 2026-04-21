import '../styles/MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1>Wallet</h1>
      </header>
      <main className="layout-content">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; 2026 Wallet App</p>
      </footer>
    </div>
  );
};

export default MainLayout;
