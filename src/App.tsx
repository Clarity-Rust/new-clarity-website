// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext"
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Store from "./components/Store";
import Cart from "./components/StoreCart";
import Faq from "./components/Faq";
import Staff from "./components/Staff";

const App: React.FC = () => {
  return (
    <AppProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/cart" element={<Cart />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
      </div>
    </Router>
    </AppProvider>
  );
};

export default App;
