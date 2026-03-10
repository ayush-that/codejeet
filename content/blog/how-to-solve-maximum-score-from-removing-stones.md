---
title: "How to Solve Maximum Score From Removing Stones — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Score From Removing Stones. Medium difficulty, 68.6% acceptance rate. Topics: Math, Greedy, Heap (Priority Queue)."
date: "2028-06-24"
category: "dsa-patterns"
tags: ["maximum-score-from-removing-stones", "math", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Maximum Score From Removing Stones

You have three piles of stones with sizes `a`, `b`, and `c`. Each turn, you remove one stone from two different non-empty piles and gain 1 point. The game ends when fewer than two piles have stones. Your goal is to maximize your score.

What makes this problem interesting is that it looks like a greedy problem, but the optimal strategy isn't immediately obvious. Should you always take from the two largest piles? What happens when one pile is much larger than the others? The key insight is understanding how the total number of stones and the largest pile constrain the maximum possible score.

## Visual Walkthrough

Let's trace through an example: `a = 2, b = 4, c = 6`

**Step 1:** Sort the piles: `[2, 4, 6]` (smallest to largest)

**Step 2:** Think about the constraints:

- Each move removes 2 stones total (1 from each of 2 piles)
- Maximum possible moves = total stones ÷ 2 = (2+4+6)/2 = 6
- But we're limited by needing two non-empty piles

**Step 3:** Try the greedy approach: always take from the two largest piles

1. Take from piles with 4 and 6 → `[2, 3, 5]`, score = 1
2. Take from piles with 3 and 5 → `[2, 2, 4]`, score = 2
3. Take from piles with 2 and 4 → `[1, 2, 3]`, score = 3
4. Take from piles with 2 and 3 → `[1, 1, 2]`, score = 4
5. Take from piles with 1 and 2 → `[0, 1, 1]`, score = 5
6. Take from piles with 1 and 1 → `[0, 0, 0]`, score = 6

We got 6 points, which equals total stones ÷ 2. But is this always possible?

**Counterexample:** `a = 1, b = 8, c = 8`

- Total stones = 17, so total stones ÷ 2 = 8.5 → floor to 8
- But if we try: take from 8 and 8 repeatedly, after 8 moves we'd have `[1, 0, 0]`
- Actually, we can only make 8 moves! Let's check:
  1. 8,8 → 7,7 (1)
  2. 7,7 → 6,6 (2)
  3. 6,6 → 5,5 (3)
  4. 5,5 → 4,4 (4)
  5. 4,4 → 3,3 (5)
  6. 3,3 → 2,2 (6)
  7. 2,2 → 1,1 (7)
  8. 1,1 → 0,0 (8)
     Wait, we still have the original 1 stone left! So we actually get 8 moves.

The insight: When one pile is very small, it can limit the total moves even if total stones is large.

## Brute Force Approach

A naive approach would be to simulate every possible sequence of moves using recursion or BFS. At each step, we have up to 3 choices (which two piles to take from), and we'd explore all paths to find the maximum score.

```python
def maximumScore(a, b, c):
    def dfs(x, y, z):
        # Base case: fewer than 2 non-empty piles
        non_empty = (x > 0) + (y > 0) + (z > 0)
        if non_empty < 2:
            return 0

        # Try all possible moves
        max_score = 0
        if x > 0 and y > 0:
            max_score = max(max_score, 1 + dfs(x-1, y-1, z))
        if x > 0 and z > 0:
            max_score = max(max_score, 1 + dfs(x-1, y, z-1))
        if y > 0 and z > 0:
            max_score = max(max_score, 1 + dfs(x, y-1, z-1))

        return max_score

    return dfs(a, b, c)
```

**Why this fails:** The time complexity is exponential! With up to 10^5 stones in each pile (per constraints), this approach is completely infeasible. We need a mathematical or greedy solution.

## Optimized Approach

The key insight comes from thinking about the problem mathematically:

1. **Upper bound:** The maximum score cannot exceed `floor((a + b + c) / 2)` because each move removes 2 stones total.

2. **Constraint from largest pile:** If the largest pile is bigger than the sum of the other two, we're limited by the smaller piles. Each move involving the largest pile requires one of the smaller piles. Once the smaller piles are exhausted, we can't make more moves even if the largest pile still has stones.

3. **Mathematical formula:**
   - Let the piles be sorted so that `a ≤ b ≤ c`
   - If `c ≥ a + b`, then we can only make `a + b` moves (use all stones from the two smaller piles with the largest pile)
   - Otherwise, we can make `floor((a + b + c) / 2)` moves

**Why this works:** When `c ≥ a + b`, every move involving `c` uses one stone from `a` or `b`. We'll exhaust `a` and `b` first, leaving `c - (a + b)` stones unused. When `c < a + b`, the stones are more balanced, and we can arrange moves to use almost all stones.

**Proof sketch:** When `c < a + b`, the total stones `a + b + c` is at most `2c + (a + b - c) < 2c + c = 3c`, but more importantly, we can always pair stones such that no pile is isolated. One constructive proof: repeatedly take from the two largest piles until the condition `c ≥ a + b` becomes true or all piles are empty.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def maximumScore(a: int, b: int, c: int) -> int:
    """
    Calculate maximum score from removing stones from three piles.

    The key insight:
    1. Sort the piles so a <= b <= c
    2. If the largest pile (c) is >= sum of the two smaller (a + b),
       then we can only make a + b moves (limited by smaller piles)
    3. Otherwise, we can make floor((a + b + c) / 2) moves

    Args:
        a, b, c: sizes of the three piles

    Returns:
        Maximum possible score
    """
    # Step 1: Sort the pile sizes
    # We sort to easily identify smallest and largest piles
    piles = sorted([a, b, c])
    a, b, c = piles[0], piles[1], piles[2]

    # Step 2: Check if largest pile dominates the two smaller ones
    if c >= a + b:
        # Limited by smaller piles: each move involving c uses one from a or b
        # We can make at most a + b moves before a and b are exhausted
        return a + b
    else:
        # More balanced case: we can use almost all stones
        # Each move removes 2 stones, so maximum is floor(total / 2)
        return (a + b + c) // 2
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate maximum score from removing stones from three piles.
 *
 * The key insight:
 * 1. Sort the piles so a <= b <= c
 * 2. If the largest pile (c) is >= sum of the two smaller (a + b),
 *    then we can only make a + b moves (limited by smaller piles)
 * 3. Otherwise, we can make floor((a + b + c) / 2) moves
 *
 * @param {number} a - size of first pile
 * @param {number} b - size of second pile
 * @param {number} c - size of third pile
 * @return {number} Maximum possible score
 */
function maximumScore(a, b, c) {
  // Step 1: Sort the pile sizes in ascending order
  // We create an array, sort it, then destructure
  const piles = [a, b, c].sort((x, y) => x - y);
  [a, b, c] = piles;

  // Step 2: Apply the mathematical formula
  if (c >= a + b) {
    // Largest pile dominates: limited by sum of smaller piles
    return a + b;
  } else {
    // Balanced piles: can use almost all stones
    // Math.floor for integer division (all inputs are integers)
    return Math.floor((a + b + c) / 2);
  }
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate maximum score from removing stones from three piles.
     *
     * The key insight:
     * 1. Sort the piles so a <= b <= c
     * 2. If the largest pile (c) is >= sum of the two smaller (a + b),
     *    then we can only make a + b moves (limited by smaller piles)
     * 3. Otherwise, we can make floor((a + b + c) / 2) moves
     *
     * @param a size of first pile
     * @param b size of second pile
     * @param c size of third pile
     * @return Maximum possible score
     */
    public int maximumScore(int a, int b, int c) {
        // Step 1: Sort the pile sizes
        // Create array, sort it, then assign back
        int[] piles = {a, b, c};
        Arrays.sort(piles);
        a = piles[0];
        b = piles[1];
        c = piles[2];

        // Step 2: Apply the mathematical formula
        if (c >= a + b) {
            // Case 1: Largest pile is too big
            // We're limited by the smaller piles
            return a + b;
        } else {
            // Case 2: Balanced piles
            // We can use almost all stones
            return (a + b + c) / 2;  // Integer division gives floor
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- Sorting 3 elements takes constant time (fixed 3 comparisons)
- The rest is simple arithmetic operations

**Space Complexity:** O(1)

- We only use a fixed-size array for sorting (size 3)
- No additional data structures that scale with input

The constant time/space solution is optimal because we must at least read the three inputs, which is O(1) operation.

## Common Mistakes

1. **Not sorting the piles first:** Without sorting, you can't easily identify which pile is largest. Candidates might try complex conditional logic with all permutations of a, b, c, which is error-prone.

2. **Forgetting the floor division:** When computing `(a + b + c) / 2`, you must use integer division. In languages like Python 3, `//` gives integer division, but in Java/C++ `/` with integers does too. In JavaScript, you need `Math.floor()`.

3. **Overcomplicating with simulation:** Some candidates try to simulate the process with a priority queue (max-heap), always taking from the two largest piles. While this gives the correct answer, it's O(n log n) where n is total stones, which can be up to 1.5×10^5 operations vs. O(1) for the mathematical solution.

4. **Misunderstanding the constraint:** The problem says "fewer than two non-empty piles" stops the game. This means the game continues when there are 2 or 3 non-empty piles. Some candidates mistakenly stop when any pile is empty.

## When You'll See This Pattern

This problem uses a **greedy/mathematical insight** pattern common in optimization problems with constraints:

1. **Minimum Amount of Time to Fill Cups** (LeetCode 2335): Almost identical problem! Instead of maximizing score from removing stones, you minimize time to fill cups. The mathematical formula is the same.

2. **Maximum Product of Two Elements in an Array** (LeetCode 1464): While different, it shares the pattern of "find two largest elements and operate on them" thinking.

3. **Last Stone Weight** (LeetCode 1046): Always smash the two heaviest stones - similar greedy "take from largest" intuition.

The core pattern: When you have operations that involve the largest elements and the problem has a mathematical structure, look for closed-form solutions rather than simulation.

## Key Takeaways

1. **Look for mathematical bounds first:** Before coding, ask: "What's the absolute maximum possible?" Here, it's `floor(total/2)`. Then ask: "What constraints might prevent reaching that maximum?"

2. **Sorting small sets is cheap:** When you have only 3 elements, don't avoid sorting because "sorting is O(n log n)" - with n=3, it's effectively O(1).

3. **Test edge cases with extreme values:** The two cases in our formula come from considering what happens when one pile dominates (`[1, 1, 100]`) vs. balanced piles (`[3, 4, 5]`).

Related problems: [Minimum Amount of Time to Fill Cups](/problem/minimum-amount-of-time-to-fill-cups)
