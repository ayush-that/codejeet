---
title: "How to Solve Minimum Number of Work Sessions to Finish the Tasks — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Work Sessions to Finish the Tasks. Medium difficulty, 34.6% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2029-02-22"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-work-sessions-to-finish-the-tasks",
    "array",
    "dynamic-programming",
    "backtracking",
    "medium",
  ]
---

# How to Solve Minimum Number of Work Sessions to Finish the Tasks

You're given `n` tasks with durations in an array `tasks` and a maximum work session length `sessionTime`. You need to find the minimum number of work sessions needed to complete all tasks, where each session can contain multiple tasks as long as their total duration doesn't exceed `sessionTime`. The challenge is that tasks can be arranged in any order, and you need to pack them optimally into sessions—this is essentially a bin packing problem, which is NP-hard. What makes this problem interesting is that while it looks like a simple scheduling problem, the optimal solution requires careful state representation and dynamic programming over subsets.

## Visual Walkthrough

Let's trace through a concrete example: `tasks = [2, 3, 3, 4]` with `sessionTime = 10`.

**Intuition:** We need to pack these 4 tasks into sessions (bins) of capacity 10. The optimal arrangement is:

- Session 1: Tasks [2, 3, 4] = 9 hours
- Session 2: Tasks [3] = 3 hours  
  Total: 2 sessions

But how do we find this systematically? Let's think about trying all arrangements:

1. If we put task 2 (2 hours) in session 1, we have 8 hours remaining
2. We could add task 3 (3 hours), leaving 5 hours
3. We could add task 4 (4 hours), leaving 1 hour
4. The remaining task 3 (3 hours) doesn't fit, so it starts session 2

This is one valid arrangement using 2 sessions. The challenge is we need to consider all possible orders and groupings to find the minimum.

## Brute Force Approach

A naive approach would be to generate all permutations of tasks and greedily pack them into sessions:

1. Generate all permutations of the `n` tasks (n! possibilities)
2. For each permutation, simulate filling sessions greedily:
   - Start with empty session, count = 1
   - For each task, if it fits in current session, add it
   - Otherwise, start new session and add task there
3. Track the minimum sessions needed across all permutations

**Why this fails:**

- With n! permutations, this is astronomically slow even for n=15
- Greedy packing within a fixed order doesn't guarantee optimality
- We're missing the insight that only which tasks are together in a session matters, not their order within the session

**Time Complexity:** O(n! × n) - completely infeasible for n > 10

## Optimized Approach

The key insight is that this is a **subset partitioning problem** that can be solved with **bitmask dynamic programming**. Since n ≤ 14 (based on typical constraints), we can represent subsets of tasks using bitmasks (integers where bit i = 1 means task i is included).

**DP State:** `dp[mask]` = minimum sessions needed to complete the tasks represented by `mask`

**DP Transition:** For each state (mask), we try to add a new session containing some subset of the remaining tasks that fits within `sessionTime`. However, a more efficient approach is:

1. First precompute for every subset whether its total time ≤ sessionTime (valid session)
2. Then use DP where `dp[mask] = min(dp[mask ^ submask] + 1)` for all valid `submask ⊆ mask`

**Why this works:** We're essentially trying all ways to form the last session (submask) and adding it to the solution for the remaining tasks (mask ^ submask).

**Optimization:** We only need to consider submask that include the first unassigned task (lowest set bit in mask). This avoids redundant computations since the order of sessions doesn't matter.

## Optimal Solution

The optimal solution uses bitmask DP with the "first unassigned task" optimization:

<div class="code-group">

```python
# Time: O(n * 2^n + 3^n) - O(3^n) for the DP, O(n * 2^n) for precomputation
# Space: O(2^n) for the dp array
class Solution:
    def minSessions(self, tasks: List[int], sessionTime: int) -> int:
        n = len(tasks)

        # Precompute valid subsets: total time <= sessionTime
        valid = [False] * (1 << n)
        for mask in range(1 << n):
            total = 0
            # Calculate total time for this subset
            for i in range(n):
                if mask & (1 << i):
                    total += tasks[i]
            valid[mask] = total <= sessionTime

        # dp[mask] = min sessions for subset 'mask'
        dp = [float('inf')] * (1 << n)
        dp[0] = 0  # base case: no tasks needs 0 sessions

        # Iterate through all subsets
        for mask in range(1 << n):
            # Find the first unassigned task (lowest set bit)
            # We'll only consider subsets that include this task to avoid duplicates
            # ~mask gives bits that are 0 (unassigned tasks), & with mask's complement
            # But simpler: find any set bit, we'll use the trick with remaining = mask
            remaining = mask

            # Instead of iterating all submasks, we iterate only those containing
            # the first unassigned task (lowest set bit in remaining)
            while remaining > 0:
                # Get the lowest set bit
                submask = remaining & -remaining
                # Expand submask to include other tasks while keeping it valid
                # We need to try all submasks containing this lowest bit
                # But we can iterate through submasks in decreasing order
                # Actually, let's use the standard subset enumeration trick:
                # submask = remaining initially, then decrease
                submask = remaining
                while submask > 0:
                    if valid[submask]:
                        # If this submask is a valid session, update dp
                        dp[mask] = min(dp[mask], dp[mask ^ submask] + 1)
                    # Move to next smaller submask containing the lowest bit
                    submask = (submask - 1) & remaining
                # Remove the lowest bit from remaining to try next starting point
                remaining &= remaining - 1

        return dp[(1 << n) - 1]
```

```javascript
// Time: O(n * 2^n + 3^n) - O(3^n) for the DP, O(n * 2^n) for precomputation
// Space: O(2^n) for the dp array
var minSessions = function (tasks, sessionTime) {
  const n = tasks.length;

  // Precompute valid subsets: total time <= sessionTime
  const valid = new Array(1 << n).fill(false);
  for (let mask = 0; mask < 1 << n; mask++) {
    let total = 0;
    // Calculate total time for this subset
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        total += tasks[i];
      }
    }
    valid[mask] = total <= sessionTime;
  }

  // dp[mask] = min sessions for subset 'mask'
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0; // base case: no tasks needs 0 sessions

  // Iterate through all subsets
  for (let mask = 1; mask < 1 << n; mask++) {
    // We'll iterate through all submasks of mask
    // Using the trick: start with submask = mask, then decrease
    let submask = mask;
    while (submask > 0) {
      // Check if this submask forms a valid session
      if (valid[submask]) {
        // Update dp: tasks in submask go to one session,
        // remaining tasks (mask ^ submask) need dp[mask ^ submask] sessions
        dp[mask] = Math.min(dp[mask], dp[mask ^ submask] + 1);
      }
      // Get next smaller submask
      submask = (submask - 1) & mask;
    }
  }

  return dp[(1 << n) - 1];
};
```

```java
// Time: O(n * 2^n + 3^n) - O(3^n) for the DP, O(n * 2^n) for precomputation
// Space: O(2^n) for the dp array
class Solution {
    public int minSessions(int[] tasks, int sessionTime) {
        int n = tasks.length;

        // Precompute valid subsets: total time <= sessionTime
        boolean[] valid = new boolean[1 << n];
        for (int mask = 0; mask < (1 << n); mask++) {
            int total = 0;
            // Calculate total time for this subset
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    total += tasks[i];
                }
            }
            valid[mask] = total <= sessionTime;
        }

        // dp[mask] = min sessions for subset 'mask'
        int[] dp = new int[1 << n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;  // base case: no tasks needs 0 sessions

        // Iterate through all subsets
        for (int mask = 1; mask < (1 << n); mask++) {
            // Iterate through all submasks of mask
            // Using the trick: start with submask = mask, then decrease
            int submask = mask;
            while (submask > 0) {
                // Check if this submask forms a valid session
                if (valid[submask]) {
                    // Update dp: tasks in submask go to one session,
                    // remaining tasks (mask ^ submask) need dp[mask ^ submask] sessions
                    if (dp[mask ^ submask] != Integer.MAX_VALUE) {
                        dp[mask] = Math.min(dp[mask], dp[mask ^ submask] + 1);
                    }
                }
                // Get next smaller submask
                submask = (submask - 1) & mask;
            }
        }

        return dp[(1 << n) - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 2^n + 3^n)

- O(n × 2^n) for precomputing valid subsets (n bits to check for each of 2^n masks)
- O(3^n) for the DP: For each mask, we iterate through all its submasks. The total number of mask-submask pairs is Σ\_{k=0}^n C(n,k) × 2^k = 3^n (each task is either: not in mask, in mask but not submask, or in submask)

**Space Complexity:** O(2^n)

- We store the `valid` array of size 2^n
- We store the `dp` array of size 2^n
- Additional O(1) or O(n) for loop variables

For n ≤ 14 (typical constraint), 2^14 = 16384 and 3^14 ≈ 4.8 million, which is feasible.

## Common Mistakes

1. **Not handling empty subsets correctly:** Forgetting that dp[0] = 0 (no tasks need 0 sessions) is a common base case error.

2. **Infinite loop in submask enumeration:** When iterating through submasks using `submask = (submask - 1) & mask`, forgetting the `& mask` part will cause incorrect enumeration and potentially infinite loops.

3. **Integer overflow with bit operations:** In Java, using `1 << i` without casting to long when n ≥ 31 can cause overflow. However, with n ≤ 14, this isn't an issue here.

4. **Missing the valid[] precomputation:** Trying to calculate subset sums inside the DP loop leads to O(3^n × n) time instead of O(3^n + n×2^n), which might time out for n=14.

5. **Greedy approach:** Trying to sort tasks and pack greedily (largest first or smallest first) doesn't guarantee optimality. Example: tasks [3, 3, 4, 4] with sessionTime=10. Greedy largest-first gives sessions [4,4], [3,3] (2 sessions) but optimal is [4,3,3], [4] (also 2 sessions in this case, but other examples show worse performance).

## When You'll See This Pattern

This **bitmask DP for subset partitioning** pattern appears in problems where:

1. You need to partition a set into groups with constraints
2. The input size is small (typically n ≤ 20, often n ≤ 15)
3. The cost/validity of a group depends only on which elements are in it

**Related problems:**

1. **Smallest Sufficient Team (Hard):** Similar bitmask DP where you need to cover all skills with minimum people.
2. **Fair Distribution of Cookies (Medium):** Partition array into k subsets minimizing maximum sum - uses backtracking with pruning.
3. **Find Minimum Time to Finish All Jobs (Hard):** Almost identical to this problem but with k workers instead of sessionTime constraint.
4. **Partition to K Equal Sum Subsets (Medium):** Check if array can be partitioned into k equal-sum subsets.

## Key Takeaways

1. **Bitmask DP is powerful for small n:** When n ≤ 20 and you need to consider all subsets, bitmask representation (integers where bit i represents element i) is efficient.

2. **Subset enumeration trick:** To iterate through all submasks of a mask, use `submask = mask; while (submask > 0) { ...; submask = (submask - 1) & mask; }`. This visits all submasks in decreasing order.

3. **Partitioning vs. ordering:** For partitioning problems, the order of elements within a group doesn't matter. This allows optimization by always including the first unassigned element in the current group to avoid duplicate counting.

4. **Precomputation helps:** When the validity or cost of a subset can be precomputed, do it separately to avoid recomputation in the DP loop.

Related problems: [Smallest Sufficient Team](/problem/smallest-sufficient-team), [Fair Distribution of Cookies](/problem/fair-distribution-of-cookies), [Find Minimum Time to Finish All Jobs](/problem/find-minimum-time-to-finish-all-jobs)
