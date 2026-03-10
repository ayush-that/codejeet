---
title: "How to Solve Reschedule Meetings for Maximum Free Time I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reschedule Meetings for Maximum Free Time I. Medium difficulty, 53.9% acceptance rate. Topics: Array, Greedy, Sliding Window."
date: "2027-04-21"
category: "dsa-patterns"
tags: ["reschedule-meetings-for-maximum-free-time-i", "array", "greedy", "sliding-window", "medium"]
---

# How to Solve Reschedule Meetings for Maximum Free Time I

You’re given a fixed event duration and a list of non‑overlapping meetings within that event. You can reschedule exactly one meeting to any new time slot of the same length, and you want to maximize the longest continuous free time in the schedule. The tricky part is that moving one meeting can create a new free block by merging adjacent gaps, and you must consider all possibilities efficiently.

## Visual Walkthrough

Let’s walk through an example to build intuition.

**Input:**  
`eventTime = 20`  
`startTime = [1, 5, 9, 15]`  
`endTime   = [3, 7, 11, 17]`

Visually, the timeline looks like this (0 to 20):

```
0    1---3    5---7    9---11    15---17    20
|    meeting1 | meeting2 | meeting3 | meeting4 |
```

The existing free gaps are:

- Gap 1: from 0 to 1 → length 1
- Gap 2: from 3 to 5 → length 2
- Gap 3: from 7 to 9 → length 2
- Gap 4: from 11 to 15 → length 4
- Gap 5: from 17 to 20 → length 3

Without moving any meeting, the longest free time is 4 (gap between meetings 3 and 4).

Now, if we move meeting 1 (duration = 2) somewhere else, we remove it from time 1–3. That merges gap 1 (0–1) and gap 2 (3–5) into one big gap from 0 to 5 of length 5. But we must also place the moved meeting somewhere. If we place it into an existing gap, we split that gap. The best placement is into the smallest gap that can fit it, because we want to minimize the reduction of the largest free block.

For each meeting `i`, removing it merges the gap before it and the gap after it. Then we need to place it into the best possible gap (or outside the event). The new longest free time will be the maximum of:

1. The merged gap created by removing meeting `i`
2. The largest original gap that remains after possibly splitting a gap to place the moved meeting

We must check all meetings as candidates for removal and compute the resulting maximum free time.

## Brute Force Approach

A brute‑force way is to simulate moving each meeting to every possible new position. For each meeting `i`:

1. Remove it from the schedule.
2. Try placing it in every gap (including before the first meeting and after the last meeting).
3. For each placement, compute the new gaps and find the longest one.
4. Track the maximum longest free time across all placements.

This requires O(n²) gap checks and gap recalculations, which is too slow for n up to 10⁵. The inefficiency comes from repeatedly scanning the timeline for each placement.

**Why brute force fails:**  
We’d need to, for each of n meetings, try placing it in O(n) gaps, and for each placement recompute all gaps in O(n) time → O(n³). Even with careful implementation, it’s at least O(n²), which is infeasible for large n.

## Optimized Approach

The key insight is that we don’t need to simulate every placement explicitly. For a given removed meeting, the best placement is always into the **largest gap that can fit the meeting**, because placing it there minimizes the reduction of the largest free block. Why?

- If the largest gap is big enough to fit the meeting, placing the meeting there splits that gap into two smaller gaps. The new longest free time will be the maximum of:
  - The merged gap created by removing the meeting
  - The remaining part of the split largest gap (if it’s still the biggest)
  - Any other original gap
- If no gap is large enough to fit the meeting, we can place it outside the event (before 0 or after `eventTime`), which doesn’t affect any gap.

Thus, for each candidate meeting to remove, we can compute the outcome in O(1) if we precompute:

1. All free gaps between meetings (including before first and after last meeting).
2. The **largest gap** overall.
3. The **second largest gap** (because if we split the largest gap to place the moved meeting, the new largest might be the second largest or one of the two parts of the split largest gap).

**Step‑by‑step reasoning:**

1. Compute all free gaps: `gap_before_first = startTime[0] - 0`, gaps between meetings `startTime[i] - endTime[i-1]`, and `gap_after_last = eventTime - endTime[n-1]`.
2. Find the largest gap and second largest gap (we need both because splitting the largest gap might make the second largest the new maximum).
3. For each meeting `i`:
   - Removing it merges the gap before it and the gap after it into one `merged_gap`.
   - The meeting’s duration is `duration = endTime[i] - startTime[i]`.
   - Check if the **largest original gap** can fit this duration.
     - If yes, we place the meeting there. The new longest free time candidate is `max(merged_gap, max(second_largest_gap, largest_gap - duration))`.
     - If no, we can place the meeting outside. Then the new longest free time is `max(merged_gap, largest_gap)`.
4. Take the maximum over all meetings.

This runs in O(n) time after sorting (meetings are given non‑overlapping but not necessarily sorted; we should sort them first).

## Optimal Solution

We sort the meetings by start time, compute gaps, find the largest and second largest gaps, then evaluate each meeting as removal candidate.

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for main logic → O(n log n)
# Space: O(1) extra space (or O(n) if we count storing gaps)
def maxFreeTime(eventTime, startTime, endTime):
    n = len(startTime)
    # Combine and sort meetings by start time
    meetings = sorted(zip(startTime, endTime), key=lambda x: x[0])

    # Step 1: Compute all free gaps
    gaps = []
    # Gap before first meeting
    first_start = meetings[0][0]
    if first_start > 0:
        gaps.append(first_start)

    # Gaps between meetings
    for i in range(1, n):
        curr_start, prev_end = meetings[i][0], meetings[i-1][1]
        if curr_start > prev_end:
            gaps.append(curr_start - prev_end)

    # Gap after last meeting
    last_end = meetings[-1][1]
    if last_end < eventTime:
        gaps.append(eventTime - last_end)

    # If no gaps (event completely packed), we cannot place any moved meeting inside.
    # But we can still place outside, so we handle that case.

    # Step 2: Find largest and second largest gaps
    # We'll store indices to avoid confusion when gaps list is empty
    if not gaps:
        largest = second_largest = 0
    else:
        # Initialize largest and second largest
        largest = max(gaps)
        second_largest = 0
        for g in gaps:
            if g != largest and g > second_largest:
                second_largest = g

    # Step 3: Evaluate each meeting as removal candidate
    max_free = 0
    for i in range(n):
        s, e = meetings[i]
        duration = e - s

        # Gaps adjacent to current meeting
        left_gap = 0
        right_gap = 0
        if i == 0:
            left_gap = s  # gap from 0 to first meeting start
        else:
            left_gap = s - meetings[i-1][1]
        if i == n-1:
            right_gap = eventTime - e
        else:
            right_gap = meetings[i+1][0] - e

        merged_gap = left_gap + right_gap + duration  # removing meeting merges left_gap, meeting, right_gap

        # Determine best placement
        if largest >= duration:
            # Can place in largest gap
            # If the largest gap is one of the adjacent gaps, we must be careful:
            # When we remove meeting i, left_gap and right_gap are merged into merged_gap.
            # The largest gap might be left_gap or right_gap, which no longer exist after removal.
            # So we need to consider the remaining gaps after removal.
            # We'll compute the new largest gap after removal and placement.
            remaining_gaps = []
            # Add all gaps except left_gap and right_gap (they are merged)
            # Also, if we place into largest gap, that gap splits into two.
            # We'll handle by comparing candidates directly.
            candidate = max(merged_gap, second_largest)
            if largest == left_gap or largest == right_gap:
                # The largest gap is being merged, so after removal the largest original gap is second_largest
                candidate = max(merged_gap, second_largest)
            else:
                # Largest gap is elsewhere, splitting it
                candidate = max(merged_gap, second_largest, largest - duration)
            max_free = max(max_free, candidate)
        else:
            # Cannot place inside any gap → place outside event
            max_free = max(max_free, merged_gap, largest)

    return max_free
```

```javascript
// Time: O(n log n) | Space: O(n) for sorting
function maxFreeTime(eventTime, startTime, endTime) {
  const n = startTime.length;
  // Combine and sort meetings by start time
  const meetings = startTime.map((s, i) => [s, endTime[i]]).sort((a, b) => a[0] - b[0]);

  // Step 1: Compute all free gaps
  const gaps = [];
  // Gap before first meeting
  const firstStart = meetings[0][0];
  if (firstStart > 0) {
    gaps.push(firstStart);
  }

  // Gaps between meetings
  for (let i = 1; i < n; i++) {
    const currStart = meetings[i][0];
    const prevEnd = meetings[i - 1][1];
    if (currStart > prevEnd) {
      gaps.push(currStart - prevEnd);
    }
  }

  // Gap after last meeting
  const lastEnd = meetings[n - 1][1];
  if (lastEnd < eventTime) {
    gaps.push(eventTime - lastEnd);
  }

  // Step 2: Find largest and second largest gaps
  let largest = 0,
    secondLargest = 0;
  if (gaps.length > 0) {
    largest = Math.max(...gaps);
    for (const g of gaps) {
      if (g !== largest && g > secondLargest) {
        secondLargest = g;
      }
    }
  }

  // Step 3: Evaluate each meeting as removal candidate
  let maxFree = 0;
  for (let i = 0; i < n; i++) {
    const [s, e] = meetings[i];
    const duration = e - s;

    // Adjacent gaps
    let leftGap = 0,
      rightGap = 0;
    if (i === 0) {
      leftGap = s;
    } else {
      leftGap = s - meetings[i - 1][1];
    }
    if (i === n - 1) {
      rightGap = eventTime - e;
    } else {
      rightGap = meetings[i + 1][0] - e;
    }

    const mergedGap = leftGap + rightGap + duration;

    // Best placement logic
    if (largest >= duration) {
      // Can place in largest gap
      let candidate;
      if (largest === leftGap || largest === rightGap) {
        // Largest gap is being merged, so after removal largest original is secondLargest
        candidate = Math.max(mergedGap, secondLargest);
      } else {
        // Largest gap is elsewhere, split it
        candidate = Math.max(mergedGap, secondLargest, largest - duration);
      }
      maxFree = Math.max(maxFree, candidate);
    } else {
      // Place outside
      maxFree = Math.max(maxFree, mergedGap, largest);
    }
  }

  return maxFree;
}
```

```java
// Time: O(n log n) | Space: O(n) for sorting
import java.util.*;

public class Solution {
    public int maxFreeTime(int eventTime, int[] startTime, int[] endTime) {
        int n = startTime.length;
        // Create and sort meetings by start time
        int[][] meetings = new int[n][2];
        for (int i = 0; i < n; i++) {
            meetings[i][0] = startTime[i];
            meetings[i][1] = endTime[i];
        }
        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 1: Compute all free gaps
        List<Integer> gaps = new ArrayList<>();
        // Gap before first meeting
        int firstStart = meetings[0][0];
        if (firstStart > 0) {
            gaps.add(firstStart);
        }

        // Gaps between meetings
        for (int i = 1; i < n; i++) {
            int currStart = meetings[i][0];
            int prevEnd = meetings[i-1][1];
            if (currStart > prevEnd) {
                gaps.add(currStart - prevEnd);
            }
        }

        // Gap after last meeting
        int lastEnd = meetings[n-1][1];
        if (lastEnd < eventTime) {
            gaps.add(eventTime - lastEnd);
        }

        // Step 2: Find largest and second largest gaps
        int largest = 0, secondLargest = 0;
        if (!gaps.isEmpty()) {
            for (int g : gaps) {
                if (g > largest) {
                    secondLargest = largest;
                    largest = g;
                } else if (g > secondLargest) {
                    secondLargest = g;
                }
            }
        }

        // Step 3: Evaluate each meeting as removal candidate
        int maxFree = 0;
        for (int i = 0; i < n; i++) {
            int s = meetings[i][0], e = meetings[i][1];
            int duration = e - s;

            // Adjacent gaps
            int leftGap = 0, rightGap = 0;
            if (i == 0) {
                leftGap = s;
            } else {
                leftGap = s - meetings[i-1][1];
            }
            if (i == n-1) {
                rightGap = eventTime - e;
            } else {
                rightGap = meetings[i+1][0] - e;
            }

            int mergedGap = leftGap + rightGap + duration;

            // Best placement logic
            if (largest >= duration) {
                int candidate;
                if (largest == leftGap || largest == rightGap) {
                    // Largest gap is being merged
                    candidate = Math.max(mergedGap, secondLargest);
                } else {
                    // Split the largest gap
                    candidate = Math.max(mergedGap, Math.max(secondLargest, largest - duration));
                }
                maxFree = Math.max(maxFree, candidate);
            } else {
                // Place outside
                maxFree = Math.max(maxFree, Math.max(mergedGap, largest));
            }
        }

        return maxFree;
    }
}
```

</div>

## Complexity Analysis

**Time complexity:** O(n log n)

- Sorting the meetings takes O(n log n).
- Computing gaps, finding largest/second largest, and iterating over meetings are all O(n).
- Overall dominated by sorting.

**Space complexity:** O(n)

- Storing the sorted meetings requires O(n) space.
- The gaps list is also O(n), but could be reduced to O(1) extra space by computing on the fly (though code clarity suffers).
- Auxiliary space for sorting in some languages (e.g., Java’s `Arrays.sort`) uses O(log n) to O(n) depending on implementation.

## Common Mistakes

1. **Not sorting meetings** — The problem states meetings are non‑overlapping but not necessarily sorted by start time. Failing to sort leads to incorrect gap calculations.
2. **Incorrect handling when largest gap is adjacent** — When the largest gap is `left_gap` or `right_gap` of the removed meeting, that gap disappears after merging. Candidates often forget to use the second largest gap in this case.
3. **Off‑by‑one in gap calculations** — Gaps are between meeting end and next start: `startTime[i] - endTime[i-1]`. Using `startTime[i] - startTime[i-1]` is wrong.
4. **Forgetting to consider placing meeting outside** — If no gap fits the moved meeting, we can place it before time 0 or after `eventTime`. This doesn’t reduce any gap, so the longest free time is just `max(merged_gap, largest_gap)`.

## When You’ll See This Pattern

This problem combines **gap analysis** with **greedy placement** — a pattern common in interval scheduling and resource allocation problems.

- **Meeting Scheduler (LeetCode 1229)** — Given two people’s busy times and a duration, find the earliest time slot for a meeting. Similarly involves scanning gaps between intervals.
- **Car Pooling (LeetCode 1094)** — Determine if a vehicle can pick up and drop off all passengers without exceeding capacity. Uses sweep line to track changes at interval boundaries.
- **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** — Find minimum arrows to burst overlapping balloons. Requires sorting intervals and greedily grouping overlaps.

All these require sorting intervals, analyzing gaps or overlaps, and making greedy decisions based on endpoints.

## Key Takeaways

- **Maximizing free time after one move** boils down to evaluating each meeting’s removal and optimally placing it into the largest available gap.
- **Precomputing largest and second largest gaps** allows O(1) decision per meeting instead of rescanning.
- **Always sort intervals first** unless the problem explicitly states they’re sorted. Non‑overlapping does not imply sorted.

Related problems: [Meeting Scheduler](/problem/meeting-scheduler)
