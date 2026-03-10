---
title: "How to Solve Reducing Dishes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Reducing Dishes. Hard difficulty, 76.7% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Sorting."
date: "2026-03-20"
category: "dsa-patterns"
tags: ["reducing-dishes", "array", "dynamic-programming", "greedy", "hard"]
---

# How to Solve Reducing Dishes

This problem asks us to maximize the total "like-time coefficient" by choosing which dishes to cook and in what order. The tricky part is that each dish's contribution depends on its position in the cooking sequence — later dishes get multiplied by larger time values, so we need to balance high-satisfaction dishes with their optimal timing.

## Visual Walkthrough

Let's trace through an example: `satisfaction = [-1, -8, 0, 5, -9]`

**Step 1: Sort the dishes**
First, we sort the satisfaction values: `[-9, -8, -1, 0, 5]`
Why sort? Because we want to consider dishes in increasing order of satisfaction. Negative dishes might be worth including if they come early enough (with small time multipliers), while high-satisfaction dishes should come later (with large multipliers).

**Step 2: Build from the end**
We'll work backwards from the highest satisfaction dishes:

- Start with empty sequence: total = 0, running_sum = 0
- Add 5: running_sum = 5, total = 0 + 5 = 5
- Add 0: running_sum = 5 + 0 = 5, total = 5 + 5 = 10
- Add -1: running_sum = 5 + (-1) = 4, total = 10 + 4 = 14
- Add -8: running_sum = 4 + (-8) = -4, total = 14 + (-4) = 10 (decreased!)
- Add -9: running_sum = -4 + (-9) = -13, total = 10 + (-13) = -3 (decreased!)

**Key insight**: Once adding a dish decreases the total, we should stop. The optimal sequence is `[-1, 0, 5]` with total = 14.

Let's verify: time 1 × (-1) = -1, time 2 × 0 = 0, time 3 × 5 = 15. Total = 14 ✓

## Brute Force Approach

A naive approach would try all possible subsets and permutations:

1. Generate all subsets of dishes (2^n possibilities)
2. For each subset, try all permutations (k! for subset size k)
3. Calculate total like-time coefficient for each ordering
4. Return the maximum

This is clearly infeasible for n up to 500 (2^500 is astronomical). Even for small n, the factorial growth makes this impractical.

```python
# Brute force - just for illustration, don't actually use this!
def maxSatisfactionBrute(satisfaction):
    from itertools import combinations, permutations
    n = len(satisfaction)
    max_total = 0

    # Try all subset sizes
    for k in range(1, n + 1):
        # Try all subsets of size k
        for subset in combinations(satisfaction, k):
            # Try all permutations of this subset
            for perm in permutations(subset):
                total = 0
                for i, val in enumerate(perm):
                    total += (i + 1) * val
                max_total = max(max_total, total)

    return max_total
```

**Why it fails**: Exponential time complexity O(n! × 2^n) makes it impossible for n > 10.

## Optimized Approach

The key insight comes from two observations:

1. **Sorting matters**: If we're going to include a set of dishes, we should cook them in increasing order of satisfaction. Why? Because we want dishes with higher satisfaction to have larger time multipliers.

2. **Greedy building from the end**: We can build the optimal sequence by starting from the highest satisfaction dishes and working backwards. At each step, we ask: "Should I add this dish to the beginning of my sequence?"

Mathematical reasoning: If we have a sequence with total T and sum S, adding dish x at the beginning changes:

- New total = T + S + x (because every existing dish gets shifted one position later)
- New sum = S + x

We keep adding dishes as long as `S + x > 0` (which means the new total increases).

## Optimal Solution

The algorithm:

1. Sort the satisfaction array in ascending order
2. Start from the end, maintain running sum and total
3. For each dish (from highest to lowest satisfaction):
   - If adding it increases the total (running_sum + current_dish > 0), add it
   - Otherwise, stop
4. Return the maximum total found

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def maxSatisfaction(satisfaction):
    """
    Calculate maximum like-time coefficient by selecting optimal dish sequence.

    Approach:
    1. Sort dishes by satisfaction (negative dishes first, positive last)
    2. Work backwards from highest satisfaction
    3. Add dishes to beginning of sequence as long as they increase total

    Why it works: Adding dish x at beginning increases total by (current_sum + x)
    We stop when this would be negative (decreasing total).
    """
    # Step 1: Sort in ascending order
    satisfaction.sort()

    n = len(satisfaction)
    total = 0      # Current total like-time coefficient
    running_sum = 0  # Sum of all dishes in current sequence

    # Step 2: Process dishes from highest to lowest satisfaction
    for i in range(n - 1, -1, -1):
        current_dish = satisfaction[i]

        # Step 3: Check if adding this dish at beginning increases total
        # Adding at beginning means: new_total = total + running_sum + current_dish
        # Because all existing dishes shift right (multiplier increases by 1)
        if running_sum + current_dish > 0:
            # Add this dish to beginning of sequence
            total += running_sum + current_dish
            running_sum += current_dish
        else:
            # Adding this dish would decrease total, stop here
            break

    return total
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function maxSatisfaction(satisfaction) {
  /**
   * Calculate maximum like-time coefficient by selecting optimal dish sequence.
   *
   * Approach:
   * 1. Sort dishes by satisfaction (negative dishes first, positive last)
   * 2. Work backwards from highest satisfaction
   * 3. Add dishes to beginning of sequence as long as they increase total
   *
   * Why it works: Adding dish x at beginning increases total by (currentSum + x)
   * We stop when this would be negative (decreasing total).
   */

  // Step 1: Sort in ascending order
  satisfaction.sort((a, b) => a - b);

  let total = 0; // Current total like-time coefficient
  let runningSum = 0; // Sum of all dishes in current sequence

  // Step 2: Process dishes from highest to lowest satisfaction
  for (let i = satisfaction.length - 1; i >= 0; i--) {
    const currentDish = satisfaction[i];

    // Step 3: Check if adding this dish at beginning increases total
    // Adding at beginning means: newTotal = total + runningSum + currentDish
    // Because all existing dishes shift right (multiplier increases by 1)
    if (runningSum + currentDish > 0) {
      // Add this dish to beginning of sequence
      total += runningSum + currentDish;
      runningSum += currentDish;
    } else {
      // Adding this dish would decrease total, stop here
      break;
    }
  }

  return total;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public int maxSatisfaction(int[] satisfaction) {
        /**
         * Calculate maximum like-time coefficient by selecting optimal dish sequence.
         *
         * Approach:
         * 1. Sort dishes by satisfaction (negative dishes first, positive last)
         * 2. Work backwards from highest satisfaction
         * 3. Add dishes to beginning of sequence as long as they increase total
         *
         * Why it works: Adding dish x at beginning increases total by (currentSum + x)
         * We stop when this would be negative (decreasing total).
         */

        // Step 1: Sort in ascending order
        Arrays.sort(satisfaction);

        int total = 0;        // Current total like-time coefficient
        int runningSum = 0;   // Sum of all dishes in current sequence

        // Step 2: Process dishes from highest to lowest satisfaction
        for (int i = satisfaction.length - 1; i >= 0; i--) {
            int currentDish = satisfaction[i];

            // Step 3: Check if adding this dish at beginning increases total
            // Adding at beginning means: newTotal = total + runningSum + currentDish
            // Because all existing dishes shift right (multiplier increases by 1)
            if (runningSum + currentDish > 0) {
                // Add this dish to beginning of sequence
                total += runningSum + currentDish;
                runningSum += currentDish;
            } else {
                // Adding this dish would decrease total, stop here
                break;
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log n)

- Sorting takes O(n log n) time
- The single pass through the array takes O(n) time
- Dominated by the sorting step

**Space Complexity**: O(1) or O(n)

- If we use an in-place sort (like quicksort), it's O(1) extra space
- If the sort uses O(n) auxiliary space (like mergesort), it's O(n)
- Our algorithm itself uses only O(1) extra variables

## Common Mistakes

1. **Not sorting first**: Some candidates try to work with the unsorted array, missing the key insight that optimal ordering requires cooking dishes in increasing satisfaction order.

2. **Starting from the beginning instead of the end**: Working forward makes it hard to decide whether to include negative dishes. Working backward naturally handles this: we only add a dish if it increases the total when placed at the beginning.

3. **Incorrect stopping condition**: The condition is `running_sum + current_dish > 0`, not `current_dish > 0`. We need to consider the cumulative effect on all subsequent dishes.

4. **Forgetting to handle all-negative arrays**: If all dishes have negative satisfaction, the optimal solution is to cook nothing (return 0). Our algorithm handles this correctly because we never add dishes that would decrease the total.

## When You'll See This Pattern

This greedy "build from the end" pattern appears in several optimization problems:

1. **Maximum Subarray (Kadane's Algorithm)**: Both involve making optimal decisions at each step based on cumulative sums.

2. **Task Scheduler**: Similar greedy approach to scheduling tasks with constraints to maximize some metric.

3. **Best Time to Buy and Sell Stock with Cooldown**: Dynamic programming with decisions based on future states, similar to our backward reasoning.

4. **Minimum Cost to Hire K Workers**: Greedy selection combined with sorting and maintaining running sums.

The core pattern: **When decisions affect future elements (like time multipliers here), sometimes working backwards simplifies the reasoning.**

## Key Takeaways

1. **Sorting enables greedy choices**: Many array optimization problems become tractable after sorting. Always consider if sorting can reveal structure.

2. **Backward construction for forward effects**: When including an element affects all subsequent elements (like shifting time slots), building from the end can be more intuitive than building from the beginning.

3. **Mathematical formulation is key**: Writing out the formula for how adding a dish changes the total (`new_total = total + running_sum + dish`) revealed the simple condition for inclusion.

[Practice this problem on CodeJeet](/problem/reducing-dishes)
