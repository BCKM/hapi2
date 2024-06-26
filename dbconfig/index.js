const Sequelize = require("sequelize");

const sequelize = new Sequelize('hapi_tutorial', 'root', 'Km1114_1205aJ', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console
}).catch(() => {

})