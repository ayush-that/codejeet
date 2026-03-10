---
title: "How to Solve Build Array Where You Can Find The Maximum Exactly K Comparisons — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Build Array Where You Can Find The Maximum Exactly K Comparisons. Hard difficulty, 65.9% acceptance rate. Topics: Dynamic Programming, Prefix Sum."
date: "2028-01-14"
category: "dsa-patterns"
tags:
  [
    "build-array-where-you-can-find-the-maximum-exactly-k-comparisons",
    "dynamic-programming",
    "prefix-sum",
    "hard",
  ]
---

# How to Solve "Build Array Where You Can Find The Maximum Exactly K Comparisons"

This problem asks you to count how many arrays of length `n` can be built where each element is between 1 and `m`, and when you run a specific maximum-finding algorithm on it, exactly `k` comparisons are made. The algorithm scans left to right, keeping track of the current maximum and a counter that increments whenever a new maximum is found. The challenge is that we need to count _all possible arrays_ that satisfy this condition, which grows exponentially — making brute force impossible for typical constraints.

What makes this problem interesting is that it combines combinatorial counting with dynamic programming, requiring careful state tracking of both the current maximum value and the number of comparisons made so far.

## Visual Walkthrough

Let's trace through a small example: `n = 2, m = 3, k = 1`

We need to count arrays of length 2 where each element is between 1 and 3, and exactly 1 comparison occurs when finding the maximum.

**Understanding the algorithm:**

- Start with `search_cost = 0` and `max_so_far = 0`
- For each element `arr[i]`:
  - If `arr[i] > max_so_far`: update `max_so_far` and increment `search_cost`
  - Otherwise: do nothing

**For k = 1 comparison:**

- Only one element can be larger than all previous elements
- The first element always triggers a comparison (since max_so_far starts at 0)
- So k = 1 means: the first element is the overall maximum

**Valid arrays for n=2, m=3, k=1:**

1. `[1, 1]` - First element 1, second element ≤ 1
2. `[1, 2]` - Invalid! Second element 2 > 1, would trigger second comparison
3. `[1, 3]` - Invalid for same reason
4. `[2, 1]` - Valid: first element 2, second element ≤ 2
5. `[2, 2]` - Valid
6. `[3, 1]` - Valid
7. `[3, 2]` - Valid
8. `[3, 3]` - Valid

**Counting systematically:**

- Choose first element: any of 1, 2, 3 (3 choices)
- Choose second element: must be ≤ first element (first element choices)
- Total = 1×1 + 2×2 + 3×3 = 1 + 4 + 9 = 14? Wait, let's count properly:

Actually, for each first element `x`:

- Second element can be any from 1 to `x` (inclusive)
- So count = sum\_{x=1 to 3} x = 1 + 2 + 3 = 6

Valid arrays: `[1,1]`, `[2,1]`, `[2,2]`, `[3,1]`, `[3,2]`, `[3,3]` = 6 total

This small example shows we need to track: current position, current maximum value, and comparisons used so far.

## Brute Force Approach

The brute force solution would generate all possible arrays of length `n` with values from 1 to `m`, then run the algorithm on each to check if it makes exactly `k` comparisons.

**Why this fails:**

- Number of arrays = m^n
- For typical constraints (n up to 50, m up to 100), m^n is astronomically large (~100^50)
- Even for small cases like n=10, m=10, that's 10 billion arrays to check

**Brute force code structure:**

<div class="code-group">

```python
def brute_force(n, m, k):
    def generate_arrays(idx, current):
        if idx == n:
            # Run algorithm on complete array
            max_so_far = 0
            cost = 0
            for num in current:
                if num > max_so_far:
                    max_so_far = num
                    cost += 1
            return 1 if cost == k else 0

        total = 0
        for num in range(1, m + 1):
            current.append(num)
            total += generate_arrays(idx + 1, current)
            current.pop()
        return total

    return generate_arrays(0, [])
```

```javascript
function bruteForce(n, m, k) {
  function generateArrays(idx, current) {
    if (idx === n) {
      // Run algorithm on complete array
      let maxSoFar = 0;
      let cost = 0;
      for (let num of current) {
        if (num > maxSoFar) {
          maxSoFar = num;
          cost++;
        }
      }
      return cost === k ? 1 : 0;
    }

    let total = 0;
    for (let num = 1; num <= m; num++) {
      current.push(num);
      total += generateArrays(idx + 1, current);
      current.pop();
    }
    return total;
  }

  return generateArrays(0, []);
}
```

```java
class Solution {
    public int bruteForce(int n, int m, int k) {
        return generateArrays(0, n, m, k, new ArrayList<>());
    }

    private int generateArrays(int idx, int n, int m, int k, List<Integer> current) {
        if (idx == n) {
            // Run algorithm on complete array
            int maxSoFar = 0;
            int cost = 0;
            for (int num : current) {
                if (num > maxSoFar) {
                    maxSoFar = num;
                    cost++;
                }
            }
            return cost == k ? 1 : 0;
        }

        int total = 0;
        for (int num = 1; num <= m; num++) {
            current.add(num);
            total += generateArrays(idx + 1, n, m, k, current);
            current.remove(current.size() - 1);
        }
        return total;
    }
}
```

</div>

This is clearly infeasible for any non-trivial inputs. We need a smarter approach.

## Optimized Approach

The key insight is that we can use **dynamic programming** with state `(position, current_max, comparisons_used)`.

**State definition:**

- `dp[i][max_val][cost]` = number of ways to build first `i` elements where:
  - Current maximum value is `max_val`
  - We've used exactly `cost` comparisons so far

**Transition reasoning:**
When adding the `(i+1)`-th element:

1. **If we choose a value ≤ current_max**: No new comparison
   - New max stays the same
   - Cost stays the same
   - There are `max_val` choices (values 1 to max_val)
2. **If we choose a value > current_max**: Triggers a comparison
   - New max becomes the chosen value
   - Cost increases by 1
   - For current max = `max_val`, we can choose values from `max_val+1` to `m`

**Optimization with prefix sums:**
The naive DP would be O(n × m × k × m) because for each state, we might sum over many possible new values. We can optimize to O(n × m × k) using prefix sums:

- For case 1 (value ≤ current_max): We need sum of all ways with same or lower max value
- For case 2 (value > current_max): We need to distribute counts to higher max values

Actually, there's an even cleaner approach: track `dp[i][j][k]` where `j` is the current maximum value. Then:

- Adding a number ≤ j: `dp[i+1][j][k] += dp[i][j][k] * j` (j choices)
- Adding a number > j: `dp[i+1][x][k+1] += dp[i][j][k]` for all x > j

But this is still O(n × m² × k). The real optimization comes from realizing we don't need to track the exact maximum value, just whether we're adding a number that increases it.

**Final DP formulation:**
Let `dp[i][cost][maxVal]` = ways for first i elements, cost comparisons, with maximum = maxVal

Transition:

1. Add number ≤ maxVal: `dp[i+1][cost][maxVal] += dp[i][cost][maxVal] * maxVal`
2. Add number > maxVal: `dp[i+1][cost+1][newMax] += dp[i][cost][maxVal]` for newMax > maxVal

We can optimize the second case using prefix sums to avoid the inner loop over newMax.

## Optimal Solution

The optimal solution uses 3D DP with prefix sum optimization. We maintain a prefix sum array to quickly compute sums for the "add number > maxVal" case.

<div class="code-group">

```python
class Solution:
    def numOfArrays(self, n: int, m: int, k: int) -> int:
        MOD = 10**9 + 7

        # dp[i][cost][maxVal]: ways for first i elements, cost comparisons, max = maxVal
        dp = [[[0] * (m + 1) for _ in range(k + 1)] for _ in range(n + 1)]

        # Base case: for length 1, any value from 1 to m gives cost = 1
        for maxVal in range(1, m + 1):
            dp[1][1][maxVal] = 1

        # Fill DP table
        for i in range(1, n):  # we already have solutions for length 1
            for cost in range(1, min(k, i) + 1):  # can't have more comparisons than elements
                # Compute prefix sums for current (i, cost) layer
                prefix = [0] * (m + 1)
                for maxVal in range(1, m + 1):
                    prefix[maxVal] = (prefix[maxVal - 1] + dp[i][cost][maxVal]) % MOD

                for maxVal in range(1, m + 1):
                    # Case 1: Add a number <= maxVal (no new comparison)
                    # There are maxVal choices (1 to maxVal)
                    dp[i + 1][cost][maxVal] = (dp[i + 1][cost][maxVal] +
                                               dp[i][cost][maxVal] * maxVal) % MOD

                    # Case 2: Add a number > maxVal (triggers new comparison)
                    # We can add any number from maxVal+1 to m
                    # Each such number becomes the new maximum
                    # Sum of all dp[i][cost][prevMax] where prevMax < newMax
                    if cost + 1 <= k:
                        # For current maxVal, we need to add to all newMax > maxVal
                        # But we can compute this efficiently using prefix sums
                        # Total ways to get newMax = x is sum_{prevMax < x} dp[i][cost][prevMax]
                        # We'll handle this in the inner loop over newMax
                        pass

                # More efficient: handle case 2 separately using prefix sums
                for newMax in range(1, m + 1):
                    if cost + 1 <= k:
                        # Ways to get newMax as maximum with cost+1 comparisons
                        # = sum of all ways with previous max < newMax and previous cost
                        dp[i + 1][cost + 1][newMax] = (dp[i + 1][cost + 1][newMax] +
                                                       prefix[newMax - 1]) % MOD

        # Sum all ways for length n, exactly k comparisons, any maximum value
        result = 0
        for maxVal in range(1, m + 1):
            result = (result + dp[n][k][maxVal]) % MOD

        return result
```

```javascript
/**
 * @param {number} n
 * @param {number} m
 * @param {number} k
 * @return {number}
 */
var numOfArrays = function (n, m, k) {
  const MOD = 10 ** 9 + 7;

  // dp[i][cost][maxVal]: ways for first i elements, cost comparisons, max = maxVal
  const dp = Array(n + 1)
    .fill()
    .map(() =>
      Array(k + 1)
        .fill()
        .map(() => Array(m + 1).fill(0))
    );

  // Base case: length 1, any value gives cost = 1
  for (let maxVal = 1; maxVal <= m; maxVal++) {
    dp[1][1][maxVal] = 1;
  }

  // Fill DP table
  for (let i = 1; i < n; i++) {
    for (let cost = 1; cost <= Math.min(k, i); cost++) {
      // Compute prefix sums for current (i, cost) layer
      const prefix = Array(m + 1).fill(0);
      for (let maxVal = 1; maxVal <= m; maxVal++) {
        prefix[maxVal] = (prefix[maxVal - 1] + dp[i][cost][maxVal]) % MOD;
      }

      for (let maxVal = 1; maxVal <= m; maxVal++) {
        // Case 1: Add number <= maxVal (no new comparison)
        // maxVal choices: 1 to maxVal
        dp[i + 1][cost][maxVal] = (dp[i + 1][cost][maxVal] + dp[i][cost][maxVal] * maxVal) % MOD;
      }

      // Case 2: Add number > current max (triggers comparison)
      if (cost + 1 <= k) {
        for (let newMax = 1; newMax <= m; newMax++) {
          // Ways to get newMax as maximum with cost+1 comparisons
          // = sum of all ways with previous max < newMax
          dp[i + 1][cost + 1][newMax] = (dp[i + 1][cost + 1][newMax] + prefix[newMax - 1]) % MOD;
        }
      }
    }
  }

  // Sum all ways for length n, exactly k comparisons
  let result = 0;
  for (let maxVal = 1; maxVal <= m; maxVal++) {
    result = (result + dp[n][k][maxVal]) % MOD;
  }

  return result;
};
```

```java
class Solution {
    public int numOfArrays(int n, int m, int k) {
        final int MOD = 1000000007;

        // dp[i][cost][maxVal]: ways for first i elements, cost comparisons, max = maxVal
        long[][][] dp = new long[n + 1][k + 1][m + 1];

        // Base case: length 1, any value from 1 to m gives cost = 1
        for (int maxVal = 1; maxVal <= m; maxVal++) {
            dp[1][1][maxVal] = 1;
        }

        // Fill DP table
        for (int i = 1; i < n; i++) {
            for (int cost = 1; cost <= Math.min(k, i); cost++) {
                // Compute prefix sums for current (i, cost) layer
                long[] prefix = new long[m + 1];
                for (int maxVal = 1; maxVal <= m; maxVal++) {
                    prefix[maxVal] = (prefix[maxVal - 1] + dp[i][cost][maxVal]) % MOD;
                }

                for (int maxVal = 1; maxVal <= m; maxVal++) {
                    // Case 1: Add number <= maxVal (no new comparison)
                    // maxVal choices: 1 to maxVal
                    dp[i + 1][cost][maxVal] = (dp[i + 1][cost][maxVal] +
                                              dp[i][cost][maxVal] * maxVal) % MOD;
                }

                // Case 2: Add number > current max (triggers comparison)
                if (cost + 1 <= k) {
                    for (int newMax = 1; newMax <= m; newMax++) {
                        // Ways to get newMax as maximum with cost+1 comparisons
                        // = sum of all ways with previous max < newMax
                        dp[i + 1][cost + 1][newMax] = (dp[i + 1][cost + 1][newMax] +
                                                      prefix[newMax - 1]) % MOD;
                    }
                }
            }
        }

        // Sum all ways for length n, exactly k comparisons
        long result = 0;
        for (int maxVal = 1; maxVal <= m; maxVal++) {
            result = (result + dp[n][k][maxVal]) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m × k)

- We have three nested loops:
  - Outer loop: n iterations (array length)
  - Middle loop: min(k, i) iterations (comparisons used so far)
  - Inner loops: O(m) for processing each maximum value
- The prefix sum computation adds O(m) per (i, cost) state
- Total: O(n × k × m)

**Space Complexity:** O(n × m × k) for the DP table

- We can optimize to O(m × k) by only storing current and previous rows
- But the solution above uses O(n × m × k) for clarity

## Common Mistakes

1. **Forgetting modulo operations**: The result can be huge, so we need modulo 10^9+7 at every addition/multiplication. Forgetting this causes integer overflow.

2. **Incorrect base case**: The first element always triggers a comparison (since initial max is 0), so dp[1][1][val] = 1 for all val. Some candidates mistakenly set dp[1][0][val] = 1.

3. **Off-by-one in prefix sums**: When computing "sum of dp[i][cost][prevMax] for prevMax < newMax", we need prefix[newMax-1], not prefix[newMax]. The prefix array is 1-indexed for max values.

4. **Not limiting cost range**: We can't have more comparisons than elements processed, so cost should only go up to min(k, i). Checking cost > i wastes computation.

## When You'll See This Pattern

This type of "counting with constraints" problem appears in various forms:

1. **Distinct Subsequences (LeetCode 115)**: Count how many times a subsequence appears in a string, using DP with state (position in s, position in t).

2. **Number of Music Playlists (LeetCode 920)**: Count playlists of length N with certain constraints on song repetition, using DP with state (songs played, unique songs used).

3. **Paint House II (LeetCode 265)**: Minimize painting cost with no adjacent same colors, using DP with state (house, color) and optimizing with tracking min costs.

The common pattern is: when you need to count configurations satisfying multiple constraints, use DP with state variables representing each constraint's current status.

## Key Takeaways

1. **Multi-dimensional DP for counting problems**: When counting objects with multiple constraints, use DP dimensions for each constraint. Here: position, comparisons used, current maximum.

2. **Prefix sums optimize summation transitions**: When DP transitions involve summing over a range of previous states, precompute prefix sums to reduce O(m) to O(1) per transition.

3. **Careful base cases matter**: In counting problems, the initial state (empty array, zero comparisons) needs precise definition. Test with small examples to verify.

[Practice this problem on CodeJeet](/problem/build-array-where-you-can-find-the-maximum-exactly-k-comparisons)
