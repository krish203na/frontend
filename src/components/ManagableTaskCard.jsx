import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { context } from "../Dashboard";


const ManagableTaskCard = ({ task, condition }) => {
  const [urgentTask, setUrgentTask] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`https://backend-pgv8.onrender.com/task/${task}`);
        setUrgentTask(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTask();
  }, [urgentTask]);

  if (condition) {
    if (urgentTask.taskpriority === "high")
      return <ManageTask glow={true} urgentTask={urgentTask} />;
  } else {
    return <ManageTask glow={false} urgentTask={urgentTask} />;
  }
};

export default ManagableTaskCard;

const ManageTask = ({ urgentTask,glow }) => {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       exit={{ opacity: 0 }}
  //       className="bg-[#626dfb] glowdiv relative text-wrap min-w-[24vw] h-[30vh] flex-grow flex-shrink rounded-lg p-3 text-white"
  //     >
  //       {/* <div className="flex px-3 justify-between items-center h-[20%]"> */}
  //         <h1 className="text-xl px-3 font-bold uppercase">
  //           {urgentTask.taskname}
  //         </h1>
  //         {/* <button className="bg-[#e3e9ef] rounded-lg text-[#626dfb] p-1 px-2">
  //           complete
  //         </button>
  //       </div> */}
  //       <p className="h-[50%] px-3 flex text-gray-300 truncate">
  //         {urgentTask.taskdescription}
  //       </p>
  //       <div className="flex px-3 justify-between items-center h-[30%]">
  //         <p>{`end date-: ${urgentTask.taskend}`}</p>
  //         <button className="bg-[#e3e9ef] hover:bg-blue-700 duration-200 hover:text-white rounded-lg text-[#626dfb] p-1 px-2">
  //           manage
  //         </button>
  //       </div>
  //     </motion.div>
  //   );

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
        `https://backend-pgv8.onrender.com/task/delete/${urgentTask._id}`,
        {
          //   taskstatus: "completed",
          //   taskpriority:"low"
        }
      );
      const response2 = await axios.put(
        `https://backend-pgv8.onrender.com/user/update/${userData._id}`,
        {
          taskscompleted: userData.taskscompleted + 1,
        }
      );
      fetchUserData();
      socket.emit("send_message", {
          message: `${urgentTask.taskname} Task is Deleted`,
        });
        alert("Task completed successfully");
      //   toast.success("Task completed successfully");
      //   onClose();
    } catch (error) {
      alert("error !!!!");
      toast.error("Error Completing task");
      console.error(error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`bg-[#626dfb] ${glow ? "glowdiv": ""} relative text-wrap min-w-[24vw] h-[30vh] flex-grow flex-shrink rounded-lg p-3 text-white`}
        // className="bg-[#626dfb] glowdiv relative text-wrap min-w-[24vw] h-[30vh] flex-grow flex-shrink rounded-lg p-3 text-white"
      >
        <div className="flex justify-between max-w-[100%] max-h-[20%] overflow-hidden">
          <h1 className="text-xl w-[50%] px-3 font-bold uppercase">
            {urgentTask.taskname}
          </h1>
          <button
            onClick={handleCompleteClick}
            className="bg-[#e3e9ef] flex gap-2 hover:bg-green-500 duration-200 hover:text-white rounded-lg text-[#626dfb] p-1 px-2"
          >
            <i className="fa-solid fa-badge-check text-xl"></i>
            <h1>done</h1>
            {/* complete */}
          </button>
        </div>
        <p className="h-[50%] px-3 flex text-gray-300 truncate">
          {urgentTask.taskdescription}
        </p>
        <div className="flex px-3 justify-between items-center h-[30%]">
          <p>{`end date-: ${urgentTask.taskend}`}</p>
          <button
            onClick={handleEditClick}
            className="bg-[#e3e9ef] hover:bg-blue-700 duration-200 hover:text-white rounded-lg text-[#626dfb] p-1 px-2"
          >
            Manage
          </button>
        </div>
      </motion.div>
      {showModal && (
        <TaskModal urgentTask={urgentTask} onClose={handleCloseModal} />
      )}
    </>
  );
};

export { ManageTask };

// TaskModal.jsx

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
      socket.emit("send_message", {
        message: `${taskName} this Task is Updated`,
      });
      onClose();
    } catch (error) {
      toast.error("Error updating task");
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
  // const [capturedUser, setCapturedUser] = useState()
  //   const fetchCollaboratorIdToShow = async (collaboratorId) => {
  //     try {
  //       const response = await axios.get(
  //         `https://backend-pgv8.onrender.com/user/id/${collaboratorId}`
  //       );
  //       setCapturedUser(response.data.data)
  //       console.log(response.data.fullname);
  //       // return response.data.fullname;
  //     } catch (error) {
  //       alert(error);
  //       console.log(error);
  //     }
  //     // return null
  //   };

  const handleCollaboratorFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://backend-pgv8.onrender.com/user/${collaboratorId}`,
        {
          //  params: {
          //    query: collaboratorId,
          //  },
        }
      );
      setSearchedUser(response.data);
      setShowCollaborator(true);

      setSearchResults(response.data);
      //  setCollaborators((prevCollaborators) => [
      //    ...prevCollaborators,
      //    response.data._id,
      //  ]);
    } catch (error) {
      alert("Collaborator not found");
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
          className="bg-[#626dfb] scrollline max-h-[90vh] overflow-y-scroll p-6 rounded-lg shadow-lg w-1/3"
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
                className="mt-1 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline p-2 rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="mt-1 p-2 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
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
                className="mt-1 p-2 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
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
            {/* Add Collaborator Button */}
            <div className="w-full ">
              <div className="w-full p-3">
                {collaborators.length > 0 && (
                  <div className="text-white">
                    <label className="block text-sm font-medium">
                      Existing Collaborators:
                    </label>
                    {/* <div className="flex flex-wrap gap-2 mt-1">
                      {collaborators.map((collaboratorId, i) =>{
                        fetchCollaboratorIdToShow(collaboratorId)
                        return (
                          <div
                            key={`${collaboratorId}-${i}`}
                            className="bg-gray-700 px-2 py-1 rounded-md text-sm"
                          >
                            <h1>{capturedUser}</h1>
                          </div>
                        )
                      })}
                    </div> */}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <div
                className="bg-green-500 text-center cursor-pointer w-full hover:bg-green-700 duration-200 text-white font-bold py-1 px-3 rounded"
                onClick={handleAddCollaboratorClick}
              >
                <i className="fa-solid fa-user-group px-2"></i> Add
                Collaborators
              </div>
            </div>
            <div className="flex gap-5 justify-center">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 duration-200 text-white font-bold py-1 px-3 rounded"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-red-500 hover:bg-red-700 duration-200 text-white font-bold py-1 px-3 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
          <ToastContainer />
        </motion.div>

        {/* Collaborator Form */}
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
              className="bg-[#626dfb] scrollline max-h-[90vh] overflow-y-scroll p-6 rounded-lg shadow-lg w-1/3"
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
                    className="mt-1 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline p-2 rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div className="flex gap-5 justify-center">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 duration-200 text-white font-bold py-1 px-3 rounded"
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
        <div className="absolute w-screen h-screen top-0 left-0 flex justify-center z-[100] backdrop-blur">
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

// const TaskModal = ({ urgentTask, onClose }) => {
//   const [taskName, setTaskName] = useState(urgentTask.taskname);
//   const [taskDescription, setTaskDescription] = useState(
//     urgentTask.taskdescription
//   );
//   const [taskEnd, setTaskEnd] = useState(urgentTask.taskend);
//   const [comments, setComments] = useState(urgentTask.taskcomments);
//   const [collaborators, setCollaborators] = useState(urgentTask.taskcollaborators);
//   const [taskPriority, setTaskPriority] = useState(urgentTask.taskpriority);
//   const [taskStatus, setTaskStatus] = useState(urgentTask.taskstatus);
//   const [isCollaboratorFormVisible, setIsCollaboratorFormVisible] =
//     useState(false);
//   const [collaboratorId, setCollaboratorId] = useState("");
//   const [searchResults, setSearchResults] = useState({});
//   const [searcedUser, setSearchedUser] = useState(null);
//   const [showCollaborator, setShowCollaborator] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`https://backend-pgv8.onrender.com/task/update/${urgentTask._id}`, {
//         taskname: taskName,
//         taskdescription: taskDescription,
//         taskend: taskEnd,
//         taskcomments: comments,
//         taskcollaborators: collaborators,
//         taskpriority: taskPriority,
//         taskstatus: taskStatus,
//       });
//       toast.success("Task updated successfully");
//       onClose();
//     } catch (error) {
//       toast.error("Error updating task");
//       console.error(error);
//     }
//   };

//   const handleAddCollaboratorClick = () => {
//     setIsCollaboratorFormVisible(true);
//   };

//   const handleCollaboratorFormClose = () => {
//     setIsCollaboratorFormVisible(false);
//     setCollaboratorId(""); // Reset collaborator ID
//     setSearchResults([]); // Reset search results
//   };

//   const handleCollaboratorFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(
//         `https://backend-pgv8.onrender.com/user/${collaboratorId}`
//       );
//       setSearchedUser(response.data);
//       setShowCollaborator(true);

//       setSearchResults(response.data);
//     } catch (error) {
//       alert("Collaborator not found");
//     }
//   };

//   const handleAddCollaborator = () => {
//     if (!collaborators.some((collaborator) => collaborator === searcedUser._id)) {
//       setCollaborators((prevCollaborators) => [...prevCollaborators, searcedUser._id]);
//     }
//     setShowCollaborator(false);
//   };

//   const handleCancelAddCollaborator = () => {
//     setShowCollaborator(false);
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="absolute inset-0 flex items-center justify-center backdrop-blur"
//       >
//         <motion.div
//           initial={{ y: "-100vh" }}
//           animate={{ y: 0 }}
//           exit={{ y: "-100vh" }}
//           className="bg-[#626dfb] max-h-[90vh] overflow-y-scroll p-6 rounded-lg shadow-lg w-1/3"
//         >
//           <h2 className="text-2xl font-bold mb-4 text-white">Manage Task</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-300">
//                 Task Name
//               </label>
//               <input
//                 type="text"
//                 value={taskName}
//                 onChange={(e) => setTaskName(e.target.value)}
//                 className="mt-1 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline p-2 rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-white">
//                 Task Description
//               </label>
//               <textarea
//                 value={taskDescription}
//                 onChange={(e) => setTaskDescription(e.target.value)}
//                 className="mt-1 p-2 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-white">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 value={taskEnd}
//                 onChange={(e) => setTaskEnd(e.target.value)}
//                 className="mt-1 p-2 block w-full border focus:outline-dashed outline-gray-300 focus:shadow-outline rounded-md border-gray-300 bg-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-white">
//                 Task Priority
//               </label>
//               <div className="flex items-center text-white">
//                 <input
//                   type="radio"
//                   id="high"
//                   name="taskPriority"
//                   value="high"
//                   checked={taskPriority === "high"}
//                   onChange={(e) => setTaskPriority(e.target.value)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="high" className="mr-4">
//                   High
//                 </label>
//                 <input
//                   type="radio"
//                   id="moderate"
//                   name="taskPriority"
//                   value="moderate"
//                   checked={taskPriority === "moderate"}
//                   onChange={(e) => setTaskPriority(e.target.value)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="moderate" className="mr-4">
//                   Moderate
//                 </label>
//                 <input
//                   type="radio"
//                   id="low"
//                   name="taskPriority"
//                   value="low"
//                   checked={taskPriority === "low"}
//                   onChange={(e) => setTaskPriority(e.target.value)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="low">Low</label>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-white">
//                 Task Status
//               </label>
//               <div className="flex items-center text-white">
//                 <input
//                   type="radio"
//                   id="running"
//                   name="taskStatus"
//                   value="running"
//                   checked={taskStatus === "running"}
//                   onChange={(e) => setTaskStatus(e.target.value)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="running" className="mr-4">
//                   Running
//                 </label>
//                 <input
//                   type="radio"
//                   id="terminated"
//                   name="taskStatus"
//                   value="terminated"
//                   checked={taskStatus === "terminated"}
//                   onChange={(e) => setTaskStatus(e.target.value)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="terminated" className="mr-4">
//                   Terminated
//                 </label>
//                 <input
//                   type="radio"
//                   id="completed"
//                   name="taskStatus"
//                   value="completed"
//                   checked={taskStatus === "completed"}
//                   onChange={(e) => setTaskStatus(e.target.value)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="completed">Completed</label>
//               </div>
//             </div>
//             {/* Display Existing Collaborators */}
//             {collaborators.length > 0 && (
//               <div className="text-white">
//                 <label className="block text-sm font-medium">
//                   Existing Collaborators:
//                 </label>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {collaborators.map((collaboratorId,i) => (
//                     <div
//                       key={`${collaboratorId}-${i}`}
//                       className="bg-gray-700 px-2 py-1 rounded-md text-sm"
//                     >
//                       {collaboratorId}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* Add Collaborator Button */}
//             <div className="w-full">
//               <div className="bg-green-500 text-center cursor-pointer w-full hover:bg-green-700 duration-200 text-white font-bold py-1 px-3 rounded" onClick={handleAddCollaboratorClick}>
//                 <i className="fa-solid fa-user-group px-2"></i> Add Collaborators
//               </div>
//             </div>
//             <div className="flex gap-5 justify-center">
//               <button
//                 type="submit"
//                 className="bg-green-500 hover:bg-green-700 duration-200 text-white font-bold py-1 px-3 rounded"
//               >
//                 Submit
//               </button>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="bg-red-500 hover:bg-red-700 duration-200 text-white font-bold py-1 px-3 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//       <ToastContainer />
//     </>
//   );
// };

// export {TaskModal};
