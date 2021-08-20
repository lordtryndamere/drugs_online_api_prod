var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Role", // Will use table name `category` as default behaviour.
    tableName: "role", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        idRol: {
            name:'id_rol',
            primary: true,
            type: "int",
            generated: true,
        },
        description: {
            name:"description",
            type: "varchar",
            length:255,
            nullable:false,
        },
        state:{
            type:"bit",
        
            nullable:false,
        },
        siglaRol:{
            name:"sigla_rol",
            type:"varchar",
            length:255,
            nullable:false,
        }
    },
    relations: {
        user: {
            target: "User",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        },
     
    }
});