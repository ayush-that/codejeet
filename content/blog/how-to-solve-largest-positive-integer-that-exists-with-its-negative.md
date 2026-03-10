---
title: "How to Solve Largest Positive Integer That Exists With Its Negative — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Positive Integer That Exists With Its Negative. Easy difficulty, 74.5% acceptance rate. Topics: Array, Hash Table, Two Pointers, Sorting."
date: "2028-03-30"
category: "dsa-patterns"
tags:
  [
    "largest-positive-integer-that-exists-with-its-negative",
    "array",
    "hash-table",
    "two-pointers",
    "easy",
  ]
---

# How to Solve Largest Positive Integer That Exists With Its Negative

This problem asks us to find the largest positive integer in an array where its negative counterpart also exists. While conceptually simple, it's interesting because it tests your ability to efficiently track number relationships—a foundational skill for more complex problems like Two Sum. The challenge lies in handling the search efficiently without nested loops.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, -2, 5, -3, -5]`

We need to find the largest positive number `k` where `-k` also exists in the array.

**Step-by-step thinking:**

1. We see `5` and `-5` → both exist, so `5` is a candidate
2. We see `3` and `-3` → both exist, so `3` is a candidate
3. We see `2` and `-2` → both exist, so `2` is a candidate
4. Compare candidates: `5 > 3 > 2`, so `5` is our answer

But how do we check this efficiently? We could:

- Sort and use two pointers (like finding pairs)
- Use a hash set to track what we've seen
- Use a frequency counter

For this example, using a hash set:

1. Create an empty set to store numbers we've seen
2. Initialize `max_k = -1` (default if no pair found)
3. Process each number:
   - For `3`: Add `3` to set. Check if `-3` in set? No.
   - For `2`: Add `2` to set. Check if `-2` in set? No.
   - For `-2`: Add `-2` to set. Check if `2` in set? Yes! `2` is candidate, `max_k = max(-1, 2) = 2`
   - For `5`: Add `5` to set. Check if `-5` in set? No.
   - For `-3`: Add `-3` to set. Check if `3` in set? Yes! `3 > 2`, so `max_k = 3`
   - For `-5`: Add `-5` to set. Check if `5` in set? Yes! `5 > 3`, so `max_k = 5`

Final answer: `5`

## Brute Force Approach

The most straightforward solution is to check every possible pair:

1. For each positive number in the array
2. Check if its negative exists by scanning the entire array
3. Track the maximum such positive number

This approach has O(n²) time complexity because for each of up to n positive numbers, we scan n elements to find its negative. The space complexity is O(1) since we only store the maximum.

While this works for small inputs, it's inefficient for larger arrays. For example, with 10,000 elements, we'd need up to 100 million operations.

## Optimal Solution

The key insight is that we need to quickly check if a number's negative exists. A hash set provides O(1) lookups, making the entire solution O(n). We can process the array once, adding numbers to the set and checking for complements.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findMaxK(nums):
    """
    Find the largest positive integer k where -k also exists in nums.

    Approach:
    1. Use a set to track numbers we've seen
    2. For each number, check if its negative exists in the set
    3. Track the maximum valid positive number

    Args:
        nums: List of integers (no zeros)

    Returns:
        The largest positive integer k where -k exists, or -1 if none
    """
    seen = set()          # Track numbers we've encountered
    max_k = -1            # Initialize result (default -1 for no pair)

    for num in nums:
        # Check if the complement exists in our seen numbers
        # If we see 5, check if -5 exists. If we see -5, check if 5 exists.
        if -num in seen:
            # Valid pair found! Use absolute value since we want positive k
            max_k = max(max_k, abs(num))

        # Add current number to the set for future checks
        seen.add(num)

    return max_k
```

```javascript
// Time: O(n) | Space: O(n)
function findMaxK(nums) {
  /**
   * Find the largest positive integer k where -k also exists in nums.
   *
   * Approach:
   * 1. Use a Set to track numbers we've seen
   * 2. For each number, check if its negative exists in the Set
   * 3. Track the maximum valid positive number
   *
   * @param {number[]} nums - Array of integers (no zeros)
   * @return {number} Largest positive k where -k exists, or -1 if none
   */
  const seen = new Set(); // Track numbers we've encountered
  let maxK = -1; // Initialize result (default -1 for no pair)

  for (const num of nums) {
    // Check if the complement exists in our seen numbers
    // If we see 5, check if -5 exists. If we see -5, check if 5 exists.
    if (seen.has(-num)) {
      // Valid pair found! Use Math.abs since we want positive k
      maxK = Math.max(maxK, Math.abs(num));
    }

    // Add current number to the set for future checks
    seen.add(num);
  }

  return maxK;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int findMaxK(int[] nums) {
        /**
         * Find the largest positive integer k where -k also exists in nums.
         *
         * Approach:
         * 1. Use a HashSet to track numbers we've seen
         * 2. For each number, check if its negative exists in the HashSet
         * 3. Track the maximum valid positive number
         *
         * @param nums Array of integers (no zeros)
         * @return Largest positive k where -k exists, or -1 if none
         */
        Set<Integer> seen = new HashSet<>();  // Track numbers we've encountered
        int maxK = -1;                         // Initialize result (default -1 for no pair)

        for (int num : nums) {
            // Check if the complement exists in our seen numbers
            // If we see 5, check if -5 exists. If we see -5, check if 5 exists.
            if (seen.contains(-num)) {
                // Valid pair found! Use Math.abs since we want positive k
                maxK = Math.max(maxK, Math.abs(num));
            }

            // Add current number to the set for future checks
            seen.add(num);
        }

        return maxK;
    }
}
```

</div>

**Why this works:**

- We process each number once
- When we encounter a number, we check if we've already seen its complement
- By the time we see the second number of a pair, the first is already in the set
- We track the maximum using `abs()` since either positive or negative could come first

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once: O(n)
- Each set operation (add and contains) is O(1) on average
- Total: O(n) operations

**Space Complexity: O(n)**

- In the worst case, we store all n elements in the hash set
- No other significant storage needed
- Total: O(n) space

## Common Mistakes

1. **Forgetting to handle the "no pair found" case**: Always initialize `max_k` to `-1` as specified in the problem. Returning `0` or some other default is incorrect.

2. **Checking complements in the wrong order**: Some candidates check `if num > 0 and -num in nums`, which requires scanning the array each time (O(n²)). The hash set approach is essential for O(1) lookups.

3. **Not using absolute value when comparing**: When we find a pair `(k, -k)`, we might encounter `-k` first then `k`. We need `abs(num)` to get the positive value for comparison: `max_k = max(max_k, abs(num))`.

4. **Modifying the set while iterating (in some languages)**: While not an issue in our solution, some candidates try to add all numbers to the set first, then iterate and check. Our single-pass approach is cleaner and equally efficient.

## When You'll See This Pattern

This "complement check" pattern appears in many problems where you need to find pairs with a specific relationship:

1. **Two Sum (Easy)**: Find two numbers that add up to a target. Instead of checking for `-num`, you check for `target - num`.

2. **Contains Duplicate (Easy)**: Check if any value appears at least twice. Similar set-based approach but checking for equality rather than complement.

3. **Longest Consecutive Sequence (Medium)**: While more complex, it also uses hash sets to quickly check for neighboring numbers.

The core idea is: **when you need to check for the existence of a related value, a hash set provides O(1) lookups, transforming O(n²) brute force into O(n).**

## Key Takeaways

1. **Hash sets are perfect for existence checks**: When you need to know "have I seen this before?" or "does the complement exist?", reach for a hash set for O(1) lookups.

2. **Single-pass often beats two-pass**: Our solution processes each element once while building the set and checking complements. This is more elegant than first building the set then checking.

3. **Absolute value simplifies pair handling**: When dealing with symmetric pairs `(k, -k)`, `abs()` lets you handle them uniformly regardless of which appears first.

**Related problems: [Two Sum](/problem/two-sum)**
