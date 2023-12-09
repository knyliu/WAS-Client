import React, { useEffect, useState } from "react";
import axios from "axios";

import baseUrl from "./baseUrl";

import { useGetUserID } from "../hooks/useGetUserID"; // Get Current UserID

import { useCookies } from "react-cookie";

import './home.css';


export const Home = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [cookies, _] = useCookies(["access_token"]); // get access_token

  const userID = useGetUserID(); // 假设这是获取用户ID的方法
  const [selectedID, setSelectedID] = useState(); // 追踪当前选中的ID，需要根据实际情况调整
  const [userInputs, setUserInputs] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/appointments`);
        setAppointments(response.data);
        setFilteredAppointments(response.data); // 移動至這裡確保數據加載後設置
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, []);

  const handleFilterChange = (event) => {
    const selectedID = event.target.value;
    if (selectedID === "all") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(appointment => appointment._id === selectedID);
      setFilteredAppointments(filtered);
      setSelectedID(event.target.value);
    }
  };

  const handleInputChange = (appointmentId, memberName, value) => {
    setUserInputs({
      ...userInputs,
      [appointmentId]: {
        ...(userInputs[appointmentId] || {}),
        [memberName]: value,
        userOwner: userID, // 在这里加入userOwner
        selectedID: selectedID 
      },
    });
  };


  // 处理表单提交
  const handleSubmit = (appointmentId, event) => {
    event.preventDefault(); // 防止表單默認提交行為
    const appointmentInputs = userInputs[appointmentId];
    console.log(appointmentInputs);

  
    // 处理 selectedID 和 userOwner
    console.log("Selected ID:", selectedID);
    console.log("User Owner:", userID);
  
    // 发送数据到服务器
    axios.post(`${baseUrl}/appointments`, {
      appointmentInputs: appointmentInputs, // 假设这是一个对象
    }, {
      headers: {
        Authorization: cookies.access_token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error('Error:', error);
      console.log(appointmentInputs);
    });
    
    
  };
  
  
  return (
    <div>
      <div className="background-container">
      </div>

      <div id="center">
      <select id="Select" onChange={handleFilterChange}>
        <option value="all">All Appointments</option>
        {appointments.map((appointment) => (
          <option key={appointment._id} value={appointment._id}>
            {appointment.name}
          </option>
        ))}
      </select>
      <br></br>
      <br></br>
      <br></br>
      <hr className="centered-line"></hr>
      <br></br>
      </div>

      <ul>
        {filteredAppointments.map((appointment) => ( 
          <li key={appointment._id}>
            <div>
              <h2>{appointment.name}</h2>
              <h6>{appointment.description}</h6>
              <img src={appointment.imageUrl} alt={appointment.name} />
              <form onSubmit={(e) => handleSubmit(appointment._id, e)}>
              {appointment.members?.map((member, index) => (
                <div key={index}>
                  {member}：<input 
                              type="text" 
                              name={`欄位名稱${member}`} 
                              value={userInputs[appointment._id]?.[member] || ''} 
                              onChange={(e) => handleInputChange(appointment._id, member, e.target.value)}
                            />
                </div>
              ))}
              <h5>{appointment.instructions}</h5>
              <button type="submit" id="btn">Reserve</button>
              <br></br>
              <br></br>
              <br></br>
              <hr className="centered-line"></hr>
              <br></br>
            </form>              
            </div>
            
          </li>
        ))}
      </ul>

    </div>
  );
};
