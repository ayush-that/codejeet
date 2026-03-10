---
title: "How to Solve Maximum Product After K Increments — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product After K Increments. Medium difficulty, 43.2% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue)."
date: "2028-10-08"
category: "dsa-patterns"
tags: ["maximum-product-after-k-increments", "array", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Maximum Product After K Increments

You're given an array of non-negative integers and `k` operations where each operation increments any element by 1. Your goal is to maximize the product of all array elements after at most `k` operations. The challenge is that the product grows much faster when you add to smaller numbers rather than larger ones, but figuring out exactly how to distribute the increments efficiently is non-trivial.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3]`, `k = 4`.

**Initial state:** Product = 1 × 2 × 3 = 6

**Key insight:** To maximize the product, we should always increment the smallest number. Why? Because adding 1 to a smaller number gives us a larger percentage increase in the product than adding to a larger number.

Let's verify this intuition step by step:

1. **Operation 1:** Smallest is 1 → increment to 2  
   Array: [2, 2, 3]  
   Product: 2 × 2 × 3 = 12 (doubled from 6!)

2. **Operation 2:** Smallest is 2 (we have two 2's, pick either) → increment to 3  
   Array: [3, 2, 3]  
   Product: 3 × 2 × 3 = 18

3. **Operation 3:** Smallest is 2 → increment to 3  
   Array: [3, 3, 3]  
   Product: 3 × 3 × 3 = 27

4. **Operation 4:** All are 3, pick any → increment to 4  
   Array: [4, 3, 3]  
   Product: 4 × 3 × 3 = 36

**Final product:** 36

What if we had added all 4 increments to the largest number (3)?

- Array: [1, 2, 7]
- Product: 1 × 2 × 7 = 14 (much smaller than 36!)

This confirms our intuition: always increment the smallest element.

## Brute Force Approach

A naive approach would be to simulate all `k` operations one by one:

1. For each of `k` operations:
   - Find the smallest element in the array (O(n) scan)
   - Increment that element by 1
2. Calculate the final product

This approach has O(k × n) time complexity, which is far too slow when `k` can be up to 10⁵ and `n` up to 10⁵ (making it O(10¹⁰) operations).

Even if we try to be clever by sorting once and then adjusting, we run into problems because after each increment, the array is no longer sorted. We could re-sort after each operation, but that's O(k × n log n), which is even worse.

The fundamental issue is that we need a data structure that can efficiently:

1. Always give us the smallest element
2. Allow us to update that element
3. Maintain the order for the next operation

## Optimized Approach

The key insight is that we should **always increment the smallest element**, but we need to do this efficiently. A **min-heap** (priority queue) is perfect for this:

1. **Heapify the array:** Convert the array into a min-heap (O(n) time)
2. **Perform k operations:** For each operation:
   - Pop the smallest element from the heap (O(log n))
   - Increment it by 1
   - Push it back into the heap (O(log n))
3. **Calculate the product:** After all operations, compute the product of all elements

This gives us O(k log n) time complexity, which is much better than the brute force approach.

**Why a min-heap works:**

- After we increment the smallest element and push it back, the heap property ensures the next smallest element rises to the top
- We don't need to scan the entire array or re-sort it
- Each operation is O(log n) instead of O(n)

**Modulo operation:** Since the product can be enormous, we need to return it modulo 10⁹ + 7. We must apply the modulo during multiplication to avoid integer overflow.

## Optimal Solution

Here's the complete implementation using a min-heap:

<div class="code-group">

```python
# Time: O(n + k log n) | Space: O(n)
def maximumProduct(nums, k):
    """
    Maximizes product of array after k increment operations.

    Strategy: Always increment the smallest element to maximize
    the overall product. Use a min-heap for efficient operations.
    """
    import heapq

    MOD = 10**9 + 7

    # Step 1: Convert array to min-heap in O(n) time
    heapq.heapify(nums)

    # Step 2: Perform k operations
    for _ in range(k):
        # Get the smallest element
        smallest = heapq.heappop(nums)
        # Increment it
        smallest += 1
        # Push it back into the heap
        heapq.heappush(nums, smallest)

    # Step 3: Calculate the product modulo MOD
    result = 1
    for num in nums:
        result = (result * num) % MOD

    return result
```

```javascript
// Time: O(n + k log n) | Space: O(n)
function maximumProduct(nums, k) {
  /**
   * Maximizes product of array after k increment operations.
   *
   * Strategy: Always increment the smallest element to maximize
   * the overall product. Use a min-heap for efficient operations.
   */
  const MOD = 1_000_000_007;

  // Step 1: Convert array to min-heap
  // JavaScript doesn't have a built-in heap, so we implement one
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    buildHeap(arr) {
      this.heap = [...arr];
      for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
        this.heapifyDown(i);
      }
    }

    heapifyDown(i) {
      const n = this.heap.length;
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < n && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }

      if (smallest !== i) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        this.heapifyDown(smallest);
      }
    }

    heapifyUp(i) {
      while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if (this.heap[i] >= this.heap[parent]) break;
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      }
    }

    push(val) {
      this.heap.push(val);
      this.heapifyUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown(0);
      return min;
    }

    peek() {
      return this.heap[0];
    }
  }

  const heap = new MinHeap();
  heap.buildHeap(nums);

  // Step 2: Perform k operations
  for (let i = 0; i < k; i++) {
    const smallest = heap.pop();
    heap.push(smallest + 1);
  }

  // Step 3: Calculate the product modulo MOD
  let result = 1;
  for (const num of heap.heap) {
    result = (result * num) % MOD;
  }

  return result;
}
```

```java
// Time: O(n + k log n) | Space: O(n)
import java.util.PriorityQueue;

class Solution {
    public int maximumProduct(int[] nums, int k) {
        /**
         * Maximizes product of array after k increment operations.
         *
         * Strategy: Always increment the smallest element to maximize
         * the overall product. Use a min-heap for efficient operations.
         */
        final int MOD = 1_000_000_007;

        // Step 1: Create a min-heap (PriorityQueue in Java is a min-heap by default)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
        }

        // Step 2: Perform k operations
        for (int i = 0; i < k; i++) {
            // Get the smallest element
            int smallest = minHeap.poll();
            // Increment it
            smallest++;
            // Push it back into the heap
            minHeap.offer(smallest);
        }

        // Step 3: Calculate the product modulo MOD
        long result = 1; // Use long to avoid overflow during multiplication
        while (!minHeap.isEmpty()) {
            result = (result * minHeap.poll()) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + k log n)

- **Heap construction:** O(n) using heapify
- **k operations:** Each operation involves one pop and one push, both O(log n), so O(k log n) total
- **Product calculation:** O(n) to multiply all elements

**Space Complexity:** O(n)

- The heap stores all n elements
- In Python/Java, the heap modifies the input array in-place, but we still need O(n) space for the heap structure
- In JavaScript, we create a new heap array, so O(n) space

## Common Mistakes

1. **Not using modulo during multiplication:** If you calculate the entire product first and then apply modulo, you'll get integer overflow even with 64-bit integers for large arrays. Always apply modulo during each multiplication step.

2. **Using a max-heap instead of min-heap:** It's easy to get confused and think we should increment the largest element. Remember: to maximize product, we want all numbers to be as close to equal as possible, which means bringing up the smallest ones.

3. **Inefficient smallest element finding:** Some candidates try to sort the array once and then use a pointer, but after incrementing an element, the array is no longer sorted. You'd need to find where to insert it, which is O(n) per operation.

4. **Forgetting about k=0 edge case:** When k=0, we should just return the product of the original array. The heap solution handles this correctly, but some implementations might have off-by-one errors.

## When You'll See This Pattern

This "always pick the smallest/largest element" pattern with a heap appears in many optimization problems:

1. **Minimum Cost to Connect Sticks (LeetCode 1167):** Always connect the two shortest sticks to minimize cost, using a min-heap.

2. **Last Stone Weight (LeetCode 1046):** Always smash the two heaviest stones together, using a max-heap.

3. **Kth Largest Element in a Stream (LeetCode 703):** Maintain the k largest elements using a min-heap.

The pattern is: when you need to repeatedly access and update extreme elements (min or max) from a collection, a heap is usually the right choice.

## Key Takeaways

1. **Greedy with heap:** When you need to repeatedly operate on the minimum or maximum element, a heap provides O(log n) access and update times, making it far more efficient than sorting or scanning.

2. **Product maximization principle:** To maximize the product of numbers with a fixed sum of increments, make the numbers as equal as possible. This means always incrementing the smallest element.

3. **Modulo arithmetic:** When dealing with large products, apply modulo at each multiplication step to prevent overflow, not just at the end.

**Related problems:** [Minimum Size Subarray Sum](/problem/minimum-size-subarray-sum), [Minimum Increment to Make Array Unique](/problem/minimum-increment-to-make-array-unique), [Minimum Operations to Make the Array Increasing](/problem/minimum-operations-to-make-the-array-increasing)
