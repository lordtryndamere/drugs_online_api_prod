const {Router} = require('express');
const {UserController} = require('../../controllers/v1')
const user = new UserController();
module.exports = () =>{
    const router = Router();
    router.post('/',user.createUser)
    router.get('/:id',user.getUser)
    router.get('/',user.getUsers)
    router.delete('/:id',user.deleteUser)
    router.put('/:id',user.updateUser)
    return router
}