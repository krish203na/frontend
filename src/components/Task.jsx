import React, {useContext} from 'react'
import { motion } from 'framer-motion';
import { context } from "../Dashboard";
import axios from 'axios';
import { toast } from 'react-toastify';

const Task = ({ taskDetail }) => {
  const [userData, setUserData, fetchUserData, socket] = useContext(context);

  const handleCompleteClick = async () => {
    try {
      const response = await axios.delete(
        `https://backend-pgv8.onrender.com/task/delete/${taskDetail._id}`,
        {
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
        message: `${taskDetail.taskname} Task is Deleted`,
      });
      toast.success("Task completed successfully");
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#39393b] glowdiv relative text-wrap min-w-[24vw] h-[30vh] flex-grow flex-shrink rounded-lg p-3 text-white"
    >
      <h1 className="text-xl px-3 font-bold uppercase h-[20%]">
        {taskDetail.taskname}
      </h1>
      <p className="h-[50%] px-3 flex text-gray-300 truncate">
        {taskDetail.taskdescription}
      </p>
      <div className="flex px-3 justify-between items-center h-[30%]">
        <p>{`end date-: ${taskDetail.taskend}`}</p>
        <button
          onClick={handleCompleteClick}
          className="bg-[#e3e9ef] flex gap-2 hover:bg-green-500 duration-200 hover:text-white rounded-lg text-black p-1 px-2"
        >
          <i className="fa-solid fa-badge-check text-xl"></i>
          <h1>done</h1>
        </button>
      </div>
    </motion.div>
  );
};

export default Task
