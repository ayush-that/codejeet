---
title: "How to Solve Distance Between Bus Stops — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Distance Between Bus Stops. Easy difficulty, 55.2% acceptance rate. Topics: Array."
date: "2027-11-27"
category: "dsa-patterns"
tags: ["distance-between-bus-stops", "array", "easy"]
---

# How to Solve Distance Between Bus Stops

This problem asks us to find the shortest distance between two bus stops on a circular route. The bus can travel in either direction (clockwise or counterclockwise), and we need to return the minimum of these two distances. What makes this problem interesting is that while it appears simple, it requires careful handling of circular array indices and efficient calculation of distances in both directions.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `distance = [1, 2, 3, 4]` (4 stops: 0, 1, 2, 3)
- `start = 0`
- `destination = 2`

The bus stops form a circle: 0 ↔ 1 ↔ 2 ↔ 3 ↔ 0

**Clockwise distance (0 → 1 → 2):**

- From stop 0 to stop 1: distance[0] = 1
- From stop 1 to stop 2: distance[1] = 2
- Total clockwise distance = 1 + 2 = 3

**Counterclockwise distance (0 → 3 → 2):**

- From stop 0 to stop 3: distance[3] = 4
- From stop 3 to stop 2: distance[2] = 3
- Total counterclockwise distance = 4 + 3 = 7

**Result:** min(3, 7) = 3

Notice that the counterclockwise distance can also be calculated as total distance minus clockwise distance. The total distance around the circle is 1 + 2 + 3 + 4 = 10. So counterclockwise distance = 10 - 3 = 7.

This observation gives us a key insight: we only need to calculate one direction's distance, and the other direction is simply the total minus that distance.

## Brute Force Approach

A naive approach would be to calculate both distances separately by traversing the array in both directions:

1. Calculate clockwise distance by summing from `start` to `destination` (wrapping around if needed)
2. Calculate counterclockwise distance by summing from `destination` to `start` (wrapping around if needed)
3. Return the minimum

While this approach would work, it's inefficient because we're traversing the array twice. More importantly, it doesn't leverage the mathematical relationship between the two distances. A candidate might also try to store all possible distances in a matrix, but with O(n²) space complexity, this would be wasteful for a simple problem.

## Optimal Solution

The optimal solution uses a single pass through the array to calculate the total distance, then calculates the clockwise distance between the two stops. The counterclockwise distance is simply total distance minus clockwise distance. We take the minimum of these two values.

Key insights:

1. We need to handle the case where `start > destination` by swapping them (since distance is the same in both directions)
2. Clockwise distance is the sum of distances from `start` to `destination`
3. Counterclockwise distance is total distance minus clockwise distance

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def distanceBetweenBusStops(distance, start, destination):
    """
    Calculate the shortest distance between two bus stops on a circular route.

    Args:
        distance: List of distances between consecutive stops
        start: Starting stop index
        destination: Destination stop index

    Returns:
        Minimum distance between start and destination
    """
    # Ensure start is less than destination for consistent clockwise calculation
    if start > destination:
        start, destination = destination, start

    # Calculate total distance around the circle
    total_distance = sum(distance)

    # Calculate clockwise distance from start to destination
    clockwise_distance = 0
    for i in range(start, destination):
        clockwise_distance += distance[i]

    # Counterclockwise distance is total minus clockwise
    counterclockwise_distance = total_distance - clockwise_distance

    # Return the minimum of the two possible distances
    return min(clockwise_distance, counterclockwise_distance)
```

```javascript
// Time: O(n) | Space: O(1)
function distanceBetweenBusStops(distance, start, destination) {
  /**
   * Calculate the shortest distance between two bus stops on a circular route.
   *
   * @param {number[]} distance - Array of distances between consecutive stops
   * @param {number} start - Starting stop index
   * @param {number} destination - Destination stop index
   * @return {number} Minimum distance between start and destination
   */

  // Ensure start is less than destination for consistent clockwise calculation
  if (start > destination) {
    [start, destination] = [destination, start];
  }

  // Calculate total distance around the circle
  let totalDistance = 0;
  for (let i = 0; i < distance.length; i++) {
    totalDistance += distance[i];
  }

  // Calculate clockwise distance from start to destination
  let clockwiseDistance = 0;
  for (let i = start; i < destination; i++) {
    clockwiseDistance += distance[i];
  }

  // Counterclockwise distance is total minus clockwise
  const counterclockwiseDistance = totalDistance - clockwiseDistance;

  // Return the minimum of the two possible distances
  return Math.min(clockwiseDistance, counterclockwiseDistance);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int distanceBetweenBusStops(int[] distance, int start, int destination) {
        /**
         * Calculate the shortest distance between two bus stops on a circular route.
         *
         * @param distance Array of distances between consecutive stops
         * @param start Starting stop index
         * @param destination Destination stop index
         * @return Minimum distance between start and destination
         */

        // Ensure start is less than destination for consistent clockwise calculation
        if (start > destination) {
            int temp = start;
            start = destination;
            destination = temp;
        }

        // Calculate total distance around the circle
        int totalDistance = 0;
        for (int d : distance) {
            totalDistance += d;
        }

        // Calculate clockwise distance from start to destination
        int clockwiseDistance = 0;
        for (int i = start; i < destination; i++) {
            clockwiseDistance += distance[i];
        }

        // Counterclockwise distance is total minus clockwise
        int counterclockwiseDistance = totalDistance - clockwiseDistance;

        // Return the minimum of the two possible distances
        return Math.min(clockwiseDistance, counterclockwiseDistance);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to calculate total distance (O(n)), and one to calculate clockwise distance (O(n) in worst case when start=0 and destination=n-1)
- In practice, we can combine these into a single pass, but the asymptotic complexity remains O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables like `total_distance`, `clockwise_distance`, and `counterclockwise_distance`
- No additional data structures are needed

## Common Mistakes

1. **Not handling start > destination case**: If you don't swap start and destination when start > destination, your clockwise distance calculation will be incorrect. Always ensure start ≤ destination before calculating clockwise distance.

2. **Incorrect loop boundaries**: When calculating clockwise distance, the loop should go from `start` to `destination-1` (inclusive of start, exclusive of destination). Using `<= destination` would include an extra segment.

3. **Forgetting the circular nature**: Some candidates might only calculate the clockwise distance without considering that the bus can go both directions. Always remember to calculate both distances and take the minimum.

4. **Inefficient double calculation**: Calculating both clockwise and counterclockwise distances separately by traversing the array twice is inefficient. Use the relationship: counterclockwise = total - clockwise.

## When You'll See This Pattern

This problem uses the **circular array traversal** pattern combined with **prefix sum** concepts. You'll see similar patterns in:

1. **Gas Station (LeetCode 134)**: Also involves circular traversal to find a starting point where you can complete a circuit. The circular nature and cumulative sums are key.

2. **Maximum Sum Circular Subarray (LeetCode 918)**: Requires handling both regular subarrays and circular subarrays that wrap around the end.

3. **Find the Minimum Number of Fibonacci Numbers Whose Sum Is K (LeetCode 1414)**: While not about circular arrays, it uses similar greedy minimization principles.

The core technique is recognizing that in circular problems, you often need to consider two cases: the direct path and the wrap-around path, and there's usually a mathematical relationship between them.

## Key Takeaways

1. **Circular problems often have two paths**: When dealing with circular arrays, always consider both the forward and backward/wrap-around paths. There's usually a relationship like: backward = total - forward.

2. **Normalize indices first**: When comparing or calculating between two indices in a circular array, it often helps to normalize them (e.g., ensure start ≤ destination) to simplify logic.

3. **Look for mathematical relationships**: Instead of calculating both paths separately, look for relationships that allow you to compute one from the other. This often leads to more efficient solutions.

Related problems: [Minimum Costs Using the Train Line](/problem/minimum-costs-using-the-train-line)
