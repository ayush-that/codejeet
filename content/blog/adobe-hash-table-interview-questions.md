---
title: "Hash Table Questions at Adobe: What to Expect"
description: "Prepare for Hash Table interview questions at Adobe — patterns, difficulty breakdown, and study tips."
date: "2027-08-12"
category: "dsa-patterns"
tags: ["adobe", "hash-table", "interview prep"]
---

If you're preparing for a software engineering interview at Adobe, you'll quickly notice something in their question bank: hash tables are everywhere. With 48 out of 227 tagged problems on LeetCode, that's over 21% of their catalog. This isn't a coincidence. Adobe's products—from Photoshop and Acrobat to Experience Manager—are deeply concerned with data organization, caching, asset management, and real-time lookups. A hash table isn't just an academic data structure here; it's the practical engine for features like document object indexing, user session management, and rapid filter/effect application. In real interviews, you are almost guaranteed to encounter at least one problem where the optimal solution hinges on a hash map. The key is not just knowing _that_ you need one, but knowing _which flavor_ of hash table logic Adobe's interviewers tend to favor.

## Specific Patterns Adobe Favors

Adobe's hash table questions rarely test the structure in isolation. Instead, they are almost always a component in a solution to a problem about **sequences, frequency, or state tracking**. You can broadly categorize their favorites into three patterns:

1.  **The Frequency Map for Array/String Analysis:** This is the most common pattern. The problem presents an array or string, and the core challenge is to make a decision based on the counts of elements. Adobe loves variations that go beyond simple "find the most frequent" into constraints like parity, uniqueness, or ordered relationships.
    - **Example Problems:** _Sort Characters By Frequency (#451)_, _Find All Anagrams in a String (#438)_, _K-diff Pairs in an Array (#532)_.

2.  **The Prefix Sum Map:** When a problem asks for a subarray or substring meeting a sum or count condition (often "find a subarray summing to k" or "find the longest subarray with equal 1s and 0s"), the naive solution is O(n²). The optimal O(n) solution uses a hash map to store previously seen prefix sums (or counts) and their indices. This is a classic interview "aha!" moment.
    - **Example Problems:** _Subarray Sum Equals K (#560)_, _Contiguous Array (#525)_.

3.  **The Mapping for Two-Pass or Two-Structure Logic:** Many Adobe problems use a hash map as one of two coordinated data structures. The classic example is pairing a hash map (for O(1) lookup) with a doubly-linked list to build an **LRU Cache (#146)**. Another common pattern is using a hash set to track "seen" nodes in a linked list problem like _Intersection of Two Linked Lists (#160)_.

The through-line here is **practical optimization**. Adobe interviewers are assessing if you can see the inefficient nested loop in a real-world data processing task and replace it with an O(1) lookup to collapse the time complexity.

## How to Prepare

Your study should move from recognizing the basic pattern to implementing its nuanced variations. Let's take the **Frequency Map** pattern and see how it evolves.

The most basic use is counting. But the interview twist comes when you need to use the map for immediate comparison or state updates. Consider the classic _Valid Anagram (#242)_ problem. The naive solution sorts both strings (O(n log n)). The hash map solution is more efficient and demonstrates better algorithmic thinking.

<div class="code-group">

```python
def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    # Use a dictionary to count character frequency
    char_count = {}

    # Increment counts for string s
    for ch in s:
        char_count[ch] = char_count.get(ch, 0) + 1

    # Decrement counts for string t
    for ch in t:
        # If char doesn't exist or count goes negative, not an anagram
        if ch not in char_count:
            return False
        char_count[ch] -= 1
        if char_count[ch] == 0:
            del char_count[ch]

    # If map is empty, all counts matched
    return len(char_count) == 0
# Time: O(n) | Space: O(1) or O(k) where k is the size of the charset (max 26 for lowercase English)
```

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const charCount = new Map();

  for (const ch of s) {
    charCount.set(ch, (charCount.get(ch) || 0) + 1);
  }

  for (const ch of t) {
    if (!charCount.has(ch)) return false;
    charCount.set(ch, charCount.get(ch) - 1);
    if (charCount.get(ch) === 0) {
      charCount.delete(ch);
    }
  }

  return charCount.size === 0;
}
// Time: O(n) | Space: O(1) or O(k)
```

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    Map<Character, Integer> charCount = new HashMap<>();

    for (char ch : s.toCharArray()) {
        charCount.put(ch, charCount.getOrDefault(ch, 0) + 1);
    }

    for (char ch : t.toCharArray()) {
        if (!charCount.containsKey(ch)) return false;
        charCount.put(ch, charCount.get(ch) - 1);
        if (charCount.get(ch) == 0) {
            charCount.remove(ch);
        }
    }

    return charCount.isEmpty();
}
// Time: O(n) | Space: O(1) or O(k)
```

</div>

Now, let's level up to the **Prefix Sum Map** pattern, which is less intuitive but a powerful tool for subarray problems. The insight is that if you're looking for a subarray with sum `k`, and you know the cumulative sum up to index `i` is `sum_i`, then you need to find a previous index `j` where the cumulative sum was `sum_i - k`. A hash map lets you store these past cumulative sums and find them in O(1) time.

<div class="code-group">

```python
def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency of occurrence
    sum_map = {0: 1}  # Crucial: a prefix sum of 0 has occurred once (before the start)

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists in the map, we found subarrays ending here
        count += sum_map.get(prefix_sum - k, 0)
        # Record the current prefix sum in the map
        sum_map[prefix_sum] = sum_map.get(prefix_sum, 0) + 1

    return count
# Time: O(n) | Space: O(n) for the hash map in worst case
```

```javascript
function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const sumMap = new Map();
  sumMap.set(0, 1); // Base case

  for (const num of nums) {
    prefixSum += num;
    if (sumMap.has(prefixSum - k)) {
      count += sumMap.get(prefixSum - k);
    }
    sumMap.set(prefixSum, (sumMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
// Time: O(n) | Space: O(n)
```

```java
public int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> sumMap = new HashMap<>();
    sumMap.put(0, 1); // Base case

    for (int num : nums) {
        prefixSum += num;
        count += sumMap.getOrDefault(prefixSum - k, 0);
        sumMap.put(prefixSum, sumMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
// Time: O(n) | Space: O(n)
```

</div>

## How Adobe Tests Hash Table vs Other Companies

Compared to other tech giants, Adobe's hash table questions tend to be **applied and mid-difficulty**. They contrast with:

- **Google/Meta:** Often embed hash tables within complex graph or system design problems (e.g., designing a social graph cache). The hash table is a given; the challenge is the architecture around it.
- **Amazon:** Heavily favor hash tables for straightforward, business-logic-oriented problems (e.g., grouping orders, tracking inventory). The implementation is usually direct.
- **Adobe:** Sits in the middle. They favor problems where the hash table is the _key insight_ to optimize a clear, tangible operation on data—like finding anagrams in a document stream (#438) or caching image edits (#146). The difficulty often comes from combining the map with another simple pointer or sliding window, testing clean, bug-free implementation under pressure.

## Study Order

Tackle hash table concepts in this logical progression to build a solid foundation before tackling Adobe's favorite hybrids:

1.  **Fundamental Operations & Syntax:** Be able to instantiate, add, remove, and lookup in your chosen language without hesitation. Know the iteration syntax.
2.  **Basic Frequency Counting:** Solve problems where building the map _is_ the primary task (e.g., _First Unique Character in a String (#387)_).
3.  **The "Two-Pass" Pattern:** Use a map in a first pass to store data, then use it in a second pass to make decisions. This builds comfort with the data flow.
4.  **The "One-Pass" Pattern:** Learn to build the map and make decisions in a single traversal, often checking for a condition before inserting the current element (as seen in _Two Sum (#1)_). This is more efficient and common.
5.  **Prefix Sum Map:** This is a specialized but critical pattern. Master it separately, as the logic is distinct from frequency counting.
6.  **Hybrid Data Structures:** Finally, practice combining a hash map with another structure—like a list for LRU Cache (#146) or a heap for Top K Frequent Elements (#347). This is where many Adobe questions land.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a slight twist on the hash table concept that builds towards Adobe's style.

1.  **Two Sum (#1)** - The canonical one-pass map problem.
2.  **Contains Duplicate (#217)** / **Valid Anagram (#242)** - Basic frequency map applications.
3.  **Group Anagrams (#49)** - Uses a map with a sorted string or tuple as a key. A classic Adobe-relevant pattern for categorization.
4.  **Longest Substring Without Repeating Characters (#3)** - Introduces the map with a sliding window. Extremely common.
5.  **Find All Anagrams in a String (#438)** - A more advanced sliding window with a frequency map. Pure Adobe.
6.  **Subarray Sum Equals K (#560)** - Master the prefix sum map pattern.
7.  **LRU Cache (#146)** - The definitive hybrid structure problem. You must know this.
8.  **Top K Frequent Elements (#347)** - Combines a frequency map with a heap (or bucket sort). Tests your ability to choose the right secondary structure.

By following this progression, you won't just memorize solutions; you'll internalize the patterns. When your Adobe interviewer presents a problem about tracking user sessions or finding duplicate assets in a pipeline, you'll see the underlying hash table skeleton and know exactly how to articulate and implement the optimal solution.

[Practice Hash Table at Adobe](/company/adobe/hash-table)
