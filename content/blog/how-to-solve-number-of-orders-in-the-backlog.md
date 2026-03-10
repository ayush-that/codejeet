---
title: "How to Solve Number of Orders in the Backlog — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Orders in the Backlog. Medium difficulty, 53.6% acceptance rate. Topics: Array, Heap (Priority Queue), Simulation."
date: "2029-01-25"
category: "dsa-patterns"
tags: ["number-of-orders-in-the-backlog", "array", "heap-(priority-queue)", "simulation", "medium"]
---

# How to Solve Number of Orders in the Backlog

This problem simulates a stock order backlog where buy and sell orders are matched by price. The tricky part is that orders are processed in batches, and we need to efficiently match the highest buy orders with the lowest sell orders while tracking the remaining unmatched orders. This is essentially a **matching problem** that requires maintaining two priority queues to efficiently access extreme values.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:** `orders = [[10,5,0],[15,2,1],[25,1,1],[30,4,0],[5,10,1]]`

We'll process each order batch step by step:

1. **Order 1:** `[10,5,0]` → 5 buy orders at price 10
   - No sell orders yet, so all 5 buys go to backlog
   - **Backlog:** Buys: {10:5}, Sells: {}

2. **Order 2:** `[15,2,1]` → 2 sell orders at price 15
   - Check if any buy orders with price ≥ 15 exist
   - Highest buy is 10 (less than 15), so no match
   - All 2 sells go to backlog
   - **Backlog:** Buys: {10:5}, Sells: {15:2}

3. **Order 3:** `[25,1,1]` → 1 sell order at price 25
   - Check buys: highest is 10 (less than 25), no match
   - Sell goes to backlog
   - **Backlog:** Buys: {10:5}, Sells: {15:2, 25:1}

4. **Order 4:** `[30,4,0]` → 4 buy orders at price 30
   - Check sells: lowest is 15 (≤ 30), so we match!
   - Match 4 buys with sells at 15: we have 2 sells at 15
   - Match 2 buys with 2 sells → 2 buys remain
   - Check next lowest sell: 25 (≤ 30), match remaining 2 buys
   - Match 2 buys with 1 sell at 25 → 1 buy remains, sell at 25 is exhausted
   - Remaining 1 buy goes to backlog
   - **Backlog:** Buys: {10:5, 30:1}, Sells: {}

5. **Order 5:** `[5,10,1]` → 10 sell orders at price 5
   - Check buys: highest is 30 (≥ 5), match!
   - Match 10 sells with buys at 30: we have 1 buy at 30
   - Match 1 sell with 1 buy → 9 sells remain, buy at 30 exhausted
   - Next highest buy: 10 (≥ 5), match!
   - Match 9 sells with 5 buys at 10 → 4 sells remain, buys at 10 exhausted
   - Remaining 4 sells go to backlog
   - **Backlog:** Buys: {}, Sells: {5:4}

**Final backlog:** 0 buy orders + 4 sell orders = **4 total orders**

The key insight: we always match the **highest buy** with the **lowest sell** when the buy price ≥ sell price.

## Brute Force Approach

A naive approach would store all orders in simple arrays or lists and scan through them for matching:

1. Maintain two lists: one for buy orders, one for sell orders
2. For each new order:
   - If it's a buy: scan all sell orders to find the lowest price ≤ buy price
   - If it's a sell: scan all buy orders to find the highest price ≥ sell price
3. Update or remove matched orders
4. Add any remaining quantity to the appropriate list

**Why this fails:**

- Each matching operation could require scanning all orders in the opposite list → O(n) per order
- With n orders total, this becomes O(n²) time complexity
- The problem constraints (up to 10⁵ orders) make O(n²) infeasible

The brute force approach doesn't efficiently find the "best" match (highest buy or lowest sell) for each new order.

## Optimized Approach

The optimal solution uses **two priority queues (heaps)**:

1. **Max-heap for buy orders** → efficiently get the highest buy price
2. **Min-heap for sell orders** → efficiently get the lowest sell price

**Key insight:** We need to match orders based on price priority:

- Buy orders want the **lowest** sell price (but only if buy price ≥ sell price)
- Sell orders want the **highest** buy price (but only if sell price ≤ buy price)

However, there's a twist: we store `(price, amount)` pairs in the heaps, and we might have multiple orders at the same price. We need to:

1. Process orders one batch at a time
2. Match as much as possible from the current batch
3. Keep track of remaining quantities in the backlog

**Step-by-step reasoning:**

1. Initialize a max-heap for buys (use negative prices for max-heap in languages with min-heap only)
2. Initialize a min-heap for sells
3. For each order `[price, amount, type]`:
   - If buy order:
     - While there are sells and lowest sell price ≤ buy price:
       - Match with the lowest sell
       - Reduce amounts from both sides
       - If sell is exhausted, pop from heap
       - If buy is exhausted, break
     - If buy amount remains, add to buy heap
   - If sell order (symmetric logic):
     - While there are buys and highest buy price ≥ sell price:
       - Match with the highest buy
       - Reduce amounts
       - Remove exhausted orders
     - If sell amount remains, add to sell heap
4. Sum all remaining amounts in both heaps

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n is number of orders
# Space: O(n) for storing unmatched orders in heaps
import heapq

def getNumberOfBacklogOrders(orders):
    # Max-heap for buy orders (store negative price for max-heap behavior)
    buy_heap = []
    # Min-heap for sell orders
    sell_heap = []

    for price, amount, order_type in orders:
        if order_type == 0:  # Buy order
            # Match with sell orders while lowest sell price <= buy price
            while amount > 0 and sell_heap and sell_heap[0][0] <= price:
                sell_price, sell_amount = heapq.heappop(sell_heap)

                # Determine how much we can match
                match_amount = min(amount, sell_amount)
                amount -= match_amount
                sell_amount -= match_amount

                # If sell order still has remaining amount, push it back
                if sell_amount > 0:
                    heapq.heappush(sell_heap, (sell_price, sell_amount))

            # If buy order still has remaining amount, add to buy backlog
            if amount > 0:
                heapq.heappush(buy_heap, (-price, amount))

        else:  # Sell order (order_type == 1)
            # Match with buy orders while highest buy price >= sell price
            while amount > 0 and buy_heap and -buy_heap[0][0] >= price:
                buy_price_neg, buy_amount = heapq.heappop(buy_heap)
                buy_price = -buy_price_neg  # Convert back to positive

                # Determine how much we can match
                match_amount = min(amount, buy_amount)
                amount -= match_amount
                buy_amount -= match_amount

                # If buy order still has remaining amount, push it back
                if buy_amount > 0:
                    heapq.heappush(buy_heap, (-buy_price, buy_amount))

            # If sell order still has remaining amount, add to sell backlog
            if amount > 0:
                heapq.heappush(sell_heap, (price, amount))

    # Calculate total backlog
    total_backlog = 0
    MOD = 10**9 + 7

    # Sum all remaining buy orders
    for _, amount in buy_heap:
        total_backlog = (total_backlog + amount) % MOD

    # Sum all remaining sell orders
    for _, amount in sell_heap:
        total_backlog = (total_backlog + amount) % MOD

    return total_backlog
```

```javascript
// Time: O(n log n) where n is number of orders
// Space: O(n) for storing unmatched orders in heaps

/**
 * @param {number[][]} orders
 * @return {number}
 */
var getNumberOfBacklogOrders = function (orders) {
  // Max-heap for buy orders (implement by storing negative prices)
  const buyHeap = new MinHeap((a, b) => a[0] - b[0]);
  // Min-heap for sell orders
  const sellHeap = new MinHeap((a, b) => a[0] - b[0]);

  for (const [price, amount, orderType] of orders) {
    if (orderType === 0) {
      // Buy order
      let remainingAmount = amount;

      // Match with sell orders while lowest sell price <= buy price
      while (remainingAmount > 0 && !sellHeap.isEmpty() && sellHeap.peek()[0] <= price) {
        const [sellPrice, sellAmount] = sellHeap.pop();
        const matchAmount = Math.min(remainingAmount, sellAmount);

        remainingAmount -= matchAmount;
        const newSellAmount = sellAmount - matchAmount;

        // If sell order still has remaining amount, push it back
        if (newSellAmount > 0) {
          sellHeap.push([sellPrice, newSellAmount]);
        }
      }

      // If buy order still has remaining amount, add to buy backlog
      if (remainingAmount > 0) {
        buyHeap.push([-price, remainingAmount]);
      }
    } else {
      // Sell order
      let remainingAmount = amount;

      // Match with buy orders while highest buy price >= sell price
      while (remainingAmount > 0 && !buyHeap.isEmpty() && -buyHeap.peek()[0] >= price) {
        const [buyPriceNeg, buyAmount] = buyHeap.pop();
        const buyPrice = -buyPriceNeg; // Convert back to positive
        const matchAmount = Math.min(remainingAmount, buyAmount);

        remainingAmount -= matchAmount;
        const newBuyAmount = buyAmount - matchAmount;

        // If buy order still has remaining amount, push it back
        if (newBuyAmount > 0) {
          buyHeap.push([-buyPrice, newBuyAmount]);
        }
      }

      // If sell order still has remaining amount, add to sell backlog
      if (remainingAmount > 0) {
        sellHeap.push([price, remainingAmount]);
      }
    }
  }

  // Calculate total backlog
  let totalBacklog = 0;
  const MOD = 1e9 + 7;

  // Sum all remaining buy orders
  while (!buyHeap.isEmpty()) {
    const [, amount] = buyHeap.pop();
    totalBacklog = (totalBacklog + amount) % MOD;
  }

  // Sum all remaining sell orders
  while (!sellHeap.isEmpty()) {
    const [, amount] = sellHeap.pop();
    totalBacklog = (totalBacklog + amount) % MOD;
  }

  return totalBacklog;
};

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  peek() {
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(n log n) where n is number of orders
// Space: O(n) for storing unmatched orders in heaps

import java.util.PriorityQueue;

class Solution {
    public int getNumberOfBacklogOrders(int[][] orders) {
        // Max-heap for buy orders (use negative price with min-heap)
        PriorityQueue<int[]> buyHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        // Min-heap for sell orders
        PriorityQueue<int[]> sellHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        for (int[] order : orders) {
            int price = order[0];
            int amount = order[1];
            int orderType = order[2];

            if (orderType == 0) {  // Buy order
                // Match with sell orders while lowest sell price <= buy price
                while (amount > 0 && !sellHeap.isEmpty() && sellHeap.peek()[0] <= price) {
                    int[] sellOrder = sellHeap.poll();
                    int sellPrice = sellOrder[0];
                    int sellAmount = sellOrder[1];

                    int matchAmount = Math.min(amount, sellAmount);
                    amount -= matchAmount;
                    sellAmount -= matchAmount;

                    // If sell order still has remaining amount, add it back
                    if (sellAmount > 0) {
                        sellHeap.offer(new int[]{sellPrice, sellAmount});
                    }
                }

                // If buy order still has remaining amount, add to buy backlog
                if (amount > 0) {
                    buyHeap.offer(new int[]{price, amount});
                }
            } else {  // Sell order
                // Match with buy orders while highest buy price >= sell price
                while (amount > 0 && !buyHeap.isEmpty() && buyHeap.peek()[0] >= price) {
                    int[] buyOrder = buyHeap.poll();
                    int buyPrice = buyOrder[0];
                    int buyAmount = buyOrder[1];

                    int matchAmount = Math.min(amount, buyAmount);
                    amount -= matchAmount;
                    buyAmount -= matchAmount;

                    // If buy order still has remaining amount, add it back
                    if (buyAmount > 0) {
                        buyHeap.offer(new int[]{buyPrice, buyAmount});
                    }
                }

                // If sell order still has remaining amount, add to sell backlog
                if (amount > 0) {
                    sellHeap.offer(new int[]{price, amount});
                }
            }
        }

        // Calculate total backlog
        long totalBacklog = 0;
        final int MOD = 1_000_000_007;

        // Sum all remaining buy orders
        while (!buyHeap.isEmpty()) {
            totalBacklog = (totalBacklog + buyHeap.poll()[1]) % MOD;
        }

        // Sum all remaining sell orders
        while (!sellHeap.isEmpty()) {
            totalBacklog = (totalBacklog + sellHeap.poll()[1]) % MOD;
        }

        return (int) totalBacklog;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We process each of the n orders once
- Each order may cause heap operations (push/pop) which are O(log m) where m is the heap size
- In worst case, each order could cause multiple heap operations, but amortized analysis shows each order results in O(log n) operations
- Total: O(n log n)

**Space Complexity:** O(n)

- In worst case, all orders could remain unmatched and be stored in the heaps
- Each heap could store up to n orders total
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle partial matches correctly**: When matching orders, you must:
   - Track remaining amounts for both orders
   - Only remove an order from the heap when its amount reaches 0
   - Push back partially matched orders with updated amounts

2. **Using the wrong heap ordering**:
   - Buy orders need a **max-heap** (highest price first)
   - Sell orders need a **min-heap** (lowest price first)
   - In languages with only min-heap implementations (like Python's heapq), remember to store negative prices for buy orders

3. **Integer overflow in final calculation**:
   - The problem requires modulo 10⁹+7 for the final result
   - Use modulo arithmetic when summing large numbers
   - In Java, use `long` for intermediate calculations to avoid overflow

4. **Infinite loop conditions**:
   - Always check `amount > 0` in while loops
   - Ensure heap is not empty before peeking
   - The matching condition (buy price ≥ sell price) must be checked each iteration

## When You'll See This Pattern

This **two-heap matching pattern** appears in problems where you need to match items based on some priority criteria:

1. **IPO (LeetCode 502)**: Similar matching of capital with profits using heaps
2. **Find Median from Data Stream (LeetCode 295)**: Uses two heaps to maintain median
3. **Meeting Rooms II (LeetCode 253)**: Can be solved with heap-based scheduling
4. **Task Scheduler (LeetCode 621)**: Uses heap to schedule tasks with cooldown

The pattern is: when you need to repeatedly find and remove extreme values (min/max) from a collection while adding new items, heaps are usually the right choice.

## Key Takeaways

1. **Use heaps when you need efficient access to extreme values** (min or max) in a dynamic collection. This problem requires both a max-heap (for buys) and a min-heap (for sells).

2. **Match greedily by priority**: Always match the most favorable pairs first (highest buy with lowest sell). This greedy approach is optimal because any other matching would leave less favorable options for future orders.

3. **Handle partial matches carefully**: When orders don't completely match, update amounts and keep the partially filled order in the appropriate heap. This is a common pattern in order book simulations.

[Practice this problem on CodeJeet](/problem/number-of-orders-in-the-backlog)
