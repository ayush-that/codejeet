---
title: "How to Solve Minimum Cost to Split an Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Split an Array. Hard difficulty, 44.1% acceptance rate. Topics: Array, Hash Table, Dynamic Programming, Counting."
date: "2030-02-02"
category: "dsa-patterns"
tags: ["minimum-cost-to-split-an-array", "array", "hash-table", "dynamic-programming", "hard"]
---

# How to Solve Minimum Cost to Split an Array

This problem asks us to split an array into subarrays where the cost of each subarray is calculated by trimming numbers that appear only once, then summing the remaining elements. The challenge lies in efficiently computing these trimmed sums while determining the optimal split points—a classic dynamic programming problem made tricky by the need to track frequency counts across variable subarray boundaries.

**What makes this interesting:** The cost function isn't a simple sum or maximum; it requires maintaining frequency counts to identify which elements appear more than once. This creates a two-dimensional optimization: we need to find both the optimal split points and efficiently compute the trimmed sum for any potential subarray.

## Visual Walkthrough

Let's trace through a small example: `nums = [1,2,1,2,1,3,1]` with `k = 3`

We want to split into at most 3 subarrays (but can use fewer if cheaper). The trimmed sum for a subarray counts only elements that appear at least twice in that subarray.

Consider potential splits:

- **No split** (one subarray): `[1,2,1,2,1,3,1]`
  - Counts: 1 appears 4×, 2 appears 2×, 3 appears 1×
  - Trimmed sum = 1×4 + 2×2 = 4 + 4 = 8
  - Total cost = 8

- **Split after index 2**: `[1,2,1]` and `[2,1,3,1]`
  - First subarray: 1 appears 2×, 2 appears 1× → trimmed sum = 1×2 = 2
  - Second subarray: 1 appears 2×, 2 appears 1×, 3 appears 1× → trimmed sum = 1×2 = 2
  - Total cost = 2 + 2 = 4

- **Split after index 3**: `[1,2,1,2]` and `[1,3,1]`
  - First: 1 appears 2×, 2 appears 2× → trimmed sum = 1×2 + 2×2 = 6
  - Second: 1 appears 2×, 3 appears 1× → trimmed sum = 1×2 = 2
  - Total cost = 6 + 2 = 8

The optimal cost is 4 with one split. Notice how we need to consider all possible split positions and compute trimmed sums efficiently. The brute force approach would try every combination of split points, which becomes exponentially slow.

## Brute Force Approach

A naive solution would try all possible ways to split the array into at most `k` subarrays. For each potential split configuration, we'd need to:

1. Compute the trimmed sum for each subarray by counting frequencies
2. Sum these costs
3. Track the minimum overall cost

The number of ways to split an array of length `n` into `m` subarrays is given by combinations: `C(n-1, m-1)` ways to choose split points. Since we need to consider all `m` from 1 to `k`, the total number of configurations grows exponentially with `n`.

**Why this fails:** For `n = 100` and `k = 100`, we'd have approximately `2^(n-1)` possible splits to consider—around `1.27 × 10^30` operations! Even with efficient trimmed sum computation, this is computationally impossible.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with overlapping subproblems. We can define:

`dp[i][j]` = minimum cost to split the first `i` elements (nums[0..i-1]) into `j` subarrays

**Transition:** To compute `dp[i][j]`, we consider all possible last subarrays ending at position `i-1`. If the last subarray starts at position `m`, then:

- The cost of that last subarray is `trimmed(nums[m..i-1])`
- The remaining cost is `dp[m][j-1]` (minimum cost to split first `m` elements into `j-1` subarrays)

So: `dp[i][j] = min over all m < i of (dp[m][j-1] + trimmed(nums[m..i-1]))`

**Base cases:**

- `dp[0][0] = 0` (no elements, no subarrays, zero cost)
- `dp[i][0] = INF` for `i > 0` (can't have elements with zero subarrays)
- `dp[0][j] = INF` for `j > 0` (can't have subarrays with zero elements)

**Final answer:** `min over j=1..k of dp[n][j]` (we can use fewer than k subarrays if cheaper)

**Optimizing trimmed sum computation:** Instead of recomputing `trimmed(nums[m..i-1])` for every `m`, we can compute it incrementally as we expand the subarray from the right. As we move `m` leftward, we maintain:

- A frequency count of elements in the current subarray
- A running sum of elements that appear at least twice

When we add a new element `nums[m]` to the subarray:

- If its count becomes 2, we add `2 * nums[m]` to the trimmed sum (it just became "countable")
- If its count becomes 3 or more, we add `nums[m]` to the trimmed sum (additional occurrence)
- If its count was 1 and becomes 2, we don't need to subtract anything since it wasn't counted before

This gives us O(1) updates to the trimmed sum as we expand the subarray leftward.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 * k) | Space: O(n * k)
def minCost(nums, k):
    n = len(nums)

    # dp[i][j] = min cost to split first i elements into j subarrays
    # Initialize with infinity
    dp = [[float('inf')] * (k + 1) for _ in range(n + 1)]
    dp[0][0] = 0  # Base case: 0 elements, 0 subarrays = 0 cost

    # For each ending position i
    for i in range(1, n + 1):
        # For each possible number of subarrays j (up to min(i, k))
        for j in range(1, min(i, k) + 1):
            # We'll compute trimmed sum as we expand subarray leftward
            freq = {}
            trimmed_sum = 0

            # Try all possible starting positions m for the last subarray
            # The subarray is nums[m..i-1] (inclusive)
            for m in range(i - 1, -1, -1):
                # Update frequency and trimmed sum for element nums[m]
                num = nums[m]
                if num in freq:
                    freq[num] += 1
                    if freq[num] == 2:
                        # First time it appears twice - add 2 * num
                        trimmed_sum += 2 * num
                    else:
                        # Already counted before - just add num
                        trimmed_sum += num
                else:
                    freq[num] = 1

                # Transition: dp[i][j] = min(dp[m][j-1] + trimmed_sum)
                if m >= j - 1:  # Need at least j-1 elements for j-1 subarrays
                    dp[i][j] = min(dp[i][j], dp[m][j - 1] + trimmed_sum)

    # Answer is min cost using 1 to k subarrays
    return min(dp[n][1:k + 1])
```

```javascript
// Time: O(n^2 * k) | Space: O(n * k)
function minCost(nums, k) {
  const n = nums.length;

  // dp[i][j] = min cost to split first i elements into j subarrays
  // Initialize with Infinity
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(k + 1).fill(Infinity));
  dp[0][0] = 0; // Base case: 0 elements, 0 subarrays = 0 cost

  // For each ending position i
  for (let i = 1; i <= n; i++) {
    // For each possible number of subarrays j (up to min(i, k))
    for (let j = 1; j <= Math.min(i, k); j++) {
      // We'll compute trimmed sum as we expand subarray leftward
      const freq = new Map();
      let trimmedSum = 0;

      // Try all possible starting positions m for the last subarray
      // The subarray is nums[m..i-1] (inclusive)
      for (let m = i - 1; m >= 0; m--) {
        // Update frequency and trimmed sum for element nums[m]
        const num = nums[m];
        const count = freq.get(num) || 0;

        if (count > 0) {
          freq.set(num, count + 1);
          if (count === 1) {
            // First time it appears twice - add 2 * num
            trimmedSum += 2 * num;
          } else {
            // Already counted before - just add num
            trimmedSum += num;
          }
        } else {
          freq.set(num, 1);
        }

        // Transition: dp[i][j] = min(dp[m][j-1] + trimmedSum)
        if (m >= j - 1) {
          // Need at least j-1 elements for j-1 subarrays
          dp[i][j] = Math.min(dp[i][j], dp[m][j - 1] + trimmedSum);
        }
      }
    }
  }

  // Answer is min cost using 1 to k subarrays
  let result = Infinity;
  for (let j = 1; j <= k; j++) {
    result = Math.min(result, dp[n][j]);
  }
  return result;
}
```

```java
// Time: O(n^2 * k) | Space: O(n * k)
class Solution {
    public int minCost(int[] nums, int k) {
        int n = nums.length;

        // dp[i][j] = min cost to split first i elements into j subarrays
        // Initialize with large value (effectively infinity)
        int[][] dp = new int[n + 1][k + 1];
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], Integer.MAX_VALUE / 2);  // Avoid overflow
        }
        dp[0][0] = 0;  // Base case: 0 elements, 0 subarrays = 0 cost

        // For each ending position i
        for (int i = 1; i <= n; i++) {
            // For each possible number of subarrays j (up to min(i, k))
            for (int j = 1; j <= Math.min(i, k); j++) {
                // We'll compute trimmed sum as we expand subarray leftward
                Map<Integer, Integer> freq = new HashMap<>();
                int trimmedSum = 0;

                // Try all possible starting positions m for the last subarray
                // The subarray is nums[m..i-1] (inclusive)
                for (int m = i - 1; m >= 0; m--) {
                    // Update frequency and trimmed sum for element nums[m]
                    int num = nums[m];
                    int count = freq.getOrDefault(num, 0);

                    if (count > 0) {
                        freq.put(num, count + 1);
                        if (count == 1) {
                            // First time it appears twice - add 2 * num
                            trimmedSum += 2 * num;
                        } else {
                            // Already counted before - just add num
                            trimmedSum += num;
                        }
                    } else {
                        freq.put(num, 1);
                    }

                    // Transition: dp[i][j] = min(dp[m][j-1] + trimmedSum)
                    if (m >= j - 1) {  // Need at least j-1 elements for j-1 subarrays
                        dp[i][j] = Math.min(dp[i][j], dp[m][j - 1] + trimmedSum);
                    }
                }
            }
        }

        // Answer is min cost using 1 to k subarrays
        int result = Integer.MAX_VALUE;
        for (int j = 1; j <= k; j++) {
            result = Math.min(result, dp[n][j]);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × k)

- We have three nested loops:
  1. Outer loop over ending positions `i`: O(n)
  2. Middle loop over number of subarrays `j`: O(min(i, k)) ≈ O(k) in worst case
  3. Inner loop over starting positions `m`: O(i) ≈ O(n) in worst case
- Total: O(n × k × n) = O(n² × k)

**Space Complexity:** O(n × k)

- The DP table has dimensions (n+1) × (k+1)
- Additional O(n) space for frequency map in inner loop (dominated by DP table)

**Why this is acceptable:** Constraints typically have n ≤ 1000 and k ≤ 1000, making n² × k potentially 10⁹ operations. However, the inner loop over `m` has an early stopping condition (`m >= j-1`), and in practice, many states are unreachable. The solution usually passes within time limits for typical constraints.

## Common Mistakes

1. **Forgetting that k is a maximum, not a requirement:** Candidates often assume they must use exactly k subarrays. The problem allows using fewer than k subarrays if it gives lower cost. Always take the minimum over all j ≤ k.

2. **Incorrect trimmed sum calculation:** The trimmed sum only includes elements that appear at least twice. A common error is to include elements on their first appearance or to incorrectly handle the transition from count=1 to count=2. Remember: when count becomes 2, add `2 × value`; for count > 2, add `value`.

3. **Off-by-one errors in DP indices:** DP indices represent counts of elements, not array indices. `dp[i][j]` handles the first `i` elements (nums[0..i-1]). When accessing `nums[m]`, remember `m` is a 0-based index, while `dp` uses 1-based element counts.

4. **Not initializing DP table properly:** For problems with minimization, initialize with a large value (like infinity) except for the base case `dp[0][0] = 0`. Also ensure `dp[i][0]` and `dp[0][j]` (for i,j > 0) remain at infinity since they're impossible states.

## When You'll See This Pattern

This problem combines **dynamic programming for partitioning** with **sliding window frequency counting**. You'll see similar patterns in:

1. **Split Array Largest Sum (Hard)** - Also partitions an array into k subarrays, but minimizes the maximum subarray sum rather than a trimmed sum. The DP structure is identical; only the cost function changes.

2. **Palindrome Partitioning II (Hard)** - Partitions a string into palindromic substrings. Similar DP structure where you try all possible last substrings.

3. **Minimum Difficulty of a Job Schedule (Hard)** - Schedules jobs over days to minimize maximum daily difficulty. Again, partitions an array with a different cost metric.

The core pattern is: when you need to partition an array into k segments optimizing some cost function that depends only on the elements within each segment, consider DP where `dp[i][j]` represents the optimal cost for the first i elements partitioned into j segments.

## Key Takeaways

1. **Partitioning problems often use DP with state `dp[i][j]`** representing the first i elements split into j segments. The transition tries all possible last segments.

2. **When cost depends on element frequencies**, maintain counts incrementally as you expand the segment to avoid O(n) recomputation each time. This turns O(n³) into O(n²) for the inner loop.

3. **k is often an upper bound, not a requirement** in partitioning problems. Always check if you can use fewer partitions than allowed—the answer is usually `min(dp[n][j])` for j ≤ k.

Related problems: [Coin Change](/problem/coin-change), [Split Array Largest Sum](/problem/split-array-largest-sum), [Divide an Array Into Subarrays With Minimum Cost II](/problem/divide-an-array-into-subarrays-with-minimum-cost-ii)
