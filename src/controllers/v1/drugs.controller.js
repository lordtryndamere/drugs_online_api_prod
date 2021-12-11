
const { getRepository,Like } = require('typeorm');


const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')

class DrugsController {








  getDrugs = async (req, res) => {
    try {
      const drugsRepository = getRepository('Drugs');
      const drugs = (await drugsRepository.find({
        where: {
        name:Like(`%${!req.body.filter?'':req.body.filter}%`),   
          state:  'active',
        }
      }));
      return controllerResponse(createResponse({
        httpStatusCode:201,
        message:'Droguerias listadas!',
        data: {
            drugs
        },
      }), res);
    } catch (e) {
      console.error('Error in getDrugs', e);
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }));
    }
  }

 


}

module.exports = DrugsController;