---
title: "How to Solve Find Subsequence of Length K With the Largest Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Subsequence of Length K With the Largest Sum. Easy difficulty, 57.4% acceptance rate. Topics: Array, Hash Table, Sorting, Heap (Priority Queue)."
date: "2026-04-20"
category: "dsa-patterns"
tags:
  ["find-subsequence-of-length-k-with-the-largest-sum", "array", "hash-table", "sorting", "easy"]
---

# How to Solve "Find Subsequence of Length K With the Largest Sum"

You need to find a subsequence of length `k` from an array `nums` that has the largest possible sum. The tricky part is that you need to return the actual subsequence elements in their original order, not just the sum. This means you can't simply take the `k` largest numbers—you must preserve their relative positions from the original array.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 1, 5, 2, 4]`, `k = 3`

**Step 1: Identify the k largest elements**
The largest 3 numbers are 5, 4, and 3 (or 5, 4, and 2 if we consider unique positions). But we need to find them in the original order.

**Step 2: Find indices of k largest elements**
We can sort the numbers with their indices to find the largest values:

- Value 5 at index 2
- Value 4 at index 4
- Value 3 at index 0

**Step 3: Sort indices to preserve order**
The indices are [2, 4, 0]. When sorted, they become [0, 2, 4].

**Step 4: Extract values in order**
At index 0: value 3
At index 2: value 5
At index 4: value 4

Result: `[3, 5, 4]` with sum 12

Let's verify: Could we get a better sum by choosing different elements? What about [5, 2, 4]? That's sum 11. [1, 5, 4] is sum 10. Our solution [3, 5, 4] is indeed optimal.

## Brute Force Approach

A naive approach would be to generate all possible subsequences of length `k` and find the one with maximum sum. For an array of length `n`, there are C(n, k) combinations (n choose k), which grows factorially. Even for moderate `n` and `k`, this becomes computationally infeasible.

For example, with `n = 100` and `k = 50`, there are approximately 1.01 × 10²⁹ combinations to check. This approach has time complexity O(C(n, k) × k), which is far too slow for any reasonable constraints.

## Optimal Solution

The key insight is that to maximize the sum, we want the `k` largest elements. However, we must return them in their original order. The solution has three steps:

1. **Identify the k largest elements** with their original indices
2. **Sort the indices** to maintain the original order
3. **Extract the values** at those indices

We can use a min-heap (priority queue) to efficiently find the k largest elements in O(n log k) time, or we can sort in O(n log n) time. Since k ≤ n and n can be up to 1000, both approaches work, but the heap approach is more efficient when k is much smaller than n.

<div class="code-group">

```python
# Time: O(n log k) | Space: O(n)
def maxSubsequence(nums, k):
    """
    Returns a subsequence of length k with the largest sum.

    Approach:
    1. Use a min-heap to find the k largest elements with their indices
    2. Sort the indices to preserve original order
    3. Extract values at those indices

    Args:
        nums: List of integers
        k: Length of subsequence to return

    Returns:
        List of integers forming the subsequence
    """
    import heapq

    # Step 1: Use a min-heap to find k largest elements
    # We store (value, index) pairs in the heap
    # The heap is a min-heap, so we keep only k largest elements
    heap = []

    for i, num in enumerate(nums):
        # Push current element to heap
        heapq.heappush(heap, (num, i))

        # If heap exceeds size k, remove the smallest element
        # This ensures we keep only the k largest elements
        if len(heap) > k:
            heapq.heappop(heap)

    # Step 2: Extract indices from heap and sort them
    # The heap contains the k largest elements, but not in order
    # We need to sort indices to maintain original sequence order
    indices = [index for _, index in heap]
    indices.sort()  # Sort indices to preserve original order

    # Step 3: Build result by getting values at sorted indices
    result = [nums[i] for i in indices]

    return result
```

```javascript
// Time: O(n log k) | Space: O(n)
function maxSubsequence(nums, k) {
  /**
   * Returns a subsequence of length k with the largest sum.
   *
   * Approach:
   * 1. Use a min-heap to find the k largest elements with their indices
   * 2. Sort the indices to preserve original order
   * 3. Extract values at those indices
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Length of subsequence to return
   * @return {number[]} - Subsequence with largest sum
   */

  // Step 1: Create a min-heap using a priority queue
  // We'll use an array and sort it as a simple heap implementation
  // In interviews, you might implement a proper heap class
  const heap = [];

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Add current element to heap
    heap.push([num, i]);

    // Sort heap to maintain min-heap property (smallest first)
    heap.sort((a, b) => a[0] - b[0]);

    // If heap exceeds size k, remove smallest element
    // This keeps only the k largest elements
    if (heap.length > k) {
      heap.shift(); // Remove smallest (first element after sorting)
    }
  }

  // Step 2: Extract indices and sort them
  // Map heap to get just the indices, then sort
  const indices = heap.map((item) => item[1]);
  indices.sort((a, b) => a - b); // Sort indices ascending

  // Step 3: Build result from sorted indices
  const result = indices.map((index) => nums[index]);

  return result;
}
```

```java
// Time: O(n log k) | Space: O(n)
import java.util.*;

class Solution {
    public int[] maxSubsequence(int[] nums, int k) {
        /**
         * Returns a subsequence of length k with the largest sum.
         *
         * Approach:
         * 1. Use a min-heap to find the k largest elements with their indices
         * 2. Sort the indices to preserve original order
         * 3. Extract values at those indices
         *
         * @param nums - Array of integers
         * @param k - Length of subsequence to return
         * @return - Subsequence with largest sum
         */

        // Step 1: Use a min-heap to find k largest elements
        // PriorityQueue with comparator to sort by value (min-heap)
        PriorityQueue<int[]> heap = new PriorityQueue<>(
            (a, b) -> Integer.compare(a[0], b[0])
        );

        for (int i = 0; i < nums.length; i++) {
            // Add current element as [value, index] pair
            heap.offer(new int[]{nums[i], i});

            // If heap exceeds size k, remove smallest element
            // This ensures we keep only k largest elements
            if (heap.size() > k) {
                heap.poll();
            }
        }

        // Step 2: Extract indices and sort them
        List<Integer> indices = new ArrayList<>();
        while (!heap.isEmpty()) {
            int[] pair = heap.poll();
            indices.add(pair[1]); // Add index to list
        }

        // Sort indices to maintain original order
        Collections.sort(indices);

        // Step 3: Build result array
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = nums[indices.get(i)];
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log k)**

- We process each of the `n` elements once
- For each element, we perform heap operations (push/pop) which take O(log k) time
- Sorting the `k` indices takes O(k log k) time
- Total: O(n log k + k log k) = O(n log k) since n ≥ k

**Space Complexity: O(n)**

- The heap stores at most `k` elements: O(k)
- We store indices: O(k)
- In worst case when k ≈ n, this becomes O(n)
- Additional space for result: O(k)

The heap approach is optimal because:

1. When k is small compared to n, O(n log k) is much better than O(n log n)
2. We only need to track the k largest elements, not sort the entire array

## Common Mistakes

1. **Returning sorted values instead of original order**: The most common mistake is to simply sort the array, take the last k elements, and return them. This loses the original order. Always remember to track indices along with values.

2. **Using max-heap instead of min-heap**: A max-heap would require storing all n elements, giving O(n log n) time. The min-heap approach is more efficient because we only keep k elements.

3. **Forgetting to handle duplicate values**: When values are equal, we need to be careful about which indices we choose. The heap approach naturally handles this because when values are equal, the heap ordering might be arbitrary, but any choice of equal values is valid for maximizing the sum.

4. **Not considering k = 0 or k = n edge cases**:
   - When k = 0, return an empty array
   - When k = n, return the entire array
   - The heap solution handles these naturally, but some implementations might have boundary issues.

## When You'll See This Pattern

This problem combines two important patterns:

1. **K Largest Elements**: Finding the k largest/smallest elements in a collection. This pattern appears in:
   - [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array) - Direct application of finding kth largest
   - [Top K Frequent Elements](/problem/top-k-frequent-elements) - Finding k most frequent elements using heap

2. **Preserving Order While Selecting Elements**: When you need to select elements based on some criteria but maintain their original order. This appears in:
   - [Remove Duplicate Letters](/problem/remove-duplicate-letters) - Selecting smallest lexicographic result while preserving relative order
   - [Smallest Subsequence of Distinct Characters](/problem/smallest-subsequence-of-distinct-characters) - Similar order-preserving selection

The heap approach for finding k largest elements is a fundamental technique that appears in streaming algorithms, where you can't store all data, and in optimization problems where you need the top k items efficiently.

## Key Takeaways

1. **When you need k largest/smallest elements, think "heap"**: A min-heap of size k efficiently tracks the k largest elements in O(n log k) time, better than full sorting when k ≪ n.

2. **Preserve metadata when order matters**: When you need to maintain original order after selecting elements, always store indices along with values. Sort indices at the end to reconstruct the sequence.

3. **The optimal subsequence for sum is the k largest elements**: For maximizing sum, you always want the largest values. The challenge is just implementing this efficiently while preserving order.

Related problems: [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [Maximize Sum Of Array After K Negations](/problem/maximize-sum-of-array-after-k-negations), [Sort Integers by The Number of 1 Bits](/problem/sort-integers-by-the-number-of-1-bits)
