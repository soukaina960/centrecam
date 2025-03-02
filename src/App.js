import React from "react";
import { Route, Routes } from "react-router-dom"; // Assure-toi que Routes et Route sont bien importés
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

import Login from "./Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import CoursList from "./CoursList";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import Selection from "./Selection";
import Fichier from "./Fichier";
import FilesPage from "./FilesPage";

function Home() {
  return (
    <>
      <Navigation />
      <Header />
      <Cards />
      <VideoPresentation />
      <Instructor />
      <Contact />
      <Description />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes> {/* Assure-toi que toutes les routes sont bien encapsulées dans <Routes> */}
      <Route path="/" element={<Home />} />
      <Route path="/primaire" element={<Primaire />} />
      <Route path="/college" element={<College />} />
      <Route path="/lycee" element={<Lycee />} />
      <Route path="/login" element={<Login />} />
      
      {/* Private Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      <Route path="/cours" element={<CoursList />} />
      <Route path="/selection" element={<Selection />} />
      <Route path="/fichier" element={<Fichier />} />
      <Route path="/files" element={<FilesPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/Description" element={<Description />} />
    </Routes>
  );
}

export default App;
