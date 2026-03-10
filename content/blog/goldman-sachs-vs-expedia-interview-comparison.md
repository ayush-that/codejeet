---
title: "Goldman Sachs vs Expedia: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Expedia — difficulty levels, topic focus, and preparation strategy."
date: "2030-12-10"
category: "tips"
tags: ["goldman-sachs", "expedia", "comparison"]
---

# Goldman Sachs vs Expedia: A Strategic Interview Question Comparison

If you're interviewing at both Goldman Sachs and Expedia, you're looking at two very different beasts in the tech interview landscape. One is a financial giant with a massive tech footprint, the other a travel tech leader with a more focused engineering culture. The most important thing to know upfront: preparing for Goldman Sachs will cover about 80% of what you need for Expedia, but not vice versa. Goldman's question bank is nearly 5x larger and spans a wider difficulty range, making it the more comprehensive (and demanding) preparation target.

## Question Volume and Difficulty

Let's start with the raw numbers. Goldman Sachs has 270 questions in their tagged LeetCode collection (51 Easy, 171 Medium, 48 Hard). Expedia has just 54 questions (13 Easy, 35 Medium, 6 Hard). These numbers tell a clear story about interview intensity.

Goldman's distribution reveals their interview philosophy: they're testing for both breadth and depth. The heavy Medium weighting (63% of questions) suggests they expect candidates to solve non-trivial algorithmic problems under pressure. The 48 Hard questions (18% of their total) indicates they're willing to push strong candidates to their limits, particularly for senior roles or competitive teams. When I interviewed there, I encountered two Medium problems in 45 minutes, with the interviewer probing edge cases and optimization trade-offs.

Expedia's distribution is more typical of a tech company focused on practical engineering skills. With 65% Medium questions and only 11% Hard, they're testing for solid fundamentals rather than algorithmic brilliance. Their interview feels more like "can you solve real-world coding problems competently" rather than "can you derive optimal solutions to obscure DP problems." The smaller question bank also means you're more likely to encounter repeat questions or close variants.

## Topic Overlap

Both companies heavily test **Array**, **String**, and **Hash Table** problems. This isn't surprising—these are the bread and butter of coding interviews. However, the emphasis differs:

**Shared focus areas:**

- Array manipulation (sliding window, two pointers)
- String operations (palindromes, anagrams, parsing)
- Hash Table applications (frequency counting, lookups)

**Goldman-specific emphasis:**

- **Dynamic Programming** appears consistently in their Hard questions
- More graph problems (though not in their top tags)
- Mathematical/combinatorial problems

**Expedia-specific emphasis:**

- **Greedy algorithms** appear in their top tags
- More practical data structure implementation questions
- Tree traversal problems (though not in top tags)

The key insight: if you master arrays, strings, and hash tables, you'll handle most Expedia questions and a significant portion of Goldman's. But Goldman expects more.

## Preparation Priority Matrix

Here's how to allocate your study time efficiently:

**Tier 1: Maximum ROI (Study First)**

- Array manipulation (sliding window, two pointers)
- String operations
- Hash Table applications
  _Recommended problems: Two Sum (#1), Valid Parentheses (#20), Merge Intervals (#56)_

**Tier 2: Goldman-Specific Depth**

- Dynamic Programming (start with 1D, then 2D)
- Graph traversal (BFS/DFS)
- Advanced tree problems
  _Recommended problems: Coin Change (#322), Word Break (#139), Course Schedule (#207)_

**Tier 3: Expedia-Specific Nuances**

- Greedy algorithms
- Practical implementation questions
- System design fundamentals
  _Recommended problems: Meeting Rooms II (#253), Task Scheduler (#621), Design HashMap (#706)_

## Interview Format Differences

**Goldman Sachs** typically follows:

1. Phone screen (1-2 coding problems, 45-60 minutes)
2. Superday (4-5 back-to-back interviews, mix of coding and behavioral)
3. Coding rounds: 2 problems in 45 minutes is common
4. Heavy emphasis on optimization and edge cases
5. Some teams include system design even for mid-level roles

**Expedia** tends toward:

1. Initial technical screen (1-2 problems, often practical)
2. Virtual onsite (3-4 rounds, more balanced)
3. Coding rounds: Often 1 problem with follow-ups in 45 minutes
4. More discussion of trade-offs and real-world application
5. Behavioral questions tied to past projects

The biggest difference: Goldman moves faster with less discussion, while Expedia allows more conversation about approach. At Goldman, I was interrupted mid-solution to optimize; at Expedia, we discussed three different approaches before implementing.

## Specific Problem Recommendations

Here are 5 problems that provide excellent coverage for both companies:

1. **Longest Substring Without Repeating Characters (#3)**
   - Tests: Sliding window, hash tables
   - Why: Appears in both companies' lists, teaches optimal substring search patterns

<div class="code-group">

```python
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}
    left = max_length = 0

    for right, char in enumerate(s):
        # If char seen and within current window, move left pointer
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let left = 0,
    maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1;
    }
    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0, maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        charIndex.put(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

2. **Coin Change (#322)**
   - Tests: Dynamic programming, optimization
   - Why: Classic Goldman problem that teaches DP thinking

3. **Merge Intervals (#56)**
   - Tests: Array sorting, interval manipulation
   - Why: Practical problem that appears at both companies

4. **Valid Sudoku (#36)**
   - Tests: Matrix traversal, validation logic
   - Why: Goldman favorite that tests careful implementation

5. **Meeting Rooms II (#253)**
   - Tests: Greedy algorithms, heap usage
   - Why: Expedia-style practical scheduling problem

## Which to Prepare for First

**Prepare for Goldman Sachs first.** Here's why:

1. **Coverage**: Goldman's broader question set will prepare you for Expedia's narrower focus
2. **Difficulty**: Solving Medium-Hard problems for Goldman makes Expedia's Mediums feel manageable
3. **Timing**: Goldman's faster pace prepares you for time pressure anywhere
4. **Depth**: Goldman's DP and graph questions teach algorithmic thinking that benefits all interviews

Start with the shared topics (arrays, strings, hash tables), then dive into Goldman's DP requirements. About 2 weeks before your Expedia interview, shift to practicing their specific tagged problems and reviewing greedy algorithms. The transition will feel like going from marathon training to running a 5K.

Remember: Both companies ultimately want engineers who can think clearly and code effectively. The patterns you learn preparing for either will serve you throughout your career.

For more company-specific insights, check out our [Goldman Sachs interview guide](/company/goldman-sachs) and [Expedia interview guide](/company/expedia).
