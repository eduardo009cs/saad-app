import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SaadMain from './components/saad.main'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SaadMain></SaadMain>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
