---
title: "How to Solve Best Time to Buy and Sell Stock III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock III. Hard difficulty, 53.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-10-29"
category: "dsa-patterns"
tags: ["best-time-to-buy-and-sell-stock-iii", "array", "dynamic-programming", "hard"]
---

# How to Solve Best Time to Buy and Sell Stock III

This problem asks us to maximize profit from stock trading with a twist: we can complete **at most two transactions**. This constraint makes it significantly more complex than the basic "one transaction" version. The challenge lies in tracking two separate buy-sell opportunities while ensuring they don't overlap. We need to find the optimal combination of two non-overlapping trades that yields maximum profit.

## Visual Walkthrough

Let's trace through example `prices = [3, 3, 5, 0, 0, 3, 1, 4]` step by step:

**Key Insight:** We can think of this as finding the best single transaction before day `i` and the best single transaction after day `i`, then combining them.

1. **First, calculate maximum profit from one transaction ending at or before each day:**
   - Day 0: No transaction possible → 0
   - Day 1: Max profit = max(0, 3-3) = 0
   - Day 2: Max profit = max(0, 5-3) = 2
   - Day 3: Min price becomes 0, but no profit yet → 2
   - Day 4: Still min price 0 → 2
   - Day 5: Max profit = max(2, 3-0) = 3
   - Day 6: Max profit = max(3, 1-0) = 3
   - Day 7: Max profit = max(3, 4-0) = 4

   So `leftProfits = [0, 0, 2, 2, 2, 3, 3, 4]`

2. **Now calculate maximum profit from one transaction starting at or after each day:**
   - Day 7: No transaction possible → 0
   - Day 6: Max profit = max(0, 4-1) = 3
   - Day 5: Max profit = max(3, 4-3) = 3
   - Day 4: Max price becomes 4 → max(3, 4-0) = 4
   - Day 3: Max price still 4 → max(4, 4-0) = 4
   - Day 2: Max price still 4 → max(4, 4-5) = 4
   - Day 1: Max price still 4 → max(4, 4-3) = 4
   - Day 0: Max price still 4 → max(4, 4-3) = 4

   So `rightProfits = [4, 4, 4, 4, 4, 3, 3, 0]`

3. **Combine profits by finding the best split point:**
   - Split after day 0: left[0] + right[1] = 0 + 4 = 4
   - Split after day 1: left[1] + right[2] = 0 + 4 = 4
   - Split after day 2: left[2] + right[3] = 2 + 4 = 6
   - Split after day 3: left[3] + right[4] = 2 + 4 = 6
   - Split after day 4: left[4] + right[5] = 2 + 3 = 5
   - Split after day 5: left[5] + right[6] = 3 + 3 = 6
   - Split after day 6: left[6] + right[7] = 3 + 0 = 3

   Maximum combined profit = 6 (buy at 3, sell at 5; then buy at 0, sell at 4)

## Brute Force Approach

A naive approach would try all possible combinations of two transactions:

1. Try every possible first buy day `i` and first sell day `j` (where `i < j`)
2. For each first transaction, try every possible second buy day `k` and sell day `l` (where `j < k < l`)
3. Calculate total profit and track maximum

This leads to O(n⁴) time complexity, which is completely impractical for typical constraints (n up to 10⁵).

Even a slightly better brute force would try all possible split points where the first transaction ends before the second begins:

- For each split point `i` (0 to n-1), find best transaction in `prices[0:i]` and best transaction in `prices[i:n]`
- Finding each best transaction takes O(n) time, leading to O(n²) total

While O(n²) might work for small n, it's still too slow for the problem's constraints.

## Optimized Approach

The key insight is that we can precompute the best possible profit for:

1. **One transaction ending at or before each day** (left to right scan)
2. **One transaction starting at or after each day** (right to left scan)

Then we can combine these at every possible split point in O(n) time.

**Left-to-right scan:** Track the minimum price seen so far. For each day, calculate the maximum profit if we sell on that day (current price minus minimum so far), and keep the running maximum.

**Right-to-left scan:** Track the maximum price seen in the future. For each day, calculate the maximum profit if we buy on that day (maximum future price minus current price), and keep the running maximum from the right.

**Combination:** For each split point `i`, total profit = `leftProfit[i] + rightProfit[i+1]`. The maximum of these is our answer.

This approach works because any two non-overlapping transactions must have a split point between them where the first ends and the second begins.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxProfit(prices):
    """
    Calculate maximum profit with at most two transactions.

    Approach:
    1. First pass: Calculate max profit for one transaction ending at/before each day
    2. Second pass: Calculate max profit for one transaction starting at/after each day
    3. Combine at each split point to find maximum total profit
    """
    n = len(prices)
    if n < 2:
        return 0

    # Step 1: Calculate max profit for one transaction ending at/before each day
    left_profits = [0] * n
    min_price = prices[0]

    for i in range(1, n):
        # Update minimum price seen so far
        min_price = min(min_price, prices[i])
        # Max profit is either previous max or selling today at min price
        left_profits[i] = max(left_profits[i-1], prices[i] - min_price)

    # Step 2: Calculate max profit for one transaction starting at/after each day
    right_profits = [0] * n
    max_price = prices[-1]

    for i in range(n-2, -1, -1):
        # Update maximum price seen in the future
        max_price = max(max_price, prices[i])
        # Max profit is either future max or buying today and selling at max future price
        right_profits[i] = max(right_profits[i+1], max_price - prices[i])

    # Step 3: Find maximum combined profit
    max_profit = 0
    for i in range(n):
        # For split at position i: left includes up to i, right starts from i+1
        left = left_profits[i]
        right = right_profits[i] if i < n-1 else 0
        max_profit = max(max_profit, left + right)

    return max_profit
```

```javascript
// Time: O(n) | Space: O(n)
function maxProfit(prices) {
  /**
   * Calculate maximum profit with at most two transactions.
   *
   * Approach:
   * 1. First pass: Calculate max profit for one transaction ending at/before each day
   * 2. Second pass: Calculate max profit for one transaction starting at/after each day
   * 3. Combine at each split point to find maximum total profit
   */
  const n = prices.length;
  if (n < 2) return 0;

  // Step 1: Calculate max profit for one transaction ending at/before each day
  const leftProfits = new Array(n).fill(0);
  let minPrice = prices[0];

  for (let i = 1; i < n; i++) {
    // Update minimum price seen so far
    minPrice = Math.min(minPrice, prices[i]);
    // Max profit is either previous max or selling today at min price
    leftProfits[i] = Math.max(leftProfits[i - 1], prices[i] - minPrice);
  }

  // Step 2: Calculate max profit for one transaction starting at/after each day
  const rightProfits = new Array(n).fill(0);
  let maxPrice = prices[n - 1];

  for (let i = n - 2; i >= 0; i--) {
    // Update maximum price seen in the future
    maxPrice = Math.max(maxPrice, prices[i]);
    // Max profit is either future max or buying today and selling at max future price
    rightProfits[i] = Math.max(rightProfits[i + 1], maxPrice - prices[i]);
  }

  // Step 3: Find maximum combined profit
  let maxProfit = 0;
  for (let i = 0; i < n; i++) {
    // For split at position i: left includes up to i, right starts from i+1
    const left = leftProfits[i];
    const right = i < n - 1 ? rightProfits[i + 1] : 0;
    maxProfit = Math.max(maxProfit, left + right);
  }

  return maxProfit;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maxProfit(int[] prices) {
        /**
         * Calculate maximum profit with at most two transactions.
         *
         * Approach:
         * 1. First pass: Calculate max profit for one transaction ending at/before each day
         * 2. Second pass: Calculate max profit for one transaction starting at/after each day
         * 3. Combine at each split point to find maximum total profit
         */
        int n = prices.length;
        if (n < 2) return 0;

        // Step 1: Calculate max profit for one transaction ending at/before each day
        int[] leftProfits = new int[n];
        int minPrice = prices[0];

        for (int i = 1; i < n; i++) {
            // Update minimum price seen so far
            minPrice = Math.min(minPrice, prices[i]);
            // Max profit is either previous max or selling today at min price
            leftProfits[i] = Math.max(leftProfits[i-1], prices[i] - minPrice);
        }

        // Step 2: Calculate max profit for one transaction starting at/after each day
        int[] rightProfits = new int[n];
        int maxPrice = prices[n-1];

        for (int i = n-2; i >= 0; i--) {
            // Update maximum price seen in the future
            maxPrice = Math.max(maxPrice, prices[i]);
            // Max profit is either future max or buying today and selling at max future price
            rightProfits[i] = Math.max(rightProfits[i+1], maxPrice - prices[i]);
        }

        // Step 3: Find maximum combined profit
        int maxProfit = 0;
        for (int i = 0; i < n; i++) {
            // For split at position i: left includes up to i, right starts from i+1
            int left = leftProfits[i];
            int right = (i < n-1) ? rightProfits[i+1] : 0;
            maxProfit = Math.max(maxProfit, left + right);
        }

        return maxProfit;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make three passes through the array:
  1. Left-to-right scan: O(n)
  2. Right-to-left scan: O(n)
  3. Combination scan: O(n)
- Total: O(3n) = O(n)

**Space Complexity:** O(n)

- We store two arrays of size n: `leftProfits` and `rightProfits`
- This could be optimized to O(1) with a more complex state machine approach, but O(n) is typically acceptable and easier to understand

## Common Mistakes

1. **Incorrect split point handling:** Some candidates try to combine `leftProfits[i] + rightProfits[i]` instead of `leftProfits[i] + rightProfits[i+1]`. Remember: if the first transaction ends at day `i`, the second must start at day `i+1` or later.

2. **Forgetting edge cases:** Empty array or single element array should return 0 profit. Always check `if n < 2: return 0` at the beginning.

3. **Confusing index boundaries in right-to-left scan:** When scanning from right to left, we need to start at `n-2` (not `n-1`) since there's no transaction possible on the last day when looking forward.

4. **Not considering the possibility of one transaction:** The maximum profit might come from just one transaction. Our solution handles this because `leftProfits[n-1]` gives the best single transaction profit, and we compare it against all two-transaction combinations.

## When You'll See This Pattern

This "split array and combine results" pattern appears in several problems:

1. **Maximum Subarray Sum with at most K elements:** Similar split-and-combine logic for constrained subarray problems.

2. **Trapping Rain Water:** Uses left-to-right and right-to-left scans to compute maximum heights, then combines them.

3. **Product of Array Except Self:** Requires left-to-right and right-to-left passes to compute products without division.

4. **Best Time to Buy and Sell Stock IV:** This problem is a generalization where we can make at most K transactions. The solution uses dynamic programming with state tracking.

## Key Takeaways

1. **When dealing with constrained transactions (at most K), think about splitting the timeline:** Each transaction creates a natural division point in the array.

2. **Precomputation scans (left-to-right and right-to-left) are powerful:** They let us answer "best up to here" and "best from here" queries efficiently.

3. **The two-transaction case often has simpler solutions than K transactions:** For exactly two transactions, the split-point approach with O(n) time and O(n) space is optimal and intuitive. For K transactions, you'd typically need O(kn) time with dynamic programming.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Best Time to Buy and Sell Stock II](/problem/best-time-to-buy-and-sell-stock-ii), [Best Time to Buy and Sell Stock IV](/problem/best-time-to-buy-and-sell-stock-iv)
