const {Router}= require('express')
const router= Router()
const User= require('../models/User')
const {check, validationResult, body}= require('express-validator')

router.put(
    '/update',
    [ check(
        'login',
        'The minimum login length is 5 characters').isLength(
            {min:5})],
// параметры проверки
    async (req,res)=>{
        try{
//проверка данны

            const errors=validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            
            const data= await User.findOneAndUpdate(
                {login:req.body.old_login},
                { $set: {login: req.body.login}})
            res.status(200).json({data})
        }
        catch(e){
            res.status(500).json({massage:"Что-то пошло не так!"})
        }
    })
module.exports = router ;