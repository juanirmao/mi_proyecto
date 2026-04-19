import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Municipios from './pages/Municipios';
import SujetosPasivos from './pages/SujetosPasivos';
import ROISolicitudes from './pages/ROISolicitudes';
import LiquidacionesIAP from './pages/LiquidacionesIAP';
import Documentos from './pages/Documentos';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/municipios" element={<Municipios />} />
            <Route path="/sujetos-pasivos" element={<SujetosPasivos />} />
            <Route path="/roi-solicitudes" element={<ROISolicitudes />} />
            <Route path="/liquidaciones-iap" element={<LiquidacionesIAP />} />
            <Route path="/documentos" element={<Documentos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;