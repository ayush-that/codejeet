---
title: "Uber vs JPMorgan: Interview Question Comparison"
description: "Compare coding interview questions at Uber and JPMorgan — difficulty levels, topic focus, and preparation strategy."
date: "2030-03-11"
category: "tips"
tags: ["uber", "jpmorgan", "comparison"]
---

# Uber vs JPMorgan: Interview Question Comparison

If you're interviewing at both Uber and JPMorgan Chase, you're looking at two fundamentally different interview experiences. One is a pure tech company that evaluates you like a FAANG, while the other is a financial institution with a tech interview that's more focused and practical. The key insight: preparing for Uber will cover about 90% of what you need for JPMorgan, but not vice versa. Let me explain why, and give you a strategic roadmap for tackling both.

## Question Volume and Difficulty: A Stark Contrast

Look at the numbers: Uber has 381 tagged questions on LeetCode (54 Easy, 224 Medium, 103 Hard), while JPMorgan has just 78 (25 Easy, 45 Medium, 8 Hard). This isn't just about quantity—it reveals their entire approach.

Uber's massive question bank means they have deep problem variety and can afford to ask challenging, novel questions. With 103 Hard problems, they're testing whether you can handle complex algorithmic thinking under pressure. The Medium-heavy distribution (224 problems) tells you they value solid fundamentals applied to non-trivial scenarios.

JPMorgan's smaller, more manageable set suggests a different philosophy. They're not trying to reinvent the wheel—they want to see if you can solve practical programming problems competently. The 8 Hard problems are outliers; their sweet spot is Medium difficulty. This makes sense: at a bank, you're more likely to be implementing business logic than optimizing graph algorithms.

**Implication:** If you only prep for JPMorgan, you'll be woefully underprepared for Uber. But if you prep thoroughly for Uber, JPMorgan's questions will feel familiar.

## Topic Overlap: The Core Four

Both companies heavily test:

- **Array** manipulation (Uber's bread and butter, JPMorgan's favorite)
- **String** operations (common in both domains)
- **Hash Table** usage (essential for optimization)
- **Dynamic Programming** (for Uber) and **Sorting** (for JPMorgan)

Here's the interesting divergence: Uber loves Dynamic Programming (it's their 4th most-tested topic), while JPMorgan prefers Sorting (their 4th). This isn't random—it reflects their problem domains.

Uber deals with optimization problems: shortest routes, maximum drivers, minimum wait times. These often map to DP. JPMorgan deals with data processing: transaction sorting, account matching, chronological ordering. Hence, sorting algorithms.

**Unique to Uber:** Graph algorithms (especially BFS/DFS for their mapping systems), Tree problems, and advanced DP patterns.
**Unique to JPMorgan:** More straightforward array/string manipulation with less emphasis on complex data structures.

## Preparation Priority Matrix

Here's how to allocate your study time efficiently:

**High ROI (Study First):**

- Array manipulation (sliding window, two pointers)
- Hash Table applications (memoization, frequency counting)
- String operations (palindromes, subsequences)
- _Recommended problems:_ Two Sum (#1), Valid Anagram (#242), Merge Intervals (#56)

**Uber-Specific Focus:**

- Dynamic Programming (knapsack, matrix, sequence patterns)
- Graph traversal (BFS/DFS, especially for grid problems)
- Tree algorithms (BST validation, path sums)
- _Recommended problems:_ Word Break (#139), Number of Islands (#200), Validate Binary Search Tree (#98)

**JPMorgan-Specific Focus:**

- Sorting algorithms and their applications
- Basic data structure implementation
- String parsing and validation
- _Recommended problems:_ Merge Sorted Array (#88), Valid Parentheses (#20), First Unique Character in a String (#387)

## Interview Format Differences

**Uber:**

- Typically 4-5 rounds including coding, system design, and behavioral
- Coding rounds: 45-60 minutes, often 2 problems (one Medium, one Medium-Hard)
- Heavy emphasis on optimization and edge cases
- System design is crucial (especially for senior roles)
- Virtual or on-site, but expect whiteboarding even in virtual sessions

**JPMorgan:**

- Usually 2-3 technical rounds plus behavioral
- Coding rounds: 30-45 minutes, often 1-2 Medium problems
- More conversational—they want to understand your thought process
- Less emphasis on system design (unless specifically a design role)
- Often includes practical problem-solving (e.g., "how would you design this banking feature?")

The behavioral weight differs too. Uber cares about "Uber values" and scaling mindset. JPMorgan cares about risk management, compliance awareness, and working in regulated environments.

## Specific Problem Recommendations for Both

These 5 problems give you maximum coverage:

1. **Group Anagrams (#49)** - Tests hash table usage and string manipulation, common at both companies.

<div class="code-group">

```python
# Time: O(n * k) where n is strs length, k is max string length
# Space: O(n * k) for the output
def groupAnagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)

    for s in strs:
        # Create frequency array for 26 lowercase letters
        count = [0] * 26
        for char in s:
            count[ord(char) - ord('a')] += 1
        # Use tuple as hashable key
        groups[tuple(count)].append(s)

    return list(groups.values())
```

```javascript
// Time: O(n * k) | Space: O(n * k)
function groupAnagrams(strs) {
  const groups = new Map();

  for (const s of strs) {
    const count = new Array(26).fill(0);
    for (const char of s) {
      count[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }
    const key = count.join("#");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }

  return Array.from(groups.values());
}
```

```java
// Time: O(n * k) | Space: O(n * k)
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();

    for (String s : strs) {
        char[] count = new char[26];
        for (char c : s.toCharArray()) {
            count[c - 'a']++;
        }
        String key = new String(count);
        groups.putIfAbsent(key, new ArrayList<>());
        groups.get(key).add(s);
    }

    return new ArrayList<>(groups.values());
}
```

</div>

2. **Longest Substring Without Repeating Characters (#3)** - Classic sliding window problem that appears in both question banks.

3. **Merge Intervals (#56)** - Uber uses this for time-based problems (driver availability), JPMorgan for financial periods.

4. **Best Time to Buy and Sell Stock (#121)** - Simple but tests array traversal. JPMorgan might ask the basic version, Uber might ask variations (#122, #123).

5. **Word Break (#139)** - Covers DP (Uber focus) and string manipulation (both companies).

## Which to Prepare for First?

**Prepare for Uber first, then adapt for JPMorgan.**

Here's why: Uber's interview is more comprehensive and difficult. If you can handle Uber's problems, JPMorgan's will feel manageable. The reverse isn't true—JPMorgan prep leaves gaps for Uber.

**Strategic timeline:**

1. Week 1-3: Core data structures (arrays, strings, hash tables) + Uber's favorite topics (DP, graphs)
2. Week 4: Practice Uber-style problems (Medium-Hard difficulty, optimization focus)
3. Week 5: Review sorting algorithms and do JPMorgan-specific problems (this should take 2-3 days max)
4. Week 6: Mock interviews for each company's format

Remember: Uber interviews are marathon sessions testing depth. JPMorgan interviews are sprints testing breadth of practical knowledge. Adjust your mental approach accordingly—Uber wants the optimal solution, JPMorgan wants a working solution with clear reasoning.

For more company-specific insights, check out our [Uber interview guide](/company/uber) and [JPMorgan interview guide](/company/jpmorgan).
