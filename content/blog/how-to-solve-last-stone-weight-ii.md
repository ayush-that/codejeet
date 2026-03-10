---
title: "How to Solve Last Stone Weight II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Last Stone Weight II. Medium difficulty, 59.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-12-24"
category: "dsa-patterns"
tags: ["last-stone-weight-ii", "array", "dynamic-programming", "medium"]
---

# How to Solve Last Stone Weight II

This problem asks us to smash stones together until at most one remains, but with a twist: we can choose which stones to smash each turn. Given stones with weights `stones[i]`, we repeatedly smash two stones `x` and `y` (where `x ≤ y`), resulting in either:

- If `x == y`: Both stones are destroyed
- If `x != y`: Stone `x` is destroyed, and stone `y` becomes `y - x`

The goal is to find the **minimum possible weight** of the last remaining stone (or 0 if none remain).

What makes this problem tricky is that the order matters significantly. Unlike the simpler "Last Stone Weight I" where we always smash the two heaviest stones, here we have strategic choices. The key insight is that this problem reduces to a **partition problem**: we want to split the stones into two groups such that their weight difference is minimized.

## Visual Walkthrough

Let's trace through example `stones = [2,7,4,1,8,1]`:

**Step 1: Understanding the transformation**
When we smash stones with weights `x` and `y` (where `x ≤ y`), we're effectively replacing them with `y - x`. This is equivalent to:

- Removing both stones from consideration
- Adding a new stone with weight `y - x` (if `y ≠ x`)

**Step 2: Observing the pattern**
Consider a different perspective: Each smash operation with stones `x` and `y` can be thought of as assigning `+` or `-` signs to the stones. For example:

- Smashing 8 and 7 gives us 1 (8 - 7)
- Then smashing 4 and 1 gives us 3 (4 - 1)
- Then smashing 3 and 2 gives us 1 (3 - 2)
- Then smashing 1 and 1 gives us 0

This is equivalent to: 8 - 7 + 4 - 1 - 2 = 2? Wait, let's track it differently.

**Step 3: The partition insight**
Actually, the final result is always of the form: `(sum of some stones) - (sum of remaining stones)`. Let me prove this:

When we smash `x` and `y`:

- If we think of `x` as positive and `y` as negative: result is `y - x`
- But we could also think of both as positive and the result as negative: `-(x - y)`

The key is that each stone's weight can be thought of as having either a `+` or `-` sign in the final expression. The problem becomes: assign `+` or `-` to each stone to minimize the absolute value of the sum.

For `[2,7,4,1,8,1]`, total sum = 23. We want to find a subset with sum close to 11.5. Let's try:

- Subset `[2,4,1,1]` = 8, complement = 15, difference = 7
- Subset `[7,4]` = 11, complement = 12, difference = 1
- Subset `[8,2,1]` = 11, complement = 12, difference = 1

The minimum difference is 1, which matches the optimal solution.

## Brute Force Approach

The brute force approach would try all possible sequences of smashes. For `n` stones:

1. Choose any two stones to smash (n choose 2 possibilities)
2. After smash, we have n-1 stones (or n-2 if equal)
3. Repeat until 0 or 1 stone remains

This leads to factorial complexity: O(n! × something). Even for n=10, that's 3.6 million possibilities. For n=30, it's astronomical.

A slightly better brute force would try all possible sign assignments: each stone can be `+` or `-`, giving us 2^n possibilities. For n=30, that's about 1 billion possibilities - still too slow.

**Why brute force fails:**

- Exponential time complexity O(2^n)
- For the maximum constraint (n=30, stones[i] ≤ 100), total sum ≤ 3000, but 2^30 ≈ 1 billion operations is infeasible
- We need a polynomial-time solution

## Optimized Approach

The key insight is that this problem is equivalent to the **partition problem**: we want to split the stones into two groups with weights S1 and S2 such that |S1 - S2| is minimized.

**Reasoning:**

1. Each smash operation `y - x` can be thought of as assigning `+` to one stone and `-` to the other
2. The final result is the sum of all stones with their assigned signs
3. We want to minimize the absolute value of this sum
4. Let P be the sum of positively signed stones, N be the sum of negatively signed stones
5. Result = P - N, and total sum S = P + N
6. Therefore, result = S - 2N
7. To minimize |result| = |S - 2N|, we want N as close as possible to S/2
8. So we need to find a subset of stones with sum as close as possible to S/2

This transforms our problem into: "Find a subset of stones with maximum sum ≤ S/2."

**Dynamic Programming Solution:**
We can solve this with a knapsack-style DP:

- Let `dp[i]` = whether we can achieve sum `i` using some subset of stones
- For each stone weight `w`, update `dp` from right to left
- Find the largest `i ≤ S/2` where `dp[i]` is true
- The answer is `S - 2*i`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sum(stones)) | Space: O(sum(stones))
def lastStoneWeightII(stones):
    """
    Returns the minimum possible weight of the last stone.

    Approach: This is equivalent to partitioning the stones into two groups
    with weights as close as possible. The minimum difference between the
    two groups is our answer.
    """
    # Calculate total sum of all stones
    total_sum = sum(stones)

    # We want to find a subset with sum as close as possible to total_sum // 2
    target = total_sum // 2

    # dp[i] will be True if we can achieve sum i using some subset of stones
    # We only need up to target since we're looking for sums <= target
    dp = [False] * (target + 1)
    dp[0] = True  # We can always achieve sum 0 (empty subset)

    # Process each stone
    for stone in stones:
        # Traverse backwards to avoid reusing the same stone multiple times
        # This is the classic 0/1 knapsack update pattern
        for i in range(target, stone - 1, -1):
            # If we can achieve sum (i - stone), then by adding this stone
            # we can achieve sum i
            if dp[i - stone]:
                dp[i] = True

    # Find the largest sum <= target that we can achieve
    for i in range(target, -1, -1):
        if dp[i]:
            # The difference between the two groups is total_sum - 2*i
            # One group has sum i, the other has sum total_sum - i
            return total_sum - 2 * i

    # This line should never be reached since dp[0] is always True
    return total_sum
```

```javascript
// Time: O(n * sum(stones)) | Space: O(sum(stones))
function lastStoneWeightII(stones) {
  /**
   * Returns the minimum possible weight of the last stone.
   *
   * Approach: Partition stones into two groups with weights as close
   * as possible. The minimum difference is our answer.
   */

  // Calculate total sum of all stones
  const totalSum = stones.reduce((sum, stone) => sum + stone, 0);

  // Target is half of total sum (rounded down)
  const target = Math.floor(totalSum / 2);

  // dp[i] = true if we can achieve sum i with some subset
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // Empty subset gives sum 0

  // Process each stone weight
  for (const stone of stones) {
    // Traverse backwards to ensure each stone is used at most once
    // This is the 0/1 knapsack update pattern
    for (let i = target; i >= stone; i--) {
      // If we can achieve sum (i - stone), then adding this stone
      // allows us to achieve sum i
      if (dp[i - stone]) {
        dp[i] = true;
      }
    }
  }

  // Find the largest achievable sum <= target
  for (let i = target; i >= 0; i--) {
    if (dp[i]) {
      // Difference between the two groups
      return totalSum - 2 * i;
    }
  }

  // Fallback (should never be reached since dp[0] is always true)
  return totalSum;
}
```

```java
// Time: O(n * sum(stones)) | Space: O(sum(stones))
class Solution {
    public int lastStoneWeightII(int[] stones) {
        /**
         * Returns the minimum possible weight of the last stone.
         *
         * Approach: We partition stones into two groups with sums as close
         * as possible. The minimum difference between groups is our answer.
         */

        // Calculate total sum of stones
        int totalSum = 0;
        for (int stone : stones) {
            totalSum += stone;
        }

        // Target is half of total sum
        int target = totalSum / 2;

        // dp[i] = true if we can achieve sum i with some subset
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;  // Empty subset gives sum 0

        // Process each stone
        for (int stone : stones) {
            // Traverse backwards to avoid reusing the same stone
            // This is standard 0/1 knapsack update
            for (int i = target; i >= stone; i--) {
                // If we can achieve sum (i - stone), then with this stone
                // we can achieve sum i
                if (dp[i - stone]) {
                    dp[i] = true;
                }
            }
        }

        // Find the largest achievable sum <= target
        for (int i = target; i >= 0; i--) {
            if (dp[i]) {
                // One group has sum i, the other has sum totalSum - i
                // Difference is (totalSum - i) - i = totalSum - 2*i
                return totalSum - 2 * i;
            }
        }

        // Fallback (should never be reached)
        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × S)**

- `n` is the number of stones
- `S` is the sum of all stone weights
- We iterate through each stone (n times), and for each stone, we iterate through the DP array of size at most S/2
- In worst case, S = n × 100 = 30 × 100 = 3000, so operations ≈ 30 × 1500 = 45,000

**Space Complexity: O(S)**

- We maintain a DP array of size S/2 + 1
- In worst case, S = 3000, so array size ≈ 1501

This is efficient given the constraints (n ≤ 30, stones[i] ≤ 100).

## Common Mistakes

1. **Using a greedy approach like Last Stone Weight I**: Candidates often try to always smash the two heaviest stones, but that doesn't guarantee the minimum result. The example `[31,26,33,21,40]` shows this: greedy gives 9, but optimal is 1.

2. **Incorrect DP initialization**: Forgetting to set `dp[0] = true` (the empty subset case). Without this, we can't build any subsets.

3. **Wrong traversal direction in DP update**: Updating the DP array from left to right instead of right to left would allow reusing the same stone multiple times (unbounded knapsack instead of 0/1 knapsack).

4. **Not handling the return value correctly**: The answer is `total_sum - 2 * best_sum`, not just `best_sum` or `total_sum - best_sum`. Remember we want the difference between the two groups.

5. **Integer overflow in Java/C++**: When calculating total sum, use appropriate data types. For constraints (30 stones × 100 weight), sum ≤ 3000 fits in int, but for similar problems with larger constraints, this could be an issue.

## When You'll See This Pattern

This **partition/subset sum** pattern appears in many problems:

1. **Partition Equal Subset Sum (LeetCode 416)**: Determine if an array can be partitioned into two subsets with equal sum. This is essentially checking if we can achieve sum = total_sum/2.

2. **Target Sum (LeetCode 494)**: Count the number of ways to assign + and - signs to get a target sum. This is the counting version of our problem.

3. **Coin Change (LeetCode 322)**: While not exactly the same, it uses similar DP techniques for subset sums.

4. **Partition Array Into Two Arrays to Minimize Sum Difference (LeetCode 2035)**: A harder version where we need to partition into two equal-sized groups.

The core technique is recognizing when a problem can be reduced to finding a subset with a particular sum, then applying knapsack-style dynamic programming.

## Key Takeaways

1. **Problem transformation is key**: Many problems become easier when you recognize they're equivalent to a known problem type. Here, stone smashing transforms to subset sum/partition.

2. **0/1 Knapsack pattern**: When you need to select a subset of items (each usable at most once) to achieve a target sum, use the backwards DP update: `for i from target down to weight: dp[i] = dp[i] or dp[i-weight]`.

3. **Space optimization**: We only need a 1D DP array instead of 2D because we process items one by one and only need the previous state.

4. **Boundary conditions matter**: Always initialize `dp[0] = true` for subset sum problems, and be careful with array bounds when accessing `dp[i-weight]`.

Related problems: [Partition Array Into Two Arrays to Minimize Sum Difference](/problem/partition-array-into-two-arrays-to-minimize-sum-difference)
