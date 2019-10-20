const mariadb = require('mariadb');
const fs = require('fs');

(async () => {
    let connection;
    try {
        connection = await mariadb.createConnection({ host: "127.0.0.1", port: "3306", user: "root", password: "keko" });
        let result = await connection.query(fs.readFileSync("../createDatabase.sql").toString());
        console.log("Result: ", JSON.stringify(result));
        result = await connection.query(fs.readFileSync("../createUser.sql").toString());
        console.log("Result: ", JSON.stringify(result));
        result = await connection.query(fs.readFileSync("../createTable.sql").toString());
        console.log("Result: ", JSON.stringify(result));
        const rows = fs.readFileSync("../insertTestData.sql").toString().split('\n');
        await Promise.all(rows.map(row => connection.query(row).then(result => console.log("Result: ", JSON.stringify(result)))));
        await connection.end();
    }
    catch (error) {
        console.log("Error: ", error);
        await connection.end();
    }
})();
