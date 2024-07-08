import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import Task from "./Task";

const TaskCard = ({ task, condition }) => {
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
  }, [task]);

  if (condition) {
    if (urgentTask.taskpriority === "high")
      return <Task urgentTask={urgentTask} />;
  } else {
    return<Task urgentTask={urgentTask} />;
  }
};

export default TaskCard;
