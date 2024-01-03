import React, { useState, useEffect } from "react";
import axios from "axios";

import { useGetUserID } from "../hooks/useGetUserID";

import baseUrl from "./baseUrl";


export const UpdateStores = () => {
  const [stores, setStores] = useState([]); // 存储所有可更新的数据
  const [selectedStore, setSelectedStore] = useState(null); // 用户选择的特定数据

  const [selectedStoreId, setSelectedStoreId] = useState(null); // 用户选择的特定数据

  const userID = useGetUserID();

  useEffect(() => {
    // 获取数据
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/appointments`);
        const filteredStores = response.data.filter(appointment => userID === appointment.userOwner);
        setStores(filteredStores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  



  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedStore({ ...selectedStore, [name]: value });
  };

  const handleSelectStore = (storeId) => {
    // 加载选中的数据到表单
    const store = stores.find(s => s._id === storeId);
    // console.log(store._id);
    setSelectedStore(store);
    setSelectedStoreId(store._id);
    console.log(selectedStoreId);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form with data:", selectedStore); // 确认这一行是否被打印
    try {
      const response = await axios.put(
        `${baseUrl}/appointments/${selectedStore._id}`,
        selectedStore
      );
      console.log("Update response:", response); // 确认响应
      alert("Store Updated Successfully");
    } catch (error) {
      console.error("Error updating store:", error); // 确认错误
    }
  };

  const handleMemberChange = (event, index) => {
    const newMembers = [...selectedStore.members];
    newMembers[index] = event.target.value;
    setSelectedStore({ ...selectedStore, members: newMembers });
  };
  
  const handleAddMember = () => {
    const newMembers = [...selectedStore.members, ''];
    setSelectedStore({ ...selectedStore, members: newMembers });
  };
  

  return (
    <div className="update-store">
      <h1>Update Store Info</h1>
      <h3>Select a Store to Update</h3>

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

      {selectedStore && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Store Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={selectedStore.name}
            onChange={handleChange}
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={selectedStore.description}
            onChange={handleChange}
          />

          <label htmlFor="name">Lables:</label>
          {selectedStore.members && selectedStore.members.map((member, index) => (
            <div key={index}>
              <label htmlFor={`member-${index}`}></label>
              <input
                type="text"
                id={`member-${index}`}
                name={`members`}
                value={member}
                onChange={(event) => handleMemberChange(event, index)}
              />
            </div>
          ))}

          <button id="btn" type="button" onClick={() => handleAddMember()}>
            Add Label
          </button>

          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={selectedStore.imageUrl}
            onChange={handleChange}
          />

          <label htmlFor="appointmentTime">Amount of Lables:</label>
          <input
            type="number"
            id="appointmentTime"
            name="appointmentTime"
            value={selectedStore.appointmentTime}
            onChange={handleChange}
          />

          <button id="btn" type="submit">Update Store</button>
        </form>
      )}
    </div>
  );
};
