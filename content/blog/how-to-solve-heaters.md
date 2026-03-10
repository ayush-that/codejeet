---
title: "How to Solve Heaters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Heaters. Medium difficulty, 41.4% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2026-06-26"
category: "dsa-patterns"
tags: ["heaters", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Heaters

You're given two arrays: `houses` (positions of houses) and `heaters` (positions of heaters). Each heater can warm houses within a fixed radius. Your task is to find the **minimum radius** that allows all houses to be warmed by at least one heater.

What makes this problem interesting is that it's not about finding which heater warms which house, but finding the **minimum coverage radius** that makes the entire system work. It's essentially a **coverage problem** on a number line.

## Visual Walkthrough

Let's trace through a concrete example:

- Houses: [1, 2, 3, 4]
- Heaters: [1, 4]

**Step 1:** Sort both arrays (they might not be sorted initially)

- Houses: [1, 2, 3, 4] (already sorted)
- Heaters: [1, 4] (already sorted)

**Step 2:** For each house, find the closest heater:

- House at position 1: Closest heater is at position 1 → distance = 0
- House at position 2: Closest heater is at position 1 → distance = 1
- House at position 3: Closest heater is at position 4 → distance = 1
- House at position 4: Closest heater is at position 4 → distance = 0

**Step 3:** The minimum radius needed is the **maximum** of these distances: max(0, 1, 1, 0) = 1

So with radius 1, heater at position 1 warms houses 1 and 2, and heater at position 4 warms houses 3 and 4.

## Brute Force Approach

The most straightforward approach is to check every house against every heater:

1. For each house, calculate the distance to every heater
2. Keep track of the minimum distance for that house
3. The answer is the maximum of all these minimum distances

This approach is O(m × n) where m is number of houses and n is number of heaters. For large inputs (up to 3×10⁴ each), this could be up to 900 million operations — far too slow.

<div class="code-group">

```python
# Time: O(m × n) | Space: O(1)
def findRadiusBruteForce(houses, heaters):
    max_radius = 0

    for house in houses:
        min_distance = float('inf')
        for heater in heaters:
            distance = abs(house - heater)
            min_distance = min(min_distance, distance)
        max_radius = max(max_radius, min_distance)

    return max_radius
```

```javascript
// Time: O(m × n) | Space: O(1)
function findRadiusBruteForce(houses, heaters) {
  let maxRadius = 0;

  for (let house of houses) {
    let minDistance = Infinity;
    for (let heater of heaters) {
      const distance = Math.abs(house - heater);
      minDistance = Math.min(minDistance, distance);
    }
    maxRadius = Math.max(maxRadius, minDistance);
  }

  return maxRadius;
}
```

```java
// Time: O(m × n) | Space: O(1)
public int findRadiusBruteForce(int[] houses, int[] heaters) {
    int maxRadius = 0;

    for (int house : houses) {
        int minDistance = Integer.MAX_VALUE;
        for (int heater : heaters) {
            int distance = Math.abs(house - heater);
            minDistance = Math.min(minDistance, distance);
        }
        maxRadius = Math.max(maxRadius, minDistance);
    }

    return maxRadius;
}
```

</div>

## Optimized Approach

The key insight is that **we don't need to check every heater for every house**. Since both arrays represent positions on a number line, we can use sorting and binary search or two pointers:

**Option 1: Sorting + Binary Search (Easier to implement)**

1. Sort the heaters array
2. For each house, use binary search to find the closest heater
3. Track the maximum distance found

**Option 2: Sorting + Two Pointers (More efficient)**

1. Sort both arrays
2. Use two pointers: one for houses, one for heaters
3. For each house, find the closest heater by moving the heater pointer

The binary search approach is O(m log n) which is acceptable. The two pointers approach is O(m log m + n log n) for sorting plus O(m + n) for the main logic.

**Why this works:** After sorting, for each house, the closest heater will be either:

- The heater at or just before the house (if it exists)
- The heater just after the house (if it exists)

We need to check both neighbors when using binary search, or track the "current" and "next" heater when using two pointers.

## Optimal Solution

Here's the binary search approach, which is clean and efficient:

<div class="code-group">

```python
# Time: O(m log n + n log n) where m = len(houses), n = len(heaters)
# Space: O(1) if we sort in-place, O(n) if we create a sorted copy
def findRadius(houses, heaters):
    # Step 1: Sort heaters to enable binary search
    heaters.sort()

    max_radius = 0

    # Step 2: For each house, find the closest heater using binary search
    for house in houses:
        # Use bisect_left to find insertion point
        import bisect
        pos = bisect.bisect_left(heaters, house)

        # Calculate distances to potential closest heaters
        # Case 1: House is before all heaters (pos == 0)
        if pos == 0:
            distance = heaters[0] - house
        # Case 2: House is after all heaters (pos == len(heaters))
        elif pos == len(heaters):
            distance = house - heaters[-1]
        # Case 3: House is between heaters - check both neighbors
        else:
            left_distance = house - heaters[pos - 1]
            right_distance = heaters[pos] - house
            distance = min(left_distance, right_distance)

        # Step 3: Update maximum radius needed
        max_radius = max(max_radius, distance)

    return max_radius
```

```javascript
// Time: O(m log n + n log n) where m = houses.length, n = heaters.length
// Space: O(1) if we sort in-place, O(n) if we create a sorted copy
function findRadius(houses, heaters) {
  // Step 1: Sort heaters to enable binary search
  heaters.sort((a, b) => a - b);

  let maxRadius = 0;

  // Step 2: For each house, find the closest heater using binary search
  for (let house of houses) {
    // Binary search to find insertion point
    let left = 0,
      right = heaters.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (heaters[mid] < house) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const pos = left;

    // Calculate distances to potential closest heaters
    let distance;
    // Case 1: House is before all heaters (pos == 0)
    if (pos === 0) {
      distance = heaters[0] - house;
    }
    // Case 2: House is after all heaters (pos == heaters.length)
    else if (pos === heaters.length) {
      distance = house - heaters[heaters.length - 1];
    }
    // Case 3: House is between heaters - check both neighbors
    else {
      const leftDistance = house - heaters[pos - 1];
      const rightDistance = heaters[pos] - house;
      distance = Math.min(leftDistance, rightDistance);
    }

    // Step 3: Update maximum radius needed
    maxRadius = Math.max(maxRadius, distance);
  }

  return maxRadius;
}
```

```java
// Time: O(m log n + n log n) where m = houses.length, n = heaters.length
// Space: O(1) if we sort in-place, O(n) if we create a sorted copy
import java.util.Arrays;

public int findRadius(int[] houses, int[] heaters) {
    // Step 1: Sort heaters to enable binary search
    Arrays.sort(heaters);

    int maxRadius = 0;

    // Step 2: For each house, find the closest heater using binary search
    for (int house : houses) {
        // Binary search to find insertion point
        int left = 0, right = heaters.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (heaters[mid] < house) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        int pos = left;

        // Calculate distances to potential closest heaters
        int distance;
        // Case 1: House is before all heaters (pos == 0)
        if (pos == 0) {
            distance = heaters[0] - house;
        }
        // Case 2: House is after all heaters (pos == heaters.length)
        else if (pos == heaters.length) {
            distance = house - heaters[heaters.length - 1];
        }
        // Case 3: House is between heaters - check both neighbors
        else {
            int leftDistance = house - heaters[pos - 1];
            int rightDistance = heaters[pos] - house;
            distance = Math.min(leftDistance, rightDistance);
        }

        // Step 3: Update maximum radius needed
        maxRadius = Math.max(maxRadius, distance);
    }

    return maxRadius;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting heaters: O(n log n) where n is number of heaters
- For each house (m houses): binary search takes O(log n)
- Total: O(m log n + n log n)

**Space Complexity:**

- O(1) if we sort in-place (Python's `sort()` and Java's `Arrays.sort()` are in-place)
- O(n) if the language creates a new sorted array
- We only use a few extra variables (max_radius, distance, etc.)

The two pointers approach would have time complexity O(m log m + n log n + m + n) for sorting both arrays plus the linear pass.

## Common Mistakes

1. **Forgetting to sort the heaters array:** Binary search only works on sorted arrays. If you skip sorting, your binary search will give incorrect results.

2. **Only checking one neighbor in binary search:** When a house falls between two heaters, you must check both the heater before and after it. The closest could be either one.

3. **Off-by-one errors with binary search boundaries:** Be careful with the cases where `pos == 0` (house before all heaters) and `pos == len(heaters)` (house after all heaters). Accessing `heaters[pos]` when `pos == len(heaters)` will cause an index out of bounds error.

4. **Assuming houses array is sorted:** The problem doesn't guarantee houses are sorted. If you use two pointers approach, you must sort houses too. With binary search, houses don't need to be sorted.

5. **Integer overflow in distance calculations:** Use `abs()` function to handle negative positions (though the problem states positions are on a horizontal line, they could be negative).

## When You'll See This Pattern

This problem combines **sorting** with **binary search** to find the closest element in a sorted array — a common pattern in many problems:

1. **Find K Closest Elements (LeetCode 658):** Find k closest elements to a target value in a sorted array. Similar binary search approach to find the insertion point.

2. **Minimum Absolute Difference (LeetCode 1200):** Find pairs with the minimum absolute difference. Sorting first makes the problem much easier.

3. **H-Index II (LeetCode 275):** Binary search in a sorted array to find a threshold value.

4. **Search Insert Position (LeetCode 35):** The core binary search used here is exactly the "search insert position" problem.

The pattern is: when you need to find something "closest" in value, and you have the ability to sort the data, binary search is often the right tool.

## Key Takeaways

1. **Sorting enables efficient searching:** When dealing with positions on a line and looking for "closest" elements, sorting transforms an O(n²) problem into O(n log n).

2. **Binary search finds insertion points:** The `bisect_left` operation (or manual binary search) doesn't just find exact matches — it finds where an element would be inserted, which tells you about neighboring elements.

3. **Coverage problems often reduce to max-of-mins:** The minimum radius to cover all houses is the maximum of the minimum distances from each house to any heater. This "max of mins" pattern appears in other coverage problems too.

[Practice this problem on CodeJeet](/problem/heaters)
