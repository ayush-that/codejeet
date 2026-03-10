---
title: "Greedy Questions at Expedia: What to Expect"
description: "Prepare for Greedy interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-06"
category: "dsa-patterns"
tags: ["expedia", "greedy", "interview prep"]
---

## Why Greedy Matters at Expedia

If you're preparing for Expedia, you can't afford to ignore greedy algorithms. With 10 out of 54 total questions tagged as greedy on their company-specific LeetCode list, that's roughly 18.5% of their problem bank. In practice, this means you have about a 1 in 5 chance of encountering a greedy problem in any given interview round. But the real significance isn't just the frequency—it's what these problems reveal about Expedia's engineering priorities.

Expedia operates in travel optimization: finding the cheapest flights, booking the best hotel sequences, maximizing layover efficiency, and scheduling resources. These are fundamentally greedy-type problems in the real world. When an interviewer asks you a greedy algorithm question, they're not just testing algorithmic knowledge—they're assessing whether you can recognize optimization patterns that mirror their actual business problems. The ability to prove or at least argue why a greedy approach works (optimal substructure and the greedy choice property) shows you can think about correctness in resource-constrained systems, which is core to Expedia's platform.

## Specific Patterns Expedia Favors

Expedia's greedy problems cluster around three practical patterns:

1. **Interval Scheduling & Merging**: This is their most frequent pattern. Think about hotel stays (intervals) and maximizing bookings or minimizing conflicts. Problems like "Non-overlapping Intervals" (#435) and "Meeting Rooms II" (#253) appear in variations.

2. **Jump Game Variations**: These test whether you can reach an endpoint with constraints, directly analogous to multi-city itineraries or connection problems. "Jump Game" (#55) and "Jump Game II" (#45) are classic examples.

3. **Task Scheduling & Partitioning**: Problems where you need to arrange tasks with cooldowns or split resources evenly. This mirrors their backend job scheduling for price updates and availability checks.

Notice what's missing: complex graph greedy algorithms (like Prim's or Kruskal's) rarely appear. Expedia prefers greedy problems that have straightforward, intuitive explanations rather than mathematically heavy ones. Their questions often have a "business narrative" wrapper—you're not just merging intervals, you're optimizing hotel bookings for maximum revenue.

## How to Prepare

The key to Expedia's greedy questions is proving your approach. You can't just implement; you need to explain _why_ the greedy choice leads to a global optimum. Let's examine the interval pattern, which appears most frequently.

<div class="code-group">

```python
# Pattern: Interval Scheduling - Maximum Non-Overlapping Intervals
# Problem: LeetCode #435 "Non-overlapping Intervals"
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation

def eraseOverlapIntervals(intervals):
    """
    Returns minimum intervals to remove to make all non-overlapping.
    Greedy choice: Always pick the interval with the earliest end time.
    Why it works: Leaving maximum room for future intervals.
    """
    if not intervals:
        return 0

    # Sort by end time (greedy choice property)
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for i in range(1, len(intervals)):
        current_start, current_end = intervals[i]
        if current_start < prev_end:
            # Overlap found, we need to remove one
            count += 1
            # We implicitly remove the current interval by not updating prev_end
        else:
            # No overlap, keep this interval
            prev_end = current_end

    return count
```

```javascript
// Pattern: Interval Scheduling - Maximum Non-Overlapping Intervals
// Problem: LeetCode #435 "Non-overlapping Intervals"
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation

function eraseOverlapIntervals(intervals) {
  if (!intervals || intervals.length === 0) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];
    if (currentStart < prevEnd) {
      // Overlap - we remove current interval
      count++;
    } else {
      // No overlap - update tracking
      prevEnd = currentEnd;
    }
  }

  return count;
}
```

```java
// Pattern: Interval Scheduling - Maximum Non-Overlapping Intervals
// Problem: LeetCode #435 "Non-overlapping Intervals"
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation

import java.util.Arrays;

public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return 0;

    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int currentStart = intervals[i][0];
        int currentEnd = intervals[i][1];

        if (currentStart < prevEnd) {
            // Overlap - remove current interval
            count++;
        } else {
            // No overlap - update tracking
            prevEnd = currentEnd;
        }
    }

    return count;
}
```

</div>

The second pattern to master is the jump game approach, which uses a different greedy intuition:

<div class="code-group">

```python
# Pattern: Jump Game - Minimum Jumps to Reach End
# Problem: LeetCode #45 "Jump Game II"
# Time: O(n) | Space: O(1)

def jump(nums):
    """
    Returns minimum jumps to reach last index.
    Greedy choice: At each step, jump to the position that gives
    maximum reach in the next jump.
    """
    if len(nums) <= 1:
        return 0

    jumps = 0
    current_end = 0
    farthest = 0

    for i in range(len(nums) - 1):  # Don't need to process last element
        farthest = max(farthest, i + nums[i])

        if i == current_end:
            # Time to jump
            jumps += 1
            current_end = farthest

            if current_end >= len(nums) - 1:
                break

    return jumps
```

```javascript
// Pattern: Jump Game - Minimum Jumps to Reach End
// Problem: LeetCode #45 "Jump Game II"
// Time: O(n) | Space: O(1)

function jump(nums) {
  if (nums.length <= 1) return 0;

  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;

      if (currentEnd >= nums.length - 1) {
        break;
      }
    }
  }

  return jumps;
}
```

```java
// Pattern: Jump Game - Minimum Jumps to Reach End
// Problem: LeetCode #45 "Jump Game II"
// Time: O(n) | Space: O(1)

public int jump(int[] nums) {
    if (nums == null || nums.length <= 1) return 0;

    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;

    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;

            if (currentEnd >= nums.length - 1) {
                break;
            }
        }
    }

    return jumps;
}
```

</div>

## How Expedia Tests Greedy vs Other Companies

Expedia's greedy questions differ from other companies in subtle but important ways:

**Compared to FAANG**: Google and Meta might ask greedy problems with mathematical proofs or combined with other patterns (greedy + binary search). Expedia's questions are more self-contained and practical. While a Google interviewer might expect you to formally prove optimal substructure, Expedia interviewers are satisfied with a clear, logical explanation of why your approach works.

**Difficulty Level**: Expedia's greedy questions are typically medium difficulty. You won't find "hard" greedy problems like "Candy" (#135) or "Remove Duplicate Letters" (#316) in their common question list. Their focus is on implementation correctness and clear reasoning rather than obscure optimizations.

**Unique Aspect**: Expedia often presents greedy problems with a travel or scheduling narrative. The problem description might talk about flight segments, hotel bookings, or activity planning. This is both a hint (think intervals or sequencing) and a test of whether you can extract the algorithmic core from a business problem.

## Study Order

1. **Basic Greedy Proof Concepts** - Understand optimal substructure and the greedy choice property. You don't need formal proofs, but you should be able to articulate why a greedy approach works for a given problem.

2. **Interval Problems** - Start with "Meeting Rooms" (#252), then "Meeting Rooms II" (#253), then "Non-overlapping Intervals" (#435). This progression builds from simple checking to scheduling to optimization.

3. **Jump Game Variations** - Begin with "Jump Game" (#55) to understand reachability, then advance to "Jump Game II" (#45) for minimum jumps. These teach forward-looking greedy decisions.

4. **Task Scheduling** - Practice "Task Scheduler" (#621) which introduces cooldown constraints. This is the most complex greedy pattern Expedia typically asks.

5. **Partition Problems** - Study "Partition Labels" (#763) which combines greedy partitioning with hash maps. This pattern occasionally appears in Expedia interviews.

This order works because it builds from conceptual understanding to simple implementations, then to more complex constraints. Each pattern reinforces the greedy mindset while adding new elements.

## Recommended Practice Order

Solve these problems in sequence:

1. **Meeting Rooms** (#252) - Basic interval checking
2. **Non-overlapping Intervals** (#435) - Interval optimization
3. **Merge Intervals** (#56) - Interval manipulation (though not strictly greedy, often appears)
4. **Jump Game** (#55) - Basic reachability
5. **Jump Game II** (#45) - Optimization with jumps
6. **Gas Station** (#134) - Circular greedy problem (appears in Expedia's list)
7. **Partition Labels** (#763) - String partitioning
8. **Task Scheduler** (#621) - Scheduling with constraints

After completing these eight problems, you'll have covered 80% of Expedia's greedy question patterns. The remaining 20% are variations that combine these concepts or add slight twists.

Remember: At Expedia, your explanation matters as much as your code. Practice verbalizing why the greedy approach works for each problem type. When you can clearly explain "We sort by end time because..." or "We track the farthest reach because...", you demonstrate the kind of systematic thinking their engineering teams value.

[Practice Greedy at Expedia](/company/expedia/greedy)
