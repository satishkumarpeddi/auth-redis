# Redis-Powered Authentication & Background Job System

A backend authentication system built with **Node.js, Express.js, MongoDB, and Redis**, featuring authentication caching, cache invalidation, login rate limiting, background job processing, and Redis performance monitoring.

## Technology Stack

### Backend Development
<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,js" alt="Node.js, Express.js, JavaScript" />
</p>

### Database and Caching
<p align="left">
  <img src="https://skillicons.dev/icons?i=mongodb,redis" alt="MongoDB and Redis" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

### Authentication and Background Processing
<p align="left">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JSON Web Token" />
  <img src="https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="Bcrypt" />
  <img src="https://img.shields.io/badge/BullMQ-FF6B35?style=for-the-badge" alt="BullMQ" />
  <img src="https://img.shields.io/badge/ioredis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="ioredis" />
</p>

### Development and Testing Tools
<p align="left">
  <img src="https://skillicons.dev/icons?i=postman,git,github,vscode" alt="Postman, Git, GitHub, Visual Studio Code" />
</p>

### Technology Documentation

| Technology | Official Website |
|---|---|
| Node.js | https://nodejs.org |
| Express.js | https://expressjs.com |
| JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| MongoDB | https://www.mongodb.com |
| Mongoose | https://mongoosejs.com |
| Redis | https://redis.io |
| BullMQ | https://bullmq.io |
| ioredis | https://github.com/redis/ioredis |
| JWT | https://jwt.io |
| bcrypt | https://github.com/kelektiv/node.bcrypt.js |
| Postman | https://www.postman.com |
| Git | https://git-scm.com |
| GitHub | https://github.com |

This project explores how Redis can improve backend application performance and reliability by reducing repeated database queries, managing temporary data, protecting authentication endpoints, and processing asynchronous tasks.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Core Concepts and Implementation](#core-concepts-and-implementation)
  - [Redis Connection Management](#1-redis-connection-management)
  - [Redis Cache Service](#2-redis-cache-service)
  - [Signup Caching](#3-signup-caching)
  - [Signin Caching](#4-signin-caching)
  - [Cache Invalidation](#5-cache-invalidation)
  - [Cache Reliability and TTL](#6-cache-reliability-and-ttl)
  - [Redis Rate Limiting](#7-redis-rate-limiting)
  - [BullMQ Background Jobs](#8-bullmq-background-jobs)
  - [Redis Monitoring and Memory Management](#9-redis-monitoring-and-memory-management)
- [Authentication Flow](#authentication-flow)
- [Environment Configuration](#environment-configuration)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
- [Redis CLI Commands](#redis-cli-commands)
- [Security Considerations](#security-considerations)
- [Learning Outcomes](#learning-outcomes)

---

## Project Overview

Traditional authentication systems frequently communicate with the database to retrieve user information during authentication requests.

As application traffic increases, repeated database queries can introduce additional latency and database load.

This project integrates Redis as an in-memory data store to cache frequently accessed authentication information.

It also implements additional Redis-based backend capabilities:

- Authentication data caching.
- Cache invalidation after sensitive user updates.
- TTL-based cache expiration.
- Login rate limiting using Redis counters.
- Asynchronous background job processing with BullMQ.
- Redis memory and performance monitoring.

MongoDB remains the primary persistent database, while Redis provides fast temporary data access and background job infrastructure.

## Key Features

| Feature | Description |
|---|---|
| User Registration | Creates user accounts using MongoDB |
| User Authentication | Validates credentials using bcrypt |
| JWT Authentication | Generates and verifies JSON Web Tokens |
| Redis Caching | Reduces repeated MongoDB user lookups |
| Cache Invalidation | Removes outdated cached user information |
| TTL Management | Automatically expires temporary cache entries |
| Cache Fallback | Allows authentication to fall back to MongoDB when Redis operations fail |
| Rate Limiting | Restricts excessive signin requests |
| Background Jobs | Processes asynchronous tasks using BullMQ |
| Job Retry | Retries failed jobs with exponential backoff |
| Redis Monitoring | Inspects memory, key usage, latency, and persistence |

## Technology Stack

### Backend

- Node.js
- Express.js
- JavaScript (ES Modules)

### Database

- MongoDB
- Mongoose

### Caching and Background Processing

- Redis
- BullMQ
- ioredis
- node-redis

### Authentication and Security

- JSON Web Token (JWT)
- bcrypt

### Development and Testing

- Postman
- Redis CLI
- MongoDB Compass
- Git and GitHub

---

## System Architecture

The application uses MongoDB for persistent user information and Redis for caching, rate limiting, and job queue management.

```text
                  Client / Postman
                         |
                         v
                   Express.js API
                         |
             +-----------+-----------+
             |                       |
             v                       v
       Authentication           Rate Limiter
        Controllers                  |
             |                       v
             |                    Redis
             |
       +-----+------+
       |            |
       v            v
    Redis Cache   MongoDB
       |
       |
       v
  Cached User Data


              Signup Controller
                     |
                     v
              Notification Queue
                     |
                     v
                   Redis
                     |
                     v
             BullMQ Worker
                     |
                     v
             Background Tasks
```

### Responsibilities of Each Component

**Express.js**

Handles HTTP requests, authentication routes, middleware, and application logic.

**MongoDB**

Stores persistent user information, including usernames, email addresses, and hashed passwords.

**Redis**

Provides fast in-memory access to cached data, temporary counters, and BullMQ queue storage.

**BullMQ**

Manages asynchronous jobs and their processing lifecycle.

**Worker**

Consumes queued jobs independently of the API request lifecycle.

---

## Project Structure

The following is a suggested logical organization of the modules implemented in this project. Adapt filenames to match your actual repository.

```text
project/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── models/
│   │   └── user.model.js
│   │
│   ├── queues/
│   │   └── notification.queue.js
│   │
│   ├── routes/
│   │   └── auth.route.js
│   │
│   ├── services/
│   │   └── cache.service.js
│   │
│   ├── workers/
│   │   └── notification.worker.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
└── package.json
```

---

# Core Concepts and Implementation

## 1. Redis Connection Management

Redis is an in-memory data store that supports different data structures, including:

- Strings
- Lists
- Sets
- Sorted Sets
- Hashes
- Streams

The project uses Redis primarily for string-based cache entries and counters.

The Node.js application connects to Redis through the `redis` package.

Example:

```javascript
import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("Redis connection is ready.");
});

export default redisClient;
```

The Redis connection should be established once during application startup rather than reconnecting for every cache operation.

```javascript
await redisClient.connect();
```

This avoids unnecessary connection overhead and provides a shared Redis client throughout the application.

## 2. Redis Cache Service

Instead of writing Redis commands directly inside every controller, the project uses a dedicated cache service.

This separates caching logic from authentication business logic.

The service provides three primary operations:

| Operation | Redis Command | Responsibility |
|---|---|---|
| Get Cache | GET | Retrieves cached information |
| Set Cache | SET | Stores information with an expiration |
| Delete Cache | DEL | Removes cached information |

Example implementation:

```javascript
import redisClient from "../config/redis.js";

const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Redis GET error:", error.message);
        return null;
    }
};

const setCache = async (key, value, ttl = 60) => {
    try {
        const jitter = Math.floor(Math.random() * 10);

        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: ttl + jitter
            }
        );

        return true;
    } catch (error) {
        console.error("Redis SET error:", error.message);
        return false;
    }
};

const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error("Redis DELETE error:", error.message);
        return false;
    }
};

export default {
    getCache,
    setCache,
    deleteCache
};
```

### Why JSON Serialization?

Redis string values cannot directly store JavaScript objects.

Therefore:

- `JSON.stringify()` converts JavaScript objects into strings.
- `JSON.parse()` converts stored strings back into JavaScript objects.

### Why Use TTL?

TTL stands for Time To Live.

It defines how long a Redis key should remain available before Redis automatically expires it.

For example:

```javascript
await redisClient.set(
    "auth:user:example@gmail.com",
    JSON.stringify(user),
    { EX: 60 }
);
```

The cached information expires after 60 seconds.

This prevents temporary cache entries from remaining indefinitely.

## 3. Signup Caching

The signup operation creates a new user account.

The general workflow is:

1. Receive registration details.
2. Normalize the email address.
3. Check whether the user already exists.
4. Hash the password using bcrypt.
5. Save the user in MongoDB.
6. Add the user's information to Redis.
7. Return the registration response.

### Cache Key Design

The project uses a consistent key format:

```text
auth:user:<normalized-email>
```

Example:

```text
auth:user:example@gmail.com
```

Consistent key naming makes Redis data easier to organize and inspect.

MongoDB remains the source of truth. Redis is used as a temporary lookup layer.

## 4. Signin Caching

Authentication caching reduces repeated MongoDB queries when users attempt to sign in.

### Cache-Aside Pattern

The project follows the cache-aside pattern.

The application checks Redis first. If the information is unavailable, it retrieves the user from MongoDB and populates the cache.

```text
             Signin Request
                    |
                    v
             Normalize Email
                    |
                    v
              Check Redis
                    |
             +------+------+
             |             |
             v             v
          Cache Hit     Cache Miss
             |             |
             |             v
             |          MongoDB
             |             |
             |             v
             |        Populate Redis
             |             |
             +------+------+
                    |
                    v
             bcrypt.compare()
                    |
              +-----+-----+
              |           |
              v           v
           Success      Failure
              |
              v
          Generate JWT
              |
              v
          Return Response
```

### Cache Hit

When the user information exists in Redis:

- Retrieve the cached user object.
- Avoid the MongoDB lookup.
- Compare the submitted password against the stored bcrypt hash.
- Generate a JWT after successful password verification.

### Cache Miss

When the user information is not present:

- Query MongoDB.
- Retrieve the password hash using the appropriate Mongoose field selection.
- Store the required user information in Redis.
- Continue password verification.

### Why bcrypt.compare() Is Still Necessary

Caching user information does not mean caching authentication success.

Every signin request must independently verify the submitted password.

```javascript
const isPasswordValid = await bcrypt.compare(
    password,
    user.password
);
```

The application must never cache plaintext passwords or successful authentication responses.

## 5. Cache Invalidation

Cache invalidation is the process of removing or updating cached information when the original database record changes.

Without invalidation, Redis may return outdated information.

For example, consider a user changing their password.

```text
          Password Change
                 |
                 v
          Verify Old Password
                 |
                 v
          Hash New Password
                 |
                 v
          Update MongoDB
                 |
                 v
          Delete Redis Cache
                 |
                 v
          Future Signin Uses
          Updated Information
```

Example:

```javascript
await UserModel.findByIdAndUpdate(userId, {
    password: hashedPassword
});

await cacheService.deleteCache(
    `auth:user:${user.email}`
);
```

### Why Is Invalidation Important?

Suppose a user changes their password, but Redis still contains the previous password hash.

If the old cached value remains available, authentication may continue using outdated credentials.

Removing the corresponding cache entry ensures subsequent lookups can retrieve the updated database information.

For stronger production reliability, cache invalidation failures should be handled explicitly. Techniques such as versioned cache keys and transactional outbox processing can help prevent stale authentication data.

## 6. Cache Reliability and TTL

Redis is an additional infrastructure dependency. The application should not unnecessarily become unavailable when Redis experiences temporary failures.

### Redis Fallback

The project uses MongoDB as a fallback when Redis cache retrieval fails.

```text
            Authentication Request
                     |
                     v
                 Redis GET
                     |
              +------+------+
              |             |
              v             v
           Success        Failure
              |             |
              v             v
          Use Cache     Query MongoDB
```

This allows authentication to continue when the cache layer is unavailable, provided MongoDB is operational.

### TTL Jitter

TTL jitter introduces a small random variation in cache expiration times.

Example:

```javascript
const jitter = Math.floor(Math.random() * 10);

await redisClient.set(
    key,
    JSON.stringify(value),
    {
        EX: 60 + jitter
    }
);
```

Instead of every cache entry expiring at exactly the same time, expiration is distributed over a small time interval.

This can reduce synchronized expiration across many keys.

### Cache Stampede

A cache stampede occurs when many requests attempt to retrieve the same expired or missing cache entry simultaneously.

These requests may all query MongoDB, creating unnecessary database load.

Common mitigation techniques include:

- TTL jitter.
- Request coalescing.
- Distributed locking.
- Controlled cache refresh.

TTL jitter alone does not completely prevent a stampede involving a single frequently accessed key.

## 7. Redis Rate Limiting

Rate limiting restricts the number of requests a client can make within a defined period.

The project uses Redis counters to track signin requests.

### Key Design

```text
ratelimit:signin:<client-ip>
```

Example:

```text
ratelimit:signin:127.0.0.1
```

### Redis Commands

| Command | Purpose |
|---|---|
| `INCR` | Increments the request counter |
| `EXPIRE` | Sets the counter expiration |
| `TTL` | Retrieves the remaining expiration time |

### Implementation Logic

The initial rate-limiting configuration allows:

- Five signin requests.
- A 60-second fixed window.
- HTTP 429 when the limit is exceeded.

Conceptual implementation:

```javascript
const attempts = await redisClient.incr(key);

if (attempts === 1) {
    await redisClient.expire(key, 60);
}

if (attempts > 5) {
    const ttl = await redisClient.ttl(key);

    return res.status(429).json({
        message: "Too many signin attempts.",
        retryAfter: ttl
    });
}

next();
```

### Why Redis for Rate Limiting?

An in-memory JavaScript counter only exists inside one application process.

When multiple application instances are running, each instance would maintain a separate counter.

Redis provides a shared counter that can be accessed by multiple application instances.

**Implementation note:** The basic fixed-window example counts all signin requests, not only unsuccessful password attempts. For production, consider atomic Redis operations, account-based limits, IP-based limits, and carefully configured proxy trust.

## 8. BullMQ Background Jobs

BullMQ is a Node.js library for managing background jobs using Redis.

It allows applications to execute tasks asynchronously rather than performing every operation during an HTTP request.

### Why Background Jobs?

Some operations do not need to delay an API response.

Examples include:

- Sending welcome emails.
- Sending password reset notifications.
- Generating reports.
- Processing uploaded files.
- Recording asynchronous audit events.

### BullMQ Components

| Component | Responsibility |
|---|---|
| Queue | Stores and manages incoming jobs |
| Job | Represents an individual task |
| Worker | Processes queued jobs |
| Redis | Stores queue data and job states |

### Background Job Workflow

```text
           User Signup
                |
                v
         Express Controller
                |
                v
          MongoDB Save
                |
                v
          Add Queue Job
                |
                v
          Redis Queue
                |
                v
          BullMQ Worker
                |
                v
        Process Notification
                |
                v
         Job Completed
```

### Creating a Queue

```javascript
import { Queue } from "bullmq";

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379)
};

const notificationQueue = new Queue(
    "notifications",
    {
        connection
    }
);

export default notificationQueue;
```

### Adding a Job

```javascript
await notificationQueue.add(
    "welcome-email",
    {
        userId: user._id.toString(),
        username: user.username,
        email: user.email
    },
    {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
);
```

### Processing Jobs with a Worker

```javascript
import { Worker } from "bullmq";

const worker = new Worker(
    "notifications",
    async (job) => {
        if (job.name === "welcome-email") {
            const { username, email } = job.data;

            console.log(`Welcome ${username}!`);
            console.log(`Notification recipient: ${email}`);
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: Number(process.env.REDIS_PORT || 6379)
        }
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
});
```

### Job Retries and Exponential Backoff

BullMQ supports retrying failed jobs.

The example uses:

- Three maximum attempts.
- Exponential backoff.
- A one-second initial delay.

With exponential backoff, retry delays increase after each failure.

This helps avoid repeatedly retrying failed tasks immediately.

### Important Distinction: Cache vs Queue

Redis caching and BullMQ use the same underlying Redis technology, but their responsibilities are different.

| Redis Caching | BullMQ |
|---|---|
| Stores temporary application data | Stores and manages background jobs |
| Reduces database queries | Moves work outside API requests |
| Uses GET, SET, DEL | Uses queues, jobs, and workers |
| Usually uses TTL | Uses job lifecycle and retention settings |

BullMQ uses `ioredis` for its Redis connection in this project, while the cache service uses the `redis` package. These are separate client connections.

## 9. Redis Monitoring and Memory Management

Monitoring is important when Redis becomes part of a backend application's infrastructure.

Redis provides built-in commands to inspect server health, memory usage, key statistics, slow commands, and persistence.

### Redis Server Information

```redis
PING
INFO
```

`PING` checks whether Redis is responding.

`INFO` provides server information and statistics.

### Database Key Count

```redis
DBSIZE
```

Returns the number of keys in the currently selected Redis database.

### Memory Monitoring

```redis
INFO memory
```

Important metrics:

| Metric | Description |
|---|---|
| `used_memory` | Memory allocated by Redis |
| `used_memory_human` | Human-readable memory usage |
| `used_memory_peak_human` | Peak memory usage |
| `maxmemory` | Configured memory limit |
| `mem_fragmentation_ratio` | Memory fragmentation indicator |

### Key Inspection

```redis
SCAN 0 MATCH auth:user:* COUNT 100
```

Retrieve an individual cached entry:

```redis
GET auth:user:example@gmail.com
```

Check expiration:

```redis
TTL auth:user:example@gmail.com
```

Inspect memory consumption:

```redis
MEMORY USAGE auth:user:example@gmail.com
```

### Eviction Policies

Redis supports different eviction strategies when configured with a memory limit.

| Policy | Description |
|---|---|
| `noeviction` | Rejects writes when the configured limit is reached |
| `allkeys-lru` | Evicts least recently used keys |
| `allkeys-lfu` | Evicts least frequently used keys |
| `volatile-lru` | Evicts least recently used keys with expiration |
| `volatile-ttl` | Evicts keys with the shortest remaining TTL |

Inspect the current configuration:

```redis
CONFIG GET maxmemory
CONFIG GET maxmemory-policy
```

Cache and BullMQ data have different durability requirements. An eviction policy that arbitrarily removes queue data can disrupt job processing. Production deployments should separate cache and queue workloads or carefully configure their storage policies.

### Slow Query Monitoring

```redis
SLOWLOG GET 10
```

Displays recent commands recorded by Redis as slow.

Inspect the configured threshold:

```redis
CONFIG GET slowlog-log-slower-than
```

### Latency Monitoring

```redis
LATENCY DOCTOR
```

Provides diagnostic information about Redis latency events.

### Persistence Monitoring

```redis
INFO persistence
```

Redis provides two commonly used persistence mechanisms:

**RDB (Redis Database Backup)**

Creates point-in-time snapshots of Redis data.

**AOF (Append Only File)**

Records write operations so Redis can reconstruct its dataset.

Persistence configuration should reflect the importance of the data being stored, especially when Redis is used by BullMQ.

---

## Authentication Flow

The authentication system uses JWT-based authentication.

### Signup Flow

1. Client submits username, email, and password.
2. Express validates the request.
3. Email is normalized.
4. MongoDB is checked for an existing user.
5. Password is hashed using bcrypt.
6. User information is saved in MongoDB.
7. User information is cached in Redis.
8. A welcome notification job is added to BullMQ.
9. Registration response is returned.

### Signin Flow

1. Client submits email and password.
2. Email is normalized.
3. Redis is checked for cached user information.
4. MongoDB is queried if the cache misses or Redis retrieval fails.
5. bcrypt verifies the password.
6. JWT is generated.
7. Authentication response is returned.

### Protected Routes

JWT middleware validates the token using `jwt.verify()`.

After successful verification, the decoded payload is attached to:

```javascript
req.user
```

The authenticated user information can then be accessed by protected controllers.

---

## Environment Configuration

Create a `.env` file in the project root.

```env
PORT=3000

MONGODB_URI=mongodb://127.0.0.1:27017/auth_database

REDIS_URL=redis://127.0.0.1:6379

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_SECRET=your_strong_secret_key
```

Use your actual MongoDB connection string and Redis configuration.

Do not commit `.env` to version control.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

```bash
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create the `.env` file and configure:

- MongoDB connection string.
- Redis connection details.
- JWT secret.
- Application port.

### 4. Start MongoDB and Redis

Ensure MongoDB and Redis are running and accessible using the configured connection details.

### 5. Start the Express Application

```bash
npm run dev
```

### 6. Start the BullMQ Worker

In another terminal:

```bash
node src/workers/notification.worker.js
```

The worker runs independently and processes jobs from the notifications queue.

---

## API Endpoints

The following is a logical endpoint reference. Adjust the route paths and HTTP methods to match your actual Express router.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Authenticate an existing user |
| GET | `/api/auth/me` | Retrieve authenticated user information |
| PUT | `/api/auth/change-password` | Change the authenticated user's password |

Protected endpoints require a valid JWT in the `Authorization` header.

---

## Redis CLI Commands

A quick reference for the commands used throughout the project.

| Command | Purpose |
|---|---|
| `PING` | Check Redis availability |
| `INFO` | Display Redis server information |
| `DBSIZE` | Count keys in the current database |
| `GET key` | Retrieve a value |
| `SET key value` | Store a value |
| `DEL key` | Delete a key |
| `INCR key` | Increment a counter |
| `EXPIRE key seconds` | Set key expiration |
| `TTL key` | Check remaining key lifetime |
| `SCAN 0` | Iterate through keys |
| `MEMORY USAGE key` | Inspect key memory usage |
| `INFO memory` | Inspect memory statistics |
| `INFO stats` | Inspect operational statistics |
| `SLOWLOG GET 10` | Inspect slow commands |
| `LATENCY DOCTOR` | Diagnose latency |
| `INFO persistence` | Inspect persistence statistics |

---

## Security Considerations

This project demonstrates several important backend security practices.

### Password Security

- Passwords are hashed using bcrypt.
- Plaintext passwords are never stored in MongoDB or Redis.
- Password verification uses `bcrypt.compare()`.

### JWT Security

- Tokens are signed using a secret stored in environment variables.
- Protected routes verify token signatures and expiration.
- Authentication failures use appropriate HTTP status codes.

### Redis Security

- Redis should not be exposed publicly without appropriate protection.
- Use authentication and ACLs where appropriate.
- Use TLS when required by the deployment environment.
- Restrict network access to trusted application services.
- Avoid storing sensitive information unnecessarily.

### Cache Security

- Cached password hashes should be treated as sensitive data.
- Use short TTLs and restrict Redis access.
- Never expose cached password hashes through API responses.
- Invalidate cached authentication data after credential changes.

### Rate Limiting

- Restrict excessive authentication attempts.
- Use shared counters for application instances.
- Configure trusted proxies carefully when using `req.ip`.

---

## Learning Outcomes

Through this project, I explored and implemented the following backend engineering concepts:

### Backend Development

- REST API development using Express.js.
- Modular controller, route, middleware, and service architecture.
- Asynchronous programming with JavaScript.
- Database integration using Mongoose.

### Authentication

- Password hashing with bcrypt.
- JWT generation and verification.
- Protected routes and authentication middleware.
- Secure credential verification.

### Redis Engineering

- Redis client connection management.
- Cache-aside architecture.
- Cache key design and JSON serialization.
- TTL and automatic expiration.
- Cache invalidation.
- Cache fallback strategies.
- TTL jitter and cache stampede concepts.
- Redis counters and rate limiting.
- Memory monitoring and eviction policies.
- Redis persistence and latency diagnostics.

### Background Processing

- BullMQ queue creation.
- Job creation and processing.
- Worker-based execution.
- Retry mechanisms.
- Exponential backoff.
- Separation of API requests and background tasks.

---

## Conclusion

This project demonstrates how Redis can be integrated into a Node.js authentication backend beyond basic key-value storage.

It combines caching, authentication, rate limiting, asynchronous job processing, and operational monitoring into a single backend learning project.

The primary objective was to understand how different Redis capabilities solve practical backend engineering problems and how these components interact with an Express.js application and MongoDB.

**Technologies:** Node.js · Express.js · MongoDB · Mongoose · Redis · BullMQ · ioredis · JWT · bcrypt

