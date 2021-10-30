const {Router} = require('express');
const {UserController} = require('../../controllers/v1')
const user = new UserController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.post('/create-account',vertifyTokenMiddleware('access'),user.createAccount)
    router.get('/generate-access-token', user.getAccessToken);
    router.post('/login',vertifyTokenMiddleware('access'),user.login)
    router.get('/get-profile/:id',vertifyTokenMiddleware('auth'),user.getUser)
    router.delete('/disable-account/:id',vertifyTokenMiddleware('auth'),user.deleteUser)
    router.put('/update-profile/:id',vertifyTokenMiddleware('auth'),user.updateUser)
    return router
}