---
title: "How to Solve Max Chunks To Make Sorted — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Chunks To Make Sorted. Medium difficulty, 64.1% acceptance rate. Topics: Array, Stack, Greedy, Sorting, Monotonic Stack."
date: "2028-06-13"
category: "dsa-patterns"
tags: ["max-chunks-to-make-sorted", "array", "stack", "greedy", "medium"]
---

# How to Solve Max Chunks To Make Sorted

This problem asks us to split a permutation of `[0, n-1]` into the maximum number of chunks, where each chunk can be sorted independently and concatenated to form the fully sorted array. The tricky part is that we can't just split anywhere — we need to ensure that when we sort each chunk individually, the entire array becomes sorted. This requires understanding the relationship between values and their positions in a sorted permutation.

## Visual Walkthrough

Let's trace through an example: `arr = [1, 0, 2, 3, 4]`

In the sorted version, we'd have `[0, 1, 2, 3, 4]`. We want to split into chunks, sort each chunk, and get the sorted array.

**Step-by-step reasoning:**

1. Start at index 0 with value 1. For a chunk ending here to be valid, all values in this chunk must be ≤ all values in later chunks.
2. The maximum value in the first chunk so far is 1. If we end the chunk at index 0, we'd have chunk `[1]` which when sorted gives `[1]`. But then we'd have `[0, 2, 3, 4]` remaining. The problem is that 0 is smaller than 1, so if we put 0 after 1, the array won't be sorted overall.
3. Continue to index 1 with value 0. Now the maximum in our current chunk is max(1, 0) = 1. At index 1, we've seen values 0 and 1. Notice that if we end the chunk here, we'd have values {0, 1} which exactly match the indices {0, 1}. This is the key insight: when the maximum value in the current chunk equals the current index, we can end a valid chunk here.
4. So we make our first chunk `[1, 0]`, which when sorted becomes `[0, 1]`. This matches the first two positions of the sorted array.
5. Continue with index 2 (value 2). The maximum is 2, which equals index 2, so `[2]` can be its own chunk.
6. Similarly, indices 3 and 4 each form their own chunks.

Result: 4 chunks total `[1, 0] | [2] | [3] | [4]`.

## Brute Force Approach

A naive approach might try to check every possible split point. For each potential split, we'd need to verify that all elements in the left chunk are smaller than all elements in the right chunk. This verification itself would take O(n) time, and with O(n) possible split points to check, we'd have O(n²) complexity.

Even worse, we might try to recursively explore all possible chunking combinations, which would be exponential in time. These approaches are clearly too slow for typical constraints where n can be up to 10,000.

The brute force fails because it doesn't leverage the special property of this permutation: the values are exactly `[0, n-1]`. This gives us a much simpler way to determine valid chunk boundaries.

## Optimized Approach

The key insight comes from understanding what makes a chunk valid. For a chunk from index `i` to `j` to be independently sortable:

- After sorting this chunk, all its elements must be in positions `i` through `j` in the final sorted array
- This means the chunk must contain exactly the values `i` through `j` (in any order)
- Equivalently: the maximum value in the chunk must be exactly `j`

Since we're processing left to right, we can track the maximum value we've seen so far. When this maximum equals the current index, we know we've found all values from 0 up to that index, so we can end a valid chunk here.

**Step-by-step reasoning for the optimal solution:**

1. Initialize `max_so_far` to track the maximum value in the current chunk
2. Initialize `chunks` counter to count valid chunks
3. Iterate through the array with index `i`:
   - Update `max_so_far` to be the maximum of current value and previous maximum
   - If `max_so_far == i`, we can end a chunk here
     - Why? Because we've seen all values from 0 to i
     - Any values > i must be in later chunks
4. Return the chunk count

This greedy approach works because once we satisfy the condition at index i, we know the chunk ending at i is valid, and we can safely start a new chunk without affecting previous decisions.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxChunksToSorted(arr):
    """
    Counts the maximum number of chunks we can split arr into
    such that sorting each chunk individually results in a sorted array.

    The key insight: for a chunk ending at index i to be valid,
    the maximum value in that chunk must equal i.
    """
    max_so_far = 0  # Track maximum value in current chunk
    chunks = 0      # Count of valid chunks found

    for i, num in enumerate(arr):
        # Update the maximum value seen in current chunk
        max_so_far = max(max_so_far, num)

        # If max equals current index, we can end a chunk here
        # This means we've seen all values from 0 to i
        if max_so_far == i:
            chunks += 1

    return chunks
```

```javascript
// Time: O(n) | Space: O(1)
function maxChunksToSorted(arr) {
  /**
   * Counts the maximum number of chunks we can split arr into
   * such that sorting each chunk individually results in a sorted array.
   *
   * The key insight: for a chunk ending at index i to be valid,
   * the maximum value in that chunk must equal i.
   */
  let maxSoFar = 0; // Track maximum value in current chunk
  let chunks = 0; // Count of valid chunks found

  for (let i = 0; i < arr.length; i++) {
    // Update the maximum value seen in current chunk
    maxSoFar = Math.max(maxSoFar, arr[i]);

    // If max equals current index, we can end a chunk here
    // This means we've seen all values from 0 to i
    if (maxSoFar === i) {
      chunks++;
    }
  }

  return chunks;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxChunksToSorted(int[] arr) {
        /**
         * Counts the maximum number of chunks we can split arr into
         * such that sorting each chunk individually results in a sorted array.
         *
         * The key insight: for a chunk ending at index i to be valid,
         * the maximum value in that chunk must equal i.
         */
        int maxSoFar = 0;  // Track maximum value in current chunk
        int chunks = 0;    // Count of valid chunks found

        for (int i = 0; i < arr.length; i++) {
            // Update the maximum value seen in current chunk
            maxSoFar = Math.max(maxSoFar, arr[i]);

            // If max equals current index, we can end a chunk here
            // This means we've seen all values from 0 to i
            if (maxSoFar == i) {
                chunks++;
            }
        }

        return chunks;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array
- Each iteration does constant work: one comparison and one max operation

**Space Complexity: O(1)**

- We only use two integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the permutation property**: Some candidates try to solve this without using the fact that values are `[0, n-1]`. They might try to compare with sorted array or use more complex logic. Remember: when `max_so_far == i`, we've necessarily seen all values 0 through i.

2. **Off-by-one errors with indices**: The condition is `max_so_far == i`, not `max_so_far == i+1` or other variations. Test with simple cases like `[0]` (should return 1) and `[1,0]` (should return 1).

3. **Incorrect initialization of max_so_far**: It should start at 0, not at arr[0] or -1. Starting at 0 works because we're looking for values 0 through i.

4. **Trying to actually split the array**: The problem only asks for the count of chunks, not the actual split points. Don't waste time building lists of chunks when a simple counter suffices.

## When You'll See This Pattern

This "max so far equals index" pattern appears in problems where we need to partition arrays based on value ranges:

1. **Max Chunks To Make Sorted II** (Hard) - The same concept but with duplicates and arbitrary values. Instead of comparing with index, you compare with the sorted version of the array.

2. **Partition Labels** (Medium) - Similar idea of finding partitions where all occurrences of certain characters are contained within the partition.

3. **Jump Game** variants - The idea of tracking a maximum reachable point as you iterate has similarities.

The core pattern is: when processing arrays left to right, track some cumulative property (max, sum, etc.) and make decisions when that property reaches certain thresholds.

## Key Takeaways

1. **Look for special properties in the input**: Here, the fact that we have a permutation of `[0, n-1]` simplifies the problem dramatically. Always check if the input has special characteristics you can exploit.

2. **The "max equals index" trick is specific to this problem**: When values are 0 to n-1, a chunk ending at i is valid if it contains all values 0 through i, which happens when the maximum equals i.

3. **Greedy approaches often work for partition problems**: When a local decision (ending a chunk here) doesn't affect future optimality, greedy solutions are usually correct and efficient.

Related problems: [Max Chunks To Make Sorted II](/problem/max-chunks-to-make-sorted-ii)
