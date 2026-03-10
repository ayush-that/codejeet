---
title: "eBay vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at eBay and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2026-11-05"
category: "tips"
tags: ["ebay", "twitter", "comparison"]
---

If you're preparing for interviews at both eBay and Twitter, you're looking at two distinct tech giants with different engineering cultures and, consequently, different interview fingerprints. eBay, with its roots in e-commerce and massive-scale transactional systems, and Twitter (now X), with its focus on real-time data, social graphs, and high-throughput messaging, test for overlapping but not identical skill sets. The smart strategy isn't to double your study time, but to study smarter by understanding where their question banks converge and diverge. This comparison, based on aggregated data from hundreds of interviews, will give you a tactical roadmap.

## Question Volume and Difficulty

The raw numbers tell an initial story of focus.

- **eBay (60 questions):** The breakdown is E12/M38/H10. This is a classic distribution for a large, established tech company: a solid foundation of Easy questions to screen for basic competency, a **massive emphasis on Medium difficulty** (63% of their question bank), and a smaller but significant set of Hard problems. This suggests eBay's interviews are designed to be consistent and predictable. They want to see strong, reliable problem-solving on standard algorithmic patterns. The high volume of Medium questions means you must be exceptionally fluent with core data structures and common techniques—there's little room for stumbling on fundamentals.
- **Twitter (53 questions):** The breakdown is E8/M33/H12. Noticeably, Twitter has a **higher proportion of Hard problems** (23% vs. eBay's 17%) and a slightly lower count of Easy warm-ups. This aligns with Twitter's historical reputation for challenging, sometimes unconventional, interviews. The platform's core challenges—real-time feeds, distributed systems, graph relationships—often translate into more complex algorithmic scenarios. The emphasis is not just on solving a problem, but on optimizing for scale and edge cases under pressure.

**Implication:** Preparing for Twitter will inherently cover eBay's difficulty curve, but not necessarily the reverse. If you can confidently solve Twitter's Hard problems, eBay's Medium-heavy slate will feel more manageable.

## Topic Overlap

Both companies heavily test the holy trinity of coding interviews: **Array, String, and Hash Table**. This is your absolute foundation. Sorting is also critical, often as a preprocessing step within these problems.

- **Shared Core (Max ROI):** Array manipulation, two-pointer techniques, sliding window, hash map/dictionary usage for lookups and frequency counting, and string parsing. If you master these, you're likely 70% prepared for the coding portion at both companies.
- **eBay's Unique Flavor:** eBay's list explicitly highlights **Sorting** as a top topic. This often manifests in problems involving scheduling, merging intervals, or ordering transactions—think "Merge Intervals (#56)", "Meeting Rooms II (#253)", or custom comparator sorts. The e-commerce domain leans towards problems about ordering, grouping, and sequencing data.
- **Twitter's Unique Flavor:** Twitter's list explicitly includes **Design**. While this often refers to System Design in a separate round, it can bleed into coding interviews as **Object-Oriented Design** (e.g., design a Twitter timeline, a rate limiter) or problems that require designing a class with specific methods. Furthermore, Twitter's problems frequently involve **trees and graphs** (social networks!) and **dynamic programming**, even if not listed in the top four.

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

1.  **Study First (Overlap Topics - Highest ROI):**
    - **Hash Table + Array/String:** Two Sum (#1), Group Anagrams (#49), Longest Substring Without Repeating Characters (#3).
    - **Two Pointers:** Valid Palindrome (#125), Container With Most Water (#11).
    - **Sliding Window:** Best Time to Buy and Sell Stock (#121), Longest Repeating Character Replacement (#424).

2.  **Then, for eBay Focus:**
    - **Sorting & Intervals:** Merge Intervals (#56), Non-overlapping Intervals (#435), Meeting Rooms II (#253). Practice writing custom sort keys.
    - **Array Processing:** Problems that feel like "batch processing" of items or transactions.

3.  **Then, for Twitter Focus:**
    - **Design:** Implement Trie (Prefix Tree) (#208), LRU Cache (#146), Design Twitter (#355). These test your ability to structure code, not just write a function.
    - **Graph/Tree Traversal:** Number of Islands (#200), Clone Graph (#133), Course Schedule (#207).
    - **Dynamic Programming:** Coin Change (#322), Longest Increasing Subsequence (#300).

## Interview Format Differences

- **eBay:** The process is typically structured and traditional. Expect 2-3 technical coding rounds, often with a clear separation between algorithmic problem-solving and system design discussions. The problems are more likely to be recognizable LeetCode-style questions. Behavioral questions ("Leadership Principles") are integrated but usually given standard weight. The environment is often more predictable.
- **Twitter:** Interviews can feel more intense and fluid. Coding problems might have a "twist" or require more optimization discussion. The line between a coding problem and a lightweight object-oriented design question can be blurry (e.g., "Design a Hit Counter"). You might be expected to discuss scalability implications of your solution even in a coding round. The culture has historically valued concise, optimal, and clever code.

## Specific Problem Recommendations for Both

Here are 5 problems that provide exceptional cross-training value for eBay and Twitter interviews.

1.  **Merge Intervals (#56):** A classic sorting problem (eBay focus) that also teaches a fundamental pattern for dealing with ranges and time—a concept applicable to Twitter's real-time systems. The pattern is reusable everywhere.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (for sorting output)
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        # if merged list is empty or current interval does not overlap with previous
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # otherwise, merge by updating the end of the previous interval
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged
```

```javascript
// Time: O(n log n) | Space: O(n) (for sorting output)
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (let interval of intervals) {
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) (for sorting output)
public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    LinkedList<int[]> merged = new LinkedList<>();
    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.getLast()[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

2.  **LRU Cache (#146):** This is a quintessential Twitter-style problem that blends data structures (hash map + doubly linked list), algorithm design, and object-oriented principles. It's also a fantastic exercise in designing for O(1) operations, which is highly valued at eBay for scalable systems.

3.  **Group Anagrams (#49):** A perfect hash table problem that both companies love. It tests your ability to use a data structure for grouping and your understanding of string manipulation. It's a common "first round" filter question.

4.  **Word Break (#139):** A Medium-difficulty Dynamic Programming problem that is very common. It prepares you for Twitter's harder DP questions while reinforcing a crucial optimization pattern (memoization/DP) that is valuable for any performance-conscious interview at eBay.

5.  **Find All Anagrams in a String (#438):** This is a superb sliding window problem with a hash map for frequency counting. It covers the core overlapping topics (Array, String, Hash Table) in one elegant challenge and forces you to think about window invariants—a useful concept for streaming or batch processing scenarios at both companies.

## Which to Prepare for First?

**Prepare for Twitter first.** Here’s the strategic reasoning: Twitter’s question bank is slightly more demanding, with a higher density of Hard problems and design-oriented coding questions. If you build a study plan that conquers Twitter’s expectations—drilling into graphs, DP, and design patterns—you will automatically cover the vast majority of eBay’s Medium-difficulty, array/string/hash-table core. You’ll be over-prepared for eBay’s difficulty curve, which is a confident position to be in. The final step would be to do a focused review on eBay’s specific favorite: interval and sorting problems, which are generally quick to master once your core problem-solving muscles are strong.

By using this targeted, overlap-first approach, you transform preparing for two companies from a daunting task into an efficient, layered strategy.

For deeper dives into each company's process, check out our dedicated pages: [/company/ebay](/company/ebay) and [/company/twitter](/company/twitter).
