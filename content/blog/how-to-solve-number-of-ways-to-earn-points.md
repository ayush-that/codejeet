---
title: "How to Solve Number of Ways to Earn Points — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Earn Points. Hard difficulty, 59.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-09-16"
category: "dsa-patterns"
tags: ["number-of-ways-to-earn-points", "array", "dynamic-programming", "hard"]
---

# How to Solve Number of Ways to Earn Points

This problem asks: given `n` question types where type `i` has `count_i` questions each worth `marks_i` points, how many ways can we select questions to earn exactly `target` points? The twist is that each question type has a limited supply (bounded counts), making this a **bounded knapsack** problem rather than the unlimited coin change problem.

What makes this tricky: we need to count combinations where each type can be used 0 to `count_i` times, but we must avoid double-counting combinations and handle the bounded nature efficiently. A naive recursive approach would explode in complexity.

## Visual Walkthrough

Let's trace through a small example: `types = [[1,2],[2,3]]`, `target = 5`

We have:

- Type 0: 1 question worth 2 points
- Type 1: 2 questions worth 3 points each

We want exactly 5 points. Let's enumerate possibilities:

1. **Using Type 0 only**: Can't reach 5 (max 2 points)
2. **Using Type 1 only**: Can't reach 5 (max 6 points, but only 3 or 6)
3. **Combining both**:
   - 1×Type0 (2 points) + 1×Type1 (3 points) = 5 points ✓
   - That's the only combination!

So answer = 1.

Now let's think about how to compute this systematically. For each type, we can use 0, 1, 2, ..., up to `count_i` questions of that type. We need to track how many points we've accumulated so far.

## Brute Force Approach

The brute force solution uses recursion to try all combinations:

```python
def brute_force(types, target):
    def dfs(i, remaining):
        if remaining == 0:
            return 1
        if i == len(types) or remaining < 0:
            return 0

        total_ways = 0
        count, marks = types[i]
        # Try using 0 to count questions of this type
        for k in range(count + 1):
            total_ways += dfs(i + 1, remaining - k * marks)
        return total_ways

    return dfs(0, target)
```

**Why this fails**: Time complexity is O((max_count)^n) where max_count is the maximum count_i. For `n=50` types and counts up to 50, that's 50^50 operations — astronomically large. Even with memoization on `(i, remaining)`, we still have O(n × target × max_count) which can be 50 × 1000 × 50 = 2.5M operations, but the recursion overhead and state management make this inefficient.

## Optimized Approach

The key insight: this is a **dynamic programming** problem similar to "Coin Change II" but with bounded counts. We can adapt the unbounded knapsack approach by carefully handling the limits.

**Core idea**: Use DP where `dp[p]` = number of ways to earn exactly `p` points. Process each question type one by one. For each type `(count, marks)`, we need to update our DP array to include using 0 to `count` questions of this type.

**Why not just use the unbounded coin change approach?** Because if we process marks in the forward direction (from 0 to target), we might use the same type multiple times beyond its count limit. Example: if we have 2 questions worth 3 points each, forward processing might use 3 of them by reusing the same type.

**Solution**: For each type, create a temporary array to track new ways, or use **backward processing** with careful counting. The standard approach:

1. Start with `dp[0] = 1` (one way to get 0 points: use no questions)
2. For each type `(count, marks)`:
   - Create a new array `new_dp` to avoid overwriting
   - For each current points `p` from 0 to target:
     - For `k` from 0 to `count`:
       - If `p + k*marks ≤ target`, add `dp[p]` to `new_dp[p + k*marks]`
3. Result is `dp[target]`

**Optimization**: Instead of the inner `k` loop (O(count)), we can use a **prefix sum** technique to achieve O(target) per type. For each marks value, we process in modulo groups.

## Optimal Solution

Here's the complete solution using optimized DP with prefix sums:

<div class="code-group">

```python
# Time: O(n * target) where n = len(types)
# Space: O(target)
def waysToReachTarget(self, target: int, types: List[List[int]]) -> int:
    MOD = 10**9 + 7
    # dp[p] = number of ways to earn exactly p points
    dp = [0] * (target + 1)
    dp[0] = 1  # Base case: 1 way to get 0 points (use no questions)

    for count, marks in types:
        # Create a new DP array to avoid overwriting during processing
        new_dp = dp[:]  # Copy current dp

        # For each possible total points value
        for points in range(target + 1):
            if dp[points] == 0:
                continue  # Skip if no ways to reach current points

            # Try using 1 to count questions of current type
            for k in range(1, count + 1):
                next_points = points + k * marks
                if next_points > target:
                    break  # No need to check larger k

                # Add ways to reach 'points' to ways to reach 'next_points'
                new_dp[next_points] = (new_dp[next_points] + dp[points]) % MOD

        dp = new_dp  # Update dp for next type

    return dp[target] % MOD
```

```javascript
// Time: O(n * target) where n = types.length
// Space: O(target)
function waysToReachTarget(target, types) {
  const MOD = 10 ** 9 + 7;
  // dp[p] = number of ways to earn exactly p points
  let dp = new Array(target + 1).fill(0);
  dp[0] = 1; // Base case: 1 way to get 0 points

  for (const [count, marks] of types) {
    // Create a new DP array to avoid overwriting
    const newDp = [...dp];

    // For each possible total points value
    for (let points = 0; points <= target; points++) {
      if (dp[points] === 0) continue;

      // Try using 1 to count questions of current type
      for (let k = 1; k <= count; k++) {
        const nextPoints = points + k * marks;
        if (nextPoints > target) break;

        // Add ways to reach current points to ways to reach next points
        newDp[nextPoints] = (newDp[nextPoints] + dp[points]) % MOD;
      }
    }

    dp = newDp; // Update for next type
  }

  return dp[target] % MOD;
}
```

```java
// Time: O(n * target) where n = types.length
// Space: O(target)
class Solution {
    public int waysToReachTarget(int target, int[][] types) {
        final int MOD = 1_000_000_007;
        // dp[p] = number of ways to earn exactly p points
        long[] dp = new long[target + 1];
        dp[0] = 1;  // Base case: 1 way to get 0 points

        for (int[] type : types) {
            int count = type[0];
            int marks = type[1];

            // Create a new DP array to avoid overwriting
            long[] newDp = dp.clone();

            // For each possible total points value
            for (int points = 0; points <= target; points++) {
                if (dp[points] == 0) continue;

                // Try using 1 to count questions of current type
                for (int k = 1; k <= count; k++) {
                    int nextPoints = points + k * marks;
                    if (nextPoints > target) break;

                    // Add ways to reach current points to ways to reach next points
                    newDp[nextPoints] = (newDp[nextPoints] + dp[points]) % MOD;
                }
            }

            dp = newDp;  // Update for next type
        }

        return (int)(dp[target] % MOD);
    }
}
```

</div>

**Even more optimized version using prefix sums** (for completeness):

<div class="code-group">

```python
# Time: O(n * target) | Space: O(target)
# More optimized using prefix sums
def waysToReachTarget(self, target: int, types: List[List[int]]) -> int:
    MOD = 10**9 + 7
    dp = [0] * (target + 1)
    dp[0] = 1

    for count, marks in types:
        # Process in modulo groups for optimization
        for start in range(marks):
            prefix = 0
            # Process points: start, start+marks, start+2*marks, ...
            for points in range(start, target + 1, marks):
                # Add current dp value to prefix sum
                old = dp[points]
                if points >= marks * (count + 1):
                    # Remove contribution from outside the window
                    prefix -= dp[points - marks * (count + 1)]
                dp[points] = (dp[points] + prefix) % MOD
                prefix = (prefix + old) % MOD

    return dp[target] % MOD
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × target × average_count) for the basic DP solution, but with optimization it becomes O(n × target). Here's why:

- We process each of the `n` types
- For each type, we iterate through all `target` possible point values
- For each point value, we could iterate up to `count` times in the basic version
- With prefix sum optimization, we eliminate the inner `count` loop

**Space Complexity**: O(target) for the DP array. We only need to track ways to reach each point total from 0 to target.

## Common Mistakes

1. **Using unbounded knapsack approach**: Candidates familiar with Coin Change II might try processing forward (from 0 to target) without considering count limits. This would allow using more questions than available of each type.
   - **Fix**: Always create a new DP array or process backwards when updating to avoid reusing the same type multiple times in one iteration.

2. **Forgetting modulo operations**: The result can be huge, so we need modulo 10^9+7. Some candidates compute exact values causing integer overflow.
   - **Fix**: Apply modulo after each addition operation, not just at the end.

3. **Incorrect base case**: Setting `dp[0] = 0` instead of `dp[0] = 1`. There's exactly 1 way to get 0 points: by selecting no questions.
   - **Fix**: Always initialize `dp[0] = 1` for counting combination problems.

4. **Off-by-one in count loop**: Using `for k in range(count)` instead of `range(count + 1)`, missing the case of using 0 questions of a type.
   - **Fix**: Remember we can use 0 to `count` questions inclusive.

## When You'll See This Pattern

This bounded knapsack pattern appears in problems where:

1. You have items with limited quantities
2. You need to count combinations to reach a target sum
3. Order doesn't matter (combinations, not permutations)

**Related LeetCode problems**:

1. **Coin Change II (Medium)**: Unlimited coins version of this problem
2. **Combination Sum IV (Medium)**: Permutations (order matters) version
3. **Target Sum (Medium)**: Assign + or - to numbers to reach target
4. **Partition Equal Subset Sum (Medium)**: Special case where target = sum/2

The core technique—DP with state representing accumulated sum—is fundamental to many knapsack and subset sum problems.

## Key Takeaways

1. **Bounded vs. unbounded knapsack**: When items have limited quantities, you can't use the simple forward-processing trick from Coin Change II. You need to process types separately or use windowed prefix sums.

2. **DP state definition is key**: `dp[points] = ways to reach exactly 'points'` is the right state for counting combinations. For optimization problems, you'd store minimum/maximum values instead.

3. **Modulo arithmetic matters**: In counting problems with large results, always check if you need modulo operations. Apply them during computation, not just at the end.

4. **Test with small examples**: Before coding, walk through a small example like `types = [[1,2],[2,3]], target = 5` to verify your logic handles all cases.

Related problems: [Coin Change II](/problem/coin-change-ii), [Minimum Total Distance Traveled](/problem/minimum-total-distance-traveled)
