---
title: "How to Solve Maximum Profit of Operating a Centennial Wheel — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Profit of Operating a Centennial Wheel. Medium difficulty, 44.5% acceptance rate. Topics: Array, Simulation."
date: "2030-03-08"
category: "dsa-patterns"
tags: ["maximum-profit-of-operating-a-centennial-wheel", "array", "simulation", "medium"]
---

## How to Solve Maximum Profit of Operating a Centennial Wheel

You operate a Ferris wheel with 4 gondolas, each holding up to 4 people. Customers arrive in order, and you can rotate the wheel (costing `runningCost`) to board them. You must decide when to rotate to maximize profit, which is total boarding money minus rotation costs. The challenge is balancing rotations (which cost money) against waiting for more customers (which might increase boarding revenue).

---

## Visual Walkthrough

Let's trace through an example:  
`customers = [8,3]`, `boardingCost = 6`, `runningCost = 2`

**Step 1:** Time 0, wheel empty.  
First customer group: 8 people.  
We can only board 4 (max per gondola).

- Board 4, 4 remain waiting.
- Rotate: profit += (4 × 6) - 2 = 24 - 2 = 22.  
  Waiting: 4.

**Step 2:** Time 1, wheel has 4 boarded.  
No new customers (next group at time 2).  
We could rotate empty gondolas, but that loses money. Better to wait?  
The rule: we _must_ rotate if there are waiting customers.  
We have 4 waiting → must rotate.

- Board 4 (all waiting), 0 remain.
- Rotate: profit += (4 × 6) - 2 = 24 - 2 = 22.  
  Total profit = 44.

**Step 3:** Time 2, wheel empty.  
Second customer group: 3 people.

- Board 3, 0 waiting.
- Rotate: profit += (3 × 6) - 2 = 18 - 2 = 16.  
  Total profit = 60.

We could stop here (no more customers).  
But what if we kept rotating with empty wheel? Each rotation costs 2, reducing profit. So we stop when profit would decline.

Maximum profit = 60 at 3 rotations.

---

## Brute Force Approach

A brute force would simulate _every possible_ stopping point up to a very large number of rotations (say, until all customers are served and the wheel is empty). For each rotation count `k`, we'd simulate the entire process: iterate through customers, maintain waiting queue, board up to 4 each rotation, calculate profit.

Why this is inefficient:

- We might simulate up to `len(customers) * 4` rotations unnecessarily.
- Each simulation re-processes the customer list from the start.
- Time complexity could be O(n²) if done naively.

The brute force isn't just slow — it's also tricky to bound correctly. Some candidates might try to simulate up to `sum(customers)` rotations, which is far too large.

---

## Optimized Approach

The key insight: **We can simulate the process in a single pass**, tracking:

1. `waiting`: number of customers waiting to board
2. `profit`: current running profit
3. `maxProfit`: best profit seen so far
4. `bestRotation`: rotation number where maxProfit occurred

At each time step `i` (starting from 0):

- Add `customers[i]` to `waiting` (if `i < n`)
- Board `min(4, waiting)` people
- Update waiting count
- Rotate: update profit as `boarded * boardingCost - runningCost`
- Track if this profit is the new maximum

We continue until **no customers are waiting AND no more are arriving**.  
Why continue after all customers have arrived? Because customers already on the wheel might still generate profit in future rotations until they all exit.

But careful: once all are boarded and wheel is empty, further rotations just lose money (`runningCost`). So we stop when `waiting == 0` and `i >= n`.

---

## Optimal Solution

We simulate rotation-by-rotation, not time-by-time. Each "rotation" corresponds to one wheel turn. We keep going until all customers are served and the wheel is empty.

<div class="code-group">

```python
# Time: O(rotations) where rotations ≤ n + waiting/4
# Space: O(1)
def minOperationsMaxProfit(customers, boardingCost, runningCost):
    n = len(customers)
    waiting = 0
    profit = 0
    max_profit = 0
    best_rotation = -1
    rotation = 0
    i = 0  # index in customers array

    # Continue while there are customers waiting or more to arrive
    while waiting > 0 or i < n:
        rotation += 1

        # Add new customers arriving at this rotation time
        if i < n:
            waiting += customers[i]
            i += 1

        # Board up to 4 customers
        board = min(4, waiting)
        waiting -= board

        # Calculate profit for this rotation
        profit += board * boardingCost - runningCost

        # Update maximum profit and best rotation
        if profit > max_profit:
            max_profit = profit
            best_rotation = rotation

    return best_rotation if max_profit > 0 else -1
```

```javascript
// Time: O(rotations) where rotations ≤ n + waiting/4
// Space: O(1)
function minOperationsMaxProfit(customers, boardingCost, runningCost) {
  let waiting = 0;
  let profit = 0;
  let maxProfit = 0;
  let bestRotation = -1;
  let rotation = 0;
  let i = 0;
  const n = customers.length;

  // Continue while customers are waiting or more will arrive
  while (waiting > 0 || i < n) {
    rotation++;

    // Add new arrivals at this rotation
    if (i < n) {
      waiting += customers[i];
      i++;
    }

    // Board up to 4 customers
    const board = Math.min(4, waiting);
    waiting -= board;

    // Update profit for this rotation
    profit += board * boardingCost - runningCost;

    // Track maximum profit
    if (profit > maxProfit) {
      maxProfit = profit;
      bestRotation = rotation;
    }
  }

  return maxProfit > 0 ? bestRotation : -1;
}
```

```java
// Time: O(rotations) where rotations ≤ n + waiting/4
// Space: O(1)
public int minOperationsMaxProfit(int[] customers, int boardingCost, int runningCost) {
    int waiting = 0;
    int profit = 0;
    int maxProfit = 0;
    int bestRotation = -1;
    int rotation = 0;
    int i = 0;
    int n = customers.length;

    // Continue while there are customers to serve
    while (waiting > 0 || i < n) {
        rotation++;

        // Add new customers arriving at this time
        if (i < n) {
            waiting += customers[i];
            i++;
        }

        // Board up to 4 customers
        int board = Math.min(4, waiting);
        waiting -= board;

        // Calculate rotation profit
        profit += board * boardingCost - runningCost;

        // Update best profit found
        if (profit > maxProfit) {
            maxProfit = profit;
            bestRotation = rotation;
        }
    }

    return maxProfit > 0 ? bestRotation : -1;
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(rotations)

- Each iteration represents one wheel rotation.
- Maximum rotations = `n + ceil(total_customers / 4)`.
- In worst case, all customers arrive at once: rotations ≈ `n + sum(customers)/4`.
- This is linear in terms of total customers.

**Space Complexity:** O(1)

- We only use a few integer variables.
- No additional data structures needed.

---

## Common Mistakes

1. **Stopping too early** — Some candidates stop when `i == n`, forgetting that customers already on the wheel need to complete their rides. You must continue until `waiting == 0` AND no more customers will arrive.

2. **Incorrect boarding calculation** — Boarding `min(4, waiting)` each rotation is correct. A mistake is to board all waiting customers at once (ignoring the 4-per-rotation limit).

3. **Returning wrong rotation count** — The problem asks for the _minimum_ rotation number where profit is maximized. If profit equals previous max, don't update `bestRotation`.

4. **Not handling negative profit** — If `maxProfit <= 0`, you must return -1. Some forget this and return the last rotation count even when losing money.

---

## When You'll See This Pattern

This simulation-with-constraints pattern appears in:

1. **Task Scheduler (LeetCode 621)** — Similar to scheduling tasks with cooldown, here we have capacity constraints per rotation.
2. **Car Pooling (LeetCode 1094)** — Managing capacity over time with pickups and dropoffs.
3. **Gas Station (LeetCode 134)** — Circular route with resource constraints, though here it's linear simulation.

The core is: **process events in order, maintain state, apply constraints at each step**.

---

## Key Takeaways

1. **Simulation problems** often require step-by-step processing with careful state tracking. Don't overcomplicate — just simulate what actually happens.
2. **Constraint boundaries** matter: here, the 4-per-rotation limit changes how we batch customers.
3. **Termination conditions** can be subtle. Always ask: "When does the process truly end?" Here, it's when no one is waiting AND no one will arrive.

[Practice this problem on CodeJeet](/problem/maximum-profit-of-operating-a-centennial-wheel)
