# Freejoas-backend
 This is the back-end server for freejoas app

Front-end is developed by [EugeneRaynerNZ](https://github.com/EugeneRaynerNZ), vist  [here](https://github.com/EugeneRaynerNZ/freejoas) to see more front-end detail. 

# API Documentation

## Overview

**URL**:{baseUrl}/api/v1/
- *Request parameters* : none
- *Header* : 
    `Content-Type: application/json`
    `Authorization: "Bearer " + token`
- *Response* :JSON format
```json
    {
        "message":"A message from endpoint",
        "data":"Object content"
    }
```
- *Error* :JSON format
```json
    {
        "message":"A message from endpoint",
        "error":"Error message"
    }
```

- **Freejoa Object**
```json
{
 "latitude": "String",
    "longitude": "String",
    "title": "String",
    "isActive": "Boolean",
    "status": {
        "type": "String",
        "enum": ["low", "mid", "high"],
    },
    "image":[
        {
            "_id": "mongoose.Schema.Types.ObjectId",   
            "data": "String(base64)",
            "contentType": "String",
            "filename": "String",
        }
    ],
    "amount": "Number",
    "description": "String",
    "uploader": "mongoose.Schema.Types.ObjectId",
    "updatedBy": "mongoose.Schema.Types.ObjectId",
}
```

## User Endpoints

- **GET /user/all**
    - *Description*: Retrieve all user object in database
    - *Required Account Type*: `admin`
    - *Request body*: none

- **GET /user/profile**
    - *Description*: Only return the user object of the requesting user for receiving personal information.
    - *Required Account Type*: none
    - *Request body*: none


- **GET /user/find**
    - *Description*: Return an user object with a required user ID
    - *Required Account Type*: `admin`
    - *Request body*: 
    ```json
    {
        "userId":"xxxxxxx"
    }
    ```

- **POST /user/login**
    - *Description*:login endpoint
    - *Required Account Type*: none
    - *Request body*: 
    ```json
    {
        "email":"xxxxxxx",
        "password":"xxxxxxx"
    }
    ```
- **POST /user/create**
    - *Description*: Register new user
    - *Required Account Type*: none
    - *Request body*: 
    ```json
    {
        "username":"xxxxxxx",
        "firstname":"xxxxxxx",
        "lastname":"xxxxxxx",
        "email":"xxxxxxx",
        "password":"xxxxxxx"
    }
    ```
- **PATCH /user/update**
    - *Description*: Update user information, but this endpoint is not allowed for updating account types. In the future, password updates will also be separated into a separate endpoint from this one.
    - *Required Account Type*: none
    - *Request body*: 
    ```json
    {
        "username":"xxxxxxx",
        "firstname":"xxxxxxx",
        "lastname":"xxxxxxx",
        "email":"xxxxxxx",
        ...
    }
    ```
- **PATCH /user/accounttype**
    - *Description*: Only for update user's accounty type
    - *Required Account Type*: `admin`
    - *Request body*: 
    ```json
    {
        "userId":"xxxxxxx",
        "accountType":"xxxxxxx",
    }
    ```
-   **DELETE /user/delete**
    - *Description*: delete a user by user ID
    - *Required Account Type*: `admin`
    - *Request body*: 
    ```json
    {
        "userId":"xxxxxxx",(required)
    }
    ```

## Freejoa Endpoints

- **GET /freejoa/all**
    - *Description*: Retrieve all freejoa object in database
    - *Required Account Type*: none
    - *Request body*: none
    ```json
    {
        "freejoaId":"xxxxxxx"
    }
    ```
    - *Example Respond*
    ```json
    {
        "message":"All freejoas returned successfully",
        "data": {
           Freejoa Object 
        },
        ...
    }
    ```

- **GET /freejoa/find**
    - *Description*: Return an freejoa object with a required freejoa ID
    - *Required Account Type*: none
    - *Request params*: 
    ```json
    {
        "freejoaId":"xxxxxxx",
    }
    ```
    - *Example Respond*
    ```json
    {

        "message": "Freejoa is found",
        "data": {
            Freejoa Object 
            },
            ...
    }
    ```

- **POST /freejoa/upload**
    - *Description*: Upload a new freejoa
    - *Required Account Type*: none
    - *Request body*: 
    ```json
    {
        "latitude":"xxxxxxx",
        "longitude":"xxxxxxx",
        "title":"xxxxxxx",
        "amount":"xxxxxxx",
        "description":"xxxxxxx",
    }
    ```
    - *Example Respond*
    ```json
    {

        "message": "New freejoa uploaded successfully"
    }
    ```

- **PATCH /freejoa/update**
    - *Description*: update a new freejoa, `freejoaId` is required in request body
    - *Required Account Type*: none
    - *Request body*: 
    ```json
    {
        "freejoaId":"xxxxxxx",
        "latitude":"xxxxxxx",
        "longitude":"xxxxxxx",
        "title":"xxxxxxx",
        "amount":"xxxxxxx",
        "description":"xxxxxxx",
    }
    ```
    - *Example Respond*
    ```json
    {

        "message": "Freejoa updated successfully"
    }
    ```

- **DELETE /freejoa/delete**
    - *Description*: delete a user by user ID
    - *Required Account Type*: `admin`
    - *Request params*: 
    ```json
    {
        "freejoaId":"xxxxxxx",
    }
    ```
    - *Example Respond*
    ```json
    {

        "message": "Freejoa: ${freejoaId} is deleted by admin: ${adminId}"
    }
    ```



