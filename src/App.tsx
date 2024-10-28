import Nav from "./components/Nav";
import Router from "./components/Router";
import { AuthProvider } from "./context/authcontext";

function App() {
  return (
    <AuthProvider>
      <div className="page">
        <div className="sidebar">
          <Nav />
          <div className="version-wrapper">
            <a href="/changelog">Changelog</a>
            <p>Version 0.1.1</p>
          </div>
        </div>

        <main style={{ position: "relative" }}>
          <Router />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
