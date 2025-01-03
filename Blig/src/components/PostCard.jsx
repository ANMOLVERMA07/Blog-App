import React from 'react'
import { Link } from 'react-router-dom'
import service from '../appwrite/config'

// className='w-full justify-center mb-4'
function PostCard({
    $id,
    title,
    featuredImage,
}) {
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-700 rounded-xl p-3'>
            <div className='w-full justify-center mb-2'>
            <img src={service.getFilePreview(featuredImage)} alt={title} className='rounded-xl'/>
            <h2 className='mt-2 text-white text-center text-xl font-bold'>{title}</h2>
            </div>
        </div>
    </Link>
  )
}

export default PostCard