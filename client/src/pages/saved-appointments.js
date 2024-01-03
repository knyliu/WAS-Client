import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie"; // 引入 useCookies

import baseUrl from "./baseUrl";

export const SavedAppointments = () => {
  const [yourAppointments, setYourAppointments] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [cookies] = useCookies(['access_token']); // 使用 useCookies
  const userID = useGetUserID();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const responseStores = await axios.get(`${baseUrl}/appointments/`);
        const filteredStores = responseStores.data.filter(store => store.userOwner === userID);
        setStores(filteredStores);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchStores();
  }, [userID]);

  const handleSelectStore = async (storeId) => {
    setSelectedStoreId(storeId);

    try {
      const responseAppointments = await axios.get(`${baseUrl}/appointments/client_appointments`);
      const filteredAppointments = responseAppointments.data.filter(appointment =>
        appointment.appointmentInputs.selectedID === storeId);
      setYourAppointments(filteredAppointments);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      console.log("Token from Cookies:", cookies.access_token); // 印出 token 以檢視
      await axios.delete(`${baseUrl}/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      });
      setYourAppointments(yourAppointments.filter(appointment => appointment._id !== appointmentId));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };
  


  return (
    <div>
      <h1>Clients' Appointments</h1>
      <h3>Select a Store to View Appointments</h3>
      <div className="button-container">
      {stores.map((store) => (
        <button id="btn" key={store._id} onClick={() => handleSelectStore(store._id)}>
          {store.name}
        </button>
      ))}
      </div>
      <br></br>
      <br></br>
      <hr className="centered-line"></hr>
      <br></br>

      {selectedStoreId && (
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
                <button id="btn" onClick={() => handleDeleteAppointment(appointment._id)}>Delete Appointment</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedAppointments;
