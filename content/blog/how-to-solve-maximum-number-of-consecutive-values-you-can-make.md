---
title: "How to Solve Maximum Number of Consecutive Values You Can Make — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Consecutive Values You Can Make. Medium difficulty, 63.5% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-07-26"
category: "dsa-patterns"
tags: ["maximum-number-of-consecutive-values-you-can-make", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Number of Consecutive Values You Can Make

You’re given an array of coin values and need to find the maximum number of consecutive integer values starting from 0 that you can make by summing some subset of your coins. The tricky part is that you don’t actually need to find all possible sums—you just need to know how far you can extend the consecutive sequence. This problem tests your ability to recognize a greedy pattern and leverage sorting to build up the answer incrementally.

## Visual Walkthrough

Let’s trace through a concrete example: `coins = [1, 1, 3, 4]`. We want to find how many consecutive integers starting from 0 we can make.

**Step 1:** Sort the coins: `[1, 1, 3, 4]`

**Step 2:** Initialize `max_reachable = 0`. This represents the highest consecutive value we can make so far (starting from 0).

**Step 3:** Process coin 1 (value = 1):

- Current `max_reachable = 0`
- Can we make `max_reachable + 1 = 1`? Yes, because `1 ≤ 0 + 1` (the coin value is ≤ the gap we need to fill).
- Add coin value to `max_reachable`: `max_reachable = 0 + 1 = 1`
- Now we can make all values from 0 to 1.

**Step 4:** Process next coin 1 (value = 1):

- Current `max_reachable = 1`
- Can we make `max_reachable + 1 = 2`? Yes, because `1 ≤ 1 + 1`
- Add coin value: `max_reachable = 1 + 1 = 2`
- Now we can make all values from 0 to 2.

**Step 5:** Process coin 3 (value = 3):

- Current `max_reachable = 2`
- Can we make `max_reachable + 1 = 3`? Check: `3 ≤ 2 + 1`? No, because `3 > 3`. The coin is too large to fill the next gap.
- Since `3 > max_reachable + 1`, we stop. We cannot make value 3.
- The maximum consecutive values we can make are 0, 1, 2 → **3 values**.

What if we had a different coin? Let’s see why sorting matters. Suppose we process `[4, 1, 3, 1]` without sorting:

- Start with `max_reachable = 0`, coin 4: `4 > 0 + 1`, so we’d incorrectly stop at 0. But we actually can make 0, 1, 2, 3, 4, 5 with these coins! Sorting ensures we process smaller coins first, letting us build up reachable range gradually.

## Brute Force Approach

A naive approach would be to generate all possible sums using subset generation, then find the longest consecutive sequence starting from 0. For each coin, you either include it or not, leading to 2ⁿ possible subsets. You could store all sums in a set, then iterate from 0 upward until you find a missing value.

Why this fails:

- **Exponential time**: O(2ⁿ) is infeasible for n up to 10⁵.
- **Memory blowup**: The set of sums could be huge (up to sum of all coins).
- **Unnecessary work**: We don’t need all sums—just need to know how far the consecutive sequence extends.

Even if you try dynamic programming (knapsack-style), you’d still have O(n × total_sum) complexity, which is too slow when total_sum is large.

## Optimized Approach

The key insight is **greedy processing with sorting**. If you can make all values from 0 to `max_reachable`, then:

1. You can certainly make any value ≤ `max_reachable` by some subset of coins processed so far.
2. To extend to `max_reachable + 1`, you need a coin with value ≤ `max_reachable + 1`. Why? Because if you have such a coin, you can add it to a subset that makes `(max_reachable + 1) - coin_value`, which is ≤ `max_reachable` and therefore already achievable.

**Step-by-step reasoning:**

- Sort coins ascending.
- Maintain `max_reachable` = highest consecutive value achievable so far (initially 0).
- Iterate through each coin:
  - If `coin > max_reachable + 1`, then we cannot make `max_reachable + 1` (gap too big), so stop.
  - Otherwise, add coin to `max_reachable` (since we can now make all values up to `max_reachable + coin`).
- The answer is `max_reachable + 1` (number of consecutive values from 0 to `max_reachable`).

**Why does this work?**
When we add a coin with value `v ≤ max_reachable + 1`, we can make all values from `max_reachable + 1` to `max_reachable + v` by taking existing subsets that make values from `(max_reachable + 1) - v` to `max_reachable` and adding `v`. Since `v ≤ max_reachable + 1`, the lower bound `(max_reachable + 1) - v ≥ 0`, so those subsets exist.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) due to sorting | Space: O(1) excluding sort space
def getMaximumConsecutive(coins):
    """
    Returns the maximum number of consecutive integer values
    starting from 0 that can be made using subsets of coins.
    """
    # Step 1: Sort coins to process smallest first
    coins.sort()

    # Step 2: Initialize max_reachable as the highest value
    # we can make consecutively from 0
    max_reachable = 0

    # Step 3: Process each coin
    for coin in coins:
        # If the current coin is greater than max_reachable + 1,
        # we have a gap and cannot make max_reachable + 1
        if coin > max_reachable + 1:
            break

        # Otherwise, we can extend our reachable range by adding this coin
        # We can now make all values from 0 to max_reachable + coin
        max_reachable += coin

    # Step 4: The number of consecutive values is max_reachable + 1
    # because we can make 0, 1, 2, ..., max_reachable
    return max_reachable + 1
```

```javascript
// Time: O(n log n) due to sorting | Space: O(1) excluding sort space
function getMaximumConsecutive(coins) {
  /**
   * Returns the maximum number of consecutive integer values
   * starting from 0 that can be made using subsets of coins.
   */
  // Step 1: Sort coins to process smallest first
  coins.sort((a, b) => a - b);

  // Step 2: Initialize maxReachable as the highest value
  // we can make consecutively from 0
  let maxReachable = 0;

  // Step 3: Process each coin
  for (const coin of coins) {
    // If the current coin is greater than maxReachable + 1,
    // we have a gap and cannot make maxReachable + 1
    if (coin > maxReachable + 1) {
      break;
    }

    // Otherwise, we can extend our reachable range by adding this coin
    // We can now make all values from 0 to maxReachable + coin
    maxReachable += coin;
  }

  // Step 4: The number of consecutive values is maxReachable + 1
  // because we can make 0, 1, 2, ..., maxReachable
  return maxReachable + 1;
}
```

```java
// Time: O(n log n) due to sorting | Space: O(1) excluding sort space
import java.util.Arrays;

class Solution {
    public int getMaximumConsecutive(int[] coins) {
        /**
         * Returns the maximum number of consecutive integer values
         * starting from 0 that can be made using subsets of coins.
         */
        // Step 1: Sort coins to process smallest first
        Arrays.sort(coins);

        // Step 2: Initialize maxReachable as the highest value
        // we can make consecutively from 0
        int maxReachable = 0;

        // Step 3: Process each coin
        for (int coin : coins) {
            // If the current coin is greater than maxReachable + 1,
            // we have a gap and cannot make maxReachable + 1
            if (coin > maxReachable + 1) {
                break;
            }

            // Otherwise, we can extend our reachable range by adding this coin
            // We can now make all values from 0 to maxReachable + coin
            maxReachable += coin;
        }

        // Step 4: The number of consecutive values is maxReachable + 1
        // because we can make 0, 1, 2, ..., maxReachable
        return maxReachable + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the coins takes O(n log n) time.
- The single pass through the sorted array takes O(n) time.
- Dominated by sorting, so overall O(n log n).

**Space Complexity:** O(1) extra space (excluding space used by sorting)

- The algorithm uses only a few variables (`max_reachable`, loop index).
- If sorting is done in-place, no additional data structures are needed.
- Some languages may use O(log n) stack space for sorting, but that's implementation-dependent.

## Common Mistakes

1. **Forgetting to sort**: This is the most critical step. Without sorting, you might process a large coin early and incorrectly conclude you can't make small values. Always sort ascending.
2. **Incorrect gap condition**: Using `coin > max_reachable` instead of `coin > max_reachable + 1`. If `max_reachable = 5` and `coin = 6`, we can make 6 by using the coin alone, so we should continue. The correct check is whether we can make `max_reachable + 1`.

3. **Off-by-one in return value**: Returning `max_reachable` instead of `max_reachable + 1`. Remember: if you can make 0 through `max_reachable`, that's `max_reachable + 1` consecutive values.

4. **Not breaking early**: Continuing to process coins after finding a gap. Once `coin > max_reachable + 1`, no later coins can fill the gap (since they're sorted and thus larger), so you should break immediately.

## When You'll See This Pattern

This greedy "reachable range extension" pattern appears in problems where you need to build up a continuous range or cover intervals:

1. **Patching Array (Hard)**: Given a sorted array and a number `n`, find minimum patches (numbers) to add so that you can make all numbers 1 to `n`. Same core idea: maintain `max_reachable` and add patches when there's a gap.

2. **Minimum Number of Taps to Open to Water a Garden (Hard)**: Find minimum taps to cover [0, n]. While not identical, it uses similar range-extension thinking.

3. **Video Stitching (Medium)**: Select minimum clips to cover [0, time]. You maintain the farthest reachable point and greedily extend it.

The pattern is: **sort by starting point, maintain current reach, greedily extend with the best available option**.

## Key Takeaways

- **Sorting enables greedy**: When you need to build consecutive values, processing items in ascending order often reveals a simple greedy strategy.
- **Think in terms of reachable ranges**: Instead of tracking individual sums, maintain the maximum consecutive reachable value. This reduces state space dramatically.
- **Gap detection is key**: The condition `coin > max_reachable + 1` detects the first missing value. This is more efficient than checking each integer individually.

Related problems: [Patching Array](/problem/patching-array)
