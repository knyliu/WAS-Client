import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import baseUrl from "./baseUrl";


export const SavedAppointments = () => {
  const [yourAppointments, setYourAppointments] = useState([]); 
  const userID = useGetUserID();

  console.log("yourAppointments");
  console.log(yourAppointments);


  useEffect(() => {
    


    const fetchYourAppointments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/appointments/client_appointments`);
    
        const filteredAppointments = response.data.filter(appointment => 
          appointment.appointmentInputs.userOwner === userID);
        setYourAppointments(filteredAppointments);
        
        // console.log("Filtered appointments:", filteredAppointments);
        // console.log(yourAppointments);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchYourAppointments();
    }, [userID]);
    




    return (
      <div>
        <h1>Your Appointments</h1>
        <ul>
          {yourAppointments.map((appointment) => (
            <li key={appointment._id}>
              <div>
                <h2>{appointment._id}</h2>
                <table>
                  <tbody>
                    {Object.entries(appointment.appointmentInputs).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br></br>
                <br></br>
                <hr className="centered-line"></hr>
                <br></br>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
    
};
