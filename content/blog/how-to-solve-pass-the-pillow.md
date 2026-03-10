---
title: "How to Solve Pass the Pillow — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Pass the Pillow. Easy difficulty, 56.6% acceptance rate. Topics: Math, Simulation."
date: "2028-08-17"
category: "dsa-patterns"
tags: ["pass-the-pillow", "math", "simulation", "easy"]
---

# How to Solve "Pass the Pillow"

This problem presents a scenario where `n` people stand in a line, and a pillow is passed from person to person each second. The pillow moves forward until it reaches the end of the line, then reverses direction and moves backward until it reaches the beginning, repeating this pattern. Given `n` people and `time` seconds, we need to determine which person holds the pillow at the given time.

What makes this problem interesting is that while it appears to be a simulation problem (which would be straightforward), there's actually a clean mathematical formula that solves it in constant time. Recognizing this pattern separates candidates who can optimize from those who just implement the obvious simulation.

## Visual Walkthrough

Let's trace through an example with `n = 4` people and `time = 6` seconds:

**Initial state (time = 0):**

- People: [1, 2, 3, 4]
- Pillow at person 1
- Direction: forward (→)

**Time progression:**

- Time 1: Person 1 → Person 2 (pillow at person 2)
- Time 2: Person 2 → Person 3 (pillow at person 3)
- Time 3: Person 3 → Person 4 (pillow at person 4) ← Reached end!
- Time 4: Person 4 → Person 3 (pillow at person 3, direction reverses)
- Time 5: Person 3 → Person 2 (pillow at person 2)
- Time 6: Person 2 → Person 1 (pillow at person 1)

At time = 6, the pillow is with person 1.

Notice the pattern: the pillow moves from 1 to 4 (forward), then from 4 back to 1 (backward), creating a cycle of length `(n-1) * 2 = 6` seconds for n=4. After 6 seconds, we're back at person 1.

## Brute Force Approach

The most intuitive approach is to simulate the pillow passing second by second:

1. Start with person 1 holding the pillow
2. Initialize direction as forward (moving toward higher numbers)
3. For each second from 1 to `time`:
   - Move the pillow to the next person based on current direction
   - If we reach person 1 or person n, reverse direction
4. Return the current person after `time` seconds

While this approach is correct, it has a time complexity of O(time), which could be inefficient if `time` is very large (up to 10^9 in the problem constraints). The simulation approach doesn't scale well, though for an "Easy" problem, many interviewers might accept it.

<div class="code-group">

```python
# Time: O(time) | Space: O(1)
def passThePillowBruteForce(n, time):
    """
    Brute force simulation approach.
    Works but inefficient for large time values.
    """
    current = 1  # Start with person 1
    direction = 1  # 1 means forward (increasing), -1 means backward (decreasing)

    for _ in range(time):
        current += direction

        # Check if we need to reverse direction
        if current == n:
            direction = -1  # Reached end, go backward
        elif current == 1:
            direction = 1   # Reached start, go forward

    return current
```

```javascript
// Time: O(time) | Space: O(1)
function passThePillowBruteForce(n, time) {
  /**
   * Brute force simulation approach.
   * Works but inefficient for large time values.
   */
  let current = 1; // Start with person 1
  let direction = 1; // 1 means forward (increasing), -1 means backward (decreasing)

  for (let i = 0; i < time; i++) {
    current += direction;

    // Check if we need to reverse direction
    if (current === n) {
      direction = -1; // Reached end, go backward
    } else if (current === 1) {
      direction = 1; // Reached start, go forward
    }
  }

  return current;
}
```

```java
// Time: O(time) | Space: O(1)
public int passThePillowBruteForce(int n, int time) {
    /**
     * Brute force simulation approach.
     * Works but inefficient for large time values.
     */
    int current = 1;  // Start with person 1
    int direction = 1;  // 1 means forward (increasing), -1 means backward (decreasing)

    for (int i = 0; i < time; i++) {
        current += direction;

        // Check if we need to reverse direction
        if (current == n) {
            direction = -1;  // Reached end, go backward
        } else if (current == 1) {
            direction = 1;   // Reached start, go forward
        }
    }

    return current;
}
```

</div>

## Optimal Solution

The key insight is that the pillow movement follows a predictable pattern. One complete cycle (from person 1 to person n and back to person 1) takes `(n - 1) * 2` seconds. We can use this to find where we are in the current cycle.

**Mathematical approach:**

1. Calculate the length of one complete cycle: `cycle = (n - 1) * 2`
2. Find where we are in the current cycle: `position = time % cycle`
3. If `position < n`, we're in the forward half of the cycle:
   - Pillow is at position `position + 1`
4. If `position >= n`, we're in the backward half of the cycle:
   - Pillow is at position `n - (position - (n - 1))`

**Alternative simpler formula:**
We can think of it as moving along a "virtual" line of length `n-1` back and forth. The position can be calculated as:

1. `position = time % ((n - 1) * 2)`
2. If `position < n`, result is `position + 1`
3. Otherwise, result is `n - (position - (n - 1))`

This simplifies to: `result = position + 1` if going forward, or `result = 2*n - position - 1` if going backward.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def passThePillow(n, time):
    """
    Optimal mathematical solution.
    Key insight: The pillow movement is periodic with period (n-1)*2.
    """
    # Calculate one complete cycle length
    # From person 1 to n and back to 1 takes (n-1)*2 seconds
    cycle_length = (n - 1) * 2

    # Find where we are in the current cycle
    position_in_cycle = time % cycle_length

    # If we're in the forward half of the cycle (moving from 1 to n)
    if position_in_cycle < n:
        # Position 0 in cycle corresponds to person 1
        # Position 1 in cycle corresponds to person 2, etc.
        return position_in_cycle + 1
    else:
        # We're in the backward half of the cycle (moving from n to 1)
        # When position_in_cycle = n, we're at person n-1
        # When position_in_cycle = n+1, we're at person n-2, etc.
        return 2 * n - position_in_cycle - 1
```

```javascript
// Time: O(1) | Space: O(1)
function passThePillow(n, time) {
  /**
   * Optimal mathematical solution.
   * Key insight: The pillow movement is periodic with period (n-1)*2.
   */
  // Calculate one complete cycle length
  // From person 1 to n and back to 1 takes (n-1)*2 seconds
  const cycleLength = (n - 1) * 2;

  // Find where we are in the current cycle
  const positionInCycle = time % cycleLength;

  // If we're in the forward half of the cycle (moving from 1 to n)
  if (positionInCycle < n) {
    // Position 0 in cycle corresponds to person 1
    // Position 1 in cycle corresponds to person 2, etc.
    return positionInCycle + 1;
  } else {
    // We're in the backward half of the cycle (moving from n to 1)
    // When positionInCycle = n, we're at person n-1
    // When positionInCycle = n+1, we're at person n-2, etc.
    return 2 * n - positionInCycle - 1;
  }
}
```

```java
// Time: O(1) | Space: O(1)
public int passThePillow(int n, int time) {
    /**
     * Optimal mathematical solution.
     * Key insight: The pillow movement is periodic with period (n-1)*2.
     */
    // Calculate one complete cycle length
    // From person 1 to n and back to 1 takes (n-1)*2 seconds
    int cycleLength = (n - 1) * 2;

    // Find where we are in the current cycle
    int positionInCycle = time % cycleLength;

    // If we're in the forward half of the cycle (moving from 1 to n)
    if (positionInCycle < n) {
        // Position 0 in cycle corresponds to person 1
        // Position 1 in cycle corresponds to person 2, etc.
        return positionInCycle + 1;
    } else {
        // We're in the backward half of the cycle (moving from n to 1)
        // When positionInCycle = n, we're at person n-1
        // When positionInCycle = n+1, we're at person n-2, etc.
        return 2 * n - positionInCycle - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The optimal solution uses only a few arithmetic operations regardless of input size
- No loops or recursion that depend on `n` or `time`

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No data structures that grow with input size

**Why this is optimal:**
The mathematical approach directly computes the answer without simulating each second. Since the movement pattern is perfectly periodic, we can use modular arithmetic to find our position in the cycle. This is much more efficient than the O(time) simulation approach, especially given the constraints where `time` can be up to 10^9.

## Common Mistakes

1. **Off-by-one errors with indexing**: The problem uses 1-based indexing (people numbered 1 to n), but programmers often think in 0-based indexing. For example, calculating `time % n` instead of `time % (n-1)*2` or forgetting to add 1 when returning the result.

2. **Not handling the edge case when n = 1**: When there's only one person, the pillow never moves. Some solutions might divide by zero when calculating `(n-1)*2`. Always test with n=1!

3. **Incorrect cycle calculation**: Some candidates mistakenly think the cycle length is `n` instead of `(n-1)*2`. Remember: moving from person 1 to person n takes `n-1` seconds, and moving back takes another `n-1` seconds.

4. **Using simulation for large inputs**: While simulation works for small values, it times out for large `time` values (up to 10^9). Always check constraints before choosing an approach.

## When You'll See This Pattern

This problem demonstrates **periodic/cyclic patterns with reflection**, which appears in various forms:

1. **Find the Student that Will Replace the Chalk (LeetCode 1894)**: Similar pattern where resources are consumed in a cycle, and you need to find who gets the last unit. Both problems involve cycling through elements with a predictable pattern.

2. **Robot Bounded In Circle (LeetCode 1041)**: Involves determining if a sequence of movements forms a cycle. The mathematical analysis of periodic behavior is similar.

3. **Minimum Operations to Make the Array Alternating (LeetCode 2170)**: While not identical, it involves analyzing patterns and cycles in sequences.

The core technique is recognizing when a process is periodic and using modular arithmetic (`%` operator) to avoid simulating the entire process.

## Key Takeaways

1. **Look for patterns and periodicity**: When you see back-and-forth movement or cyclic behavior, there's often a mathematical formula that can compute the result directly without simulation.

2. **Test edge cases**: Always test with n=1, n=2, small time values, and time values that are exact multiples of the cycle length. These often reveal off-by-one errors.

3. **Consider constraints before coding**: If input values can be large (like time up to 10^9), an O(n) or O(time) solution won't work. Look for O(1) mathematical solutions.

4. **Visualize with small examples**: Drawing out the movement for n=3 or n=4 helps identify the pattern and derive the formula.

Related problems: [Find the Student that Will Replace the Chalk](/problem/find-the-student-that-will-replace-the-chalk)
