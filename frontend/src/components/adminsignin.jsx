import { useNavigate } from "react-router"
import axios from "axios";
export default function Adminsignin(){
    const navigate=useNavigate()
    function handlesignup(){
        navigate('/adminsignup')
    }
    function handlesignin(){
        const username=document.getElementById("username").value;
        const password=document.getElementById("password").value;
        axios.post("http://localhost:3000/adminsignin",{
            username:username,
            password:password
        }).then(function(res){
            localStorage.setItem("token",res.data)
            navigate('/adminquiz')
        })
        
    }
    return(
        <div>
            <button onClick={handlesignup}>
                SIGN UP
            </button>
            <div>
                <input type="text" id="username"></input>
                <input type="password" id="password"></input>
                <button onClick={handlesignin}>
                    SUBMIT
                </button>
            </div>
        </div>
    )
}