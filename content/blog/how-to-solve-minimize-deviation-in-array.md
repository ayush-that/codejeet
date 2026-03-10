---
title: "How to Solve Minimize Deviation in Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimize Deviation in Array. Hard difficulty, 54.0% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue), Ordered Set."
date: "2027-06-17"
category: "dsa-patterns"
tags: ["minimize-deviation-in-array", "array", "greedy", "heap-(priority-queue)", "hard"]
---

# How to Solve Minimize Deviation in Array

This problem asks us to minimize the difference between the maximum and minimum values in an array by repeatedly applying two operations: dividing even numbers by 2, and multiplying odd numbers by 2. The challenge comes from the fact that we can apply these operations any number of times, creating a search space that grows exponentially if approached naively. What makes this problem interesting is that it looks like a search problem but can be solved efficiently with a greedy approach using a priority queue.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [4, 1, 5, 20, 3]`

**Step 1: Understanding the operations**

- Odd numbers can only be multiplied by 2 (once, since they become even)
- Even numbers can be divided by 2 (multiple times until they become odd)

**Step 2: Transform all numbers to their maximum possible values**
Since we want to minimize the range, we need to work with numbers that can only decrease. Let's transform each number to its maximum possible value:

- 4 (even) → already at max (can't multiply even numbers)
- 1 (odd) → 1 × 2 = 2
- 5 (odd) → 5 × 2 = 10
- 20 (even) → already at max
- 3 (odd) → 3 × 2 = 6

Our array becomes: `[4, 2, 10, 20, 6]`

**Step 3: The greedy process**
We'll use a max-heap to always work with the current maximum value:

1. Initial state: max = 20, min = 2, deviation = 18
2. Reduce the maximum (20 is even → divide by 2 = 10)
   New array: `[4, 2, 10, 10, 6]`
   max = 10, min = 2, deviation = 8
3. Reduce the maximum (10 is even → divide by 2 = 5)
   New array: `[4, 2, 5, 10, 6]`
   max = 10, min = 2, deviation = 8 (no improvement)
4. Reduce the maximum (10 is even → divide by 2 = 5)
   New array: `[4, 2, 5, 5, 6]`
   max = 6, min = 2, deviation = 4
5. Reduce the maximum (6 is even → divide by 2 = 3)
   New array: `[4, 2, 5, 5, 3]`
   max = 5, min = 2, deviation = 3
6. Reduce the maximum (5 is odd → can't divide further)
   We stop because the maximum is odd

The minimum deviation we found is 3.

## Brute Force Approach

A naive approach would be to consider all possible transformations for each number:

- For odd numbers: only one transformation (multiply by 2)
- For even numbers: can divide by 2 until odd, so log₂(n) possible values

The brute force would generate all combinations of these values and find the minimum range. For an array of size n, this creates O((log M)ⁿ) possibilities where M is the maximum value in the array. Even for modest n=10 and M=10⁹, this is completely infeasible.

The key insight we need is that we don't need to consider all combinations - we can approach this greedily by always reducing the current maximum value.

## Optimized Approach

The optimal solution uses a max-heap (priority queue) with this reasoning:

1. **Transform all numbers to their maximum possible values**:
   - Odd numbers × 2 (makes them even, their maximum)
   - Even numbers stay as-is (already at maximum)
     This ensures all numbers can only decrease from their starting values.

2. **Track the current minimum**: Since we're reducing numbers, the minimum might increase over time. We need to track it separately.

3. **Greedy reduction**:
   - Always take the current maximum (using a max-heap)
   - If it's even, divide it by 2 and push back to heap
   - If it's odd, we can't reduce it further
   - Update the answer with the current deviation (max - min)

4. **Stop condition**:
   We stop when the maximum becomes odd (can't be reduced further), OR when we've processed all possible reductions.

The reason this works is that by always reducing the maximum value, we're systematically exploring the most promising path to minimize the range. This is similar to the approach in "Minimum Difference Between Largest and Smallest Value in Three Moves" but with more complex transformation rules.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n * log M) where M is max value | Space: O(n)
def minimumDeviation(nums):
    """
    Minimize deviation by transforming numbers:
    - Odd numbers can be multiplied by 2 (once)
    - Even numbers can be divided by 2 (multiple times)
    """
    import heapq

    # First, transform all numbers to their maximum possible values
    # This ensures we only need to consider decreasing operations
    max_heap = []
    min_val = float('inf')

    for num in nums:
        if num % 2 == 1:
            # Odd number: multiply by 2 to get its maximum value
            transformed = num * 2
        else:
            # Even number: already at maximum
            transformed = num

        # Push negative value for max-heap (Python has min-heap by default)
        heapq.heappush(max_heap, -transformed)
        # Track the minimum value
        min_val = min(min_val, transformed)

    # Initialize answer with initial deviation
    answer = float('inf')

    # Process until we can't reduce the maximum further
    while True:
        # Get current maximum (negate since we stored negatives)
        max_val = -heapq.heappop(max_heap)
        # Update answer with current deviation
        answer = min(answer, max_val - min_val)

        # If max_val is odd, we can't reduce it further
        if max_val % 2 == 1:
            break

        # Reduce the maximum by dividing by 2
        reduced = max_val // 2
        # Update minimum if needed
        min_val = min(min_val, reduced)
        # Push reduced value back to heap
        heapq.heappush(max_heap, -reduced)

    return answer
```

```javascript
// Time: O(n log n * log M) where M is max value | Space: O(n)
function minimumDeviation(nums) {
  /**
   * Minimize deviation by transforming numbers:
   * - Odd numbers can be multiplied by 2 (once)
   * - Even numbers can be divided by 2 (multiple times)
   */

  // Max-heap using min-heap with negative values
  const maxHeap = new MinHeap();
  let minVal = Infinity;

  // Transform all numbers to their maximum possible values
  for (let num of nums) {
    let transformed;
    if (num % 2 === 1) {
      // Odd number: multiply by 2 to get its maximum value
      transformed = num * 2;
    } else {
      // Even number: already at maximum
      transformed = num;
    }

    // Store negative for max-heap behavior
    maxHeap.insert(-transformed);
    // Track minimum value
    minVal = Math.min(minVal, transformed);
  }

  let answer = Infinity;

  // Process until we can't reduce the maximum further
  while (true) {
    // Get current maximum (negate since we stored negatives)
    const maxVal = -maxHeap.extractMin();
    // Update answer with current deviation
    answer = Math.min(answer, maxVal - minVal);

    // If maxVal is odd, we can't reduce it further
    if (maxVal % 2 === 1) {
      break;
    }

    // Reduce the maximum by dividing by 2
    const reduced = maxVal / 2;
    // Update minimum if needed
    minVal = Math.min(minVal, reduced);
    // Push reduced value back to heap
    maxHeap.insert(-reduced);
  }

  return answer;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }

    return min;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];

      if (element >= parent) break;

      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild < element) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if ((swap === null && rightChild < element) || (swap !== null && rightChild < leftChild)) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;

      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}
```

```java
// Time: O(n log n * log M) where M is max value | Space: O(n)
import java.util.Collections;
import java.util.PriorityQueue;

class Solution {
    public int minimumDeviation(int[] nums) {
        /**
         * Minimize deviation by transforming numbers:
         * - Odd numbers can be multiplied by 2 (once)
         * - Even numbers can be divided by 2 (multiple times)
         */

        // Max-heap (priority queue in reverse order)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        int minVal = Integer.MAX_VALUE;

        // Transform all numbers to their maximum possible values
        for (int num : nums) {
            int transformed;
            if (num % 2 == 1) {
                // Odd number: multiply by 2 to get its maximum value
                transformed = num * 2;
            } else {
                // Even number: already at maximum
                transformed = num;
            }

            // Add to max-heap
            maxHeap.offer(transformed);
            // Track minimum value
            minVal = Math.min(minVal, transformed);
        }

        int answer = Integer.MAX_VALUE;

        // Process until we can't reduce the maximum further
        while (!maxHeap.isEmpty()) {
            // Get current maximum
            int maxVal = maxHeap.poll();
            // Update answer with current deviation
            answer = Math.min(answer, maxVal - minVal);

            // If maxVal is odd, we can't reduce it further
            if (maxVal % 2 == 1) {
                break;
            }

            // Reduce the maximum by dividing by 2
            int reduced = maxVal / 2;
            // Update minimum if needed
            minVal = Math.min(minVal, reduced);
            // Push reduced value back to heap
            maxHeap.offer(reduced);
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n \* log M)

- `n` is the length of the input array
- `M` is the maximum value in the array after transformation
- We process each number in a heap: O(n log n) for heap operations
- Each even number can be divided by 2 at most log M times
- In worst case, all numbers are powers of 2, so we process O(n log M) heap operations

**Space Complexity:** O(n)

- We store all numbers in a priority queue
- The heap contains at most n elements at any time

The log M factor comes from the fact that we might need to repeatedly divide large even numbers by 2 until they become odd.

## Common Mistakes

1. **Not transforming odd numbers first**: Some candidates try to work with the original numbers, but this misses the key insight that we should first bring all numbers to their maximum values so we only need to consider decreasing operations.

2. **Using a min-heap instead of max-heap**: The greedy approach requires always reducing the current maximum, so we need quick access to the largest element. A min-heap would give us the smallest element instead.

3. **Forgetting to update the minimum**: When we reduce the maximum, the minimum might change (if the reduced value becomes smaller than the current minimum). Failing to track this leads to incorrect deviation calculations.

4. **Infinite loop with even numbers**: Without the check for odd numbers (`if maxVal % 2 == 1`), the algorithm could get stuck dividing even numbers that become even again (like powers of 2).

## When You'll See This Pattern

This greedy + heap pattern appears in several optimization problems:

1. **Minimum Difference Between Largest and Smallest Value in Three Moves (LeetCode 1509)**: Similar concept of minimizing range with limited operations, though with different constraints.

2. **Sliding Window Maximum (LeetCode 239)**: Uses a heap (or deque) to track extreme values while maintaining a window.

3. **Find Median from Data Stream (LeetCode 295)**: Uses two heaps to efficiently track median while processing a stream.

The core pattern is: when you need to repeatedly find and modify extreme values (min/max) while maintaining other constraints, a priority queue is often the right tool.

## Key Takeaways

1. **Transform the problem space**: When operations have directionality (like only decreasing even numbers), transform all elements to one "direction" to simplify reasoning.

2. **Greedy with heap for extreme values**: When you need to repeatedly access and modify the current maximum or minimum, a priority queue provides O(log n) operations for both access and update.

3. **Track both extremes**: In range minimization problems, you often need to track both the current maximum and minimum, updating them as elements change.

[Practice this problem on CodeJeet](/problem/minimize-deviation-in-array)
