---
title: "How to Solve Best Time to Buy and Sell Stock with Transaction Fee — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock with Transaction Fee. Medium difficulty, 71.7% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2027-03-31"
category: "dsa-patterns"
tags:
  [
    "best-time-to-buy-and-sell-stock-with-transaction-fee",
    "array",
    "dynamic-programming",
    "greedy",
    "medium",
  ]
---

# How to Solve Best Time to Buy and Sell Stock with Transaction Fee

This problem asks us to maximize profit from stock trading where we can make unlimited transactions, but each transaction (buy + sell pair) incurs a fixed fee. The tricky part is balancing when to hold versus sell when each sale reduces profit by the fee amount. Unlike simpler versions, we can't just buy low and sell high every day—the fee means some potential gains aren't worth taking.

## Visual Walkthrough

Let's trace through `prices = [1, 3, 2, 8, 4, 9]` with `fee = 2`:

**Day 0 (price = 1):** We start with no stock. Best choice: buy at 1. Cash after buying: -1 (we spent $1). Profit if we hold: -1.

**Day 1 (price = 3):** Two options:

1. **Sell stock bought at 1:** Profit = 3 - 1 - 2(fee) = 0. Cash becomes 0.
2. **Hold:** Still have -1 cash from purchase.

Better to hold since selling gives 0 profit, same as not buying at all.

**Day 2 (price = 2):** Still holding stock bought at 1. Selling now: 2 - 1 - 2 = -1 (loss). Definitely hold.

**Day 3 (price = 8):** Sell: 8 - 1 - 2 = 5 profit. Cash becomes 5. This is better than holding at -1.

**Day 4 (price = 4):** Now with 5 cash, no stock. Buy at 4? Cash becomes 5 - 4 = 1.

**Day 5 (price = 9):** Sell stock bought at 4: 9 - 4 - 2 = 3 profit. Total cash = 1 + 3 = 4.

But wait—could we have done better? What if we held from day 1 to day 5? Let's check: Buy at 1, sell at 9: 9 - 1 - 2 = 6 profit. That's better than 4! Our mistake was selling too early at day 3.

This shows we need a systematic way to track two states at each day: cash with no stock, and cash with stock.

## Brute Force Approach

A brute force approach would explore all possible sequences of buy/sell decisions. At each day, if we don't own stock, we can either buy or skip. If we own stock, we can either sell or hold. This creates a binary decision tree with 2^n possibilities.

```python
def maxProfitBrute(prices, fee):
    def dfs(day, has_stock):
        if day == len(prices):
            return 0

        # Option 1: Do nothing today
        profit = dfs(day + 1, has_stock)

        # Option 2: Take action
        if has_stock:
            # Sell today
            profit = max(profit, prices[day] - fee + dfs(day + 1, False))
        else:
            # Buy today
            profit = max(profit, -prices[day] + dfs(day + 1, True))

        return profit

    return dfs(0, False)
```

This recursive solution explores all possibilities but has exponential time complexity O(2^n), which is impractical for large inputs. We need to optimize by recognizing overlapping subproblems—the classic sign that dynamic programming can help.

## Optimized Approach

The key insight is that at any day `i`, we only need to track two states:

1. `cash` (or `sold`): Maximum profit if we don't hold any stock at the end of day `i`
2. `hold` (or `bought`): Maximum profit if we hold stock at the end of day `i`

We update these states day by day:

- **`cash` update**: Either we already had cash from yesterday, or we sold stock today (yesterday's `hold` + today's price - fee)
- **`hold` update**: Either we already held from yesterday, or we bought stock today (yesterday's `cash` - today's price)

The recurrence relation:

```
cash[i] = max(cash[i-1], hold[i-1] + prices[i] - fee)
hold[i] = max(hold[i-1], cash[i-1] - prices[i])
```

We start with:

- `cash[0] = 0` (no stock, no profit)
- `hold[0] = -prices[0]` (bought on day 0)

The final answer is `cash[n-1]` since we want to end with no stock.

This is essentially a state machine with two states, updated greedily at each step. The space can be optimized to O(1) since we only need yesterday's values.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n = len(prices)
# Space: O(1) - we only store two variables
def maxProfit(prices, fee):
    """
    Calculate maximum profit with transaction fee.

    We maintain two states:
    - cash: max profit if we don't hold stock today
    - hold: max profit if we hold stock today

    At each day, we update both states based on:
    1. If we don't hold stock: either we didn't hold yesterday (cash stays same),
       or we sold today (hold from yesterday + today's price - fee)
    2. If we hold stock: either we held yesterday (hold stays same),
       or we bought today (cash from yesterday - today's price)
    """
    if not prices:
        return 0

    # Initialize: day 0
    cash = 0           # No stock on day 0, profit = 0
    hold = -prices[0]  # Buy stock on day 0, profit = -price[0]

    # Process each day starting from day 1
    for i in range(1, len(prices)):
        # Store previous cash value before updating (needed for hold calculation)
        prev_cash = cash

        # Update cash: max of keeping cash or selling stock we held
        cash = max(cash, hold + prices[i] - fee)

        # Update hold: max of keeping hold or buying stock with today's cash
        hold = max(hold, prev_cash - prices[i])

    # We want to end with no stock (cash state)
    return cash
```

```javascript
// Time: O(n) where n = prices.length
// Space: O(1) - we only store two variables
function maxProfit(prices, fee) {
  /**
   * Calculate maximum profit with transaction fee.
   *
   * We maintain two states:
   * - cash: max profit if we don't hold stock today
   * - hold: max profit if we hold stock today
   *
   * At each day, we update both states based on:
   * 1. If we don't hold stock: either we didn't hold yesterday (cash stays same),
   *    or we sold today (hold from yesterday + today's price - fee)
   * 2. If we hold stock: either we held yesterday (hold stays same),
   *    or we bought today (cash from yesterday - today's price)
   */
  if (!prices || prices.length === 0) {
    return 0;
  }

  // Initialize: day 0
  let cash = 0; // No stock on day 0, profit = 0
  let hold = -prices[0]; // Buy stock on day 0, profit = -price[0]

  // Process each day starting from day 1
  for (let i = 1; i < prices.length; i++) {
    // Store previous cash value before updating (needed for hold calculation)
    const prevCash = cash;

    // Update cash: max of keeping cash or selling stock we held
    cash = Math.max(cash, hold + prices[i] - fee);

    // Update hold: max of keeping hold or buying stock with today's cash
    hold = Math.max(hold, prevCash - prices[i]);
  }

  // We want to end with no stock (cash state)
  return cash;
}
```

```java
// Time: O(n) where n = prices.length
// Space: O(1) - we only store two variables
class Solution {
    public int maxProfit(int[] prices, int fee) {
        /**
         * Calculate maximum profit with transaction fee.
         *
         * We maintain two states:
         * - cash: max profit if we don't hold stock today
         * - hold: max profit if we hold stock today
         *
         * At each day, we update both states based on:
         * 1. If we don't hold stock: either we didn't hold yesterday (cash stays same),
         *    or we sold today (hold from yesterday + today's price - fee)
         * 2. If we hold stock: either we held yesterday (hold stays same),
         *    or we bought today (cash from yesterday - today's price)
         */
        if (prices == null || prices.length == 0) {
            return 0;
        }

        // Initialize: day 0
        int cash = 0;           // No stock on day 0, profit = 0
        int hold = -prices[0];  // Buy stock on day 0, profit = -price[0]

        // Process each day starting from day 1
        for (int i = 1; i < prices.length; i++) {
            // Store previous cash value before updating (needed for hold calculation)
            int prevCash = cash;

            // Update cash: max of keeping cash or selling stock we held
            cash = Math.max(cash, hold + prices[i] - fee);

            // Update hold: max of keeping hold or buying stock with today's cash
            hold = Math.max(hold, prevCash - prices[i]);
        }

        // We want to end with no stock (cash state)
        return cash;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of days. We iterate through the prices array once, performing constant-time operations at each step.

**Space Complexity:** O(1). We only use two variables (`cash` and `hold`) regardless of input size. Even if we used an array to store all intermediate states (which we don't need), it would be O(n), but the optimized version uses O(1).

## Common Mistakes

1. **Forgetting to store previous cash value**: When updating `hold`, you need the `cash` value from _before_ the current day's update. Using the updated `cash` would mean buying and selling on the same day, which isn't allowed.

2. **Incorrect initialization**: Starting both `cash` and `hold` at 0 misses the option to buy on day 0. `hold` should start at `-prices[0]` to represent buying on the first day.

3. **Applying fee incorrectly**: The fee applies per transaction (buy + sell), but we only deduct it when selling. Some candidates try to apply it when buying too, which double-counts the fee.

4. **Returning wrong final state**: The maximum profit should be when we don't hold any stock at the end, so we return `cash`, not `max(cash, hold)`. Holding stock at the end means unrealized gains that could turn into losses.

## When You'll See This Pattern

This "two-state dynamic programming" pattern appears in many stock trading problems:

1. **Best Time to Buy and Sell Stock II (No. 122)**: Similar but without transaction fees. The solution is simpler—just add all positive differences.

2. **Best Time to Buy and Sell Stock with Cooldown (No. 309)**: Adds a cooldown day after selling. Requires three states instead of two.

3. **Best Time to Buy and Sell Stock IV (No. 188)**: Limits to k transactions. Uses a 2D DP array where one dimension tracks transaction count.

The core pattern is maintaining states representing different portfolio situations and updating them based on allowed actions. When you see a problem with sequential decisions and multiple states, think about what minimal information you need to track at each step.

## Key Takeaways

1. **State machine thinking**: Many DP problems can be framed as state machines. Identify the minimal set of states needed to make optimal decisions at each step.

2. **Space optimization**: When the recurrence only depends on the previous state(s), you can often reduce space from O(n) to O(1) by only storing the most recent values.

3. **Transaction cost handling**: Fees or taxes are typically applied at the selling point in these problems. Think about when the cost actually impacts your profit calculation.

Related problems: [Best Time to Buy and Sell Stock II](/problem/best-time-to-buy-and-sell-stock-ii)
