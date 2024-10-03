# Birthday Gift API

This API is designed to handle birthday gifts, allowing users to upload images, generate personalized birthday messages, and manage the storage of data using MongoDB and Cloudinary.

**Live Demo:** [Birthday Gift](https://friend-birthday-gift.vercel.app/)

**Frontend Repo:** [Birthday Gift Frontend](https://github.com/AnwarRizk/Birthday-Gift)

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)

## Features

- **Image Upload:** Users can upload images associated with birthday gifts, which are stored in Cloudinary.
- **Link Generation:** Generates unique links for each birthday gift that can be shared.
- **Data Management:** Stores birthday gift data in MongoDB, including the sender's name, friend's name, message, and image URL.
- **Automatic Cleanup:** Uses a cron job to automatically delete birthday data older than three days, along with associated images from Cloudinary.

## Technologies

- **Node.js** and **Express**: For building the server and API endpoints.
- **MongoDB**: For storing birthday gift data.
- **Cloudinary**: For image storage and management.
- **Multer**: For handling file uploads.
- **node-cron**: For scheduling automated tasks.

## API Endpoints

### 1. **POST /api/generate**

- **Description**: Uploads an image and generates a unique link for a birthday gift.
- **Request Body**:

  ```json
  {
    "friendName": "Name of the Friend",
    "senderName": "Your Name",
    "message": "Personalized Birthday Message",
    "friendImage": "<file>" // Image file (optional)
  }
  ```

- **Response**:
  ```json
  {
    "link": "Unique Link for the Birthday Gift"
  }
  ```

### 2. **GET /api/birthday/**

- **Description**: Retrieves birthday gift data based on a unique ID.
- **Query Parameters**:
  - **id**: Unique ID of the birthday gift.
- **Response**:

  ```json
  {
    "status": "success",
    "data": {
      "friendName": "Name of the Friend",
      "senderName": "Your Name",
      "imageUrl": "https://example.com/image.jpg", // Image URL (if uploaded)
      "message": "Personalized Birthday Message",
      "uniqueId": "<uniqueId>",
      "createdAt": "2024-10-03T00:00:00.000Z",
      "updatedAt": "2024-10-03T00:00:00.000Z"
    }
  }
  ```
