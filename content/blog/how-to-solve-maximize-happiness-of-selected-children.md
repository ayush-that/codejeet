---
title: "How to Solve Maximize Happiness of Selected Children — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Happiness of Selected Children. Medium difficulty, 58.7% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-02-08"
category: "dsa-patterns"
tags: ["maximize-happiness-of-selected-children", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximize Happiness of Selected Children

You're given an array of happiness values for children and need to select `k` children over `k` turns, where each selected child's happiness contributes to your total, but their happiness decreases by 1 for each subsequent turn. The challenge is selecting children in the optimal order to maximize the total happiness sum. What makes this problem interesting is that the decreasing happiness creates a tension between selecting high-value children early (before their value decreases) and managing how much their value will be reduced by the time you select them.

## Visual Walkthrough

Let's trace through an example: `happiness = [1,2,3]`, `k = 2`

**Step 1: Sort the happiness values in descending order**

- Sorted: `[3, 2, 1]`

**Step 2: Process each child in sorted order**
We'll select children starting from the highest happiness value:

- **Turn 1**: Select child with happiness 3
  - Current turn: 1
  - Happiness contributed: max(3 - (1 - 1), 0) = max(3 - 0, 0) = 3
  - Total so far: 3

- **Turn 2**: Select child with happiness 2
  - Current turn: 2
  - Happiness contributed: max(2 - (2 - 1), 0) = max(2 - 1, 0) = 1
  - Total so far: 3 + 1 = 4

**Why this works**: By sorting in descending order, we ensure we pick the highest values first when they're least reduced. The subtraction `(current_turn - 1)` represents how many turns have passed before this selection, which is how much we need to subtract from the child's original happiness.

Let's try another example: `happiness = [1,1,1,3]`, `k = 2`

Sorted: `[3, 1, 1, 1]`

- Turn 1: Select 3 → max(3 - 0, 0) = 3
- Turn 2: Select 1 → max(1 - 1, 0) = 0
  Total: 3

Notice that even though we have three children with happiness 1, by the time we get to them (turn 2 or later), their happiness becomes 0 after subtraction.

## Brute Force Approach

A naive approach would be to consider all possible sequences of selecting `k` children from `n`. For each sequence, we could calculate the total happiness by subtracting the appropriate amount from each child based on when they were selected.

The brute force would involve:

1. Generating all permutations of selecting `k` children from `n` (or all combinations if order matters)
2. For each sequence, calculating the total happiness
3. Keeping track of the maximum

However, this approach is extremely inefficient. The number of ways to select `k` children from `n` in order is `nPk = n!/(n-k)!`, which grows factorially. Even for moderate values like `n=20` and `k=10`, this becomes computationally infeasible.

The key insight we need is that we don't need to try all sequences - there's an optimal strategy.

## Optimized Approach

The optimal solution relies on two key insights:

1. **Greedy selection**: We should always pick the child with the highest available happiness at each turn. This is because:
   - If we delay picking a high-happiness child, their value will be reduced more by the time we select them
   - The reduction is based on turn number, not which specific children were selected before

2. **Sorting enables greedy selection**: By sorting the happiness array in descending order, we can simply iterate through the sorted array and pick the first `k` children.

3. **Handling the subtraction**: For the i-th selected child (0-indexed), we subtract `i` from their happiness value. If the result is negative, we use 0 instead (since happiness can't be negative).

**Why greedy works**:

- Suppose we have two children with happiness values `a` and `b`, where `a > b`
- If we pick `a` first and `b` second: total = `a + max(b-1, 0)`
- If we pick `b` first and `a` second: total = `b + max(a-1, 0)`
- Since `a > b`, `a + max(b-1, 0) ≥ b + max(a-1, 0)` for all `a, b ≥ 0`
- This logic extends to more than two children through mathematical induction

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def maximumHappinessSum(happiness, k):
    """
    Calculate the maximum total happiness by selecting k children optimally.

    Args:
        happiness: List of happiness values for each child
        k: Number of children to select

    Returns:
        Maximum total happiness achievable
    """
    # Step 1: Sort happiness in descending order
    # This ensures we consider the highest values first
    happiness.sort(reverse=True)

    total_happiness = 0

    # Step 2: Iterate through first k children in sorted order
    for i in range(k):
        # Calculate happiness for current child
        # We subtract i because i represents how many turns have passed
        # (0 for first child, 1 for second, etc.)
        current_happiness = happiness[i] - i

        # If happiness becomes negative, we use 0 (can't have negative happiness)
        if current_happiness > 0:
            total_happiness += current_happiness
        else:
            # Once we hit 0 or negative, all subsequent children will also be <= 0
            # because the array is sorted descending and i increases
            break

    return total_happiness
```

```javascript
// Time: O(n log n) | Space: O(1) or O(log n) depending on sorting implementation
function maximumHappinessSum(happiness, k) {
  /**
   * Calculate the maximum total happiness by selecting k children optimally.
   *
   * @param {number[]} happiness - Array of happiness values for each child
   * @param {number} k - Number of children to select
   * @return {number} Maximum total happiness achievable
   */

  // Step 1: Sort happiness in descending order
  // Use b - a for descending sort (a - b would be ascending)
  happiness.sort((a, b) => b - a);

  let totalHappiness = 0;

  // Step 2: Iterate through first k children in sorted order
  for (let i = 0; i < k; i++) {
    // Calculate happiness for current child
    // Subtract i because i represents turns passed (0 for first, 1 for second, etc.)
    const currentHappiness = happiness[i] - i;

    // If happiness is positive, add it to total
    if (currentHappiness > 0) {
      totalHappiness += currentHappiness;
    } else {
      // Once we hit 0 or negative, all subsequent will also be <= 0
      // because array is sorted descending and i increases
      break;
    }
  }

  return totalHappiness;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(log n) depending on sorting implementation
import java.util.Arrays;
import java.util.Collections;

class Solution {
    public long maximumHappinessSum(int[] happiness, int k) {
        /**
         * Calculate the maximum total happiness by selecting k children optimally.
         *
         * @param happiness Array of happiness values for each child
         * @param k Number of children to select
         * @return Maximum total happiness achievable
         */

        // Step 1: Sort happiness in descending order
        // Convert to Integer[] to use Collections.reverseOrder()
        Integer[] happinessObj = new Integer[happiness.length];
        for (int i = 0; i < happiness.length; i++) {
            happinessObj[i] = happiness[i];
        }
        Arrays.sort(happinessObj, Collections.reverseOrder());

        long totalHappiness = 0;

        // Step 2: Iterate through first k children in sorted order
        for (int i = 0; i < k; i++) {
            // Calculate happiness for current child
            // Subtract i because i represents turns passed (0 for first, 1 for second, etc.)
            long currentHappiness = (long) happinessObj[i] - i;

            // If happiness is positive, add it to total
            if (currentHappiness > 0) {
                totalHappiness += currentHappiness;
            } else {
                // Once we hit 0 or negative, all subsequent will also be <= 0
                // because array is sorted descending and i increases
                break;
            }
        }

        return totalHappiness;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the happiness array, which takes O(n log n) time
- The subsequent iteration through the first k elements takes O(k) time
- Since k ≤ n, the overall time complexity is O(n log n)

**Space Complexity: O(1) or O(n)**

- If we sort in-place (like in Python and JavaScript), space complexity is O(1) or O(log n) for the sorting algorithm's stack space
- In Java, we need O(n) additional space to convert to Integer[] for descending sort
- We could optimize the Java solution to sort in descending order without extra space by sorting ascending and then traversing from the end

## Common Mistakes

1. **Forgetting to handle negative happiness**: Some candidates calculate `happiness[i] - i` without checking if it becomes negative. Remember that happiness can't be negative, so we need to use `max(happiness[i] - i, 0)`.

2. **Using the wrong subtraction value**: A common error is subtracting the wrong amount. Remember that for the i-th selected child (0-indexed), we subtract `i`, not `i-1` or `i+1`. The first child (i=0) has no subtraction, the second (i=1) subtracts 1, etc.

3. **Not breaking early when happiness becomes 0**: Once `happiness[i] - i ≤ 0`, all subsequent children will also have `happiness[j] - j ≤ 0` for j > i (because the array is sorted descending). Breaking early can save unnecessary iterations.

4. **Integer overflow in Java**: When k is large (up to 2×10^5) and happiness values are large, the total can exceed 32-bit integer range. Always use `long` for the total in Java.

## When You'll See This Pattern

This greedy + sorting pattern appears in many optimization problems where you need to select elements in an optimal order:

1. **Maximum Candies Allocated to K Children (Medium)**: Similar structure where you allocate candies to maximize the minimum number any child gets, using sorting and greedy allocation.

2. **Maximum Units on a Truck (Easy)**: Select boxes to maximize total units, where you sort by units per box and greedily take the highest first.

3. **Minimum Cost to Hire K Workers (Hard)**: More complex but uses sorting combined with a priority queue to maintain the best k candidates.

The pattern to recognize: when you need to make a series of selections and the value of each selection depends on when it's chosen (often decreasing over time), sorting followed by greedy selection is a common approach.

## Key Takeaways

1. **When order affects value, think sorting**: If selecting items in different orders yields different totals because values change over time, sorting is often the first step to finding an optimal sequence.

2. **Greedy works when local optimal choices lead to global optimum**: This problem demonstrates a classic case where making the best choice at each step (picking the highest remaining value) leads to the overall best solution.

3. **Watch for early termination conditions**: When working with sorted data and monotonic conditions (like decreasing values), you can often break early once a condition is met, improving practical performance.

Related problems: [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children)
