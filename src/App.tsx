import { MessageSquareText } from 'lucide-react'
import './App.css'
import { Canvas } from './Canvas'
import { iconAttributes } from './panels/LevelsPanel'

function App() {
  return (
    <>
      <header className='fixed w-screen top-0 z-50 bg-white border-solid border-b border-slate-200 h-12 flex flex-row items-center justify-between content-center px-2'>
        <img src="./vite.svg" className='w-10 h-9 p-2 my-2 bg-white rounded-sm'></img>
        <a href='https://forms.gle/7eqEJN35XxKoNKtv5' target='_blank'>
          <MessageSquareText {...iconAttributes} className='w-8 h-8 p-2 rounded-sm cursor-pointer hover:bg-[#eee]'/>
        </a>
      </header>
      
      <Canvas plotId='plt-1' />

      <div className='block md:hidden'>
        <p>This website is available only for desktop</p>
      </div>
    </>
  )
}

export default App
