const {Router}  = require('express');
const userRouter  = require('./user.router');
const drugsRouter  = require('./drugs.router');
const productsRouter  = require('./products.router');
const videoRouter = require('./video.router');
module.exports = ()=>{
    const router = Router();
    router.use('/users',userRouter())
    router.use('/drugs',drugsRouter())
    router.use('/products',productsRouter())
    router.use('/video',videoRouter())


    return router;
}