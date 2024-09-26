# Stroll - Backend Interview Question - Dynamic Question Assignment
I have made a Question Rotation System using Node.JS for this task, you can find a detailed explanation of the strategy below. Here is the question doc link if you want: https://docs.google.com/document/d/19thyOu5aAdxYOEKGK0hpas6O6x-GZmGmU7ZGCPofytQ/edit

## Architecture
![image](https://github.com/user-attachments/assets/6794b433-0231-46d2-b0f3-49d27805f562)

### Components
* **API Gateway:** Handles incoming requests, in this case, it only entertains GET requests to get the data according to the region of the user.
* **Load Balancer:** Distributes traffic across multiple application servers to ensure high availability and scalability. 
* **Application Servers:** Hosts the core logic for question assignment and rotation. I am using Node.JS for the assignment.
* **Scheduler:** Manages the cycle transitions and triggers question rotations at 12 AM SGT every Monday.
* **Database:** Stores questions and user data, at least for this assignment. I am using MongoDB for the assignment.
* **Cache:** Improves performance by storing frequently accessed data. I am using Redis example for this assignment.
* **Config Service:** Manages configuration settings like cycle duration and region-specific settings.
* **Analytics and Monitoring:** A dashboard that tracks user engagement and provides insights. And we should also consider system health and performance to be monitored.

## Implementation
* Database Schema:
  - Questions: I have used a simple question and region field for the assignment.
 
    | Column  | Type   |
    |---------|--------|
    | id      | ObjectId |
    | content | String |
    | region  | String |

* Question Assignment Algorithm:
  When a user requests a question, we,
  1. Check the user's region.
  2. Find the questions for that region.
  3. Retrieve and return a single random question from the questions assigned to that region (assuming the user only needs one question at a time, because he/she will only answer one).

Use caching to store questions in that region for quick access.

* Cycle Rotation

Implement a scheduler (e.g., using cron jobs) to trigger cycle rotations. At each rotation every Monday at 12 AM SGT:
1. Assign the next question in the sequence for each region.
2. Update the cache with new assignments.

## Scalability
### Requirement:
The solution should be capable of handling 100k daily active users (DAU) and scale to support millions of global users, ensuring efficient question assignment and rotation based on region and cycle configuration.
### Our System:
We can currently scale to 100k daily active users as we have used indexing in the database and caching with Redis. And while deployment we will be considering many scalability factors and be implementing them.
### Potential Improvements
* Database Sharding can be extremely helpful, we can shard the database according to region which is an excellent strategy for improving performance and scalability, especially for an application with geographically distributed users.  
* We could normalize the *questions* model and have a *cycles* model for ease of querying, I have added the model to the codebase, we could possibly have a single call to get all the data for that region and cache it for a day.
* Horizontal scaling will help, we can add more instances of the application server.
* Load Balancing while deployment will distribute incoming traffic across multiple instances.
* **Regional data centers:** Consider deploying to multiple regions for lower latency.

### Pros
* **Scalable:** Can handle millions of users through horizontal scaling and caching.
* **Flexible:** Easily configurable for different regions and can easily rotate cycles.
* **Performant:** Uses caching to reduce database load.
* **Maintainable:** Modular design allows for easy updates and extensions.
* **Efficient Question Assignment:** The algorithm for assigning questions based on user regions ensures that users receive region-specific questions, enhancing relevance and user engagement.
* **Database Performance:** Indexing in the database and the potential for database sharding improves query performance and overall scalability, especially for geographically distributed users.

### Cons:

* **Single point of failure:** The API Gateway and Load Balancer could become single points of failure if not properly managed or if failover mechanisms are not in place.
* **Scheduler Reliability**The scheduler's reliance on cron jobs may pose reliability issues, especially in a distributed system. If the scheduler fails, the question rotation process could be disrupted.
* **Latency:** The use of a single database for storing questions and user data might lead to latency issues as the number of users grows. Even with caching, frequent writes or updates to the database can create performance bottlenecks.
* **Scalability Limits:** While the design can handle 100k DAU, scaling to millions of users might require further optimization, especially in areas like database performance, network latency, and overall system throughput.
* Database Sharding will be a bit complex and will add operational overhead. Also if we assign the questions to regions statically, handling dynamic changes in regional data or questions might require additional logic and increase system complexity.
