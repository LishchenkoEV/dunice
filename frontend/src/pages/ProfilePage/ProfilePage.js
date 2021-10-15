import React, {useState} from 'react'
import {Header} from "../Header/Header";
import axios from "axios";
import "./Profile.css"

export const ProfilePage= ()=>{

    const [newLogin, setNewLogin] = useState({
        login: '', old_login:localStorage.getItem('login')
    })
    const changeHandler = event => {
        setNewLogin({...newLogin, [event.target.name]: event.target.value})
    }
    const updateHandler = async () => {
        try {
            if(newLogin.login.length>5) {
                localStorage.setItem('login', newLogin.login)
                axios.put('api/login/update',{...newLogin},{
                    headers:{'Content-Type': 'application/json'}
                })
            }
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <div className="ProfilePage">
            <Header/>
            <div className="body">
                <div className="Login-Change">
                    <input
                        type="login"
                        name="login"
                        placeholder={localStorage.getItem('login')}
                        id="login"
                        className="Login-input-box"
                        onChange={changeHandler}
                    />
                <button className="Button-img-pen"
                        onClick={updateHandler}
                >
                </button>
                </div>
            </div>
        </div>
    )
}