import { HeartPulse } from 'lucide-react'
import React from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'
import Link from 'next/link'

const Navbar = () => {
  return (
    <header className='fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-[#E5E7EB]'>
        <nav className='max-w-7xl mx-auto p-3 flex justify-between items-center'>
            <Link href={'/'} className="logo flex justify-center items-center gap-2 text-[#14B8A6]">
                <HeartPulse/>
                <h1 className='text-2xl font-bold'>Veracare</h1>
            </Link>
            
            <DesktopNavbar/>
            <MobileNavbar/>
            
        </nav>
    </header>
  )
}

export default Navbar