---
title: "How to Solve Maximize Amount After Two Days of Conversions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Amount After Two Days of Conversions. Medium difficulty, 61.2% acceptance rate. Topics: Array, String, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2029-12-19"
category: "dsa-patterns"
tags:
  [
    "maximize-amount-after-two-days-of-conversions",
    "array",
    "string",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Maximize Amount After Two Days of Conversions

You start with 1.0 unit of an initial currency and can perform currency conversions over two days. On day 1, you can convert between specific currency pairs with given rates, and on day 2, you can convert between a different set of pairs with different rates. The goal is to maximize your final amount after exactly two days of conversions. What makes this problem interesting is that you need to find the optimal path through two separate conversion graphs, where you can convert through intermediate currencies on each day.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `initialCurrency = "USD"`
- `pairs1 = [["USD", "EUR"], ["EUR", "GBP"]]`
- `rates1 = [1.2, 0.9]`
- `pairs2 = [["GBP", "CAD"], ["CAD", "USD"]]`
- `rates2 = [1.5, 0.8]`

**Day 1 conversions:**

- USD → EUR: 1.0 × 1.2 = 1.2 EUR
- EUR → GBP: 1.2 × 0.9 = 1.08 GBP

So after day 1, we could have:

- 1.0 USD (no conversion)
- 1.2 EUR (USD→EUR)
- 1.08 GBP (USD→EUR→GBP)

**Day 2 conversions:**
Starting from each possible day 1 result:

- From 1.0 USD: No GBP→CAD conversion available, so stuck at 1.0 USD
- From 1.2 EUR: No GBP→CAD conversion available, so stuck at 1.2 EUR
- From 1.08 GBP: GBP→CAD: 1.08 × 1.5 = 1.62 CAD, then CAD→USD: 1.62 × 0.8 = 1.296 USD

The maximum final amount is 1.296 USD.

The key insight: We need to explore all possible conversion paths on day 1, then for each resulting currency and amount, explore all possible conversion paths on day 2. This is essentially finding the best product of conversion rates through intermediate currencies.

## Brute Force Approach

A naive approach would be to try all possible sequences of conversions on day 1 (including doing nothing), then for each result, try all possible sequences on day 2. For each day, with n currency pairs, there could be n! possible sequences if we consider all permutations. Even with memoization, this approach would be exponential in the number of currencies and pairs.

The brute force would involve:

1. Generate all possible conversion chains on day 1
2. For each chain result, generate all possible conversion chains on day 2
3. Track the maximum final amount

This is clearly infeasible for larger inputs because the number of possible paths grows factorially with the number of conversion opportunities.

## Optimized Approach

The key insight is that this problem can be modeled as finding the best conversion rate through two layers of currency graphs. We can use a graph traversal approach:

1. **Day 1 Graph**: Build a graph where nodes are currencies and edges are conversion rates from `pairs1`.
2. **Find all reachable currencies on Day 1**: Starting from `initialCurrency`, use BFS/DFS to find all currencies reachable on day 1 and the maximum amount we can get for each currency.
3. **Day 2 Graph**: Build another graph from `pairs2`.
4. **Find optimal path through both days**: For each currency we can reach after day 1, find the maximum amount we can get after day 2 by exploring from that currency in the day 2 graph.

The critical optimization is that we don't need to track every possible path sequence—we only need the maximum amount for each currency at each stage. This is similar to finding the best exchange rate through intermediate currencies, which can be solved with a variation of shortest path algorithms (but maximizing instead of minimizing).

## Optimal Solution

We'll use BFS to explore all reachable currencies on each day, keeping track of the maximum amount for each currency. Since conversion rates are multiplicative and we want to maximize, this is essentially finding the path with the maximum product of rates.

<div class="code-group">

```python
# Time: O(N + M) where N = number of pairs1, M = number of pairs2
# Space: O(C) where C = number of unique currencies
def maximizeAmount(initialCurrency, pairs1, rates1, pairs2, rates2):
    """
    Maximize the amount after two days of currency conversions.

    Args:
        initialCurrency: Starting currency
        pairs1: List of [start, end] currency pairs for day 1
        rates1: List of conversion rates for day 1
        pairs2: List of [start, end] currency pairs for day 2
        rates2: List of conversion rates for day 2

    Returns:
        Maximum amount achievable after two days
    """
    from collections import defaultdict, deque

    # Step 1: Build adjacency list for day 1 conversions
    graph1 = defaultdict(list)
    for (start, end), rate in zip(pairs1, rates1):
        graph1[start].append((end, rate))

    # Step 2: BFS on day 1 to find max amount for each reachable currency
    # We use BFS because we want to explore all reachable currencies
    day1_amounts = {initialCurrency: 1.0}
    queue = deque([initialCurrency])

    while queue:
        curr_currency = queue.popleft()
        curr_amount = day1_amounts[curr_currency]

        # Explore all conversions from current currency
        for next_currency, rate in graph1.get(curr_currency, []):
            new_amount = curr_amount * rate

            # Only update if we found a better path to this currency
            if new_amount > day1_amounts.get(next_currency, 0):
                day1_amounts[next_currency] = new_amount
                queue.append(next_currency)

    # Step 3: Build adjacency list for day 2 conversions
    graph2 = defaultdict(list)
    for (start, end), rate in zip(pairs2, rates2):
        graph2[start].append((end, rate))

    # Step 4: For each currency we have after day 1, explore day 2 conversions
    max_final_amount = 0.0

    for start_currency, start_amount in day1_amounts.items():
        # BFS for day 2 starting from this currency
        day2_amounts = {start_currency: start_amount}
        queue = deque([start_currency])

        while queue:
            curr_currency = queue.popleft()
            curr_amount = day2_amounts[curr_currency]

            # Update global maximum
            max_final_amount = max(max_final_amount, curr_amount)

            # Explore day 2 conversions
            for next_currency, rate in graph2.get(curr_currency, []):
                new_amount = curr_amount * rate

                # Only update if we found a better path
                if new_amount > day2_amounts.get(next_currency, 0):
                    day2_amounts[next_currency] = new_amount
                    queue.append(next_currency)

    return max_final_amount
```

```javascript
// Time: O(N + M) where N = number of pairs1, M = number of pairs2
// Space: O(C) where C = number of unique currencies
function maximizeAmount(initialCurrency, pairs1, rates1, pairs2, rates2) {
  /**
   * Maximize the amount after two days of currency conversions.
   *
   * @param {string} initialCurrency - Starting currency
   * @param {string[][]} pairs1 - Array of [start, end] currency pairs for day 1
   * @param {number[]} rates1 - Array of conversion rates for day 1
   * @param {string[][]} pairs2 - Array of [start, end] currency pairs for day 2
   * @param {number[]} rates2 - Array of conversion rates for day 2
   * @return {number} Maximum amount achievable after two days
   */

  // Step 1: Build adjacency list for day 1 conversions
  const graph1 = new Map();
  for (let i = 0; i < pairs1.length; i++) {
    const [start, end] = pairs1[i];
    const rate = rates1[i];

    if (!graph1.has(start)) {
      graph1.set(start, []);
    }
    graph1.get(start).push([end, rate]);
  }

  // Step 2: BFS on day 1 to find max amount for each reachable currency
  const day1Amounts = new Map();
  day1Amounts.set(initialCurrency, 1.0);
  const queue1 = [initialCurrency];

  while (queue1.length > 0) {
    const currCurrency = queue1.shift();
    const currAmount = day1Amounts.get(currCurrency);

    // Explore all conversions from current currency
    const neighbors = graph1.get(currCurrency) || [];
    for (const [nextCurrency, rate] of neighbors) {
      const newAmount = currAmount * rate;

      // Only update if we found a better path to this currency
      if (!day1Amounts.has(nextCurrency) || newAmount > day1Amounts.get(nextCurrency)) {
        day1Amounts.set(nextCurrency, newAmount);
        queue1.push(nextCurrency);
      }
    }
  }

  // Step 3: Build adjacency list for day 2 conversions
  const graph2 = new Map();
  for (let i = 0; i < pairs2.length; i++) {
    const [start, end] = pairs2[i];
    const rate = rates2[i];

    if (!graph2.has(start)) {
      graph2.set(start, []);
    }
    graph2.get(start).push([end, rate]);
  }

  // Step 4: For each currency we have after day 1, explore day 2 conversions
  let maxFinalAmount = 0;

  for (const [startCurrency, startAmount] of day1Amounts) {
    // BFS for day 2 starting from this currency
    const day2Amounts = new Map();
    day2Amounts.set(startCurrency, startAmount);
    const queue2 = [startCurrency];

    while (queue2.length > 0) {
      const currCurrency = queue2.shift();
      const currAmount = day2Amounts.get(currCurrency);

      // Update global maximum
      maxFinalAmount = Math.max(maxFinalAmount, currAmount);

      // Explore day 2 conversions
      const neighbors = graph2.get(currCurrency) || [];
      for (const [nextCurrency, rate] of neighbors) {
        const newAmount = currAmount * rate;

        // Only update if we found a better path
        if (!day2Amounts.has(nextCurrency) || newAmount > day2Amounts.get(nextCurrency)) {
          day2Amounts.set(nextCurrency, newAmount);
          queue2.push(nextCurrency);
        }
      }
    }
  }

  return maxFinalAmount;
}
```

```java
// Time: O(N + M) where N = number of pairs1, M = number of pairs2
// Space: O(C) where C = number of unique currencies
import java.util.*;

public class Solution {
    public double maximizeAmount(String initialCurrency,
                                 List<List<String>> pairs1,
                                 List<Double> rates1,
                                 List<List<String>> pairs2,
                                 List<Double> rates2) {
        /**
         * Maximize the amount after two days of currency conversions.
         *
         * @param initialCurrency Starting currency
         * @param pairs1 List of [start, end] currency pairs for day 1
         * @param rates1 List of conversion rates for day 1
         * @param pairs2 List of [start, end] currency pairs for day 2
         * @param rates2 List of conversion rates for day 2
         * @return Maximum amount achievable after two days
         */

        // Step 1: Build adjacency list for day 1 conversions
        Map<String, List<Pair>> graph1 = new HashMap<>();
        for (int i = 0; i < pairs1.size(); i++) {
            String start = pairs1.get(i).get(0);
            String end = pairs1.get(i).get(1);
            double rate = rates1.get(i);

            graph1.computeIfAbsent(start, k -> new ArrayList<>())
                  .add(new Pair(end, rate));
        }

        // Step 2: BFS on day 1 to find max amount for each reachable currency
        Map<String, Double> day1Amounts = new HashMap<>();
        day1Amounts.put(initialCurrency, 1.0);
        Queue<String> queue1 = new LinkedList<>();
        queue1.offer(initialCurrency);

        while (!queue1.isEmpty()) {
            String currCurrency = queue1.poll();
            double currAmount = day1Amounts.get(currCurrency);

            // Explore all conversions from current currency
            List<Pair> neighbors = graph1.getOrDefault(currCurrency, new ArrayList<>());
            for (Pair neighbor : neighbors) {
                String nextCurrency = neighbor.currency;
                double newAmount = currAmount * neighbor.rate;

                // Only update if we found a better path to this currency
                if (!day1Amounts.containsKey(nextCurrency) ||
                    newAmount > day1Amounts.get(nextCurrency)) {
                    day1Amounts.put(nextCurrency, newAmount);
                    queue1.offer(nextCurrency);
                }
            }
        }

        // Step 3: Build adjacency list for day 2 conversions
        Map<String, List<Pair>> graph2 = new HashMap<>();
        for (int i = 0; i < pairs2.size(); i++) {
            String start = pairs2.get(i).get(0);
            String end = pairs2.get(i).get(1);
            double rate = rates2.get(i);

            graph2.computeIfAbsent(start, k -> new ArrayList<>())
                  .add(new Pair(end, rate));
        }

        // Step 4: For each currency we have after day 1, explore day 2 conversions
        double maxFinalAmount = 0.0;

        for (Map.Entry<String, Double> entry : day1Amounts.entrySet()) {
            String startCurrency = entry.getKey();
            double startAmount = entry.getValue();

            // BFS for day 2 starting from this currency
            Map<String, Double> day2Amounts = new HashMap<>();
            day2Amounts.put(startCurrency, startAmount);
            Queue<String> queue2 = new LinkedList<>();
            queue2.offer(startCurrency);

            while (!queue2.isEmpty()) {
                String currCurrency = queue2.poll();
                double currAmount = day2Amounts.get(currCurrency);

                // Update global maximum
                maxFinalAmount = Math.max(maxFinalAmount, currAmount);

                // Explore day 2 conversions
                List<Pair> neighbors = graph2.getOrDefault(currCurrency, new ArrayList<>());
                for (Pair neighbor : neighbors) {
                    String nextCurrency = neighbor.currency;
                    double newAmount = currAmount * neighbor.rate;

                    // Only update if we found a better path
                    if (!day2Amounts.containsKey(nextCurrency) ||
                        newAmount > day2Amounts.get(nextCurrency)) {
                        day2Amounts.put(nextCurrency, newAmount);
                        queue2.offer(nextCurrency);
                    }
                }
            }
        }

        return maxFinalAmount;
    }

    // Helper class to store currency-rate pairs
    class Pair {
        String currency;
        double rate;

        Pair(String currency, double rate) {
            this.currency = currency;
            this.rate = rate;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N + M) where N is the number of pairs in `pairs1` and M is the number of pairs in `pairs2`. Each edge is processed at most once during BFS traversal on each day. The BFS on day 1 processes all N edges, and for each reachable currency from day 1, we run BFS on day 2 which processes M edges. In the worst case, if all currencies are reachable, this becomes O(C × M) where C is the number of currencies, but typically C is much smaller than N and M.

**Space Complexity:** O(C + N + M) where C is the number of unique currencies. We store:

- Adjacency lists for both graphs: O(N + M)
- Amount maps for BFS: O(C)
- Queues for BFS: O(C)

## Common Mistakes

1. **Not considering multiple conversions on the same day**: Some candidates only consider direct conversions instead of chains like USD→EUR→GBP. Remember you can convert multiple times on each day.

2. **Using DFS instead of BFS for maximum amount**: While DFS could work, BFS is more natural here because we want to explore all reachable currencies. With DFS, you need to be careful about cycles and ensure you're tracking maximum amounts.

3. **Forgetting to include the "do nothing" option**: You can choose not to convert on either day. Our solution handles this because we start BFS from each currency with its current amount.

4. **Not updating amounts when finding better paths**: When we find a new path to a currency with a higher amount, we must update it and re-explore from that currency. This is why we use a queue and re-add currencies when we find better amounts.

## When You'll See This Pattern

This problem combines graph traversal with dynamic programming concepts (keeping track of maximum amounts). You'll see similar patterns in:

1. **Evaluate Division (LeetCode 399)**: Given equations and values, calculate queries. Both problems involve finding conversion rates through intermediate nodes in a graph.

2. **Cheapest Flights Within K Stops (LeetCode 787)**: Finding the cheapest path with at most K stops. Both involve optimizing a value (price/amount) through a graph with constraints on steps.

3. **Network Delay Time (LeetCode 743)**: Finding the time it takes for a signal to reach all nodes. Both use BFS/DFS to propagate values through a graph.

The core pattern is: when you need to find optimal paths through a graph where values combine multiplicatively or additively, and you have constraints on the number of steps, consider BFS/DFS with memoization of best values for each node.

## Key Takeaways

1. **Graph modeling**: Many conversion/rate problems can be modeled as graphs where nodes are states (currencies) and edges are transformations (conversion rates).

2. **BFS with value tracking**: When you need to find optimal paths in terms of some metric (maximum amount, minimum cost), BFS that tracks and updates the best value for each node is often effective.

3. **Layered problems**: When a problem has distinct phases or days, solve each phase independently, passing the results (reachable states with their values) to the next phase.

Related problems: [Evaluate Division](/problem/evaluate-division)
