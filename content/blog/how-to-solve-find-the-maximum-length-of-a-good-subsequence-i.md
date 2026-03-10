---
title: "How to Solve Find the Maximum Length of a Good Subsequence I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Maximum Length of a Good Subsequence I. Medium difficulty, 32.5% acceptance rate. Topics: Array, Hash Table, Dynamic Programming."
date: "2029-09-18"
category: "dsa-patterns"
tags:
  [
    "find-the-maximum-length-of-a-good-subsequence-i",
    "array",
    "hash-table",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Find the Maximum Length of a Good Subsequence I

This problem asks us to find the longest subsequence from an array where adjacent elements differ at most `k` times. The twist is that we can skip elements (it's a subsequence, not a substring), and we're counting _changes_ between consecutive elements, not the elements themselves. What makes this interesting is that we need to track both the value we end with and how many changes we've used so far.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 1, 1, 3]` with `k = 1`:

We want a subsequence where at most 1 pair of adjacent elements differ. Let's think step by step:

1. Start with empty subsequence: length 0
2. Consider first element `1`: We can take it → subsequence `[1]`, length 1, 0 changes used
3. Consider `2`: If we add it after `1`, they differ (1≠2), so that's 1 change. Since k=1, this is allowed → `[1,2]`, length 2, 1 change used
4. Consider next `1`:
   - If we add it after `2`: 2≠1, would need another change (total 2), but k=1 → not allowed
   - If we add it after the first `1`: 1=1, no change needed → `[1,1]`, length 2, 0 changes used
   - Or we could start fresh with just `[1]` (the second one)
5. Consider next `1`:
   - Best so far is `[1,1]` with 0 changes. Adding another `1` gives `[1,1,1]`, length 3, still 0 changes
6. Consider `3`:
   - If we add to `[1,1,1]`: 1≠3, would need 1 change (total 1) → allowed → `[1,1,1,3]`, length 4, 1 change
   - Or we could add to other sequences...

The maximum length we found is 4. Notice we need to track: for each value, what's the longest sequence ending with that value using 0 changes, 1 change, etc.

## Brute Force Approach

A naive approach would try all possible subsequences. For each element, we either include it or skip it. For a sequence of length n, there are 2^n possible subsequences to check. For each subsequence, we'd count how many adjacent pairs differ and check if it's ≤ k.

The brute force code would look like:

<div class="code-group">

```python
def maxSubsequenceLength(nums, k):
    n = len(nums)
    max_len = 0

    # Try all 2^n subsequences
    for mask in range(1 << n):
        seq = []
        for i in range(n):
            if mask & (1 << i):
                seq.append(nums[i])

        # Count changes in this subsequence
        changes = 0
        for i in range(len(seq) - 1):
            if seq[i] != seq[i + 1]:
                changes += 1

        if changes <= k:
            max_len = max(max_len, len(seq))

    return max_len
```

```javascript
function maxSubsequenceLength(nums, k) {
  const n = nums.length;
  let maxLen = 0;

  // Try all 2^n subsequences
  for (let mask = 0; mask < 1 << n; mask++) {
    const seq = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        seq.push(nums[i]);
      }
    }

    // Count changes in this subsequence
    let changes = 0;
    for (let i = 0; i < seq.length - 1; i++) {
      if (seq[i] !== seq[i + 1]) {
        changes++;
      }
    }

    if (changes <= k) {
      maxLen = Math.max(maxLen, seq.length);
    }
  }

  return maxLen;
}
```

```java
public int maxSubsequenceLength(int[] nums, int k) {
    int n = nums.length;
    int maxLen = 0;

    // Try all 2^n subsequences
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> seq = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                seq.add(nums[i]);
            }
        }

        // Count changes in this subsequence
        int changes = 0;
        for (int i = 0; i < seq.size() - 1; i++) {
            if (!seq.get(i).equals(seq.get(i + 1))) {
                changes++;
            }
        }

        if (changes <= k) {
            maxLen = Math.max(maxLen, seq.size());
        }
    }

    return maxLen;
}
```

</div>

This is exponential time O(2^n \* n), which is far too slow for typical constraints (n up to 1000). We need a polynomial-time solution.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. For each position in the array, we want to know: "What's the longest good subsequence ending at this position with exactly c changes?"

Let's define `dp[val][c]` = maximum length of a good subsequence ending with value `val` using exactly `c` changes.

When we process a new number `x`:

1. We can extend a sequence ending with the same value `x` without using a change
2. We can extend a sequence ending with a different value `y` (y ≠ x), which costs 1 change

More formally:

- If we append `x` to a sequence ending with `x`: `dp[x][c] = max(dp[x][c], dp[x][c] + 1)` (no change used)
- If we append `x` to a sequence ending with `y` (y ≠ x): `dp[x][c] = max(dp[x][c], dp[y][c-1] + 1)` (use 1 change)

We need to be careful about the order of updates since we're modifying the dp table while reading from it. We should use a temporary copy or process in a way that doesn't interfere.

Actually, let's refine: For each element `x`, we consider all possible previous ending values and all possible change counts. But checking all values would be O(n²). Instead, we can track just the best sequences for each change count regardless of ending value.

Better approach: Let `dp[c]` = maximum length achievable with exactly `c` changes, and track what value ends that sequence. But we need to know the ending value to decide if adding a new element requires a change.

The efficient solution: Use two DP arrays:

- `same[c]` = max length ending with current value using c changes
- `diff[c]` = max length ending with any other value using c changes

As we process each number, we update these arrays.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * k) | Space: O(k)
def maximumLength(nums, k):
    """
    Find the maximum length of a subsequence where at most k adjacent pairs differ.

    Args:
        nums: List of integers
        k: Maximum allowed changes between adjacent elements

    Returns:
        Maximum length of a good subsequence
    """
    # dp_same[c] = max length ending with current value using exactly c changes
    # dp_diff[c] = max length ending with any other value using exactly c changes
    dp_same = [-float('inf')] * (k + 1)
    dp_diff = [-float('inf')] * (k + 1)

    # Initialize: empty sequence has length 0 with 0 changes
    dp_same[0] = 0

    # Track the best sequence length for each change count regardless of ending value
    best = [0] * (k + 1)

    for num in nums:
        # Create new arrays for this iteration to avoid overwriting
        new_same = [-float('inf')] * (k + 1)
        new_diff = [-float('inf')] * (k + 1)

        for c in range(k + 1):
            # Option 1: Extend a sequence ending with the same value (no change)
            if dp_same[c] != -float('inf'):
                new_same[c] = max(new_same[c], dp_same[c] + 1)

            # Option 2: Extend a sequence ending with a different value (requires change)
            if c > 0 and best[c - 1] != -float('inf'):
                new_diff[c] = max(new_diff[c], best[c - 1] + 1)

            # Option 3: Start a new sequence with just this element
            new_same[0] = max(new_same[0], 1)

        # Update best array for next iteration
        for c in range(k + 1):
            best[c] = max(best[c], new_same[c], new_diff[c])

        # Update dp arrays for next iteration
        dp_same, dp_diff = new_same, new_diff

    # Answer is the maximum over all change counts ≤ k
    return max(best)
```

```javascript
// Time: O(n * k) | Space: O(k)
function maximumLength(nums, k) {
  /**
   * Find the maximum length of a subsequence where at most k adjacent pairs differ.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Maximum allowed changes between adjacent elements
   * @return {number} Maximum length of a good subsequence
   */

  // dpSame[c] = max length ending with current value using exactly c changes
  // dpDiff[c] = max length ending with any other value using exactly c changes
  let dpSame = new Array(k + 1).fill(-Infinity);
  let dpDiff = new Array(k + 1).fill(-Infinity);

  // Initialize: empty sequence has length 0 with 0 changes
  dpSame[0] = 0;

  // Track the best sequence length for each change count regardless of ending value
  let best = new Array(k + 1).fill(0);

  for (const num of nums) {
    // Create new arrays for this iteration to avoid overwriting
    const newSame = new Array(k + 1).fill(-Infinity);
    const newDiff = new Array(k + 1).fill(-Infinity);

    for (let c = 0; c <= k; c++) {
      // Option 1: Extend a sequence ending with the same value (no change)
      if (dpSame[c] !== -Infinity) {
        newSame[c] = Math.max(newSame[c], dpSame[c] + 1);
      }

      // Option 2: Extend a sequence ending with a different value (requires change)
      if (c > 0 && best[c - 1] !== -Infinity) {
        newDiff[c] = Math.max(newDiff[c], best[c - 1] + 1);
      }

      // Option 3: Start a new sequence with just this element
      newSame[0] = Math.max(newSame[0], 1);
    }

    // Update best array for next iteration
    for (let c = 0; c <= k; c++) {
      best[c] = Math.max(best[c], newSame[c], newDiff[c]);
    }

    // Update dp arrays for next iteration
    dpSame = newSame;
    dpDiff = newDiff;
  }

  // Answer is the maximum over all change counts ≤ k
  return Math.max(...best);
}
```

```java
// Time: O(n * k) | Space: O(k)
public int maximumLength(int[] nums, int k) {
    /**
     * Find the maximum length of a subsequence where at most k adjacent pairs differ.
     *
     * @param nums Array of integers
     * @param k Maximum allowed changes between adjacent elements
     * @return Maximum length of a good subsequence
     */

    // dpSame[c] = max length ending with current value using exactly c changes
    // dpDiff[c] = max length ending with any other value using exactly c changes
    int[] dpSame = new int[k + 1];
    int[] dpDiff = new int[k + 1];

    // Initialize with -infinity (use Integer.MIN_VALUE / 2 to avoid overflow)
    Arrays.fill(dpSame, Integer.MIN_VALUE / 2);
    Arrays.fill(dpDiff, Integer.MIN_VALUE / 2);

    // Initialize: empty sequence has length 0 with 0 changes
    dpSame[0] = 0;

    // Track the best sequence length for each change count regardless of ending value
    int[] best = new int[k + 1];

    for (int num : nums) {
        // Create new arrays for this iteration to avoid overwriting
        int[] newSame = new int[k + 1];
        int[] newDiff = new int[k + 1];
        Arrays.fill(newSame, Integer.MIN_VALUE / 2);
        Arrays.fill(newDiff, Integer.MIN_VALUE / 2);

        for (int c = 0; c <= k; c++) {
            // Option 1: Extend a sequence ending with the same value (no change)
            if (dpSame[c] != Integer.MIN_VALUE / 2) {
                newSame[c] = Math.max(newSame[c], dpSame[c] + 1);
            }

            // Option 2: Extend a sequence ending with a different value (requires change)
            if (c > 0 && best[c - 1] != Integer.MIN_VALUE / 2) {
                newDiff[c] = Math.max(newDiff[c], best[c - 1] + 1);
            }

            // Option 3: Start a new sequence with just this element
            newSame[0] = Math.max(newSame[0], 1);
        }

        // Update best array for next iteration
        for (int c = 0; c <= k; c++) {
            best[c] = Math.max(best[c], Math.max(newSame[c], newDiff[c]));
        }

        // Update dp arrays for next iteration
        dpSame = newSame;
        dpDiff = newDiff;
    }

    // Answer is the maximum over all change counts ≤ k
    int result = 0;
    for (int c = 0; c <= k; c++) {
        result = Math.max(result, best[c]);
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- We iterate through all n elements in the array
- For each element, we iterate through all k+1 possible change counts
- Each iteration does constant work (comparisons and updates)

**Space Complexity:** O(k)

- We maintain several arrays of size k+1: `dp_same`, `dp_diff`, `best`, and temporary arrays
- This is independent of n, which is important since n can be up to 1000 and k up to 100

## Common Mistakes

1. **Confusing subsequence with substring**: Remember we can skip elements in a subsequence. Some candidates try to find contiguous segments, which is incorrect.

2. **Off-by-one errors with change counting**: The problem says "at most k indices i in range [0, seq.length-2]" meaning we count changes between adjacent elements. A sequence of length L has L-1 adjacent pairs. Candidates sometimes count changes incorrectly for single-element sequences.

3. **Not handling k=0 case properly**: When k=0, all elements in the subsequence must be equal. The solution should handle this by taking the maximum frequency of any value in the array.

4. **Using O(n²) DP unnecessarily**: A naive DP would be `dp[i][c]` = max length ending at position i with c changes. But we need to check all j < i to see if we can extend from position j. This is O(n² × k), which is too slow for n=1000. The optimal solution avoids this by tracking values instead of positions.

## When You'll See This Pattern

This type of "bounded constraint" DP appears in several problems:

1. **Longest Increasing Subsequence (LIS)**: While not identical, LIS also builds sequences by considering whether to include elements. The difference is LIS has a value constraint (increasing), while here we have a change constraint.

2. **Maximum Length of Repeated Subarray**: This finds the longest common substring, which is about matching patterns. Our problem is about controlling differences rather than ensuring matches.

3. **Frog Jump with constraints**: Problems where you have a limited number of "special moves" or "changes" often use similar DP with an extra dimension for the constraint count.

The pattern is: When you need to track both some "state" (like ending value) and a "resource" (like number of changes), use DP with multiple dimensions. The key optimization is often realizing you don't need to track everything explicitly.

## Key Takeaways

1. **DP with resource constraints**: When a problem has a limit on something (changes, skips, special moves), add a dimension to your DP to track how much of that resource you've used.

2. **Value-based vs position-based DP**: Sometimes it's more efficient to track the last value in a sequence rather than the last position. This reduces O(n²) to O(n × values), and if values have limited range or can be hashed, this is a big win.

3. **The "best so far" optimization**: Maintaining a `best` array that tracks the maximum length for each change count regardless of ending value is a common trick to avoid checking all previous values.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Maximum Length of Repeated Subarray](/problem/maximum-length-of-repeated-subarray)
