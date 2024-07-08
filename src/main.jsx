import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from "@clerk/clerk-react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './Dashboard.jsx';
import DashPortal from './components/DashPortal.jsx';
import TaskPortal from './components/TaskPortal.jsx';
import ProjectPortal from './components/ProjectPortal.jsx';
import FriendPortal from './components/FriendPortal.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
        <Route path='/' element={<DashPortal/>}/>
        <Route path='/task' element={<TaskPortal/>}/>
        <Route path='/project' element={<ProjectPortal/>}/>
        <Route path='/friend' element={<FriendPortal/>}/>
      </Route>
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
