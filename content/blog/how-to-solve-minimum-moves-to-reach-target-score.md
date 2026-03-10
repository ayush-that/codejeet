---
title: "How to Solve Minimum Moves to Reach Target Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Reach Target Score. Medium difficulty, 52.3% acceptance rate. Topics: Math, Greedy."
date: "2028-04-19"
category: "dsa-patterns"
tags: ["minimum-moves-to-reach-target-score", "math", "greedy", "medium"]
---

# How to Solve Minimum Moves to Reach Target Score

You start at 1 and need to reach a target integer using two operations: increment by 1 or double. The challenge is finding the minimum number of moves. What makes this interesting is that while you might think to start from 1 and build up, the optimal approach actually works backwards from the target—a common pattern in problems where you have reversible operations.

## Visual Walkthrough

Let's trace through `target = 19, maxDoubles = 2` step by step:

**Forward thinking (intuitive but not optimal):**

- Start: 1
- Option 1: Double to 2 (1 move), double to 4 (2 moves), increment 15 times to 19 (17 total moves)
- Option 2: Increment 18 times (18 moves)
- Option 3: Double to 2, increment to 10, double to 20, decrement to 19... wait, we can't decrement!

The forward approach gets messy because we have to consider all combinations of doubles and increments. Instead, let's think backwards:

**Backward thinking (optimal):**
We start at 19 with 2 doubles remaining:

1. 19 is odd → must have come from increment (19-1=18) → moves++ (1 move)
2. 18 is even and we have doubles left → could have come from doubling (18/2=9) → use a double, moves++ (2 moves), doubles-- (1 left)
3. 9 is odd → must have come from increment (9-1=8) → moves++ (3 moves)
4. 8 is even and we have doubles left → could have come from doubling (8/2=4) → use a double, moves++ (4 moves), doubles-- (0 left)
5. 4 > 1 and no doubles left → must use increments: 4-1=3 increments → moves+=3 (7 moves)
6. We've reached 1!

Total: 7 moves. This backward greedy approach works because:

- If current number is odd, it MUST have come from an increment (doubling always produces even numbers)
- If current number is even AND we have doubles left, we SHOULD use a double (it's more efficient than multiple increments)
- Once we run out of doubles, we just use increments to get down to 1

## Brute Force Approach

A naive solution would try all possible sequences of operations from 1 to target. This is essentially a BFS where each state `(current_value, doubles_used)` can transition to `(current+1, doubles_used)` or `(current*2, doubles_used+1)`. We'd stop when we reach target and track the minimum moves.

The problem? The state space explodes exponentially. If target is large (up to 10⁹), BFS is impossible. Even with memoization, we'd have too many states because `current_value` can grow very large before coming back down.

What about dynamic programming from 1 to target? We could define `dp[i] = min moves to reach i`, with transitions from `i-1` (increment) and `i/2` if i is even (double). But this requires O(target) space and time, which is infeasible for target up to 10⁹.

The brute force teaches us that forward approaches struggle because:

1. The search space is too large
2. We need to consider all combinations of when to use doubles
3. The optimal timing for doubles isn't obvious when going forward

## Optimized Approach

The key insight: **Work backwards from target to 1, and use doubles as early as possible in the backward process.**

Why backwards?

1. When going backwards, if we see an odd number, we KNOW the last operation must have been an increment (since 2×anything is even)
2. When we see an even number and have doubles remaining, we SHOULD use a double (dividing by 2 is more efficient than subtracting 1 multiple times)
3. Once we run out of doubles, the remaining path is forced: we can only subtract 1 until we reach 1

This is a greedy approach that works because:

- Using a double (division by 2) reduces the number much faster than increments (subtractions by 1)
- There's no benefit to "saving" a double for later—if you can divide by 2 now, do it
- The operations are reversible, so the minimum path forward equals the minimum path backward

Step-by-step algorithm:

1. Start at `target` with `moves = 0` and `doubles = maxDoubles`
2. While `target > 1` and `doubles > 0`:
   - If `target` is odd: it came from increment → `target -= 1`, `moves += 1`
   - If `target` is even: use a double → `target /= 2`, `moves += 1`, `doubles -= 1`
3. Once out of doubles: add `(target - 1)` to moves (need this many increments)
4. Return `moves`

## Optimal Solution

<div class="code-group">

```python
# Time: O(log target) | Space: O(1)
def minMoves(target: int, maxDoubles: int) -> int:
    """
    Calculate minimum moves to reach target starting from 1.
    Using greedy backward approach: work from target down to 1.
    """
    moves = 0
    doubles_remaining = maxDoubles

    # Work backwards from target to 1
    while target > 1 and doubles_remaining > 0:
        if target % 2 == 1:
            # Odd number: must have come from increment operation
            target -= 1
            moves += 1
        else:
            # Even number: optimal to use double if available
            target //= 2  # Integer division
            moves += 1
            doubles_remaining -= 1

    # Once we run out of doubles, we can only use increments
    # Need (target - 1) increments to reach 1 from current target
    moves += (target - 1)

    return moves
```

```javascript
// Time: O(log target) | Space: O(1)
function minMoves(target, maxDoubles) {
  /**
   * Calculate minimum moves to reach target starting from 1.
   * Using greedy backward approach: work from target down to 1.
   */
  let moves = 0;
  let doublesRemaining = maxDoubles;

  // Work backwards from target to 1
  while (target > 1 && doublesRemaining > 0) {
    if (target % 2 === 1) {
      // Odd number: must have come from increment operation
      target -= 1;
      moves += 1;
    } else {
      // Even number: optimal to use double if available
      target /= 2;
      moves += 1;
      doublesRemaining -= 1;
    }
  }

  // Once we run out of doubles, we can only use increments
  // Need (target - 1) increments to reach 1 from current target
  moves += target - 1;

  return moves;
}
```

```java
// Time: O(log target) | Space: O(1)
class Solution {
    public int minMoves(int target, int maxDoubles) {
        /**
         * Calculate minimum moves to reach target starting from 1.
         * Using greedy backward approach: work from target down to 1.
         */
        int moves = 0;
        int doublesRemaining = maxDoubles;

        // Work backwards from target to 1
        while (target > 1 && doublesRemaining > 0) {
            if (target % 2 == 1) {
                // Odd number: must have come from increment operation
                target -= 1;
                moves += 1;
            } else {
                // Even number: optimal to use double if available
                target /= 2;
                moves += 1;
                doublesRemaining -= 1;
            }
        }

        // Once we run out of doubles, we can only use increments
        // Need (target - 1) increments to reach 1 from current target
        moves += (target - 1);

        return moves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log target)

- In the worst case, we use all available doubles
- Each double operation halves the target, so we do at most O(log target) iterations
- Even with many increments (when target is odd), each increment makes the number even, allowing another division
- The final `(target - 1)` addition is O(1)

**Space Complexity:** O(1)

- We only use a constant number of variables: `moves`, `doubles_remaining`, and `target`
- No additional data structures are needed

## Common Mistakes

1. **Trying to solve forward from 1 to target**: This leads to exponential complexity or difficult DP. The backward approach is much simpler because the decisions become deterministic (odd numbers must come from increments).

2. **Forgetting to handle the case when maxDoubles = 0**: When no doubles are allowed, the answer is simply `target - 1` (all increments). Our solution handles this correctly because the while loop won't execute if `doubles_remaining = 0`.

3. **Using floating point division instead of integer division**: In languages like JavaScript, `/` returns a float. We need integer division, which happens automatically in Python's `//` and Java's `/` with integers, but in JavaScript we should use `Math.floor(target / 2)` or rely on the fact that after checking `target % 2 === 0`, dividing by 2 gives an integer.

4. **Not adding `(target - 1)` at the end**: After using all doubles, candidates might forget that we still need to decrement to 1 using increments. This is why we add `target - 1` moves at the end.

## When You'll See This Pattern

This "work backwards" greedy pattern appears in problems where:

- Operations are reversible (increment/decrement, multiply/divide)
- There's a more efficient operation you want to use as much as possible
- Going forward has too many possibilities, but going backward has deterministic choices

Related problems:

1. **Number of Steps to Reduce a Number to Zero (LeetCode 1342)**: Similar backward process—if even, divide by 2; if odd, subtract 1.
2. **Number of Steps to Reduce a Number in Binary Representation to One (LeetCode 1404)**: Work backwards from the binary string, with different rules for odd/even.
3. **Broken Calculator (LeetCode 991)**: Start from target, work backwards to startValue using reverse operations.

## Key Takeaways

1. **When stuck on a forward approach, try working backwards**: If operations are reversible, the backward path might have simpler decision points.

2. **Greedy works when local optimal choices lead to global optimum**: Here, using a double whenever possible (when number is even and doubles remain) is always optimal because it reduces the number faster than multiple increments.

3. **Odd/even analysis is powerful**: Many number transformation problems can be solved by analyzing parity (odd/even) to determine which operation must have been used last.

Related problems: [Number of Steps to Reduce a Number to Zero](/problem/number-of-steps-to-reduce-a-number-to-zero), [Number of Steps to Reduce a Number in Binary Representation to One](/problem/number-of-steps-to-reduce-a-number-in-binary-representation-to-one)
