---
title: "How to Solve Longest Unequal Adjacent Groups Subsequence II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Unequal Adjacent Groups Subsequence II. Medium difficulty, 51.5% acceptance rate. Topics: Array, String, Dynamic Programming."
date: "2027-10-17"
category: "dsa-patterns"
tags:
  [
    "longest-unequal-adjacent-groups-subsequence-ii",
    "array",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Longest Unequal Adjacent Groups Subsequence II

This problem asks us to find the longest subsequence of indices where adjacent elements have different group values, and where the strings at those indices have a Hamming distance greater than 1. The challenge lies in satisfying both constraints simultaneously while maximizing subsequence length. What makes this problem interesting is that it combines subsequence selection with both numerical and string-based constraints, requiring careful state tracking.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
words = ["abc", "def", "abc", "xyz", "abc"]
groups = [1, 2, 1, 2, 1]
```

We need to find the longest subsequence of indices where:

1. `groups[i] != groups[i+1]` for adjacent indices in the subsequence
2. Hamming distance between `words[i]` and `words[i+1]` > 1 (strings must have equal length)

**Step-by-step reasoning:**

- Start with index 0: `words[0]="abc"`, `groups[0]=1`
- Check index 1: `groups[1]=2` (different from 1 ✓), Hamming distance between "abc" and "def" = 3 (>1 ✓) → can include
- Check index 2: `groups[2]=1` (different from 2 ✓), Hamming distance between "def" and "abc" = 3 (>1 ✓) → can include
- Check index 3: `groups[3]=2` (different from 1 ✓), Hamming distance between "abc" and "xyz" = 3 (>1 ✓) → can include
- Check index 4: `groups[4]=1` (different from 2 ✓), Hamming distance between "xyz" and "abc" = 3 (>1 ✓) → can include

One valid subsequence: `[0, 1, 2, 3, 4]` (length 5)

But what if we had a different example where Hamming distance constraints matter more?

**Example 2:**

```
words = ["aaa", "aab", "abb", "bbb"]
groups = [1, 2, 1, 2]
```

- Index 0 to 1: groups differ (1≠2 ✓), Hamming("aaa","aab")=1 (≤1 ✗) → cannot include consecutively
- We need to skip some indices to maintain both constraints

This shows we need a systematic way to track the longest valid subsequence ending at each position.

## Brute Force Approach

The brute force approach would consider all 2^n possible subsequences and check if each one satisfies the constraints. For each subsequence, we would:

1. Verify that adjacent elements have different group values
2. Verify that adjacent strings have Hamming distance > 1
3. Track the longest valid subsequence found

**Why this fails:**

- With n up to 1000, 2^1000 is astronomically large
- Even for n=20, 2^20 = 1,048,576 operations is too slow
- We need a polynomial-time solution

A naive candidate might try greedy selection (always take the next valid element), but this can fail because skipping an element might allow for a longer subsequence later.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem similar to the "Longest Increasing Subsequence" pattern, but with custom constraints.

**Optimal substructure:** The longest valid subsequence ending at index `i` depends on the longest valid subsequences ending at previous indices `j < i` that can legally precede `i`.

**State definition:** Let `dp[i]` = length of longest valid subsequence ending at index `i`.

**Transition:** For each `i`, check all `j < i`:

- If `groups[i] != groups[j]` AND Hamming distance between `words[i]` and `words[j]` > 1
- Then `dp[i] = max(dp[i], dp[j] + 1)`

**Base case:** `dp[i] = 1` for all `i` (a subsequence containing only itself)

**Reconstruction:** To reconstruct the actual subsequence, we also need to track the predecessor for each index.

**Optimization:** We can optimize by noting that we only need to check previous indices where the group differs from the current group, but we still need to compute Hamming distances.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n^2 * L) where L is string length | Space: O(n)
def getLongestSubsequence(words, groups):
    """
    Find the longest subsequence where adjacent elements have:
    1. Different group values
    2. Hamming distance > 1 between their strings
    """
    n = len(words)

    # dp[i] = length of longest valid subsequence ending at index i
    dp = [1] * n

    # prev[i] = previous index in the optimal subsequence ending at i
    # -1 means no predecessor (start of subsequence)
    prev = [-1] * n

    # Helper function to compute Hamming distance between two strings
    def hamming_dist(s1, s2):
        """Compute Hamming distance between two equal-length strings"""
        # Strings are guaranteed to have same length in this problem
        return sum(1 for c1, c2 in zip(s1, s2) if c1 != c2)

    # Dynamic programming: for each position i, check all previous positions j
    for i in range(n):
        for j in range(i):
            # Check if we can extend subsequence ending at j with i
            # Condition 1: groups must differ
            if groups[i] == groups[j]:
                continue

            # Condition 2: Hamming distance must be > 1
            if hamming_dist(words[i], words[j]) <= 1:
                continue

            # If extending from j gives a longer subsequence, update
            if dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j

    # Find the index with maximum subsequence length
    max_len = 0
    end_idx = 0
    for i in range(n):
        if dp[i] > max_len:
            max_len = dp[i]
            end_idx = i

    # Reconstruct the subsequence by following prev pointers
    result = []
    curr = end_idx
    while curr != -1:
        result.append(curr)
        curr = prev[curr]

    # Reverse to get indices in increasing order
    return result[::-1]
```

```javascript
// Time: O(n^2 * L) where L is string length | Space: O(n)
function getLongestSubsequence(words, groups) {
  /**
   * Find the longest subsequence where adjacent elements have:
   * 1. Different group values
   * 2. Hamming distance > 1 between their strings
   */
  const n = words.length;

  // dp[i] = length of longest valid subsequence ending at index i
  const dp = new Array(n).fill(1);

  // prev[i] = previous index in the optimal subsequence ending at i
  // -1 means no predecessor (start of subsequence)
  const prev = new Array(n).fill(-1);

  // Helper function to compute Hamming distance between two strings
  function hammingDist(s1, s2) {
    // Strings are guaranteed to have same length in this problem
    let distance = 0;
    for (let i = 0; i < s1.length; i++) {
      if (s1[i] !== s2[i]) {
        distance++;
      }
    }
    return distance;
  }

  // Dynamic programming: for each position i, check all previous positions j
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // Check if we can extend subsequence ending at j with i
      // Condition 1: groups must differ
      if (groups[i] === groups[j]) {
        continue;
      }

      // Condition 2: Hamming distance must be > 1
      if (hammingDist(words[i], words[j]) <= 1) {
        continue;
      }

      // If extending from j gives a longer subsequence, update
      if (dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
  }

  // Find the index with maximum subsequence length
  let maxLen = 0;
  let endIdx = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      endIdx = i;
    }
  }

  // Reconstruct the subsequence by following prev pointers
  const result = [];
  let curr = endIdx;
  while (curr !== -1) {
    result.push(curr);
    curr = prev[curr];
  }

  // Reverse to get indices in increasing order
  return result.reverse();
}
```

```java
// Time: O(n^2 * L) where L is string length | Space: O(n)
import java.util.*;

public class Solution {
    public List<Integer> getLongestSubsequence(String[] words, int[] groups) {
        /**
         * Find the longest subsequence where adjacent elements have:
         * 1. Different group values
         * 2. Hamming distance > 1 between their strings
         */
        int n = words.length;

        // dp[i] = length of longest valid subsequence ending at index i
        int[] dp = new int[n];
        Arrays.fill(dp, 1);

        // prev[i] = previous index in the optimal subsequence ending at i
        // -1 means no predecessor (start of subsequence)
        int[] prev = new int[n];
        Arrays.fill(prev, -1);

        // Helper function to compute Hamming distance between two strings
        // (defined inline since Java doesn't support nested functions easily)

        // Dynamic programming: for each position i, check all previous positions j
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                // Check if we can extend subsequence ending at j with i
                // Condition 1: groups must differ
                if (groups[i] == groups[j]) {
                    continue;
                }

                // Condition 2: Hamming distance must be > 1
                if (hammingDistance(words[i], words[j]) <= 1) {
                    continue;
                }

                // If extending from j gives a longer subsequence, update
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                }
            }
        }

        // Find the index with maximum subsequence length
        int maxLen = 0;
        int endIdx = 0;
        for (int i = 0; i < n; i++) {
            if (dp[i] > maxLen) {
                maxLen = dp[i];
                endIdx = i;
            }
        }

        // Reconstruct the subsequence by following prev pointers
        List<Integer> result = new ArrayList<>();
        int curr = endIdx;
        while (curr != -1) {
            result.add(curr);
            curr = prev[curr];
        }

        // Reverse to get indices in increasing order
        Collections.reverse(result);
        return result;
    }

    // Helper method to compute Hamming distance
    private int hammingDistance(String s1, String s2) {
        // Strings are guaranteed to have same length in this problem
        int distance = 0;
        for (int i = 0; i < s1.length(); i++) {
            if (s1.charAt(i) != s2.charAt(i)) {
                distance++;
            }
        }
        return distance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² \* L)

- We have nested loops: O(n²) iterations
- For each pair (i, j), we compute Hamming distance: O(L) where L is string length
- Total: O(n² \* L)

**Space Complexity:** O(n)

- `dp` array: O(n)
- `prev` array: O(n)
- Result list: O(n) in worst case
- Total: O(n)

**Why this is optimal for the problem constraints:**

- With n ≤ 1000 and L ≤ 10, n² \* L ≈ 10⁷ operations, which is acceptable
- We could potentially optimize further with preprocessing, but this solution is clean and meets time limits

## Common Mistakes

1. **Forgetting to check both constraints simultaneously:** Some candidates check group difference OR Hamming distance > 1, but we need AND. Always verify both conditions before extending a subsequence.

2. **Incorrect Hamming distance calculation for unequal-length strings:** The problem guarantees equal-length strings, but in interviews, candidates might waste time handling unequal cases. Focus on the given constraints.

3. **Confusing subsequence with substring:** A subsequence doesn't need to be contiguous, while a substring does. This algorithm correctly handles non-contiguous selection.

4. **Not reconstructing the actual subsequence:** The problem asks for the indices, not just the length. Remember to track `prev` pointers and reconstruct the path.

5. **Off-by-one in Hamming distance comparison:** The condition is "greater than 1", not "greater than or equal to 1". Using `>= 1` instead of `> 1` will include strings that differ by exactly 1 character, which is incorrect.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Longest Increasing Subsequence (LIS) variant:** Problems where you find the longest sequence satisfying certain constraints between adjacent elements. Similar problems:
   - [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) - The classic LIS problem
   - [368. Largest Divisible Subset](https://leetcode.com/problems/largest-divisible-subset/) - Find largest subset where each pair is divisible
   - [1048. Longest String Chain](https://leetcode.com/problems/longest-string-chain/) - Find longest chain where each string is predecessor of next

2. **Sequence selection with pairwise constraints:** Problems where you select elements based on relationships between pairs:
   - [1626. Best Team With No Conflicts](https://leetcode.com/problems/best-team-with-no-conflicts/) - Select players with increasing age and score
   - [1235. Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) - Select non-overlapping intervals

The key recognition pattern: When you need to select a sequence (not necessarily contiguous) where each new element must satisfy some condition with the previous element, think dynamic programming with state representing "best sequence ending at position i".

## Key Takeaways

1. **Subsequence problems with pairwise constraints often use DP:** When you need to select a non-contiguous sequence where each new element relates to the previous one, consider the LIS DP pattern with O(n²) time complexity.

2. **Track both length and reconstruction path:** In interview problems, you often need to return the actual sequence, not just its length. Always maintain predecessor pointers when doing DP for reconstruction.

3. **Break complex constraints into modular checks:** This problem has two independent constraints (group difference AND Hamming distance). Handle each constraint separately with early continues to keep code clean and readable.

4. **Optimize within problem constraints:** While O(n²) might seem slow, with n ≤ 1000 it's acceptable. Don't over-optimize prematurely unless constraints require it.

[Practice this problem on CodeJeet](/problem/longest-unequal-adjacent-groups-subsequence-ii)
