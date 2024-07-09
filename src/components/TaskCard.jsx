import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import Task from "./Task";
import { ManageTask } from "./ManagableTaskCard";
import { context } from "../Dashboard";

const TaskCard = ({ task, urgent, type }) => {

  const [urgentTask, setUrgentTask] = useState({ taskcollaborators : []});
  const [userData] = useContext(context)

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
  }, [task]);

  if (urgent && type === "normal") {
    if (urgentTask.taskpriority === "high"){
      return <Task taskDetail={urgentTask} />;}
  } else if (!urgent && type === "normal") {
    return <Task taskDetail={urgentTask} />;
  } else if (urgent && type === "manage") {
    if (urgentTask.taskpriority === "high"){
     return (
       <ManageTask
         glow={true}
         urgentTask={urgentTask}
         role={
           urgentTask.taskowner === userData._id
             ? "owner"
             : urgentTask.taskcollaborators.includes(userData._id)
             ? "collaborator"
             : "viewer"
         }
       />
     );}
  } else if (!urgent && type === "manage") {
    return (
      <ManageTask
        glow={false}
        urgentTask={urgentTask}
        role={
          urgentTask.taskowner === userData._id
            ? "owner"
            : urgentTask.taskcollaborators.includes(userData._id)
            ? "collaborator"
            : "viewer"
        }
      />
    );
  }
};

export default TaskCard;
