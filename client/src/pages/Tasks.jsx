import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/UserContext";
import { format } from "date-fns";

import LoadingGif from "../assets/Loading.svg";
import EditLogo from "../assets/edit-logo.png";

function Tasks({ props }) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedTask, setEditedTask] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [updateDate, setUpdateDate] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await axios
          .get(import.meta.env.VITE_APP_ALL_TASKS_URL, {
            params: { uid: user.uid },
          })
          .then((res) => {
            setTasks(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [editedTask, completed, props]);

  const openModal = (id) => {
    // setEditedTask(tasks[index]);
    setSelectedTaskId(id);
    setShowModal(true);
    const task = tasks.find((task) => task._id === id);
    if (task) {
      setEditedTask(task.name);
      setUpdateDate(task.dueDate);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditedTask("");
    setUpdateDate("");
    setSelectedTaskId(null);
  };

  const handleEdit = () => {
    try {
      axios
        .put(import.meta.env.VITE_APP_UPDATE_TASK_URL, {
          id: selectedTaskId,
          name: editedTask,
          dueDate: updateDate,
        })
        .then((res) => {
          console.log(res.data.message);
          setCompleted((prevState) => !prevState);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error("Error updating task name:", error);
    }
    closeModal();
  };

  const handleDelete = () => {
    try {
      axios
        .delete(import.meta.env.VITE_APP_DELETE_TASK_URL, {
          params: { id: selectedTaskId },
        })
        .then((res) => {
          console.log(res.data.message);
          setCompleted((prevState) => !prevState);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    closeModal();
  };

  const handleCheckboxClick = async ({ taskId, status }) => {
    // setSelectedTaskIndex(index);
    try {
      // Make a PUT request to update the status
      await axios
        .put(import.meta.env.VITE_APP_UPDATE_TASK_STATUS_URL, {
          id: taskId,
          status: status,
        })
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => {
          console.error(err);
        });
      // Optionally, you can also update the tasks state in your frontend to reflect the changes immediately
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!user) {
    return (
      <div className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center dark:bg-gray-900">
        <img src={LoadingGif} alt="loading" />
      </div>
    );
  }

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center border rounded-xl mb-2 py-2 px-2"
          >
            <div className="flex items-center">
              <input
                id={`checkbox-${task._id}`}
                type="checkbox"
                defaultChecked={task.status}
                className="mr-2 peer w-4 h-4 border-2 mt-1 focus:outline-none transition-all duration-200 ease-in-out"
                onChange={(e) =>
                  handleCheckboxClick({
                    taskId: task._id,
                    status: e.target.checked,
                  })
                }
              />
              <label
                htmlFor={`checkbox-${task._id}`}
                className="peer-checked:text-gray-400 peer-checked:line-through"
              >
                <div className=" ">
                  <span className="whitespace-pre-line">{task.name} </span>
                  {/* Displaying task name */}
                </div>
                {task.dueDate && (
                  <span className="border rounded-lg text-xs px-1 ms-2">
                    {format(new Date(task.dueDate), "ccc dd/MM/yyyy")}
                  </span>
                )}
              </label>
            </div>
            <button
              onClick={() => openModal(task._id)}
              className="text-blue-500"
            >
              <img src={EditLogo} alt="edit" className=" pr-4 min-w-10" />
            </button>
          </div>
        ))
      ) : (
        <p>There are no tasks available; create one.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-gray-300 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Your Task
            </h2>
            <div className="flex flex-col">
              <label htmlFor="task" className="text-gray-900">
                Task Name
              </label>
              <textarea
                id="task"
                type="text"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
                className="border resize border-gray-300 text-gray-800 rounded-lg px-3 py-1 mb-4 w-[30rem] h-24"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="date" className="text-gray-900">
                Due Date
              </label>
              <input
                id="date"
                type="date"
                // value={updateDate.substring(0, 10)}
                value={updateDate ? updateDate.substring(0, 10) : ""}
                onChange={(e) => setUpdateDate(e.target.value)}
                className="border border-gray-300 text-gray-800 rounded-lg px-3 py-1 mb-4"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-500 rounded-lg px-2 pb-[1px] mr-2"
              >
                Delete
              </button>
              <button
                onClick={handleEdit}
                className="bg-blue-400 rounded-lg px-2 pb-[1px] "
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white rounded-lg px-2 pb-[1px] ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
