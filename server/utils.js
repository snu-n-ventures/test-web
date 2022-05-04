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


exports.handleError = async(request, response, error) => {
    const { url, method } = request;
    const status = error.status || 500;
    const message = error.sqlMessage || error.code || error.message;
    const code = error.code || error.message;

    console.log(new Date());
    console.log(`Method: ${method}`);
    console.log(`Status: ${status}`);
    console.log(`Message: ${message}`);

    response.status(status).send(code);
}