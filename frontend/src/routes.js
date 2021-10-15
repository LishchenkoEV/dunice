import React from 'react'
import {Switch, Route } from 'react-router-dom'
import {AddPage} from './pages/AddPage/AddPage'
import {PostPage} from './pages/PostPage/PostPage'
import {StartPage} from './pages/StartPage/StartPage'
import {ProfilePage} from "./pages/ProfilePage/ProfilePage";

export const useRouts= isAuthenticated =>{

    if(isAuthenticated)
        return(
            <Switch>
                <Route path="/" exact>
                    <StartPage/>
                </Route>
                <Route path="/add-post" >
                    <AddPage/>
                </Route>
                <Route path="/profile" >
                    <ProfilePage/>
                </Route>
                <Route path="/post/:post_id" >
                    <PostPage/>
                </Route>
            </Switch>
        )
    else
        return(
            <Switch>
                <Route path="/" >
                    <StartPage/>
                </Route>
            </Switch>

        )
}