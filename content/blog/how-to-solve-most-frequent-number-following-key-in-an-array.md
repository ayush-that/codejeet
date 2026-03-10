---
title: "How to Solve Most Frequent Number Following Key In an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Most Frequent Number Following Key In an Array. Easy difficulty, 59.4% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-07-29"
category: "dsa-patterns"
tags: ["most-frequent-number-following-key-in-an-array", "array", "hash-table", "counting", "easy"]
---

# How to Solve Most Frequent Number Following Key In an Array

This problem asks us to find which number appears most frequently immediately after occurrences of a given `key` in an array. While conceptually straightforward, it requires careful attention to array bounds and counting logic. The challenge lies in efficiently tracking frequencies while avoiding off-by-one errors when checking the element following each `key`.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [2,1,3,2,2,1,2,3]` with `key = 2`.

We need to examine each occurrence of `2` and see what number follows it:

1. **Index 0**: `nums[0] = 2` → Check `nums[1] = 1` → Count for `1` becomes 1
2. **Index 3**: `nums[3] = 2` → Check `nums[4] = 2` → Count for `2` becomes 1
3. **Index 5**: `nums[5] = 1` (not key, skip)
4. **Index 6**: `nums[6] = 2` → Check `nums[7] = 3` → Count for `3` becomes 1

Our frequency counts: `{1: 1, 2: 1, 3: 1}`. We have a tie! According to the problem, we return the number with the **highest count**, and if there's a tie, we return the **smallest** number. So we return `1`.

Notice two important details:

- We only check indices where `i < len(nums) - 1` to avoid index out of bounds
- We need to track both the maximum frequency and the smallest number in case of ties

## Brute Force Approach

A naive approach might involve scanning the array multiple times or using nested loops. For example:

1. Find all indices where `nums[i] == key`
2. For each such index, if `i + 1` exists, record `nums[i + 1]`
3. Count frequencies of all recorded numbers
4. Find the maximum frequency and handle ties

While this would work, it's inefficient because we're making multiple passes through the data. More importantly, this approach doesn't leverage the fact that we can count frequencies in a single pass, which is the key insight for optimization.

## Optimal Solution

The optimal solution uses a single pass through the array with a hash map to track frequencies. We iterate through the array, and whenever we find the `key`, we check if there's a following element. If so, we increment its count in our frequency map. We simultaneously track the current maximum frequency and handle ties by keeping the smallest number.

<div class="code-group">

```python
# Time: O(n) where n is the length of nums
# Space: O(k) where k is the number of unique numbers following key
def mostFrequent(nums, key):
    """
    Find the number that appears most frequently immediately after key.

    Args:
        nums: List of integers
        key: The integer to search for in nums

    Returns:
        The integer that appears most frequently after key
    """
    # Dictionary to store frequency of numbers following key
    freq = {}

    # Track the current best answer and its frequency
    max_freq = 0
    result = None

    # Iterate through the array, stopping before the last element
    # since we need to check nums[i+1] when we find key
    for i in range(len(nums) - 1):
        # Check if current element is the key
        if nums[i] == key:
            # Get the number immediately after key
            following_num = nums[i + 1]

            # Update frequency count for this number
            freq[following_num] = freq.get(following_num, 0) + 1

            # Update result if we found a new maximum frequency,
            # or same frequency but smaller number (for tie-breaking)
            current_freq = freq[following_num]
            if (current_freq > max_freq or
                (current_freq == max_freq and following_num < result)):
                max_freq = current_freq
                result = following_num

    return result
```

```javascript
// Time: O(n) where n is the length of nums
// Space: O(k) where k is the number of unique numbers following key
function mostFrequent(nums, key) {
  /**
   * Find the number that appears most frequently immediately after key.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} key - The integer to search for in nums
   * @return {number} The integer that appears most frequently after key
   */

  // Map to store frequency of numbers following key
  const freq = new Map();

  // Track the current best answer and its frequency
  let maxFreq = 0;
  let result = null;

  // Iterate through the array, stopping before the last element
  // since we need to check nums[i+1] when we find key
  for (let i = 0; i < nums.length - 1; i++) {
    // Check if current element is the key
    if (nums[i] === key) {
      // Get the number immediately after key
      const followingNum = nums[i + 1];

      // Update frequency count for this number
      const currentFreq = (freq.get(followingNum) || 0) + 1;
      freq.set(followingNum, currentFreq);

      // Update result if we found a new maximum frequency,
      // or same frequency but smaller number (for tie-breaking)
      if (currentFreq > maxFreq || (currentFreq === maxFreq && followingNum < result)) {
        maxFreq = currentFreq;
        result = followingNum;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is the length of nums
// Space: O(k) where k is the number of unique numbers following key
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int mostFrequent(int[] nums, int key) {
        /**
         * Find the number that appears most frequently immediately after key.
         *
         * @param nums Array of integers
         * @param key The integer to search for in nums
         * @return The integer that appears most frequently after key
         */

        // HashMap to store frequency of numbers following key
        Map<Integer, Integer> freq = new HashMap<>();

        // Track the current best answer and its frequency
        int maxFreq = 0;
        int result = -1;

        // Iterate through the array, stopping before the last element
        // since we need to check nums[i+1] when we find key
        for (int i = 0; i < nums.length - 1; i++) {
            // Check if current element is the key
            if (nums[i] == key) {
                // Get the number immediately after key
                int followingNum = nums[i + 1];

                // Update frequency count for this number
                int currentFreq = freq.getOrDefault(followingNum, 0) + 1;
                freq.put(followingNum, currentFreq);

                // Update result if we found a new maximum frequency,
                // or same frequency but smaller number (for tie-breaking)
                if (currentFreq > maxFreq ||
                    (currentFreq == maxFreq && followingNum < result)) {
                    maxFreq = currentFreq;
                    result = followingNum;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, examining each element once
- For each element, we perform O(1) operations (hash map lookups/insertions)
- The loop runs n-1 times, which simplifies to O(n)

**Space Complexity: O(k) where k is the number of unique numbers following key**

- In the worst case, every element following `key` could be unique, giving us O(n) space
- In practice, it's usually much less since numbers often repeat
- We only store counts for numbers that actually appear after `key`

## Common Mistakes

1. **Index out of bounds error**: Forgetting to stop the loop at `len(nums) - 1` and trying to access `nums[i + 1]` when `i` is the last index. Always check array bounds when accessing `i+1`.

2. **Incorrect tie-breaking**: The problem states that if multiple numbers have the same highest frequency, we should return the smallest one. Candidates often forget this requirement or implement it incorrectly by returning the first one encountered instead of the smallest.

3. **Not handling the case where key appears at the end**: When `key` is the last element, there's no following number to count. Our solution correctly handles this by stopping the loop early.

4. **Using inefficient data structures**: Some candidates might use arrays of size equal to the maximum value in `nums`, which could be inefficient if values are large. A hash map is the right choice here.

## When You'll See This Pattern

This problem uses the **frequency counting with hash map** pattern, which appears in many LeetCode problems:

1. **Two Sum (Easy)**: Uses a hash map to track numbers we've seen and their indices to find pairs that sum to a target.

2. **Sort Array by Increasing Frequency (Easy)**: Requires counting frequencies of elements, then sorting based on those frequencies - very similar to the counting aspect of our problem.

3. **Majority Element (Easy)**: Finds the element that appears more than n/2 times using frequency counting (though it has a more optimal Boyer-Moore voting algorithm solution).

The core pattern is: when you need to track how often things appear, especially when you need to find maximums or make comparisons based on frequency, reach for a hash map first.

## Key Takeaways

- **Single-pass solutions are often optimal**: When you can process data and update your answer in one pass, you usually have an optimal time complexity solution.

- **Hash maps are your friend for frequency problems**: Any time you need to count occurrences or track frequencies, consider using a hash map/dictionary for O(1) lookups and updates.

- **Always check edge cases**: Array bounds, empty inputs, and tie conditions are common pitfalls. Explicitly test these cases mentally before writing code.

Related problems: [Sort Array by Increasing Frequency](/problem/sort-array-by-increasing-frequency)
