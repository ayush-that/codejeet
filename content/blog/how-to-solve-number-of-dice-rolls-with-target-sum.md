---
title: "How to Solve Number of Dice Rolls With Target Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Dice Rolls With Target Sum. Medium difficulty, 62.2% acceptance rate. Topics: Dynamic Programming."
date: "2027-10-07"
category: "dsa-patterns"
tags: ["number-of-dice-rolls-with-target-sum", "dynamic-programming", "medium"]
---

# How to Solve Number of Dice Rolls With Target Sum

You have `n` dice, each with `k` faces numbered 1 to `k`. You need to find how many ways to roll these dice so that the sum of all face-up numbers equals `target`. The challenge is that the number of possible combinations grows exponentially, making brute force approaches impractical for typical constraints. This is a classic dynamic programming problem where we need to count combinations with constraints.

## Visual Walkthrough

Let's trace through a small example: `n = 2`, `k = 6`, `target = 7`.

We have 2 dice, each with faces 1-6. We want to count how many ways to get a sum of 7.

**Step-by-step reasoning:**

- With 2 dice, the sum comes from: die1 + die2 = 7
- Possible pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)
- That's 6 total ways

Now let's think about how we'd compute this systematically:

1. For the first die, we could roll 1-6
2. For each value of die1, we need die2 to be `7 - die1`
3. But die2 must be between 1 and 6

This gives us:

- die1=1 → die2=6 ✓ (within 1-6)
- die1=2 → die2=5 ✓
- die1=3 → die2=4 ✓
- die1=4 → die2=3 ✓
- die1=5 → die2=2 ✓
- die1=6 → die2=1 ✓
- die1=7 → die2=0 ✗ (die1 can't be 7 anyway)

Now let's consider a slightly more complex example with 3 dice: `n = 3`, `k = 6`, `target = 8`.

We need to think recursively:

- First die could be 1-6
- After choosing first die value, we need to get `target - die1` with the remaining 2 dice
- This suggests a recursive relationship: ways(n, target) = sum of ways(n-1, target-value) for value from 1 to k

This recursive thinking leads us directly to the dynamic programming solution.

## Brute Force Approach

The most straightforward approach is to generate all possible dice roll combinations and count those that sum to the target. With `n` dice, each having `k` faces, there are `k^n` possible combinations. We could use recursion to explore all possibilities:

**Recursive brute force logic:**

- Base case: If we have 0 dice left and target is 0, we found a valid way (return 1)
- If we have 0 dice left but target isn't 0, or if target is negative, it's invalid (return 0)
- Otherwise, for each possible face value (1 to k), recursively count ways with n-1 dice and target-value

<div class="code-group">

```python
# Time: O(k^n) | Space: O(n) for recursion stack
def numRollsToTarget(n, k, target):
    MOD = 10**9 + 7

    def backtrack(dice_left, remaining_sum):
        # Base cases
        if dice_left == 0 and remaining_sum == 0:
            return 1
        if dice_left == 0 or remaining_sum <= 0:
            return 0

        total_ways = 0
        # Try all possible values for current die
        for face in range(1, k + 1):
            total_ways += backtrack(dice_left - 1, remaining_sum - face)

        return total_ways % MOD

    return backtrack(n, target)
```

```javascript
// Time: O(k^n) | Space: O(n) for recursion stack
function numRollsToTarget(n, k, target) {
  const MOD = 10 ** 9 + 7;

  function backtrack(diceLeft, remainingSum) {
    // Base cases
    if (diceLeft === 0 && remainingSum === 0) return 1;
    if (diceLeft === 0 || remainingSum <= 0) return 0;

    let totalWays = 0;
    // Try all possible values for current die
    for (let face = 1; face <= k; face++) {
      totalWays += backtrack(diceLeft - 1, remainingSum - face);
    }

    return totalWays % MOD;
  }

  return backtrack(n, target);
}
```

```java
// Time: O(k^n) | Space: O(n) for recursion stack
class Solution {
    private static final int MOD = 1000000007;

    public int numRollsToTarget(int n, int k, int target) {
        return backtrack(n, k, target);
    }

    private int backtrack(int diceLeft, int k, int remainingSum) {
        // Base cases
        if (diceLeft == 0 && remainingSum == 0) return 1;
        if (diceLeft == 0 || remainingSum <= 0) return 0;

        int totalWays = 0;
        // Try all possible values for current die
        for (int face = 1; face <= k; face++) {
            totalWays = (totalWays + backtrack(diceLeft - 1, k, remainingSum - face)) % MOD;
        }

        return totalWays;
    }
}
```

</div>

**Why this is too slow:**
The time complexity is O(k^n), which grows exponentially. For typical constraints (n up to 30, k up to 30), this is completely infeasible. We're doing a lot of redundant work - the same subproblems (same number of dice left, same remaining sum) are computed many times.

## Optimized Approach

The key insight is that we can use **dynamic programming** to avoid redundant computations. Notice that our recursive function has two parameters: number of dice left and remaining sum. This gives us a 2D state space that we can memoize.

**DP State Definition:**
Let `dp[d][s]` = number of ways to get sum `s` using exactly `d` dice.

**Transition Formula:**
To get sum `s` with `d` dice, consider the value of the last die:

- If the last die shows value `v` (where 1 ≤ v ≤ k), then we need sum `s-v` with `d-1` dice
- So: `dp[d][s] = sum(dp[d-1][s-v] for v from 1 to k)`

**Base Cases:**

- `dp[0][0] = 1` (0 dice, sum 0: 1 way)
- `dp[0][s] = 0` for s > 0 (0 dice can't give positive sum)
- `dp[d][s] = 0` if s < d (minimum sum with d dice is d, since each die shows at least 1)

**Optimization:**
We can optimize space by noticing that `dp[d]` only depends on `dp[d-1]`, so we only need to keep two rows at a time.

## Optimal Solution

Here's the complete dynamic programming solution with space optimization:

<div class="code-group">

```python
# Time: O(n * target * k) | Space: O(target)
def numRollsToTarget(n, k, target):
    MOD = 10**9 + 7

    # Handle edge cases
    if target < n or target > n * k:
        return 0

    # dp[s] = number of ways to get sum s with current number of dice
    dp = [0] * (target + 1)
    dp[0] = 1  # Base case: 0 dice, sum 0

    # Iterate through each die
    for dice in range(1, n + 1):
        # Create new dp array for current number of dice
        new_dp = [0] * (target + 1)

        # For each possible sum
        for current_sum in range(dice, min(target, dice * k) + 1):
            # Sum over all possible values of current die
            for face in range(1, k + 1):
                prev_sum = current_sum - face
                if prev_sum >= 0:
                    new_dp[current_sum] = (new_dp[current_sum] + dp[prev_sum]) % MOD

        dp = new_dp

    return dp[target]
```

```javascript
// Time: O(n * target * k) | Space: O(target)
function numRollsToTarget(n, k, target) {
  const MOD = 10 ** 9 + 7;

  // Handle edge cases
  if (target < n || target > n * k) return 0;

  // dp[s] = number of ways to get sum s with current number of dice
  let dp = new Array(target + 1).fill(0);
  dp[0] = 1; // Base case: 0 dice, sum 0

  // Iterate through each die
  for (let dice = 1; dice <= n; dice++) {
    // Create new dp array for current number of dice
    let newDp = new Array(target + 1).fill(0);

    // For each possible sum
    const maxSum = Math.min(target, dice * k);
    for (let currentSum = dice; currentSum <= maxSum; currentSum++) {
      // Sum over all possible values of current die
      for (let face = 1; face <= k; face++) {
        const prevSum = currentSum - face;
        if (prevSum >= 0) {
          newDp[currentSum] = (newDp[currentSum] + dp[prevSum]) % MOD;
        }
      }
    }

    dp = newDp;
  }

  return dp[target];
}
```

```java
// Time: O(n * target * k) | Space: O(target)
class Solution {
    public int numRollsToTarget(int n, int k, int target) {
        final int MOD = 1000000007;

        // Handle edge cases
        if (target < n || target > n * k) return 0;

        // dp[s] = number of ways to get sum s with current number of dice
        int[] dp = new int[target + 1];
        dp[0] = 1;  // Base case: 0 dice, sum 0

        // Iterate through each die
        for (int dice = 1; dice <= n; dice++) {
            // Create new dp array for current number of dice
            int[] newDp = new int[target + 1];

            // For each possible sum
            int maxSum = Math.min(target, dice * k);
            for (int currentSum = dice; currentSum <= maxSum; currentSum++) {
                // Sum over all possible values of current die
                for (int face = 1; face <= k; face++) {
                    int prevSum = currentSum - face;
                    if (prevSum >= 0) {
                        newDp[currentSum] = (newDp[currentSum] + dp[prevSum]) % MOD;
                    }
                }
            }

            dp = newDp;
        }

        return dp[target];
    }
}
```

</div>

**Explanation of key parts:**

1. **Edge case handling**: We check if target is even possible given n dice with k faces. Minimum sum is n (all 1's), maximum is n\*k (all k's).

2. **DP initialization**: `dp[0] = 1` represents the base case of 0 dice summing to 0.

3. **Outer loop**: We process one die at a time, building up from 1 die to n dice.

4. **Sum range optimization**: For `d` dice, the minimum possible sum is `d` and maximum is `min(target, d*k)`. This avoids unnecessary computations.

5. **Inner loops**: For each possible current sum, we consider all possible face values for the current die and add ways from previous state.

## Complexity Analysis

**Time Complexity: O(n × target × k)**

- We have three nested loops:
  1. Outer loop: O(n) for each die
  2. Middle loop: O(target) for each possible sum (optimized to O(min(target, dice\*k)))
  3. Inner loop: O(k) for each possible face value
- In worst case, this is O(n × target × k)

**Space Complexity: O(target)**

- We maintain two DP arrays of size `target + 1`
- We could further optimize to use just one array with careful iteration order, but O(target) is usually acceptable

## Common Mistakes

1. **Forgetting the modulo operation**: The problem states the answer may be large and should be returned modulo 10^9+7. Candidates often compute exact values which can overflow.

2. **Incorrect base cases**:
   - Setting `dp[0][0] = 0` instead of 1
   - Not handling the case where target is impossible (less than n or greater than n\*k)

3. **Off-by-one errors in loops**:
   - Starting sum loop from 0 instead of `dice` (minimum sum with d dice is d)
   - Using `<=` vs `<` when iterating to `target` or `k`

4. **Not optimizing the sum range**: Iterating all sums from 0 to target for each dice count wastes time. With d dice, sum can only be between d and min(target, d\*k).

5. **Using 2D array when 1D suffices**: Some candidates use O(n × target) space when O(target) is enough, which can cause memory issues for large inputs.

## When You'll See This Pattern

This "bounded knapsack counting" pattern appears in many problems where you need to count combinations with constraints:

1. **Coin Change II (LeetCode 518)**: Count ways to make amount with given coins. Similar to dice rolls but coins can have any values.

2. **Combination Sum IV (LeetCode 377)**: Count combinations that sum to target (order matters). Similar DP structure but different transition.

3. **Partition Equal Subset Sum (LeetCode 416)**: Check if array can be partitioned into two equal sum subsets. Uses similar DP but for existence rather than counting.

4. **Target Sum (LeetCode 494)**: Assign + or - to each number to reach target. Similar state space (items processed vs current sum).

The core pattern is: when you need to count ways to reach a target using items with certain values, and the items are used in some order or combination, dynamic programming with state (items used, current sum) is often the solution.

## Key Takeaways

1. **Recognize counting problems with constraints**: When asked "how many ways" to achieve a target with certain items/choices, think dynamic programming.

2. **State definition is crucial**: The state should capture what choices have been made (dice used) and the current progress toward the target (current sum).

3. **Space optimization is often possible**: If the transition only depends on the previous row/state, you can reduce space complexity by reusing arrays.

4. **Look for bounds to prune computations**: In this problem, knowing that with d dice the sum must be between d and d\*k allows us to skip impossible states.

Related problems: [Equal Sum Arrays With Minimum Number of Operations](/problem/equal-sum-arrays-with-minimum-number-of-operations), [Find Missing Observations](/problem/find-missing-observations)
