import mysql from "mysql";

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'customizer'
});
connection.connect(function (err) {
    if (err) throw err;
    else {
        console.log('Connected to mysql!');
    }
});

export default connection;