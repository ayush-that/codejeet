---
title: "Heap (Priority Queue) Questions at Zomato: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-18"
category: "dsa-patterns"
tags: ["zomato", "heap-priority-queue", "interview prep"]
---

If you're preparing for a Zomato interview and see that only 2 out of 29 questions in their tagged list are about Heaps (Priority Queues), you might be tempted to deprioritize this topic. That would be a mistake. While the raw count is low, Heap questions at Zomato are not filler; they are high-signal, medium-to-hard problems that test your ability to model real-world, scalable systems. Zomato's core business—food delivery and restaurant discovery—is built on dynamic, real-time data: managing thousands of concurrent delivery agent assignments, ranking search results by relevance and distance, or batching kitchen orders for efficiency. The Heap is the perfect data structure to model these "always need the best/worst/most urgent item right now" scenarios. In my experience and from talking with candidates, a Heap question appears in roughly 1 in 4 to 1 in 5 technical interviews at Zomato, often in the second or third coding round. When it does appear, it's rarely a simple "implement a heap." It's almost always applied to a problem that mirrors a backend or logistics challenge they actually face.

## Specific Patterns Zomato Favors

Zomato's Heap problems tend to cluster around two high-level patterns: **"K-th Element"** streams and **"Greedy Interval Scheduling"** with resource constraints. They love questions where data is streaming in (like incoming delivery requests or live restaurant ratings) and you need to continuously answer queries about the top K elements. This tests both your knowledge of the Heap structure and your ability to design for real-time processing.

The second pattern involves intervals (representing delivery time windows, order prep times, or peak demand periods) and using a min-heap to track the "finish time" of the most recent resource allocation (like a delivery agent). This is essentially solving a resource scheduling problem with the minimum number of "agents" or "rooms."

You'll rarely see esoteric Heap-graph hybrids (like Dijkstra's) in early rounds; those are more common in companies like Uber or Google Maps. Zomato's problems are more directly tied to ordering, ranking, and efficient allocation.

For example, a classic "K-th Element" problem like **Find Median from Data Stream (LeetCode #295)** is highly relevant. It models maintaining a live median of restaurant ratings or order values. The "Greedy Interval Scheduling" pattern is perfectly exemplified by **Meeting Rooms II (LeetCode #253)** or the nearly identical **Minimum Number of Platforms Required for a Railway Station (GeeksforGeeks)**, which directly analogizes to "minimum number of delivery agents needed for a set of orders."

## How to Prepare

Master the two-pattern approach. For the "K-th Element" pattern, the key is maintaining two heaps: a max-heap for the lower half of the numbers and a min-heap for the upper half. This allows O(log n) insertion and O(1) retrieval of the median (or any K-th statistic).

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        # max-heap for the lower half (using negative values for max-heap in Python's min-heap)
        self.lo = []
        # min-heap for the upper half
        self.hi = []

    def addNum(self, num: int) -> None:
        # Push to max-heap (lo) first
        heapq.heappush(self.lo, -num)
        # Ensure every element in lo is <= every element in hi
        popped_from_lo = -heapq.heappop(self.lo)
        heapq.heappush(self.hi, popped_from_lo)

        # Balance sizes: lo can have at most one more element than hi
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2.0

# Time Complexity: addNum - O(log n), findMedian - O(1)
# Space Complexity: O(n) for storing all numbers across both heaps.
```

```javascript
class MedianFinder {
  constructor() {
    // Max-heap (using negative values in a min-heap)
    this.lo = new MinPriorityQueue(); // Actually a min-heap, but we store negatives.
    // Min-heap
    this.hi = new MinPriorityQueue();
  }

  addNum(num) {
    // Push to lo (max-heap simulation)
    this.lo.enqueue(-num);
    // Move largest from lo to hi
    this.hi.enqueue(-this.lo.dequeue().element);
    // Balance sizes
    if (this.lo.size() < this.hi.size()) {
      this.lo.enqueue(-this.hi.dequeue().element);
    }
  }

  findMedian() {
    if (this.lo.size() > this.hi.size()) {
      return -this.lo.front().element;
    }
    return (-this.lo.front().element + this.hi.front().element) / 2;
  }
}

// Using `@datastructures-js/priority-queue` library for clarity.
// Time Complexity: addNum - O(log n), findMedian - O(1)
// Space Complexity: O(n)
```

```java
import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    private PriorityQueue<Integer> lo; // Max-heap
    private PriorityQueue<Integer> hi; // Min-heap

    public MedianFinder() {
        lo = new PriorityQueue<>(Collections.reverseOrder());
        hi = new PriorityQueue<>();
    }

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (lo.size() < hi.size()) {
            lo.offer(hi.poll());
        }
    }

    public double findMedian() {
        if (lo.size() > hi.size()) {
            return lo.peek();
        }
        return (lo.peek() + hi.peek()) / 2.0;
    }
}

// Time Complexity: addNum - O(log n), findMedian - O(1)
// Space Complexity: O(n)
```

</div>

For the "Greedy Interval Scheduling" pattern, the algorithm is to sort intervals by start time, then use a min-heap to track end times. This heap tells you the earliest time a resource (agent, room) becomes free.

<div class="code-group">

```python
import heapq

def min_delivery_agents(intervals):
    if not intervals:
        return 0

    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])
    # Min-heap to track end times of assigned agents
    agents_free_time = []

    for start, end in intervals:
        # If the earliest finishing agent is free by this job's start, reassign
        if agents_free_time and agents_free_time[0] <= start:
            heapq.heappop(agents_free_time)
        # Assign current job to an agent (new or reused)
        heapq.heappush(agents_free_time, end)

    # The heap size is the minimum agents needed at peak
    return len(agents_free_time)

# intervals = [[0, 30], [5, 10], [15, 20]]
# Time Complexity: O(n log n) for sorting + O(n log k) for heap operations, where k <= n.
# Space Complexity: O(n) for the heap in worst case.
```

```javascript
function minDeliveryAgents(intervals) {
  if (intervals.length === 0) return 0;

  intervals.sort((a, b) => a[0] - b[0]);
  const agentsFreeTime = new MinPriorityQueue();

  for (const [start, end] of intervals) {
    if (agentsFreeTime.size() > 0 && agentsFreeTime.front().element <= start) {
      agentsFreeTime.dequeue();
    }
    agentsFreeTime.enqueue(end);
  }
  return agentsFreeTime.size();
}

// Time Complexity: O(n log n)
// Space Complexity: O(n)
```

```java
import java.util.Arrays;
import java.util.PriorityQueue;

public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> allocator = new PriorityQueue<>();

    for (int[] interval : intervals) {
        if (!allocator.isEmpty() && allocator.peek() <= interval[0]) {
            allocator.poll();
        }
        allocator.offer(interval[1]);
    }
    return allocator.size();
}

// Time Complexity: O(n log n)
// Space Complexity: O(n)
```

</div>

## How Zomato Tests Heap vs Other Companies

At companies like Google or Amazon, a Heap is often a component in a more complex algorithm (e.g., Dijkstra's in a massive graph, or a Heap in a multi-step dynamic programming solution). The focus is on algorithmic purity and optimization. At Zomato, the Heap is the _centerpiece_ of a problem that models a tangible system. The difficulty isn't in obscure algorithmic tricks, but in correctly modeling the constraints of their domain. You might be given a wordy problem description about "driver assignments" or "rating thresholds." Your first job is to strip away the domain and recognize it as a standard Heap pattern. They are testing if you can see the underlying computer science in a messy real-world scenario—a crucial skill for their engineers.

## Study Order

1.  **Heap Fundamentals:** Understand how a min-heap and max-heap work, time complexities, and how to implement basic operations (heapify, insert, extract). You don't need to implement from scratch in an interview, but you must know the black-box behavior.
2.  **Basic "K-th Element" Pattern:** Start with **Kth Largest Element in a Stream (LeetCode #703)**. It's the simplest introduction to using a heap to maintain top K elements.
3.  **Advanced "K-th Element" Pattern:** Move to **Find Median from Data Stream (#295)**. This teaches you the two-heap technique, which is a powerful tool.
4.  **Single-Resource Scheduling:** Learn the basic greedy interval pattern with **Meeting Rooms II (#253)**. This is the foundational algorithm.
5.  **Multi-Factor Prioritization:** Practice problems where the "priority" in the queue is based on multiple criteria, like **Merge K Sorted Lists (#23)**. This is common in systems that batch similar tasks.
6.  **(Optional) Heap as a Component:** Finally, look at **Top K Frequent Elements (#347)** or Dijkstra's algorithm to see how a heap can optimize other processes. This is less frequent at Zomato but good general knowledge.

## Recommended Practice Order

Solve these problems in sequence to build the skills Zomato looks for:

1.  **Kth Largest Element in a Stream (LeetCode #703)** - Warm-up.
2.  **Find Median from Data Stream (#295)** - Master the two-heap pattern.
3.  **Meeting Rooms II (#253)** - Learn the core scheduling algorithm.
4.  **K Closest Points to Origin (#973)** - A variation of the top-K pattern with a custom comparator.
5.  **Task Scheduler (#621)** - A harder scheduling problem that sometimes uses a heap. It tests if you can recognize when a heap is the right tool for managing task frequencies and cooldowns.

By focusing on these patterns and their real-world analogs, you'll walk into a Zomato interview ready to tackle their Heap questions not as abstract puzzles, but as system design problems in disguise.

[Practice Heap (Priority Queue) at Zomato](/company/zomato/heap-priority-queue)
