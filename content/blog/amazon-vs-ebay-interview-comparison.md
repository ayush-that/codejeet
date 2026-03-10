---
title: "Amazon vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Amazon and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2029-01-03"
category: "tips"
tags: ["amazon", "ebay", "comparison"]
---

If you're interviewing at both Amazon and eBay, or trying to decide where to focus your limited prep time, you're facing two very different beasts. Amazon's interview process is a well-documented, high-volume gauntlet that's become a benchmark for the industry. eBay's process is more focused and less publicized, but no less rigorous within its scope. The core difference isn't just in question count—it's in strategic approach. Preparing for Amazon is like training for a marathon with known checkpoints; preparing for eBay is like sharpening your skills for a targeted decathlon. This guide will break down the numbers, the overlaps, and the unique demands of each to help you build an efficient, dual-track preparation strategy.

## Question Volume and Difficulty: A Tale of Two Scales

The raw numbers tell a stark story. On platforms like LeetCode, Amazon has **1,938** tagged questions, dwarfing eBay's **60**. This disparity isn't just about company size; it reflects the nature of their interview processes and how long they've been a staple of tech recruiting.

- **Amazon (E530/M1057/H351):** The difficulty distribution is a classic bell curve, heavily weighted toward **Medium** problems. This is the sweet spot for Amazon interviews: problems that are conceptually accessible but require clean, optimal implementation under pressure. The high number of Easy questions often serves as foundational practice, while the Hard questions test depth on core data structures. The volume means you cannot "grind" every problem. Success requires **pattern recognition**.
- **eBay (E12/M38/H10):** With only 60 questions, the pool is shallow but concentrated. The focus is overwhelmingly on **Medium** difficulty, with a handful of Easy warm-ups and a few Hard problems that likely represent senior or specialized roles. This smaller corpus suggests two things: 1) eBay's question bank is less "leaked" or over-analyzed, and 2) They may reuse or slightly modify a core set of problems more frequently. Your preparation must be **deep and precise** on fundamentals, as you're more likely to encounter a known problem variant.

**Implication:** For Amazon, breadth and pattern-matching are key. For eBay, mastering the fundamentals covered in their limited set is critical—there are fewer surprises, but less room for error.

## Topic Overlap: The Common Core

Both companies test a strong foundation in computer science fundamentals. The overlap is your highest-return study area.

- **Heavy Overlap (Study These First):**
  - **Array & String:** Manipulation, traversal, two-pointer techniques, sliding window.
  - **Hash Table:** The go-to tool for O(1) lookups, frequency counting, and complement searching (like in Two Sum).
- **Significant for Both:**
  - **Sorting:** Often a prerequisite step for more complex algorithms. Understanding _when_ to sort is as important as knowing how.
- **The Divergence:**
  - **Amazon Unique:** **Dynamic Programming (DP)** is a major topic for Amazon (evident in their tag count). Problems like knapsack, longest common subsequence, or unique paths are fair game. This tests a candidate's ability to break down complex problems and optimize overlapping subproblems.
  - **eBay Unique:** While not exclusive, the official tag list highlights **Sorting** as a distinct priority. Expect to not just use sorting, but to discuss trade-offs between sorts or implement comparator logic.

## Preparation Priority Matrix

Use this to triage your study time, especially if prepping for both.

| Priority                      | Topics                                                                                      | Rationale                                                                                             | Sample LeetCode Problems                                                                       |
| :---------------------------- | :------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Tier 1 (Max ROI)**          | **Array, String, Hash Table**                                                               | Universal fundamentals. Mastery here pays off in _every_ interview.                                   | #1 Two Sum, #242 Valid Anagram, #121 Best Time to Buy and Sell Stock                           |
| **Tier 2 (Amazon-First)**     | **Dynamic Programming, Trees (BFS/DFS), Graphs**                                            | DP is a known Amazon staple. Trees/Graphs are high-frequency even if not top-tagged.                  | #70 Climbing Stairs (DP intro), #102 Binary Tree Level Order Traversal, #200 Number of Islands |
| **Tier 2 (eBay-First)**       | **Sorting, Linked Lists**                                                                   | Deep dive into sorting applications and linked list pointer manipulation.                             | #56 Merge Intervals (sorting application), #206 Reverse Linked List                            |
| **Tier 3 (Company-Specific)** | **Amazon:** System Design, Leadership Principles. **eBay:** In-depth review of their 60 Qs. | Amazon's behavioral and system design rounds are half the battle. eBay's focused list demands review. | N/A                                                                                            |

## Interview Format Differences

The structure of the day itself varies significantly.

- **Amazon:**
  - **The Loop:** Typically 4-5 consecutive 1-hour interviews (now often virtual). This includes 2-3 coding rounds, 1 system design round (for mid-level+), and 1-2 behavioral/LP rounds.
  - **The "Bar Raiser":** One interviewer is a trained "Bar Raiser" from a different team, with veto power to ensure hiring standards.
  - **Behavioral Weight:** 50% of the evaluation is based on their **Leadership Principles**. You must have 1-2 stories per principle, structured in the STAR format.
  - **Coding Expectation:** You must not only solve the problem but write **production-ready code** on a shared editor, handling edge cases and communicating clearly.

- **eBay:**
  - **Format:** Often a simpler structure: 1-2 phone screens (coding) followed by a virtual or on-site final round of 3-4 interviews.
  - **Rounds:** Mix of coding, behavioral (less rigidly structured than Amazon's LP), and sometimes a practical problem-solving or design discussion (less formal than full system design).
  - **Coding Expectation:** Focus tends to be on **correctness, efficiency, and clarity**. The pressure may feel slightly less intense than Amazon's marathon, but the technical bar remains high.

## Specific Problem Recommendations for Dual Prep

These 5 problems build skills that transfer directly to both interview processes.

1.  **Two Sum (#1):** The quintessential hash table problem. It teaches complement searching and the time-space trade-off. If you can't explain this in your sleep, you're not ready.
2.  **Valid Anagram (#242):** A perfect array/string/hash table hybrid. Tests understanding of frequency counting and early-exit optimization. Variations are endless.
3.  **Merge Intervals (#56):** A classic "sorting application" problem. It's high-frequency for both companies because it tests the ability to identify the need to sort and then implement a clean merging logic. This pattern appears in scheduling, calendar, and range problems.

<div class="code-group">

```python
# Time: O(n log n) for sort | Space: O(n) for output (or O(1) if sorted in-place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]
        if current_start <= last_end:  # Overlap
            merged[-1][1] = max(last_end, current_end)  # Merge
        else:
            merged.append([current_start, current_end])  # New interval
    return merged
```

```javascript
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];
    if (currStart <= lastEnd) {
      merged[merged.length - 1][1] = Math.max(lastEnd, currEnd);
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) (or O(log n) for sort space)
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] curr = intervals[i];
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
        } else {
            merged.add(curr);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

4.  **Best Time to Buy and Sell Stock (#121):** A brilliant intro to the "Kadane's Algorithm" / one-pass dynamic programming mindset. It's simple, elegant, and tests your ability to track a minimum and compute a max difference. The pattern is reusable.
5.  **Climbing Stairs (#70):** The gateway drug to Dynamic Programming. If you're prepping for Amazon, you must understand the memoization and tabulation approaches to this problem. It's the foundational model for all "count the ways" DP problems.

## Which to Prepare for First? The Strategic Order

**If interviews are close together: Prepare for Amazon first.**

Here’s why: Amazon's scope is broader. Mastering the Amazon curriculum—especially adding Dynamic Programming and deep-diving into Leadership Principles—will inherently cover 95% of eBay's technical expectations. The reverse is not true. Preparing for eBay's focused list might leave you exposed on DP and the endurance needed for Amazon's multi-round format.

**Your 3-Week Dual-Prep Plan:**

- **Week 1-2:** Follow a standard Amazon prep plan. Grind Array, String, Hash Table, then move to Trees/Graphs and DP. Practice 2-3 LP stories daily.
- **Week 3:** **Pivot to eBay.** Do a targeted review of all ~60 eBay-tagged problems on LeetCode. This will solidify the common patterns and expose you to any eBay-specific nuances. Simultaneously, shift your behavioral prep from LP stories to more general "project deep-dives" and conflict resolution examples for eBay.

By front-loading the broader challenge, you make your final week of preparation for the more focused interview efficient and confidence-building. Remember, for Amazon, you're running a marathon on a known course. For eBay, you're sprinting on a track you've carefully studied. Train for the marathon first, and the sprint becomes a matter of pace.

For deeper dives into each company's process, visit our dedicated guides: [Amazon Interview Guide](/company/amazon) and [eBay Interview Guide](/company/ebay).
