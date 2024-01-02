import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import { Navbar } from "./components/navbar";
import { Auth } from "./pages/auth";
import { CreateAppointment } from "./pages/create-appointment";
import { Home } from "./pages/home";
import { SavedAppointments } from "./pages/saved-appointments";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-appointment" element={<CreateAppointment />} />
          <Route path="/saved-appointments" element={<SavedAppointments />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
