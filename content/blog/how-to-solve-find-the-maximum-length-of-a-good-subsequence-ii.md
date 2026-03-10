---
title: "How to Solve Find the Maximum Length of a Good Subsequence II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Maximum Length of a Good Subsequence II. Hard difficulty, 25.1% acceptance rate. Topics: Array, Hash Table, Dynamic Programming."
date: "2026-06-07"
category: "dsa-patterns"
tags:
  [
    "find-the-maximum-length-of-a-good-subsequence-ii",
    "array",
    "hash-table",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Find the Maximum Length of a Good Subsequence II

This problem asks us to find the longest subsequence from an array where we can have at most `k` positions where adjacent elements differ. The tricky part is that we're not just looking for consecutive identical elements—we can skip elements to maximize length while controlling how many "changes" we allow. This is essentially a dynamic programming problem where we track both the value and the number of changes used so far.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 1, 1, 3]` with `k = 1`.

We want the longest subsequence with at most 1 position where adjacent elements differ. Let's think step by step:

1. Start with the first element `1`. Our subsequence is `[1]` with 0 changes.
2. Consider `2`. If we add it after `1`, they differ, so we'd use 1 change. Subsequence `[1, 2]` has 1 change.
3. Consider the next `1`. If we add it after `2`, they differ again, requiring another change (total 2), which exceeds k=1. But we could skip `2` and add this `1` after the first `1`—they're equal, so no change needed. Subsequence `[1, 1]` has 0 changes.
4. Consider the next `1`. Add it to `[1, 1]` → `[1, 1, 1]` with 0 changes.
5. Consider `3`. Add it to `[1, 1, 1]` → `[1, 1, 1, 3]` with 1 change (since 1≠3).

The longest good subsequence is `[1, 1, 1, 3]` with length 4 and exactly 1 change.

The key insight: For each position `i` and each possible number of changes `c` (0 to k), we want to know the longest subsequence ending at `nums[i]`. But we also need to consider what the last value was, since if the next value equals it, we don't use a change.

## Brute Force Approach

A naive approach would be to generate all 2^n subsequences, check each one to count positions where adjacent elements differ, and track the longest valid one. This is clearly O(2^n \* n) time, which is infeasible even for small n.

A slightly better brute force would use recursion: at each index, decide whether to include the current element or skip it, tracking the last chosen value and changes used so far. This has O(2^n) time complexity since each element has two choices (include or skip).

```python
def brute_force(nums, k):
    def dfs(i, last_val, changes_used):
        if i == len(nums):
            return 0

        # Option 1: Skip current element
        skip = dfs(i + 1, last_val, changes_used)

        # Option 2: Take current element (if valid)
        take = 0
        if last_val is None:
            # First element, no change needed
            take = 1 + dfs(i + 1, nums[i], changes_used)
        elif nums[i] == last_val:
            # Same value, no change needed
            take = 1 + dfs(i + 1, nums[i], changes_used)
        elif changes_used < k:
            # Different value, can use a change
            take = 1 + dfs(i + 1, nums[i], changes_used + 1)

        return max(skip, take)

    return dfs(0, None, 0)
```

This recursive solution explores all possibilities but has exponential time complexity. We need to optimize using dynamic programming.

## Optimized Approach

The key insight is that we can use dynamic programming with state `(index, last_value, changes_used)`, but `last_value` can be any value from `nums`, giving us O(n _ n _ k) states which is still O(n³) for k up to n. We need to optimize further.

Observation: When we're at position `i` with `c` changes used, and we want to extend the subsequence, we have two cases:

1. Next element equals current last value → no change needed, extend with same `c`
2. Next element differs → need to use a change, extend with `c+1`

But we can reverse our thinking: Let `dp[i][c]` = maximum length of subsequence ending at index `i` with exactly `c` changes. Then for each `j < i`:

- If `nums[j] == nums[i]`: `dp[i][c] = max(dp[i][c], dp[j][c] + 1)` (no new change)
- If `nums[j] != nums[i]` and `c > 0`: `dp[i][c] = max(dp[i][c], dp[j][c-1] + 1)` (use one change)

This is O(n²k) which is still too slow for n up to 5000.

The breakthrough optimization: Notice that for a given value `v` and change count `c`, we want the maximum `dp[j][c]` over all `j < i` where `nums[j] = v`. We can track this maximum separately!

Let `same[c][v]` = maximum length of subsequence ending with value `v` using exactly `c` changes (where last element is `v`).
Let `diff[c]` = maximum length of subsequence ending with ANY value using exactly `c` changes.

Then for element `nums[i]` = `x`:

- If we extend a sequence ending with same value `x`: `dp = same[c][x] + 1` (no new change)
- If we extend a sequence ending with different value: `dp = diff[c-1] + 1` (use one change)

We take the maximum of these two options for each `c`.

## Optimal Solution

We use dynamic programming where we maintain two arrays:

- `same[c][v]`: best sequence ending with value `v` using `c` changes
- `diff[c]`: best sequence ending with any value using `c` changes

We iterate through `nums`, updating these arrays. The answer is the maximum value across all `c ≤ k`.

<div class="code-group">

```python
# Time: O(n*k) | Space: O(k*V) where V is number of unique values
def maximumLength(nums, k):
    """
    Find the maximum length of a subsequence with at most k positions
    where adjacent elements differ.
    """
    from collections import defaultdict

    # same[c][val] = max length of subsequence ending with 'val' using exactly c changes
    same = [defaultdict(int) for _ in range(k + 1)]
    # diff[c] = max length of subsequence ending with ANY value using exactly c changes
    diff = [0] * (k + 1)

    # Track the maximum lengths for each change count
    max_len = [0] * (k + 1)

    for x in nums:
        # We need to process from high to low c to avoid using updated values
        # in the same iteration (like knapsack problem)
        for c in range(k, -1, -1):
            # Option 1: Extend a sequence ending with the same value x
            # This doesn't count as a change since x == x
            len_same = same[c][x] + 1 if c >= 0 else 1

            # Option 2: Extend a sequence ending with a different value
            # This uses one change (from previous value to x)
            len_diff = diff[c - 1] + 1 if c > 0 else 1

            # Best length ending with x using exactly c changes
            best_with_x = max(len_same, len_diff)

            # Update same[c][x] if we found a longer sequence ending with x
            same[c][x] = max(same[c][x], best_with_x)

            # Update diff[c] if this is better than any sequence ending with any value
            diff[c] = max(diff[c], best_with_x)

            # Track overall maximum for this change count
            max_len[c] = max(max_len[c], best_with_x)

    # We can use at most k changes, so answer is max over c ≤ k
    return max(max_len)
```

```javascript
// Time: O(n*k) | Space: O(k*V) where V is number of unique values
function maximumLength(nums, k) {
  // same[c].get(val) = max length of subsequence ending with 'val' using exactly c changes
  const same = Array.from({ length: k + 1 }, () => new Map());
  // diff[c] = max length of subsequence ending with ANY value using exactly c changes
  const diff = new Array(k + 1).fill(0);
  // Track maximum lengths for each change count
  const maxLen = new Array(k + 1).fill(0);

  for (const x of nums) {
    // Process from high to low c to avoid using updated values in same iteration
    for (let c = k; c >= 0; c--) {
      // Option 1: Extend sequence ending with same value x (no change)
      const lenSame = (same[c].get(x) || 0) + 1;

      // Option 2: Extend sequence ending with different value (uses one change)
      const lenDiff = (c > 0 ? diff[c - 1] : 0) + 1;

      // Best length ending with x using exactly c changes
      const bestWithX = Math.max(lenSame, lenDiff);

      // Update same[c][x] if we found longer sequence ending with x
      same[c].set(x, Math.max(same[c].get(x) || 0, bestWithX));

      // Update diff[c] if this is better than any sequence
      diff[c] = Math.max(diff[c], bestWithX);

      // Track overall maximum
      maxLen[c] = Math.max(maxLen[c], bestWithX);
    }
  }

  // Return maximum over all c ≤ k
  return Math.max(...maxLen);
}
```

```java
// Time: O(n*k) | Space: O(k*V) where V is number of unique values
import java.util.HashMap;
import java.util.Map;

public int maximumLength(int[] nums, int k) {
    // same[c].get(val) = max length of subsequence ending with 'val' using exactly c changes
    Map<Integer, Integer>[] same = new HashMap[k + 1];
    // diff[c] = max length of subsequence ending with ANY value using exactly c changes
    int[] diff = new int[k + 1];
    // Track maximum lengths for each change count
    int[] maxLen = new int[k + 1];

    // Initialize the maps
    for (int i = 0; i <= k; i++) {
        same[i] = new HashMap<>();
    }

    for (int x : nums) {
        // Process from high to low c to avoid using updated values in same iteration
        for (int c = k; c >= 0; c--) {
            // Option 1: Extend sequence ending with same value x (no change)
            int lenSame = same[c].getOrDefault(x, 0) + 1;

            // Option 2: Extend sequence ending with different value (uses one change)
            int lenDiff = (c > 0 ? diff[c - 1] : 0) + 1;

            // Best length ending with x using exactly c changes
            int bestWithX = Math.max(lenSame, lenDiff);

            // Update same[c][x] if we found longer sequence ending with x
            same[c].put(x, Math.max(same[c].getOrDefault(x, 0), bestWithX));

            // Update diff[c] if this is better than any sequence
            diff[c] = Math.max(diff[c], bestWithX);

            // Track overall maximum
            maxLen[c] = Math.max(maxLen[c], bestWithX);
        }
    }

    // Return maximum over all c ≤ k
    int result = 0;
    for (int c = 0; c <= k; c++) {
        result = Math.max(result, maxLen[c]);
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n\*k) where n is the length of `nums` and k is the given parameter. We iterate through each element (n times) and for each element, we iterate through all possible change counts from k down to 0 (k+1 iterations). The operations inside the inner loop are O(1) with hash map lookups.

**Space Complexity:** O(k*V) where V is the number of unique values in `nums`. We maintain `same` array of size k+1, each containing a hash map that stores at most V entries. The `diff` and `maxLen` arrays are O(k). In the worst case where all values are unique, V = n, giving O(n*k) space. However, with the constraints (n ≤ 5000, k ≤ n), this is acceptable.

## Common Mistakes

1. **Processing changes in increasing order instead of decreasing**: When updating `same[c][x]`, if we process `c` from 0 to k, we might use the updated value of `same[c][x]` when computing `lenSame` for higher `c` values in the same iteration. This is similar to the knapsack problem where we process backwards to avoid reusing the same item twice.

2. **Forgetting to handle the case when c = 0**: When c = 0, we can't use `diff[c-1]` since that would be index -1. We need to handle this boundary case carefully. In our solution, we check `if c > 0` before accessing `diff[c-1]`.

3. **Not considering that we can skip elements**: The subsequence doesn't need to be contiguous. Some candidates try to find the longest contiguous subarray with at most k changes, which is a different (easier) problem. Remember we can skip elements to get a longer subsequence.

4. **Using O(n²k) DP without optimization**: The straightforward DP with state `(i, c)` where `i` is the last index and `c` is changes used leads to O(n²k) time, which is too slow for n=5000. Recognizing the need to optimize by tracking best values per unique number is key.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Dynamic Programming with State Optimization**: Similar to problems where we optimize DP states by grouping by certain characteristics. In "Longest Arithmetic Subsequence" (Problem 1027), we group by difference value. Here we group by the ending value.

2. **Controlled Changes/Transitions**: Problems where we're allowed a limited number of "changes" or "operations":
   - "Edit Distance" (Problem 72): Limited operations to transform one string to another
   - "Maximum Subarray Sum with One Deletion" (Problem 1186): Can delete at most one element
   - "Paint House II" (Problem 265): Limited color changes between adjacent houses

3. **Subsequence Problems with Constraints**:
   - "Longest Increasing Subsequence" (Problem 300): Special case where k = n-1 (allowing all changes)
   - "Maximum Length of Repeated Subarray" (Problem 718): Finding matching subsequences

## Key Takeaways

1. **When DP has too many states, look for ways to group them**: Instead of tracking the exact last index, we can often track the last value or some other characteristic that reduces state space.

2. **The "at most k changes" pattern often involves DP over change count**: Maintain best results for each possible number of changes used so far, and transition by either using a change or not.

3. **Process DP updates in reverse order when current state depends on previous states of the same iteration**: This is crucial when we're essentially doing a "take or skip" decision that affects how many resources (changes) we have left.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Maximum Length of Repeated Subarray](/problem/maximum-length-of-repeated-subarray)
