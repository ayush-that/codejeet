---
title: "How to Solve Minimum Number of Operations to Make Array XOR Equal to K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make Array XOR Equal to K. Medium difficulty, 85.5% acceptance rate. Topics: Array, Bit Manipulation."
date: "2027-01-28"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-make-array-xor-equal-to-k",
    "array",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Minimum Number of Operations to Make Array XOR Equal to K

This problem asks us to find the minimum number of bit flips needed to make the XOR of all elements in an array equal to a target value `k`. The tricky part is recognizing that we don't need to track individual array elements—we only care about the overall XOR result and which bits differ from our target.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 4, 1]`, `k = 3`

**Step 1: Calculate current XOR of array**

- Binary representations: 2 = 010, 4 = 100, 1 = 001
- XOR calculation: 2 ⊕ 4 = 110 (6), then 110 ⊕ 1 = 111 (7)
- Current XOR = 7 (binary 111)

**Step 2: Compare with target k**

- Target k = 3 (binary 011)
- Current XOR = 7 (binary 111)
- We need to transform 111 → 011

**Step 3: Identify differing bits**

```
Current: 1 1 1
Target:  0 1 1
          ↑
```

Only the leftmost bit differs (position value 4). We need to flip this bit from 1 to 0.

**Step 4: How many operations needed?**
Since flipping any bit in any number affects the overall XOR, we can flip just one bit in one number to change the overall XOR. The minimum operations equals the number of differing bits = 1.

Let's verify: If we flip the leftmost bit of 4 (100 → 000), the array becomes [2, 0, 1]:

- New XOR: 2 ⊕ 0 = 2, then 2 ⊕ 1 = 3 ✓
- We made 1 bit flip, matching our calculation.

## Brute Force Approach

A naive approach might try to simulate all possible bit flips across the array. For each position in each number, we could try flipping it and recalculating the XOR to see if it matches `k`. This would require:

1. For each of n numbers
2. For each of up to 32 bits (for 32-bit integers)
3. Flip the bit and recalculate XOR of entire array
4. Track minimum flips needed

This gives O(n² × 32) time complexity, which is far too slow for typical constraints (n up to 10⁵). The key insight we're missing is that we don't need to track which specific numbers get flipped—only the overall XOR matters.

## Optimized Approach

The crucial observation: **The XOR of all elements after operations must equal k.**

Let `current_xor = nums[0] ⊕ nums[1] ⊕ ... ⊕ nums[n-1]`

We need `current_xor` to become `k`. The XOR operation has these properties:

1. Flipping a bit in any number changes that bit in the overall XOR
2. Each bit in the overall XOR changes independently
3. To change from `current_xor` to `k`, we need to flip exactly the bits where they differ

Therefore:

- Calculate `diff = current_xor ⊕ k`
- Count how many 1-bits are in `diff` (this is the Hamming weight)
- Each 1-bit in `diff` represents one bit that needs flipping
- Since we can flip one bit per operation, the answer is the count of 1-bits

Why does this work? Because flipping a bit in any array element will flip the corresponding bit in the overall XOR. We can always achieve our target by flipping exactly the differing bits, one operation per differing bit.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(nums, k):
    """
    Calculate minimum bit flips to make array XOR equal to k.

    Approach:
    1. Compute XOR of all elements to get current XOR value
    2. XOR current value with k to find differing bits
    3. Count how many bits differ (Hamming weight)

    Each differing bit requires one flip operation.
    """
    # Step 1: Calculate XOR of all elements
    current_xor = 0
    for num in nums:
        current_xor ^= num  # XOR accumulates

    # Step 2: Find which bits differ between current XOR and target k
    # XOR gives 1 where bits differ, 0 where they're the same
    diff = current_xor ^ k

    # Step 3: Count number of 1-bits in diff (Hamming weight)
    # Each 1-bit represents one bit that needs flipping
    operations = 0
    while diff > 0:
        # Check if least significant bit is 1
        operations += diff & 1
        # Right shift to check next bit
        diff >>= 1

    return operations
```

```javascript
// Time: O(n) | Space: O(1)
function minOperations(nums, k) {
  /**
   * Calculate minimum bit flips to make array XOR equal to k.
   *
   * Approach:
   * 1. Compute XOR of all elements to get current XOR value
   * 2. XOR current value with k to find differing bits
   * 3. Count how many bits differ (Hamming weight)
   *
   * Each differing bit requires one flip operation.
   */

  // Step 1: Calculate XOR of all elements
  let currentXor = 0;
  for (let num of nums) {
    currentXor ^= num; // XOR accumulates
  }

  // Step 2: Find which bits differ between current XOR and target k
  // XOR gives 1 where bits differ, 0 where they're the same
  let diff = currentXor ^ k;

  // Step 3: Count number of 1-bits in diff (Hamming weight)
  // Each 1-bit represents one bit that needs flipping
  let operations = 0;
  while (diff > 0) {
    // Check if least significant bit is 1
    operations += diff & 1;
    // Right shift to check next bit
    diff >>= 1;
  }

  return operations;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minOperations(int[] nums, int k) {
        /**
         * Calculate minimum bit flips to make array XOR equal to k.
         *
         * Approach:
         * 1. Compute XOR of all elements to get current XOR value
         * 2. XOR current value with k to find differing bits
         * 3. Count how many bits differ (Hamming weight)
         *
         * Each differing bit requires one flip operation.
         */

        // Step 1: Calculate XOR of all elements
        int currentXor = 0;
        for (int num : nums) {
            currentXor ^= num;  // XOR accumulates
        }

        // Step 2: Find which bits differ between current XOR and target k
        // XOR gives 1 where bits differ, 0 where they're the same
        int diff = currentXor ^ k;

        // Step 3: Count number of 1-bits in diff (Hamming weight)
        // Each 1-bit represents one bit that needs flipping
        int operations = 0;
        while (diff > 0) {
            // Check if least significant bit is 1
            operations += diff & 1;
            // Right shift to check next bit
            diff >>= 1;
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once to compute XOR: O(n)
- We count bits in the difference: O(1) since integers have fixed width (32 bits for 32-bit integers)
- Total: O(n + 32) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures that scale with input

## Common Mistakes

1. **Overcomplicating with per-element tracking**: Some candidates try to track which specific numbers need which bits flipped. Remember: we only care about the overall XOR result, not individual elements.

2. **Forgetting that XOR is cumulative**: The operation `a ^= b` updates `a` with the XOR of all elements seen so far. Some candidates incorrectly try to store all XOR results in an array.

3. **Incorrect bit counting**: When counting 1-bits, ensure you're checking `diff & 1` (least significant bit) and shifting `diff >>= 1`. A common error is checking `diff & (1 << i)` without proper bounds.

4. **Missing edge cases**:
   - Empty array (not in constraints but good to consider): XOR would be 0
   - k = 0: Answer is just the number of 1-bits in current XOR
   - Large numbers: Use bitwise operations, not string conversions

## When You'll See This Pattern

This problem combines two fundamental bit manipulation patterns:

1. **XOR properties for parity/differences**: XOR reveals where two values differ. Similar problems:
   - [Single Number](https://leetcode.com/problems/single-number/) - XOR cancels out pairs
   - [Find the Difference](https://leetcode.com/problems/find-the-difference/) - XOR finds the one differing character

2. **Hamming weight (counting 1-bits)**: Many problems require counting set bits:
   - [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) - Direct Hamming weight calculation
   - [Counting Bits](https://leetcode.com/problems/counting-bits/) - Hamming weight for all numbers up to n

3. **Minimum operations via bit differences**: When operations affect specific bits independently:
   - [Minimum Bit Flips to Convert Number](https://leetcode.com/problems/minimum-bit-flips-to-convert-number/) - Almost identical to step 3 of our solution

## Key Takeaways

1. **XOR is your friend for difference problems**: When you need to find what's different between two values or track parity, XOR often provides an O(1) space solution.

2. **Think in terms of overall state, not individual elements**: Many array problems can be solved by tracking a cumulative property (sum, XOR, product) rather than examining all pairs or permutations.

3. **Bit counting is a fundamental skill**: Learn efficient ways to count 1-bits: while loop with `& 1` and `>>= 1`, or Brian Kernighan's algorithm (`n & (n-1)`).

Related problems: [Minimum Bit Flips to Convert Number](/problem/minimum-bit-flips-to-convert-number)
