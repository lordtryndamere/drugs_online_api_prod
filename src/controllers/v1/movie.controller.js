
const { getRepository, Like } = require('typeorm');
const { movie, category } = require('../../schemas')
const { AwsLib } = require('../../tools/aws')
const awsInstance = new AwsLib();
const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')

class MovieController {
  getMovies = async (req, res) => {
    try {
      const { body } = req;
      const arg = body.filter;
      let movies = await movie.find({ "name": { $regex: arg, $options: 'i' }, status: 'active' }).populate({ path: 'category' })


      if (movies.length == 0) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 404,
            message: 'No encontramos nada ',
          }), res);
      }
      movies = movies.map((value) => {
        return {
          name: value.name,
          sinopsis: value.sinopsis,
          posterImg: `${process.env.AWS_URI_LOCATION}${process.env.AWS_MOVIES_FOLDER}${value.posterImg}`,
          status: value.status,
          videoUri: `${process.env.AWS_URI_LOCATION}${process.env.AWS_MOVIES_FOLDER}${value.videoUri}`,
          categoryId: value.category[0]._id,
          categoryName: value.category[0].name,
          categoryStatus: value.category[0].status

        }
      });
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Peliculas  listadas!',
        data: {
          movies
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }

  createMovie = async (req, res) => {
    try {
      const { body, files } = req;
      const arrFiles = [
        { posterImg: files.posterImg },
        { videoUri: files.videoUri }
      ];
      const ifExistsMovie = await movie.findOne({ 'name': body.name });
      if (ifExistsMovie) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 402,
            message: 'Esta pelicula ya existe',
          }), res);
      }
      let saveMovie = { ...body, created_at: Date.now };

      for (const iterator of arrFiles) {
        let key = Object.keys(iterator)[0];
        let upload = await awsInstance.uploadFile(iterator, 'movies/assets');
        if (key === 'posterImg') saveMovie.posterImg = upload.data.nameImage;
        if (key === 'videoUri') saveMovie.videoUri = upload.data.nameImage;
      }



      await movie.create(saveMovie);
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Pelicula  creada!',
        data: {
          saveMovie
        },
      }), res);

    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }

  createCategory = async (req, res) => {
    try {
      const { body } = req;
      const ifExistsCategory = await movie.findOne({ 'name': body.name });
      if (ifExistsCategory) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 402,
            message: 'Esta categoria ya esta creada ...',
          }), res);
      }
      const saveCategory = { ...body, created_at: Date.now }
      await category.create(saveCategory);
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Categoria   creada!',
        data: {
          saveCategory
        },
      }), res);

    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }

  getMoviesByCategory = async (req, res) => {
    try {
      const { params } = req;

      let movies = await movie.find({ "category": params.categoryId, status: 'active' }).populate({ path: 'category' })


      if (movies.length == 0) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 404,
            message: 'No encontramos nada ',
          }), res);
      }
      movies = movies.map((value) => {
        return {
          name: value.name,
          sinopsis: value.sinopsis,
          posterImg: `${process.env.AWS_URI_LOCATION}${process.env.AWS_MOVIES_FOLDER}${value.posterImg}`,
          status: value.status,
          videoUri: `${process.env.AWS_URI_LOCATION}${process.env.AWS_MOVIES_FOLDER}${value.videoUri}`,
          categoryId: value.category[0]._id,
          categoryName: value.category[0].name,
          categoryStatus: value.category[0].status

        }
      });
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Peliculas  listadas!',
        data: {
          movies
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }


  getCategories = async (req, res) => {
    try {

      let categories = await category.find({ status: 'active' });


      if (categories.length == 0) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 404,
            message: 'No encontramos nada ',
          }), res);
      }
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Categorias listadas correctamente',
        data: {
          categories
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }




}

module.exports = MovieController;