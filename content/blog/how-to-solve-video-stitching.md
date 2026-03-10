---
title: "How to Solve Video Stitching — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Video Stitching. Medium difficulty, 52.5% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2027-09-15"
category: "dsa-patterns"
tags: ["video-stitching", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Video Stitching

Video stitching is a classic interval covering problem disguised in a multimedia context. You're given overlapping video clips and need to determine the minimum number of clips required to cover a continuous time segment from 0 to `time`. What makes this problem interesting is that clips can overlap arbitrarily, and you need to strategically choose clips to minimize count while ensuring full coverage.

## Visual Walkthrough

Let's trace through an example: `clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]]`, `time = 10`

We need to cover from 0 to 10. Let's think step-by-step:

1. **Start at time 0**: We need clips that start at or before 0. Only `[0,2]` qualifies. This takes us to time 2.
2. **From time 2**: We need clips that start at or before 2 and extend as far as possible. Looking at clips starting ≤2: `[1,9]` and `[1,5]` both start at 1. `[1,9]` extends to 9, which is better than `[1,5]` ending at 5.
3. **From time 9**: We need clips starting ≤9 that extend beyond 9. `[5,9]` starts at 5 but ends at 9 (doesn't extend past 9). `[8,10]` starts at 8 and ends at 10 - perfect!
4. **Result**: We used 3 clips: `[0,2]`, `[1,9]`, `[8,10]`

The key insight: at each step, we want the clip that starts before or at our current position and extends the farthest right.

## Brute Force Approach

A naive approach would be to try all possible combinations of clips. For each subset of clips, check if they cover [0, time] when merged, and track the minimum size subset that works.

Why this fails:

- There are 2^n possible subsets where n is the number of clips
- For n=100 (common constraint), that's 2^100 ≈ 1.3×10^30 possibilities
- Even with pruning, this is computationally infeasible
- Checking coverage for each subset requires O(n) time

The brute force teaches us that we need a smarter way to select clips without exploring all combinations.

## Optimized Approach

The optimal solution uses a greedy approach with preprocessing. Here's the step-by-step reasoning:

1. **Preprocessing**: Create an array `maxReach` where `maxReach[i]` = the farthest ending time for any clip starting at time `i`. This collapses multiple clips starting at the same time to just the one that extends farthest.

2. **Greedy selection**: Starting at time 0:
   - At current time `currEnd`, look at all clips starting between `prevEnd` (where we last jumped from) and `currEnd`
   - Choose the one that extends farthest right as our next clip
   - This is like a "jump game" - we're making the farthest possible jump at each step

3. **Why greedy works**: At each step, choosing the clip that extends farthest gives us the most options for future steps. If there's a solution, the farthest-reaching clip at each step won't prevent us from finding it.

4. **Algorithm steps**:
   - Create `maxReach` array initialized to 0
   - For each clip `[start, end]`, update `maxReach[start] = max(maxReach[start], end)`
   - Initialize `clipsCount = 0`, `currEnd = 0`, `nextEnd = 0`
   - For each time `t` from 0 to `time`:
     - Update `nextEnd = max(nextEnd, maxReach[t])` (farthest we can reach from current segment)
     - If `t == currEnd` (reached end of current clip):
       - If we can't extend further (`nextEnd == t`), return -1 (gap in coverage)
       - Increment `clipsCount` (we need a new clip)
       - Set `currEnd = nextEnd` (jump to new farthest reach)
       - If `currEnd >= time`, we're done!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + time) where n = len(clips)
# Space: O(time) for the maxReach array
def videoStitching(clips, time):
    """
    Greedy approach to find minimum clips to cover [0, time]
    Similar to jump game II - we always take the farthest reaching clip
    """
    # Step 1: Create array to track farthest end for each start time
    # We only care about times up to 'time' since clips beyond that don't help
    maxReach = [0] * (time + 1)

    # Step 2: Populate maxReach with the farthest ending time for each start
    for start, end in clips:
        # Only consider clips that start within our time range
        if start <= time:
            # Multiple clips may start at same time - keep the one that goes farthest
            maxReach[start] = max(maxReach[start], min(end, time))

    # Step 3: Greedy selection (similar to jump game)
    clipsCount = 0    # Number of clips used
    currEnd = 0       # Current farthest point we can reach
    nextEnd = 0       # Next farthest point we can reach

    # Iterate through each time point
    for t in range(time + 1):
        # Update the farthest we can reach from current segment
        nextEnd = max(nextEnd, maxReach[t])

        # If we've reached the end of current clip's coverage
        if t == currEnd:
            # If we can't extend further, there's a gap
            if nextEnd == t:
                return -1

            # Need a new clip to continue
            clipsCount += 1

            # Jump to the new farthest reach
            currEnd = nextEnd

            # Early exit if we've already covered the required time
            if currEnd >= time:
                return clipsCount

    # If we finish loop without covering full time
    return -1
```

```javascript
// Time: O(n + time) where n = clips.length
// Space: O(time) for the maxReach array
function videoStitching(clips, time) {
  /**
   * Greedy approach to find minimum clips to cover [0, time]
   * Similar to jump game II - we always take the farthest reaching clip
   */

  // Step 1: Create array to track farthest end for each start time
  // We only care about times up to 'time' since clips beyond that don't help
  const maxReach = new Array(time + 1).fill(0);

  // Step 2: Populate maxReach with the farthest ending time for each start
  for (const [start, end] of clips) {
    // Only consider clips that start within our time range
    if (start <= time) {
      // Multiple clips may start at same time - keep the one that goes farthest
      maxReach[start] = Math.max(maxReach[start], Math.min(end, time));
    }
  }

  // Step 3: Greedy selection (similar to jump game)
  let clipsCount = 0; // Number of clips used
  let currEnd = 0; // Current farthest point we can reach
  let nextEnd = 0; // Next farthest point we can reach

  // Iterate through each time point
  for (let t = 0; t <= time; t++) {
    // Update the farthest we can reach from current segment
    nextEnd = Math.max(nextEnd, maxReach[t]);

    // If we've reached the end of current clip's coverage
    if (t === currEnd) {
      // If we can't extend further, there's a gap
      if (nextEnd === t) {
        return -1;
      }

      // Need a new clip to continue
      clipsCount++;

      // Jump to the new farthest reach
      currEnd = nextEnd;

      // Early exit if we've already covered the required time
      if (currEnd >= time) {
        return clipsCount;
      }
    }
  }

  // If we finish loop without covering full time
  return -1;
}
```

```java
// Time: O(n + time) where n = clips.length
// Space: O(time) for the maxReach array
class Solution {
    public int videoStitching(int[][] clips, int time) {
        /**
         * Greedy approach to find minimum clips to cover [0, time]
         * Similar to jump game II - we always take the farthest reaching clip
         */

        // Step 1: Create array to track farthest end for each start time
        // We only care about times up to 'time' since clips beyond that don't help
        int[] maxReach = new int[time + 1];

        // Step 2: Populate maxReach with the farthest ending time for each start
        for (int[] clip : clips) {
            int start = clip[0];
            int end = clip[1];

            // Only consider clips that start within our time range
            if (start <= time) {
                // Multiple clips may start at same time - keep the one that goes farthest
                maxReach[start] = Math.max(maxReach[start], Math.min(end, time));
            }
        }

        // Step 3: Greedy selection (similar to jump game)
        int clipsCount = 0;    // Number of clips used
        int currEnd = 0;       // Current farthest point we can reach
        int nextEnd = 0;       // Next farthest point we can reach

        // Iterate through each time point
        for (int t = 0; t <= time; t++) {
            // Update the farthest we can reach from current segment
            nextEnd = Math.max(nextEnd, maxReach[t]);

            // If we've reached the end of current clip's coverage
            if (t == currEnd) {
                // If we can't extend further, there's a gap
                if (nextEnd == t) {
                    return -1;
                }

                // Need a new clip to continue
                clipsCount++;

                // Jump to the new farthest reach
                currEnd = nextEnd;

                // Early exit if we've already covered the required time
                if (currEnd >= time) {
                    return clipsCount;
                }
            }
        }

        // If we finish loop without covering full time
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + time)**

- `O(n)` to iterate through all clips and build the `maxReach` array
- `O(time)` to iterate through time points from 0 to `time`
- Total: O(n + time)

**Space Complexity: O(time)**

- We need the `maxReach` array of size `time + 1`
- Constant extra space for variables `clipsCount`, `currEnd`, `nextEnd`

This is optimal since we need to at least examine each clip and each time unit in the worst case.

## Common Mistakes

1. **Forgetting to handle clips that extend beyond `time`**: If a clip ends after `time`, we should cap it at `time` since extra coverage doesn't help. Without this, you might incorrectly reject valid solutions.

2. **Not checking for gaps in coverage**: The condition `if (nextEnd == t)` is crucial. If at time `t` we can't extend beyond `t`, there's a gap and we should return -1 immediately.

3. **Incorrect loop termination**: Some candidates stop when `currEnd >= time`, but this must be checked AFTER incrementing `clipsCount`. The last clip that pushes us past `time` should be counted.

4. **Sorting clips unnecessarily**: While sorting by start time seems intuitive, it adds O(n log n) complexity. The `maxReach` array approach is more efficient at O(n + time).

## When You'll See This Pattern

This "jump game" or "interval covering" pattern appears in several problems:

1. **Jump Game II (LeetCode 45)**: Almost identical logic - find minimum jumps to reach the end of an array where each element tells how far you can jump from that position.

2. **Minimum Number of Taps to Open to Water a Garden (LeetCode 1326)**: Exact same problem but with garden taps instead of video clips.

3. **Partition Labels (LeetCode 763)**: Uses similar greedy merging of intervals to partition a string into maximum parts.

The core pattern: When you need to cover a range with overlapping intervals and minimize count, think about tracking the farthest reach from each point and greedily extending.

## Key Takeaways

1. **Greedy with preprocessing works for interval covering**: When intervals can overlap, preprocess to find the farthest reach from each point, then greedily extend.

2. **Recognize jump game variations**: Problems asking for "minimum number of X to cover range Y" often reduce to jump game logic.

3. **Array indexing trick**: Using an array indexed by start time to store max end time is more efficient than sorting when the range is limited.

[Practice this problem on CodeJeet](/problem/video-stitching)
