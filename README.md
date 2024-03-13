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
        "{objectName}":"An Object"
    }
```
- *Error* :JSON format
```json
    {
        "message":"A message from endpoint",
        "error":"Error message"
    }
```


## Endpoints

- **GET /user/all**
    - *Description*: Retrieve all user object in database
    - *Required Account Type*: admin
    - *Request body*: none

- **GET /user/profile**
    - *Description*: Only return the user object of the requesting user for receiving personal information.
    - *Required Account Type*: none
    - *Request body*: none


- **GET /user/find**
    - *Description*: Only return the user object of the requesting user for receiving personal information.
    - *Required Account Type*: admin
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
    - *Required Account Type*: admin
    - *Request body*: 
    ```json
    {
        "userId":"xxxxxxx",
        "accountType":"xxxxxxx",
    }
    ```
- **DELETE /user/accounttype**
    - *Description*: delete a user by user ID
    - *Required Account Type*: admin
    - *Request body*: 
    ```json
    {
        "userId":"xxxxxxx",
    }
    ```







