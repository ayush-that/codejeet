---
title: "Hash Table Questions at American Express: What to Expect"
description: "Prepare for Hash Table interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-24"
category: "dsa-patterns"
tags: ["american-express", "hash-table", "interview prep"]
---

Hash Table questions appear in over one-third of American Express coding interviews (9 out of 24 total problems). This frequency reflects their practical importance in financial technology. At AmEx, systems process millions of transactions daily, requiring instant lookups for fraud detection, customer account retrieval, and payment routing. Hash tables provide the O(1) average-time complexity needed for these real-time operations. Mastering them demonstrates you can write efficient code for scalable, high-volume systems—a core expectation for their engineering roles.

## What to Expect — Types of Problems

You will encounter problems that test both your understanding of the hash table data structure and your ability to apply it to common financial and data processing scenarios. Expect these categories:

1.  **Frequency Counting:** The most common pattern. Problems involve counting occurrences of elements (characters, numbers, transaction IDs) to find duplicates, anagrams, or majority elements. Example: "Given a list of transaction IDs, find the first one that repeats."
2.  **Mapping and Lookup:** Using a hash map to store mappings between keys and values for fast access. This includes two-sum variants, storing computed results to avoid re-calculation, or linking related data (e.g., user ID to session data).
3.  **Set Operations:** Using a hash set to track seen elements, remove duplicates, or check for membership. Often used in conjunction with other patterns for efficiency.
4.  **Direct Application:** Questions may explicitly ask you to design or implement a hash table, discussing collision resolution (like chaining or open addressing) and the hash function itself. This tests your fundamental data structure knowledge.

The problems often have a "financial data" context, but the underlying hash table mechanics remain the same.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition, not memorization. Internalize the standard approaches so you can adapt them. For each problem, articulate the time and space complexity of your solution. AmEx interviewers will expect this.

A critical pattern is using a hash map to **pre-store information** (like counts or indices) to solve the problem in a single pass. This optimizes solutions that might otherwise require nested loops.

Consider the classic **Two Sum** problem: "Given an array of integers and a target, return the indices of the two numbers that add up to the target." The brute-force solution is O(n²). The optimal solution uses a hash map for O(n) time.

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
    HashMap<Integer, Integer> seen = new HashMap<>();
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

The pattern is universal: iterate once, use the hash map to instantly check for a needed value (the complement), and store the current element for future checks.

## Recommended Practice Order

Build your skills progressively:

1.  **Fundamentals:** Start with basic frequency counting (e.g., "Contains Duplicate") and set operations.
2.  **Key Pattern:** Master the complement-check pattern shown above in "Two Sum" and its variants.
3.  **Advanced Mapping:** Practice problems where the hash map value is a more complex data type, like a list (e.g., "Group Anagrams") or another hash map.
4.  **System Design Lite:** Be prepared to discuss hash table internals—collision handling, load factor, and resizing.

[Practice Hash Table at American Express](/company/american-express/hash-table)
