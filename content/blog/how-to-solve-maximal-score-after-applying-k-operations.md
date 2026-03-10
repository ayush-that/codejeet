---
title: "How to Solve Maximal Score After Applying K Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximal Score After Applying K Operations. Medium difficulty, 64.0% acceptance rate. Topics: Array, Greedy, Heap (Priority Queue)."
date: "2026-07-06"
category: "dsa-patterns"
tags:
  [
    "maximal-score-after-applying-k-operations",
    "array",
    "greedy",
    "heap-(priority-queue)",
    "medium",
  ]
---

# How to Solve Maximal Score After Applying K Operations

You're given an array of integers and need to perform exactly `k` operations, where each operation involves taking the current maximum value, adding it to your score, and then replacing it with its ceiling division by 3. The challenge is that after each operation, the maximum value changes, so you need to efficiently track and update the current maximum across all operations.

What makes this problem interesting is that it appears simple at first glance—just repeatedly take the maximum—but the optimal solution requires understanding that a max-heap (or priority queue) is essential for efficiency. Without it, repeatedly scanning for the maximum would be too slow for large inputs.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `nums = [10, 20, 7, 5]` with `k = 3`.

**Initial state:** Score = 0, nums = [10, 20, 7, 5]

**Operation 1:**

- Current maximum = 20 (at index 1)
- Add 20 to score: Score = 0 + 20 = 20
- Replace 20 with ceil(20/3) = ceil(6.666...) = 7
- New nums = [10, 7, 7, 5]

**Operation 2:**

- Current maximum = 10 (at index 0) — note we have a tie between 10 and two 7s, but 10 is larger
- Add 10 to score: Score = 20 + 10 = 30
- Replace 10 with ceil(10/3) = ceil(3.333...) = 4
- New nums = [4, 7, 7, 5]

**Operation 3:**

- Current maximum = 7 (at index 1 or 2)
- Add 7 to score: Score = 30 + 7 = 37
- Replace 7 with ceil(7/3) = ceil(2.333...) = 3
- New nums = [4, 3, 7, 5] or [4, 7, 3, 5] depending on which 7 we chose

**Final score:** 37

The key observation: We always want to pick the current maximum because it gives us the largest immediate gain. Even though dividing by 3 reduces future potential, no other choice could give us a better total score since we're maximizing each individual operation.

## Brute Force Approach

A naive approach would be to scan the array for the maximum element in each of the `k` operations:

1. For each of `k` operations:
   - Scan the entire array to find the maximum value and its index
   - Add this maximum to the total score
   - Update that element with its ceiling division by 3

The code would look something like this:

<div class="code-group">

```python
# Time: O(k * n) | Space: O(1)
def maxKelementsBruteForce(nums, k):
    total_score = 0

    for _ in range(k):
        # Find maximum value and its index
        max_val = float('-inf')
        max_idx = -1

        for i in range(len(nums)):
            if nums[i] > max_val:
                max_val = nums[i]
                max_idx = i

        # Add to score
        total_score += max_val

        # Update the value
        nums[max_idx] = (max_val + 2) // 3  # Ceiling division by 3

    return total_score
```

```javascript
// Time: O(k * n) | Space: O(1)
function maxKelementsBruteForce(nums, k) {
  let totalScore = 0;

  for (let op = 0; op < k; op++) {
    // Find maximum value and its index
    let maxVal = -Infinity;
    let maxIdx = -1;

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > maxVal) {
        maxVal = nums[i];
        maxIdx = i;
      }
    }

    // Add to score
    totalScore += maxVal;

    // Update the value (ceiling division by 3)
    nums[maxIdx] = Math.ceil(maxVal / 3);
  }

  return totalScore;
}
```

```java
// Time: O(k * n) | Space: O(1)
public long maxKelementsBruteForce(int[] nums, int k) {
    long totalScore = 0;

    for (int op = 0; op < k; op++) {
        // Find maximum value and its index
        int maxVal = Integer.MIN_VALUE;
        int maxIdx = -1;

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > maxVal) {
                maxVal = nums[i];
                maxIdx = i;
            }
        }

        // Add to score
        totalScore += maxVal;

        // Update the value (ceiling division by 3)
        nums[maxIdx] = (maxVal + 2) / 3;  // Ceiling division by 3
    }

    return totalScore;
}
```

</div>

**Why this is insufficient:** With `n` elements and `k` operations, this approach takes O(k × n) time. In the worst case where `k` and `n` can be up to 10⁵ (as per typical constraints), this becomes 10¹⁰ operations—far too slow. We need a way to find and update the maximum faster than O(n) per operation.

## Optimized Approach

The key insight is that we need a data structure that supports:

1. Quickly finding the maximum element
2. Efficiently removing/replacing that maximum
3. Inserting the new value after division

A **max-heap** (or priority queue) is perfect for this. In most languages, priority queues are implemented as min-heaps by default, so we can store negative values or use a custom comparator to simulate a max-heap.

**Step-by-step reasoning:**

1. Build a max-heap from all elements in `nums`
2. For `k` operations:
   - Extract the maximum element from the heap (O(log n) time)
   - Add it to the total score
   - Calculate its ceiling division by 3
   - Insert the new value back into the heap (O(log n) time)
3. Return the total score

**Why this works:** The greedy approach of always taking the current maximum is optimal because:

- Each operation is independent—we must perform exactly `k` operations
- Taking a smaller value now doesn't make a larger value available later (values only decrease)
- Therefore, maximizing each individual operation maximizes the total sum

The heap reduces each operation from O(n) to O(log n), making the solution efficient enough for the constraints.

## Optimal Solution

Here's the complete implementation using a max-heap:

<div class="code-group">

```python
# Time: O(n + k log n) | Space: O(n)
import heapq

def maxKelements(nums, k):
    """
    Calculate the maximum score after applying k operations.

    Args:
        nums: List of integers
        k: Number of operations to perform

    Returns:
        Maximum possible score
    """
    # Convert to max-heap by storing negative values
    # Python's heapq is a min-heap by default
    max_heap = [-num for num in nums]
    heapq.heapify(max_heap)  # O(n) heap construction

    total_score = 0

    # Perform k operations
    for _ in range(k):
        # Get the current maximum (negated back to positive)
        current_max = -heapq.heappop(max_heap)  # O(log n)

        # Add to total score
        total_score += current_max

        # Calculate ceil(current_max / 3)
        # Using (current_max + 2) // 3 for integer ceiling division
        new_value = (current_max + 2) // 3

        # Push the new value back into the heap (negated for max-heap)
        heapq.heappush(max_heap, -new_value)  # O(log n)

    return total_score
```

```javascript
// Time: O(n + k log n) | Space: O(n)
function maxKelements(nums, k) {
  /**
   * Calculate the maximum score after applying k operations.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Number of operations to perform
   * @return {number} Maximum possible score
   */

  // Create a max-heap using a min-heap with negative values
  const maxHeap = new MaxPriorityQueue();

  // Add all elements to the heap - O(n log n) construction
  // (Can be optimized to O(n) with heapify, but JavaScript doesn't have built-in heapify)
  for (const num of nums) {
    maxHeap.enqueue(num);
  }

  let totalScore = 0;

  // Perform k operations
  for (let i = 0; i < k; i++) {
    // Get the current maximum
    const currentMax = maxHeap.dequeue().element;

    // Add to total score
    totalScore += currentMax;

    // Calculate ceil(currentMax / 3)
    const newValue = Math.ceil(currentMax / 3);

    // Push the new value back into the heap
    maxHeap.enqueue(newValue);
  }

  return totalScore;
}

// Alternative implementation using array as heap for environments without PriorityQueue
function maxKelementsAlt(nums, k) {
  // Build max-heap manually
  const heap = [...nums];

  // Heapify function
  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }

  // Build heap
  const n = heap.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(heap, n, i);
  }

  let totalScore = 0;

  // Extract max k times
  let heapSize = n;
  for (let i = 0; i < k; i++) {
    // Max is at root (index 0)
    const currentMax = heap[0];
    totalScore += currentMax;

    // Replace with new value
    const newValue = Math.ceil(currentMax / 3);
    heap[0] = newValue;

    // Restore heap property
    heapify(heap, heapSize, 0);
  }

  return totalScore;
}
```

```java
// Time: O(n + k log n) | Space: O(n)
import java.util.Collections;
import java.util.PriorityQueue;

class Solution {
    public long maxKelements(int[] nums, int k) {
        /**
         * Calculate the maximum score after applying k operations.
         *
         * @param nums Array of integers
         * @param k Number of operations to perform
         * @return Maximum possible score
         */

        // Create a max-heap (priority queue with reverse order)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        // Add all elements to the heap - O(n log n) for n insertions
        // (Can be optimized with heapify-like construction if needed)
        for (int num : nums) {
            maxHeap.offer(num);
        }

        long totalScore = 0;  // Use long to avoid integer overflow

        // Perform k operations
        for (int i = 0; i < k; i++) {
            // Get the current maximum
            int currentMax = maxHeap.poll();

            // Add to total score
            totalScore += currentMax;

            // Calculate ceil(currentMax / 3)
            // Using (currentMax + 2) / 3 for integer ceiling division
            int newValue = (currentMax + 2) / 3;

            // Push the new value back into the heap
            maxHeap.offer(newValue);
        }

        return totalScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + k log n)

- **Heap construction:** O(n) when using heapify (Python), O(n log n) when inserting n elements one by one (Java/JavaScript without heapify)
- **k operations:** Each operation involves extracting max (O(log n)) and inserting new value (O(log n)), so O(k log n) total
- **Overall:** Dominated by O(k log n) for large k

**Space Complexity:** O(n)

- We store all n elements in the heap
- Additional O(1) space for variables

## Common Mistakes

1. **Using array scanning instead of a heap:** The most common mistake is implementing the brute force O(k × n) solution. Always ask yourself: "Can I find the maximum faster than O(n)?" If you need repeated maximum extractions with updates, think "heap."

2. **Forgetting about integer overflow:** The total score can exceed 32-bit integer limits (imagine k=10⁵ with all values=10⁹). Use 64-bit integers (long in Java/C++, long long in C, BigInt in JavaScript if needed).

3. **Incorrect ceiling division:** Writing `(x + 2) // 3` in Python or `(x + 2) / 3` in Java gives the ceiling of x/3. A common error is using regular division and ceil(), which works but might be less efficient or have floating-point issues.

4. **Not handling the max-heap properly:** In Python, forgetting to negate values for max-heap. In Java, forgetting `Collections.reverseOrder()`. In JavaScript, not implementing the heap correctly or using a library incorrectly.

## When You'll See This Pattern

This "repeatedly extract maximum/minimum with updates" pattern appears in several problems:

1. **Remove Stones to Minimize the Total (LeetCode 1962):** Similar structure—repeatedly take the maximum, halve it, and put it back. The exact same heap approach works.

2. **Maximum Average Pass Ratio (LeetCode 1792):** Another greedy heap problem where you repeatedly apply an operation to the element that gives the maximum improvement.

3. **IPO (LeetCode 502):** Uses two heaps—one for available projects (max-heap by profit) and one for unavailable projects (min-heap by capital).

The pattern to recognize: When you need to repeatedly apply an operation to the current extreme value (max or min), and that operation changes the value, a heap is usually the right tool.

## Key Takeaways

1. **Greedy + Heap is powerful:** When you need to repeatedly take the maximum/minimum element, perform an operation on it, and reinsert it, a priority queue (heap) is the optimal data structure.

2. **Recognize the pattern:** If a problem involves "k operations" where each operation selects based on some priority (like largest value), think about whether a heap can optimize the selection process from O(n) to O(log n).

3. **Watch for overflow:** When performing many additions (especially with large k), always consider whether you need 64-bit integers to avoid overflow.

Related problems: [Sliding Window Maximum](/problem/sliding-window-maximum), [Remove Stones to Minimize the Total](/problem/remove-stones-to-minimize-the-total)
