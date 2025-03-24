import React from 'react'
import ReactPlayer from 'react-player/lazy'

const youtubes = [
  {
    id:1,
    url:"https://www.youtube.com/watch?v=dc3eD6C6Gbk&pp=ygUFaHV0YW8%3D"
  },
  {
    id:2,
    url:"https://www.youtube.com/watch?v=dc3eD6C6Gbk&pp=ygUFaHV0YW8%3D"
  },
  {
    id:3,
    url:"https://www.youtube.com/watch?v=dc3eD6C6Gbk&pp=ygUFaHV0YW8%3D"
  },
  {
    id:4,
    url:"hhttps://www.youtube.com/watch?v=dc3eD6C6Gbk&pp=ygUFaHV0YW8%3D"
  },
];

const Media = () => {
  return (
    <div>

<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
  {youtubes.map((yu,idx)=>{
    return (<div key={idx}>
       <div className='w-full h-[300px] overflow-hidden mb-6'>
       <ReactPlayer
                    controls={true}
                    url={`${yu?.url}`}
                    width="100%"
                    height="100%"
                  />
       </div>
    </div>)
  })}
</div>
    </div>
  )
}

export default Media