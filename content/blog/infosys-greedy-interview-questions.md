---
title: "Greedy Questions at Infosys: What to Expect"
description: "Prepare for Greedy interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-12"
category: "dsa-patterns"
tags: ["infosys", "greedy", "interview prep"]
---

## Why Greedy Matters at Infosys

Infosys, as a major global consulting and IT services firm, conducts a high volume of technical interviews for roles ranging from entry-level systems engineers to experienced domain consultants. Their coding assessments and interviews often emphasize practical, efficient solutions to real-world optimization problems—exactly the domain where greedy algorithms shine. With 18 out of 158 tagged questions being greedy, it represents a significant 11% of their problem bank. This isn't a coincidence. In real client projects—whether it's scheduling resources, minimizing costs, or optimizing delivery routes—greedy approaches provide intuitive, fast, and often "good enough" solutions that are valuable in time-sensitive business contexts.

While not as deep a focus as data structures, greedy algorithms are a **core secondary topic** at Infosys. You are very likely to encounter at least one greedy-style problem in their online coding round or technical interview. The key is that Infosys problems tend to be **applied**. You won't get abstract, purely algorithmic puzzles. Instead, you'll get problems framed as business scenarios: "assign tasks to minimize overtime," "select meetings to maximize room usage," or "arrange orders for fastest delivery." Recognizing the greedy pattern within the business narrative is half the battle.

## Specific Patterns Infosys Favors

Infosys's greedy problems cluster around a few classic, highly applicable patterns. They heavily favor problems where you **sort first, then make optimal local choices**.

1.  **Interval Scheduling & Merging:** This is their bread and butter. Problems about non-overlapping intervals, meeting rooms, or job scheduling almost always have a greedy solution. The pattern is: sort by ending time, then iterate, keeping the interval that ends the earliest.
    - **LeetCode Examples:** Meeting Rooms II (#253), Non-overlapping Intervals (#435), Merge Intervals (#56).
2.  **"Largest/Smallest from Array" with Sorting:** Many problems ask for the maximum number of tasks, minimum number of something, or the optimal arrangement. The solution usually involves sorting the input array based on a specific criterion (like value-to-weight ratio, deadline, or end time) and then building the answer piece by piece.
    - **LeetCode Examples:** Assign Cookies (#455), Minimum Number of Arrows to Burst Balloons (#452).
3.  **Simple "Jump Game" Style Problems:** These test your ability to see if a goal is reachable through optimal local jumps. While LeetCode's Jump Game II (#45) is more complex, Infosys often uses simpler variants that are essentially linear scans tracking the farthest reachable point.
4.  **Basic "Gas Station" Circuit Problems:** Problems about completing a circular route given constraints (#134) are a classic greedy test of seeing if a total surplus exists and finding the correct starting point.

You'll notice a distinct lack of highly complex, proof-intensive greedy problems (like Huffman coding or minimum spanning tree primitives in a vacuum). Infosys's selection is pragmatic.

## How to Prepare

Your preparation should focus on mastering the **sorting-based greedy template**. The mental model is: "If I sort the data by _this_ property, then the locally best choice at each step will lead to the globally optimal answer." Let's look at the most common pattern: the Interval Scheduling template.

The classic question: "Given a set of intervals, find the minimum number of intervals to remove to make the rest non-overlapping." (LeetCode #435). The greedy insight: to fit the most intervals, always keep the interval that ends the soonest, as it leaves the most room for others.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435. Minimum number of intervals to remove.
    Greedy choice: Always pick the interval with the earliest end time.
    Time: O(n log n) due to sorting.
    Space: O(1) (or O(n) if sorting uses extra space, but we ignore input).
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    # `last_end` tracks the end time of the last kept interval
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start < last_end:
            # Overlap occurs, we need to remove this interval
            count += 1
        else:
            # No overlap, we can keep this interval
            last_end = end

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // Time: O(n log n) | Space: O(1) (ignoring sort space)
  if (intervals.length === 0) return 0;

  // Sort by ending time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      // Overlap, remove this one
      count++;
    } else {
      // Keep this one, update the last end time
      lastEnd = end;
    }
  }
  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // Time: O(n log n) | Space: O(log n) for sorting (Java's TimSort uses auxiliary space)
    if (intervals.length == 0) return 0;

    // Sort by ending time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start < lastEnd) {
            // Overlap, discard this interval
            count++;
        } else {
            // No overlap, update the last end to this interval's end
            lastEnd = end;
        }
    }
    return count;
}
```

</div>

Another key pattern is the **"Largest/Smallest from Array"** problem, like Assign Cookies (#455). The greedy choice is to assign the smallest cookie that satisfies each child, which requires sorting both arrays.

<div class="code-group">

```python
def findContentChildren(g, s):
    """
    LeetCode #455. Assign Cookies.
    Greedy choice: For each child, give the smallest sufficient cookie.
    Time: O(n log n + m log m) for sorting.
    Space: O(1).
    """
    g.sort()  # children's greed factors
    s.sort()  # cookie sizes
    child_i = cookie_j = 0
    while child_i < len(g) and cookie_j < len(s):
        if s[cookie_j] >= g[child_i]:
            # This cookie can satisfy the child
            child_i += 1
        cookie_j += 1  # Move to next cookie, whether used or not
    return child_i  # Number of satisfied children
```

```javascript
function findContentChildren(g, s) {
  // Time: O(n log n + m log m) | Space: O(1)
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let childIdx = 0;
  let cookieIdx = 0;
  while (childIdx < g.length && cookieIdx < s.length) {
    if (s[cookieIdx] >= g[childIdx]) {
      childIdx++; // Child satisfied
    }
    cookieIdx++; // Cookie used or too small
  }
  return childIdx;
}
```

```java
public int findContentChildren(int[] g, int[] s) {
    // Time: O(n log n + m log m) | Space: O(log n + log m) for sorting space
    Arrays.sort(g);
    Arrays.sort(s);
    int childIdx = 0;
    for (int cookieIdx = 0; childIdx < g.length && cookieIdx < s.length; cookieIdx++) {
        if (s[cookieIdx] >= g[childIdx]) {
            childIdx++;
        }
    }
    return childIdx;
}
```

</div>

## How Infosys Tests Greedy vs Other Companies

- **vs. FAANG:** FAANG interviews (especially Google, Meta) often use greedy algorithms as a component within a more complex problem or expect a rigorous optimality proof. Infosys questions are more self-contained and applied. The difficulty is lower—typically LeetCode Easy to Medium, where the greedy approach is the _primary_ solution, not one of several possible optimizations.
- **vs. Startups:** Startup interviews might dive deeper into one specific domain (e.g., a logistics startup focusing solely on scheduling greedy problems). Infosys's range is broader but shallower.
- **The Infosys Unique Angle:** Their questions are almost always **wordy**. They embed the algorithmic core in a business process description. Your first task is to strip away the narrative about "server jobs," "consultant assignments," or "delivery slots" and map it to a known greedy pattern (interval, assignment, jump game). Practice reading carefully.

## Study Order

1.  **Foundations of "Greedy Choice":** Start with the simplest problems that teach the "pick the best local option" principle. Problems like Assign Cookies (#455) or Lemonade Change (#860) are perfect. They build intuition without complex data structures.
2.  **Interval-Based Greedy:** This is the most critical category for Infosys. Learn the "sort by end time" pattern inside out. Practice on Non-overlapping Intervals (#435) and Meeting Rooms (#252) before tackling the slightly harder Meeting Rooms II (#253), which introduces the min-heap for a hybrid approach.
3.  **Array-Based "Jump" and "Circuit" Problems:** Move to problems that require a single pass with a tracking variable, like Jump Game (#55) and Gas Station (#134). These test your ability to maintain a "running balance" or "maximum reach."
4.  **Advanced Scheduling & "Two-Pass" Greedy:** Finally, look at problems that might require sorting by different criteria or a secondary data structure. Task Scheduler (#621) is a good example, though it's at the upper bound of Infosys difficulty.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the intuition of the last.

1.  **Assign Cookies (#455)** - The classic introductory greedy.
2.  **Lemonade Change (#860)** - Simple simulation with greedy decision-making.
3.  **Valid Palindrome II (#680)** - A simple "one-removal" greedy check.
4.  **Meeting Rooms (#252)** - Your first interval problem (just checking overlaps).
5.  **Non-overlapping Intervals (#435)** - The fundamental interval scheduling template.
6.  **Minimum Number of Arrows to Burst Balloons (#452)** - A variation of the interval pattern.
7.  **Merge Intervals (#56)** - Often solved greedily after sorting.
8.  **Jump Game (#55)** - Single-pass reachability check.
9.  **Gas Station (#134)** - The classic circuit problem.
10. **Meeting Rooms II (#253)** - Introduces the heap for tracking multiple rooms, a good next step.

Mastering this progression will make you exceptionally well-prepared for the greedy algorithm questions you'll face in an Infosys interview. Remember to always articulate your reasoning: "I'm sorting by this because the optimal solution will involve selecting the item with the highest X first..."

[Practice Greedy at Infosys](/company/infosys/greedy)
