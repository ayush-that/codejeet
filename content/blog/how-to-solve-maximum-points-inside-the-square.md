---
title: "How to Solve Maximum Points Inside the Square — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Points Inside the Square. Medium difficulty, 39.2% acceptance rate. Topics: Array, Hash Table, String, Binary Search, Sorting."
date: "2029-10-23"
category: "dsa-patterns"
tags: ["maximum-points-inside-the-square", "array", "hash-table", "string", "medium"]
---

# How to Solve Maximum Points Inside the Square

This problem asks us to find the maximum number of points we can enclose in a square centered at the origin, with edges parallel to the axes, while obeying one critical constraint: **no two points with the same tag can be inside the square**. The square's size is determined by its half-side length, which we'll call `k`. The challenge is that we can't simply take all points within a certain distance — we must carefully choose `k` to maximize points while respecting the tag uniqueness constraint.

What makes this interesting is the interplay between geometry (distance from origin) and hash table logic (tag uniqueness). The optimal solution requires sorting points by their "bounding distance" and processing them in increasing order.

## Visual Walkthrough

Let's trace through an example:

```
points = [[2,2], [-1,-2], [-4,4], [-3,1], [0,4]]
s = "abdca"
```

**Step 1: Calculate distances**
For a square centered at (0,0) with half-side length `k`, a point (x,y) is inside if `max(|x|, |y|) ≤ k`. This `max(|x|, |y|)` is the key metric — let's call it the "bounding distance."

Calculate for each point:

- (2,2): max(|2|,|2|) = 2, tag 'a'
- (-1,-2): max(|-1|,|-2|) = 2, tag 'b'
- (-4,4): max(|-4|,|4|) = 4, tag 'd'
- (-3,1): max(|-3|,|1|) = 3, tag 'c'
- (0,4): max(|0|,|4|) = 4, tag 'a'

**Step 2: Sort by distance**
Sorted points by bounding distance:

- Distance 2: (2,2,'a'), (-1,-2,'b')
- Distance 3: (-3,1,'c')
- Distance 4: (-4,4,'d'), (0,4,'a')

**Step 3: Process in order**
We'll simulate increasing `k` from 0 upward:

- When `k = 2`: We can include both points at distance 2. Tags: 'a' and 'b' (no duplicates). Points = 2.
- When `k = 3`: Add point at distance 3 with tag 'c'. Tags: 'a', 'b', 'c'. Points = 3.
- When `k = 4`: Here's the tricky part. We have two points at distance 4: tag 'd' and tag 'a'. But we already have tag 'a' inside! We can only add 'd', not 'a'. So maximum points = 4.

The answer is 4.

## Brute Force Approach

A naive approach would be to try all possible `k` values and check which points fit. But what `k` values should we try? We could:

1. Try every possible `k` from 0 up to the maximum bounding distance
2. For each `k`, collect all points with `max(|x|,|y|) ≤ k`
3. Check if any tags appear more than once in this collection
4. If valid, count the points

The problem? This is O(n²) in the worst case (checking n points for n different `k` values). With n up to 10⁵, this is far too slow.

Even worse, a candidate might try to binary search on `k` without realizing the monotonicity is broken by the tag constraint. If we increase `k`, we might add a point with a duplicate tag, forcing us to remove a previous point, so the number of valid points doesn't increase monotonically with `k`.

## Optimized Approach

The key insight: **Process points in order of increasing bounding distance.** As we expand our square, we add points one by one. If we ever encounter a duplicate tag, we must decide: do we keep the old point or the new one?

Actually, there's a simpler realization: **Once a tag appears twice among points within our current distance, we must stop expanding.** Why? Because if we have two points with the same tag at distances d₁ and d₂ (with d₁ ≤ d₂), then for any square large enough to include the farther point (d₂), it will also include the nearer point (d₁), creating a duplicate tag violation.

Therefore, the algorithm becomes:

1. For each point, compute its bounding distance `max(|x|,|y|)`
2. Sort points by this distance
3. Process points in increasing distance order
4. Keep track of tags we've seen
5. If we encounter a tag we've already seen, we've reached our limit — the answer is how many unique tags we've seen so far
6. Otherwise, add the tag to our set and continue

Wait, there's a subtlety! What if multiple points have the same distance? We need to handle all points at the same distance together, because we might be able to choose some but not all of them.

The correct approach: **Group points by distance, process each group, and if any tag appears twice within a group, we stop at the previous distance.**

## Optimal Solution

We'll sort points by distance, then process them group by group. For each distance group:

1. Check if any tag appears twice within the group itself
2. Check if any tag in the group has been seen before
3. If either happens, we can't include this whole group — return the count so far
4. Otherwise, add all tags from the group to our seen set and continue

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxPointsInsideSquare(points, s):
    """
    Find maximum number of points inside a square centered at origin
    without containing two points with the same tag.

    Args:
        points: List of [x, y] coordinates
        s: String where s[i] is tag of points[i]

    Returns:
        Maximum number of points satisfying constraints
    """
    n = len(points)
    # Step 1: Create list of (distance, tag) pairs
    point_data = []
    for i in range(n):
        x, y = points[i]
        # Distance is max(|x|, |y|) for axis-aligned square
        dist = max(abs(x), abs(y))
        tag = s[i]
        point_data.append((dist, tag))

    # Step 2: Sort by distance (primary) and tag (secondary for consistency)
    point_data.sort()

    # Step 3: Process points in order
    seen_tags = set()
    result = 0
    i = 0

    while i < n:
        # Find all points with the same distance
        current_dist = point_data[i][0]
        j = i

        # Step 3a: First, check if current group has duplicate tags
        tags_in_group = set()
        has_duplicate_in_group = False

        while j < n and point_data[j][0] == current_dist:
            tag = point_data[j][1]
            if tag in tags_in_group:
                # Duplicate tag within same distance group
                has_duplicate_in_group = True
            tags_in_group.add(tag)
            j += 1

        # Step 3b: If duplicates within group, we can't take any from this group
        if has_duplicate_in_group:
            return result

        # Step 3c: Check if any tag in group was seen before
        can_take_group = True
        for tag in tags_in_group:
            if tag in seen_tags:
                can_take_group = False
                break

        # Step 3d: If we can't take this group, return current count
        if not can_take_group:
            return result

        # Step 3e: Otherwise, add all tags from this group
        seen_tags.update(tags_in_group)
        result += len(tags_in_group)
        i = j  # Move to next group

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Find maximum number of points inside a square centered at origin
 * without containing two points with the same tag.
 * @param {number[][]} points - Array of [x, y] coordinates
 * @param {string} s - String where s[i] is tag of points[i]
 * @return {number} Maximum number of points satisfying constraints
 */
function maxPointsInsideSquare(points, s) {
  const n = points.length;
  // Step 1: Create array of [distance, tag] pairs
  const pointData = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = points[i];
    // Distance is max(|x|, |y|) for axis-aligned square
    const dist = Math.max(Math.abs(x), Math.abs(y));
    const tag = s[i];
    pointData.push([dist, tag]);
  }

  // Step 2: Sort by distance (primary) and tag (secondary)
  pointData.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1].localeCompare(b[1]);
  });

  // Step 3: Process points in order
  const seenTags = new Set();
  let result = 0;
  let i = 0;

  while (i < n) {
    // Find all points with the same distance
    const currentDist = pointData[i][0];
    let j = i;

    // Step 3a: First, check if current group has duplicate tags
    const tagsInGroup = new Set();
    let hasDuplicateInGroup = false;

    while (j < n && pointData[j][0] === currentDist) {
      const tag = pointData[j][1];
      if (tagsInGroup.has(tag)) {
        // Duplicate tag within same distance group
        hasDuplicateInGroup = true;
      }
      tagsInGroup.add(tag);
      j++;
    }

    // Step 3b: If duplicates within group, we can't take any from this group
    if (hasDuplicateInGroup) {
      return result;
    }

    // Step 3c: Check if any tag in group was seen before
    let canTakeGroup = true;
    for (const tag of tagsInGroup) {
      if (seenTags.has(tag)) {
        canTakeGroup = false;
        break;
      }
    }

    // Step 3d: If we can't take this group, return current count
    if (!canTakeGroup) {
      return result;
    }

    // Step 3e: Otherwise, add all tags from this group
    for (const tag of tagsInGroup) {
      seenTags.add(tag);
    }
    result += tagsInGroup.size;
    i = j; // Move to next group
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Find maximum number of points inside a square centered at origin
     * without containing two points with the same tag.
     * @param points Array of [x, y] coordinates
     * @param s String where s.charAt(i) is tag of points[i]
     * @return Maximum number of points satisfying constraints
     */
    public int maxPointsInsideSquare(int[][] points, String s) {
        int n = points.length;
        // Step 1: Create array of PointData objects
        PointData[] pointData = new PointData[n];
        for (int i = 0; i < n; i++) {
            int x = points[i][0];
            int y = points[i][1];
            // Distance is max(|x|, |y|) for axis-aligned square
            int dist = Math.max(Math.abs(x), Math.abs(y));
            char tag = s.charAt(i);
            pointData[i] = new PointData(dist, tag);
        }

        // Step 2: Sort by distance (primary) and tag (secondary)
        Arrays.sort(pointData, (a, b) -> {
            if (a.dist != b.dist) return a.dist - b.dist;
            return Character.compare(a.tag, b.tag);
        });

        // Step 3: Process points in order
        Set<Character> seenTags = new HashSet<>();
        int result = 0;
        int i = 0;

        while (i < n) {
            // Find all points with the same distance
            int currentDist = pointData[i].dist;
            int j = i;

            // Step 3a: First, check if current group has duplicate tags
            Set<Character> tagsInGroup = new HashSet<>();
            boolean hasDuplicateInGroup = false;

            while (j < n && pointData[j].dist == currentDist) {
                char tag = pointData[j].tag;
                if (tagsInGroup.contains(tag)) {
                    // Duplicate tag within same distance group
                    hasDuplicateInGroup = true;
                }
                tagsInGroup.add(tag);
                j++;
            }

            // Step 3b: If duplicates within group, we can't take any from this group
            if (hasDuplicateInGroup) {
                return result;
            }

            // Step 3c: Check if any tag in group was seen before
            boolean canTakeGroup = true;
            for (char tag : tagsInGroup) {
                if (seenTags.contains(tag)) {
                    canTakeGroup = false;
                    break;
                }
            }

            // Step 3d: If we can't take this group, return current count
            if (!canTakeGroup) {
                return result;
            }

            // Step 3e: Otherwise, add all tags from this group
            seenTags.addAll(tagsInGroup);
            result += tagsInGroup.size();
            i = j;  // Move to next group
        }

        return result;
    }

    // Helper class to store point data
    class PointData {
        int dist;
        char tag;

        PointData(int dist, char tag) {
            this.dist = dist;
            this.tag = tag;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Computing bounding distances: O(n)
- Sorting the points: O(n log n) — this dominates
- Processing points in groups: O(n) — each point visited once
- Total: O(n log n)

**Space Complexity: O(n)**

- Storing the point data with distances: O(n)
- Hash sets for seen tags and group tags: O(n) in worst case
- Sorting in Python/JavaScript uses O(n) space for Timsort; Java uses O(log n) for quicksort variant

The log factor comes from sorting, which is necessary to process points in distance order.

## Common Mistakes

1. **Using Euclidean distance instead of Chebyshev distance**: The square has edges parallel to axes, so a point (x,y) is inside if `max(|x|,|y|) ≤ k`, not `sqrt(x² + y²) ≤ k`. Using Euclidean distance would incorrectly exclude points near the corners.

2. **Not handling same-distance groups properly**: If multiple points share the same bounding distance, you must process them as a group. You can't add them one by one because adding the first might make the second invalid. Check the entire group before adding any.

3. **Assuming monotonicity for binary search**: Some candidates try to binary search on `k`, but the number of valid points isn't monotonic with `k`. If you increase `k`, you might add a point with a duplicate tag, making the configuration invalid.

4. **Forgetting to check for duplicates within a group**: Even if no tag in the current group has been seen before, the group itself might contain duplicate tags (same distance, same tag). This immediately invalidates that distance.

## When You'll See This Pattern

This problem combines **sorting with constraint validation**, a pattern seen in many optimization problems:

1. **Meeting Rooms II (LeetCode 253)**: Sort intervals by start time, process in order, track "conflicts" (overlapping meetings).
2. **Car Fleet (LeetCode 853)**: Sort cars by position, process from farthest to nearest, track arrival times.
3. **Non-overlapping Intervals (LeetCode 435)**: Sort intervals by end time, greedily select non-overlapping ones.

The core pattern: **When you need to make decisions based on some ordering (distance, time, position), sort first, then process in that order while maintaining some state (seen tags, active meetings, etc.).**

## Key Takeaways

1. **For axis-aligned squares centered at origin**, use `max(|x|, |y|)` (Chebyshev distance) not Euclidean distance. This is a common geometric trick.

2. **When constraints involve uniqueness**, process elements in sorted order and maintain a set of "used" items. Stop when you encounter a duplicate.

3. **Group equal-valued elements** when processing sorted data if decisions affect multiple elements at once. Don't process them individually if their fates are linked.

Related problems: [Maximize the Distance Between Points on a Square](/problem/maximize-the-distance-between-points-on-a-square)
