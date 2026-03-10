---
title: "How to Solve Count All Valid Pickup and Delivery Options — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count All Valid Pickup and Delivery Options. Hard difficulty, 64.9% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2026-11-30"
category: "dsa-patterns"
tags:
  [
    "count-all-valid-pickup-and-delivery-options",
    "math",
    "dynamic-programming",
    "combinatorics",
    "hard",
  ]
---

# How to Solve Count All Valid Pickup and Delivery Options

This problem asks us to count all valid sequences of `n` pickup and delivery operations where each delivery must occur after its corresponding pickup. What makes this problem interesting is that while it appears to be a permutation problem, the constraints create a combinatorial structure that requires careful mathematical reasoning rather than brute-force enumeration.

## Visual Walkthrough

Let's build intuition with a small example where `n = 2`. We have two orders: P1 (pickup 1), D1 (delivery 1), P2, D2.

The constraints are:

1. D1 must come after P1
2. D2 must come after P2

Let's enumerate all valid sequences:

1. P1, P2, D1, D2
2. P1, P2, D2, D1
3. P1, D1, P2, D2
4. P2, P1, D1, D2
5. P2, P1, D2, D1
6. P2, D2, P1, D1

That's 6 valid sequences. Notice what's happening: we're essentially placing 2 pairs of related items (P1-D1 and P2-D2) into 4 positions, with each delivery coming after its pickup.

For `n = 1`, we only have P1 and D1. The only valid sequence is P1, D1. That's 1 sequence.

For `n = 3`, the answer is 90. Let's understand why we get these numbers without enumerating all possibilities.

## Brute Force Approach

A naive approach would be to generate all permutations of the 2n operations (n pickups and n deliveries) and count only those where for every i, D_i appears after P_i. This would involve:

1. Generating all (2n)! permutations
2. For each permutation, checking if all deliveries come after their corresponding pickups
3. Counting the valid ones

The code would look something like this (in Python):

```python
from itertools import permutations

def countOrdersBruteForce(n):
    # Create list of operations: P1, D1, P2, D2, ..., Pn, Dn
    operations = []
    for i in range(1, n+1):
        operations.append(f"P{i}")
        operations.append(f"D{i}")

    count = 0
    # Generate all permutations
    for perm in permutations(operations):
        valid = True
        # Track last seen position of each pickup
        pickup_positions = {}
        for pos, op in enumerate(perm):
            if op.startswith('P'):
                order_num = int(op[1:])
                pickup_positions[order_num] = pos
            else:  # Delivery
                order_num = int(op[1:])
                if order_num not in pickup_positions:
                    valid = False
                    break
                # Check if delivery comes after pickup
                if pos < pickup_positions[order_num]:
                    valid = False
                    break
        if valid:
            count += 1

    return count
```

**Why this fails:** For n=3, we have 6 operations, so 6! = 720 permutations to check. For n=8, we have 16 operations, so 16! ≈ 2.09 × 10¹³ permutations. This is computationally impossible. We need a smarter approach.

## Optimized Approach

The key insight is that we can build the solution incrementally using combinatorics. Let's think about how to add the k-th order (P_k and D_k) to a sequence that already contains the first k-1 orders.

When we have k-1 orders, we have 2(k-1) operations already placed. We need to insert P_k and D_k into the sequence while maintaining:

1. P_k must come before D_k
2. All previous constraints still hold

Think about it this way: We have 2(k-1) + 1 = 2k-1 "slots" where we can insert P_k (before the first operation, between any two operations, or after the last operation). Once P_k is placed, we have 2k slots total (since we added P_k), and we need to place D_k somewhere after P_k.

Here's the combinatorial reasoning:

1. Place P_k: There are (2(k-1) + 1) = (2k-1) possible positions
2. Place D_k: Once P_k is placed, we have k deliveries (including D_k) and k-1 pickups (excluding P_k) in the sequence. The number of valid positions for D_k depends on where P_k was placed.

Actually, there's an even cleaner way to think about it: When placing the k-th order, we need to choose positions for both P_k and D_k simultaneously. The number of ways to choose 2 positions out of 2k available positions such that the first position is for P_k and the second is for D_k is given by combinations: C(2k, 2) = (2k choose 2) = (2k × (2k-1)) / 2.

But wait, that's not quite right because we need P_k to come before D_k. Actually, if we just choose any 2 positions out of 2k, half of those choices will have P_k after D_k (invalid). So the valid number is (2k choose 2) / 2 = k(2k-1).

So the recurrence relation is:

- f(1) = 1
- f(k) = f(k-1) × k × (2k-1)

Let's verify with our examples:

- f(1) = 1 ✓
- f(2) = f(1) × 2 × (4-1) = 1 × 2 × 3 = 6 ✓
- f(3) = f(2) × 3 × (6-1) = 6 × 3 × 5 = 90 ✓

## Optimal Solution

Now we can implement this efficiently using either dynamic programming (bottom-up) or direct computation. We'll use the recurrence relation and compute modulo 10^9+7 at each step to prevent overflow.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countOrders(n):
    """
    Counts all valid pickup/delivery sequences for n orders.

    The recurrence relation is: f(k) = f(k-1) * k * (2k-1)
    where f(1) = 1.

    We compute this iteratively to avoid recursion depth issues
    and take modulo at each step to prevent overflow.
    """
    MOD = 10**9 + 7

    # Base case: f(1) = 1
    result = 1

    # Build up from 2 to n using the recurrence relation
    for k in range(2, n + 1):
        # f(k) = f(k-1) * k * (2k-1)
        result = (result * k * (2 * k - 1)) % MOD

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function countOrders(n) {
  /**
   * Counts all valid pickup/delivery sequences for n orders.
   *
   * The recurrence relation is: f(k) = f(k-1) * k * (2k-1)
   * where f(1) = 1.
   *
   * We compute this iteratively to avoid recursion depth issues
   * and take modulo at each step to prevent overflow.
   */
  const MOD = 1_000_000_007;

  // Base case: f(1) = 1
  let result = 1;

  // Build up from 2 to n using the recurrence relation
  for (let k = 2; k <= n; k++) {
    // f(k) = f(k-1) * k * (2k-1)
    // Use BigInt to avoid integer overflow in intermediate calculations
    result = (result * k * (2 * k - 1)) % MOD;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countOrders(int n) {
        /**
         * Counts all valid pickup/delivery sequences for n orders.
         *
         * The recurrence relation is: f(k) = f(k-1) * k * (2k-1)
         * where f(1) = 1.
         *
         * We compute this iteratively to avoid recursion depth issues
         * and take modulo at each step to prevent overflow.
         */
        final int MOD = 1_000_000_007;

        // Base case: f(1) = 1
        long result = 1;  // Use long to avoid overflow before modulo

        // Build up from 2 to n using the recurrence relation
        for (int k = 2; k <= n; k++) {
            // f(k) = f(k-1) * k * (2k-1)
            // The multiplication might exceed int range, so use long
            result = (result * k * (2L * k - 1)) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We perform a single loop from 2 to n, doing constant-time operations (multiplication and modulo) at each step.
- The loop runs n-1 times, so time complexity is linear in n.

**Space Complexity:** O(1)

- We only use a constant amount of extra space (the `result` variable and loop counter).
- No additional data structures that grow with n are used.

## Common Mistakes

1. **Forgetting to use modulo during intermediate calculations:** If you only apply modulo at the end, the intermediate values can overflow even 64-bit integers for large n. Always apply modulo after each multiplication.

2. **Using integer types that overflow:** In Java, using `int` for the result can cause overflow even with modulo applied at each step if the multiplication overflows before the modulo operation. Always use `long` for intermediate calculations in Java.

3. **Incorrect recurrence relation:** Some candidates try to use permutations or combinations incorrectly. Remember: when adding the k-th order to 2(k-1) existing operations, you have (2k-1) choices for P_k, and then the position of D_k is determined by where P_k was placed (it must be after P_k).

4. **Off-by-one errors in the loop:** Starting the loop at 1 instead of 2, or going to n-1 instead of n. Test with n=1 and n=2 to verify your base cases.

## When You'll See This Pattern

This combinatorial recurrence pattern appears in problems where you're counting valid sequences or arrangements with constraints:

1. **"Count Ways to Build Rooms in an Ant Colony" (LeetCode 1916)** - Similar combinatorial counting with constraints on dependencies.

2. **"Number of Ways to Rearrange Sticks With K Sticks Visible" (LeetCode 1866)** - Uses similar recurrence relations for counting valid permutations with visibility constraints.

3. **"Count Sorted Vowel Strings" (LeetCode 1641)** - Counting strings with non-decreasing characters uses similar combinatorial reasoning.

The key pattern is recognizing when a counting problem can be broken down into smaller subproblems with a recurrence relation, often involving factorial-like terms that can be computed incrementally.

## Key Takeaways

1. **Combinatorial problems often have mathematical solutions** - Don't jump to brute force enumeration. Look for patterns and recurrence relations.

2. **Think incrementally** - When counting sequences, consider how to add one more element to existing valid sequences. This often leads to a recurrence relation.

3. **Modulo arithmetic requires careful handling** - Apply modulo at each step of computation to prevent overflow, especially with large n and factorial-like growth.

[Practice this problem on CodeJeet](/problem/count-all-valid-pickup-and-delivery-options)
