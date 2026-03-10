---
title: "How to Solve Count Tested Devices After Test Operations — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Tested Devices After Test Operations. Easy difficulty, 78.8% acceptance rate. Topics: Array, Simulation, Counting."
date: "2028-06-08"
category: "dsa-patterns"
tags: ["count-tested-devices-after-test-operations", "array", "simulation", "counting", "easy"]
---

# How to Solve Count Tested Devices After Test Operations

This problem asks us to simulate testing devices in order, where testing a device with battery percentage > 0 counts as a tested device, but also decreases the battery of all devices to its right by 1. The tricky part is that we need to track both the count of tested devices AND the cascading effect on future devices' battery levels as we iterate through the array.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider `batteryPercentages = [1, 1, 2, 1, 3]`:

**Initial state:** `[1, 1, 2, 1, 3]`, tested = 0

**Step 1 (i=0):** battery = 1 (> 0), so we test this device

- tested = 1
- Decrease all devices to the right (i=1 to 4) by 1
- Array becomes: `[1, 0, 1, 0, 2]`

**Step 2 (i=1):** battery = 0 (≤ 0), skip testing

- No change to tested count or array

**Step 3 (i=2):** battery = 1 (> 0), so we test this device

- tested = 2
- Decrease all devices to the right (i=3 to 4) by 1
- Array becomes: `[1, 0, 1, -1, 1]`

**Step 4 (i=3):** battery = -1 (≤ 0), skip testing

- No change

**Step 5 (i=4):** battery = 1 (> 0), so we test this device

- tested = 3
- No devices to the right to decrease

**Final answer:** 3 tested devices

Notice that each time we test a device, we're effectively "pushing" a -1 penalty forward through the remaining array. This observation is key to finding an efficient solution.

## Brute Force Approach

The most straightforward approach is to literally simulate the process as described:

1. Initialize `tested = 0`
2. For each device `i` from 0 to n-1:
   - If `batteryPercentages[i] > 0`:
     - Increment `tested`
     - For each device `j` from i+1 to n-1:
       - Decrease `batteryPercentages[j]` by 1

This approach has O(n²) time complexity because for each of the n devices, in the worst case we might need to update O(n) subsequent devices. While this would work for small inputs, it's inefficient for larger arrays.

The brute force also modifies the input array, which might not be desirable in some contexts.

## Optimal Solution

The key insight is that we don't actually need to modify the array! When we test device `i`, we're effectively saying: "All future devices will have their battery reduced by 1." So instead of updating the array, we can keep track of how many times we've tested devices so far (which equals how much we've reduced future batteries).

Let `decrements` = number of tested devices so far. When we check device `i`:

- Its _effective_ battery = `batteryPercentages[i] - decrements`
- If this effective battery > 0, we test it and increment both `tested` and `decrements`

This gives us an O(n) time, O(1) space solution that doesn't modify the input.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countTestedDevices(batteryPercentages):
    """
    Counts how many devices get tested given the testing rules.

    Args:
    batteryPercentages: List of battery percentages for each device

    Returns:
    Number of devices that get tested
    """
    tested = 0  # Count of devices tested so far
    decrements = 0  # How many times we've reduced battery of future devices

    # Iterate through each device in order
    for battery in batteryPercentages:
        # Calculate effective battery after previous tests
        effective_battery = battery - decrements

        # If effective battery is positive, test this device
        if effective_battery > 0:
            tested += 1  # This device gets tested
            decrements += 1  # Future devices get reduced by 1 more

    return tested
```

```javascript
// Time: O(n) | Space: O(1)
function countTestedDevices(batteryPercentages) {
  /**
   * Counts how many devices get tested given the testing rules.
   *
   * @param {number[]} batteryPercentages - Battery percentages for each device
   * @return {number} Number of devices that get tested
   */
  let tested = 0; // Count of devices tested so far
  let decrements = 0; // How many times we've reduced battery of future devices

  // Iterate through each device in order
  for (let i = 0; i < batteryPercentages.length; i++) {
    // Calculate effective battery after previous tests
    const effectiveBattery = batteryPercentages[i] - decrements;

    // If effective battery is positive, test this device
    if (effectiveBattery > 0) {
      tested++; // This device gets tested
      decrements++; // Future devices get reduced by 1 more
    }
  }

  return tested;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Counts how many devices get tested given the testing rules.
     *
     * @param batteryPercentages Battery percentages for each device
     * @return Number of devices that get tested
     */
    public int countTestedDevices(int[] batteryPercentages) {
        int tested = 0;  // Count of devices tested so far
        int decrements = 0;  // How many times we've reduced battery of future devices

        // Iterate through each device in order
        for (int i = 0; i < batteryPercentages.length; i++) {
            // Calculate effective battery after previous tests
            int effectiveBattery = batteryPercentages[i] - decrements;

            // If effective battery is positive, test this device
            if (effectiveBattery > 0) {
                tested++;  // This device gets tested
                decrements++;  // Future devices get reduced by 1 more
            }
        }

        return tested;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array of length n
- Each iteration does constant-time operations (subtraction, comparison, increment)

**Space Complexity:** O(1)

- We only use a few integer variables (`tested`, `decrements`)
- No additional data structures that scale with input size
- The input array is not modified (though we could modify it if allowed)

## Common Mistakes

1. **Modifying the array unnecessarily:** Some candidates try to update the entire remaining array each time they test a device, leading to O(n²) time. Remember that you only need to track how many times you've tested so far.

2. **Forgetting that decrements accumulate:** Each test adds to the penalty for ALL future devices, not just the immediate next one. The variable `decrements` should increment each time we test a device and apply to all subsequent devices.

3. **Checking the wrong condition:** The problem says "greater than 0", not "greater than or equal to 0". A device with exactly 0% battery should NOT be tested. Make sure your condition is `> 0` not `>= 0`.

4. **Off-by-one with array indices:** When simulating, remember we only decrease batteries of devices to the RIGHT (higher indices), not including the current device. In our optimal solution, this is handled automatically because we apply `decrements` before checking the current device.

## When You'll See This Pattern

This "cascading effect" or "prefix sum of operations" pattern appears in several problems:

1. **1109. Corporate Flight Bookings** - Similar concept where bookings affect a range of flights, and we can use prefix sums to efficiently apply all changes.

2. **1094. Car Pooling** - Tracking how many passengers are in a car at each point, where pickups and dropoffs affect future segments.

3. **370. Range Addition** - Applying multiple range updates efficiently using prefix sums.

The common theme is that when you have operations that affect a range of elements (especially all elements to the right), you can often track a running total of how much effect has been applied so far, rather than updating each element individually.

## Key Takeaways

1. **Think in terms of cumulative effects:** When an operation affects all future elements, track the total effect so far rather than updating each element. This often turns O(n²) solutions into O(n).

2. **Simulation problems can have mathematical shortcuts:** Even when a problem describes a step-by-step process, there's often a way to compute the result directly without actually simulating every step.

3. **Test with edge cases:** Always check what happens with empty arrays, all zeros, all positive numbers, and decreasing sequences. For this problem, an array like `[0, 0, 0]` should return 0, and `[100, 100, 100]` should return 3.

[Practice this problem on CodeJeet](/problem/count-tested-devices-after-test-operations)
