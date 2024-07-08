import React, { useContext, useEffect, useState } from "react";
import { context } from "../Dashboard";
import AddtaskForm from "./AddtaskForm";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./TaskCard";
import "./ScrollingCss.css";

const DashPortal = () => {
  
  const [userData,setUserData,fetchUserData] = useContext(context)
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const addTaskHandler = () => {
   setShowAddTaskForm(true);
   fetchUserData()
  }
   
  

  return (
    <motion.div
      initial={{ x: 500 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col gap-5 min-h-[100vh]"
    >
      <div className="w-[100%]  h-[20%] flex justify-between items-center">
        <div className="truncate max-w-[60%]">
          <h1 className="text-4xl text-clip font-semibold">
            Hello {userData.fullname} !
          </h1>
          <h1>{`date -:  ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</h1>
        </div>

        <div className="">
          <button
            onClick={addTaskHandler}
            className="flex items-center justify-center gap-2 border-2 rounded-lg border-gray-500 p-[2vh]"
          >
            <i className="fa-regular fa-square-plus text-2xl"></i>Add Task
          </button>
        </div>
      </div>
      <div className="h-full">
        <h1 className="text-2xl py-3 font-medium">
          What you should pay attention to
        </h1>
        <div className="w-full p-[2vw] scrollremove rounded-lg bg-[#d2d8dd] max-h-[40vh] overflow-x-scroll flex gap-3 justify-start items-start border-black">
          {showAddTaskForm && (
            <AnimatePresence>
              <AddtaskForm setShow={setShowAddTaskForm} userDAta={userData} />
            </AnimatePresence>
          )}
          {(
            Array.isArray(userData.tasks) ? (
              !userData.tasks.length == 0 ? (
                userData.tasks.map((e, i) => {
                  return (
                    <TaskCard key={`task${i}`} task={e} condition={true} />
                  );
                })
              ) : (
                <div>No Task Added Yet</div>
              )
            ) : (
              <div>No Task Added Yet</div>
            )
          ) }
        </div>
        <div className="py-5 flex gap-5 w-full">
          <div className="flex flex-col flex-grow flex-shrink bg-[#d2d8dd] w-[10vw] rounded-lg p-[1vw] py-[2vw]">
            <h1 className="text-xl text-center">Total tasks</h1>
            <h1 className="text-5xl font-bold text-center">
              {Array.isArray(userData.tasks)
                ? userData.tasks.length + userData.taskscompleted
                : 0}
            </h1>
          </div>
          <div className="flex flex-col flex-grow flex-shrink bg-[#d2d8dd] w-[10vw] rounded-lg p-[1vw] py-[2vw]">
            <h1 className="text-xl text-center">Total pending tasks</h1>
            <h1 className="text-5xl font-bold text-center">
              {Array.isArray(userData.tasks)
                ? userData.tasks.length
                : 0}
            </h1>
          </div>
          <div className="flex flex-col flex-grow flex-shrink bg-[#d2d8dd] w-[10vw] rounded-lg p-[1vw] py-[2vw]">
            <h1 className="text-xl text-center">Toatal Task Completed</h1>
            <h1 className="text-5xl font-bold text-center">
              {userData.taskscompleted}
            </h1>
          </div>
        </div>
        <div>
          <div>
            <h1 className="text-2xl py-3 font-medium"> Projects </h1>
          </div>
          <div className="w-full p-[2vw] scrollremove rounded-lg bg-[#d2d8dd] max-h-[40vh] overflow-x-scroll flex gap-3 justify-start items-start border-black">
            {Array.isArray(userData.projects) ? (
              !userData.projects.length == 0 ? (
                userData.projects.map((e, i) => {
                  return <TaskCard key={`task${i}`} task={e} />;
                })
              ) : (
                <div>No Project Added Yet</div>
              )
            ) : (
              <div>No Project Added Yet</div>
            )}
          </div>
          <div className="py-5 flex gap-5 w-full">
            <div className="flex flex-col flex-grow flex-shrink bg-[#d2d8dd] w-[10vw] rounded-lg p-[1vw] py-[2vw]">
              <h1 className="text-xl text-center">Total tasks</h1>
              <h1 className="text-5xl font-bold text-center">
                {Array.isArray(userData.Projects)
                  ? userData.Projects.length + userData.projectscompleted
                  : 0}
              </h1>
            </div>
            <div className="flex flex-col flex-grow flex-shrink bg-[#d2d8dd] w-[10vw] rounded-lg p-[1vw] py-[2vw]">
              <h1 className="text-xl text-center">Toatal Task Completed</h1>
              <h1 className="text-5xl font-bold text-center">
                {userData.projectscompleted}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashPortal;
