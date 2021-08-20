
const {getRepository} = require('typeorm');
class UserController {
    async createUser(req,res){
        try {
            let data  = req.body;
            let user  = getRepository("User")
            let findUser  =await  user.findOne({
                where: {
                    document:data.document
                }
            })
            if(findUser){
                return res.status(401).send({
                    message:"El usuario ya existe!"
                })
            }
            data.role = {
                idRol: data.rolId
            }
            data.dependency = {
                idDependency:data.dependencyId
            }
            let recorUser =await  user.save(data)
            findUser = await  user.findOne({
                where: {
                    idUser:recorUser.idUser
                },
                relations:['role','dependency']
            })
            res.status(200).send({
                message:"Usuario creado exitosamente",
                data:findUser
            })           
        } catch (error) {
            return res.status(500).send({message:error})
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
        await user.delete(findUser)
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