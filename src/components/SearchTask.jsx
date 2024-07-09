import React, { useState } from "react";
import axios from "axios";

const TaskSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://backend-pgv8.onrender.com/tasks/search/${searchQuery.trim()}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching tasks:", error);
      setSearchResults([]);
    }
  };

  return (
    <div className="task-search">
      <form onSubmit={handleSearch} className="task-search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks"
          className="task-search-input"
        />
        <button type="submit" className="task-search-button">
          Search
        </button>
      </form>
      <ul className="task-search-results">
        {searchResults.length > 0 ? (
          searchResults.map((task) => (
            <li key={task.taskid} className="task-search-item">
              <h3>{task.taskname}</h3>
              <p>{task.taskdescription}</p>
              <p>Priority: {task.taskpriority}</p>
              <p>Status: {task.taskstatus}</p>
              <p>End Date: {task.taskend}</p>
            </li>
          ))
        ) : (
          <p>No tasks found</p>
        )}
      </ul>
    </div>
  );
};

export default TaskSearch;
