import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { RoleOnTask } from "./ManagableTaskCard";
import { context } from "../Dashboard";
import { toast } from "react-toastify";

const TaskDetails = ({
  task,
  role,
  handleEditClick,
  handleCompleteClick,
  closeDetail,
}) => {
  const [userData, setUserData, fetchUserData, socket] = useContext(context);
  const [taskOwner, setTaskOwner] = useState({});
  const [collab, setCollab] = useState({});
  const [collaborators, setCollaborators] = useState([]);

  const fetchuserData = async (owner) => {
    try {
      const response = await axios.get(
        `https://backend-pgv8.onrender.com/user/id/${owner}`
      );
      setTaskOwner(response.data);
      setCollab(response.data.taskcollaborators);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchuserData(task.taskowner);
  }, []);

  const handleSubmit = async () => {
    console.log(task.taskcollaborators);
    console.log(collaborators);
    

    if (!collab.some((collaborator) => collaborator === userData._id)) {
      const updatedCollaborators = [...task.taskcollaborators, task.taskowner];
      setCollaborators(updatedCollaborators);
      console.log(updatedCollaborators);
    }

    console.log(task.taskcollaborators);
    try {
      await axios.put(`https://backend-pgv8.onrender.com/task/update/${task._id}`, {
        taskcollaborators: collaborators,
      });
      socket.emit("send_message", {
        message: `${task.taskName} this Task is Updated by ${userData.fullname}`,
      });
      toast.success("Task updated successfully!");
      console.log("added")
    } catch (error) {
      toast.error(error);
      console.error("error");
    }
  };

  return (
    <div className="w-[80%] h-[90%] inline-flex rounded-xl bg-[#39393b] overflow-hidden">
      <div className="w-[30%] bg-black text-white rounded-xl flex flex-col items-center p-4">
        <div
          className="p-3 bgtransperent text-3xl w-full text-left text-white"
          onClick={closeDetail}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <h1 className="text-3xl font-semibold p-2">{taskOwner.fullname}</h1>
        <h1 className="text-md font-base p-2 hover:underline">
          <a href={`mailto:${taskOwner.email}`}>{taskOwner.email}</a>
        </h1>

        <div className="py-2 flex flex-wrap w-full">
          <div className="flex flex-col flex-grow flex-shrink  w-[10vw] rounded-lg p-[1vw] py-[2vw]">
            <h1 className="text-md  text-center">Task owner Total tasks</h1>
            <h1 className="text-3xl font-semibold text-center">
              {Array.isArray(taskOwner.tasks)
                ? taskOwner.tasks.length + taskOwner.taskscompleted
                : 0}
            </h1>
          </div>

          <div className="flex flex-col flex-grow flex-shrink  w-[10vw] rounded-lg p-[1vw] py-[2vw]">
            <h1 className="text-md  text-center">Total Task Completed</h1>
            <h1 className="text-3xl font-semibold text-center">
              {taskOwner.taskscompleted}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-[70%] overflow-hidden p-5 bg-[#39393b] rounded-r-xl text-white">
        <div className="h-[15%] relative flex items-center">
          <h1 className="p-3 text-4xl font-semibold">{task.taskname}</h1>

          <RoleOnTask userData={taskOwner} task={task} role={role} />
        </div>
        <hr />
        <div className="w-full h-[50%]">
          <p className="p-3 w-full">{task.taskdescription}</p>
        </div>
        <div className="h-[30%] flex justify-between items-center">
          <div className="text-lg">
            <h1>end date -: {task.taskend}</h1>
            <h1>priority -: {task.taskpriority}</h1>
            <h1>status -: {task.taskstatus}</h1>
            <h1>Our role -: {role}</h1>
          </div>
          <div>
            {role === "owner" && (
              <div className="flex gap-5">
                <button
                  onClick={handleEditClick}
                  title="Edit"
                  className="bg-[#e3e9ef] hover:bg-blue-700 duration-200 hover:text-white rounded-lg text-black p-2 px-3"
                >
                  <div>
                    <i className="fa-solid fa-pen text-3xl"></i>
                    <h1 className="text-lg">edit</h1>
                  </div>
                </button>
                <button
                  onClick={()=>(handleCompleteClick(),closeDetail())}
                  className="bg-[#e3e9ef] hover:bg-green-500 duration-200 hover:text-white rounded-lg text-black p-1 px-2"
                >
                  <i className="fa-solid fa-badge-check text-3xl"></i>
                  <h1 className="text-lg">done</h1>
                </button>
              </div>
            )}
            {role === "collaborator" && (
              <button
                onClick={handleEditClick}
                title="Edit"
                className="bg-[#e3e9ef] hover:bg-blue-700 duration-200 hover:text-white rounded-lg text-black p-2 px-3"
              >
                <div>
                  <i className="fa-solid fa-pen text-3xl"></i>
                  <h1 className="text-lg">edit</h1>
                </div>
              </button>
            )}
            {role === "viewer" && (
              <button
                onClick={handleSubmit}
                title="Edit"
                className="bg-[#e3e9ef] hover:bg-blue-700 duration-200 hover:text-white rounded-lg text-black p-2 px-3"
              >
                <div>
                  <i className="fa-solid fa-user-group text-3xl"></i>
                  <h1 className="text-lg">collaborate</h1>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
