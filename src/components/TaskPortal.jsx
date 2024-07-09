import React, { useContext, useEffect, useState } from "react";
import { context } from "../Dashboard";
import { motion, AnimatePresence } from "framer-motion";
import AddtaskForm from "./AddtaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import TaskCard from "./TaskCard.jsx";
import { ManageTask } from "./ManagableTaskCard.jsx";

const TaskPortal = () => {
  const [userData, setUserData, fetchUserData] = useContext(context);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchedFor, setSearchedFor] = useState("");

  const addTaskHandler = () => {
    setShowAddTaskForm(true);
    fetchUserData();
  };

  // useEffect(() => {
  //   fetchUserData();
  // });

  const handleSearchForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://thunderous-bombolone-3f2d11.netlify.app//task/get/${searchedFor}`
      );
      setSearchResult(response.data);
      if (!response.data.length == 0) {
        setShowSearchResult(true);
        toast.success("Task found");
      }
    } catch (error) {
      toast.error("Task not found");
    }
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

      {/* <div className="h-full">
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
      </div> */}
      <div className="h-full">
        <div className="flex justify-between items-center my-3">
          <h1 className="text-2xl py-3 px-5 font-medium ">All our Tasks</h1>
          <form onSubmit={handleSearchForm} className="w-1/2" action="">
            <input
              type="text"
              placeholder="search for task"
              value={searchedFor}
              onChange={(e) => setSearchedFor(e.target.value)}
              className="bg-[#d2d8dd] focus:outline-none p-3 px-5 rounded-s-lg w-[85%]"
            />

            <button
              className="bg-[#d2d8dd] p-3 rounded-e-lg w-[15%]"
              type="submit"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        {showSearchResult && (
          <div className="w-full scrollremove rounded-lg bg-[#d2d8dd] duration-500 border-black">
            <h1 className="text-2xl p-5 px-[2vw] font-medium ">
              Searched Tasks
            </h1>
            <div className="w-full p-[2vw] scrollremove pt-0 rounded-lg bg-[#d2d8dd] flex-wrap flex gap-3 justify-start items-start border-black">
              {!searchResult.length == 0 ? (
                searchResult.map((e, i) => {
                  if (e.taskowner === userData._id) {
                    return (
                      <ManageTask
                        key={`task${i}`}
                        glow={false}
                        urgentTask={e}
                        role={"owner"}
                      />
                    );
                  } else if (e.taskcollaborators.includes(userData._id)) {
                    return (
                      <ManageTask
                        key={`task${i}`}
                        urgentTask={e}
                        glow={false}
                        role={"collaborator"}
                      />
                    );
                  } else {
                    return (
                      <ManageTask
                        key={`task${i}`}
                        urgentTask={e}
                        glow={true}
                        role={"viewer"}
                      />
                    );
                  }
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
        <div className="w-full p-[2vw] scrollremove justify-center rounded-lg bg-[#d2d8dd] flex-wrap flex gap-3 justify-start items-start border-black">
          {showAddTaskForm && (
            <AnimatePresence>
              <AddtaskForm setShow={setShowAddTaskForm} userDAta={userData} />
            </AnimatePresence>
          )}
          {
            // userData == undefined? (()=>{fetchUserData(); return<h1>loading ......</h1>}):
            Array.isArray(userData.tasks) ? (
              !userData.tasks.length == 0 ? (
                userData.tasks.map((e, i) => {
                  return (
                    // <ManagableTaskCard
                    //   key={`task${i}`}
                    //   task={e}
                    //   condition={false}
                    // />
                    <TaskCard
                      key={`task${i}`}
                      task={e}
                      urgent={false}
                      type={"manage"}
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
