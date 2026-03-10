---
title: "How to Solve Final Prices With a Special Discount in a Shop — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Final Prices With a Special Discount in a Shop. Easy difficulty, 84.0% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2027-08-12"
category: "dsa-patterns"
tags:
  ["final-prices-with-a-special-discount-in-a-shop", "array", "stack", "monotonic-stack", "easy"]
---

# How to Solve Final Prices With a Special Discount in a Shop

You're given an array of item prices and need to apply a discount to each item: for the `i`th item, find the first price to its right that's less than or equal to it, and subtract that from the original price. The challenge is doing this efficiently for all items without repeatedly scanning the array.

What makes this problem interesting is that it looks like a simple array problem at first glance, but the optimal solution uses a **monotonic stack** pattern that appears in many interview questions. Recognizing when to use this pattern is a key skill.

## Visual Walkthrough

Let's trace through an example: `prices = [8, 4, 6, 2, 3]`

For each item, we need to find the first price to its right that's ≤ current price:

1. **Item 0 (price 8)**: Look right → 4 ≤ 8 ✓ (first one found)
   - Discounted price = 8 - 4 = 4

2. **Item 1 (price 4)**: Look right → 6 > 4 ✗, 2 ≤ 4 ✓
   - Discounted price = 4 - 2 = 2

3. **Item 2 (price 6)**: Look right → 2 ≤ 6 ✓ (first one found)
   - Discounted price = 6 - 2 = 4

4. **Item 3 (price 2)**: Look right → 3 > 2 ✗ (no smaller price found)
   - Discounted price = 2 - 0 = 2

5. **Item 4 (price 3)**: No items to the right
   - Discounted price = 3 - 0 = 3

Final result: `[4, 2, 4, 2, 3]`

The brute force approach would check each item against all items to its right until finding a suitable discount. But there's a more efficient way: we can process items from right to left using a stack to remember prices we've seen.

## Brute Force Approach

The straightforward solution is to use nested loops: for each item, scan forward to find the first price ≤ current price.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output
def finalPrices(prices):
    n = len(prices)
    result = [0] * n

    for i in range(n):
        # Start with the original price (no discount)
        result[i] = prices[i]

        # Look for the first price to the right that's ≤ current price
        for j in range(i + 1, n):
            if prices[j] <= prices[i]:
                result[i] -= prices[j]  # Apply discount
                break  # Found the first valid discount, stop looking

    return result
```

```javascript
// Time: O(n²) | Space: O(1) excluding output
function finalPrices(prices) {
  const n = prices.length;
  const result = new Array(n);

  for (let i = 0; i < n; i++) {
    // Start with the original price
    result[i] = prices[i];

    // Look for the first discount to the right
    for (let j = i + 1; j < n; j++) {
      if (prices[j] <= prices[i]) {
        result[i] -= prices[j]; // Apply discount
        break; // Found first valid discount
      }
    }
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output
public int[] finalPrices(int[] prices) {
    int n = prices.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        // Start with original price
        result[i] = prices[i];

        // Look for first discount to the right
        for (int j = i + 1; j < n; j++) {
            if (prices[j] <= prices[i]) {
                result[i] -= prices[j];  // Apply discount
                break;  // Found first valid discount
            }
        }
    }

    return result;
}
```

</div>

**Why this isn't optimal:** For an array of length `n`, we're doing roughly `n + (n-1) + (n-2) + ... + 1 = n(n-1)/2` comparisons, which is O(n²) time complexity. This becomes too slow for large inputs (e.g., n = 10,000 would need ~50 million operations).

## Optimal Solution

We can solve this in O(n) time using a **monotonic stack**. The key insight: when processing from right to left, we can maintain a stack of prices we've seen, keeping it in increasing order. For each price, we pop from the stack until we find a price ≤ current price (which becomes our discount), or the stack becomes empty (no discount).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def finalPrices(prices):
    n = len(prices)
    result = prices[:]  # Start with copy of original prices
    stack = []  # Monotonic increasing stack (stores indices)

    # Process each price from left to right
    for i in range(n):
        # While stack has prices and current price ≤ price at top of stack
        # This means current price is a valid discount for those items
        while stack and prices[i] <= prices[stack[-1]]:
            # Apply discount to the item at top of stack
            idx = stack.pop()
            result[idx] -= prices[i]

        # Push current index onto stack
        # We'll look for discounts for this item later
        stack.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function finalPrices(prices) {
  const n = prices.length;
  const result = [...prices]; // Copy original prices
  const stack = []; // Monotonic increasing stack (stores indices)

  // Process each price from left to right
  for (let i = 0; i < n; i++) {
    // While stack has prices and current price ≤ price at top of stack
    // Current price is a valid discount for those items
    while (stack.length > 0 && prices[i] <= prices[stack[stack.length - 1]]) {
      // Apply discount to the item at top of stack
      const idx = stack.pop();
      result[idx] -= prices[i];
    }

    // Push current index onto stack
    // We'll look for discounts for this item later
    stack.push(i);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] finalPrices(int[] prices) {
    int n = prices.length;
    int[] result = prices.clone();  // Copy original prices
    Stack<Integer> stack = new Stack<>();  // Monotonic increasing stack (stores indices)

    // Process each price from left to right
    for (int i = 0; i < n; i++) {
        // While stack has prices and current price ≤ price at top of stack
        // Current price is a valid discount for those items
        while (!stack.isEmpty() && prices[i] <= prices[stack.peek()]) {
            // Apply discount to the item at top of stack
            int idx = stack.pop();
            result[idx] -= prices[i];
        }

        // Push current index onto stack
        // We'll look for discounts for this item later
        stack.push(i);
    }

    return result;
}
```

</div>

**How it works:** We process items left to right. The stack maintains indices of items that haven't found their discount yet. When we see a price that's ≤ the price at the top of the stack, it means we've found the first discount for that item (since we're processing left to right, this is the first price to the right that satisfies the condition). We pop from the stack and apply the discount. Each item gets pushed onto the stack once and popped at most once, giving us O(n) time.

## Complexity Analysis

**Time Complexity: O(n)**

- Each index is pushed onto the stack exactly once
- Each index is popped from the stack at most once
- Even with the while loop inside the for loop, the total number of operations is linear because each element enters and exits the stack at most once

**Space Complexity: O(n)**

- We need O(n) space for the result array
- The stack can hold up to n indices in the worst case (when prices are strictly decreasing)
- Total: O(n) space

## Common Mistakes

1. **Forgetting to handle "no discount" case**: Some candidates forget that if no smaller price is found to the right, the price remains unchanged. Always initialize the result with the original prices.

2. **Using wrong comparison operator**: The problem says "prices[j] ≤ prices[i]" not "prices[j] < prices[i]". Using strict less-than would fail for cases where the discount price equals the original price.

3. **Not breaking early in brute force**: In the nested loop approach, you must break once you find the first valid discount. Continuing to search would apply the wrong discount if there are multiple valid discounts.

4. **Confusing indices and values in stack**: The stack should store indices, not values, because we need to know both the price (to compare) and the position (to apply the discount to the correct element in the result array).

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to find the "next smaller/larger element" for each item in an array:

1. **Next Greater Element I (LeetCode 496)** - Similar pattern but finding next greater element
2. **Daily Temperatures (LeetCode 739)** - Find how many days until a warmer temperature (next greater element with distance)
3. **Largest Rectangle in Histogram (LeetCode 84)** - More advanced use of monotonic stacks to find boundaries
4. **Remove K Digits (LeetCode 402)** - Uses monotonic stack to maintain increasing/decreasing order

The key signal is when you need to find relationships between each element and the "next" element satisfying some condition in an array.

## Key Takeaways

1. **Monotonic stacks excel at "next element" problems**: When you need to find the next smaller/greater element for each item in an array, consider using a monotonic stack for O(n) time.

2. **Process direction matters**: For "next element to the right" problems, process left to right. For "previous element to the left" problems, process right to left.

3. **Store indices, not just values**: You often need both the value (for comparison) and the position (to update the correct element in the result).

[Practice this problem on CodeJeet](/problem/final-prices-with-a-special-discount-in-a-shop)
