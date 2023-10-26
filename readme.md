Express Tracking API Documentation
Welcome to the Express Tracking API documentation. This API allows you to track orders and shipments. This documentation provides an overview of the API, including details on how to use it, required request formats and endpoints, expected response formats, and status codes. Additionally, we'll guide you through setting up the necessary environment variables for proper API operation.

Base URL
The base URL for the Express Tracking API is as follows:

https://api.trackingmore.com/v4


Authentication
To use the Express Tracking API, you need to set up environment variables. Here's what you need:

TRACKINGMORE_API_KEY: Your TrackingMore API key. You can obtain your API key by signing up on the TrackingMore website.
Please make sure to set these environment variables in your hosting environment or local development environment to ensure the proper functionality of the API.


Track an Order
Endpoint
URL: /track
Request Format
Method: POST
Content-Type: application/json
Request Body
The request body should be a JSON object with the following field:

orderNumber: The unique order number or shipment identifier you want to track.
Example request body:

{
    "orderNumber": "TBA309367834145"
}


Response Format
Status Code 200: If the order is successfully tracked, you will receive a response with the tracking information in JSON format.
Example response:

{
    "status": {
        "code": 200,
        "message": "Tracking information retrieved successfully"
    },
    "data": {
        "order_number": "TBA309367834145",
        "tracking_details": [
            {
                "location": "Warehouse A",
                "status": "In Transit",
                "timestamp": "2023-10-31 14:30:00"
            },
            {
                "location": "Destination Hub",
                "status": "Out for Delivery",
                "timestamp": "2023-11-02 08:15:00"
            }
        ]
    }
}

Status Code 400: If there are errors in the request, you will receive a response with an error message.
Example response:

{
    "status": {
        "code": 400,
        "message": "Error: Order not found"
    }
}


Environment Variables
Before using the Express Tracking API, make sure to set the required environment variable:

TRACKINGMORE_API_KEY: Your TrackingMore API key.
You can set environment variables in various ways, depending on your development and hosting environment. Ensure that this environment variable is correctly set for the API to function properly.


Example Usage
Here's an example of how to use the Express Tracking API in a Node.js application:

const axios = require('axios');

const orderNumber = 'TBA309367834145';
const apiKey = process.env.TRACKINGMORE_API_KEY;

const trackingInfo = await axios.post('https://localhost:3000/track', { orderNumber }, {
    headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': apiKey
    }
});

console.log(trackingInfo.data);