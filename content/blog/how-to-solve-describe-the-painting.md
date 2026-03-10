---
title: "How to Solve Describe the Painting — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Describe the Painting. Medium difficulty, 52.0% acceptance rate. Topics: Array, Hash Table, Sorting, Prefix Sum."
date: "2029-11-30"
category: "dsa-patterns"
tags: ["describe-the-painting", "array", "hash-table", "sorting", "medium"]
---

# How to Solve "Describe the Painting"

You're given a list of colored segments on a number line, where each segment has a unique color. Your task is to return the segments where the color is "visible" — meaning where exactly one color is present (no overlaps). The challenge is that segments can overlap arbitrarily, and you need to efficiently track color mixing across the entire number line.

What makes this problem interesting is that it's essentially a **sweep line** problem disguised as a painting description. You need to track color changes along the number line without checking every single point, which would be impossible for large ranges.

## Visual Walkthrough

Let's trace through a concrete example: `segments = [[1,4,5],[1,7,7]]`

We have two segments:

- Color 5 from position 1 to 4 (exclusive of 4)
- Color 7 from position 1 to 7 (exclusive of 7)

Think of this as a number line:

```
Position: 0   1   2   3   4   5   6   7   8
Color 5:      [-------)
Color 7:      [-------------------)
```

Now let's examine what colors are present at each position:

- Position 1 to 4: Both colors 5 and 7 are present → mixed color (not visible)
- Position 4 to 7: Only color 7 is present → visible color 7

The output should be: `[[1,4,12],[4,7,7]]`
Wait, why is the first segment color 12? Because when multiple colors overlap, we sum their colors. So 5 + 7 = 12.

But here's the key insight: we don't actually care about mixed colors! The problem asks for segments where **exactly one color** is present. So the correct output is actually just `[[4,7,7]]`.

Let me correct that: Looking at the problem statement again, we only output segments where the color is "visible" (exactly one color present). So:

- Positions 1-4: Two colors → not visible
- Positions 4-7: One color (7) → visible

Thus the output is `[[4,7,7]]`.

The tricky part is that we need to efficiently track when the number of active colors changes from 1 to something else, or from something else to 1.

## Brute Force Approach

A naive approach would be to iterate through every possible integer point along the number line, track which colors are active at each point, and then merge consecutive points with the same single color.

**Why this fails:**

1. The positions can be up to 10^9, so iterating point by point is impossible
2. Even if we compressed the coordinates, checking each compressed point would still be O(n × range) which is too slow
3. We'd need to track which specific colors are active, not just counts

A slightly better but still inefficient approach would be to compare every pair of segments to find overlaps, but with n up to 10^5, O(n²) is 10^10 operations — far too many.

The brute force teaches us that we need a way to process color changes without examining every point individually.

## Optimized Approach

The key insight is to use a **sweep line algorithm** with **difference array** technique:

1. **Event-based processing**: Instead of checking every point, we only care about positions where something changes — where a segment starts or ends.

2. **Color tracking**: At each event point, we need to know:
   - How many colors are active?
   - What is the sum of active colors? (Since each color is unique, the sum uniquely identifies the set of colors)

3. **Difference array**: We can use a map/dictionary to track "color sum changes":
   - At `start`: add the color to the current sum
   - At `end`: subtract the color from the current sum

4. **Processing events**:
   - Sort all event points (starts and ends)
   - Sweep from left to right
   - Maintain current color sum and count
   - When we move to a new position, check if the previous segment had exactly one color
   - If yes, add it to the result

The clever part: Since colors are unique, the sum of colors uniquely identifies which colors are present. If exactly one color is present, the sum equals that color. If multiple colors are present, the sum is greater than any individual color.

## Optimal Solution

Here's the step-by-step algorithm:

1. Create a dictionary/map to store "events" — at each position, what net change in color sum occurs
2. For each segment `[start, end, color]`:
   - At `start`: add `color` to the sum
   - At `end`: subtract `color` from the sum
3. Sort all event positions
4. Sweep through sorted positions:
   - Track current color sum and previous position
   - When moving to a new position:
     - If previous sum was a single color (sum > 0 and we can identify it), add segment to result
     - Update current position and sum
5. Handle the last segment if needed

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def describePainting(segments):
    """
    Returns the visible segments of the painting where exactly one color is present.

    Approach: Sweep line with difference array. We track color sum changes at each
    event point (segment start/end), then sweep through sorted events to find
    intervals where exactly one color is active.
    """
    # Step 1: Create events dictionary
    # key: position, value: net change in color sum
    events = {}

    for start, end, color in segments:
        # At start position, add this color to the sum
        events[start] = events.get(start, 0) + color
        # At end position, remove this color from the sum
        events[end] = events.get(end, 0) - color

    # Step 2: Sort event positions
    sorted_positions = sorted(events.keys())

    # Step 3: Sweep through events
    result = []
    prev_pos = 0
    curr_sum = 0

    for pos in sorted_positions:
        # If we had exactly one color in the previous interval
        if curr_sum > 0:  # curr_sum > 0 means exactly one color (since colors are positive)
            # Add the segment from prev_pos to pos with color = curr_sum
            result.append([prev_pos, pos, curr_sum])

        # Update for next interval
        prev_pos = pos
        curr_sum += events[pos]  # Apply the net change at this position

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function describePainting(segments) {
  /**
   * Returns the visible segments of the painting where exactly one color is present.
   *
   * Approach: Sweep line with difference array. We track color sum changes at each
   * event point (segment start/end), then sweep through sorted events to find
   * intervals where exactly one color is active.
   */

  // Step 1: Create events map
  // key: position, value: net change in color sum
  const events = new Map();

  for (const [start, end, color] of segments) {
    // At start position, add this color to the sum
    events.set(start, (events.get(start) || 0) + color);
    // At end position, remove this color from the sum
    events.set(end, (events.get(end) || 0) - color);
  }

  // Step 2: Sort event positions
  const sortedPositions = Array.from(events.keys()).sort((a, b) => a - b);

  // Step 3: Sweep through events
  const result = [];
  let prevPos = 0;
  let currSum = 0;

  for (const pos of sortedPositions) {
    // If we had exactly one color in the previous interval
    if (currSum > 0) {
      // currSum > 0 means exactly one color
      // Add the segment from prevPos to pos with color = currSum
      result.push([prevPos, pos, currSum]);
    }

    // Update for next interval
    prevPos = pos;
    currSum += events.get(pos); // Apply the net change at this position
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public List<List<Long>> describePainting(int[][] segments) {
        /**
         * Returns the visible segments of the painting where exactly one color is present.
         *
         * Approach: Sweep line with difference array. We track color sum changes at each
         * event point (segment start/end), then sweep through sorted events to find
         * intervals where exactly one color is active.
         */

        // Step 1: Create events map
        // key: position, value: net change in color sum
        Map<Integer, Long> events = new HashMap<>();

        for (int[] segment : segments) {
            int start = segment[0];
            int end = segment[1];
            long color = segment[2];

            // At start position, add this color to the sum
            events.put(start, events.getOrDefault(start, 0L) + color);
            // At end position, remove this color from the sum
            events.put(end, events.getOrDefault(end, 0L) - color);
        }

        // Step 2: Sort event positions
        List<Integer> sortedPositions = new ArrayList<>(events.keySet());
        Collections.sort(sortedPositions);

        // Step 3: Sweep through events
        List<List<Long>> result = new ArrayList<>();
        long prevPos = 0;
        long currSum = 0;

        for (int pos : sortedPositions) {
            // If we had exactly one color in the previous interval
            if (currSum > 0) {  // currSum > 0 means exactly one color
                // Add the segment from prevPos to pos with color = currSum
                List<Long> segment = new ArrayList<>();
                segment.add(prevPos);
                segment.add((long) pos);
                segment.add(currSum);
                result.add(segment);
            }

            // Update for next interval
            prevPos = pos;
            currSum += events.get(pos);  // Apply the net change at this position
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Building the events map: O(n) where n is number of segments
- Sorting event positions: O(k log k) where k is number of unique event points (at most 2n)
- Sweeping through events: O(k)
- Overall: O(n log n) dominated by sorting

**Space Complexity: O(n)**

- Events map stores at most 2n entries
- Sorted positions list stores at most 2n entries
- Result list in worst case could store O(n) segments

## Common Mistakes

1. **Forgetting that colors are unique**: Some candidates try to track which specific colors are active using sets, which is unnecessary and inefficient. The sum of unique colors uniquely identifies the set.

2. **Off-by-one errors with segment boundaries**: Remember that segments are half-open intervals `[start, end)`. The color is active at `start` but not at `end`. This affects where we add/subtract colors in our events.

3. **Not handling overlapping segments correctly**: When multiple segments start or end at the same position, you must aggregate all changes at that position before processing.

4. **Missing the case when no colors are active**: The current sum can be 0 (no colors active) or positive (one color active). We only output segments when `currSum > 0`.

## When You'll See This Pattern

This sweep line with difference array pattern appears in many interval-related problems:

1. **Meeting Rooms II (LeetCode 253)**: Similar concept of tracking "active meetings" as we sweep through time points.

2. **Range Addition (LeetCode 370)**: Direct application of difference array technique for range updates.

3. **Corporate Flight Bookings (LeetCode 1109)**: Another difference array problem tracking passenger counts on flights.

4. **My Calendar III (LeetCode 732)**: Tracks maximum overlapping events using similar sweep line approach.

The pattern is: when you need to track some quantity that changes at specific points (starts/ends of intervals), use a difference array or sweep line to process events efficiently.

## Key Takeaways

1. **Sweep line transforms range queries to point updates**: Instead of checking every point in a range, only process where changes occur. This often turns O(range) problems into O(n log n).

2. **Difference array for efficient range updates**: When you need to apply "add value to range" operations, record changes at start (+value) and end (-value), then compute prefix sums.

3. **Unique colors → sum as identifier**: When elements are unique, their sum uniquely identifies the set. This is a useful trick for problems with unique IDs or values.

**Related problems:** [Average Height of Buildings in Each Segment](/problem/average-height-of-buildings-in-each-segment), [Amount of New Area Painted Each Day](/problem/amount-of-new-area-painted-each-day), [Shifting Letters II](/problem/shifting-letters-ii)
