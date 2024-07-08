import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { context } from "../Dashboard";

const AddtaskForm = ({ setShow, userDAta }) => {
  const [userData, setUserData, fetchUserData, socket] = useContext(context);

  const [taskHeading, setTaskHeading] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskMembers, setTaskMembers] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskHeading || !taskDescription || !taskPriority || !taskDeadline) {
      toast.warning("Please fill in all required fields");
      return;
    }
    // Handle form submission
    try {
      const responce = await axios.post("https://backend-pgv8.onrender.com/task/make", {
        taskid: `${taskHeading.substring(0, 4)}+${taskDescription.substring(
          0,
          4
        )}+${userDAta.userid.substring(6, 11)}+${new Date().getTime()}`,
        taskname: taskHeading,
        taskdescription: taskDescription,
        taskpriority: taskPriority,
        taskstatus: "running",
        taskend: taskDeadline,
        taskowner: userDAta._id,
      });

      setShow(false);
      socket.emit("send_message", {
        message: `${taskHeading} this Task is Created By ${userData.fullname}`,
      });
      toast.success("Task Added Successfully !");
      fetchUserData();
    } catch (error) {
      toast.error(error);
    }
    // Clear the form
    setTaskHeading("");
    setTaskDescription("");
    setTaskPriority("");
    setTaskDeadline("");
    setTaskMembers("");
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full border-black z-50 bg-transparent backdrop-blur">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className="max-w-[40vw] z-50 left-[50%] gap-3 mx-auto text-white p-4 shadow-md rounded-lg w-[100%] max-h-[25vw] bg-[#626dfb]"
      >
        <div className="flex font-bold justify-between items-center">
          <h1 className="font-bold text-xl">Add Task</h1>
          <div className="flex items-center gap-3 justify-between">
            <button
              type="submit"
              className="bg-white hover:bg-blue-700 text-blue-500 duration-500 hover:text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              Add Task
            </button>
            <button
              onClick={handleCancel}
              className="bg-white hover:bg-blue-700 text-blue-500 duration-500 hover:text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              cancel
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="taskHeading"
            placeholder="Task heading"
            value={taskHeading}
            onChange={(e) => setTaskHeading(e.target.value)}
            className=" appearance-none border-b bg-transparent placeholder:text-white text-white rounded w-full py-2 px-3  leading-tight focus:outline-none "
          />
        </div>
        <div className="mb-4">
          <textarea
            id="taskDescription"
            value={taskDescription}
            placeholder="Task Description"
            onChange={(e) => setTaskDescription(e.target.value)}
            className="appearance-none border-b rounded w-full py-2 px-3 bg-transparent placeholder:text-white text-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4 flex gap-2 justify-between ">
          <label className="block text-white text-sm font-bold mb-2">
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
        <div className="mb-4 flex justify-between">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="taskDeadline"
          >
            Task Deadline
          </label>
          <input
            type="date"
            id="taskDeadline"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            className="shadow appearance-none bg-transparent placeholder:text-white text-white border-b rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="taskMembers"
          >
            Add Members (Optional)
          </label>
          <input
            type="text"
            id="taskMembers"
            value={taskMembers}
            onChange={(e) => setTaskMembers(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div> */}
        {/* <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Task
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            cancel
          </button>
        </div> */}
      </motion.form>
    </div>
  );
};

export default AddtaskForm;
