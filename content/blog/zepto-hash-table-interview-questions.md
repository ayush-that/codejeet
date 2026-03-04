---
title: "Hash Table Questions at Zepto: What to Expect"
description: "Prepare for Hash Table interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-02"
category: "dsa-patterns"
tags: ["zepto", "hash-table", "interview prep"]
---

Hash Table questions appear in nearly 20% of Zepto's technical interview problems (5 out of 28). This frequency reflects their operational reality: Zepto's core promise of 10-minute grocery delivery is built on real-time systems that demand constant, fast lookups. Whether it's tracking inventory across dark stores, mapping delivery partner locations, managing user session data, or deduplicating items in a massive order stream, hash tables provide the O(1) average-time complexity that makes speed at scale possible. Mastering them is non-negotiable for candidates.

## What to Expect — Types of Problems

Zepto's hash table problems typically test your ability to use the structure as a foundational tool for more complex logic, not just basic insertion and lookup. Expect these categories:

1.  **Frequency Counting:** The most common pattern. You'll be given an array of strings (like product SKUs) or numbers and asked to find duplicates, the most/least frequent element, or to compare frequencies between two datasets.
2.  **Complement Searching (Two-Sum Variants):** Given a list of order values or delivery distances, find two entries that meet a specific condition (e.g., sum to a target delivery time). The hash table stores seen elements for instant complement checks.
3.  **Subarray Problems:** Problems involving contiguous sequences where a hash map tracks a running sum or state, enabling you to check if a subarray with a target sum exists or to find the longest subarray with certain properties.
4.  **Mapping and Grouping:** Tasks like grouping anagrams of product names or categorizing orders by status. The hash table's key acts as a unique classifier.

The problems will often be framed within Zepto's domain—think customer IDs, order batches, or delivery PIN codes—but the underlying patterns are standard.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition, not memorization. Internalize these steps: 1) Identify the need for fast lookup or store-and-retrieve. 2) Decide what to use as the key (often the element itself or a derived value) and what to store as the value (count, index, or a group). 3) Traverse your data, using the map to make decisions in a single pass.

A classic example is the **Two-Sum problem**, which tests complement searching. Given an array of order IDs (as numbers) and a target sum, find the two IDs that add up to it.

<div class="code-group">

```python
def two_sum(order_ids, target):
    seen = {}
    for i, id in enumerate(order_ids):
        complement = target - id
        if complement in seen:
            return [seen[complement], i]
        seen[id] = i
    return []

# Example: Find two orders whose IDs sum to a target delivery code.
```

```javascript
function twoSum(orderIds, target) {
  const seen = new Map();
  for (let i = 0; i < orderIds.length; i++) {
    const complement = target - orderIds[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(orderIds[i], i);
  }
  return [];
}
```

```java
public int[] twoSum(int[] orderIds, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < orderIds.length; i++) {
        int complement = target - orderIds[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(orderIds[i], i);
    }
    return new int[]{};
}
```

</div>

## Recommended Practice Order

Build competence progressively:

1.  Start with **fundamentals**: Implement a hash table from scratch (managing collisions) to deeply understand it.
2.  Solve **frequency counting** problems (e.g., "First Unique Character in a String").
3.  Master the **Two-Sum** pattern and its variants (Three-Sum, Two-Sum with data structure).
4.  Tackle **prefix sum with hash map** problems (e.g., "Subarray Sum Equals K").
5.  Practice **grouping** problems (e.g., "Group Anagrams").
6.  Finally, attempt Zepto's specific company-tagged problems to integrate patterns in a domain context.

[Practice Hash Table at Zepto](/company/zepto/hash-table)
