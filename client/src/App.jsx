import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './pages/Home'
import TicketList from './pages/TicketList'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import PostPage from './pages/PostPage'
import OnlyUserPrivateRoute from './components/OnlyUserPrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
    
    <Header/>
    <Routes>
     
      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>

      <Route element={<PrivateRoute/>}>
        <Route path='/ticketList' element={<TicketList/>}/> 
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/ticket/:postSlug' element={<PostPage/>}/>
      </Route>

      <Route element={<OnlyUserPrivateRoute/>}>
        <Route path='/' element={<Home/>}/>
      </Route>

      </Routes>
      <Footer/>
      </BrowserRouter>
  )
}
