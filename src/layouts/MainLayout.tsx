interface MainLayoutProps {
    children: React.ReactNode;
  }
  
  const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
      <div>
        {/* Layout content */}
        {children}
      </div>
    );
  };
  export default MainLayout ;