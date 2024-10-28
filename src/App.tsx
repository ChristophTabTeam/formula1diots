import Nav from "./components/Nav";
import Router from "./components/Router";
import { AuthProvider, useAuth } from "./context/authcontext";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      {isAuthenticated && (
        <div className="sidebar">
          <Nav />
          <div className="version-wrapper">
            <a href="/changelog">Changelog</a>
            <p>Version 0.1.1</p>
          </div>
        </div>
      )}
      <main style={{ position: "relative" }}>
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
