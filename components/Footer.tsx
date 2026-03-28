import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="relative z-50 w-full text-gray-400 bg-black px-4 md:px-6 py-6 flex items-center justify-between">
            <div className="text-sm">© 2024 ReadySetHire. All rights reserved.</div>
            <nav className="flex items-center gap-4">
                <Link className="hover:text-white hover:underline underline-offset-4" href="https://github.com/Anikate001/ReadySetHire">
                    View source code
                </Link>
                <Link className="hover:text-white hover:underline underline-offset-4" href="#">
                    Back to Top
                </Link>
                <Link className="hover:text-white hover:underline underline-offset-4" href="mailto:bm820@snu.edu.in">
                    Contact
                </Link>
            </nav>
        </footer>
    )
}

export default Footer