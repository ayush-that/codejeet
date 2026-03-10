---
title: "How to Solve Longest Harmonious Subsequence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Harmonious Subsequence. Easy difficulty, 64.4% acceptance rate. Topics: Array, Hash Table, Sliding Window, Sorting, Counting."
date: "2027-08-30"
category: "dsa-patterns"
tags: ["longest-harmonious-subsequence", "array", "hash-table", "sliding-window", "easy"]
---

# How to Solve Longest Harmonious Subsequence

This problem asks us to find the longest subsequence where the difference between the maximum and minimum values is exactly 1. The tricky part is that we're looking for subsequences (not subarrays), which means the elements don't need to be contiguous, but they must maintain their original order. However, here's the key insight: for subsequences, order doesn't matter when we're only concerned with values! We can pick any elements from anywhere in the array as long as they satisfy the harmonious condition.

## Visual Walkthrough

Let's trace through an example: `nums = [1,3,2,2,5,2,3,7]`

A harmonious subsequence can only contain two distinct values that differ by exactly 1. Let's think about what this means:

1. If we pick value `x`, we can only pair it with either `x-1` or `x+1`
2. The length of the harmonious subsequence for a pair `(x, x+1)` is simply: count of all `x` + count of all `x+1`

Let's count occurrences:

- 1 appears 1 time
- 2 appears 3 times
- 3 appears 2 times
- 5 appears 1 time
- 7 appears 1 time

Now check each possible pair:

- Pair (1,2): count = 1 + 3 = 4
- Pair (2,3): count = 3 + 2 = 5
- Pair (3,4): 4 doesn't exist, so skip
- Pair (5,6): 6 doesn't exist, so skip
- Pair (7,8): 8 doesn't exist, so skip

The maximum is 5, which comes from the pair (2,3). Indeed, we can pick all the 2's and 3's from the array: `[3,2,2,2,3]`.

## Brute Force Approach

A naive approach would be to generate all possible subsequences and check each one. For each subsequence:

1. Find the minimum and maximum values
2. Check if max - min == 1
3. Track the longest valid subsequence

However, this is extremely inefficient. An array of length `n` has 2ⁿ possible subsequences, making this approach O(2ⁿ) time complexity, which is completely impractical for any reasonable input size.

Even a slightly better brute force would be to consider all pairs of values `(x, x+1)` and count their occurrences, but without using a hash table to store counts, we'd need to scan the array for each pair, resulting in O(n²) time if we consider all possible values.

## Optimal Solution

The key insight is that for a harmonious subsequence with values `x` and `x+1`, we can simply count how many of each value appear in the entire array. Since subsequences don't require elements to be contiguous, we can take ALL occurrences of `x` and ALL occurrences of `x+1`.

The optimal approach:

1. Count frequency of each number using a hash map
2. For each number `x` in the map, check if `x+1` exists
3. If it does, calculate `freq[x] + freq[x+1]` and track the maximum

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findLHS(nums):
    """
    Find the length of the longest harmonious subsequence.
    A harmonious subsequence contains only two distinct values
    that differ by exactly 1.
    """
    # Step 1: Count frequency of each number
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Initialize result to 0
    max_length = 0

    # Step 3: Check each number and its consecutive neighbor
    for num in freq:
        # Check if the next consecutive number exists
        if num + 1 in freq:
            # Calculate length of harmonious subsequence
            # using current number and its consecutive neighbor
            current_length = freq[num] + freq[num + 1]
            # Update maximum if current is larger
            max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function findLHS(nums) {
  /**
   * Find the length of the longest harmonious subsequence.
   * A harmonious subsequence contains only two distinct values
   * that differ by exactly 1.
   */

  // Step 1: Count frequency of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Initialize result to 0
  let maxLength = 0;

  // Step 3: Check each number and its consecutive neighbor
  for (const [num, count] of freq) {
    // Check if the next consecutive number exists
    if (freq.has(num + 1)) {
      // Calculate length of harmonious subsequence
      // using current number and its consecutive neighbor
      const currentLength = count + freq.get(num + 1);
      // Update maximum if current is larger
      maxLength = Math.max(maxLength, currentLength);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

public int findLHS(int[] nums) {
    /**
     * Find the length of the longest harmonious subsequence.
     * A harmonious subsequence contains only two distinct values
     * that differ by exactly 1.
     */

    // Step 1: Count frequency of each number
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Step 2: Initialize result to 0
    int maxLength = 0;

    // Step 3: Check each number and its consecutive neighbor
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        int num = entry.getKey();
        int count = entry.getValue();

        // Check if the next consecutive number exists
        if (freq.containsKey(num + 1)) {
            // Calculate length of harmonious subsequence
            // using current number and its consecutive neighbor
            int currentLength = count + freq.get(num + 1);
            // Update maximum if current is larger
            maxLength = Math.max(maxLength, currentLength);
        }
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map takes O(n) time where n is the length of the array
- Iterating through the map takes O(k) time where k is the number of distinct values (k ≤ n)
- Overall time complexity is O(n + k) = O(n)

**Space Complexity: O(n)**

- The frequency map stores at most n entries (in the worst case when all elements are distinct)
- In practice, it stores k entries where k is the number of distinct values

## Common Mistakes

1. **Confusing subsequence with subarray**: Some candidates try to find contiguous harmonious sequences, but the problem specifically asks for subsequences. Remember that for subsequences, elements don't need to be contiguous, so we can take all occurrences of the two values from anywhere in the array.

2. **Forgetting to check both directions**: While our solution only checks `num + 1`, this is sufficient because if we have a valid pair `(x, x+1)`, checking `x` will catch it when we look at `x`, and checking `x-1` would be redundant. However, some candidates might only check `num - 1` and miss some pairs.

3. **Not handling the case where no harmonious subsequence exists**: If no two consecutive numbers exist in the array, the answer should be 0. Our solution handles this correctly because `max_length` starts at 0 and only updates when we find a valid pair.

4. **Incorrect frequency counting**: Using an array instead of a hash map for frequency counting can be inefficient if the number range is large or includes negative numbers. Always use a hash map for frequency counting unless the problem explicitly states a small, non-negative range.

## When You'll See This Pattern

This problem uses frequency counting with a hash map, which is a fundamental pattern for many array problems:

1. **Two Sum (LeetCode #1)**: Uses a hash map to store values and their indices to find pairs that sum to a target.
2. **Majority Element (LeetCode #169)**: Uses frequency counting to find the element that appears more than n/2 times.
3. **Find All Duplicates in an Array (LeetCode #442)**: Uses frequency counting or index manipulation to find duplicates.
4. **Sorting-based approach**: This problem can also be solved by sorting first (O(n log n) time, O(1) space if we sort in-place), then using a sliding window to find the longest sequence where max-min = 1.

## Key Takeaways

1. **Subsequences vs. Subarrays**: For subsequence problems where order doesn't matter for the condition (like this one), you can often rearrange or select elements freely. This simplifies the problem to counting frequencies rather than maintaining order.

2. **Frequency counting with hash maps**: When you need to know "how many times does X appear?" a hash map is usually the right tool. This pattern appears in countless array and string problems.

3. **Look for mathematical relationships**: The condition "difference is exactly 1" creates a simple relationship between values. Recognizing this allows us to only check consecutive numbers rather than all pairs.

[Practice this problem on CodeJeet](/problem/longest-harmonious-subsequence)
