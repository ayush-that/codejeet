---
title: "How to Solve Find Lucky Integer in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Lucky Integer in an Array. Easy difficulty, 75.5% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-11-06"
category: "dsa-patterns"
tags: ["find-lucky-integer-in-an-array", "array", "hash-table", "counting", "easy"]
---

# How to Solve Find Lucky Integer in an Array

This problem asks us to find the largest "lucky integer" in an array, where a lucky integer is defined as a number whose frequency in the array equals its value. While conceptually straightforward, this problem tests your ability to efficiently count frequencies and filter results—a fundamental skill for array manipulation problems.

What makes this problem interesting is that we need to find numbers that satisfy a specific relationship between their value and their count. The challenge lies in doing this efficiently while handling the "largest" requirement correctly.

## Visual Walkthrough

Let's trace through an example: `arr = [2,2,3,3,3,4]`

**Step 1: Count frequencies**

- 2 appears 2 times
- 3 appears 3 times
- 4 appears 1 time

**Step 2: Check which numbers are "lucky"**

- For 2: frequency = 2, value = 2 → lucky ✓
- For 3: frequency = 3, value = 3 → lucky ✓
- For 4: frequency = 1, value = 4 → not lucky (1 ≠ 4)

**Step 3: Find the largest lucky integer**
We have two lucky integers: 2 and 3. The largest is 3.

**Step 4: Return result**
Return 3

Another example: `arr = [1,2,2,3,3,3]`

- 1 appears 1 time → lucky ✓
- 2 appears 2 times → lucky ✓
- 3 appears 3 times → lucky ✓
  Largest lucky integer is 3.

## Brute Force Approach

A naive approach would be to check each unique number in the array by:

1. For each number, count how many times it appears (by scanning the entire array)
2. Check if the count equals the number value
3. Track the maximum such number

This approach has O(n²) time complexity because for each unique number (up to n), we scan the entire array (n operations). For an array like `[1,2,3,4,5,...,n]`, we'd do n \* n = n² operations.

While this would work for small inputs, it's inefficient for larger arrays. The main insight is that we're repeatedly counting the same numbers, which is wasteful.

## Optimal Solution

The optimal solution uses a hash map (dictionary) to count frequencies in a single pass, then checks which numbers satisfy the lucky condition. We can either:

1. Count all frequencies first, then check each number
2. Or maintain the maximum lucky integer while counting

The first approach is clearer and still efficient. Here's the step-by-step reasoning:

1. **Count frequencies**: Use a hash map to store how many times each number appears
2. **Find lucky integers**: For each number in our frequency map, check if frequency == value
3. **Track maximum**: Keep track of the largest lucky integer found
4. **Handle no lucky integers**: Return -1 if none found

<div class="code-group">

```python
# Time: O(n) | Space: O(k) where k is number of unique elements
def findLucky(arr):
    """
    Find the largest lucky integer in the array.
    A lucky integer is a number whose frequency equals its value.
    """
    # Step 1: Count frequencies of each number
    freq = {}
    for num in arr:
        # Increment count for this number, defaulting to 0 if not seen
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Initialize result to -1 (default if no lucky integer found)
    max_lucky = -1

    # Step 3: Check each number in our frequency map
    for num, count in freq.items():
        # Step 4: Check if this number is lucky (frequency equals value)
        if num == count:
            # Step 5: Update max_lucky if this number is larger
            max_lucky = max(max_lucky, num)

    # Step 6: Return the largest lucky integer (or -1 if none found)
    return max_lucky
```

```javascript
// Time: O(n) | Space: O(k) where k is number of unique elements
function findLucky(arr) {
  /**
   * Find the largest lucky integer in the array.
   * A lucky integer is a number whose frequency equals its value.
   */

  // Step 1: Count frequencies of each number
  const freq = new Map();
  for (const num of arr) {
    // Increment count for this number, defaulting to 0 if not seen
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Initialize result to -1 (default if no lucky integer found)
  let maxLucky = -1;

  // Step 3: Check each number in our frequency map
  for (const [num, count] of freq) {
    // Step 4: Check if this number is lucky (frequency equals value)
    if (num === count) {
      // Step 5: Update maxLucky if this number is larger
      maxLucky = Math.max(maxLucky, num);
    }
  }

  // Step 6: Return the largest lucky integer (or -1 if none found)
  return maxLucky;
}
```

```java
// Time: O(n) | Space: O(k) where k is number of unique elements
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int findLucky(int[] arr) {
        /**
         * Find the largest lucky integer in the array.
         * A lucky integer is a number whose frequency equals its value.
         */

        // Step 1: Count frequencies of each number
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : arr) {
            // Increment count for this number, defaulting to 0 if not seen
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Initialize result to -1 (default if no lucky integer found)
        int maxLucky = -1;

        // Step 3: Check each number in our frequency map
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();

            // Step 4: Check if this number is lucky (frequency equals value)
            if (num == count) {
                // Step 5: Update maxLucky if this number is larger
                maxLucky = Math.max(maxLucky, num);
            }
        }

        // Step 6: Return the largest lucky integer (or -1 if none found)
        return maxLucky;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to count frequencies: O(n)
- We then iterate through the frequency map: O(k) where k ≤ n
- Total: O(n + k) = O(n) since k ≤ n

**Space Complexity: O(k)** where k is the number of unique elements

- We store each unique number and its count in a hash map
- In the worst case (all elements are unique), k = n, so O(n)
- In the best case (all elements are the same), k = 1, so O(1)

## Common Mistakes

1. **Forgetting to initialize max_lucky to -1**: If no lucky integer exists, we must return -1. Some candidates initialize to 0, which is incorrect because 0 could be a valid lucky integer (though not in this problem since array values are positive).

2. **Checking numbers that aren't in the frequency map**: Some candidates iterate through the original array instead of the frequency map. This causes duplicate work and can lead to incorrect comparisons if the same number appears multiple times.

3. **Not handling the "largest" requirement correctly**: When finding multiple lucky integers, you must track the maximum. A simple `if (num == count) return num` would return the first lucky integer found, not necessarily the largest.

4. **Using array instead of hash map for counting**: Since we don't know the maximum value in the array, we can't efficiently allocate an array for counting. A hash map handles arbitrary integer values efficiently.

## When You'll See This Pattern

This frequency counting pattern appears in many array problems:

1. **Majority Element (LeetCode 169)**: Find the element that appears more than n/2 times. Uses frequency counting to find the most common element.

2. **Single Number (LeetCode 136)**: Find the element that appears exactly once. While it has a more optimal bit manipulation solution, frequency counting is a valid approach.

3. **Top K Frequent Elements (LeetCode 347)**: Find the k most frequent elements. Builds on frequency counting by adding sorting or heap operations.

4. **Valid Anagram (LeetCode 242)**: Check if two strings are anagrams by counting character frequencies.

The core pattern is: when you need to analyze how often elements appear, reach for a hash map to count frequencies in O(n) time.

## Key Takeaways

1. **Frequency counting with hash maps** is a fundamental technique for array problems where you need to analyze element occurrences.

2. **Always consider the relationship between data and metadata**—in this case, the relationship between a number's value and its frequency. Many problems involve checking conditions based on computed properties.

3. **Pay attention to ordering requirements** like "largest" or "smallest." These often require tracking an extremum while iterating, not just finding any match.

4. **Default return values matter**—when a problem says "return -1 if not found," initialize your result variable to -1 and only update it when you find a valid answer.

[Practice this problem on CodeJeet](/problem/find-lucky-integer-in-an-array)
