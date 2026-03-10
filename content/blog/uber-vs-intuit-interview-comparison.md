---
title: "Uber vs Intuit: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Intuit — difficulty levels, topic focus, and preparation strategy."
date: "2030-03-15"
category: "tips"
tags: ["uber", "intuit", "comparison"]
---

# Uber vs Intuit: Interview Question Comparison

If you're interviewing at both Uber and Intuit, you're looking at two distinct cultures of technical assessment. Uber, born in the hyper-growth, global mobility arena, tests for speed, scalability, and algorithmic rigor under pressure. Intuit, the established financial software giant, emphasizes robust, clean solutions to practical business problems, often with a data modeling slant. Preparing for both simultaneously is efficient, but requires a strategic shift in mindset. This guide breaks down the data from their tagged LeetCode questions and maps out a preparation plan that maximizes your return on study time.

## Question Volume and Difficulty

The raw numbers tell a clear story about breadth and depth.

**Uber** has a massive, well-documented question bank of **381 problems** (54 Easy, 224 Medium, 103 Hard). This volume indicates two things. First, their interview process is highly standardized with a large pool of questions, making it harder to predict what you'll get. Second, the significant Hard count (27%) signals they deeply test advanced algorithmic concepts, especially in later rounds. You need to be comfortable with complex graph traversals, dynamic programming optimizations, and concurrency.

**Intuit**'s catalog is more focused at **71 problems** (10 Easy, 47 Medium, 14 Hard). The lower volume suggests a more curated question set, possibly closer to real-world problems they've faced. The difficulty distribution (66% Medium, 20% Hard) is still challenging but leans slightly more toward practical application over pure algorithmic gymnastics. The smaller pool might mean higher question repetition, so studying their tagged problems is highly efficient.

**Implication:** Preparing for Uber will inherently cover most of Intuit's technical scope, but not the other way around. Uber's preparation is a superset in terms of algorithmic intensity.

## Topic Overlap

Both companies test core computer science fundamentals, but with different emphases.

**High Overlap (Study These First):**

- **Array & String Manipulation:** The absolute bedrock for both. Expect slicing, searching, and in-place operations.
- **Hash Table:** Essential for efficient lookups. Uber might use it for ride-matching heuristics; Intuit for grouping transaction data.
- **Dynamic Programming:** A major shared focus. Uber uses it for optimization problems (e.g., "minimum cost to reach a point"). Intuit applies it to problems with overlapping subproblems, perhaps in tax logic or resource allocation.

**Uber-Intensive Topics:**

- **Graph & Tree Algorithms:** Uber's #1 differentiator. Their business is a graph (locations as nodes, roads as edges). Master DFS, BFS, Dijkstra's, and topological sort. **Trie** is also crucial for features like auto-complete in the rider/driver app.
- **Design Questions:** Both do system design, but Uber's problems are famously complex, involving real-time geospatial data (e.g., "Design Uber Eats").
- **Concurrency:** Critical for Uber's real-time, high-throughput systems. Understand threading, locks, and producer-consumer patterns.

**Intuit-Intensive Topics:**

- **SQL & Data Modeling:** While not heavily reflected in LeetCode tags, Intuit interviews frequently include a dedicated data modeling/SQL round. Be ready to design schemas for accounting systems and write complex joins.
- **Object-Oriented Design:** More emphasis on clean, maintainable class hierarchies to model financial domains (Customers, Invoices, Transactions) rather than distributed systems.

## Preparation Priority Matrix

Use this to triage your study time.

| Priority                  | Topics                                                | Rationale                                        | Key Problems to Master                                                                                                       |
| :------------------------ | :---------------------------------------------------- | :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Tier 1 (Max ROI)**      | Array, Hash Table, String, Dynamic Programming        | High frequency at both companies.                | Two Sum (#1), Longest Substring Without Repeating Characters (#3), Merge Intervals (#56), Longest Palindromic Substring (#5) |
| **Tier 2 (Uber Focus)**   | **Graph (DFS/BFS/Dijkstra), Tree, Trie, Concurrency** | Uber's heavy hitters. Less critical for Intuit.  | Clone Graph (#133), Course Schedule (#207), Word Search II (#212), Serialize and Deserialize Binary Tree (#297)              |
| **Tier 3 (Intuit Focus)** | **SQL, Data Modeling, OOD**                           | Intuit's differentiator. Often a separate round. | (Practice designing a ledger/database schema)                                                                                |
| **Tier 4 (Secondary)**    | Heap, Greedy, Binary Search                           | Appears at both but is less dominant.            | Merge k Sorted Lists (#23), Task Scheduler (#621)                                                                            |

## Interview Format Differences

**Uber:**

- **Structure:** Typically 4-5 rounds onsite/virtual: 2-3 coding, 1 system design, 1 behavioral ("Uber Values").
- **Coding Rounds:** Fast-paced. You may be expected to solve 2 Medium problems or 1 Hard problem in 45 minutes. Interviewers look for optimal solutions, clean code, and the ability to handle follow-up scalability questions.
- **System Design:** High-stakes. Problems are large-scale and real-time (e.g., "Design Uber Pool"). Expect deep dives into geohashing, load balancing, and eventual consistency.
- **Behavioral:** The "Uber Values" round is serious. Prepare STAR stories that demonstrate customer obsession, boldness, and making big bets.

**Intuit:**

- **Structure:** Often includes a "Data Structures & Algorithms" round, a "Design" round (mix of OOD and system design), and a "Data Modeling" round.
- **Coding Rounds:** Slightly more conversational. The goal is a correct, well-structured solution. You might discuss trade-offs more than at Uber. Time may allow for 1-2 Medium problems.
- **Design Rounds:** Broader. Could be low-level OOD ("Design a parking lot") or mid-level system design ("Design TurboTax"). Less emphasis on extreme scale, more on accuracy, data integrity, and business logic.
- **Behavioral/Cultural Fit:** Focuses on collaboration, passion for the customer (e.g., "small business owners"), and ethical decision-making.

## Specific Problem Recommendations for Dual Preparation

These problems train patterns useful for both companies.

1.  **Merge Intervals (#56) - Medium**
    - **Why:** The interval merge pattern is ubiquitous. Uber uses it for scheduling rides/meetings; Intuit for merging financial periods or report dates. It teaches sorting and list manipulation.
    - **Core Skill:** Sorting with custom comparators and managing a merged result list.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (or O(1) if sorting in-place)
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
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
// Time: O(n log n) | Space: O(n) (for sorting & output)
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] curr = intervals[i];
        if (curr[0] <= last[1]) { // Overlap
            last[1] = Math.max(last[1], curr[1]);
        } else {
            merged.add(curr);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

2.  **Word Break (#139) - Medium**
    - **Why:** A classic Dynamic Programming problem. It trains the "segment/partition a sequence" DP pattern. Relevant to any validation or parsing logic (Uber: parsing location strings; Intuit: parsing financial rules).
    - **Core Skill:** Bottom-up DP with a hash set for O(1) lookups.

3.  **Clone Graph (#133) - Medium**
    - **Why:** Graph traversal is Uber's specialty, but this problem is a perfect foundation. It teaches BFS/DFS on a graph while handling cycles—a fundamental concept. The object cloning aspect also touches on deep copying, a useful general concept.
    - **Core Skill:** Graph BFS/DFS with a visited map to avoid cycles and handle copying.

4.  **LRU Cache (#146) - Medium**
    - **Why:** Combines Hash Table and Linked List to design a fundamental data structure. Caching is critical at Uber for performance and appears in Intuit's domain for recent transactions or user sessions. It's a common system design component.
    - **Core Skill:** Designing a data structure with O(1) operations using two complementary structures.

5.  **Find All Anagrams in a String (#438) - Medium**
    - **Why:** Excellent for mastering the sliding window pattern with a hash map counter. This pattern is used in countless string/subarray problems at both companies (Uber: analyzing trip patterns; Intuit: finding transaction sequences).

## Which to Prepare for First?

**Prepare for Uber first.**

Here’s the strategic rationale: Uber's technical interview is broader and deeper in pure algorithms and system scale. If you build a study plan that conquers Uber's graph problems, complex DP, and system design, you will have covered 90% of Intuit's technical coding expectations. The remaining 10% is Intuit's specific focus on data modeling and SQL, which you can layer on in a focused 2-3 day sprint after your Uber prep is solid.

**Your 4-Week Dual-Prep Plan:**

- **Weeks 1-3:** Follow a rigorous Uber-focused plan. Prioritize Tier 1 and Tier 2 topics from the matrix. Grind graph and DP problems.
- **Week 4, Part 1:** Review Intuit's tagged 71 problems. You'll find many are familiar. Solve any unfamiliar ones.
- **Week 4, Part 2:** Dedicate time to SQL practice (LeetCode's database problems) and object-oriented design. Sketch schemas for accounting systems.
- **Throughout:** Prepare behavioral stories, tailoring them to Uber's "Values" and Intuit's "Customer-Driven" culture separately.

By front-loading the harder, more comprehensive preparation, you make your study for the second company largely a review session, reducing total stress and increasing confidence.

For deeper dives into each company's process, visit our dedicated pages: [Uber Interview Guide](/company/uber) and [Intuit Interview Guide](/company/intuit).
