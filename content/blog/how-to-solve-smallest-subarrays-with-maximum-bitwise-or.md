---
title: "How to Solve Smallest Subarrays With Maximum Bitwise OR — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Subarrays With Maximum Bitwise OR. Medium difficulty, 62.0% acceptance rate. Topics: Array, Binary Search, Bit Manipulation, Sliding Window."
date: "2027-07-23"
category: "dsa-patterns"
tags:
  [
    "smallest-subarrays-with-maximum-bitwise-or",
    "array",
    "binary-search",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Smallest Subarrays With Maximum Bitwise OR

This problem asks us to find, for each starting index `i`, the shortest subarray beginning at `i` that achieves the maximum possible bitwise OR value. The challenge is that the maximum OR for a starting position isn't just the OR of the entire remaining array—it's the OR of some prefix ending at a certain point, after which additional elements don't change the OR value. The tricky part is efficiently determining where this "saturation point" occurs for each starting position without recalculating ORs from scratch.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3, 4, 5]`

For each starting index `i`, we need to find the smallest `j ≥ i` such that `OR(nums[i..j])` equals the maximum possible OR starting from `i`.

**Step-by-step for i = 0:**

- Start with `current_or = 0`
- Add nums[0] = 1: `current_or = 1` (binary: 001)
- Add nums[1] = 2: `current_or = 1 | 2 = 3` (001 | 010 = 011)
- Add nums[2] = 3: `current_or = 3 | 3 = 3` (011 | 011 = 011) - no change
- Add nums[3] = 4: `current_or = 3 | 4 = 7` (011 | 100 = 111)
- Add nums[4] = 5: `current_or = 7 | 5 = 7` (111 | 101 = 111) - no change

The maximum OR starting at index 0 is 7. The first time we reach 7 is at index 3, so the smallest subarray is `[1, 2, 3, 4]` with length 4.

**For i = 1:**

- Start with nums[1] = 2: `current_or = 2` (010)
- Add nums[2] = 3: `current_or = 2 | 3 = 3` (010 | 011 = 011)
- Add nums[3] = 4: `current_or = 3 | 4 = 7` (011 | 100 = 111)
- Add nums[4] = 5: `current_or = 7 | 5 = 7` (111 | 101 = 111) - no change

Maximum OR is 7, first reached at index 3, so smallest subarray is `[2, 3, 4]` with length 3.

**For i = 2:**

- Start with nums[2] = 3: `current_or = 3` (011)
- Add nums[3] = 4: `current_or = 3 | 4 = 7` (011 | 100 = 111)
- Add nums[4] = 5: `current_or = 7 | 5 = 7` (111 | 101 = 111) - no change

Maximum OR is 7, first reached at index 3, so smallest subarray is `[3, 4]` with length 2.

**For i = 3:**

- Start with nums[3] = 4: `current_or = 4` (100)
- Add nums[4] = 5: `current_or = 4 | 5 = 5` (100 | 101 = 101)

Maximum OR is 5, reached immediately at index 3, so smallest subarray is `[4]` with length 1.

**For i = 4:**

- Only nums[4] = 5: `current_or = 5`

Maximum OR is 5, reached immediately, so smallest subarray is `[5]` with length 1.

Final answer: `[4, 3, 2, 1, 1]`

The key insight: For each starting position, we need to find the earliest ending position where adding more elements won't increase the OR value. Once all bits that can be set from that starting position are set, we've reached the maximum OR.

## Brute Force Approach

A naive approach would be to check every possible subarray starting at each position `i`:

1. For each starting index `i` from 0 to n-1:
   - Calculate the maximum possible OR from position `i` by OR-ing all elements from `i` to `n-1`
   - For each ending index `j` from `i` to `n-1`:
     - Calculate the OR of `nums[i..j]`
     - If it equals the maximum OR, record `j-i+1` as the answer for position `i` and break

This approach has O(n³) time complexity because:

- n starting positions
- For each starting position, up to n ending positions
- For each subarray, we need O(n) time to compute the OR (unless we precompute, but even then it's O(n²))

The brute force is clearly too slow for the typical constraints (n up to 10⁵).

<div class="code-group">

```python
# Brute Force Solution - Too Slow for Large Inputs
# Time: O(n³) | Space: O(1)
def smallestSubarraysBruteForce(nums):
    n = len(nums)
    result = [0] * n

    for i in range(n):
        # Calculate maximum OR from position i
        max_or = 0
        for k in range(i, n):
            max_or |= nums[k]

        # Find smallest j where OR(nums[i..j]) == max_or
        for j in range(i, n):
            current_or = 0
            for k in range(i, j + 1):
                current_or |= nums[k]
            if current_or == max_or:
                result[i] = j - i + 1
                break

    return result
```

```javascript
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n³) | Space: O(1)
function smallestSubarraysBruteForce(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // Calculate maximum OR from position i
    let maxOR = 0;
    for (let k = i; k < n; k++) {
      maxOR |= nums[k];
    }

    // Find smallest j where OR(nums[i..j]) == maxOR
    for (let j = i; j < n; j++) {
      let currentOR = 0;
      for (let k = i; k <= j; k++) {
        currentOR |= nums[k];
      }
      if (currentOR === maxOR) {
        result[i] = j - i + 1;
        break;
      }
    }
  }

  return result;
}
```

```java
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n³) | Space: O(1)
public int[] smallestSubarraysBruteForce(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        // Calculate maximum OR from position i
        int maxOR = 0;
        for (int k = i; k < n; k++) {
            maxOR |= nums[k];
        }

        // Find smallest j where OR(nums[i..j]) == maxOR
        for (int j = i; j < n; j++) {
            int currentOR = 0;
            for (int k = i; k <= j; k++) {
                currentOR |= nums[k];
            }
            if (currentOR == maxOR) {
                result[i] = j - i + 1;
                break;
            }
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we can process the array from right to left while tracking the nearest positions where each bit was last seen. Here's the reasoning:

1. **Bitwise OR Property**: The OR operation is monotonic - adding more elements can only set more bits (never unset them). Once a bit is set in the OR, it stays set.

2. **Right-to-Left Processing**: If we process from right to left, we can maintain information about where bits are set in the remaining array.

3. **Tracking Nearest Bit Positions**: For each bit position (0-31 for 32-bit integers), we track the nearest index to the right where that bit is set. The maximum OR for position `i` will be achieved when we include all elements up to the farthest of these nearest positions.

4. **Finding the Ending Position**: For starting position `i`, we look at all bits set in `nums[i]` and update our nearest positions tracker. Then, the ending position for the smallest subarray is the maximum value among all nearest positions for bits that could contribute to the OR.

**Step-by-step algorithm:**

1. Initialize an array `nearest` of size 32 (for 32-bit integers) with `-1`, representing the nearest index where each bit is set.
2. Create result array of size n.
3. Process array from right to left (i from n-1 down to 0):
   - For each bit position b from 0 to 31:
     - If bit b is set in `nums[i]`, update `nearest[b] = i`
   - Find the maximum value in `nearest` array (call it `maxPos`)
   - If `maxPos == -1` (no bits set anywhere), set result[i] = 1
   - Otherwise, set result[i] = `maxPos - i + 1`
4. Return result array

This works because `maxPos` represents the farthest index we need to include to get all the bits that could possibly be in the OR from position `i`.

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution
# Time: O(32 * n) = O(n) | Space: O(32) = O(1)
def smallestSubarrays(nums):
    n = len(nums)
    result = [0] * n

    # nearest[i] stores the nearest index where bit i is set
    # Initialize with -1 (not found yet)
    nearest = [-1] * 32

    # Process from right to left
    for i in range(n - 1, -1, -1):
        # Update nearest positions for bits set in nums[i]
        for bit in range(32):
            if nums[i] >> bit & 1:  # Check if bit is set in nums[i]
                nearest[bit] = i  # Update nearest position for this bit

        # Find the farthest position among all bits that could contribute to OR
        max_pos = i  # At minimum, we need to include the current element
        for bit in range(32):
            if nearest[bit] != -1:
                max_pos = max(max_pos, nearest[bit])

        # Length of smallest subarray starting at i
        result[i] = max_pos - i + 1

    return result
```

```javascript
// Optimal Solution
// Time: O(32 * n) = O(n) | Space: O(32) = O(1)
function smallestSubarrays(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);

  // nearest[i] stores the nearest index where bit i is set
  // Initialize with -1 (not found yet)
  const nearest = new Array(32).fill(-1);

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Update nearest positions for bits set in nums[i]
    for (let bit = 0; bit < 32; bit++) {
      if ((nums[i] >> bit) & 1) {
        // Check if bit is set in nums[i]
        nearest[bit] = i; // Update nearest position for this bit
      }
    }

    // Find the farthest position among all bits that could contribute to OR
    let maxPos = i; // At minimum, we need to include the current element
    for (let bit = 0; bit < 32; bit++) {
      if (nearest[bit] !== -1) {
        maxPos = Math.max(maxPos, nearest[bit]);
      }
    }

    // Length of smallest subarray starting at i
    result[i] = maxPos - i + 1;
  }

  return result;
}
```

```java
// Optimal Solution
// Time: O(32 * n) = O(n) | Space: O(32) = O(1)
public int[] smallestSubarrays(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    // nearest[i] stores the nearest index where bit i is set
    // Initialize with -1 (not found yet)
    int[] nearest = new int[32];
    Arrays.fill(nearest, -1);

    // Process from right to left
    for (int i = n - 1; i >= 0; i--) {
        // Update nearest positions for bits set in nums[i]
        for (int bit = 0; bit < 32; bit++) {
            if (((nums[i] >> bit) & 1) == 1) {  // Check if bit is set in nums[i]
                nearest[bit] = i;  // Update nearest position for this bit
            }
        }

        // Find the farthest position among all bits that could contribute to OR
        int maxPos = i;  // At minimum, we need to include the current element
        for (int bit = 0; bit < 32; bit++) {
            if (nearest[bit] != -1) {
                maxPos = Math.max(maxPos, nearest[bit]);
            }
        }

        // Length of smallest subarray starting at i
        result[i] = maxPos - i + 1;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(32 \* n) = O(n)**

- We iterate through the array once from right to left: O(n)
- For each element, we check 32 bits: O(32) per element
- The constant 32 comes from the maximum number of bits in 32-bit integers
- Overall: O(32n) = O(n)

**Space Complexity: O(1) extra space**

- The `nearest` array uses 32 integers: O(32) = O(1)
- The result array is required output, not counted in extra space
- No recursion or other significant data structures

The linear time complexity makes this solution efficient even for the maximum constraints (n = 10⁵).

## Common Mistakes

1. **Processing left-to-right instead of right-to-left**: If you process left-to-right, you don't have information about where bits appear later in the array. Right-to-left processing ensures you always know the nearest position where each bit is set in the remaining array.

2. **Not handling the case when no bits are set**: In the edge case where all numbers are 0, `maxPos` might remain at -1. The code handles this by initializing `maxPos = i`, ensuring we at least include the current element (even if it's 0).

3. **Using 64 instead of 32 for bit positions**: While some languages have 64-bit integers, the problem constraints typically allow 32-bit integers. Using 64 bits wastes time. Always check the problem constraints for the maximum value to determine the number of bits needed.

4. **Forgetting to update nearest positions for the current element**: Before calculating `maxPos`, you must update `nearest` with the bits from `nums[i]`. Otherwise, you might miss bits that are only in the current element.

5. **Incorrect bit checking syntax**: Different languages have different syntax for bit operations. Common errors include:
   - Python: `(nums[i] >> bit) & 1` not `nums[i] & (1 << bit)` (though both work)
   - JavaScript: Need parentheses: `(nums[i] >> bit) & 1`
   - Java: Need to compare with 1: `((nums[i] >> bit) & 1) == 1`

## When You'll See This Pattern

This "nearest position tracking" pattern appears in several bit manipulation and array problems:

1. **Bitwise ORs of Subarrays (LeetCode 898)**: Similar concept of tracking unique OR values in subarrays, though with a different approach using sets.

2. **Longest Subarray With Maximum Bitwise AND (LeetCode 2419)**: Uses similar right-to-left processing to find subarrays with maximum AND value.

3. **Subarray With Elements Greater Than Varying Threshold (LeetCode 2334)**: While not bit-related, uses similar nearest-element tracking with monotonic stacks.

4. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Uses bit-by-bit processing with tries, another common bit manipulation pattern.

The core pattern is: when you need to find subarray properties based on bitwise operations, consider processing from one end while maintaining state about where bits or values appear.

## Key Takeaways

1. **Right-to-left processing with state tracking**: When you need information about elements to the right of your current position, process from right to left while maintaining relevant state (in this case, nearest positions where each bit is set).

2. **Bit manipulation often has O(32n) or O(64n) solutions**: Since integers have a fixed number of bits (usually 32), you can often achieve linear time by processing bit-by-bit rather than element-by-element.

3. **Monotonic operations enable greedy approaches**: Bitwise OR is monotonic (only increases), which allows us to find the "saturation point" where adding more elements doesn't change the value. Similar patterns work for AND (monotonic decreasing) and other monotonic functions.

4. **Trade memory for time**: By storing just 32 integers (nearest positions for each bit), we avoid recomputing ORs for every subarray, turning an O(n²) or O(n³) problem into O(n).

Related problems: [Merge k Sorted Lists](/problem/merge-k-sorted-lists), [Bitwise ORs of Subarrays](/problem/bitwise-ors-of-subarrays), [Longest Subarray With Maximum Bitwise AND](/problem/longest-subarray-with-maximum-bitwise-and)
