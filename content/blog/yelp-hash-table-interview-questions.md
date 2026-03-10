---
title: "Hash Table Questions at Yelp: What to Expect"
description: "Prepare for Hash Table interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-01"
category: "dsa-patterns"
tags: ["yelp", "hash-table", "interview prep"]
---

## Hash Table Questions at Yelp: What to Expect

If you're preparing for a Yelp interview, you need to know this: 12 of their 27 tagged LeetCode problems involve hash tables. That's 44% — nearly half of their technical question bank. This isn't a coincidence. Yelp's entire business revolves around mapping real-world data: users to reviews, businesses to categories, locations to ratings, search terms to results. The hash table (or dictionary/map) is the fundamental data structure that makes this possible. In interviews, they're not just testing whether you know what a hash table is — they're testing whether you can recognize when a hash table is the optimal tool to organize data and reduce time complexity.

At Yelp, hash table questions rarely appear in isolation as "implement a hash table." Instead, they're embedded within problems that feel like real platform features: finding duplicate reviews, grouping businesses by category, counting user check-ins, or implementing autocomplete. Interviewers want to see if you reach for the hash table instinctively when the problem involves **mapping, counting, deduplication, or caching**.

## Specific Patterns Yelp Favors

Yelp's hash table problems cluster around three practical patterns:

1. **Frequency Counting for Deduplication/Validation**  
   Problems where you need to track occurrences to find duplicates, validate constraints, or identify anomalies. This appears in review systems (detecting spammy users), data validation (ensuring unique usernames), or analytics (finding most frequent search terms).

2. **Mapping for Grouping and Aggregation**  
   Classic Yelp use case: given a list of businesses with categories, group them by category. Or given user check-ins at locations, find users who visited the same places. The hash table acts as an index — `category -> list_of_businesses` or `location -> list_of_users`.

3. **Complement Lookup for Two-Sum Variants**  
   While not as common as at finance-focused companies, Yelp still asks problems where you need to find pairs that satisfy a condition — often framed as "find two users with similar preferences" or "find business pairs under distance X." The hash table stores seen elements so you can check if their complement exists in O(1) time.

A telling example is **LeetCode 49: Group Anagrams**. Yelp has an actual problem almost identical to this: given business names or review snippets, group similar items. The core insight is using a normalized key (like sorted string or character count) as the hash key.

<div class="code-group">

```python
# Time: O(n * k log k) where n = number of strings, k = max string length
# Space: O(n * k) for storing all strings
def group_anagrams(strs):
    """
    Groups strings that are anagrams of each other.
    The key insight: use sorted string as hash key.
    """
    groups = {}
    for s in strs:
        # Create canonical key by sorting characters
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())
```

```javascript
// Time: O(n * k log k) | Space: O(n * k)
function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(s);
  }
  return Array.from(groups.values());
}
```

```java
// Time: O(n * k log k) | Space: O(n * k)
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        groups.putIfAbsent(key, new ArrayList<>());
        groups.get(key).add(s);
    }
    return new ArrayList<>(groups.values());
}
```

</div>

## How to Prepare

Don't just memorize hash table syntax. Practice the thought process: "What would make a good key here?" For grouping problems, the key is often a transformed version of the data. For complement lookup, the key is the value you'll need later.

Here's a pattern that appears in Yelp's **LeetCode 1: Two Sum** variant problems: finding pairs with a specific property. The hash table stores what you've seen so you can answer "have I seen the counterpart?" instantly.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def two_sum(nums, target):
    """
    Returns indices of two numbers that add to target.
    Classic complement lookup pattern.
    """
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution
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
  return []; // No solution
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();  // value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};  // No solution
}
```

</div>

## How Yelp Tests Hash Table vs Other Companies

At FAANG companies, hash table problems often serve as stepping stones to more complex system design or involve multiple data structures. At Yelp, they tend to be more applied and self-contained. The difficulty is usually medium, not hard. You're unlikely to get a hash table problem that requires also implementing a self-balancing BST.

What's unique: Yelp problems often have a **real-world smell**. Instead of "find two numbers that sum to target," it might be "find two users who reviewed the same three businesses" or "detect if a user posted the same review to multiple places." The underlying pattern is the same, but you need to translate the business requirement into the appropriate hash table operations.

Another distinction: Yelp sometimes combines hash tables with **sorting** or **sliding windows**. For example, "find businesses with more than 5 reviews in the past week" could involve a hash table to count reviews per business, then filter by date range.

## Study Order

1. **Basic Operations and Syntax** — Ensure you can instantiate, add, remove, and lookup in your language of choice without hesitation.
2. **Frequency Counting** — Start with simple counting problems (LeetCode 387: First Unique Character) to build intuition for tracking occurrences.
3. **Complement Lookup** — Master Two Sum and its variants. This pattern reappears constantly.
4. **Grouping with Custom Keys** — Practice creating hash keys from transformed data (sorted strings, tuples of properties, encoded representations).
5. **Combined Patterns** — Problems where hash tables work with other techniques (sorting, sliding windows, two pointers).
6. **Optimization** — Recognizing when to use a hash table to reduce time complexity from O(n²) to O(n).

This order works because each step builds on the previous. You can't solve grouping problems if you're uncomfortable with custom keys. You can't optimize nested loops with hash tables if you don't instinctively recognize complement lookup opportunities.

## Recommended Practice Order

Solve these in sequence:

1. **LeetCode 1: Two Sum** — The foundational complement lookup pattern.
2. **LeetCode 387: First Unique Character in a String** — Simple frequency counting.
3. **LeetCode 49: Group Anagrams** — Grouping with transformed keys.
4. **LeetCode 347: Top K Frequent Elements** — Counting plus sorting/priority queue.
5. **LeetCode 3: Longest Substring Without Repeating Characters** — Hash table with sliding window.
6. **LeetCode 454: 4Sum II** — Advanced complement lookup (though less common at Yelp, good for pattern reinforcement).

After these, search LeetCode for Yelp's tagged hash table problems and work through them chronologically. Pay special attention to problems with "group," "duplicate," "frequency," or "pair" in the description — these are Yelp's sweet spots.

Remember: at Yelp, the hash table isn't just an academic data structure — it's how they organize the world. Show them you think the same way.

[Practice Hash Table at Yelp](/company/yelp/hash-table)
