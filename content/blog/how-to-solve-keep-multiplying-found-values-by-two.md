---
title: "How to Solve Keep Multiplying Found Values by Two — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Keep Multiplying Found Values by Two. Easy difficulty, 75.1% acceptance rate. Topics: Array, Hash Table, Sorting, Simulation."
date: "2028-02-25"
category: "dsa-patterns"
tags: ["keep-multiplying-found-values-by-two", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Keep Multiplying Found Values by Two

This problem asks us to repeatedly search for a starting value in an array, doubling it each time we find it, until we can no longer find the current value. While the concept is straightforward, the challenge lies in implementing an efficient search mechanism that avoids repeatedly scanning the entire array. The interesting part is recognizing that we need to track which values exist in the array to avoid O(n²) time complexity.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [5, 3, 6, 1, 12]` and `original = 3`.

**Step 1:** Search for 3 in the array. We find it at index 1.

- Multiply original by 2: `original = 3 × 2 = 6`

**Step 2:** Search for 6 in the array. We find it at index 2.

- Multiply original by 2: `original = 6 × 2 = 12`

**Step 3:** Search for 12 in the array. We find it at index 4.

- Multiply original by 2: `original = 12 × 2 = 24`

**Step 4:** Search for 24 in the array. It doesn't exist.

- Return the current original value: `24`

The process stops when we can't find the current value in the array. Notice that we need to search the array multiple times, which could become inefficient if we do a linear scan each time.

## Brute Force Approach

The most straightforward approach is to repeatedly scan the entire array looking for the current value:

1. Start with the given `original` value
2. While `original` exists in `nums`:
   - Multiply `original` by 2
3. Return the final `original` value

The problem with this approach is the repeated linear searches. In the worst case, if we have an array like `[1, 2, 4, 8, 16, ..., 2ⁿ]` and start with `original = 1`, we would:

- Search for 1 (n operations)
- Search for 2 (n operations)
- Search for 4 (n operations)
- ...
- Search for 2ⁿ (n operations)

This gives us O(n²) time complexity, which is inefficient for large arrays. The key insight is that we need a faster way to check if a value exists in the array.

## Optimal Solution

The optimal solution uses a hash set to achieve O(1) lookups. We first store all values from `nums` in a set, then repeatedly check if the current `original` exists in the set. When we find it, we double it and continue; when we don't, we return the current value.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findFinalValue(nums, original):
    """
    Repeatedly double original while it exists in nums.

    Args:
        nums: List of integers to search through
        original: Starting value to search for

    Returns:
        Final value after no more doublings can be performed
    """
    # Step 1: Convert nums to a set for O(1) lookups
    # This is the key optimization - checking if a value exists
    # in a set is much faster than checking in a list
    num_set = set(nums)

    # Step 2: Keep doubling original while it exists in the set
    # We use a while loop because we don't know how many times
    # we'll need to double
    while original in num_set:
        # Double the original value
        # This creates the next value to search for
        original *= 2

    # Step 3: Return the final value when it's no longer in the set
    return original
```

```javascript
// Time: O(n) | Space: O(n)
function findFinalValue(nums, original) {
  /**
   * Repeatedly double original while it exists in nums.
   *
   * @param {number[]} nums - Array of integers to search through
   * @param {number} original - Starting value to search for
   * @return {number} Final value after no more doublings can be performed
   */

  // Step 1: Convert nums to a Set for O(1) lookups
  // JavaScript Sets provide efficient existence checks
  const numSet = new Set(nums);

  // Step 2: Keep doubling original while it exists in the set
  // The while loop continues as long as original is in the set
  while (numSet.has(original)) {
    // Double the original value
    // This creates the next value to search for
    original *= 2;
  }

  // Step 3: Return the final value when it's no longer in the set
  return original;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int findFinalValue(int[] nums, int original) {
        /**
         * Repeatedly double original while it exists in nums.
         *
         * @param nums Array of integers to search through
         * @param original Starting value to search for
         * @return Final value after no more doublings can be performed
         */

        // Step 1: Convert nums to a HashSet for O(1) lookups
        // HashSets provide constant-time average case for contains()
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        // Step 2: Keep doubling original while it exists in the set
        // The loop condition checks if the set contains original
        while (numSet.contains(original)) {
            // Double the original value
            // This creates the next value to search for
            original *= 2;
        }

        // Step 3: Return the final value when it's no longer in the set
        return original;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Creating the hash set from `nums` takes O(n) time, where n is the length of the array
- Each lookup in the hash set takes O(1) average time
- In the worst case, we might perform O(log M) doublings (where M is the maximum value), but since log M is much smaller than n for reasonable inputs, the dominant factor is O(n)

**Space Complexity: O(n)**

- We need to store all elements from `nums` in a hash set
- In the worst case, this requires O(n) additional space
- The space could be reduced to O(1) by sorting the array and using binary search, but that would increase time complexity to O(n log n)

## Common Mistakes

1. **Using linear search in the loop**: The most common mistake is to use `original in nums` (Python) or similar linear search inside the while loop. This creates O(n²) time complexity. Always remember: if you need to check existence multiple times, use a hash set.

2. **Modifying the original array**: Some candidates try to remove elements from the array as they find them. This is inefficient because removing from the middle of an array takes O(n) time. Stick to using a separate data structure.

3. **Infinite loop with zero**: If `original = 0`, doubling it will always give 0. However, since the problem guarantees positive integers (based on typical constraints), this isn't an issue. Still, it's good to be aware of edge cases.

4. **Forgetting to handle duplicates**: The hash set approach automatically handles duplicates since sets only store unique values. If you use a different approach, make sure to account for duplicate values in the array.

## When You'll See This Pattern

This problem uses the **"existence checking with hash set"** pattern, which appears in many array problems:

1. **Two Sum**: Uses a hash map to store values we've seen and check if their complement exists.
2. **Contains Duplicate**: Uses a hash set to check if we've seen a value before.
3. **Intersection of Two Arrays**: Uses hash sets to find common elements between arrays efficiently.

The key insight is that when you need to check if elements exist in a collection multiple times, converting to a hash-based data structure (set or map) for O(1) lookups is often the optimal approach.

## Key Takeaways

1. **Convert to hash sets for repeated existence checks**: If you need to check if values exist in an array multiple times, convert the array to a set first. The O(n) upfront cost pays off with O(1) lookups.

2. **Recognize the doubling pattern**: Problems involving repeated transformations (like doubling) often have a logarithmic number of steps relative to the maximum value, making while loops efficient.

3. **Think about worst-case scenarios**: Always consider what happens with sorted arrays, duplicate values, and edge cases like minimum/maximum values.

Related problems: [Largest Number At Least Twice of Others](/problem/largest-number-at-least-twice-of-others), [Check If N and Its Double Exist](/problem/check-if-n-and-its-double-exist)
