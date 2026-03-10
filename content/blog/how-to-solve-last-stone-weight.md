---
title: "How to Solve Last Stone Weight — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Last Stone Weight. Easy difficulty, 66.3% acceptance rate. Topics: Array, Heap (Priority Queue)."
date: "2026-11-09"
category: "dsa-patterns"
tags: ["last-stone-weight", "array", "heap-(priority-queue)", "easy"]
---

# How to Solve Last Stone Weight

This problem simulates a game where we repeatedly smash the two heaviest stones together, with the heavier stone winning and the difference remaining. The challenge is efficiently finding and removing the two largest values on each turn — a perfect scenario for a max-heap data structure. What makes this interesting is recognizing that repeatedly sorting or scanning for maximums is inefficient, while a heap gives us O(log n) access to the largest elements.

## Visual Walkthrough

Let's trace through the example `stones = [2,7,4,1,8,1]`:

**Initial state:** [2,7,4,1,8,1]

**Step 1:** Find the two heaviest stones: 8 and 7  
Smash them: 8 - 7 = 1  
Remove both, add the result (1) back: [2,4,1,1,1]  
(Notice we now have three stones of weight 1)

**Step 2:** Find the two heaviest stones: 4 and 2  
Smash them: 4 - 2 = 2  
Remove both, add the result (2) back: [1,1,1,2]

**Step 3:** Find the two heaviest stones: 2 and 1  
Smash them: 2 - 1 = 1  
Remove both, add the result (1) back: [1,1,1]

**Step 4:** Find the two heaviest stones: 1 and 1  
Smash them: 1 - 1 = 0  
Remove both, don't add anything back: [1]

**Step 5:** Only one stone remains, so we return 1.

The key insight: we need to repeatedly find the maximum values, which suggests either sorting or using a max-heap.

## Brute Force Approach

The most straightforward approach is to repeatedly sort the array and process the last two elements:

1. Sort the array in ascending order
2. Take the last two elements (largest and second largest)
3. If they're equal, remove both
4. If different, remove both and insert their difference
5. Repeat until 0 or 1 stones remain

While this works, it's inefficient because sorting takes O(n log n) time, and we might need to sort repeatedly after each operation. For n stones, we could perform up to n-1 operations, leading to O(n² log n) time complexity in the worst case.

Here's what the brute force looks like:

```python
def lastStoneWeight(stones):
    while len(stones) > 1:
        stones.sort()  # O(n log n) each time!
        y = stones.pop()  # Largest
        x = stones.pop()  # Second largest

        if x != y:
            stones.append(y - x)

    return stones[0] if stones else 0
```

The problem: we're paying O(n log n) for sorting on every iteration. With n up to 30 in the constraints, this might pass, but it doesn't scale well and shows poor algorithmic thinking.

## Optimal Solution

The optimal approach uses a max-heap (priority queue). In most languages, heaps are implemented as min-heaps by default, so we store negative values to simulate a max-heap. The heap gives us O(log n) insertion and O(1) access to the maximum element.

**Algorithm:**

1. Convert all stone weights to negatives and push into a min-heap (effectively creating a max-heap)
2. While there's more than one stone in the heap:
   - Pop the two largest stones (most negative values)
   - If they're different, push their difference back into the heap
3. Return the last stone or 0 if none remain

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def lastStoneWeight(stones):
    """
    Simulates the stone smashing game using a max-heap.
    We use negative values since Python's heapq is a min-heap.
    """
    import heapq

    # Step 1: Create a max-heap by storing negative values
    # This allows us to use Python's min-heap as a max-heap
    max_heap = [-stone for stone in stones]
    heapq.heapify(max_heap)  # O(n) operation to build heap

    # Step 2: Process stones until 0 or 1 remain
    while len(max_heap) > 1:
        # Get the two heaviest stones (most negative = heaviest)
        stone1 = heapq.heappop(max_heap)  # Heaviest (most negative)
        stone2 = heapq.heappop(max_heap)  # Second heaviest

        # Since we stored negatives, stone1 <= stone2 (more negative = heavier)
        # Convert back to positive for comparison
        weight1 = -stone1
        weight2 = -stone2

        # If stones are different, smash them and add the difference
        if weight1 != weight2:
            new_stone = weight1 - weight2
            # Store as negative to maintain max-heap property
            heapq.heappush(max_heap, -new_stone)

        # If equal, both stones are destroyed (nothing to add)

    # Step 3: Return the last stone or 0 if no stones remain
    return -max_heap[0] if max_heap else 0
```

```javascript
// Time: O(n log n) | Space: O(n)
function lastStoneWeight(stones) {
  /**
   * Simulates the stone smashing game using a max-heap.
   * JavaScript doesn't have a built-in heap, so we implement one.
   */

  // Helper class for MaxHeap implementation
  class MaxHeap {
    constructor() {
      this.heap = [];
    }

    // Build heap from array in O(n) time
    buildHeap(arr) {
      this.heap = [...arr];
      for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
        this.heapifyDown(i);
      }
    }

    // Insert value into heap
    push(val) {
      this.heap.push(val);
      this.heapifyUp(this.heap.length - 1);
    }

    // Remove and return max value
    pop() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const max = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown(0);
      return max;
    }

    // Get max value without removing it
    peek() {
      return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
      return this.heap.length;
    }

    // Move element up to maintain heap property
    heapifyUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.heap[parent] >= this.heap[index]) break;

        // Swap with parent if parent is smaller
        [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
        index = parent;
      }
    }

    // Move element down to maintain heap property
    heapifyDown(index) {
      const last = this.heap.length - 1;

      while (true) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let largest = index;

        // Find largest among node and its children
        if (left <= last && this.heap[left] > this.heap[largest]) {
          largest = left;
        }
        if (right <= last && this.heap[right] > this.heap[largest]) {
          largest = right;
        }

        // If node is already larger than children, we're done
        if (largest === index) break;

        // Swap with larger child
        [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
        index = largest;
      }
    }
  }

  // Step 1: Build max-heap from stones
  const maxHeap = new MaxHeap();
  maxHeap.buildHeap(stones);

  // Step 2: Process stones until 0 or 1 remain
  while (maxHeap.size() > 1) {
    // Get the two heaviest stones
    const stone1 = maxHeap.pop(); // Heaviest
    const stone2 = maxHeap.pop(); // Second heaviest

    // If stones are different, smash them and add the difference
    if (stone1 !== stone2) {
      const newStone = stone1 - stone2;
      maxHeap.push(newStone);
    }

    // If equal, both stones are destroyed (nothing to add)
  }

  // Step 3: Return the last stone or 0 if no stones remain
  return maxHeap.size() > 0 ? maxHeap.pop() : 0;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Collections;
import java.util.PriorityQueue;

class Solution {
    public int lastStoneWeight(int[] stones) {
        /**
         * Simulates the stone smashing game using a max-heap.
         * Java's PriorityQueue is a min-heap by default, so we use
         * Collections.reverseOrder() to make it a max-heap.
         */

        // Step 1: Create a max-heap using PriorityQueue with reverse order
        // The comparator Collections.reverseOrder() makes it a max-heap
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        // Add all stones to the heap
        for (int stone : stones) {
            maxHeap.offer(stone);
        }

        // Step 2: Process stones until 0 or 1 remain
        while (maxHeap.size() > 1) {
            // Get the two heaviest stones
            int stone1 = maxHeap.poll(); // Heaviest
            int stone2 = maxHeap.poll(); // Second heaviest

            // If stones are different, smash them and add the difference
            if (stone1 != stone2) {
                int newStone = stone1 - stone2;
                maxHeap.offer(newStone);
            }

            // If equal, both stones are destroyed (nothing to add)
        }

        // Step 3: Return the last stone or 0 if no stones remain
        return maxHeap.isEmpty() ? 0 : maxHeap.poll();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Building the heap takes O(n) time
- Each `pop()` operation takes O(log n) time
- We perform up to n-1 operations (each removing 2 stones, potentially adding 1 back)
- In the worst case, we perform O(n) heap operations, each O(log n), giving O(n log n)

**Space Complexity: O(n)**

- We store all stones in the heap
- The heap uses O(n) space
- No additional significant space is used

The heap approach is optimal because any solution must at least look at all stones once (Ω(n)), and the heap operations give us the best possible time for repeated max operations.

## Common Mistakes

1. **Forgetting to handle the empty array case**: If the input is empty, we should return 0. Always check for edge cases at the beginning.

2. **Using positive values in a min-heap without conversion**: In Python, if you push positive values into `heapq`, you'll get the smallest stones first instead of the largest. Remember to negate values when using a min-heap as a max-heap.

3. **Not considering equal stones correctly**: When two stones are equal, both are destroyed and nothing is added back to the heap. Some candidates mistakenly try to add 0 to the heap, which is unnecessary.

4. **Inefficient max-finding with linear scans**: Some candidates repeatedly scan the array to find the two largest stones, resulting in O(n²) time. This works for small inputs but shows poor algorithmic thinking.

## When You'll See This Pattern

The "repeatedly extract maximum/minimum" pattern appears in many problems:

1. **Kth Largest Element in an Array (LeetCode 215)**: Similar pattern of maintaining a heap to efficiently find the kth largest element.

2. **Top K Frequent Elements (LeetCode 347)**: Use a heap to keep track of the most frequent elements.

3. **Merge K Sorted Lists (LeetCode 23)**: Use a min-heap to always get the smallest element from k lists.

4. **Find Median from Data Stream (LeetCode 295)**: Uses two heaps to maintain median efficiently.

The key insight is recognizing when you need to repeatedly access extreme values (maximum or minimum) from a changing collection. Whenever you see "find the largest/smallest" in a loop, think "heap".

## Key Takeaways

1. **Max-heap for repeated max operations**: When you need to repeatedly find and remove the maximum element, a max-heap (or min-heap with negated values) provides O(log n) operations vs O(n) for linear scans.

2. **Recognize the "extreme value" pattern**: Problems that involve repeatedly processing the largest/smallest elements are heap candidates. The giveaway is when you see "find the heaviest", "find the closest", or "find the most frequent" in a loop.

3. **Language-specific heap implementations**: Know how to use heaps in your language of choice. Python has `heapq` (min-heap), Java has `PriorityQueue`, and JavaScript requires manual implementation or a library.

[Practice this problem on CodeJeet](/problem/last-stone-weight)
