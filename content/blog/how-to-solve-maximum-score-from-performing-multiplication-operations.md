---
title: "How to Solve Maximum Score from Performing Multiplication Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Score from Performing Multiplication Operations. Hard difficulty, 43.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-11-28"
category: "dsa-patterns"
tags:
  [
    "maximum-score-from-performing-multiplication-operations",
    "array",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Maximum Score from Performing Multiplication Operations

You're given two arrays: `nums` (length n) and `multipliers` (length m), where n ≥ m. You must perform exactly m operations, each time choosing either the leftmost or rightmost remaining number from `nums`, multiplying it by the current multiplier, and adding to your score. The goal is to maximize your total score. What makes this problem tricky is that each choice affects future options—taking from the left or right changes what numbers remain—creating a complex decision tree that grows exponentially.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:** nums = [1,2,3], multipliers = [3,2,1]

We have 3 operations (m=3) and 3 numbers (n=3). Our goal is to maximize the sum of (chosen number × multiplier).

**Operation 0 (multiplier = 3):**

- Option 1: Take left (1) → score = 1×3 = 3, remaining nums = [2,3]
- Option 2: Take right (3) → score = 3×3 = 9, remaining nums = [1,2]

**Operation 1 (multiplier = 2):**
If we took left at operation 0 (score=3, nums=[2,3]):

- Option A: Take left (2) → total = 3 + 2×2 = 7, remaining nums = [3]
- Option B: Take right (3) → total = 3 + 3×2 = 9, remaining nums = [2]

If we took right at operation 0 (score=9, nums=[1,2]):

- Option C: Take left (1) → total = 9 + 1×2 = 11, remaining nums = [2]
- Option D: Take right (2) → total = 9 + 2×2 = 13, remaining nums = [1]

**Operation 2 (multiplier = 1):**
We continue this branching. The optimal path is:

1. Operation 0: Take right (3) → score = 9, nums = [1,2]
2. Operation 1: Take right (2) → score = 9 + 4 = 13, nums = [1]
3. Operation 2: Take left (1) → score = 13 + 1 = 14

Final maximum score = 14.

Notice how we need to track both how many operations we've done AND how many we've taken from each side, since taking k from left means we've taken (operations - k) from right.

## Brute Force Approach

The brute force solution explores every possible sequence of left/right choices using recursion. At each step i (0 ≤ i < m), we have two choices:

1. Take from the left: `nums[left] × multipliers[i] + recurse(left+1, right, i+1)`
2. Take from the right: `nums[right] × multipliers[i] + recurse(left, right-1, i+1)`

We take the maximum of these two options. The base case is when we've performed all m operations.

<div class="code-group">

```python
# Time: O(2^m) | Space: O(m) for recursion stack
def maximumScore(nums, multipliers):
    n, m = len(nums), len(multipliers)

    def dfs(left, right, i):
        # Base case: performed all operations
        if i == m:
            return 0

        # Option 1: Take from left
        take_left = nums[left] * multipliers[i] + dfs(left + 1, right, i + 1)

        # Option 2: Take from right
        take_right = nums[right] * multipliers[i] + dfs(left, right - 1, i + 1)

        # Return maximum of both options
        return max(take_left, take_right)

    # Start with full array and first operation
    return dfs(0, n - 1, 0)
```

```javascript
// Time: O(2^m) | Space: O(m) for recursion stack
function maximumScore(nums, multipliers) {
  const n = nums.length,
    m = multipliers.length;

  function dfs(left, right, i) {
    // Base case: performed all operations
    if (i === m) return 0;

    // Option 1: Take from left
    const takeLeft = nums[left] * multipliers[i] + dfs(left + 1, right, i + 1);

    // Option 2: Take from right
    const takeRight = nums[right] * multipliers[i] + dfs(left, right - 1, i + 1);

    // Return maximum of both options
    return Math.max(takeLeft, takeRight);
  }

  // Start with full array and first operation
  return dfs(0, n - 1, 0);
}
```

```java
// Time: O(2^m) | Space: O(m) for recursion stack
class Solution {
    public int maximumScore(int[] nums, int[] multipliers) {
        int n = nums.length, m = multipliers.length;
        return dfs(0, n - 1, 0, nums, multipliers);
    }

    private int dfs(int left, int right, int i, int[] nums, int[] multipliers) {
        // Base case: performed all operations
        if (i == multipliers.length) return 0;

        // Option 1: Take from left
        int takeLeft = nums[left] * multipliers[i] + dfs(left + 1, right, i + 1, nums, multipliers);

        // Option 2: Take from right
        int takeRight = nums[right] * multipliers[i] + dfs(left, right - 1, i + 1, nums, multipliers);

        // Return maximum of both options
        return Math.max(takeLeft, takeRight);
    }
}
```

</div>

**Why this is too slow:** With m up to 1000, 2^1000 is astronomically large. We're recomputing the same subproblems repeatedly. For example, different sequences that result in taking 3 from left and 2 from right (regardless of order) will have the same state but we compute them multiple times.

## Optimized Approach

The key insight is that we can use **dynamic programming** to avoid recomputation. Notice our state depends on:

- How many operations we've performed (i)
- How many we've taken from the left (which determines how many from the right)

Actually, if we know we've performed i operations and taken `leftCount` from the left, then:

- We've taken `i - leftCount` from the right
- Current left index = `leftCount` (0-based)
- Current right index = `n - 1 - (i - leftCount)`

So our DP state can be `dp[i][leftCount]` = maximum score after i operations having taken `leftCount` from the left side.

**Transition:**

- If we take from left at operation i: `nums[leftCount] × multipliers[i] + dp[i+1][leftCount+1]`
- If we take from right at operation i: `nums[n-1-(i-leftCount)] × multipliers[i] + dp[i+1][leftCount]`

We need to compute this from the last operation backward to the first (bottom-up DP).

**Why this works:** We're essentially saying "if we're at operation i and have taken leftCount from left so far, what's the best we can do from here?" By working backward, we build up solutions to smaller subproblems.

## Optimal Solution

Here's the optimized DP solution with detailed comments:

<div class="code-group">

```python
# Time: O(m^2) | Space: O(m^2)
def maximumScore(nums, multipliers):
    n, m = len(nums), len(multipliers)

    # dp[i][left] = max score after i operations having taken 'left' from left side
    # We need m+1 rows because i ranges from 0 to m (inclusive)
    dp = [[0] * (m + 1) for _ in range(m + 1)]

    # Fill DP table from the last operation backward
    # We start from operation m (all operations done) and go to operation 0
    for i in range(m - 1, -1, -1):           # Current operation index
        for left in range(i, -1, -1):        # How many taken from left (0 to i)
            # Calculate right index based on operations done and left taken
            right = n - 1 - (i - left)

            # Option 1: Take from left at current operation
            take_left = nums[left] * multipliers[i] + dp[i + 1][left + 1]

            # Option 2: Take from right at current operation
            take_right = nums[right] * multipliers[i] + dp[i + 1][left]

            # Store maximum of both options
            dp[i][left] = max(take_left, take_right)

    # Answer: after 0 operations, having taken 0 from left
    return dp[0][0]
```

```javascript
// Time: O(m^2) | Space: O(m^2)
function maximumScore(nums, multipliers) {
  const n = nums.length,
    m = multipliers.length;

  // dp[i][left] = max score after i operations having taken 'left' from left side
  // We need m+1 rows because i ranges from 0 to m (inclusive)
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(m + 1).fill(0));

  // Fill DP table from the last operation backward
  // We start from operation m (all operations done) and go to operation 0
  for (let i = m - 1; i >= 0; i--) {
    // Current operation index
    for (let left = i; left >= 0; left--) {
      // How many taken from left (0 to i)
      // Calculate right index based on operations done and left taken
      const right = n - 1 - (i - left);

      // Option 1: Take from left at current operation
      const takeLeft = nums[left] * multipliers[i] + dp[i + 1][left + 1];

      // Option 2: Take from right at current operation
      const takeRight = nums[right] * multipliers[i] + dp[i + 1][left];

      // Store maximum of both options
      dp[i][left] = Math.max(takeLeft, takeRight);
    }
  }

  // Answer: after 0 operations, having taken 0 from left
  return dp[0][0];
}
```

```java
// Time: O(m^2) | Space: O(m^2)
class Solution {
    public int maximumScore(int[] nums, int[] multipliers) {
        int n = nums.length, m = multipliers.length;

        // dp[i][left] = max score after i operations having taken 'left' from left side
        // We need m+1 rows because i ranges from 0 to m (inclusive)
        int[][] dp = new int[m + 1][m + 1];

        // Fill DP table from the last operation backward
        // We start from operation m (all operations done) and go to operation 0
        for (int i = m - 1; i >= 0; i--) {           // Current operation index
            for (int left = i; left >= 0; left--) {  // How many taken from left (0 to i)
                // Calculate right index based on operations done and left taken
                int right = n - 1 - (i - left);

                // Option 1: Take from left at current operation
                int takeLeft = nums[left] * multipliers[i] + dp[i + 1][left + 1];

                // Option 2: Take from right at current operation
                int takeRight = nums[right] * multipliers[i] + dp[i + 1][left];

                // Store maximum of both options
                dp[i][left] = Math.max(takeLeft, takeRight);
            }
        }

        // Answer: after 0 operations, having taken 0 from left
        return dp[0][0];
    }
}
```

</div>

**Space Optimization:** We can reduce space to O(m) by noticing that `dp[i]` only depends on `dp[i+1]`:

<div class="code-group">

```python
# Time: O(m^2) | Space: O(m)
def maximumScore(nums, multipliers):
    n, m = len(nums), len(multipliers)

    # dp[left] = max score for current operation i having taken 'left' from left
    # We only need to track current and next row
    dp = [0] * (m + 1)

    for i in range(m - 1, -1, -1):
        next_dp = [0] * (m + 1)
        for left in range(i, -1, -1):
            right = n - 1 - (i - left)
            take_left = nums[left] * multipliers[i] + dp[left + 1]
            take_right = nums[right] * multipliers[i] + dp[left]
            next_dp[left] = max(take_left, take_right)
        dp = next_dp

    return dp[0]
```

</div>

## Complexity Analysis

**Time Complexity:** O(m²)

- We have two nested loops: i from m-1 down to 0, and left from i down to 0
- The total iterations are approximately m + (m-1) + ... + 1 = m(m+1)/2 = O(m²)
- Each iteration does constant work (two multiplications, one addition, one max)

**Space Complexity:** O(m²) for the full DP table, O(m) for the space-optimized version

- The DP table has (m+1) rows and (m+1) columns → O(m²) space
- With optimization, we only keep two rows at a time → O(m) space

## Common Mistakes

1. **Using the wrong state representation:** Some candidates try `dp[left][right]` which would be O(n²) space. Since n can be up to 10⁵ but m ≤ 10³, this would cause memory limit exceeded. The key insight is that `right = n-1-(i-left)`, so we don't need to store right separately.

2. **Incorrect DP initialization or direction:** This is a bottom-up DP starting from the end. If you try top-down, you need to handle base cases correctly. The backward iteration ensures that when we compute `dp[i][left]`, we've already computed `dp[i+1][...]`.

3. **Off-by-one errors in indices:** The right index calculation `n-1-(i-left)` is tricky. Test it: if i=0, left=0 → right=n-1 (correct). If i=1, left=1 → right=n-1-(0)=n-1 (took both from left). If i=1, left=0 → right=n-1-(1)=n-2 (took one from right).

4. **Forgetting that n can be much larger than m:** We only care about the first m and last m elements of nums since we can only perform m operations. Some solutions create O(n²) DP tables which fail memory constraints.

## When You'll See This Pattern

This "choose from ends with multipliers" pattern appears in several problems:

1. **Maximum Points You Can Obtain from Cards (Medium):** Similar but simpler—you always take exactly k cards total from ends. This is essentially our problem with all multipliers = 1.

2. **Stone Game VII (Medium):** Game where players take stones from ends, with scoring based on remaining sum. Similar DP state but with turn-based gameplay.

3. **Maximum Spending After Buying Items (Hard):** Another "choose from ends" problem with multiplicative factors based on when you choose.

The core pattern is: **When you can only take from the ends of an array/sequence and each choice affects future options, use DP with state based on how many you've taken from each side.**

## Key Takeaways

1. **State compression is crucial:** When n >> m, find a way to represent state using only m parameters. Here, knowing operations count and left count gives us right count automatically.

2. **Backward DP for "remaining" problems:** When the optimal decision depends on future operations, it's often easier to work backward from the end state.

3. **Look for symmetry in constraints:** The fact that n ≥ m but m is limited suggests we should design an O(m²) solution, not O(n²). Always check constraint ranges before designing your algorithm.

**Related problems:** [Maximum Points You Can Obtain from Cards](/problem/maximum-points-you-can-obtain-from-cards), [Stone Game VII](/problem/stone-game-vii), [Maximum Spending After Buying Items](/problem/maximum-spending-after-buying-items)
