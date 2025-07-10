import { useNavigate } from "react-router"
export default function Option(){
    const navigate=useNavigate();
    function adminsignin(){
        navigate('/signin')
    }
   
    return(
        <div>
            <h1>
                Signin
            </h1>
            <button onClick={adminsignin}>
            Admin
            </button>
        </div>
    )
}