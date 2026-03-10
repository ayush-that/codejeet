---
title: "How to Solve Partition Array for Maximum Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array for Maximum Sum. Medium difficulty, 77.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-04-12"
category: "dsa-patterns"
tags: ["partition-array-for-maximum-sum", "array", "dynamic-programming", "medium"]
---

# How to Solve Partition Array for Maximum Sum

This problem asks us to partition an array into contiguous subarrays of length at most `k`, then replace each subarray's values with its maximum value, and finally maximize the sum of the resulting array. What makes this tricky is that we need to find the optimal partitioning strategy—where to cut the array—to maximize the final sum. The decision at each position affects future possibilities, which screams dynamic programming.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [1, 15, 7, 9, 2, 5, 10]` with `k = 3`.

We want to partition into subarrays of length ≤ 3. For each subarray, we'll replace all elements with the maximum value in that subarray.

**Step-by-step reasoning:**

- Starting from the end and working backwards is natural for DP
- For position `i`, we consider all possible subarrays starting at `i` with lengths 1 through `k`
- For each length `j`, the contribution is: `(max value in arr[i:i+j]) * j + best_result[i+j]`

Let's build the DP array `dp` where `dp[i]` = maximum sum we can get from `arr[i:]`

1. `i = 6` (last element, value 10): Only one option - take [10], sum = 10
2. `i = 5` (value 5): Options:
   - Take [5] alone: 5 + dp[6] = 5 + 10 = 15
   - Take [5, 10] (length 2): max(5,10)=10, so 10×2=20
     Best: 20
3. `i = 4` (value 2): Options:
   - [2] alone: 2 + dp[5] = 2 + 20 = 22
   - [2, 5]: max(2,5)=5, so 5×2=10 + dp[6]=10+10=20
   - [2, 5, 10]: max(2,5,10)=10, so 10×3=30
     Best: 30
4. Continue backwards... final answer is `dp[0] = 84`

The optimal partition is: [1, 15, 7] (max=15 → sum=45) + [9] (sum=9) + [2, 5, 10] (max=10 → sum=30) = 84

## Brute Force Approach

A naive approach would try all possible partitionings. For each position, we could choose to end the current subarray at any of the next `k-1` positions or continue. This creates an exponential number of possibilities.

The brute force would use recursion with memoization:

- At position `i`, try all subarray lengths from 1 to `k` (but not exceeding array bounds)
- For each length `j`, compute the max in `arr[i:i+j]`, multiply by `j`, and add the result from `i+j`
- Take the maximum over all choices

While this approach is correct, it would be O(n × k²) if we compute the max naively for each subarray, or O(n × k) with memoization but still exponential in the recursion tree without DP memoization.

The key inefficiency is recomputing the maximum for overlapping subarrays repeatedly. For example, when checking lengths 1, 2, and 3 at position `i`, we keep recomputing `max(arr[i:i+1])`, `max(arr[i:i+2])`, `max(arr[i:i+3])` from scratch.

## Optimized Approach

The optimal solution uses dynamic programming with a clever observation: we can compute the maximum value for expanding subarrays efficiently as we iterate.

**Key Insight:**

- Let `dp[i]` be the maximum sum we can obtain starting from position `i`
- For each `i` from right to left, we consider all possible subarrays starting at `i` with lengths 1 through `k`
- As we extend the subarray length, we can track the current maximum value in O(1) time
- The recurrence relation: `dp[i] = max(max_val * length + dp[i+length])` for all valid lengths

**Why this works:**

1. Working backwards lets us use previously computed results (optimal substructure)
2. By tracking the current max as we extend the subarray, we avoid O(k) max computations
3. Each position considers at most `k` options, giving us O(nk) time complexity

**Step-by-step reasoning:**

1. Initialize `dp` array of size `n+1` with `dp[n] = 0` (base case: empty array has sum 0)
2. Iterate `i` from `n-1` down to 0
3. For each `i`, initialize `max_val = -∞` and iterate `j` from 0 to `k-1` (where `i+j < n`)
4. Update `max_val = max(max_val, arr[i+j])` as we extend the subarray
5. Calculate candidate sum: `max_val * (j+1) + dp[i+j+1]`
6. Update `dp[i] = max(dp[i], candidate)`
7. Finally, `dp[0]` contains our answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k) | Space: O(n)
def maxSumAfterPartitioning(arr, k):
    """
    Partition array into subarrays of length at most k,
    replace each subarray with its maximum value,
    and return the maximum possible sum.
    """
    n = len(arr)
    # dp[i] = maximum sum we can get from arr[i:]
    dp = [0] * (n + 1)  # Extra slot for base case

    # Process from right to left
    for i in range(n - 1, -1, -1):
        max_val = 0  # Track max value in current subarray
        best_sum = 0  # Best sum starting at position i

        # Try all possible subarray lengths starting at i
        # Length can be 1 to k, but don't exceed array bounds
        for j in range(k):
            # Check if we're still within array bounds
            if i + j >= n:
                break

            # Update max value in current subarray
            max_val = max(max_val, arr[i + j])

            # Current subarray length is j+1
            length = j + 1

            # Candidate sum = (max_val * length) + best result from rest of array
            candidate = max_val * length + dp[i + j + 1]

            # Take the maximum over all possible lengths
            best_sum = max(best_sum, candidate)

        # Store the best result for starting at position i
        dp[i] = best_sum

    # Answer is the best sum starting at position 0
    return dp[0]
```

```javascript
// Time: O(n * k) | Space: O(n)
function maxSumAfterPartitioning(arr, k) {
  const n = arr.length;
  // dp[i] = maximum sum we can get from arr[i:]
  const dp = new Array(n + 1).fill(0); // Extra slot for base case

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    let maxVal = 0; // Track max value in current subarray
    let bestSum = 0; // Best sum starting at position i

    // Try all possible subarray lengths starting at i
    // Length can be 1 to k, but don't exceed array bounds
    for (let j = 0; j < k; j++) {
      // Check if we're still within array bounds
      if (i + j >= n) break;

      // Update max value in current subarray
      maxVal = Math.max(maxVal, arr[i + j]);

      // Current subarray length is j+1
      const length = j + 1;

      // Candidate sum = (maxVal * length) + best result from rest of array
      const candidate = maxVal * length + dp[i + j + 1];

      // Take the maximum over all possible lengths
      bestSum = Math.max(bestSum, candidate);
    }

    // Store the best result for starting at position i
    dp[i] = bestSum;
  }

  // Answer is the best sum starting at position 0
  return dp[0];
}
```

```java
// Time: O(n * k) | Space: O(n)
class Solution {
    public int maxSumAfterPartitioning(int[] arr, int k) {
        int n = arr.length;
        // dp[i] = maximum sum we can get from arr[i:]
        int[] dp = new int[n + 1]; // Extra slot for base case

        // Process from right to left
        for (int i = n - 1; i >= 0; i--) {
            int maxVal = 0; // Track max value in current subarray
            int bestSum = 0; // Best sum starting at position i

            // Try all possible subarray lengths starting at i
            // Length can be 1 to k, but don't exceed array bounds
            for (int j = 0; j < k; j++) {
                // Check if we're still within array bounds
                if (i + j >= n) break;

                // Update max value in current subarray
                maxVal = Math.max(maxVal, arr[i + j]);

                // Current subarray length is j+1
                int length = j + 1;

                // Candidate sum = (maxVal * length) + best result from rest of array
                int candidate = maxVal * length + dp[i + j + 1];

                // Take the maximum over all possible lengths
                bestSum = Math.max(bestSum, candidate);
            }

            // Store the best result for starting at position i
            dp[i] = bestSum;
        }

        // Answer is the best sum starting at position 0
        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- We have `n` positions to process
- For each position, we consider up to `k` possible subarray lengths
- Within each inner loop iteration, we do O(1) work (max update and arithmetic)
- Total: O(n × k)

**Space Complexity:** O(n)

- We store a DP array of size `n+1`
- No other significant data structures
- Could be optimized to O(k) by only storing the last `k` results, but O(n) is simpler and usually acceptable

## Common Mistakes

1. **Wrong iteration direction:** Some candidates try to iterate left-to-right, which makes it harder to use previously computed results. The key insight is that when we're at position `i`, we need to know the optimal result for the suffix starting at `i+j+1`. Working backwards naturally provides this.

2. **Forgetting array bounds check:** When `i + j >= n`, we must break out of the inner loop. Otherwise, we'll access out-of-bounds array elements. This happens near the end of the array where we can't take a full length-`k` subarray.

3. **Off-by-one errors in indices:** The subarray length is `j+1`, not `j`. Also, `dp[i+j+1]` refers to the result starting _after_ the current subarray ends. Using `dp[i+j]` would incorrectly include the current subarray's elements twice.

4. **Not tracking max efficiently:** Some candidates recompute the maximum for each subarray from scratch using `max(arr[i:i+j])`, which adds an extra O(k) factor. The efficient approach updates `max_val` incrementally as we extend the subarray.

## When You'll See This Pattern

This problem uses a classic DP pattern for partitioning problems: "best result from this point onward" with backward iteration. You'll see similar patterns in:

1. **Word Break (LeetCode 139):** Determine if a string can be segmented into dictionary words. Similar backward DP where `dp[i]` depends on `dp[i+len(word)]`.

2. **Decode Ways (LeetCode 91):** Count ways to decode a numeric string. `dp[i]` depends on `dp[i+1]` (single digit) and `dp[i+2]` (two digits).

3. **Minimum Cost to Cut a Stick (LeetCode 1547):** Find minimum cutting cost where `dp[i][j]` depends on results for smaller intervals.

The common theme is breaking a problem into subproblems where the solution for a position depends on solutions for positions further along in the sequence.

## Key Takeaways

1. **Backward DP for partitioning:** When you need to partition an array/string and the decision affects future segments, backward iteration often provides the cleanest recurrence relation. `dp[i]` represents the best result starting from position `i`.

2. **Track incremental information:** When considering expanding windows (like subarrays of increasing length), track information like maximum value incrementally rather than recomputing from scratch each time.

3. **Boundary conditions matter:** Always check array bounds when dealing with variable-length windows, especially near the edges of the array. The `dp` array needs an extra slot for the base case (empty suffix).

Related problems: [Subsequence of Size K With the Largest Even Sum](/problem/subsequence-of-size-k-with-the-largest-even-sum), [Partition String Into Minimum Beautiful Substrings](/problem/partition-string-into-minimum-beautiful-substrings), [Minimum Substring Partition of Equal Character Frequency](/problem/minimum-substring-partition-of-equal-character-frequency)
