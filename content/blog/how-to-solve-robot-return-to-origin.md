---
title: "How to Solve Robot Return to Origin — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Robot Return to Origin. Easy difficulty, 76.5% acceptance rate. Topics: String, Simulation."
date: "2027-04-13"
category: "dsa-patterns"
tags: ["robot-return-to-origin", "string", "simulation", "easy"]
---

# How to Solve Robot Return to Origin

At first glance, this problem seems trivial: track a robot's movement and check if it returns to the starting point. What makes it interesting is that we don't actually need to simulate every step or track the robot's entire path—we only need to know the net displacement. This teaches an important optimization pattern: when you only care about the final state, you can often avoid maintaining intermediate states.

## Visual Walkthrough

Let's trace through an example: `moves = "UDLR"`

1. **Starting position**: (0, 0)
2. **First move 'U'**: Move up → (0, 1)
3. **Second move 'D'**: Move down → (0, 0)
4. **Third move 'L'**: Move left → (-1, 0)
5. **Fourth move 'R'**: Move right → (0, 0)

The robot ends at (0, 0), so the function should return `true`.

Notice something important: the 'U' and 'D' canceled each other out, as did the 'L' and 'R'. This cancellation is the key insight—we don't need to track the actual coordinates at each step, just the net vertical and horizontal displacement.

## Brute Force Approach

A naive approach would be to simulate the robot's exact path step by step:

1. Initialize `x = 0` and `y = 0`
2. For each character in `moves`:
   - If 'U': `y += 1`
   - If 'D': `y -= 1`
   - If 'L': `x -= 1`
   - If 'R': `x += 1`
3. Check if `x == 0` and `y == 0`

Wait—this isn't actually "brute force" in the sense of being inefficient. It's already optimal! The interesting part is that some candidates might overcomplicate this by:

- Using a stack or queue to track moves
- Creating a 2D grid and marking visited positions
- Using complex data structures when simple counters suffice

The "brute force" thinking here would be to actually simulate the path in a way that tracks more information than needed. For example, storing every position visited instead of just the current position.

## Optimal Solution

The optimal solution uses two counters: one for vertical movement and one for horizontal movement. Each 'U' increments the vertical counter, each 'D' decrements it. Similarly, 'L' decrements the horizontal counter and 'R' increments it. If both counters end at zero, the robot has returned to the origin.

<div class="code-group">

```python
# Time: O(n) where n is the length of moves
# Space: O(1) - we only use two integer variables
def judgeCircle(moves: str) -> bool:
    # Initialize counters for vertical and horizontal movement
    vertical = 0  # Tracks net up/down movement
    horizontal = 0  # Tracks net left/right movement

    # Process each move in the sequence
    for move in moves:
        if move == 'U':
            vertical += 1  # Moving up increases vertical coordinate
        elif move == 'D':
            vertical -= 1  # Moving down decreases vertical coordinate
        elif move == 'L':
            horizontal -= 1  # Moving left decreases horizontal coordinate
        elif move == 'R':
            horizontal += 1  # Moving right increases horizontal coordinate

    # Robot returns to origin if both net movements are zero
    return vertical == 0 and horizontal == 0
```

```javascript
// Time: O(n) where n is the length of moves
// Space: O(1) - we only use two integer variables
function judgeCircle(moves) {
  // Initialize counters for vertical and horizontal movement
  let vertical = 0; // Tracks net up/down movement
  let horizontal = 0; // Tracks net left/right movement

  // Process each move in the sequence
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move === "U") {
      vertical += 1; // Moving up increases vertical coordinate
    } else if (move === "D") {
      vertical -= 1; // Moving down decreases vertical coordinate
    } else if (move === "L") {
      horizontal -= 1; // Moving left decreases horizontal coordinate
    } else if (move === "R") {
      horizontal += 1; // Moving right increases horizontal coordinate
    }
  }

  // Robot returns to origin if both net movements are zero
  return vertical === 0 && horizontal === 0;
}
```

```java
// Time: O(n) where n is the length of moves
// Space: O(1) - we only use two integer variables
class Solution {
    public boolean judgeCircle(String moves) {
        // Initialize counters for vertical and horizontal movement
        int vertical = 0;  // Tracks net up/down movement
        int horizontal = 0;  // Tracks net left/right movement

        // Process each move in the sequence
        for (int i = 0; i < moves.length(); i++) {
            char move = moves.charAt(i);
            if (move == 'U') {
                vertical += 1;  // Moving up increases vertical coordinate
            } else if (move == 'D') {
                vertical -= 1;  // Moving down decreases vertical coordinate
            } else if (move == 'L') {
                horizontal -= 1;  // Moving left decreases horizontal coordinate
            } else if (move == 'R') {
                horizontal += 1;  // Moving right increases horizontal coordinate
            }
        }

        // Robot returns to origin if both net movements are zero
        return vertical == 0 && horizontal == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the `moves` string exactly once
- Each character requires constant-time processing (just increment/decrement operations)
- `n` is the length of the input string

**Space Complexity: O(1)**

- We only use two integer variables (`vertical` and `horizontal`)
- No additional data structures that grow with input size
- The input string is provided and doesn't count toward our space usage

## Common Mistakes

1. **Overcomplicating with data structures**: Some candidates use arrays, stacks, or hash maps when simple counters suffice. Remember: if you only need to track counts or net values, integers are usually sufficient.

2. **Forgetting to handle empty string**: An empty move sequence means the robot never moves, so it's still at the origin. Our solution handles this correctly since both counters start at 0 and the loop doesn't execute.

3. **Incorrect counter logic**: Mixing up which direction increments vs. decrements. A good mnemonic: think of the coordinate plane—up increases y, down decreases y, right increases x, left decreases x.

4. **Not considering case sensitivity**: The problem specifies uppercase letters, but in interviews, always clarify if input could have lowercase. Our solution assumes uppercase as specified.

## When You'll See This Pattern

This "net displacement" or "counter balancing" pattern appears in many problems:

1. **Valid Parentheses (LeetCode 20)**: Instead of tracking the exact position in a string, we use a counter that increments for '(' and decrements for ')'. If the counter ever goes negative or doesn't end at 0, the parentheses are invalid.

2. **Find the Difference (LeetCode 389)**: Find the extra character in a shuffled string. Instead of comparing full strings, use character counts—the net difference in counts reveals the extra character.

3. **Furthest Point From Origin (LeetCode 2833)**: A variation where 'L' and 'R' cancel, but '\_' can be either. The pattern is similar but with an additional optimization for wildcards.

The core insight is recognizing when you can reduce a problem to tracking net changes rather than maintaining complete state information.

## Key Takeaways

1. **Look for cancellation effects**: When opposite actions cancel each other out (like U/D or L/R), you can often use counters instead of tracking full state.

2. **Consider what you actually need**: We only needed the final position, not the path. Always ask: "What's the minimal information needed to solve this problem?"

3. **Simple problems teach fundamental patterns**: Even easy problems like this one demonstrate important optimization techniques that scale to harder problems.

**Related problems**: [Number of Provinces](/problem/number-of-provinces), [Execution of All Suffix Instructions Staying in a Grid](/problem/execution-of-all-suffix-instructions-staying-in-a-grid), [Furthest Point From Origin](/problem/furthest-point-from-origin)
