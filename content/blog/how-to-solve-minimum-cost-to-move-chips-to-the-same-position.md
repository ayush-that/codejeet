---
title: "How to Solve Minimum Cost to Move Chips to The Same Position — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Move Chips to The Same Position. Easy difficulty, 72.8% acceptance rate. Topics: Array, Math, Greedy."
date: "2026-06-14"
category: "dsa-patterns"
tags: ["minimum-cost-to-move-chips-to-the-same-position", "array", "math", "greedy", "easy"]
---

# How to Solve Minimum Cost to Move Chips to The Same Position

You're given an array `position` where `position[i]` represents the location of the `i`-th chip. The challenge: move all chips to the same position with minimum cost. The twist is that moving a chip 2 positions costs nothing, while moving it 1 position costs 1. This creates an interesting parity-based optimization problem where chips at even positions can be moved to any other even position for free, and similarly for odd positions.

## Visual Walkthrough

Let's trace through example `position = [2, 3, 4, 5, 6, 7]`:

**Step 1: Understand the movement rules**

- Chip at position 2 can move to 0, 4, 6... (even positions) for free
- Chip at position 3 can move to 1, 5, 7... (odd positions) for free
- Moving between parity groups (even ↔ odd) costs 1 per chip

**Step 2: Count chips by parity**

- Even positions (2, 4, 6): 3 chips
- Odd positions (3, 5, 7): 3 chips

**Step 3: Choose target position**
We have two options:

1. Move all chips to an even position: Move the 3 odd-position chips to even (cost 1 each) = 3
2. Move all chips to an odd position: Move the 3 even-position chips to odd (cost 1 each) = 3

**Step 4: Find minimum**
Minimum cost = min(3, 3) = 3

The key insight: All chips at even positions can be consolidated to a single even position for free. Same for odd positions. The only cost comes from moving chips between parity groups.

## Brute Force Approach

A naive approach would try every possible target position and calculate the cost to move all chips there:

1. Find the minimum and maximum positions
2. For each possible target position from min to max:
   - Calculate cost = sum of costs to move each chip to target
   - Cost for moving chip from `pos` to `target` = 0 if difference is even, 1 if odd
3. Return the minimum cost found

This approach is inefficient because:

- It examines many unnecessary positions (we only need to consider parity)
- Time complexity is O(n × range) where range could be large
- Most positions will give the same result as others with the same parity

The brute force fails to recognize the parity pattern that makes this problem solvable in O(n) time.

## Optimal Solution

The optimal solution leverages parity mathematics. Since moving 2 positions costs nothing, all chips with the same parity (all even or all odd) can be gathered at a single position for free. The only cost comes from moving chips between parity groups. Therefore:

1. Count how many chips are at even positions
2. Count how many chips are at odd positions
3. The minimum cost is the smaller of these two counts (moving the smaller group to the larger group)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minCostToMoveChips(position):
    """
    Calculate minimum cost to move all chips to same position.

    Args:
        position: List of chip positions

    Returns:
        Minimum cost to consolidate all chips
    """
    # Step 1: Initialize counters for even and odd positioned chips
    even_count = 0
    odd_count = 0

    # Step 2: Count chips by parity (even or odd position)
    for pos in position:
        # If position is even (divisible by 2), increment even_count
        if pos % 2 == 0:
            even_count += 1
        # Otherwise, position is odd, increment odd_count
        else:
            odd_count += 1

    # Step 3: Minimum cost is moving the smaller group to the larger group
    # We can move all chips to either all-even or all-odd positions
    # Cost = number of chips that need to change parity (1 move each)
    return min(even_count, odd_count)
```

```javascript
// Time: O(n) | Space: O(1)
function minCostToMoveChips(position) {
  /**
   * Calculate minimum cost to move all chips to same position.
   *
   * @param {number[]} position - Array of chip positions
   * @return {number} Minimum cost to consolidate all chips
   */

  // Step 1: Initialize counters for even and odd positioned chips
  let evenCount = 0;
  let oddCount = 0;

  // Step 2: Count chips by parity (even or odd position)
  for (let i = 0; i < position.length; i++) {
    const pos = position[i];

    // If position is even (divisible by 2), increment evenCount
    if (pos % 2 === 0) {
      evenCount++;
    }
    // Otherwise, position is odd, increment oddCount
    else {
      oddCount++;
    }
  }

  // Step 3: Minimum cost is moving the smaller group to the larger group
  // We can move all chips to either all-even or all-odd positions
  // Cost = number of chips that need to change parity (1 move each)
  return Math.min(evenCount, oddCount);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minCostToMoveChips(int[] position) {
        /**
         * Calculate minimum cost to move all chips to same position.
         *
         * @param position Array of chip positions
         * @return Minimum cost to consolidate all chips
         */

        // Step 1: Initialize counters for even and odd positioned chips
        int evenCount = 0;
        int oddCount = 0;

        // Step 2: Count chips by parity (even or odd position)
        for (int i = 0; i < position.length; i++) {
            int pos = position[i];

            // If position is even (divisible by 2), increment evenCount
            if (pos % 2 == 0) {
                evenCount++;
            }
            // Otherwise, position is odd, increment oddCount
            else {
                oddCount++;
            }
        }

        // Step 3: Minimum cost is moving the smaller group to the larger group
        // We can move all chips to either all-even or all-odd positions
        // Cost = number of chips that need to change parity (1 move each)
        return Math.min(evenCount, oddCount);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the `position` array once to count chips by parity
- Each iteration performs constant-time operations (modulo check and increment)
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only use two integer variables (`even_count` and `odd_count`) regardless of input size
- No additional data structures that scale with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Overcomplicating with position ranges**: Some candidates try to find the actual target position or calculate costs for each possible position. Remember: the problem only asks for minimum cost, not the actual position. The parity insight eliminates the need to consider specific positions.

2. **Misunderstanding the cost calculation**: The mistake of thinking "moving 2 positions costs 0, so moving 3 positions should cost 1 (2+1)" is correct, but some try to optimize pathfinding. The key is recognizing that any even-distance move is free, so parity is all that matters.

3. **Forgetting to handle edge cases**:
   - Single chip: cost should be 0 (already at target)
   - All chips same parity: cost should be 0 (can consolidate for free)
   - Empty array: technically not in constraints but worth considering
     Our solution handles all these correctly since `min(even_count, odd_count)` gives 0 when one count is 0.

4. **Using bitwise AND incorrectly**: While `pos & 1` is faster than `pos % 2` for checking parity, some candidates write `pos & 1 == 0` without parentheses, which evaluates as `pos & (1 == 0)` due to operator precedence. Always use `(pos & 1) == 0` or stick with modulo for clarity.

## When You'll See This Pattern

This problem teaches **parity-based optimization** and **cost normalization**. Similar patterns appear in:

1. **Minimum Number of Operations to Move All Balls to Each Box (LeetCode 1769)**: While more complex, it also involves calculating movement costs with specific rules. The thinking process of "what operations are cheap vs expensive" is similar.

2. **Split With Minimum Sum (LeetCode 2578)**: Involves separating digits into two groups to minimize sum, using sorting and positional reasoning.

3. **Bulb Switcher (LeetCode 319)**: Another parity-based problem where the final state depends on how many times a bulb is toggled (odd vs even).

4. **Array partitioning problems**: Many problems become simpler when you realize certain operations preserve parity or other invariants.

## Key Takeaways

1. **Look for operation invariants**: When operations have special cases (like free moves), identify what properties they preserve. Here, moving 2 positions preserves parity, so chips can't change parity for free.

2. **Cost normalization**: Complex cost rules can often be simplified. Moving any even distance = free, moving any odd distance = 1 cost. This reduces the problem to counting by parity.

3. **Minimum of two clear options**: When you have symmetric choices (move evens to odds or odds to evens), the answer is simply the minimum count between the two groups.

The core insight: **All chips of the same parity are effectively already together for free. The only cost is bridging the parity gap.**

Related problems: [Minimum Number of Operations to Move All Balls to Each Box](/problem/minimum-number-of-operations-to-move-all-balls-to-each-box), [Split With Minimum Sum](/problem/split-with-minimum-sum)
