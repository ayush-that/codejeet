---
title: "How to Solve Maximum Nesting Depth of Two Valid Parentheses Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Nesting Depth of Two Valid Parentheses Strings. Medium difficulty, 71.8% acceptance rate. Topics: String, Stack."
date: "2029-03-11"
category: "dsa-patterns"
tags: ["maximum-nesting-depth-of-two-valid-parentheses-strings", "string", "stack", "medium"]
---

# How to Solve Maximum Nesting Depth of Two Valid Parentheses Strings

This problem asks us to split a valid parentheses string into two subsequences such that the maximum nesting depth of both subsequences is minimized. The tricky part is that we need to partition the parentheses into two groups while maintaining each group's validity as a parentheses string, and we want to make both groups as "shallow" as possible. This is essentially a coloring problem where we assign each parenthesis to group 0 or 1 to balance the depth.

## Visual Walkthrough

Let's trace through an example: `"(()())"`

First, let's understand the depth at each position:

- `(` at index 0: depth = 1
- `(` at index 1: depth = 2
- `)` at index 2: depth = 1
- `(` at index 3: depth = 2
- `)` at index 4: depth = 1
- `)` at index 5: depth = 0

The maximum depth overall is 2. Our goal is to split these parentheses into two groups (0 and 1) such that the maximum depth in each group is minimized.

Key insight: We can alternate assigning parentheses to groups based on whether their depth is odd or even. This naturally balances the depth between the two groups.

Let's try this approach:

- Index 0: depth 1 (odd) → assign to group 1
- Index 1: depth 2 (even) → assign to group 0
- Index 2: depth 1 (odd) → assign to group 1
- Index 3: depth 2 (even) → assign to group 0
- Index 4: depth 1 (odd) → assign to group 1
- Index 5: depth 0 (even) → assign to group 0

Result: `[1, 0, 1, 0, 1, 0]`

Now let's verify the groups:

- Group 0: indices 1, 3, 5 → `"()"` (depth 1)
- Group 1: indices 0, 2, 4 → `"()()"` (depth 1)

Both groups have maximum depth 1, which is the minimum possible since the overall maximum depth was 2.

## Brute Force Approach

A brute force approach would try all possible assignments of each parenthesis to either group 0 or 1. For a string of length n, there are 2^n possible assignments. For each assignment, we would need to:

1. Extract the subsequences for both groups
2. Verify each subsequence is a valid parentheses string
3. Calculate the maximum depth for each group
4. Track the assignment that minimizes the maximum of the two depths

This approach is clearly exponential (O(2^n)) and would only work for very small inputs (n ≤ 20). Even for moderate n=100, 2^100 is astronomically large.

The main issue with brute force is that it doesn't leverage the structure of parentheses strings. Valid parentheses strings have a specific pattern: they must start with `(`, end with `)`, and maintain non-negative depth throughout.

## Optimized Approach

The key insight is that we don't need to try all combinations. We can use a greedy approach based on the current depth:

1. Track the current depth as we iterate through the string
2. When we see `(`, we increase depth
3. When we see `)`, we decrease depth (but note: we're processing a VPS, so depth will never go negative)
4. Assign parentheses to groups based on whether the depth is odd or even

Why does this work?

- Odd-depth parentheses form one group, even-depth parentheses form the other
- This naturally alternates assignments, preventing deep nesting in either group
- Each group remains a valid parentheses string because we're essentially "coloring" the original valid string in an alternating pattern
- The maximum depth in each group will be approximately half of the original maximum depth

Mathematically, if the original maximum depth is D, then each group will have maximum depth at most ⌈D/2⌉, which is optimal.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def maxDepthAfterSplit(seq: str):
    """
    Split a valid parentheses string into two subsequences to minimize
    the maximum nesting depth of both subsequences.

    The key insight: assign parentheses to groups based on whether
    their current depth is odd or even. This naturally balances
    the depth between the two groups.

    Args:
        seq: A valid parentheses string

    Returns:
        List of 0s and 1s where result[i] indicates which group
        the i-th parenthesis belongs to
    """
    result = []
    depth = 0

    for char in seq:
        if char == '(':
            # Increase depth for opening parenthesis
            depth += 1
            # Assign to group based on whether depth is odd
            # Odd depths go to group 1, even to group 0
            result.append(depth % 2)
        else:  # char == ')'
            # Assign to group based on whether depth is odd
            # BEFORE decreasing it (to match with corresponding '(')
            result.append(depth % 2)
            # Decrease depth for closing parenthesis
            depth -= 1

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
/**
 * Split a valid parentheses string into two subsequences to minimize
 * the maximum nesting depth of both subsequences.
 *
 * The key insight: assign parentheses to groups based on whether
 * their current depth is odd or even. This naturally balances
 * the depth between the two groups.
 *
 * @param {string} seq - A valid parentheses string
 * @return {number[]} - Array of 0s and 1s where result[i] indicates which group
 *                      the i-th parenthesis belongs to
 */
function maxDepthAfterSplit(seq) {
  const result = [];
  let depth = 0;

  for (let i = 0; i < seq.length; i++) {
    const char = seq[i];

    if (char === "(") {
      // Increase depth for opening parenthesis
      depth++;
      // Assign to group based on whether depth is odd
      // Odd depths go to group 1, even to group 0
      result.push(depth % 2);
    } else {
      // char === ')'
      // Assign to group based on whether depth is odd
      // BEFORE decreasing it (to match with corresponding '(')
      result.push(depth % 2);
      // Decrease depth for closing parenthesis
      depth--;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
class Solution {
    /**
     * Split a valid parentheses string into two subsequences to minimize
     * the maximum nesting depth of both subsequences.
     *
     * The key insight: assign parentheses to groups based on whether
     * their current depth is odd or even. This naturally balances
     * the depth between the two groups.
     *
     * @param seq - A valid parentheses string
     * @return Array of 0s and 1s where result[i] indicates which group
     *         the i-th parenthesis belongs to
     */
    public int[] maxDepthAfterSplit(String seq) {
        int n = seq.length();
        int[] result = new int[n];
        int depth = 0;

        for (int i = 0; i < n; i++) {
            char c = seq.charAt(i);

            if (c == '(') {
                // Increase depth for opening parenthesis
                depth++;
                // Assign to group based on whether depth is odd
                // Odd depths go to group 1, even to group 0
                result[i] = depth % 2;
            } else { // c == ')'
                // Assign to group based on whether depth is odd
                // BEFORE decreasing it (to match with corresponding '(')
                result[i] = depth % 2;
                // Decrease depth for closing parenthesis
                depth--;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string once, performing constant-time operations for each character
- The operations include: checking character type, incrementing/decrementing depth, modulo operation, and appending to result array

**Space Complexity:** O(1) excluding the output array

- We only use a few integer variables (depth, loop counter)
- The output array is O(n) but is required by the problem specification
- If we don't count the output, the auxiliary space is O(1)

## Common Mistakes

1. **Forgetting to assign closing parentheses before decreasing depth**: The closing parenthesis should be assigned based on the depth BEFORE decrementing. This ensures it matches with its corresponding opening parenthesis. If you decrement first, you'll assign based on the wrong depth.

2. **Using stack instead of depth counter**: While a stack could track depth, it's unnecessary overhead. The depth counter is sufficient since we're processing a valid parentheses string (guaranteed to be balanced).

3. **Overcomplicating with BFS/DFS**: Some candidates try to model this as a graph coloring problem with BFS/DFS, which is O(n^2) or worse. The odd/even depth approach is simpler and optimal.

4. **Not understanding the output format**: The problem asks for an array where each element is 0 or 1, not the actual subsequences. Some candidates waste time constructing the actual strings instead of just returning the group assignments.

## When You'll See This Pattern

This problem uses a **greedy assignment based on parity** (odd/even) pattern. You'll see similar patterns in:

1. **Maximum Nesting Depth of the Parentheses (Easy)**: The simpler version where you just find the maximum depth without splitting. This helps build intuition for tracking depth.

2. **Valid Parentheses (Easy)**: Uses a stack to validate parentheses strings, which is foundational for understanding parentheses problems.

3. **Remove Invalid Parentheses (Hard)**: More complex but builds on understanding parentheses structure and validity.

4. **Longest Valid Parentheses (Hard)**: Uses dynamic programming or stack to find the longest valid substring, requiring deep understanding of parentheses matching.

The odd/even assignment trick is specific to this problem, but the concept of tracking depth while processing parentheses is fundamental to many string/stack problems.

## Key Takeaways

1. **Depth tracking is key for parentheses problems**: Many parentheses problems become easier when you track the current nesting depth as you process the string.

2. **Greedy assignments based on simple properties can be optimal**: The odd/even depth assignment seems almost too simple, but it's mathematically optimal for this problem. Don't overcomplicate!

3. **Valid parentheses strings have useful properties**: The guarantee that the input is a VPS means we don't need to handle invalid cases, which simplifies our logic (no need for stack validation).

Related problems: [Maximum Nesting Depth of the Parentheses](/problem/maximum-nesting-depth-of-the-parentheses)
