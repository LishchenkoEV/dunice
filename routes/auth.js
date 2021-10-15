const express = require('express');
const {Router}= require('express')
const User = require('../models/User')
const router= Router()
const bcrypt = require('bcrypt');
const {check, validationResult}= require('express-validator')
const jwt= require('jsonwebtoken')
const config=require('config')
// регистрация

router.post(
    '/reg',
// параметры проверки
    [ check('login','The minimum login length is 5 characters').isLength({min:5}),
    check('password','The minimum password length is 8 characters').isLength({min:8})
],
    async (req,res)=>{
    try{
//проверка данных
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors})
        }
        const {login, password}= req.body
        const candidate = await User.findOne({login})
        if(candidate){
            const truepass= await bcrypt.compare(password, candidate.password)
            if(!truepass)
                return res.status(400).json({massage:'Incorrect password'})

        }
        else{
            const hash = await bcrypt.hash(password, 12)
            const user = new User({login,password: hash})
            await user.save()
        }
        const user = await User.findOne({login})

        const token= jwt.sign(
            {UserID: user.id},
            config.get('jwtSecret'),
            {expiresIn:'6h'}
        )
        res.json({token, UserID: user.id})

    }
    catch(e){
        res.status(500).json({massage:"Что-то пошло не так!"})
    }
})
// аунтификация

module.exports = router ;





