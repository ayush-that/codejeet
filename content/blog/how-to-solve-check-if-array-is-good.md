---
title: "How to Solve Check if Array is Good — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Array is Good. Easy difficulty, 48.7% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2028-03-18"
category: "dsa-patterns"
tags: ["check-if-array-is-good", "array", "hash-table", "sorting", "easy"]
---

# How to Solve "Check if Array is Good"

This problem asks us to determine if a given array is a permutation of a special pattern: `[1, 2, ..., n-1, n, n]`. The tricky part is that we need to verify three conditions simultaneously: the array has exactly `n+1` elements, contains numbers 1 through `n-1` exactly once, and contains the number `n` exactly twice. The challenge lies in efficiently checking all these constraints without sorting (which would be O(n log n)) when we can do it in O(n) time.

## Visual Walkthrough

Let's walk through an example: `nums = [2, 1, 3, 3]`

**Step 1: Determine `n`**
The array length is 4, so `n + 1 = 4`, which means `n = 3`.

**Step 2: Check expected elements**
For `n = 3`, we expect:

- Numbers 1 through `n-1` (1 through 2) exactly once each
- Number `n` (3) exactly twice

**Step 3: Count occurrences**
Let's count what we actually have:

- 1 appears once ✓
- 2 appears once ✓
- 3 appears twice ✓
- No other numbers appear

**Step 4: Verify all conditions**

1. Length is `n+1` = 4 ✓
2. Contains 1 through `n-1` exactly once ✓
3. Contains `n` exactly twice ✓

Since all conditions are met, `[2, 1, 3, 3]` is a good array.

Now let's try a failing example: `nums = [1, 3, 3, 3]`

- Length is 4, so `n = 3`
- We expect: 1, 2, 3, 3
- What we have: 1 appears once, 2 is missing, 3 appears three times
- This fails because 2 is missing and 3 appears too many times

## Brute Force Approach

A naive approach would be to:

1. Sort the array
2. Check if length is `n+1` where `n` is the last element
3. Verify the sorted array matches `[1, 2, ..., n-1, n, n]`

However, this has O(n log n) time complexity due to sorting, and we can do better. Another brute force approach would use nested loops to count occurrences, resulting in O(n²) time complexity.

The main issue with brute force is inefficiency. We need to check frequency counts, and doing this with nested loops or multiple passes without proper data structures leads to poor performance.

## Optimal Solution

The optimal solution uses a frequency counter (hash map) to track occurrences in a single pass. Here's the reasoning:

1. **Find `n`**: Since a good array has length `n+1`, we can compute `n = len(nums) - 1`
2. **Validate `n`**: The maximum element should equal `n`
3. **Count frequencies**: Use a hash map to count occurrences of each number
4. **Verify conditions**:
   - All numbers from 1 to `n-1` appear exactly once
   - Number `n` appears exactly twice
   - No other numbers appear

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isGood(nums):
    """
    Check if nums is a permutation of [1, 2, ..., n-1, n, n]

    Steps:
    1. Compute n from array length
    2. Create frequency counter
    3. Verify each number's frequency matches expected pattern
    """
    n = len(nums) - 1  # Step 1: Good array has length n+1

    # Edge case: if n <= 0, array cannot be good
    if n <= 0:
        return False

    freq = {}  # Step 2: Frequency counter

    # Count occurrences of each number
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 3: Verify conditions
    # Check numbers 1 through n-1 appear exactly once
    for i in range(1, n):
        if freq.get(i, 0) != 1:
            return False

    # Check number n appears exactly twice
    if freq.get(n, 0) != 2:
        return False

    # Ensure no other numbers exist (implicitly checked above)
    return True
```

```javascript
// Time: O(n) | Space: O(n)
function isGood(nums) {
  /**
   * Check if nums is a permutation of [1, 2, ..., n-1, n, n]
   *
   * Steps:
   * 1. Compute n from array length
   * 2. Create frequency counter
   * 3. Verify each number's frequency matches expected pattern
   */
  const n = nums.length - 1; // Step 1: Good array has length n+1

  // Edge case: if n <= 0, array cannot be good
  if (n <= 0) {
    return false;
  }

  const freq = new Map(); // Step 2: Frequency counter

  // Count occurrences of each number
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 3: Verify conditions
  // Check numbers 1 through n-1 appear exactly once
  for (let i = 1; i < n; i++) {
    if (freq.get(i) !== 1) {
      return false;
    }
  }

  // Check number n appears exactly twice
  if (freq.get(n) !== 2) {
    return false;
  }

  // Ensure no other numbers exist (implicitly checked above)
  return true;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isGood(int[] nums) {
        /**
         * Check if nums is a permutation of [1, 2, ..., n-1, n, n]
         *
         * Steps:
         * 1. Compute n from array length
         * 2. Create frequency counter
         * 3. Verify each number's frequency matches expected pattern
         */
        int n = nums.length - 1;  // Step 1: Good array has length n+1

        // Edge case: if n <= 0, array cannot be good
        if (n <= 0) {
            return false;
        }

        Map<Integer, Integer> freq = new HashMap<>();  // Step 2: Frequency counter

        // Count occurrences of each number
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 3: Verify conditions
        // Check numbers 1 through n-1 appear exactly once
        for (int i = 1; i < n; i++) {
            if (freq.getOrDefault(i, 0) != 1) {
                return false;
            }
        }

        // Check number n appears exactly twice
        if (freq.getOrDefault(n, 0) != 2) {
            return false;
        }

        // Ensure no other numbers exist (implicitly checked above)
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to build the frequency counter: O(n)
- We iterate from 1 to n-1 to check frequencies: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The frequency counter stores at most n entries (one for each distinct number)
- In the worst case, all numbers are distinct (though this would fail the "good" condition), we still store n entries
- Therefore, space complexity is O(n)

## Common Mistakes

1. **Forgetting to validate `n`**: Some solutions assume `n = len(nums) - 1` without checking if the maximum element actually equals `n`. While our solution implicitly checks this through frequency validation, explicitly checking `max(nums) == n` can provide earlier failure detection.

2. **Off-by-one errors in the loop**: When checking numbers 1 through `n-1`, candidates might write `range(1, n)` (correct) instead of `range(1, n+1)` (incorrect). Remember: Python's `range(1, n)` goes from 1 to n-1 inclusive.

3. **Not handling the case when `n = 0`**: If the input array has length 1, then `n = 0`. The array `[0]` is not good because `n` should be at least 1. Always check for this edge case.

4. **Using sorting unnecessarily**: While sorting and comparing to `[1, 2, ..., n, n]` works, it's O(n log n) time complexity. Interviewers expect the O(n) solution using a frequency counter.

## When You'll See This Pattern

This problem combines frequency counting with pattern validation, a common pattern in array problems:

1. **Find All Duplicates in an Array (LeetCode 442)**: Similar frequency counting to find elements appearing twice.
2. **Set Mismatch (LeetCode 645)**: Finding duplicate and missing numbers in an array of 1 to n.
3. **First Missing Positive (LeetCode 41)**: Validating array contents against expected patterns.

The core technique is using a hash map to count frequencies and then validating against expected constraints. This pattern appears whenever you need to verify distribution properties of array elements.

## Key Takeaways

1. **Frequency counters solve many validation problems**: When you need to check if elements appear a specific number of times, reach for a hash map to count occurrences in O(n) time.

2. **Derive constraints from the problem statement**: Here, we derived `n = len(nums) - 1` from the definition of a "good" array. Always look for relationships between different properties in the problem.

3. **Check edge cases systematically**: For this problem, consider: empty array, single element array, arrays with negative numbers, arrays with numbers outside the 1..n range.

[Practice this problem on CodeJeet](/problem/check-if-array-is-good)
