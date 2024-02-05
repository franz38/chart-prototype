import './App.css'
import { Canvas } from './Canvas'

function App() {
  return (
    <>
      <header className='fixed w-screen top-0 z-50 bg-white border-solid border-b border-slate-200 h-12 flex flex-row items-center content-center px-2'>
        <img src="./vite.svg" className='w-9 h-9 p-2 my-2 bg-white rounded-sm'></img>
      </header>
      
      <Canvas plotId='plt-1' />

      <div className='block md:hidden'>
        <p>This website is available only for desktop</p>
      </div>
    </>
  )
}

export default App
