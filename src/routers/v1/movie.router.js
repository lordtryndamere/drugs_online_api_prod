const {Router} = require('express');
const {MovieController} = require('../../controllers/v1')
const movie = new MovieController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.post('/get-movies',movie.getMovies   );
    router.post('/create-movie',movie.createMovie   );
    router.post('/create-category',movie.createCategory   );

    return router
}