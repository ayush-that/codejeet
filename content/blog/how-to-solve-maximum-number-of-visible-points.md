---
title: "How to Solve Maximum Number of Visible Points — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Visible Points. Hard difficulty, 38.0% acceptance rate. Topics: Array, Math, Geometry, Sliding Window, Sorting."
date: "2028-07-01"
category: "dsa-patterns"
tags: ["maximum-number-of-visible-points", "array", "math", "geometry", "hard"]
---

## How to Solve Maximum Number of Visible Points

You're given a list of points, your location, and an angle representing your field of view. You need to find the maximum number of points you can see without moving. The challenge is that you can rotate your view, but only within the given angle. What makes this tricky is converting the 2D geometry into a solvable computational problem—specifically, handling angles correctly and dealing with points at your exact location.

**Why this problem is interesting:**  
It combines geometry (angle calculations), sorting, and a sliding window technique. The key difficulty is converting Cartesian coordinates into angles relative to your position, then finding the largest cluster of angles within your viewing angle. You also need special handling for points exactly at your location.

---

## Visual Walkthrough

Let's walk through a small example:

**Input:**

- `points = [[2,1],[2,2],[3,3]]`
- `angle = 90`
- `location = [1,1]`

**Step 1: Convert points to angles relative to your location**

- Point `[2,1]`: Directly east (0°)
- Point `[2,2]`: 45° northeast
- Point `[3,3]`: ~63.4° northeast

**Step 2: Handle points at your location**
None of these points are at `[1,1]`, so we have 0 "always visible" points.

**Step 3: Sort the angles**
Angles: [0°, 45°, 63.4°]

**Step 4: Use sliding window to find maximum points within 90°**

- Start with window from 0° to 90°: includes all 3 points
- That's our maximum: 3 points

**Key insight:** We need to handle the circular nature of angles (360° wraps to 0°). If we have angles like [350°, 10°, 20°] with a 30° field of view, the window might need to wrap around 360°.

---

## Brute Force Approach

A naive approach would be to try every possible starting direction and count how many points fall within that viewing angle. For each of the n points, you'd check all other points to see if their angle falls within `[start, start + angle]`. This requires checking n starting points, and for each, checking all n other points.

**Why it fails:**  
This is O(n²) time complexity, which is too slow for n up to 10⁵. The problem requires an O(n log n) solution. The brute force also doesn't efficiently handle the circular nature of angles.

---

## Optimized Approach

The key insight is to convert this into a **sliding window problem on a sorted list of angles**.

**Step-by-step reasoning:**

1. **Convert to angles:** For each point (except your location), calculate the angle from your position using `atan2(dy, dx)`. This gives angles in radians from -π to π.

2. **Handle points at your location:** Count these separately since they're always visible regardless of viewing direction.

3. **Sort the angles:** This allows us to use a sliding window to efficiently find the maximum number of points within any angle window.

4. **Handle circular wrap-around:** Duplicate the angle list with 360° added to each angle. This lets us treat angles like 350° and 10° as being close together (350° and 370°).

5. **Sliding window:** Maintain a window where `angles[right] - angles[left] <= angle`. The window size tells us how many points are visible from that starting direction.

**Why this works:**  
By sorting and using the sliding window, we reduce the problem from checking every pair to a linear scan after sorting. The circular handling via duplication is a common pattern for angular problems.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) - sorting dominates
# Space: O(n) - storing angles
import math

def visiblePoints(points, angle, location):
    # Step 1: Count points at the observer's location
    # These are always visible regardless of viewing angle
    same_location = 0
    angles = []

    px, py = location

    for x, y in points:
        # Check if point is at observer's location
        if x == px and y == py:
            same_location += 1
            continue

        # Calculate angle from observer to point
        # atan2 returns angle in radians between -π and π
        # We convert to degrees for easier comparison with given angle
        dx = x - px
        dy = y - py
        angle_rad = math.atan2(dy, dx)
        angle_deg = math.degrees(angle_rad)

        # Convert negative angles to positive (0 to 360 range)
        if angle_deg < 0:
            angle_deg += 360

        angles.append(angle_deg)

    # Step 2: Sort angles to enable sliding window
    angles.sort()

    # Step 3: Handle circular nature by duplicating angles with +360
    # This allows windows that cross the 360° boundary
    angles_extended = angles + [a + 360 for a in angles]

    # Step 4: Sliding window to find maximum visible points
    max_visible = 0
    left = 0

    for right in range(len(angles_extended)):
        # Shrink window from left while current angle difference > allowed angle
        while angles_extended[right] - angles_extended[left] > angle:
            left += 1

        # Update maximum visible points in current window
        # right - left + 1 gives number of points in current window
        max_visible = max(max_visible, right - left + 1)

    # Add points that were at observer's location (always visible)
    return max_visible + same_location
```

```javascript
// Time: O(n log n) - sorting dominates
// Space: O(n) - storing angles
function visiblePoints(points, angle, location) {
  // Step 1: Count points at observer's location
  let sameLocation = 0;
  const angles = [];

  const [px, py] = location;

  for (const [x, y] of points) {
    // Check if point is at observer's location
    if (x === px && y === py) {
      sameLocation++;
      continue;
    }

    // Calculate angle from observer to point
    const dx = x - px;
    const dy = y - py;
    // Math.atan2 returns angle in radians between -π and π
    let angleRad = Math.atan2(dy, dx);
    // Convert to degrees (0 to 360 range)
    let angleDeg = angleRad * (180 / Math.PI);

    // Convert negative angles to positive
    if (angleDeg < 0) {
      angleDeg += 360;
    }

    angles.push(angleDeg);
  }

  // Step 2: Sort angles for sliding window
  angles.sort((a, b) => a - b);

  // Step 3: Handle circular wrap-around by duplicating with +360
  const anglesExtended = [...angles, ...angles.map((a) => a + 360)];

  // Step 4: Sliding window to find maximum visible points
  let maxVisible = 0;
  let left = 0;

  for (let right = 0; right < anglesExtended.length; right++) {
    // Shrink window from left while angle difference exceeds allowed angle
    while (anglesExtended[right] - anglesExtended[left] > angle) {
      left++;
    }

    // Update maximum with current window size
    maxVisible = Math.max(maxVisible, right - left + 1);
  }

  // Add points at observer's location (always visible)
  return maxVisible + sameLocation;
}
```

```java
// Time: O(n log n) - sorting dominates
// Space: O(n) - storing angles
import java.util.*;

class Solution {
    public int visiblePoints(List<List<Integer>> points, int angle, List<Integer> location) {
        // Step 1: Count points at observer's location
        int sameLocation = 0;
        List<Double> angles = new ArrayList<>();

        int px = location.get(0);
        int py = location.get(1);

        for (List<Integer> point : points) {
            int x = point.get(0);
            int y = point.get(1);

            // Check if point is at observer's location
            if (x == px && y == py) {
                sameLocation++;
                continue;
            }

            // Calculate angle from observer to point
            int dx = x - px;
            int dy = y - py;
            // Math.atan2 returns angle in radians between -π and π
            double angleRad = Math.atan2(dy, dx);
            // Convert to degrees (0 to 360 range)
            double angleDeg = Math.toDegrees(angleRad);

            // Convert negative angles to positive
            if (angleDeg < 0) {
                angleDeg += 360;
            }

            angles.add(angleDeg);
        }

        // Step 2: Sort angles for sliding window
        Collections.sort(angles);

        // Step 3: Handle circular wrap-around by duplicating with +360
        List<Double> anglesExtended = new ArrayList<>(angles);
        for (double a : angles) {
            anglesExtended.add(a + 360);
        }

        // Step 4: Sliding window to find maximum visible points
        int maxVisible = 0;
        int left = 0;

        for (int right = 0; right < anglesExtended.size(); right++) {
            // Shrink window from left while angle difference exceeds allowed angle
            while (anglesExtended.get(right) - anglesExtended.get(left) > angle) {
                left++;
            }

            // Update maximum with current window size
            maxVisible = Math.max(maxVisible, right - left + 1);
        }

        // Add points at observer's location (always visible)
        return maxVisible + sameLocation;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating angles for n points: O(n)
- Sorting n angles: O(n log n) ← Dominant term
- Sliding window on 2n angles: O(2n) = O(n)
- Total: O(n log n)

**Space Complexity: O(n)**

- Storing angles for n points: O(n)
- Extended angles array (2n elements): O(2n) = O(n)
- No recursion or deep call stacks

---

## Common Mistakes

1. **Forgetting to handle points at your location:** These should be counted separately since they're always visible. If you include them in the angle calculation, you'll get incorrect results.

2. **Not handling the circular nature of angles:** Angles wrap around at 360°. Without duplicating the array with +360°, you'll miss windows that cross the 0°/360° boundary.

3. **Using the wrong angle range:** `atan2` returns angles in radians between -π and π. You need to convert to degrees (0-360) to match the input angle. Forgetting to convert negative angles to positive will break the sliding window.

4. **Off-by-one errors in sliding window:** The condition should be `while (angles[right] - angles[left] > angle)` not `>=`. If the difference equals the angle, the point is still visible (at the edge of your field of view).

---

## When You'll See This Pattern

This problem combines several patterns that appear in other coding problems:

1. **Sliding Window on Sorted Array:** Similar to problems like:
   - [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) - maintaining a window of unique characters
   - [Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/) - finding optimal contiguous segments

2. **Angular/Circular Problems:** Problems involving angles or circular arrays:
   - [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference/) - finding smallest difference between circular time points
   - [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/) - handling indices that wrap around

3. **Geometry to Computation Conversion:** Like problems that reduce spatial relationships to sortable values:
   - [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) - converting buildings to height events
   - [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/) - grouping points by slope

---

## Key Takeaways

1. **Convert geometry to sortable data:** Many geometry problems become tractable when you convert points, angles, or distances into a sorted list you can scan efficiently.

2. **Handle circular data with duplication:** When dealing with angles, times, or circular arrays, duplicate the data with an offset (like +360°) to handle wrap-around cases linearly.

3. **Sliding window on sorted data is powerful:** If you need to find the largest cluster within a range, sorting + sliding window often gives O(n log n) solution after O(n log n) sort.

---

[Practice this problem on CodeJeet](/problem/maximum-number-of-visible-points)
