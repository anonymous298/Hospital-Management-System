import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const DesktopNavbar = () => {
  return (
    <div className='max-md:hidden'>
        <div className='navOpt flex gap-10 items-center'>
            <div className="navLinks flex gap-5 items-center">
                <Link href={'/'}>Home</Link>
                <Link href={'/'}>Our Doctors</Link>
                <Link href={'/'}>Services</Link>
            </div>

            <div className="navBtns flex gap-3 items-center">
                <SignedOut>
                    <SignInButton mode='modal'>
                        <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </div>
        </div>
    </div>
  )
}

export default DesktopNavbar