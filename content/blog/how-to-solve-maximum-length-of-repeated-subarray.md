---
title: "How to Solve Maximum Length of Repeated Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Length of Repeated Subarray. Medium difficulty, 51.3% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sliding Window, Rolling Hash."
date: "2027-09-20"
category: "dsa-patterns"
tags:
  ["maximum-length-of-repeated-subarray", "array", "binary-search", "dynamic-programming", "medium"]
---

# How to Solve Maximum Length of Repeated Subarray

This problem asks us to find the longest subarray (contiguous sequence) that appears in both given arrays. What makes this tricky is that we're looking for _contiguous_ matches—not just any subsequence. This constraint changes the dynamic programming approach compared to longest common subsequence problems, requiring careful handling of continuity.

## Visual Walkthrough

Let's trace through a concrete example:  
`nums1 = [1, 2, 3, 2, 1]`  
`nums2 = [3, 2, 1, 4, 7]`

We're looking for the longest contiguous sequence that appears in both arrays. Let's manually check:

- Starting from `nums1[0] = 1`: No match starting at position 0 in `nums2`
- `nums1[1] = 2`: No match starting at position 1 in `nums2`
- `nums1[2] = 3`: Match at `nums2[0] = 3`, but then `nums1[3] = 2` ≠ `nums2[1] = 2`? Wait, they're equal! Let's check further:
  - `nums1[2] = 3` matches `nums2[0] = 3`
  - `nums1[3] = 2` matches `nums2[1] = 2`
  - `nums1[4] = 1` matches `nums2[2] = 1`
  - That's length 3! This is `[3, 2, 1]`

But is there anything longer? Let's check other positions:

- `nums1[3] = 2` matches `nums2[1] = 2`, then `nums1[4] = 1` matches `nums2[2] = 1` (length 2)
- `nums1[0] = 1` matches `nums2[2] = 1`, but then `nums1[1] = 2` ≠ `nums2[3] = 4`

So the maximum length is 3. The key insight: when we find matching elements, we need to check if the _previous_ elements also matched to continue a streak.

## Brute Force Approach

The most straightforward approach is to check every possible starting position in `nums1` against every possible starting position in `nums2`, then extend as far as possible:

1. For each index `i` in `nums1` (0 to n-1)
2. For each index `j` in `nums2` (0 to m-1)
3. If `nums1[i] == nums2[j]`, start extending both pointers while elements match
4. Track the maximum length found

<div class="code-group">

```python
# Time: O(n * m * min(n, m)) | Space: O(1)
def findLengthBruteForce(nums1, nums2):
    n, m = len(nums1), len(nums2)
    max_len = 0

    for i in range(n):
        for j in range(m):
            # If starting elements match
            if nums1[i] == nums2[j]:
                # Extend while we can
                k = 0
                while i + k < n and j + k < m and nums1[i + k] == nums2[j + k]:
                    k += 1
                max_len = max(max_len, k)

    return max_len
```

```javascript
// Time: O(n * m * min(n, m)) | Space: O(1)
function findLengthBruteForce(nums1, nums2) {
  const n = nums1.length,
    m = nums2.length;
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      // If starting elements match
      if (nums1[i] === nums2[j]) {
        // Extend while we can
        let k = 0;
        while (i + k < n && j + k < m && nums1[i + k] === nums2[j + k]) {
          k++;
        }
        maxLen = Math.max(maxLen, k);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n * m * min(n, m)) | Space: O(1)
public int findLengthBruteForce(int[] nums1, int[] nums2) {
    int n = nums1.length, m = nums2.length;
    int maxLen = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            // If starting elements match
            if (nums1[i] == nums2[j]) {
                // Extend while we can
                int k = 0;
                while (i + k < n && j + k < m && nums1[i + k] == nums2[j + k]) {
                    k++;
                }
                maxLen = Math.max(maxLen, k);
            }
        }
    }

    return maxLen;
}
```

</div>

**Why this is too slow:** For arrays of length n and m, we have O(n × m) starting pairs, and for each match we might extend up to min(n, m) elements. This gives us O(n × m × min(n, m)) time complexity, which is O(n³) for equal-sized arrays. For n = 1000, that's about 10⁹ operations—far too slow.

## Optimized Approach

The key insight for optimization is dynamic programming. Notice that when `nums1[i] == nums2[j]`, the length of the matching subarray ending at these positions depends on whether the _previous_ elements also matched:

- If `nums1[i] == nums2[j]`, then the length of the matching subarray ending at (i, j) is 1 plus the length ending at (i-1, j-1)
- If `nums1[i] != nums2[j]`, then no subarray ends exactly at (i, j), so the length is 0

This gives us the recurrence relation:  
`dp[i][j] = dp[i-1][j-1] + 1 if nums1[i] == nums2[j] else 0`

Where `dp[i][j]` represents the length of the matching subarray ending at position `i` in `nums1` and position `j` in `nums2`.

We can visualize this with our example:

- When we see `nums1[4] = 1` and `nums2[2] = 1` match, we check `dp[3][1]` (ending at `nums1[3] = 2` and `nums2[1] = 2`)
- Since those also matched, `dp[4][2] = dp[3][1] + 1 = 2 + 1 = 3`

We only need to track the maximum value in our DP table as we fill it.

## Optimal Solution

Here's the dynamic programming solution with space optimization. We can optimize space from O(n × m) to O(min(n, m)) by noticing that we only need the previous row to compute the current row.

<div class="code-group">

```python
# Time: O(n * m) | Space: O(min(n, m))
def findLength(nums1, nums2):
    # Ensure nums1 is the shorter array for space optimization
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    n, m = len(nums1), len(nums2)
    # dp[j] will store the length of matching subarray ending at current i and j
    dp = [0] * (m + 1)  # +1 for easier indexing
    max_len = 0

    # Iterate through nums1
    for i in range(1, n + 1):
        # We need to process j from m down to 1 to avoid overwriting dp[j-1]
        # which we need for the next iteration of i
        new_dp = [0] * (m + 1)

        for j in range(1, m + 1):
            # If current elements match
            if nums1[i - 1] == nums2[j - 1]:
                # Length is 1 + length of match ending at previous positions
                new_dp[j] = dp[j - 1] + 1
                # Update maximum length found so far
                max_len = max(max_len, new_dp[j])
            # else: new_dp[j] remains 0 (no match ending here)

        # Update dp for next iteration
        dp = new_dp

    return max_len
```

```javascript
// Time: O(n * m) | Space: O(min(n, m))
function findLength(nums1, nums2) {
  // Ensure nums1 is the shorter array for space optimization
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  const n = nums1.length,
    m = nums2.length;
  // dp[j] will store the length of matching subarray ending at current i and j
  let dp = new Array(m + 1).fill(0); // +1 for easier indexing
  let maxLen = 0;

  // Iterate through nums1
  for (let i = 1; i <= n; i++) {
    // Create new array for current row
    const newDp = new Array(m + 1).fill(0);

    for (let j = 1; j <= m; j++) {
      // If current elements match
      if (nums1[i - 1] === nums2[j - 1]) {
        // Length is 1 + length of match ending at previous positions
        newDp[j] = dp[j - 1] + 1;
        // Update maximum length found so far
        maxLen = Math.max(maxLen, newDp[j]);
      }
      // else: newDp[j] remains 0 (no match ending here)
    }

    // Update dp for next iteration
    dp = newDp;
  }

  return maxLen;
}
```

```java
// Time: O(n * m) | Space: O(min(n, m))
public int findLength(int[] nums1, int[] nums2) {
    // Ensure nums1 is the shorter array for space optimization
    if (nums1.length > nums2.length) {
        int[] temp = nums1;
        nums1 = nums2;
        nums2 = temp;
    }

    int n = nums1.length, m = nums2.length;
    // dp[j] will store the length of matching subarray ending at current i and j
    int[] dp = new int[m + 1];  // +1 for easier indexing
    int maxLen = 0;

    // Iterate through nums1
    for (int i = 1; i <= n; i++) {
        // Create new array for current row
        int[] newDp = new int[m + 1];

        for (int j = 1; j <= m; j++) {
            // If current elements match
            if (nums1[i - 1] == nums2[j - 1]) {
                // Length is 1 + length of match ending at previous positions
                newDp[j] = dp[j - 1] + 1;
                // Update maximum length found so far
                maxLen = Math.max(maxLen, newDp[j]);
            }
            // else: newDp[j] remains 0 (no match ending here)
        }

        // Update dp for next iteration
        dp = newDp;
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m) where n and m are the lengths of the two arrays. We iterate through all n elements of the first array, and for each, we iterate through all m elements of the second array.

**Space Complexity:** O(min(n, m)) because we:

1. Swap the arrays so the first is shorter (if needed)
2. Only store one DP row at a time, which has length m+1 (where m is the length of the longer array after swapping)
3. The space is proportional to the shorter array's length due to the swap

## Common Mistakes

1. **Confusing subarray with subsequence:** This is the most common mistake. A subarray must be contiguous, while a subsequence can have gaps. The DP recurrence for longest common subsequence is different: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` when elements don't match.

2. **Off-by-one errors in DP indices:** Since we're using 1-based indexing for the DP table but 0-based for the arrays, it's easy to write `nums1[i]` instead of `nums1[i-1]`. Always be explicit about this in your reasoning.

3. **Forgetting to track the maximum:** The answer isn't `dp[n][m]` but the maximum value in the entire DP table. A subarray can end anywhere, not just at the ends of both arrays.

4. **Inefficient space usage:** Some candidates create the full O(n × m) DP table when O(min(n, m)) suffices. Interviewers appreciate when you recognize and implement the space optimization.

## When You'll See This Pattern

This "matching ending at position" DP pattern appears in several related problems:

1. **Longest Common Subsequence (Medium)** - Similar but for non-contiguous sequences. The recurrence is slightly different because we can skip mismatched elements.

2. **Maximum Subarray (Easy)** - Uses a similar "ending at position i" DP approach, but for a single array and with a different recurrence (max of continuing or starting fresh).

3. **Edit Distance (Hard)** - Another 2D DP problem where `dp[i][j]` represents the minimum operations to transform one string prefix to another.

4. **Palindromic Substrings (Medium)** - Uses a 2D DP where `dp[i][j]` indicates whether substring `s[i:j]` is a palindrome, with a similar "build on previous results" approach.

## Key Takeaways

1. **For contiguous matching problems**, the DP recurrence often looks like: if elements match, add 1 to the result from the previous positions; otherwise, reset to 0.

2. **Space optimization is often possible** in 2D DP problems when you only need the previous row/column. Look for opportunities to reduce O(n²) space to O(n).

3. **The answer isn't always in the bottom-right corner** of the DP table. When looking for maximum/minimum of any sub-structure (not just prefix-to-prefix), you need to track the global maximum as you fill the table.

Related problems: [Minimum Size Subarray Sum](/problem/minimum-size-subarray-sum), [Longest Common Subpath](/problem/longest-common-subpath), [Find the Maximum Length of a Good Subsequence II](/problem/find-the-maximum-length-of-a-good-subsequence-ii)
