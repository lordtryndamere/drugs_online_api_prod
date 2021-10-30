
const {getRepository} = require('typeorm');
const sha1 = require('crypto-js/sha1')
const {generateAuthToken,TokenTool,generateAccessToken} = require('../../tools/token');
const {createErrorResponse,createResponse,controllerResponse} = require('../../tools/response')
const tokenLibrary = new TokenTool();

class UserController {
    getAccessToken = (req,res) => {
        const accessToken = generateAccessToken();
    
        return controllerResponse(
          createResponse({
            data: {
              accessToken,
            },
            message: 'Token de acceso generado correctamente!',
          }),
          res
        );
      };

     login = async (req,res)=>{
    try {
        const {body} = req;
        const userRepository = getRepository('User');
        const user = (await userRepository.findOne({
          where: {
            email: body.email,
          },
        })) ;
        if (!user) {
          return controllerResponse( createErrorResponse({
            httpStatusCode: 404,
            message: 'Usuario no encontrado',
          }),res );
        }
        if (user.state !== 'active') {
          return controllerResponse( createErrorResponse({
            httpStatusCode: 400,
            message: 'Su usuario se encuentra inactivo',
          }),res );
        }
       
        const passwordCheck =  await sha1(body.password).toString()
       
      
        if (passwordCheck !== user.password) {
          return controllerResponse( 
            createErrorResponse({
            httpStatusCode: 403,
            message: 'Contraseña invalida',
          }),res );
        }
        const authToken = generateAuthToken({
            idUser: user.idUser,
        });
        await tokenLibrary.saveUserToken({
          authToken,
          repository: getRepository('UserToken'),
          user,
        });
        const userCopy = { ...user };
        delete userCopy.password;
        return  controllerResponse( 
            createResponse({
          data: {
            user: userCopy,
            authToken,
          },
          message: 'Usuario logueado correctamente',
        }),res  );      
    } catch (e) {
        return controllerResponse(createErrorResponse({
            message: 'Server error',
            data: e,
          }),res );
    }
  
    }

     createAccount =  async (req,res)=>{
        try {

            let {body} = req;
            let user = body;
            const userRepository = getRepository('User');
            const existsUser = await userRepository.findOne({
              where: {
                email: body.email,
              },
            });
            if (existsUser) {
              return controllerResponse( createErrorResponse({
                httpStatusCode: 400,
                message: 'El usuario ya se encuenta registrado!',
              }),res);
            }

        const hashPassword  = await sha1(body.password).toString();
        user.password = hashPassword
        user.createdAt = new Date();
            const savedUser = await userRepository.save(user);
            const authToken = generateAuthToken({
                idUser: savedUser.insertId
            });
            await tokenLibrary.saveUserToken({
              authToken,
              repository: getRepository('UserToken'),
              user: savedUser ,
            });
            delete savedUser.password;
            return controllerResponse(
                createResponse({
                    httpStatusCode: 201,
                    message: 'Usuario creado exitosamente!',
                    data: {
                      user: savedUser,
                      authToken,
                    },
                  }),
                  res
            );
       
          } catch (e) {
            return controllerResponse(createErrorResponse({
                message: 'Server error ' + e ,
                data: e,
              }),res );
          }
    }
    async getUser(req,res){
        const idUser = req.params.id
        let user  = getRepository("User")
        let findUser  =await  user.findOne({
            where: {
                idUser
            },
            relations:['role','dependency']
        })
        if(!findUser){
            return res.status(404).send({
                message:"Usuario no encontrado"
            })
        }
        res.status(200).send({
            message:"Usuario encontrado",
            data:findUser
        })
    }
    async getUsers(req,res){

        let user  = getRepository("User")
        let findUser  =await  user.find({
            where: {
                state:1
            },
          
        })
        if(findUser.length == 0){
            return res.status(404).send({
                message:"Usuarios no encontrados"
            })
        }
        res.status(200).send({
            message:"Usuarios listados exitosamente",
            data:findUser
        })
    }

    async deleteUser(req,res){
        const idUser = req.params.id
        const user  = getRepository("User")
        let findUser  =await  user.findOne({
            where: {
                idUser
            },
        })
        if(!findUser){
            return res.status(404).send({
                message:"Usuario no encontrado"
            })
        }
        await user.remove(findUser)
        res.status(200).send({
            message:"Usuario eliminado exitosamente!",
            data:{}
        })
    }

    async updateUser(req,res){
        const idUser = req.params.id
        let data = req.body
        const user  = getRepository("User")
        let findUser  =await  user.findOne({
            where: {
                idUser
            },
          
        })
        if(!findUser){
            return res.status(404).send({
                message:"Usuario no encontrado"
            })
        }
        if(data.dependencyId){
            data.dependency = {
                idDependency:data.dependencyId
            }
            delete data.dependencyId
        }
        if(data.rolId){
            data.role = {
                idRol: data.rolId
            }
            delete data.rolId
        }
        console.log(data);
        await user.update({idUser},data)
        findUser = await  user.findOne({
            where: {
                idUser
            },
            relations:['role','dependency']
        })
      
        res.status(200).send({
            message:"Usuario actualizado exitosamente!",
            data:findUser
        })
    }


}

module.exports  = UserController;