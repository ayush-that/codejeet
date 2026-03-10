---
title: "How to Solve Angle Between Hands of a Clock — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Angle Between Hands of a Clock. Medium difficulty, 64.4% acceptance rate. Topics: Math."
date: "2026-10-15"
category: "dsa-patterns"
tags: ["angle-between-hands-of-a-clock", "math", "medium"]
---

# How to Solve Angle Between Hands of a Clock

This problem asks us to calculate the smaller angle between the hour and minute hands on an analog clock given the hour and minutes. While it seems straightforward, the trick lies in accurately calculating the hour hand's position—it moves gradually as minutes pass, not just in discrete hour jumps. Many candidates forget this continuous movement and get incorrect results.

## Visual Walkthrough

Let's trace through an example: **hour = 3, minutes = 15**

**Step 1: Calculate minute hand position**

- The minute hand moves 360° in 60 minutes → 6° per minute
- At 15 minutes: 15 × 6° = 90° from the 12 o'clock position

**Step 2: Calculate hour hand position**

- The hour hand moves 360° in 12 hours → 30° per hour
- At exactly 3:00: 3 × 30° = 90° from 12 o'clock
- But we're at 3:15, so the hour hand has moved beyond the 3
- Additional movement: 15 minutes × 0.5° per minute (30° per hour ÷ 60 minutes)
- Total hour hand position: 90° + (15 × 0.5°) = 90° + 7.5° = 97.5°

**Step 3: Find the difference**

- Absolute difference: |97.5° - 90°| = 7.5°

**Step 4: Get the smaller angle**

- The smaller angle is min(7.5°, 360° - 7.5°) = min(7.5°, 352.5°) = 7.5°

This example shows why we need to account for the hour hand's continuous movement—without it, we'd get 0° difference at 3:15, which is clearly wrong.

## Brute Force Approach

There's no true "brute force" for this mathematical problem, but candidates often make these naive attempts:

1. **Discrete hour positions only**: Calculate hour hand at exact hour, ignoring minute movement
   - This fails for any non-zero minutes (like our 3:15 example)
2. **Trying all possible angles**: This doesn't make sense since we have a direct formula

3. **Complex conditional logic**: Trying to handle each hour separately with special cases
   - This becomes messy with 12-hour wraparound and the continuous movement

The key insight is recognizing this as a pure math problem with a direct formula, not something requiring iteration or complex conditionals.

## Optimized Approach

The optimal solution uses these key insights:

1. **Minute hand calculation**: Each minute represents 6° (360° ÷ 60 minutes)
2. **Hour hand calculation**:
   - Base position: hour × 30° (360° ÷ 12 hours)
   - Additional movement: minutes × 0.5° (30° per hour ÷ 60 minutes per hour)
3. **Angle difference**: Absolute difference between the two positions
4. **Smaller angle**: min(difference, 360° - difference)

**Special considerations:**

- Hours wrap around at 12 (12 should be treated as 0)
- We need to handle floating-point precision carefully
- The result should be the smaller angle (≤ 180°)

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def angleClock(hour: int, minutes: int) -> float:
    """
    Calculate the smaller angle between hour and minute hands.

    Args:
        hour: Integer from 1 to 12
        minutes: Integer from 0 to 59

    Returns:
        Float representing the smaller angle in degrees
    """
    # Each hour represents 30 degrees (360/12 = 30)
    # Each minute adds 0.5 degrees to hour hand (30/60 = 0.5)
    hour_angle = (hour % 12) * 30 + minutes * 0.5

    # Each minute represents 6 degrees (360/60 = 6)
    minute_angle = minutes * 6

    # Calculate absolute difference between the two angles
    angle_diff = abs(hour_angle - minute_angle)

    # The smaller angle is min(difference, 360 - difference)
    # This ensures we get the angle ≤ 180 degrees
    smaller_angle = min(angle_diff, 360 - angle_diff)

    return smaller_angle
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate the smaller angle between hour and minute hands.
 * @param {number} hour - Integer from 1 to 12
 * @param {number} minutes - Integer from 0 to 59
 * @return {number} - Smaller angle in degrees
 */
function angleClock(hour, minutes) {
  // Each hour represents 30 degrees (360/12 = 30)
  // Each minute adds 0.5 degrees to hour hand (30/60 = 0.5)
  const hourAngle = (hour % 12) * 30 + minutes * 0.5;

  // Each minute represents 6 degrees (360/60 = 6)
  const minuteAngle = minutes * 6;

  // Calculate absolute difference between the two angles
  const angleDiff = Math.abs(hourAngle - minuteAngle);

  // The smaller angle is min(difference, 360 - difference)
  // This ensures we get the angle ≤ 180 degrees
  const smallerAngle = Math.min(angleDiff, 360 - angleDiff);

  return smallerAngle;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate the smaller angle between hour and minute hands.
     * @param hour - Integer from 1 to 12
     * @param minutes - Integer from 0 to 59
     * @return Smaller angle in degrees
     */
    public double angleClock(int hour, int minutes) {
        // Each hour represents 30 degrees (360/12 = 30)
        // Each minute adds 0.5 degrees to hour hand (30/60 = 0.5)
        double hourAngle = (hour % 12) * 30 + minutes * 0.5;

        // Each minute represents 6 degrees (360/60 = 6)
        double minuteAngle = minutes * 6;

        // Calculate absolute difference between the two angles
        double angleDiff = Math.abs(hourAngle - minuteAngle);

        // The smaller angle is min(difference, 360 - difference)
        // This ensures we get the angle ≤ 180 degrees
        double smallerAngle = Math.min(angleDiff, 360 - angleDiff);

        return smallerAngle;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- All operations are constant time arithmetic operations
- No loops or recursion, just simple calculations

**Space Complexity: O(1)**

- We use only a constant amount of extra space
- Variables for hour_angle, minute_angle, angle_diff, and smaller_angle
- No data structures that grow with input size

The constant factors are extremely small—just a few multiplications, additions, and comparisons.

## Common Mistakes

1. **Forgetting hour hand movement with minutes**: The most common error! At 3:15, the hour hand isn't exactly at 90°—it's moved 7.5° beyond that. Always add `minutes × 0.5°` to the hour hand position.

2. **Not handling 12 o'clock correctly**: When hour = 12, we need `hour % 12` to get 0, not 12 × 30° = 360°. Without the modulo, 12:30 would give incorrect results.

3. **Returning the larger angle**: The problem asks for the _smaller_ angle. Always use `min(difference, 360 - difference)`. At 6:00, the difference is 180°, but both 180° and 180° are equal, so it's fine. At 3:15, 7.5° is correct, not 352.5°.

4. **Floating-point precision issues**: While the problem accepts answers within 10⁻⁵, be careful with comparisons. Use double/float consistently. Some languages might give slightly different results due to floating-point arithmetic.

## When You'll See This Pattern

This problem teaches **mathematical modeling of real-world systems** and **handling continuous movement in discrete representations**. You'll see similar patterns in:

1. **LeetCode 273: Integer to English Words** - Breaking down a number into structured components (like breaking time into hours and minutes components)
2. **LeetCode 13: Roman to Integer** - Converting between different representation systems with specific rules
3. **LeetCode 258: Add Digits** - Mathematical tricks that provide O(1) solutions instead of iterative approaches
4. **LeetCode 202: Happy Number** - Mathematical properties that lead to cycle detection

These problems all involve finding mathematical insights that simplify what seems like a procedural problem. They test your ability to move from "how would I calculate this manually" to "what's the underlying formula?"

## Key Takeaways

1. **Look for direct formulas before writing complex logic**: Many problems that seem to require simulation or iteration actually have O(1) mathematical solutions. Ask: "Can I derive a formula instead of simulating the process?"

2. **Pay attention to continuous vs. discrete movement**: When dealing with time, angles, or any continuous quantities, remember that components can move between discrete markers. Always check if intermediate positions matter.

3. **Handle edge cases with modular arithmetic**: The `%` operator is perfect for circular/cyclic systems like clocks (12-hour), angles (360°), or days of the week (7-day). It elegantly handles wrap-around cases.

4. **Test with asymmetric cases**: Don't just test 3:00 or 6:00. Test 3:15, 12:30, 1:05—cases where the hour hand isn't exactly on the hour mark.

[Practice this problem on CodeJeet](/problem/angle-between-hands-of-a-clock)
