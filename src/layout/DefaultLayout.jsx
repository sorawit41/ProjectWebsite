import React from 'react'
import { Header,Footer } from '../components'

const DefaultLayout = ({children}) => {
  return (
    <div>
        <Header/>
        <div>
            {children}
        </div>       
        <Footer/>
    </div>
  )
}

export default DefaultLayout