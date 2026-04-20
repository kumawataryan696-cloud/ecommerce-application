import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Footer } from "./component/Footer";
import { Navbar } from "./component/Navbar";
import { WishlistProvider } from "./route/store/WishlistContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <div className="app-layout">
          <header className="app-header">
            <Navbar />
          </header>
          <main className="app-main">
            <div className="app-main__inner">
              <AppRoutes />
            </div>
          </main>
          <div className="app-footer" role="contentinfo">
            <Footer />
          </div>
        </div>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
