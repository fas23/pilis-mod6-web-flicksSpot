import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Login from './routes/Login/Login'
import Register from './routes/Register/Register'
import Recovery from './routes/Recovery/Recovery'
// import Navigation from './routes/Navigation/Navigation2'
import Home from './routes/Home/Home'
import { Login } from './routes/Login/Login'
import { Navigation } from './routes/Navigation/Navigation'
import Movie from './routes/Movie/Movie'
import Cart from './routes/Cart/Cart'
import Tickets from './routes/Tickets/Tickets'
import { UploadMovie } from './routes/UploadMovie/UploadMovie'
import { AvailableMovies } from './routes/AvailableMovies/AvailableMovies'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recovery' element={<Recovery />} />
          <Route path='/listing/:id' element={<Movie />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/tickets' element={<Tickets />} />
          <Route path='/upload-movie' element={<UploadMovie />} />
          <Route path='/available-movies' element={<AvailableMovies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
