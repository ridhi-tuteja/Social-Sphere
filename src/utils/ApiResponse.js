class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success =statusCode<400;   //>400 for ApiError (acc to our memo)
        
    }
}

export {ApiResponse};