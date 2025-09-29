import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LayoutComponent from './pages/Layout'
import { AuthForm } from './components/Auth/AuthFrom'
import { Tasks } from './components/Tasks/Tasks'
import { Profile } from './components/User/Profile'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutComponent />}>
            <Route index element={< Profile/>} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/auth' element={<AuthForm />} />
            <Route path='/me' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
   
  )
}

export default App
