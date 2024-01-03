import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import baseUrl from "./baseUrl";

export const Home = () => {
  const [yourStores, setYourStores] = useState([]); 
  const userID = useGetUserID();

  console.log("yourStores:");
  console.log(yourStores);


  useEffect(() => {
    


    const fetchYourStores = async () => {
      try {
        const response = await axios.get(`${baseUrl}/appointments`);

          const filteredStores = response.data.filter(appointment => userID === appointment.userOwner);
          setYourStores(filteredStores);
      } catch (err) {
        console.log(err);
      }
    };

    fetchYourStores();
  }, [userID]); 


  console.log("your new Stores:");
  console.log(yourStores);


  return (
    <div>
      <h1>Your Stores</h1>
      <ul>
        {yourStores.map((appointment) => (
          <li key={appointment._id}>
            <div>
              <h2>{appointment.name}</h2>
              <h6>{appointment.description}</h6>
              <img src={appointment.imageUrl} alt={appointment.name} ></img>
            </div>

              {appointment.members.map((member, index) => (
                <p key={index} className="centered-text">{member}：</p>
              ))}

              
              <br></br>
              <h5>{appointment.instructions}</h5>
              <button type="submit" id="btn">Reserve</button>
              <br></br>
              <br></br>
              <br></br>
              <hr className="centered-line"></hr>
              <br></br>
          </li>
        ))}
      </ul>
    </div>
  );
};
