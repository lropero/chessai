import { Route, Routes } from 'react-router-dom'
import Home from './components/home'
import NotFound from './components/not-found'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
