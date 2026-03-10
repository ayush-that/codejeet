---
title: "Oracle vs Expedia: Interview Question Comparison"
description: "Compare coding interview questions at Oracle and Expedia — difficulty levels, topic focus, and preparation strategy."
date: "2030-09-21"
category: "tips"
tags: ["oracle", "expedia", "comparison"]
---

If you're preparing for interviews at both Oracle and Expedia, you're facing a classic "big tech vs. travel tech" preparation dilemma. The core challenge is that their question banks, while sharing foundational topics, differ dramatically in size and focus. Preparing for one doesn't perfectly prepare you for the other, but a smart, strategic approach can maximize your return on study time. The key insight is this: Oracle's interview is a marathon of algorithmic depth across a vast problem space, while Expedia's is a sprint focused on practical problem-solving with common data structures. You must adjust your preparation intensity and scope accordingly.

## Question Volume and Difficulty

The raw numbers tell a stark story. On platforms like LeetCode, Oracle has **~340 tagged questions**, while Expedia has **~54**. This six-fold difference is your first major signal about interview culture and question reuse.

**Oracle (340q: E70/M205/H65):** The distribution is telling. A massive 60% of their questions are Medium difficulty. This indicates their technical screen and on-site rounds are designed to test not just if you can code, but how well you optimize, handle edge cases, and navigate non-trivial logic. The high number of Hard problems (65) suggests that for senior roles or certain teams (cloud, database), you should be ready for a deep dive into complex DP, graph, or system-level optimization problems. The volume itself means they have a large, rotating question bank. You cannot "grind" all Oracle questions; you must master patterns.

**Expedia (54q: E13/M35/H6):** The smaller bank is more typical of a product-focused tech company. The emphasis is overwhelmingly on Medium problems (65% of their tagged questions), with a handful of Hards. This suggests their interviews are less about surprising you with an obscure algorithm and more about assessing your foundational coding skills, clarity of thought, and ability to cleanly solve practical problems—like data manipulation for travel itineraries or pricing. The limited pool also means there's a higher chance of question overlap between candidates, so studying their tagged problems is a high-yield activity.

## Topic Overlap

Both companies heavily test the absolute fundamentals:

- **Array**
- **String**
- **Hash Table**

This is your critical common ground. Mastery here is non-negotiable for either company. If you can efficiently traverse, manipulate, and use hash maps to optimize lookups for array and string problems, you've built the platform for 70% of Expedia's questions and a huge chunk of Oracle's.

**Unique Focus Areas:**

- **Oracle:** **Dynamic Programming** is a standout. With 205 Medium questions, many will involve DP or memoization. You must be comfortable with 1D and 2D DP for problems like knapsack, subsequences, and min/max pathfinding. **Tree** and **Depth-First Search** are also more prominent for Oracle, aligning with their database and systems software roots.
- **Expedia:** **Greedy** algorithms appear as a distinct topic. This makes intuitive sense for a travel company—think of problems involving scheduling, minimizing costs, or maximizing bookings within constraints, where a locally optimal choice leads to a global solution. **Sorting** and **Two Pointers** techniques are frequently implied within their array/string problems.

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

| Priority                   | Topics                                     | Rationale                                                  | Sample LeetCode Problems for Practice                                                          |
| :------------------------- | :----------------------------------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Tier 1 (Max ROI)**       | **Array, String, Hash Table**              | Core for both companies. Start here.                       | #1 Two Sum, #49 Group Anagrams, #238 Product of Array Except Self                              |
| **Tier 2 (Oracle Depth)**  | **Dynamic Programming, Tree, DFS**         | Essential for Oracle's Medium/Hard problems.               | #70 Climbing Stairs (DP intro), #198 House Robber, #102 Binary Tree Level Order Traversal      |
| **Tier 3 (Expedia Focus)** | **Greedy, Two Pointers, Sorting**          | Key for Expedia's practical problem-solving.               | #121 Best Time to Buy and Sell Stock (greedy/DP), #56 Merge Intervals, #15 3Sum (two pointers) |
| **Tier 4 (As Needed)**     | Oracle's Hard problems (Graph, Union Find) | Only if targeting a senior Oracle role or a specific team. |                                                                                                |

## Interview Format Differences

**Oracle** typically follows a classic big-tech multi-round process: 1-2 phone screens (often a coding challenge followed by a technical call) and a virtual or on-site "loop" of 4-5 interviews. These include 2-3 coding rounds (45-60 mins each, often 2 problems per round), a system design round (for mid-level and above), and a behavioral/leadership round. The coding problems will test algorithmic rigor, and you're expected to discuss trade-offs between multiple approaches.

**Expedia's** process is often leaner. It may consist of an initial HR screen, a technical phone/video interview (60 mins, 1-2 coding problems), and a final round of 2-3 virtual interviews. These final rounds mix coding with behavioral questions and sometimes a lightweight system design or data modeling discussion (e.g., "how would you design a hotel booking API?"). The coding focus is on clean, working code under time pressure rather than exploring every possible optimization.

## Specific Problem Recommendations

Here are 5 problems that provide excellent cross-training for both companies, emphasizing the overlapping core topics.

1.  **Two Sum (#1):** The quintessential hash table problem. You must be able to explain and code the O(n) solution in your sleep. It's foundational for hundreds of other problems.
2.  **Group Anagrams (#49):** Excellent for testing mastery of hash tables (using sorted strings or character counts as keys) and string manipulation. A common pattern for categorization problems.
3.  **Merge Intervals (#56):** A classic Medium problem that tests sorting, array merging logic, and edge-case handling. The greedy approach here is highly relevant to Expedia, while the array manipulation is core for Oracle.

<div class="code-group">

```python
# Time: O(n log n) for sort | Space: O(n) for output (or O(1) if sorted in-place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time (greedy choice)
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]
        if current_start <= last_end:  # Overlap
            merged[-1][1] = max(last_end, current_end)  # Merge
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

4.  **House Robber (#198):** A perfect introduction to 1D Dynamic Programming. It forces you to define a state (max money at house i) and a recurrence relation. This pattern is crucial for Oracle.
5.  **Best Time to Buy and Sell Stock (#121):** Can be solved with a simple one-pass greedy approach (track min price, max profit). It's a great problem to discuss both the intuitive O(n) greedy solution and relate it to the Kadane's algorithm/DP perspective.

## Which to Prepare for First

**Prepare for Oracle first.** Here’s the strategic reasoning: Preparing for Oracle's broader and deeper question bank will inherently cover Expedia's core requirements (Arrays, Strings, Hash Tables). Once you've built the muscle for Oracle's Medium DP and tree problems, Expedia's Medium greedy/array problems will feel more manageable. If you prepare for Expedia first, you'll have to significantly ramp up depth and learn new topics (DP, advanced trees) to tackle Oracle, which is a harder pivot.

Your study plan should look like this:

1.  **Weeks 1-3:** Grind Tier 1 (Array, String, Hash Table) and Tier 3 (Greedy, Two Pointers) problems. This builds your core for _both_ companies.
2.  **Weeks 4-6:** Dive deep into Tier 2 (DP, Trees) specifically for Oracle. Practice explaining your DP state and transition clearly.
3.  **Week of Expedia Interview:** Do a focused pass through Expedia's tagged ~54 questions on LeetCode. The smaller bank makes this a viable last-step polish.
4.  **Week of Oracle Interview:** Do a mix of Oracle-tagged Medium problems and a few Hards to get in the mindset for algorithmic depth.

By using Oracle's requirements as your high-water mark, you ensure you're over-prepared for Expedia, which is a far better position than being under-prepared for Oracle.

For more detailed company-specific insights, visit our guides for [Oracle](/company/oracle) and [Expedia](/company/expedia).
