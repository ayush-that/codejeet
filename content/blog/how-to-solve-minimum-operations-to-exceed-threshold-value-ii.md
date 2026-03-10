---
title: "How to Solve Minimum Operations to Exceed Threshold Value II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Exceed Threshold Value II. Medium difficulty, 45.8% acceptance rate. Topics: Array, Heap (Priority Queue), Simulation."
date: "2026-02-23"
category: "dsa-patterns"
tags:
  [
    "minimum-operations-to-exceed-threshold-value-ii",
    "array",
    "heap-(priority-queue)",
    "simulation",
    "medium",
  ]
---

# How to Solve Minimum Operations to Exceed Threshold Value II

This problem asks us to repeatedly combine the two smallest numbers in an array using a specific formula until all numbers exceed a threshold `k`. The challenge lies in efficiently finding and updating the smallest elements—a classic sign we need a priority queue. What makes this interesting is that the operation `(min(x, y) * 2 + max(x, y))` always produces a result larger than both inputs, but we need to track how many operations it takes to lift _all_ numbers above the threshold.

## Visual Walkthrough

Let's trace through `nums = [2, 5, 3, 1]` with `k = 6`:

**Initial state:** `[1, 2, 3, 5]` (sorted for clarity)

**Operation 1:** Pick smallest two: `1` and `2`

- Calculate: `min(1,2)*2 + max(1,2) = 1*2 + 2 = 4`
- Remove 1 and 2, insert 4
- New array: `[3, 4, 5]`
- All values > 6? No (3 < 6, 4 < 6, 5 < 6)

**Operation 2:** Pick smallest two: `3` and `4`

- Calculate: `min(3,4)*2 + max(3,4) = 3*2 + 4 = 10`
- Remove 3 and 4, insert 10
- New array: `[5, 10]`
- All values > 6? No (5 < 6)

**Operation 3:** Pick smallest two: `5` and `10`

- Calculate: `min(5,10)*2 + max(5,10) = 5*2 + 10 = 20`
- Remove 5 and 10, insert 20
- New array: `[20]`
- All values > 6? Yes (20 > 6)

**Total operations:** 3

Notice how we always need to combine the two smallest numbers because larger numbers might already exceed the threshold, and combining small numbers gives us the fastest growth toward our goal.

## Brute Force Approach

A naive approach would repeatedly sort the array, take the first two elements, combine them, and insert the result:

1. Sort the array in ascending order
2. While the smallest element is ≤ k:
   - Take the first two elements
   - Calculate the new value
   - Remove them from the array
   - Insert the new value while maintaining sorted order
   - Increment operation count
3. Return the count

The problem with this approach is efficiency. Each operation requires:

- Sorting: O(n log n) initially
- Removing first two elements: O(n) due to shifting
- Inserting new value: O(n) to find position and shift
- Total: O(n²) operations in worst case

This becomes too slow for constraints where n can be up to 10⁵.

## Optimized Approach

The key insight is that we constantly need the **two smallest elements**. This screams "priority queue" (min-heap). A min-heap gives us:

- O(1) access to the smallest element
- O(log n) removal of the smallest element
- O(log n) insertion of new elements

**Algorithm:**

1. Build a min-heap from all elements
2. Initialize operation count = 0
3. While heap has at least 2 elements AND the smallest element ≤ k:
   - Extract the smallest element (x)
   - Extract the next smallest (y)
   - Calculate new value = min(x,y)\*2 + max(x,y)
   - Insert new value back into heap
   - Increment operation count
4. If heap still has one element ≤ k, we can't perform more operations (need 2 elements)
5. Return operation count

**Why this works:** By always combining the two smallest numbers, we maximize the growth rate of the smallest remaining element. If the smallest exceeds k, all others do too since we only ever increase values.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) - each heap operation is O(log n), we perform up to n operations
# Space: O(n) - for the heap
import heapq

def minOperations(nums, k):
    """
    Calculate minimum operations to make all numbers > k.

    Args:
        nums: List of integers
        k: Threshold value

    Returns:
        Number of operations required
    """
    # Step 1: Build a min-heap from the input array
    # heapq.heapify transforms list in-place to a heap in O(n) time
    heapq.heapify(nums)

    operations = 0

    # Step 2: Continue while we have at least 2 elements and smallest ≤ k
    # We need at least 2 elements to perform an operation
    while len(nums) > 1 and nums[0] <= k:
        # Extract the two smallest elements
        # heapq.heappop removes and returns smallest element in O(log n)
        x = heapq.heappop(nums)  # Smallest
        y = heapq.heappop(nums)  # Second smallest

        # Calculate new value using given formula
        # Note: x ≤ y since we popped from min-heap
        new_val = x * 2 + y

        # Insert the new value back into the heap
        heapq.heappush(nums, new_val)

        # Count this operation
        operations += 1

    # Step 3: Edge case - if single element still ≤ k, we can't fix it
    # Need at least 2 elements to perform an operation
    if nums and nums[0] <= k:
        # This means we have 1 element ≤ k but can't perform more operations
        # Problem guarantees solution exists, so this shouldn't happen
        pass

    return operations
```

```javascript
// Time: O(n log n) - each heap operation is O(log n), we perform up to n operations
// Space: O(n) - for the heap

/**
 * Calculate minimum operations to make all numbers > k.
 * @param {number[]} nums - Array of integers
 * @param {number} k - Threshold value
 * @return {number} - Number of operations required
 */
function minOperations(nums, k) {
  // Step 1: Build a min-heap from the input array
  // JavaScript doesn't have built-in heap, so we implement one
  class MinHeap {
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

    // Remove and return smallest element
    pop() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown(0);
      return min;
    }

    // Add new element to heap
    push(val) {
      this.heap.push(val);
      this.heapifyUp(this.heap.length - 1);
    }

    // Get smallest element without removing it
    peek() {
      return this.heap.length > 0 ? this.heap[0] : null;
    }

    // Get current size
    size() {
      return this.heap.length;
    }

    // Restore heap property from index i downward
    heapifyDown(i) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }

      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }

      if (smallest !== i) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        this.heapifyDown(smallest);
      }
    }

    // Restore heap property from index i upward
    heapifyUp(i) {
      let parent = Math.floor((i - 1) / 2);
      while (i > 0 && this.heap[i] < this.heap[parent]) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
        parent = Math.floor((i - 1) / 2);
      }
    }
  }

  // Create and build heap
  const heap = new MinHeap();
  heap.buildHeap(nums);

  let operations = 0;

  // Step 2: Continue while we have at least 2 elements and smallest ≤ k
  while (heap.size() > 1 && heap.peek() <= k) {
    // Extract the two smallest elements
    const x = heap.pop(); // Smallest
    const y = heap.pop(); // Second smallest

    // Calculate new value using given formula
    // Since x came from min-heap, x ≤ y
    const newVal = x * 2 + y;

    // Insert the new value back into the heap
    heap.push(newVal);

    // Count this operation
    operations++;
  }

  // Step 3: Edge case - if single element still ≤ k, we can't fix it
  // Problem guarantees solution exists, so this shouldn't happen

  return operations;
}
```

```java
// Time: O(n log n) - each heap operation is O(log n), we perform up to n operations
// Space: O(n) - for the heap
import java.util.PriorityQueue;

class Solution {
    /**
     * Calculate minimum operations to make all numbers > k.
     *
     * @param nums Array of integers
     * @param k Threshold value
     * @return Number of operations required
     */
    public int minOperations(int[] nums, int k) {
        // Step 1: Build a min-heap from the input array
        // PriorityQueue in Java is a min-heap by default
        PriorityQueue<Long> minHeap = new PriorityQueue<>();

        // Add all elements to the heap
        // Using Long to prevent integer overflow during calculations
        for (int num : nums) {
            minHeap.offer((long) num);
        }

        int operations = 0;

        // Step 2: Continue while we have at least 2 elements and smallest ≤ k
        // We need at least 2 elements to perform an operation
        while (minHeap.size() > 1 && minHeap.peek() <= k) {
            // Extract the two smallest elements
            // poll() removes and returns smallest element in O(log n)
            long x = minHeap.poll();  // Smallest
            long y = minHeap.poll();  // Second smallest

            // Calculate new value using given formula
            // Since x came from min-heap, x ≤ y
            long newVal = x * 2 + y;

            // Insert the new value back into the heap
            minHeap.offer(newVal);

            // Count this operation
            operations++;
        }

        // Step 3: Edge case - if single element still ≤ k, we can't fix it
        // Problem guarantees solution exists, so this shouldn't happen

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Building the heap: O(n) using heapify
- Each operation: O(log n) for two pops and one push
- Maximum operations: n-1 (worst case when we combine all elements)
- Total: O(n + n log n) = O(n log n)

**Space Complexity:** O(n)

- The heap stores all n elements
- Additional space for variables is O(1)

## Common Mistakes

1. **Using sorting instead of a heap:** Some candidates sort the array and try to maintain sorted order after each operation. This leads to O(n²) time complexity due to repeated shifting of array elements.

2. **Incorrect loop condition:** Forgetting to check `heap.size() > 1` before popping two elements can cause errors when only one element remains. Also, checking if the _largest_ element is ≤ k instead of the smallest is wrong—we stop when the smallest exceeds k.

3. **Integer overflow:** When numbers get large (up to 10⁹), the calculation `x * 2 + y` can overflow 32-bit integers. Use 64-bit integers (long in Java/C++, long long in C).

4. **Assuming we can always finish:** The problem guarantees a solution exists, but in interviews, you should mention what happens if we end with one element ≤ k (can't perform more operations since we need two numbers).

## When You'll See This Pattern

This "always combine smallest elements" pattern appears in several optimization problems:

1. **Minimum Cost to Connect Sticks (LeetCode 1167):** Connect sticks with minimum cost, always combining the two shortest sticks. Same heap-based approach.

2. **Merge k Sorted Lists (LeetCode 23):** Always take the smallest element from among k lists. Uses a heap to track the smallest elements.

3. **Kth Largest Element in a Stream (LeetCode 703):** Maintain k largest elements using a min-heap to always have quick access to the k-th largest.

The pattern is: when you need to repeatedly access/remove the smallest (or largest) elements and insert new ones, a heap is usually the right choice.

## Key Takeaways

1. **Recognize heap problems:** When a problem requires repeatedly finding/removing minimum or maximum elements, think "priority queue." The keywords "smallest," "largest," "minimum," "maximum" in the context of repeated operations are strong hints.

2. **Understand heap operations:** Know that heap insertion and extraction are O(log n), while getting the min/max is O(1). This makes heaps perfect for problems where you need to maintain a dynamic collection with efficient min/max access.

3. **Simulation with optimal strategy:** Some problems require simulating a process with an optimal strategy (like always combining smallest elements). Prove to yourself why the greedy approach works before coding.

Related problems: [Minimum Operations to Halve Array Sum](/problem/minimum-operations-to-halve-array-sum)
