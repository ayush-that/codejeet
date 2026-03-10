---
title: "How to Solve Best Time to Buy and Sell Stock IV — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock IV. Hard difficulty, 49.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-01-22"
category: "dsa-patterns"
tags: ["best-time-to-buy-and-sell-stock-iv", "array", "dynamic-programming", "hard"]
---

# How to Solve Best Time to Buy and Sell Stock IV

This problem asks us to find the maximum profit we can achieve by buying and selling a stock at most `k` times, given daily price data. What makes this problem tricky is that `k` can be large—up to 1000—and we need an efficient dynamic programming solution that handles both the transaction limit and the sequence of prices optimally. When `k` is very large, the problem effectively becomes "unlimited transactions" (like Best Time to Buy and Sell Stock II), but when `k` is small, we need careful state tracking.

## Visual Walkthrough

Let's trace through a small example: `prices = [3, 2, 6, 5, 0, 3]` with `k = 2`.

We want to make at most 2 complete transactions (buy then sell). Let's think about what decisions we make each day:

- Day 0: Price 3. We could buy (enter first transaction) or do nothing.
- Day 1: Price 2. If we haven't bought yet, buying at 2 is better than buying at 3.
- Day 2: Price 6. If we bought at 2, we could sell for profit 4.
- Day 3: Price 5. After selling at 6, we could buy again at 5 for a second transaction.
- Day 4: Price 0. If we bought at 5, we should wait rather than sell at a loss.
- Day 5: Price 3. Sell for profit 3 if we bought at 0.

One optimal path: Buy at 2, sell at 6 (profit 4). Buy at 0, sell at 3 (profit 3). Total profit = 7.

The challenge is systematically exploring all possibilities without exponential time. We need to track two things at each day: how many transactions we've completed, and whether we currently hold a stock.

## Brute Force Approach

A naive brute force would explore all possible sequences of buys and sells. For each day, we have choices:

1. If not holding stock: buy or skip
2. If holding stock: sell or skip

With `n` days and at most `k` transactions, this leads to roughly `O(2^(n))` possibilities—completely infeasible for `n` up to 1000.

Even a slightly better brute force that tries all combinations of buy-sell pairs would be `O(C(n, 2k))`, which is still exponential. We need a more structured approach.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with two states per day:

1. `dp[t][i]` = maximum profit with exactly `t` transactions completed by day `i`
2. Alternatively, we can track two arrays: `buy[t]` = max profit after `t` transactions and currently holding a stock, and `sell[t]` = max profit after `t` transactions and not holding stock.

The recurrence relation becomes:

- `buy[t][i] = max(buy[t][i-1], sell[t-1][i-1] - prices[i])`
  - Either keep holding from previous day, or buy today (using profits from previous transaction)
- `sell[t][i] = max(sell[t][i-1], buy[t][i-1] + prices[i])`
  - Either keep not holding from previous day, or sell today

We initialize `buy[0][0] = -prices[0]` (buy on first day for first transaction) and `sell[0][0] = 0`.

An important optimization: when `k >= n/2`, we can make as many transactions as we want (like Stock II problem), so we just sum all positive price differences.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * min(k, n)) | Space: O(min(k, n))
def maxProfit(k, prices):
    """
    Find maximum profit with at most k transactions.

    Args:
        k: Maximum number of transactions allowed
        prices: List of daily stock prices

    Returns:
        Maximum achievable profit
    """
    n = len(prices)

    # Edge case: no prices or no transactions allowed
    if n <= 1 or k == 0:
        return 0

    # Special case: if k >= n/2, we can make as many transactions as we want
    # This becomes the "unlimited transactions" problem (Best Time to Buy and Sell Stock II)
    if k >= n // 2:
        profit = 0
        for i in range(1, n):
            # Add profit whenever price increases from previous day
            if prices[i] > prices[i-1]:
                profit += prices[i] - prices[i-1]
        return profit

    # DP arrays: buy[j] = max profit with j transactions and currently holding stock
    #            sell[j] = max profit with j transactions and not holding stock
    # We only need arrays of size k+1 since we track by transaction count
    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)

    # Process each day's price
    for price in prices:
        # Process transactions in reverse to avoid using today's updated values
        # for earlier transactions (which would mean multiple transactions in one day)
        for j in range(1, k + 1):
            # Option 1: Buy today using profits from j-1 completed transactions
            # Option 2: Don't buy today, keep holding from previous state
            buy[j] = max(buy[j], sell[j-1] - price)

            # Option 1: Sell today, complete j-th transaction
            # Option 2: Don't sell today, keep not holding from previous state
            sell[j] = max(sell[j], buy[j] + price)

    # Maximum profit will be in sell[k] (all k transactions completed, not holding stock)
    return sell[k]
```

```javascript
// Time: O(n * min(k, n)) | Space: O(min(k, n))
function maxProfit(k, prices) {
  const n = prices.length;

  // Edge case: no prices or no transactions allowed
  if (n <= 1 || k === 0) {
    return 0;
  }

  // Special case: if k >= n/2, we can make unlimited transactions
  if (k >= n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) {
      // Add profit whenever price increases
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }

  // DP arrays: buy[j] = max profit with j transactions and holding stock
  //            sell[j] = max profit with j transactions and not holding stock
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  // Process each day's price
  for (let price of prices) {
    // Process in reverse to avoid using today's updated values for earlier transactions
    for (let j = k; j >= 1; j--) {
      // Update sell[j] first because it depends on buy[j] from previous iteration
      // Either sell today or keep not holding from before
      sell[j] = Math.max(sell[j], buy[j] + price);

      // Either buy today or keep holding from before
      // buy[j] uses sell[j-1] from previous day (not updated yet in reverse order)
      buy[j] = Math.max(buy[j], sell[j - 1] - price);
    }
  }

  // Maximum profit is with all k transactions completed and no stock held
  return sell[k];
}
```

```java
// Time: O(n * min(k, n)) | Space: O(min(k, n))
class Solution {
    public int maxProfit(int k, int[] prices) {
        int n = prices.length;

        // Edge case: no prices or no transactions allowed
        if (n <= 1 || k == 0) {
            return 0;
        }

        // Special case: if k >= n/2, we can make unlimited transactions
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                // Add profit whenever price increases
                if (prices[i] > prices[i - 1]) {
                    profit += prices[i] - prices[i - 1];
                }
            }
            return profit;
        }

        // DP arrays: buy[j] = max profit with j transactions and holding stock
        //            sell[j] = max profit with j transactions and not holding stock
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];

        // Initialize buy array to negative infinity (impossible state initially)
        for (int j = 0; j <= k; j++) {
            buy[j] = Integer.MIN_VALUE;
        }

        // Process each day's price
        for (int price : prices) {
            // Process in reverse to avoid using today's updated values for earlier transactions
            for (int j = k; j >= 1; j--) {
                // Update sell[j] first (depends on buy[j] from previous iteration)
                // Either sell today or keep not holding from before
                sell[j] = Math.max(sell[j], buy[j] + price);

                // Either buy today or keep holding from before
                // buy[j] uses sell[j-1] from previous day
                buy[j] = Math.max(buy[j], sell[j - 1] - price);
            }
        }

        // Maximum profit is with all k transactions completed and no stock held
        return sell[k];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * min(k, n))`

- The special case when `k >= n/2` runs in `O(n)` time (simple greedy).
- In the DP solution, we iterate through `n` prices, and for each price, we iterate through `k` transactions: `O(n * k)`.
- Since we use the special case when `k >= n/2`, the worst case is `k = n/2 - 1`, giving `O(n * n/2) = O(n²)`.
- However, in practice `k` is often much smaller than `n`.

**Space Complexity:** `O(min(k, n))`

- We only store two arrays of size `k+1`: `buy` and `sell`.
- The special case uses `O(1)` extra space.

## Common Mistakes

1. **Not handling the `k >= n/2` special case:** This leads to `O(n*k)` time which can be `O(n²)` when `k` is large. Always check if `k >= n/2` and use the greedy approach.

2. **Processing transactions in forward order:** If you process transactions 1..k in forward order, you might use today's updated `sell[j-1]` when calculating `buy[j]`, which would mean buying and selling on the same day (multiple transactions in one day). Always process in reverse order.

3. **Incorrect initialization:** Forgetting to initialize `buy[0] = -prices[0]` or initializing all `buy[j]` to 0 instead of negative infinity. You need negative infinity to represent impossible states initially.

4. **Off-by-one in transaction counting:** Remember that `buy[j]` represents the state _during_ the j-th transaction (stock is held), while `sell[j]` represents _after completing_ j transactions. The indices should go from 0 to k.

## When You'll See This Pattern

This type of **state machine DP** appears in many sequence decision problems:

1. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309):** Similar state tracking (hold, sold, cooldown) but with different transitions.

2. **Best Time to Buy and Sell Stock with Transaction Fee (LeetCode 714):** Same state machine but with a fee subtracted on each transaction.

3. **House Robber (LeetCode 198) and House Robber II (LeetCode 213):** Similar DP with states (rob, don't rob) at each house.

The pattern is: when you have a sequence of decisions with limited "actions" (transactions, robberies, etc.), and each decision affects future possibilities, consider DP with states representing different "modes" you can be in.

## Key Takeaways

1. **State machine DP** is powerful for sequence decision problems with constraints. Define states based on what matters for future decisions (e.g., "holding stock" vs "not holding").

2. **Optimize for large k** by recognizing when constraints become irrelevant. If `k >= n/2`, you effectively have unlimited transactions.

3. **Process in reverse order** when today's decision affects multiple states to avoid using partially updated information.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Best Time to Buy and Sell Stock II](/problem/best-time-to-buy-and-sell-stock-ii), [Best Time to Buy and Sell Stock III](/problem/best-time-to-buy-and-sell-stock-iii)
