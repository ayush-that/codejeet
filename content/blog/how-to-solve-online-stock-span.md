---
title: "How to Solve Online Stock Span — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Online Stock Span. Medium difficulty, 68.7% acceptance rate. Topics: Stack, Design, Monotonic Stack, Data Stream."
date: "2027-03-20"
category: "dsa-patterns"
tags: ["online-stock-span", "stack", "design", "monotonic-stack", "medium"]
---

# How to Solve Online Stock Span

This problem asks us to design a system that calculates the "span" of a stock price for each day. The span is defined as the number of consecutive days (including the current day, going backward) where the stock price was less than or equal to today's price. The tricky part is that we need to calculate this efficiently for a stream of daily prices, where each new day's calculation depends on previous days' prices. This is a classic "monotonic stack" problem that appears frequently in coding interviews.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we receive daily prices: `[100, 80, 60, 70, 60, 75, 85]`.

**Day 0 (Price: 100)**

- No previous days to check
- Span = 1 (just the current day)

**Day 1 (Price: 80)**

- Previous day price (100) > 80, so we stop
- Span = 1

**Day 2 (Price: 60)**

- Previous day price (80) > 60, stop
- Span = 1

**Day 3 (Price: 70)**

- Previous day price (60) ≤ 70, so we include it (span = 2)
- Day before that (80) > 70, stop
- Span = 2

**Day 4 (Price: 60)**

- Previous day price (70) > 60, stop
- Span = 1

**Day 5 (Price: 75)**

- Previous day price (60) ≤ 75 (span = 2)
- Day before that (70) ≤ 75 (span = 3)
- Day before that (80) > 75, stop
- Span = 3

**Day 6 (Price: 85)**

- Previous day price (75) ≤ 85 (span = 2)
- Day before that (60) ≤ 85 (span = 3)
- Day before that (70) ≤ 85 (span = 4)
- Day before that (80) ≤ 85 (span = 5)
- Day before that (100) > 85, stop
- Span = 5

The key observation: when we find a price higher than the current day, we can stop looking further back because that higher price acts as a "wall" blocking our view of earlier days.

## Brute Force Approach

The most straightforward approach is to, for each new price, look backward day by day until we find a price higher than today's price. We count all consecutive days where the price was ≤ today's price.

<div class="code-group">

```python
class StockSpannerBruteForce:
    def __init__(self):
        self.prices = []

    def next(self, price: int) -> int:
        # Add the new price to our history
        self.prices.append(price)

        # Start counting from the current day backward
        span = 0
        # Walk backward through all previous days
        for i in range(len(self.prices) - 1, -1, -1):
            if self.prices[i] <= price:
                span += 1
            else:
                # Found a price higher than today, stop looking further
                break

        return span
```

```javascript
class StockSpannerBruteForce {
  constructor() {
    this.prices = [];
  }

  next(price) {
    // Add the new price to our history
    this.prices.push(price);

    // Start counting from the current day backward
    let span = 0;
    // Walk backward through all previous days
    for (let i = this.prices.length - 1; i >= 0; i--) {
      if (this.prices[i] <= price) {
        span++;
      } else {
        // Found a price higher than today, stop looking further
        break;
      }
    }

    return span;
  }
}
```

```java
class StockSpannerBruteForce {
    private List<Integer> prices;

    public StockSpannerBruteForce() {
        prices = new ArrayList<>();
    }

    public int next(int price) {
        // Add the new price to our history
        prices.add(price);

        // Start counting from the current day backward
        int span = 0;
        // Walk backward through all previous days
        for (int i = prices.size() - 1; i >= 0; i--) {
            if (prices.get(i) <= price) {
                span++;
            } else {
                // Found a price higher than today, stop looking further
                break;
            }
        }

        return span;
    }
}
```

</div>

**Why this is inefficient:** In the worst case (when prices are in non-decreasing order), for the nth price, we need to check all n-1 previous prices. This gives us O(n) time per `next()` call, or O(n²) total time for n calls. We need a way to "remember" information about previous spans so we don't have to re-check every single day.

## Optimized Approach

The key insight is that when we encounter a price that's ≤ today's price, we don't need to check the days before it individually — we can jump directly to the day before its span started. This is where a **monotonic decreasing stack** comes in.

Here's the reasoning:

1. We maintain a stack of pairs `(price, span)` where the stack is always in decreasing order of price (from bottom to top).
2. When a new price comes in:
   - Start with span = 1 (the current day)
   - While the stack is not empty and the top price ≤ current price:
     - Pop the top element and add its span to our current span
     - This works because if that previous price was ≤ current price, then ALL days in its span must also be ≤ current price (otherwise its span would have stopped earlier)
   - Push the current price and its calculated span onto the stack

This approach is efficient because each price gets pushed and popped from the stack at most once, giving us amortized O(1) time per operation.

## Optimal Solution

<div class="code-group">

```python
class StockSpanner:
    def __init__(self):
        # Stack stores pairs of (price, span)
        # The stack maintains prices in decreasing order
        self.stack = []

    def next(self, price: int) -> int:
        # Start with span of 1 for the current day
        span = 1

        # While stack is not empty and the top price is <= current price
        while self.stack and self.stack[-1][0] <= price:
            # Pop the top element and add its span to our current span
            # This works because if that price was <= current price,
            # then all days in its span must also be <= current price
            prev_price, prev_span = self.stack.pop()
            span += prev_span

        # Push the current price and its calculated span onto the stack
        self.stack.append((price, span))

        return span
```

```javascript
class StockSpanner {
  constructor() {
    // Stack stores objects with price and span properties
    // The stack maintains prices in decreasing order
    this.stack = [];
  }

  next(price) {
    // Start with span of 1 for the current day
    let span = 1;

    // While stack is not empty and the top price is <= current price
    while (this.stack.length > 0 && this.stack[this.stack.length - 1].price <= price) {
      // Pop the top element and add its span to our current span
      // This works because if that price was <= current price,
      // then all days in its span must also be <= current price
      const prev = this.stack.pop();
      span += prev.span;
    }

    // Push the current price and its calculated span onto the stack
    this.stack.push({ price, span });

    return span;
  }
}
```

```java
class StockSpanner {
    // Stack stores PriceSpan objects
    // The stack maintains prices in decreasing order
    private Stack<PriceSpan> stack;

    // Helper class to store price and span together
    class PriceSpan {
        int price;
        int span;

        PriceSpan(int price, int span) {
            this.price = price;
            this.span = span;
        }
    }

    public StockSpanner() {
        stack = new Stack<>();
    }

    public int next(int price) {
        // Start with span of 1 for the current day
        int span = 1;

        // While stack is not empty and the top price is <= current price
        while (!stack.isEmpty() && stack.peek().price <= price) {
            // Pop the top element and add its span to our current span
            // This works because if that price was <= current price,
            // then all days in its span must also be <= current price
            PriceSpan prev = stack.pop();
            span += prev.span;
        }

        // Push the current price and its calculated span onto the stack
        stack.push(new PriceSpan(price, span));

        return span;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) amortized per `next()` call

- Each price is pushed onto the stack exactly once
- Each price is popped from the stack at most once
- Even though we have a while loop, the total number of operations across all `next()` calls is O(n), giving us amortized O(1) per call

**Space Complexity:** O(n) in the worst case

- In the worst case (strictly decreasing prices), we store every price in the stack
- Each stack element stores both price and span (constant space per element)

## Common Mistakes

1. **Forgetting to store spans in the stack:** Some candidates try to store only prices in the stack, then when they pop, they don't know how many days to jump back. You must store both price and span together.

2. **Using the wrong comparison operator:** The problem says "price was less than or equal to," so we need `≤` not `<`. Using `<` would give incorrect results when prices are equal.

3. **Not handling the stack correctly in the while loop:** The condition should check `stack[-1][0] <= price` (top price ≤ current price), not the other way around. We want to pop all prices that are ≤ current price because they're part of our span.

4. **Starting span at 0 instead of 1:** The span always includes the current day, so we should initialize span to 1, not 0.

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to find the "next greater/smaller element" or calculate spans/ranges based on comparisons with previous elements. This pattern is useful because it lets you process elements in linear time by maintaining relevant information in a stack.

Related problems that use similar techniques:

1. **Daily Temperatures (LeetCode 739)** - Find how many days until a warmer temperature. Instead of storing spans, you store indices and calculate the difference.
2. **Next Greater Element I & II (LeetCode 496, 503)** - Find the next greater element in an array, with variations for circular arrays.
3. **Largest Rectangle in Histogram (LeetCode 84)** - A more advanced application where you need to find the largest rectangle that can be formed in a histogram.

## Key Takeaways

1. **Monotonic stacks are perfect for "span" problems:** When you need to find how far you can go in one direction while a condition holds, a monotonic stack often provides an O(n) solution.

2. **Store additional information with stack elements:** In this case, we stored both price and span. In other problems, you might store indices, counts, or other metadata needed for the calculation.

3. **Amortized analysis matters:** Even though individual operations might pop multiple elements, the total work is linear because each element is processed at most twice (pushed and popped).

Related problems: [Daily Temperatures](/problem/daily-temperatures)
