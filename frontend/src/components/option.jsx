import { useNavigate } from "react-router"
export default function Option(){
    const navigate=useNavigate();
    function adminsignin(){
        navigate('/adminsignin')
    }
    function usersignin(){
        navigate('/usersignin')
    }
    return(
        <div>
            <h1>
                WHO ARE YOU?
            </h1>
            <button onClick={adminsignin}>
            Admin
            </button>
            <button onClick={usersignin}>
            User
            </button>
        </div>
    )
}