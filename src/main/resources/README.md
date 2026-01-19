# AI Expense Tracker

AI Expense Tracker is a full-stack personal finance management system
that helps users track expenses, analyze spending patterns, and receive
AI-powered financial advice.

## Features

-   Secure login and registration using JWT authentication
-   Expense tracking and management
-   Monthly spending analytics
-   AI-generated financial suggestions
-   Dashboard with spending insights

## Tech Stack

Backend: Java, Spring Boot, Spring Security, Hibernate, MySQL\
Frontend: HTML, CSS, JavaScript\

## How It Works

The frontend communicates with the Spring Boot backend through REST
APIs. Users can log in, add expenses, view analytics, and receive
AI-based recommendations. Data is stored securely in a MySQL database.

## How to Run

1.  Create MySQL database: `expense_db`

2.  Configure database in `application.properties`

3.  Run backend:

    ``` bash
    mvn clean install
    mvn spring-boot:run
    ```

4.  Open frontend `index.html` or run app

## Default Login

Username: admin
Password: admin123

## Conclusion

AI Expense Tracker is a real-world finance management platform designed
to provide smart insights and help users take control of their spending.
