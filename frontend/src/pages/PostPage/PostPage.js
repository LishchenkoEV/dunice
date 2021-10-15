import React, {useEffect, useState} from 'react'
import {Header} from "../Header/Header";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import './style.css'

function converDate(string) {
    let date = new Date(string)
    let final_string = `${date.getHours()}:${date.getMinutes()}\t${date.getDate()>9? date.getDate():'0'+date.getDate()}/${date.getMonth()>9? date.getMonth():'0'+date.getMonth()}/${date.getFullYear()}`

    return final_string
}
export const PostPage= ()=> {
    const history=useHistory()
    const filterTag=(event)=>{
        history.push('/?tags=['+event.target.name+']')
    }
    const [Post,setPost]=useState()
    const GetPost = async () => {
        try {
            const postId= window.location.href.split('/')[4]
                // получение всех пользователей
            await axios.get('/api/post/post',{
                headers:{'Content-Type': 'application/json'},
                params: {postId}
            }).then(res=>{
                if(res.data.length===1)
                    setPost(res.data)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(
        ()=>{
            GetPost()
        },[setPost]
    )

    return (
        <div className="PostPage">
            <Header/>
                {
                    Post?
                    Post.map(
                        fun =>(
                                <div key={fun._id} className='post'>
                                    <div className="post__header">
                                        <div className="post__author">{fun.author}</div>
                                        <div className="post__datetime">
                                            <p className="date">{converDate(fun.date)}</p>

                                        </div>

                                        
                                    </div>
                                    <div className="post__tags">
                                            {
                                                fun.tags.split(',').map(
                                                    tag=>(
                                                        <button name={tag} className='post__tag' onClick={filterTag}>{tag}</button>
                                                    )
                                                )
                                            }
                                    </div>
                                    <div className="post__title">{fun.title}</div>

                                    <p className="post__text">
                                        {fun.content}
                                    </p>

                                </div>

                        )
                    ):
                        <h1>К сожалению такого поста нет :’(</h1>
                }

        </div>
    )}