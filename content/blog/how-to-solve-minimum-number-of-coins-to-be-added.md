---
title: "How to Solve Minimum Number of Coins to be Added — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Coins to be Added. Medium difficulty, 58.0% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-07-07"
category: "dsa-patterns"
tags: ["minimum-number-of-coins-to-be-added", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Number of Coins to be Added

You're given an array of coin values and a target integer. You can use any subsequence of these coins to form sums. The goal is to find the minimum number of coins (of any value) you need to add so that every integer from 1 to the target can be formed as a sum of some subsequence of the combined coin set.

What makes this problem interesting is that it's not about making exact change for a single amount (like Coin Change), but about covering a continuous range of values. The optimal solution uses a clever greedy approach that builds up the achievable range incrementally.

## Visual Walkthrough

Let's walk through an example: `coins = [1, 4, 10]`, `target = 19`

We want to cover all integers from 1 to 19. Let's track the maximum sum we can achieve so far:

1. **Start**: We can achieve sum 0 (empty subsequence). `max_reachable = 0`
2. **Sort coins**: Already sorted as `[1, 4, 10]`
3. **Check coin 1**:
   - Current `max_reachable = 0`
   - Coin value = 1
   - Since 1 ≤ 0 + 1? Actually, we check: coin value (1) ≤ max_reachable + 1 (0 + 1 = 1)? Yes, 1 ≤ 1
   - We can now achieve sums up to: `max_reachable = 0 + 1 = 1`
   - Now we can make all sums from 0 to 1
4. **Check coin 4**:
   - Current `max_reachable = 1`
   - Coin value = 4
   - Is 4 ≤ 1 + 1? No, 4 > 2
   - We have a gap! We can't make sum 2
   - We need to add a coin. The optimal coin to add is `max_reachable + 1 = 2`
   - Add coin 2, increment count
   - Now `max_reachable = 1 + 2 = 3` (we can make 0-3)
   - Check again: 4 ≤ 3 + 1? Yes, 4 ≤ 4
   - Now `max_reachable = 3 + 4 = 7` (we can make 0-7)
5. **Check coin 10**:
   - Current `max_reachable = 7`
   - Coin value = 10
   - Is 10 ≤ 7 + 1? No, 10 > 8
   - Add coin 8: `max_reachable = 7 + 8 = 15`
   - Check again: 10 ≤ 15 + 1? Yes, 10 ≤ 16
   - `max_reachable = 15 + 10 = 25`
6. **Check target**:
   - Current `max_reachable = 25`
   - Target = 19
   - Since 25 ≥ 19, we're done
   - Total coins added: 2 (values 2 and 8)

The key insight: we always add the smallest missing value (`max_reachable + 1`) because it gives us the biggest expansion of our reachable range.

## Brute Force Approach

A naive approach might try to generate all possible sums using the given coins, identify gaps, and try adding different coin values to fill those gaps. You could:

1. Generate all possible subset sums from the coins (2^n possibilities)
2. Identify which numbers from 1 to target are missing
3. Try adding different coin values to cover the missing numbers

However, this approach has several problems:

- Generating all subset sums is O(2^n), which is infeasible for large n
- There are infinite possible coin values we could add
- Finding the minimum number of coins to add would require trying all combinations

Even if we limit ourselves to reasonable coin values, the search space is enormous. This brute force approach is clearly impractical for any non-trivial input size.

## Optimized Approach

The optimal solution uses a greedy algorithm with a key insight: **If you can make all sums from 0 to X, and you add a coin of value Y where Y ≤ X + 1, then you can make all sums from 0 to X + Y.**

Here's the step-by-step reasoning:

1. **Sort the coins** - This lets us process them in increasing order
2. **Track the maximum reachable sum** - Start at 0 (empty subsequence)
3. **Iterate through coins**:
   - While the current coin value > `max_reachable + 1`, we have a gap
   - Add a coin of value `max_reachable + 1` (optimal choice)
   - Update `max_reachable` to `max_reachable + (max_reachable + 1)`
   - Repeat until the coin can be used
   - Then use the coin: `max_reachable += coin_value`
4. **After processing all coins**, we might still not reach the target
   - Keep adding coins of value `max_reachable + 1` until we reach or exceed the target

Why does this work? When we add coin `max_reachable + 1`, we double our reachable range plus 1. This is the most efficient way to expand our coverage because:

- Any smaller coin wouldn't expand the range as much
- Any larger coin would leave gaps

This greedy approach is optimal because at each step, we're adding the smallest coin that allows us to cover the next missing number.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(log target) for main loop
# Space: O(1) excluding input storage, O(n) including it
def minimumAddedCoins(coins, target):
    """
    Returns the minimum number of coins to add so that every integer
    from 1 to target can be formed as a sum of some subsequence.
    """
    # Sort coins to process them in increasing order
    coins.sort()

    # max_reachable tracks the maximum sum we can achieve so far
    # Starting with 0 (empty subsequence)
    max_reachable = 0

    # Count of coins we need to add
    coins_added = 0

    # Index to iterate through given coins
    i = 0
    n = len(coins)

    # Continue until we can reach at least the target
    while max_reachable < target:
        # If we have coins left and the next coin can be used to extend our range
        if i < n and coins[i] <= max_reachable + 1:
            # We can use this coin to extend our reachable range
            # By adding this coin, we can now make all sums from 0 to max_reachable + coins[i]
            max_reachable += coins[i]
            i += 1
        else:
            # We have a gap: we cannot make the sum max_reachable + 1
            # The optimal coin to add is max_reachable + 1
            # This coin allows us to double our reachable range (plus 1)
            coins_added += 1
            max_reachable += (max_reachable + 1)

    return coins_added
```

```javascript
// Time: O(n log n) for sorting + O(log target) for main loop
// Space: O(1) excluding input storage, O(n) including it
function minimumAddedCoins(coins, target) {
  // Sort coins to process them in increasing order
  coins.sort((a, b) => a - b);

  // maxReachable tracks the maximum sum we can achieve so far
  // Starting with 0 (empty subsequence)
  let maxReachable = 0;

  // Count of coins we need to add
  let coinsAdded = 0;

  // Index to iterate through given coins
  let i = 0;
  const n = coins.length;

  // Continue until we can reach at least the target
  while (maxReachable < target) {
    // If we have coins left and the next coin can be used to extend our range
    if (i < n && coins[i] <= maxReachable + 1) {
      // We can use this coin to extend our reachable range
      // By adding this coin, we can now make all sums from 0 to maxReachable + coins[i]
      maxReachable += coins[i];
      i++;
    } else {
      // We have a gap: we cannot make the sum maxReachable + 1
      // The optimal coin to add is maxReachable + 1
      // This coin allows us to double our reachable range (plus 1)
      coinsAdded++;
      maxReachable += maxReachable + 1;
    }
  }

  return coinsAdded;
}
```

```java
// Time: O(n log n) for sorting + O(log target) for main loop
// Space: O(1) excluding input storage, O(n) including it
import java.util.Arrays;

public int minimumAddedCoins(int[] coins, int target) {
    // Sort coins to process them in increasing order
    Arrays.sort(coins);

    // maxReachable tracks the maximum sum we can achieve so far
    // Starting with 0 (empty subsequence)
    long maxReachable = 0; // Use long to avoid integer overflow

    // Count of coins we need to add
    int coinsAdded = 0;

    // Index to iterate through given coins
    int i = 0;
    int n = coins.length;

    // Continue until we can reach at least the target
    while (maxReachable < target) {
        // If we have coins left and the next coin can be used to extend our range
        if (i < n && coins[i] <= maxReachable + 1) {
            // We can use this coin to extend our reachable range
            // By adding this coin, we can now make all sums from 0 to maxReachable + coins[i]
            maxReachable += coins[i];
            i++;
        } else {
            // We have a gap: we cannot make the sum maxReachable + 1
            // The optimal coin to add is maxReachable + 1
            // This coin allows us to double our reachable range (plus 1)
            coinsAdded++;
            maxReachable += (maxReachable + 1);
        }
    }

    return coinsAdded;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + log target)**

- `O(n log n)` for sorting the coins array
- `O(log target)` for the main loop because each time we add a coin, we at least double our reachable range (or add a coin from the sorted list). Since we stop when we reach the target, this takes logarithmic time relative to the target.

**Space Complexity: O(1) or O(n)**

- `O(1)` extra space if we don't count the input storage
- `O(n)` if we count the input array (or `O(log n)` for sorting recursion stack in some languages)

The logarithmic factor in the main loop comes from the fact that when we add a coin of value `max_reachable + 1`, we double our reachable range. Starting from 0, we need about log₂(target) such doublings to reach the target.

## Common Mistakes

1. **Forgetting to sort the coins**: The greedy algorithm relies on processing coins in increasing order. Without sorting, you might miss opportunities to use smaller coins to fill gaps.

2. **Using integer overflow**: When `max_reachable` gets large (close to 10^9), adding `max_reachable + 1` can overflow 32-bit integers. Always use 64-bit integers (long in Java, no issue in Python).

3. **Incorrect gap condition**: The condition should be `coin > max_reachable + 1` (not `>=`). If `coin == max_reachable + 1`, we can use it directly without adding anything.

4. **Not handling remaining gaps after processing all coins**: After using all given coins, you might still not reach the target. You need to continue adding coins until `max_reachable >= target`.

5. **Confusing subsequence with subarray**: Remember you can use any subsequence (not necessarily consecutive elements), which means you can pick any subset of coins. This is why sorting doesn't change what sums are possible.

## When You'll See This Pattern

This greedy "reachable range expansion" pattern appears in several problems:

1. **Coin Change (Medium)**: While the standard Coin Change uses DP, variations that ask about covering a range of values use similar reasoning.

2. **Most Expensive Item That Can Not Be Bought (Medium)**: Given two coin denominations, find the largest amount that cannot be formed. Uses similar mathematical reasoning about reachable sums.

3. **Patching Array (Hard)**: Almost identical problem - given a sorted array and a target, find minimum patches (numbers to add) to make all sums in [1, target].

4. **Maximum Number of Consecutive Values You Can Make (Medium)**: Given coins, find how many consecutive integers starting from 0 you can make.

The core pattern is: when you need to cover a continuous range and can add elements, greedily add the smallest missing number to maximize your coverage expansion.

## Key Takeaways

1. **Greedy range expansion**: When you can make all sums from 0 to X, adding a value Y ≤ X + 1 lets you make all sums from 0 to X + Y. The optimal Y to add is always X + 1.

2. **Sorting enables greedy choices**: Processing elements in sorted order lets you identify the smallest gap at each step and make optimal decisions.

3. **Think in terms of reachable ranges**: Instead of tracking which specific sums are possible, track the continuous range from 0 to max_reachable. This simplifies the problem significantly.

4. **Logarithmic growth**: Each optimal addition roughly doubles your reachable range, leading to O(log target) operations after sorting.

Related problems: [Coin Change](/problem/coin-change), [Most Expensive Item That Can Not Be Bought](/problem/most-expensive-item-that-can-not-be-bought)
