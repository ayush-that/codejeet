---
title: "How to Solve Minimum Numbers of Function Calls to Make Target Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Numbers of Function Calls to Make Target Array. Medium difficulty, 62.8% acceptance rate. Topics: Array, Greedy, Bit Manipulation."
date: "2029-07-24"
category: "dsa-patterns"
tags:
  [
    "minimum-numbers-of-function-calls-to-make-target-array",
    "array",
    "greedy",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Minimum Numbers of Function Calls to Make Target Array

This problem asks us to find the minimum number of operations needed to transform an array of zeros into a given target array using two types of operations: increment any element by 1, or double all elements simultaneously. What makes this problem interesting is that it combines greedy thinking with bit manipulation—we need to work backwards from the target to zero while minimizing operations.

## Visual Walkthrough

Let's trace through the example `nums = [1, 5, 3]`:

**Working backwards from target to zeros:**

1. Current: `[1, 5, 3]` - All numbers are odd, so we need to decrement each odd number
   - Decrement 1: becomes 0 (1 operation)
   - Decrement 5: becomes 4 (1 operation)
   - Decrement 3: becomes 2 (1 operation)
   - Total operations so far: 3
   - Array becomes: `[0, 4, 2]`

2. Current: `[0, 4, 2]` - All numbers are even, so we can divide all by 2
   - Divide all by 2: `[0, 2, 1]` (1 operation)
   - Total operations: 4

3. Current: `[0, 2, 1]` - Some numbers are odd
   - Decrement 1: becomes 0 (1 operation)
   - Array becomes: `[0, 2, 0]`
   - Total operations: 5

4. Current: `[0, 2, 0]` - All even numbers (ignoring zeros)
   - Divide all by 2: `[0, 1, 0]` (1 operation)
   - Total operations: 6

5. Current: `[0, 1, 0]` - Some numbers are odd
   - Decrement 1: becomes 0 (1 operation)
   - Array becomes: `[0, 0, 0]`
   - Total operations: 7

**Total operations:** 7

Notice the pattern: we count individual decrements (for odd numbers) and collective divisions (when all numbers are even). This gives us the minimum operations.

## Brute Force Approach

A naive approach would be to simulate the process forward from zeros to the target:

1. Start with all zeros
2. At each step, either:
   - Increment any element by 1
   - Double all elements
3. Use BFS/DFS to find the shortest path to the target

However, this approach is extremely inefficient because:

- The state space grows exponentially with array size and target values
- For an array of length `n` with maximum value `m`, the state space is `O(mⁿ)`
- Even with pruning, this approach would be too slow for constraints where `n ≤ 10⁵` and values can be up to `10⁹`

The brute force teaches us that we need to think backwards (from target to zero) rather than forwards, and we need mathematical insights rather than simulation.

## Optimized Approach

The key insight comes from analyzing the operations:

1. **Increment (add 1 to any element)** corresponds to **decrementing an odd number by 1** when working backwards
2. **Double all elements** corresponds to **dividing all even numbers by 2** when working backwards

**Step-by-step reasoning:**

1. Work backwards from the target array to all zeros
2. At each step:
   - If any number is odd: we must have performed an increment operation on that element
     - Count 1 operation for each odd number
     - Decrement each odd number by 1
   - If all numbers are even (or zero): we can perform a division operation
     - Count 1 operation
     - Divide all numbers by 2
3. Repeat until all numbers are zero

**Optimization with bit manipulation:**

- Instead of actually modifying the array repeatedly, we can analyze the binary representation
- Each `1` bit in a number requires an increment operation
- The maximum number of division operations is determined by the highest power of 2 needed
- So: Total operations = (sum of set bits across all numbers) + (maximum bit length - 1)

## Optimal Solution

The optimal solution uses bit manipulation to efficiently calculate the answer without simulating the process:

<div class="code-group">

```python
# Time: O(n * log(max(nums))) | Space: O(1)
def minOperations(nums):
    """
    Calculate minimum operations to transform zeros to target array.

    Approach:
    1. Count total set bits (1s) across all numbers - each requires an increment
    2. Find maximum bit length - determines number of division operations
    3. Total operations = total_set_bits + (max_bit_length - 1)

    Why max_bit_length - 1? Because we don't need to divide when all numbers are 0
    """
    total_set_bits = 0
    max_bit_length = 0

    for num in nums:
        # Count set bits in current number
        while num > 0:
            # If last bit is 1, count it
            if num & 1:
                total_set_bits += 1
            # Right shift to check next bit
            num >>= 1

        # Update max bit length
        # Find position of highest set bit
        bit_length = 0
        temp = num
        while temp > 0:
            bit_length += 1
            temp >>= 1
        max_bit_length = max(max_bit_length, bit_length)

    # Total operations = all increments + all divisions
    # We subtract 1 from max_bit_length because we don't need to divide when all are 0
    return total_set_bits + max(0, max_bit_length - 1)
```

```javascript
// Time: O(n * log(max(nums))) | Space: O(1)
function minOperations(nums) {
  /**
   * Calculate minimum operations to transform zeros to target array.
   *
   * Approach:
   * 1. Count total set bits (1s) across all numbers - each requires an increment
   * 2. Find maximum bit length - determines number of division operations
   * 3. Total operations = total_set_bits + (max_bit_length - 1)
   */
  let totalSetBits = 0;
  let maxBitLength = 0;

  for (let num of nums) {
    // Count set bits in current number
    let currentNum = num;
    while (currentNum > 0) {
      // If last bit is 1, count it
      if (currentNum & 1) {
        totalSetBits++;
      }
      // Right shift to check next bit
      currentNum >>= 1;
    }

    // Find bit length of original number
    let bitLength = 0;
    let temp = num;
    while (temp > 0) {
      bitLength++;
      temp >>= 1;
    }
    maxBitLength = Math.max(maxBitLength, bitLength);
  }

  // Total operations = all increments + all divisions
  // Subtract 1 because we don't need to divide when all are 0
  return totalSetBits + Math.max(0, maxBitLength - 1);
}
```

```java
// Time: O(n * log(max(nums))) | Space: O(1)
class Solution {
    public int minOperations(int[] nums) {
        /**
         * Calculate minimum operations to transform zeros to target array.
         *
         * Approach:
         * 1. Count total set bits (1s) across all numbers - each requires an increment
         * 2. Find maximum bit length - determines number of division operations
         * 3. Total operations = total_set_bits + (max_bit_length - 1)
         */
        int totalSetBits = 0;
        int maxBitLength = 0;

        for (int num : nums) {
            // Count set bits in current number
            int currentNum = num;
            while (currentNum > 0) {
                // If last bit is 1, count it
                if ((currentNum & 1) == 1) {
                    totalSetBits++;
                }
                // Right shift to check next bit
                currentNum >>= 1;
            }

            // Find bit length of original number
            int bitLength = 0;
            int temp = num;
            while (temp > 0) {
                bitLength++;
                temp >>= 1;
            }
            maxBitLength = Math.max(maxBitLength, bitLength);
        }

        // Total operations = all increments + all divisions
        // Subtract 1 because we don't need to divide when all are 0
        return totalSetBits + Math.max(0, maxBitLength - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × log M) where n is the array length and M is the maximum value in the array

- We iterate through all n elements
- For each element, we process its bits, which takes O(log M) time (since a number M has roughly log₂M bits)
- In practice, since M ≤ 10⁹, log M ≤ 30, so this is effectively O(n)

**Space Complexity:** O(1)

- We only use a few integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Simulating the process forward instead of working backwards**: Candidates try to build up from zeros to the target, which requires exponential time. Always ask: "Can I work backwards from the answer to the starting point?"

2. **Forgetting to handle the case when all numbers become zero**: When calculating division operations, we need to subtract 1 because we don't need to divide when all numbers are already zero. This leads to off-by-one errors.

3. **Not optimizing bit counting**: Some candidates use `bin(num).count('1')` in Python or similar string conversions, which is slower than bit manipulation. Always prefer bit operations (`& 1` and `>>`) for efficiency.

4. **Missing the case when array contains zeros**: Zeros don't contribute to set bits but affect the maximum bit length calculation. Make sure to handle zeros correctly—they should be ignored when finding the maximum bit length.

## When You'll See This Pattern

This problem combines greedy thinking with bit manipulation, a pattern seen in several other problems:

1. **Minimum Operations to Reduce a Number to Zero (LeetCode 1342)**: Similar concept of reducing a number using division and subtraction operations, working backwards from the target.

2. **Bulb Switcher IV (LeetCode 1529)**: Involves flipping bits in a pattern, requiring analysis of binary representations and working from target to initial state.

3. **Number of Steps to Reduce a Number in Binary Representation to One (LeetCode 1404)**: Another problem where you work backwards from a binary representation, using division and addition operations.

The core pattern is: **When you have operations that work in opposite directions (like increment/decrement, multiply/divide), consider working backwards from the target to the initial state.**

## Key Takeaways

1. **Work backwards from the target**: When operations are reversible (like increment/decrement, multiply/divide), it's often easier to start from the desired outcome and work back to the initial state.

2. **Bit manipulation reveals hidden structure**: Many problems involving division/multiplication by 2 are easier when you think in terms of binary representation. Set bits correspond to increment operations, and bit length corresponds to division operations.

3. **Separate independent concerns**: The total operations = (individual operations) + (collective operations). Counting them separately and then combining gives a clean solution.

[Practice this problem on CodeJeet](/problem/minimum-numbers-of-function-calls-to-make-target-array)
