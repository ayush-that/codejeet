---
title: "How to Solve Longest Square Streak in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Square Streak in an Array. Medium difficulty, 53.1% acceptance rate. Topics: Array, Hash Table, Binary Search, Dynamic Programming, Sorting."
date: "2026-08-15"
category: "dsa-patterns"
tags: ["longest-square-streak-in-an-array", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Longest Square Streak in an Array

You're given an array of integers and need to find the longest subsequence where, after sorting, each element is the square of the previous one. The challenge is that elements can appear in any order in the original array, and we need to efficiently find these "square chains" without checking every possible subsequence.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 3, 6, 16, 8, 2]`

We need to find the longest chain where each number is the square of the previous one. Let's think about potential chains:

1. Start with 2: 2 → 4 → 16 (2²=4, 4²=16) → length 3
2. Start with 3: 3 → 9 (but 9 isn't in the array) → length 1
3. Start with 4: 4 → 16 → length 2
4. Start with 6: 6 → 36 (not in array) → length 1
5. Start with 8: 8 → 64 (not in array) → length 1
6. Start with 16: 16 → 256 (not in array) → length 1

The longest chain is 2→4→16 with length 3. But how do we find this efficiently?

Key insight: We can sort the array and use a hash map to track chain lengths. For each number, if its square root exists in our map, we can extend that chain.

Sorted array: `[2, 3, 4, 6, 8, 16]`

Process each number:

- 2: No square root exists → chain length = 1
- 3: No square root exists → chain length = 1
- 4: √4 = 2 exists with length 1 → chain length = 2
- 6: √6 ≈ 2.45 (not integer) → chain length = 1
- 8: √8 ≈ 2.83 (not integer) → chain length = 1
- 16: √16 = 4 exists with length 2 → chain length = 3

We find the maximum chain length is 3.

## Brute Force Approach

A naive approach would be to generate all possible subsequences, sort each one, and check if it forms a valid square streak. This is extremely inefficient:

1. Generate all 2^n possible subsequences
2. For each subsequence, sort it (O(k log k) where k is subsequence length)
3. Check if sorted subsequence forms a square streak

The time complexity would be O(2^n × n log n), which is completely impractical for arrays of any reasonable size.

Even a slightly better brute force would be to try every possible starting number and build chains by repeatedly squaring and checking if the result exists in the array. However, this still has issues with duplicates and requires careful handling of when to stop.

## Optimized Approach

The key insight is that we can think of this as finding connected components in a graph where edges connect numbers to their squares. Here's the step-by-step reasoning:

1. **Sort the array** - This allows us to process numbers in increasing order, ensuring we always build chains from smallest to largest.

2. **Use a hash map to store chain lengths** - For each number, we want to know the length of the chain ending at that number. If we find a number's square root in our map, we can extend that chain.

3. **Handle perfect squares only** - We only care about numbers that are perfect squares of other numbers in the array. For each number `x`, we check if `sqrt(x)` exists and is an integer.

4. **Find the maximum chain length** - Track the longest chain we find, but remember we need at least length 2 for a valid streak.

5. **Handle duplicates carefully** - If a number appears multiple times, we need to decide how to handle it. Typically, we can use a frequency map first, then process unique numbers in sorted order.

The algorithm:

1. Create a set from the array for O(1) lookups
2. Sort the unique values (or sort the array and skip duplicates)
3. For each number in sorted order:
   - Calculate its square root
   - If the square root exists in our chain length map, extend the chain
   - Otherwise, start a new chain of length 1
4. Track the maximum chain length ≥ 2

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def longestSquareStreak(nums):
    """
    Find the longest subsequence where each element is the square of the previous one.

    Approach:
    1. Use a set for O(1) lookups of numbers in the array
    2. Sort the array to process numbers in increasing order
    3. Use a dictionary to track the longest chain ending at each number
    4. For each number, check if its square root exists and extend the chain
    5. Return the maximum chain length ≥ 2, or -1 if none exists
    """
    # Step 1: Create a set for O(1) lookups
    num_set = set(nums)

    # Step 2: Sort the array to process in increasing order
    nums.sort()

    # Step 3: Dictionary to store the longest chain ending at each number
    dp = {}
    max_streak = 0

    # Step 4: Process each number in sorted order
    for num in nums:
        # Calculate the square root
        sqrt_num = int(num ** 0.5)

        # Check if this number is a perfect square and its square root exists
        if sqrt_num * sqrt_num == num and sqrt_num in dp:
            # Extend the chain from the square root
            dp[num] = dp[sqrt_num] + 1
        else:
            # Start a new chain
            dp[num] = 1

        # Update the maximum streak found so far
        max_streak = max(max_streak, dp[num])

    # Step 5: Return the result (must be at least 2)
    return max_streak if max_streak >= 2 else -1
```

```javascript
// Time: O(n log n) | Space: O(n)
function longestSquareStreak(nums) {
  /**
   * Find the longest subsequence where each element is the square of the previous one.
   *
   * Approach:
   * 1. Use a Set for O(1) lookups of numbers in the array
   * 2. Sort the array to process numbers in increasing order
   * 3. Use a Map to track the longest chain ending at each number
   * 4. For each number, check if its square root exists and extend the chain
   * 5. Return the maximum chain length ≥ 2, or -1 if none exists
   */

  // Step 1: Create a Set for O(1) lookups
  const numSet = new Set(nums);

  // Step 2: Sort the array in ascending order
  nums.sort((a, b) => a - b);

  // Step 3: Map to store the longest chain ending at each number
  const dp = new Map();
  let maxStreak = 0;

  // Step 4: Process each number in sorted order
  for (const num of nums) {
    // Calculate the square root
    const sqrtNum = Math.floor(Math.sqrt(num));

    // Check if this number is a perfect square and its square root exists in our map
    if (sqrtNum * sqrtNum === num && dp.has(sqrtNum)) {
      // Extend the chain from the square root
      dp.set(num, dp.get(sqrtNum) + 1);
    } else {
      // Start a new chain
      dp.set(num, 1);
    }

    // Update the maximum streak found so far
    maxStreak = Math.max(maxStreak, dp.get(num));
  }

  // Step 5: Return the result (must be at least 2)
  return maxStreak >= 2 ? maxStreak : -1;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int longestSquareStreak(int[] nums) {
        /**
         * Find the longest subsequence where each element is the square of the previous one.
         *
         * Approach:
         * 1. Use a HashSet for O(1) lookups of numbers in the array
         * 2. Sort the array to process numbers in increasing order
         * 3. Use a HashMap to track the longest chain ending at each number
         * 4. For each number, check if its square root exists and extend the chain
         * 5. Return the maximum chain length ≥ 2, or -1 if none exists
         */

        // Step 1: Create a HashSet for O(1) lookups
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        // Step 2: Sort the array
        Arrays.sort(nums);

        // Step 3: HashMap to store the longest chain ending at each number
        Map<Integer, Integer> dp = new HashMap<>();
        int maxStreak = 0;

        // Step 4: Process each number in sorted order
        for (int num : nums) {
            // Calculate the square root
            int sqrtNum = (int) Math.sqrt(num);

            // Check if this number is a perfect square and its square root exists
            if (sqrtNum * sqrtNum == num && dp.containsKey(sqrtNum)) {
                // Extend the chain from the square root
                dp.put(num, dp.get(sqrtNum) + 1);
            } else {
                // Start a new chain
                dp.put(num, 1);
            }

            // Update the maximum streak found so far
            maxStreak = Math.max(maxStreak, dp.get(num));
        }

        // Step 5: Return the result (must be at least 2)
        return maxStreak >= 2 ? maxStreak : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- Processing each element takes O(n) time
- The dominant factor is the sorting, so overall O(n log n)

**Space Complexity: O(n)**

- We use a set/hashmap to store all elements: O(n)
- We use a dictionary/map to store chain lengths: O(n)
- Total space: O(n) + O(n) = O(n)

## Common Mistakes

1. **Not checking for perfect squares correctly**: Simply taking the square root and checking if it's an integer isn't enough due to floating-point precision. Always verify by squaring the integer square root back and comparing with the original number.

2. **Forgetting to handle the minimum length requirement**: The problem requires streaks of length at least 2. Candidates often return the maximum chain length without checking if it's ≥ 2, or they forget to return -1 when no valid streak exists.

3. **Processing numbers in wrong order**: If you don't sort the array, you might process a number before its square root, missing the opportunity to extend chains. Always process in increasing order.

4. **Not handling duplicates properly**: If the array has duplicates like `[2, 2, 4]`, you need to decide whether to use each number once or multiple times. The solution above handles this correctly by processing all occurrences.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dynamic Programming with hash maps**: Similar to "Longest Increasing Subsequence" (LeetCode 300), but with a specific transformation rule (squaring) instead of simple increasing order.

2. **Graph connectivity in disguise**: The square relationship creates implicit edges between numbers. This pattern appears in problems like "Longest Consecutive Sequence" (LeetCode 128), where you find the longest chain of consecutive numbers.

3. **Number theory meets DP**: Problems that involve mathematical relationships between numbers, like "Ugly Number II" (LeetCode 264) or "Perfect Squares" (LeetCode 279), often use similar approaches with hash maps and sorted processing.

## Key Takeaways

1. **When you see "chain" or "sequence" problems with transformation rules**, think about sorting and using a hash map to track chain lengths ending at each element.

2. **For problems involving mathematical relationships**, always verify integer properties carefully (perfect squares, integer division results, etc.) to avoid floating-point issues.

3. **The combination of sorting + hash map** is powerful for finding chains or sequences where elements can be in any order in the input but need to be processed in a specific logical order.

[Practice this problem on CodeJeet](/problem/longest-square-streak-in-an-array)
