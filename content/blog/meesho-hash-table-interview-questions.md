---
title: "Hash Table Questions at Meesho: What to Expect"
description: "Prepare for Hash Table interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-23"
category: "dsa-patterns"
tags: ["meesho", "hash-table", "interview prep"]
---

Hash Table questions appear in nearly 1 out of every 5 coding problems at Meesho. For a company managing a massive e-commerce platform with millions of users, products, and transactions, efficient data lookup is non-negotiable. Hash tables provide average O(1) time complexity for insertions, deletions, and lookups, making them the backbone for features like user session management, product catalog searches, duplicate detection, and real-time analytics. Mastering them is essential for writing scalable code that can handle Meesho's volume.

## What to Expect — Types of Problems

Meesho's Hash Table problems typically test your ability to use the data structure as a tool for optimization, not just theory. Expect these categories:

1.  **Frequency Counting:** The most common pattern. Problems involve counting occurrences of elements (characters in strings, numbers in arrays) to find duplicates, anagrams, or majority elements.
2.  **Mapping and Lookup:** Using a hash map to store computed results or relationships to avoid re-calculation. This includes two-sum variants, checking for complements, or mapping keys to complex values.
3.  **Deduplication and Sets:** Using hash sets to track seen elements, remove duplicates, or find intersections/unions between data streams.
4.  **System Design Fundamentals:** Some questions may have a hash table component related to caching (like an LRU cache) or designing a key-value store, testing your understanding of its real-world application.

The problems often involve arrays and strings, requiring you to combine a hash table with other techniques like two pointers or sliding windows for optimal solutions.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition, not memorization. Practice until using a hash table for frequency or lookup becomes your first instinct for optimization problems.

**Core Tip:** For any problem where you find yourself needing to repeatedly search for an element, ask: "Can a hash table store this to make the lookup O(1)?"

A fundamental pattern is **using a hash map to store a needed complement or predecessor**. Let's look at the classic "Two Sum" problem, which is a building block for more complex variants.

**Problem:** Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to the target.

The brute-force solution is O(n²). The optimal O(n) solution uses a hash map to store each number's index as we iterate, allowing us to instantly check if the required complement (`target - current_number`) has already been seen.

<div class="code-group">

```python
def two_sum(nums, target):
    seen = {}  # Hash map: value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found
```

```javascript
function twoSum(nums, target) {
  const seen = new Map(); // Hash map: value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return []; // No solution found
}
```

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>(); // Hash map: value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] {seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[] {}; // No solution found
}
```

</div>

## Recommended Practice Order

Build competence progressively:

1.  **Master Fundamentals:** Two Sum, Valid Anagram, First Unique Character.
2.  **Handle Frequency:** Group Anagrams, Top K Frequent Elements.
3.  **Combine Techniques:** Longest Substring Without Repeating Characters (hash map + sliding window).
4.  **Tackle Advanced Designs:** LRU Cache (requires hash map + doubly linked list).

Internalize the pattern in the code example above. It's the key to solving dozens of problems where you need to find a pair or check for the existence of a related value.

[Practice Hash Table at Meesho](/company/meesho/hash-table)
