---
title: "Greedy Questions at Morgan Stanley: What to Expect"
description: "Prepare for Greedy interview questions at Morgan Stanley — patterns, difficulty breakdown, and study tips."
date: "2029-07-12"
category: "dsa-patterns"
tags: ["morgan-stanley", "greedy", "interview prep"]
---

# Greedy Questions at Morgan Stanley: What to Expect

If you're preparing for a software engineering interview at Morgan Stanley, you've probably noticed their question distribution: 8 out of 53 tagged problems are Greedy. That's about 15% — not the dominant category, but significant enough that you can't afford to ignore it. In my experience conducting and analyzing interviews, here's what matters: Morgan Stanley uses Greedy questions not as trick questions, but as a direct test of your problem decomposition skills. They want to see if you can identify when a locally optimal choice leads to a globally optimal solution — a skill that translates directly to financial systems where you're making sequential decisions with limited information.

The reality is you'll likely encounter at least one Greedy question in your interview loop, often in the first or second technical round. These questions serve as efficient filters: they're quicker to implement than complex DP problems, yet they reveal whether a candidate can think algorithmically about optimization. What's interesting is that Morgan Stanley's Greedy problems tend to be "applied" — they often resemble simplified versions of actual financial scheduling or resource allocation problems you might encounter on the job.

## Specific Patterns Morgan Stanley Favors

Morgan Stanley's Greedy problems cluster around three main patterns, with a clear preference for the first two:

1. **Interval Scheduling and Merging** — This is their most frequent pattern. Think about scheduling trades, allocating time slots for system maintenance, or managing overlapping financial transactions. The classic "pick as many non-overlapping intervals as possible" problem appears in various disguises. They particularly like problems where you need to sort by end time and make sequential decisions.

2. **Jump Game Variations** — Problems about reaching the end with minimum jumps or checking feasibility. This maps well to financial risk scenarios: "Given your capital at each step, can you reach the final investment opportunity?" They often use the exact LeetCode Jump Game II (#45) pattern.

3. **Task Scheduling with Constraints** — Less frequent but appears in their list. This involves arranging tasks with cooldowns or priorities, similar to managing queued financial transactions with regulatory delays.

Notice what's missing: pure "coin change" greedy problems (which are actually DP problems in disguise) and Huffman coding type questions. Morgan Stanley stays away from greedy problems where the greedy choice isn't always optimal — they want unambiguous applications.

Here's the classic interval scheduling pattern they love:

<div class="code-group">

```python
def max_non_overlapping_intervals(intervals):
    """
    Classic interval scheduling: maximum number of non-overlapping intervals.
    LeetCode #435 (Non-overlapping Intervals) but for maximum count.

    Time: O(n log n) for sorting | Space: O(1) excluding sort space
    """
    if not intervals:
        return 0

    # Sort by end time (greedy choice: pick the interval that finishes earliest)
    intervals.sort(key=lambda x: x[1])

    count = 1
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= last_end:  # No overlap
            count += 1
            last_end = end

    return count
```

```javascript
function maxNonOverlappingIntervals(intervals) {
  /**
   * Classic interval scheduling: maximum number of non-overlapping intervals.
   * LeetCode #435 (Non-overlapping Intervals) but for maximum count.
   *
   * Time: O(n log n) for sorting | Space: O(1) excluding sort space
   */
  if (!intervals.length) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }

  return count;
}
```

```java
public int maxNonOverlappingIntervals(int[][] intervals) {
    /**
     * Classic interval scheduling: maximum number of non-overlapping intervals.
     * LeetCode #435 (Non-overlapping Intervals) but for maximum count.
     *
     * Time: O(n log n) for sorting | Space: O(1) excluding sort space
     */
    if (intervals.length == 0) return 0;

    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 1;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];

        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }

    return count;
}
```

</div>

## How to Prepare

The biggest mistake candidates make with Greedy problems is assuming they're "easy intuition" questions. At Morgan Stanley, you need to prove your greedy choice is optimal. Here's my preparation framework:

1. **Always prove correctness** — Before coding, verbally explain why making the greedy choice at each step won't hurt the final solution. Interviewers expect this reasoning.

2. **Sorting is your friend** — 80% of Morgan Stanley's Greedy problems start with sorting the input. Get comfortable with custom comparators in all three languages.

3. **Practice the jump pattern** — This appears so frequently it's worth memorizing the optimal greedy approach:

<div class="code-group">

```python
def jump_game_ii(nums):
    """
    LeetCode #45: Jump Game II - Minimum jumps to reach end.

    Time: O(n) | Space: O(1)
    """
    if len(nums) <= 1:
        return 0

    jumps = 0
    current_end = 0
    farthest = 0

    # We don't need to check the last element
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])

        # If we've reached the end of current jump
        if i == current_end:
            jumps += 1
            current_end = farthest

            # Early exit if we can already reach the end
            if current_end >= len(nums) - 1:
                break

    return jumps
```

```javascript
function jumpGameII(nums) {
  /**
   * LeetCode #45: Jump Game II - Minimum jumps to reach end.
   *
   * Time: O(n) | Space: O(1)
   */
  if (nums.length <= 1) return 0;

  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;

  // We don't need to check the last element
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    // If we've reached the end of current jump
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;

      // Early exit if we can already reach the end
      if (currentEnd >= nums.length - 1) break;
    }
  }

  return jumps;
}
```

```java
public int jumpGameII(int[] nums) {
    /**
     * LeetCode #45: Jump Game II - Minimum jumps to reach end.
     *
     * Time: O(n) | Space: O(1)
     */
    if (nums.length <= 1) return 0;

    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;

    // We don't need to check the last element
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        // If we've reached the end of current jump
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;

            // Early exit if we can already reach the end
            if (currentEnd >= nums.length - 1) break;
        }
    }

    return jumps;
}
```

</div>

## How Morgan Stanley Tests Greedy vs Other Companies

Compared to FAANG companies, Morgan Stanley's Greedy questions have distinct characteristics:

- **Less "tricky"**: Google might give you a Greedy problem where the greedy choice seems obvious but is actually wrong (to test counterexample thinking). Morgan Stanley uses proven, textbook Greedy algorithms.
- **More business context**: The problem statement often includes financial terminology — "transactions" instead of "intervals," "capital" instead of "jump length."
- **Medium difficulty ceiling**: You won't see LeetCode Hard Greedy problems. Their hardest is usually around LeetCode Medium.
- **Follow-up questions**: They love asking "What if we changed constraint X?" — for example, "What if each interval had a weight and we wanted to maximize total weight?" (which becomes a DP problem). This tests whether you understand the boundaries of the greedy approach.

Goldman Sachs, by comparison, uses more graph-based greedy algorithms (like Minimum Spanning Tree), while JPMorgan leans toward scheduling problems similar to Morgan Stanley.

## Study Order

Don't study Greedy algorithms randomly. Follow this progression:

1. **Basic interval scheduling** — Start with the classic "maximum non-overlapping intervals" pattern. This teaches you the core greedy proof technique: "Choosing the interval that ends earliest leaves the most room for others."

2. **Jump Game variations** — Master both Jump Game (#55) and Jump Game II (#45). These teach you how to make greedy decisions with forward-looking information.

3. **Task scheduling** — Practice Task Scheduler (#621) to learn greedy with priority queues and constraints.

4. **Merge intervals** — While Merge Intervals (#56) is often categorized under "Sorting," it uses greedy merging logic. Good transitional problem.

5. **Gas Station** (#134) — This circular greedy problem appears occasionally and tests more advanced reasoning.

6. **Advanced variations** — Only after mastering the above, try problems like Minimum Number of Arrows to Burst Balloons (#452) or Partition Labels (#763).

This order works because each step builds on the previous: interval scheduling teaches the sorting + sequential decision pattern, jump games add the "look ahead" component, task scheduling introduces priority management, and so on.

## Recommended Practice Order

Solve these Morgan Stanley-tagged problems in sequence:

1. **Jump Game II** (#45) — Master the minimum jumps pattern first
2. **Merge Intervals** (#56) — Learn to merge overlapping ranges
3. **Task Scheduler** (#621) — Handle constraints and cooling periods
4. **Non-overlapping Intervals** (#435) — The inverse of maximum intervals
5. **Gas Station** (#134) — Circular greedy reasoning
6. **Partition Labels** (#763) — Greedy partitioning with last occurrence tracking
7. **Minimum Number of Arrows to Burst Balloons** (#452) — Interval scheduling variation
8. **Valid Parenthesis String** (#678) — Advanced greedy with bounds tracking

Spend extra time on #45 and #435 — these patterns appear most frequently. For each problem, practice explaining _why_ the greedy approach works before coding.

Remember: At Morgan Stanley, the Greedy question isn't just about getting the right answer. It's about demonstrating systematic thinking, proving your approach, and connecting the algorithm to practical financial scenarios. Nail that, and you'll stand out from candidates who just memorize solutions.

[Practice Greedy at Morgan Stanley](/company/morgan-stanley/greedy)
