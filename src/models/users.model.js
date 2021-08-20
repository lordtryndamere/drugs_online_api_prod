var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", // Will use table name `category` as default behaviour.
    tableName: "user", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        idUser: {
            name:'id_user',
            primary: true,
            type: "int",
            generated: true,
        },
        document: {
            name:"document",
            type: "varchar",
            length:255,
            nullable:false,
        },
        state:{
            type:"bit",
            nullable:false,
        },
        email:{
            type:"varchar",
            length:255,
            nullable:false,
        }
        ,
        nombre:{
            name:"nombre",
            type:"varchar",
            length:255,
            nullable:false,
        }
        ,
        username:{
            name:"username",
            type:"varchar",
            length:255,
            nullable:false,
        }
    },
    relations: {
        role: {
            target: "Role",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        },
        dependency:{
            target: "Dependency",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
});