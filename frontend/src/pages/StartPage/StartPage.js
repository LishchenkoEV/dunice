import React, {useEffect, useState} from 'react'
import {Header} from '../Header/Header'
import {useAuth} from "../../hooks/auth.hook";
import { Link } from 'react-router-dom';
import Pagination from './Pagination'
import './style.css'
import { useHistory } from 'react-router-dom';
import axios from "axios";

function converDate(string) {
    let date = new Date(string)
    let final_string = `${date.getDate()>9? date.getDate()
        :'0'+date.getDate()}/${date.getMonth()>9? date.getMonth():
        '0'+date.getMonth()}/${date.getFullYear()}\n${date.getHours()}:${date.getMinutes()}`

    return final_string
}
function SearchPost(FilteredPosts,Search){

    const SearchTitle = FilteredPosts.filter(post => {
        return post.title.toLowerCase().includes(Search.toLowerCase())
    })
    const SearchContent = FilteredPosts.filter(post => {
        return post.content.toLowerCase().includes(Search.toLowerCase())
    })
    let FindPosts = new Set()
    for (let elem of SearchTitle) {
        FindPosts.add(elem)
    }
    for (let elem of SearchContent) {
        FindPosts.add(elem)
    }
    const SearchPosts = Array.from(FindPosts)
    SearchPosts.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
    });
    return SearchPosts
}
const ParseTags=()=>{
    let hashParams={tags:'',filter:''}
    if(window.location.href.split('/')[3]){
        let tags=window.location.href.split('/')[3].replace('&filter=[', '')
        tags=tags.replace('?tags=[','')
        hashParams={ tags:tags.split(']')[0].split(','),filter:tags.split(']')[1].split(',')[0]}
    }

    return hashParams
}
const GetPost = async (setFilteredPost, setTag, setAuthor, setCount,setSearch) => {
    try {
    const param=ParseTags()
// получение всех пользователей
        axios.get('api/post/all',{
            headers:{'Content-Type': 'application/json'},
            params:{selectedTags:param.tags}
        }).then(res=>{
            const data=res.data.filter
            //поиск
            setFilteredPost(data)
            setTag(res.data.tags)
            setAuthor(res.data.authors.length)
            setCount(res.data.postQuantity)
            setSearch(param.filter)
        })
    } catch (e) {
        console.log(e)
    }
}

export const StartPage= ()=>{
    const history=useHistory()
    const {token} = useAuth()
    const isAuthenticated = !!token
    const [CurrentPage,setCurrentPage]=useState(1)
    const [PostPerPage]=useState(10)
//получение всех постов
    const [Posts,setPost]=useState([])
    const [Count,setCount]=useState([])
    const [Author,setAuthor]=useState([])
    const [Tags,setTag]=useState([])
    const [FilteredPosts,setFilteredPost]=useState([])
    const [Search,setSearch]=useState('')
    const SearchPosts = SearchPost(FilteredPosts,Search)
    const [selectedTags,setSelectedTags]=useState([])

    useEffect(
        ()=>{
            GetPost(setFilteredPost, setTag, setAuthor, setCount,setSearch)
        },[setFilteredPost, setTag, setAuthor, setCount,setSearch,history.location])

    // обработчики
    const changeHandler = event => {
        setSearch(event.target.value.trim())
    }
    function getCheckedCheckBoxes() {
        const checkboxes = document.getElementsByClassName('checkbox');
        const checkboxesChecked = []; // можно в массиве их хранить, если нужно использовать
        for (let index = 0; index < checkboxes.length; index++) {
            if (checkboxes[index].checked) {
                checkboxesChecked.push(checkboxes[index].value); // положим в массив выбранный
            }
        }
        setSelectedTags(checkboxesChecked)
    }
    const filterTag=(event)=>{
        history.push('?tags=['+event.target.name+']&filter=['+Search+']')
        document.getElementById('search').value = '';
        window.location.reload(false)
    }

        //фильтрация
    const activate_filter=()=> {
        getCheckedCheckBoxes(setSelectedTags)
        history.push({
            pathname:'/',
            search:'?tags=['+selectedTags+']&filter=['+Search+']'
        })

    }
    const disable_filter=()=>{
        const checkboxes = document.getElementsByClassName('checkbox');
        for (let index = 0; index < checkboxes.length; index++) {
            if (checkboxes[index].checked) {
                checkboxes[index].checked=0 // положим в массив выбранный
            }
            setFilteredPost([...Posts])
            setSelectedTags([])
        }
        document.getElementById('search').value = '';
        history.push({
            pathname: '/',
            search: ''
        })


    }
    //пагинация

    const revSearchPosts = SearchPosts.reverse()
    const lastPostIndex = CurrentPage * PostPerPage
    const firstPostIndex = lastPostIndex - PostPerPage
    const CurrentPost = revSearchPosts.slice(firstPostIndex, lastPostIndex)
    const paginate = pageNumber => setCurrentPage(pageNumber)

//select
    const [flag,setFlag] = useState(false)
    const showCheckboxes=()=> {
        const checkboxes = document.getElementById("checkboxes");
        if (!flag) {
            checkboxes.style.display = "block";
            setFlag(true);
        } else {
            checkboxes.style.display = "none";
            setFlag(false);
        }
    }

    return(
        <div className="StartPage">
            <Header/>
            <div className='body'>
                {isAuthenticated===true?
                    <div className="cards">
                        <div className="cards__header">
                            <input className="cards__search"
                                   type="text"
                                   id='search'
                                   onChange={changeHandler}
                            />
                            <div className="cards__tegs">
                                <div className="multiselect">
                                    <div className="selectBox" onClick={showCheckboxes}>
                                        <select>
                                            <option>Выбранные теги</option>
                                        </select>
                                        <div className="overSelect"></div>
                                    </div>
                                    <div id="checkboxes" >{
                                        Tags.map(
                                        elem=>(
                                        <label>
                                            {elem}
                                            <input type="checkbox"
                                               id={elem}
                                               className='checkbox'
                                               value={elem}
                                                onChange={getCheckedCheckBoxes}
                                            />
                                        </label>
                                        ))}
                                    </div>
                                </div>
                            </div>


                                    <button className="cards__filter"
                                            onClick={activate_filter}
                                    >фильтровать
                                    </button>

                                <button className="cards__filters-off"
                                          onClick={disable_filter}>
                                    сбросить фильтры
                                </button>

                        </div>
                        <div className="cards__items">
                            {
                                CurrentPost.map(
                                    fun =>(
                                        <Link className='Post-Link'
                                              to ={'/post/'+fun._id}
                                        >
                                            <div key={fun._id} className='card'>
                                                <div className="card__header">
                                                    < div className="card__datetime">
                                                        <h1 className="date">{converDate(fun.date)}</h1>
                                                    </div>

                                                    <div className="card__title">{fun.title.substring(0, 12)}</div>

                                                    <div className="card__tags">
                                                        {
                                                            fun.tags.split(',').map(
                                                                tag=>(
                                                                    <button
                                                                        className="card__tag"
                                                                        name={tag}
                                                                        onClick={filterTag}
                                                                    >
                                                                        {tag}
                                                                    </button>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>

                                                <p className="card__text">
                                                    {fun.content.length > 120 ? fun.content.substring(0, 120) + '...' : fun.content}
                                                </p>

                                                <div className="card__author">{fun.author}</div>

                                            </div>
                                        </Link>
                                    )
                                )
                            }


                        </div>
                        <Pagination
                        CurrentPage={CurrentPage}
                        setCurrentPage={setCurrentPage}
                        PostPerPage={PostPerPage}
                        totalPost={SearchPosts.length}
                        paginate={paginate}
                        />
                    </div>
                    :
                    <div className='Unauthorized-label'>
                        <h1 className='text'>В этом месяце было <b className='text-strong'>{Count}</b> новых постов<br/>
                            созданные <b  className='Unauthorized-label-strong'>{Author}</b> авторами.Для использования<br/>
                            приложения необходимо авторизоваться”
                        </h1>
                    </div>}
            </div>
        </div>
    )
}