import React from 'react'
import { Link } from 'react-router-dom'
import service from '../appwrite/config'

function PostCard({
    $id,
    title,
    featuredImage,
}) {
  return (
    <Link to={`/blog/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
            <img src={service.getFilePreview(className='w-full justify-center mb-4')} alt={title} className='rounded-xl'/>
            <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </div>
    </Link>
  )
}

export default PostCard