import mysql from "mysql";

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'customizer'
});
mysqlConnection.connect(function (err) {
    if (err) throw err;
    else {
        console.log('Connected to mysql!');
    }
});

export default mysqlConnection;