---
title: "How to Approach System Design Interviews"
description: "A structured framework for system design interviews — from requirement gathering to detailed design, with real examples."
date: "2026-06-25"
category: "tips"
tags: ["system design", "interviews", "architecture", "career"]
---

System design interviews test whether you can take an ambiguous, large-scale problem and produce a reasonable architecture under time pressure. There is no single correct answer. What matters is your process: how you break down the problem, make trade-offs, and communicate your reasoning.

## The Four-Step Framework

### Step 1: Clarify Requirements (3-5 minutes)

Never start designing before you understand what you are building. Separate functional requirements (what the system does) from non-functional requirements (scale, latency, availability, consistency).

Good clarifying questions: "How many daily active users?" "What is the read-to-write ratio?" "Do we need real-time updates?" "Is eventual consistency acceptable?"

Write down the agreed requirements before moving on.

### Step 2: Back-of-the-Envelope Estimation (3-5 minutes)

Rough math grounds your design in reality. For a URL shortener with 100 million URLs per month: about 40 writes/second, 4,000 reads/second at 100:1 ratio, roughly 50 GB/month storage.

These numbers tell you whether a single database suffices or you need caching and sharding. For a deeper dive, check the [Back of the Envelope Estimation](/system-design/back-of-the-envelope-estimation) chapter on CodeJeet.

### Step 3: High-Level Design (10-15 minutes)

Sketch the major components: client, load balancer, application servers, database, cache. Add problem-specific components: message queues for async processing, CDN for static content, WebSocket servers for real-time.

Draw the request flow end to end. Keep it high level -- do not dive into schema or algorithms yet.

### Step 4: Detailed Design (10-15 minutes)

The interviewer picks one or two components for a deep dive. Common topics:

**Database choice and schema.** SQL vs NoSQL depends on access patterns. A URL shortener maps well to a key-value store. A social network needs relational joins.

**Scaling strategies.** Horizontal scaling, database sharding, read replicas, caching layers.

**Specific algorithms.** For a URL shortener: base62 encoding, hashing with collision handling, or a pre-generated key service.

**Failure handling.** Redundancy, failover, retries with exponential backoff, circuit breakers.

Let's explore some of these detailed components with practical code examples.

#### Database Schema Example: URL Shortener

A simple schema for a URL shortener would store the mapping between a short key and the original long URL. While a key-value store like Redis or DynamoDB is ideal, you might start with a simple SQL table.

<div class="code-group">

```python
# Python using SQLAlchemy ORM example
from sqlalchemy import create_engine, Column, String, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import datetime

Base = declarative_base()

class ShortURL(Base):
    __tablename__ = 'short_urls'

    id = Column(Integer, primary_key=True)
    # The short key, e.g., "a3fG7d"
    short_key = Column(String(10), unique=True, index=True, nullable=False)
    # The original long URL
    long_url = Column(String(2048), nullable=False)
    created_at = Column(DateTime, default=func.now())
    # For analytics or expiration
    expires_at = Column(DateTime, nullable=True)
    click_count = Column(Integer, default=0)

    def __repr__(self):
        return f"<ShortURL(short_key='{self.short_key}', long_url='{self.long_url}')>"

# Example usage for creating a record
# new_url = ShortURL(short_key='abc123', long_url='https://www.example.com/very/long/path')
```

```javascript
// JavaScript using a simple model definition (e.g., for Prisma or Sequelize)
// This is a conceptual schema definition.
const { DataTypes } = require("sequelize");

const ShortURL = sequelize.define(
  "ShortURL",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shortKey: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false,
      field: "short_key", // Maps to database column name
    },
    longUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      field: "long_url",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "expires_at",
    },
    clickCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "click_count",
    },
  },
  {
    tableName: "short_urls",
    timestamps: false,
  }
);

// Example usage for creating a record
// await ShortURL.create({ shortKey: 'abc123', longUrl: 'https://www.example.com' });
```

```java
// Java using JPA annotations for a simple entity
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "short_urls")
public class ShortURL {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "short_key", length = 10, unique = true, nullable = false)
    private String shortKey;

    @Column(name = "long_url", length = 2048, nullable = false)
    private String longUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "click_count")
    private Integer clickCount = 0;

    // Constructors, getters, and setters omitted for brevity
    // Example usage: ShortURL url = new ShortURL("abc123", "https://www.example.com");
}
```

</div>

#### Specific Algorithm: Base62 Encoding for Short URLs

A common algorithm for generating short keys is to take a unique numerical ID (e.g., from the database) and encode it into a base62 string using characters `[0-9a-zA-Z]`. This is reversible and compact.

<div class="code-group">

```python
# Python implementation of Base62 encoding/decoding
import string

BASE62_ALPHABET = string.digits + string.ascii_letters  # 0-9, a-z, A-Z
BASE = len(BASE62_ALPHABET)

def encode_base62(num: int) -> str:
    """Encode a positive integer into a Base62 string."""
    if num == 0:
        return BASE62_ALPHABET[0]
    encoded = []
    while num > 0:
        num, remainder = divmod(num, BASE)
        encoded.append(BASE62_ALPHABET[remainder])
    return ''.join(reversed(encoded))

def decode_base62(encoded_str: str) -> int:
    """Decode a Base62 string back to the original integer."""
    num = 0
    for char in encoded_str:
        num = num * BASE + BASE62_ALPHABET.index(char)
    return num

# Example usage:
# id = 123456789
# short_key = encode_base62(id)  # e.g., "8M0kX"
# original_id = decode_base62(short_key)
```

```javascript
// JavaScript implementation of Base62 encoding/decoding
const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = BASE62_ALPHABET.length;

function encodeBase62(num) {
  if (num === 0) return BASE62_ALPHABET[0];
  let encoded = "";
  while (num > 0) {
    const remainder = num % BASE;
    encoded = BASE62_ALPHABET[remainder] + encoded;
    num = Math.floor(num / BASE);
  }
  return encoded;
}

function decodeBase62(encodedStr) {
  let num = 0;
  for (let i = 0; i < encodedStr.length; i++) {
    const char = encodedStr[i];
    const charValue = BASE62_ALPHABET.indexOf(char);
    num = num * BASE + charValue;
  }
  return num;
}

// Example usage:
// const id = 123456789;
// const shortKey = encodeBase62(id); // e.g., "8M0kX"
// const originalId = decodeBase62(shortKey);
```

```java
// Java implementation of Base62 encoding/decoding
public class Base62Encoder {
    private static final String BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = BASE62_ALPHABET.length();

    public static String encode(long num) {
        if (num == 0) {
            return String.valueOf(BASE62_ALPHABET.charAt(0));
        }
        StringBuilder encoded = new StringBuilder();
        while (num > 0) {
            int remainder = (int) (num % BASE);
            encoded.insert(0, BASE62_ALPHABET.charAt(remainder));
            num /= BASE;
        }
        return encoded.toString();
    }

    public static long decode(String encodedStr) {
        long num = 0;
        for (int i = 0; i < encodedStr.length(); i++) {
            char c = encodedStr.charAt(i);
            int charValue = BASE62_ALPHABET.indexOf(c);
            num = num * BASE + charValue;
        }
        return num;
    }

    // Example usage:
    // long id = 123456789L;
    // String shortKey = Base62Encoder.encode(id); // e.g., "8M0kX"
    // long originalId = Base62Encoder.decode(shortKey);
}
```

</div>

#### Failure Handling: Implementing a Simple Retry with Exponential Backoff

When a service call fails, a retry mechanism with exponential backoff can help handle transient failures gracefully. This is a common pattern for improving resilience.

<div class="code-group">

```python
# Python example of a retry decorator with exponential backoff
import time
import random
from functools import wraps

def retry_with_backoff(max_retries=5, base_delay=1, max_delay=30):
    """
    Decorator that retries a function on failure with exponential backoff and jitter.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries == max_retries:
                        print(f"All {max_retries} retries failed. Last error: {e}")
                        raise  # Re-raise the last exception
                    # Calculate delay with exponential backoff and jitter
                    delay = min(max_delay, base_delay * (2 ** (retries - 1)))
                    jitter = random.uniform(0, delay * 0.1)  # Add 10% jitter
                    total_delay = delay + jitter
                    print(f"Attempt {retries} failed. Retrying in {total_delay:.2f} seconds. Error: {e}")
                    time.sleep(total_delay)
            return None  # Should not be reached
        return wrapper
    return decorator

# Example usage:
# @retry_with_backoff(max_retries=3, base_delay=1)
# def call_external_api(url):
#     # ... make HTTP request
#     pass
```

```javascript
// JavaScript example of a retry function with exponential backoff
async function retryWithBackoff(operation, maxRetries = 5, baseDelay = 1000, maxDelay = 30000) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        console.error(`All ${maxRetries} retries failed. Last error:`, error);
        throw error; // Re-throw the last error
      }
      // Calculate delay with exponential backoff and jitter
      let delay = Math.min(maxDelay, baseDelay * Math.pow(2, retries - 1));
      let jitter = Math.random() * (delay * 0.1); // Add 10% jitter
      let totalDelay = delay + jitter;
      console.log(
        `Attempt ${retries} failed. Retrying in ${totalDelay.toFixed(0)} ms. Error:`,
        error.message
      );
      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  }
}

// Example usage:
// async function fetchData() {
//     // ... make HTTP request
// }
// retryWithBackoff(fetchData, 3, 1000);
```

```java
// Java example of a retry utility with exponential backoff
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

public class RetryUtil {
    private static final Random random = new Random();

    public static <T> T retryWithBackoff(Supplier<T> operation, int maxRetries, long baseDelayMs, long maxDelayMs) throws Exception {
        int retries = 0;
        while (retries < maxRetries) {
            try {
                return operation.get();
            } catch (Exception e) {
                retries++;
                if (retries == maxRetries) {
                    System.err.println("All " + maxRetries + " retries failed. Last error: " + e.getMessage());
                    throw e; // Re-throw the last exception
                }
                // Calculate delay with exponential backoff and jitter
                long delay = Math.min(maxDelayMs, baseDelayMs * (long) Math.pow(2, retries - 1));
                long jitter = (long) (random.nextDouble() * (delay * 0.1)); // Add 10% jitter
                long totalDelay = delay + jitter;
                System.out.println(String.format("Attempt %d failed. Retrying in %d ms. Error: %s", retries, totalDelay, e.getMessage()));
                TimeUnit.MILLISECONDS.sleep(totalDelay);
            }
        }
        throw new RuntimeException("Retry logic failed unexpectedly.");
    }

    // Example usage:
    // String result = RetryUtil.retryWithBackoff(() -> {
    //     // ... make external call
    //     return externalService.call();
    // }, 3, 1000, 30000);
}
```

</div>

## Common Mistakes

**Jumping into components without requirements.** An interviewer asking "design Twitter" might want the news feed, tweet publishing, or notification system. Clarify first.

**Ignoring trade-offs.** Every decision has a cost. If you choose eventual consistency, explain why strong consistency is unnecessary.

**Overcomplicating the design.** A URL shortener does not need Kafka and microservices on day one. Design for stated requirements, then mention what you would add as the system grows.

**Not communicating.** System design is a conversation. Explain your reasoning as you draw. Discuss options when you are unsure.

## How to Practice

Study common questions: URL shortener, news feed, chat system, notification service. CodeJeet has a full [system design curriculum](/system-design) with step-by-step chapters, including the [System Design Framework](/system-design/system-design-framework) chapter that expands on this approach.

Time yourself at 35-45 minutes. Practice with another person -- system design is interactive, and mock interviews force you to explain your thinking and handle follow-ups.

### Practice Exercise: Sketch a High-Level Design for a News Feed

Let's apply the framework to a common problem: designing a news feed like Twitter or Facebook. After clarifying requirements (e.g., 10 million DAU, 100 posts per user per day on average, timeline must update in near real-time), you would move to a high-level sketch.

**Core Components:**

1.  **Client Apps:** Mobile and web clients.
2.  **Load Balancers:** Distribute incoming requests across multiple servers.
3.  **API Servers:** Handle HTTP requests (post a tweet, fetch feed, follow a user).
4.  **Post Service:** Manages the creation, storage, and retrieval of individual posts/tweets. It writes to a **Post Database** (likely sharded by user ID or post ID).
5.  **Fanout Service:** The critical component for news feed generation. Two primary approaches:
    - **Pull Model (Read-time):** When a user requests their feed, the service queries the Post Database for posts from all users they follow, then ranks and merges them. Simple but slow for users with many follows.
    - **Push Model (Write-time):** When a user posts, the service immediately pushes that post into the "inbox" (a dedicated cache or table) of all their followers. Fetching the feed is then a fast read of the user's own inbox. Fast for reads but heavy on writes for popular users.
    - **Hybrid Model:** Often used in practice. Push for regular users, pull for celebrities/influencers with massive follower counts.
6.  **Feed Cache:** Stores pre-computed feed data for each user (especially in a push/hybrid model). Redis or Memcached are common choices.
7.  **Graph Service (Social Graph):** Manages the "follow" relationships—who follows whom. Stored in a graph database or a highly available key-value store.
8.  **Message Queue (e.g., Kafka, RabbitMQ):** Decouples services. For example, when a post is created, an event is published to a queue. The Fanout Service consumes this event to perform the push operation asynchronously.

**Data Flow for Posting a Tweet (Push Model):**

1.  Client -> Load Balancer -> API Server.
2.  API Server writes the post to the sharded **Post Database**.
3.  API Server publishes a "Post Created" event to the **Message Queue**.
4.  **Fanout Service** workers consume the event.
5.  Fanout Service queries the **Graph Service** to get the list of follower IDs.
6.  For each follower ID, the service inserts the post ID into the follower's sorted feed in the **Feed Cache** (e.g., a Redis Sorted Set by timestamp).

**Data Flow for Fetching a Feed:**

1.  Client requests the feed.
2.  API Server reads the user's pre-computed feed from the **Feed Cache**.
3.  If a cache miss (or for pull-model users), it queries the **Post Database** for posts from followed users, then ranks them.
4.  Returns the ranked list of post IDs.
5.  A separate request fetches the full post content from the **Post Service** for the IDs (a process called "hydration").

Practicing by drawing this flow and discussing the trade-offs between pull vs. push models is excellent preparation.
