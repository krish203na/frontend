import { UserButton, UserProfile } from "@clerk/clerk-react";
import React, {useContext} from "react";
import { motion } from "framer-motion";
import { context } from "../Dashboard";
import { NavLink } from "react-router-dom";

const SideNavbar = ({image}) => {
   const [userData] = useContext(context);

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full z-40 bg-white border h-screen flex flex-col items-center"
    >
      <div className="h-[15%] px-5 flex items-center justify-center  gap-3">
        <img
          className="h-[50%] rounded-lg"
          src=".\images\testify.jpg"
          alt=""
        />
        <h1 className="text-3xl font-semibold">Taskify</h1>
      </div>
      <div className=" h-[35%] flex items-center justify-center gap-[1vh] flex-col">
        <img
          className="rounded-full border-4 w-[60%]"
          src={image}
          alt="loading..."
        />
        <h1 className="font-semibold text-xl">{userData.fullname}</h1>
      </div>
      <div className="flex w-[60%] py-5 h-[40%] justify-start items-center gap-5 flex-col">
        <NavLink to={"/"}>
        <h1 className="h-[15%] w-full  rounded-lg flex justify-start items-center gap-3 text-lg">
          <i className="fa-solid fa-user-group"></i>Admin
        </h1></NavLink>
      <NavLink to={"/task"}>
        <h1 className="h-[15%] w-full  rounded-lg flex justify-start items-center gap-3 text-lg">
          <i className="fa-solid fa-list-check"></i>Task
        </h1>
        </NavLink>
        <NavLink to={"/project"}>
        <h1 className="h-[15%] w-full  rounded-lg flex justify-start items-center gap-3 text-lg">
          <i className="fa-solid fa-diagram-subtask"></i>Project
        </h1></NavLink>
      </div>
      <div className="w-[100%] h-[10%] flex justify-center items-center">
        <div className="rounded-lg border-gray-500 h-[3vw] gap-2 w-[80%] flex justify-center items-center text-lg bg-[#e3e9ef]">
          <UserButton showName={true}/>
        </div>
      </div>
    </motion.div>
  );
};

export default SideNavbar;
