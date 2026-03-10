---
title: "How to Solve Best Time to Buy and Sell Stock II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock II. Medium difficulty, 70.8% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2026-04-03"
category: "dsa-patterns"
tags: ["best-time-to-buy-and-sell-stock-ii", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Best Time to Buy and Sell Stock II

This problem asks you to maximize profit from buying and selling a stock multiple times, with the constraint that you can hold at most one share at any time. The twist is that you can make multiple transactions—buying and selling on the same day is allowed—which makes it more interesting than the single-transaction version. The challenge is recognizing that you don't need to track complex state; the optimal strategy is surprisingly simple.

## Visual Walkthrough

Let's trace through example `prices = [7, 1, 5, 3, 6, 4]`:

**Day 0:** Price = 7. No action yet.

**Day 1:** Price = 1 (down from 7). If we had bought at 7, we'd be losing money. Better to wait or buy at 1.

**Day 2:** Price = 5 (up from 1). If we bought at 1 and sell at 5, profit = 4. We can make this transaction.

**Day 3:** Price = 3 (down from 5). If we sold at 5, we're out of the market. Price dropped to 3—could be a new buying opportunity.

**Day 4:** Price = 6 (up from 3). If we bought at 3 and sell at 6, profit = 3. Total profit so far: 4 + 3 = 7.

**Day 5:** Price = 4 (down from 6). No profitable sale from last buy at 3.

**Key insight:** Notice that the total profit (7) equals the sum of all positive price increases: (5-1) + (6-3) = 4 + 3 = 7. The drops (7→1, 5→3, 6→4) don't matter because we simply avoid those transactions.

This leads to the greedy approach: **Add up every price increase from one day to the next**. If tomorrow's price is higher than today's, we "buy" today and "sell" tomorrow, capturing that profit.

## Brute Force Approach

A naive approach would try all possible combinations of buy/sell decisions. For each day, you could be in one of two states: holding a stock or not holding a stock. From each state, you have choices: buy, sell, or do nothing. This leads to exponential time complexity O(2ⁿ) as you explore all decision paths.

While you could implement this with recursion or backtracking, it's clearly impractical for large inputs. Even for n=1000, 2¹⁰⁰⁰ is astronomically large. Candidates sometimes try to adapt the O(n²) brute force from the single-transaction problem by checking every pair of days, but with multiple transactions, you'd need to consider all possible partitions of transactions, which is also exponential.

The brute force helps us understand the problem structure but isn't viable. We need to find patterns in optimal behavior.

## Optimized Approach

The key insight comes from realizing that the total maximum profit equals the sum of all **local** profits. Here's the reasoning:

1. **No overlapping holdings**: You can't hold multiple shares, so transactions must be non-overlapping.
2. **Price increases are opportunities**: Whenever the price increases from one day to the next, that increase represents potential profit.
3. **You can capture all increases**: Since you can buy and sell on consecutive days, you can capture every price increase.
4. **Drops don't hurt**: Price decreases don't force you to lose money—you simply don't participate in those periods.

Mathematically: If you buy at price A and sell at price B, then buy at price C and sell at price D (with B ≤ C for non-overlapping), your profit is (B-A)+(D-C). But if B > C, you could have just bought at A and sold at D for profit D-A, which is larger or equal. This shows that the optimal strategy is to capture every upward movement.

Thus, the algorithm becomes simple: **Iterate through the array, and whenever today's price is higher than yesterday's, add the difference to total profit.**

## Optimal Solution

Here's the implementation of the greedy approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProfit(prices):
    """
    Calculate maximum profit from multiple buy/sell transactions.

    The key insight is that we can capture every price increase:
    - If price tomorrow > price today, we buy today and sell tomorrow
    - This is equivalent to summing all positive differences between consecutive days

    Args:
        prices: List of stock prices for each day

    Returns:
        Maximum possible profit
    """
    total_profit = 0

    # Start from day 1 (index 1) since we compare each day with previous day
    for i in range(1, len(prices)):
        # If today's price is higher than yesterday's, we can profit
        if prices[i] > prices[i - 1]:
            # Add the price increase to our total profit
            # This is equivalent to buying yesterday and selling today
            total_profit += prices[i] - prices[i - 1]

    return total_profit
```

```javascript
// Time: O(n) | Space: O(1)
function maxProfit(prices) {
  /**
   * Calculate maximum profit from multiple buy/sell transactions.
   *
   * The key insight is that we can capture every price increase:
   * - If price tomorrow > price today, we buy today and sell tomorrow
   * - This is equivalent to summing all positive differences between consecutive days
   *
   * @param {number[]} prices - Array of stock prices for each day
   * @return {number} Maximum possible profit
   */
  let totalProfit = 0;

  // Start from day 1 (index 1) since we compare each day with previous day
  for (let i = 1; i < prices.length; i++) {
    // If today's price is higher than yesterday's, we can profit
    if (prices[i] > prices[i - 1]) {
      // Add the price increase to our total profit
      // This is equivalent to buying yesterday and selling today
      totalProfit += prices[i] - prices[i - 1];
    }
  }

  return totalProfit;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxProfit(int[] prices) {
        /**
         * Calculate maximum profit from multiple buy/sell transactions.
         *
         * The key insight is that we can capture every price increase:
         * - If price tomorrow > price today, we buy today and sell tomorrow
         * - This is equivalent to summing all positive differences between consecutive days
         *
         * @param prices Array of stock prices for each day
         * @return Maximum possible profit
         */
        int totalProfit = 0;

        // Start from day 1 (index 1) since we compare each day with previous day
        for (int i = 1; i < prices.length; i++) {
            // If today's price is higher than yesterday's, we can profit
            if (prices[i] > prices[i - 1]) {
                // Add the price increase to our total profit
                // This is equivalent to buying yesterday and selling today
                totalProfit += prices[i] - prices[i - 1];
            }
        }

        return totalProfit;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, comparing each element with its predecessor.
- The loop runs (n-1) times where n is the length of prices.
- Each iteration does constant work: one comparison and possibly one addition.

**Space Complexity: O(1)**

- We only use a fixed number of variables: `totalProfit` and loop index `i`.
- No additional data structures scale with input size.
- This is optimal as we cannot solve the problem without at least reading the input.

## Common Mistakes

1. **Overcomplicating with state tracking**: Some candidates try to maintain variables for current buy price, sell price, or transaction count. This adds unnecessary complexity. Remember: you don't need to track when you buy/sell, only the total profit.

2. **Missing the greedy insight**: Candidates familiar with the single-transaction version (where you find min price and max profit) might try to adapt that approach by finding multiple local minima and maxima. While this works, it's more complex and error-prone than simply summing positive differences.

3. **Off-by-one errors**: Starting the loop at index 0 instead of 1 leads to comparing `prices[0]` with `prices[-1]` (in Python) or undefined behavior. Always verify loop bounds when comparing consecutive elements.

4. **Not handling edge cases**: While the code handles most cases, always consider:
   - Empty array or single price: Should return 0 profit (loop doesn't execute)
   - Continuously decreasing prices: All differences negative, profit = 0
   - Continuously increasing prices: Sum all differences = last price - first price

## When You'll See This Pattern

This "sum positive differences" pattern appears in problems where you can capture local improvements without affecting future opportunities:

1. **Maximum Subarray (Kadane's Algorithm)**: While not identical, both involve scanning an array and making optimal local decisions that lead to a global optimum.

2. **Best Time to Buy and Sell Stock with Transaction Fee**: Similar structure but with a fee per transaction, requiring slight modification to the greedy approach.

3. **Best Time to Buy and Sell Stock with Cooldown**: A variation where you need to wait one day after selling before buying again—this requires dynamic programming instead of simple greedy.

4. **Array Partition Problems**: Problems where you break an array into segments and optimize some metric often use similar local decision-making.

## Key Takeaways

1. **Greedy works when local optima lead to global optimum**: If you can prove that making the best local decision at each step yields the globally optimal solution, a greedy approach is often simplest and most efficient.

2. **Look for patterns in price movements**: Instead of tracking complex transaction states, recognize that profit comes from price increases. Summing all positive day-to-day changes gives maximum profit.

3. **Simplify the problem statement**: "Buy and sell multiple times" sounds complex, but it's equivalent to "capture every price increase." Restating the problem in simpler terms often reveals the solution.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Best Time to Buy and Sell Stock III](/problem/best-time-to-buy-and-sell-stock-iii), [Best Time to Buy and Sell Stock IV](/problem/best-time-to-buy-and-sell-stock-iv)
