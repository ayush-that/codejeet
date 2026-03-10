---
title: "How to Solve Minimum Operations to Make Array Sum Divisible by K — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Array Sum Divisible by K. Easy difficulty, 92.4% acceptance rate. Topics: Array, Math."
date: "2026-04-14"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-array-sum-divisible-by-k", "array", "math", "easy"]
---

# How to Solve Minimum Operations to Make Array Sum Divisible by K

At first glance, this problem seems straightforward: we need to reduce array elements until the total sum is divisible by `k`. The tricky part is that we can only decrement values (never increase them), and we need the _minimum_ number of decrement operations. This constraint forces us to think carefully about which elements to reduce and by how much.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 6, 9, 12]`, `k = 5`

**Step 1: Calculate initial sum**
Sum = 3 + 6 + 9 + 12 = 30

**Step 2: Find remainder when dividing by k**
30 ÷ 5 = 6 remainder 0
Wait, the sum is already divisible by 5! We need 0 operations.

But what if we change the example? Let's try `nums = [3, 6, 9, 11]`, `k = 5`

**Step 1: Calculate initial sum**
Sum = 3 + 6 + 9 + 11 = 29

**Step 2: Find remainder**
29 ÷ 5 = 5 remainder 4
We need to reduce the sum by 4 (or increase it by 1, but we can only decrement)

**Step 3: Find which elements can help**
We need to reduce individual elements until the total reduction equals 4 (mod 5). But we can only reduce, so we're looking for elements whose value mod 5 gives us at least the remainder we need.

Let's check each element's remainder when divided by 5:

- 3 % 5 = 3 (can reduce by 3 to make it divisible by 5)
- 6 % 5 = 1 (can reduce by 1)
- 9 % 5 = 4 (can reduce by 4)
- 11 % 5 = 1 (can reduce by 1)

**Step 4: Find the minimum reduction**
We need to reduce the total sum by 4. Looking at individual remainders:

- Element with remainder 4 (the 9) can give us exactly 4 with one operation
- Or we could combine: element with remainder 3 (the 3) plus element with remainder 1 (the 6) = 4, but that's 2 operations
- Or element with remainder 1 (the 6) plus element with remainder 3 (the 3) = 4, also 2 operations

The minimum is clearly 1 operation on the element with remainder 4.

**Key insight**: The minimum operations equals the smallest remainder among elements that is at least the needed reduction, or the smallest combination of remainders that sums to the needed reduction (mod k).

Actually, there's an even simpler insight: If the sum has remainder `r`, we need to reduce the sum by `r`. But since we're working modulo `k`, reducing by `r` is equivalent to finding elements whose remainder when divided by `k` is at least `r`. The minimum operations is simply finding the smallest such remainder!

Wait, let's test this with another example: `nums = [2, 4, 6]`, `k = 5`

Sum = 12, remainder = 2
Remainders: 2 % 5 = 2, 4 % 5 = 4, 6 % 5 = 1
We need to reduce by 2. Elements with remainder ≥ 2:

- Element 2 has remainder 2 (1 operation)
- Element 4 has remainder 4 (would need 4 operations to reduce to a multiple of 5)

Minimum is 1 operation on element with remainder 2.

## Brute Force Approach

A naive approach would be to try all possible combinations of reductions:

1. Calculate the initial sum and its remainder `r` when divided by `k`
2. If `r == 0`, return 0
3. Otherwise, try reducing each element by 1, 2, 3, ... up to its value
4. Track the minimum number of operations needed to make the new sum divisible by `k`

This brute force approach has exponential time complexity because for each element, we have multiple reduction choices, and we'd need to explore all combinations. For an array of length `n` with maximum value `m`, the time complexity would be roughly O(m^n), which is completely impractical.

Even a slightly better brute force would be to try reducing elements until we find a solution, but without a systematic approach, we might miss the optimal solution or take too long.

## Optimal Solution

The key insight is mathematical: Let `total_sum` be the sum of all elements, and let `r = total_sum % k`. If `r == 0`, we're done. Otherwise, we need to reduce the sum by `r` (or by `r + k`, `r + 2k`, etc., but reducing by more than `r` would require more operations).

Since we can only decrement elements, we need to find elements whose current value modulo `k` gives us at least `r`. Why? Because if an element has remainder `x` where `x ≥ r`, then reducing it by `r` will make its new value have remainder `(x - r) % k`. More importantly, the number of operations needed on that element is exactly `r` (if `x ≥ r`) or `r - x + k` (if `x < r`).

Actually, let's think more carefully:

- If an element has remainder `x`, reducing it by `d` operations gives it remainder `(x - d) % k`
- We want the total reduction to be `r` (mod `k`)
- So we need `d ≡ r (mod k)` for some element
- The minimum `d` for an element with remainder `x` is:
  - If `x ≥ r`: we can reduce by exactly `r` (d = r)
  - If `x < r`: we need to reduce by `r + (k - x)` to wrap around (d = r + k - x)

But wait, we're looking for the _minimum_ operations. So for each element, the minimum operations to contribute a reduction of `r` modulo `k` is `min(r, r + k - x)`? Let's check:

Actually, the formula is simpler: For an element with remainder `x`, the minimum operations to make it contribute a reduction of `r` modulo `k` is:

- If `x ≥ r`: `r` operations (reduce by exactly `r`)
- If `x < r`: `r + k - x` operations (reduce enough to wrap around to a multiple of `k`, then reduce further)

So the answer is simply the minimum of these values across all elements!

Let's verify with our examples:
Example 1: `nums = [3, 6, 9, 11]`, `k = 5`, `r = 4`
Remainders: 3, 1, 4, 1
For each:

- x=3, x<4: operations = 4 + 5 - 3 = 6
- x=1, x<4: operations = 4 + 5 - 1 = 8
- x=4, x≥4: operations = 4
- x=1, x<4: operations = 8
  Minimum = 4 ✓

Example 2: `nums = [2, 4, 6]`, `k = 5`, `r = 2`
Remainders: 2, 4, 1

- x=2, x≥2: operations = 2
- x=4, x≥2: operations = 2
- x=1, x<2: operations = 2 + 5 - 1 = 6
  Minimum = 2 ✓

But wait, in example 2, we said the answer was 1 earlier. Let's recalculate:
For element with value 2 (remainder 2), to reduce sum by 2, we need to reduce this element by 2, which takes 2 operations, not 1. My earlier example was wrong! Let me recalculate the example properly:

`nums = [2, 4, 6]`, `k = 5`
Sum = 12, remainder = 2
We need to reduce total by 2. If we reduce element 2 by 2, it becomes 0 (2 operations).
If we reduce element 4 by 2, it becomes 2 (2 operations).
If we reduce element 6 by 2, it becomes 4 (2 operations).
So the answer is 2, not 1. My bad!

Here's the complete optimal solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(nums, k):
    """
    Calculate minimum operations to make array sum divisible by k.

    Args:
        nums: List of integers
        k: Integer divisor

    Returns:
        Minimum number of decrement operations needed
    """
    # Step 1: Calculate total sum of array
    total_sum = sum(nums)

    # Step 2: Find remainder when sum is divided by k
    remainder = total_sum % k

    # Step 3: If remainder is 0, no operations needed
    if remainder == 0:
        return 0

    # Step 4: For each element, calculate minimum operations
    # needed from that element to reduce total by remainder
    min_ops = float('inf')

    for num in nums:
        # Get current element's remainder when divided by k
        x = num % k

        # Calculate operations needed from this element
        if x >= remainder:
            # If element's remainder is >= needed remainder,
            # we can simply reduce by 'remainder'
            ops = remainder
        else:
            # Otherwise, we need to reduce enough to wrap around
            # to a multiple of k, then reduce further
            ops = remainder + k - x

        # Update minimum operations
        if ops < min_ops:
            min_ops = ops

    return min_ops
```

```javascript
// Time: O(n) | Space: O(1)
function minOperations(nums, k) {
  // Step 1: Calculate total sum of array
  let totalSum = 0;
  for (let num of nums) {
    totalSum += num;
  }

  // Step 2: Find remainder when sum is divided by k
  const remainder = totalSum % k;

  // Step 3: If remainder is 0, no operations needed
  if (remainder === 0) {
    return 0;
  }

  // Step 4: For each element, calculate minimum operations
  // needed from that element to reduce total by remainder
  let minOps = Infinity;

  for (let num of nums) {
    // Get current element's remainder when divided by k
    const x = num % k;

    // Calculate operations needed from this element
    let ops;
    if (x >= remainder) {
      // If element's remainder is >= needed remainder,
      // we can simply reduce by 'remainder'
      ops = remainder;
    } else {
      // Otherwise, we need to reduce enough to wrap around
      // to a multiple of k, then reduce further
      ops = remainder + k - x;
    }

    // Update minimum operations
    if (ops < minOps) {
      minOps = ops;
    }
  }

  return minOps;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minOperations(int[] nums, int k) {
        // Step 1: Calculate total sum of array
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // Step 2: Find remainder when sum is divided by k
        int remainder = totalSum % k;

        // Step 3: If remainder is 0, no operations needed
        if (remainder == 0) {
            return 0;
        }

        // Step 4: For each element, calculate minimum operations
        // needed from that element to reduce total by remainder
        int minOps = Integer.MAX_VALUE;

        for (int num : nums) {
            // Get current element's remainder when divided by k
            int x = num % k;

            // Calculate operations needed from this element
            int ops;
            if (x >= remainder) {
                // If element's remainder is >= needed remainder,
                // we can simply reduce by 'remainder'
                ops = remainder;
            } else {
                // Otherwise, we need to reduce enough to wrap around
                // to a multiple of k, then reduce further
                ops = remainder + k - x;
            }

            // Update minimum operations
            if (ops < minOps) {
                minOps = ops;
            }
        }

        return minOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array twice: once to calculate the total sum (O(n)), and once to find the minimum operations (O(n))
- All operations inside the loops are constant time (arithmetic operations and comparisons)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space: variables for total sum, remainder, minimum operations, and loop counters
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the case when remainder is 0**: Many candidates jump straight into calculating operations without checking if the sum is already divisible by `k`. Always handle the trivial case first.

2. **Incorrect formula for operations calculation**: The most common error is using `abs(x - remainder)` or similar incorrect formulas. Remember:
   - If `x ≥ remainder`: we need exactly `remainder` operations
   - If `x < remainder`: we need `remainder + k - x` operations (not `remainder - x`)

3. **Using integer division instead of modulo**: Some candidates calculate `total_sum // k` and try to work with the quotient instead of the remainder. The remainder is what matters because it tells us how far we are from divisibility.

4. **Not considering that operations must be positive integers**: We can only perform whole number decrements. While this doesn't affect our solution much, it's important to remember that we're counting discrete operations.

## When You'll See This Pattern

This problem uses **modular arithmetic** and **remainder analysis**, which appears in many coding problems:

1. **Subarray Sums Divisible by K (LeetCode 974)**: Also uses remainder counting, but with prefix sums and hash maps to find subarrays whose sum is divisible by k.

2. **Make Sum Divisible by P (LeetCode 1590)**: Very similar problem where you need to remove a subarray to make the sum divisible by p.

3. **Continuous Subarray Sum (LeetCode 523)**: Checks if there's a subarray of size at least 2 with sum divisible by k, using remainder tracking.

The core pattern is: when dealing with divisibility problems, think in terms of remainders modulo the divisor. Tracking how values relate modulo k often simplifies the problem significantly.

## Key Takeaways

1. **Modular arithmetic is powerful for divisibility problems**: When a problem involves making sums divisible by a number, immediately think about remainders modulo that number.

2. **The minimum operations often comes from a single element**: In this problem, we don't need to split operations across multiple elements. The optimal solution always uses just one element (the one requiring the fewest operations to contribute the needed remainder reduction).

3. **Check edge cases first**: Always check if the sum is already divisible (remainder = 0) before doing any calculations. This catches the simplest case and prevents unnecessary computation.

[Practice this problem on CodeJeet](/problem/minimum-operations-to-make-array-sum-divisible-by-k)
