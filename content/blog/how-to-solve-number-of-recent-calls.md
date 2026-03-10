---
title: "How to Solve Number of Recent Calls — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Recent Calls. Easy difficulty, 78.2% acceptance rate. Topics: Design, Queue, Data Stream."
date: "2027-05-08"
category: "dsa-patterns"
tags: ["number-of-recent-calls", "design", "queue", "data-stream", "easy"]
---

# How to Solve Number of Recent Calls

This problem asks you to design a system that counts how many requests have occurred in the last 3000 milliseconds. The tricky part is that requests come in a stream (one at a time), and you need to efficiently maintain a sliding window of recent requests without scanning all historical data on every call.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll create a `RecentCounter` and make several `ping` calls:

```
RecentCounter counter = new RecentCounter();
counter.ping(1);    // Request at time 1
counter.ping(100);  // Request at time 100
counter.ping(3001); // Request at time 3001
counter.ping(3002); // Request at time 3002
```

**Step 1:** `ping(1)` - The window is [1-3000, 1] = [1, 1]. Only request at time 1 is in range. Count = 1.

**Step 2:** `ping(100)` - Window is [100-3000, 100] = [-2900, 100]. All requests with time ≥ -2900 and ≤ 100: times 1 and 100. Count = 2.

**Step 3:** `ping(3001)` - Window is [3001-3000, 3001] = [1, 3001]. Requests with time ≥ 1 and ≤ 3001: times 1, 100, 3001. Count = 3.

**Step 4:** `ping(3002)` - Window is [3002-3000, 3002] = [2, 3002]. Requests with time ≥ 2 and ≤ 3002: times 100, 3001, 3002. Notice time 1 is now outside the window! Count = 3.

The key insight: as time moves forward, old requests fall out of the 3000ms window. We need a data structure that lets us efficiently add new requests and remove old ones.

## Brute Force Approach

A naive approach would store all requests in a list and scan through the entire list on every `ping`:

```python
class RecentCounter:
    def __init__(self):
        self.requests = []

    def ping(self, t: int) -> int:
        self.requests.append(t)
        count = 0
        for time in self.requests:
            if t - 3000 <= time <= t:
                count += 1
        return count
```

**Why this is inefficient:**

- **Time Complexity:** O(n) per `ping`, where n is the total number of requests so far
- **Space Complexity:** O(n) to store all requests
- The problem states there will be up to 10⁴ calls, so worst-case we're doing 10⁸ operations (10⁴ × 10⁴), which is too slow.

The brute force keeps scanning old requests that are already outside the window. We need a way to discard old requests once they're no longer relevant.

## Optimal Solution

The optimal solution uses a **queue** (First-In-First-Out) to maintain only the relevant requests. When a new request arrives:

1. Add it to the queue
2. Remove all requests from the front that are older than `t - 3000`
3. Return the current size of the queue

This works because requests arrive in increasing order (the problem guarantees `t` is strictly increasing), so once a request is too old, all earlier requests are also too old.

<div class="code-group">

```python
# Time: O(1) amortized per ping | Space: O(n) where n is number of requests in window
class RecentCounter:
    def __init__(self):
        # Initialize an empty queue to store request times
        # We'll use Python's deque for efficient pops from both ends
        from collections import deque
        self.queue = deque()

    def ping(self, t: int) -> int:
        # Step 1: Add the new request time to the queue
        self.queue.append(t)

        # Step 2: Remove all requests that are outside the 3000ms window
        # While the oldest request is less than t - 3000, remove it
        # t - 3000 is the lower bound of our window
        while self.queue[0] < t - 3000:
            self.queue.popleft()

        # Step 3: Return the number of requests in the current window
        # This is just the size of the queue after removing old requests
        return len(self.queue)
```

```javascript
// Time: O(1) amortized per ping | Space: O(n) where n is number of requests in window
class RecentCounter {
  constructor() {
    // Initialize an empty array to act as our queue
    // We'll use push() to add to back and shift() to remove from front
    this.queue = [];
  }

  ping(t) {
    // Step 1: Add the new request time to the queue
    this.queue.push(t);

    // Step 2: Remove all requests that are outside the 3000ms window
    // While the oldest request is less than t - 3000, remove it
    // t - 3000 is the lower bound of our window
    while (this.queue[0] < t - 3000) {
      this.queue.shift();
    }

    // Step 3: Return the number of requests in the current window
    // This is just the size of the queue after removing old requests
    return this.queue.length;
  }
}
```

```java
// Time: O(1) amortized per ping | Space: O(n) where n is number of requests in window
import java.util.LinkedList;
import java.util.Queue;

class RecentCounter {
    private Queue<Integer> queue;

    public RecentCounter() {
        // Initialize a queue using LinkedList
        // LinkedList implements the Queue interface in Java
        this.queue = new LinkedList<>();
    }

    public int ping(int t) {
        // Step 1: Add the new request time to the queue
        queue.offer(t);

        // Step 2: Remove all requests that are outside the 3000ms window
        // While the oldest request is less than t - 3000, remove it
        // t - 3000 is the lower bound of our window
        while (queue.peek() < t - 3000) {
            queue.poll();
        }

        // Step 3: Return the number of requests in the current window
        // This is just the size of the queue after removing old requests
        return queue.size();
    }
}
```

</div>

**Why this is optimal:**

- Each request is added once and removed at most once
- The while loop might look like O(n), but it's amortized O(1) because each element is processed only twice (added and removed)
- We only store requests that could still be relevant in the future

## Complexity Analysis

**Time Complexity:**

- **Amortized O(1) per `ping` call:** Each request is added to the queue exactly once and removed at most once. Even though we might have a while loop that removes multiple elements, over n calls, we do at most 2n operations (n adds + at most n removes).

**Space Complexity:**

- **O(k) where k is the maximum number of requests in any 3000ms window:** In the worst case, if requests come very frequently, we might store up to 3000 requests (if they're exactly 1ms apart). More realistically, the space is proportional to the number of requests that fit in a 3000ms window.

## Common Mistakes

1. **Using a list instead of a proper queue:** Some candidates use a list and remove from the front with `pop(0)` in Python or `splice()` in JavaScript. These operations are O(n), making the overall solution O(n²). Always use a proper queue data structure.

2. **Incorrect window boundary:** The condition should be `while queue[0] < t - 3000` not `while queue[0] <= t - 3000`. If a request happened exactly at time `t - 3000`, it's still within the window [t-3000, t].

3. **Forgetting that t is strictly increasing:** The problem states "It is guaranteed that every call to ping uses a strictly larger value of t than before." This guarantees our queue stays in sorted order, which simplifies the solution. Without this guarantee, we'd need a more complex approach.

4. **Not understanding amortized complexity:** Candidates sometimes think the while loop makes each ping O(n). It's important to explain that while a single ping might take O(n) in the worst case, over a sequence of operations, each element is processed at most twice, giving amortized O(1).

## When You'll See This Pattern

The sliding window queue pattern appears in many streaming data problems:

1. **Moving Average from Data Stream (LeetCode 346):** Similar concept but calculating average instead of count. You maintain a window of size k and update as new values arrive.

2. **Sliding Window Maximum (LeetCode 239):** A more advanced version where you need the maximum in each sliding window. Uses a deque to maintain candidates.

3. **First Unique Number in Data Stream (LeetCode 1429):** Maintaining state about elements in a stream as new elements arrive and old ones become irrelevant.

The core pattern: when you need to maintain a subset of data that's "relevant" based on some sliding criteria (time, position, etc.), and old data becomes irrelevant in order, a queue is often the right tool.

## Key Takeaways

1. **Queues are perfect for sliding windows:** When data arrives in order and becomes irrelevant in the same order (FIFO), a queue naturally maintains the relevant subset.

2. **Amortized analysis matters:** Operations that might occasionally be expensive can still have good average performance if each element is processed a constant number of times.

3. **Read problem constraints carefully:** The guarantee that `t` is strictly increasing is crucial for the queue approach. Without it, you'd need a different data structure.

Remember: for streaming data with time-based windows, think "queue" first. Add new elements to the back, remove old ones from the front, and your window slides efficiently.

[Practice this problem on CodeJeet](/problem/number-of-recent-calls)
