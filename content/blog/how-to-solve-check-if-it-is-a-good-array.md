---
title: "How to Solve Check If It Is a Good Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Check If It Is a Good Array. Hard difficulty, 63.4% acceptance rate. Topics: Array, Math, Number Theory."
date: "2029-01-05"
category: "dsa-patterns"
tags: ["check-if-it-is-a-good-array", "array", "math", "number-theory", "hard"]
---

# How to Solve "Check If It Is a Good Array"

This problem asks: given an array of positive integers, can we select some subset, multiply each element by any integer (positive, negative, or zero), and sum them to get exactly 1? If yes, the array is "good." At first glance, this seems like a complex combinatorial search problem, but it has a beautiful mathematical simplification. The tricky part is recognizing that this is essentially asking whether the greatest common divisor (GCD) of all numbers in the array equals 1.

## Visual Walkthrough

Let's walk through an example: `nums = [6, 10, 15]`.

**Step 1: Understanding the operation**
We can pick any subset. For example, we could pick just `6`, multiply it by some integer `x`, and get `6x`. Or we could pick `6` and `10`, multiply them by integers `x` and `y`, and get `6x + 10y`. The question is: can we find some combination that equals 1?

**Step 2: Trying combinations**

- If we pick just `6`: `6x = 1` → `x = 1/6` (not an integer)
- If we pick just `10`: `10y = 1` → `y = 1/10` (not an integer)
- If we pick just `15`: `15z = 1` → `z = 1/15` (not an integer)

But what if we combine them? Let's try `6x + 10y = 1`. Can we find integers `x` and `y` that satisfy this? Yes! For example, `6*(-4) + 10*(2.5)` gives -24 + 25 = 1, but 2.5 isn't an integer. Let's find integer solutions: `6*2 + 10*(-1) = 12 - 10 = 2` (not 1). Actually, any combination `6x + 10y` will always be a multiple of the GCD of 6 and 10, which is 2. So we can only get even numbers: ..., -4, -2, 0, 2, 4, ... Never 1.

**Step 3: Adding the third number**
Now consider all three: `6x + 10y + 15z`. The GCD of all three numbers is 1. According to Bézout's identity, there exist integers `x, y, z` such that `6x + 10y + 15z = 1`. One solution: `6*1 + 10*1 + 15*(-1) = 6 + 10 - 15 = 1`. Yes! So this array is good.

**Key insight**: The array is good if and only if the GCD of all elements is 1. If GCD > 1, every combination will be a multiple of that GCD, so we can never get 1.

## Brute Force Approach

A naive approach would be to try all possible subsets and all possible integer multipliers. But how many multipliers? Infinite! Even if we bound them, the search space explodes.

What a candidate might try:

1. Generate all subsets (2^n possibilities)
2. For each subset, try multipliers within some range (say -100 to 100)
3. Check if any combination sums to 1

This fails because:

- We can't bound the multipliers (they could be arbitrarily large)
- Even with bounds, the complexity is astronomical: O(2^n \* m^k) where n is array length, m is multiplier range, k is subset size
- There's no guarantee we'll find a solution even if one exists within our bounded search

The brute force is computationally infeasible for any non-trivial input.

## Optimized Approach

The key insight comes from number theory: **Bézout's identity**.

**Bézout's identity**: For integers a and b, there exist integers x and y such that ax + by = gcd(a, b). This extends to multiple numbers: for integers a₁, a₂, ..., aₙ, there exist integers x₁, x₂, ..., xₙ such that a₁x₁ + a₂x₂ + ... + aₙxₙ = gcd(a₁, a₂, ..., aₙ).

**Applying to our problem**:

- If gcd(nums) = 1, then by Bézout's identity, we can find integer multipliers that sum to 1.
- If gcd(nums) = d > 1, then any linear combination will be divisible by d, so we can never get 1.

**Why this works**:

1. The operations allowed (multiply by any integer, sum any subset) exactly correspond to integer linear combinations.
2. The set of all possible sums is precisely the set of multiples of gcd(nums).
3. We want 1 to be in this set, which happens iff gcd(nums) = 1.

**Algorithm**:

1. Compute the GCD of all numbers in the array.
2. If GCD == 1, return True (array is good).
3. Otherwise, return False.

**Step-by-step reasoning**:

- Start with `g = nums[0]`
- For each subsequent number `num`, update `g = gcd(g, num)`
- If at any point `g == 1`, we can short-circuit and return True
- After processing all numbers, check if `g == 1`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(min(nums))) | Space: O(1)
# where n is the length of nums, and log(min(nums)) is the time for gcd computation
def isGoodArray(nums):
    """
    Returns True if the array is "good" (we can obtain sum 1 from any subset
    multiplied by integers), False otherwise.

    The key insight: By Bézout's identity, we can obtain sum 1 if and only if
    the greatest common divisor (GCD) of all numbers in the array is 1.
    """
    # Edge case: empty array cannot produce sum 1
    if not nums:
        return False

    # Initialize gcd with the first element
    g = nums[0]

    # Iterate through all numbers in the array
    for num in nums:
        # Update gcd with current number
        g = gcd(g, num)

        # Early exit: if gcd becomes 1 at any point, we know the array is good
        # This is because gcd(1, anything) = 1
        if g == 1:
            return True

    # After processing all numbers, check if final gcd is 1
    return g == 1

def gcd(a, b):
    """
    Compute greatest common divisor using Euclidean algorithm.
    Euclidean algorithm: gcd(a, b) = gcd(b, a mod b)
    """
    while b:
        a, b = b, a % b
    return abs(a)  # abs ensures positive result for negative inputs (not needed here as nums are positive)
```

```javascript
// Time: O(n * log(min(nums))) | Space: O(1)
// where n is the length of nums, and log(min(nums)) is the time for gcd computation
function isGoodArray(nums) {
  /**
   * Returns true if the array is "good" (we can obtain sum 1 from any subset
   * multiplied by integers), false otherwise.
   *
   * The key insight: By Bézout's identity, we can obtain sum 1 if and only if
   * the greatest common divisor (GCD) of all numbers in the array is 1.
   */

  // Edge case: empty array cannot produce sum 1
  if (!nums || nums.length === 0) {
    return false;
  }

  // Initialize gcd with the first element
  let g = nums[0];

  // Iterate through all numbers in the array
  for (let i = 0; i < nums.length; i++) {
    // Update gcd with current number
    g = gcd(g, nums[i]);

    // Early exit: if gcd becomes 1 at any point, we know the array is good
    // This is because gcd(1, anything) = 1
    if (g === 1) {
      return true;
    }
  }

  // After processing all numbers, check if final gcd is 1
  return g === 1;
}

function gcd(a, b) {
  /**
   * Compute greatest common divisor using Euclidean algorithm.
   * Euclidean algorithm: gcd(a, b) = gcd(b, a mod b)
   */
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a); // abs ensures positive result for negative inputs
}
```

```java
// Time: O(n * log(min(nums))) | Space: O(1)
// where n is the length of nums, and log(min(nums)) is the time for gcd computation
class Solution {
    public boolean isGoodArray(int[] nums) {
        /**
         * Returns true if the array is "good" (we can obtain sum 1 from any subset
         * multiplied by integers), false otherwise.
         *
         * The key insight: By Bézout's identity, we can obtain sum 1 if and only if
         * the greatest common divisor (GCD) of all numbers in the array is 1.
         */

        // Edge case: empty array cannot produce sum 1
        if (nums == null || nums.length == 0) {
            return false;
        }

        // Initialize gcd with the first element
        int g = nums[0];

        // Iterate through all numbers in the array
        for (int i = 0; i < nums.length; i++) {
            // Update gcd with current number
            g = gcd(g, nums[i]);

            // Early exit: if gcd becomes 1 at any point, we know the array is good
            // This is because gcd(1, anything) = 1
            if (g == 1) {
                return true;
            }
        }

        // After processing all numbers, check if final gcd is 1
        return g == 1;
    }

    private int gcd(int a, int b) {
        /**
         * Compute greatest common divisor using Euclidean algorithm.
         * Euclidean algorithm: gcd(a, b) = gcd(b, a mod b)
         */
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);  // abs ensures positive result for negative inputs
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n \* log(min(nums)))

- We iterate through all n elements once
- For each element, we compute GCD with the running GCD
- Each GCD computation takes O(log(min(a, b))) using the Euclidean algorithm
- In the worst case, the running GCD keeps decreasing slowly, but amortized analysis shows O(n \* log(min(nums))) is a tight bound

**Space Complexity**: O(1)

- We only use a few variables (g, loop counter)
- No additional data structures proportional to input size

## Common Mistakes

1. **Not handling empty array**: The problem states the array contains positive integers, but edge cases matter. An empty array cannot produce sum 1. Always check for empty input.

2. **Forgetting early exit optimization**: Once the running GCD becomes 1, we can return True immediately. Continuing to compute GCDs is unnecessary work. This optimization can significantly speed up cases where early numbers have GCD 1.

3. **Incorrect GCD implementation**: Some candidates try to implement GCD recursively without considering stack overflow for large inputs, or they implement an inefficient version. The iterative Euclidean algorithm shown above is optimal.

4. **Misunderstanding the problem as subset sum**: This is NOT a subset sum problem. The multipliers can be any integers (negative, zero, positive), and we can use any subset. This transforms the problem into a number theory question about integer linear combinations.

## When You'll See This Pattern

This pattern of reducing a combinatorial problem to a GCD calculation appears in several contexts:

1. **Water and Jug Problem (LeetCode 365)**: Given two jugs with capacities x and y, can you measure exactly z liters? The solution involves checking if z is a multiple of gcd(x, y) and z ≤ x + y.

2. **Fraction Addition and Subtraction (LeetCode 592)**: Adding fractions requires computing GCD to reduce fractions to simplest form.

3. **X of a Kind in a Deck of Cards (LeetCode 914)**: Checking if we can partition cards into groups of size X where all cards in a group have the same value involves GCD calculations on frequencies.

The common thread: when a problem involves divisibility, partitioning into equal groups, or integer combinations, think about GCD.

## Key Takeaways

1. **Bézout's identity is powerful**: When you see "integer linear combination" problems (sum of multiples with integer coefficients), consider whether GCD can determine what's achievable.

2. **Reduce before you compute**: Many problems that seem like search or DP can be simplified with mathematical insights. Always ask: "Is there a property or theorem that simplifies this?"

3. **GCD has efficient algorithms**: The Euclidean algorithm (iterative `while(b) { a, b = b, a % b }`) runs in O(log(min(a,b))) time and is the standard for GCD computations.

[Practice this problem on CodeJeet](/problem/check-if-it-is-a-good-array)
