var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Dependency", // Will use table name `category` as default behaviour.
    tableName: "dependency", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        idDependency: {
            name:'id_dependency',
            primary: true,
            type: "int",
            generated: true,
        },
        cargo: {
            name:"cargo",
            type: "varchar",
            length:255,
            nullable:false,
        },
        codigo: {
            name:"codigo",
            type: "varchar",
            length:255,
            nullable:false,
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