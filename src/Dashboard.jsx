import React from "react";
import { useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import { io } from "socket.io-client";
import SideNavbar from "./components/SideNavbar";
import DashPortal from "./components/DashPortal";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
export const context = React.createContext([]);

const socket = io.connect("https://backend-pgv8.onrender.com/");


const Dashboard = () => {

  useEffect(() => {
    socket.on("receive_message", (data) => {
      toast.info(data.message);
    });
  }, [socket]);


  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      //   console.log('User data:', user);
      //   // Example of accessing user data
      //   console.log('User ID:', user.id);
      //   console.log('Email:', user.primaryEmailAddress.emailAddress);
      //   console.log('Full Name:', user.fullName);
      //   console.log('Username:', user.username);
      axios
        .post("https://backend-pgv8.onrender.com/user/register", {
          userid: user.id,
          username: user.username,
          email: user.primaryEmailAddress.emailAddress,
          fullname: user.fullName,
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://backend-pgv8.onrender.com/user/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    // console.log(userData.tasks.length);
  }, [userData]);

  return (
    <context.Provider value={[userData, setUserData, fetchUserData, socket]}>
      <AnimatePresence>
        <div className="bg-[#e3e9ef] z-40 flex">
          <div className="lg:w-[18%] w-[25%]">
            <div className="lg:w-[18%] w-[25%] fixed">
              <SideNavbar user={userData} image={user.imageUrl} />
            </div>
          </div>
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-[82%] w-[75%] z-30 px-[3vw] py-[5vh]"
          >
            <Outlet />
          </motion.div>
        </div>
      </AnimatePresence>
    </context.Provider>
  );
};

export default Dashboard;
