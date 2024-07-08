import React, { useContext, useEffect, useState } from "react";
import { context } from "../Dashboard";
import { motion, AnimatePresence } from "framer-motion";

const ProjectPortal = () => {
  const [userData, setUserData, fetchUserData] = useContext(context);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  const addProjectHandler = () => {
    setShowAddProjectForm(true);
    fetchUserData();
  };

  return (
    <motion.div
      initial={{ x: 500 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col gap-5 min-h-[100vh]"
    >
      <div className="w-[100%] h-[20%] flex justify-between items-center">
        <div className="truncate max-w-[60%]">
          <h1 className="text-4xl text-clip font-semibold">
            Welcome to Project Board !
          </h1>
          <h1>{`date -:  ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</h1>
        </div>
        <div className="">
          <button
            onClick={addProjectHandler}
            className="flex items-center justify-center gap-2 border-2 rounded-lg border-gray-500 p-[2vh]"
          >
            <i className="fa-regular fa-square-plus text-2xl"></i>Create Project
          </button>
        </div>
      </div>
      <div className="h-full">
        <h1 className="text-2xl py-3 font-medium">High Priority Task</h1>
        <div className="w-full p-[2vw] scrollremove rounded-lg bg-[#d2d8dd] max-h-[40vh] overflow-x-scroll flex gap-3 justify-start items-start border-black">
          <h1 className="text-2xl py-3 font-medium">Under Development Comming Soon!</h1>
          {showAddProjectForm && (
            <AnimatePresence>
              <AddtaskForm setShow={setShowAddTaskForm} userDAta={userData} />
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectPortal;
