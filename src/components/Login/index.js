import React from "react"
import ApiObject from "../../Api"
import './Login.css'

const Login = ({onReceive}) => {
    const handleFacebookLogin = async () => {
        let result = await ApiObject.fbPopup()
        if (result) {
            onReceive(result.user)
        } else {
            alert('Erro')
        }
    }

    return (
        <div className='login'>
            <button onClick={handleFacebookLogin} >Logar com o Facebook</button>
        </div>
    )
}

export default Login