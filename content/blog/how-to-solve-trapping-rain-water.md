---
title: "How to Solve Trapping Rain Water — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Trapping Rain Water. Hard difficulty, 66.8% acceptance rate. Topics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack."
date: "2026-03-19"
category: "dsa-patterns"
tags: ["trapping-rain-water", "array", "two-pointers", "dynamic-programming", "hard"]
---

# How to Solve Trapping Rain Water

The Trapping Rain Water problem asks you to calculate the total amount of rainwater that can be trapped between bars of varying heights. What makes this problem interesting is that water trapped at any position depends not just on its immediate neighbors, but on the highest bars to its left and right—it's a problem about global constraints affecting local calculations.

## Visual Walkthrough

Let's trace through a concrete example: `[0,1,0,2,1,0,1,3,2,1,2,1]`

At index 4 (height = 0), how much water can be trapped here?

- Look left: The maximum height to the left is 2 (at index 3)
- Look right: The maximum height to the right is 3 (at index 7)
- The water level will be the minimum of these two maximums: min(2, 3) = 2
- Subtract the ground height: 2 - 0 = 2 units of water

But at index 0 (height = 0):

- Left max: 0 (no bars to the left)
- Right max: 3
- Water level: min(0, 3) = 0
- Water trapped: 0 - 0 = 0 (water spills off the edge)

The key insight: For each position `i`, water trapped = `min(max_left, max_right) - height[i]`, but only if this value is positive.

## Brute Force Approach

The most straightforward approach is to calculate left and right maximums for every position:

For each index `i`:

1. Scan left from `i` to find maximum height
2. Scan right from `i` to find maximum height
3. Calculate water = min(left_max, right_max) - height[i]
4. Add to total if positive

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def trap_brute_force(height):
    total_water = 0
    n = len(height)

    for i in range(n):
        # Find maximum height to the left of i
        left_max = 0
        for j in range(i, -1, -1):
            left_max = max(left_max, height[j])

        # Find maximum height to the right of i
        right_max = 0
        for j in range(i, n):
            right_max = max(right_max, height[j])

        # Water trapped at i is limited by the shorter of the two walls
        water = min(left_max, right_max) - height[i]
        if water > 0:
            total_water += water

    return total_water
```

```javascript
// Time: O(n²) | Space: O(1)
function trapBruteForce(height) {
  let totalWater = 0;
  const n = height.length;

  for (let i = 0; i < n; i++) {
    // Find maximum height to the left of i
    let leftMax = 0;
    for (let j = i; j >= 0; j--) {
      leftMax = Math.max(leftMax, height[j]);
    }

    // Find maximum height to the right of i
    let rightMax = 0;
    for (let j = i; j < n; j++) {
      rightMax = Math.max(rightMax, height[j]);
    }

    // Water trapped at i is limited by the shorter of the two walls
    const water = Math.min(leftMax, rightMax) - height[i];
    if (water > 0) {
      totalWater += water;
    }
  }

  return totalWater;
}
```

```java
// Time: O(n²) | Space: O(1)
public int trapBruteForce(int[] height) {
    int totalWater = 0;
    int n = height.length;

    for (int i = 0; i < n; i++) {
        // Find maximum height to the left of i
        int leftMax = 0;
        for (int j = i; j >= 0; j--) {
            leftMax = Math.max(leftMax, height[j]);
        }

        // Find maximum height to the right of i
        int rightMax = 0;
        for (int j = i; j < n; j++) {
            rightMax = Math.max(rightMax, height[j]);
        }

        // Water trapped at i is limited by the shorter of the two walls
        int water = Math.min(leftMax, rightMax) - height[i];
        if (water > 0) {
            totalWater += water;
        }
    }

    return totalWater;
}
```

</div>

**Why this is inefficient:** For each of `n` positions, we scan up to `n` positions to find maximums, giving us O(n²) time complexity. For large inputs (n = 10⁵), this would be far too slow.

## Optimized Approach

The brute force solution does redundant work—it recalculates maximums repeatedly. We can optimize by precomputing:

**Dynamic Programming Approach:**

1. Create `left_max` array where `left_max[i]` = maximum height from index 0 to i
2. Create `right_max` array where `right_max[i]` = maximum height from index i to n-1
3. For each position i: water = min(left_max[i], right_max[i]) - height[i]

This reduces time to O(n) but uses O(n) space.

**Two Pointer Approach (Optimal):**
We can do even better with O(1) space using two pointers. The key insight: At any position, the water level is determined by the smaller of the two maximum walls. So we can:

1. Use `left` and `right` pointers at both ends
2. Track `left_max` and `right_max` as we move inward
3. At each step, process the side with the smaller current maximum
4. If the current height is less than the relevant maximum, water can be trapped

Why this works: When `height[left] < height[right]`, we know that the water level at `left` is bounded by `left_max` (since the right side has at least `height[right]` which is greater). This lets us calculate water at `left` without knowing the exact right maximum for that position.

## Optimal Solution

Here's the two-pointer solution with O(n) time and O(1) space:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def trap(height):
    if not height:
        return 0

    left, right = 0, len(height) - 1
    left_max = right_max = 0
    total_water = 0

    while left < right:
        # Process the side with smaller current height
        if height[left] < height[right]:
            # Update left_max if current height is greater
            if height[left] >= left_max:
                left_max = height[left]
            else:
                # Water can be trapped here since left_max > height[left]
                total_water += left_max - height[left]
            left += 1
        else:
            # Process right side
            if height[right] >= right_max:
                right_max = height[right]
            else:
                # Water can be trapped here since right_max > height[right]
                total_water += right_max - height[right]
            right -= 1

    return total_water
```

```javascript
// Time: O(n) | Space: O(1)
function trap(height) {
  if (!height.length) return 0;

  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    // Process the side with smaller current height
    if (height[left] < height[right]) {
      // Update leftMax if current height is greater
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        // Water can be trapped here since leftMax > height[left]
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      // Process right side
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        // Water can be trapped here since rightMax > height[right]
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}
```

```java
// Time: O(n) | Space: O(1)
public int trap(int[] height) {
    if (height == null || height.length == 0) {
        return 0;
    }

    int left = 0;
    int right = height.length - 1;
    int leftMax = 0;
    int rightMax = 0;
    int totalWater = 0;

    while (left < right) {
        // Process the side with smaller current height
        if (height[left] < height[right]) {
            // Update leftMax if current height is greater
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                // Water can be trapped here since leftMax > height[left]
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            // Process right side
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                // Water can be trapped here since rightMax > height[right]
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }

    return totalWater;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) - We traverse the array once with two pointers, processing each element exactly once.

**Space Complexity:** O(1) - We only use a few integer variables regardless of input size. The two-pointer approach achieves optimal space usage.

The dynamic programming approach would also be O(n) time but O(n) space, which is acceptable but not optimal for space.

## Common Mistakes

1. **Forgetting to handle empty or single-element arrays:** Always check edge cases first. If there are fewer than 3 bars, no water can be trapped.

2. **Incorrect water calculation:** Remember: `water = min(left_max, right_max) - height[i]`, not `(left_max + right_max) / 2 - height[i]`. The water level is limited by the shorter wall.

3. **Off-by-one errors with two pointers:** The loop condition should be `while left < right` not `while left <= right`. When pointers meet, we've processed all positions.

4. **Not updating maximums correctly:** When you see a taller bar, update the maximum before calculating water. If you calculate water first, you might use an outdated maximum.

5. **Misunderstanding when water can be trapped:** Water can only be trapped when the current height is less than both left and right maximums. If it's equal to or greater than one of them, no water is trapped at that position.

## When You'll See This Pattern

The "trapping water" pattern appears in problems where the solution at each position depends on global extremes (maximums/minimums to the left and right). Similar techniques apply to:

1. **Container With Most Water** - Also uses two pointers moving inward, but calculates area differently (width × min(height[left], height[right])).

2. **Product of Array Except Self** - Requires computing products of all elements to the left and right of each position, similar to computing left/right maximums.

3. **Largest Rectangle in Histogram** - Uses a monotonic stack to track increasing heights, similar in concept to tracking boundaries for water trapping.

4. **Trapping Rain Water II** - The 2D version that extends the same concept to a matrix, requiring more complex boundary tracking.

## Key Takeaways

1. **Local solutions depend on global constraints:** When a problem requires calculating something at each position based on extremes to its left and right, think about precomputing left/right maximums or using two pointers.

2. **Two pointers work when processing from both ends:** If you can determine which side to process based on comparing current values (like `height[left] < height[right]`), you can often achieve O(1) space.

3. **The "water level" principle:** In trapping problems, the limiting factor is always the minimum of the two bounding walls, not the average or maximum.

4. **Edge cases matter:** Always check for empty arrays, single elements, and monotonic sequences (strictly increasing or decreasing) where no water can be trapped.

Related problems: [Container With Most Water](/problem/container-with-most-water), [Product of Array Except Self](/problem/product-of-array-except-self), [Trapping Rain Water II](/problem/trapping-rain-water-ii)
