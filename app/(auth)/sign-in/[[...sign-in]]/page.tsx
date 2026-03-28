import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <main className='flex h-screen w-full items-center justify-center relative z-0'>

      <div className="h-screen w-full bg-transparent bg-grid-white/[0.1] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <SignIn />

      </div>

    </main>
  )
}

export default SignInPage