import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router'
import Option from './components/option'
import Adminsignup from './components/adminsignup'
import Adminsignin from './components/adminsignin'
import Usersignup from './components/usersignup'
import Usersignin from './components/usersignin'
import Admindash from './components/admindash'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Option></Option>}></Route>
      <Route path='/adminsignup' element={<Adminsignup></Adminsignup>}></Route>
      <Route path='/adminsignin' element={<Adminsignin></Adminsignin>}></Route>
      <Route path='/usersignup' element={<Usersignup></Usersignup>}></Route>
      <Route path='/usersignin' element={<Usersignin></Usersignin>}></Route>
      <Route path='/adminquiz' element={<Admindash></Admindash>}></Route>
    </Routes>
    </BrowserRouter>

  )
}

export default App
