const {Router} = require('express');
const {UserController} = require('../../controllers/v1')
const user = new UserController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.post('/create-account',vertifyTokenMiddleware('access'),user.createAccount)
    router.get('/generate-access-token', user.getAccessToken);
    router.post('/login',vertifyTokenMiddleware('access'),user.login)
    router.post('/veriphy-phone',vertifyTokenMiddleware('access'),user.sendVerifyPhone)
    router.post('/veriphy-email',vertifyTokenMiddleware('access'),user.sendVerifyEmail)
    router.get('/get-profile',vertifyTokenMiddleware('auth'),user.getProfile)
    router.delete('/disable-account',vertifyTokenMiddleware('auth'),user.disableAccount)
    router.put('/update-profile/:id',vertifyTokenMiddleware('auth'),user.updateProfile)
    return router
}