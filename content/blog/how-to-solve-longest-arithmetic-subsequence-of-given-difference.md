---
title: "How to Solve Longest Arithmetic Subsequence of Given Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Arithmetic Subsequence of Given Difference. Medium difficulty, 54.3% acceptance rate. Topics: Array, Hash Table, Dynamic Programming."
date: "2026-05-22"
category: "dsa-patterns"
tags:
  [
    "longest-arithmetic-subsequence-of-given-difference",
    "array",
    "hash-table",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Longest Arithmetic Subsequence of Given Difference

This problem asks us to find the length of the longest arithmetic subsequence where the difference between consecutive elements is exactly equal to a given `difference`. The tricky part is that we're dealing with subsequences (not subarrays), meaning elements don't need to be consecutive in the original array, but they must maintain their relative order. This makes it different from finding contiguous sequences.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [1, 5, 7, 8, 5, 3, 4, 2, 1]` with `difference = -2`.

We want to find the longest subsequence where each element is exactly 2 less than the previous one. Let's think about how we can build these sequences:

1. Start at index 0: value = 1. What number would come next? 1 + (-2) = -1. Is there a -1 later in the array? No. So the longest sequence starting at 1 has length 1.

2. Index 1: value = 5. Next should be 3. Looking forward, we see 3 at index 5. From 3, next should be 1. We see 1 at index 8. So we have 5 → 3 → 1, length 3.

3. Index 2: value = 7. Next should be 5. We see 5 at index 4. From 5, next should be 3, then 1. So 7 → 5 → 3 → 1, length 4.

4. Index 3: value = 8. Next should be 6. No 6 exists. Length 1.

5. Index 4: value = 5 (second occurrence). Next should be 3, then 1. So 5 → 3 → 1, length 3.

6. Index 5: value = 3. Next should be 1. So 3 → 1, length 2.

7. Index 6: value = 4. Next should be 2. We see 2 at index 7. From 2, next should be 0. No 0 exists. So 4 → 2, length 2.

8. Index 7: value = 2. Next should be 0. No 0 exists. Length 1.

9. Index 8: value = 1. Next should be -1. No -1 exists. Length 1.

The maximum length is 4 (sequence 7 → 5 → 3 → 1). Notice that we're repeatedly computing the same sequences. For example, when we get to value 5, we always check what sequences start from 3. This suggests we can use memoization.

## Brute Force Approach

A naive approach would be to try all possible subsequences. For each starting position, we could recursively find the longest valid sequence starting from that element. The algorithm would look like:

1. For each index `i` in the array:
   - Initialize length = 1
   - Look for the next element `arr[i] + difference` in the remaining array
   - If found at index `j`, recursively find the longest sequence starting from `j` and add 1
   - Track the maximum length

This approach has exponential time complexity because for each element, we might explore multiple paths. In the worst case (when all elements are the same and difference is 0), we'd essentially be checking all subsequences, which is O(2^n). This is clearly too slow for typical constraints where n can be up to 10^5.

Even with memoization on the starting index, we'd still need to search for the next element in the remaining array, which could take O(n) per lookup, leading to O(n²) time complexity.

## Optimized Approach

The key insight is that for any element `x` in our sequence, the next element must be exactly `x + difference`. This means that if we process the array from left to right, we can use dynamic programming with a hash map to store the longest sequence ending at each value.

Here's the reasoning step by step:

1. Let `dp[value]` represent the length of the longest arithmetic subsequence ending with the value `value`.

2. As we iterate through the array from left to right:
   - For current element `arr[i]`, we check if we've seen `arr[i] - difference` before.
   - If yes, then `arr[i]` can extend the sequence ending at `arr[i] - difference`, so `dp[arr[i]] = dp[arr[i] - difference] + 1`.
   - If no, then `arr[i]` starts a new sequence, so `dp[arr[i]] = 1`.

3. We track the maximum value in `dp` throughout the iteration.

Why does this work? Because we're processing left to right, when we encounter `arr[i]`, any valid sequence ending at `arr[i]` must have its previous element equal to `arr[i] - difference`. The hash map gives us O(1) access to check if such a sequence exists and what its length is.

This approach automatically handles duplicate values correctly. If we see the same value multiple times, we update its sequence length to be the maximum possible.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestSubsequence(arr, difference):
    """
    Find the length of the longest arithmetic subsequence with given difference.

    Args:
        arr: List of integers
        difference: Integer difference between consecutive elements in subsequence

    Returns:
        Integer length of longest valid subsequence
    """
    # dp dictionary: key = value from array, value = longest sequence ending with that value
    dp = {}
    max_length = 0

    # Iterate through each element in the array
    for num in arr:
        # Check if we have a sequence ending at (num - difference)
        # If yes, extend that sequence by 1
        # If no, start a new sequence of length 1
        dp[num] = dp.get(num - difference, 0) + 1

        # Update the maximum length found so far
        max_length = max(max_length, dp[num])

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function longestSubsequence(arr, difference) {
  /**
   * Find the length of the longest arithmetic subsequence with given difference.
   *
   * @param {number[]} arr - Array of integers
   * @param {number} difference - Integer difference between consecutive elements
   * @return {number} Length of longest valid subsequence
   */
  // dp Map: key = value from array, value = longest sequence ending with that value
  const dp = new Map();
  let maxLength = 0;

  // Iterate through each element in the array
  for (const num of arr) {
    // Check if we have a sequence ending at (num - difference)
    // If yes, extend that sequence by 1
    // If no, start a new sequence of length 1
    const prevLength = dp.get(num - difference) || 0;
    const currentLength = prevLength + 1;
    dp.set(num, currentLength);

    // Update the maximum length found so far
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;

class Solution {
    public int longestSubsequence(int[] arr, int difference) {
        /**
         * Find the length of the longest arithmetic subsequence with given difference.
         *
         * @param arr Array of integers
         * @param difference Integer difference between consecutive elements
         * @return Length of longest valid subsequence
         */
        // dp HashMap: key = value from array, value = longest sequence ending with that value
        HashMap<Integer, Integer> dp = new HashMap<>();
        int maxLength = 0;

        // Iterate through each element in the array
        for (int num : arr) {
            // Check if we have a sequence ending at (num - difference)
            // If yes, extend that sequence by 1
            // If no, start a new sequence of length 1
            int prevLength = dp.getOrDefault(num - difference, 0);
            int currentLength = prevLength + 1;
            dp.put(num, currentLength);

            // Update the maximum length found so far
            maxLength = Math.max(maxLength, currentLength);
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing O(1) operations for each element.
- The hash map operations (get/put) are O(1) on average.

**Space Complexity: O(n)**

- In the worst case, we store an entry for every unique value in the array.
- If all elements are distinct, we use O(n) space.
- If difference is 0 and all elements are the same, we only store one entry, but this is still O(1) space.

## Common Mistakes

1. **Confusing subsequence with subarray**: Some candidates try to find contiguous sequences. Remember that subsequences don't need to be consecutive in the original array, they just need to maintain order.

2. **Not handling duplicates correctly**: With duplicate values, you might be tempted to only store the first occurrence. However, later occurrences might lead to longer sequences. Our solution handles this correctly by always updating the dp entry for a value when we see it.

3. **Using array instead of hash map for dp**: Since array values can be large (up to 10^4 in absolute value), using an array indexed by value would require excessive memory. A hash map is more appropriate.

4. **Forgetting to track maximum length**: It's easy to return `dp[last_element]` instead of tracking the maximum throughout. The longest sequence might not end at the last array element.

## When You'll See This Pattern

This problem uses a pattern of **dynamic programming with hash maps for sequence problems**. You'll see similar patterns in:

1. **Longest Increasing Subsequence (LIS)** - While LIS typically uses binary search for O(n log n) solution, the DP approach with O(n²) is conceptually similar.
2. **Destroy Sequential Targets** - The recommended similar problem uses the same core idea of tracking sequences through a hash map.
3. **Longest Arithmetic Subsequence** (the general version, #1027) - A harder version where the difference isn't given, requiring 2D DP.
4. **Number of Longest Increasing Subsequence** (#673) - Builds on the LIS concept with additional counting.

The key pattern is: when you need to find sequences based on some relationship between elements (like "next element = current + k"), a hash map that stores the best result ending at each value is often the right approach.

## Key Takeaways

1. **For subsequence problems with fixed relationships between elements**, consider using a hash map to store the best sequence ending at each value. This turns an O(n²) search into O(n).

2. **Process the array in natural order** when dealing with subsequences that must maintain order. Left-to-right processing ensures we only build valid sequences.

3. **The value of `dp[key]` represents "best result ending with key"** is a powerful pattern that appears in many sequence problems, not just this one.

Related problems: [Destroy Sequential Targets](/problem/destroy-sequential-targets)
