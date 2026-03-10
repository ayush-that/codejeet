---
title: "How to Solve Best Time to Buy and Sell Stock — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Best Time to Buy and Sell Stock. Easy difficulty, 56.4% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-02-04"
category: "dsa-patterns"
tags: ["best-time-to-buy-and-sell-stock", "array", "dynamic-programming", "easy"]
---

# How to Solve Best Time to Buy and Sell Stock

This problem asks you to find the maximum profit possible from a single buy and sell transaction given daily stock prices. The catch is that you must buy before you sell, and you can only make one transaction. What makes this interesting is that the optimal solution requires tracking just two variables while scanning the array once—a classic example of how careful observation can turn an O(n²) brute force into an elegant O(n) solution.

## Visual Walkthrough

Let's trace through example `prices = [7, 1, 5, 3, 6, 4]`:

**Day 0 (price 7):** We can only buy today. No selling possible yet. Minimum price seen = 7, max profit = 0.

**Day 1 (price 1):** Price 1 is lower than our current minimum (7), so we update minimum to 1. Could we sell? We haven't bought yet for today's price, but if we had bought earlier at 7 and sold at 1, that would be a loss. Max profit stays 0.

**Day 2 (price 5):** Price 5 is higher than current minimum (1). Potential profit = 5 - 1 = 4. This beats our previous max profit (0), so we update max profit to 4. Minimum price remains 1.

**Day 3 (price 3):** Price 3 is higher than minimum (1). Potential profit = 3 - 1 = 2. This is less than current max profit (4), so no update. Minimum stays 1.

**Day 4 (price 6):** Price 6 is higher than minimum (1). Potential profit = 6 - 1 = 5. This beats current max profit (4), so we update max profit to 5. Minimum stays 1.

**Day 5 (price 4):** Price 4 is higher than minimum (1). Potential profit = 4 - 1 = 3. Less than current max profit (5), so no update.

Final result: Maximum profit = 5 (buy at price 1 on day 1, sell at price 6 on day 4).

The key insight: As we move through the array, we only need to remember the lowest price seen so far and the maximum profit achievable with that minimum price.

## Brute Force Approach

The most straightforward solution is to try every possible pair of buy and sell days where the buy day comes before the sell day. For each pair, calculate the profit (sell price - buy price) and track the maximum.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxProfit(prices):
    """
    Brute force: Check every possible buy-sell pair
    """
    max_profit = 0

    # Try every day as a potential buy day
    for i in range(len(prices)):
        # For each buy day, try every future day as a sell day
        for j in range(i + 1, len(prices)):
            profit = prices[j] - prices[i]
            max_profit = max(max_profit, profit)

    return max_profit
```

```javascript
// Time: O(n²) | Space: O(1)
function maxProfit(prices) {
  let maxProfit = 0;

  // Try every day as a potential buy day
  for (let i = 0; i < prices.length; i++) {
    // For each buy day, try every future day as a sell day
    for (let j = i + 1; j < prices.length; j++) {
      const profit = prices[j] - prices[i];
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxProfit(int[] prices) {
    int maxProfit = 0;

    // Try every day as a potential buy day
    for (int i = 0; i < prices.length; i++) {
        // For each buy day, try every future day as a sell day
        for (int j = i + 1; j < prices.length; j++) {
            int profit = prices[j] - prices[i];
            maxProfit = Math.max(maxProfit, profit);
        }
    }

    return maxProfit;
}
```

</div>

**Why this isn't optimal:** With n days, there are n(n-1)/2 possible pairs, giving us O(n²) time complexity. For large inputs (like 10⁵ days), this would be far too slow. We need to find a way to avoid checking every pair.

## Optimal Solution

The optimal solution uses a single pass through the array. The key insight is that for any given day, the maximum profit we could make by selling on that day is the price on that day minus the **minimum price seen so far**. So we just need to track:

1. The minimum price encountered so far
2. The maximum profit we could achieve

By updating these two variables as we iterate, we can find the answer in one pass.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProfit(prices):
    """
    One-pass solution: Track minimum price and maximum profit
    """
    # Edge case: If there are fewer than 2 days, no transaction is possible
    if len(prices) < 2:
        return 0

    # Initialize minimum price to the first day's price
    min_price = prices[0]
    # Initialize maximum profit to 0 (we could choose not to transact)
    max_profit = 0

    # Start from day 1 (index 1) since we need at least one day after buying
    for i in range(1, len(prices)):
        current_price = prices[i]

        # Update maximum profit if selling today would give better profit
        # Profit if we bought at min_price and sold at current_price
        potential_profit = current_price - min_price
        max_profit = max(max_profit, potential_profit)

        # Update minimum price if today's price is lower
        # This ensures we always have the lowest price seen so far
        min_price = min(min_price, current_price)

    return max_profit
```

```javascript
// Time: O(n) | Space: O(1)
function maxProfit(prices) {
  // Edge case: If there are fewer than 2 days, no transaction is possible
  if (prices.length < 2) {
    return 0;
  }

  // Initialize minimum price to the first day's price
  let minPrice = prices[0];
  // Initialize maximum profit to 0 (we could choose not to transact)
  let maxProfit = 0;

  // Start from day 1 (index 1) since we need at least one day after buying
  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];

    // Update maximum profit if selling today would give better profit
    // Profit if we bought at minPrice and sold at currentPrice
    const potentialProfit = currentPrice - minPrice;
    maxProfit = Math.max(maxProfit, potentialProfit);

    // Update minimum price if today's price is lower
    // This ensures we always have the lowest price seen so far
    minPrice = Math.min(minPrice, currentPrice);
  }

  return maxProfit;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxProfit(int[] prices) {
    // Edge case: If there are fewer than 2 days, no transaction is possible
    if (prices.length < 2) {
        return 0;
    }

    // Initialize minimum price to the first day's price
    int minPrice = prices[0];
    // Initialize maximum profit to 0 (we could choose not to transact)
    int maxProfit = 0;

    // Start from day 1 (index 1) since we need at least one day after buying
    for (int i = 1; i < prices.length; i++) {
        int currentPrice = prices[i];

        // Update maximum profit if selling today would give better profit
        // Profit if we bought at minPrice and sold at currentPrice
        int potentialProfit = currentPrice - minPrice;
        maxProfit = Math.max(maxProfit, potentialProfit);

        // Update minimum price if today's price is lower
        // This ensures we always have the lowest price seen so far
        minPrice = Math.min(minPrice, currentPrice);
    }

    return maxProfit;
}
```

</div>

**Why this works:** At each day, we know the cheapest price we could have bought at (min_price). The best we could do selling today is today's price minus that minimum. We track the best such profit across all days. The order of operations matters—we calculate profit before updating min_price because we can't buy and sell on the same day.

## Complexity Analysis

**Time Complexity: O(n)**  
We make a single pass through the array, performing constant-time operations (comparisons and arithmetic) at each step. The loop runs n-1 times for an array of length n.

**Space Complexity: O(1)**  
We only use a fixed number of variables (min_price, max_profit, and loop counter), regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Starting the loop at index 0 instead of 1:** If you start at index 0, you might calculate profit using the same day as both buy and sell (which isn't allowed). Always start at index 1 since you need at least one day difference between buy and sell.

2. **Forgetting the edge case of decreasing prices:** If prices only go down (e.g., [5, 4, 3, 2, 1]), the maximum profit should be 0 (not transact at all), not a negative number. Our solution handles this because max_profit starts at 0 and we only update it with positive values.

3. **Updating min_price before calculating profit:** This is a subtle but critical error. If you update min_price to today's price before calculating profit, you might accidentally consider buying and selling on the same day. Always calculate potential profit using the previous minimum, then update the minimum for future days.

4. **Not handling empty or single-element arrays:** The problem doesn't explicitly forbid empty input. If prices has 0 or 1 element, no transaction is possible, so return 0. Always check for this edge case at the beginning.

## When You'll See This Pattern

This "track minimum/maximum while scanning" pattern appears in many array problems where you need to find optimal pairs or track extreme values:

1. **Maximum Subarray (Kadane's Algorithm):** Similar to tracking maximum profit, Kadane's algorithm tracks the maximum subarray sum ending at each position. Both problems maintain a running optimal value.

2. **Container With Most Water:** You track two pointers moving inward, always moving the pointer at the shorter line—similar to how we track the minimum price to maximize profit.

3. **Best Time to Buy and Sell Stock II:** This variant allows multiple transactions. While the solution is different, understanding this single-transaction version is crucial for solving the more complex variants.

4. **Find Minimum in Rotated Sorted Array:** While searching for a minimum in a rotated array, you're essentially tracking the minimum value as you narrow down the search space.

## Key Takeaways

1. **Look for the "so far" insight:** Many array problems can be solved by tracking some property "so far" (minimum price so far, maximum sum so far, etc.) as you iterate. This often turns O(n²) problems into O(n) solutions.

2. **Order of operations matters:** When updating multiple interdependent variables in a single pass, think carefully about which should be updated first. In this problem, calculating profit must come before updating the minimum price.

3. **Zero is a valid answer:** When a problem involves maximizing something that could be negative, consider whether doing nothing (result = 0) might be better than any available option. Initialize your answer accordingly.

Related problems: [Maximum Subarray](/problem/maximum-subarray), [Best Time to Buy and Sell Stock II](/problem/best-time-to-buy-and-sell-stock-ii), [Best Time to Buy and Sell Stock III](/problem/best-time-to-buy-and-sell-stock-iii)
