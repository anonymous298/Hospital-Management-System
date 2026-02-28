import { HeartPulse } from 'lucide-react'
import React from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'

const Navbar = () => {
  return (
    <header>
        <nav className='max-w-7xl mx-auto p-3 flex justify-between items-center'>
            <div className="logo flex justify-center items-center gap-2">
                <HeartPulse/>
                <h1 className='text-2xl font-bold'>Veracare</h1>
            </div>
            
            <DesktopNavbar/>
            <MobileNavbar/>
            
        </nav>
    </header>
  )
}

export default Navbar