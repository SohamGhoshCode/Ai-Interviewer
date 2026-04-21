import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file){
            // Update the image state
            setImage(file);

            // Generate preview URL from the file
            const preview = URL.createObjectURL(file);
            if(setPreview){
                setPreview(preview)
            }
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);

        if(setPreview){
            setPreview(null)
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

  return <div className='flex justify-center mb-6'>
    <input 
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
    />

    {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-gray-50 rounded-full relative cursor-pointer border border-gray-200' onClick={onChooseFile}>
            <LuUser className='text-4xl text-gray-400' />
            <button
                type='button'
                className='w-8 h-8 flex items-center justify-center bg-black text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-gray-800'
                onClick={(e) => {
                    e.stopPropagation();
                    onChooseFile();
                }}
            >
                <LuUpload size={14} />
            </button>
        </div>
    ) : (
        <div className='relative'>
            <img src={preview || previewUrl} alt="profile photo" className='w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm' />
            <button 
                type='button' 
                className='w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-black transition-colors' 
                onClick={handleRemoveImage}
            >
                <LuTrash size={14} />
            </button>
        </div>
    )} 
  </div>
};

export default ProfilePhotoSelector
