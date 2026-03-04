---
title: "Hash Table Questions at Atlassian: What to Expect"
description: "Prepare for Hash Table interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-22"
category: "dsa-patterns"
tags: ["atlassian", "hash-table", "interview prep"]
---

Hash tables are the most frequently tested data structure at Atlassian, appearing in 21 of their 62 cataloged interview questions. This isn't an accident. Atlassian builds complex, collaborative software like Jira, Confluence, and Bitbucket. These systems constantly handle user data, permissions, real-time updates, and caching—all scenarios where fast O(1) average-time lookups, inserts, and deletions are critical. Mastering hash tables demonstrates you can design efficient solutions for the scale and performance demands of their products.

## What to Expect — Types of Problems

Atlassian's hash table questions typically fall into three categories, often combined with other concepts.

1.  **Direct Application:** These problems test your fundamental understanding. You'll be asked to use a hash map (dictionary) or hash set to track seen elements, count frequencies, or map keys to values. Examples include finding duplicates, checking anagrams, or implementing a simple cache.
2.  **Hash Tables for Optimization:** This is the most common pattern. You'll encounter problems where a brute-force solution is obvious but inefficient, often O(n²). The expected solution uses a hash table to store intermediate results (like complements or prefixes), reducing time complexity to O(n). The classic "Two Sum" is a prime example.
3.  **System Design Components:** Questions may involve designing a feature that inherently relies on hash-based structures. Think designing an API rate limiter (tracking requests per user ID), a feature flag system (mapping user segments to toggle states), or the core of a distributed cache.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition. Don't just memorize solutions. When you see a problem requiring fast lookups on dynamic data, a hash table should be your first instinct. Practice explaining _why_ you're choosing it and its trade-offs (time vs. space, handling collisions).

A key pattern is using a hash map to store a needed value (like a complement or prefix sum) as you iterate. This turns two-pass or nested-loop solutions into a single pass.

**Example: Two Sum Problem**
Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to the target.

The optimal solution uses a single pass with a hash map. For each number, calculate its complement (`target - num`). Check if the complement is already in the map. If not, store the current number and its index. This finds the pair in O(n) time.

<div class="code-group">

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
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
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] {seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals:** Start with pure hash table problems (e.g., First Unique Character, Contains Duplicate).
2.  **Optimization Patterns:** Practice the core patterns like Two Sum, Subarray Sum Equals K, and Group Anagrams.
3.  **Combination Problems:** Solve problems that combine hash tables with two pointers, sliding windows, or graphs.
4.  **Atlassian-Tagged Problems:** Finally, work through the specific hash table questions in Atlassian's question bank, simulating interview conditions.

[Practice Hash Table at Atlassian](/company/atlassian/hash-table)
