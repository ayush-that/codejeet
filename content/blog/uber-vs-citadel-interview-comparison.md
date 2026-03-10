---
title: "Uber vs Citadel: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Citadel — difficulty levels, topic focus, and preparation strategy."
date: "2030-03-05"
category: "tips"
tags: ["uber", "citadel", "comparison"]
---

If you're preparing for interviews at both Uber and Citadel, you're looking at two distinct but overlapping challenges. Both are top-tier companies with rigorous technical interviews, but they approach the process differently. Uber's interview process is more standardized and predictable, reflecting its scale and established engineering culture. Citadel's process is more intense and focused, reflecting its quantitative finance roots where performance under pressure is paramount. The good news: there's significant overlap in what they test, so you can prepare efficiently for both.

## Question Volume and Difficulty

The numbers tell a clear story about interview intensity and focus.

**Uber (381 questions):** With over three times the volume of Citadel, Uber's question bank is vast. The distribution (54 Easy, 224 Medium, 103 Hard) reveals a strong emphasis on Medium-difficulty problems. This suggests Uber interviews are designed to assess solid, reliable problem-solving across a broad range of scenarios. You're expected to handle the fundamentals perfectly and navigate complex, but not esoteric, algorithmic challenges. The high volume also means you're less likely to see a repeated question, testing your adaptable problem-solving skills rather than your ability to memorize solutions.

**Citadel (96 questions):** The smaller, more concentrated question bank is telling. With only 6 Easy problems, Citadel signals it doesn't waste time on warm-ups. The ratio skews heavily toward Medium (59) and Hard (31), indicating a higher baseline difficulty. This smaller pool doesn't mean it's easier; it means the problems are more carefully selected for their depth and ability to discriminate between good and exceptional candidates. You're more likely to encounter a known, challenging problem, but you'll be expected to solve it flawlessly, optimize it thoroughly, and discuss trade-offs under time pressure.

The implication: For Uber, breadth of practice is crucial. For Citadel, depth and mastery of high-difficulty patterns is key.

## Topic Overlap

Both companies heavily test **Array, Hash Table, String, and Dynamic Programming**. This core forms the foundation of efficient preparation.

- **Array & Hash Table:** This combination is the workhorse for most optimization problems (e.g., Two Sum variants, subarray problems). Mastery here is non-negotiable for both.
- **String:** Problems often involve parsing, manipulation, and pattern matching, testing attention to detail and edge cases.
- **Dynamic Programming:** A major differentiator for top candidates. Both companies use DP to test problem decomposition and optimization thinking.

**Unique Emphasis:**

- **Uber** has a broader spread, with significant attention on **Graph** and **Tree** problems, reflecting its core business domains (mapping, dispatch systems). You'll see BFS/DFS applied to real-world adjacency scenarios.
- **Citadel** places a heavier relative weight on **Dynamic Programming** and **Greedy** algorithms. This aligns with the quantitative optimization mindset—finding the most efficient path or maximum value under constraints, analogous to trading strategies.

## Preparation Priority Matrix

Maximize your return on study time with this priority list.

1.  **Highest Priority (Overlap Topics):** Study these first. They give you the highest leverage for both interviews.
    - **Array + Hash Table:** Subarray sums, two-pointer techniques, frequency counting.
    - **Dynamic Programming:** Classic 1D/2D problems (knapsack, LCS, coin change) and string-based DP.
    - **String Manipulation:** Sliding window, palindrome checks, interleaving.

2.  **Second Priority (Uber-Specific):** Once overlap is solid, expand your scope for Uber.
    - **Graph (BFS/DFS, Topological Sort):** Essential for Uber's domain.
    - **Tree (Traversals, LCA, Serialization):** Another high-frequency area.
    - **System Design:** Uber places significant weight on this for senior roles (designing a ride-matching system, rate limiter, etc.).

3.  **Third Priority (Citadel-Specific):** Deep dive into optimization.
    - **Advanced DP & Greedy:** Multi-state DP, interval scheduling, optimization proofs.
    - **Concurrency/Threading:** More likely to be tested in Citadel's performance-focused environment.

**Shared Prep Problems:** These are excellent for drilling the overlap:

- **LeetCode #3 (Longest Substring Without Repeating Characters):** Tests string + hash table + sliding window.
- **LeetCode #53 (Maximum Subarray):** Fundamental DP/Kadane's algorithm.
- **LeetCode #139 (Word Break):** Classic string DP problem.

## Interview Format Differences

**Uber:**

- **Structure:** Typically a phone screen (1-2 coding problems) followed by a virtual or on-site loop of 4-5 interviews. These usually break down into 2-3 coding rounds, 1 system design round (for mid-level+), and 1 behavioral/experience round.
- **Coding Rounds:** 45-60 minutes, often with 1 Medium-Hard problem or 2 Medium problems. Interviewers may work through a single problem with multiple follow-ups (e.g., solve it, then scale it, then handle edge cases).
- **Culture:** Collaboration is valued. They look for clear communication, consideration of user/edge cases (reflecting real-world app development), and clean, maintainable code.

**Citadel:**

- **Structure:** Can be more intense and condensed. Often starts with a HackerRank-style online assessment with 2-3 challenging problems. Successful candidates proceed to a "super day" involving multiple back-to-back technical interviews.
- **Coding Rounds:** Problems are fewer but harder. You might have 60 minutes for one complex Hard problem. The expectation is optimal solution, perfect implementation, and immediate analysis of time/space complexity.
- **Culture:** Speed, accuracy, and optimality under pressure are paramount. The style is more direct and focused on pure algorithmic performance. For quant developer roles, you may get probability/math brainteasers mixed in.

## Specific Problem Recommendations for Dual Preparation

Here are 3-5 problems that efficiently target the shared core and the unique flavors of each company.

1.  **LeetCode #56 (Merge Intervals):** A quintessential Uber problem (think merging trip times) that also teaches a crucial sorting/greedy pattern valuable anywhere. It's a common follow-up to more complex scenarios.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (or O(1) if sorted in-place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]
        if current_start <= last_end:  # Overlap
            merged[-1][1] = max(last_end, current_end)
        else:
            merged.append([current_start, current_end])
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

2.  **LeetCode #322 (Coin Change):** A foundational DP problem. It's a must-know pattern for Citadel's heavy DP focus and appears in Uber's question list. Understanding the transition from brute-force recursion to memoized DP to iterative DP is invaluable.

3.  **LeetCode #973 (K Closest Points to Origin):** Excellent for practicing the "Top K" pattern using a heap (priority queue). This tests sorting/optimization (Citadel-relevant) and has practical spatial application (Uber-relevant for location-based services).

4.  **LeetCode #200 (Number of Islands):** The canonical graph DFS/BFS problem. Critical for Uber's graph-heavy focus. Mastering this ensures you can handle any grid-based traversal problem, which is a common theme.

5.  **LeetCode #76 (Minimum Window Substring):** A challenging but classic Hard problem that combines hash table (for frequency), string manipulation, and the sliding window technique. Solving this demonstrates mastery of a complex pattern that both companies value.

## Which to Prepare for First?

**Prepare for Citadel first.**

Here's the strategic reasoning: Citadel's interview has a higher floor of difficulty. Mastering the Hard problems and intense optimization focus required for Citadel will make Uber's predominantly Medium-difficulty problems feel more manageable. The mental muscle you build for speed and precision under Citadel's pressure will serve you well in any interview. Conversely, preparing only for Uber's breadth might leave you underprepared for the depth Citadel demands.

Start by grinding the core overlap topics (Array, Hash Table, String, DP) to a high level of proficiency, then immediately incorporate Citadel's emphasis on advanced DP and Greedy. Once you're comfortable solving Hard problems within time limits, shift to broadening your knowledge with Uber's Graph and Tree problems. This "depth-first, then breadth" approach ensures you're never caught off-guard by difficulty.

For more company-specific question lists and insights, check out the CodeJeet pages for [Uber](/company/uber) and [Citadel](/company/citadel).
