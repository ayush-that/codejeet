---
title: "How to Solve Sell Diminishing-Valued Colored Balls — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sell Diminishing-Valued Colored Balls. Medium difficulty, 30.1% acceptance rate. Topics: Array, Math, Binary Search, Greedy, Sorting."
date: "2028-10-01"
category: "dsa-patterns"
tags: ["sell-diminishing-valued-colored-balls", "array", "math", "binary-search", "medium"]
---

# How to Solve Sell Diminishing-Valued Colored Balls

You have an inventory of colored balls where each ball's value equals the current count of balls of that color. You need to sell exactly `orders` balls to maximize total revenue. The challenge is that each sale reduces the value of remaining balls of that color, creating a diminishing returns problem that requires careful optimization.

## Visual Walkthrough

Let's trace through example: `inventory = [2,5]`, `orders = 4`

**Initial state:**

- Color A: 5 balls (value 5 each)
- Color B: 2 balls (value 2 each)
- Total value if we sold all: 5+4+3+2+1 + 2+1 = 18

**Optimal selling strategy:**
We want to sell the most valuable balls first. Let's simulate:

1. Sell from Color A (value 5) → revenue = 5, inventory becomes [1,5]
2. Sell from Color A (value 5) → revenue = 5, inventory becomes [1,4]
3. Sell from Color A (value 4) → revenue = 4, inventory becomes [1,3]
4. Sell from Color A (value 3) → revenue = 3, inventory becomes [1,2]

Total revenue = 5+5+4+3 = 17

**Key insight:** We're selling from the highest values down, but we need to be efficient about it. Notice we sold all balls with value ≥ 3. The pattern is: find a threshold value where we sell all balls above it, and some balls at that threshold.

## Brute Force Approach

A naive approach would be to repeatedly:

1. Find the color with maximum current value
2. Sell one ball from that color
3. Decrement that color's count
4. Repeat `orders` times

This is essentially a simulation approach:

<div class="code-group">

```python
# Time: O(orders * n) | Space: O(1)
def maxProfit_brute(inventory, orders):
    total = 0
    MOD = 10**9 + 7

    for _ in range(orders):
        # Find max value (O(n) each time)
        max_val = max(inventory)
        max_idx = inventory.index(max_val)

        # Add to total
        total = (total + max_val) % MOD

        # Decrement that color
        inventory[max_idx] -= 1

    return total
```

```javascript
// Time: O(orders * n) | Space: O(1)
function maxProfitBrute(inventory, orders) {
  let total = 0;
  const MOD = 10 ** 9 + 7;

  for (let i = 0; i < orders; i++) {
    // Find max value (O(n) each time)
    let maxIdx = 0;
    for (let j = 1; j < inventory.length; j++) {
      if (inventory[j] > inventory[maxIdx]) {
        maxIdx = j;
      }
    }

    // Add to total
    total = (total + inventory[maxIdx]) % MOD;

    // Decrement that color
    inventory[maxIdx]--;
  }

  return total;
}
```

```java
// Time: O(orders * n) | Space: O(1)
public int maxProfitBrute(int[] inventory, int orders) {
    long total = 0;
    final int MOD = 1000000007;

    for (int i = 0; i < orders; i++) {
        // Find max value (O(n) each time)
        int maxIdx = 0;
        for (int j = 1; j < inventory.length; j++) {
            if (inventory[j] > inventory[maxIdx]) {
                maxIdx = j;
            }
        }

        // Add to total
        total = (total + inventory[maxIdx]) % MOD;

        // Decrement that color
        inventory[maxIdx]--;
    }

    return (int) total;
}
```

</div>

**Why this fails:** With `orders` up to 10^9 and inventory size up to 10^5, this O(orders \* n) approach is impossibly slow. We need a mathematical approach that doesn't simulate each sale individually.

## Optimized Approach

The key insight is that we don't need to simulate each sale. Instead, we can:

1. **Sort the inventory descending** so we can process colors from highest to lowest
2. **Think in terms of value thresholds** - we want to sell all balls with value above some threshold `T`, and some balls at value `T`
3. **Use binary search** to find the maximum threshold `T` where we can sell at least `orders` balls if we sell all balls with value > `T`
4. **Calculate revenue mathematically** using arithmetic series formulas

**Step-by-step reasoning:**

1. Sort inventory descending: `[5, 2]` from our example
2. We want to find threshold `T` where:
   - Sum of `(inventory[i] - T)` for all `inventory[i] > T` ≥ `orders`
   - But `T` is as high as possible (to maximize revenue)
3. For our example, try `T = 3`:
   - For 5: sell 5-3 = 2 balls (values 5 and 4)
   - For 2: sell 0 balls (2 ≤ 3)
   - Total = 2 balls, but we need 4 orders

   Try `T = 2`:
   - For 5: sell 5-2 = 3 balls (values 5, 4, 3)
   - For 2: sell 0 balls (2 ≤ 2)
   - Total = 3 balls, still need 4

   Try `T = 1`:
   - For 5: sell 5-1 = 4 balls
   - For 2: sell 2-1 = 1 ball
   - Total = 5 balls, which is ≥ 4

   So `T = 1` is our threshold

4. Calculate revenue:
   - Sell all balls with value > 1: from 5: values 5,4,3,2 = 14
   - We've sold 4 balls but need 4 orders, perfect!
   - Total = 14

Wait, but earlier we got 17? Let's recalculate carefully...

Actually, with `T = 2` we sold 3 balls, need 1 more. So we sell 1 ball at value `T = 2`. Revenue = (5+4+3) + 2 = 14? Still not 17.

**The mistake:** We need to sell from the TOP values, not just above threshold. Let me recalculate properly:

For `inventory = [5,2]`, `orders = 4`:

- Sort descending: [5,2]
- We want to sell balls with highest values first
- Visual representation of values:
  ```
  Color A: 5 4 3 2 1
  Color B: 2 1
  ```
- We want top 4 values: 5, 5, 4, 3 = 17

The correct approach: We find threshold `T` where if we take all balls > T, we get close to but not exceeding `orders`. Then we take some balls at value `T`.

Let's find `T` systematically:

- Count balls with value > 3: only color A has 5, so 5-3=2 balls (values 5,4)
- Count balls with value > 2: color A: 5-2=3 balls (5,4,3); total = 3
- Count balls with value > 1: color A: 5-1=4; color B: 2-1=1; total = 5

We need 4 orders. At `T = 2`, we get 3 balls (need 1 more). At `T = 1`, we get 5 balls (1 too many). So `T = 2` is our threshold.

Revenue calculation:

1. All balls > 2: from color A: 5+4+3 = 12
2. We need 1 more ball at value T=2
3. Total = 12 + 2 = 14

Hmm, still 14 not 17. I see the issue! When we have multiple colors with the same high values, we need to sell from ALL of them at each level. Let me trace correctly:

**Correct simulation:**

1. Sell highest value: both colors have balls? Color A:5, Color B:2 → sell from A (5)
2. Now values: A:4, B:2 → sell from A (4)
3. Now values: A:3, B:2 → sell from A (3)
4. Now values: A:2, B:2 → we have TWO balls at value 2! Sell from either (2)

Total = 5+4+3+2 = 14

So 14 is actually correct! My initial "17" was wrong because I didn't account for selling from only one color when both had the same value.

## Optimal Solution

The optimal solution uses:

1. Sorting + binary search to find the threshold value
2. Mathematical formulas for arithmetic series to calculate revenue efficiently
3. Careful handling of remainder balls at the threshold

<div class="code-group">

```python
# Time: O(n log M) where M is max inventory value | Space: O(1)
def maxProfit(inventory, orders):
    MOD = 10**9 + 7

    # Sort in descending order to process from highest values
    inventory.sort(reverse=True)

    # Add a sentinel value 0 to handle edge cases
    inventory.append(0)

    total = 0
    width = 1  # Number of colors at current value level

    # Iterate through inventory
    for i in range(len(inventory) - 1):
        current = inventory[i]
        next_val = inventory[i + 1]

        # If we can take all balls from current level down to next level
        if (current - next_val) * width <= orders:
            # Calculate sum from current down to (next_val + 1)
            # Using arithmetic series formula: n * (first + last) // 2
            count = current - next_val
            total += width * count * (current + next_val + 1) // 2
            orders -= count * width
        else:
            # We can't take all balls at this level
            # Find how many complete rows we can take
            full_rows = orders // width
            remainder = orders % width

            # Calculate sum for full rows
            total += width * full_rows * (current + (current - full_rows + 1)) // 2

            # Add remainder balls at next value level
            total += remainder * (current - full_rows)

            # We've fulfilled all orders
            break

        width += 1

    return total % MOD
```

```javascript
// Time: O(n log M) where M is max inventory value | Space: O(1)
function maxProfit(inventory, orders) {
  const MOD = BigInt(10 ** 9 + 7);

  // Sort in descending order
  inventory.sort((a, b) => b - a);

  // Add sentinel value
  inventory.push(0);

  let total = 0n;
  let width = 1; // Number of colors at current level

  for (let i = 0; i < inventory.length - 1; i++) {
    const current = BigInt(inventory[i]);
    const nextVal = BigInt(inventory[i + 1]);

    // Calculate how many balls we can take from current level
    const diff = current - nextVal;

    if (diff * BigInt(width) <= BigInt(orders)) {
      // Take all balls from current level down to next level
      // Sum = width * (current + nextVal + 1) * (current - nextVal) / 2
      const count = Number(diff);
      const sum = (BigInt(width) * (current + nextVal + 1n) * diff) / 2n;
      total += sum;
      orders -= count * width;
    } else {
      // Can't take all balls at this level
      const fullRows = Math.floor(orders / width);
      const remainder = orders % width;

      // Sum for full rows: width * fullRows * (current + (current - fullRows + 1)) / 2
      const lastFull = current - BigInt(fullRows) + 1n;
      const rowSum = (BigInt(width) * BigInt(fullRows) * (current + lastFull)) / 2n;
      total += rowSum;

      // Add remainder balls
      total += BigInt(remainder) * (current - BigInt(fullRows));
      break;
    }

    width++;
  }

  return Number(total % MOD);
}
```

```java
// Time: O(n log M) where M is max inventory value | Space: O(1)
public int maxProfit(int[] inventory, int orders) {
    final int MOD = 1000000007;

    // Sort in descending order
    Arrays.sort(inventory);
    reverseArray(inventory);

    // Add sentinel
    int[] invWithSentinel = new int[inventory.length + 1];
    System.arraycopy(inventory, 0, invWithSentinel, 0, inventory.length);
    invWithSentinel[inventory.length] = 0;

    long total = 0;
    int width = 1;  // Number of colors at current level

    for (int i = 0; i < invWithSentinel.length - 1; i++) {
        long current = invWithSentinel[i];
        long nextVal = invWithSentinel[i + 1];

        long diff = current - nextVal;

        if (diff * width <= orders) {
            // Take all balls from current level down to next level
            long count = diff;
            long sum = width * (current + nextVal + 1) * diff / 2;
            total += sum;
            orders -= count * width;
        } else {
            // Can't take all balls at this level
            int fullRows = orders / width;
            int remainder = orders % width;

            // Sum for full rows
            long lastFull = current - fullRows + 1;
            long rowSum = (long) width * fullRows * (current + lastFull) / 2;
            total += rowSum;

            // Add remainder balls
            total += (long) remainder * (current - fullRows);
            break;
        }

        width++;
    }

    return (int) (total % MOD);
}

// Helper method to reverse array for descending sort
private void reverseArray(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M) where n is the number of colors and M is the maximum inventory value

- Sorting takes O(n log n)
- The main loop runs O(n) times
- Each iteration does O(1) mathematical operations
- The binary search variant (not shown here) would be O(n log M)

**Space Complexity:** O(1) excluding the input array

- We use only a few variables for tracking state
- If we modify the input array, we need O(1) extra space
- If we need to preserve input, we'd need O(n) for a copy

## Common Mistakes

1. **Simulating each sale individually:** This leads to O(orders \* n) time complexity which is impossible for large inputs. Always look for mathematical patterns when dealing with large counts.

2. **Incorrect arithmetic series formulas:** When calculating the sum of values from `a` down to `b`, remember it's `(a + b) * (a - b + 1) / 2`, not `(a + b) * (a - b) / 2`. The `+1` accounts for inclusive counting.

3. **Forgetting modulo operations during intermediate calculations:** Since results can be huge, apply modulo after each addition/multiplication to prevent overflow. In Java/Python, use long/BigInt for intermediate results.

4. **Not handling remainder balls correctly:** After taking complete "rows" of balls at each value level, you need to carefully distribute the remaining orders among the highest available values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Greedy with diminishing returns:** Similar to "Maximum Performance of a Team" (LeetCode 1383) where you select engineers based on decreasing efficiency.

2. **Binary search on answer:** Problems like "Kth Smallest Number in Multiplication Table" (LeetCode 668) use binary search to find a threshold value.

3. **Arithmetic series optimization:** "Maximum Running Time of N Computers" (LeetCode 2141) uses similar mathematical formulas to distribute batteries efficiently.

The core pattern is: when you need to select the top K items from multiple decreasing sequences, sort them and process level by level using mathematical formulas instead of simulation.

## Key Takeaways

1. **Think in terms of value thresholds:** When dealing with large counts, find the minimum value threshold where taking all values above it gives you approximately the required number of items.

2. **Use mathematical formulas over simulation:** For arithmetic sequences, use `n*(first+last)/2` instead of summing individually. This transforms O(n) operations into O(1).

3. **Process equal values together:** When multiple colors have the same value, process them as a group (the `width` variable in our solution) to avoid unnecessary iterations.

Related problems: [Maximum Running Time of N Computers](/problem/maximum-running-time-of-n-computers)
