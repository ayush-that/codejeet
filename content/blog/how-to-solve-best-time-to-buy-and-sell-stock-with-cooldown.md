---
title: "How to Solve Best Time to Buy and Sell Stock with Cooldown — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock with Cooldown. Medium difficulty, 61.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-01-05"
category: "dsa-patterns"
tags: ["best-time-to-buy-and-sell-stock-with-cooldown", "array", "dynamic-programming", "medium"]
---

# How to Solve Best Time to Buy and Sell Stock with Cooldown

This problem asks us to maximize profit from stock trading with a twist: after selling a stock, we must wait one day (a "cooldown") before buying again. We can make unlimited transactions, but each transaction must follow the buy → sell → cooldown sequence. What makes this problem interesting is that our decision on any given day depends not just on the current price, but on our state from previous days due to the cooldown constraint.

## Visual Walkthrough

Let's trace through `prices = [1, 2, 3, 0, 2]` step by step:

**Day 0 (price = 1):**

- We can either buy (spend 1) or do nothing (stay at 0 profit)
- If we buy: profit = -1, state = "holding"
- If we skip: profit = 0, state = "not holding"

**Day 1 (price = 2):**

- If we bought yesterday (holding at -1):
  - We can sell: profit = -1 + 2 = 1, state = "cooldown"
  - We can hold: profit = -1, state = "holding"
- If we skipped yesterday (not holding at 0):
  - We can buy: profit = 0 - 2 = -2, state = "holding"
  - We can skip: profit = 0, state = "not holding"

**Day 2 (price = 3):**

- If we sold yesterday (cooldown at 1):
  - We must cooldown: profit = 1, state = "not holding"
- If we held yesterday (holding at -1):
  - We can sell: profit = -1 + 3 = 2, state = "cooldown"
  - We can hold: profit = -1, state = "holding"
- If we bought yesterday (holding at -2):
  - We can sell: profit = -2 + 3 = 1, state = "cooldown"
  - We can hold: profit = -2, state = "holding"
- If we skipped yesterday (not holding at 0):
  - We can buy: profit = 0 - 3 = -3, state = "holding"
  - We can skip: profit = 0, state = "not holding"

We continue this process, tracking the maximum profit achievable in each state. The optimal path for this example is:

- Day 0: Buy at 1 (profit = -1)
- Day 1: Hold (profit = -1)
- Day 2: Sell at 3 (profit = 2)
- Day 3: Cooldown (profit = 2)
- Day 4: Buy at 0 (profit = 2 - 0 = 2), then immediately sell at 2 (profit = 4)

Maximum profit = 4.

## Brute Force Approach

A brute force solution would explore all possible sequences of buy/sell/cooldown decisions. For each day, we have 2-3 choices:

- If holding: sell or hold
- If not holding: buy or skip
- If just sold: must cooldown

This creates a decision tree with approximately 3^n branches (where n is the number of days). We could implement this with recursion:

```python
def maxProfit(prices):
    def dfs(day, holding):
        if day >= len(prices):
            return 0

        if holding:
            # Can sell or hold
            sell = prices[day] + dfs(day + 2, False)  # Cooldown after selling
            hold = dfs(day + 1, True)
            return max(sell, hold)
        else:
            # Can buy or skip
            buy = -prices[day] + dfs(day + 1, True)
            skip = dfs(day + 1, False)
            return max(buy, skip)

    return dfs(0, False)
```

This solution has exponential time complexity O(3^n) and will time out for even moderately sized inputs (n > 20). The problem requires n up to 5000, so we need a more efficient approach.

## Optimized Approach

The key insight is that we can use **dynamic programming** to avoid recomputing the same states. At any day `i`, our maximum profit depends only on:

1. Whether we're holding a stock
2. Our decisions on previous days

We can define three states:

- `hold[i]`: Maximum profit on day `i` when holding a stock
- `sold[i]`: Maximum profit on day `i` when just sold (will cooldown next day)
- `rest[i]`: Maximum profit on day `i` when not holding and not in cooldown

The state transitions are:

- `hold[i] = max(hold[i-1], rest[i-1] - prices[i])`
  - Either continue holding from yesterday, or buy today (from rest state)
- `sold[i] = hold[i-1] + prices[i]`
  - Sell the stock we were holding yesterday
- `rest[i] = max(rest[i-1], sold[i-1])`
  - Either continue resting, or finish cooldown from yesterday's sale

The answer is `max(sold[n-1], rest[n-1])` since we want to end without holding any stock.

## Optimal Solution

Here's the complete solution using dynamic programming with three states:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) (can be optimized to O(1))
def maxProfit(prices):
    """
    Calculate maximum profit with cooldown constraint.

    We maintain three states:
    - hold: maximum profit when holding a stock
    - sold: maximum profit when just sold (will cooldown next day)
    - rest: maximum profit when not holding and not in cooldown
    """
    n = len(prices)
    if n <= 1:
        return 0

    # Initialize DP arrays
    hold = [0] * n
    sold = [0] * n
    rest = [0] * n

    # Base cases for day 0
    hold[0] = -prices[0]  # Buy on day 0
    sold[0] = 0           # Cannot sell on day 0
    rest[0] = 0           # Do nothing on day 0

    for i in range(1, n):
        # hold[i]: max of continuing to hold or buying today from rest state
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])

        # sold[i]: sell the stock we were holding yesterday
        sold[i] = hold[i-1] + prices[i]

        # rest[i]: max of continuing to rest or finishing cooldown from yesterday's sale
        rest[i] = max(rest[i-1], sold[i-1])

    # We want to end without holding any stock
    return max(sold[n-1], rest[n-1])
```

```javascript
// Time: O(n) | Space: O(n) (can be optimized to O(1))
function maxProfit(prices) {
  /**
   * Calculate maximum profit with cooldown constraint.
   *
   * We maintain three states:
   * - hold: maximum profit when holding a stock
   * - sold: maximum profit when just sold (will cooldown next day)
   * - rest: maximum profit when not holding and not in cooldown
   */
  const n = prices.length;
  if (n <= 1) return 0;

  // Initialize DP arrays
  const hold = new Array(n).fill(0);
  const sold = new Array(n).fill(0);
  const rest = new Array(n).fill(0);

  // Base cases for day 0
  hold[0] = -prices[0]; // Buy on day 0
  sold[0] = 0; // Cannot sell on day 0
  rest[0] = 0; // Do nothing on day 0

  for (let i = 1; i < n; i++) {
    // hold[i]: max of continuing to hold or buying today from rest state
    hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);

    // sold[i]: sell the stock we were holding yesterday
    sold[i] = hold[i - 1] + prices[i];

    // rest[i]: max of continuing to rest or finishing cooldown from yesterday's sale
    rest[i] = Math.max(rest[i - 1], sold[i - 1]);
  }

  // We want to end without holding any stock
  return Math.max(sold[n - 1], rest[n - 1]);
}
```

```java
// Time: O(n) | Space: O(n) (can be optimized to O(1))
class Solution {
    public int maxProfit(int[] prices) {
        /**
         * Calculate maximum profit with cooldown constraint.
         *
         * We maintain three states:
         * - hold: maximum profit when holding a stock
         * - sold: maximum profit when just sold (will cooldown next day)
         * - rest: maximum profit when not holding and not in cooldown
         */
        int n = prices.length;
        if (n <= 1) return 0;

        // Initialize DP arrays
        int[] hold = new int[n];
        int[] sold = new int[n];
        int[] rest = new int[n];

        // Base cases for day 0
        hold[0] = -prices[0];  // Buy on day 0
        sold[0] = 0;           // Cannot sell on day 0
        rest[0] = 0;           // Do nothing on day 0

        for (int i = 1; i < n; i++) {
            // hold[i]: max of continuing to hold or buying today from rest state
            hold[i] = Math.max(hold[i-1], rest[i-1] - prices[i]);

            // sold[i]: sell the stock we were holding yesterday
            sold[i] = hold[i-1] + prices[i];

            // rest[i]: max of continuing to rest or finishing cooldown from yesterday's sale
            rest[i] = Math.max(rest[i-1], sold[i-1]);
        }

        // We want to end without holding any stock
        return Math.max(sold[n-1], rest[n-1]);
    }
}
```

</div>

**Space Optimization:** We can reduce space to O(1) by only storing the previous day's values:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProfit(prices):
    n = len(prices)
    if n <= 1:
        return 0

    # Initialize with day 0 values
    hold = -prices[0]
    sold = 0
    rest = 0

    for i in range(1, n):
        # Store previous values before updating
        prev_hold = hold
        prev_sold = sold

        # Update current values
        hold = max(hold, rest - prices[i])
        sold = prev_hold + prices[i]
        rest = max(rest, prev_sold)

    return max(sold, rest)
```

```javascript
// Time: O(n) | Space: O(1)
function maxProfit(prices) {
  const n = prices.length;
  if (n <= 1) return 0;

  // Initialize with day 0 values
  let hold = -prices[0];
  let sold = 0;
  let rest = 0;

  for (let i = 1; i < n; i++) {
    // Store previous values before updating
    const prevHold = hold;
    const prevSold = sold;

    // Update current values
    hold = Math.max(hold, rest - prices[i]);
    sold = prevHold + prices[i];
    rest = Math.max(rest, prevSold);
  }

  return Math.max(sold, rest);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        if (n <= 1) return 0;

        // Initialize with day 0 values
        int hold = -prices[0];
        int sold = 0;
        int rest = 0;

        for (int i = 1; i < n; i++) {
            // Store previous values before updating
            int prevHold = hold;
            int prevSold = sold;

            // Update current values
            hold = Math.max(hold, rest - prices[i]);
            sold = prevHold + prices[i];
            rest = Math.max(rest, prevSold);
        }

        return Math.max(sold, rest);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the prices array once, performing constant-time operations at each step.

**Space Complexity:** O(n) for the basic DP solution, O(1) for the optimized version

- The basic solution uses three arrays of size n
- The optimized version uses only three variables regardless of input size

## Common Mistakes

1. **Incorrect state transitions:** The most common error is getting the transitions between states wrong. Remember:
   - You can only buy from `rest` state (not from `sold` state due to cooldown)
   - You can only sell from `hold` state
   - After selling, you go to `sold` state, then to `rest` state

2. **Forgetting the base case for day 0:**
   - `hold[0]` should be `-prices[0]` (buying on day 0)
   - `sold[0]` should be 0 (can't sell on day 0)
   - `rest[0]` should be 0 (do nothing on day 0)

3. **Returning the wrong final value:** The answer should be `max(sold[n-1], rest[n-1])`, not `hold[n-1]` (we don't want to end with stock in hand).

4. **Off-by-one errors in space-optimized version:** When updating variables, store previous values in temporary variables before updating to avoid using already-updated values in subsequent calculations.

## When You'll See This Pattern

This state machine DP pattern appears in several stock trading problems:

1. **Best Time to Buy and Sell Stock IV (Hard):** Generalizes to k transactions using similar state transitions
2. **Best Time to Buy and Sell Stock with Transaction Fee (Medium):** Similar structure but with a fee instead of cooldown
3. **House Robber (Medium):** Similar "skip one after taking" constraint, though with different context

The pattern involves defining states based on what action was just taken and using DP to track the maximum value achievable in each state at each step.

## Key Takeaways

1. **State machine DP is powerful for problems with sequential decisions and constraints:** When your decision at each step depends on previous actions due to constraints (like cooldown), model the problem as transitions between states.

2. **Define states based on what matters for future decisions:** For this problem, what matters is whether we're holding stock and whether we just sold (triggering cooldown).

3. **Space optimization is often possible:** When the recurrence only depends on the previous step, you can reduce space from O(n) to O(1) by only storing the previous values.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Best Time to Buy and Sell Stock II](/problem/best-time-to-buy-and-sell-stock-ii)
