import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SaadMain from './components/saad.main'
import Home from './components/home';
import GenerateNumbers from './components/generateNumbers';
import axios from 'axios';
import {useEffect, useState} from "react";
import { loadSavings } from './utils/functions';

function App() {
  const [savings, setSavings] = useState([]);
  const [users, setUsers] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const apiSavings = 'http://localhost:5000/api/v1/savings';
  const apiUsers = 'http://localhost:5000/api/v1/users';
  useEffect(() => {
      loadData()
  },[])
  const loadData = async () => {
      try {
          const [savingsResponse, usersResponse] = await Promise.all([
              axios.get(apiSavings),
              axios.get(apiUsers)
          ])
          
          setNumbers(loadSavings(savingsResponse.data))
          setSavings(savingsResponse.data);
          setUsers(usersResponse.data);
      } catch (error) {
          console.log(error)
          
      }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/generate-number' element={<GenerateNumbers reloadData={loadData} numbersGenerated={numbers} savings={savings} users={users}/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
