---
title: "How to Solve Minimum Time to Type Word Using Special Typewriter — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Time to Type Word Using Special Typewriter. Easy difficulty, 78.4% acceptance rate. Topics: String, Greedy."
date: "2028-03-03"
category: "dsa-patterns"
tags: ["minimum-time-to-type-word-using-special-typewriter", "string", "greedy", "easy"]
---

# How to Solve Minimum Time to Type Word Using Special Typewriter

This problem asks us to calculate the minimum time required to type a given word using a circular keyboard where the pointer starts at 'a'. The twist is that the keyboard is arranged in a circle, so moving from one letter to another can be done in two directions: clockwise or counter-clockwise. The interesting part is determining which direction gives the shorter distance for each character transition.

## Visual Walkthrough

Let's trace through the example `word = "abc"` step by step:

1. **Initial state**: Pointer at 'a', time = 0
2. **Type 'a'**: Pointer already at 'a', so:
   - Move distance = 0 (no movement needed)
   - Type time = 1 second
   - Total time = 0 + 1 = 1
3. **Move from 'a' to 'b'**:
   - Clockwise distance: 'a' → 'b' = 1 step
   - Counter-clockwise distance: 'a' → 'z' → 'y' → ... → 'b' = 25 steps
   - Choose minimum: min(1, 25) = 1
   - Type 'b': +1 second
   - Total time = 1 + 1 + 1 = 3
4. **Move from 'b' to 'c'**:
   - Clockwise: 'b' → 'c' = 1 step
   - Counter-clockwise: 'b' → 'a' → 'z' → ... → 'c' = 25 steps
   - Choose minimum: min(1, 25) = 1
   - Type 'c': +1 second
   - Total time = 3 + 1 + 1 = 5

So for "abc", the answer is 5 seconds.

Let's try a more interesting example: `word = "zab"`:

1. Start at 'a', type 'z':
   - Clockwise: 'a' → 'b' → ... → 'z' = 25 steps
   - Counter-clockwise: 'a' → 'z' = 1 step
   - Choose min(25, 1) = 1
   - Time = 0 + 1 + 1 = 2
2. Move from 'z' to 'a':
   - Clockwise: 'z' → 'a' = 1 step
   - Counter-clockwise: 'z' → 'y' → ... → 'a' = 25 steps
   - Choose min(1, 25) = 1
   - Time = 2 + 1 + 1 = 4
3. Move from 'a' to 'b':
   - Clockwise: 'a' → 'b' = 1 step
   - Counter-clockwise: 'a' → 'z' → ... → 'b' = 25 steps
   - Choose min(1, 25) = 1
   - Time = 4 + 1 + 1 = 6

The pattern is clear: for each character transition, we need to find the minimum circular distance between two letters.

## Brute Force Approach

A naive approach might try to simulate all possible movement sequences, but that's unnecessary. The brute force thinking would be: "For each character, try moving clockwise until we find it, then try moving counter-clockwise until we find it." But we don't need to simulate the actual movement - we can calculate the distance mathematically.

What some candidates might incorrectly try is always moving clockwise or always moving the shortest absolute difference without considering the circular nature. For example, they might calculate `abs(ord('a') - ord('z')) = 25` when the actual shortest distance is 1 (going backward from 'a' to 'z').

The key insight is that on a circle of 26 letters, the distance between two points can be calculated in two ways, and we always take the minimum.

## Optimal Solution

The optimal solution is straightforward once we understand the circular distance calculation. For each character in the word:

1. Calculate the absolute difference between current and target positions
2. The clockwise distance is this absolute difference
3. The counter-clockwise distance is `26 - clockwise_distance`
4. Take the minimum of these two distances
5. Add 1 for the typing time
6. Update current position to the typed character

<div class="code-group">

```python
# Time: O(n) where n is length of word | Space: O(1)
def minTimeToType(word: str) -> int:
    # Start with pointer at 'a' (position 0 in 0-indexed alphabet)
    current_pos = 0
    total_time = 0

    for char in word:
        # Convert character to 0-indexed position (a=0, b=1, ..., z=25)
        target_pos = ord(char) - ord('a')

        # Calculate absolute difference between current and target positions
        diff = abs(target_pos - current_pos)

        # On a circle, we can go clockwise or counter-clockwise
        # Clockwise distance is 'diff'
        # Counter-clockwise distance is 26 - diff
        # We take the minimum of these two
        move_time = min(diff, 26 - diff)

        # Add move time and typing time (1 second)
        total_time += move_time + 1

        # Update current position for next character
        current_pos = target_pos

    return total_time
```

```javascript
// Time: O(n) where n is length of word | Space: O(1)
function minTimeToType(word) {
  // Start with pointer at 'a' (position 0 in 0-indexed alphabet)
  let currentPos = 0;
  let totalTime = 0;

  for (let i = 0; i < word.length; i++) {
    // Convert character to 0-indexed position (a=0, b=1, ..., z=25)
    const targetPos = word.charCodeAt(i) - "a".charCodeAt(0);

    // Calculate absolute difference between current and target positions
    const diff = Math.abs(targetPos - currentPos);

    // On a circle, we can go clockwise or counter-clockwise
    // Clockwise distance is 'diff'
    // Counter-clockwise distance is 26 - diff
    // We take the minimum of these two
    const moveTime = Math.min(diff, 26 - diff);

    // Add move time and typing time (1 second)
    totalTime += moveTime + 1;

    // Update current position for next character
    currentPos = targetPos;
  }

  return totalTime;
}
```

```java
// Time: O(n) where n is length of word | Space: O(1)
class Solution {
    public int minTimeToType(String word) {
        // Start with pointer at 'a' (position 0 in 0-indexed alphabet)
        int currentPos = 0;
        int totalTime = 0;

        for (int i = 0; i < word.length(); i++) {
            // Convert character to 0-indexed position (a=0, b=1, ..., z=25)
            int targetPos = word.charAt(i) - 'a';

            // Calculate absolute difference between current and target positions
            int diff = Math.abs(targetPos - currentPos);

            // On a circle, we can go clockwise or counter-clockwise
            // Clockwise distance is 'diff'
            // Counter-clockwise distance is 26 - diff
            // We take the minimum of these two
            int moveTime = Math.min(diff, 26 - diff);

            // Add move time and typing time (1 second)
            totalTime += moveTime + 1;

            // Update current position for next character
            currentPos = targetPos;
        }

        return totalTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input word. We process each character exactly once, performing constant-time operations for each character (arithmetic calculations and comparisons).

**Space Complexity: O(1)**. We only use a fixed number of variables regardless of input size: `current_pos`, `total_time`, `target_pos`, and `diff`. No additional data structures that grow with input size are used.

The constant factors are very small: for each character, we perform:

- One character to position conversion
- One absolute difference calculation
- One minimum operation between two values
- Two additions
- One assignment

## Common Mistakes

1. **Forgetting to add typing time**: Some candidates calculate only the movement time and forget that typing each character takes 1 second. Always remember: move + type = total for each character.

2. **Incorrect circular distance calculation**: The most common error is using only the absolute difference without considering the circular nature. For example, calculating distance from 'a' to 'z' as 25 instead of 1. Remember: `min(diff, 26 - diff)` gives the shortest circular distance.

3. **Not updating current position**: After typing a character, the pointer moves to that character. If you forget to update `current_pos`, all subsequent distance calculations will be wrong.

4. **Off-by-one with character positions**: When converting characters to positions, remember that 'a' should be 0, not 1. Using 1-based indexing complicates the circular distance calculation. Stick with 0-indexed positions for cleaner math.

## When You'll See This Pattern

This problem uses **circular array/distance calculation** and **greedy choice** patterns:

1. **Circular buffer problems**: Any problem involving circular structures (circular arrays, circular queues, circular linked lists) uses similar distance calculations. The key insight is that distance on a circle can be calculated in two directions.

2. **Minimum distance problems**: Problems like [1893. Check if All the Integers in a Range Are Covered](https://leetcode.com/problems/check-if-all-the-integers-in-a-range-are-covered/) use similar interval/distance calculations.

3. **Greedy choice problems**: This is a classic greedy algorithm - at each step, we make the locally optimal choice (shortest distance to next character), which leads to the globally optimal solution. Similar greedy patterns appear in problems like [122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/).

The circular distance calculation pattern specifically appears in problems where you have a fixed set of items arranged in a circle and need to find shortest paths between them.

## Key Takeaways

1. **Circular distance formula**: For items arranged in a circle of size N, the shortest distance between positions i and j is `min(abs(i-j), N - abs(i-j))`. This is a reusable pattern for any circular arrangement problem.

2. **Greedy works for local decisions**: When each decision (which way to move) doesn't affect future decisions beyond updating your current state, a greedy approach often works. Here, choosing the shortest path to each next character is always optimal.

3. **Track state carefully**: The only state that matters between characters is the current pointer position. Keeping this updated correctly is crucial for the algorithm to work.

Related problems: [Minimum Distance to Type a Word Using Two Fingers](/problem/minimum-distance-to-type-a-word-using-two-fingers)
