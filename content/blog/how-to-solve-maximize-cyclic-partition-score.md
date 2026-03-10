---
title: "How to Solve Maximize Cyclic Partition Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Cyclic Partition Score. Hard difficulty, 12.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-09-29"
category: "dsa-patterns"
tags: ["maximize-cyclic-partition-score", "array", "dynamic-programming", "hard"]
---

# How to Solve Maximize Cyclic Partition Score

This problem asks us to partition a cyclic array into at most `k` subarrays to maximize the sum of each subarray's range (max-min difference). The cyclic nature means subarrays can wrap around from the end to the beginning, making this significantly more complex than standard array partitioning. What makes this problem particularly tricky is that we need to handle both the partitioning optimization and the circular array constraints simultaneously.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider `nums = [2, 5, 3, 8]` with `k = 2`.

Since the array is cyclic, we need to consider all possible starting points. Let's examine a few possibilities:

**Starting at index 0 (no wrap):**

- Partition 1: [2,5] → range = 5-2 = 3
- Partition 2: [3,8] → range = 8-3 = 5
- Total score = 3 + 5 = 8

**Starting at index 0 with wrap:**

- Partition 1: [2,5,3,8] (entire array) → range = 8-2 = 6
- Partition 2: empty (since k=2 but we used only 1 partition)
- Total score = 6

**Starting at index 1 with wrap:**

- Partition 1: [5,3] → range = 5-3 = 2
- Partition 2: [8,2] (wraps around) → range = 8-2 = 6
- Total score = 2 + 6 = 8

**Starting at index 2 with wrap:**

- Partition 1: [3,8,2] → range = 8-2 = 6
- Partition 2: [5] → range = 5-5 = 0
- Total score = 6

The maximum score we found is 8. But wait — we haven't considered all possibilities! What if we partition into 1 subarray starting at index 0? That gives us range = 6. Or what if we partition [2,5,3] and [8]? That gives us (5-2) + 0 = 3.

The key insight is that for each possible starting point in the cyclic array, we need to find the optimal partitioning of the linearized array (starting at that point). This suggests we need to solve the linear version of this problem for each possible starting point.

## Brute Force Approach

A naive approach would be:

1. For each possible starting point in the cyclic array (n possibilities)
2. For each possible way to partition the linearized array of length n into at most k subarrays
3. For each partition, compute the sum of ranges

The number of ways to partition n elements into at most k non-empty subarrays is given by Stirling numbers of the second kind, which grows exponentially. Even for moderate n and k, this becomes computationally infeasible.

Let's consider what the brute force code might look like:

<div class="code-group">

```python
# Brute force - too slow for any reasonable input
def maxScoreBruteForce(nums, k):
    n = len(nums)
    max_score = 0

    # Try every starting point
    for start in range(n):
        # Create linearized array starting at 'start'
        linear_nums = nums[start:] + nums[:start]

        # Try all possible partitions (exponential complexity)
        # This would involve recursive exploration of all cut points
        # For demonstration, we'll just show the structure
        def dfs(idx, partitions_used, current_score):
            nonlocal max_score
            if idx == n or partitions_used == k:
                max_score = max(max_score, current_score)
                return

            # Try making a subarray ending at each possible position
            for end in range(idx, n):
                subarray = linear_nums[idx:end+1]
                range_val = max(subarray) - min(subarray)
                dfs(end+1, partitions_used + 1, current_score + range_val)

        dfs(0, 0, 0)

    return max_score
```

```javascript
// Brute force - too slow for any reasonable input
function maxScoreBruteForce(nums, k) {
  const n = nums.length;
  let maxScore = 0;

  // Try every starting point
  for (let start = 0; start < n; start++) {
    // Create linearized array starting at 'start'
    const linearNums = [...nums.slice(start), ...nums.slice(0, start)];

    // Recursive function to try all partitions
    function dfs(idx, partitionsUsed, currentScore) {
      if (idx === n || partitionsUsed === k) {
        maxScore = Math.max(maxScore, currentScore);
        return;
      }

      // Try making a subarray ending at each possible position
      for (let end = idx; end < n; end++) {
        const subarray = linearNums.slice(idx, end + 1);
        const rangeVal = Math.max(...subarray) - Math.min(...subarray);
        dfs(end + 1, partitionsUsed + 1, currentScore + rangeVal);
      }
    }

    dfs(0, 0, 0);
  }

  return maxScore;
}
```

```java
// Brute force - too slow for any reasonable input
public int maxScoreBruteForce(int[] nums, int k) {
    int n = nums.length;
    int[] maxScore = new int[1];

    // Try every starting point
    for (int start = 0; start < n; start++) {
        // Create linearized array starting at 'start'
        int[] linearNums = new int[n];
        for (int i = 0; i < n; i++) {
            linearNums[i] = nums[(start + i) % n];
        }

        // Recursive function to try all partitions
        dfs(linearNums, k, 0, 0, 0, maxScore);
    }

    return maxScore[0];
}

private void dfs(int[] nums, int k, int idx, int partitionsUsed, int currentScore, int[] maxScore) {
    int n = nums.length;
    if (idx == n || partitionsUsed == k) {
        maxScore[0] = Math.max(maxScore[0], currentScore);
        return;
    }

    // Try making a subarray ending at each possible position
    for (int end = idx; end < n; end++) {
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (int i = idx; i <= end; i++) {
            min = Math.min(min, nums[i]);
            max = Math.max(max, nums[i]);
        }
        int rangeVal = max - min;
        dfs(nums, k, end + 1, partitionsUsed + 1, currentScore + rangeVal, maxScore);
    }
}
```

</div>

This brute force approach has exponential time complexity O(n! \* n) in the worst case, which is completely impractical for any reasonable input size.

## Optimized Approach

The key insight is that we can break this problem into two parts:

1. **Handle the cyclic nature**: For a cyclic array of length n, any subarray can be represented as a contiguous segment in the doubled array `nums + nums` (length 2n). This is a common trick for cyclic problems.

2. **Dynamic programming for partitioning**: Once we have a linear array (the doubled array), we can use dynamic programming to find the optimal partitioning. Let's define:
   - `dp[i][j]` = maximum score achievable using first i elements with exactly j partitions
   - We need to compute the range for each possible subarray efficiently

3. **Efficient range computation**: For each starting point, we need to quickly compute the range (max-min) of all possible subarrays. We can use:
   - Monotonic queues to maintain sliding window maximum and minimum
   - Precompute range values for all possible subarrays starting at each position

The optimal approach uses dynamic programming with precomputed range values. For each possible starting point in the original array, we consider the linearized array of length n (starting from that point). We then use DP where `dp[i][j]` represents the maximum score for the first i elements using j partitions.

The recurrence relation is:

```
dp[i][j] = max(dp[t][j-1] + range(t, i-1)) for all t < i
```

where `range(t, i-1)` is the range of the subarray from index t to i-1.

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^2 * k) | Space: O(n * k)
def maxScore(nums, k):
    n = len(nums)
    if n == 0 or k == 0:
        return 0

    # Double the array to handle cyclic nature
    doubled = nums + nums
    max_score = 0

    # Try each possible starting point in the original array
    for start in range(n):
        # Extract the linearized array of length n starting at 'start'
        linear = doubled[start:start + n]

        # Precompute range values for all subarrays
        # range_table[i][j] = range of subarray linear[i:j+1]
        range_table = [[0] * n for _ in range(n)]

        for i in range(n):
            # Track min and max for subarrays starting at i
            min_val = linear[i]
            max_val = linear[i]
            for j in range(i, n):
                min_val = min(min_val, linear[j])
                max_val = max(max_val, linear[j])
                range_table[i][j] = max_val - min_val

        # DP table: dp[i][j] = max score for first i elements using j partitions
        # i ranges from 0 to n, j ranges from 0 to k
        dp = [[0] * (k + 1) for _ in range(n + 1)]

        # Initialize DP table
        for j in range(1, k + 1):
            dp[0][j] = float('-inf')  # Cannot have partitions with 0 elements

        # Fill DP table
        for i in range(1, n + 1):
            for j in range(1, min(i, k) + 1):
                # Try all possible positions for the last partition
                for t in range(j - 1, i):
                    # Score = score up to t elements with j-1 partitions + range of last partition
                    score = dp[t][j - 1] + range_table[t][i - 1]
                    dp[i][j] = max(dp[i][j], score)

        # The answer for this starting point is max over all possible partition counts
        for j in range(1, k + 1):
            max_score = max(max_score, dp[n][j])

    return max_score
```

```javascript
// Time: O(n^2 * k) | Space: O(n * k)
function maxScore(nums, k) {
  const n = nums.length;
  if (n === 0 || k === 0) return 0;

  // Double the array to handle cyclic nature
  const doubled = [...nums, ...nums];
  let maxScore = 0;

  // Try each possible starting point in the original array
  for (let start = 0; start < n; start++) {
    // Extract the linearized array of length n starting at 'start'
    const linear = doubled.slice(start, start + n);

    // Precompute range values for all subarrays
    // rangeTable[i][j] = range of subarray linear[i] to linear[j]
    const rangeTable = Array(n)
      .fill()
      .map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      // Track min and max for subarrays starting at i
      let minVal = linear[i];
      let maxVal = linear[i];
      for (let j = i; j < n; j++) {
        minVal = Math.min(minVal, linear[j]);
        maxVal = Math.max(maxVal, linear[j]);
        rangeTable[i][j] = maxVal - minVal;
      }
    }

    // DP table: dp[i][j] = max score for first i elements using j partitions
    // i ranges from 0 to n, j ranges from 0 to k
    const dp = Array(n + 1)
      .fill()
      .map(() => Array(k + 1).fill(0));

    // Initialize DP table
    for (let j = 1; j <= k; j++) {
      dp[0][j] = -Infinity; // Cannot have partitions with 0 elements
    }

    // Fill DP table
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= Math.min(i, k); j++) {
        // Try all possible positions for the last partition
        for (let t = j - 1; t < i; t++) {
          // Score = score up to t elements with j-1 partitions + range of last partition
          const score = dp[t][j - 1] + rangeTable[t][i - 1];
          dp[i][j] = Math.max(dp[i][j], score);
        }
      }
    }

    // The answer for this starting point is max over all possible partition counts
    for (let j = 1; j <= k; j++) {
      maxScore = Math.max(maxScore, dp[n][j]);
    }
  }

  return maxScore;
}
```

```java
// Time: O(n^2 * k) | Space: O(n * k)
public int maxScore(int[] nums, int k) {
    int n = nums.length;
    if (n == 0 || k == 0) return 0;

    // Double the array to handle cyclic nature
    int[] doubled = new int[2 * n];
    for (int i = 0; i < n; i++) {
        doubled[i] = nums[i];
        doubled[i + n] = nums[i];
    }

    int maxScore = 0;

    // Try each possible starting point in the original array
    for (int start = 0; start < n; start++) {
        // Extract the linearized array of length n starting at 'start'
        int[] linear = new int[n];
        for (int i = 0; i < n; i++) {
            linear[i] = doubled[start + i];
        }

        // Precompute range values for all subarrays
        // rangeTable[i][j] = range of subarray linear[i] to linear[j]
        int[][] rangeTable = new int[n][n];

        for (int i = 0; i < n; i++) {
            // Track min and max for subarrays starting at i
            int minVal = linear[i];
            int maxVal = linear[i];
            for (int j = i; j < n; j++) {
                minVal = Math.min(minVal, linear[j]);
                maxVal = Math.max(maxVal, linear[j]);
                rangeTable[i][j] = maxVal - minVal;
            }
        }

        // DP table: dp[i][j] = max score for first i elements using j partitions
        // i ranges from 0 to n, j ranges from 0 to k
        int[][] dp = new int[n + 1][k + 1];

        // Initialize DP table
        for (int j = 1; j <= k; j++) {
            dp[0][j] = Integer.MIN_VALUE;  // Cannot have partitions with 0 elements
        }

        // Fill DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= Math.min(i, k); j++) {
                // Try all possible positions for the last partition
                for (int t = j - 1; t < i; t++) {
                    // Score = score up to t elements with j-1 partitions + range of last partition
                    int score = dp[t][j - 1] + rangeTable[t][i - 1];
                    dp[i][j] = Math.max(dp[i][j], score);
                }
            }
        }

        // The answer for this starting point is max over all possible partition counts
        for (int j = 1; j <= k; j++) {
            maxScore = Math.max(maxScore, dp[n][j]);
        }
    }

    return maxScore;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n³ \* k) in the worst case, but let's break it down:

- We try n starting points
- For each starting point, we precompute ranges in O(n²)
- For each starting point, we run DP which takes O(n² \* k)
- Total: O(n _ (n² + n² _ k)) = O(n³ \* k)

**Space Complexity**: O(n * k) for the DP table plus O(n²) for the range table, which simplifies to O(n²) since n² dominates n*k for large n.

In practice, we can optimize further by using monotonic queues to compute ranges in O(n) per starting point, bringing the total to O(n² _ k). However, the O(n³ _ k) solution is often acceptable for interview settings where n ≤ 100.

## Common Mistakes

1. **Forgetting the "at most k" condition**: The problem says "at most k" partitions, not exactly k. Candidates often initialize DP with negative infinity for all states except dp[0][0], forgetting that using fewer than k partitions is allowed.

2. **Incorrect handling of cyclic arrays**: A common mistake is to only consider partitions that don't wrap around, or to handle wrapping incorrectly. The doubled array technique is crucial here.

3. **Inefficient range computation**: Computing min and max for each subarray from scratch leads to O(n³) complexity. Precomputing ranges or using sliding window with monotonic queues is essential.

4. **Off-by-one errors in DP indices**: The relationship between dp indices and array indices is tricky. Remember that dp[i][j] refers to the first i elements (indices 0 to i-1 in the array).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Cyclic array handling via doubling**: Used in problems like:
   - **LeetCode 918: Maximum Sum Circular Subarray** - Find maximum subarray sum in circular array
   - **LeetCode 2134: Minimum Swaps to Group All 1's Together II** - Circular binary array problems

2. **DP for partitioning optimization**: Used in problems like:
   - **LeetCode 1043: Partition Array for Maximum Sum** - Partition array to maximize sum after transformation
   - **LeetCode 1278: Palindrome Partitioning III** - Partition string into k palindromes with minimal changes

## Key Takeaways

1. **For cyclic arrays, consider the doubled array technique**: Creating `nums + nums` allows you to convert cyclic problems into linear ones, making them easier to reason about.

2. **Partitioning optimization often involves DP with state (position, partitions used)**: The recurrence `dp[i][j] = max(dp[t][j-1] + cost(t, i-1))` is a common pattern for partition problems.

3. **Precompute expensive operations**: When you need to repeatedly compute something like subarray range, precomputing it can save significant time even if it uses extra space.

[Practice this problem on CodeJeet](/problem/maximize-cyclic-partition-score)
