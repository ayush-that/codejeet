---
title: "Greedy Questions at PhonePe: What to Expect"
description: "Prepare for Greedy interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-25"
category: "dsa-patterns"
tags: ["phonepe", "greedy", "interview prep"]
---

Greedy algorithms are a core part of PhonePe's technical interview process, representing nearly 15% of their tagged coding problems. For a company handling millions of financial transactions daily, the ability to design efficient, step-by-step optimal solutions is critical. Greedy approaches are fundamental to real-time systems like payment routing, cashback optimization, and resource allocation, where you need a fast, good-enough solution that works within strict operational constraints. Mastering these questions demonstrates you can think about immediate optimization—a valuable skill for building scalable fintech products.

## What to Expect — Types of Problems

PhonePe's greedy problems typically fall into a few predictable categories. Expect to see **interval scheduling** problems, such as meeting rooms or non-overlapping intervals, which model real-world booking systems. **Coin change** or **minimum denominations** questions are directly relevant to payment systems. You'll also encounter **assignment problems**, like assigning tasks for minimum cost or maximum profit, which relate to optimizing transaction fees or partner payouts. Finally, **sorting-based optimization** is common, where the key insight is to sort data first (by end time, value, weight, etc.) to apply a greedy choice. The difficulty often lies not in complex code, but in proving to yourself and the interviewer that a greedy approach is correct for that scenario.

## How to Prepare — Study Tips with One Code Example

Start by learning the classic greedy patterns: activity selection, Huffman coding, and Kruskal's/Prim's algorithms for graphs. For each pattern, understand _why_ the greedy choice works—this is what interviewers probe. Practice by first attempting a brute-force solution, then identifying the greedy property (optimal substructure and the greedy-choice property). Always test your greedy algorithm with edge cases: empty input, single element, already sorted, reverse sorted, and cases where a greedy choice might fail.

A key pattern is the "minimum number of coins" or "minimum steps" problem. The classic example is finding the minimum number of coins to make a target amount, given an infinite supply of coins of given denominations (where the greedy approach works, e.g., with standard Indian currency). Here’s the pattern applied to a "minimum coins for amount" problem with denominations [1, 2, 5], which mimics real currency systems.

<div class="code-group">

```python
def min_coins(coins, amount):
    coins.sort(reverse=True)
    count = 0
    for coin in coins:
        if amount >= coin:
            count += amount // coin
            amount %= coin
    return count if amount == 0 else -1

# Example
print(min_coins([1, 2, 5], 11))  # Output: 3 (5+5+1)
```

```javascript
function minCoins(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;
  for (const coin of coins) {
    if (amount >= coin) {
      count += Math.floor(amount / coin);
      amount %= coin;
    }
  }
  return amount === 0 ? count : -1;
}

// Example
console.log(minCoins([1, 2, 5], 11)); // Output: 3
```

```java
public int minCoins(int[] coins, int amount) {
    Arrays.sort(coins);
    int count = 0;
    for (int i = coins.length - 1; i >= 0; i--) {
        if (amount >= coins[i]) {
            count += amount / coins[i];
            amount %= coins[i];
        }
    }
    return amount == 0 ? count : -1;
}
// Example: minCoins(new int[]{1, 2, 5}, 11) returns 3
```

</div>

**Important Note:** This greedy solution only works for canonical coin systems. For arbitrary denominations (e.g., [3, 5]), you would need a dynamic programming approach. This distinction is a common interview follow-up.

## Recommended Practice Order

1.  **Foundations:** Start with classic problems like "Activity Selection" and "Fractional Knapsack."
2.  **PhonePe-Focused:** Move to interval problems ("Non-overlapping Intervals," "Merge Intervals") and assignment problems ("Minimum Number of Platforms," "Task Scheduler").
3.  **Advanced Patterns:** Tackle problems involving "Greedy + Heap" (like meeting rooms II) and "Greedy + Sorting" with complex comparators.
4.  **Company-Specific:** Finally, solve all 15 PhonePe-tagged greedy questions on CodeJeet in one sitting to simulate interview pressure.

Consistently ask yourself: "Is the greedy choice always safe here?" If you can justify it, you're ready.

[Practice Greedy at PhonePe](/company/phonepe/greedy)
