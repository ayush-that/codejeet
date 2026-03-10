---
title: "How to Solve Maximum Manhattan Distance After K Changes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Manhattan Distance After K Changes. Medium difficulty, 54.2% acceptance rate. Topics: Hash Table, Math, String, Counting."
date: "2027-06-14"
category: "dsa-patterns"
tags: ["maximum-manhattan-distance-after-k-changes", "hash-table", "math", "string", "medium"]
---

# How to Solve Maximum Manhattan Distance After K Changes

This problem asks us to maximize the Manhattan distance from the origin after performing exactly K character changes in a movement string. You're given a string `s` where each character represents a unit movement in one of four cardinal directions, and you can change up to K characters to any direction. The challenge is to determine which changes will maximize your final distance from the starting point.

What makes this problem interesting is that it's not about simulating all possible changes—that would be exponential. Instead, we need to think strategically about how each change affects our position and find a mathematical way to calculate the maximum possible distance without brute force simulation.

## Visual Walkthrough

Let's walk through a concrete example: `s = "NESW"` with `K = 2`.

**Initial movements without changes:**

- Start at (0, 0)
- 'N': (0, 1)
- 'E': (1, 1)
- 'S': (1, 0)
- 'W': (0, 0)

Final position: (0, 0) with distance 0.

**Now let's think about strategic changes:**

The Manhattan distance formula is `|x| + |y|`. To maximize this, we want to:

1. Increase the magnitude of both x and y coordinates
2. Make x and y have the same sign (both positive or both negative) to avoid cancellation

**Our current movements:**

- North (+y) and South (-y) cancel each other
- East (+x) and West (-x) cancel each other

**If we change 2 characters:**
Option 1: Change 'S' to 'N' and 'W' to 'E'

- Sequence becomes "NENE"
- Final position: (2, 2)
- Distance: 4

Option 2: Change 'S' to 'N' and 'E' to 'N'

- Sequence becomes "NNNW"
- Final position: (-1, 3)
- Distance: 4

Both give distance 4, which is better than 0!

The key insight: Each change can either:

1. Convert a movement that reduces distance into one that increases it
2. Convert a movement that increases distance in one direction to increase it in another direction

## Brute Force Approach

A naive approach would try all possible combinations of changing K characters. For each position in the string, we could either keep the original character or change it to one of the other 3 directions. This gives us 4 choices per position for K positions we choose to change.

The brute force would:

1. Generate all combinations of K indices to change
2. For each combination, try all possible direction assignments (3^K possibilities)
3. Simulate the movement and calculate the final distance
4. Track the maximum distance found

**Why this fails:**

- Number of combinations: C(n, K) where n is string length
- For each combination: 3^K possible direction assignments
- Total complexity: O(C(n, K) _ 3^K _ n) which is exponential
- Even for moderate n=100 and K=10, this is computationally impossible

The brute force helps us understand the problem space but clearly isn't practical. We need a smarter approach that doesn't require simulating every possibility.

## Optimized Approach

The key insight is that we don't need to simulate specific sequences. Instead, we can think in terms of net movements:

Let's define:

- `x`: net east-west position (east positive, west negative)
- `y`: net north-south position (north positive, south negative)

After processing the string, we get initial `x` and `y`.

Each character change can affect our position by:

- If we change a character to increase distance: we gain up to 2 units in that axis
- If we change a character to better align coordinates: we can convert movement from one axis to another

**Step-by-step reasoning:**

1. **Calculate initial position:** Process the string to get initial (x, y)
2. **Understand the effect of changes:**
   - Changing a character can modify our position by ±2 in x or y
   - We want to use changes to make |x| + |y| as large as possible
3. **Greedy approach:** Use changes to:
   - First, increase the magnitude of the smaller coordinate
   - Then, increase both coordinates equally
4. **Mathematical formulation:**
   - Each change can add up to 2 to our distance
   - Maximum possible distance = initial distance + min(2\*K, remaining capacity)
   - But we need to be careful about bounds

**The optimal strategy:**

1. Calculate initial |x| + |y|
2. Each change can increase distance by at most 2
3. However, we're limited by:
   - The number of changes K
   - The maximum possible distance (string length, since each move is 1 unit)
4. Also consider: if we have extra changes after maximizing, we might waste them on moves that don't change distance

**Critical observation:** The maximum Manhattan distance after K changes is:

```
min(initial_distance + 2*K, n)
```

But wait, this isn't quite right because sometimes we can't use all K changes effectively (e.g., if we're already at maximum distance).

**Correct formula:**
We need to consider:

1. Current distance D = |x| + |y|
2. Maximum additional distance we can gain: 2\*K
3. But we can't exceed the total moves: n (each move contributes at most 1 to distance)
4. Also, if (n - D) is odd and we have enough changes, we might not reach exactly n

The actual maximum is: `min(D + 2*K, n)` but with adjustment for parity.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def max_manhattan_distance(s: str, k: int) -> int:
    """
    Calculate maximum Manhattan distance after exactly K changes.

    Args:
        s: String of movements ('N', 'S', 'E', 'W')
        k: Number of character changes allowed

    Returns:
        Maximum possible Manhattan distance from origin
    """
    # Step 1: Calculate initial position
    x, y = 0, 0
    for move in s:
        if move == 'N':
            y += 1
        elif move == 'S':
            y -= 1
        elif move == 'E':
            x += 1
        elif move == 'W':
            x -= 1

    # Step 2: Calculate initial Manhattan distance
    initial_distance = abs(x) + abs(y)
    n = len(s)

    # Step 3: Core logic
    # Each change can increase distance by at most 2
    # Maximum possible distance is limited by:
    # 1. initial_distance + 2*k (if we use all changes effectively)
    # 2. n (can't exceed total moves since each move contributes at most 1)
    max_possible = min(initial_distance + 2 * k, n)

    # Step 4: Handle parity issue
    # If max_possible has different parity than n, we need to adjust
    # Because we can only change distance by multiples of 2 with changes
    # (each change affects distance by -2, 0, or +2)
    if (max_possible % 2) != (n % 2):
        max_possible -= 1

    return max_possible
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate maximum Manhattan distance after exactly K changes.
 * @param {string} s - String of movements ('N', 'S', 'E', 'W')
 * @param {number} k - Number of character changes allowed
 * @return {number} Maximum possible Manhattan distance from origin
 */
function maxManhattanDistance(s, k) {
  // Step 1: Calculate initial position
  let x = 0,
    y = 0;
  for (let i = 0; i < s.length; i++) {
    const move = s[i];
    if (move === "N") {
      y += 1;
    } else if (move === "S") {
      y -= 1;
    } else if (move === "E") {
      x += 1;
    } else if (move === "W") {
      x -= 1;
    }
  }

  // Step 2: Calculate initial Manhattan distance
  const initialDistance = Math.abs(x) + Math.abs(y);
  const n = s.length;

  // Step 3: Core logic
  // Each change can increase distance by at most 2
  // Maximum possible distance is limited by:
  // 1. initialDistance + 2*k (if we use all changes effectively)
  // 2. n (can't exceed total moves since each move contributes at most 1)
  let maxPossible = Math.min(initialDistance + 2 * k, n);

  // Step 4: Handle parity issue
  // If maxPossible has different parity than n, we need to adjust
  // Because we can only change distance by multiples of 2 with changes
  if (maxPossible % 2 !== n % 2) {
    maxPossible -= 1;
  }

  return maxPossible;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate maximum Manhattan distance after exactly K changes.
     * @param s String of movements ('N', 'S', 'E', 'W')
     * @param k Number of character changes allowed
     * @return Maximum possible Manhattan distance from origin
     */
    public int maxManhattanDistance(String s, int k) {
        // Step 1: Calculate initial position
        int x = 0, y = 0;
        for (int i = 0; i < s.length(); i++) {
            char move = s.charAt(i);
            if (move == 'N') {
                y += 1;
            } else if (move == 'S') {
                y -= 1;
            } else if (move == 'E') {
                x += 1;
            } else if (move == 'W') {
                x -= 1;
            }
        }

        // Step 2: Calculate initial Manhattan distance
        int initialDistance = Math.abs(x) + Math.abs(y);
        int n = s.length();

        // Step 3: Core logic
        // Each change can increase distance by at most 2
        // Maximum possible distance is limited by:
        // 1. initialDistance + 2*k (if we use all changes effectively)
        // 2. n (can't exceed total moves since each move contributes at most 1)
        int maxPossible = Math.min(initialDistance + 2 * k, n);

        // Step 4: Handle parity issue
        // If maxPossible has different parity than n, we need to adjust
        // Because we can only change distance by multiples of 2 with changes
        if ((maxPossible % 2) != (n % 2)) {
            maxPossible -= 1;
        }

        return maxPossible;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string to calculate initial position: O(n)
- The rest of the calculations are constant time operations
- No nested loops or exponential operations

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (x, y, initialDistance, n, maxPossible)
- No additional data structures that scale with input size
- The input string is given and not counted toward our space usage

The efficiency comes from recognizing that we don't need to simulate specific sequences. The mathematical relationship between changes and distance allows us to compute the answer directly.

## Common Mistakes

1. **Forgetting the parity adjustment:** This is the most common mistake. Candidates often return `min(initial_distance + 2*K, n)` without considering that if the result has different parity than n, it's impossible to achieve. Each change modifies distance by -2, 0, or +2, so the parity of the distance (odd/even) relative to n matters.

2. **Overestimating the effect of changes:** Some candidates think each change can add up to 2 to the distance, but fail to realize there's an upper bound of n (the string length). You can't have a Manhattan distance greater than the total number of moves.

3. **Not handling large K correctly:** When K is very large (greater than n), candidates might try to use more changes than possible or create complex logic. The formula `min(initial_distance + 2*K, n)` automatically handles this because n is the upper bound.

4. **Misunderstanding Manhattan distance:** Some candidates calculate Euclidean distance (√(x² + y²)) instead of Manhattan distance (|x| + |y|). The problem clearly states Manhattan distance, which is linear and easier to work with.

## When You'll See This Pattern

This problem uses a **mathematical optimization** pattern combined with **greedy thinking**. You'll see similar patterns in:

1. **As Far from Land as Possible (LeetCode 1162):** Also involves maximizing Manhattan distance, though in a grid search context. The core idea of strategically positioning yourself to maximize distance is similar.

2. **Maximum Swap (LeetCode 670):** While about swapping digits, it uses similar greedy optimization—making changes that give the maximum benefit first.

3. **Minimum Operations to Make Array Equal (LeetCode 1551):** Involves mathematical reasoning about parity and incremental changes to reach a target state.

The pattern appears in problems where:

- You have a limited number of operations/changes
- Each operation has a quantifiable effect on the objective
- There's a mathematical relationship between operations and the result
- Brute force simulation is infeasible

## Key Takeaways

1. **Think mathematically, not procedurally:** Instead of simulating all possibilities, look for formulas that describe the relationship between operations (changes) and the outcome (distance). This often involves recognizing upper bounds and parity constraints.

2. **Greedy optimization with bounds:** When you can make changes, use them for maximum benefit first (increasing the smaller coordinate), but always check physical constraints (can't exceed total moves).

3. **Parity matters in incremental changes:** When changes affect values in fixed increments (like ±2 here), the parity (odd/even) of the result relative to constraints is crucial. Always check if your target value is achievable given the increment size.

Related problems: [As Far from Land as Possible](/problem/as-far-from-land-as-possible)
