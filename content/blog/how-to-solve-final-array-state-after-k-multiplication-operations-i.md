---
title: "How to Solve Final Array State After K Multiplication Operations I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Final Array State After K Multiplication Operations I. Easy difficulty, 86.9% acceptance rate. Topics: Array, Math, Heap (Priority Queue), Simulation."
date: "2028-09-26"
category: "dsa-patterns"
tags:
  [
    "final-array-state-after-k-multiplication-operations-i",
    "array",
    "math",
    "heap-(priority-queue)",
    "easy",
  ]
---

# How to Solve Final Array State After K Multiplication Operations I

This problem asks us to repeatedly find the smallest element in an array, multiply it by a given multiplier, and repeat this process `k` times. The twist is that when there are ties for the minimum value, we must select the first occurrence (the one with the smallest index). While the problem is labeled "Easy," it teaches important concepts about efficiently tracking minimum values and handling ties.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [3, 1, 2]`, `k = 3`, and `multiplier = 2`.

**Initial state:** `[3, 1, 2]`

**Operation 1:**

- Find the minimum value: `1` at index 1
- Multiply it by 2: `1 * 2 = 2`
- Update the array: `[3, 2, 2]`

**Operation 2:**

- Find the minimum value: We have two `2`s at indices 1 and 2
- Select the first occurrence: index 1
- Multiply it by 2: `2 * 2 = 4`
- Update the array: `[3, 4, 2]`

**Operation 3:**

- Find the minimum value: `2` at index 2
- Multiply it by 2: `2 * 2 = 4`
- Update the array: `[3, 4, 4]`

**Final result:** `[3, 4, 4]`

The key insight is that we need to repeatedly find and update the smallest element, but we must respect the "first occurrence" rule when there are ties.

## Brute Force Approach

A naive approach would be to simply simulate all `k` operations directly:

1. For each of the `k` operations:
   - Scan through the array to find the minimum value and its first occurrence
   - Multiply that element by the multiplier
   - Update the array

This approach is straightforward but inefficient. For each of the `k` operations, we scan through all `n` elements to find the minimum, resulting in O(k × n) time complexity. When `k` and `n` are both large (up to 1000 in this problem), this could mean up to 1,000,000 operations, which is acceptable but not optimal.

However, there's an even more naive approach some candidates might try: sorting the array. This fails because:

1. Sorting destroys the original order, making it impossible to identify the "first occurrence" of ties
2. After updating an element, the array is no longer sorted, so we'd need to re-sort after each operation

Let's see the brute force code:

<div class="code-group">

```python
# Time: O(k * n) | Space: O(1)
def brute_force(nums, k, multiplier):
    """
    Brute force approach: repeatedly scan for minimum
    """
    for _ in range(k):
        min_val = float('inf')
        min_idx = -1

        # Find the minimum value and its first occurrence
        for i in range(len(nums)):
            if nums[i] < min_val:
                min_val = nums[i]
                min_idx = i

        # Update the minimum element
        nums[min_idx] *= multiplier

    return nums
```

```javascript
// Time: O(k * n) | Space: O(1)
function bruteForce(nums, k, multiplier) {
  // Brute force approach: repeatedly scan for minimum
  for (let op = 0; op < k; op++) {
    let minVal = Infinity;
    let minIdx = -1;

    // Find the minimum value and its first occurrence
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < minVal) {
        minVal = nums[i];
        minIdx = i;
      }
    }

    // Update the minimum element
    nums[minIdx] *= multiplier;
  }

  return nums;
}
```

```java
// Time: O(k * n) | Space: O(1)
public int[] bruteForce(int[] nums, int k, int multiplier) {
    // Brute force approach: repeatedly scan for minimum
    for (int op = 0; op < k; op++) {
        int minVal = Integer.MAX_VALUE;
        int minIdx = -1;

        // Find the minimum value and its first occurrence
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < minVal) {
                minVal = nums[i];
                minIdx = i;
            }
        }

        // Update the minimum element
        nums[minIdx] *= multiplier;
    }

    return nums;
}
```

</div>

## Optimal Solution

The optimal approach uses a min-heap (priority queue) to efficiently find the minimum element. However, we need to handle the "first occurrence" requirement. We can store tuples in the heap with the format `(value, index)` so that when values are equal, Python/Java/JavaScript's heap/priority queue will use the second element (index) as a tie-breaker, giving us the smallest index for equal values.

Here's the step-by-step reasoning:

1. Create a min-heap containing `(value, index)` pairs for all elements
2. For `k` operations:
   - Pop the smallest element from the heap (this gives us both value and index)
   - Multiply the value by the multiplier
   - Push the new `(value * multiplier, index)` back into the heap
3. Reconstruct the final array from the heap contents

The heap approach reduces the time complexity from O(k × n) to O((n + k) log n), which is much more efficient for larger inputs.

<div class="code-group">

```python
# Time: O((n + k) log n) | Space: O(n)
def getFinalState(nums, k, multiplier):
    """
    Optimal solution using a min-heap to efficiently find minimum elements.

    Args:
        nums: List of integers
        k: Number of operations to perform
        multiplier: Value to multiply minimum by

    Returns:
        Final state of nums after k operations
    """
    import heapq

    # Step 1: Create a min-heap of (value, index) pairs
    # Python's heapq maintains a min-heap, and tuples are compared
    # element by element, so (value, index) ensures that when values
    # are equal, the smaller index comes first
    heap = [(value, idx) for idx, value in enumerate(nums)]
    heapq.heapify(heap)  # Transform list into a heap in O(n) time

    # Step 2: Perform k operations
    for _ in range(k):
        # Pop the smallest element (value, index) from the heap
        # This gives us the minimum value and its original index
        value, idx = heapq.heappop(heap)

        # Multiply the value by the multiplier
        new_value = value * multiplier

        # Push the updated value back into the heap with the same index
        heapq.heappush(heap, (new_value, idx))

    # Step 3: Reconstruct the final array from the heap
    # The heap contains (value, index) pairs, so we need to
    # extract values and place them at their original indices
    result = [0] * len(nums)
    for value, idx in heap:
        result[idx] = value

    return result
```

```javascript
// Time: O((n + k) log n) | Space: O(n)
function getFinalState(nums, k, multiplier) {
  /**
   * Optimal solution using a min-heap to efficiently find minimum elements.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Number of operations to perform
   * @param {number} multiplier - Value to multiply minimum by
   * @return {number[]} Final state of nums after k operations
   */

  // Step 1: Create a min-heap of [value, index] pairs
  // We'll use an array and maintain heap property manually
  const heap = [];

  // Initialize heap with all elements
  for (let i = 0; i < nums.length; i++) {
    heap.push([nums[i], i]);
  }

  // Build heap in O(n) time
  buildMinHeap(heap);

  // Step 2: Perform k operations
  for (let op = 0; op < k; op++) {
    // Extract the minimum element [value, index] from the heap
    const [value, idx] = extractMin(heap);

    // Multiply the value by the multiplier
    const newValue = value * multiplier;

    // Insert the updated value back into the heap
    insert(heap, [newValue, idx]);
  }

  // Step 3: Reconstruct the final array from the heap
  const result = new Array(nums.length);
  for (const [value, idx] of heap) {
    result[idx] = value;
  }

  return result;
}

// Helper functions for min-heap operations
function buildMinHeap(arr) {
  // Start from the last non-leaf node and heapify each
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, i);
  }
}

function heapify(arr, i) {
  const n = arr.length;
  let smallest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Compare values first, then indices if values are equal
  if (
    left < n &&
    (arr[left][0] < arr[smallest][0] ||
      (arr[left][0] === arr[smallest][0] && arr[left][1] < arr[smallest][1]))
  ) {
    smallest = left;
  }

  if (
    right < n &&
    (arr[right][0] < arr[smallest][0] ||
      (arr[right][0] === arr[smallest][0] && arr[right][1] < arr[smallest][1]))
  ) {
    smallest = right;
  }

  if (smallest !== i) {
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    heapify(arr, smallest);
  }
}

function extractMin(arr) {
  if (arr.length === 0) return null;

  const min = arr[0];
  const last = arr.pop();

  if (arr.length > 0) {
    arr[0] = last;
    heapify(arr, 0);
  }

  return min;
}

function insert(arr, element) {
  arr.push(element);

  // Bubble up the new element
  let i = arr.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);

    // Compare values first, then indices if values are equal
    if (
      arr[i][0] < arr[parent][0] ||
      (arr[i][0] === arr[parent][0] && arr[i][1] < arr[parent][1])
    ) {
      [arr[i], arr[parent]] = [arr[parent], arr[i]];
      i = parent;
    } else {
      break;
    }
  }
}
```

```java
// Time: O((n + k) log n) | Space: O(n)
import java.util.PriorityQueue;

class Solution {
    public int[] getFinalState(int[] nums, int k, int multiplier) {
        /**
         * Optimal solution using a min-heap to efficiently find minimum elements.
         *
         * @param nums Array of integers
         * @param k Number of operations to perform
         * @param multiplier Value to multiply minimum by
         * @return Final state of nums after k operations
         */

        // Step 1: Create a min-heap of pairs (value, index)
        // We use a custom comparator to ensure that when values are equal,
        // the smaller index comes first
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) {
                return Integer.compare(a[0], b[0]);  // Compare values
            }
            return Integer.compare(a[1], b[1]);      // Compare indices if values equal
        });

        // Initialize heap with all elements
        for (int i = 0; i < nums.length; i++) {
            heap.offer(new int[]{nums[i], i});
        }

        // Step 2: Perform k operations
        for (int op = 0; op < k; op++) {
            // Poll the minimum element [value, index] from the heap
            int[] minElement = heap.poll();
            int value = minElement[0];
            int idx = minElement[1];

            // Multiply the value by the multiplier
            int newValue = value * multiplier;

            // Offer the updated value back into the heap
            heap.offer(new int[]{newValue, idx});
        }

        // Step 3: Reconstruct the final array from the heap
        int[] result = new int[nums.length];
        while (!heap.isEmpty()) {
            int[] element = heap.poll();
            int value = element[0];
            int idx = element[1];
            result[idx] = value;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + k) log n)**

- Building the initial heap takes O(n) time
- Each of the k operations involves:
  - Extracting the minimum: O(log n)
  - Inserting the updated value: O(log n)
- Reconstructing the array from the heap takes O(n log n) if we extract all elements, but we can optimize this

**Space Complexity: O(n)**

- We need to store the heap which contains n elements
- Each element is a tuple (value, index), so O(n) additional space

The heap approach is optimal because any solution must at least look at each element once (Ω(n)) and perform k updates. The logarithmic factor comes from efficiently finding the minimum each time.

## Common Mistakes

1. **Forgetting to handle ties correctly**: Some candidates might use a heap that only stores values, losing track of which index each value came from. When there are ties, they won't know which is the "first occurrence." Always store `(value, index)` pairs.

2. **Using sorting instead of a heap**: Sorting the array initially seems tempting, but after each multiplication, the array is no longer sorted. Re-sorting after each operation would be O(k × n log n), which is worse than the brute force approach.

3. **Not updating the heap correctly**: After multiplying the minimum element, you must push the new value back into the heap. Forgetting this means you'll keep processing the same old minimum value.

4. **Assuming the heap maintains array order**: A heap doesn't maintain the original array order. You need to reconstruct the final array by reading values from the heap and placing them at their correct indices.

## When You'll See This Pattern

This pattern of repeatedly finding and updating minimum/maximum elements appears in many problems:

1. **Ugly Number II (LeetCode 264)**: Find the nth ugly number by repeatedly taking the minimum from multiple sequences. Similar to this problem but with three multipliers instead of one.

2. **Merge k Sorted Lists (LeetCode 23)**: Use a min-heap to always get the smallest element from k lists, similar to how we get the smallest element from our array.

3. **Kth Largest Element in a Stream (LeetCode 703)**: Maintain a heap to efficiently find the kth largest element as new elements are added, similar to maintaining a data structure as values change.

The core pattern is: when you need to repeatedly find minimum/maximum elements in a changing collection, a heap/priority queue is usually the right tool.

## Key Takeaways

1. **Heaps excel at repeated min/max operations**: When a problem involves repeatedly finding and updating minimum or maximum values, think "heap" or "priority queue."

2. **Store metadata with heap elements**: When you need additional information (like original indices for tie-breaking), store tuples in the heap rather than just values.

3. **Consider the full lifecycle**: Don't just focus on the operations phase. Remember to properly initialize the heap and reconstruct the final result.

[Practice this problem on CodeJeet](/problem/final-array-state-after-k-multiplication-operations-i)
