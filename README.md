# Freejoas-backend
 This is the back-end server for freejoas app

Front-end is developed by [EugeneRaynerNZ](https://github.com/EugeneRaynerNZ), vist  [here](https://github.com/EugeneRaynerNZ/freejoas) to see more. 


# API Documentation

## Overview

- *Request Header* : 
    `Content-Type: application/json`
    `Authorization: "Bearer " + token`
    Token is required for all endpoints except login and sign up. 
- *Response Example* :
```json
    {
        "message":"Success message from endpoint",
        "data":"Object content"
    }
```
- *Response Error Example* :
```json
    {
        "message":"Error message from endpoint",
        "error":"Error content"
    }
```

- **User Object**
```json
{
    "_id": "String",    // mongoose.Schema.Types.ObjectId
    "avatar": "String",
    "username": "String",
    "firstname": "String",
    "lastname": "String",
    "email": "String",
    "password": "String",
    "googleSub": "String",
    "accountType":"String",
    "uploader": "String",   // mongoose.Schema.Types.ObjectId
    "updatedBy": "String",  // mongoose.Schema.Types.ObjectId
}
```


- **Freejoa Object && pending-Freejoa Object**
```json
{
    "latitude": "String",   // mongoose.Schema.Types.ObjectId
    "longitude": "String", 
    "title": "String",
    "isActive": "Boolean",
    "status": "String",
    "image":[
        {
            "_id": "String",    // mongoose.Schema.Types.ObjectId
            "data": "String",   // base-64 image string
            "contentType": "String",
            "filename": "String",
        }
    ],
    "amount": "Number",
    "description": "String",
    "uploader": "String",   // mongoose.Schema.Types.ObjectId
    "updatedBy": "String",  // mongoose.Schema.Types.ObjectId
}
```

# APIs - Version 2
This document outlines the APIs available for managing user-related operations in Version 2 of the application.


**URL**:{baseUrl}/api/v2/`Endpoint`

## Create a New User

- **URL:** `POST`: `/users`
- **Description:** Create a new user account.
- **Parameters:** None required.
- **Request Body:** Should contain user information.
    - **Example:** 
  ```json
  {
    "username": "exampleUser",
    "email": "user@example.com",
    "password": "********"
  }
  ```
- **Response:** Returns the created user object.
    - **Example:** 
  ```json
  {
    "message": "New user created successfully"
  }
  ```

## freejoa Routers
## Auth Routers
## admin Routers



# APIs - Version 1
**URL**:{baseUrl}/api/v1/`Endpoint`
## User Routers

- **GET /user/all**
    - *Description*: Retrieve all user objects in database
    - *Required Account Type*: `admin`
    - *Request Body*: none
    - *Respond Example*:
    ```json
    {
        "message":"All users returned successfully",
        "data": //User Object
    }
    ```

- **GET /user/profile**
    - *Description*: returns the user object who started this request
    - *Required Account Type*: none
    - *Request Body*: none
    - *Respond Example*:
    ```json
    {
        "message":"User returned successfully",
        "data": //User Object
    }
    ```

- **GET /user/find**
    - *Description*: Return an user object by user id
    - *Required Account Type*: `admin`
    - *Request Body*: 
    ```json
    {
        "userId":"xxxxxxx"
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"User returned successfully",
        "data": //User Object
    }
    ```

- **POST /user/login**
    - *Description*:login endpoint
    - *Required Account Type*: none
    - *Request Body Example*: 
    ```json
    {
        "email":"xxxxxxx",
        "password":"xxxxxxx"
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"User logged in successfully",
        "token": ,  // Token 
        "data":     //User Object
    }
    ```
- **POST /user/admin/login**
    - *Description*: admin user login endpoint, for admin page only
    - *Required Account Type*: none
    - *Request Body Example*: 
    ```json
    {
        "email":"xxxxxxx",
        "password":"xxxxxxx"
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"User logged in successfully",
        "token": ,  // Token 
        "data":     //User Object
    }
    ```
- **POST /user/create**
    - *Description*: Register new user
    - *Required Account Type*: none
    - *Request Body Example*: 
    ```json
    {
        "username":"xxxxxxx",
        "firstname":"xxxxxxx",
        "lastname":"xxxxxxx",
        "email":"xxxxxxx",
        "password":"xxxxxxx"
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"New user created successfully",
        "data":     //User Object
    }
    ```
- **PATCH /user/update**
    - *Description*: Update user information, but this endpoint is not allowed for updating account types. In the future, password updates will also be in a separated endpoint.
    - *Required Account Type*: none
    - *Request Body Example*: 
    ```json
    {
       "key": "value",
        ...
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"User updated successfully",
        "data":     //User Object
    }
    ```
- **PATCH /user/accounttype**
    - *Description*: Only for update user's accounty type
    - *Required Account Type*: `admin`
    - *Request Body Example*: 
    ```json
    {
        "userId":"xxxxxxx",
        "accountType":"xxxxxxx",
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"User account type updated successfully",
        "data":     //User Object
    }
    ```
-   **DELETE /user/delete**
    - *Description*: delete a user by user ID
    - *Required Account Type*: `admin`
    - *Request Body Example*: 
    ```json
    {
        "userId":"xxxxxxx",
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"User: {userId} is deleted by admin: {adminId}",
    }
    ```

## Freejoa Routers

- **GET /freejoa/all**
    - *Description*: Retrieve all freejoa object in database
    - *Required Account Type*: none
    - *Request Body Example*: 
    ```json
    {
        "freejoaId":"xxxxxxx"
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message":"All freejoas returned successfully",
        "data":     //Freejoa Object
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
    - *Respond Example*:
    ```json
    {
        "message": "Freejoa is found",
        "data":     //Freejoa Object
    }
    ```

- **POST /freejoa/upload**
    - *Description*: Upload a new freejoa
    - *Required Account Type*: `admin`
    - *Request Body Example*: 
    ```json
    {
        "latitude":"xxxxxxx",
        "longitude":"xxxxxxx",
        "title":"xxxxxxx",
        "amount":"xxxxxxx",
        "description":"xxxxxxx",
    }
    ```
    - *Respond Example*:
    ```json
    {
        "message": "New freejoa uploaded successfully"
    }
    ```

- **PATCH /freejoa/update**
    - *Description*: update a new freejoa.
    - *Required Account Type*: none
    - *Request Body Example*: 
    ```json
    {
        "freejoaId":"xxxxxxx",  // required
        "latitude":"xxxxxxx",
        "longitude":"xxxxxxx",
        "title":"xxxxxxx",
        "amount":"xxxxxxx",
        "description":"xxxxxxx",
    }
    ```
    - *Respond Example*:
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
    - *Respond Example*:
    ```json
    {

        "message": "Freejoa: {freejoaId} is deleted by admin: {adminId}"
    }
    ```



