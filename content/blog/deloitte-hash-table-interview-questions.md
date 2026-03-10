---
title: "Hash Table Questions at Deloitte: What to Expect"
description: "Prepare for Hash Table interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-03-17"
category: "dsa-patterns"
tags: ["deloitte", "hash-table", "interview prep"]
---

When you're preparing for Deloitte's technical interviews, you'll notice something interesting in their question bank: **8 out of 38 problems are Hash Table problems**. That's over 20% of their catalog, making it a significant, but not dominant, focus area. Unlike companies like Google or Meta where Hash Table is a fundamental building block for nearly every data structure question, Deloitte's use is more targeted. They treat the hash table as a practical tool for solving specific, often business-logic-adjacent problems, rather than an abstract computer science concept. In real interviews, you're likely to encounter at least one problem where a hash table (or dictionary/map) is the optimal, or at least a highly viable, solution. The key is recognizing when to reach for it.

## Specific Patterns Deloitte Favors

Deloitte's Hash Table problems tend to cluster around a few practical patterns. You won't find many esoteric variations here. The focus is on **frequency counting** and **relationship mapping** to solve problems that feel like data validation, deduplication, or lookup optimization.

1.  **Frequency Counting for Validation/Comparison:** This is the most common pattern. You're given two collections (strings, arrays, lists) and asked to determine if they are anagrams, if one is a subset of another, or if they contain the same elements. The hash table acts as a counter.
    - **Example:** **Valid Anagram (LeetCode #242)** is a quintessential example. Deloitte might frame it as checking if two customer ID strings are permutations of each other.
2.  **Index Mapping for Fast Lookup:** The classic "Two Sum" pattern. You need to find two elements that satisfy a condition (usually summing to a target). The hash table stores `element -> index` as you iterate, allowing for O(1) lookups for the complement.
    - **Example:** **Two Sum (LeetCode #1)**. A Deloitte version might involve finding two transaction amounts that net to zero.
3.  **Deduplication and Uniqueness Tracking:** Problems where you need to find the first non-repeating character, or identify a duplicate in a stream of data. A hash table (or sometimes a hash set) tracks what you've seen.
    - **Example:** **First Unique Character in a String (LeetCode #387).**

Notice what's _not_ heavily featured: complex graph adjacency lists using hash tables of hash sets, or advanced data structures like LRU caches (though understanding the principle is good). Deloitte's problems are more about applying the hash table cleanly to a clear business logic problem.

## How to Prepare

Master the three patterns above. Let's look at the **Frequency Counting** pattern, which is the workhorse. The mental model is: _"To compare two collections, transform each into a frequency map and compare the maps."_

<div class="code-group">

```python
def is_anagram(s: str, t: str) -> bool:
    """
    LeetCode #242: Valid Anagram.
    Time: O(n) - We iterate through both strings of length n.
    Space: O(1) - The counter holds at most 26 keys (for lowercase English letters),
           so it's constant space. For Unicode, it would be O(k) where k is the
           size of the character set.
    """
    if len(s) != len(t):
        return False

    # Use a dictionary to count character frequencies
    char_count = {}

    # Increment counts for string `s`
    for ch in s:
        char_count[ch] = char_count.get(ch, 0) + 1

    # Decrement counts for string `t`
    for ch in t:
        # If character not in counter or count goes negative, not an anagram
        if ch not in char_count:
            return False
        char_count[ch] -= 1
        if char_count[ch] == 0:
            del char_count[ch]  # Clean up for final equality check

    # If counter is empty, all counts matched
    return len(char_count) == 0

# Alternatively, using collections.Counter (know this for Python interviews)
from collections import Counter
def is_anagram_pythonic(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
```

```javascript
/**
 * LeetCode #242: Valid Anagram.
 * Time: O(n) - We iterate through both strings of length n.
 * Space: O(1) - The counter object holds at most 26 keys.
 */
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const charCount = {};

  // Build frequency map for `s`
  for (const ch of s) {
    charCount[ch] = (charCount[ch] || 0) + 1;
  }

  // Deconstruct using `t`
  for (const ch of t) {
    if (!charCount[ch]) return false; // Handles undefined and zero counts
    charCount[ch]--;
  }

  // In this implementation, we rely on the false check above.
  // All counts should be zero if we get here.
  return true;
}
```

```java
// LeetCode #242: Valid Anagram.
// Time: O(n) | Space: O(1) - The array is fixed size 26.
public class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        int[] charCount = new int[26]; // For lowercase English letters

        for (int i = 0; i < s.length(); i++) {
            charCount[s.charAt(i) - 'a']++;
            charCount[t.charAt(i) - 'a']--;
        }

        // If all counts are zero, strings are anagrams
        for (int count : charCount) {
            if (count != 0) return false;
        }
        return true;
    }
}
```

</div>

The **Index Mapping** pattern is equally crucial. The mental model: _"As I iterate, I ask: 'Have I already seen the number that would complete the solution?' My hash map remembers what I've seen and where."_

<div class="code-group">

```python
def two_sum(nums: List[int], target: int) -> List[int]:
    """
    LeetCode #1: Two Sum.
    Time: O(n) - Single pass through the list.
    Space: O(n) - In the worst case, we store n-1 complements in the map.
    """
    seen = {}  # Maps value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i  # Store current number *after* the check to avoid using same element
    return []  # Problem guarantees a solution, but return empty per convention
```

```javascript
/**
 * LeetCode #1: Two Sum.
 * Time: O(n) | Space: O(n)
 */
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
// LeetCode #1: Two Sum.
// Time: O(n) | Space: O(n)
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {}; // or throw an exception
    }
}
```

</div>

## How Deloitte Tests Hash Table vs Other Companies

At FAANG companies, a hash table is often a component within a more complex problem (e.g., implementing a graph, designing a system like TinyURL). The difficulty is in the integration and scale. At Deloitte, the **hash table _is_ the solution**. The challenge is in the problem framing and edge-case handling.

What's unique is the **context**. A Deloitte problem might be wrapped in a scenario about "client records," "transaction IDs," or "survey response validation." The core algorithm remains `Two Sum` or `Valid Anagram`, but you need to parse the input from the narrative. The difficulty is typically **LeetCode Easy to Medium**, with a strong emphasis on writing clean, readable, and robust code that handles null inputs, empty arrays, and character encoding assumptions. They care about the _correct application of a standard tool_ more than about inventing a novel algorithm.

## Study Order

Tackle these sub-topics in this logical progression:

1.  **Basic Operations & Syntax:** Get fluent in declaring, adding, accessing, and iterating through hash maps/sets in your chosen language. This is non-negotiable muscle memory.
2.  **The Frequency Counter Pattern:** Start here because it's the most intuitive use case. It directly answers the question "how many of each item do I have?" Practice building and comparing counters.
3.  **The Complement/Index Map Pattern (Two Sum):** This introduces the clever "look-back" logic. It's a small step up in conceptual understanding from simple counting.
4.  **Hash Set for Uniqueness:** Understand when a set (just keys, no values) is the right tool for deduplication or membership testing.
5.  **Slight Variations:** Combine patterns, like using a counter in a sliding window problem (e.g., **Longest Substring Without Repeating Characters (#3)**), which is likely the upper bound of complexity you'd see.

This order works because each step uses the core hash table mechanics but layers on a new problem-solving pattern. You solidify the basics before learning how to use the structure more strategically.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept.

1.  **First Unique Character in a String (LeetCode #387)** - Straightforward frequency counting and lookup.
2.  **Valid Anagram (LeetCode #242)** - The classic frequency comparison. Master the two-pass method shown above.
3.  **Two Sum (LeetCode #1)** - The foundational index mapping problem. Write it from memory.
4.  **Intersection of Two Arrays II (LeetCode #350)** - Applies frequency counting to two collections with a shared result.
5.  **Group Anagrams (LeetCode #49)** - A medium-difficulty problem that combines frequency counting (via a tuple key) with hash map grouping. This is a great "capstone" problem for Deloitte prep.
6.  **Longest Substring Without Repeating Characters (LeetCode #3)** - This is a stretch problem. It uses a hash map within a sliding window. If you can comfortably discuss an approach for this, you are more than prepared for Deloitte's hash table questions.

Remember, at Deloitte, clarity and correctness trump cleverness. Use the hash table as the powerful, simple tool it is. Explain your choice of data structure, walk through your logic, and handle the edge cases. That's what will impress your interviewer.

[Practice Hash Table at Deloitte](/company/deloitte/hash-table)
