---
title: "How to Solve Maximum Square Area by Removing Fences From a Field — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Square Area by Removing Fences From a Field. Medium difficulty, 49.4% acceptance rate. Topics: Array, Hash Table, Enumeration."
date: "2027-07-08"
category: "dsa-patterns"
tags:
  [
    "maximum-square-area-by-removing-fences-from-a-field",
    "array",
    "hash-table",
    "enumeration",
    "medium",
  ]
---

# How to Solve Maximum Square Area by Removing Fences From a Field

You're given a rectangular field with horizontal and vertical fences placed at specific coordinates. By removing exactly one horizontal and one vertical fence, you can create a larger square opening. The challenge is to find the maximum possible square area you can achieve. What makes this problem interesting is that you need to find the largest _common_ gap distance that exists in both the horizontal and vertical directions after removing fences.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

- m = 4, n = 3 (field from (1,1) to (4,3))
- hFences = [2, 3] (horizontal fences at y=2 and y=3)
- vFences = [2] (vertical fence at x=2)

**Initial field (without removing any fences):**

```
(1,3)---v---(4,3)
 |       |     |
 h       h     h
 |       |     |
(1,2)---v---(4,2)
 |       |     |
 h       h     h
 |       |     |
(1,1)---v---(4,1)
```

Where h = horizontal fence, v = vertical fence

**Step 1: Consider all possible horizontal gaps**
Without removing any fences, horizontal gaps are between consecutive horizontal boundaries: [1, 2, 3, 4]
Gap distances: 1 (between 1-2), 1 (between 2-3), 1 (between 3-4)

**Step 2: Consider removing one horizontal fence**

- Remove fence at y=2: New boundaries become [1, 3, 4]
  Gap distances: 2 (between 1-3), 1 (between 3-4)
- Remove fence at y=3: New boundaries become [1, 2, 4]
  Gap distances: 1 (between 1-2), 2 (between 2-4)

**Step 3: Consider all possible vertical gaps**
Without removing any fences, vertical boundaries: [1, 2, 3]
Gap distances: 1 (between 1-2), 1 (between 2-3)

**Step 4: Consider removing one vertical fence**

- Remove fence at x=2: New boundaries become [1, 3]
  Gap distance: 2 (between 1-3)

**Step 5: Find common gap distances**
Horizontal gap distances available: {1, 2}
Vertical gap distances available: {1, 2}
Common distances: {1, 2}
Maximum common distance: 2

**Step 6: Calculate area**
Maximum square side length = 2
Area = 2 × 2 = 4

## Brute Force Approach

A naive approach would be to try every possible combination of removing one horizontal fence and one vertical fence, then calculate all possible gap distances in both directions, find the maximum common distance, and compute the area.

Here's what that would look like:

1. For each horizontal fence to remove (including "remove none")
2. For each vertical fence to remove (including "remove none")
3. Generate all horizontal boundaries (including 1 and m)
4. Generate all vertical boundaries (including 1 and n)
5. Calculate all horizontal gap distances
6. Calculate all vertical gap distances
7. Find the maximum common distance
8. Track the maximum area

The problem with this approach is its time complexity. With h horizontal fences and v vertical fences, we have (h+1) × (v+1) combinations to try. For each combination, we need to sort boundaries and calculate all pairwise differences, which is O(h²) and O(v²) respectively. This gives us O((h+1)(v+1)(h² + v²)) time complexity, which is far too slow for the constraints (m, n up to 10⁹, fences up to 1000).

## Optimized Approach

The key insight is that we don't need to try every combination of fence removals. Instead, we can:

1. Calculate all possible horizontal gap distances that can be achieved by removing at most one fence
2. Calculate all possible vertical gap distances that can be achieved by removing at most one fence
3. Find the maximum distance that appears in both sets
4. Square that distance to get the maximum area

**Why this works:**

- When we remove a fence, we're effectively merging two adjacent gaps
- The new gap distance is the sum of the two original adjacent gaps
- By including the boundaries (1 and m for horizontal, 1 and n for vertical), we get all possible starting and ending points
- Any gap distance we can create is simply the difference between two boundaries in our set

**Step-by-step reasoning:**

1. **Collect all horizontal boundaries**: Start with 1 and m, add all horizontal fences
2. **Generate all possible horizontal gaps**: For every pair of boundaries, calculate the absolute difference
3. **Collect all vertical boundaries**: Start with 1 and n, add all vertical fences
4. **Generate all possible vertical gaps**: For every pair of boundaries, calculate the absolute difference
5. **Find common maximum**: Use a hash set for efficient lookup of common distances
6. **Calculate area**: Square the maximum common distance

## Optimal Solution

<div class="code-group">

```python
# Time: O(h² + v²) where h = len(hFences), v = len(vFences)
# Space: O(h² + v²) for storing all possible gap distances
def maximizeSquareArea(m, n, hFences, vFences):
    """
    Find the maximum square area achievable by removing at most one
    horizontal fence and at most one vertical fence.

    Args:
        m, n: Field dimensions (corners at (1,1) and (m,n))
        hFences: List of y-coordinates for horizontal fences
        vFences: List of x-coordinates for vertical fences

    Returns:
        Maximum square area modulo 10^9 + 7, or -1 if no square possible
    """
    MOD = 10**9 + 7

    # Step 1: Collect all horizontal boundaries
    # We include the field boundaries (1 and m) plus all fence positions
    h_boundaries = [1, m] + hFences
    # Remove duplicates and sort for consistent gap calculation
    h_boundaries = sorted(set(h_boundaries))

    # Step 2: Generate all possible horizontal gap distances
    h_gaps = set()
    # For each pair of boundaries (i, j) where i < j
    for i in range(len(h_boundaries)):
        for j in range(i + 1, len(h_boundaries)):
            # The gap distance is the difference between boundaries
            gap = h_boundaries[j] - h_boundaries[i]
            h_gaps.add(gap)

    # Step 3: Collect all vertical boundaries
    v_boundaries = [1, n] + vFences
    v_boundaries = sorted(set(v_boundaries))

    # Step 4: Generate all possible vertical gap distances
    v_gaps = set()
    for i in range(len(v_boundaries)):
        for j in range(i + 1, len(v_boundaries)):
            gap = v_boundaries[j] - v_boundaries[i]
            v_gaps.add(gap)

    # Step 5: Find the maximum common gap distance
    max_common = -1
    # Check each horizontal gap to see if it exists in vertical gaps
    for gap in h_gaps:
        if gap in v_gaps:
            max_common = max(max_common, gap)

    # Step 6: Calculate area (gap^2) or return -1 if no common gap
    if max_common == -1:
        return -1
    return (max_common * max_common) % MOD
```

```javascript
// Time: O(h² + v²) where h = hFences.length, v = vFences.length
// Space: O(h² + v²) for storing all possible gap distances
function maximizeSquareArea(m, n, hFences, vFences) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Collect all horizontal boundaries
  // Use Set to remove duplicates, then sort
  const hBoundaries = new Set([1, m, ...hFences]);
  const hSorted = Array.from(hBoundaries).sort((a, b) => a - b);

  // Step 2: Generate all possible horizontal gap distances
  const hGaps = new Set();
  // For each pair of boundaries (i, j) where i < j
  for (let i = 0; i < hSorted.length; i++) {
    for (let j = i + 1; j < hSorted.length; j++) {
      // Gap distance is difference between boundaries
      const gap = hSorted[j] - hSorted[i];
      hGaps.add(gap);
    }
  }

  // Step 3: Collect all vertical boundaries
  const vBoundaries = new Set([1, n, ...vFences]);
  const vSorted = Array.from(vBoundaries).sort((a, b) => a - b);

  // Step 4: Generate all possible vertical gap distances
  const vGaps = new Set();
  for (let i = 0; i < vSorted.length; i++) {
    for (let j = i + 1; j < vSorted.length; j++) {
      const gap = vSorted[j] - vSorted[i];
      vGaps.add(gap);
    }
  }

  // Step 5: Find the maximum common gap distance
  let maxCommon = -1;
  // Check each horizontal gap against vertical gaps
  for (const gap of hGaps) {
    if (vGaps.has(gap)) {
      maxCommon = Math.max(maxCommon, gap);
    }
  }

  // Step 6: Calculate area (gap^2) or return -1 if no common gap
  if (maxCommon === -1) {
    return -1;
  }
  return (maxCommon * maxCommon) % MOD;
}
```

```java
// Time: O(h² + v²) where h = hFences.length, v = vFences.length
// Space: O(h² + v²) for storing all possible gap distances
import java.util.*;

class Solution {
    public int maximizeSquareArea(int m, int n, int[] hFences, int[] vFences) {
        final int MOD = 1_000_000_007;

        // Step 1: Collect all horizontal boundaries
        Set<Integer> hSet = new HashSet<>();
        hSet.add(1);
        hSet.add(m);
        for (int fence : hFences) {
            hSet.add(fence);
        }
        List<Integer> hBoundaries = new ArrayList<>(hSet);
        Collections.sort(hBoundaries);

        // Step 2: Generate all possible horizontal gap distances
        Set<Integer> hGaps = new HashSet<>();
        // For each pair of boundaries (i, j) where i < j
        for (int i = 0; i < hBoundaries.size(); i++) {
            for (int j = i + 1; j < hBoundaries.size(); j++) {
                // Gap distance is difference between boundaries
                int gap = hBoundaries.get(j) - hBoundaries.get(i);
                hGaps.add(gap);
            }
        }

        // Step 3: Collect all vertical boundaries
        Set<Integer> vSet = new HashSet<>();
        vSet.add(1);
        vSet.add(n);
        for (int fence : vFences) {
            vSet.add(fence);
        }
        List<Integer> vBoundaries = new ArrayList<>(vSet);
        Collections.sort(vBoundaries);

        // Step 4: Generate all possible vertical gap distances
        Set<Integer> vGaps = new HashSet<>();
        for (int i = 0; i < vBoundaries.size(); i++) {
            for (int j = i + 1; j < vBoundaries.size(); j++) {
                int gap = vBoundaries.get(j) - vBoundaries.get(i);
                vGaps.add(gap);
            }
        }

        // Step 5: Find the maximum common gap distance
        int maxCommon = -1;
        // Check each horizontal gap against vertical gaps
        for (int gap : hGaps) {
            if (vGaps.contains(gap)) {
                maxCommon = Math.max(maxCommon, gap);
            }
        }

        // Step 6: Calculate area (gap^2) or return -1 if no common gap
        if (maxCommon == -1) {
            return -1;
        }
        // Use long to avoid overflow before modulo
        long area = (long) maxCommon * maxCommon;
        return (int) (area % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(h² + v²)**

- h = number of horizontal fences, v = number of vertical fences
- We generate all pairs of horizontal boundaries: O(h²) where h' = h + 2 (including boundaries)
- We generate all pairs of vertical boundaries: O(v²) where v' = v + 2
- In worst case, h and v can be up to 1000, so h² + v² ≈ 2,000,000 operations, which is acceptable

**Space Complexity: O(h² + v²)**

- We store all horizontal gap distances: O(h²) in worst case
- We store all vertical gap distances: O(v²) in worst case
- We also store the sorted boundaries: O(h + v)

**Why this is optimal:**

- We must consider all possible gap distances in both directions
- Generating all pairs is necessary to find all possible gaps
- Using hash sets for gap storage gives us O(1) lookup for common gaps

## Common Mistakes

1. **Forgetting to include field boundaries (1 and m, 1 and n)**: The field edges themselves are boundaries that can form gaps. Without these, you'll miss gaps that start or end at the field edges.

2. **Not handling duplicate fence positions**: Fences might have duplicate coordinates. Always use a Set or deduplicate before processing to avoid incorrect calculations.

3. **Missing the modulo operation**: The problem requires returning the result modulo 10⁹ + 7. Forgetting this can cause wrong answers for large areas.

4. **Confusing fence positions with gap distances**: Remember that fences are at specific coordinates, but we care about the distances between boundaries (which include fences and field edges).

5. **Inefficient common gap finding**: Some candidates try to sort both gap lists and use two pointers, but using hash sets for O(1) lookups is simpler and efficient enough given the constraints.

## When You'll See This Pattern

This problem uses the **"all pairwise differences"** pattern combined with **set intersection**:

1. **Two Sum / 3Sum problems**: While not identical, they share the concept of examining pairs of elements to find specific relationships.

2. **Maximum Gap (LeetCode 164)**: Similar in that you need to find gaps between sorted elements, though that problem focuses on consecutive gaps rather than all pairs.

3. **Rectangle Area problems**: Many geometry problems require finding common dimensions or alignments between horizontal and vertical segments.

4. **"Maximize Area of Square Hole in Grid"**: This is the most directly related problem, using almost identical logic for finding maximum common gaps.

## Key Takeaways

1. **Think in terms of boundaries, not fences**: The key insight is that fences create boundaries, and gaps are distances between any two boundaries (not just adjacent ones).

2. **Separate horizontal and vertical calculations**: Since the problem asks for a square, we need equal horizontal and vertical gaps. Calculate all possibilities for each dimension separately, then find the intersection.

3. **Use hash sets for efficient intersection**: When you need to find common elements between two collections, hash sets provide O(1) lookups, making the intersection step efficient.

4. **Consider all pairs, not just adjacent elements**: Removing a fence can merge non-adjacent gaps through intermediate fence removal, so we need to consider all possible boundary pairs.

Related problems: [Maximize Area of Square Hole in Grid](/problem/maximize-area-of-square-hole-in-grid)
