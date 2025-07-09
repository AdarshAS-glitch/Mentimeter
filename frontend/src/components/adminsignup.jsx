import { useNavigate } from "react-router";
import axios from "axios";
export default function Adminsignup() {
    const navigate=useNavigate();
    const handlesignup=()=>{
        const username=document.getElementById("username").value;
        const password=document.getElementById("password").value;
        axios.post("http://localhost:3000/signup",{
            username:username,
            password:password
        }).then(function(){
            navigate('/adminsignin')
        })
    }
    return (
        <div>
            <input type="text" id="username"></input>
            <input type="password" id="password"></input>
            <button onClick={handlesignup}>
                SUBMIT
            </button>
        </div>
    )
}