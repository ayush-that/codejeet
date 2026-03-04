---
title: "Hash Table Questions at JPMorgan: What to Expect"
description: "Prepare for Hash Table interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-21"
category: "dsa-patterns"
tags: ["jpmorgan", "hash-table", "interview prep"]
---

Hash Table questions appear in 28% of JPMorgan's coding problems (22 out of 78). This isn't random. In financial systems, you need O(1) lookups for real-time data—mapping transaction IDs to records, checking risk exposure across instruments, or validating client permissions. A hash table (or dictionary/hashmap) is the core data structure for this. Mastering it is non-negotiable for passing their technical screen.

## What to Expect — Types of Problems

JPMorgan's hash table problems typically test your ability to use the structure to optimize a brute-force solution. You won't be asked to implement a hash table from scratch. Instead, expect:

- **Frequency Counting:** The most common pattern. Given an array of trades, log entries, or symbols, count occurrences or find duplicates.
- **Mapping and Lookup:** Using a hash table as a direct lookup table—like storing computed results to avoid re-calculation, or mapping symbols to prices.
- **Two-Number/Two-Sum Variants:** Fundamental to finance (e.g., "find two transactions that net to a target amount"). The hash table provides the efficient complement search.
- **Sliding Window + Hash Map:** For substring or subarray problems where you track character or element counts within a window.

Problems are often framed in a financial context, but the underlying algorithm is standard. Your job is to recognize the hash table pattern instantly.

## How to Prepare — Study Tips with One Code Example

1.  **Internalize the Two-Sum Template:** This is the gateway pattern. If you can solve Two-Sum and its variants, you can solve a large fraction of these questions.
2.  **Practice Frequency Maps:** Use your language's built-in type (`dict`, `Map`, `HashMap`) to count things. This is often the first step in optimization.
3.  **Know Your Complexities:** Be ready to explain why the hash table solution is O(n) time and O(n) space compared to a brute-force O(n²).

The core pattern is using a hash map to store what you've seen (or need) as you traverse data once. Here is the classic Two-Sum implementation:

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

Don't jump into hard problems. Build competence sequentially:

1.  **Fundamentals:** Two-Sum, First Repeating Character, Valid Anagram.
2.  **Frequency Patterns:** Top K Frequent Elements, Group Anagrams.
3.  **Advanced Mapping:** Longest Substring Without Repeating Characters (sliding window + hash map), Subarray Sum Equals K.
4.  **JPMorgan Tagged Problems:** Finally, filter the company's question list by the Hash Table tag and solve them in order of frequency.

Focus on writing clean, correct code on your first try. At JPMorgan, solution efficiency is critical, but so is readability and handling edge cases.

[Practice Hash Table at JPMorgan](/company/jpmorgan/hash-table)
