---
title: "How to Solve Maximum Consecutive Floors Without Special Floors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Consecutive Floors Without Special Floors. Medium difficulty, 52.5% acceptance rate. Topics: Array, Sorting."
date: "2028-11-10"
category: "dsa-patterns"
tags: ["maximum-consecutive-floors-without-special-floors", "array", "sorting", "medium"]
---

# How to Solve Maximum Consecutive Floors Without Special Floors

Alice manages a company with rented floors from `bottom` to `top`, but some floors are designated as special and unavailable for office use. Given a list of these special floors, we need to find the maximum number of consecutive floors without any special floors. The challenge lies in efficiently handling potentially large ranges and special floor lists while avoiding off-by-one errors in boundary calculations.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `bottom = 2`
- `top = 9`
- `special = [4, 6, 8]`

We need to find the longest stretch of consecutive available floors between 2 and 9, excluding the special floors 4, 6, and 8.

First, let's visualize all floors from 2 to 9:

```
Floor:  2  3  4  5  6  7  8  9
Status: A  A  S  A  S  A  S  A
(A = Available, S = Special)
```

Now let's identify the available stretches:

1. From floor 2 to floor 3: 2 consecutive floors (2, 3)
2. From floor 5 to floor 5: 1 consecutive floor (5)
3. From floor 7 to floor 7: 1 consecutive floor (7)
4. From floor 9 to floor 9: 1 consecutive floor (9)

But wait — we're missing something important! The stretches between special floors and boundaries matter too. Let's think about the gaps:

- Between bottom (2) and first special (4): floors 2-3 = 2 floors
- Between special floors 4 and 6: floor 5 = 1 floor
- Between special floors 6 and 8: floor 7 = 1 floor
- Between last special (8) and top (9): floor 9 = 1 floor

The maximum is 2 consecutive floors (floors 2 and 3).

The key insight: We need to sort the special floors and check the gaps between them, as well as the gaps between the boundaries and the first/last special floors.

## Brute Force Approach

A naive approach would be to iterate through every floor from `bottom` to `top`, checking if each floor is in the `special` list, and tracking the current consecutive count:

1. Initialize `max_count = 0` and `current_count = 0`
2. For each floor from `bottom` to `top`:
   - If floor is in `special`, reset `current_count = 0`
   - Else, increment `current_count` and update `max_count`
3. Return `max_count`

The problem with this approach is its time complexity: O((top - bottom + 1) × m) where m is the number of special floors, since checking if a floor is special requires scanning the list. Even with a hash set for O(1) lookups, we still have O(n) time where n = top - bottom + 1, which could be up to 10⁹ — far too large to iterate through.

## Optimized Approach

The key insight is that we don't need to check every floor. We only care about the gaps between special floors and the boundaries. By sorting the special floors, we can efficiently find these gaps:

1. Sort the special floors in ascending order
2. Consider the gap from `bottom` to the first special floor
3. Consider the gaps between consecutive special floors
4. Consider the gap from the last special floor to `top`
5. The maximum gap is our answer

Why does this work? Because consecutive available floors must lie entirely between two special floors (or between a boundary and a special floor). The longest such stretch will be one of these gaps.

For our example [2, 9] with special [4, 6, 8]:

1. Sort special: [4, 6, 8]
2. Gap 1: bottom to first special = 4 - 2 = 2 floors (2, 3)
3. Gap 2: between 4 and 6 = 6 - 4 - 1 = 1 floor (5)
4. Gap 3: between 6 and 8 = 8 - 6 - 1 = 1 floor (7)
5. Gap 4: last special to top = 9 - 8 = 1 floor (9)
6. Maximum = max(2, 1, 1, 1) = 2

Note the careful handling: For gaps between special floors, we subtract 1 because neither endpoint is available. For boundary gaps, we don't subtract 1 because the boundary floor is available if it's not special.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n = len(special) | Space: O(1) or O(n) depending on sort implementation
def maxConsecutive(bottom: int, top: int, special: List[int]) -> int:
    # Sort special floors to process them in order
    special.sort()

    # Initialize max consecutive count with the gap from bottom to first special floor
    # Note: special[0] - bottom gives the number of consecutive floors from bottom
    # up to (but not including) the first special floor
    max_gap = special[0] - bottom

    # Check gaps between consecutive special floors
    # For floors between two special floors, neither endpoint is available
    # So the gap size is (next_special - current_special - 1)
    for i in range(1, len(special)):
        gap = special[i] - special[i-1] - 1
        max_gap = max(max_gap, gap)

    # Check the gap from the last special floor to top
    # top - special[-1] gives floors from after the last special up to and including top
    gap = top - special[-1]
    max_gap = max(max_gap, gap)

    return max_gap
```

```javascript
// Time: O(n log n) where n = special.length | Space: O(1) or O(n) depending on sort implementation
function maxConsecutive(bottom, top, special) {
  // Sort special floors in ascending order
  special.sort((a, b) => a - b);

  // Start with the gap from bottom to first special floor
  let maxGap = special[0] - bottom;

  // Check gaps between consecutive special floors
  // Subtract 1 because neither special floor is available
  for (let i = 1; i < special.length; i++) {
    const gap = special[i] - special[i - 1] - 1;
    maxGap = Math.max(maxGap, gap);
  }

  // Check the gap from last special floor to top
  const lastGap = top - special[special.length - 1];
  maxGap = Math.max(maxGap, lastGap);

  return maxGap;
}
```

```java
// Time: O(n log n) where n = special.length | Space: O(1) or O(n) depending on sort implementation
public int maxConsecutive(int bottom, int top, int[] special) {
    // Sort the special floors array
    Arrays.sort(special);

    // Initialize with gap from bottom to first special floor
    int maxGap = special[0] - bottom;

    // Check gaps between consecutive special floors
    // Subtract 1 because both endpoints are special (unavailable)
    for (int i = 1; i < special.length; i++) {
        int gap = special[i] - special[i - 1] - 1;
        maxGap = Math.max(maxGap, gap);
    }

    // Check gap from last special floor to top
    int lastGap = top - special[special.length - 1];
    maxGap = Math.max(maxGap, lastGap);

    return maxGap;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n) where n is the number of special floors. The dominant operation is sorting the special floors array. After sorting, we only need a single pass through the array, which is O(n).

**Space Complexity:** O(1) or O(n) depending on the sorting algorithm implementation:

- In Python, `list.sort()` uses Timsort which requires O(n) space in the worst case
- In JavaScript, the space complexity of `Array.sort()` depends on the implementation but is typically O(log n) to O(n)
- In Java, `Arrays.sort()` for primitive types uses a dual-pivot quicksort with O(log n) space

If we cannot modify the input array, we would need O(n) space to create a sorted copy.

## Common Mistakes

1. **Forgetting to sort the special floors:** This is the most common mistake. Without sorting, you can't correctly identify consecutive gaps. Always sort first unless you're certain the input is pre-sorted.

2. **Off-by-one errors in gap calculations:**
   - Between two special floors: Use `special[i] - special[i-1] - 1` (subtract 1 because neither endpoint is available)
   - From bottom to first special: Use `special[0] - bottom` (no subtraction because bottom is available if not special)
   - From last special to top: Use `top - special[-1]` (no subtraction because top is available if not special)

3. **Not handling empty special list:** If there are no special floors, the entire range from bottom to top is available. The code should handle this edge case. Our solution would fail with an IndexError, so we should add:

   ```python
   if not special:
       return top - bottom + 1
   ```

4. **Incorrectly calculating the first gap:** Some candidates mistakenly use `special[0] - bottom - 1`, forgetting that the bottom floor itself is available (unless it's in the special list, which it isn't since we're checking gaps between bottom and first special).

## When You'll See This Pattern

This problem uses the **"gaps between sorted points"** pattern, which appears in several other LeetCode problems:

1. **Maximum Gap (Hard)** - Find the maximum difference between successive elements in sorted form. The core technique is similar: sort and find maximum gap between consecutive elements.

2. **Widest Vertical Area Between Two Points Containing No Points (Easy)** - Given points on a 2D plane, find the widest vertical area without any points. This reduces to sorting x-coordinates and finding the maximum gap, exactly like our floor problem.

3. **Longest Consecutive Sequence (Medium)** - While solved differently (with hash sets), it also deals with finding consecutive elements and gaps in number sequences.

The pattern is: when you need to find maximum uninterrupted intervals between marked points, sort the points and examine the gaps between them.

## Key Takeaways

1. **Sorting transforms interval problems into linear scans:** Many problems involving ranges, gaps, or intervals become much simpler when you sort the boundary points first. This lets you process elements in order and consider only adjacent elements.

2. **Boundary handling is critical:** Pay close attention to whether endpoints are inclusive or exclusive in gap calculations. Draw small examples to verify your off-by-one logic.

3. **Don't iterate through huge ranges:** When the range (top-bottom) can be enormous but the number of special points is manageable, avoid iterating through the entire range. Instead, work only with the special points and boundaries.

Related problems: [Longest Consecutive Sequence](/problem/longest-consecutive-sequence), [Maximum Gap](/problem/maximum-gap), [Widest Vertical Area Between Two Points Containing No Points](/problem/widest-vertical-area-between-two-points-containing-no-points)
