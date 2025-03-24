import React from 'react'
import ReactPlayer from 'react-player';

const youtubes = [
    {
      id: 1,
      url: "https://www.youtube.com/watch?v=59-2-lDBASU"
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=59-2-lDBASU"
    },
    {
      id: 3,
      url: "https://www.youtube.com/watch?v=59-2-lDBASU"
    },
    {
      id: 4,
      url: "https://www.youtube.com/watch?v=59-2-lDBASU"
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
  export default Media;