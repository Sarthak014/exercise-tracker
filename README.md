# Exercise Tracker
The Exercise Tracker is a web application that allows users to track their exercises and log details. This README provides an overview of the application and explains the APIs it offers.

# API Endpoints

<h3>1. Register User</h3>

  * Method: POST
  * Endpoint: /api/users
  * Description: This API is used to register a user in the database.

  <b>Request Body</b>
  ```json
    {
      "username": <your_username>,
    }
  ```

<h3>2. Add Exercise Log</h3>

  * Method: POST
  * Endpoint: /api/users/<user_id>/exercises

  <b>Request Body</b>
  ```json
    {
      "_id": <user_id>
      "username": <your_username>,
      "description": <Exercise description>,
      "duration": 30, // Duration in minutes
      "date": "2023-08-23" // Date of the exercise (YYYY-MM-DD)
    }
  ```


<h3>2. Get Exercise Log</h3>

  * Method: GET
  * Endpoint: /api/users/<user_id>/log

  <b>Query Parameters</b>
  
    * `from` (optional): Retrieve logs starting from this date (YYYY-MM-DD).
    * `to` (optional): Retrieve logs up to this date (YYYY-MM-DD).
    * `limit` (optional): Limit the number of logs to be retrieved.

  <b>Request Body</b>
  ```HTML
    GET /api/users/user_id/logs?from=2023-08-01&to=2023-08-15&limit=10
  ```
