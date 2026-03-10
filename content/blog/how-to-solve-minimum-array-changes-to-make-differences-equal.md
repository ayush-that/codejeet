---
title: "How to Solve Minimum Array Changes to Make Differences Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Array Changes to Make Differences Equal. Medium difficulty, 24.3% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2030-03-01"
category: "dsa-patterns"
tags:
  ["minimum-array-changes-to-make-differences-equal", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Minimum Array Changes to Make Differences Equal

This problem asks us to transform an array so that all adjacent differences become equal, with minimal changes. Given an array `nums` of even length `n` and an integer `k`, we can change any element to any integer between `0` and `k`. The goal is to make `nums[i] - nums[i+1]` equal for all even indices `i` (0, 2, 4, ...), using the fewest possible changes.

What makes this problem tricky is that we're not just matching values directly—we're matching _differences_ between pairs of elements, and each element appears in two different differences (except the first and last). This creates dependencies that require careful analysis.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [3, 5, 1, 8]`, `k = 10`

We need to make these differences equal:

- Difference 1: `nums[0] - nums[1] = 3 - 5 = -2`
- Difference 2: `nums[2] - nums[3] = 1 - 8 = -7`

Currently, the differences are -2 and -7, which aren't equal. We need to find a target difference `d` that minimizes changes.

For each pair `(nums[i], nums[i+1])` where `i` is even, we can think about what values would make `nums[i] - nums[i+1] = d`. Rearranging: `nums[i] - nums[i+1] = d` → `nums[i] = nums[i+1] + d`.

Since both numbers must be in `[0, k]`, we have constraints:

1. `0 ≤ nums[i+1] + d ≤ k` → `-d ≤ nums[i+1] ≤ k - d`
2. `0 ≤ nums[i+1] ≤ k`

For our example with `d = 0`:

- Pair 1: `nums[0] = nums[1] + 0 = nums[1]`
  Constraints: `0 ≤ nums[1] ≤ 10` (from k=10)
  Original: `nums[0]=3, nums[1]=5` → need both to be equal
  Changes needed: 2 (change both to same value within [0,10])
- Pair 2: `nums[2] = nums[3] + 0 = nums[3]`
  Original: `nums[2]=1, nums[3]=8` → need both to be equal
  Changes needed: 2
  Total: 4 changes

For `d = 1`:

- Pair 1: `nums[0] = nums[1] + 1`
  Constraints: `-1 ≤ nums[1] ≤ 9` (but also `0 ≤ nums[1] ≤ 10`)
  Intersection: `0 ≤ nums[1] ≤ 9`
  Check if original fits: `nums[0]=3, nums[1]=5` → `3 = 5 + 1?` No (3 ≠ 6)
  Can we change to fit? Yes, many options
- We need a systematic way to count minimal changes...

The key insight: For each possible value of the second element in a pair, we can determine if the pair needs 0, 1, or 2 changes to achieve difference `d`.

## Brute Force Approach

A brute force approach would try every possible target difference `d`. Since values are between 0 and `k`, differences range from `-k` to `k`. For each `d`, we'd check each pair and count changes needed.

For each pair `(a, b)` where `a = nums[i]`, `b = nums[i+1]`:

- If `a = b + d` and both `a` and `b` are in `[0, k]`: 0 changes
- Else if we can change exactly one element to satisfy `a = b + d` with both in `[0, k]`: 1 change
- Else: 2 changes

We'd try all `d` from `-k` to `k` (2k+1 possibilities), checking n/2 pairs each time. Complexity: O(k × n).

When `k` is large (up to 10^5) and `n` is up to 10^5, this becomes O(10^10) operations—far too slow.

## Optimized Approach

The optimization comes from realizing we don't need to check every `d` independently. For each pair `(a, b)`, we can determine which `d` values require 0, 1, or 2 changes.

Let's analyze a single pair `(a, b)`:

**Case 0 changes:** Need `a = b + d` → `d = a - b`. Additionally, both resulting values must be in `[0, k]`:

- `a` must be in `[0, k]` (it already is, since it's from original array)
- `b` must be in `[0, k]` (it already is)
- `a = b + d` means `b = a - d` must be in `[0, k]`

So for `d = a - b` to give 0 changes, we need `0 ≤ a - d ≤ k` → `a - k ≤ d ≤ a`.

**Case 1 change:** This happens when we can change exactly one element. There are two subcases:

1. Change `a` to `b + d` (and `b` stays same): Need `0 ≤ b + d ≤ k` → `-b ≤ d ≤ k - b`
   But not including the 0-change case where `a = b + d`
2. Change `b` to `a - d` (and `a` stays same): Need `0 ≤ a - d ≤ k` → `a - k ≤ d ≤ a`
   But not including the 0-change case

**Case 2 changes:** All other `d` values

The key optimization: Instead of iterating through `d` values, we can use a difference array or prefix sum to mark intervals where each pair contributes 0, 1, or 2 changes.

For each pair, we:

1. Mark `d = a - b` as potentially 0 changes (if within valid range)
2. Mark intervals for 1 change
3. Everything else is 2 changes

By accumulating these contributions across all pairs, we can find the `d` that minimizes total changes.

## Optimal Solution

The solution uses a difference array to efficiently track how many changes each `d` value requires. We create an array of size `2k+3` (to cover `d` from `-k-1` to `k+1` for safety) and use prefix sums to accumulate contributions.

<div class="code-group">

```python
# Time: O(n + k) | Space: O(k)
def minChanges(nums, k):
    n = len(nums)
    # We need to track d values from -k to k, but use extra padding
    # to handle boundaries safely
    offset = k + 1  # to make index 0 correspond to d = -k-1
    size = 2 * k + 3  # from -k-1 to k+1 inclusive

    # diff array for tracking contributions
    diff = [0] * size

    for i in range(0, n, 2):
        a = nums[i]
        b = nums[i + 1]

        # Base cost: assuming 2 changes for all d
        # We'll subtract from this base

        # Interval for 0 changes at d = a - b
        zero_d = a - b
        # But only if it's actually achievable (both values in [0,k])
        # We need 0 <= b <= k and 0 <= a <= k (always true for original)
        # and 0 <= a - d <= k -> a - k <= d <= a
        low_zero = a - k
        high_zero = a

        # Check if zero_d is within the valid range for 0 changes
        if low_zero <= zero_d <= high_zero:
            # For this specific d, cost is 0 instead of 2
            # So we subtract 2 from base cost at this point
            idx = zero_d + offset
            diff[idx] -= 2

        # Interval for 1 change (changing a to b + d)
        # Valid when 0 <= b + d <= k -> -b <= d <= k - b
        low_one_a = -b
        high_one_a = k - b

        # Interval for 1 change (changing b to a - d)
        # Valid when 0 <= a - d <= k -> a - k <= d <= a
        low_one_b = a - k
        high_one_b = a

        # The union of these two intervals gives all d where 1 change works
        # But we need to exclude the 0-change point
        low_one = min(low_one_a, low_one_b)
        high_one = max(high_one_a, high_one_b)

        # Mark the 1-change interval: cost is 1 instead of 2
        # So we subtract 1 more (making total -1 from base 2)
        low_idx = low_one + offset
        high_idx = high_one + offset

        # Use difference array technique: +1 at start, -1 after end
        if low_idx <= high_idx:
            diff[low_idx] += 1
            if high_idx + 1 < size:
                diff[high_idx + 1] -= 1

    # Convert difference array to prefix sum
    prefix = [0] * size
    prefix[0] = diff[0]
    for i in range(1, size):
        prefix[i] = prefix[i - 1] + diff[i]

    # Base cost is 2 changes per pair
    base_cost = n  # 2 * (n/2) = n

    # Find minimum total cost
    min_cost = float('inf')
    # d ranges from -k to k
    for d in range(-k, k + 1):
        idx = d + offset
        # Total cost = base_cost + adjustment from prefix array
        # prefix[i] tells us how much to subtract from base cost of 2 per pair
        cost = base_cost + prefix[idx]
        min_cost = min(min_cost, cost)

    return min_cost
```

```javascript
// Time: O(n + k) | Space: O(k)
function minChanges(nums, k) {
  const n = nums.length;
  // Offset to handle negative d values
  const offset = k + 1; // index 0 corresponds to d = -k-1
  const size = 2 * k + 3; // from -k-1 to k+1 inclusive

  // Difference array for efficient interval updates
  const diff = new Array(size).fill(0);

  for (let i = 0; i < n; i += 2) {
    const a = nums[i];
    const b = nums[i + 1];

    // Base cost is 2 changes per pair
    // We'll adjust this with the diff array

    // Point for 0 changes: d = a - b
    const zeroD = a - b;
    // Range where 0 changes is valid: a - k <= d <= a
    const lowZero = a - k;
    const highZero = a;

    // Check if zeroD is within valid range for 0 changes
    if (lowZero <= zeroD && zeroD <= highZero) {
      // At this d, cost is 0 instead of 2
      const idx = zeroD + offset;
      diff[idx] -= 2; // Subtract 2 from base cost
    }

    // Interval for 1 change (changing a to b + d)
    // Valid when 0 <= b + d <= k  ->  -b <= d <= k - b
    const lowOneA = -b;
    const highOneA = k - b;

    // Interval for 1 change (changing b to a - d)
    // Valid when 0 <= a - d <= k  ->  a - k <= d <= a
    const lowOneB = a - k;
    const highOneB = a;

    // Union of the two 1-change intervals
    const lowOne = Math.min(lowOneA, lowOneB);
    const highOne = Math.max(highOneA, highOneB);

    // Mark the 1-change interval
    const lowIdx = lowOne + offset;
    const highIdx = highOne + offset;

    if (lowIdx <= highIdx) {
      diff[lowIdx] += 1; // Cost becomes 1 instead of 2
      if (highIdx + 1 < size) {
        diff[highIdx + 1] -= 1; // End of interval
      }
    }
  }

  // Convert difference array to prefix sum
  const prefix = new Array(size).fill(0);
  prefix[0] = diff[0];
  for (let i = 1; i < size; i++) {
    prefix[i] = prefix[i - 1] + diff[i];
  }

  // Base cost: 2 changes per pair = n total changes
  const baseCost = n;
  let minCost = Infinity;

  // Check all possible d values
  for (let d = -k; d <= k; d++) {
    const idx = d + offset;
    // Total cost = base cost + adjustment
    const cost = baseCost + prefix[idx];
    minCost = Math.min(minCost, cost);
  }

  return minCost;
}
```

```java
// Time: O(n + k) | Space: O(k)
class Solution {
    public int minChanges(int[] nums, int k) {
        int n = nums.length;
        // Offset to handle negative differences
        int offset = k + 1;  // index 0 corresponds to d = -k-1
        int size = 2 * k + 3;  // from -k-1 to k+1 inclusive

        // Difference array for interval updates
        int[] diff = new int[size];

        for (int i = 0; i < n; i += 2) {
            int a = nums[i];
            int b = nums[i + 1];

            // Point for 0 changes at d = a - b
            int zeroD = a - b;
            // Valid range for 0 changes: a - k <= d <= a
            int lowZero = a - k;
            int highZero = a;

            // Check if zeroD gives 0 changes
            if (lowZero <= zeroD && zeroD <= highZero) {
                // At this d, cost is 0 instead of 2
                int idx = zeroD + offset;
                diff[idx] -= 2;  // Subtract 2 from base
            }

            // Interval for 1 change (change a to b + d)
            // Valid when 0 <= b + d <= k -> -b <= d <= k - b
            int lowOneA = -b;
            int highOneA = k - b;

            // Interval for 1 change (change b to a - d)
            // Valid when 0 <= a - d <= k -> a - k <= d <= a
            int lowOneB = a - k;
            int highOneB = a;

            // Union of 1-change intervals
            int lowOne = Math.min(lowOneA, lowOneB);
            int highOne = Math.max(highOneA, highOneB);

            // Mark the 1-change interval
            int lowIdx = lowOne + offset;
            int highIdx = highOne + offset;

            if (lowIdx <= highIdx) {
                diff[lowIdx] += 1;  // Cost becomes 1 instead of 2
                if (highIdx + 1 < size) {
                    diff[highIdx + 1] -= 1;  // End of interval
                }
            }
        }

        // Convert difference array to prefix sum
        int[] prefix = new int[size];
        prefix[0] = diff[0];
        for (int i = 1; i < size; i++) {
            prefix[i] = prefix[i - 1] + diff[i];
        }

        // Base cost: 2 changes per pair
        int baseCost = n;
        int minCost = Integer.MAX_VALUE;

        // Check all possible d values
        for (int d = -k; d <= k; d++) {
            int idx = d + offset;
            // Total cost = base + adjustment
            int cost = baseCost + prefix[idx];
            minCost = Math.min(minCost, cost);
        }

        return minCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + k)

- We process each of the n/2 pairs once: O(n)
- For each pair, we do constant work updating the difference array
- We then iterate through 2k+1 possible d values: O(k)
- Total: O(n + k)

**Space Complexity:** O(k)

- We create a difference array of size O(k) (specifically 2k+3)
- The prefix sum array also uses O(k) space
- Other variables use constant space

## Common Mistakes

1. **Not checking validity constraints for 0 changes:** Candidates often mark `d = a - b` as 0 changes without verifying that both resulting values would be within `[0, k]`. This leads to incorrect counts.

2. **Double-counting the 0-change point in 1-change intervals:** When a `d` value gives 0 changes, it shouldn't be counted as 1 change. The solution handles this by applying the 0-change adjustment after the 1-change interval marking.

3. **Off-by-one errors in difference array indices:** The difference array technique requires careful handling of inclusive/exclusive boundaries. Forgetting to add the `+1` when marking the end of an interval is a common error.

4. **Not considering the full range of d values:** Some candidates only check `d` from `-k` to `k`, but the difference array needs extra padding to handle boundary cases safely.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Difference Array / Prefix Sum for Interval Updates:** When you need to apply the same operation to a range of indices/values efficiently. Similar problems:
   - LeetCode 1109: "Corporate Flight Bookings" - booking seats on flights
   - LeetCode 1589: "Maximum Sum Obtained of Any Permutation" - sum ranges of an array

2. **Optimizing Over Possible Target Values:** When the solution involves finding an optimal target value from a range, and you can precompute contributions for each candidate. Similar problems:
   - LeetCode 462: "Minimum Moves to Equal Array Elements II" - find median
   - LeetCode 296: "Best Meeting Point" - minimize Manhattan distance

3. **Pairwise Constraints with Overlap:** When elements participate in multiple constraints simultaneously. Similar problems:
   - LeetCode 2025: "Maximum Number of Ways to Partition an Array" - similar difference analysis
   - LeetCode 1712: "Ways to Split Array Into Three Subarrays" - prefix sums with constraints

## Key Takeaways

1. **When you need to test many possible target values**, consider whether you can precompute contributions using difference arrays or prefix sums rather than testing each one independently.

2. **For problems with range constraints**, the difference array technique (also called "array difference" or "interval marking") is a powerful tool that turns O(L) interval updates into O(1) operations.

3. **Always validate constraints** even when a mathematical relationship seems correct—additional domain restrictions (like values being in `[0, k]`) can change what's actually achievable.

[Practice this problem on CodeJeet](/problem/minimum-array-changes-to-make-differences-equal)
