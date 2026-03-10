---
title: "How to Solve Best Time to Buy and Sell Stock using Strategy — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock using Strategy. Medium difficulty, 59.8% acceptance rate. Topics: Array, Sliding Window, Prefix Sum."
date: "2027-04-02"
category: "dsa-patterns"
tags:
  [
    "best-time-to-buy-and-sell-stock-using-strategy",
    "array",
    "sliding-window",
    "prefix-sum",
    "medium",
  ]
---

# How to Solve Best Time to Buy and Sell Stock using Strategy

This problem puts a twist on the classic stock trading problem by introducing a predetermined trading strategy. Instead of deciding when to buy and sell for maximum profit, you're given a strategy array that tells you exactly when to buy, hold, or sell. The challenge is calculating your total profit while correctly tracking your stock holdings and cash balance. What makes this interesting is that you need to handle the sequence of operations properly—you can only sell if you own stock, and you can only buy if you have cash available.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
prices = [7, 1, 5, 3, 6, 4]
strategy = [-1, 0, 1, -1, 0, 1]
```

**Day-by-day execution:**

- **Day 0:** Price = 7, Strategy = -1 (BUY)
  - Buy 1 unit at price 7
  - Cash: -7 (we spent 7)
  - Holdings: 1 unit

- **Day 1:** Price = 1, Strategy = 0 (HOLD)
  - Do nothing
  - Cash: -7
  - Holdings: 1 unit

- **Day 2:** Price = 5, Strategy = 1 (SELL)
  - Sell 1 unit at price 5
  - Cash: -7 + 5 = -2
  - Holdings: 0 units

- **Day 3:** Price = 3, Strategy = -1 (BUY)
  - Buy 1 unit at price 3
  - Cash: -2 - 3 = -5
  - Holdings: 1 unit

- **Day 4:** Price = 6, Strategy = 0 (HOLD)
  - Do nothing
  - Cash: -5
  - Holdings: 1 unit

- **Day 5:** Price = 4, Strategy = 1 (SELL)
  - Sell 1 unit at price 4
  - Cash: -5 + 4 = -1
  - Holdings: 0 units

**Final profit:** -1 (we lost 1 unit of cash overall)

The key insight is that we need to track both our cash balance and how many stocks we currently own. We can only execute a sell operation if we have at least one stock, and we can always execute a buy operation (we assume we have enough cash or can go into negative balance).

## Brute Force Approach

A brute force approach isn't really applicable here since the problem is inherently linear—we must process each day in order. However, a naive implementation might try to calculate profit in complex ways or use nested loops unnecessarily.

The straightforward approach is to simulate the trading day by day:

1. Initialize cash balance to 0 and holdings to 0
2. For each day i:
   - If strategy[i] == -1 (BUY):
     - Subtract prices[i] from cash
     - Add 1 to holdings
   - If strategy[i] == 1 (SELL) and holdings > 0:
     - Add prices[i] to cash
     - Subtract 1 from holdings
   - If strategy[i] == 0 (HOLD): do nothing

This is actually the optimal approach for this problem! The "brute force" thinking here would be overcomplicating it—trying to precompute profits or use complex data structures when simple simulation works perfectly.

## Optimized Approach

The key insight is that this is a **simulation problem** that requires tracking state. We need to maintain two pieces of information:

1. Our current cash balance (which can be negative if we've spent more than we've earned)
2. How many stocks we currently own

The optimal approach processes the arrays sequentially, updating our state based on the strategy at each day. This is essentially a **state machine** with two states (cash and holdings) that transition based on the strategy input.

**Step-by-step reasoning:**

1. Start with 0 cash and 0 holdings
2. For each day from first to last:
   - If strategy says BUY (-1):
     - Pay the current price (cash decreases)
     - Gain one stock (holdings increases)
   - If strategy says SELL (1) AND we have stock:
     - Receive the current price (cash increases)
     - Lose one stock (holdings decreases)
   - If strategy says HOLD (0):
     - Do nothing (state remains unchanged)
3. At the end, return the cash balance (which represents total profit/loss)

Note: We can sell only if we have stock, but we can always buy (the problem doesn't restrict buying based on available cash).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def calculateProfit(prices, strategy):
    """
    Calculate total profit from following the given trading strategy.

    Args:
        prices: List of stock prices for each day
        strategy: List of trading actions (-1=buy, 0=hold, 1=sell)

    Returns:
        Total profit/loss after executing all trades
    """
    cash = 0  # Current cash balance (can be negative)
    holdings = 0  # Number of stocks currently owned

    # Process each day's price and strategy
    for i in range(len(prices)):
        if strategy[i] == -1:  # BUY signal
            # Buy one unit at current price
            cash -= prices[i]  # Pay for the stock
            holdings += 1  # Add to inventory
        elif strategy[i] == 1 and holdings > 0:  # SELL signal and we have stock
            # Sell one unit at current price
            cash += prices[i]  # Receive money from sale
            holdings -= 1  # Remove from inventory
        # For strategy[i] == 0 (HOLD), do nothing

    # Final cash balance represents total profit/loss
    return cash
```

```javascript
// Time: O(n) | Space: O(1)
function calculateProfit(prices, strategy) {
  /**
   * Calculate total profit from following the given trading strategy.
   *
   * @param {number[]} prices - Stock prices for each day
   * @param {number[]} strategy - Trading actions (-1=buy, 0=hold, 1=sell)
   * @return {number} Total profit/loss after executing all trades
   */
  let cash = 0; // Current cash balance (can be negative)
  let holdings = 0; // Number of stocks currently owned

  // Process each day's price and strategy
  for (let i = 0; i < prices.length; i++) {
    if (strategy[i] === -1) {
      // BUY signal
      // Buy one unit at current price
      cash -= prices[i]; // Pay for the stock
      holdings += 1; // Add to inventory
    } else if (strategy[i] === 1 && holdings > 0) {
      // SELL signal and we have stock
      // Sell one unit at current price
      cash += prices[i]; // Receive money from sale
      holdings -= 1; // Remove from inventory
    }
    // For strategy[i] === 0 (HOLD), do nothing
  }

  // Final cash balance represents total profit/loss
  return cash;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int calculateProfit(int[] prices, int[] strategy) {
        /**
         * Calculate total profit from following the given trading strategy.
         *
         * @param prices Stock prices for each day
         * @param strategy Trading actions (-1=buy, 0=hold, 1=sell)
         * @return Total profit/loss after executing all trades
         */
        int cash = 0;  // Current cash balance (can be negative)
        int holdings = 0;  // Number of stocks currently owned

        // Process each day's price and strategy
        for (int i = 0; i < prices.length; i++) {
            if (strategy[i] == -1) {  // BUY signal
                // Buy one unit at current price
                cash -= prices[i];  // Pay for the stock
                holdings += 1;  // Add to inventory
            } else if (strategy[i] == 1 && holdings > 0) {  // SELL signal and we have stock
                // Sell one unit at current price
                cash += prices[i];  // Receive money from sale
                holdings -= 1;  // Remove from inventory
            }
            // For strategy[i] == 0 (HOLD), do nothing
        }

        // Final cash balance represents total profit/loss
        return cash;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the arrays exactly once, performing constant-time operations for each element.
- The loop runs n times where n is the length of the prices/strategy arrays.

**Space Complexity:** O(1)

- We only use a constant amount of extra space: two integer variables (cash and holdings).
- No additional data structures that scale with input size.

## Common Mistakes

1. **Not checking if we have stock before selling:** This is the most common error. Candidates might sell even when holdings = 0, which doesn't make logical sense. Always verify `holdings > 0` before executing a sell.

2. **Forgetting that cash can be negative:** Some candidates initialize cash to a large positive number or try to prevent negative cash. The problem allows buying regardless of cash balance, so negative cash is valid and represents being in debt.

3. **Overcomplicating with unnecessary data structures:** Candidates sometimes use stacks, queues, or complex arrays when simple variables suffice. Remember: if you only need to track current state, use simple variables.

4. **Misunderstanding the strategy values:** Mixing up which number corresponds to which action. Always double-check: -1 = buy, 0 = hold, 1 = sell. Writing this as a comment at the top of your function helps prevent confusion.

## When You'll See This Pattern

This type of **stateful simulation** pattern appears in many coding problems:

1. **Best Time to Buy and Sell Stock (LeetCode 121):** The classic version where you find the maximum profit from one buy and one sell. While simpler, it uses similar price tracking logic.

2. **Robot Bounded In Circle (LeetCode 1041):** Tracks robot position and direction based on movement commands—another state simulation problem.

3. **Candy Crush (LeetCode 723):** Simulates game state changes based on matching patterns.

4. **Text Justification (LeetCode 68):** Tracks current line length and words as you process text.

The common thread is maintaining some state (position, inventory, balance) and updating it based on input rules.

## Key Takeaways

1. **Simulation problems often have simple solutions:** When you see a problem describing a sequence of operations with rules, think about what minimal state you need to track. Often, a few variables are enough.

2. **Read constraints carefully:** The ability to buy without cash and the requirement to have stock before selling are crucial constraints that directly affect your solution logic.

3. **Test with edge cases:** Always test with empty arrays, all-hold strategies, buy-sell-buy sequences, and cases where you try to sell with no stock.

[Practice this problem on CodeJeet](/problem/best-time-to-buy-and-sell-stock-using-strategy)
