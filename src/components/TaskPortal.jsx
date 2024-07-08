import React, { useContext, useEffect, useState } from "react";
import { context } from "../Dashboard";
import { motion, AnimatePresence } from "framer-motion";
import AddtaskForm from "./AddtaskForm";
import TaskCard from "./TaskCard";
import ManagableTaskCard from "./ManagableTaskCard.jsx";

const TaskPortal = () => {
  const [userData, setUserData, fetchUserData] = useContext(context);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

    const addTaskHandler = () => {
      setShowAddTaskForm(true);
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
            Welcome to Task Board !
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
        <h1 className="text-2xl py-3 font-medium">High Priority Task</h1>
        <div className="w-full p-[2vw] scrollremove rounded-lg bg-[#d2d8dd] max-h-[40vh] overflow-x-scroll flex gap-3 justify-start items-start border-black">
          {showAddTaskForm && (
            <AnimatePresence>
              <AddtaskForm setShow={setShowAddTaskForm} userDAta={userData} />
            </AnimatePresence>
          )}
          {
            // userData == undefined? ((<h1>loading ......</h1>)):
            Array.isArray(userData.tasks) ? (
              !userData.tasks.length == 0 ? (
                userData.tasks.map((e, i) => {
                  return (
                    <ManagableTaskCard
                      key={`task${i}`}
                      task={e}
                      condition={true}
                    />
                  );
                })
              ) : (
                <div>No Task Added Yet</div>
              )
            ) : (
              <div>No Task Added Yet</div>
            )
          }
        </div>
      </div>
      <div className="h-full">
        <h1 className="text-2xl py-3 font-medium">All your Tasks</h1>
        <div className="w-full p-[2vw] scrollremove rounded-lg bg-[#d2d8dd] flex-wrap flex gap-3 justify-start items-start border-black">
          {showAddTaskForm && (
            <AnimatePresence>
              <AddtaskForm setShow={setShowAddTaskForm} userDAta={userData} />
            </AnimatePresence>
          )}
          {
            // userData == undefined? ((<h1>loading ......</h1>)):
            Array.isArray(userData.tasks) ? (
              !userData.tasks.length == 0 ? (
                userData.tasks.map((e, i) => {
                  return (
                    <ManagableTaskCard
                      key={`task${i}`}
                      task={e}
                      condition={false}
                    />
                  );
                })
              ) : (
                <div>No Task Added Yet</div>
              )
            ) : (
              <div>No Task Added Yet</div>
            )
          }
        </div>
      </div>
    </motion.div>
  );
};

export default TaskPortal;
