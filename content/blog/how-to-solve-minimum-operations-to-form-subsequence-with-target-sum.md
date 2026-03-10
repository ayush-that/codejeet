---
title: "How to Solve Minimum Operations to Form Subsequence With Target Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Form Subsequence With Target Sum. Hard difficulty, 32.4% acceptance rate. Topics: Array, Greedy, Bit Manipulation."
date: "2026-02-13"
category: "dsa-patterns"
tags:
  [
    "minimum-operations-to-form-subsequence-with-target-sum",
    "array",
    "greedy",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Minimum Operations to Form Subsequence With Target Sum

You're given an array where every element is a power of two, and you need to form a subsequence whose sum equals a target value. The twist is that you can split any element greater than 1 into two equal halves (e.g., 8 → 4 + 4), which costs one operation. This problem is tricky because it combines greedy thinking with bit manipulation—you need to recognize that powers of two have special properties that let you treat them as bits in a binary representation.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `nums = [1, 2, 8]` and `target = 7`.

**Step 1: Understand the binary representation**

- Target 7 in binary is `111` (4 + 2 + 1)
- Our available numbers: 1 (binary `001`), 2 (binary `010`), 8 (binary `1000`)

**Step 2: Try to match bits from smallest to largest**

- We need one `1` (bit 0): We have exactly one `1` in nums → use it
- We need one `2` (bit 1): We have exactly one `2` → use it
- We need one `4` (bit 2): We don't have a `4`, but we have an `8` (which is `1000`)

**Step 3: Split larger numbers when needed**

- To get a `4`, we need to split the `8`: 8 → 4 + 4 (1 operation)
- Now we have a `4` to use for bit 2
- Total operations: 1

**Step 4: Check if we can do better**
What if we tried different combinations? The key insight is that we should always work from the smallest bits upward because:

1. Smaller numbers can't help with larger bit requirements
2. Larger numbers can be split down to help with smaller bits
3. Once we use a number for a bit, we can't reuse it

Let's try another example: `nums = [2, 4, 8]`, `target = 10` (binary `1010` = 8 + 2)

- Need `2` (bit 1): We have a `2` → use it
- Need `8` (bit 3): We have an `8` → use it
- No `1` needed (bit 0 is 0)
- No `4` needed (bit 2 is 0)
- Total operations: 0 (we already have what we need)

## Brute Force Approach

A naive approach would be to try all possible ways to split numbers and check all subsequences. For each number, we could decide to:

1. Use it as-is
2. Split it some number of times (if it's > 1)
3. Not use it at all

This leads to exponential complexity. Even if we only consider splitting numbers completely down to 1s, with n numbers each potentially being split up to log(max(nums)) times, we're looking at O(n! × log(max(nums))!) possibilities—completely infeasible.

The key realization that makes this problem solvable is that **powers of two behave like bits in binary representation**. When we have multiple copies of the same power, they can combine to form the next higher power (two 4s can become one 8), and vice versa (one 8 can split into two 4s).

## Optimized Approach

The optimal solution uses a greedy approach with bit manipulation:

1. **Count frequencies of each power**: Since all numbers are powers of two, we can represent them as bit positions. Create a frequency array where `freq[i]` counts how many numbers equal `2^i`.

2. **Process bits from least significant to most significant** (i = 0 to 31):
   - If the target has bit i set (we need this power), we try to use available numbers:
     - If `freq[i] > 0`, use one from our count
     - Otherwise, we need to find a larger number and split it down
   - If we don't need this bit (target bit is 0), we can combine extras:
     - Two numbers of value `2^i` can combine to make one number of value `2^(i+1)`
     - This "carry" helps us for future bits

3. **When we need a bit but don't have it**:
   - Look ahead to find the next larger available number
   - Split it repeatedly until we get the needed power
   - Each split counts as one operation
   - The remaining halves become available for smaller bits

4. **Why greedy works**:
   - Splitting a larger number always gives us exactly what we need for the current bit
   - Any leftover from the split can help with smaller bits
   - We never need to split a number more than necessary
   - Working from smallest to largest bits ensures we don't waste operations

## Optimal Solution

<div class="code-group">

```python
# Time: O(32 + n) = O(n) | Space: O(32) = O(1)
def minOperations(nums, target):
    """
    Calculate minimum operations to form subsequence with target sum.

    Args:
        nums: List of powers of two
        target: Target sum to achieve

    Returns:
        Minimum operations needed, or -1 if impossible
    """
    # Edge case: if sum of nums is less than target, impossible
    if sum(nums) < target:
        return -1

    # Step 1: Count frequencies of each power of two
    # freq[i] = count of numbers equal to 2^i
    freq = [0] * 32  # 32 bits covers up to 2^31

    for num in nums:
        # Find which power of two this number is
        # num is power of two, so log2(num) gives the exponent
        power = num.bit_length() - 1
        freq[power] += 1

    operations = 0
    i = 0  # Current bit position

    # Step 2: Process bits from least to most significant
    while i < 31:  # We only need up to bit 30 (2^30)
        # Check if target needs this bit
        if (target >> i) & 1:
            # We need this power of two
            if freq[i] > 0:
                # We have it available, use one
                freq[i] -= 1
            else:
                # Don't have this power, need to find larger one to split
                # Look for next available larger power
                j = i + 1
                while j < 31 and freq[j] == 0:
                    j += 1

                # If we couldn't find any larger power, it's impossible
                if j == 31:
                    return -1

                # Split the larger power j down to i
                # Each split creates 2 of the next smaller power
                # We need to split (j - i) times to get to power i
                operations += j - i

                # Use one copy of the split result for current bit
                freq[j] -= 1

                # The splits create copies of intermediate powers
                # For example, splitting 8 (2^3) to get 1 (2^0):
                # 8 → 4+4 → 2+2+2+2 → 1+1+1+1+1+1+1+1
                # We get 2^(j-k) copies of each power k between i and j-1
                # But we only need to track that we now have extras
                # Mark that we have created numbers at powers i through j-1
                for k in range(i, j):
                    freq[k] += 1

                # We used one copy for current bit i
                freq[i] -= 1

        # Step 3: Carry over extras to next higher power
        # Two of current power can combine to make one of next power
        freq[i + 1] += freq[i] // 2

        # Move to next bit
        i += 1

    return operations
```

```javascript
// Time: O(32 + n) = O(n) | Space: O(32) = O(1)
function minOperations(nums, target) {
  /**
   * Calculate minimum operations to form subsequence with target sum.
   *
   * @param {number[]} nums - Array of powers of two
   * @param {number} target - Target sum to achieve
   * @return {number} Minimum operations needed, or -1 if impossible
   */

  // Edge case: if sum of nums is less than target, impossible
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum < target) {
    return -1;
  }

  // Step 1: Count frequencies of each power of two
  // freq[i] = count of numbers equal to 2^i
  const freq = new Array(32).fill(0); // 32 bits covers up to 2^31

  for (const num of nums) {
    // Find which power of two this number is
    // num is power of two, so log2(num) gives the exponent
    const power = Math.floor(Math.log2(num));
    freq[power]++;
  }

  let operations = 0;

  // Step 2: Process bits from least to most significant
  for (let i = 0; i < 31; i++) {
    // We only need up to bit 30 (2^30)
    // Check if target needs this bit
    if ((target >> i) & 1) {
      // We need this power of two
      if (freq[i] > 0) {
        // We have it available, use one
        freq[i]--;
      } else {
        // Don't have this power, need to find larger one to split
        // Look for next available larger power
        let j = i + 1;
        while (j < 31 && freq[j] === 0) {
          j++;
        }

        // If we couldn't find any larger power, it's impossible
        if (j === 31) {
          return -1;
        }

        // Split the larger power j down to i
        // Each split creates 2 of the next smaller power
        // We need to split (j - i) times to get to power i
        operations += j - i;

        // Use one copy of the split result for current bit
        freq[j]--;

        // The splits create copies of intermediate powers
        // Mark that we have created numbers at powers i through j-1
        for (let k = i; k < j; k++) {
          freq[k]++;
        }

        // We used one copy for current bit i
        freq[i]--;
      }
    }

    // Step 3: Carry over extras to next higher power
    // Two of current power can combine to make one of next power
    freq[i + 1] += Math.floor(freq[i] / 2);
  }

  return operations;
}
```

```java
// Time: O(32 + n) = O(n) | Space: O(32) = O(1)
class Solution {
    public int minOperations(List<Integer> nums, int target) {
        /**
         * Calculate minimum operations to form subsequence with target sum.
         *
         * @param nums List of powers of two
         * @param target Target sum to achieve
         * @return Minimum operations needed, or -1 if impossible
         */

        // Edge case: if sum of nums is less than target, impossible
        long sum = 0;
        for (int num : nums) {
            sum += num;
        }
        if (sum < target) {
            return -1;
        }

        // Step 1: Count frequencies of each power of two
        // freq[i] = count of numbers equal to 2^i
        int[] freq = new int[32]; // 32 bits covers up to 2^31

        for (int num : nums) {
            // Find which power of two this number is
            // num is power of two, so log2(num) gives the exponent
            int power = Integer.numberOfTrailingZeros(num);
            freq[power]++;
        }

        int operations = 0;

        // Step 2: Process bits from least to most significant
        for (int i = 0; i < 31; i++) { // We only need up to bit 30 (2^30)
            // Check if target needs this bit
            if (((target >> i) & 1) == 1) {
                // We need this power of two
                if (freq[i] > 0) {
                    // We have it available, use one
                    freq[i]--;
                } else {
                    // Don't have this power, need to find larger one to split
                    // Look for next available larger power
                    int j = i + 1;
                    while (j < 31 && freq[j] == 0) {
                        j++;
                    }

                    // If we couldn't find any larger power, it's impossible
                    if (j == 31) {
                        return -1;
                    }

                    // Split the larger power j down to i
                    // Each split creates 2 of the next smaller power
                    // We need to split (j - i) times to get to power i
                    operations += j - i;

                    // Use one copy of the split result for current bit
                    freq[j]--;

                    // The splits create copies of intermediate powers
                    // Mark that we have created numbers at powers i through j-1
                    for (int k = i; k < j; k++) {
                        freq[k]++;
                    }

                    // We used one copy for current bit i
                    freq[i]--;
                }
            }

            // Step 3: Carry over extras to next higher power
            // Two of current power can combine to make one of next power
            freq[i + 1] += freq[i] / 2;
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + 32) = O(n)**

- Counting frequencies: O(n) to iterate through all numbers
- Processing bits: O(32) constant time since we only process 32 bits
- The while loop inside for finding the next available power: In total across all iterations, this is O(32) because each number can only be "found" once

**Space Complexity: O(32) = O(1)**

- We use a fixed-size array of 32 integers to store frequencies
- No additional data structures that scale with input size

The constant factors are small because we're limited to 32-bit integers (up to 2^31).

## Common Mistakes

1. **Not checking if the total sum is sufficient**: If the sum of all numbers is less than the target, it's impossible to achieve the target sum. Always check this early to return -1 immediately.

2. **Processing bits in wrong order**: Processing from most significant to least significant bit doesn't work because you might split a large number unnecessarily. Always process from LSB to MSB.

3. **Forgetting to carry over extras**: When you have extra copies of a power (especially when target bit is 0), you need to combine them (two 4s → one 8) to help with larger bits. This is the `freq[i + 1] += freq[i] // 2` step.

4. **Incorrect splitting logic**: When splitting a number at position j down to position i, you need to:
   - Add operations for each split (j - i operations)
   - Create intermediate numbers at all powers between i and j-1
   - Use one of the resulting numbers for the current bit i

5. **Using the wrong bit manipulation**: Remember that `(target >> i) & 1` checks if bit i is set. Some candidates try to use modulo operations which are less efficient and more error-prone.

## When You'll See This Pattern

This problem combines **greedy algorithms** with **bit manipulation**—a powerful pattern for problems involving powers of two:

1. **"Minimum Number of Operations to Make Array Continuous"** - Similar greedy thinking about transforming numbers
2. **"Partition Array Into Two Arrays to Minimize Sum Difference"** - Bit manipulation for subset sums
3. **"Maximum Product of the Length of Two Palindromic Subsequences"** - Using bits to represent subsets

The key insight is recognizing that powers of two have unique properties:

- They correspond directly to bits in binary representation
- They can be combined (two smaller → one larger) or split (one larger → two smaller)
- Greedy approaches often work because there's an optimal way to transform them

## Key Takeaways

1. **Powers of two = bits**: When you see powers of two in a problem, think about binary representation. Each number corresponds to a bit position, and operations on them correspond to bit manipulations.

2. **Greedy from LSB to MSB**: For bit-based problems, processing from least significant to most significant bit is often optimal. Smaller bits are more "flexible"—they can come from splitting larger numbers, but larger numbers can't come from combining smaller ones unless you have exactly two.

3. **Carry propagation is crucial**: Just like in binary addition, when you have extras at a bit position, they should propagate to the next higher position. This is the key to minimizing operations.

Related problems: [Number of Subsequences That Satisfy the Given Sum Condition](/problem/number-of-subsequences-that-satisfy-the-given-sum-condition), [Closest Subsequence Sum](/problem/closest-subsequence-sum)
