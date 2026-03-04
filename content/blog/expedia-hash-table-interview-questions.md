---
title: "Hash Table Questions at Expedia: What to Expect"
description: "Prepare for Hash Table interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-08"
category: "dsa-patterns"
tags: ["expedia", "hash-table", "interview prep"]
---

Hash Table questions appear in over a quarter of Expedia's technical interviews (15 out of 54 total problems). This frequency reflects their critical role in the company's engineering work. Expedia's platforms handle massive volumes of real-time data—flight searches, hotel bookings, user sessions, and pricing information. Hash tables (or hash maps) are the fundamental data structure for instant lookups, caching user sessions, deduplicating data streams, and managing key-value pairs at scale. Mastering them is non-negotiable for writing the efficient, low-latency code that powers a global travel marketplace.

## What to Expect — Types of Problems

Expedia's hash table questions typically assess your ability to recognize when a lookup can optimize a brute-force solution. Expect problems in these categories:

- **Pair Finding:** The classic "Two Sum" problem and its variants, where you must find two elements that satisfy a condition (e.g., sum to a target value).
- **Frequency Counting:** Problems that require counting occurrences of elements to find duplicates, majorities, or anagrams. You might be asked to deduplicate a data stream or verify if two strings are permutations of each other.
- **Subarray Problems:** Using a hash map to track running sums or states to solve problems like "finding a subarray with a given sum" or "contiguous array with equal numbers of 0s and 1s."
- **Design & System Basics:** While less common in initial coding screens, you might discuss designing a simple in-memory cache (like an LRU cache) or how you'd use hash tables in a distributed system context.

The problems often involve strings, arrays, or lists. The core expectation is that you will use the hash table to achieve an O(n) time complexity solution for what might initially seem like an O(n²) problem.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition. When you see a problem requiring quick lookups, checking for existence, or comparing elements, a hash table should be your first instinct. Practice by first trying a brute-force solution, then identifying the repeated work that a hash map can eliminate.

A key pattern is using a hash map to store a **"complement"** or **"needed value"** as you traverse an array. This turns a two-pass nested loop into a single pass.

<div class="code-group">

```python
def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
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
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>(); // value -> index
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

1.  **Master the Fundamentals:** Start with classic problems like Two Sum, First Unique Character, and Valid Anagram. Ensure you can implement the hash table solution flawlessly.
2.  **Tackle Frequency & Grouping:** Move to problems like Group Anagrams and Top K Frequent Elements. These solidify your ability to use hash maps for categorization.
3.  **Solve Subarray Challenges:** Practice problems like Subarray Sum Equals K and Contiguous Array. These are more challenging but common at Expedia's level.
4.  **Simulate Interview Conditions:** Finally, practice Expedia's specific hash table questions under timed conditions to build speed and confidence.

[Practice Hash Table at Expedia](/company/expedia/hash-table)
