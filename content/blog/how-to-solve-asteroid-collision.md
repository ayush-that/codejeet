---
title: "How to Solve Asteroid Collision — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Asteroid Collision. Medium difficulty, 47.2% acceptance rate. Topics: Array, Stack, Simulation."
date: "2026-10-22"
category: "dsa-patterns"
tags: ["asteroid-collision", "array", "stack", "simulation", "medium"]
---

# How to Solve Asteroid Collision

This problem asks us to simulate collisions between asteroids moving in a row. Each asteroid has a size (absolute value) and direction (sign: positive moves right, negative moves left). When two asteroids collide, the smaller one explodes. If they're equal size, both explode. The tricky part is that collisions only happen when a right-moving asteroid (positive) is to the left of a left-moving asteroid (negative) — they're moving toward each other. After one collision, the surviving asteroid might collide with others further down the line, creating a chain reaction.

## Visual Walkthrough

Let's trace through `asteroids = [5, 10, -5]` step by step:

1. **Start**: `[5, 10, -5]`
   - First asteroid: `5` (right-moving, size 5)
   - Second asteroid: `10` (right-moving, size 10)
   - Third asteroid: `-5` (left-moving, size 5)

2. **Check for collisions**:
   - `5` and `10`: Both moving right → no collision (they'll never meet)
   - `10` and `-5`: Right-moving `10` is left of left-moving `-5` → COLLISION!
3. **Resolve collision**:
   - Compare sizes: `10` vs `5`
   - `10 > 5`, so `-5` explodes
   - Result: `[5, 10]`

4. **Check again**:
   - `5` and `10`: Both moving right → no collision
   - Final result: `[5, 10]`

Now let's try a more complex example: `asteroids = [8, -8]`

1. **Start**: `[8, -8]`
   - `8` (right-moving, size 8)
   - `-8` (left-moving, size 8)

2. **Check for collision**:
   - Right-moving `8` is left of left-moving `-8` → COLLISION!

3. **Resolve collision**:
   - Compare sizes: `8` vs `8`
   - Equal sizes → both explode
   - Result: `[]`

The key insight: collisions can create chain reactions. For example, in `[10, 2, -5]`:

- `2` and `-5` collide first → `2` explodes
- Then `10` and `-5` collide → `-5` explodes
- Final result: `[10]`

## Brute Force Approach

A naive approach would repeatedly scan the array, looking for adjacent asteroids that are colliding, resolving the collision, and then starting over. This is essentially bubble-sort style collision resolution:

1. Scan left to right
2. Whenever you find `asteroids[i] > 0` and `asteroids[i+1] < 0` (collision condition):
   - Compare absolute values
   - Remove the smaller asteroid (or both if equal)
3. Repeat until no collisions occur

**Why this fails:**

- Worst-case time complexity: O(n²) — consider `[1, 2, 3, 4, -5]` where the `-5` destroys all positive asteroids one by one from right to left
- Each removal from an array is O(n) due to shifting elements
- The repeated scans make this extremely inefficient for large inputs

While we could implement this, it's clearly not optimal. The problem constraints (up to 10⁴ asteroids) make O(n²) solutions potentially too slow.

## Optimized Approach

The key insight is that we need to track asteroids that are still "active" and might collide with future asteroids. This is a perfect use case for a **stack**:

1. Process asteroids one by one from left to right
2. For each asteroid:
   - If it's moving right (positive), just push it onto the stack — it might collide with a future left-moving asteroid
   - If it's moving left (negative), it needs to check for collisions with asteroids already on the stack (which are to its left)
3. When we encounter a left-moving asteroid:
   - Compare it with the top of the stack (if the stack has a right-moving asteroid)
   - If the stack asteroid is smaller, it explodes (pop from stack) and we continue checking
   - If they're equal, both explode (pop from stack and don't add current)
   - If the stack asteroid is larger, current asteroid explodes (don't add it)
   - If stack is empty or top is negative, no collision — push current asteroid

**Why a stack works:**

- Asteroids only interact with their immediate neighbors in the "collision chain"
- The LIFO (Last-In, First-Out) property lets us handle chain reactions naturally
- We only need to compare with the most recent right-moving asteroid that hasn't been destroyed

Think of the stack as representing asteroids that are still "in play" and moving to the right, waiting to potentially collide with future left-moving asteroids.

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def asteroidCollision(asteroids):
    """
    Simulate asteroid collisions using a stack.

    Args:
        asteroids: List[int] - asteroids with sign indicating direction

    Returns:
        List[int] - remaining asteroids after all collisions
    """
    stack = []

    for asteroid in asteroids:
        # Current asteroid is moving left (negative)
        # It can only collide with right-moving asteroids (positive) on the stack
        while stack and asteroid < 0 < stack[-1]:
            # Collision occurs: right-moving asteroid on stack vs left-moving current

            if abs(asteroid) > stack[-1]:
                # Current asteroid is larger, destroys the one on stack
                stack.pop()
                # Continue checking with next asteroid on stack
                continue
            elif abs(asteroid) == stack[-1]:
                # Both asteroids are equal size, both explode
                stack.pop()
                # Current asteroid also explodes, so we break
                break
            else:
                # Current asteroid is smaller, it explodes
                # Don't add it to stack
                break
        else:
            # This else executes if while loop completes normally (no break)
            # Add asteroid to stack if:
            # 1. It's moving right (positive)
            # 2. It's moving left but stack is empty
            # 3. It's moving left and top of stack is also moving left
            stack.append(asteroid)

    return stack
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Simulate asteroid collisions using a stack.
 *
 * @param {number[]} asteroids - asteroids with sign indicating direction
 * @return {number[]} - remaining asteroids after all collisions
 */
function asteroidCollision(asteroids) {
  const stack = [];

  for (let asteroid of asteroids) {
    // Current asteroid is moving left (negative)
    // It can only collide with right-moving asteroids (positive) on the stack
    while (stack.length > 0 && asteroid < 0 && stack[stack.length - 1] > 0) {
      // Collision occurs: right-moving asteroid on stack vs left-moving current

      if (Math.abs(asteroid) > stack[stack.length - 1]) {
        // Current asteroid is larger, destroys the one on stack
        stack.pop();
        // Continue checking with next asteroid on stack
        continue;
      } else if (Math.abs(asteroid) === stack[stack.length - 1]) {
        // Both asteroids are equal size, both explode
        stack.pop();
        // Current asteroid also explodes, so we break
        asteroid = null; // Mark as destroyed
        break;
      } else {
        // Current asteroid is smaller, it explodes
        // Don't add it to stack
        asteroid = null; // Mark as destroyed
        break;
      }
    }

    // Add asteroid to stack if it wasn't destroyed
    if (asteroid !== null) {
      stack.push(asteroid);
    }
  }

  return stack;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Simulate asteroid collisions using a stack.
     *
     * @param asteroids - asteroids with sign indicating direction
     * @return remaining asteroids after all collisions
     */
    public int[] asteroidCollision(int[] asteroids) {
        Stack<Integer> stack = new Stack<>();

        for (int asteroid : asteroids) {
            // Current asteroid is moving left (negative)
            // It can only collide with right-moving asteroids (positive) on the stack
            while (!stack.isEmpty() && asteroid < 0 && stack.peek() > 0) {
                // Collision occurs: right-moving asteroid on stack vs left-moving current

                if (Math.abs(asteroid) > stack.peek()) {
                    // Current asteroid is larger, destroys the one on stack
                    stack.pop();
                    // Continue checking with next asteroid on stack
                    continue;
                } else if (Math.abs(asteroid) == stack.peek()) {
                    // Both asteroids are equal size, both explode
                    stack.pop();
                    // Current asteroid also explodes, so we break
                    asteroid = 0; // Mark as destroyed
                    break;
                } else {
                    // Current asteroid is smaller, it explodes
                    // Don't add it to stack
                    asteroid = 0; // Mark as destroyed
                    break;
                }
            }

            // Add asteroid to stack if it wasn't destroyed
            if (asteroid != 0) {
                stack.push(asteroid);
            }
        }

        // Convert stack to array (in correct order)
        int[] result = new int[stack.size()];
        for (int i = result.length - 1; i >= 0; i--) {
            result[i] = stack.pop();
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each asteroid exactly once
- Each asteroid is pushed onto the stack at most once
- Each asteroid is popped from the stack at most once
- Even with the while loop inside the for loop, the total operations are O(n) because each asteroid can only cause a bounded number of comparisons

**Space Complexity: O(n)**

- In the worst case, no asteroids collide (e.g., all moving right or all moving left)
- The stack could store all n asteroids
- Average case is also O(n) but with a smaller constant

## Common Mistakes

1. **Wrong collision condition**: Some candidates check for any opposite signs, but collisions only happen when a positive asteroid is to the left of a negative asteroid. Two negative asteroids moving left won't collide (they're moving in the same direction away from each other).

2. **Forgetting chain reactions**: After a collision, the surviving asteroid might collide with others. This is why we need the while loop inside the for loop, not just a simple if statement.

3. **Array manipulation inefficiency**: Trying to modify the input array in-place with removals leads to O(n²) time due to shifting elements. Always use a stack or similar data structure.

4. **Edge case handling**: Missing cases like:
   - Empty input array
   - All asteroids moving in the same direction
   - Equal-sized asteroids (both should explode)
   - Large negative asteroid destroying multiple smaller positives

## When You'll See This Pattern

The stack-based collision resolution pattern appears in problems where elements interact based on certain conditions and these interactions can create chain reactions:

1. **Daily Temperatures (LeetCode 739)** - Uses a monotonic stack to find next warmer temperature
2. **Next Greater Element I (LeetCode 496)** - Stack helps find the next greater element
3. **Remove All Adjacent Duplicates In String (LeetCode 1047)** - Similar "collision" concept where adjacent duplicates cancel each other
4. **Evaluate Reverse Polish Notation (LeetCode 150)** - Stack handles operations on the most recent operands

The common theme: when you need to process elements sequentially and the result depends on interactions with recently seen elements, a stack is often the right choice.

## Key Takeaways

1. **Stack for sequential dependencies**: When processing elements where each new element interacts primarily with the most recent unmatched elements, think "stack."

2. **Collision problems are often stack problems**: Any problem involving "canceling out" or "colliding" elements based on certain rules (especially if chain reactions occur) likely needs a stack.

3. **Simulate, don't overthink**: For simulation problems, walk through examples step by step to understand the interaction rules before coding. The stack implementation often follows naturally from the simulation.

Remember: Positive asteroids moving right get pushed onto the stack. Negative asteroids moving left trigger collision checks with the stack. The while loop handles chain reactions until the current asteroid is destroyed or all potential collisions are resolved.

Related problems: [Can Place Flowers](/problem/can-place-flowers), [Destroying Asteroids](/problem/destroying-asteroids), [Count Collisions on a Road](/problem/count-collisions-on-a-road)
