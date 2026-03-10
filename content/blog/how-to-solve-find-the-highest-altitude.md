---
title: "How to Solve Find the Highest Altitude — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Highest Altitude. Easy difficulty, 83.9% acceptance rate. Topics: Array, Prefix Sum."
date: "2027-01-17"
category: "dsa-patterns"
tags: ["find-the-highest-altitude", "array", "prefix-sum", "easy"]
---

# How to Solve Find the Highest Altitude

This problem asks us to track a biker's altitude changes across a road trip. We're given an array `gain` where each element represents the net altitude change between consecutive points. Starting at altitude 0, we need to find the highest altitude reached during the entire trip. What makes this problem interesting is that it's essentially a prefix sum problem in disguise—the altitude at each point is just the cumulative sum of all gains up to that point.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `gain = [-5, 1, 5, 0, -7]`.

The biker starts at point 0 with altitude 0:

- Point 0: altitude = 0
- Point 1: altitude = 0 + (-5) = -5
- Point 2: altitude = -5 + 1 = -4
- Point 3: altitude = -4 + 5 = 1
- Point 4: altitude = 1 + 0 = 1
- Point 5: altitude = 1 + (-7) = -6

The altitudes at each point are: [0, -5, -4, 1, 1, -6]
The highest altitude is 1.

Notice that we don't need to store all altitudes—we just need to track:

1. The current altitude (running sum of gains)
2. The maximum altitude seen so far

This gives us a hint for an efficient O(1) space solution.

## Brute Force Approach

A naive approach would be to explicitly calculate all altitudes and then find the maximum:

1. Create an array `altitudes` of length `n+1`
2. Set `altitudes[0] = 0`
3. For each index `i` from 1 to `n`:
   - `altitudes[i] = altitudes[i-1] + gain[i-1]`
4. Find and return the maximum value in `altitudes`

While this approach is correct, it uses O(n) extra space to store all altitudes when we only need the maximum. In an interview, you should mention this approach and then immediately optimize it to show you understand space efficiency.

## Optimal Solution

The optimal solution uses a single pass with constant extra space. We maintain:

- `current_altitude`: running sum of gains (prefix sum)
- `max_altitude`: highest altitude seen so far

We iterate through each gain, update the current altitude, and track the maximum.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def largestAltitude(gain):
    """
    Find the highest altitude reached during the road trip.

    Args:
        gain: List[int] - Net altitude changes between consecutive points

    Returns:
        int - The highest altitude reached
    """
    # Start at altitude 0 (point 0)
    current_altitude = 0
    # Track the maximum altitude encountered
    max_altitude = 0

    # Iterate through each altitude change
    for change in gain:
        # Update current altitude by applying the gain
        current_altitude += change
        # Update max altitude if current is higher
        max_altitude = max(max_altitude, current_altitude)

    return max_altitude
```

```javascript
// Time: O(n) | Space: O(1)
function largestAltitude(gain) {
  /**
   * Find the highest altitude reached during the road trip.
   *
   * @param {number[]} gain - Net altitude changes between consecutive points
   * @return {number} - The highest altitude reached
   */
  // Start at altitude 0 (point 0)
  let currentAltitude = 0;
  // Track the maximum altitude encountered
  let maxAltitude = 0;

  // Iterate through each altitude change
  for (let i = 0; i < gain.length; i++) {
    // Update current altitude by applying the gain
    currentAltitude += gain[i];
    // Update max altitude if current is higher
    maxAltitude = Math.max(maxAltitude, currentAltitude);
  }

  return maxAltitude;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int largestAltitude(int[] gain) {
        /**
         * Find the highest altitude reached during the road trip.
         *
         * @param gain - Net altitude changes between consecutive points
         * @return - The highest altitude reached
         */
        // Start at altitude 0 (point 0)
        int currentAltitude = 0;
        // Track the maximum altitude encountered
        int maxAltitude = 0;

        // Iterate through each altitude change
        for (int i = 0; i < gain.length; i++) {
            // Update current altitude by applying the gain
            currentAltitude += gain[i];
            // Update max altitude if current is higher
            maxAltitude = Math.max(maxAltitude, currentAltitude);
        }

        return maxAltitude;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the `gain` array exactly once
- Each iteration does constant work: addition and comparison
- `n` is the length of the input array

**Space Complexity: O(1)**

- We only use two integer variables (`current_altitude` and `max_altitude`)
- No additional data structures that scale with input size
- Even the brute force approach would be O(n) space, so this is optimal

## Common Mistakes

1. **Forgetting to include the starting altitude (0)**: Some candidates only check altitudes after applying gains. Remember the biker starts at altitude 0, so if all gains are negative, the answer should be 0, not a negative number.

2. **Off-by-one errors with array indices**: The `gain` array has length `n`, but there are `n+1` points. Make sure you understand that `gain[i]` represents the change from point `i` to point `i+1`.

3. **Using unnecessary extra space**: While creating an array to store all altitudes is correct, it shows poor space optimization. Interviewers expect you to recognize that we only need the maximum, not all values.

4. **Not handling empty input**: While the problem guarantees `n >= 1`, it's good practice to mention edge cases. If `gain` were empty, the answer would be 0 (just the starting point).

## When You'll See This Pattern

This problem uses the **prefix sum** (or cumulative sum) pattern, which appears in many coding problems:

1. **Maximum Subarray (LeetCode 53)**: Similar concept of tracking a running sum and maximum, though with reset logic when the sum goes negative.

2. **Running Sum of 1D Array (LeetCode 1480)**: Direct application of prefix sums—given an array, return running sums.

3. **Find Pivot Index (LeetCode 724)**: Uses prefix sums to find where left sum equals right sum.

4. **Subarray Sum Equals K (LeetCode 560)**: More advanced prefix sum problem using hash maps to track cumulative sums.

The key insight is recognizing when you need to work with cumulative totals rather than individual elements. Any problem involving "running totals," "cumulative effects," or "prefix calculations" likely uses this pattern.

## Key Takeaways

1. **Prefix sums transform sequence problems**: When you need to track cumulative effects (like altitude changes, running totals, or net changes), think about maintaining a running sum.

2. **Space optimization through tracking only what's needed**: We don't need to store all intermediate values if we only care about the maximum (or minimum, or some other aggregate).

3. **Start values matter**: Always initialize your running sum appropriately. Here we start at 0 because that's the initial altitude, not because it's the default for integers.

4. **Simple problems teach fundamental patterns**: Even "easy" problems like this one reinforce important concepts that appear in harder problems. Mastering prefix sums will help you solve more complex array and subarray problems.

[Practice this problem on CodeJeet](/problem/find-the-highest-altitude)
