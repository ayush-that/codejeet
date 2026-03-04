---
title: "Design Interview Questions: Patterns and Strategies"
description: "Master Design problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-01-23"
category: "dsa-patterns"
tags: ["design", "dsa", "interview prep"]
---

Design interview questions test your ability to translate abstract requirements into concrete, scalable systems. Unlike algorithmic coding, which focuses on optimal execution of a single function, system design assesses your architectural thinking, trade-off analysis, and communication skills. It's a critical filter for senior roles and a key differentiator at top tech companies.

## Common Patterns

While every design problem is unique, several core patterns recur. Recognizing them helps you structure your solution.

**1. The Singleton Pattern**
This pattern ensures a class has only one instance and provides a global point of access to it. It's fundamental for managing shared resources like database connections or configuration settings.

<div class="code-group">

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# Usage
s1 = Singleton()
s2 = Singleton()
print(s1 is s2)  # True
```

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    return this;
  }
}

// Usage
const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2); // true
```

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

// Usage
Singleton s1 = Singleton.getInstance();
Singleton s2 = Singleton.getInstance();
System.out.println(s1 == s2); // true
```

</div>

**2. The Publisher-Subscriber (Pub/Sub) Pattern**
This pattern decouples the sender of messages (publisher) from the receivers (subscribers). It's the backbone of event-driven architectures, message queues, and real-time features.

<div class="code-group">

```python
class PubSub:
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, event, callback):
        if event not in self.subscribers:
            self.subscribers[event] = []
        self.subscribers[event].append(callback)

    def publish(self, event, data):
        if event in self.subscribers:
            for callback in self.subscribers[event]:
                callback(data)

# Usage
ps = PubSub()
ps.subscribe("news", lambda x: print(f"Received: {x}"))
ps.publish("news", "Article Published")
```

```javascript
class PubSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  publish(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((callback) => callback(data));
    }
  }
}

// Usage
const ps = new PubSub();
ps.subscribe("news", (data) => console.log(`Received: ${data}`));
ps.publish("news", "Article Published");
```

```java
import java.util.*;

interface Subscriber {
    void update(String data);
}

class PubSub {
    private Map<String, List<Subscriber>> subscribers = new HashMap<>();

    public void subscribe(String event, Subscriber sub) {
        subscribers.computeIfAbsent(event, k -> new ArrayList<>()).add(sub);
    }

    public void publish(String event, String data) {
        if (subscribers.containsKey(event)) {
            for (Subscriber sub : subscribers.get(event)) {
                sub.update(data);
            }
        }
    }
}
```

</div>

**3. The Factory Method Pattern**
This pattern defines an interface for creating an object but lets subclasses alter the type of objects that will be created. It promotes loose coupling by eliminating the need to bind application-specific classes into your code.

## Difficulty Breakdown

Our dataset of 95 questions shows a clear distribution: 9% Easy, 65% Medium, and 25% Hard. This split is revealing.

- **Easy (9%):** These are often foundational object-oriented design (OOD) questions, like designing a deck of cards or a parking lot. They test your basic class modeling and API design skills.
- **Medium (65%):** This is the core battleground. Problems like "Design Twitter Feed" or "Design a URL Shortener" fall here. They require you to combine multiple patterns, discuss scalability (e.g., sharding, caching), and analyze trade-offs between consistency, availability, and latency.
- **Hard (25%):** These are large-scale, open-ended system designs (e.g., "Design Google Search" or "Design a Distributed Key-Value Store"). Success depends less on a "correct" answer and more on demonstrating deep knowledge of databases, networking, concurrency, and distributed systems principles.

The heavy weighting toward Medium and Hard questions means you must prepare for complexity. Interviewers use Medium questions to gauge standard competency and Hard questions to identify exceptional, principal-engineer-level candidates.

## Which Companies Ask Design

Design questions are a staple at companies building complex, scalable software. The top askers include:

- [Google](/company/google): Known for open-ended, large-scale system design (e.g., design YouTube).
- [Amazon](/company/amazon): Focuses on practical, service-oriented architecture, often related to e-commerce and AWS services.
- [Meta](/company/meta): Emphasizes real-time systems, data-intensive applications, and social graph problems.
- [Microsoft](/company/microsoft): Asks a mix of OOD and system design, frequently related to cloud (Azure) and productivity software.
- [Bloomberg](/company/bloomberg): Leans towards designing financial data systems, real-time feeds, and low-latency applications.

## Study Tips

1.  **Start with Principles, Not Memorization.** Understand core concepts first: Horizontal vs. Vertical Scaling, CAP Theorem, ACID vs. BASE, Load Balancing, Caching Strategies (e.g., LRU), Database Indexing, and Consistent Hashing. A pattern applied without understanding its _why_ is easily exposed.
2.  **Practice by Drawing and Talking.** Don't just think about a design—whiteboard it. Draw boxes for services, arrows for communication, and databases. Narrate your thought process aloud, as you must in an interview. Explain your trade-offs: "I'm using a CDN here for static content to reduce latency, accepting the eventual consistency it introduces."
3.  **Use a Structured Approach.** Adopt a framework to avoid rambling. A common one is: Clarify Requirements -> Estimate Scale -> Define System Interface -> High-Level Design -> Deep Dive on Key Components -> Identify Bottlenecks & Mitigations. This structure demonstrates methodical thinking.
4.  **Review Real Systems.** Read engineering blogs from the companies listed above. Understand how platforms like Twitter, Netflix, or Uber actually solved their scaling challenges. This provides concrete examples to reference in your discussions.

Mastering design requires shifting your mindset from writing perfect code to architecting resilient systems. It's a skill built through deliberate practice and conceptual study.

[Practice all Design questions on CodeJeet](/topic/design)
