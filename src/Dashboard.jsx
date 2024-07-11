import React from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import { io } from "socket.io-client";
import SideNavbar from "./components/SideNavbar";
import DashPortal from "./components/DashPortal";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
export const context = React.createContext([]);
import "./components/ScrollingCss.css";

const socket = io.connect("https://backend-pgv8.onrender.com");
toast.info("i am connected")

const Dashboard = () => {

  socket.on("receive_message", (data) => {
    toast.info(data.message);
    console.log("recieved msg")
  });

  const { isLoaded, isSignedIn } = useUser();
  const { user } = useClerk();
  const [userData, setUserData] = useState({});

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://backend-pgv8.onrender.com/user/${user.id}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  
  useEffect(() => {
    const saveUser = async () => {
      try {
        await axios.post("https://backend-pgv8.onrender.com/user/register", {
          userId: user.id,
          username: user.username,
          email: user.primaryEmailAddress.emailAddress,
          fullName: user.fullName,
          // lastName: user.lastName,
        }).then(()=>{
          fetchUserData();
        })
      } catch (error) {
        toast.error("user data not saved");
      }
    };

    saveUser();
  }, [, user]);
  
  // useEffect(() => {
  //   fetchUserData();
  // }, [, user]);

  // useEffect(() => {
  //   if (isLoaded && isSignedIn && user) {
  //     axios
  //       .post("https://backend-pgv8.onrender.com/user/register", {
  //         userid: user.id,
  //         username: user.username,
  //         email: user.primaryEmailAddress.emailAddress,
  //         fullname: user.fullName,
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // }, [, user]);
toast.info("script run")

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  // useEffect(() => {}, [userData]);

  return (
    <context.Provider value={[userData, setUserData, fetchUserData, socket]}>
      <AnimatePresence>
        <div className="bg-gray-100 z-40 flex">
          <div className="lg:w-[18%] w-[25%]">
            <div className="lg:w-[18%] w-[25%] fixed">
              <SideNavbar user={userData} image={user.imageUrl} />
            </div>
          </div>
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-[82%] w-[75%] scscrollremove z-30 px-[3vw] py-[5vh]"
          >
            <Outlet />
          </motion.div>
        </div>
      </AnimatePresence>
    </context.Provider>
  );
};

export default Dashboard;
