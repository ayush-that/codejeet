---
title: "Hash Table Questions at Expedia: What to Expect"
description: "Prepare for Hash Table interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-05-31"
category: "dsa-patterns"
tags: ["expedia", "hash-table", "interview prep"]
---

## Why Hash Tables Are Non-Negotiable at Expedia

If you're preparing for an Expedia interview, you can't afford to treat hash tables as just another data structure. They represent over 27% of their tagged problems (15 out of 54), making them the single most tested topic. This isn't an accident. Expedia's core business—travel booking—is fundamentally about mapping relationships: users to bookings, destinations to prices, flight numbers to schedules, and dates to availability. The hash table (or dictionary, or map) is the engine that makes these real-time lookups possible. In your interview, a hash table question won't be a simple warm-up; it will likely be the main event for a coding round, testing whether you instinctively reach for the right tool to optimize time complexity from O(n²) to O(n).

## Specific Patterns Expedia Favors

Expedia's hash table problems skew heavily toward **frequency counting** and **complementary lookups** within arrays and strings. They love problems where the naive solution is a double loop, and the optimal solution uses a hash map to cache seen elements. You won't often see esoteric variations; instead, they test deep mastery of the fundamental pattern.

The most frequent pattern is the **"One-Pass Hash Table"** for pair-finding, best exemplified by **Two Sum (#1)**. The core insight is that as you iterate, you store each element's complement (target - current_value) in the map. If you encounter that complement later, you've found your pair. This pattern extends to problems about subarray sums, anagrams, and character distances.

Another common theme is **"Hash Table as an Index Tracker,"** used in problems like **First Unique Character in a String (#387)** or **Two Sum II - Input Array Is Sorted (#167)**. Here, the map tracks metadata (like indices or counts) to answer queries in constant time.

<div class="code-group">

```python
# The quintessential Expedia pattern: One-Pass Hash Table for Two Sum
# Time: O(n) | Space: O(n)
def two_sum(nums, target):
    """
    Returns indices of the two numbers that add up to target.
    """
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # Problem guarantees a solution
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
  return []; // Guaranteed solution exists
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
    return new int[]{}; // Guaranteed solution
}
```

</div>

## How to Prepare

Master the pattern above until it's muscle memory. Then, practice these variations:

1.  **Counting Frequencies:** Use a hash table to count occurrences, then use that map to make decisions. Example: **Top K Frequent Elements (#347)**.
2.  **Grouping by Key:** Use the hash table's value as a list to group items, like grouping anagrams in **Group Anagrams (#49)**.
3.  **Prefix Sum with Map:** For problems involving subarray sums (e.g., **Subarray Sum Equals K (#560)**), use a map to store the frequency of prefix sums.

The key is to recognize the "lookup" need. Ask yourself: "Am I repeatedly searching for something that I've already seen?" If yes, a hash table is your answer.

<div class="code-group">

```python
# Pattern: Frequency Map for character/string problems
# Time: O(n) | Space: O(1) because alphabet size is fixed
def first_uniq_char(s: str) -> int:
    """
    Returns the index of the first non-repeating character.
    """
    freq = {}
    # Build frequency map
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    # Find first char with count 1
    for i, ch in enumerate(s):
        if freq[ch] == 1:
            return i
    return -1
```

```javascript
// Time: O(n) | Space: O(1)
function firstUniqChar(s) {
  const freq = new Map();
  // Build frequency map
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  // Find first unique
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }
  return -1;
}
```

```java
// Time: O(n) | Space: O(1)
public int firstUniqChar(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    // Build frequency map
    for (char ch : s.toCharArray()) {
        freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    }
    // Find first unique
    for (int i = 0; i < s.length(); i++) {
        if (freq.get(s.charAt(i)) == 1) {
            return i;
        }
    }
    return -1;
}
```

</div>

## How Expedia Tests Hash Table vs Other Companies

Compared to FAANG companies, Expedia's hash table questions are less about algorithmic trickery and more about **clean, efficient implementation of business logic**. At Google, you might get a hash table problem disguised as a system design question (e.g., designing a consistent hashing system). At Expedia, you're more likely to get a problem that mirrors a real-world travel scenario: finding matching pairs of flights, detecting duplicate bookings, or validating itinerary sequences.

The difficulty is typically in the **medium** range on LeetCode. They want to see that you can not only implement the pattern but also handle edge cases (duplicate values, empty inputs, large datasets) and clearly explain your trade-offs. Interviewers often follow up with, "How would this scale if the input was 10x larger?" expecting you to defend your O(n) time and O(n) space choices.

## Study Order

1.  **Basic Operations & Syntax:** Get fluent in declaring, adding, accessing, and iterating through hash tables in your chosen language. Know the difference between `map.get(key)` and `map.containsKey(key)`.
2.  **The Classic Pair-Finder:** Master **Two Sum (#1)** and its variants. This is the foundation. Understand why the one-pass solution is optimal.
3.  **Frequency Counting:** Solve problems like **First Unique Character (#387)** and **Valid Anagram (#242)**. Learn to use the map for counting before making a second pass.
4.  **Grouping & Caching:** Tackle **Group Anagrams (#49)**. Here, the hash table's value is a _list_, not a single integer.
5.  **Advanced Patterns:** Move to **Subarray Sum Equals K (#560)** and **Longest Substring Without Repeating Characters (#3)**. These combine hash tables with the sliding window technique, a common next-step in Expedia interviews.

This order builds from simple lookup to complex state tracking, ensuring you internalize each concept before layering on complexity.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **Two Sum (#1)** - The absolute must-know.
2.  **Contains Duplicate (#217)** - A simple frequency check.
3.  **Valid Anagram (#242)** - Compare frequency maps.
4.  **First Unique Character in a String (#387)** - Count then scan.
5.  **Group Anagrams (#49)** - Level up: using sorted string as a key.
6.  **Two Sum II - Input Array Is Sorted (#167)** - Same pattern, but now with a sorted input twist.
7.  **Longest Substring Without Repeating Characters (#3)** - Hash table + sliding window. This is where Expedia might stop in a 45-minute interview.

If you have time, **Subarray Sum Equals K (#560)** and **Top K Frequent Elements (#347)** are excellent final preparations that test your ability to adapt the core pattern.

[Practice Hash Table at Expedia](/company/expedia/hash-table)
