---
title: "Uber vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Uber and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2030-03-29"
category: "tips"
tags: ["uber", "ebay", "comparison"]
---

# Uber vs eBay: Interview Question Comparison

If you're interviewing at both Uber and eBay, or trying to decide where to focus your preparation, you're facing two very different interview landscapes. Uber's technical interviews are notoriously comprehensive and algorithm-heavy, reflecting their scale and complex real-time systems. eBay's interviews, while still rigorous, tend to be more focused and practical. The key insight: preparing for Uber will cover most of what you need for eBay, but not vice versa. Let's break down exactly what that means for your study strategy.

## Question Volume and Difficulty

The numbers tell a clear story. Uber has 381 tagged questions on LeetCode (54 Easy, 224 Medium, 103 Hard), making it one of the most question-dense company tags. This volume suggests two things: first, Uber interviews pull from a massive problem bank, making pure memorization ineffective. Second, they heavily favor Medium and Hard problems, indicating they're testing for strong algorithmic fundamentals under pressure.

eBay's tag shows 60 questions (12 Easy, 38 Medium, 10 Hard). This smaller pool suggests more predictable patterns and a focus on practical, clean solutions over extreme optimization. The Medium-heavy distribution is standard for senior engineer roles, but the relative lack of Hard problems means you're less likely to encounter obscure dynamic programming or complex graph theory.

**Implication:** Uber preparation is marathon training; eBay preparation is a 10K. If you have time for only one study plan, make it Uber's—it will over-prepare you for eBay. If you're short on time and only interviewing at eBay, you can focus more narrowly.

## Topic Overlap

Both companies test core computer science fundamentals heavily:

- **Array, String, Hash Table:** These are the bread and butter for both. You will 100% encounter problems involving manipulation and analysis of these data structures.
- **Sorting:** While listed for eBay, sorting algorithms (or, more commonly, using sorting as a step in a solution) appear frequently at Uber too, especially in two-pointer or interval problems.

**Uber-Intensive Topics:**

- **Dynamic Programming:** Uber loves DP. Their systems deal with optimization problems (route efficiency, pricing, matching) where DP patterns naturally appear. Expect at least one DP problem in the process.
- **Graph/Tree Algorithms:** Not explicitly in the listed topics but pervasive in Uber questions due to their mapping and network focus. DFS, BFS, and shortest path algorithms are essential.

**eBay-Intensive Topics:**

- **Design/System Design:** While both test this for senior roles, eBay's e-commerce and marketplace focus means design questions often revolve around scalable web services, database design for product catalogs, and consistency models—slightly more traditional than Uber's real-time, event-driven system design.

## Preparation Priority Matrix

Maximize your return on study time with this priority list:

1.  **High-ROI Overlap (Study First):** Array, String, Hash Table. Master two-pointer techniques, sliding windows, and prefix sums for arrays. For strings, know pattern matching and palindrome checks. For hash tables, practice using them for O(1) lookups to reduce time complexity.
2.  **Uber-Specific Priority:** Dynamic Programming. Start with the fundamental patterns: 1D DP (Fibonacci, climbing stairs), 0/1 Knapsack, and longest common subsequence. Then move to 2D DP and state machines.
3.  **eBay-Specific Priority:** Sorting-based solutions and clean, object-oriented design in your code. eBay interviewers often appreciate readable, maintainable code as much as raw performance.

**Shared-Prep Problem Example:** The classic "Two Sum" (#1) is foundational for both because it teaches the core hash table trade-off: using space (O(n)) to drastically reduce time from O(n²) to O(n). It's a pattern reused in dozens of variations.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    """
    Uber/eBay Core Pattern: Hash Table for instant lookups.
    """
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # Problem guarantees a solution exists
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const seen = new Map(); // value -> index
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
    Map<Integer, Integer> seen = new HashMap<>(); // value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

</div>

## Interview Format Differences

**Uber:** Typically 4-5 rounds onsite/virtual: 2-3 coding, 1 system design, 1 behavioral (Leadership Principles). Coding rounds are 45-60 minutes, often with one medium-hard problem or two medium problems. Interviewers expect optimal solutions (correct time/space complexity) and clean, bug-free code. They dive deep on follow-ups: "How would this scale?" "What if the data is streamed?"

**eBay:** Often 3-4 rounds: 1-2 coding, 1 system design (for senior+), 1 behavioral/experience deep-dive. Coding rounds are 45 minutes, usually one problem with multiple parts. They value clarity and communication. You might be asked to walk through trade-offs between different approaches rather than just producing the most optimal one.

**Key Difference:** Uber's process feels more like a "coding olympiad" — can you solve this hard problem optimally? eBay's feels more like a "collaborative work session" — can you reason about this practical problem and write solid code?

## Specific Problem Recommendations for Dual Preparation

These problems teach patterns applicable to both companies:

1.  **Merge Intervals (#56):** Uber uses it for time-based scheduling (driver availability); eBay uses it for auction or sale periods. Teaches sorting and greedy merging.
2.  **Longest Substring Without Repeating Characters (#3):** The quintessential sliding window problem. Essential for string manipulation questions at both companies.
3.  **Word Break (#139):** A perfect introduction to Dynamic Programming (useful for Uber) that also involves string searching (useful for eBay). It bridges the priority areas.
4.  **LRU Cache (#146):** Combines hash table and linked list design. Tests fundamental data structure knowledge and is a common system design component for both.
5.  **Find All Anagrams in a String (#438):** Another excellent sliding window problem, but with a hash map to track character counts. This pattern appears in many "find permutation/subset in larger set" questions.

## Which to Prepare for First?

**Strategy: Prepare for Uber first, then adapt for eBay.**

1.  **Spend 70% of your time** on the Uber-focused plan: grind Medium/Hard problems, especially in DP, graphs, and arrays/strings.
2.  **One week before your eBay interview**, shift focus. Re-practice the core overlap topics (arrays, strings, hash tables). Practice _explaining_ your reasoning clearly out loud. Write code with excellent variable names and comments, as readability might be weighted more heavily.
3.  **Mental shift:** For Uber, think "optimal and scalable." For eBay, think "clean, correct, and well-communicated."

By mastering the broader, deeper Uber question set, you'll build the algorithmic muscle to handle eBay's challenges. The final step is adjusting your communication style to match each company's interview culture.

For more detailed breakdowns, visit the CodeJeet pages for [Uber](/company/uber) and [eBay](/company/ebay).
