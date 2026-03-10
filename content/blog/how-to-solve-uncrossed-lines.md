---
title: "How to Solve Uncrossed Lines — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Uncrossed Lines. Medium difficulty, 65.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-02-16"
category: "dsa-patterns"
tags: ["uncrossed-lines", "array", "dynamic-programming", "medium"]
---

# How to Solve Uncrossed Lines

You're given two arrays of integers, and you can draw straight lines connecting equal numbers between them. The catch? Lines cannot cross. Your goal is to find the maximum number of non-crossing lines you can draw. This is essentially the **Longest Common Subsequence (LCS)** problem in disguise — the numbers you connect must appear in the same relative order in both arrays to avoid crossing lines. The challenge is recognizing this connection and implementing an efficient dynamic programming solution.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `nums1 = [1,4,2]`, `nums2 = [1,2,4]`

We write these on two horizontal lines:

```
nums1: 1 — 4 — 2
nums2: 1 — 2 — 4
```

**Step 1:** Connect `nums1[0]=1` with `nums2[0]=1`. This is valid (equal numbers).

```
nums1: 1 — 4 — 2
        |
nums2: 1 — 2 — 4
```

**Step 2:** Can we connect `nums1[1]=4` with `nums2[2]=4`? Yes, and the line won't cross the first line because `nums1[1]` comes after `nums1[0]` and `nums2[2]` comes after `nums2[0]` (both indices increased).

```
nums1: 1 — 4 — 2
        |   \
nums2: 1 — 2 — 4
```

**Step 3:** Can we connect `nums1[2]=2` with `nums2[1]=2`? No! This line would cross the second line because `nums1[2]` comes after `nums1[1]` but `nums2[1]` comes before `nums2[2]`. The relative order is broken.

**Maximum lines:** 2 (connecting 1-1 and 4-4).

Notice the pattern: **We're finding numbers that appear in the same order in both arrays**. This is exactly what the Longest Common Subsequence problem solves.

## Brute Force Approach

A naive approach would try all possible combinations of connections:

1. For each equal pair `(i, j)` where `nums1[i] == nums2[j]`
2. Try including or excluding that connection
3. Check if adding it maintains the non-crossing property (all previous connections must have `i_prev < i` and `j_prev < j`)
4. Track the maximum count

This leads to exponential time complexity — O(2^(min(m,n))) in the worst case — because for each matching pair, we have two choices (include or exclude), and we need to verify ordering constraints each time.

The brute force fails because it redundantly solves the same subproblems repeatedly. For example, after deciding whether to include pair `(i, j)`, we need to solve the same problem for the remaining portions of both arrays.

## Optimized Approach

The key insight is that this is **identical to finding the Longest Common Subsequence (LCS)** of the two arrays. Why?

1. Each line connects equal numbers → the connected numbers form a common subsequence
2. Lines cannot cross → the indices must be strictly increasing in both arrays → the subsequence maintains order
3. Maximizing lines → maximizing the length of this common subsequence

**Dynamic Programming State:**
Let `dp[i][j]` = maximum lines we can draw using the first `i` elements of `nums1` and first `j` elements of `nums2`.

**Transition:**

- If `nums1[i-1] == nums2[j-1]`: We can draw a line between these two numbers. This adds 1 to the best we could do with the previous elements: `dp[i][j] = dp[i-1][j-1] + 1`
- Otherwise: We skip either `nums1[i-1]` or `nums2[j-1]`: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

**Base Case:** `dp[0][j] = 0` and `dp[i][0] = 0` (empty prefix can't have any lines)

This approach has O(m×n) time complexity, which is efficient for typical constraints.

## Optimal Solution

Here's the complete implementation using dynamic programming:

<div class="code-group">

```python
# Time: O(m * n) where m = len(nums1), n = len(nums2)
# Space: O(m * n) for the DP table
def maxUncrossedLines(nums1, nums2):
    m, n = len(nums1), len(nums2)

    # Create DP table with (m+1) x (n+1) dimensions
    # dp[i][j] = max lines using first i elements of nums1 and first j of nums2
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if nums1[i - 1] == nums2[j - 1]:
                # Numbers match: we can draw a line between them
                # Add 1 to the best result from previous elements
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # Numbers don't match: take the best of skipping either number
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
```

```javascript
// Time: O(m * n) where m = nums1.length, n = nums2.length
// Space: O(m * n) for the DP table
function maxUncrossedLines(nums1, nums2) {
  const m = nums1.length,
    n = nums2.length;

  // Create DP table with (m+1) x (n+1) dimensions
  // dp[i][j] = max lines using first i elements of nums1 and first j of nums2
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        // Numbers match: we can draw a line between them
        // Add 1 to the best result from previous elements
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Numbers don't match: take the best of skipping either number
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}
```

```java
// Time: O(m * n) where m = nums1.length, n = nums2.length
// Space: O(m * n) for the DP table
public int maxUncrossedLines(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;

    // Create DP table with (m+1) x (n+1) dimensions
    // dp[i][j] = max lines using first i elements of nums1 and first j of nums2
    int[][] dp = new int[m + 1][n + 1];

    // Fill the DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (nums1[i - 1] == nums2[j - 1]) {
                // Numbers match: we can draw a line between them
                // Add 1 to the best result from previous elements
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // Numbers don't match: take the best of skipping either number
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n), where m = length of `nums1` and n = length of `nums2`. We fill an (m+1) × (n+1) DP table, and each cell takes O(1) time to compute.

**Space Complexity:** O(m × n) for the DP table. We can optimize to O(min(m, n)) by only keeping two rows of the DP table at a time, since we only need the previous row to compute the current row. Here's the space-optimized version:

<div class="code-group">

```python
# Time: O(m * n), Space: O(min(m, n))
def maxUncrossedLines(nums1, nums2):
    # Ensure nums1 is the shorter array for space optimization
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)

    # Use only two rows: previous and current
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if nums1[i - 1] == nums2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        # Move to next row
        prev, curr = curr, prev
        # Reset current row for next iteration
        curr = [0] * (n + 1)

    return prev[n]
```

</div>

## Common Mistakes

1. **Off-by-one errors in DP indices:** Remember `dp[i][j]` corresponds to first `i` elements of `nums1` and first `j` of `nums2`, so we access `nums1[i-1]` and `nums2[j-1]`. A common mistake is using `nums1[i]` and `nums2[j]`.

2. **Missing the LCS connection:** Candidates sometimes try greedy approaches (like connecting the first available match) which fail. Example: `nums1 = [2,5,1,2,5]`, `nums2 = [10,5,2,1,5,2]`. Greedily connecting the first 5's gives only 2 lines, while optimal is 3.

3. **Incorrect base case initialization:** Forgetting to initialize `dp[0][j] = 0` and `dp[i][0] = 0` can lead to wrong results. These represent empty prefixes.

4. **Space optimization errors:** When implementing the O(min(m,n)) space solution, a common mistake is not resetting the current row properly or swapping rows incorrectly.

## When You'll See This Pattern

This Longest Common Subsequence pattern appears in many string/array comparison problems:

1. **Edit Distance (LeetCode 72):** Similar DP state and transitions, but with different operations (insert, delete, replace).

2. **Longest Common Subsequence (LeetCode 1143):** This is literally the same problem without the "lines" story.

3. **Delete Operation for Two Strings (LeetCode 583):** Uses LCS to find minimum deletions to make strings equal.

4. **Maximum Length of Repeated Subarray (LeetCode 718):** Similar but requires contiguous matches instead of subsequences.

The pattern is: **When you need to find the best alignment/matching between two sequences while preserving order, think LCS and DP.**

## Key Takeaways

1. **Non-crossing lines = preserving order = subsequence:** When you hear "cannot cross" and "connect equal elements," immediately think Longest Common Subsequence.

2. **DP state represents prefixes:** `dp[i][j]` = best solution for first `i` elements of first sequence and first `j` of second. This is a common DP pattern for sequence alignment.

3. **Transitions depend on whether current elements match:** If they match, we extend the solution from `(i-1, j-1)`. If not, we take the best of skipping one element from either sequence.

Related problems: [Edit Distance](/problem/edit-distance)
