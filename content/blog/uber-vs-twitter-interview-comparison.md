---
title: "Uber vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2030-04-14"
category: "tips"
tags: ["uber", "twitter", "comparison"]
---

# Uber vs Twitter: Interview Question Comparison

If you're interviewing at both Uber and Twitter, you're facing two distinct interview cultures that test overlapping but differently prioritized skills. The most important insight: Uber's interview process is a marathon of algorithmic depth, while Twitter's is a sprint of practical implementation. Preparing for both simultaneously is possible, but requires strategic prioritization.

## Question Volume and Difficulty

The numbers tell a clear story. Uber has 381 tagged questions on LeetCode (54 Easy, 224 Medium, 103 Hard), making it one of the most algorithmically intensive interview processes in tech. Twitter has just 53 tagged questions (8 Easy, 33 Medium, 12 Hard).

This disparity isn't about quality—it's about approach. Uber's massive question bank reflects their tendency to ask complex variations of classic problems, often with multiple constraints. You might get a graph problem that's disguised as a string manipulation question, or a dynamic programming problem with spatial constraints. The high Hard count (103 vs Twitter's 12) indicates Uber frequently pushes candidates to their algorithmic limits.

Twitter's smaller question bank suggests more focused, practical problems. They're not necessarily easier—Medium problems can be tricky—but they tend to be more self-contained. Twitter interviews often test whether you can implement clean, working solutions under time pressure rather than whether you can derive complex algorithms from scratch.

## Topic Overlap

Both companies heavily test **Array**, **Hash Table**, and **String** manipulation. These form the core of most coding interviews, but each company emphasizes different aspects:

- **Arrays**: Uber loves array problems with multiple moving parts (think "Trapping Rain Water" variations). Twitter prefers cleaner array manipulations that test edge case handling.
- **Hash Tables**: Both use hash tables extensively, but Uber often combines them with other data structures (heaps, trees) for complex problems.
- **Strings**: String problems at Uber frequently involve dynamic programming or tricky pointer manipulation. Twitter's string problems often relate to real-world text processing.

The key difference: **Dynamic Programming** appears in Uber's top topics but not Twitter's. Uber asks DP problems regularly, especially variations of classic problems with Uber-specific twists (like ride scheduling optimization). Twitter's inclusion of **Design** in their top topics is telling—they value system thinking alongside pure algorithms.

## Preparation Priority Matrix

Here's how to allocate your study time efficiently:

**Study First (Maximum ROI):**

- Array manipulation with two pointers/sliding window
- Hash table applications (frequency counting, caching)
- String parsing and transformation
- Tree traversal (especially BST operations)

**Uber-Specific Focus:**

- Dynamic programming (knapsack variations, sequence problems)
- Graph algorithms (BFS/DFS, Dijkstra, topological sort)
- Complex system design (scalable real-time systems)

**Twitter-Specific Focus:**

- API design and object modeling
- Concurrent data structures
- Real-time data streaming concepts

## Interview Format Differences

Uber typically has 4-5 technical rounds: 2-3 coding, 1 system design, 1 behavioral. Coding rounds are 45-60 minutes with one complex problem or two medium problems. They expect optimal solutions with thorough complexity analysis. Uber interviewers often ask follow-up questions about scaling or variations.

Twitter's process is leaner: 2-3 technical rounds total, often mixing coding and design elements. Coding problems are usually 30-45 minutes with emphasis on clean, production-ready code. Twitter values communication and collaboration—they're assessing how you'd work on their team, not just your raw algorithmic skill.

The behavioral component differs too. Uber's behavioral questions often focus on scaling impact and handling ambiguity. Twitter's behavioral questions frequently touch on product sense and user perspective.

## Specific Problem Recommendations

These five problems provide excellent coverage for both companies:

1. **Two Sum (#1)** - The ultimate hash table problem that appears in variations at both companies. Master all variations (sorted/unsorted, multiple pairs, indices vs values).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}
```

</div>

2. **Merge Intervals (#56)** - Tests sorting, array manipulation, and edge case handling. Uber might add time-window constraints; Twitter might frame it as merging tweet streams.

3. **LRU Cache (#146)** - Combines hash tables, linked lists, and system design thinking. Perfect for both companies—Uber tests the algorithmic implementation, Twitter cares about the API design.

4. **Word Break (#139)** - A dynamic programming problem that's common at Uber but also tests string manipulation skills valuable at Twitter. Practice both the DP solution and follow-up variations.

5. **Design Twitter (#355)** - Ironically excellent for both. For Uber, focus on the scalable architecture. For Twitter, focus on the API design and data modeling.

## Which to Prepare for First

Prepare for **Uber first**, even if your Twitter interview comes sooner. Here's why: Uber's broader, deeper question coverage will force you to master fundamentals that make Twitter's problems feel manageable. If you can solve Uber's Hard dynamic programming problems, Twitter's Medium array problems will feel straightforward.

The reverse isn't true. Preparing only for Twitter's question style might leave you unprepared for Uber's algorithmic depth. Think of it as training for a marathon (Uber) versus a 5K (Twitter). Marathon training prepares you for both; 5K training won't get you through 26.2 miles.

Allocate 70% of your study time to Uber-style problems (dynamic programming, graphs, complex arrays) and 30% to Twitter-style problems (clean implementation, API design, concurrency). This balance ensures you're ready for Uber's depth while maintaining the code quality Twitter values.

Remember: Both companies ultimately want engineers who can think clearly and communicate effectively. The specific problems are just vehicles to assess those fundamental skills.

For more company-specific insights, check out our [Uber interview guide](/company/uber) and [Twitter interview guide](/company/twitter).
