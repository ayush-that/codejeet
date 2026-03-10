---
title: "How to Solve Minimum Amount of Time to Fill Cups — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Amount of Time to Fill Cups. Easy difficulty, 60.0% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2028-02-21"
category: "dsa-patterns"
tags: ["minimum-amount-of-time-to-fill-cups", "array", "greedy", "sorting", "easy"]
---

# How to Solve Minimum Amount of Time to Fill Cups

You're given three cup counts for different water types and need to find the minimum seconds to fill all cups. Each second, you can either fill 2 cups of different types or 1 cup of any type. What makes this problem interesting is that it looks like a scheduling problem but has a surprisingly elegant greedy solution based on simple arithmetic.

## Visual Walkthrough

Let's trace through example `amount = [5, 4, 4]`:

**Step 1:** Sort the amounts: `[4, 4, 5]` (smallest to largest)

**Step 2:** Think about the optimal strategy:

- When we have two large piles, it's best to pair them together
- With `[4, 4, 5]`, we can pair the largest two (4 and 5):
  - Second 1: Fill 4 and 5 → `[4, 3, 4]`
  - Second 2: Fill 4 and 4 → `[3, 3, 3]`
  - Now we have `[3, 3, 3]`

**Step 3:** With equal amounts, we can pair all three types in rotation:

- Second 3: Fill 3 and 3 → `[2, 2, 3]`
- Second 4: Fill 2 and 3 → `[1, 2, 2]`
- Second 5: Fill 1 and 2 → `[0, 1, 2]`
- Second 6: Fill 1 and 2 → `[0, 0, 1]`
- Second 7: Fill the last cup → `[0, 0, 0]`

Total: 7 seconds.

But there's a smarter way to calculate this! Notice that:

1. If one type dominates (sum of others ≤ largest), answer is just the largest count
2. Otherwise, answer is `ceil(sum / 2)`

For `[5, 4, 4]`:

- Sum = 13, largest = 5
- Since 4+4=8 > 5, we use `ceil(13/2) = 7`

This works because when no single type dominates, we can almost always pair cups efficiently.

## Brute Force Approach

A naive approach would try to simulate every second, deciding whether to fill 1 or 2 cups. We could use BFS/DFS to explore all possible sequences of actions. For each state `(a, b, c)`, we'd have up to 6 possible moves (3 single-cup moves + 3 double-cup moves with different types).

The state space grows exponentially with the cup counts. With amounts up to 100 each, the worst-case state space could be 100³ = 1,000,000 states, and BFS would need to explore most of them. This is clearly inefficient.

Even a greedy simulation approach that always picks the two largest types would work, but we'd need to simulate up to O(sum) steps. With amounts up to 100, sum ≤ 300, so 300 steps is acceptable. However, we can do even better with the mathematical insight.

## Optimal Solution

The key insight is that we have two cases:

1. **One type dominates**: If the largest amount is greater than or equal to the sum of the other two, we can't efficiently pair cups. We'll spend most seconds filling the dominant type alone, so the answer is simply the largest amount.
2. **Balanced distribution**: Otherwise, we can pair cups efficiently enough that the answer is `ceil(total / 2)`.

Why does this work? In the balanced case, we can always pair cups in a way that uses most seconds efficiently. The ceiling accounts for the possibility of having one cup left at the end.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def fillCups(amount):
    """
    Calculate minimum seconds to fill all cups.

    Strategy:
    1. Sort to easily identify largest amount
    2. If largest >= sum of other two: answer is largest
    3. Otherwise: answer is ceil(sum / 2)

    Args:
        amount: List[int] - counts for cold, warm, hot cups

    Returns:
        int - minimum seconds required
    """
    # Sort the amounts to easily access the largest
    amount.sort()

    # Get the three amounts
    a, b, c = amount

    # Case 1: One type dominates (largest >= sum of other two)
    if c >= a + b:
        # We'll spend most seconds filling the dominant type
        # Each second we can fill at most 1 cup of this type
        return c

    # Case 2: Balanced distribution
    # We can pair cups efficiently
    total = a + b + c

    # Ceiling division: (total + 1) // 2
    # This handles both even and odd totals
    return (total + 1) // 2
```

```javascript
// Time: O(1) | Space: O(1)
function fillCups(amount) {
  /**
   * Calculate minimum seconds to fill all cups.
   *
   * Strategy:
   * 1. Sort to easily identify largest amount
   * 2. If largest >= sum of other two: answer is largest
   * 3. Otherwise: answer is ceil(sum / 2)
   *
   * @param {number[]} amount - counts for cold, warm, hot cups
   * @return {number} - minimum seconds required
   */

  // Sort the amounts to easily access the largest
  amount.sort((x, y) => x - y);

  // Get the three amounts
  const [a, b, c] = amount;

  // Case 1: One type dominates (largest >= sum of other two)
  if (c >= a + b) {
    // We'll spend most seconds filling the dominant type
    // Each second we can fill at most 1 cup of this type
    return c;
  }

  // Case 2: Balanced distribution
  // We can pair cups efficiently
  const total = a + b + c;

  // Ceiling division: Math.ceil(total / 2)
  return Math.ceil(total / 2);
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int fillCups(int[] amount) {
        /**
         * Calculate minimum seconds to fill all cups.
         *
         * Strategy:
         * 1. Sort to easily identify largest amount
         * 2. If largest >= sum of other two: answer is largest
         * 3. Otherwise: answer is ceil(sum / 2)
         *
         * @param amount - counts for cold, warm, hot cups
         * @return minimum seconds required
         */

        // Sort the amounts to easily access the largest
        Arrays.sort(amount);

        // Get the three amounts
        int a = amount[0];
        int b = amount[1];
        int c = amount[2];

        // Case 1: One type dominates (largest >= sum of other two)
        if (c >= a + b) {
            // We'll spend most seconds filling the dominant type
            // Each second we can fill at most 1 cup of this type
            return c;
        }

        // Case 2: Balanced distribution
        // We can pair cups efficiently
        int total = a + b + c;

        // Ceiling division: (total + 1) / 2
        // This handles both even and odd totals
        return (total + 1) / 2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- Sorting 3 elements takes constant time
- All other operations are simple arithmetic and comparisons

**Space Complexity:** O(1)

- We only use a few integer variables
- Sorting is done in-place (except in JavaScript where `.sort()` creates a new array, but with only 3 elements, it's effectively constant)

The constant time/space complexity makes this solution extremely efficient regardless of input size (though amounts are limited to 100 in the problem constraints).

## Common Mistakes

1. **Forgetting to sort**: Without sorting, you can't easily identify the largest element. Some candidates try to find the max with `max(amount)`, but then need to calculate the sum of the other two, which requires extra logic.

2. **Incorrect ceiling division**: Using integer division `total // 2` instead of ceiling division. For odd totals like 13, `13 // 2 = 6` but the correct answer is 7. Remember: `ceil(x/2) = (x + 1) // 2` for integers.

3. **Overcomplicating with simulation**: Some candidates start implementing a priority queue or heap to always pick the two largest types. While this works (O(n log n) simulation), it's unnecessary and more error-prone than the mathematical solution.

4. **Misunderstanding the "one type dominates" case**: When `c >= a + b`, the answer is `c`, not `c + something`. Think about it: if you have `[100, 0, 0]`, you need 100 seconds because you can only fill 1 cup per second of that type.

## When You'll See This Pattern

This problem uses a **greedy mathematical insight** pattern common in optimization problems with constraints:

1. **Maximum Score From Removing Stones** (Medium): Similar "pair the largest two" strategy for three piles. You're given three piles of stones and can remove 2 from different piles each turn.

2. **Construct Target Array With Multiple Sums** (Hard): While more complex, it also involves reducing the largest element and understanding when one element dominates the sum of others.

3. **Maximum Running Time of N Computers** (Hard): Involves distributing batteries efficiently, with similar "if largest dominates" logic.

The pattern to recognize: when you have operations that affect the largest elements preferentially, look for mathematical properties that let you avoid simulation.

## Key Takeaways

1. **Look for mathematical properties before simulating**: Many "minimum steps" problems have closed-form solutions based on the distribution of values. Always check if simple arithmetic works before implementing complex simulation.

2. **The "dominant element" pattern is common**: When one element is larger than the sum of all others combined (or similar), it often dictates the answer. This appears in scheduling, resource allocation, and reduction problems.

3. **Three elements often have special properties**: With exactly three items, many problems have simpler solutions than the general n-case. Look for opportunities to sort and use the sorted order.

Related problems: [Construct Target Array With Multiple Sums](/problem/construct-target-array-with-multiple-sums), [Maximum Score From Removing Stones](/problem/maximum-score-from-removing-stones), [Maximum Running Time of N Computers](/problem/maximum-running-time-of-n-computers)
