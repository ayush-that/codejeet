---
title: "How to Solve Delete and Earn — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete and Earn. Medium difficulty, 57.1% acceptance rate. Topics: Array, Hash Table, Dynamic Programming."
date: "2027-06-17"
category: "dsa-patterns"
tags: ["delete-and-earn", "array", "hash-table", "dynamic-programming", "medium"]
---

# How to Solve Delete and Earn

This problem asks you to maximize points earned by deleting elements from an array, where deleting a value earns you its points but forces you to delete all occurrences of its immediate predecessor. The tricky part is that values aren't independent — choosing one affects what you can choose next, creating a constraint similar to the classic House Robber problem.

## Visual Walkthrough

Let's trace through `nums = [2,2,3,3,3,4]`:

1. First, notice that if we take all `3`s, we get `3 × 3 = 9` points but must delete all `2`s (can't earn their points).
2. If we take all `2`s, we get `2 × 2 = 4` points but must delete all `1`s (none exist, so no penalty).
3. The decision between taking `2`s or `3`s depends on their total values: `total[2] = 4`, `total[3] = 9`.
4. We can't take both `2` and `3` consecutively, but we can take `2` and `4` since `4-1 = 3`, not `2`.

Let's organize the data:

- Value 2: appears 2 times → total = 4
- Value 3: appears 3 times → total = 9
- Value 4: appears 1 time → total = 4

Now we have a transformed problem: given values [2,3,4] with totals [4,9,4], choose non-adjacent values to maximize sum.

The optimal choices:

- Take 2 (4) + 4 (4) = 8
- Take 3 (9) = 9 ← better

So we should take all 3's for 9 points.

## Brute Force Approach

A naive approach would try all combinations of values:

1. Generate all subsets of unique values
2. Check if any two chosen values differ by 1 (invalid)
3. Calculate total points for valid subsets
4. Return maximum

This becomes `O(2^n)` where n is number of unique values — far too slow for constraints up to 20,000.

Even a recursive approach with memoization would be complex because we need to track which values are "blocked" by our choices.

## Optimized Approach

The key insight is that after transforming the problem by summing all points for each value, we get a sequence where:

- Values are sorted integers
- Choosing value `i` prevents choosing `i-1` and `i+1`
- This is exactly the House Robber problem structure!

Transformation steps:

1. Find the maximum value in `nums`
2. Create an array `sums` where `sums[i]` = total points from all occurrences of value `i`
3. Apply House Robber DP: at each value `i`, choose max of:
   - Skip `i`: take best up to `i-1`
   - Take `i`: take `sums[i]` + best up to `i-2`

Why this works: When we take all copies of value `i`, we automatically get all its points but can't take `i-1` or `i+1`. The DP ensures we never take adjacent values.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums), m = max(nums)
# Space: O(m) for the sums array
def deleteAndEarn(nums):
    if not nums:
        return 0

    # Step 1: Find the maximum value in nums
    max_val = max(nums)

    # Step 2: Create an array to store total points for each value
    # sums[i] = total points from all occurrences of value i
    sums = [0] * (max_val + 1)

    # Step 3: Populate sums array
    # For each number in nums, add its value to the corresponding index
    for num in nums:
        sums[num] += num

    # Step 4: Apply House Robber DP
    # dp[i] = maximum points we can earn considering values up to i
    dp = [0] * (max_val + 1)

    # Base cases:
    dp[0] = sums[0]  # Only one choice for value 0
    dp[1] = max(sums[0], sums[1])  # Can't take both 0 and 1

    # Fill DP table
    # For each value i from 2 to max_val:
    # Option 1: Skip value i → take dp[i-1]
    # Option 2: Take value i → take sums[i] + dp[i-2]
    # Choose the maximum
    for i in range(2, max_val + 1):
        dp[i] = max(dp[i-1], sums[i] + dp[i-2])

    # The answer is the maximum points considering all values up to max_val
    return dp[max_val]
```

```javascript
// Time: O(n + m) where n = nums.length, m = max(nums)
// Space: O(m) for the sums array
function deleteAndEarn(nums) {
  if (!nums || nums.length === 0) return 0;

  // Step 1: Find the maximum value in nums
  let maxVal = Math.max(...nums);

  // Step 2: Create an array to store total points for each value
  // sums[i] = total points from all occurrences of value i
  let sums = new Array(maxVal + 1).fill(0);

  // Step 3: Populate sums array
  // For each number in nums, add its value to the corresponding index
  for (let num of nums) {
    sums[num] += num;
  }

  // Step 4: Apply House Robber DP
  // dp[i] = maximum points we can earn considering values up to i
  let dp = new Array(maxVal + 1).fill(0);

  // Base cases:
  dp[0] = sums[0]; // Only one choice for value 0
  dp[1] = Math.max(sums[0], sums[1]); // Can't take both 0 and 1

  // Fill DP table
  // For each value i from 2 to maxVal:
  // Option 1: Skip value i → take dp[i-1]
  // Option 2: Take value i → take sums[i] + dp[i-2]
  // Choose the maximum
  for (let i = 2; i <= maxVal; i++) {
    dp[i] = Math.max(dp[i - 1], sums[i] + dp[i - 2]);
  }

  // The answer is the maximum points considering all values up to maxVal
  return dp[maxVal];
}
```

```java
// Time: O(n + m) where n = nums.length, m = max(nums)
// Space: O(m) for the sums array
public int deleteAndEarn(int[] nums) {
    if (nums == null || nums.length == 0) return 0;

    // Step 1: Find the maximum value in nums
    int maxVal = 0;
    for (int num : nums) {
        maxVal = Math.max(maxVal, num);
    }

    // Step 2: Create an array to store total points for each value
    // sums[i] = total points from all occurrences of value i
    int[] sums = new int[maxVal + 1];

    // Step 3: Populate sums array
    // For each number in nums, add its value to the corresponding index
    for (int num : nums) {
        sums[num] += num;
    }

    // Step 4: Apply House Robber DP
    // dp[i] = maximum points we can earn considering values up to i
    int[] dp = new int[maxVal + 1];

    // Base cases:
    dp[0] = sums[0];  // Only one choice for value 0
    dp[1] = Math.max(sums[0], sums[1]);  // Can't take both 0 and 1

    // Fill DP table
    // For each value i from 2 to maxVal:
    // Option 1: Skip value i → take dp[i-1]
    // Option 2: Take value i → take sums[i] + dp[i-2]
    // Choose the maximum
    for (int i = 2; i <= maxVal; i++) {
        dp[i] = Math.max(dp[i-1], sums[i] + dp[i-2]);
    }

    // The answer is the maximum points considering all values up to maxVal
    return dp[maxVal];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- `O(n)` to iterate through `nums` and build the `sums` array
- `O(m)` to run the DP, where `m = max(nums)`
- In worst case where values are large but sparse, we could optimize with sorting, but this is efficient for typical constraints

**Space Complexity: O(m)**

- `sums` array of size `m+1`
- `dp` array of size `m+1`
- We could optimize to `O(1)` space by tracking only last two DP values, but the array approach is clearer for interviews

## Common Mistakes

1. **Not handling empty input**: Always check if `nums` is empty at the start. The DP base cases assume at least one element exists.

2. **Incorrect DP recurrence**: Using `dp[i-1] + sums[i]` instead of `max(dp[i-1], sums[i] + dp[i-2])`. Remember you can't take adjacent values.

3. **Forgetting to sum all occurrences**: Each `sums[i]` should be `i × count(i)`, not just `i`. Multiply value by its frequency.

4. **Array index errors**: When `maxVal = 1`, accessing `dp[2]` causes index error. Handle small `maxVal` cases properly in base cases.

5. **Confusing values with indices**: The transformation creates a dense array from 0 to `maxVal`. Missing values get `sums[i] = 0`, which is correct.

## When You'll See This Pattern

This "transformation + House Robber" pattern appears in problems where:

1. Choices have constraints on adjacent/neighboring values
2. You need to maximize sum with non-adjacent selection

Related problems:

- **House Robber (LeetCode 198)**: Direct application of the same DP recurrence
- **House Robber II (LeetCode 213)**: Circular version of the same constraint
- **Maximum Sum of Non-Adjacent Elements**: Generic version of this pattern
- **Paint House (LeetCode 256)**: Similar DP with constraints on adjacent choices

## Key Takeaways

1. **Look for transformation opportunities**: Many problems become classic DP problems after appropriate data transformation. Here, summing points by value transformed the problem into House Robber.

2. **Recognize the "no adjacent" constraint**: When you can't select items that are "close" (by value, index, or some metric), think House Robber DP.

3. **DP state definition matters**: `dp[i]` as "best up to i" works well for sequential decisions with adjacency constraints.

Related problems: [House Robber](/problem/house-robber)
