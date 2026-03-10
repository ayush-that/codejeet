---
title: "How to Solve Merge Operations for Minimum Travel Time — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Merge Operations for Minimum Travel Time. Hard difficulty, 30.7% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2026-08-30"
category: "dsa-patterns"
tags:
  ["merge-operations-for-minimum-travel-time", "array", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Merge Operations for Minimum Travel Time

You're given a road with signs at specific positions, and you need to merge exactly `k` signs while minimizing total travel time. The challenge lies in strategically choosing which signs to merge to minimize the sum of distances between consecutive signs after merging. This is tricky because it combines prefix sums with dynamic programming optimization.

## Visual Walkthrough

Let's walk through a concrete example:

- Road length `l = 10`
- Number of signs `n = 5`
- Merges to perform `k = 2`
- Positions: `[0, 2, 5, 7, 10]`
- Times: `[1, 2, 1, 3, 1]` (time to travel between signs)

Initially, we have 5 signs. We need to merge exactly 2 signs, leaving us with 3 signs. Each merge combines two adjacent signs into one at the position of the first sign.

**Step 1: Understanding the cost**
The total travel time is the sum of distances between consecutive signs multiplied by the time factor for that segment. If we have signs at positions `p[i]` and `p[i+1]`, the travel time for that segment is `(p[i+1] - p[i]) * time[i]`.

**Step 2: Thinking about merges**
When we merge signs, we're effectively removing a sign. If we merge signs at indices `i` and `i+1`, we remove sign `i+1`, and the distance between signs `i` and `i+2` becomes `p[i+2] - p[i]`.

**Step 3: Trying a specific merge sequence**
Let's try merging signs at indices 1 and 2 (positions 2 and 5):

- New positions: `[0, 2, 7, 10]` (sign at position 5 removed)
- Distances: `[2-0=2, 7-2=5, 10-7=3]`
- Times: `[1, 2, 3, 1]` (time[2] is removed)
- Travel time: `2*1 + 5*2 + 3*3 = 2 + 10 + 9 = 21`

Now merge signs at indices 2 and 3 (positions 7 and 10):

- New positions: `[0, 2, 10]` (sign at position 7 removed)
- Distances: `[2, 8]`
- Times: `[1, 2, 1]` (time[3] removed)
- Travel time: `2*1 + 8*2 = 2 + 16 = 18`

**Step 4: Is this optimal?**
Maybe not! What if we merged different signs? This is where we need a systematic approach to find the minimum possible travel time.

## Brute Force Approach

The brute force approach would try all possible ways to choose `k` signs to merge from the `n-1` possible merge positions (we can't merge the first or last sign since they must remain). This is essentially choosing `k` indices from `n-1` possible positions where merges can occur.

For each combination of `k` merges, we would:

1. Create a new list of positions and times with the merged signs removed
2. Calculate the total travel time
3. Track the minimum

The number of combinations is C(n-1, k), which grows factorially. For n=100 and k=50, this is astronomically large (C(99, 50) ≈ 5×10²⁸). Clearly, we need a better approach.

## Optimized Approach

The key insight is that this problem can be solved with dynamic programming. Let's define:

`dp[i][j]` = minimum travel time to reach sign `i` after performing exactly `j` merges.

**State transition:**
To reach sign `i` with `j` merges, we could have come from some previous sign `m` (where m < i) with `j - (i-m-1)` merges. The term `(i-m-1)` represents how many signs we skipped (merged) between `m` and `i`.

The travel time from sign `m` to sign `i` is: `(position[i] - position[m]) * time[m]`

So the recurrence relation is:

```
dp[i][j] = min over all m < i of {
    dp[m][j - (i-m-1)] + (position[i] - position[m]) * time[m]
}
```

**Why this works:**

- We're building up the solution incrementally
- At each step, we decide how many consecutive signs to merge before reaching the current sign
- The DP ensures we consider all possibilities while avoiding redundant calculations

**Optimization with prefix sums:**
We can precompute prefix sums of distances to quickly calculate segment lengths, but the core optimization challenge is the O(n³) naive DP. We need to optimize the inner loop.

## Optimal Solution

The optimal solution uses dynamic programming with a clever observation: when choosing which previous sign `m` to come from, we're essentially deciding how many consecutive signs to merge. We can optimize this by maintaining the best value for each possible number of merges.

<div class="code-group">

```python
# Time: O(n * k) | Space: O(n * k)
def minTravelTime(l, n, k, position, time):
    """
    Calculate minimum travel time after merging exactly k signs.

    Args:
        l: Total road length
        n: Number of signs
        k: Number of merges to perform
        position: List of sign positions
        time: List of time factors

    Returns:
        Minimum possible total travel time
    """
    # DP table: dp[i][j] = min travel time to reach sign i with j merges
    dp = [[float('inf')] * (k + 1) for _ in range(n)]

    # Base case: starting at first sign with 0 merges costs 0
    dp[0][0] = 0

    # Fill DP table
    for i in range(1, n):
        # We can't have more merges than signs removed so far
        max_merges_here = min(k, i)

        for j in range(max_merges_here + 1):
            # Try coming from each possible previous sign m
            # The number of signs skipped between m and i is (i - m - 1)
            # These skipped signs must be merged
            for m in range(i):
                merges_used = i - m - 1
                if j >= merges_used:
                    # Travel time from m to i
                    segment_time = (position[i] - position[m]) * time[m]

                    # Update DP value
                    dp[i][j] = min(dp[i][j], dp[m][j - merges_used] + segment_time)

    # Answer is reaching the last sign with exactly k merges
    return dp[n-1][k]
```

```javascript
// Time: O(n * k) | Space: O(n * k)
function minTravelTime(l, n, k, position, time) {
  /**
   * Calculate minimum travel time after merging exactly k signs.
   *
   * @param {number} l - Total road length
   * @param {number} n - Number of signs
   * @param {number} k - Number of merges to perform
   * @param {number[]} position - Array of sign positions
   * @param {number[]} time - Array of time factors
   * @returns {number} Minimum possible total travel time
   */

  // DP table: dp[i][j] = min travel time to reach sign i with j merges
  const dp = Array.from({ length: n }, () => Array(k + 1).fill(Infinity));

  // Base case: starting at first sign with 0 merges costs 0
  dp[0][0] = 0;

  // Fill DP table
  for (let i = 1; i < n; i++) {
    // We can't have more merges than signs removed so far
    const maxMergesHere = Math.min(k, i);

    for (let j = 0; j <= maxMergesHere; j++) {
      // Try coming from each possible previous sign m
      for (let m = 0; m < i; m++) {
        // Number of signs skipped between m and i
        const mergesUsed = i - m - 1;

        // Check if we have enough merges available
        if (j >= mergesUsed) {
          // Travel time from m to i
          const segmentTime = (position[i] - position[m]) * time[m];

          // Update DP value
          dp[i][j] = Math.min(dp[i][j], dp[m][j - mergesUsed] + segmentTime);
        }
      }
    }
  }

  // Answer is reaching the last sign with exactly k merges
  return dp[n - 1][k];
}
```

```java
// Time: O(n * k) | Space: O(n * k)
public class Solution {
    public int minTravelTime(int l, int n, int k, int[] position, int[] time) {
        /**
         * Calculate minimum travel time after merging exactly k signs.
         *
         * @param l Total road length
         * @param n Number of signs
         * @param k Number of merges to perform
         * @param position Array of sign positions
         * @param time Array of time factors
         * @return Minimum possible total travel time
         */

        // DP table: dp[i][j] = min travel time to reach sign i with j merges
        int[][] dp = new int[n][k + 1];

        // Initialize with infinity
        for (int i = 0; i < n; i++) {
            Arrays.fill(dp[i], Integer.MAX_VALUE);
        }

        // Base case: starting at first sign with 0 merges costs 0
        dp[0][0] = 0;

        // Fill DP table
        for (int i = 1; i < n; i++) {
            // We can't have more merges than signs removed so far
            int maxMergesHere = Math.min(k, i);

            for (int j = 0; j <= maxMergesHere; j++) {
                // Try coming from each possible previous sign m
                for (int m = 0; m < i; m++) {
                    // Number of signs skipped between m and i
                    int mergesUsed = i - m - 1;

                    // Check if we have enough merges available
                    if (j >= mergesUsed && dp[m][j - mergesUsed] != Integer.MAX_VALUE) {
                        // Travel time from m to i
                        int segmentTime = (position[i] - position[m]) * time[m];

                        // Update DP value
                        dp[i][j] = Math.min(dp[i][j], dp[m][j - mergesUsed] + segmentTime);
                    }
                }
            }
        }

        // Answer is reaching the last sign with exactly k merges
        return dp[n - 1][k];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² \* k)

- We have three nested loops:
  - Outer loop over `i` from 1 to n-1: O(n)
  - Middle loop over `j` from 0 to min(k, i): O(k)
  - Inner loop over `m` from 0 to i-1: O(n)
- Total: O(n² \* k)

**Space Complexity:** O(n \* k)

- We store a DP table of size n × (k+1)
- Each cell stores an integer value
- Total space: O(n \* k)

**Why this is acceptable:**
In typical constraints (n ≤ 100, k ≤ 100), n²k = 100×100×100 = 1,000,000 operations, which is manageable. The brute force approach would be impossible for these constraints.

## Common Mistakes

1. **Not handling the "exactly k merges" requirement:** Some candidates try to find the minimum travel time with "at most k merges" instead of exactly k. The problem specifically requires exactly k merges, which affects the DP state definition.

2. **Incorrect merge counting in DP transition:** The trickiest part is calculating how many merges are used when jumping from sign m to sign i. It's not simply 1 merge, but (i - m - 1) merges, since all signs between m and i need to be merged.

3. **Forgetting that first and last signs must remain:** The problem states position[0] = 0 and position[n-1] = l, meaning these signs cannot be merged. Some solutions accidentally allow merging these boundary signs.

4. **Integer overflow with large values:** When n=100, l=10⁹, and time values are large, the travel time can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, int64 in Python).

## When You'll See This Pattern

This type of "merge operations with cost" problem appears in various forms:

1. **Minimum Cost to Merge Stones (LeetCode 1000):** Similar concept of merging adjacent piles with minimum cost. The DP state tracks how many merges have been performed.

2. **Burst Balloons (LeetCode 312):** Another interval DP problem where the order of operations affects the total cost. The key insight is thinking backwards about which balloon to burst last.

3. **Stone Game (LeetCode 877):** While not exactly the same, it involves optimizing operations on an array with DP, where the state represents a contiguous subarray.

The common pattern is: when you need to perform a sequence of operations on adjacent elements and the cost depends on which elements are combined, think about DP where the state tracks how many operations have been performed and what the current configuration looks like.

## Key Takeaways

1. **DP with operation count as a dimension:** When you need to perform exactly k operations, add the operation count as a dimension in your DP state. This is a powerful pattern for "exactly k operations" problems.

2. **Think in terms of "jumps":** Instead of simulating each merge individually, think about which groups of consecutive signs you're merging together. This reduces the state space from exponential to polynomial.

3. **Validate your transition logic:** Always test your DP transition on small examples. The formula for how many merges are used when jumping from m to i is non-obvious and needs careful verification.

[Practice this problem on CodeJeet](/problem/merge-operations-for-minimum-travel-time)
