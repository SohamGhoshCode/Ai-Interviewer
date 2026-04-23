import React from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard'
import { Link } from "react-router-dom";
import LOGO from "../../assets/logo.svg";

const Navbar = () => {
  return (
    <div className='h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 py-2.5 px-4 md:px-0 sticky top-0 z-30 shadow-sm transition-all duration-300'>
      <div className='w-9/10 container mx-auto flex items-center justify-between gap-5'>
        <Link to="/dashboard" className='flex items-center gap-2 group'>
          <div className="relative">
            <img src={LOGO} alt="ASAP! Logo" className='w-7 h-7 transition-transform duration-300 group-hover:scale-110' />
          </div>
          <h2 className='text-lg md:text-xl font-bold text-black tracking-tight leading-5 group-hover:opacity-80 transition-opacity duration-200'>
            ASAP<span className='text-gray-400'>!</span>
          </h2>
        </Link>
        <ProfileInfoCard />
      </div>
    </div>
  )
}

export default Navbar
