import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // ⬅ Changer "Router" par "BrowserRouter"
import Cards from "./components/Cards";
import Primaire from "./pages/Primaire";
import College from "./pages/College";
import Lycee from "./pages/Lycee";
import Contact from "./components/Contact";
import Header from "./components/Header";
import VideoPresentation from "./components/VideoPresentation";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Instructor from "./components/Instructor";
import Description from "./components/Description";
//import OnFileUpload from "./onFileUpload";
import Login from "./Login";
import CoursList from "./CoursList";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import { Navigate } from "react-router-dom";
import Selection from "./Selection";
import Fichier from "./Fichier";
function Home() {
  return (
    <>
    <Navigation />
      <Header />
      <Cards />
      <VideoPresentation />
      <Instructor/>
      <Contact />
      <Description/>
      <Footer />
    </>
  );
}

function App() {
  const token = localStorage.getItem('token'); // Vérifie si le token est présent dans localStorage
  return (
    <Routes>  {/* ⬅ Supprimer <BrowserRouter> ici */}
      <Route path="/" element={<Home />} />
      <Route path="/primaire" element={<Primaire />} />
      <Route path="/college" element={<College />} />
      <Route path="/lycee" element={<Lycee />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/cours" exact component={CoursList} />
     
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/selection" element={<Selection />} />
      <Route path="/fichier" element={<Fichier />} /> 

    </Routes>
  );
}

export default App;