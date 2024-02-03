import './input.css'
import Register from './pages/Register';
import Login from './pages/Login';
import { Route , Router , Routes } from 'react-router-dom';
import axios from 'axios';
import Profile from './pages/Profile';
axios.defaults.withCredentials= true
axios.defaults.baseURL = "http://localhost:5000"
function App() {
  return (
    <Routes >
      <Route element={<Login/>} path='/' />
      <Route element={<Register/>} path='/register' />
      <Route element={<Profile/>} path='/profile'/>
    </Routes>    
  );
}

export default App;
