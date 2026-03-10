---
title: "Goldman Sachs vs DoorDash: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and DoorDash — difficulty levels, topic focus, and preparation strategy."
date: "2030-11-08"
category: "tips"
tags: ["goldman-sachs", "doordash", "comparison"]
---

# Goldman Sachs vs DoorDash: Interview Question Comparison

If you're interviewing at both Goldman Sachs and DoorDash, you're looking at two very different beasts from the same jungle. One is a 150-year-old financial institution with a deeply analytical engineering culture focused on risk and systems stability. The other is an 11-year-old logistics platform dealing with real-time coordination and hypergrowth scaling. Both will test your algorithmic chops, but they approach coding interviews with different priorities, intensities, and problem selection. Understanding these differences isn't just academic—it lets you allocate your limited prep time where it matters most.

## Question Volume and Difficulty

The raw numbers tell an immediate story. Goldman Sachs has **270 tagged questions** on LeetCode (51 Easy, 171 Medium, 48 Hard), while DoorDash has **87 tagged questions** (6 Easy, 51 Medium, 30 Hard).

Goldman's sheer volume suggests a broader, more established interview question bank. With nearly triple the questions, patterns are less predictable. The 63% Medium, 18% Hard split indicates they lean heavily on standard algorithmic challenges—you'll need solid fundamentals across many domains. The high Medium count is typical for large financial firms: they want reliable, competent engineers who won't break their trading systems.

DoorDash's distribution is more intense: a staggering 59% of their questions are Medium, and 34% are Hard. With only 7% Easy questions, they're signaling they filter for stronger algorithmic performers. The smaller question bank (87 vs 270) might suggest more repetition or a more focused set of core patterns. This is common at product-focused tech companies—they drill deep on problems relevant to their domain (scheduling, mapping, resource allocation) rather than casting a wide net.

**Implication:** For Goldman, breadth of preparation is key. For DoorDash, depth on their favorite patterns is crucial. You can't skate by on Easy problems for either, but DoorDash's higher Hard percentage means you need to be comfortable with complex implementations and optimizations.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. This is the universal foundation of coding interviews. Where they diverge is telling:

**Goldman Sachs' unique emphasis:** **Dynamic Programming** appears in their top four. Finance is built on optimization, risk calculation, and maximizing value under constraints—DP is the natural algorithmic embodiment of this. Expect problems about optimal paths, resource allocation, and sequence decisions.

**DoorDash's unique emphasis:** **Depth-First Search** (and by extension, general Graph/Tree traversal) is in their top four. This reflects their core business: modeling cities as graphs, restaurants and customers as nodes, delivery routes as traversal problems. They live and breathe connectivity, cycles, and search.

**Shared Prep Value:** Mastering Array/String manipulation and Hash Table applications (like Two Sum variants, sliding window, frequency counting) gives you the highest return on investment for interviewing at both. These fundamentals underpin more complex problems at both companies.

## Preparation Priority Matrix

Use this to triage your study time:

1.  **Max ROI (Study First):** Array, String, Hash Table.
    - **Problems:** Two Sum (#1), Longest Substring Without Repeating Characters (#3), Group Anagrams (#49), Merge Intervals (#56).

2.  **Goldman-Specific Priority:** Dynamic Programming, plus likely Matrix/2D Array problems (common in finance).
    - **Problems:** Best Time to Buy and Sell Stock (#121), Coin Change (#322), Longest Increasing Subsequence (#300), Unique Paths (#62).

3.  **DoorDash-Specific Priority:** Depth-First Search, Graphs, Trees, and likely Breadth-First Search for shortest-path scenarios.
    - **Problems:** Number of Islands (#200), Clone Graph (#133), Course Schedule (#207), Binary Tree Level Order Traversal (#102).

## Interview Format Differences

**Goldman Sachs** typically uses a more traditional, multi-round format. You might encounter:

- **HackerRank OA:** Often 2-3 problems in 60-90 minutes, heavy on Medium DP and array manipulation.
- **Technical Rounds (2-3):** 45-60 minutes each, usually one coding problem per round with follow-ups. The problems are often self-contained algorithmic puzzles.
- **System Design:** For senior roles, but often with a finance twist (e.g., design a risk calculation service, order matching engine).
- **Behavioral/Cultural Fit:** Significant weight. They value clarity, precision, and understanding the "why" behind your solution. Communication under pressure is key.

**DoorDash** mirrors the standard FAANG-style process:

- **OA/Phone Screen:** 1-2 problems focusing on their core patterns (graphs, trees, simulation).
- **Virtual Onsite (4-5 rounds):** Often includes 2-3 pure coding rounds, a system design round, and a behavioral/cultural round ("DoorDash Leadership Principles").
- **Coding Rounds:** Expect **2 problems in 45 minutes** or 1 complex problem with multiple follow-ups. Speed and optimality are critical. Interviewers often look for clean, production-ready code.
- **System Design:** Almost guaranteed for mid-level and above, focusing on scalable, real-time systems (e.g., design DoorDash, a food delivery dispatch system).

## Specific Problem Recommendations for Dual Prep

These problems train patterns useful for both companies:

1.  **Merge Intervals (#56) - Medium:** This pattern is everywhere. Goldman might use it for merging time-based financial data; DoorDash for consolidating delivery windows or schedule conflicts. It teaches sorting and greedy merging.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (or O(1) if sorting in-place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]
        # If intervals overlap, merge them
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    return merged
```

```javascript
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) (or O(log n) for sorting space)
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] current = intervals[i];
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

2.  **Word Break (#139) - Medium:** A classic DP problem that Goldman loves (optimal segmentation). For DoorDash, it's a good primer for DFS/memoization on strings, which can model decision trees (like valid delivery route combinations).

3.  **Clone Graph (#133) - Medium:** DoorDash directly tests graph traversal. For Goldman, this is excellent practice for handling complex object relationships and deep copying—a concept that can appear in system design discussions about data replication.

4.  **Coin Change (#322) - Medium:** A fundamental DP problem for Goldman. For DoorDash, while less direct, the "minimum number of X to reach Y" pattern appears in logistics optimization (minimum deliveries, minimum drivers).

5.  **Longest Palindromic Substring (#5) - Medium:** Excellent for both. Tests two-pointer expansion (useful for many array/string problems) and DP. Goldman might frame it as finding symmetric patterns in data; DoorDash could adapt it to pattern matching in addresses or order IDs.

## Which to Prepare for First?

**Prepare for DoorDash first.** Here's the strategic reasoning:

DoorDash's interview is more concentrated and intense on algorithmic difficulty. If you can handle their Medium/Hard problems—particularly graph/DFS challenges—you'll be in a strong position for Goldman's broader but generally slightly less difficult (by percentage) question set. The graph skills you build for DoorDash are transferable, while the DP depth for Goldman is more niche. Starting with the harder, more focused target makes the broader target feel more manageable.

Think of it as sharpening a specific blade (DoorDash's patterns) versus forging a wider sword (Goldman's breadth). The sharp blade can still cut most things; the wide sword might not penetrate the toughest material.

Once you're comfortable with DoorDash's core patterns, spend your final week broadening into Goldman's DP-heavy question bank and brushing up on finance-specific behavioral questions.

**Resources:**

- [Goldman Sachs Interview Questions](/company/goldman-sachs)
- [DoorDash Interview Questions](/company/doordash)
