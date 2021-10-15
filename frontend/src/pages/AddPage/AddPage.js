import React, {useState} from 'react'
import {Header} from '../Header/Header'
import './style.css'
import axios from "axios";

export const AddPage= ()=>{

    const [form, setForm] = useState({
        title: '', tags:'',content:'', author:localStorage.getItem('login')
    })

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const createHandler = async () => {
        try {
            axios.post('api/post/new',{...form},{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            document.getElementById('title').value = '';
            document.getElementById('tags').value = '';
            document.getElementById('content').value = '';
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <div>
            <Header/>
            <div className="body">
                <div className="add-form">
                    <input
                        type="title"
                        name="title"
                        placeholder="Введите название"
                        id="title"
                        className="add-form__title"
                        onChange={changeHandler}
                    />

                    <input
                        placeholder="Введите теги через запятую"
                        type="tags"
                        name="tags"
                        id="tags"
                        className="add-form__tags"
                        onChange={changeHandler}
                    />

                    <textarea
                        type="content"
                        name="content"
                        placeholder="Введите текст"
                        id="content"
                        className="add-form__content"
                        onChange={changeHandler}
                    />


                    <button className="add-form__button"
                            onClick={createHandler}
                    >
                        <h1>опубликовать</h1>
                    </button>
                </div>
            </div>
        </div>
    )
}