---
title: "How to Solve Ways to Split Array Into Three Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ways to Split Array Into Three Subarrays. Medium difficulty, 34.2% acceptance rate. Topics: Array, Two Pointers, Binary Search, Prefix Sum."
date: "2028-11-11"
category: "dsa-patterns"
tags:
  ["ways-to-split-array-into-three-subarrays", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Ways to Split Array Into Three Subarrays

This problem asks us to count the number of ways to split an array into three non-empty contiguous subarrays where the sum of the left subarray is ≤ the sum of the middle subarray, and the sum of the middle subarray is ≤ the sum of the right subarray. What makes this problem interesting is that we need to find **all valid split points** efficiently, which requires careful handling of prefix sums and boundary conditions.

## Visual Walkthrough

Let's trace through a concrete example: `[1, 2, 2, 2, 5, 0]`

First, let's calculate prefix sums to make range sums easier:

- Prefix sums: `[0, 1, 3, 5, 7, 12, 12]` (with leading 0 for convenience)

We need to find two split points `i` and `j` where:

1. `0 < i < j < n` (3 non-empty subarrays)
2. `sum(0, i) ≤ sum(i, j) ≤ sum(j, n)`

Let's try finding valid splits manually:

**Step 1: Fix the first split point `i`**

- For `i = 1`: left sum = 1
  - We need `middle ≥ 1` and `right ≥ middle`
  - Let's try `j = 2`: middle = 2, right = 2+2+5+0 = 9 → valid (1 ≤ 2 ≤ 9)
  - `j = 3`: middle = 2+2 = 4, right = 2+5+0 = 7 → valid (1 ≤ 4 ≤ 7)
  - `j = 4`: middle = 2+2+2 = 6, right = 5+0 = 5 → invalid (6 > 5)
  - So for i=1, valid j are 2 and 3

**Step 2: Continue with other i values**

- For `i = 2`: left sum = 3
  - `j = 3`: middle = 2, right = 2+5+0 = 7 → invalid (3 > 2)
  - No valid j for i=2

- For `i = 3`: left sum = 5
  - `j = 4`: middle = 2, right = 5+0 = 5 → invalid (5 > 2)
  - No valid j for i=3

- For `i = 4`: left sum = 7
  - `j = 5`: middle = 5, right = 0 → invalid (right empty, and 5 > 0)
  - No valid j for i=4

Total valid splits: 2

The key insight is that for each `i`, valid `j` values form a **contiguous range** determined by the constraints:

1. `sum(i, j) ≥ sum(0, i)` → `j` must be at least some minimum
2. `sum(j, n) ≥ sum(i, j)` → `j` must be at most some maximum

## Brute Force Approach

The brute force solution would try all possible pairs `(i, j)` and check the conditions:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def waysToSplit_brute(nums):
    n = len(nums)
    count = 0

    # Try all possible first split points
    for i in range(1, n - 1):
        left_sum = sum(nums[:i])

        # Try all possible second split points
        for j in range(i + 1, n):
            mid_sum = sum(nums[i:j])
            right_sum = sum(nums[j:])

            if left_sum <= mid_sum <= right_sum:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function waysToSplitBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Try all possible first split points
  for (let i = 1; i < n - 1; i++) {
    let leftSum = 0;
    for (let k = 0; k < i; k++) leftSum += nums[k];

    // Try all possible second split points
    for (let j = i + 1; j < n; j++) {
      let midSum = 0;
      for (let k = i; k < j; k++) midSum += nums[k];

      let rightSum = 0;
      for (let k = j; k < n; k++) rightSum += nums[k];

      if (leftSum <= midSum && midSum <= rightSum) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int waysToSplitBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Try all possible first split points
    for (int i = 1; i < n - 1; i++) {
        int leftSum = 0;
        for (int k = 0; k < i; k++) leftSum += nums[k];

        // Try all possible second split points
        for (int j = i + 1; j < n; j++) {
            int midSum = 0;
            for (int k = i; k < j; k++) midSum += nums[k];

            int rightSum = 0;
            for (int k = j; k < n; k++) rightSum += nums[k];

            if (leftSum <= midSum && midSum <= rightSum) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is too slow:** For an array of length `n`, there are O(n²) pairs of `(i, j)`, and computing each sum takes O(n) time, resulting in O(n³) total time complexity. For n up to 10⁵ (as in LeetCode constraints), this is completely infeasible.

## Optimized Approach

The key optimization is using **prefix sums** to compute any subarray sum in O(1) time. With prefix sums `prefix[k] = sum(nums[0:k])`, we have:

- `sum(i, j) = prefix[j] - prefix[i]`
- `sum(0, i) = prefix[i]`
- `sum(j, n) = prefix[n] - prefix[j]`

The constraints become:

1. `prefix[j] - prefix[i] ≥ prefix[i]` → `prefix[j] ≥ 2 * prefix[i]`
2. `prefix[n] - prefix[j] ≥ prefix[j] - prefix[i]` → `2 * prefix[j] ≤ prefix[n] + prefix[i]`

For each `i`, we need to find the range of `j` values that satisfy both inequalities. This gives us:

- **Minimum j**: smallest index where `prefix[j] ≥ 2 * prefix[i]`
- **Maximum j**: largest index where `2 * prefix[j] ≤ prefix[n] + prefix[i]`

We can find these boundaries using **binary search** on the prefix sum array, giving us O(n log n) time complexity. An even better approach uses **two pointers** to achieve O(n) time, since as `i` increases, both boundaries move rightward.

## Optimal Solution

Here's the O(n) two-pointer solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def waysToSplit(nums):
    n = len(nums)
    MOD = 10**9 + 7

    # Step 1: Build prefix sum array
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    total = prefix[n]  # Sum of entire array
    count = 0

    # Step 2: For each possible first split point i,
    # find the valid range for second split point j
    j_min = 2  # j must be at least i+1, so starting from index 2
    j_max = 2  # Initialize both pointers

    for i in range(1, n - 1):  # i is the end index of left subarray
        left_sum = prefix[i]

        # Step 3: Move j_min to the right until we find the minimum valid j
        # We need: prefix[j] - prefix[i] >= prefix[i]
        # Which simplifies to: prefix[j] >= 2 * prefix[i]
        while j_min <= n and prefix[j_min] < 2 * left_sum:
            j_min += 1

        # Step 4: Move j_max to maintain the maximum valid j
        # We need: total - prefix[j] >= prefix[j] - prefix[i]
        # Which simplifies to: 2 * prefix[j] <= total + prefix[i]
        # Also, j_max should be at least j_min
        j_max = max(j_max, j_min)
        while j_max < n and 2 * prefix[j_max] <= total + left_sum:
            j_max += 1

        # Step 5: All j values from j_min to j_max-1 are valid
        # But j must be <= n-1 to ensure right subarray is non-empty
        valid_start = j_min
        valid_end = min(j_max, n)  # j_max might be n, but j must be < n

        if valid_start < valid_end:
            count = (count + (valid_end - valid_start)) % MOD

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function waysToSplit(nums) {
  const n = nums.length;
  const MOD = 1e9 + 7;

  // Step 1: Build prefix sum array
  // prefix[i] = sum of first i elements (prefix[0] = 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  const total = prefix[n]; // Sum of entire array
  let count = 0;

  // Step 2: For each possible first split point i,
  // find the valid range for second split point j
  let jMin = 2; // j must be at least i+1, so starting from index 2
  let jMax = 2; // Initialize both pointers

  for (let i = 1; i < n - 1; i++) {
    // i is the end index of left subarray
    const leftSum = prefix[i];

    // Step 3: Move jMin to the right until we find the minimum valid j
    // We need: prefix[j] - prefix[i] >= prefix[i]
    // Which simplifies to: prefix[j] >= 2 * prefix[i]
    while (jMin <= n && prefix[jMin] < 2 * leftSum) {
      jMin++;
    }

    // Step 4: Move jMax to maintain the maximum valid j
    // We need: total - prefix[j] >= prefix[j] - prefix[i]
    // Which simplifies to: 2 * prefix[j] <= total + prefix[i]
    // Also, jMax should be at least jMin
    jMax = Math.max(jMax, jMin);
    while (jMax < n && 2 * prefix[jMax] <= total + leftSum) {
      jMax++;
    }

    // Step 5: All j values from jMin to jMax-1 are valid
    // But j must be <= n-1 to ensure right subarray is non-empty
    const validStart = jMin;
    const validEnd = Math.min(jMax, n); // jMax might be n, but j must be < n

    if (validStart < validEnd) {
      count = (count + (validEnd - validStart)) % MOD;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int waysToSplit(int[] nums) {
    int n = nums.length;
    int MOD = 1_000_000_007;

    // Step 1: Build prefix sum array
    // prefix[i] = sum of first i elements (prefix[0] = 0)
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    int total = prefix[n];  // Sum of entire array
    int count = 0;

    // Step 2: For each possible first split point i,
    // find the valid range for second split point j
    int jMin = 2;  // j must be at least i+1, so starting from index 2
    int jMax = 2;  // Initialize both pointers

    for (int i = 1; i < n - 1; i++) {  // i is the end index of left subarray
        int leftSum = prefix[i];

        // Step 3: Move jMin to the right until we find the minimum valid j
        // We need: prefix[j] - prefix[i] >= prefix[i]
        // Which simplifies to: prefix[j] >= 2 * prefix[i]
        while (jMin <= n && prefix[jMin] < 2 * leftSum) {
            jMin++;
        }

        // Step 4: Move jMax to maintain the maximum valid j
        // We need: total - prefix[j] >= prefix[j] - prefix[i]
        // Which simplifies to: 2 * prefix[j] <= total + prefix[i]
        // Also, jMax should be at least jMin
        jMax = Math.max(jMax, jMin);
        while (jMax < n && 2 * prefix[jMax] <= total + leftSum) {
            jMax++;
        }

        // Step 5: All j values from jMin to jMax-1 are valid
        // But j must be <= n-1 to ensure right subarray is non-empty
        int validStart = jMin;
        int validEnd = Math.min(jMax, n);  // jMax might be n, but j must be < n

        if (validStart < validEnd) {
            count = (count + (validEnd - validStart)) % MOD;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the prefix sum array takes O(n)
- The two-pointer traversal: each pointer (`j_min` and `j_max`) moves at most n times total
- Each element is processed a constant number of times

**Space Complexity: O(n)**

- We store the prefix sum array of size n+1
- All other variables use O(1) space

## Common Mistakes

1. **Off-by-one errors with indices**: Remember that `i` and `j` are split points, not element indices. If `i` is the end of the left subarray, then `j` must be at least `i+1`. Also, `j` must be less than `n` to ensure the right subarray is non-empty.

2. **Forgetting to handle large counts with modulo**: The problem states to return the answer modulo 10^9+7. Without this, counts can overflow integer limits in some languages.

3. **Incorrect boundary conditions for binary search approach**: If using binary search instead of two pointers, candidates often make mistakes in finding the inclusive/exclusive boundaries. The conditions are:
   - Minimum j: first index where `prefix[j] ≥ 2 * prefix[i]`
   - Maximum j: last index where `2 * prefix[j] ≤ total + prefix[i]`

4. **Not checking that all subarrays are non-empty**: The problem requires three non-empty subarrays, so `0 < i < j < n`. Some solutions might allow `i = 0` or `j = n`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Sums + Two Pointers**: Problems where you need to find ranges satisfying inequality constraints often use this combination. Similar problems:
   - [Number of Ways to Split Array](https://leetcode.com/problems/number-of-ways-to-split-array/) - Simpler version with two subarrays
   - [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) - Finding subarrays with sum constraints

2. **Range Counting with Monotonic Boundaries**: When valid ranges for one variable shift monotonically as another variable changes, two pointers are often optimal. Similar problems:
   - [3Sum Smaller](https://leetcode.com/problems/3sum-smaller/) - Counting triplets with sum < target
   - [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/) - Counting subarrays with product < k

3. **Partition Problems**: Splitting arrays into parts with certain properties. Similar problems:
   - [Number of Ways to Divide a Long Corridor](https://leetcode.com/problems/number-of-ways-to-divide-a-long-corridor/) - Harder version with additional constraints
   - [Partition Array into Disjoint Intervals](https://leetcode.com/problems/partition-array-into-disjoint-intervals/) - Different partitioning criteria

## Key Takeaways

1. **Prefix sums transform range sum queries into O(1) operations**, which is crucial for optimization when dealing with multiple subarray sum comparisons.

2. **When constraints create monotonic boundaries**, two pointers can often reduce O(n²) or O(n log n) solutions to O(n). Look for problems where valid ranges shift in one direction as you iterate.

3. **Always validate edge cases** with small examples. For partition problems, check: empty subarrays, single element arrays, and arrays where all elements are equal.

Related problems: [Number of Ways to Divide a Long Corridor](/problem/number-of-ways-to-divide-a-long-corridor), [Number of Ways to Split Array](/problem/number-of-ways-to-split-array)
