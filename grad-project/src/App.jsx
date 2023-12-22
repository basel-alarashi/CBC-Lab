import {
  Route,
  Routes,
  BrowserRouter as Router
} from "react-router-dom";
import "./App.css";
import React, { useMemo } from "react";
import { RecoilRoot } from "recoil";

// Pages
import Home from "./pages/Home";
import AddPatient from "./pages/AddPatient";
import AllPatients from "./pages/AllPatients";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PatientInfo from "./pages/PatientInfo";
import axios from 'axios';

console.log(window.location.pathname);

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="create" element={<AddPatient />} />
          <Route path="patients" element={<AllPatients />} />
          <Route path=":id" element={<PatientInfo />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />} />
        </Routes>
        </Router>
    </RecoilRoot>
  );
}

export default App;
