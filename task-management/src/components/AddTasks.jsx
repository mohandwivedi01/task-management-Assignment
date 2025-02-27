import { useState, useEffect } from "react";
import { FaCalendar, FaUser, FaEllipsisV } from "react-icons/fa";
import Options from "./Options.jsx";
import CalendarModal from "./CalendarModel.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_API;

export default function AddTask(props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [options, setOptions] = useState(false);
    const [calader, setCalader] = useState(false)

    const handleSubmit = async (e) => {
        console.log("1 API URL: ", API_URL)
        e.preventDefault();

        if (!props.title) {
            toast.error("Please enter a title");
            alert("Please enter a title")
            return;
        }
        if (!props.status || !props.priority) {
            toast.error("Please select a status and priority")
            alert("Please select a status and priority")
            return;
        }

        setLoading(true);

        try {
            console.log(props.title)
            console.log(props.description)
            console.log(props.dueDate)
            console.log(props.status)
            console.log(props.priority)
            
            const postTaskResponse = await axios.post(`${API_URL}/add-task`, {
                title: props?.title,
                description: props?.description,
                dueDate: props?.dueDate,
                status: props?.status,
                priority: props?.priority,
            });

            console.log("response: ", postTaskResponse);

            if (postTaskResponse.status === 200) {
                toast.success("Task added successfully");
                alert("Task added successfully");
                setLoading(false);
                props.handleAssignToggle();
            } else {
                setError("Failed to add task", postTaskResponse.statusCode, postTaskResponse);
                alert("Failed to add task", postTaskResponse.statusCode, postTaskResponse);
            }

        } catch (err) {
            console.error("Error: ", err, error)
            setError(err.message || "An error occurred while fechting tasks.");
            setLoading(false);
        } finally {
            setLoading(false); // ✅ Ensure loading stops
            props.setTitle("")
            props.setDescription("")
            props.setDueDate("")
            props.setStatus("")
            props.setPriority("")
        };

        if (loading) {
            return (
                <div className="flex justify-center items-center">
                    <div className="spinner-border text-slate-900" role="status">
                        <span className="sr-only">Posting...</span>
                    </div>
                </div>
            )
        }
        if (error) {
            return (
                <div className="flex justify-center items-center">
                    <div className="text-red-600 text-lg font-semibold">
                        {error.message}
                    </div>
                </div>
            )
        }

    }


    const handleOptions = (e) => {
        e.preventDefault();
        setOptions(!options);
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center py-10">
            <div className=" bg-slate-200 max-w-xs mx-auto mt-10 rounded-lg shadow-md border-2 border-slate-700 text-gray-900 py-5 px-7 ">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">ADD TASK</h2>
                    <button onClick={()=>props.setAddTask(false)} className="text-slate-800 hover:text-blue-900 text-md hover:bg-slate-300 px-2 rounded-full">x</button>
                </div>

                <form>
                    {/* Task Description */}
                    <div className="mt-4">
                        <div className="flex justify-between ">
                            <input className="w-full py-1 px-1 bg-slate-200 rounded-lg  focus:outline-none text-slate-800 font-semibold"
                                placeholder="Title..."
                                onChange={(e) => props.setTitle(e.target.value)}
                                value={props.task?.title || props.title}
                            />
                            <span className="text-sm text-gray-500 mt-3 ml-2"><button onClick={handleOptions}><FaEllipsisV /></button>
                                {options && <Options
                                    heading={"Select"}
                                    status={props.status}
                                    setStatus={props.setStatus}
                                    priority={props.priority}
                                    setPriority={props.setPriority}
                                    handleOptions={handleOptions}
                                />}
                            </span>
                        </div>
                        <hr className="border border-gray-600 my-1" />
                        <textarea className="w-full h-[150px] py-1 px-1 bg-slate-200 rounded-lg  focus:outline-none text-slate-800"
                            placeholder="Enter task..."
                            onChange={(e) => props.setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between mt-6 text-gray-500 text-xs font-bold">
                        <button className="flex justify-center gap-1 hover:text-blue-500" onClick={(e) => {
                            e.preventDefault();
                            setCalader(true)
                        }} ><FaCalendar className=" text-gray-600 w-3 h-3 " />{props.dueDate}</button>
                        {calader && <CalendarModal
                                    dueDate={props.dueDate}
                                    setDueDate={props.setDueDate}
                                    setCalader={setCalader}
                        />}
                        <button className=" flex items-center gap-1  hover:text-blue-500" onClick={handleSubmit} ><FaUser className="text-gray-600 h-3 w-3 mb-1" />Assigned to</button>
                    </div>
                </form>

            </div>
        </div>

    )
};

