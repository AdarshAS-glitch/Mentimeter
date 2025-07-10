import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios";
import { useEffect } from "react";
export default function Admindash(){
    const navigate=useNavigate();
    const [quizes,setquizes]=useState([])
    useEffect(()=>{
    axios.get("http://localhost:3000/adminquiz",{
        headers:{
            token:localStorage.getItem("token")
        }
    }).then(res=>{
        setquizes(res.data)
    })},[])
    function createquiz(){
        navigate('/admin/create')
    }
     return (
    <div>
      <button onClick={createquiz}>Create a quiz</button>
      <div style={{ marginTop: "20px" }}>
        {quizes.length > 0 ? (
          quizes.map((quiz, index) => (
            <div key={index} style={{ display:"flex", border: "1px solid #ccc", padding: "10px", marginBottom: "10px",marginRight:"1000px" }}>
              <h3>{quiz.title}</h3>
              <button style={{marginLeft:"50px"}}>Edit</button>
            </div>
          ))
        ) : (
          <p>No quizzes found.</p>
        )}
      </div> 
    </div>
  );
}