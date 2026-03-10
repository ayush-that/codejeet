---
title: "How to Solve Minimum Cost to Make All Characters Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Make All Characters Equal. Medium difficulty, 54.2% acceptance rate. Topics: String, Dynamic Programming, Greedy."
date: "2029-09-30"
category: "dsa-patterns"
tags:
  ["minimum-cost-to-make-all-characters-equal", "string", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Minimum Cost to Make All Characters Equal

This problem asks us to transform a binary string into all '0's or all '1's with minimal cost, where we can flip prefixes or suffixes at a cost proportional to their length. What makes this problem interesting is that we need to consider both directions of flipping (from left or right) and find the optimal balance between them. The challenge lies in efficiently evaluating all possible split points where we might switch from one type of operation to another.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "00110"`. Our goal is to make all characters equal with minimal cost.

**Step 1: Understanding the operations**

- Prefix flip at index `i`: Flips characters `s[0]` through `s[i]` at cost `i + 1`
- Suffix flip at index `i`: Flips characters `s[i]` through `s[n-1]` at cost `n - i`

**Step 2: Thinking about the target**
We can aim for either all '0's or all '1's. Let's try for all '0's first.

**Step 3: Evaluating prefix-only approach**
If we only use prefix flips to get all '0's:

- Start: `00110`
- At index 0: '0' is already correct, no flip needed
- At index 1: '0' is already correct, no flip needed
- At index 2: '1' needs flipping → flip prefix ending at index 2 → `11010` (cost 3)
- At index 3: '1' needs flipping → flip prefix ending at index 3 → `00100` (cost 4)
- At index 4: '0' is already correct
  Total cost = 3 + 4 = 7

**Step 4: Evaluating suffix-only approach**
If we only use suffix flips to get all '0's:

- Start: `00110`
- At index 4: '0' is already correct
- At index 3: '1' needs flipping → flip suffix starting at index 3 → `00101` (cost 2)
- At index 2: '0' is already correct
- At index 1: '0' is already correct
- At index 0: '0' is already correct
  Total cost = 2

**Step 5: Considering mixed approach**
What if we combine both? Let's think about index 2 as a split point:

- Use prefix flips for indices 0-2
- Use suffix flips for indices 2-4

For all '0's:

- Left of index 2: `001` → would need prefix flip at index 2 (cost 3)
- Right of index 2: `10` → would need suffix flip at index 3 (cost 2)
  Total = 5

But wait, we can do better! The key insight is that we should consider each position as a potential boundary between prefix and suffix operations.

## Brute Force Approach

A naive approach would try all possible combinations of operations. For each character, we could decide whether to flip it using a prefix or suffix operation. With `n` characters and 2 choices per character (prefix or suffix), this gives us `2^n` possibilities to check, which is clearly infeasible for `n` up to 10^5.

Even a slightly better brute force would try all split points `i` where:

- Characters before `i` are handled by prefix operations
- Characters at and after `i` are handled by suffix operations

For each split point, we would need to calculate the cost of making all characters equal to '0' or '1'. This would require scanning the string for each split point, giving us O(n²) time complexity, which is still too slow for the constraints.

## Optimized Approach

The key insight is that we can precompute the costs for making all characters equal using only prefix operations or only suffix operations, then combine them efficiently.

**Step-by-step reasoning:**

1. **Prefix cost calculation**: For each position `i`, we need to know the cost to make `s[0..i]` all '0's or all '1's using only prefix flips.
   - If `s[i]` doesn't match the target, we need to flip the prefix ending at `i`
   - The cost accumulates as we move from left to right

2. **Suffix cost calculation**: Similarly, for each position `i`, we need the cost to make `s[i..n-1]` all '0's or all '1's using only suffix flips.
   - If `s[i]` doesn't match the target, we need to flip the suffix starting at `i`
   - We can compute this from right to left

3. **Combining costs**: For each possible split point `i` (where `i` ranges from 0 to `n`), the total cost is:
   - Cost to make `s[0..i-1]` all '0's using prefix operations
   - Plus cost to make `s[i..n-1]` all '0's using suffix operations
     We do the same for making all '1's and take the minimum.

4. **Efficient computation**: We can compute prefix costs in O(n) by scanning left to right, and suffix costs in O(n) by scanning right to left. Then we can check all split points in O(n).

The trickiest part is handling the boundary conditions correctly:

- When `i = 0`, we're using only suffix operations
- When `i = n`, we're using only prefix operations
- For other `i`, we're combining both

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumCost(s: str) -> int:
    n = len(s)

    # We'll compute costs for making all characters '0' and '1'
    # prefix_cost_0[i] = cost to make s[0..i] all '0's using prefix flips
    # prefix_cost_1[i] = cost to make s[0..i] all '1's using prefix flips
    prefix_cost_0 = [0] * n
    prefix_cost_1 = [0] * n

    # Compute prefix costs from left to right
    for i in range(n):
        if i > 0:
            # Carry over previous costs
            prefix_cost_0[i] = prefix_cost_0[i-1]
            prefix_cost_1[i] = prefix_cost_1[i-1]

        # Check if current character matches target
        # If not, we need to flip the prefix ending at i
        if s[i] != '0':
            # Cost to flip prefix ending at i is i+1
            prefix_cost_0[i] += i + 1
        if s[i] != '1':
            prefix_cost_1[i] += i + 1

    # suffix_cost_0[i] = cost to make s[i..n-1] all '0's using suffix flips
    # suffix_cost_1[i] = cost to make s[i..n-1] all '1's using suffix flips
    suffix_cost_0 = [0] * n
    suffix_cost_1 = [0] * n

    # Compute suffix costs from right to left
    for i in range(n-1, -1, -1):
        if i < n-1:
            # Carry over previous costs (from the right)
            suffix_cost_0[i] = suffix_cost_0[i+1]
            suffix_cost_1[i] = suffix_cost_1[i+1]

        # Check if current character matches target
        # If not, we need to flip the suffix starting at i
        if s[i] != '0':
            # Cost to flip suffix starting at i is n-i
            suffix_cost_0[i] += n - i
        if s[i] != '1':
            suffix_cost_1[i] += n - i

    # Now find the minimum cost by trying all split points
    # Split point i means:
    # - Use prefix operations for indices 0..i-1
    # - Use suffix operations for indices i..n-1
    min_cost = float('inf')

    # Try all split points from 0 to n
    for i in range(n + 1):
        if i == 0:
            # Only suffix operations
            cost_0 = suffix_cost_0[0] if n > 0 else 0
            cost_1 = suffix_cost_1[0] if n > 0 else 0
        elif i == n:
            # Only prefix operations
            cost_0 = prefix_cost_0[n-1] if n > 0 else 0
            cost_1 = prefix_cost_1[n-1] if n > 0 else 0
        else:
            # Combine prefix and suffix operations
            # Note: prefix_cost arrays are 0-indexed for the end index
            cost_0 = prefix_cost_0[i-1] + suffix_cost_0[i]
            cost_1 = prefix_cost_1[i-1] + suffix_cost_1[i]

        # Take the minimum of aiming for all '0's or all '1's
        min_cost = min(min_cost, cost_0, cost_1)

    return min_cost
```

```javascript
// Time: O(n) | Space: O(n)
function minimumCost(s) {
  const n = s.length;

  // Prefix costs for making all '0's and all '1's
  const prefixCost0 = new Array(n).fill(0);
  const prefixCost1 = new Array(n).fill(0);

  // Compute prefix costs from left to right
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      // Carry over previous costs
      prefixCost0[i] = prefixCost0[i - 1];
      prefixCost1[i] = prefixCost1[i - 1];
    }

    // If current character doesn't match target, flip prefix ending at i
    if (s[i] !== "0") {
      // Cost is i + 1 (1-indexed)
      prefixCost0[i] += i + 1;
    }
    if (s[i] !== "1") {
      prefixCost1[i] += i + 1;
    }
  }

  // Suffix costs for making all '0's and all '1's
  const suffixCost0 = new Array(n).fill(0);
  const suffixCost1 = new Array(n).fill(0);

  // Compute suffix costs from right to left
  for (let i = n - 1; i >= 0; i--) {
    if (i < n - 1) {
      // Carry over previous costs (from the right)
      suffixCost0[i] = suffixCost0[i + 1];
      suffixCost1[i] = suffixCost1[i + 1];
    }

    // If current character doesn't match target, flip suffix starting at i
    if (s[i] !== "0") {
      // Cost is n - i
      suffixCost0[i] += n - i;
    }
    if (s[i] !== "1") {
      suffixCost1[i] += n - i;
    }
  }

  // Find minimum cost by trying all split points
  let minCost = Infinity;

  // Split point i means:
  // - Prefix operations for indices 0..i-1
  // - Suffix operations for indices i..n-1
  for (let i = 0; i <= n; i++) {
    let cost0, cost1;

    if (i === 0) {
      // Only suffix operations
      cost0 = n > 0 ? suffixCost0[0] : 0;
      cost1 = n > 0 ? suffixCost1[0] : 0;
    } else if (i === n) {
      // Only prefix operations
      cost0 = n > 0 ? prefixCost0[n - 1] : 0;
      cost1 = n > 0 ? prefixCost1[n - 1] : 0;
    } else {
      // Combine prefix and suffix operations
      cost0 = prefixCost0[i - 1] + suffixCost0[i];
      cost1 = prefixCost1[i - 1] + suffixCost1[i];
    }

    // Take minimum of aiming for all '0's or all '1's
    minCost = Math.min(minCost, cost0, cost1);
  }

  return minCost;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long minimumCost(String s) {
        int n = s.length();

        // Prefix costs for making all '0's and all '1's
        long[] prefixCost0 = new long[n];
        long[] prefixCost1 = new long[n];

        // Compute prefix costs from left to right
        for (int i = 0; i < n; i++) {
            if (i > 0) {
                // Carry over previous costs
                prefixCost0[i] = prefixCost0[i - 1];
                prefixCost1[i] = prefixCost1[i - 1];
            }

            // If current character doesn't match target, flip prefix ending at i
            if (s.charAt(i) != '0') {
                // Cost is i + 1 (1-indexed)
                prefixCost0[i] += i + 1;
            }
            if (s.charAt(i) != '1') {
                prefixCost1[i] += i + 1;
            }
        }

        // Suffix costs for making all '0's and all '1's
        long[] suffixCost0 = new long[n];
        long[] suffixCost1 = new long[n];

        // Compute suffix costs from right to left
        for (int i = n - 1; i >= 0; i--) {
            if (i < n - 1) {
                // Carry over previous costs (from the right)
                suffixCost0[i] = suffixCost0[i + 1];
                suffixCost1[i] = suffixCost1[i + 1];
            }

            // If current character doesn't match target, flip suffix starting at i
            if (s.charAt(i) != '0') {
                // Cost is n - i
                suffixCost0[i] += n - i;
            }
            if (s.charAt(i) != '1') {
                suffixCost1[i] += n - i;
            }
        }

        // Find minimum cost by trying all split points
        long minCost = Long.MAX_VALUE;

        // Split point i means:
        // - Prefix operations for indices 0..i-1
        // - Suffix operations for indices i..n-1
        for (int i = 0; i <= n; i++) {
            long cost0, cost1;

            if (i == 0) {
                // Only suffix operations
                cost0 = n > 0 ? suffixCost0[0] : 0;
                cost1 = n > 0 ? suffixCost1[0] : 0;
            } else if (i == n) {
                // Only prefix operations
                cost0 = n > 0 ? prefixCost0[n - 1] : 0;
                cost1 = n > 0 ? prefixCost1[n - 1] : 0;
            } else {
                // Combine prefix and suffix operations
                cost0 = prefixCost0[i - 1] + suffixCost0[i];
                cost1 = prefixCost1[i - 1] + suffixCost1[i];
            }

            // Take minimum of aiming for all '0's or all '1's
            minCost = Math.min(minCost, Math.min(cost0, cost1));
        }

        return minCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes over the string to compute prefix costs: O(n)
- We make two passes over the string to compute suffix costs: O(n)
- We iterate through all possible split points: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store four arrays of size n: prefix_cost_0, prefix_cost_1, suffix_cost_0, suffix_cost_1
- Each array uses O(n) space, so total space is O(4n) = O(n)

## Common Mistakes

1. **Forgetting to consider both targets ('0' and '1')**: Some candidates only try to make all '0's or all '1's, but not both. The optimal solution might aim for either, so we need to compute costs for both targets.

2. **Off-by-one errors in cost calculation**: The cost for flipping prefix ending at `i` is `i + 1` (1-indexed), not `i`. Similarly, suffix flip starting at `i` costs `n - i`, not `n - i - 1`. Always double-check these formulas with small examples.

3. **Incorrect handling of boundary split points**: When the split point is at index 0 (only suffix operations) or index n (only prefix operations), we need special handling. A common mistake is trying to access `prefix_cost[i-1]` when `i=0`, which causes an index error.

4. **Using int instead of long for large n**: With `n` up to 10^5 and each operation costing up to `n`, the total cost can be up to ~10^10, which exceeds 32-bit integer limits. Always use 64-bit integers (long in Java/JavaScript, regular int in Python handles big integers).

## When You'll See This Pattern

This problem uses a **prefix/suffix precomputation** pattern combined with **split point enumeration**. You'll see similar patterns in:

1. **Flip String to Monotone Increasing (LeetCode 926)**: Also involves transforming a binary string with minimal operations, though with different operation rules. Both require considering each position as a potential boundary.

2. **Minimum Number of Flips to Make Binary String Beautiful (LeetCode 1888)**: Similar concept of flipping prefixes to achieve a pattern, though with different constraints.

3. **Product of Array Except Self (LeetCode 238)**: Uses similar prefix/suffix precomputation to avoid O(n²) solutions, though for a different purpose (multiplication instead of cost calculation).

The core idea is to precompute results from both directions, then combine them at each possible split point in O(1) time per split.

## Key Takeaways

1. **When operations affect contiguous segments from the start or end**, consider precomputing prefix and suffix costs. This often turns O(n²) solutions into O(n).

2. **Always check both possible targets** when the goal is uniformity. The cost to achieve all '0's might be different from all '1's.

3. **Test boundary cases carefully**: Empty strings, single character strings, and split points at the very beginning or end often reveal implementation bugs.

Related problems: [Flip String to Monotone Increasing](/problem/flip-string-to-monotone-increasing)
