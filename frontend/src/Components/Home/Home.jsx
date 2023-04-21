import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import "./Home.css";
import Modal from "react-modal";

import deleteIcon from "../../img/delete.svg";
import editIcon from "../../img/edit.svg";
import * as UserApi from "../../Api/UserRequests.js";


const Home = () => {
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [createData, setCreateData] = useState({ title: "", desc: "", dueDate: "", status: "Inbox" });
    const [tasksData, setTasksData] = useState();
    const [sortFilter, setSortFilter] = useState("All");

    const [dupTasksData, setDupTasksData] = useState();

    useEffect(() => {

        const getData = async () => {
            const response = await UserApi.getTasks({ userId: user.userData.userId });
            setTasksData(response.data.tasks);
            setDupTasksData(response.data.tasks);
        };
        if (user) getData();
        return () => {
            // this now gets called when the component unmounts
        };
    }, []);

    const handleStatusSort = (event) => {
        switch (event.target.value) {
            case "Inbox": {
                const filteredData = dupTasksData.filter(function (item) {
                    return item.status === "Inbox";
                });
                setTasksData(filteredData);
                break;
            }
            case "Completed": {
                const filteredData = dupTasksData.filter(function (item) {
                    return item.status === "Completed";
                });
                setTasksData(filteredData);
                break;
            }
            case "All": {
                setTasksData(dupTasksData);
                break;
            }
        }
        console.log(event.target.value);
    };

    const handleSort = (event) => {
        switch (event.target.value) {
            case "title": {
                const data2 = [...dupTasksData].sort((a, b) =>
                    a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1
                );
                
                setTasksData(data2);
                break;
            }
            case "dueDate": {
                const data2 = [...dupTasksData].sort((a, b) =>{
                    a = a.dueDate.split('-').reverse().join('');
                    b = b.dueDate.split('-').reverse().join('');
                    return a > b ? 1 : a < b ? -1 : 0;
                }
                );
                setTasksData(data2);;
                break;
            }
            case "All": {
                setTasksData(dupTasksData);
                break;
            }
        }
        console.log(event.target.value);
    };

    // const handleCreateModal = async (e) => {
    //     e.preventDefault()
    //     try {
    //         setTasksData([...tasksData, createData]);
    //         setCreateModal(false);
    //         const response = await UserApi.createTask({ taskData: createData, userId: user.userData.userId });
    //         setCreateData({ title: "", desc: "", dueDate: "", status: "Inbox" });
    //         // window.location.reload(false);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    
    const handleCreateModal = async (e) => {
        try {
            const response = await UserApi.createTask({ taskData: createData, userId: user.userData.userId });
            setCreateData({ title: "", desc: "", dueDate: "", status: "Inbox" });
            window.location.reload(false);
        } catch (error) {
            console.log(error)
        }
    }
    const handleEditModal = (item) => (e) => {
        e.preventDefault();

        setEditModal(true)
        setCreateData(item);
    }
    const handleEditModalSubmit = async (e) => {
        e.preventDefault();
        // console.log(createData)
        try {
            const response = await UserApi.updateTask({ taskData: createData, userId: user.userData.userId });
            
            setCreateData({ title: "", desc: "", dueDate: "", status: "Inbox" });
            window.location.reload(false);
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = (e) => {
        setEditModal(false);
        setCreateModal(false);
        setCreateData({ title: "", desc: "", dueDate: "", status: "Inbox" })
    }
    // const handleDelete = (it, idx) => async (e) => {
    //     try {
    //         console.log(it)
    //         const response = await UserApi.deleteTask({ userId: user.userData.userId, taskId: it._id });
    //         const newData = tasksData.filter((item, index)=>{
    //             if(index !== idx) return item
                
    //         })
    //         setTasksData(newData);
    //         setCreateData({ title: "", desc: "", dueDate: "", status: "Inbox" });
    //         // window.location.reload(false);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const handleDelete = (id) => async (e) => {
        try {
            const response = await UserApi.deleteTask({ userId: user.userData.userId, taskId: id });
            setCreateData({ title: "", desc: "", dueDate: "", status: "Inbox" });
            window.location.reload(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='home'>
            <Navbar />
            {tasksData ?
                <div className="home-content">
                    <div className='home-bar'>
                        <button className='create-btn' onClick={setCreateModal}>Create</button>
                        <div className='btn-cont'>
                            <span>Sort by </span>
                            <select
                                className='status-select'
                                name="taskfilter"
                                id="taskfilter"
                            // value={assetFilter}
                            onChange={handleSort}
                            >
                                <option default value="All">
                                    All
                                </option>
                                <option value="title">Title</option>
                                <option value="dueDate">Due Date</option>

                            </select>
                        </div>
                        <div className='btn-cont'>
                            <span>Status </span>
                            <select
                                className='status-select'
                                name="taskfilter"
                                id="taskfilter"
                                // value={assetFilter}
                                onChange={handleStatusSort}
                            >
                                <option default value="All">
                                    All
                                </option>
                                <option value="Inbox">Inbox</option>
                                <option value="Completed">Completed</option>

                            </select>
                        </div>
                    </div>

                        {tasksData?.length >0 ?
                    <div className="tasks grid">
                         {   tasksData?.map((item, index) => {
                                return (<div className='task-card'>
                                    <div className='title'>
                                        <p className='head'>{item?.title}</p>
                                        <p className='duedate'>Due Date: {item?.dueDate}</p>
                                    </div>
                                    <div className='description'>{item?.desc}</div>
                                    <div className="footer">
                                        <img src={deleteIcon} alt="" onClick={handleDelete(item, index)} />
                                        <span>{item?.status}</span>
                                        <img src={editIcon} alt="" onClick={handleEditModal(item)} />
                                    </div>
                                </div>)
                            })} 

                    </div>
                    :
                    <p style={{width:"100%", fontWeight:"bold", color:"gray", textAlign:"center"}}> Click on Create button to create tasks or add notes.</p>

                        }
                </div> :
                <div>Loading...</div>
            }

            <Modal
                isOpen={createModal}
                onRequestClose={() => setCreateModal(false)}
                style={{
                    overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.75)",
                    },
                    content: {
                        position: "absolute",
                        top: "15%",
                        left: "25%",
                        right: "25%",
                        bottom: "15%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: "40px",
                        outline: "none",
                        padding: "2rem 1rem",
                    },
                }}
            >
                <div className="modal-cont">
                    <h2>Create New Task</h2>
                    <div className="modal-datas">
                        <div className='modal-data-cont'>
                            <div className='modal-data'> 
                                <label htmlFor="tite">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={createData.title}
                                    className="loginForm-data homedata"
                                    placeholder="Title"
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>

                            <div className='modal-data'>
                                <label htmlFor="tite">Description</label>
                                <input
                                    type="text"
                                    name="desc"
                                    value={createData.desc}
                                    className="loginForm-data desc"
                                    placeholder="Description"
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className='modal-data-cont'>
                            <div className='modal-data'>
                                <label htmlFor="dueDate">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={createData.dueDate}
                                    className="loginForm-data"
                                    placeholder="Due Date"
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>

                            <div className='modal-data'>
                                <label htmlFor="status">Status</label>
                                <select
                                    name="status"
                                    id="status"
                                    className='status-select'
                                    value={createData.status}
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                >
                                    <option value="Inbox">Inbox</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='buttons'>
                        <button className='navbar-logout-button home' onClick={handleCreateModal}>Create</button>
                        <button className='navbar-logout-button home' onClick={handleModalCancel}>Cancel</button>
                    </div>

                </div>
            </Modal>

            <Modal
                isOpen={editModal}
                onRequestClose={() => setEditModal(false)}
                style={{
                    overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.75)",
                    },
                    content: {
                        position: "absolute",
                        top: "15%",
                        left: "25%",
                        right: "25%",
                        bottom: "15%",
                        border: "1px solid #ccc",
                        background: "#fff",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: "40px",
                        outline: "none",
                        padding: "2rem 1rem",
                        // paddingBottom:"2rem"
                    },
                }}
            >
                <div className="modal-cont">
                    <h2>Create New Task</h2>
                    <div className="modal-datas">
                        <div className='modal-data-cont'>
                            <div className='modal-data'> 
                                <label htmlFor="tite">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={createData.title}
                                    className="loginForm-data"
                                    placeholder="Title"
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>

                            <div className='modal-data'>
                                <label htmlFor="tite">Description</label>
                                <input
                                    type="text"
                                    name="desc"
                                    value={createData.desc}
                                    className="loginForm-data desc"
                                    placeholder="Description"
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className='modal-data-cont'>
                            <div className='modal-data'>
                                <label htmlFor="dueDate">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={createData.dueDate}
                                    className="loginForm-data"
                                    placeholder="Due Date"
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>

                            <div className='modal-data'> 
                                <label htmlFor="status">Status</label>
                                <select
                                    name="status"
                                    id="status"
                                    className='status-select'
                                    value={createData.status}
                                    onChange={(e) =>
                                        setCreateData({ ...createData, [e.target.name]: e.target.value })
                                    }
                                >
                                    <option value="Inbox">Inbox</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='buttons'>
                        <button className='navbar-logout-button home' onClick={handleEditModalSubmit}>Update</button>
                        <button className='navbar-logout-button home' onClick={handleModalCancel}>Cancel</button>
                    </div>

                </div>
            </Modal>
        </div>
    )
}

export default Home