---
title: "How to Solve Shift Distance Between Two Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shift Distance Between Two Strings. Medium difficulty, 53.5% acceptance rate. Topics: Array, String, Prefix Sum."
date: "2030-01-13"
category: "dsa-patterns"
tags: ["shift-distance-between-two-strings", "array", "string", "prefix-sum", "medium"]
---

# How to Solve Shift Distance Between Two Strings

You're given two strings `s` and `t` of equal length, along with two integer arrays `nextCost` and `previousCost`. For each position `i`, you need to transform `s[i]` to `t[i]` by shifting letters forward or backward in the alphabet, where each shift operation has a cost that depends on both the direction and the position. The challenge is to find the minimum total cost to transform all characters in `s` to match `t`. What makes this problem interesting is that each position has its own unique costs for forward and backward shifts, requiring careful calculation for each character transformation.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Example:**

```
s = "ab"
t = "bc"
nextCost = [1, 2]
previousCost = [3, 4]
```

We need to transform `s[0] = 'a'` to `t[0] = 'b'` and `s[1] = 'b'` to `t[1] = 'c'`.

**Position 0:**

- Character `'a'` needs to become `'b'`
- Forward shift: `'a'` → `'b'` requires 1 forward shift
- Cost = 1 × `nextCost[0]` = 1 × 1 = 1
- Backward shift: Would need to wrap around alphabet (25 shifts backward)
- Cost = 25 × `previousCost[0]` = 25 × 3 = 75
- Minimum for position 0 = 1

**Position 1:**

- Character `'b'` needs to become `'c'`
- Forward shift: `'b'` → `'c'` requires 1 forward shift
- Cost = 1 × `nextCost[1]` = 1 × 2 = 2
- Backward shift: Would need 25 shifts backward
- Cost = 25 × `previousCost[1]` = 25 × 4 = 100
- Minimum for position 1 = 2

**Total minimum cost = 1 + 2 = 3**

Now consider a more complex case where wrapping around might be cheaper:

```
s = "za"
t = "az"
nextCost = [1, 100]
previousCost = [100, 1]
```

**Position 0:**

- `'z'` → `'a'`
- Forward shift: `'z'` → `'a'` requires 1 forward shift (wraps around)
- Cost = 1 × `nextCost[0]` = 1 × 1 = 1
- Backward shift: Would need 25 shifts backward
- Cost = 25 × `previousCost[0]` = 25 × 100 = 2500
- Minimum = 1

**Position 1:**

- `'a'` → `'z'`
- Forward shift: Would need 25 shifts forward
- Cost = 25 × `nextCost[1]` = 25 × 100 = 2500
- Backward shift: `'a'` → `'z'` requires 1 backward shift (wraps around)
- Cost = 1 × `previousCost[1]` = 1 × 1 = 1
- Minimum = 1

**Total minimum cost = 1 + 1 = 2**

This shows we need to consider both forward and backward paths, including wrap-around scenarios.

## Brute Force Approach

A brute force approach would consider all possible ways to transform each character. For each position `i`, we need to find the minimum cost to transform `s[i]` to `t[i]`. The naive way is to try all possible shift sequences:

1. Calculate the forward distance: `(t_char - s_char + 26) % 26`
2. Calculate the backward distance: `(s_char - t_char + 26) % 26`
3. For each position, the cost is `min(forward_distance × nextCost[i], backward_distance × previousCost[i])`
4. Sum these minimum costs across all positions

While this approach is conceptually simple, it's actually optimal for this problem! The key insight is that for each position independently, we can calculate the minimum cost without considering other positions. The operations don't interfere with each other since we're transforming each character separately.

However, a truly naive candidate might try to consider all possible combinations of forward/backward choices across positions, which would be O(2^n) and unnecessary. The correct "brute force" is actually O(n) and optimal.

## Optimized Approach

The optimal approach recognizes that each position's transformation is independent. For each index `i`:

1. Convert `s[i]` and `t[i]` to their numeric values (0-25 for 'a'-'z')
2. Calculate the forward distance needed: how many forward shifts to go from `s_char` to `t_char`
   - Formula: `(t_char - s_char + 26) % 26`
   - The `+ 26` and `% 26` handle negative values and ensure result is in 0-25 range
3. Calculate the backward distance needed: how many backward shifts to go from `s_char` to `t_char`
   - Formula: `(s_char - t_char + 26) % 26`
4. The cost for forward transformation = `forward_distance × nextCost[i]`
5. The cost for backward transformation = `backward_distance × previousCost[i]`
6. Take the minimum of these two costs for position `i`
7. Sum the minimum costs across all positions

The critical insight is that we don't need to consider intermediate paths - the direct forward or backward path (which may wrap around the alphabet) will always be optimal because each shift has a constant cost per position.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of strings
# Space: O(1) - we only use constant extra space
def minCostToConvert(s, t, nextCost, previousCost):
    """
    Calculate minimum cost to convert string s to string t.

    Args:
        s: source string
        t: target string
        nextCost: cost array for forward shifts at each position
        previousCost: cost array for backward shifts at each position

    Returns:
        Minimum total cost to transform s to t
    """
    total_cost = 0

    # Process each character position independently
    for i in range(len(s)):
        # Convert characters to numeric values (0-25)
        s_char_val = ord(s[i]) - ord('a')
        t_char_val = ord(t[i]) - ord('a')

        # Calculate forward distance: how many forward shifts needed
        # Adding 26 ensures positive result, % 26 handles wrap-around
        forward_distance = (t_char_val - s_char_val + 26) % 26

        # Calculate backward distance: how many backward shifts needed
        # This is the complement of forward distance in alphabet
        backward_distance = (s_char_val - t_char_val + 26) % 26

        # Calculate cost for forward transformation
        forward_cost = forward_distance * nextCost[i]

        # Calculate cost for backward transformation
        backward_cost = backward_distance * previousCost[i]

        # Take the minimum cost for this position
        position_cost = min(forward_cost, backward_cost)

        # Add to total cost
        total_cost += position_cost

    return total_cost
```

```javascript
// Time: O(n) where n is the length of strings
// Space: O(1) - we only use constant extra space
function minCostToConvert(s, t, nextCost, previousCost) {
  /**
   * Calculate minimum cost to convert string s to string t.
   *
   * @param {string} s - source string
   * @param {string} t - target string
   * @param {number[]} nextCost - cost array for forward shifts at each position
   * @param {number[]} previousCost - cost array for backward shifts at each position
   * @return {number} Minimum total cost to transform s to t
   */
  let totalCost = 0;

  // Process each character position independently
  for (let i = 0; i < s.length; i++) {
    // Convert characters to numeric values (0-25)
    const sCharVal = s.charCodeAt(i) - "a".charCodeAt(0);
    const tCharVal = t.charCodeAt(i) - "a".charCodeAt(0);

    // Calculate forward distance: how many forward shifts needed
    // Adding 26 ensures positive result, % 26 handles wrap-around
    const forwardDistance = (tCharVal - sCharVal + 26) % 26;

    // Calculate backward distance: how many backward shifts needed
    // This is the complement of forward distance in alphabet
    const backwardDistance = (sCharVal - tCharVal + 26) % 26;

    // Calculate cost for forward transformation
    const forwardCost = forwardDistance * nextCost[i];

    // Calculate cost for backward transformation
    const backwardCost = backwardDistance * previousCost[i];

    // Take the minimum cost for this position
    const positionCost = Math.min(forwardCost, backwardCost);

    // Add to total cost
    totalCost += positionCost;
  }

  return totalCost;
}
```

```java
// Time: O(n) where n is the length of strings
// Space: O(1) - we only use constant extra space
class Solution {
    public long minCostToConvert(String s, String t, int[] nextCost, int[] previousCost) {
        /**
         * Calculate minimum cost to convert string s to string t.
         *
         * @param s: source string
         * @param t: target string
         * @param nextCost: cost array for forward shifts at each position
         * @param previousCost: cost array for backward shifts at each position
         * @return Minimum total cost to transform s to t
         */
        long totalCost = 0;

        // Process each character position independently
        for (int i = 0; i < s.length(); i++) {
            // Convert characters to numeric values (0-25)
            int sCharVal = s.charAt(i) - 'a';
            int tCharVal = t.charAt(i) - 'a';

            // Calculate forward distance: how many forward shifts needed
            // Adding 26 ensures positive result, % 26 handles wrap-around
            int forwardDistance = (tCharVal - sCharVal + 26) % 26;

            // Calculate backward distance: how many backward shifts needed
            // This is the complement of forward distance in alphabet
            int backwardDistance = (sCharVal - tCharVal + 26) % 26;

            // Calculate cost for forward transformation
            long forwardCost = (long) forwardDistance * nextCost[i];

            // Calculate cost for backward transformation
            long backwardCost = (long) backwardDistance * previousCost[i];

            // Take the minimum cost for this position
            long positionCost = Math.min(forwardCost, backwardCost);

            // Add to total cost
            totalCost += positionCost;
        }

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the strings once, processing each position in constant time
- For each position, we perform arithmetic operations and comparisons that take O(1) time
- The total time is linear in the length of the input strings

**Space Complexity: O(1)**

- We only use a few variables to store intermediate results
- The input arrays are not counted in space complexity analysis
- No additional data structures are created that scale with input size

## Common Mistakes

1. **Forgetting to handle wrap-around correctly**: When calculating distances, candidates might use simple subtraction without the `+ 26) % 26` adjustment. This fails for cases like `'z'` to `'a'` where forward distance should be 1, not -25.

2. **Integer overflow in Java**: When multiplying distance by cost, the result might exceed 32-bit integer limits. Always use `long` for intermediate calculations in Java to avoid overflow.

3. **Assuming equal costs for forward and backward**: Some candidates might calculate only the absolute distance and multiply by a single cost, forgetting that `nextCost` and `previousCost` are different arrays with potentially different values at each position.

4. **Not considering that backward wrap-around might be cheaper**: For example, transforming `'a'` to `'z'` might be cheaper going backward (1 step) than forward (25 steps), depending on the cost arrays.

## When You'll See This Pattern

This problem uses the **independent subproblems** pattern, where the overall solution can be decomposed into independent smaller problems. You'll see this pattern in:

1. **Shifting Letters (LeetCode 848)**: Similar concept of shifting letters with wrap-around, though with cumulative shifts rather than per-position costs.

2. **Shifting Letters II (LeetCode 2381)**: Builds on the shifting concept with range updates, requiring prefix sums to optimize.

3. **Minimum Time to Make Rope Colorful (LeetCode 1578)**: While different domain, it also involves making independent decisions at each position with cost considerations.

The key insight is recognizing when problems can be solved by processing elements independently versus when decisions affect each other.

## Key Takeaways

1. **Look for independence**: When operations on different elements don't interfere with each other, you can solve the problem by optimizing each element independently. This often leads to O(n) solutions.

2. **Handle circular structures carefully**: With alphabets or other circular data, always use modulo arithmetic `(x + N) % N` to handle wrap-around correctly.

3. **Consider both directions**: When transformation can happen in multiple ways (forward/backward, increment/decrement), calculate costs for all valid paths and take the minimum.

Related problems: [Shifting Letters](/problem/shifting-letters), [Shifting Letters II](/problem/shifting-letters-ii)
