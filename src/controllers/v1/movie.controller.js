
const { getRepository,Like } = require('typeorm');
const {movie,category} = require('../../schemas')
const { AwsLib } = require('../../tools/aws')
const awsInstance = new AwsLib();
const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')

class MovieController {
  getMovies = async (req, res) => {
    try {
      const {body} = req;
      const arg = body.filter;
      let movies = await movie.find({"name": {$regex: arg, $options: 'i'}, status:'active'}).populate({path:'category'})
   

      if(movies.length == 0) {
        return controllerResponse(
          createErrorResponse({
        httpStatusCode:404,
        message: 'No encontramos nada ',
      }),res);
    }
    movies = movies.map((value)=>{
      return{
        name:value.name,
        sinopsis:value.sinopsis,
        posterImg:value.posterImg,
        status:value.status,
        videoUri:value.videoUri,
        categoryId:value.category[0]._id,
        categoryName:value.category[0].name,
        categoryStatus:value.category[0].status
    
      }
    });
      return controllerResponse(createResponse({
        httpStatusCode:201,
        message:'Peliculas  listadas!',
        data: {
          movies
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }),res);
    }
  }

  createMovie = async(req,res) =>{
    try {
      const {body} = req;
      const ifExistsMovie = await movie.findOne({'name':body.name});
      if(ifExistsMovie) {
        return controllerResponse(
          createErrorResponse({
        httpStatusCode:402,
        message: 'Esta pelicula ya existe',
      }),res);
    }
    const saveMovie = {...body,created_at:Date.now}
    await movie.create(saveMovie);
    return controllerResponse(createResponse({
      httpStatusCode:201,
      message:'Pelicula  creada!',
      data: {
        saveMovie
      },
    }), res);
      
    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }),res);
    }
  }

  createCategory = async(req,res) =>{
    try {
      const {body} = req;
      const ifExistsCategory = await movie.findOne({'name':body.name});
      if(ifExistsCategory) {
        return controllerResponse(
          createErrorResponse({
        httpStatusCode:402,
        message: 'Esta categoria ya esta creada ...',
      }),res);
    }
    const saveCategory = {...body,created_at:Date.now}
    await category.create(saveCategory);
    return controllerResponse(createResponse({
      httpStatusCode:201,
      message:'Categoria   creada!',
      data: {
        saveCategory
      },
    }), res);
      
    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }),res);
    }
  }

 


}

module.exports = MovieController;