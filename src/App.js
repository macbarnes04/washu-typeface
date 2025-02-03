import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import FullFont from "./pages/Fullfont";  
import './App.css';


  function App() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Fullfont" element={<FullFont />} />
      </Routes>
    );
  }

export default App;
