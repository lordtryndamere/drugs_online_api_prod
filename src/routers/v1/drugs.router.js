const {Router} = require('express');
const {DrugsController} = require('../../controllers/v1')
const drugs = new DrugsController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.post('/get-drugs',vertifyTokenMiddleware('access'),drugs.getDrugs)

    return router
}