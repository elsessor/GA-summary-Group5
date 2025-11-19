// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Settings from './page/Settings.jsx';
import Navbar from "./component/layout/Navbar.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/settings/*" element={<Settings />} />
                {/* You can add more routes here */}
            </Routes>
        </Router>
    );
}


export default App;
