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

const queryPromise= (query) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// function queryPromise(query: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//         mysqlConnection.query(query, function (err: any, result: any) {
//             if (err) reject(err);
//             resolve(result);
//         });
//     });
// }

// export default mysqlConnection;

export {
    mysqlConnection,
    queryPromise
};