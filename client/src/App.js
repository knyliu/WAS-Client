import './App.css';
import {useState, useEffect} from 'react';
import Axios from 'axios';

import baseUrl from "./baseUrl";

function App() {
  const[name, setName] = useState("");
  const[school, setSchool] = useState("");
  const[campus, setCampus] = useState("");
  const[building, setBuilding] = useState("");
  const[floor, setFloor] = useState("");

  const [listOfClassrooms, setlistOfClassrooms] = useState([]);

  const addClassroom = () => {
    Axios.post(`${baseUrl}/addclassroom`, {name : name, school : school, campus : campus, building : building, floor : floor})
    .then((response) => {
      setlistOfClassrooms([...listOfClassrooms, {_id:response.data._id , name : name, school : school, campus : campus, building : building, floor : floor}])
    })
    .catch(() => {
    });
  }
  


  const updateClassroom = (id) => {
    const newFloor = prompt("Enter the new floor: ");

    Axios.put(`${baseUrl}/update`, {newFloor:newFloor , id:id}).then(() => {
      setlistOfClassrooms(listOfClassrooms.map((val) => {
        return val._id == id 
        ? {_id:id , name:val.name, school:val.school , campus:val.campus , building:val.building , floor:newFloor}
        : val
      }))
    });
  };


  const deleteClassroom = (id) => {
    Axios.delete(`${baseUrl}/delete/${id}`).then(() => {
      setlistOfClassrooms(listOfClassrooms.filter((val) => {
        return val._id != id;
      }))
    });
  };


  useEffect(() => {
    Axios.get(`${baseUrl}/read`)
    .then((response) => {
      setlistOfClassrooms(response.data);
    })
    .catch(() => {
      console.log("ERR");
    });
  }, [])





  return (
    <div className="App">
      <div className = "inputs">
        <h1>Classroom Management System</h1>
        <input type = "text" placeholder='Name' onChange = {(event) => {setName(event.target.value)}}/> 
        <input type = "text" placeholder='School' onChange = {(event) => {setSchool(event.target.value)}}/>
        <input type = "text" placeholder='Campus' onChange = {(event) => {setCampus(event.target.value)}}/>
        <input type = "text" placeholder='Building' onChange = {(event) => {setBuilding(event.target.value)}}/>
        <input type = "number" placeholder='Floor' onChange = {(event) => {setFloor(event.target.value)}}/>

        <button onClick={addClassroom}>Add Classroom</button>
      </div>

      <div className='listOfClassrooms'>
        {listOfClassrooms.map((val) => {
          return (
            <div className='classroomContainer'>
              <div className='classroom'>
                <h3>Name: {val.name}</h3>
                <h3>School: {val.school}</h3>
                <h3>Campus: {val.campus}</h3>
                <h3>Building: {val.building}</h3>
                <h3>Floor: {val.floor}</h3>
              </div>

              <button onClick={() => {updateClassroom(val._id);}}>Update</button>

              <button id='removeBtn' onClick={() => {deleteClassroom(val._id);}}>Delete</button>
            </div>
          );
        })}
      </div>      
    </div>
  );
}

export default App;
