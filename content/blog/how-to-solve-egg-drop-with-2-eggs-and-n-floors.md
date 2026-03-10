---
title: "How to Solve Egg Drop With 2 Eggs and N Floors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Egg Drop With 2 Eggs and N Floors. Medium difficulty, 74.6% acceptance rate. Topics: Math, Dynamic Programming."
date: "2028-03-29"
category: "dsa-patterns"
tags: ["egg-drop-with-2-eggs-and-n-floors", "math", "dynamic-programming", "medium"]
---

# How to Solve Egg Drop With 2 Eggs and N Floors

You have two identical eggs and need to find the highest floor `f` from which an egg can be dropped without breaking, in a building with `n` floors. The challenge is to minimize the **worst-case number of drops** needed to determine `f` with certainty. This problem is interesting because it combines mathematical reasoning with optimization thinking—you can't just test every floor sequentially, but you also can't be too aggressive with your jumps since you only have two eggs.

## Visual Walkthrough

Let's walk through an example with `n = 10` floors. We need a strategy that minimizes the worst-case number of drops.

**Key insight**: With two eggs, we can use the first egg to narrow down a range, then use the second egg to test floors sequentially within that range.

**Strategy**: Drop the first egg from floor `x`. If it breaks, we use the second egg to test floors `1` through `x-1` sequentially (worst case: `x` drops total). If it doesn't break, we move up to floor `x + (x-1)` and repeat.

Let's find the optimal starting floor `x`:

- We want the sum `x + (x-1) + (x-2) + ... + 1 ≥ n`
- This sum equals `x(x+1)/2 ≥ n`
- For `n = 10`, solve `x(x+1)/2 ≥ 10` → `x = 4` works since `4×5/2 = 10`

**Testing with x = 4**:

1. Drop first egg from floor 4 → doesn't break
2. Drop first egg from floor 7 (4+3) → doesn't break
3. Drop first egg from floor 9 (7+2) → breaks
4. Now use second egg: drop from floor 8 → doesn't break
5. Drop from floor 9 → breaks

We found `f = 8` in 5 drops. This is the worst case—if the egg breaks earlier, we need fewer drops.

## Brute Force Approach

A naive approach would be to test every floor sequentially with the first egg until it breaks, then use the second egg to find the exact floor. This gives a worst-case of `n` drops (testing every floor), which is inefficient.

Another brute force would be to try all possible starting floors and jump sizes, but this becomes exponential in complexity. The key problem with brute force is it doesn't leverage the mathematical structure of the problem—that we can optimize the jumps to minimize the worst-case scenario.

## Optimized Approach

The optimal approach uses **mathematical reasoning** rather than dynamic programming (which would be overkill for just 2 eggs).

**Reasoning process**:

1. Let the first egg be dropped from floor `x`
2. If it breaks: use second egg to test floors `1` to `x-1` sequentially → worst case: `x` drops total
3. If it doesn't break: we now have the same problem but with `n-x` floors above, and we've used 1 drop
4. To minimize worst case, we want the number of drops to be balanced regardless of where the egg breaks

This leads to the equation: `x + (x-1) + (x-2) + ... + 1 ≥ n`

- The first term `x` is the worst case if egg breaks on first drop
- The second term `(x-1)` is the additional drops if we move up and it breaks next, etc.
- We need enough "coverage" to handle all `n` floors

Solving `x(x+1)/2 ≥ n` gives us the minimum starting floor. We can find `x` by solving the quadratic equation or using binary search.

## Optimal Solution

The solution finds the smallest `x` such that `x(x+1)/2 ≥ n` using binary search for efficiency with large `n`.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def twoEggDrop(n: int) -> int:
    """
    Returns the minimum number of drops needed in the worst case
    to find the critical floor with 2 eggs.

    The optimal strategy is to find the smallest x such that:
    x(x+1)/2 >= n

    This comes from balancing drops so the worst case is minimized.
    """
    # Binary search for the smallest x where x(x+1)/2 >= n
    left, right = 1, n

    while left < right:
        mid = (left + right) // 2
        # Calculate total floors covered with mid drops
        total = mid * (mid + 1) // 2

        if total >= n:
            # We have enough coverage, try smaller x
            right = mid
        else:
            # Not enough coverage, need larger x
            left = mid + 1

    # left is now the smallest x satisfying the condition
    return left
```

```javascript
// Time: O(log n) | Space: O(1)
/**
 * Returns the minimum number of drops needed in the worst case
 * to find the critical floor with 2 eggs.
 *
 * The optimal strategy is to find the smallest x such that:
 * x(x+1)/2 >= n
 *
 * This comes from balancing drops so the worst case is minimized.
 */
function twoEggDrop(n) {
  // Binary search for the smallest x where x(x+1)/2 >= n
  let left = 1;
  let right = n;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // Calculate total floors covered with mid drops
    const total = (mid * (mid + 1)) / 2;

    if (total >= n) {
      // We have enough coverage, try smaller x
      right = mid;
    } else {
      // Not enough coverage, need larger x
      left = mid + 1;
    }
  }

  // left is now the smallest x satisfying the condition
  return left;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    /**
     * Returns the minimum number of drops needed in the worst case
     * to find the critical floor with 2 eggs.
     *
     * The optimal strategy is to find the smallest x such that:
     * x(x+1)/2 >= n
     *
     * This comes from balancing drops so the worst case is minimized.
     */
    public int twoEggDrop(int n) {
        // Binary search for the smallest x where x(x+1)/2 >= n
        int left = 1;
        int right = n;

        while (left < right) {
            int mid = left + (right - left) / 2;
            // Calculate total floors covered with mid drops
            // Use long to prevent overflow for large n
            long total = (long) mid * (mid + 1) / 2;

            if (total >= n) {
                // We have enough coverage, try smaller x
                right = mid;
            } else {
                // Not enough coverage, need larger x
                left = mid + 1;
            }
        }

        // left is now the smallest x satisfying the condition
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(log n)

- We use binary search over the range [1, n] to find the optimal number of drops
- Each iteration halves the search space
- The arithmetic operations are O(1)

**Space Complexity**: O(1)

- We only use a few integer variables (left, right, mid, total)
- No additional data structures are needed

## Common Mistakes

1. **Using linear search instead of binary search**: Some candidates try every possible `x` from 1 to n, resulting in O(n) time. While this still passes for reasonable n, binary search is more efficient for large n.

2. **Off-by-one errors in the formula**: The correct formula is `x(x+1)/2 ≥ n`, not `x(x-1)/2 ≥ n`. The reasoning: if we start at floor x and it doesn't break, we next try x + (x-1), then x + (x-1) + (x-2), etc.

3. **Forgetting to handle large n causing overflow**: In Java, calculating `mid * (mid + 1)` can overflow for large n. Always use `long` for intermediate calculations when dealing with potentially large multiplications.

4. **Misunderstanding the problem as finding f rather than minimizing drops**: The goal is to minimize the worst-case number of drops, not to find the actual floor f. The return value is the number of drops, not the floor number.

## When You'll See This Pattern

This problem uses **mathematical optimization with binary search**, a pattern seen in problems where you need to minimize a maximum cost or find an optimal threshold.

Related problems:

1. **Super Egg Drop (Hard)**: The generalized version with k eggs. This 2-egg problem is a special case that helps build intuition for the harder problem.
2. **Capacity To Ship Packages Within D Days (Medium)**: Uses binary search to find the minimum capacity that allows shipping within D days—similar "minimize maximum" pattern.
3. **Split Array Largest Sum (Hard)**: Find the minimum largest sum when splitting an array into m parts—another "minimize maximum" problem solvable with binary search.

## Key Takeaways

1. **Balance is key for minimization problems**: When minimizing worst-case scenarios, look for strategies that balance the cost across different cases. Here, we balance the number of drops so the worst case is the same regardless of where the egg breaks.

2. **Mathematical reasoning can simplify DP**: For special cases (like 2 eggs), a mathematical formula can replace dynamic programming, leading to more efficient solutions.

3. **Binary search on the answer space**: When the answer is monotonic (if x works, then x+1 also works), binary search can efficiently find the minimum valid answer.

Related problems: [Super Egg Drop](/problem/super-egg-drop)
