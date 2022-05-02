exports.asyncQuery = async(conn, query) => {
    return new Promise((resolve, reject) => {
        conn.query(query, (error, results) => {
            if(!error) {
                resolve(results);
            }
            else {
                reject(error);
            }
        });
    });
};