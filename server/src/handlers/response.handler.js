// RESPONSE WITH DATA
const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data)

// ERROR
const error = (res) => responseWithData(res, 500, {
    status: 500,
    message: "Uh Oh! Somethings wrong!"
});

// BAD REQUEST
const badrequest = (res, message) => responseWithData(res, 400, {
    status: 400,
    message
});

// OK
const ok = (res, data) => responseWithData(res, 200, data);

// CREATED
const created = (res, data) => responseWithData(res, 201, data);

// UNAUTHORIZE
const unauthorize = (res) => responseWithData(res, 401, {
    status: 401,
    message: "Unauthorized"
});

// NOT FOUND
const notfound = (res) => responseWithData(res,404, {
    status: 404,
    message: "Resource not found"
});

export default {
    error, badrequest, ok, created, unauthorize, notfound
};