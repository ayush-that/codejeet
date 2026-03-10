---
title: "How to Solve Degree of an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Degree of an Array. Easy difficulty, 58.2% acceptance rate. Topics: Array, Hash Table."
date: "2028-03-04"
category: "dsa-patterns"
tags: ["degree-of-an-array", "array", "hash-table", "easy"]
---

# How to Solve Degree of an Array

The problem asks us to find the smallest contiguous subarray that contains all occurrences of the element(s) that appear most frequently in the array. What makes this interesting is that we need to track not just frequency, but also the positions where elements appear to calculate subarray lengths efficiently.

## Visual Walkthrough

Let's trace through example: `nums = [1, 2, 2, 3, 1]`

**Step 1: Find the degree**

- Count frequencies: 1 appears 2 times, 2 appears 2 times, 3 appears 1 time
- Degree = 2 (maximum frequency)

**Step 2: Find smallest subarray for each candidate**

- For element 1: First at index 0, last at index 4 → length = 4 - 0 + 1 = 5
- For element 2: First at index 1, last at index 2 → length = 2 - 1 + 1 = 2

**Step 3: Choose minimum length**

- Minimum length = min(5, 2) = 2
- The subarray `[2, 2]` has degree 2 and length 2

The key insight: For elements that achieve the maximum frequency, the smallest subarray containing all their occurrences is from their first to last appearance.

## Brute Force Approach

A naive approach would be:

1. Find the degree by counting frequencies
2. For each possible subarray (O(n²) pairs), count frequencies and check if degree matches
3. Track the minimum length of valid subarrays

This is O(n³) time (O(n²) subarrays × O(n) to count frequencies for each) and clearly inefficient. Even with optimization, checking all subarrays is O(n²), which is unnecessary.

What a candidate might try: Find all elements with max frequency, then for each, find their first and last positions by scanning the array repeatedly. This is O(n × k) where k is number of max-frequency elements, which could be O(n²) in worst case (all elements unique).

## Optimal Solution

The optimal solution uses three hash maps to track in one pass:

- `count`: frequency of each element
- `first`: first occurrence index of each element
- `last`: last occurrence index of each element

We maintain the maximum frequency (degree) as we iterate. After processing all elements, we find all elements with frequency equal to the degree and calculate their subarray lengths.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findShortestSubArray(nums):
    """
    Find smallest subarray with same degree as entire array.

    Args:
        nums: List of integers

    Returns:
        Minimum length of subarray with same degree
    """
    # Track frequency, first occurrence, and last occurrence
    count = {}
    first = {}
    last = {}

    # One pass to populate all dictionaries
    for i, num in enumerate(nums):
        # Update frequency count
        count[num] = count.get(num, 0) + 1

        # Record first occurrence (only if not seen before)
        if num not in first:
            first[num] = i

        # Always update last occurrence to current index
        last[num] = i

    # Find maximum frequency (degree of array)
    max_freq = max(count.values())

    # Initialize answer with maximum possible length
    min_length = len(nums)

    # Check each element that has frequency equal to max_freq
    for num in count:
        if count[num] == max_freq:
            # Calculate subarray length for this element
            # +1 because indices are inclusive
            length = last[num] - first[num] + 1
            min_length = min(min_length, length)

    return min_length
```

```javascript
// Time: O(n) | Space: O(n)
function findShortestSubArray(nums) {
  /**
   * Find smallest subarray with same degree as entire array.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Minimum length of subarray with same degree
   */
  // Track frequency, first occurrence, and last occurrence
  const count = {};
  const first = {};
  const last = {};

  // One pass to populate all objects
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Update frequency count
    count[num] = (count[num] || 0) + 1;

    // Record first occurrence (only if not seen before)
    if (first[num] === undefined) {
      first[num] = i;
    }

    // Always update last occurrence to current index
    last[num] = i;
  }

  // Find maximum frequency (degree of array)
  const maxFreq = Math.max(...Object.values(count));

  // Initialize answer with maximum possible length
  let minLength = nums.length;

  // Check each element that has frequency equal to maxFreq
  for (const num in count) {
    if (count[num] === maxFreq) {
      // Calculate subarray length for this element
      // +1 because indices are inclusive
      const length = last[num] - first[num] + 1;
      minLength = Math.min(minLength, length);
    }
  }

  return minLength;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int findShortestSubArray(int[] nums) {
        /**
         * Find smallest subarray with same degree as entire array.
         *
         * @param nums Array of integers
         * @return Minimum length of subarray with same degree
         */
        // Track frequency, first occurrence, and last occurrence
        Map<Integer, Integer> count = new HashMap<>();
        Map<Integer, Integer> first = new HashMap<>();
        Map<Integer, Integer> last = new HashMap<>();

        // One pass to populate all maps
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];

            // Update frequency count
            count.put(num, count.getOrDefault(num, 0) + 1);

            // Record first occurrence (only if not seen before)
            if (!first.containsKey(num)) {
                first.put(num, i);
            }

            // Always update last occurrence to current index
            last.put(num, i);
        }

        // Find maximum frequency (degree of array)
        int maxFreq = 0;
        for (int freq : count.values()) {
            maxFreq = Math.max(maxFreq, freq);
        }

        // Initialize answer with maximum possible length
        int minLength = nums.length;

        // Check each element that has frequency equal to maxFreq
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            int num = entry.getKey();
            int freq = entry.getValue();

            if (freq == maxFreq) {
                // Calculate subarray length for this element
                // +1 because indices are inclusive
                int length = last.get(num) - first.get(num) + 1;
                minLength = Math.min(minLength, length);
            }
        }

        return minLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to populate the hash maps: O(n)
- Finding the maximum frequency: O(k) where k is number of unique elements, which is ≤ n
- Finding minimum length among max-frequency elements: O(k)
- Total: O(n) + O(k) + O(k) = O(n)

**Space Complexity: O(n)**

- We store three hash maps, each potentially containing all unique elements
- In worst case (all elements unique), each map has n entries
- Total space: O(3n) = O(n)

## Common Mistakes

1. **Forgetting to handle single occurrence elements**: When an element appears only once, its subarray length should be 1 (last - first + 1 = 0 - 0 + 1 = 1). Some candidates mistakenly think they need to skip these.

2. **Using two passes unnecessarily**: Some solutions first find the degree, then scan again to find first/last positions for max-frequency elements. While still O(n), it's less elegant than the single-pass approach.

3. **Incorrect length calculation**: The formula is `last[index] - first[index] + 1`, not `last[index] - first[index]`. The `+1` is crucial because indices are inclusive.

4. **Not considering multiple elements with same frequency**: The problem requires the smallest subarray among ALL elements that achieve the maximum frequency, not just one of them.

## When You'll See This Pattern

This problem combines frequency counting with position tracking, a pattern seen in:

1. **First Unique Character in a String (LeetCode 387)**: Uses similar position tracking to find first non-repeating character.

2. **Contains Duplicate II (LeetCode 219)**: Tracks last seen positions to check if duplicates are within distance k.

3. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums and hash maps to track cumulative sums and their positions.

The core pattern: When you need to track both frequency and positional information about elements, consider using multiple hash maps or a single map with custom objects storing all needed data.

## Key Takeaways

1. **Multiple hash maps can work together**: When you need different types of information (frequency, first occurrence, last occurrence), it's often cleaner to use separate maps rather than complex custom objects.

2. **Single-pass optimization**: Many array problems can be solved in O(n) by processing elements once while maintaining necessary state in auxiliary data structures.

3. **Inclusive vs exclusive bounds**: Always double-check whether you need `+1` when calculating lengths from indices. Drawing a small example helps verify.

Related problems: [Maximum Subarray](/problem/maximum-subarray)
