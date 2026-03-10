---
title: "Amazon vs Uber: Interview Question Comparison"
description: "Compare coding interview questions at Amazon and Uber — difficulty levels, topic focus, and preparation strategy."
date: "2028-10-27"
category: "tips"
tags: ["amazon", "uber", "comparison"]
---

If you're preparing for interviews at both Amazon and Uber, you're in a unique position. On the surface, their coding question profiles look remarkably similar: both heavily favor **Array, String, Hash Table, and Dynamic Programming**. This isn't a coincidence; these are the foundational data structures for building scalable systems that handle data efficiently—the core of both an e-commerce giant and a global logistics platform. However, the volume, difficulty distribution, and subtle thematic focuses differ significantly. Preparing strategically for one can give you a massive head start on the other, but you need to know where to double down and where to branch out.

## Question Volume and Difficulty: A Tale of Scale

The raw numbers tell the first part of the story. On platforms like LeetCode, **Amazon** has nearly **2,000** tagged questions, dwarfing Uber's ~381. This isn't because Amazon's interview is five times harder; it's a function of scale and time. Amazon has been conducting a massive volume of technical interviews for decades across countless teams. Their question bank is vast, deep, and well-documented by candidates.

- **Amazon's Distribution (E530/M1057/H351):** The difficulty is heavily weighted toward **Medium**. This is the classic Amazon signature: they love problems that are conceptually straightforward to describe but require clean, bug-free implementation and thorough edge-case handling under pressure. The high number of Hard questions often relates to their frequent use of graph problems (simulating networks, dependencies) and advanced dynamic programming.
- **Uber's Distribution (E54/M224/H103):** The ratio is similar, but the total volume is smaller. Uber's list is more curated. The implication? You're slightly more likely to encounter a known problem at Uber, but you cannot rely on that. The focus is on **applied problem-solving**—questions often have a real-world flavor related to location, mapping, matching, or scheduling.

The key takeaway: Preparing for Amazon's broad, medium-heavy bank will build incredible muscle memory. Preparing for Uber requires applying that foundation to problems with a "real-time systems" or "geospatial" twist.

## Topic Overlap: Your Foundation for Both

The top four topics are identical for both companies: **Array, String, Hash Table, Dynamic Programming**. This is your golden overlap. Mastery here is non-negotiable and provides the highest return on investment (ROI).

- **Array/String/Hash Table:** This triad is about efficient data access and manipulation. For Amazon, think inventory lists, customer IDs, and transaction logs. For Uber, think driver locations, trip histories, and city IDs. **Two Sum (#1)** isn't just a classic; it's the archetype for using a hash map to trade space for time, a pattern used everywhere.
- **Dynamic Programming:** Both companies use DP to assess your ability to break down complex problems and optimize repeated computations. Amazon might use it for resource optimization (e.g., knapsack variants), while Uber might apply it to optimal routing or fare calculation.

Where they diverge slightly is in the next tier:

- **Amazon** shows stronger emphasis on **Graph** (for product dependencies, network systems) and **Tree** (for hierarchical data like product categories) problems.
- **Uber**, while also using graphs, often leans into **Simulation** and problems that involve **Sorting** and **Two Pointers** as part of a larger, multi-step logic puzzle.

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

| Priority                             | Topics/Patterns                                                                                    | Why & Examples                                                                                                                                                                                       |
| :----------------------------------- | :------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tier 1: Max ROI**<br>(Study First) | **Hash Map + Array/String,** **Sliding Window,** **Fast & Slow Pointers,** **Classic DP (1D/2D)**  | The absolute core for both. Nail these patterns. <br>**Problems:** Two Sum (#1), Longest Substring Without Repeating Characters (#3), Best Time to Buy and Sell Stock (#121), Merge Intervals (#56). |
| **Tier 2: Amazon-Intensive**         | **Graph (BFS/DFS/Union Find),** **Tree (Traversal, BST),** **Trie,** **Advanced DP**               | Crucial for Amazon's system design and optimization questions. <br>**Problems:** Number of Islands (#200), Word Search II (#212), Course Schedule (#207), K Closest Points to Origin (#973).         |
| **Tier 3: Uber-Intensive**           | **Simulation,** **Heap/Priority Queue,** **Geometry/Distance,** **Concurrency (for senior roles)** | Applied problem-solving for real-time systems. <br>**Problems:** Merge k Sorted Lists (#23), Task Scheduler (#621), Robot Bounded In Circle (#1041).                                                 |
| **Tier 4: For Completion**           | **Bit Manipulation,** **Math,** **Design** (practice separately)                                   | Lower frequency, but can appear.                                                                                                                                                                     |

## Interview Format Differences

The _how_ is as important as the _what_.

- **Amazon:** The process is famously structured. The on-site/virtual loop typically consists of **4-5 interviews**: 2-3 coding rounds, 1 system design (for SDE2+), and 1-2 behavioral rounds focused on **Leadership Principles**. You often have **45-60 minutes per round**, usually tackling **1-2 medium problems** or **1 hard problem**. The behavioral portion is **weighted equally** to the technical. You must prepare STAR stories for their Leadership Principles.
- **Uber:** The process is also rigorous but can feel more conversational. A typical on-site includes **4-5 rounds**: 2-3 coding, 1 system design, and 1 behavioral/cultural fit. The coding problems often involve more **collaborative discussion** about trade-offs upfront. Uber's behavioral questions tend to focus on **scaling impact, customer obsession, and hustle**. The system design round for Uber is almost guaranteed for any level above new grad and will likely involve real-time, location-aware systems.

## Specific Problem Recommendations for Dual Prep

These problems teach patterns that resonate at both companies.

1.  **Merge Intervals (#56) - Medium:** This pattern is ubiquitous for dealing with overlapping ranges—scheduling meetings (Uber driver shifts), merging time blocks (Amazon delivery windows), or consolidating resources. It teaches sorting and greedy merging.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (or O(1) if sorted in place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]
        if current_start <= last_end:  # Overlap
            merged[-1] = [last_start, max(last_end, current_end)]
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

2.  **LRU Cache (#146) - Medium:** This is a classic system design problem distilled into code. It tests your understanding of hash maps and doubly-linked lists, which is core to caching mechanisms at both companies (product catalog at Amazon, driver info at Uber).

3.  **Word Break (#139) - Medium:** A perfect DP problem that appears in various guises. It teaches how to take a string/sequence and determine if it can be segmented according to rules—relevant for data validation, parsing commands, or checking resource availability.

4.  **K Closest Points to Origin (#973) - Medium:** Excellent for Uber (proximity of drivers/riders) and Amazon (nearest warehouse). It teaches efficient use of a **heap** for top-K problems and can be solved with a quickselect variant, allowing for a deep discussion on trade-offs.

5.  **Course Schedule (#207) - Medium:** A fundamental **graph topology** problem. For Amazon, it models task or package dependencies. For Uber, it could model prerequisites for driver promotions or city launch sequences. It's a must-know for cycle detection in directed graphs.

## Which to Prepare for First? The Strategic Order

**Prepare for Amazon first.** Here’s why:

1.  **Foundation First:** Amazon's vast, medium-focused question bank will force you to build speed, accuracy, and mastery of the core patterns (Tier 1). This creates a stronger foundation than starting with Uber's more niche, applied problems.
2.  **Behavioral Carryover:** The intense work you'll do crafting STAR stories for Amazon's 16 Leadership Principles will make you exceptionally prepared for any behavioral questions Uber throws your way. The reverse is less true.
3.  **Coverage:** By mastering the Amazon-focused Tier 2 topics (Graphs, Trees), you will cover a significant portion of what Uber tests. You can then layer on the Uber-specific Tier 3 topics (Simulation, Heaps) as a final, focused polish.

In essence, an Amazon-ready candidate is about 80% prepared for Uber. A Uber-ready candidate might only be 60% prepared for Amazon's breadth. Start with the broader, more foundational target.

For deeper dives into each company's process, explore the CodeJeet guides: [/company/amazon](/company/amazon) and [/company/uber](/company/uber).
