---
title: "Data Stream Interview Questions: Patterns and Strategies"
description: "Master Data Stream problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-05"
category: "dsa-patterns"
tags: ["data-stream", "dsa", "interview prep"]
---

# Data Stream Interview Questions: Patterns and Strategies

You're 30 minutes into a Google interview, feeling good about your solution to a medium-difficulty problem. Then the interviewer drops this: "Now let's say the input isn't an array — it's an infinite stream of numbers. You need to return the median at any point in time." Suddenly, your O(n log n) sorting approach is useless, your O(n) quickselect won't work, and you realize you've been solving the wrong problem entirely.

This exact scenario happens more often than you'd think. Data stream problems appear in about 5-7% of technical interviews at top companies, but they catch candidates off guard because they require a fundamentally different mindset. You can't store everything, you can't sort everything, and you certainly can't process everything twice. The 16 data stream questions on LeetCode (3 easy, 8 medium, 5 hard) represent a critical interview category where preparation makes all the difference.

## Common Patterns

### 1. Two-Heaps Pattern (Priority Queues)

This is the single most important pattern for data stream problems, used in **Find Median from Data Stream (#295)** and **Sliding Window Median (#480)**. The intuition is simple but powerful: maintain two balanced heaps that give you constant-time access to critical statistics.

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        # Max heap for lower half (invert min-heap by storing negatives)
        self.lower = []  # max heap (negatives)
        # Min heap for upper half
        self.upper = []  # min heap

    def addNum(self, num: int) -> None:
        # Always add to lower first
        heapq.heappush(self.lower, -num)

        # Balance: move largest from lower to upper
        heapq.heappush(self.upper, -heapq.heappop(self.lower))

        # Maintain size property: lower can have at most one more than upper
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2

# Time: O(log n) for addNum, O(1) for findMedian
# Space: O(n) for storing all elements
```

```javascript
class MedianFinder {
  constructor() {
    // Max heap for lower half (simulated with min heap and negatives)
    this.lower = new MinPriorityQueue({ priority: (x) => -x });
    // Min heap for upper half
    this.upper = new MinPriorityQueue();
  }

  addNum(num) {
    // Add to lower, then move to upper if needed
    this.lower.enqueue(num);
    this.upper.enqueue(-this.lower.dequeue().priority);

    // Balance sizes
    if (this.lower.size() < this.upper.size()) {
      this.lower.enqueue(-this.upper.dequeue().priority);
    }
  }

  findMedian() {
    if (this.lower.size() > this.upper.size()) {
      return -this.lower.front().priority;
    }
    return (-this.lower.front().priority + this.upper.front().priority) / 2;
  }
}

// Time: O(log n) for addNum, O(1) for findMedian
// Space: O(n) for storing all elements
```

```java
class MedianFinder {
    private PriorityQueue<Integer> lower; // max heap
    private PriorityQueue<Integer> upper; // min heap

    public MedianFinder() {
        lower = new PriorityQueue<>((a, b) -> b - a); // max heap
        upper = new PriorityQueue<>(); // min heap
    }

    public void addNum(int num) {
        lower.offer(num);
        upper.offer(lower.poll());

        // Balance: lower should have equal or one more than upper
        if (lower.size() < upper.size()) {
            lower.offer(upper.poll());
        }
    }

    public double findMedian() {
        if (lower.size() > upper.size()) {
            return lower.peek();
        }
        return (lower.peek() + upper.peek()) / 2.0;
    }
}

// Time: O(log n) for addNum, O(1) for findMedian
// Space: O(n) for storing all elements
```

</div>

**Why this works:** The two heaps maintain a sorted view of the data stream without actually sorting. The lower heap (max heap) gives you the largest number in the first half, while the upper heap (min heap) gives you the smallest number in the second half. The median is either the top of the larger heap or the average of both tops.

### 2. Reservoir Sampling

Used in **Linked List Random Node (#382)** and **Random Pick Index (#398)**, this pattern lets you pick a random element from a stream with equal probability without knowing the stream length in advance. The intuition: as you process element i, replace your current selection with probability 1/i.

<div class="code-group">

```python
import random

class Solution:
    def __init__(self, head):
        self.head = head

    def getRandom(self):
        result = None
        current = self.head
        count = 0

        while current:
            count += 1
            # With probability 1/count, replace result
            if random.randint(1, count) == 1:
                result = current.val
            current = current.next

        return result

# Time: O(n) for getRandom, O(1) for initialization
# Space: O(1) extra space
```

```javascript
class Solution {
  constructor(head) {
    this.head = head;
  }

  getRandom() {
    let result = null;
    let current = this.head;
    let count = 0;

    while (current) {
      count++;
      // With probability 1/count, replace result
      if (Math.floor(Math.random() * count) === 0) {
        result = current.val;
      }
      current = current.next;
    }

    return result;
  }
}

// Time: O(n) for getRandom, O(1) for initialization
// Space: O(1) extra space
```

```java
class Solution {
    private ListNode head;
    private Random rand;

    public Solution(ListNode head) {
        this.head = head;
        this.rand = new Random();
    }

    public int getRandom() {
        int result = 0;
        ListNode current = head;
        int count = 0;

        while (current != null) {
            count++;
            // With probability 1/count, replace result
            if (rand.nextInt(count) == 0) {
                result = current.val;
            }
            current = current.next;
        }

        return result;
    }
}

// Time: O(n) for getRandom, O(1) for initialization
// Space: O(1) extra space
```

</div>

**The proof:** For element i to be selected, it must be chosen when encountered (probability 1/i) and not replaced by any later element (probability i/(i+1) × (i+1)/(i+2) × ... × (n-1)/n = i/n). Multiply these: (1/i) × (i/n) = 1/n for all i.

### 3. Sliding Window with Deque

For problems like **Moving Average from Data Stream (#346)** and **Sliding Window Maximum (#239)**, a deque (double-ended queue) maintains a window of relevant elements. The key insight: you can discard elements that will never be the answer.

<div class="code-group">

```python
from collections import deque

class MovingAverage:
    def __init__(self, size: int):
        self.size = size
        self.queue = deque()
        self.sum = 0

    def next(self, val: int) -> float:
        self.queue.append(val)
        self.sum += val

        if len(self.queue) > self.size:
            self.sum -= self.queue.popleft()

        return self.sum / len(self.queue)

# Time: O(1) for next
# Space: O(k) where k is window size
```

```javascript
class MovingAverage {
  constructor(size) {
    this.size = size;
    this.queue = [];
    this.sum = 0;
  }

  next(val) {
    this.queue.push(val);
    this.sum += val;

    if (this.queue.length > this.size) {
      this.sum -= this.queue.shift();
    }

    return this.sum / this.queue.length;
  }
}

// Time: O(1) amortized for next (shift is O(n) but rare)
// Space: O(k) where k is window size
```

```java
class MovingAverage {
    private int size;
    private Queue<Integer> queue;
    private double sum;

    public MovingAverage(int size) {
        this.size = size;
        this.queue = new LinkedList<>();
        this.sum = 0;
    }

    public double next(int val) {
        queue.offer(val);
        sum += val;

        if (queue.size() > size) {
            sum -= queue.poll();
        }

        return sum / queue.size();
    }
}

// Time: O(1) for next
// Space: O(k) where k is window size
```

</div>

**Optimization note:** For **Sliding Window Maximum (#239)**, you need a monotonic deque that maintains decreasing values, giving you O(n) time instead of O(nk).

## When to Use Data Stream vs Alternatives

Recognizing a data stream problem is crucial. Here's your decision tree:

1. **Can you store all data?** If the problem says "infinite stream," "continuous input," or "real-time," you can't store everything. That's your first clue.

2. **Do you need statistics over time?** If you need median, average, or percentiles at any point, think two-heaps. If you need recent statistics (last k elements), think sliding window.

3. **Is memory severely constrained?** Even with finite data, if memory is O(1) or O(log n), you're in data stream territory. **Kth Largest Element in a Stream (#703)** is a perfect example — you maintain only k elements in a min-heap.

4. **Random sampling requirement?** If you need to pick random elements with equal probability from unknown-sized input, it's reservoir sampling.

**Common mistake:** Trying to adapt array-based solutions. If you find yourself thinking "I'll just store everything and sort," stop. That's the wrong approach.

## Edge Cases and Gotchas

### 1. Integer Overflow in Moving Average

When calculating sums for large windows with large numbers, use 64-bit integers (long in Java, float in Python). Test with max integer values.

```python
def next(self, val: int) -> float:
    # Use float for sum to prevent overflow
    self.sum = float(self.sum) + val
```

### 2. Empty Stream Handling

What happens when `findMedian()` is called before any numbers? Always check for empty state.

```java
public double findMedian() {
    if (lower.isEmpty() && upper.isEmpty()) {
        throw new IllegalStateException("No numbers added");
    }
    // ... rest of logic
}
```

### 3. Duplicate Values in Heaps

When values repeat, heap ordering matters. For two-heaps, ensure your comparator handles duplicates correctly. In Java, `(a, b) -> b - a` can overflow; use `Integer.compare(b, a)` instead.

### 4. Window Size Zero

For sliding window problems, what if size = 0? Define the behavior: return 0, throw exception, or handle gracefully.

```python
def __init__(self, size: int):
    if size <= 0:
        raise ValueError("Size must be positive")
```

## Difficulty Breakdown

The 3 easy / 8 medium / 5 hard split tells you something important: **data stream problems skew toward medium-hard**. Companies use these to differentiate candidates.

- **Easy (19%):** These are warm-ups. **Moving Average from Data Stream (#346)** is essentially a coding exercise. Master these in 30 minutes.
- **Medium (50%):** This is the core. **Find Median from Data Stream (#295)** appears in 1 out of 4 Google interviews that include data streams. Spend 70% of your time here.
- **Hard (31%):** These combine data streams with other patterns. **Sliding Window Median (#480)** adds the sliding window constraint. Practice these last.

**Study priority:** Medium → Hard → Easy. The medium problems teach you the patterns; the hard problems test if you can combine them; the easy problems are quick wins.

## Which Companies Ask Data Stream

- **Amazon** (/company/amazon): Favors practical, real-world scenarios. Expect **Moving Average from Data Stream (#346)** for system monitoring questions.
- **Google** (/company/google): Loves the two-heaps pattern. **Find Median from Data Stream (#295)** is their signature question.
- **Meta** (/company/meta): Often combines data streams with system design. Think about news feed ranking or real-time metrics.
- **Bloomberg** (/company/bloomberg): Financial applications — stock price streams, trading volume analysis.
- **Microsoft** (/company/microsoft): Mixes data streams with other algorithms. **Kth Largest Element in a Stream (#703)** is common.

Each company has a style: Google tests pure algorithmic insight, Amazon wants practical implementation, Bloomberg looks for financial intuition.

## Study Tips

1. **Learn the patterns, not just problems:** When you solve **Find Median from Data Stream (#295)**, don't just memorize the code. Understand why two heaps work. Then apply it to **Sliding Window Median (#480)**.

2. **Recommended problem order:**
   - Start with **Moving Average from Data Stream (#346)** (easy)
   - Master **Find Median from Data Stream (#295)** (medium) — this is the foundation
   - Practice **Kth Largest Element in a Stream (#703)** (medium)
   - Try **Data Stream as Disjoint Intervals (#352)** (hard) — combines streams with intervals
   - Finally, tackle **Sliding Window Median (#480)** (hard)

3. **Draw it out:** For two-heaps problems, draw the heaps after each insertion. Visualize how elements flow between them. This builds intuition faster than staring at code.

4. **Time yourself:** Data stream problems often come as follow-ups. Practice solving **Find Median from Data Stream (#295)** in under 15 minutes, then explaining it clearly.

Remember: Data stream problems test whether you can think beyond static data structures. They're not about memorizing solutions but about adapting fundamental patterns to constrained environments. When you see "stream," think "online algorithm" — process as you go, maintain minimal state, and always be ready for the next element.

[Practice all Data Stream questions on CodeJeet](/topic/data-stream)
