---
title: "How to Solve Reschedule Meetings for Maximum Free Time II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reschedule Meetings for Maximum Free Time II. Medium difficulty, 60.4% acceptance rate. Topics: Array, Greedy, Enumeration."
date: "2027-10-05"
category: "dsa-patterns"
tags: ["reschedule-meetings-for-maximum-free-time-ii", "array", "greedy", "enumeration", "medium"]
---

# How to Solve Reschedule Meetings for Maximum Free Time II

You're given an event duration and a list of non-overlapping meetings scheduled within that event. You can reschedule exactly one meeting to any new time slot (as long as it doesn't overlap with other meetings), and you want to maximize the longest continuous free time between meetings. The challenge is that you need to consider not just moving a meeting, but also how moving it affects the gaps before and after it.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

- `eventTime = 20`
- `startTime = [1, 5, 10, 15]`
- `endTime = [3, 7, 12, 17]`

**Visual timeline:**

```
0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20
     [----]         [----]         [----]         [----]
Free: 0-1 (1), 3-5 (2), 7-10 (3), 12-15 (3), 17-20 (3)
Current max free time: 3
```

**Step 1: Consider moving meeting 0 (1-3)**

- Original gaps around it: before=1 (0-1), after=2 (3-5)
- If we remove meeting 0, the gap becomes 1+2=3 (0-5)
- We could place meeting 0 elsewhere to potentially create a larger gap
- Best placement might be at the very end: 17-19 creates gap 15-17 (2) + 19-20 (1) = 3
- Or at the very beginning: 0-2 creates gap 2-5 (3)
- Maximum possible from moving meeting 0: 3

**Step 2: Consider moving meeting 1 (5-7)**

- Original gaps: before=2 (3-5), after=3 (7-10)
- Remove meeting 1: gap becomes 2+3=5 (3-10)
- Place meeting 1 elsewhere: at end 17-19 gives gaps 15-17 (2) + 19-20 (1) = 3
- Maximum: max(5, 3) = 5

**Step 3: Consider moving meeting 2 (10-12)**

- Original gaps: before=3 (7-10), after=3 (12-15)
- Remove meeting 2: gap becomes 3+3=6 (7-15)
- Place at end: 17-19 gives gaps 15-17 (2) + 19-20 (1) = 3
- Maximum: 6

**Step 4: Consider moving meeting 3 (15-17)**

- Original gaps: before=3 (12-15), after=3 (17-20)
- Remove meeting 3: gap becomes 3+3=6 (12-20)
- Place at beginning: 0-2 gives gaps 2-5 (3)
- Maximum: 6

**Step 5: Also consider boundaries**

- The free time before first meeting (0-1) = 1
- The free time after last meeting (17-20) = 3
- Moving a meeting to the very beginning or end can extend these

**Result:** The maximum free time we can achieve is 6 by moving either meeting 2 or meeting 3.

## Brute Force Approach

A naive approach would be to try every possible new position for every meeting and calculate the resulting maximum free time. For each of the n meetings, you could try placing it in O(n) possible gaps (including before the first meeting and after the last meeting), and for each placement, you'd need to recalculate all gaps to find the maximum.

This would be O(n³) time complexity because:

1. For each meeting (n choices)
2. For each possible new position (n+1 choices)
3. Recalculate all gaps (O(n) time)

Even with some optimizations, a straightforward brute force would be O(n²), which is too slow for n up to 10⁵.

The key insight we need is that we don't need to actually try every placement - we can calculate the effect of removing a meeting and then determine the best possible placement separately.

## Optimized Approach

The optimal solution uses a greedy approach with careful preprocessing:

**Key Insight 1:** When we remove a meeting, the gap created is the sum of the gaps before and after that meeting.

**Key Insight 2:** The best place to put the removed meeting is either:

- At the very beginning (time 0)
- At the very end (time eventTime)
- In the largest existing gap (if that gap is big enough to hold the meeting)

**Key Insight 3:** We need to track not just the largest gap, but the second largest gap too. Why? Because if we place the meeting in the largest gap, we split it, and the new maximum free time might come from the second largest gap.

**Step-by-step reasoning:**

1. Calculate all existing free time gaps (including before first meeting and after last meeting)
2. Find the largest and second largest gaps
3. For each meeting:
   - Calculate the combined gap if we remove this meeting (gap_before + gap_after)
   - Consider three placement options for the removed meeting:
     a) Place at beginning: creates gap from 0 to meeting duration
     b) Place at end: creates gap from (eventTime - duration) to eventTime
     c) Place in largest gap: if largest gap ≥ meeting duration, splits it into two smaller gaps
   - Calculate the new maximum free time for each option
   - Track the overall maximum

**Special cases:**

- If there's only one meeting, removing it creates one big free slot from 0 to eventTime
- If the largest gap is exactly the gap created by removing the current meeting, we need to use the second largest gap

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxFreeTime(eventTime, startTime, endTime):
    n = len(startTime)

    # Step 1: Calculate all free time gaps
    gaps = []

    # Gap before first meeting
    if startTime[0] > 0:
        gaps.append(startTime[0])

    # Gaps between meetings
    for i in range(1, n):
        gap = startTime[i] - endTime[i-1]
        if gap > 0:
            gaps.append(gap)

    # Gap after last meeting
    if eventTime > endTime[-1]:
        gaps.append(eventTime - endTime[-1])

    # If no meetings at all, the entire event is free
    if n == 0:
        return eventTime

    # Step 2: Find largest and second largest gaps
    # We need these because placing a meeting in the largest gap splits it
    if len(gaps) == 0:
        # All meetings cover the entire event
        largest = second_largest = 0
    elif len(gaps) == 1:
        largest = gaps[0]
        second_largest = 0
    else:
        # Sort to find two largest gaps
        sorted_gaps = sorted(gaps, reverse=True)
        largest = sorted_gaps[0]
        second_largest = sorted_gaps[1]

    # Step 3: Calculate meeting durations
    durations = [endTime[i] - startTime[i] for i in range(n)]

    # Step 4: Calculate gaps around each meeting for quick lookup
    # gap_before[i] = free time before meeting i
    # gap_after[i] = free time after meeting i
    gap_before = [0] * n
    gap_after = [0] * n

    if startTime[0] > 0:
        gap_before[0] = startTime[0]

    for i in range(1, n):
        gap = startTime[i] - endTime[i-1]
        if gap > 0:
            gap_before[i] = gap

    for i in range(n-1):
        gap = startTime[i+1] - endTime[i]
        if gap > 0:
            gap_after[i] = gap

    if eventTime > endTime[-1]:
        gap_after[-1] = eventTime - endTime[-1]

    # Step 5: Try removing each meeting
    max_free_time = 0

    for i in range(n):
        # Combined gap if we remove this meeting
        combined_gap = gap_before[i] + gap_after[i]

        # Duration of the meeting we're moving
        duration = durations[i]

        # We need to consider where to place the removed meeting
        # Option 1: Place at the beginning (time 0)
        free_if_at_start = max(combined_gap, eventTime - duration)
        if startTime[0] > 0:
            free_if_at_start = max(free_if_at_start, startTime[0])

        # Option 2: Place at the end
        free_if_at_end = max(combined_gap, eventTime - duration)
        if eventTime > endTime[-1]:
            free_if_at_end = max(free_if_at_end, eventTime - endTime[-1])

        # Option 3: Place in the largest gap
        # But if the largest gap is the one we're creating by removing this meeting,
        # we should use the second largest gap instead
        current_largest = largest
        if combined_gap == current_largest:
            current_largest = second_largest

        if current_largest >= duration:
            # We can place in the largest gap
            # The gap gets split into two parts: left and right
            left_part = current_largest - duration
            new_max_gap = max(combined_gap, left_part)

            # Also check other gaps
            if combined_gap != largest and largest > new_max_gap:
                new_max_gap = largest
            if second_largest > new_max_gap and second_largest != combined_gap:
                new_max_gap = second_largest
        else:
            # Can't place in largest gap, so largest gap remains unchanged
            new_max_gap = max(combined_gap, current_largest)

        free_if_in_gap = new_max_gap

        # Take the best of all placement options
        best_for_this_meeting = max(free_if_at_start, free_if_at_end, free_if_in_gap)
        max_free_time = max(max_free_time, best_for_this_meeting)

    return max_free_time
```

```javascript
// Time: O(n) | Space: O(n)
function maxFreeTime(eventTime, startTime, endTime) {
  const n = startTime.length;

  // Step 1: Calculate all free time gaps
  const gaps = [];

  // Gap before first meeting
  if (startTime[0] > 0) {
    gaps.push(startTime[0]);
  }

  // Gaps between meetings
  for (let i = 1; i < n; i++) {
    const gap = startTime[i] - endTime[i - 1];
    if (gap > 0) {
      gaps.push(gap);
    }
  }

  // Gap after last meeting
  if (eventTime > endTime[n - 1]) {
    gaps.push(eventTime - endTime[n - 1]);
  }

  // If no meetings at all, the entire event is free
  if (n === 0) {
    return eventTime;
  }

  // Step 2: Find largest and second largest gaps
  let largest = 0,
    secondLargest = 0;
  if (gaps.length === 0) {
    // All meetings cover the entire event
    largest = secondLargest = 0;
  } else if (gaps.length === 1) {
    largest = gaps[0];
    secondLargest = 0;
  } else {
    // Sort to find two largest gaps
    const sortedGaps = [...gaps].sort((a, b) => b - a);
    largest = sortedGaps[0];
    secondLargest = sortedGaps[1];
  }

  // Step 3: Calculate meeting durations
  const durations = new Array(n);
  for (let i = 0; i < n; i++) {
    durations[i] = endTime[i] - startTime[i];
  }

  // Step 4: Calculate gaps around each meeting for quick lookup
  const gapBefore = new Array(n).fill(0);
  const gapAfter = new Array(n).fill(0);

  if (startTime[0] > 0) {
    gapBefore[0] = startTime[0];
  }

  for (let i = 1; i < n; i++) {
    const gap = startTime[i] - endTime[i - 1];
    if (gap > 0) {
      gapBefore[i] = gap;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    const gap = startTime[i + 1] - endTime[i];
    if (gap > 0) {
      gapAfter[i] = gap;
    }
  }

  if (eventTime > endTime[n - 1]) {
    gapAfter[n - 1] = eventTime - endTime[n - 1];
  }

  // Step 5: Try removing each meeting
  let maxFreeTimeResult = 0;

  for (let i = 0; i < n; i++) {
    // Combined gap if we remove this meeting
    const combinedGap = gapBefore[i] + gapAfter[i];

    // Duration of the meeting we're moving
    const duration = durations[i];

    // Option 1: Place at the beginning (time 0)
    let freeIfAtStart = Math.max(combinedGap, eventTime - duration);
    if (startTime[0] > 0) {
      freeIfAtStart = Math.max(freeIfAtStart, startTime[0]);
    }

    // Option 2: Place at the end
    let freeIfAtEnd = Math.max(combinedGap, eventTime - duration);
    if (eventTime > endTime[n - 1]) {
      freeIfAtEnd = Math.max(freeIfAtEnd, eventTime - endTime[n - 1]);
    }

    // Option 3: Place in the largest gap
    let currentLargest = largest;
    if (combinedGap === currentLargest) {
      currentLargest = secondLargest;
    }

    let freeIfInGap;
    if (currentLargest >= duration) {
      // We can place in the largest gap
      const leftPart = currentLargest - duration;
      let newMaxGap = Math.max(combinedGap, leftPart);

      // Also check other gaps
      if (combinedGap !== largest && largest > newMaxGap) {
        newMaxGap = largest;
      }
      if (secondLargest > newMaxGap && secondLargest !== combinedGap) {
        newMaxGap = secondLargest;
      }
      freeIfInGap = newMaxGap;
    } else {
      // Can't place in largest gap
      freeIfInGap = Math.max(combinedGap, currentLargest);
    }

    // Take the best of all placement options
    const bestForThisMeeting = Math.max(freeIfAtStart, freeIfAtEnd, freeIfInGap);
    maxFreeTimeResult = Math.max(maxFreeTimeResult, bestForThisMeeting);
  }

  return maxFreeTimeResult;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

public class Solution {
    public int maxFreeTime(int eventTime, int[] startTime, int[] endTime) {
        int n = startTime.length;

        // Step 1: Calculate all free time gaps
        List<Integer> gaps = new ArrayList<>();

        // Gap before first meeting
        if (startTime[0] > 0) {
            gaps.add(startTime[0]);
        }

        // Gaps between meetings
        for (int i = 1; i < n; i++) {
            int gap = startTime[i] - endTime[i-1];
            if (gap > 0) {
                gaps.add(gap);
            }
        }

        // Gap after last meeting
        if (eventTime > endTime[n-1]) {
            gaps.add(eventTime - endTime[n-1]);
        }

        // If no meetings at all, the entire event is free
        if (n == 0) {
            return eventTime;
        }

        // Step 2: Find largest and second largest gaps
        int largest = 0, secondLargest = 0;
        if (gaps.size() == 0) {
            // All meetings cover the entire event
            largest = secondLargest = 0;
        } else if (gaps.size() == 1) {
            largest = gaps.get(0);
            secondLargest = 0;
        } else {
            // Sort to find two largest gaps
            List<Integer> sortedGaps = new ArrayList<>(gaps);
            sortedGaps.sort(Collections.reverseOrder());
            largest = sortedGaps.get(0);
            secondLargest = sortedGaps.get(1);
        }

        // Step 3: Calculate meeting durations
        int[] durations = new int[n];
        for (int i = 0; i < n; i++) {
            durations[i] = endTime[i] - startTime[i];
        }

        // Step 4: Calculate gaps around each meeting for quick lookup
        int[] gapBefore = new int[n];
        int[] gapAfter = new int[n];

        if (startTime[0] > 0) {
            gapBefore[0] = startTime[0];
        }

        for (int i = 1; i < n; i++) {
            int gap = startTime[i] - endTime[i-1];
            if (gap > 0) {
                gapBefore[i] = gap;
            }
        }

        for (int i = 0; i < n-1; i++) {
            int gap = startTime[i+1] - endTime[i];
            if (gap > 0) {
                gapAfter[i] = gap;
            }
        }

        if (eventTime > endTime[n-1]) {
            gapAfter[n-1] = eventTime - endTime[n-1];
        }

        // Step 5: Try removing each meeting
        int maxFreeTimeResult = 0;

        for (int i = 0; i < n; i++) {
            // Combined gap if we remove this meeting
            int combinedGap = gapBefore[i] + gapAfter[i];

            // Duration of the meeting we're moving
            int duration = durations[i];

            // Option 1: Place at the beginning (time 0)
            int freeIfAtStart = Math.max(combinedGap, eventTime - duration);
            if (startTime[0] > 0) {
                freeIfAtStart = Math.max(freeIfAtStart, startTime[0]);
            }

            // Option 2: Place at the end
            int freeIfAtEnd = Math.max(combinedGap, eventTime - duration);
            if (eventTime > endTime[n-1]) {
                freeIfAtEnd = Math.max(freeIfAtEnd, eventTime - endTime[n-1]);
            }

            // Option 3: Place in the largest gap
            int currentLargest = largest;
            if (combinedGap == currentLargest) {
                currentLargest = secondLargest;
            }

            int freeIfInGap;
            if (currentLargest >= duration) {
                // We can place in the largest gap
                int leftPart = currentLargest - duration;
                int newMaxGap = Math.max(combinedGap, leftPart);

                // Also check other gaps
                if (combinedGap != largest && largest > newMaxGap) {
                    newMaxGap = largest;
                }
                if (secondLargest > newMaxGap && secondLargest != combinedGap) {
                    newMaxGap = secondLargest;
                }
                freeIfInGap = newMaxGap;
            } else {
                // Can't place in largest gap
                freeIfInGap = Math.max(combinedGap, currentLargest);
            }

            // Take the best of all placement options
            int bestForThisMeeting = Math.max(freeIfAtStart, Math.max(freeIfAtEnd, freeIfInGap));
            maxFreeTimeResult = Math.max(maxFreeTimeResult, bestForThisMeeting);
        }

        return maxFreeTimeResult;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Calculating gaps: O(n)
- Finding two largest gaps: O(n) with sorting or O(n) with linear scan
- Precomputing gapBefore and gapAfter: O(n)
- Trying each meeting: O(n)
- Total: O(n) + O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Storing gaps: O(n)
- Storing durations: O(n)
- Storing gapBefore and gapAfter: O(n)
- Total: O(n)

The linear time complexity is optimal since we need to examine each meeting at least once.

## Common Mistakes

1. **Forgetting about boundary gaps**: Candidates often only consider gaps between meetings but forget the free time before the first meeting (0 to startTime[0]) and after the last meeting (endTime[-1] to eventTime). These are valid gaps that can be extended by moving meetings.

2. **Not considering all placement options**: Some candidates only consider placing the moved meeting in the largest existing gap, but the optimal placement might be at the very beginning or end of the event timeline.

3. **Incorrect handling when largest gap equals combined gap**: When the gap created by removing a meeting happens to be the largest gap, you can't use that same gap to place the meeting (you'd be placing it back where it came from). You need to use the second largest gap instead.

4. **Assuming meetings can be placed anywhere**: Meetings have durations, and you can only place a meeting in a gap if the gap is at least as large as the meeting duration. Forgetting to check this leads to invalid solutions.

## When You'll See This Pattern

This problem combines greedy optimization with interval manipulation, which appears in many scheduling problems:

1. **Meeting Rooms II (LeetCode 253)** - Also deals with meeting intervals and requires finding maximum overlaps, using similar interval analysis techniques.

2. **Merge Intervals (LeetCode 56)** - Requires manipulating and combining intervals, building intuition for how gaps between intervals work.

3. **Non-overlapping Intervals (LeetCode 435)** - Focuses on minimizing removals to make intervals non-overlapping, using similar greedy interval selection.

4. **Car Pooling (LeetCode 1094)** - Uses interval-based accumulation to track capacity changes over time.

The core pattern is analyzing gaps between intervals and optimizing based on those gaps, which is common in calendar/scheduling applications.

## Key Takeaways

1. **Gap analysis is powerful for interval problems**: When working with non-overlapping intervals, the gaps between them often hold the key to optimization problems. Always calculate and track these gaps explicitly.

2. **Consider all placement options**: When you can move an element, don't just consider placing it in the most obvious spot (like the largest gap). Consider edge placements (beginning/end) as they might yield better results.

3. **Track top two values, not just the maximum**: When the maximum value might be invalidated by your operation (like using it for placement), you need the second largest value as a fallback. This pattern appears in many optimization problems.

[Practice this problem on CodeJeet](/problem/reschedule-meetings-for-maximum-free-time-ii)
