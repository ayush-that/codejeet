---
title: "How to Solve Apply Operations on Array to Maximize Sum of Squares — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Apply Operations on Array to Maximize Sum of Squares. Hard difficulty, 44.3% acceptance rate. Topics: Array, Hash Table, Greedy, Bit Manipulation."
date: "2026-06-30"
category: "dsa-patterns"
tags:
  ["apply-operations-on-array-to-maximize-sum-of-squares", "array", "hash-table", "greedy", "hard"]
---

# How to Solve Apply Operations on Array to Maximize Sum of Squares

This problem asks us to maximize the sum of squares of an array after performing any number of operations where we can choose two indices and simultaneously update `nums[i] = nums[i] & nums[j]` and `nums[j] = nums[i] | nums[j]`. The tricky part is understanding how this operation affects the bits in the numbers and how to strategically apply it to maximize the sum of squares.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`, `k = 2`.

First, understand the operation: `nums[i] = nums[i] & nums[j]` and `nums[j] = nums[i] | nums[j]`. This operation preserves the total sum of bits at each position! Let's see why:

Consider two numbers in binary: `a = 101` (5) and `b = 110` (6). After the operation:

- New `a = a & b = 100` (4)
- New `b = a | b = 111` (7)

Notice that at each bit position:

- If both bits are 0 → both remain 0
- If one bit is 1 and the other 0 → the 1 moves to the OR result (b), the AND result (a) gets 0
- If both bits are 1 → both results get 1

The key insight: **The total number of 1-bits at each position remains constant**. The operation just redistributes 1s between the two numbers.

Now back to our example `[1, 2, 3]`:

- Binary: `[01, 10, 11]`
- Bit counts by position (LSB to MSB):
  - Position 0 (1s place): 1 appears in 1 and 3 → count = 2
  - Position 1 (2s place): 1 appears in 2 and 3 → count = 2

We can redistribute these bits to create numbers with more extreme values. The sum of squares is maximized when we make some numbers very large and others very small (since squares grow quadratically).

After optimal redistribution, we want to create:

- As many numbers as possible with all available 1-bits in their positions
- The remaining numbers with 0s

For `k = 2`, we need to select 2 numbers to maximize. Let's trace:

1. We can create one number with bits from position 0 and 1: `11` (3)
2. Another number with remaining bits: `10` (2)
3. Third number becomes `01` (1)

But wait, we need to select exactly 2 numbers after operations. Actually, we perform operations first, then select k indices. So we want to make k numbers as large as possible.

Optimal strategy: Create k-1 numbers with maximum possible value (by concentrating bits), and use the remaining bits to make the kth number as large as possible.

For our example: We have 4 total 1-bits. With k=2:

- Best: Make one number with 3 ones: `111` (7) - but we only have 4 ones total
- Actually: We can make one number = `11` (3) and another = `11` (3) by redistributing

Let's actually perform operations:

1. Choose i=0 (1=01), j=2 (3=11):
   - New nums[0] = 01 & 11 = 01 (1)
   - New nums[2] = 01 | 11 = 11 (3)
     Array: [1, 2, 3] → [1, 2, 3] (no change for these bits)
2. Choose i=1 (2=10), j=2 (3=11):
   - New nums[1] = 10 & 11 = 10 (2)
   - New nums[2] = 10 | 11 = 11 (3)
     Array: [1, 2, 3] → [1, 2, 3]

We need different operations. Let's think differently...

Actually, the optimal approach is mathematical: For each bit position, we have a certain count of 1s. We can allocate these 1s to at most k numbers (since we only care about k numbers in the final sum). So for each bit position, we can contribute to the sum of squares by giving that bit to some of our k selected numbers.

The maximum sum comes from: For each of the k numbers, calculate its value by taking, for each bit position, deciding whether that number gets a 1 at that position. Since we have `count` ones at a position, we can give a 1 to at most `min(count, k)` of our selected numbers.

Thus: Each of the k numbers gets `floor(count / k)` ones from each position, and the first `count % k` numbers get an extra one.

## Brute Force Approach

A naive approach would try to simulate all possible sequences of operations. For an array of length n, we could:

1. Try all pairs of indices (i, j) for operations
2. Apply the operation and recursively explore
3. Track the maximum sum of squares after selecting k indices

This is clearly infeasible because:

- There are C(n, 2) possible pairs for each operation
- We can do any number of operations
- The state space grows exponentially
- Even for small n, this approach would time out

The brute force helps us understand we need a mathematical insight rather than simulation.

## Optimized Approach

The key insight comes from bit manipulation:

1. **Bit Preservation**: The operation `(a&b, a|b)` preserves the total number of 1-bits at each position across the two numbers. It just redistributes them.

2. **Maximizing Squares**: To maximize the sum of squares of k selected numbers, we want to make those k numbers as large as possible (since x² grows faster than x).

3. **Bit Allocation**: For each bit position (0 to max bit in nums), count how many 1s exist across all numbers. Let this count be `cnt`.

4. **Optimal Distribution**: We can give a 1 at this position to at most `min(cnt, k)` of our selected numbers (since we only select k numbers, and we have cnt ones available).

5. **Construction**: For each of the k selected numbers, for each bit position, if we have enough 1s remaining, give this bit to the number.

The algorithm:

1. Count 1-bits at each position across all numbers
2. We'll construct k "virtual" numbers by allocating bits
3. For each bit position with count `cnt`:
   - Each of the k numbers gets `cnt // k` ones from this position
   - The first `cnt % k` numbers get an extra one
4. Sum the squares of these k constructed numbers

Wait, but we need to select indices from the actual array after operations, not construct virtual numbers. Actually, through operations we can transform the array to make any distribution of bits that preserves total counts at each position. So we can achieve the virtual numbers we constructed.

Proof sketch: We can always transform the array to have k numbers equal to our constructed values and the rest as 0 through repeated applications of the operation, which allows moving bits between any two numbers.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(max(nums)) + k * log(max(nums))) ≈ O(n * L + k * L) where L is max bits
# Space: O(log(max(nums))) for bit counts
def maxSum(nums, k):
    """
    Maximize sum of squares of k selected numbers after operations.

    The key insight: The operation (a&b, a|b) preserves the total number of 1-bits
    at each bit position. We can redistribute these bits to maximize k numbers.
    """
    MOD = 10**9 + 7

    # Step 1: Find the maximum number to determine how many bits we need to consider
    max_num = max(nums)
    max_bits = max_num.bit_length() if max_num > 0 else 1

    # Step 2: Count how many 1s are at each bit position across all numbers
    bit_counts = [0] * max_bits
    for num in nums:
        # For each bit position, check if it's set in the current number
        for bit in range(max_bits):
            if num & (1 << bit):
                bit_counts[bit] += 1

    # Step 3: Construct k numbers by optimally allocating bits
    # Each of the k numbers will get some subset of the available bits
    result_numbers = [0] * k

    # For each bit position, distribute its 1s to the result numbers
    for bit in range(max_bits):
        count = bit_counts[bit]  # How many 1s available at this position

        # Each of the k numbers gets at least count // k ones from this position
        # The first (count % k) numbers get an extra one
        for i in range(k):
            if count > 0:
                result_numbers[i] |= (1 << bit)  # Give this bit to number i
                count -= 1

    # Step 4: Calculate sum of squares modulo MOD
    total = 0
    for num in result_numbers:
        total = (total + num * num) % MOD

    return total
```

```javascript
// Time: O(n * log(max(nums)) + k * log(max(nums)))
// Space: O(log(max(nums))) for bit counts
function maxSum(nums, k) {
  const MOD = 1_000_000_007n; // Use BigInt for safety with large numbers

  // Step 1: Find maximum number to determine bit length
  let maxNum = Math.max(...nums);
  // Handle edge case when array might be empty or all zeros
  if (maxNum === 0) maxNum = 1;

  // Calculate number of bits needed: floor(log2(maxNum)) + 1
  let maxBits = 0;
  let temp = maxNum;
  while (temp > 0) {
    maxBits++;
    temp >>= 1;
  }
  if (maxBits === 0) maxBits = 1; // Handle case when maxNum is 0

  // Step 2: Count 1s at each bit position across all numbers
  const bitCounts = new Array(maxBits).fill(0);
  for (const num of nums) {
    for (let bit = 0; bit < maxBits; bit++) {
      if (num & (1 << bit)) {
        bitCounts[bit]++;
      }
    }
  }

  // Step 3: Construct k numbers by optimally allocating bits
  const resultNumbers = new Array(k).fill(0);

  // Distribute bits to result numbers
  for (let bit = 0; bit < maxBits; bit++) {
    let count = bitCounts[bit];

    // Give bits to the first 'count' numbers at this position
    // This creates the optimal distribution for maximizing squares
    for (let i = 0; i < k && count > 0; i++) {
      resultNumbers[i] |= 1 << bit;
      count--;
    }
  }

  // Step 4: Calculate sum of squares modulo MOD
  let total = 0n;
  for (const num of resultNumbers) {
    const bigNum = BigInt(num);
    total = (total + bigNum * bigNum) % MOD;
  }

  return Number(total);
}
```

```java
// Time: O(n * log(max(nums)) + k * log(max(nums)))
// Space: O(log(max(nums))) for bit counts
class Solution {
    public int maxSum(int[] nums, int k) {
        final int MOD = 1_000_000_007;

        // Step 1: Find maximum number to determine number of bits
        int maxNum = 0;
        for (int num : nums) {
            maxNum = Math.max(maxNum, num);
        }
        if (maxNum == 0) maxNum = 1; // Handle all zeros case

        // Calculate bit length: floor(log2(maxNum)) + 1
        int maxBits = Integer.toBinaryString(maxNum).length();

        // Step 2: Count 1s at each bit position
        int[] bitCounts = new int[maxBits];
        for (int num : nums) {
            for (int bit = 0; bit < maxBits; bit++) {
                if ((num & (1 << bit)) != 0) {
                    bitCounts[bit]++;
                }
            }
        }

        // Step 3: Construct k numbers optimally
        int[] resultNumbers = new int[k];

        // Distribute bits to result numbers
        for (int bit = 0; bit < maxBits; bit++) {
            int count = bitCounts[bit];

            // Give this bit to the first 'count' numbers
            // This maximizes the sum of squares
            for (int i = 0; i < k && count > 0; i++) {
                resultNumbers[i] |= (1 << bit);
                count--;
            }
        }

        // Step 4: Calculate sum of squares modulo MOD
        long total = 0; // Use long to avoid overflow before modulo
        for (int num : resultNumbers) {
            total = (total + (long) num * num) % MOD;
        }

        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n _ B + k _ B)** where:

- `n` is the length of the input array
- `B` is the number of bits needed to represent the maximum number in the array (B ≤ 32 for 32-bit integers)
- The first term comes from counting bits across all numbers
- The second term comes from constructing the k result numbers

In practice, since B ≤ 32, this is **O(n + k)** for integer inputs.

**Space Complexity: O(B)** for storing the bit counts, where B is the number of bits (≤ 32).

## Common Mistakes

1. **Simulating operations**: Attempting to actually perform the operations instead of recognizing the mathematical property. The operation count can be huge, and simulation will timeout.

2. **Incorrect bit distribution**: Giving bits evenly to all k numbers instead of concentrating them. Remember: to maximize sum of squares, we want some numbers to be very large. We should give each available 1-bit to a different number until we've given to k numbers, then repeat.

3. **Forgetting modulo operations**: The result can be very large (up to ~(n² × (2³¹)²) which exceeds 64-bit integers). Always apply modulo after each multiplication and addition.

4. **Insufficient bits considered**: Only considering bits up to the maximum in the original array, but after operations numbers can become larger. Actually, numbers cannot exceed the bitwise OR of all numbers, so we should consider all bits up to that point.

## When You'll See This Pattern

This problem combines bit manipulation with greedy allocation. Similar patterns appear in:

1. **Maximum XOR Problems** (like [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)): Both involve analyzing bits independently and making greedy choices.

2. **Bit Counting and Distribution** (like [Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths/)): Using bitmasks to represent sets and counting bit patterns.

3. **Operations Preserving Invariants** (like [Bulb Switcher](https://leetcode.com/problems/bulb-switcher/)): Problems where certain operations preserve a total quantity, allowing redistribution.

## Key Takeaways

1. **Bit operations often preserve invariants**: When you see bitwise operations (AND, OR, XOR), look for what quantities are preserved. Here, the total count of 1-bits at each position is invariant.

2. **Maximizing squares favors unequal distribution**: For a fixed sum, the sum of squares is maximized when values are as unequal as possible (by convexity of x²). This explains why we concentrate bits into fewer numbers.

3. **Think in terms of resources**: Each bit position has a limited number of 1s ("resources") that can be distributed among k "slots". This resource allocation perspective simplifies complex operation sequences.

Related problems: [Minimize OR of Remaining Elements Using Operations](/problem/minimize-or-of-remaining-elements-using-operations)
