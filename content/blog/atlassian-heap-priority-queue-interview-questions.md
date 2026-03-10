---
title: "Heap (Priority Queue) Questions at Atlassian: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-26"
category: "dsa-patterns"
tags: ["atlassian", "heap-priority-queue", "interview prep"]
---

# Heap (Priority Queue) Questions at Atlassian: What to Expect

Atlassian's interview questions include 6 Heap (Priority Queue) problems out of their 62 total tagged questions. While this might seem like a modest percentage (about 10%), don't underestimate their importance. In my experience conducting and analyzing Atlassian interviews, Heap questions appear more frequently than the raw numbers suggest because they often serve as the optimal solution for problems that aren't explicitly tagged as "Heap" questions.

Here's the reality: Atlassian engineers frequently deal with scheduling, resource allocation, and priority-based systems in products like Jira, Confluence, and Bitbucket. When you're managing thousands of tasks, pull requests, or notifications, you need efficient ways to handle what's most important first. That's why Heap questions aren't just algorithm trivia—they're practical tools that mirror real engineering challenges at the company.

## Specific Patterns Atlassian Favors

Atlassian's Heap questions tend to cluster around three specific patterns:

1. **K-th Element Problems**: Finding the K-th largest/smallest/frequent element in a dataset. These test whether you understand when to use a min-heap vs max-heap and how to maintain heap size efficiently.

2. **Merge K Sorted Sequences**: This pattern appears frequently because it mirrors real-world scenarios like merging results from multiple data sources or processing streams of events—common in distributed systems.

3. **Interval Scheduling with Priority**: Problems where you need to manage overlapping intervals or allocate resources based on priority. Think of it as "which meeting room should this high-priority meeting get?"

A classic example is **Meeting Rooms II (LeetCode #253)**, which Atlassian has been known to adapt into their own domain-specific versions. Instead of meeting rooms, you might be allocating CI/CD runners to build jobs or assigning support tickets to engineers.

<div class="code-group">

```python
# Pattern: K-th Largest Element with Min-Heap
# Time: O(n log k) | Space: O(k)
import heapq

def find_kth_largest(nums, k):
    """
    Atlassian variation: Find the k most critical bugs to fix first
    """
    # Min-heap of size k - smallest element at root
    min_heap = []

    for num in nums:
        heapq.heappush(min_heap, num)
        # Maintain only k largest elements
        if len(min_heap) > k:
            heapq.heappop(min_heap)  # Remove smallest

    # Root contains k-th largest
    return min_heap[0]

# Why min-heap for k-th largest? Because we want to easily
# remove the smallest of our k candidates when we find a larger one
```

```javascript
// Pattern: K-th Largest Element with Min-Heap
// Time: O(n log k) | Space: O(k)
function findKthLargest(nums, k) {
  // Min-heap implementation (JavaScript doesn't have built-in heap)
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    push(val) {
      this.heap.push(val);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      const min = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.sinkDown(0);
      }
      return min;
    }

    peek() {
      return this.heap[0];
    }

    size() {
      return this.heap.length;
    }

    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.heap[parent] <= this.heap[index]) break;
        [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
        index = parent;
      }
    }

    sinkDown(index) {
      const length = this.heap.length;
      while (true) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let swap = null;
        let element = this.heap[index];

        if (left < length && this.heap[left] < element) {
          swap = left;
        }

        if (right < length) {
          if (
            (swap === null && this.heap[right] < element) ||
            (swap !== null && this.heap[right] < this.heap[left])
          ) {
            swap = right;
          }
        }

        if (swap === null) break;
        [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
        index = swap;
      }
    }
  }

  const minHeap = new MinHeap();

  for (const num of nums) {
    minHeap.push(num);
    if (minHeap.size() > k) {
      minHeap.pop(); // Remove smallest
    }
  }

  return minHeap.peek();
}
```

```java
// Pattern: K-th Largest Element with Min-Heap
// Time: O(n log k) | Space: O(k)
import java.util.PriorityQueue;

public class KthLargest {
    public int findKthLargest(int[] nums, int k) {
        // Min-heap (default PriorityQueue in Java)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int num : nums) {
            minHeap.offer(num);
            // Maintain only k largest elements
            if (minHeap.size() > k) {
                minHeap.poll();  // Remove smallest
            }
        }

        return minHeap.peek();
    }
}
```

</div>

## How to Prepare

The key to mastering Atlassian's Heap questions is understanding the trade-offs. They want to see that you know when a Heap is the right solution versus when a simple sort or quickselect would suffice. Here's my preparation strategy:

1. **Memorize the heapify complexity**: Building a heap from n elements is O(n), not O(n log n). This is a common trick question.

2. **Practice the two-heap pattern** for median finding problems (like **Find Median from Data Stream, LeetCode #295**). This pattern appears in Atlassian's data processing scenarios.

3. **Learn to combine heaps with other data structures**. Atlassian problems often require heaps plus hashmaps (for frequency) or heaps plus arrays (for tracking indices).

<div class="code-group">

```python
# Pattern: Two Heaps for Median Finding
# Time: O(log n) per add, O(1) for findMedian | Space: O(n)
import heapq

class MedianFinder:
    def __init__(self):
        # Max-heap for lower half (invert min-heap with negative values)
        self.lower = []  # max-heap
        # Min-heap for upper half
        self.upper = []  # min-heap

    def addNum(self, num):
        # Always add to lower first
        heapq.heappush(self.lower, -num)

        # Balance: move largest from lower to upper
        heapq.heappush(self.upper, -heapq.heappop(self.lower))

        # Maintain size property: lower can have at most one more than upper
        if len(self.lower) < len(self.upper):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self):
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2

# Atlassian context: Tracking median response time for API requests
# or median priority of issues in a sprint
```

```javascript
// Pattern: Two Heaps for Median Finding
// Time: O(log n) per add, O(1) for findMedian | Space: O(n)
class MedianFinder {
  constructor() {
    this.lower = new MaxHeap(); // Lower half
    this.upper = new MinHeap(); // Upper half
  }

  addNum(num) {
    this.lower.insert(num);

    // Balance heaps
    this.upper.insert(this.lower.extractMax());

    // Maintain size property
    if (this.lower.size() < this.upper.size()) {
      this.lower.insert(this.upper.extractMin());
    }
  }

  findMedian() {
    if (this.lower.size() > this.upper.size()) {
      return this.lower.getMax();
    }
    return (this.lower.getMax() + this.upper.getMin()) / 2;
  }
}

// Implementing MinHeap and MaxHeap (simplified for example)
class MinHeap {
  /* implementation similar to previous example */
}
class MaxHeap {
  /* similar but with reverse comparison */
}
```

```java
// Pattern: Two Heaps for Median Finding
// Time: O(log n) per add, O(1) for findMedian | Space: O(n)
import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    private PriorityQueue<Integer> lower;  // Max-heap
    private PriorityQueue<Integer> upper;  // Min-heap

    public MedianFinder() {
        lower = new PriorityQueue<>(Collections.reverseOrder());
        upper = new PriorityQueue<>();
    }

    public void addNum(int num) {
        lower.offer(num);

        // Balance the heaps
        upper.offer(lower.poll());

        // Maintain size property
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
```

</div>

## How Atlassian Tests Heap (Priority Queue) vs Other Companies

Atlassian's Heap questions differ from other tech companies in subtle but important ways:

**Compared to Google**: Google's Heap problems are often more mathematically complex or combined with advanced graph algorithms. Atlassian's tend to be more practical and applied to business scenarios.

**Compared to Amazon**: Amazon loves Heap questions for optimizing logistics (shortest delivery routes). Atlassian focuses more on scheduling and resource allocation.

**Compared to Facebook/Meta**: Facebook's Heap questions often involve social network data (top K friends, trending posts). Atlassian's relate to work management and developer tools.

What's unique about Atlassian is they often present Heap problems disguised as product scenarios. You might be asked to design a task scheduler for Jira or a merge queue for Bitbucket pull requests. The algorithm is the same, but the context matters—they want to see if you can translate product requirements into technical solutions.

## Study Order

1. **Basic Heap Operations** - Understand insert (O(log n)), extract-min/max (O(log n)), and heapify (O(n)). Without this foundation, you'll struggle with optimization.

2. **K-th Element Patterns** - Start with simple K-th largest/smallest, then progress to K-th most frequent. This builds intuition for when to use min-heap vs max-heap.

3. **Merge K Sorted Sequences** - Master this before attempting more complex patterns because it teaches you how to store additional data (indices, values) in heap elements.

4. **Two-Heap Patterns** - Median finder and similar problems. These require maintaining two balanced heaps.

5. **Heap + Hash Map Combinations** - For problems like **Top K Frequent Elements (LeetCode #347)**, which is highly relevant to Atlassian's analytics features.

6. **Interval Problems with Heaps** - The most advanced pattern, combining sorting with heap-based resource allocation.

## Recommended Practice Order

Solve these problems in sequence to build up your Heap skills for Atlassian:

1. **Kth Largest Element in an Array (LeetCode #215)** - Basic min-heap pattern
2. **Top K Frequent Elements (LeetCode #347)** - Heap + hash map combination
3. **Merge k Sorted Lists (LeetCode #23)** - Classic Atlassian-relevant pattern
4. **Find Median from Data Stream (LeetCode #295)** - Two-heap mastery
5. **Meeting Rooms II (LeetCode #253)** - Interval scheduling with heap
6. **Task Scheduler (LeetCode #621)** - Advanced scheduling (bonus: very Atlassian-relevant)

After these six, look at Atlassian's tagged Heap problems specifically. Notice how they often combine multiple patterns—for example, a scheduling problem that requires both intervals and priority-based selection.

Remember: Atlassian interviewers care about clean code and clear communication. Even if you know the heap solution, explain why it's better than sorting (O(n log k) vs O(n log n) for large n with small k) and discuss trade-offs. They're evaluating your engineering judgment as much as your coding skills.

[Practice Heap (Priority Queue) at Atlassian](/company/atlassian/heap-priority-queue)
