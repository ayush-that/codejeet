---
title: "Hash Table Questions at Infosys: What to Expect"
description: "Prepare for Hash Table interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-04"
category: "dsa-patterns"
tags: ["infosys", "hash-table", "interview prep"]
---

## Why Hash Tables Matter at Infosys

Infosys, as a global consulting and IT services firm, conducts thousands of technical interviews annually for roles ranging from systems engineers to senior developers. Their interview process is known for being structured and focused on foundational computer science concepts. With 27 out of 158 total tagged questions being Hash Table problems, that's roughly 17% of their problem bank—a significant portion. This isn't an accident. Hash tables are a core focus area because they test a candidate's grasp of fundamental data structures, time-space tradeoffs, and practical problem-solving skills applicable to real-world software development, such as caching, indexing, and data deduplication—common tasks in the enterprise systems Infosys builds and maintains.

In real interviews, you can expect at least one problem that heavily utilizes a hash table (or hash map/dictionary) as the primary data structure. The questions are rarely just "implement a hash table." Instead, they are applied problems where recognizing that a hash table provides an optimal solution is the key insight. The difficulty tends to be in the easy-to-medium range on platforms like LeetCode, emphasizing correctness, clean code, and efficiency over complex algorithmic gymnastics.

## Specific Patterns Infosys Favors

Infosys's hash table questions lean heavily toward **frequency counting** and **complement searching**. These are the workhorse patterns for array and string manipulation problems. You won't often see complex graph traversals or dynamic programming hidden behind a hash table here. The focus is on direct, practical applications.

1.  **Frequency Counting & Lookup:** This is the most common pattern. The problem gives you a collection (array, string) and asks you to find duplicates, unique elements, majority elements, or character counts. The hash table acts as a frequency map.
    - **Example:** **First Unique Character in a String (#387)**. You need to count each character's frequency first, then find the first one with a count of 1.
    - **Example:** **Single Number (#136)**. While the bitwise XOR solution is optimal, a hash table solution (tracking seen numbers) is a perfectly acceptable first approach to discuss.

2.  **Complement Searching (Two-Sum Variants):** This is arguably the single most important hash table pattern for Infosys. Given a target and a list, you use the hash table to store elements you've seen and instantly check if their complement (target - current) exists.
    - **Example:** **Two Sum (#1)** is the classic. Infosys often uses variations that involve pairs, sums, or differences.
    - **Example:** Problems like checking if two arrays are disjoint or finding a pair with a given sum in an array are direct applications.

3.  **Mapping for State or Grouping:** Using a hash table to map keys to values or to group related items (like anagrams).
    - **Example:** **Group Anagrams (#49)**. The key insight is to create a canonical representation (e.g., sorted string or character count tuple) for each word and use that as the hash key to group them.
    - **Example:** **Isomorphic Strings (#205)**. This requires two hash maps to track the character mapping bidirectionally.

<div class="code-group">

```python
# Pattern: Complement Searching (Two-Sum)
# Problem: Given an array and a target, return indices of the two numbers that add to target.
# Time: O(n) | Space: O(n)
def two_sum(nums, target):
    seen = {}  # Hash map: value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found

# Example usage:
# print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
```

```javascript
// Pattern: Complement Searching (Two-Sum)
// Time: O(n) | Space: O(n)
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

// Example usage:
// console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]
```

```java
// Pattern: Complement Searching (Two-Sum)
// Time: O(n) | Space: O(n)
import java.util.HashMap;

public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> seen = new HashMap<>(); // Hash map: value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{}; // No solution found
}

// Example usage:
// twoSum(new int[]{2, 7, 11, 15}, 9) // returns [0, 1]
```

</div>

## How to Prepare

Your study should be pattern-driven, not problem-driven. For each pattern above, internalize the template. When you see a new problem, ask: "Can I solve this by counting frequencies?" or "Is this a search for a complement/pair?"

1.  **Master the Basic Operations:** Be fluent in the core API for your language's hash table (`dict` in Python, `Map`/`Object` in JavaScript, `HashMap` in Java). Know how to insert, check for key existence, retrieve values, and iterate.
2.  **Default Values are Your Friend:** Many frequency problems are simplified by using a default value (e.g., `collections.defaultdict(int)` in Python, `map.get(key, 0)` in Java/JS). This avoids verbose `if` checks.
3.  **Consider Space Trade-offs:** Be ready to discuss when a hash table is necessary versus when a brute-force or two-pointer approach might work. For Infosys, clarity and a working solution often trump micro-optimizations, but you should know the O(n) space cost of your hash table.

<div class="code-group">

```python
# Pattern: Frequency Counting
# Problem: Find the first non-repeating character in a string.
# Time: O(n) | Space: O(1) or O(k) where k is the size of the character set (e.g., 26 for lowercase)
def first_uniq_char(s: str) -> int:
    from collections import defaultdict
    freq = defaultdict(int)
    # First pass: build frequency map
    for ch in s:
        freq[ch] += 1
    # Second pass: find first char with freq == 1
    for i, ch in enumerate(s):
        if freq[ch] == 1:
            return i
    return -1

# Example usage:
# print(first_uniq_char("leetcode"))  # Output: 0 ('l')
# print(first_uniq_char("loveleetcode"))  # Output: 2 ('v')
```

```javascript
// Pattern: Frequency Counting
// Time: O(n) | Space: O(1) / O(k)
function firstUniqChar(s) {
  const freq = new Map();
  // First pass: build frequency map
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  // Second pass: find first char with freq == 1
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }
  return -1;
}

// Example usage:
// console.log(firstUniqChar("leetcode")); // 0
// console.log(firstUniqChar("loveleetcode")); // 2
```

```java
// Pattern: Frequency Counting
// Time: O(n) | Space: O(1) / O(k)
import java.util.HashMap;

public int firstUniqChar(String s) {
    HashMap<Character, Integer> freq = new HashMap<>();
    // First pass: build frequency map
    for (int i = 0; i < s.length(); i++) {
        char ch = s.charAt(i);
        freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    }
    // Second pass: find first char with freq == 1
    for (int i = 0; i < s.length(); i++) {
        if (freq.get(s.charAt(i)) == 1) {
            return i;
        }
    }
    return -1;
}

// Example usage:
// firstUniqChar("leetcode") // returns 0
```

</div>

## How Infosys Tests Hash Table vs Other Companies

Compared to FAANG companies, Infosys's hash table questions are less about layering complex concepts and more about **direct application and clean implementation**. At Google or Meta, a hash table might be one component in a larger system design question or a tricky optimization within a graph problem (e.g., Dijkstra's with a custom priority queue key). At Infosys, the hash table is usually the star of the show.

The difficulty is calibrated differently. While a company like Amazon might ask **LRU Cache (#146)**, which requires combining a hash table with a doubly linked list, Infosys is more likely to ask a problem like **Contains Duplicate (#217)** or a straightforward **Two Sum** variant. The goal is to assess if you understand the fundamental tool, not if you can engineer a complex one from scratch. The "unique" aspect is the emphasis on problems relevant to data processing and validation—common in business applications.

## Study Order

Follow this progression to build your knowledge logically:

1.  **Basic Operations & Syntax:** Get comfortable creating, adding to, and reading from a hash table in your chosen language. Solve trivial problems like storing and retrieving names and phone numbers.
2.  **Frequency Counting:** This is the most intuitive use case. Practice building frequency maps from arrays and strings. This forms the basis for many other patterns.
3.  **Complement Searching (Two-Sum):** Learn to transform a two-loop O(n²) search into a single-pass O(n) solution using a hash table for instant lookups. This is a critical optimization pattern.
4.  **Mapping for Grouping (Anagrams):** Understand how to create a "key" from your data to use as a hash. This teaches you to think about canonical forms and equivalence relations.
5.  **Two-Hash-Table Problems:** Tackle problems like **Isomorphic Strings** that require maintaining two synchronized maps to check bidirectional relationships.
6.  **(Optional) Design Simple Data Structures:** If you have time, explore how hash tables are used as a component in designs like a **Hash Set** or a very basic cache. This deepens your understanding.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept.

1.  **Contains Duplicate (#217)** - Pure frequency counting. The simplest start.
2.  **Two Sum (#1)** - The canonical complement search problem. Master this.
3.  **First Unique Character in a String (#387)** - Frequency counting with a second pass for lookup.
4.  **Valid Anagram (#242)** - Compare frequency maps of two strings.
5.  **Intersection of Two Arrays II (#350)** - Frequency counting across two collections.
6.  **Group Anagrams (#49)** - Using a generated key (sorted string) for grouping.
7.  **Isomorphic Strings (#205)** - Managing two hash maps for a bidirectional mapping.
8.  **Word Pattern (#290)** - Very similar to Isomorphic Strings, applying the pattern to words.
9.  **Ransom Note (#383)** - A practical frequency counting application (can you construct one string from another?).

This sequence takes you from the absolute basics to the more nuanced applications you're likely to see. Remember, for Infosys, focus on writing clear, correct, and efficient code that demonstrates you know _why_ the hash table is the right tool for the job.

[Practice Hash Table at Infosys](/company/infosys/hash-table)
