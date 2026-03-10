---
title: "How to Solve Minimum Difficulty of a Job Schedule — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Difficulty of a Job Schedule. Hard difficulty, 59.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-07-11"
category: "dsa-patterns"
tags: ["minimum-difficulty-of-a-job-schedule", "array", "dynamic-programming", "hard"]
---

# How to Solve Minimum Difficulty of a Job Schedule

This problem asks us to schedule a sequence of jobs over `d` days, where each day we complete a contiguous segment of jobs (since jobs are dependent), and each day's difficulty equals the hardest job completed that day. We need to minimize the sum of daily difficulties. The challenge lies in finding the optimal way to partition the job sequence into exactly `d` segments to minimize this sum.

## Visual Walkthrough

Let's trace through a concrete example: `jobDifficulty = [6, 5, 4, 3, 2, 1]` with `d = 3` days.

We need to split the 6 jobs into exactly 3 contiguous segments. Each segment's difficulty is its maximum job difficulty.

**Possible partition 1:** [6, 5], [4, 3], [2, 1]

- Day 1: max(6,5) = 6
- Day 2: max(4,3) = 4
- Day 3: max(2,1) = 2
- Total: 6 + 4 + 2 = 12

**Possible partition 2:** [6], [5, 4, 3], [2, 1]

- Day 1: max(6) = 6
- Day 2: max(5,4,3) = 5
- Day 3: max(2,1) = 2
- Total: 6 + 5 + 2 = 13

**Possible partition 3:** [6, 5, 4], [3, 2], [1]

- Day 1: max(6,5,4) = 6
- Day 2: max(3,2) = 3
- Day 3: max(1) = 1
- Total: 6 + 3 + 1 = 10

We need to find the partition that gives the minimum total. Notice that as we consider where to make cuts between days, the difficulty of a segment depends on the maximum value within that range. This overlapping substructure suggests dynamic programming.

## Brute Force Approach

The brute force approach would try every possible way to partition `n` jobs into `d` contiguous segments. This is equivalent to choosing `d-1` cut points from `n-1` possible positions between jobs. The number of ways is C(n-1, d-1), which grows exponentially.

For each partition, we'd need to:

1. Calculate the maximum in each segment (O(n) per partition)
2. Sum these maximums
3. Track the minimum sum found

This gives us O(n × C(n-1, d-1)) time complexity, which is far too slow for typical constraints (n up to 300, d up to 10).

Even though we can't implement this in practice, understanding the brute force helps us see the problem structure: we're making sequential decisions about where to end each day, and each decision affects future possibilities.

## Optimized Approach

The key insight is that this is a **partitioning problem with overlapping subproblems**, making it ideal for dynamic programming.

**DP State Definition:**
Let `dp[i][k]` = minimum difficulty to schedule the first `i+1` jobs (jobs 0 through i) in `k+1` days.

**Base Cases:**

- If we have more days than jobs (`d > n`), it's impossible (return -1)
- If we have exactly one day (`k = 0`), we must do all jobs: `dp[i][0] = max(jobs[0..i])`

**Transition:**
For `dp[i][k]` where `k > 0`:
We consider all possible positions `j` where day `k` could start. Day `k` would then contain jobs `j..i`, and its difficulty is `max(jobs[j..i])`. The first `k` days would cover jobs `0..j-1`, with minimum difficulty `dp[j-1][k-1]`.

So: `dp[i][k] = min over all j (dp[j-1][k-1] + max(jobs[j..i]))`

**Optimization:**
Calculating `max(jobs[j..i])` repeatedly would be expensive. We can compute it efficiently by iterating `j` from `i` down to `k` (since we need at least one job per day, `j` must be at least `k`). As we move `j` leftward, we can track the current maximum in O(1) time.

## Optimal Solution

Here's the complete dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^2 * d) | Space: O(n * d)
def minDifficulty(jobDifficulty, d):
    n = len(jobDifficulty)

    # If we have more days than jobs, it's impossible
    if n < d:
        return -1

    # dp[i][k]: min difficulty for first i+1 jobs in k+1 days
    # Using 0-indexed for jobs and days
    dp = [[float('inf')] * d for _ in range(n)]

    # Base case: 1 day (k = 0)
    # We must do all jobs from 0 to i
    current_max = 0
    for i in range(n):
        current_max = max(current_max, jobDifficulty[i])
        dp[i][0] = current_max

    # Fill DP table for k = 1 to d-1 days
    for k in range(1, d):
        # For k+1 days, we need at least k+1 jobs
        # So i starts from k (0-indexed: k jobs for k+1 days)
        for i in range(k, n):
            # max_difficulty tracks the difficulty of the last day
            # as we try different starting points j for the last day
            max_difficulty = 0

            # Try all possible ending points j-1 for the first k days
            # Last day will be jobs j through i
            # j must be at least k (need at least k jobs for first k days)
            # and at most i (need at least 1 job for last day)
            for j in range(i, k-1, -1):
                # Update max difficulty for current last day (jobs j..i)
                max_difficulty = max(max_difficulty, jobDifficulty[j])

                # Total difficulty = difficulty of first k days (dp[j-1][k-1])
                # plus difficulty of last day (max_difficulty)
                if j > 0:
                    dp[i][k] = min(dp[i][k], dp[j-1][k-1] + max_difficulty)
                else:
                    # j == 0 means all jobs are in the last day
                    # This only happens when k == 0, which we handled above
                    pass

    # Answer: min difficulty for all n jobs in d days
    return dp[n-1][d-1]
```

```javascript
// Time: O(n^2 * d) | Space: O(n * d)
function minDifficulty(jobDifficulty, d) {
  const n = jobDifficulty.length;

  // If we have more days than jobs, it's impossible
  if (n < d) return -1;

  // dp[i][k]: min difficulty for first i+1 jobs in k+1 days
  const dp = Array(n)
    .fill()
    .map(() => Array(d).fill(Infinity));

  // Base case: 1 day (k = 0)
  let currentMax = 0;
  for (let i = 0; i < n; i++) {
    currentMax = Math.max(currentMax, jobDifficulty[i]);
    dp[i][0] = currentMax;
  }

  // Fill DP table for k = 1 to d-1 days
  for (let k = 1; k < d; k++) {
    // For k+1 days, we need at least k+1 jobs
    for (let i = k; i < n; i++) {
      // maxDifficulty tracks difficulty of the last day
      let maxDifficulty = 0;

      // Try all possible partitions
      // j is the start index of the last day
      for (let j = i; j >= k; j--) {
        // Update max difficulty for current last day (jobs j..i)
        maxDifficulty = Math.max(maxDifficulty, jobDifficulty[j]);

        // Total difficulty = first k days + last day
        dp[i][k] = Math.min(dp[i][k], dp[j - 1][k - 1] + maxDifficulty);
      }
    }
  }

  return dp[n - 1][d - 1];
}
```

```java
// Time: O(n^2 * d) | Space: O(n * d)
class Solution {
    public int minDifficulty(int[] jobDifficulty, int d) {
        int n = jobDifficulty.length;

        // If we have more days than jobs, it's impossible
        if (n < d) return -1;

        // dp[i][k]: min difficulty for first i+1 jobs in k+1 days
        int[][] dp = new int[n][d];

        // Initialize with large values
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < d; k++) {
                dp[i][k] = Integer.MAX_VALUE;
            }
        }

        // Base case: 1 day (k = 0)
        int currentMax = 0;
        for (int i = 0; i < n; i++) {
            currentMax = Math.max(currentMax, jobDifficulty[i]);
            dp[i][0] = currentMax;
        }

        // Fill DP table for k = 1 to d-1 days
        for (int k = 1; k < d; k++) {
            // For k+1 days, we need at least k+1 jobs
            for (int i = k; i < n; i++) {
                // maxDifficulty tracks difficulty of the last day
                int maxDifficulty = 0;

                // Try all possible partitions
                // j is the start index of the last day
                for (int j = i; j >= k; j--) {
                    // Update max difficulty for current last day (jobs j..i)
                    maxDifficulty = Math.max(maxDifficulty, jobDifficulty[j]);

                    // Total difficulty = first k days + last day
                    if (dp[j-1][k-1] != Integer.MAX_VALUE) {
                        dp[i][k] = Math.min(dp[i][k], dp[j-1][k-1] + maxDifficulty);
                    }
                }
            }
        }

        return dp[n-1][d-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × d)

- We have three nested loops:
  1. Outer loop over days: O(d)
  2. Middle loop over jobs: O(n)
  3. Inner loop trying partition points: O(n) in worst case
- This gives us O(n² × d) total operations.

**Space Complexity:** O(n × d)

- We store a DP table of size n × d.
- We could optimize to O(n) by only keeping the previous day's results, but the O(n × d) solution is usually acceptable given constraints.

## Common Mistakes

1. **Not handling the impossible case early:** Forgetting to check if `d > n` and return -1 immediately. This is specified in the problem and is an important edge case.

2. **Incorrect DP state initialization:** Using 0 instead of infinity for uncomputed states can lead to incorrect minimum calculations, since 0 might be smaller than the actual minimum.

3. **Off-by-one errors in indices:** The relationship between job indices and day counts is tricky. Remember:
   - `dp[i][k]` handles first `i+1` jobs in `k+1` days
   - When partitioning, ensure each day has at least one job
   - The inner loop should start `j` from `i` and go down to `k` (not `k-1`)

4. **Inefficient maximum calculation:** Recomputing `max(jobs[j..i])` from scratch for each `j` would make the solution O(n³ × d). The key optimization is updating the maximum as we move `j` leftward.

## When You'll See This Pattern

This partitioning DP pattern appears in several problems:

1. **Palindrome Partitioning II (LeetCode 132):** Similar structure of partitioning a string into palindromic substrings with minimum cuts.

2. **Split Array Largest Sum (LeetCode 410):** Partition array into m subarrays to minimize the largest sum among subarrays—very similar structure but minimizing maximum instead of sum.

3. **Minimum Cost to Cut a Stick (LeetCode 1547):** Another partitioning problem where you make cuts at specific points to minimize cost.

The common theme is: "Given a sequence, partition it into k segments optimizing some metric." The DP state typically tracks how much of the sequence we've processed and how many segments we've used.

## Key Takeaways

1. **Partitioning problems often use DP with state (position, segments):** When you need to split a sequence into k segments optimizing some metric, consider `dp[i][k]` = optimal value for first i elements in k segments.

2. **Track segment metrics efficiently:** When a segment's value depends on all elements in it (like maximum or sum), compute it incrementally as you expand the segment to avoid O(n) recomputation.

3. **Validate constraints early:** Always check for impossible cases (like more segments than elements) before starting DP computation.

[Practice this problem on CodeJeet](/problem/minimum-difficulty-of-a-job-schedule)
