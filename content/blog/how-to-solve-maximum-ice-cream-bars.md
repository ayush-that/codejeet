---
title: "How to Solve Maximum Ice Cream Bars — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Ice Cream Bars. Medium difficulty, 74.2% acceptance rate. Topics: Array, Greedy, Sorting, Counting Sort."
date: "2026-03-02"
category: "dsa-patterns"
tags: ["maximum-ice-cream-bars", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Ice Cream Bars

You're given an array of ice cream bar costs and a coin budget. Your goal is to maximize the number of bars you can buy. The challenge is that you can't buy partial bars — you either buy a bar or you don't — and you want to buy as many as possible with your limited budget. This problem is interesting because it looks like a knapsack problem at first glance, but there's a much simpler greedy approach that works perfectly.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `costs = [1, 3, 2, 4, 1]` and `coins = 7`.

**Step 1:** First, we should sort the costs from cheapest to most expensive. This gives us `[1, 1, 2, 3, 4]`.

**Step 2:** Now we try to buy bars starting from the cheapest:

- Buy first bar (cost 1): coins left = 7 - 1 = 6, bars bought = 1
- Buy second bar (cost 1): coins left = 6 - 1 = 5, bars bought = 2
- Buy third bar (cost 2): coins left = 5 - 2 = 3, bars bought = 3
- Buy fourth bar (cost 3): coins left = 3 - 3 = 0, bars bought = 4
- Try fifth bar (cost 4): can't afford it (need 4 but have 0)

**Result:** We can buy 4 ice cream bars.

Why does this greedy approach work? Because each bar gives us exactly 1 "unit" of value (one bar), regardless of its cost. So to maximize the number of bars, we should always buy the cheapest available bars first. This is different from problems where items have different values — here, every item has the same value (1 bar), so we just want to minimize cost per bar.

## Brute Force Approach

A naive approach would be to try all possible combinations of ice cream bars. We could generate all subsets of the `n` bars, check which ones we can afford within our budget, and find the largest affordable subset.

However, this brute force solution has exponential time complexity — O(2ⁿ) — because there are 2ⁿ possible subsets of `n` items. For even moderately sized inputs (like n = 100), this becomes completely infeasible.

What makes this problem tricky is recognizing that we don't need to consider all combinations. Since every bar gives us the same "value" (one bar), we don't need to worry about which specific bars we buy — we just need to buy as many as possible, which means buying the cheapest ones.

## Optimized Approach

The key insight is that this is a **greedy** problem, not a dynamic programming problem. Here's the step-by-step reasoning:

1. **Observation:** Each ice cream bar provides exactly 1 unit of value (one bar), regardless of its cost.
2. **Implication:** To maximize the number of bars, we should minimize the cost per bar.
3. **Strategy:** Sort the bars by cost from cheapest to most expensive.
4. **Algorithm:** Iterate through the sorted list, buying bars until we run out of coins.

This works because if we have a budget and we want to buy as many items as possible where each item has equal value, we should always buy the cheapest items first. Any other ordering would either:

- Buy the same number of bars but spend more money (inefficient)
- Or buy fewer bars (suboptimal)

There's an even more optimized approach using **counting sort** when the costs have a limited range. Since the problem constraints say `costs[i] <= 10⁵`, we can use an array of size 100,001 to count how many bars cost each amount. This gives us O(n + maxCost) time complexity, which can be faster than O(n log n) sorting when maxCost is small relative to n.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for iteration
# Space: O(1) if we sort in-place, O(n) if we need to copy
def maxIceCream(costs, coins):
    """
    Returns the maximum number of ice cream bars that can be bought.

    Args:
        costs: List[int] - prices of each ice cream bar
        coins: int - total budget in coins

    Returns:
        int - maximum number of bars that can be purchased
    """
    # Step 1: Sort the costs in ascending order
    # This allows us to buy the cheapest bars first, maximizing count
    costs.sort()

    # Step 2: Initialize counter for number of bars bought
    bars_bought = 0

    # Step 3: Iterate through sorted costs
    for cost in costs:
        # If we can afford this bar, buy it
        if coins >= cost:
            coins -= cost  # Deduct cost from budget
            bars_bought += 1  # Increment count
        else:
            # If we can't afford this bar, we can't afford any more
            # (since costs are sorted in ascending order)
            break

    return bars_bought
```

```javascript
// Time: O(n log n) for sorting, O(n) for iteration
// Space: O(1) if we sort in-place, O(n) if we need to copy
function maxIceCream(costs, coins) {
  /**
   * Returns the maximum number of ice cream bars that can be bought.
   *
   * @param {number[]} costs - prices of each ice cream bar
   * @param {number} coins - total budget in coins
   * @return {number} - maximum number of bars that can be purchased
   */

  // Step 1: Sort the costs in ascending order
  // This allows us to buy the cheapest bars first, maximizing count
  costs.sort((a, b) => a - b);

  // Step 2: Initialize counter for number of bars bought
  let barsBought = 0;

  // Step 3: Iterate through sorted costs
  for (let cost of costs) {
    // If we can afford this bar, buy it
    if (coins >= cost) {
      coins -= cost; // Deduct cost from budget
      barsBought++; // Increment count
    } else {
      // If we can't afford this bar, we can't afford any more
      // (since costs are sorted in ascending order)
      break;
    }
  }

  return barsBought;
}
```

```java
// Time: O(n log n) for sorting, O(n) for iteration
// Space: O(1) if we sort in-place, O(n) if we need to copy
class Solution {
    public int maxIceCream(int[] costs, int coins) {
        /**
         * Returns the maximum number of ice cream bars that can be bought.
         *
         * @param costs - prices of each ice cream bar
         * @param coins - total budget in coins
         * @return maximum number of bars that can be purchased
         */

        // Step 1: Sort the costs in ascending order
        // This allows us to buy the cheapest bars first, maximizing count
        Arrays.sort(costs);

        // Step 2: Initialize counter for number of bars bought
        int barsBought = 0;

        // Step 3: Iterate through sorted costs
        for (int cost : costs) {
            // If we can afford this bar, buy it
            if (coins >= cost) {
                coins -= cost;  // Deduct cost from budget
                barsBought++;   // Increment count
            } else {
                // If we can't afford this bar, we can't afford any more
                // (since costs are sorted in ascending order)
                break;
            }
        }

        return barsBought;
    }
}
```

</div>

**Counting Sort Optimization:** For even better performance when costs have a limited range:

<div class="code-group">

```python
# Time: O(n + maxCost) where maxCost = 100000
# Space: O(maxCost) for the counting array
def maxIceCreamCountingSort(costs, coins):
    """
    Optimized version using counting sort for limited cost range.
    """
    # Step 1: Find maximum cost to determine array size
    max_cost = max(costs) if costs else 0

    # Step 2: Create counting array (index = cost, value = count)
    count = [0] * (max_cost + 1)
    for cost in costs:
        count[cost] += 1

    # Step 3: Buy bars starting from cheapest (lowest index)
    bars_bought = 0
    for cost in range(1, max_cost + 1):
        if count[cost] == 0:
            continue  # No bars at this price

        # Calculate how many bars at this price we can buy
        # Either all bars at this price, or as many as budget allows
        can_buy = min(count[cost], coins // cost)

        if can_buy == 0:
            break  # Can't afford even one bar at this price

        bars_bought += can_buy
        coins -= can_buy * cost

    return bars_bought
```

</div>

## Complexity Analysis

**Sorting Approach:**

- **Time Complexity:** O(n log n) for sorting + O(n) for iteration = O(n log n)
  - The sorting step dominates the time complexity
  - Iteration is linear but happens after sorting
- **Space Complexity:** O(1) if sorting in-place, O(n) if the sorting algorithm requires extra space
  - Python's `sort()` uses Timsort which is O(n) in worst case
  - JavaScript's `sort()` implementation varies by browser
  - Java's `Arrays.sort()` uses O(log n) to O(n) space depending on the data

**Counting Sort Approach:**

- **Time Complexity:** O(n + maxCost) where maxCost is the maximum cost value
  - O(n) to build the count array
  - O(maxCost) to iterate through possible costs
- **Space Complexity:** O(maxCost) for the counting array
  - This is efficient when maxCost is small relative to n

## Common Mistakes

1. **Not sorting the array:** Some candidates try to use a min-heap or repeatedly find the minimum, which is less efficient than sorting once. The key insight is that sorting allows us to process bars in increasing cost order.

2. **Continuing iteration after breaking the budget:** Once you can't afford a bar (and costs are sorted), you should break out of the loop. Continuing to check is wasteful, though not incorrect.

3. **Using integer division incorrectly:** In the counting sort version, `coins // cost` gives the maximum number of bars at that price we can afford. Some candidates forget to use integer division or mishandle the calculation.

4. **Forgetting to handle empty input:** While the problem constraints guarantee at least one element, in real interviews you should mention edge cases like empty arrays.

5. **Trying dynamic programming:** This problem looks similar to the knapsack problem, but since all items have equal value, greedy works. DP would be O(n × coins) which is much slower.

## When You'll See This Pattern

This greedy "buy cheapest first" pattern appears in several optimization problems:

1. **Maximum Units on a Truck (LeetCode 1710):** Similar concept — you have boxes with different unit counts and need to maximize total units within truck capacity. Sort by units per box in descending order.

2. **Assign Cookies (LeetCode 455):** Another greedy matching problem — match the smallest cookie to the smallest greed factor child.

3. **Minimum Cost to Hire K Workers (LeetCode 857):** More complex but uses sorting combined with priority queues to optimize selection.

The pattern to recognize: **When you need to maximize count of items with equal value under a budget constraint, sort by cost and take the cheapest items first.**

## Key Takeaways

1. **Equal value enables greedy:** When all items provide the same "value" (in this case, 1 bar each), you can use a greedy approach by always choosing the cheapest available items.

2. **Sorting simplifies selection:** Many greedy algorithms begin with sorting the input. If you're trying to optimize selection under constraints, consider whether sorting by some criterion (cost, weight, efficiency) can help.

3. **Know when NOT to use DP:** This problem looks like knapsack at first glance, but the equal value condition makes greedy optimal. Recognizing when a simpler approach works can save time and complexity.

[Practice this problem on CodeJeet](/problem/maximum-ice-cream-bars)
