---
title: "Goldman Sachs vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2030-11-30"
category: "tips"
tags: ["goldman-sachs", "ebay", "comparison"]
---

# Goldman Sachs vs eBay: A Strategic Interview Question Comparison

If you're preparing for interviews at both Goldman Sachs and eBay, you might be tempted to treat them as similar technical challenges. That would be a mistake. While both test core data structures and algorithms, their interview philosophies, intensity, and focus areas differ significantly. Goldman Sachs represents the finance-tech hybrid with a heavier, more mathematically-inclined problem set, while eBay reflects a more traditional e-commerce engineering focus with a narrower but still demanding scope. Preparing strategically for both requires understanding not just what they ask, but _why_ and _how_ they ask it.

## Question Volume and Difficulty: A Tale of Two Intensities

The raw numbers tell the first part of the story. On platforms like LeetCode, Goldman Sachs has tagged **~270 questions** (51 Easy, 171 Medium, 48 Hard). eBay has tagged **~60 questions** (12 Easy, 38 Medium, 10 Hard).

**What this means for Goldman Sachs:** The sheer volume (270 vs 60) indicates a broader, more established, and likely more unpredictable interview question bank. The high proportion of Medium questions (63%) suggests they consistently aim for that sweet spot of complexity—problems solvable in 30-45 minutes that thoroughly test data structure application and edge-case handling. The presence of a solid chunk of Hard problems (18%) means you must be prepared for at least one highly complex problem, often involving dynamic programming or tricky optimizations, especially for senior roles.

**What this means for eBay:** The smaller question bank doesn't mean it's easier; it means the scope is more focused. With 63% Medium and 17% Hard questions, the difficulty distribution is actually _more skewed toward challenging problems_ than Goldman's. This implies that when eBay asks a question, they expect a deep, optimal solution. There's less fluff and more concentrated focus on core competencies.

**Takeaway:** Goldman interviews feel like a marathon with varied terrain. eBay interviews feel like a series of intense sprints on a familiar track.

## Topic Overlap: Your Foundation for Both

Both companies heavily test the fundamental building blocks of software engineering:

- **Array & String:** Manipulation, searching, sorting, and partitioning.
- **Hash Table:** The go-to tool for O(1) lookups, frequency counting, and memoization.

This overlap is your strategic gift. Mastering these topics provides the highest return on investment (ROI) for dual preparation. A problem like **Two Sum (#1)** isn't just about the solution; it's about recognizing when to use a hash map to trade space for time, a pattern applicable in hundreds of variations.

**Unique Goldman Sachs Emphasis: Dynamic Programming.** This is the most significant differentiator. Goldman's quantitative and trading-adjacent roles often involve optimization problems (max profit, min cost, pathfinding) where DP is key. If you're interviewing with Goldman, DP moves from a "should know" to a "must master" topic.

**Unique eBay Emphasis: Sorting.** While both test it, eBay's explicit listing of Sorting as a top topic suggests a focus on problems where ordering, comparison, and efficient `O(n log n)` preprocessing are central to the solution, such as in scheduling, merging, or top-K element problems.

## Preparation Priority Matrix

Use this to allocate your study time effectively.

| Priority                   | Topics                              | Rationale                                                              | Sample LeetCode Problems                                                 |
| :------------------------- | :---------------------------------- | :--------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Tier 1 (Max ROI)**       | **Array, String, Hash Table**       | Core for both companies. Foundation for everything else.               | #1 Two Sum, #49 Group Anagrams, #238 Product of Array Except Self        |
| **Tier 2 (Goldman Focus)** | **Dynamic Programming**             | Critical differentiator for Goldman. High-weight topic.                | #70 Climbing Stairs, #121 Best Time to Buy/Sell Stock, #322 Coin Change  |
| **Tier 3 (eBay Focus)**    | **Sorting & Advanced Applications** | Deep mastery needed for eBay's focused problem set.                    | #56 Merge Intervals, #253 Meeting Rooms II, #347 Top K Frequent Elements |
| **Tier 4 (General)**       | Linked List, Tree, Graph            | Important for general interview prep, but less explicitly highlighted. | #206 Reverse Linked List, #102 Binary Tree Level Order Traversal         |

## Interview Format Differences

**Goldman Sachs:** The process is typically multi-round and can be hybrid. You might have an initial HackerRank assessment, followed by 2-3 technical video interviews, and a final "superday" with back-to-back sessions. Problems often have a mathematical or financial flavor (e.g., calculating profit, risk, or sequences). System design may be asked for senior roles, but the heavy emphasis is on algorithmic problem-solving. Behavioral questions ("fit") are extremely important in the final rounds, often weighted equally with technical ability.

**eBay:** The process is usually more streamlined. After an initial coding screen, you'll likely have 3-4 virtual on-site interviews. These are intensely technical, with one or two coding problems per session, and deep dives into your solution's time/space complexity. For mid-to-senior roles, expect a dedicated system design round focused on scalable, distributed systems relevant to e-commerce (caching, inventory, search). Behavioral questions are integrated but typically less formalized than Goldman's.

## Specific Problem Recommendations for Dual Preparation

Here are 5 problems that build skills directly applicable to both interviewers.

1.  **Group Anagrams (#49):** Tests hash table mastery and string manipulation. The core pattern of using a sorted string or character count as a key is widely applicable.

<div class="code-group">

```python
# Time: O(n * k log k) where n is strs length, k is max str length | Space: O(n*k)
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        anagram_map = defaultdict(list)
        for s in strs:
            # Use sorted string as the canonical key
            key = ''.join(sorted(s))
            anagram_map[key].append(s)
        return list(anagram_map.values())
```

```javascript
// Time: O(n * k log k) | Space: O(n*k)
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}
```

```java
// Time: O(n * k log k) | Space: O(n*k)
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.putIfAbsent(key, new ArrayList<>());
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }
}
```

</div>

2.  **Product of Array Except Self (#238):** A quintessential array manipulation problem that tests your ability to derive an optimal solution using prefix and suffix logic. It's a common pattern for "using the output array as extra space."

3.  **Merge Intervals (#56):** Excellent for both. Tests sorting logic (key for eBay) and array merging/overlap detection (key for both). The pattern of sorting by a start point and then iterating to merge is reusable in scheduling problems.

4.  **Best Time to Buy and Sell Stock (#121):** The foundational DP problem. It's simple enough to appear at eBay but teaches the "Kadane's algorithm" / state machine DP pattern that Goldman loves for more complex variants (e.g., with cooldowns or transaction limits).

5.  **Top K Frequent Elements (#347):** Perfectly blends eBay's sorting focus (via bucket sort or heap) with hash table frequency counting. It's a practical problem with real-world relevance for both companies.

## Which to Prepare for First?

**Prepare for Goldman Sachs first.** Here’s the strategic reasoning:

1.  **Broader Scope Covers Narrower:** Mastering Goldman's curriculum—including Dynamic Programming—automatically covers 90% of eBay's core technical expectations. The reverse is not true.
2.  **Intensity Training:** Practicing under Goldman's wider range and difficulty prepares you for the depth eBay requires. It's like training for a decathlon before specializing in the sprint.
3.  **Staggered Timeline:** Interview processes often move at different speeds. If you secure an offer from one, it can create positive leverage with the other.

Start with the Tier 1 overlapping topics (Array, String, Hash Table), then integrate Goldman's DP focus. In the final 1-2 weeks before your eBay interview, shift to intense, timed practice on Medium/Hard problems from their tagged list, focusing on clean, optimal implementations.

By understanding these differences and preparing strategically, you can approach both interview processes with confidence, maximizing your chances of success at two excellent but distinct companies.

For more detailed company-specific question lists and experiences, check out the [Goldman Sachs](/company/goldman-sachs) and [eBay](/company/ebay) pages.
