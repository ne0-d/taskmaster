import './App.css';
import Login from './Components/Auth/Login';
import { Route, Routes, Navigate } from "react-router-dom";
import Home from './Components/Home/Home';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../home" /> : <Login />}
        />

        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth" />}
        />
        
      </Routes>
    </div>
  );
}

export default App;
