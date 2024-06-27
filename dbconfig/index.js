const Sequelize = require("sequelize");

const sequelize = new Sequelize('hapi_tutorial', 'root', 'Km1114_1205aJ', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});


module.exports.connect = sequelize
// module.exports.getUsers = async function testConnection() {
        
//         try{
//             await sequelize.authenticate();
//             console.log("Connected!")
//             const [results, metadata] = await sequelize.query('SELECT * FROM users');
//             return results;
//         } catch(err) {
//             console.log("Can't connect to DB!");
//         }

//     }



// sequelize.authenticate().then(() => {    // to check if it will connect to db
//     console.log("Connected to DB!");
// }).catch(() => {
//     console.log("Could not connect");
// })