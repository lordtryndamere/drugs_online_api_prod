const {Router}  = require('express');
const userRouter  = require('./user.router');

module.exports = ()=>{
    const router = Router();
    router.use('/users',userRouter())


    return router;
}