---
title: "How to Solve Minimum Cost of Buying Candies With Discount — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Cost of Buying Candies With Discount. Easy difficulty, 62.7% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-11-22"
category: "dsa-patterns"
tags: ["minimum-cost-of-buying-candies-with-discount", "array", "greedy", "sorting", "easy"]
---

# How to Solve Minimum Cost of Buying Candies With Discount

This problem asks us to minimize the total cost when buying candies with a special discount: for every two candies purchased, you get a third candy for free. The free candy must cost less than or equal to the minimum cost of the two purchased candies. The tricky part is figuring out which candies to pay for and which to get for free to minimize the total cost.

## Visual Walkthrough

Let's walk through an example: `cost = [6, 5, 7, 9, 2, 2]`

**Step 1: Sort in descending order**
First, we sort the candies by price from highest to lowest: `[9, 7, 6, 5, 2, 2]`

Why descending? Because we want to pay for the most expensive candies and get the cheaper ones for free. The discount says we get a free candy for every two purchased, so we'll group them in threes.

**Step 2: Group and select candies to pay for**
We process the sorted list in groups of three:

- Group 1: `[9, 7, 6]` → Pay for the two most expensive (9 and 7), get 6 for free
- Group 2: `[5, 2, 2]` → Pay for the two most expensive (5 and 2), get 2 for free

**Step 3: Calculate total cost**
Total = 9 + 7 + 5 + 2 = 23

Notice the pattern: In each group of three, we skip every third candy (the cheapest in that group). By sorting descending and taking every third candy as free, we ensure we're always paying for the most expensive candies in each group.

## Brute Force Approach

A naive approach would be to try all possible combinations of which candies to pay for and which to get free, but this is extremely inefficient. For n candies, we'd need to consider all ways to choose which candies are free while satisfying the constraint that for every free candy, there must be two purchased candies with costs at least as high. This leads to combinatorial explosion.

Even a simpler brute force would be: sort ascending, then try to maximize free candies by always picking the cheapest possible free candy. But without the insight of processing from the end, we might make suboptimal choices. The key realization is that we should always try to get the most expensive candies for free that we're allowed to, which means we should sort and process from the most expensive end.

## Optimal Solution

The optimal solution uses a greedy approach with sorting:

1. Sort the candy costs in descending order
2. Process the list in groups of three
3. In each group, pay for the first two (most expensive) and skip the third (get it free)
4. Sum up all the costs of candies we pay for

This works because:

- We want to minimize cost, so we want to get the most expensive candies possible for free
- The discount allows one free candy for every two purchased
- By sorting descending and taking every third candy free, we maximize the value of free candies

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def minimumCost(cost):
    """
    Calculate minimum cost to buy all candies with discount.

    Args:
        cost: List of candy prices

    Returns:
        Minimum total cost after applying discount optimally
    """
    # Step 1: Sort in descending order to get most expensive candies first
    # We want to pay for expensive candies and get cheaper ones free
    cost.sort(reverse=True)

    total_cost = 0

    # Step 2: Process candies in groups of three
    for i in range(len(cost)):
        # Step 3: Skip every third candy (index 2, 5, 8, etc.)
        # In 0-based indexing, every third candy has (i % 3 == 2)
        # These are the candies we get for free
        if i % 3 != 2:
            total_cost += cost[i]

    return total_cost
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function minimumCost(cost) {
  /**
   * Calculate minimum cost to buy all candies with discount.
   *
   * @param {number[]} cost - Array of candy prices
   * @return {number} Minimum total cost after applying discount optimally
   */

  // Step 1: Sort in descending order to get most expensive candies first
  // We want to pay for expensive candies and get cheaper ones free
  cost.sort((a, b) => b - a);

  let totalCost = 0;

  // Step 2: Process candies in groups of three
  for (let i = 0; i < cost.length; i++) {
    // Step 3: Skip every third candy (index 2, 5, 8, etc.)
    // In 0-based indexing, every third candy has (i % 3 === 2)
    // These are the candies we get for free
    if (i % 3 !== 2) {
      totalCost += cost[i];
    }
  }

  return totalCost;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;
import java.util.Collections;

class Solution {
    public int minimumCost(int[] cost) {
        /**
         * Calculate minimum cost to buy all candies with discount.
         *
         * @param cost Array of candy prices
         * @return Minimum total cost after applying discount optimally
         */

        // Step 1: Sort in descending order to get most expensive candies first
        // We want to pay for expensive candies and get cheaper ones free
        // Convert to Integer array for descending sort
        Integer[] costObj = new Integer[cost.length];
        for (int i = 0; i < cost.length; i++) {
            costObj[i] = cost[i];
        }
        Arrays.sort(costObj, Collections.reverseOrder());

        int totalCost = 0;

        // Step 2: Process candies in groups of three
        for (int i = 0; i < costObj.length; i++) {
            // Step 3: Skip every third candy (index 2, 5, 8, etc.)
            // In 0-based indexing, every third candy has (i % 3 == 2)
            // These are the candies we get for free
            if (i % 3 != 2) {
                totalCost += costObj[i];
            }
        }

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- The dominant operation is sorting the array, which takes O(n log n) time
- The subsequent loop through the array takes O(n) time
- O(n log n) + O(n) = O(n log n)

**Space Complexity:** O(1) or O(n) depending on language and sorting implementation

- In Python, `sort()` is in-place, so O(1) additional space
- In JavaScript, `sort()` may use O(n) space depending on implementation
- In Java, we need O(n) space to convert to Integer array for descending sort
- The algorithm itself only uses a few variables (O(1) space)

## Common Mistakes

1. **Sorting in ascending order instead of descending**: This is the most common mistake. If you sort ascending and take every third candy free starting from the beginning, you'll be getting the cheapest candies free instead of the most expensive ones. Always sort descending to maximize discount value.

2. **Incorrect modulo condition**: Some candidates use `(i + 1) % 3 == 0` instead of `i % 3 == 2`. Both work, but mixing them up can lead to off-by-one errors. Remember: in 0-based indexing, every third element has indices 2, 5, 8, etc., which is `i % 3 == 2`.

3. **Not handling edge cases**:
   - Empty array: Should return 0
   - Single candy: Should pay for it (no discount applies)
   - Two candies: Should pay for both (need two purchased to get one free)
     Always test these cases!

4. **Overcomplicating the solution**: Some candidates try to use complex data structures or dynamic programming. The greedy approach with sorting is optimal and much simpler. Recognize that this is a "take every third item free" pattern after sorting.

## When You'll See This Pattern

This greedy sorting pattern appears in many optimization problems where you need to maximize or minimize some value by making optimal selections:

1. **Array Partition (LeetCode 561)**: Very similar pattern - sort the array and take every second element to maximize the sum of min(a,b) pairs. Both problems use sorting followed by taking elements at specific positions.

2. **Task Scheduler (LeetCode 621)**: While more complex, it also uses sorting to prioritize tasks with highest frequency, similar to how we prioritize most expensive candies here.

3. **Maximum Product of Three Numbers (LeetCode 628)**: Uses sorting to find the optimal combination of numbers, though the selection logic is different.

The core pattern is: when you need to optimize selection based on value, sorting often helps reveal the optimal strategy.

## Key Takeaways

1. **Greedy with sorting is powerful**: When you need to optimize selection, sorting the data often reveals the optimal greedy strategy. Ask yourself: "If I sort this, does the solution become obvious?"

2. **Look for positional patterns**: After sorting, many problems have solutions that depend on positions (every nth element, pairs, etc.). In this case, it's "pay for two, get third free" which translates to "skip every third element after sorting descending."

3. **Test with small examples**: Always walk through a small example (like [6, 5, 7, 9, 2, 2]) to verify your approach before coding. This helps catch sorting direction errors and off-by-one mistakes.

Related problems: [Array Partition](/problem/array-partition), [Minimum Absolute Difference](/problem/minimum-absolute-difference), [Minimum Number of Operations to Satisfy Conditions](/problem/minimum-number-of-operations-to-satisfy-conditions)
