# Course API

This is the Node.js Express backend documentation for the Course API. It provides endpoints for user authentication and managing courses.

## Table of Contents

- [Overview](#overview)
  - [Introduction](#introduction)
  - [Features](#features)
- [Installation](#installation)
- [Endpoints](#endpoints)
- [Middleware](#middleware)
- [Built With](#built-with)
- [Author](#author)

## Overview

### Introduction

The Course API is designed to manage courses, providing functionalities for user authentication, course creation, updating, deletion, and search.

### Features

Users should be able to:

- Register and authenticate with their email and password.
- Create, update, and delete courses as an instructor.
- Get all courses and courses by id.
- Search for courses by description.

## Installation

1. Clone the repository.
2. Install the required packages using `npm install`.
3. Create a `config.env` file in a config directory and set the required environment variables (e.g. JWT_SECRET and MONGO_URI).
4. Start the server: `npm start`

## Endpoints

| Endpoint                     | Method | Description                                   |
| ---------------------------- | ------ | --------------------------------------------- |
| `/api/auth`                  | POST   | Authenticate user and get token               |
| `/api/users`                  | POST   | Register a new user                           |
| `/api/users/:id`              | PUT    | Update user profile                           |
| `/api/users/:id`              | DELETE | Delete user profile                           |
| Courses                                                                                |
| `/api/courses`               | POST   | Create a new course (instructor)              |
| `/api/courses`               | GET    | Get a list of all courses                     |
| `/api/courses/:id`           | GET    | Get details of a specific course              |
| `/api/courses/:id`           | PUT    | Update a course (instructor)                  |
| `/api/courses/:id`           | DELETE | Delete a course (instructor)                  |
| `/api/courses/search`        | GET    | Search for courses by description             |

## Middleware

The API includes middleware to control access:

- `verifyToken`: Verifies user token for authentication.
- `verifyTokenAndUser`: Checks if the authenticated user matches the requested user.
- `verifyTokenAndAdmin`: Ensures the user is an admin.
- `verifyTokenAndInstructor`: Ensures the user is an instructor.

## Built With
- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Author

- Github - [Hikmah Yousuph](https://github.com/Hikmahx)
- Email - [hikmayousuph@gmail.com](hikmayousuph@gmail.com)
- LinkedIn - [Hikmah Yousuph](linkedin.com/in/hikmah-yousuph/)

