---
title: "Hash Table Questions at Swiggy: What to Expect"
description: "Prepare for Hash Table interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-01"
category: "dsa-patterns"
tags: ["swiggy", "hash-table", "interview prep"]
---

Hash Table questions appear in over one-third of Swiggy's technical interview problem set (14 out of 41). This frequency reflects their core operational needs: real-time order matching, efficient restaurant and menu data retrieval, duplicate detection in user activity logs, and rapid geospatial lookups. Mastering hash tables is non-negotiable for tackling Swiggy's focus on scalable, high-performance systems that handle millions of concurrent data points.

## What to Expect — Types of Problems

Swiggy's hash table problems typically extend beyond basic implementation. Expect them to be embedded in scenarios mirroring their platform's challenges.

- **Frequency Analysis & Counting:** The most common pattern. Problems involve counting item frequencies, such as tracking most-ordered dishes, analyzing delivery partner activity, or identifying duplicate user IDs in logs.
- **Lookup & Existence Checks:** Questions requiring O(1) checks for element presence. Examples include validating if a restaurant ID exists in a service zone or checking for a specific menu item across partnered kitchens.
- **Two-Number & Pair-Sum Variants:** Classic problems adapted to Swiggy's domain, like finding two delivery assignments whose combined time matches a target or identifying complementary menu items frequently ordered together.
- **Sliding Window + Hash Map:** More advanced problems combine a hash map with a sliding window to track characters or elements within a subarray. This pattern is useful for analyzing sequences, such as finding the longest delivery route segment with unique drop-off points.

## How to Prepare — Study Tips with One Code Example

Focus on applying the hash table as a tool to achieve O(1) average-time lookups, thereby reducing naive O(n²) solutions to O(n). Internalize the **frequency map** pattern. Always clarify input constraints and edge cases (empty input, all duplicates, large datasets) aloud during the interview.

A fundamental technique is using a hash map to count element frequencies in a single pass. This is the building block for most counting problems.

<div class="code-group">

```python
def count_frequencies(items):
    """Counts frequency of each item in a list."""
    freq_map = {}
    for item in items:
        freq_map[item] = freq_map.get(item, 0) + 1
    return freq_map

# Example: Counting most ordered dish IDs
dish_ids = [101, 102, 101, 103, 101, 102]
print(count_frequencies(dish_ids))
# Output: {101: 3, 102: 2, 103: 1}
```

```javascript
function countFrequencies(items) {
  const freqMap = {};
  for (const item of items) {
    freqMap[item] = (freqMap[item] || 0) + 1;
  }
  return freqMap;
}

// Example: Counting most ordered dish IDs
const dishIds = [101, 102, 101, 103, 101, 102];
console.log(countFrequencies(dishIds));
// Output: { '101': 3, '102': 2, '103': 1 }
```

```java
import java.util.HashMap;
import java.util.Map;

public class FrequencyCounter {
    public static Map<Integer, Integer> countFrequencies(int[] items) {
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int item : items) {
            freqMap.put(item, freqMap.getOrDefault(item, 0) + 1);
        }
        return freqMap;
    }

    public static void main(String[] args) {
        // Example: Counting most ordered dish IDs
        int[] dishIds = {101, 102, 101, 103, 101, 102};
        System.out.println(countFrequencies(dishIds));
        // Output: {101=3, 102=2, 103=1}
    }
}
```

</div>

## Recommended Practice Order

1.  **Basics:** Two Sum, First Unique Character, Valid Anagram.
2.  **Frequency & Counting:** Top K Frequent Elements, Group Anagrams.
3.  **Design & Advanced:** LRU Cache, Insert Delete GetRandom O(1).
4.  **Swiggy-Specific Practice:** Solve all 14 tagged problems on CodeJeet, focusing on the domain context.

[Practice Hash Table at Swiggy](/company/swiggy/hash-table)
