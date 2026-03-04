---
title: "Hash Table Questions at Zomato: What to Expect"
description: "Prepare for Hash Table interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-12"
category: "dsa-patterns"
tags: ["zomato", "hash-table", "interview prep"]
---

Hash Table questions appear in nearly one-third of Zomato's technical interviews. For a platform handling millions of restaurant listings, user reviews, order tracking, and real-time location data, efficient data lookup isn't a luxury—it's the core of the service. Hash tables provide average O(1) time complexity for insertions, deletions, and lookups, making them the default choice for caching user sessions, indexing restaurant IDs, grouping orders, and deduplicating menu items. If your solution involves pairing data, counting frequencies, or checking for existence, a hash table (or its language-specific implementation like `dict`, `Map`, or `HashMap`) will likely be your starting point.

## What to Expect — Types of Problems

Zomato's hash table problems typically focus on real-world data modeling and optimization, not abstract academic puzzles. Expect these categories:

1.  **Frequency Counting & Aggregation:** The most common pattern. You'll be given a list (e.g., user IDs, order IDs, dish names) and asked to find duplicates, the most frequently ordered item, or to group data by a certain key.
2.  **Pairing & Two-Sum Variants:** Problems that involve finding two data points that satisfy a condition, such as matching a customer to their pending order or finding two menu items that combine to a target price for a promotion.
3.  **Caching & Memoization:** Questions that test your ability to optimize repeated computations, like caching geolocation lookups or user preference checks to avoid expensive database calls.
4.  **String & Character Manipulation:** Applied to text data like reviews, dish descriptions, or user names—for example, finding the first non-repeating character in a stream of review text or checking if two menu item names are anagrams.

The problems are designed to see if you can identify the underlying pattern and implement a clean, efficient solution under interview constraints.

## How to Prepare — Study Tips with One Code Example

Master the fundamental operations: insertion, lookup, and deletion. Then, practice mapping problem statements to the hash table pattern. The key insight is recognizing when you need to **store something to reference later**. A classic example is the "Two Sum" problem, which is foundational for pairing-related questions.

**Core Pattern:** Use the hash table to store each element's value (or a computed value) as you iterate. For each new element, check if its complement (target - current_value) already exists in the table. This turns an O(n²) nested loop solution into an O(n) single-pass solution.

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

# Example: Find two dish prices that sum to a target value.
# prices = [150, 80, 60, 220, 110]; target = 270
# Returns indices [0, 3] for prices 150 and 220.
```

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Example: Find two order IDs whose values sum to a target.
// nums = [101, 45, 78, 23]; target = 124;
// Returns [1, 3] for values 45 and 78.
```

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}

// Example: Find two user session tokens that satisfy a condition.
// nums = {5, 12, 8, 3}; target = 15;
// Returns [1, 2] for values 12 and 3.
```

</div>

## Recommended Practice Order

1.  Start with the absolute basics: implement a hash table from scratch (conceptual understanding of hashing and collision resolution).
2.  Solve fundamental pattern problems: Two Sum, First Repeating Character, Group Anagrams.
3.  Move to frequency-based problems: Top K Frequent Elements, Find Duplicates.
4.  Tackle Zomato-specific problems that combine hash tables with other concepts like arrays or strings, simulating real data tasks.

[Practice Hash Table at Zomato](/company/zomato/hash-table)
