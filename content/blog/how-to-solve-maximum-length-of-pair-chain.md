---
title: "How to Solve Maximum Length of Pair Chain — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Length of Pair Chain. Medium difficulty, 61.6% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Sorting."
date: "2027-12-22"
category: "dsa-patterns"
tags: ["maximum-length-of-pair-chain", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Maximum Length of Pair Chain

You're given an array of pairs where each pair has a start and end value. You need to find the longest chain of pairs where each subsequent pair starts after the previous one ends. The challenge is that pairs can be selected in any order, so simply checking adjacent pairs won't work. This problem is interesting because it looks like a variation of the classic Longest Increasing Subsequence problem, but has a greedy solution that's even more efficient.

## Visual Walkthrough

Let's trace through an example: `pairs = [[1,2], [2,3], [3,4]]`

**Step 1:** We can sort the pairs by their end values: `[[1,2], [2,3], [3,4]]` (they're already sorted in this case).

**Step 2:** Start with the first pair `[1,2]`. This becomes our current chain with length 1. The last end value is 2.

**Step 3:** Check the next pair `[2,3]`. Since 2 (start of current pair) is NOT greater than 2 (end of last chain pair), we cannot add it to our chain.

**Step 4:** Check the next pair `[3,4]`. Since 3 (start) > 2 (end of last chain), we can add it! Now our chain is `[[1,2], [3,4]]` with length 2.

**Result:** Maximum chain length is 2.

Let's try a more complex example: `pairs = [[3,4], [1,2], [2,3]]`

**Step 1:** Sort by end values: `[[1,2], [2,3], [3,4]]`

**Step 2:** Start with `[1,2]` (length = 1, last end = 2)

**Step 3:** Check `[2,3]`: 2 ≤ 2, so skip it

**Step 4:** Check `[3,4]`: 3 > 2, so add it (length = 2, last end = 4)

**Result:** Maximum chain length is 2.

The key insight: by sorting pairs by their end values, we can greedily select pairs that don't overlap, always choosing the pair with the smallest possible end value that starts after our current chain ends.

## Brute Force Approach

A naive approach would be to consider all possible combinations of pairs. For each pair, we could either include it or not include it in our chain, checking if it follows the previous pair. This leads to 2^n possibilities where n is the number of pairs.

The brute force would work like this:

1. Generate all possible subsets of pairs
2. For each subset, check if it forms a valid chain (each pair starts after the previous ends)
3. Track the maximum length found

However, with n up to 1000, 2^1000 is astronomically large and completely impractical. Even for n=20, this would be too slow. We need a smarter approach.

## Optimized Approach

The key insight is that this problem is similar to the classic **interval scheduling** problem. When we want to maximize the number of non-overlapping intervals (or chains of pairs), the optimal strategy is:

1. **Sort the pairs by their end values** - This ensures we always consider the pair that finishes earliest first
2. **Greedily select pairs** - Always pick the next pair that starts after our current chain ends

Why does this greedy approach work? If we have a pair that ends earlier, it leaves more room for subsequent pairs. By always choosing the pair with the smallest end that can be added to our chain, we maximize our chances of fitting more pairs later.

Alternatively, we can solve this with **dynamic programming** similar to Longest Increasing Subsequence:

1. Sort pairs by their start values
2. For each pair i, check all previous pairs j where pairs[j][1] < pairs[i][0]
3. The DP recurrence is: dp[i] = max(dp[i], dp[j] + 1)

The greedy approach is O(n log n) while the DP approach is O(n²). For this problem, the greedy solution is optimal.

## Optimal Solution

Here's the complete solution using the greedy approach:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def findLongestChain(pairs):
    """
    Finds the longest chain of pairs where each pair starts after the previous ends.

    Approach:
    1. Sort pairs by their end values (right element)
    2. Greedily select pairs that don't overlap
    3. Always pick the pair with the smallest end that can be added

    Args:
        pairs: List of lists, each containing [start, end] values

    Returns:
        Integer representing the maximum chain length
    """
    # Step 1: Sort pairs by their end values
    # This is crucial for the greedy approach to work correctly
    pairs.sort(key=lambda x: x[1])

    # Step 2: Initialize variables
    # We start with the first pair in the sorted list
    current_end = float('-inf')  # Track end of last selected pair
    chain_length = 0             # Count of pairs in our chain

    # Step 3: Iterate through all pairs
    for start, end in pairs:
        # Check if current pair can be added to our chain
        # A pair can be added if its start is greater than current_end
        if start > current_end:
            # Add this pair to our chain
            chain_length += 1
            # Update current_end to this pair's end
            current_end = end

    return chain_length
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
/**
 * Finds the longest chain of pairs where each pair starts after the previous ends.
 *
 * Approach:
 * 1. Sort pairs by their end values (right element)
 * 2. Greedily select pairs that don't overlap
 * 3. Always pick the pair with the smallest end that can be added
 *
 * @param {number[][]} pairs - Array of pairs, each containing [start, end] values
 * @return {number} - Maximum chain length
 */
function findLongestChain(pairs) {
  // Step 1: Sort pairs by their end values (second element)
  // This ensures we always consider pairs that finish earliest first
  pairs.sort((a, b) => a[1] - b[1]);

  // Step 2: Initialize tracking variables
  let currentEnd = -Infinity; // Track end of last selected pair
  let chainLength = 0; // Count of pairs in our chain

  // Step 3: Iterate through all pairs
  for (const [start, end] of pairs) {
    // Check if current pair can be added to our chain
    // A pair can be added if its start is greater than currentEnd
    if (start > currentEnd) {
      // Add this pair to our chain
      chainLength++;
      // Update currentEnd to this pair's end
      currentEnd = end;
    }
  }

  return chainLength;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;
import java.util.Comparator;

class Solution {
    /**
     * Finds the longest chain of pairs where each pair starts after the previous ends.
     *
     * Approach:
     * 1. Sort pairs by their end values (right element)
     * 2. Greedily select pairs that don't overlap
     * 3. Always pick the pair with the smallest end that can be added
     *
     * @param pairs - Array of pairs, each containing [start, end] values
     * @return Maximum chain length
     */
    public int findLongestChain(int[][] pairs) {
        // Step 1: Sort pairs by their end values (second element)
        // Using a comparator to sort based on the end value of each pair
        Arrays.sort(pairs, new Comparator<int[]>() {
            @Override
            public int compare(int[] a, int[] b) {
                return Integer.compare(a[1], b[1]);
            }
        });

        // Step 2: Initialize tracking variables
        int currentEnd = Integer.MIN_VALUE;  // Track end of last selected pair
        int chainLength = 0;                 // Count of pairs in our chain

        // Step 3: Iterate through all pairs
        for (int[] pair : pairs) {
            int start = pair[0];
            int end = pair[1];

            // Check if current pair can be added to our chain
            // A pair can be added if its start is greater than currentEnd
            if (start > currentEnd) {
                // Add this pair to our chain
                chainLength++;
                // Update currentEnd to this pair's end
                currentEnd = end;
            }
        }

        return chainLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the pairs takes O(n log n) time
- The single pass through the sorted array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If the sorting algorithm is in-place (like Python's Timsort), space is O(1)
- If the sorting algorithm uses additional space (like merge sort), space is O(n)
- The algorithm itself only uses a few variables, so additional space is O(1)

## Common Mistakes

1. **Sorting by start values instead of end values**: This is the most common mistake. If you sort by start values, you might miss optimal chains. Example: `[[1,100], [2,3], [4,5]]`. Sorted by start: `[[1,100], [2,3], [4,5]]`. Greedy would pick `[1,100]` and then nothing else (length 1). But optimal is `[2,3], [4,5]` (length 2).

2. **Using ≤ instead of < in the comparison**: The problem says `b < c` for pair `[a,b]` to be followed by `[c,d]`. Some candidates use `start >= currentEnd` instead of `start > currentEnd`, which is incorrect for non-overlapping chains.

3. **Not handling empty input**: While the problem guarantees at least one pair, in interviews you should mention edge cases. Always check if the input array is empty and return 0 in that case.

4. **Trying to modify the greedy approach for maximum sum instead of maximum count**: This greedy approach works for maximizing the number of non-overlapping intervals. If the problem asked for maximum sum of values (like weighted interval scheduling), you'd need dynamic programming instead.

## When You'll See This Pattern

This greedy interval scheduling pattern appears in several problems:

1. **Non-overlapping Intervals (LeetCode 435)**: Very similar - instead of finding the maximum chain length, you find the minimum number of intervals to remove to make all intervals non-overlapping. The solution is almost identical.

2. **Meeting Rooms II (LeetCode 253)**: While this uses a different technique (min-heap), it's solving a related problem of scheduling intervals with limited resources.

3. **Merge Intervals (LeetCode 56)**: While not exactly the same, it deals with interval manipulation and often requires sorting by start or end times.

4. **Video Stitching (LeetCode 1024)**: Another interval problem where you need to cover a range with minimum intervals, often solved with greedy approaches after sorting.

The core pattern is: when you need to select non-overlapping intervals to maximize count, sort by end time and greedily select.

## Key Takeaways

1. **Greedy works for interval scheduling**: When you need to maximize the number of non-overlapping intervals, sorting by end time and greedily selecting is often optimal.

2. **Sorting direction matters**: For maximizing count of non-overlapping intervals, sort by end time. For other interval problems (like merging), you might sort by start time instead.

3. **Recognize the pattern**: If a problem involves pairs/ranges/intervals and asks for "maximum number" or "longest chain" where elements don't overlap, think of this greedy approach first before jumping to dynamic programming.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Non-decreasing Subsequences](/problem/non-decreasing-subsequences), [Longest Non-decreasing Subarray From Two Arrays](/problem/longest-non-decreasing-subarray-from-two-arrays)
