import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/UserContext";
import { auth } from "../../Firebase.js";
import axios from "axios";

import Tasks from "./Tasks.jsx";
import LoadingGif from "../assets/Loading.svg";

function Home() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [newTask, setNewTask] = useState("");

  const onCreateTask = async (e) => {
    e.preventDefault();
    // console.log(newTask);
    try {
      await axios
        .post(import.meta.env.VITE_APP_NEWTASK_URL, {
          name: newTask,
          uid: user.uid,
          status: false,
        })
        .then((res) => {
          console.log(res.data.message);
          setNewTask("");
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setTimeout(() => {
      handleClick();
    }, 200); // Adjust the delay time as needed
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const onSignOutClick = async () => {
    try {
      await auth.signOut();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
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
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between mx-10 mt-8">
        <div className="flex text-5xl">
          <h1>To</h1>
          <h1 className="text-blue-500">Do.</h1>
        </div>
        <div className="relative">
          <button
            className="text-white focus:outline-none"
            onClick={handleProfileClick}
          >
            <img
              src={user.photoURL}
              alt="avater"
              className="w-8 rounded-full"
            />
          </button>
          {isOpen && (
            <div
              ref={dropdownRef}
              className="dropdown absolute w-max z-50 right-0 mt-2 bg-gray-500 rounded shadow-md "
            >
              <ul>
                <li className="px-2 ">{user.displayName}</li>
                <li className="px-2">{user.email}</li>
                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>

                <li>
                  <button
                    onClick={onSignOutClick}
                    className="block px-4 py-2 text-red-500 hover:text-red-600"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Header */}
      {/* New task */}
      <form
        className="flex justify-center mt-8 sm:mt-6 md:mt-2"
        onSubmit={onCreateTask}
      >
        <textarea
          type="textarea"
          rows={1}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="sm:w-[500px] bg-gray-700 py-1 px-2 rounded-l-md focus:outline-none"
          placeholder="Type your task"
        />

        <button
          className="bg-gray-500 pb-1 px-3 text-xl font-extrabold rounded-r-md"
          type="submit"
        >
          +
        </button>
      </form>
      {/* New task */}
      {/* Tasks list */}
      <div className="flex justify-center items-center">
        <div className="bg-gray-600 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] mt-10 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <div className="max-h-[400px] overflow-y-auto">
            <Tasks />
          </div>
        </div>
      </div>
      {/* Tasks list */}
    </div>
  );
}

export default Home;
