import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout'
import {Home,DashboardPage,UpdatePasswordPage,AdminOrderManagementPage,
  ProfilePage,AddProductForm,ProductListPage,CheckoutPage,OrderTrackingPage,
  ForgotPasswordPage,About, Access, Cast, Media, NewsAndEvent,Menu,Contact,Rules,Schedule,Idol,Receive,Privacy, Member, MainMenu, DrinkMenu,LoginPage,RegisterPage} from "./pages"



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
      {
        path:"/Rules",
        element: <Rules />, 
      },
      {
        path:"/Schedule",
        element: <Schedule/>, 
      }
      ,
      {
        path:"/Idol",
        element: <Idol />, 
      },
      {
        path:"/Receive",
        element: <Receive />, 
      },
      {
        path:"/Privacy",
        element: <Privacy />, 
      },
      {
        path:"/Member",
        element: <Member />, 
      },
      {
        path:"/MainMenu",
        element: <MainMenu />, 
      },
      {
        path:"/DrinkMenu",
        element: <DrinkMenu />, 
      },
      {
        path:"/LoginPage",
        element: <LoginPage />, 
      },
      {
        path:"/RegisterPage",
        element: <RegisterPage />, 
      },
      {
        path:"/DashboardPage",
        element: <DashboardPage />, 
      },
      {
        path:"/ForgotPasswordPage",
        element: <ForgotPasswordPage />, 
      },
      {
        path:"/UpdatePasswordPage",
        element: <UpdatePasswordPage />, 
      },
      {
        path:"/ProfilePage",
        element: <ProfilePage />, 
      },
      
      {
        path:"/AddProductForm",
        element: <AddProductForm />, 
      },
      
      {
        path:"/ProductListPage",
        element: <ProductListPage />, 
      },
      {
         path:"/CheckoutPage",
        element: <CheckoutPage />, 
      },
     {
         path:"/OrderTrackingPage",
        element: <OrderTrackingPage />, 
      },
      {
         path:"/AdminOrderManagementPage",
        element: <AdminOrderManagementPage />, 
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