---
title: "How to Solve Last Moment Before All Ants Fall Out of a Plank — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Last Moment Before All Ants Fall Out of a Plank. Medium difficulty, 68.2% acceptance rate. Topics: Array, Brainteaser, Simulation."
date: "2027-06-26"
category: "dsa-patterns"
tags:
  [
    "last-moment-before-all-ants-fall-out-of-a-plank",
    "array",
    "brainteaser",
    "simulation",
    "medium",
  ]
---

# How to Solve Last Moment Before All Ants Fall Out of a Plank

This problem asks us to find the last moment before all ants fall off a wooden plank of length `n`, given arrays of ants moving left and right. The tricky part is that when two ants meet, they instantly turn around — but this behavior doesn't actually affect the outcome, which is the key insight needed for an efficient solution.

## Visual Walkthrough

Let's trace through a concrete example: `n = 4`, `left = [4, 3]`, `right = [0, 1]`

We have a plank from position 0 to position 4:

- Ant at position 4 moving left (will fall off immediately at time 0)
- Ant at position 3 moving left (needs 3 seconds to reach left end)
- Ant at position 0 moving right (needs 4 seconds to reach right end)
- Ant at position 1 moving right (needs 3 seconds to reach right end)

Now consider what happens when ants meet. At time 0.5:

- Ant from position 1 (right-moving) and ant from position 3 (left-moving) would meet around position 2
- They instantly turn around: the left-moving ant becomes right-moving, and vice versa

But here's the key insight: **After they turn around, the ant that was originally at position 1 is now moving left from position ~2, and the ant that was originally at position 3 is now moving right from position ~2.**

Think about their destinations:

- The ant originally at position 1 needs to travel from ~2 to 0 = 2 units left
- The ant originally at position 3 needs to travel from ~2 to 4 = 2 units right

If they had just passed through each other without turning:

- The ant from position 1 would continue right to position 4 = 3 units
- The ant from position 3 would continue left to position 0 = 3 units

Wait, those distances are different! Let me correct this:

Actually, when ants meet and turn around, it's equivalent to them passing through each other. The ant that started at position 1 (moving right) will eventually fall off at the right end, taking the path that the ant from position 3 would have taken if they hadn't met. Similarly, the ant from position 3 will fall off at the left end, taking the path of the ant from position 1.

So the maximum time is simply: **max(distance for left-moving ants to reach left end, distance for right-moving ants to reach right end)**.

For our example:

- Left-moving ants: positions 4 and 3 → distances to left end: 4 and 3 → max = 4
- Right-moving ants: positions 0 and 1 → distances to right end: 4 and 3 → max = 4

So the answer is 4.

## Brute Force Approach

A naive approach would simulate the ants' movements step by step. At each time unit:

1. Update all ant positions based on their direction
2. Check for collisions and reverse directions of colliding ants
3. Check if any ants have fallen off (position < 0 or position > n)
4. Continue until all ants have fallen off

This simulation approach has several problems:

1. **Time complexity**: Could be O(n × number_of_ants) in worst case
2. **Floating point issues**: Ants could meet between integer positions
3. **Implementation complexity**: Handling collisions precisely is tricky

The simulation quickly becomes infeasible for large `n` or many ants.

## Optimized Approach

The key insight is that **when two ants meet and turn around, it's indistinguishable from them passing through each other**. Here's why:

Consider two ants A and B moving toward each other. When they meet and turn around:

- Ant A continues in B's original direction
- Ant B continues in A's original direction
- From an external perspective, it looks like they just passed through each other

This means:

1. The order of ants along the plank doesn't change (though their identities might swap)
2. Each ant will still fall off at the same time as if it had continued in its original direction
3. The last ant to fall off will be either:
   - A left-moving ant that started farthest from the left end
   - A right-moving ant that started farthest from the right end

Therefore, the solution reduces to:

- For left-moving ants: find maximum distance to left end (which is just their position)
- For right-moving ants: find maximum distance to right end (which is `n - position`)
- Take the maximum of these two values

## Optimal Solution

<div class="code-group">

```python
# Time: O(L + R) where L = len(left), R = len(right)
# Space: O(1)
def getLastMoment(n, left, right):
    """
    Calculate the last moment before all ants fall off the plank.

    Args:
        n: Length of the plank
        left: List of positions of ants moving left
        right: List of positions of ants moving right

    Returns:
        The last moment when any ant is still on the plank
    """
    # Initialize maximum time to 0
    max_time = 0

    # For ants moving left: the time to fall is their current position
    # (distance to left end at position 0)
    for pos in left:
        # The ant at position 'pos' needs 'pos' seconds to reach left end
        max_time = max(max_time, pos)

    # For ants moving right: the time to fall is (n - position)
    # (distance to right end at position n)
    for pos in right:
        # The ant at position 'pos' needs 'n - pos' seconds to reach right end
        max_time = max(max_time, n - pos)

    return max_time
```

```javascript
// Time: O(L + R) where L = left.length, R = right.length
// Space: O(1)
function getLastMoment(n, left, right) {
  /**
   * Calculate the last moment before all ants fall off the plank.
   *
   * @param {number} n - Length of the plank
   * @param {number[]} left - Positions of ants moving left
   * @param {number[]} right - Positions of ants moving right
   * @return {number} The last moment when any ant is still on the plank
   */
  let maxTime = 0;

  // Process left-moving ants: time to fall = current position
  for (const pos of left) {
    // Distance to left end (position 0) is just the position value
    maxTime = Math.max(maxTime, pos);
  }

  // Process right-moving ants: time to fall = n - position
  for (const pos of right) {
    // Distance to right end (position n) is n minus current position
    maxTime = Math.max(maxTime, n - pos);
  }

  return maxTime;
}
```

```java
// Time: O(L + R) where L = left.length, R = right.length
// Space: O(1)
class Solution {
    public int getLastMoment(int n, int[] left, int[] right) {
        /**
         * Calculate the last moment before all ants fall off the plank.
         *
         * @param n Length of the plank
         * @param left Positions of ants moving left
         * @param right Positions of ants moving right
         * @return The last moment when any ant is still on the plank
         */
        int maxTime = 0;

        // For left-moving ants: time = distance to left end (position 0)
        for (int pos : left) {
            // Ant at position 'pos' needs 'pos' seconds to reach left end
            maxTime = Math.max(maxTime, pos);
        }

        // For right-moving ants: time = distance to right end (position n)
        for (int pos : right) {
            // Ant at position 'pos' needs 'n - pos' seconds to reach right end
            maxTime = Math.max(maxTime, n - pos);
        }

        return maxTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(L + R)**

- We iterate through all left-moving ants once: O(L)
- We iterate through all right-moving ants once: O(R)
- Each iteration performs constant-time operations (comparison and subtraction)
- Total: O(L + R)

**Space Complexity: O(1)**

- We only use a few integer variables (`max_time`, loop counters)
- No additional data structures that scale with input size
- The input arrays are given and not counted toward our space usage

## Common Mistakes

1. **Overcomplicating with simulation**: Many candidates try to simulate the ants' movements step by step, which is both inefficient and error-prone. The key is recognizing the "passing through" equivalence.

2. **Off-by-one errors with plank length**: The plank goes from position 0 to position `n`. An ant at position `n` moving left falls off immediately (time 0), not time 1. Similarly, an ant at position 0 moving right falls off immediately.

3. **Missing edge cases**:
   - Empty arrays (no left-moving or no right-moving ants)
   - All ants at the ends (should return 0)
   - Single ant cases
     Always test: `n=0`, `left=[]`, `right=[]`, `left=[0]`, `right=[n]`

4. **Incorrect distance calculation**: For right-moving ants, the distance to the right end is `n - position`, not `position`. Mixing these up gives wrong answers.

## When You'll See This Pattern

This "collisions don't matter" pattern appears in several physics-inspired coding problems:

1. **Count Collisions on a Road (Medium)**: Cars moving left/right on a road, similar collision rules. The insight is that after collisions, cars become stationary, changing the dynamics.

2. **Movement of Robots (Medium)**: Robots moving on a line, passing through each other when they meet. Direct application of the same "passing through" insight.

3. **Gas Station problems**: Not exactly the same, but similar in analyzing movement along a line with constraints.

The pattern to recognize: **When entities interact in a symmetric way (like ants turning around), look for conservation laws or equivalence transformations that simplify the problem.**

## Key Takeaways

1. **Look for physical symmetries**: When collisions cause symmetric behavior (ants turning around), there's often an equivalent simpler system (ants passing through).

2. **Reduce before simulating**: Always check if a simulation problem can be reduced to a direct calculation. Simulation should be your last resort.

3. **Test with small examples**: Tracing through concrete examples (like we did in the visual walkthrough) is the best way to discover these insights during an interview.

Related problems: [Count Collisions on a Road](/problem/count-collisions-on-a-road), [Movement of Robots](/problem/movement-of-robots)
