---
title: "How to Solve Make the XOR of All Segments Equal to Zero — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Make the XOR of All Segments Equal to Zero. Hard difficulty, 41.0% acceptance rate. Topics: Array, Hash Table, Dynamic Programming, Bit Manipulation, Counting."
date: "2026-07-29"
category: "dsa-patterns"
tags:
  [
    "make-the-xor-of-all-segments-equal-to-zero",
    "array",
    "hash-table",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve "Make the XOR of All Segments Equal to Zero"

This problem asks us to modify the minimum number of elements in an array so that every contiguous subarray of length `k` has the same XOR value. Specifically, given an array `nums` of length `n` and integer `k`, we need to change elements (to any integer value) such that for all `i` where `0 ≤ i ≤ n-k`, the XOR of `nums[i..i+k-1]` equals the same value. The challenge is that changing one element affects multiple overlapping segments, creating complex dependencies.

What makes this problem tricky is that we're not just finding one subarray with a property—we need to make **all** length-`k` subarrays have identical XOR. This creates a constraint that elements spaced `k` apart must follow a specific pattern, which we'll discover through careful analysis.

## Visual Walkthrough

Let's walk through a concrete example: `nums = [1, 2, 3, 4, 5]`, `k = 3`.

We need all length-3 subarrays to have the same XOR:

- Subarray 0: `nums[0] XOR nums[1] XOR nums[2] = 1 XOR 2 XOR 3 = 0`
- Subarray 1: `nums[1] XOR nums[2] XOR nums[3] = 2 XOR 3 XOR 4 = 5`
- Subarray 2: `nums[2] XOR nums[3] XOR nums[4] = 3 XOR 4 XOR 5 = 2`

These are different (0, 5, 2), so we need to change some elements. Let's think about the constraint: For two consecutive subarrays starting at `i` and `i+1`:

```
XOR(nums[i..i+k-1]) = XOR(nums[i+1..i+k])
```

By XOR properties, if `A XOR B = C`, then `A = B XOR C`. Applying this:

```
nums[i] XOR XOR(nums[i+1..i+k-1]) = XOR(nums[i+1..i+k-1]) XOR nums[i+k]
```

Canceling the common middle part (XOR is its own inverse):

```
nums[i] = nums[i+k]
```

**Key insight**: For all length-`k` subarrays to have equal XOR, elements spaced `k` apart must be equal! That is, `nums[i] = nums[i+k]` for all valid `i`.

Let's verify with our example. If we enforce `nums[0] = nums[3]` and `nums[1] = nums[4]`, then:

- Subarray 0 XOR = `a XOR b XOR nums[2]` (where `a = nums[0] = nums[3]`, `b = nums[1] = nums[4]`)
- Subarray 1 XOR = `b XOR nums[2] XOR a = a XOR b XOR nums[2]` (same!)
- Subarray 2 XOR = `nums[2] XOR a XOR b = a XOR b XOR nums[2]` (same!)

So the problem reduces to: We have `k` independent groups (indices congruent modulo `k`), and within each group, we want all elements to be the same value (to minimize changes). But all groups together must satisfy that the XOR of one element from each group equals some target value `T` (which will be the common XOR of all segments).

## Brute Force Approach

A brute force approach would try all possible target XOR values `T` (from 0 to 1023 since `nums[i] ≤ 2^10`), and for each `T`, try to determine the minimum changes needed. For each group (indices `i, i+k, i+2k, ...`), we could count frequency of values, then choose to either:

1. Change all elements in the group to some value `x` that makes the overall XOR work
2. Or change all but the most frequent element in the group

However, this becomes combinatorial quickly. For each of the `k` groups, we have choices about what value to set it to, and these choices must XOR to `T`. A naive DP would be `O(k * 1024 * 1024)` which is too slow for `k` up to 2000.

The brute force teaches us that we need to:

1. Group elements by `i mod k`
2. For each group, know frequency counts of values
3. Find the minimal changes such that XOR of group representatives equals some `T`

## Optimized Approach

The optimized solution uses dynamic programming with a key optimization: Instead of considering all 1024 possible values for each group, we notice that for a given group, if we choose to change all elements to some value `v`, the cost is `group_size - freq[v]` (where `freq[v]` is how many elements in that group already equal `v`). If we don't care about the XOR constraint, we'd just pick `v` with maximum frequency for each group.

But we have the XOR constraint: The XOR of chosen values across all `k` groups must equal some target `T`. Let's define:

- `dp[i][x]` = minimum changes needed for first `i` groups such that their XOR equals `x`
- Transition: `dp[i][x] = min over all y { dp[i-1][x XOR y] + cost(i, y) }`
  where `cost(i, y)` = changes needed to make group `i` have value `y`

The naive DP would be `O(k * 1024 * 1024)`. The optimization: For each group, only a few `y` values are worth considering—either values that actually appear in the group (since changing to a value not in the group costs at least as much as changing to the most frequent value in the group), or we can take the "cheapest" option for the group (change all elements to some value).

Actually, there's a cleaner approach: For each group, compute the minimum cost to change the group to any value, call it `min_cost`. Then for DP transition:

- Option 1: Pick a value `y` that appears in the group: cost = `group_size - freq[y]`
- Option 2: Pick any other value: cost = `min_cost + 1` (we need 1 extra change because we're picking a value not in the group)

But wait, option 2 should be `min_cost` if we're allowed to pick any value? Let's think: If the most frequent value in group appears `f_max` times, then `min_cost = group_size - f_max`. Changing to a value not in the group requires changing ALL elements, so cost = `group_size`. That's actually `min_cost + f_max`, not `min_cost + 1`.

The actual efficient DP uses the observation that for each group, we only need to try values that appear in that group, plus we need to track the minimum cost achievable for "any other value". The implementation handles this by first computing the best we can do ignoring the XOR constraint, then adjusting.

## Optimal Solution

The solution uses DP where `dp[x]` represents minimum changes for XOR value `x` after processing some groups. For each group:

1. Count frequencies of values in that group
2. Compute `min_dp = min(dp)` from previous iteration
3. Create new `new_dp` where `new_dp[x] = min_dp + group_size` (changing all elements in current group)
4. For each value `val` in current group, for each possible XOR target `x`:
   `new_dp[x] = min(new_dp[x], dp[x XOR val] + group_size - freq[val])`

This works because:

- `min_dp + group_size`: Worst case—change all elements in current group to some value that makes XOR work
- `dp[x XOR val] + group_size - freq[val]`: If previous groups XOR to `x XOR val`, and we make current group have value `val`, then total XOR is `x`, and cost for current group is changing elements not equal to `val`

<div class="code-group">

```python
# Time: O(n + k * 1024 * m) where m is avg unique values per group
# Space: O(1024 + n/k) for DP and frequency maps
def minChanges(nums, k):
    n = len(nums)
    # freq[i][val] = frequency of value val in group i (i from 0 to k-1)
    freq = [{} for _ in range(k)]
    # size[i] = number of elements in group i
    size = [0] * k

    # Group elements by i % k
    for i in range(n):
        group = i % k
        val = nums[i]
        freq[group][val] = freq[group].get(val, 0) + 1
        size[group] += 1

    # dp[x] = min changes to achieve XOR = x after processing some groups
    # Initialize with large values
    INF = float('inf')
    dp = [INF] * 1024
    dp[0] = 0  # XOR 0 with 0 groups requires 0 changes

    # Process each group
    for i in range(k):
        # Create new DP array for state after including group i
        new_dp = [INF] * 1024

        # min_prev = minimum value in dp (best we can do before this group)
        min_prev = min(dp)

        # For each possible XOR value x
        for x in range(1024):
            # Option 1: Change all elements in current group to some value
            # that makes XOR work. This costs at least min_prev + size[i]
            new_dp[x] = min_prev + size[i]

            # Option 2: Choose a value val that actually appears in group i
            for val, count in freq[i].items():
                # If previous groups achieved XOR = x XOR val,
                # then making current group = val gives total XOR = x
                prev_xor = x ^ val
                if dp[prev_xor] != INF:
                    # Cost = previous cost + (elements in group i not equal to val)
                    cost = dp[prev_xor] + (size[i] - count)
                    new_dp[x] = min(new_dp[x], cost)

        # Update dp for next iteration
        dp = new_dp

    # We need XOR of all groups = 0 (all segments XOR to 0)
    return dp[0]
```

```javascript
// Time: O(n + k * 1024 * m) where m is avg unique values per group
// Space: O(1024 + n/k) for DP and frequency maps
function minChanges(nums, k) {
  const n = nums.length;
  // freq[i][val] = frequency of value val in group i
  const freq = Array(k)
    .fill()
    .map(() => ({}));
  // size[i] = number of elements in group i
  const size = Array(k).fill(0);

  // Group elements by i % k
  for (let i = 0; i < n; i++) {
    const group = i % k;
    const val = nums[i];
    freq[group][val] = (freq[group][val] || 0) + 1;
    size[group]++;
  }

  // dp[x] = min changes to achieve XOR = x after processing some groups
  const INF = Number.MAX_SAFE_INTEGER;
  let dp = Array(1024).fill(INF);
  dp[0] = 0; // XOR 0 with 0 groups requires 0 changes

  // Process each group
  for (let i = 0; i < k; i++) {
    const newDp = Array(1024).fill(INF);
    const minPrev = Math.min(...dp);

    // For each possible XOR value x
    for (let x = 0; x < 1024; x++) {
      // Option 1: Change all elements in current group
      newDp[x] = minPrev + size[i];

      // Option 2: Choose a value that appears in group i
      for (const [valStr, count] of Object.entries(freq[i])) {
        const val = parseInt(valStr);
        const prevXor = x ^ val;
        if (dp[prevXor] !== INF) {
          const cost = dp[prevXor] + (size[i] - count);
          newDp[x] = Math.min(newDp[x], cost);
        }
      }
    }

    dp = newDp;
  }

  // We need XOR of all groups = 0
  return dp[0];
}
```

```java
// Time: O(n + k * 1024 * m) where m is avg unique values per group
// Space: O(1024 + n/k) for DP and frequency maps
class Solution {
    public int minChanges(int[] nums, int k) {
        int n = nums.length;
        // freq[i] will store frequency of values in group i
        Map<Integer, Integer>[] freq = new HashMap[k];
        // size[i] = number of elements in group i
        int[] size = new int[k];

        for (int i = 0; i < k; i++) {
            freq[i] = new HashMap<>();
        }

        // Group elements by i % k
        for (int i = 0; i < n; i++) {
            int group = i % k;
            int val = nums[i];
            freq[group].put(val, freq[group].getOrDefault(val, 0) + 1);
            size[group]++;
        }

        // dp[x] = min changes to achieve XOR = x after processing some groups
        int INF = Integer.MAX_VALUE / 2;
        int[] dp = new int[1024];
        Arrays.fill(dp, INF);
        dp[0] = 0;  // XOR 0 with 0 groups requires 0 changes

        // Process each group
        for (int i = 0; i < k; i++) {
            int[] newDp = new int[1024];
            Arrays.fill(newDp, INF);

            // Find minimum in dp
            int minPrev = INF;
            for (int val : dp) {
                minPrev = Math.min(minPrev, val);
            }

            // For each possible XOR value x
            for (int x = 0; x < 1024; x++) {
                // Option 1: Change all elements in current group
                newDp[x] = minPrev + size[i];

                // Option 2: Choose a value that appears in group i
                for (Map.Entry<Integer, Integer> entry : freq[i].entrySet()) {
                    int val = entry.getKey();
                    int count = entry.getValue();
                    int prevXor = x ^ val;
                    if (dp[prevXor] != INF) {
                        int cost = dp[prevXor] + (size[i] - count);
                        newDp[x] = Math.min(newDp[x], cost);
                    }
                }
            }

            dp = newDp;
        }

        // We need XOR of all groups = 0
        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n + k * 1024 * m)` where:

- `n` is the length of `nums` (for grouping elements)
- `k` is the given parameter (number of groups)
- `1024` is the range of possible values (0 to 1023, since `nums[i] ≤ 2^10`)
- `m` is the average number of unique values per group (≤ min(1024, n/k))

In the worst case, `m` could be up to 1024, giving `O(k * 1024²)`. However, since `n ≤ 2000` and `k ≤ n`, and values are limited to 1024, this is acceptable.

**Space Complexity**: `O(1024 + n/k)`:

- `O(1024)` for the DP arrays
- `O(n/k)` on average for storing frequency maps per group (could be `O(n)` total across all groups)

## Common Mistakes

1. **Missing the key insight about `nums[i] = nums[i+k]`**: Some candidates try to work directly with the XOR of segments without realizing this structural constraint. Always test small examples to discover patterns.

2. **Incorrect DP initialization**: Forgetting to initialize `dp[0] = 0` and others to infinity. The DP represents minimum changes, so we start with 0 changes for XOR 0 with no groups processed.

3. **Not handling the "change all elements" case properly**: The `minPrev + size[i]` term is crucial—it represents changing all elements in the current group to some value that makes the XOR work. Without this, you might miss optimal solutions when no value in the current group works with previous groups.

4. **Using wrong XOR range**: The problem says `nums[i] ≤ 2^10`, so values are 0-1023. Using a smaller range (like 256) will fail for larger values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Modular grouping**: When indices follow a periodic pattern (`i ≡ j mod k`), group elements by their remainder modulo `k`. Similar to problems like:
   - "Rearrange Array Elements by Sign" - grouping by positive/negative
   - "Group the People Given the Group Size They Belong To" - explicit grouping

2. **DP with XOR constraints**: When you need to achieve a target XOR value with minimum cost. Similar to:
   - "Maximum XOR With an Element From Array" - query problems with XOR
   - "Find the Longest Awesome Substring" - XOR with prefix sums

3. **Frequency-based optimization**: When DP transitions can be optimized by only considering values that actually appear, rather than all possible values. This appears in:
   - "Minimum Operations to Make a Uni-Value Grid" - changing elements to most frequent value
   - "Reduce Array Size to The Half" - frequency-based removal

## Key Takeaways

1. **Look for structural constraints**: When all length-`k` subarrays must have equal XOR, elements spaced `k` apart must be equal. This transforms the problem from working with segments to working with independent groups.

2. **DP with state compression**: When dealing with XOR constraints, DP state often includes the current XOR value. The range is limited by maximum element value (1024 here), making DP feasible.

3. **Optimize transitions with frequency**: Instead of trying all possible values for each group, only try values that actually appear in the group. Use the minimum cost from previous state as a fallback for other values.

Related problems: [Maximum XOR Score Subarray Queries](/problem/maximum-xor-score-subarray-queries)
