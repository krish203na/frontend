import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { context } from "../Dashboard";
import TaskDetails from "./TaskDetails";

const ManageTask = ({ urgentTask, glow, role }) => {
  const [userData, setUserData, fetchUserData, socket] = useContext(context);
  const [showModal, setShowModal] = useState(false);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCompleteClick = async () => {
    try {
      const response = await axios.delete(
        `https://backend-pgv8.onrender.com/task/delete/${urgentTask._id}`
      );
      const response2 = await axios.put(
        `https://backend-pgv8.onrender.com/user/update/${userData._id}`,
        {
          taskscompleted: userData.taskscompleted + 1,
        }
      );
      toast.success("Task completed successfully");
      fetchUserData();
      socket.emit("send_message", {
        message: `${urgentTask.taskname} Task is Completed`,
      });
    } catch (error) {
      toast.error("Error Completing task");
      console.error(error);
    }
  };


  const [showDetail, setShowDetail] = useState(false);

  const handleClick = () => {
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  return (
    <>
      {showDetail && (
        <div className="w-screen rounded-xl h-screen backdrop-blur flex justify-center items-center z-50 top-0 right-0 fixed">
          <TaskDetails
            key={`user${urgentTask.taskname}`}
            closeDetail={closeDetail}
            task={urgentTask}
            role={role}
            handleEditClick={handleEditClick}
            handleCompleteClick={handleCompleteClick}
          />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // onClick={handleClick}
        className={`bg-[#39393b] ${
          glow ? "glowdiv" : ""
        } relative text-wrap truncate min-w-[20vw] lg:max-w-[50%] max-w-[80%] h-[100%] flex-grow flex-shrink rounded-lg p-3 text-white`}
      >
        <div className="flex truncate text-wrap justify-between max-w-[100%] max-h-[20%] overflow-">
          <div
            onClick={handleClick}
            title="see task info"
            className="bg-[#e3e9ef] text-center z-10 duration-200 rounded-lg text-black p-1 px-2"
          >
            <div>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
          <h1
            title={urgentTask.taskname}
            className="text-xl w-[80%] truncate px-3 font-bold uppercase text-ellipsis"
          >
            {urgentTask.taskname}
          </h1>

          <RoleOnTask userData={userData} task={urgentTask} role={role} />
        </div>
        <p className="h-[50%] max-h-[15vh] min-h-[15vh] truncate text-wrap text-ellipsis w-[80%] p-2 px-3 text-gray-300 scrollremove">
          {urgentTask.taskdescription}
        </p>
        <div className="flex pl-3 justify-between items-center h-[30%]">
          <div>
            <p>
              task priority -:
              <span
                className={`${
                  (urgentTask.taskpriority === "high" && "text-red-500") ||
                  (urgentTask.taskpriority === "low" && "text-green-500") ||
                  (urgentTask.taskpriority === "moderate" && "text-yellow-500")
                }`}
              >{` ${urgentTask.taskpriority}`}</span>
            </p>
            <p>{`end date-: ${urgentTask.taskend}`}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEditClick}
              title="Edit"
              className="bg-[#e3e9ef] hover:bg-blue-700 duration-200 hover:text-white rounded-lg text-black p-1 px-2"
            >
              <div>
                <i className="fa-solid fa-pen text-xl"></i>
                <h1 className="text-xs">edit</h1>
              </div>
            </button>
            <button
              onClick={handleCompleteClick}
              className="bg-[#e3e9ef] hover:bg-green-500 duration-200 hover:text-white rounded-lg text-black p-1 px-2"
            >
              <i className="fa-solid fa-badge-check text-xl"></i>
              <h1 className="text-xs">done</h1>
            </button>
          </div>
        </div>
      </motion.div>
      {showModal && (
        <TaskModal urgentTask={urgentTask} onClose={handleCloseModal} />
      )}
    </>
  );
};

export { ManageTask };


const TaskModal = ({ urgentTask, onClose }) => {

  const [userData, setUserData, fetchUserData, socket] = useContext(context);
  const [taskName, setTaskName] = useState(urgentTask.taskname);
  const [taskDescription, setTaskDescription] = useState(
    urgentTask.taskdescription
  );
  const [taskEnd, setTaskEnd] = useState(urgentTask.taskend);
  const [comments, setComments] = useState(urgentTask.taskcomments);
  const [collaborators, setCollaborators] = useState(
    urgentTask.taskcollaborators
  );
  const [taskPriority, setTaskPriority] = useState(urgentTask.taskpriority);
  const [taskStatus, setTaskStatus] = useState(urgentTask.taskstatus);
  const [isCollaboratorFormVisible, setIsCollaboratorFormVisible] =
    useState(false);
  const [collaboratorId, setCollaboratorId] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [searcedUser, setSearchedUser] = useState(null);
  const [showCollaborator, setShowCollaborator] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://backend-pgv8.onrender.com/task/update/${urgentTask._id}`, {
        taskname: taskName,
        taskdescription: taskDescription,
        taskend: taskEnd,
        taskcomments: comments,
        taskcollaborators: collaborators,
        taskpriority: taskPriority,
        taskstatus: taskStatus,
      });
      toast.success("Task added Successfully !");
      socket.emit("send_message", {
        message: `${taskName} this Task is Updated by ${userData.fullname}`,
      });
      onClose();
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  const handleAddCollaboratorClick = () => {
    setIsCollaboratorFormVisible(true);
  };

  const handleCollaboratorFormClose = () => {
    setIsCollaboratorFormVisible(false);
    setCollaboratorId(""); // Reset collaborator ID
    setSearchResults([]); // Reset search results
  };

  const handleCollaboratorFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://backend-pgv8.onrender.com/user/${collaboratorId}`
      );
      toast.success("Collaborator found");
      setSearchedUser(response.data);
      setShowCollaborator(true);

      setSearchResults(response.data);
    } catch (error) {
      toast.error("Collaborator not found");
    }
  };

  const handleit = () => {
    setShowCollaborator(false);
  };

  const handleadd = () => {
    if (
      !collaborators.some((collaborator) => collaborator === searcedUser._id)
    ) {
      setCollaborators((prevCollaborators) => [
        ...prevCollaborators,
        searcedUser._id,
      ]);
    }
    setShowCollaborator(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className=" overflow-hidden fixed h-full z-50 inset-0 flex items-center justify-center backdrop-blur"
      >
        <motion.div
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          exit={{ y: "-100vh" }}
          className="bg-[#39393b] scrollline max-h-[100vh] overflow-y-scroll p-6 px-10 rounded-xl shadow-lg w-2/5"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Manage Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="mt-1 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline p-2 rounded-md border-gray-600 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="mt-1 p-2 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline rounded-md border-gray-600 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                End Date
              </label>
              <input
                type="date"
                value={taskEnd}
                onChange={(e) => setTaskEnd(e.target.value)}
                className="mt-1 p-2 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline rounded-md border-gray-600 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Task Priority
              </label>
              <div className="flex items-center text-white">
                <input
                  type="radio"
                  id="high"
                  name="taskPriority"
                  value="high"
                  checked={taskPriority === "high"}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="high" className="mr-4">
                  High
                </label>
                <input
                  type="radio"
                  id="moderate"
                  name="taskPriority"
                  value="moderate"
                  checked={taskPriority === "moderate"}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="moderate" className="mr-4">
                  Moderate
                </label>
                <input
                  type="radio"
                  id="low"
                  name="taskPriority"
                  value="low"
                  checked={taskPriority === "low"}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="low">Low</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Task Status
              </label>
              <div className="flex items-center text-white">
                <input
                  type="radio"
                  id="running"
                  name="taskStatus"
                  value="running"
                  checked={taskStatus === "running"}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="running" className="mr-4">
                  Running
                </label>
                <input
                  type="radio"
                  id="terminated"
                  name="taskStatus"
                  value="terminated"
                  checked={taskStatus === "terminated"}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="terminated" className="mr-4">
                  Terminated
                </label>
                <input
                  type="radio"
                  id="completed"
                  name="taskStatus"
                  value="completed"
                  checked={taskStatus === "completed"}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="completed">Completed</label>
              </div>
            </div>
            <div className="w-full">
              <div
                className=" text-center cursor-pointer w-full bg-white hover:bg-green-500 hover:text-white duration-200 text-black font-bold py-1 px-3 rounded"
                onClick={handleAddCollaboratorClick}
              >
                <i className="fa-solid fa-user-group px-2"></i> Add
                Collaborators
              </div>
            </div>
            <div className="flex gap-5 justify-center">
              <button className="bg-white hover:bg-green-500 hover:text-white duration-200 text-black font-bold py-1 px-3 rounded">
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hover:bg-red-500 bg-white hover:text-white duration-200 text-black font-bold py-1 px-3 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

        {isCollaboratorFormVisible && (
          <motion.div
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "-100vh" }}
            className="absolute max-h-[100vh] z-50 inset-0 flex items-center justify-center backdrop-blur"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "-100vh" }}
              className="bg-[#39393b] scrollline max-h-[90vh] overflow-y-scroll p-6 rounded-lg shadow-lg w-1/3"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">
                Add Collaborator
              </h2>
              <form
                onSubmit={handleCollaboratorFormSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Collaborator ID, Username, Full Name or Email
                  </label>
                  <input
                    type="text"
                    value={collaboratorId}
                    onChange={(e) => setCollaboratorId(e.target.value)}
                    className="mt-1 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline p-2 rounded-md border-gray-600 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div className="flex gap-5 justify-center">
                  <button
                    type="submit"
                    className="hover:bg-green-500 bg-white duration-200 text-black font-bold py-1 px-3 rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleCollaboratorFormClose}
                    className="bg-red-500 hover:bg-red-700 duration-200 text-white font-bold py-1 px-3 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {showCollaborator ? (
        <div className="fixed w-screen h-screen top-0 left-0 flex justify-center z-[100] backdrop-blur">
          <div className=" p-5 max-h-[18%] bg-white rounded-lg mt-5 text-black">
            <h1 className="p-2">{searcedUser.fullname} this side</h1>
            <div className="w-full flex justify-between">
              <button
                className="bg-green-500 duration-300 text-white p-1 min-w-[7vw] rounded-lg hover:bg-green-700 "
                onClick={handleadd}
              >
                add
              </button>
              <button
                onClick={handleit}
                className="bg-red-500 duration-300 text-white p-1 min-w-[7vw] rounded-lg hover:bg-red-700 "
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export { TaskModal };


const RoleOnTask = ({task, userData, role}) => {

  

  if (role === "owner") {
    return (
      <div
        title="Your are a creator of this task"
        className="bg-[#e3e9ef] text-center right-3 top-3 absolute inline-block z-10 duration-200 rounded-lg text-black p-1 px-2"
      >

        <div>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
    );
  } 
  else if (
    role === "collaborator"
  ) {
    return (
      <div
        title="Your are a Collaborator of this task"
        className="bg-[#e3e9ef] text-center right-3 top-3 absolute z-10 duration-200 rounded-lg text-black p-1 px-2"
      >
        <div>
          <i className="fa-solid fa-user-group text-xl"></i>{" "}
        </div>
      </div>
    );
  }else if(role === "viewer"){
     return (
       <div
         title="Your are a Viewer of this task"
         className="bg-[#e3e9ef] text-center right-3 top-3 absolute z-10 duration-200 rounded-lg text-black p-1 px-2"
       >
         <div>
           <i className="fa-solid fa-eye"></i>
         </div>
       </div>
     );
  }
  return(
    <div></div>
  )

}

export {RoleOnTask}