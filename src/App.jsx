import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout'
import {Home, About, Access, Cast, Media, NewsAndEvent, Vip,Menu,Contact} from "./pages"

const Layout = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

const router = createBrowserRouter([
  {
    element:<Layout/>,
    children:[
      {
        path:"/",
        element: <Home/>,       
      },
      {
        path:"/NewsAndEvent",
        element: <NewsAndEvent/>,       
      },
      {
        path:"/Menu",
        element: <Menu/>,       
      },
      {
        path:"/Cast",
        element: <Cast/>,       
      },
      {
        path:"/Vip",
        element: <Vip/>,       
      },
      {
        path:"/Media",
        element: <Media/>,       
      },
      {
        path:"/Access",
        element: <Access/>,       
      },
      {
        path:"/About",
        element: <About/>,       
      },
      {
        path:"/Contact",
        element: <Contact/>,       
      },
    ]
  },
])

const App = () => {
  return (
   <RouterProvider router={router}/>
  )
}

export default App