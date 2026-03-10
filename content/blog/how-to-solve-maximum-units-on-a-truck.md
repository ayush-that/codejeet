---
title: "How to Solve Maximum Units on a Truck — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Units on a Truck. Easy difficulty, 74.7% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-08-20"
category: "dsa-patterns"
tags: ["maximum-units-on-a-truck", "array", "greedy", "sorting", "easy"]
---

# How to Solve Maximum Units on a Truck

You need to maximize the total units loaded onto a truck given a capacity constraint, where different box types contain different numbers of units per box. The challenge is that you can't simply take the highest-unit boxes first — you must consider both the units per box and how many boxes of that type are available. This is a classic **greedy optimization problem** where sorting unlocks the optimal strategy.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
boxTypes = [[1,3], [2,2], [3,1]]
truckSize = 4
```

**Step 1: Sort boxes by units per box (descending)**

- Box type 0: 1 box × 3 units each = 3 units/box
- Box type 1: 2 boxes × 2 units each = 2 units/box
- Box type 2: 3 boxes × 1 unit each = 1 unit/box

Sorted: `[[1,3], [2,2], [3,1]]` (already sorted in this case)

**Step 2: Load greedily**

1. Take all 1 box of type 0 (3 units each):
   - Truck capacity: 4 → 3 remaining
   - Total units: 1 × 3 = 3

2. Take all 2 boxes of type 1 (2 units each):
   - Truck capacity: 3 → 1 remaining
   - Total units: 3 + (2 × 2) = 7

3. Take 1 box of type 2 (1 unit each):
   - Truck capacity: 1 → 0 remaining
   - Total units: 7 + (1 × 1) = 8

**Result:** 8 units maximum.

Why does this work? By always taking the highest-unit boxes first, we ensure each unit of truck capacity yields the maximum possible units. If we took lower-unit boxes first, we'd waste capacity that could have been used for higher-unit boxes.

## Brute Force Approach

A naive approach would be to consider all possible combinations of boxes. For each box type, we could try taking 0, 1, 2, ... up to `min(numberOfBoxesi, remainingCapacity)` boxes, recursively exploring all possibilities.

```python
def bruteForce(boxTypes, truckSize):
    def backtrack(index, remaining, currentUnits):
        if remaining == 0 or index == len(boxTypes):
            return currentUnits

        maxUnits = currentUnits
        boxes, units = boxTypes[index]

        # Try taking 0 to min(boxes, remaining) boxes of this type
        for take in range(min(boxes, remaining) + 1):
            maxUnits = max(maxUnits,
                          backtrack(index + 1,
                                   remaining - take,
                                   currentUnits + take * units))

        return maxUnits

    return backtrack(0, truckSize, 0)
```

**Why it's too slow:**

- Time complexity: O(k^n) where k is average boxes per type and n is number of box types
- For `boxTypes = [[100,1], [100,2], ...]` with 10 types, we'd have ~100^10 possibilities
- The problem constraints (up to 1000 box types) make this completely infeasible

The brute force fails because it doesn't recognize the **optimal substructure**: once we decide how many boxes of the current type to take, the remaining problem is identical but smaller. This suggests a greedy or dynamic programming approach.

## Optimal Solution

The optimal solution uses a greedy approach: sort boxes by units per box in descending order, then take as many as possible from the highest-unit boxes first.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def maximumUnits(boxTypes, truckSize):
    """
    Calculate maximum units that can be loaded onto truck.

    Args:
        boxTypes: List of [numberOfBoxes, unitsPerBox] pairs
        truckSize: Maximum number of boxes truck can hold

    Returns:
        Maximum total units achievable
    """
    # Step 1: Sort box types by units per box in descending order
    # We want to prioritize boxes with highest units first
    boxTypes.sort(key=lambda x: x[1], reverse=True)

    totalUnits = 0
    remainingCapacity = truckSize

    # Step 2: Iterate through sorted box types
    for boxes, units in boxTypes:
        if remainingCapacity <= 0:
            break  # Truck is full

        # Step 3: Take as many boxes as possible from current type
        # We can take min(available boxes, remaining capacity)
        boxesToTake = min(boxes, remainingCapacity)

        # Step 4: Update totals
        totalUnits += boxesToTake * units
        remainingCapacity -= boxesToTake

    return totalUnits
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function maximumUnits(boxTypes, truckSize) {
  /**
   * Calculate maximum units that can be loaded onto truck.
   *
   * @param {number[][]} boxTypes - Array of [numberOfBoxes, unitsPerBox] pairs
   * @param {number} truckSize - Maximum number of boxes truck can hold
   * @return {number} Maximum total units achievable
   */

  // Step 1: Sort box types by units per box in descending order
  // We want to prioritize boxes with highest units first
  boxTypes.sort((a, b) => b[1] - a[1]);

  let totalUnits = 0;
  let remainingCapacity = truckSize;

  // Step 2: Iterate through sorted box types
  for (const [boxes, units] of boxTypes) {
    if (remainingCapacity <= 0) {
      break; // Truck is full
    }

    // Step 3: Take as many boxes as possible from current type
    // We can take min(available boxes, remaining capacity)
    const boxesToTake = Math.min(boxes, remainingCapacity);

    // Step 4: Update totals
    totalUnits += boxesToTake * units;
    remainingCapacity -= boxesToTake;
  }

  return totalUnits;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int maximumUnits(int[][] boxTypes, int truckSize) {
        /**
         * Calculate maximum units that can be loaded onto truck.
         *
         * @param boxTypes Array of [numberOfBoxes, unitsPerBox] pairs
         * @param truckSize Maximum number of boxes truck can hold
         * @return Maximum total units achievable
         */

        // Step 1: Sort box types by units per box in descending order
        // We want to prioritize boxes with highest units first
        Arrays.sort(boxTypes, (a, b) -> b[1] - a[1]);

        int totalUnits = 0;
        int remainingCapacity = truckSize;

        // Step 2: Iterate through sorted box types
        for (int[] boxType : boxTypes) {
            int boxes = boxType[0];
            int units = boxType[1];

            if (remainingCapacity <= 0) {
                break;  // Truck is full
            }

            // Step 3: Take as many boxes as possible from current type
            // We can take min(available boxes, remaining capacity)
            int boxesToTake = Math.min(boxes, remainingCapacity);

            // Step 4: Update totals
            totalUnits += boxesToTake * units;
            remainingCapacity -= boxesToTake;
        }

        return totalUnits;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the box types takes O(n log n) time where n is the number of box types
- The greedy iteration takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If sorting is done in-place (like Python's Timsort), space is O(1) or O(log n) for recursion stack
- If sorting creates a new array, space is O(n)
- The algorithm itself uses only O(1) extra space for variables

## Common Mistakes

1. **Sorting by the wrong criteria**: Some candidates sort by total units (boxes × units) instead of units per box. This fails because we care about maximizing units per box slot, not per box type. Example: `[[2,5], [10,3]]` - sorting by total units would prioritize the second type (30 total) over first (10 total), but we should take the first type first (5 units/box > 3 units/box).

2. **Forgetting to check remaining capacity**: Not breaking the loop when `remainingCapacity <= 0` wastes iterations. While not incorrect, it's inefficient and shows poor attention to edge cases.

3. **Integer overflow with large numbers**: When `boxes × units` exceeds 32-bit integer limits. Use 64-bit integers (Python handles this automatically, but in Java/C++ be mindful).

4. **Modifying truckSize parameter directly**: If you decrement `truckSize` instead of using a separate `remainingCapacity` variable, you lose the original value which might be needed elsewhere (though not in this specific problem).

## When You'll See This Pattern

This **greedy sorting** pattern appears whenever you need to maximize or minimize something with limited capacity and items have different "value densities":

1. **Maximum Bags With Full Capacity of Rocks (Medium)** - Similar concept: you have bags with current rocks and capacity, and additional rocks to distribute. Sort by the deficit (capacity - current) to fill bags needing the fewest rocks first.

2. **Assign Cookies (Easy)** - Sort children's greed factors and cookie sizes, then match smallest sufficient cookie to each child.

3. **Minimum Cost to Hire K Workers (Hard)** - More advanced: sort workers by wage/quality ratio, then use a heap to maintain the k workers with smallest quality.

The key insight: when you can take fractional items or items independently, sorting by "value per unit of constraint" often yields the optimal solution.

## Key Takeaways

1. **Greedy with sorting works when items are independent** - If taking one box doesn't affect the "value density" of other boxes (unlike knapsack where weight changes value), sorting by value density gives optimal solution.

2. **Look for "per unit" metrics** - When a constraint limits quantity (boxes, weight, time), consider sorting by value per constrained unit. Here: units per box slot.

3. **Prove greedy optimality by exchange argument** - To convince yourself (or interviewer) this works: imagine any optimal solution that doesn't take highest-unit boxes first. You can swap a lower-unit box for a higher-unit one, improving the solution → contradiction.

Related problems: [Maximum Bags With Full Capacity of Rocks](/problem/maximum-bags-with-full-capacity-of-rocks)
