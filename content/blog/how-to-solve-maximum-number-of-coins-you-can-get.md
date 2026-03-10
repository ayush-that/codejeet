---
title: "How to Solve Maximum Number of Coins You Can Get — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Coins You Can Get. Medium difficulty, 84.7% acceptance rate. Topics: Array, Math, Greedy, Sorting, Game Theory."
date: "2028-10-26"
category: "dsa-patterns"
tags: ["maximum-number-of-coins-you-can-get", "array", "math", "greedy", "medium"]
---

# How to Solve Maximum Number of Coins You Can Get

You have `3n` piles of coins with varying sizes. In each round, you pick any 3 piles: Alice takes the largest pile, you take the second largest, and Bob gets the smallest. Your goal is to maximize your total coins. The tricky part is that you control which 3 piles are selected each round, but you always get the middle value—so you need to strategically group piles to maximize your "second largest" picks.

## Visual Walkthrough

Let's trace through example `piles = [9,8,7,6,5,1,2,3,4]` with `n = 3` (9 piles).

**Step 1: Understanding the game mechanics**

- You choose any 3 piles each round
- Alice (always gets largest): Takes the maximum of the 3
- You (always get second largest): Takes the middle value of the 3
- Bob (always gets smallest): Takes the minimum of the 3

**Step 2: Sorting reveals the optimal strategy**
Sorted piles: `[1,2,3,4,5,6,7,8,9]`

If we think about maximizing our coins:

- We want to avoid giving Alice the very largest piles if possible
- But Alice always gets the largest in each triplet, so we need to pair large piles with even larger ones
- Bob gets the smallest, so we can give him the very smallest piles

**Step 3: The optimal pairing strategy**
The insight: Sort the array, then take every second element starting from the second third of the array.

Sorted: `[1,2,3,4,5,6,7,8,9]`
Index: 0 1 2 3 4 5 6 7 8

We'll form triplets as:

- Triplet 1: Take `piles[0]` (smallest for Bob), `piles[8]` (largest for Alice), `piles[7]` (second largest for you)
- Triplet 2: Take `piles[1]` (smallest for Bob), `piles[6]` (largest for Alice), `piles[5]` (second largest for you)
- Triplet 3: Take `piles[2]` (smallest for Bob), `piles[4]` (largest for Alice), `piles[3]` (second largest for you)

Your coins: `piles[7] + piles[5] + piles[3] = 8 + 6 + 4 = 18`

**Step 4: Why this works**
By always pairing the smallest remaining pile (for Bob) with the two largest remaining piles, we ensure:

- Bob gets the worst piles (which is good for us)
- Alice gets the absolute largest pile in each triplet
- We get the second largest, which is still quite good

## Brute Force Approach

A naive approach would try all possible ways to group the piles into triplets and calculate your total for each arrangement. With `3n` piles, the number of possible groupings grows factorially. Even for small `n`, this becomes computationally infeasible.

For example, with `n=4` (12 piles), we'd need to consider:

- All ways to choose the first triplet: C(12,3) = 220
- Then from remaining 9: C(9,3) = 84
- Then from remaining 6: C(6,3) = 20
- Then from remaining 3: C(3,3) = 1

Total combinations: `220 × 84 × 20 × 1 = 369,600` ways just for n=4. For n=10 (30 piles), this becomes astronomically large.

The brute force is clearly impractical, which tells us we need a smarter approach.

## Optimized Approach

The key insight comes from analyzing the game mechanics mathematically:

1. **Alice always gets the maximum** of each triplet, so she'll get the `n` largest piles overall
2. **Bob always gets the minimum** of each triplet, so he'll get the `n` smallest piles overall
3. **You get the middle values**, which will be the `n` piles that remain after giving Alice the largest and Bob the smallest

But here's the crucial optimization: You control the grouping! So you can arrange the triplets to maximize your middle values.

**Optimal Strategy:**

1. Sort the piles in ascending order
2. After sorting, the smallest `n` piles go to Bob
3. The largest `n` piles go to Alice
4. The remaining `n` piles in the middle could be yours, but we can do better!

Actually, the optimal approach is:

- Sort the array
- Start from index `n` (the beginning of the second third)
- Take every second element from there

Why? Because when we form triplets as (smallest_for_Bob, largest_for_Alice, second_largest_for_You), we're effectively taking:

- Bob gets: `piles[0], piles[1], ..., piles[n-1]`
- You get: `piles[n], piles[n+2], piles[n+4], ...` (every other starting from n)
- Alice gets: The remaining piles

This ensures you get the largest possible "second largest" values in each triplet.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def maxCoins(piles):
    """
    Calculate the maximum coins you can get by optimally grouping piles.

    Strategy:
    1. Sort the piles in ascending order
    2. You will get every second element starting from len(piles) // 3
    3. Sum these values to get your maximum coins

    Example with piles = [9,8,7,6,5,1,2,3,4]:
    - Sorted: [1,2,3,4,5,6,7,8,9]
    - Start index: 9 // 3 = 3
    - Take indices 3, 5, 7: values 4, 6, 8
    - Total: 4 + 6 + 8 = 18
    """
    # Step 1: Sort the piles in ascending order
    piles.sort()

    # Step 2: Initialize result and pointer
    result = 0
    n = len(piles) // 3  # Number of triplets

    # Step 3: Take every second element starting from index n
    # We use n as starting point because:
    # - First n elements (indices 0 to n-1) go to Bob (smallest)
    # - We skip one between our picks to give Alice larger piles
    for i in range(n, len(piles), 2):
        result += piles[i]

    return result
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function maxCoins(piles) {
  /**
   * Calculate the maximum coins you can get by optimally grouping piles.
   *
   * Strategy:
   * 1. Sort the piles in ascending order
   * 2. You will get every second element starting from Math.floor(piles.length / 3)
   * 3. Sum these values to get your maximum coins
   */

  // Step 1: Sort the piles in ascending order
  piles.sort((a, b) => a - b);

  // Step 2: Initialize result
  let result = 0;
  const n = Math.floor(piles.length / 3); // Number of triplets

  // Step 3: Take every second element starting from index n
  // We start at n because first n elements go to Bob
  // We increment by 2 to skip every other pile (giving Alice larger ones)
  for (let i = n; i < piles.length; i += 2) {
    result += piles[i];
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public int maxCoins(int[] piles) {
        /**
         * Calculate the maximum coins you can get by optimally grouping piles.
         *
         * Strategy:
         * 1. Sort the piles in ascending order
         * 2. You will get every second element starting from piles.length / 3
         * 3. Sum these values to get your maximum coins
         */

        // Step 1: Sort the piles in ascending order
        Arrays.sort(piles);

        // Step 2: Initialize result
        int result = 0;
        int n = piles.length / 3;  // Number of triplets

        // Step 3: Take every second element starting from index n
        // Start from n because first n elements (indices 0 to n-1) go to Bob
        // Increment by 2 to skip every other pile (Alice gets the skipped ones)
        for (int i = n; i < piles.length; i += 2) {
            result += piles[i];
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the array: O(n log n) where n is the number of piles
- The subsequent loop runs O(n) times but O(n log n) dominates
- For `3n` piles total, this is O(3n log 3n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- If using an in-place sort (like quicksort): O(1) additional space
- If using a sort that requires extra space (like mergesort): O(n) space
- The result variable uses O(1) space regardless

## Common Mistakes

1. **Starting from the wrong index**: Some candidates start from `len(piles)//3 - 1` or `len(piles)//3 + 1`. Remember: after sorting, the first third (smallest piles) go to Bob, so you start picking from the beginning of the second third.

2. **Incorrect increment step**: Using `i++` instead of `i += 2` means you'd take consecutive piles, which doesn't maximize your coins. The skip ensures Alice gets larger piles while you still get good ones.

3. **Forgetting to sort**: Attempting to solve without sorting leads to incorrect pairings. The greedy strategy depends on the sorted order to identify which piles go to whom.

4. **Misunderstanding n**: Confusing `n` (number of triplets) with the total number of piles. The problem states there are `3n` piles, so `n = len(piles) // 3`.

## When You'll See This Pattern

This problem uses a **greedy sorting strategy** combined with **pattern recognition in game theory**. Similar patterns appear in:

1. **Two City Scheduling (LeetCode 1029)**: Sort by cost difference and greedily assign to cities.
2. **Minimum Cost to Hire K Workers (LeetCode 857)**: Sort by wage/quality ratio and use a heap to maintain top K.
3. **Task Scheduler (LeetCode 621)**: Sort tasks by frequency and schedule greedily.

The common theme: when you need to optimize an outcome under constraints, sorting often reveals the optimal selection order, and a greedy approach (taking the best available option at each step) yields the optimal solution.

## Key Takeaways

1. **Game theory problems often have greedy solutions**: When players have fixed roles in each move (like Alice always taking max, you always taking middle), look for a pattern in sorted order.

2. **Sorting transforms selection problems**: Many array selection problems become tractable after sorting because it reveals structural patterns you can exploit.

3. **Test your strategy with small examples**: Before coding, walk through a small sorted example to verify your picking pattern works. This catches off-by-one errors early.

[Practice this problem on CodeJeet](/problem/maximum-number-of-coins-you-can-get)
