---
title: "Heap (Priority Queue) Questions at Zepto: What to Expect"
description: "Prepare for Heap (Priority Queue) interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-08"
category: "dsa-patterns"
tags: ["zepto", "heap-priority-queue", "interview prep"]
---

If you're preparing for Zepto interviews, you'll notice that 3 out of their 28 tagged problems involve Heaps (Priority Queues). That's about 11%—not a dominant focus, but a significant one. In real interviews, this translates to a solid chance you'll encounter at least one heap problem, especially in later rounds where they test optimization skills. Heaps matter at Zepto because they're building a fast-commerce platform; their engineering problems often involve real-time decisions—like optimizing delivery routes, managing inventory priority, or scheduling tasks—where you need to constantly retrieve the "most important" item. A heap is the perfect data structure for that.

## Specific Patterns Zepto Favors

Zepto's heap problems aren't about obscure variations. They focus on practical, high-utility patterns that directly map to backend and systems challenges. Based on their problem set, two patterns stand out:

1.  **The "K-th" Element Pattern:** This is their most common theme. You're not just finding the minimum or maximum, but the K-th smallest, largest, or most frequent. This requires maintaining a heap of a specific size (K) to optimize space and time. It tests if you understand that a heap can be used as a size-limited filter.
2.  **Heap as an Optimizer in Simulation:** Problems where you simulate a process (like assigning tasks or merging streams) and use a heap to efficiently select the next best action at each step. This pattern tests your ability to model a real-world process and identify the key operation that needs acceleration.

For example, **Kth Largest Element in a Stream (LeetCode #703)** is a classic "K-th" pattern problem. You must design a class that can add elements and always return the K-th largest. The optimal solution uses a _min-heap_ of size K, where the root is the K-th largest element. Zepto also has problems akin to **Top K Frequent Elements (LeetCode #347)**, which combines the "K-th" pattern with a frequency hash map.

## How to Prepare

Your preparation should internalize the two patterns above. Let's look at the core implementation for the "K-th" pattern using a min-heap to find the K-th largest element in a stream.

<div class="code-group">

```python
import heapq

class KthLargest:
    # Time: O(n log k) for initial build | Space: O(k)
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.min_heap = []
        for num in nums:
            self.add(num)  # Use add to maintain heap size

    # Time: O(log k) | Space: O(1)
    def add(self, val: int) -> int:
        # Push the new value onto the heap
        heapq.heappush(self.min_heap, val)
        # If heap size exceeds k, remove the smallest element.
        # This keeps the k largest elements, with the smallest of those at the root.
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        # The root is the k-th largest
        return self.min_heap[0]
```

```javascript
class KthLargest {
  // Time: O(n log k) for initial build | Space: O(k)
  constructor(k, nums) {
    this.k = k;
    this.minHeap = new MinPriorityQueue(); // Using library syntax for clarity
    for (const num of nums) {
      this.add(num);
    }
  }

  // Time: O(log k) | Space: O(1)
  add(val) {
    this.minHeap.enqueue(val);
    if (this.minHeap.size() > this.k) {
      this.minHeap.dequeue(); // Removes the smallest element
    }
    return this.minHeap.front().element; // The root is the k-th largest
  }
}
// Note: In an interview, you might implement a min-heap from scratch.
```

```java
import java.util.PriorityQueue;

class KthLargest {
    private int k;
    private PriorityQueue<Integer> minHeap;

    // Time: O(n log k) | Space: O(k)
    public KthLargest(int k, int[] nums) {
        this.k = k;
        this.minHeap = new PriorityQueue<>();
        for (int num : nums) {
            add(num); // Use add to maintain heap size
        }
    }

    // Time: O(log k) | Space: O(1)
    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll(); // Removes the smallest element
        }
        return minHeap.peek(); // The root is the k-th largest
    }
}
```

</div>

The key insight is the choice of heap type. To track the **K-th largest**, you use a _min-heap_. The smallest element in that min-heap is the K-th largest overall. Conversely, for K-th smallest, you'd use a _max-heap_.

For the simulation pattern, the structure often involves a while-loop that runs until a condition is met, pulling the best item from the heap, processing it, and potentially pushing new items back in. The classic **Merge K Sorted Lists (LeetCode #23)** is a prime example.

## How Zepto Tests Heap vs Other Companies

Compared to FAANG companies, Zepto's heap questions tend to be more "applied" and less "theoretical." At Google or Meta, you might get a heap problem disguised in a complex graph scenario (e.g., Dijkstra's algorithm). At Zepto, the connection to their business—scheduling, prioritization, top-K queries—is often more direct. The difficulty is moderate; they want to see you apply the standard pattern correctly and write clean, efficient code, not derive a novel algorithm on the spot.

What's unique is their emphasis on _efficiency under constant mutation_. The "stream" aspect of #703 is telling: data isn't static. They care about how your solution performs as new data arrives, mirroring the real-time nature of their platform.

## Study Order

Don't jump straight into heap problems. Build foundational knowledge first.

1.  **Basic Data Structures:** Ensure you're rock-solid on arrays and hash maps. You'll often use these in tandem with heaps (e.g., a hash map to count frequencies before feeding into a heap).
2.  **Understanding Heaps:** Learn what a min-heap and max-heap are, their properties (complete binary tree), and core operations (insert O(log n), remove-min/max O(log n), peek O(1)). Implement one from scratch _once_ for deep understanding.
3.  **Basic Heap Patterns:** Master the two patterns above in isolation.
    - **Pattern A (K-th Element):** Practice maintaining a heap of size K.
    - **Pattern B (Simulation/Optimization):** Practice using a heap to always get the next best/worst item in a loop.
4.  **Combination Problems:** Tackle problems where a heap is one part of the solution, like using a hash map with a heap for top K frequent elements, or a heap with a linked list for merging sorted lists.
5.  **Advanced/Greedy Scenarios:** Finally, look at problems where the heap enables a greedy strategy, like task scheduling or median finding (using two heaps).

This order works because it builds from the abstract (what is a heap?) to the concrete (how do I use it in a pattern?) to the complex (how does it interact with other structures?).

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **Kth Largest Element in an Array (LeetCode #215):** The foundational "K-th" pattern on a static array. Teaches you to choose between a min-heap or max-heap.
2.  **Kth Largest Element in a Stream (LeetCode #703):** The dynamic version, as shown in the code above. This is crucial for Zepto prep.
3.  **Top K Frequent Elements (LeetCode #347):** Combines the "K-th" pattern with a hash map. A very high-frequency interview question.
4.  **Merge K Sorted Lists (LeetCode #23):** The canonical "simulation/optimization" pattern. You use a min-heap to always get the next smallest node from K lists.
5.  **Task Scheduler (LeetCode #621):** A more advanced greedy problem where a heap helps schedule tasks with cooldown periods. It tests if you can model a process.

After this sequence, you'll have covered the core patterns Zepto uses. Remember, the goal isn't to memorize solutions, but to recognize when a problem asks for "the top K of something" or "repeatedly get the best/worst item"—that's your heap signal.

[Practice Heap (Priority Queue) at Zepto](/company/zepto/heap-priority-queue)
