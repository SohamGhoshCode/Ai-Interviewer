import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';
import { LuLogOut, LuUser } from 'react-icons/lu';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    };

    return (
        user && (
            <div className='flex items-center gap-3'>
                {/* Avatar */}
                <div className="relative group cursor-pointer">
                    {user.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user.name}
                            className='w-9 h-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-black transition-colors duration-200'
                        />
                    ) : (
                        <div className='w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-200 group-hover:border-black transition-colors duration-200 flex items-center justify-center'>
                            <LuUser className="text-gray-400 text-sm" />
                        </div>
                    )}
                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full" />
                </div>

                {/* Name & logout */}
                <div className='hidden sm:flex flex-col'>
                    <span className='text-[13px] text-black font-bold leading-tight'>
                        {user.name || "User"}
                    </span>
                    <button
                        className='text-[11px] text-gray-400 font-medium cursor-pointer hover:text-black transition-colors duration-200 text-left flex items-center gap-1 mt-0.5'
                        onClick={handleLogout}
                    >
                        <LuLogOut className="text-[10px]" />
                        Logout
                    </button>
                </div>
            </div>
        )
    );
};

export default ProfileInfoCard;
