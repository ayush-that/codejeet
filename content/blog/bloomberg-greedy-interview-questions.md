---
title: "Greedy Questions at Bloomberg: What to Expect"
description: "Prepare for Greedy interview questions at Bloomberg — patterns, difficulty breakdown, and study tips."
date: "2027-04-22"
category: "dsa-patterns"
tags: ["bloomberg", "greedy", "interview prep"]
---

# Greedy Questions at Bloomberg: What to Expect

If you're preparing for a Bloomberg interview, you've probably noticed their LeetCode company tag includes 110 Greedy problems out of 1173 total. That's roughly 9.4% — not the largest category, but significant enough that you'll almost certainly encounter at least one greedy question in your interview loop. What makes greedy algorithms particularly relevant for Bloomberg isn't just their frequency, but their domain alignment. Financial data processing, real-time market updates, and resource scheduling problems — all common in fintech — often have optimal greedy solutions. Interviewers here don't just test whether you can implement a greedy algorithm; they test whether you can recognize when a greedy approach is appropriate and prove its optimality.

## Specific Patterns Bloomberg Favors

Bloomberg's greedy questions tend to cluster around practical, optimization-focused scenarios rather than abstract mathematical puzzles. You'll notice three recurring themes:

1. **Interval scheduling and merging** — Think meeting rooms, trade execution windows, or data feed consolidation. Problems like "Non-overlapping Intervals" (#435) and "Merge Intervals" (#56) appear frequently because they model real scheduling constraints in financial systems.

2. **String manipulation with local optimization** — Problems where you make the "best" immediate choice to transform or compare strings. "Valid Parenthesis String" (#678) is a classic example where greedy validation beats brute force.

3. **Array partitioning and assignment** — Distributing resources or balancing loads, like "Task Scheduler" (#621) or "Partition Labels" (#763). These mirror actual problems in distributing computational workloads across Bloomberg's servers.

What's notably absent are highly mathematical greedy proofs or exotic graph greedy algorithms. Bloomberg prefers applied greedy thinking where the "greedy choice property" is intuitively visible through business logic.

## How to Prepare

The key to greedy problems isn't memorization — it's justification. You need to articulate why the greedy choice leads to a global optimum. Practice this reasoning explicitly. For interval problems, the pattern is almost always: sort by ending time, then iterate while tracking the last valid endpoint.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Greedy strategy: Keep the interval that ends earliest to maximize capacity
    """
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    for i in range(1, len(intervals)):
        start, end = intervals[i]
        if start < last_end:
            # Overlap found, we need to remove one
            count += 1
        else:
            # No overlap, update our last endpoint
            last_end = end

    return count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function eraseOverlapIntervals(intervals) {
  // LeetCode #435: Non-overlapping Intervals
  if (!intervals.length) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      count++;
    } else {
      lastEnd = end;
    }
  }

  return count;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public int eraseOverlapIntervals(int[][] intervals) {
    // LeetCode #435: Non-overlapping Intervals
    if (intervals.length == 0) return 0;

    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];

        if (start < lastEnd) {
            count++;
        } else {
            lastEnd = end;
        }
    }

    return count;
}
```

</div>

For string problems, the pattern often involves tracking balances or counts while scanning left to right:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkValidString(s):
    """
    LeetCode #678: Valid Parenthesis String
    Greedy strategy: Track possible balance ranges instead of exact counts
    """
    low = high = 0  # Possible minimum and maximum balance

    for char in s:
        if char == '(':
            low += 1
            high += 1
        elif char == ')':
            low = max(low - 1, 0)
            high -= 1
        else:  # '*'
            low = max(low - 1, 0)
            high += 1

        if high < 0:  # More ')' than '(' even with maximum * as '('
            return False

    return low == 0  # Can we reach perfect balance?
```

```javascript
// Time: O(n) | Space: O(1)
function checkValidString(s) {
  // LeetCode #678: Valid Parenthesis String
  let low = 0,
    high = 0;

  for (let char of s) {
    if (char === "(") {
      low++;
      high++;
    } else if (char === ")") {
      low = Math.max(low - 1, 0);
      high--;
    } else {
      // '*'
      low = Math.max(low - 1, 0);
      high++;
    }

    if (high < 0) return false;
  }

  return low === 0;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean checkValidString(String s) {
    // LeetCode #678: Valid Parenthesis String
    int low = 0, high = 0;

    for (char c : s.toCharArray()) {
        if (c == '(') {
            low++;
            high++;
        } else if (c == ')') {
            low = Math.max(low - 1, 0);
            high--;
        } else {  // '*'
            low = Math.max(low - 1, 0);
            high++;
        }

        if (high < 0) return false;
    }

    return low == 0;
}
```

</div>

## How Bloomberg Tests Greedy vs Other Companies

At Google or Meta, greedy questions often serve as warm-ups or parts of larger system design discussions. At Bloomberg, they're frequently standalone, medium-difficulty questions that test practical optimization thinking. The difference is in the framing:

- **FAANG companies** might ask: "Given these constraints, find the optimal solution" — testing if you can derive the greedy approach from first principles.
- **Bloomberg typically asks**: "We have trading windows from 9-11, 10-12, 11-1... schedule the maximum number" — testing if you can map real-world problems to known greedy patterns.

Bloomberg interviewers also place more emphasis on edge cases related to financial data — what happens at market open/close, how to handle zero or negative values, timezone considerations. They're testing not just algorithmic competence but domain-aware thinking.

## Study Order

1. **Basic interval problems** — Start with "Merge Intervals" (#56) to understand sorting by start/end times. This builds intuition for why ordering matters.
2. **Interval selection** — Move to "Non-overlapping Intervals" (#435) and "Minimum Number of Arrows to Burst Balloons" (#452). These teach the "earliest finish time" heuristic.
3. **String validation with wildcards** — "Valid Parenthesis String" (#678) introduces the balance range technique, which is more subtle than simple stack approaches.
4. **Partitioning problems** — "Partition Labels" (#763) and "Task Scheduler" (#621) introduce the "greedy by frequency/density" pattern.
5. **Advanced scheduling** — "Meeting Rooms II" (#253) bridges greedy with heap usage, showing where greedy alone isn't sufficient.
6. **Bloomberg-specific variations** — Practice problems from their tagged list that add financial twists, like prices, timestamps, or resource limits.

This order works because it builds from simple sorting-based greedy to more complex state-tracking greedy, finally adding domain-specific constraints.

## Recommended Practice Order

1. Merge Intervals (#56) — Foundation
2. Non-overlapping Intervals (#435) — Core pattern
3. Valid Parenthesis String (#678) — String greedy thinking
4. Partition Labels (#763) — Array partitioning
5. Task Scheduler (#621) — Scheduling with constraints
6. Minimum Number of Arrows to Burst Balloons (#452) — Interval variation
7. Meeting Rooms II (#253) — Greedy + heap hybrid
8. Bloomberg-specific: "Best Time to Buy and Sell Stock II" (#122) — Financial greedy
9. Bloomberg-specific: "Candy" (#135) — Distribution pattern

After these, explore Bloomberg's tagged greedy problems, focusing on those with 50+ frequency counts. Notice how many involve time series data or optimization — that's your hint about what they value.

[Practice Greedy at Bloomberg](/company/bloomberg/greedy)
