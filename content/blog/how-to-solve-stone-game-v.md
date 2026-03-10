---
title: "How to Solve Stone Game V — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stone Game V. Hard difficulty, 41.6% acceptance rate. Topics: Array, Math, Dynamic Programming, Game Theory."
date: "2029-07-22"
category: "dsa-patterns"
tags: ["stone-game-v", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Stone Game V

Stone Game V presents a challenging twist on the classic stone game series. You're given an array of stone values, and in each turn, Alice splits the row into two non-empty parts, Bob discards the part with lower total value (or both if equal), and Alice gets the points from the remaining stones. The game continues recursively with the remaining stones, and Alice wants to maximize her total score. The tricky part is that each split creates a recursive subproblem where the optimal strategy depends on future splits.

## Visual Walkthrough

Let's trace through a small example: `stoneValue = [6,2,3,4,5,5]`

**Initial state:** Total = 25

**Round 1 possibilities:**

- Split after index 0: Left = [6] (sum=6), Right = [2,3,4,5,5] (sum=19)
  - Bob discards left (6 < 19), Alice gets right (19 points)
  - Continue with [2,3,4,5,5] (sum=19)
- Split after index 1: Left = [6,2] (sum=8), Right = [3,4,5,5] (sum=17)
  - Bob discards left (8 < 17), Alice gets right (17 points)
  - Continue with [3,4,5,5] (sum=17)
- Split after index 2: Left = [6,2,3] (sum=11), Right = [4,5,5] (sum=14)
  - Bob discards left (11 < 14), Alice gets right (14 points)
  - Continue with [4,5,5] (sum=14)
- Split after index 3: Left = [6,2,3,4] (sum=15), Right = [5,5] (sum=10)
  - Bob discards right (10 < 15), Alice gets left (15 points)
  - Continue with [6,2,3,4] (sum=15)
- Split after index 4: Left = [6,2,3,4,5] (sum=20), Right = [5] (sum=5)
  - Bob discards right (5 < 20), Alice gets left (20 points)
  - Continue with [6,2,3,4,5] (sum=20)

Alice needs to consider not just the immediate points, but also how the remaining stones will play out. For instance, taking 20 points now but being left with [6,2,3,4,5] might yield fewer total points than taking 19 points and being left with [2,3,4,5,5] if the latter leads to better future splits.

## Brute Force Approach

The brute force solution uses recursion to explore all possible splits. For each possible split point, we:

1. Calculate left and right sums
2. Determine which side Bob discards
3. Recursively compute the optimal score for the remaining stones
4. Add the current round's points to the recursive result

The problem with this approach is the exponential time complexity. For an array of length `n`, there are `n-1` possible splits at the first level, each creating two subproblems of sizes `k` and `n-k`. This leads to overlapping subproblems that get recomputed many times.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def stoneGameV_brute(stoneValue):
    n = len(stoneValue)

    def dfs(left, right):
        # Base case: single stone gets 0 points
        if left == right:
            return 0

        max_score = 0
        # Try all possible splits
        for split in range(left, right):
            left_sum = sum(stoneValue[left:split+1])
            right_sum = sum(stoneValue[split+1:right+1])

            if left_sum < right_sum:
                # Bob discards left, Alice gets right
                score = right_sum + dfs(split+1, right)
            elif left_sum > right_sum:
                # Bob discards right, Alice gets left
                score = left_sum + dfs(left, split)
            else:
                # Bob discards either, Alice chooses best
                score = max(left_sum + dfs(left, split),
                           right_sum + dfs(split+1, right))

            max_score = max(max_score, score)

        return max_score

    return dfs(0, n-1)
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function stoneGameVBrute(stoneValue) {
  const n = stoneValue.length;

  function dfs(left, right) {
    // Base case: single stone gets 0 points
    if (left === right) return 0;

    let maxScore = 0;
    // Try all possible splits
    for (let split = left; split < right; split++) {
      let leftSum = 0;
      for (let i = left; i <= split; i++) {
        leftSum += stoneValue[i];
      }

      let rightSum = 0;
      for (let i = split + 1; i <= right; i++) {
        rightSum += stoneValue[i];
      }

      let score;
      if (leftSum < rightSum) {
        // Bob discards left, Alice gets right
        score = rightSum + dfs(split + 1, right);
      } else if (leftSum > rightSum) {
        // Bob discards right, Alice gets left
        score = leftSum + dfs(left, split);
      } else {
        // Bob discards either, Alice chooses best
        score = Math.max(leftSum + dfs(left, split), rightSum + dfs(split + 1, right));
      }

      maxScore = Math.max(maxScore, score);
    }

    return maxScore;
  }

  return dfs(0, n - 1);
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
public int stoneGameVBrute(int[] stoneValue) {
    int n = stoneValue.length;
    return dfs(0, n - 1, stoneValue);
}

private int dfs(int left, int right, int[] stoneValue) {
    // Base case: single stone gets 0 points
    if (left == right) return 0;

    int maxScore = 0;
    // Try all possible splits
    for (int split = left; split < right; split++) {
        int leftSum = 0;
        for (int i = left; i <= split; i++) {
            leftSum += stoneValue[i];
        }

        int rightSum = 0;
        for (int i = split + 1; i <= right; i++) {
            rightSum += stoneValue[i];
        }

        int score;
        if (leftSum < rightSum) {
            // Bob discards left, Alice gets right
            score = rightSum + dfs(split + 1, right, stoneValue);
        } else if (leftSum > rightSum) {
            // Bob discards right, Alice gets left
            score = leftSum + dfs(left, split, stoneValue);
        } else {
            // Bob discards either, Alice chooses best
            score = Math.max(
                leftSum + dfs(left, split, stoneValue),
                rightSum + dfs(split + 1, right, stoneValue)
            );
        }

        maxScore = Math.max(maxScore, score);
    }

    return maxScore;
}
```

</div>

This brute force approach is too slow for the constraints (n ≤ 500), as it would take O(2^n) time. We need to optimize using dynamic programming.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**, making it perfect for dynamic programming. We can define `dp[i][j]` as the maximum score Alice can achieve from the subarray `stoneValue[i:j+1]`.

**Key optimizations:**

1. **Prefix sums**: Precompute prefix sums to calculate subarray sums in O(1) time
2. **Memoization**: Store results of subproblems to avoid recomputation
3. **Optimized splitting**: For each subarray, we only need to consider splits where the sums are balanced, as imbalanced splits always favor the larger side

**The recurrence relation:**
For a subarray from `i` to `j`:

- Try each split point `k` from `i` to `j-1`
- Calculate `left_sum` and `right_sum`
- If `left_sum < right_sum`: score = `right_sum + dp[k+1][j]`
- If `left_sum > right_sum`: score = `left_sum + dp[i][k]`
- If `left_sum == right_sum`: score = `max(left_sum + dp[i][k], right_sum + dp[k+1][j])`
- `dp[i][j]` is the maximum score over all splits

**Implementation strategy:**
We compute DP in increasing order of subarray length, since larger subarrays depend on smaller ones.

## Optimal Solution

Here's the optimized DP solution with O(n³) time complexity, which is acceptable for n ≤ 500:

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n^2)
def stoneGameV(stoneValue):
    n = len(stoneValue)

    # Prefix sums for O(1) range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stoneValue[i]

    # Helper function to get sum from i to j (inclusive)
    def range_sum(i, j):
        return prefix[j + 1] - prefix[i]

    # DP table: dp[i][j] = max score from stones i to j
    dp = [[0] * n for _ in range(n)]

    # Fill DP table for increasing lengths
    for length in range(2, n + 1):  # length from 2 to n
        for i in range(n - length + 1):
            j = i + length - 1

            max_score = 0
            # Try all possible splits
            for k in range(i, j):
                left_sum = range_sum(i, k)
                right_sum = range_sum(k + 1, j)

                if left_sum < right_sum:
                    # Bob discards left, Alice gets right
                    score = left_sum + dp[i][k]
                elif left_sum > right_sum:
                    # Bob discards right, Alice gets left
                    score = right_sum + dp[k + 1][j]
                else:
                    # Equal sums, Alice chooses better option
                    score = max(left_sum + dp[i][k],
                               right_sum + dp[k + 1][j])

                max_score = max(max_score, score)

            dp[i][j] = max_score

    return dp[0][n - 1]
```

```javascript
// Time: O(n^3) | Space: O(n^2)
function stoneGameV(stoneValue) {
  const n = stoneValue.length;

  // Prefix sums for O(1) range sum queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + stoneValue[i];
  }

  // Helper function to get sum from i to j (inclusive)
  function rangeSum(i, j) {
    return prefix[j + 1] - prefix[i];
  }

  // DP table: dp[i][j] = max score from stones i to j
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // Fill DP table for increasing lengths
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;

      let maxScore = 0;
      // Try all possible splits
      for (let k = i; k < j; k++) {
        const leftSum = rangeSum(i, k);
        const rightSum = rangeSum(k + 1, j);

        let score;
        if (leftSum < rightSum) {
          // Bob discards left, Alice gets right
          score = leftSum + dp[i][k];
        } else if (leftSum > rightSum) {
          // Bob discards right, Alice gets left
          score = rightSum + dp[k + 1][j];
        } else {
          // Equal sums, Alice chooses better option
          score = Math.max(leftSum + dp[i][k], rightSum + dp[k + 1][j]);
        }

        maxScore = Math.max(maxScore, score);
      }

      dp[i][j] = maxScore;
    }
  }

  return dp[0][n - 1];
}
```

```java
// Time: O(n^3) | Space: O(n^2)
public int stoneGameV(int[] stoneValue) {
    int n = stoneValue.length;

    // Prefix sums for O(1) range sum queries
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + stoneValue[i];
    }

    // DP table: dp[i][j] = max score from stones i to j
    int[][] dp = new int[n][n];

    // Fill DP table for increasing lengths
    for (int length = 2; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;

            int maxScore = 0;
            // Try all possible splits
            for (int k = i; k < j; k++) {
                int leftSum = prefix[k + 1] - prefix[i];
                int rightSum = prefix[j + 1] - prefix[k + 1];

                int score;
                if (leftSum < rightSum) {
                    // Bob discards left, Alice gets right
                    score = leftSum + dp[i][k];
                } else if (leftSum > rightSum) {
                    // Bob discards right, Alice gets left
                    score = rightSum + dp[k + 1][j];
                } else {
                    // Equal sums, Alice chooses better option
                    score = Math.max(
                        leftSum + dp[i][k],
                        rightSum + dp[k + 1][j]
                    );
                }

                maxScore = Math.max(maxScore, score);
            }

            dp[i][j] = maxScore;
        }
    }

    return dp[0][n - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- We have three nested loops:
  1. Outer loop over subarray lengths: O(n)
  2. Middle loop over starting indices: O(n)
  3. Inner loop over split points: O(n)
- Each iteration does O(1) work with prefix sums
- Total: O(n × n × n) = O(n³)

**Space Complexity: O(n²)**

- We store the DP table of size n × n
- We also store prefix sums of size n+1
- Total: O(n²) dominates O(n)

For n ≤ 500, O(n³) = 125 million operations is acceptable in most programming languages with efficient implementations.

## Common Mistakes

1. **Forgetting the base case**: When there's only one stone (i == j), the score should be 0 because no split is possible. Forgetting this leads to incorrect recursion.

2. **Incorrect prefix sum indexing**: The common mistake is using `prefix[j] - prefix[i]` which gives sum from i to j-1 instead of i to j. Remember: sum(i, j) = `prefix[j+1] - prefix[i]`.

3. **Not handling equal sums correctly**: When left_sum == right_sum, Alice can choose either side. Some candidates only take one side, missing the opportunity to maximize the total score.

4. **Wrong DP filling order**: The DP table must be filled in increasing order of subarray length because `dp[i][j]` depends on `dp[i][k]` and `dp[k+1][j]` where k is between i and j. Filling in random order leads to using uninitialized values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Range DP**: Problems where you need to compute optimal results for all subarrays/substrings. Similar problems:
   - [Burst Balloons](https://leetcode.com/problems/burst-balloons/) - Also uses range DP with O(n³) complexity
   - [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/) - Another range DP with prefix sums

2. **Game Theory with DP**: Problems where optimal play depends on future moves:
   - [Stone Game II](https://leetcode.com/problems/stone-game-ii/) - Similar recursive structure but with different rules
   - [Predict the Winner](https://leetcode.com/problems/predict-the-winner/) - Two-player game with optimal substructure

3. **Prefix Sum Optimization**: Whenever you need frequent range sum queries:
   - [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Uses prefix sums for efficient counting
   - [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) - Kadane's algorithm is related to prefix sums

## Key Takeaways

1. **Range DP pattern**: When a problem involves operations on subarrays/substrings and has optimal substructure, consider a 2D DP table where `dp[i][j]` represents the optimal result for the subarray from i to j.

2. **Prefix sums for range queries**: When you need to frequently compute sums of subarrays, precompute prefix sums to answer queries in O(1) time instead of O(n).

3. **Game theory intuition**: In two-player games where both play optimally, the current player's decision depends on what will happen in future turns. This naturally leads to recursive solutions that can be optimized with memoization or DP.

Related problems: [Stone Game](/problem/stone-game), [Stone Game II](/problem/stone-game-ii), [Stone Game III](/problem/stone-game-iii)
