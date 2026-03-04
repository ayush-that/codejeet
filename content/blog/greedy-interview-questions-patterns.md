---
title: "Greedy Interview Questions: Patterns and Strategies"
description: "Master Greedy problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2027-12-20"
category: "dsa-patterns"
tags: ["greedy", "dsa", "interview prep"]
---

Greedy algorithms are a staple of coding interviews because they test your ability to recognize when a locally optimal choice leads to a globally optimal solution. While not suitable for every problem, when applicable, greedy approaches often yield the most efficient and elegant code. Mastering a few core patterns can help you identify these opportunities under pressure.

## Common Patterns

Greedy problems often disguise themselves. Recognizing these underlying structures is half the battle.

### 1. Interval Scheduling

The classic pattern is scheduling the maximum number of non-overlapping intervals. The greedy choice is to always pick the interval that ends the earliest, freeing up the rest of the timeline.

<div class="code-group">

```python
def max_non_overlapping_intervals(intervals):
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = float('-inf')

    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

```javascript
function maxNonOverlappingIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
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
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 0;
    int lastEnd = Integer.MIN_VALUE;

    for (int[] interval : intervals) {
        if (interval[0] >= lastEnd) {
            count++;
            lastEnd = interval[1];
        }
    }
    return count;
}
```

</div>

### 2. Greedy Choice with Sorting

Many problems require sorting the input first to enable a simple greedy pass. "Assign Cookies" is a prime example: match the smallest cookie to the smallest child's greed factor.

### 3. Jump Game / Reachability

Problems like "Jump Game" ask if you can reach the end. The greedy strategy is to track the farthest index you can reach at each step, updating it as you iterate.

<div class="code-group">

```python
def can_jump(nums):
    farthest = 0
    for i, n in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + n)
    return True
```

```javascript
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}
```

```java
public boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;
        farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
}
```

</div>

## Difficulty Breakdown

Our data on 367 questions shows a clear distribution: **Easy: 44 (12%), Medium: 245 (67%), Hard: 78 (21%)**. This split is telling.

The majority are Medium difficulty. This indicates interviewers use greedy problems to assess _pattern application_, not just algorithm knowledge. A Medium problem typically combines a greedy core with another concept, like sorting or data structure management, requiring you to identify the greedy choice within a more complex scenario.

The 21% Hard problems often involve proving the correctness of your greedy choice or combining it with advanced techniques like dynamic programming for optimization. The low percentage of Easy problems suggests that pure, straightforward greedy applications are less common in interviews—they're usually a component of a larger challenge.

## Which Companies Ask Greedy

Greedy questions are frequently asked by top tech companies, especially for roles involving optimization and system design.

- [Amazon](/company/amazon) often asks interval and scheduling problems.
- [Google](/company/google) favors problems requiring a non-obvious greedy proof, like "Minimum Number of Arrows to Burst Balloons."
- [Microsoft](/company/microsoft) and [Meta](/company/meta) commonly include greedy in their interview loops, particularly for array and string manipulation problems.
- [Bloomberg](/company/bloomberg) asks greedy algorithms in financial and data stream contexts.

## Study Tips

1.  **Learn the Proofs.** Don't just memorize solutions. Understand _why_ the greedy choice works for patterns like interval scheduling. Being able to justify your algorithm is crucial.
2.  **Start with Sorting.** If a problem involves "minimum," "maximum," or "earliest," try sorting the input first. This often reveals the greedy strategy.
3.  **Practice the Core Patterns.** Drill the three patterns above until you can code them from scratch. Most greedy questions are a variation of these themes.
4.  **When in Doubt, Check Counterexamples.** If you think a greedy approach might work, test it against simple edge cases. A quick counterexample can save you from going down a wrong path.

[Practice all Greedy questions on CodeJeet](/topic/greedy)
