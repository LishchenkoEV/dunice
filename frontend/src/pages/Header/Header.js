import React, {useContext, useState} from 'react'
import { Link } from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import {useAuth} from "../../hooks/auth.hook";
import axios from "axios";
import './style.css'


export const Header= () => {
    const auth = useContext(AuthContext)
    const [form, setForm] = useState({
        login: '', password: ''
    })

    const {token} = useAuth()
    const isAuthenticated = !!token


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    const registerHandler = async () => {
        try {
            await axios.post('/api/auth/reg', {...form}, {
                headers:
                    {'Content-Type': 'application/json'}
            }).then(response => {
                    auth.login(response.data.token, response.data.userId)
                })
            localStorage.setItem('login',form.login)
            window.location.reload(false);
        } catch (e) {
            console.log(e)
        }
    }
    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        window.location.reload(false);
        window.location.href = '/';
    }

    return(
        <div className="Header">
            <Link to ="/">
                <button className="Button-logo"
                />
            </Link>

            {isAuthenticated===true?
                <div className="authorized">
                            <Link to ="/add-post">
                                <button className="Button-AddPost"/>
                            </Link>

                            <Link to ="/profile" className='Link-profile'>
                                <button className="Button-profile">
                                    <h1>{localStorage.getItem('login')}</h1>
                                </button>
                            </Link>

                            <button className="Button-exit" onClick={logoutHandler}>
                                <h1>Выход</h1>
                            </button>
                    </div>
                :
                <div className="Unauthorized">
                    <div>
                        <input
                            type="login"
                            name="login"
                            placeholder="Логин"
                            id="login"
                            className="Input-box"
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Пароль"
                            type="password"
                            name="password"
                            id="password"
                            className="Input-box"
                            onChange={changeHandler}
                        />
                    </div>
                        <button className="Button-Authorizations"
                                onClick={registerHandler}
                        >Вход/Регистрация
                        </button>
                </div>
            }
        </div>
    )
}