---
title: "Uber vs Adobe: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Adobe — difficulty levels, topic focus, and preparation strategy."
date: "2030-01-28"
category: "tips"
tags: ["uber", "adobe", "comparison"]
---

If you're interviewing at both Uber and Adobe, or trying to decide where to focus your limited prep time, you're facing a common but solvable challenge. These companies have distinct engineering cultures and product focuses—Uber with its real-time, distributed systems for mobility and delivery, and Adobe with its creative software and document services. This translates into different emphases in their technical interviews. The good news is that there's significant overlap in their fundamental coding assessments, which means you can prepare strategically for both simultaneously. The key is understanding where their question banks diverge so you can allocate your study time efficiently. Let's break down exactly what you need to know.

## Question Volume and Difficulty

The raw LeetCode company tag numbers tell the first part of the story. Uber's tag contains **381 questions** (54 Easy, 224 Medium, 103 Hard), while Adobe's has **227 questions** (68 Easy, 129 Medium, 30 Hard).

**What this implies:**

- **Uber's interview is more intense and unpredictable.** With nearly 70% more tagged questions and over three times as many Hards, Uber's question bank is broader and delves deeper into complex algorithmic problem-solving. You're more likely to encounter a problem that requires a non-obvious trick or advanced data structure. The high Medium count suggests they heavily favor this difficulty level for screening.
- **Adobe's interview is more focused and consistent.** The smaller question pool, especially the relatively low Hard count, indicates a more standardized interview process. They likely have a well-defined set of core problems they return to. The higher proportion of Easy questions (30% vs Uber's 14%) doesn't mean the interview is easier; it often means they use simpler problems to assess clean coding, edge-case handling, and communication under time pressure, or as a first filter in phone screens.

In short, preparing for Uber will inherently cover a wider range of potential Adobe questions, but not all of it.

## Topic Overlap

Both companies test the absolute fundamentals. According to their LeetCode tags, the top overlapping topics are:

1.  **Array** (The undisputed king for both)
2.  **String**
3.  **Hash Table**

This is your core foundation. Mastery here is non-negotiable for either company. Problems in these areas often involve sorting, searching, and clever indexing.

**Key Divergence:**

- **Uber's Unique Emphasis:** **Dynamic Programming (DP)** is Uber's 4th most frequent tag. Uber's problems in logistics, pricing, and route optimization often map directly to optimization problems solvable with DP (e.g., knapsack variants, min/max cost paths). You **must** be comfortable with medium-to-hard DP.
- **Adobe's Unique Emphasis:** **Two Pointers** is Adobe's 4th most frequent tag. This aligns with problems involving string manipulation (like their document/text domain), array partitioning, and searching in sorted data—all common in creative software (e.g., implementing edit features, parsing).

## Preparation Priority Matrix

Use this to triage your study time for maximum ROI.

| Priority                                 | Topics & Rationale                                                                                                                                                                     | Specific LeetCode Problems to Study                                                                                                     |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Tier 1: Max ROI** <br>(Study First)    | **Array, String, Hash Table.** The universal foundation. Focus on problems that combine these, like hash maps indexing array values or string parsing into arrays.                     | **#1 Two Sum** (Hash Table classic), **#49 Group Anagrams** (Hash Table + String), **#238 Product of Array Except Self** (Array trick). |
| **Tier 2: Uber-Specific Depth**          | **Dynamic Programming.** Target Mediums first: 1D DP (house robber), 2D DP (grid paths), and subsequence problems. Then tackle Uber-favored Hards like DP on trees or with bitmasking. | **#139 Word Break** (DP + Hash Table), **#322 Coin Change** (classic DP), **#115 Distinct Subsequences** (Hard DP on strings).          |
| **Tier 3: Adobe-Specific & Uber-Useful** | **Two Pointers & Sliding Window.** Crucial for Adobe, still highly relevant for Uber (e.g., processing time-series or location data streams).                                          | **#15 3Sum** (Two Pointers + Sort), **#76 Minimum Window Substring** (Sliding Window + Hash), **#11 Container With Most Water**.        |

## Interview Format Differences

The structure of the interview day itself varies significantly.

**Uber:**

- **Format:** Typically 4-5 rounds on-site/virtual: 2-3 coding, 1 system design, 1 behavioral ("Uber Values").
- **Coding Rounds:** Expect 1-2 problems per 45-60 minute session, often of Medium-Hard complexity. Interviewers look for optimal solutions and may ask follow-ups to scale or modify the problem. They deeply probe your thought process.
- **System Design:** **High importance.** For senior roles (SDE2+), this is a make-or-break round. Expect to design a real-time, scalable service (e.g., "Design Uber Eats," "Design a rate limiter").
- **Behavioral:** The "Uber Values" round is serious. Prepare STAR stories that demonstrate customer obsession, making big bold bets, and being an owner.

**Adobe:**

- **Format:** Often 3-4 rounds: 2 coding, 1 system design (for mid-senior), 1 behavioral/manager.
- **Coding Rounds:** Often one problem per 45-minute round, but you are expected to code flawlessly, handle all edge cases, and discuss trade-offs. The focus is on robust, clean, and efficient code.
- **System Design:** Important for senior roles, but the scope may lean towards design within a larger ecosystem (e.g., "Design a collaborative feature for Photoshop," "Design a PDF render service") rather than a greenfield global system.
- **Behavioral:** Focuses on collaboration, creativity in problem-solving, and past project experience. Less rigidly structured around corporate values than Uber.

## Specific Problem Recommendations for Dual Prep

Here are 5 problems that provide exceptional cross-company value.

1.  **#56 Merge Intervals:** A quintessential array/sorting problem that appears for both. It teaches how to sort by a custom key and manage overlapping ranges—a pattern useful for time blocks (Uber trips, Adobe license scheduling).
2.  **#3 Longest Substring Without Repeating Characters:** The perfect Sliding Window problem. Master this, and you have the pattern for a huge class of String/Array problems. Essential for Adobe (Two Pointers tag), highly relevant for Uber.
3.  **#200 Number of Islands:** A fundamental DFS/BFS graph problem. While not in the top tags, graph traversal is a hidden requirement for both (Uber's maps, Adobe's document object models). It's a classic that tests core algorithmic thinking.
4.  **#973 K Closest Points to Origin:** A brilliant problem that can be solved with sorting (O(n log n)) or a heap (O(n log k)). It tests understanding of geometry, sorting comparators, and heap usage. Highly relevant for location-based problems (Uber) and general algorithmic agility (Adobe).
5.  **#139 Word Break (DP):** This is your gateway to Uber's DP focus. It's a Medium that combines Hash Table (for the word dictionary) with a 1D DP approach. Understanding this "segmentation" DP pattern is critical.

<div class="code-group">

```python
# LeetCode #56 Merge Intervals - Python Solution
# Time: O(n log n) for sorting | Space: O(n) for output (or O(log n) for sort space)
def merge(intervals):
    if not intervals:
        return []
    # Sort by the start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_end = merged[-1][1]
        if current_start <= last_end:  # Overlap
            merged[-1][1] = max(last_end, current_end)  # Merge
        else:
            merged.append([current_start, current_end])  # New interval
    return merged
```

```javascript
// LeetCode #56 Merge Intervals - JavaScript Solution
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const lastMerged = merged[merged.length - 1];
    if (currStart <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], currEnd);
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
// LeetCode #56 Merge Intervals - Java Solution
// Time: O(n log n) | Space: O(n) (or O(log n) for sort space)
import java.util.*;

public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int currStart = intervals[i][0];
        int currEnd = intervals[i][1];
        if (currStart <= last[1]) {
            last[1] = Math.max(last[1], currEnd);
        } else {
            merged.add(intervals[i]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## Which to Prepare for First?

The strategic answer: **Prepare for Uber first.**

Here’s why: Preparing for Uber’s broader and deeper question bank—especially by building proficiency in Dynamic Programming—will automatically raise your ceiling for Adobe’s interviews. The core Array/String/Hash Table skills are the same. Once you are comfortable with Uber-level Mediums and Hards, Adobe’s focused question set will feel like a targeted review. You can then spend your final days before an Adobe interview sharpening your Two Pointers/Sliding Window patterns and ensuring your code is production-clean.

The reverse is not true. Preparing only for Adobe’s scope may leave you exposed to the more challenging DP problems and system design scales that Uber frequently employs. Start with the harder target.

For more detailed breakdowns of each company's process, visit our dedicated pages: [Uber Interview Guide](/company/uber) and [Adobe Interview Guide](/company/adobe).
