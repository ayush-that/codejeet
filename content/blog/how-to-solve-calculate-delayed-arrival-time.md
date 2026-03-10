---
title: "How to Solve Calculate Delayed Arrival Time — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Calculate Delayed Arrival Time. Easy difficulty, 75.6% acceptance rate. Topics: Math."
date: "2027-08-29"
category: "dsa-patterns"
tags: ["calculate-delayed-arrival-time", "math", "easy"]
---

# How to Solve Calculate Delayed Arrival Time

This problem asks us to calculate the arrival time of a train given its scheduled arrival time and a delay duration, using 24-hour time format. While it appears simple, the key challenge is correctly handling the wrap-around when the total time exceeds 24 hours. The 24-hour clock resets to 0 after 23, so we need to use modular arithmetic to get the correct result.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `arrivalTime = 20` (8:00 PM) and `delayedTime = 6` (6 hours delay).

**Step-by-step reasoning:**

1. The train was scheduled to arrive at hour 20
2. It's delayed by 6 hours, so we add: 20 + 6 = 26
3. But 26 is not a valid 24-hour time (hours go from 0 to 23)
4. In 24-hour format, after 23 comes 0, then 1, then 2...
5. To find the equivalent time within 0-23, we use modulo 24: 26 % 24 = 2
6. So the train will arrive at 02:00 (2:00 AM the next day)

Another example: `arrivalTime = 15`, `delayedTime = 10`

- 15 + 10 = 25
- 25 % 24 = 1
- Result: 01:00 (1:00 AM next day)

Edge case: `arrivalTime = 23`, `delayedTime = 1`

- 23 + 1 = 24
- 24 % 24 = 0
- Result: 00:00 (midnight)

## Brute Force Approach

For this problem, there's really only one reasonable approach since it's a simple mathematical calculation. However, let's consider what a naive candidate might try:

A brute force approach would be to simulate the clock ticking hour by hour:

1. Start at `arrivalTime`
2. Add 1 for each hour of delay
3. If we reach 24, reset to 0 and continue

While this would work, it's inefficient for large delay values (though `delayedTime` is constrained in this problem). More importantly, it's unnecessarily complex for what should be a simple calculation.

The key insight is recognizing that 24-hour time is cyclical, and modular arithmetic (specifically modulo 24) gives us the correct result in constant time.

## Optimal Solution

The optimal solution uses the modulo operator to handle the wrap-around. When we add `arrivalTime` and `delayedTime`, any result ≥ 24 needs to "wrap around" back to the 0-23 range. The modulo operator `%` does exactly this by giving us the remainder when dividing by 24.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def findDelayedArrivalTime(arrivalTime: int, delayedTime: int) -> int:
    """
    Calculate the delayed arrival time using 24-hour format.

    Args:
        arrivalTime: The scheduled arrival time (0-23)
        delayedTime: The delay duration in hours

    Returns:
        The actual arrival time after delay (0-23)
    """
    # Add the arrival time and delay time
    total_time = arrivalTime + delayedTime

    # Use modulo 24 to handle wrap-around in 24-hour format
    # If total_time < 24, modulo returns total_time unchanged
    # If total_time >= 24, modulo returns the remainder after dividing by 24
    return total_time % 24
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate the delayed arrival time using 24-hour format.
 *
 * @param {number} arrivalTime - The scheduled arrival time (0-23)
 * @param {number} delayedTime - The delay duration in hours
 * @return {number} The actual arrival time after delay (0-23)
 */
function findDelayedArrivalTime(arrivalTime, delayedTime) {
  // Add the arrival time and delay time
  const totalTime = arrivalTime + delayedTime;

  // Use modulo 24 to handle wrap-around in 24-hour format
  // If totalTime < 24, modulo returns totalTime unchanged
  // If totalTime >= 24, modulo returns the remainder after dividing by 24
  return totalTime % 24;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate the delayed arrival time using 24-hour format.
     *
     * @param arrivalTime The scheduled arrival time (0-23)
     * @param delayedTime The delay duration in hours
     * @return The actual arrival time after delay (0-23)
     */
    public int findDelayedArrivalTime(int arrivalTime, int delayedTime) {
        // Add the arrival time and delay time
        int totalTime = arrivalTime + delayedTime;

        // Use modulo 24 to handle wrap-around in 24-hour format
        // If totalTime < 24, modulo returns totalTime unchanged
        // If totalTime >= 24, modulo returns the remainder after dividing by 24
        return totalTime % 24;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of operations: one addition and one modulo operation
- The runtime doesn't depend on the input size

**Space Complexity: O(1)**

- We use only a constant amount of extra space (a few variables)
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle wrap-around**: Some candidates might simply return `arrivalTime + delayedTime` without considering that the result might exceed 23. This fails for cases like `arrivalTime = 20, delayedTime = 6` where the result would be 26 instead of 2.

2. **Using subtraction instead of modulo**: Some might try `(arrivalTime + delayedTime) - 24` when the sum exceeds 23, but this only works when the sum is between 24 and 47. For larger delays (like 48 hours), this approach fails.

3. **Incorrect modulo handling for negative numbers**: In some languages, the modulo operator behaves differently with negative numbers. However, since both inputs are positive in this problem, we don't need to worry about this edge case.

4. **Overcomplicating with conditionals**: Some candidates might write complex if-else statements checking if the sum exceeds 23 and subtracting 24. While this works, it's less elegant and more error-prone than using the modulo operator.

## When You'll See This Pattern

This problem teaches the pattern of **cyclic/periodic calculations using modulo arithmetic**. You'll encounter similar patterns in:

1. **LeetCode 189: Rotate Array** - Rotating an array involves moving elements in a circular fashion, similar to how time wraps around in a 24-hour clock.

2. **LeetCode 202: Happy Number** - This problem involves digit manipulation and cycle detection, where modulo arithmetic is used to extract digits.

3. **LeetCode 1010: Pairs of Songs With Total Durations Divisible by 60** - This uses modulo arithmetic to find pairs where the sum of durations is divisible by 60, similar to how we use modulo 24 for time calculations.

4. **Any problem involving circular buffers or rotating sequences** - The modulo operator is essential for implementing circular data structures where indices wrap around.

## Key Takeaways

1. **Modulo arithmetic is perfect for cyclic/periodic problems**: When dealing with anything that wraps around (time, circular arrays, rotations), think about using the modulo operator.

2. **Simplify wrap-around logic**: Instead of complex conditional statements, a single modulo operation often provides a cleaner, more general solution.

3. **Test edge cases**: Always test cases where the sum equals exactly 24 (should return 0) and cases with large delays that wrap around multiple times (e.g., 48-hour delay).

[Practice this problem on CodeJeet](/problem/calculate-delayed-arrival-time)
