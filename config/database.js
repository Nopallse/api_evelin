const Sequelize = require('sequelize');

const db = new Sequelize('coworking','root','',{
    host:"localhost",
    dialect:"mysql",
    logging: false 

});

module.exports = db; 
