import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Store from "./components/store/Store";
import Cart from "./components/store/Cart";
import Faq from "./components/Faq";
import Staff from "./components/Staff";
import EventStore from "./components/store/EventStore";
import { Toaster } from "./components/ui/toaster";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

const AppContent: React.FC = () => {
  return (
    <div className="App min-h-fit bg-[#292930] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/store/cart" element={<Cart />} />
        <Route path="/store" element={<Store />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/store/events" element={<EventStore />} />
      </Routes>
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent /> 
      </Router>
    </AppProvider>
  );
};

export default App;
