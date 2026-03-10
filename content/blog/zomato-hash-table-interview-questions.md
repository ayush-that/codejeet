---
title: "Hash Table Questions at Zomato: What to Expect"
description: "Prepare for Hash Table interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-04"
category: "dsa-patterns"
tags: ["zomato", "hash-table", "interview prep"]
---

If you're preparing for a Zomato interview, you've likely noticed their question distribution: **8 out of 29 tagged problems involve Hash Tables**. That's over 25% of their publicly listed problems. This isn't a coincidence — it's a direct reflection of their engineering reality. Zomato's core business — food delivery, restaurant discovery, real-time order tracking, and dynamic pricing — is fundamentally built on fast lookups, deduplication, session management, and counting operations. When you need to check if a user has already reviewed a restaurant, track delivery partner locations, or manage millions of concurrent sessions, hash tables are your go-to data structure. In real interviews, expect at least one hash table problem, often as the first or second coding question, because it tests a candidate's ability to recognize when constant-time access can transform an O(n²) brute force into an elegant O(n) solution.

## Specific Patterns Zomato Favors

Zomato's hash table problems aren't about implementing the data structure itself. They focus on **applied pattern recognition** where a hash map unlocks efficiency. The three most frequent patterns are:

1.  **Frequency Counting & Two-Pass Hashing:** This is their bread and butter. Problems where you first count occurrences (e.g., ingredients, cuisines, user IDs) into a hash map, then use that map to derive an answer. This pattern is foundational to analytics, a huge part of Zomato's data-driven decisions.
2.  **Complement/Two-Sum Pattern:** Finding pairs that satisfy a condition (sum to a target, are complementary). This directly models problems like "find two menu items whose combined price equals a discount target" or "match delivery partners to orders based on proximity."
3.  **Mapping for State or Grouping:** Using a hash map to store a mapping from one entity to another (like an ID to a name, or a category to a list). This is essential for tasks like caching restaurant details or grouping orders by zone.

You will rarely see esoteric hash table applications here. The focus is on practical, business-relevant logic.

## How to Prepare

Master the frequency counting pattern first. The mental model is: **"If I need to know 'how many' or 'is there a duplicate,' reach for a hash map."** Let's look at a classic variation: finding the first unique element in a list (e.g., the first non-repeating order ID in a stream).

<div class="code-group">

```python
def first_unique_character(s: str) -> int:
    """
    Given a string, find the first non-repeating character and return its index.
    Models finding the first unique order ID in a sequence.
    """
    # First pass: count frequencies
    # Time: O(n) | Space: O(1) or O(k) where k is charset size (26 for lowercase letters)
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Second pass: find first char with count == 1
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i
    return -1
```

```javascript
function firstUniqueCharacter(s) {
  // First pass: build frequency map
  // Time: O(n) | Space: O(1) / O(k) for charset
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Second pass: find first unique
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }
  return -1;
}
```

```java
public int firstUniqChar(String s) {
    // First pass: count frequencies
    // Time: O(n) | Space: O(1) / O(k) for charset
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Second pass: find first unique
    for (int i = 0; i < s.length(); i++) {
        if (freq.get(s.charAt(i)) == 1) {
            return i;
        }
    }
    return -1;
}
```

</div>

The key insight is the **two-pass approach**. The first pass builds the "knowledge" (the frequency map), and the second pass uses that knowledge to answer the question efficiently. This pattern appears in problems like **Top K Frequent Elements (#347)** and **Group Anagrams (#49)**.

Next, internalize the complement pattern. The template is: **As you iterate, check if the complement (target - current) exists in a seen set/map. If not, add the current element.**

<div class="code-group">

```python
def two_sum(nums, target):
    """
    Return indices of the two numbers that add up to target.
    Models finding two menu items that match a promotional price sum.
    """
    # One-pass complement check
    # Time: O(n) | Space: O(n)
    seen = {}  # maps value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # or raise exception
```

```javascript
function twoSum(nums, target) {
  // One-pass complement check
  // Time: O(n) | Space: O(n)
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
    // One-pass complement check
    // Time: O(n) | Space: O(n)
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

## How Zomato Tests Hash Table vs Other Companies

At large, foundational tech companies (FAANG), hash table problems can sometimes be a springboard into deeper system design discussions (e.g., "How would you scale this hash map globally?"). At Zomato, the focus is different. Their questions are **more applied and directly tied to a domain scenario**. You might get a problem about "tracking duplicate restaurant reviews" or "finding common food preferences between users." The difficulty is usually **medium**, but the expectation is clean, optimal code on the first try. They care about whether you can see the hash table pattern quickly and implement it without bugs. Unlike some finance or hardcore algo shops, they are less likely to ask for a custom hash map implementation or extremely obscure collision resolution trivia. They want to know you can use the tool effectively in their codebase.

## Study Order

1.  **Basic Operations & Frequency Counting:** Start here. Understand `put`, `get`, `in` (Python)/`containsKey` (Java), and how to count things. This is the absolute foundation.
2.  **The Complement Pattern (Two-Sum Variants):** Learn to recognize when you need to find a pair. This builds on the basic operations but adds the logic of checking for a _related_ element.
3.  **Mapping for Grouping (Anagrams, Categorization):** This uses the hash map's ability to map a _key_ (like a sorted string or a category) to a _collection_ (a list of anagrams). It's a more advanced application of the structure.
4.  **Combining with Other Structures (Hash Set, Sorted Map):** Finally, practice problems where a hash table works in tandem with another structure, like using a set for deduplication within a map's values, or a heap for top-K problems.

## Recommended Practice Order

Solve these problems in sequence to build competence:

1.  **Two Sum (#1):** The absolute classic. Master the one-pass hash map solution.
2.  **First Unique Character in a String (#387):** Perfect for practicing the two-pass frequency count pattern.
3.  **Group Anagrams (#49):** Excellent practice for using a hash map's key as a "signature" to group items.
4.  **Top K Frequent Elements (#347):** Combines frequency counting with another structure (a heap or bucket sort), a common Zomato pattern.
5.  **Longest Substring Without Repeating Characters (#3):** A more challenging problem that uses a hash map (or set) for the sliding window technique, highly relevant for session/stream processing.

This progression takes you from the simplest lookup to a more complex state-tracking problem, covering the exact patterns Zomato uses. Remember, their goal is to see if you can translate a real-world data matching problem into efficient code. Show them you can.

[Practice Hash Table at Zomato](/company/zomato/hash-table)
