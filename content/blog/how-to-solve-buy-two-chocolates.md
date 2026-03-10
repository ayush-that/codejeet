---
title: "How to Solve Buy Two Chocolates — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Buy Two Chocolates. Easy difficulty, 68.3% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-07-23"
category: "dsa-patterns"
tags: ["buy-two-chocolates", "array", "greedy", "sorting", "easy"]
---

# How to Solve Buy Two Chocolates

You need to buy exactly two chocolates from a list of prices while spending as little money as possible, ensuring you have non-negative leftover money. The challenge is finding the cheapest pair efficiently without checking every possible combination. While this seems straightforward, the optimal solution requires careful thinking about how to minimize spending.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `prices = [3, 2, 5, 1]` and `money = 6`.

**Step 1:** First, we need to find the two cheapest chocolates. Looking at the array: 3, 2, 5, 1.

**Step 2:** The cheapest chocolate is 1, and the second cheapest is 2. Their sum is 1 + 2 = 3.

**Step 3:** We have money = 6. If we buy these two chocolates, we spend 3, leaving us with 6 - 3 = 3 leftover.

**Step 4:** Since 3 is non-negative, we can afford this pair. The answer is 3.

What if we couldn't afford the cheapest pair? Let's try `prices = [5, 6, 7]` with `money = 4`.

**Step 1:** The two cheapest are 5 and 6, sum = 11.

**Step 2:** We only have 4, so 4 - 11 = -7 (negative).

**Step 3:** Since we can't afford any pair (all prices are too high), we return our original money: 4.

The key insight: **To maximize leftover money, we need to minimize spending. The minimum spending for two chocolates is always the sum of the two smallest prices.**

## Brute Force Approach

A naive approach would check every possible pair of chocolates. For each pair (i, j) where i ≠ j:

1. Calculate the sum = prices[i] + prices[j]
2. If sum ≤ money, calculate leftover = money - sum
3. Track the maximum leftover (or minimum spending)

This brute force solution has O(n²) time complexity because for n chocolates, there are n×(n-1)/2 pairs to check. While this works for small inputs, it's inefficient for larger arrays. The problem constraints (up to 50 chocolates) make even O(n²) acceptable, but we can do better with a more elegant solution.

Here's what the brute force might look like:

<div class="code-group">

```python
# Brute Force: O(n²) time, O(1) space
def buyChoco(prices, money):
    max_leftover = -1

    # Check every pair
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            total = prices[i] + prices[j]
            if total <= money:
                leftover = money - total
                max_leftover = max(max_leftover, leftover)

    # If no affordable pair, return original money
    return money if max_leftover == -1 else max_leftover
```

```javascript
// Brute Force: O(n²) time, O(1) space
function buyChoco(prices, money) {
  let maxLeftover = -1;

  // Check every pair
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const total = prices[i] + prices[j];
      if (total <= money) {
        const leftover = money - total;
        maxLeftover = Math.max(maxLeftover, leftover);
      }
    }
  }

  // If no affordable pair, return original money
  return maxLeftover === -1 ? money : maxLeftover;
}
```

```java
// Brute Force: O(n²) time, O(1) space
public int buyChoco(int[] prices, int money) {
    int maxLeftover = -1;

    // Check every pair
    for (int i = 0; i < prices.length; i++) {
        for (int j = i + 1; j < prices.length; j++) {
            int total = prices[i] + prices[j];
            if (total <= money) {
                int leftover = money - total;
                maxLeftover = Math.max(maxLeftover, leftover);
            }
        }
    }

    // If no affordable pair, return original money
    return maxLeftover == -1 ? money : maxLeftover;
}
```

</div>

## Optimal Solution

The optimal solution is surprisingly simple: **find the two smallest prices**. If their sum is less than or equal to our money, we buy them and return the leftover. Otherwise, we return the original money unchanged.

Why does this work? To maximize leftover money, we need to minimize spending. The minimum possible spending for exactly two items is always the sum of the two smallest prices. No other pair can give us more leftover money because any other pair would cost the same or more.

We can find the two smallest prices in O(n) time by scanning the array once, keeping track of the smallest and second smallest values we've seen.

<div class="code-group">

```python
# Optimal Solution: O(n) time, O(1) space
def buyChoco(prices, money):
    # Initialize with large values to ensure any price will be smaller
    smallest = float('inf')
    second_smallest = float('inf')

    # Find the two smallest prices in one pass
    for price in prices:
        if price < smallest:
            # Current smallest becomes second smallest
            second_smallest = smallest
            # Update smallest with new minimum
            smallest = price
        elif price < second_smallest:
            # Price is between smallest and second smallest
            second_smallest = price

    # Calculate total cost of two cheapest chocolates
    total_cost = smallest + second_smallest

    # If we can afford them, return leftover money
    # Otherwise, return original money
    return money - total_cost if total_cost <= money else money
```

```javascript
// Optimal Solution: O(n) time, O(1) space
function buyChoco(prices, money) {
  // Initialize with large values (Infinity works in JavaScript)
  let smallest = Infinity;
  let secondSmallest = Infinity;

  // Find the two smallest prices in one pass
  for (let price of prices) {
    if (price < smallest) {
      // Current smallest becomes second smallest
      secondSmallest = smallest;
      // Update smallest with new minimum
      smallest = price;
    } else if (price < secondSmallest) {
      // Price is between smallest and second smallest
      secondSmallest = price;
    }
  }

  // Calculate total cost of two cheapest chocolates
  const totalCost = smallest + secondSmallest;

  // If we can afford them, return leftover money
  // Otherwise, return original money
  return totalCost <= money ? money - totalCost : money;
}
```

```java
// Optimal Solution: O(n) time, O(1) space
public int buyChoco(int[] prices, int money) {
    // Initialize with large values (Integer.MAX_VALUE)
    int smallest = Integer.MAX_VALUE;
    int secondSmallest = Integer.MAX_VALUE;

    // Find the two smallest prices in one pass
    for (int price : prices) {
        if (price < smallest) {
            // Current smallest becomes second smallest
            secondSmallest = smallest;
            // Update smallest with new minimum
            smallest = price;
        } else if (price < secondSmallest) {
            // Price is between smallest and second smallest
            secondSmallest = price;
        }
    }

    // Calculate total cost of two cheapest chocolates
    int totalCost = smallest + secondSmallest;

    // If we can afford them, return leftover money
    // Otherwise, return original money
    return totalCost <= money ? money - totalCost : money;
}
```

</div>

**Alternative approach using sorting:** We could also sort the array and take the first two elements. This gives O(n log n) time and O(1) space (if sorting in-place). While simpler to implement, it's less efficient than the O(n) single-pass solution.

<div class="code-group">

```python
# Sorting approach: O(n log n) time, O(1) space
def buyChoco(prices, money):
    # Sort prices in ascending order
    prices.sort()

    # Sum of two cheapest chocolates
    total_cost = prices[0] + prices[1]

    # Return leftover if affordable, else original money
    return money - total_cost if total_cost <= money else money
```

```javascript
// Sorting approach: O(n log n) time, O(1) space
function buyChoco(prices, money) {
  // Sort prices in ascending order
  prices.sort((a, b) => a - b);

  // Sum of two cheapest chocolates
  const totalCost = prices[0] + prices[1];

  // Return leftover if affordable, else original money
  return totalCost <= money ? money - totalCost : money;
}
```

```java
// Sorting approach: O(n log n) time, O(1) space
public int buyChoco(int[] prices, int money) {
    // Sort prices in ascending order
    Arrays.sort(prices);

    // Sum of two cheapest chocolates
    int totalCost = prices[0] + prices[1];

    // Return leftover if affordable, else original money
    return totalCost <= money ? money - totalCost : money;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- The optimal solution makes a single pass through the array to find the two smallest prices. Each price is examined once.
- The sorting approach takes O(n log n) time due to the sort operation.

**Space Complexity: O(1)**

- Both approaches use only a constant amount of extra space for variables (smallest, secondSmallest, etc.).
- The sorting approach may use O(log n) space for the sorting algorithm's recursion stack, but this is typically considered O(1) for practical purposes.

## Common Mistakes

1. **Forgetting to handle the case where no pair is affordable**: Some candidates return 0 or a negative number when they can't afford any pair. Remember: if you can't buy two chocolates, you leave with your original money unchanged.

2. **Incorrectly finding the two smallest values**: When updating `smallest` and `secondSmallest`, the order matters. You must update `secondSmallest` with the old `smallest` value BEFORE updating `smallest` with the new price. Otherwise, you lose track of what was previously the smallest.

3. **Using the wrong comparison in the else-if condition**: The condition should be `price < secondSmallest`, not `price <= secondSmallest`. While `<=` would also work, it's less efficient as it performs unnecessary updates when prices are equal.

4. **Not initializing variables properly**: Using 0 as initial values for `smallest` and `secondSmallest` will fail if all prices are positive (0 would incorrectly be considered the smallest). Always initialize with a value larger than any possible price (like `Infinity` or `Integer.MAX_VALUE`).

## When You'll See This Pattern

The "find k smallest/largest elements" pattern appears in many problems:

1. **Kth Largest Element in an Array (LeetCode 215)**: Finding the kth largest element uses similar logic but typically with a heap or quickselect algorithm.

2. **Maximum Product of Two Elements in an Array (LeetCode 1464)**: Instead of finding the smallest two, you find the largest two values to maximize their product.

3. **Minimum Sum of Four Digit Number After Splitting Digits (LeetCode 2160)**: You split digits into two pairs to minimize their sum, which involves finding optimal combinations.

The core technique of tracking the smallest/largest elements in a single pass is valuable for optimization problems where you need extreme values from a dataset.

## Key Takeaways

1. **Minimize spending to maximize leftover**: When you need to maximize leftover money after a purchase, focus on minimizing the cost. The cheapest pair always gives the most leftover.

2. **Find extreme values efficiently**: Learning to find the k smallest/largest elements in O(n) time is a fundamental skill. The two-pointer update technique (updating both smallest and secondSmallest correctly) is worth memorizing.

3. **Consider sorting as an alternative**: While the O(n) single-pass solution is optimal, sorting the array and taking the first k elements is often simpler to implement and may be acceptable if constraints allow.

[Practice this problem on CodeJeet](/problem/buy-two-chocolates)
