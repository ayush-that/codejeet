---
title: "Oracle vs Adobe: Interview Question Comparison"
description: "Compare coding interview questions at Oracle and Adobe — difficulty levels, topic focus, and preparation strategy."
date: "2030-07-13"
category: "tips"
tags: ["oracle", "adobe", "comparison"]
---

# Oracle vs Adobe: Interview Question Comparison

If you're preparing for interviews at both Oracle and Adobe, you're looking at two distinct tech giants with different engineering cultures and interview styles. While both test core data structures and algorithms, their question banks reveal meaningful differences in what they value and how they assess candidates. The key insight isn't just that Oracle has more questions (340 vs 227) — it's that Oracle leans harder into dynamic programming and complex problem-solving, while Adobe emphasizes cleaner, more practical coding with a focus on array/string manipulation and two-pointer techniques. Preparing for both simultaneously is efficient because of significant overlap, but you'll need to allocate extra time for Oracle's DP-heavy expectations.

## Question Volume and Difficulty

Let's break down the numbers: Oracle's 340 questions (70 Easy, 205 Medium, 65 Hard) versus Adobe's 227 questions (68 Easy, 129 Medium, 30 Hard). The raw volume difference is significant — Oracle's question bank is 50% larger. More telling is the difficulty distribution: Oracle has nearly twice as many Hard problems (65 vs 30) and a higher proportion of Mediums (60% vs 57%). This suggests Oracle interviews are more likely to push you into complex optimization territory, especially with dynamic programming.

Adobe's distribution is more typical of product-focused companies: a solid emphasis on Mediums (which form the core of most interviews) with fewer extreme challenges. Don't mistake this for "easier" — Adobe is known for expecting clean, production-ready code even on Medium problems, with attention to edge cases and API design. The lower Hard count means you're less likely to encounter truly esoteric problems, but you need to execute flawlessly on the fundamentals.

## Topic Overlap

Both companies heavily test **Array**, **String**, and **Hash Table** problems. This is your foundation — if you're strong here, you'll handle the majority of questions at both companies. The overlap represents efficient preparation: time spent mastering sliding window, prefix sums, and hash map patterns pays dividends for both interviews.

Where they diverge: **Dynamic Programming** appears in Oracle's top topics but not Adobe's. Oracle loves DP — it's woven throughout their Medium and Hard problems, testing both pattern recognition (knapsack, LCS) and state transition design. Meanwhile, **Two Pointers** is uniquely highlighted for Adobe. This reflects Adobe's focus on in-place operations, sorted array manipulations, and efficient traversal — think problems like merging sorted arrays or finding palindromes.

Other notable differences: Oracle includes more **Tree** and **Graph** problems in practice, while Adobe emphasizes **Sorting** and **Greedy** approaches for their product work (think document processing or media optimization).

## Preparation Priority Matrix

Here's how to allocate your study time strategically:

**High Priority (Both Companies)**

- Array manipulation: sliding window, subarray sums, rotation
- String operations: palindrome checks, anagrams, parsing
- Hash Table applications: frequency counting, two-sum variants
  _Recommended problems:_ Two Sum (#1), Longest Substring Without Repeating Characters (#3), Product of Array Except Self (#238)

**Medium Priority (Oracle Focus)**

- Dynamic Programming: start with 1D (Fibonacci, climbing stairs) then 2D (knapsack, LCS)
- Advanced tree traversals with state tracking
- Graph algorithms (especially DFS/BFS with memoization)
  _Recommended problems:_ Coin Change (#322), Longest Increasing Subsequence (#300), Word Break (#139)

**Medium Priority (Adobe Focus)**

- Two Pointers: sorted array merges, in-place modifications
- Sorting with custom comparators
- Interval merging and scheduling problems
  _Recommended problems:_ Merge Intervals (#56), 3Sum (#15), Remove Duplicates from Sorted Array (#26)

## Interview Format Differences

Oracle typically conducts 4-5 technical rounds in their on-site, each 45-60 minutes with 1-2 problems. They often include a dedicated "system design light" round focusing on scalability aspects of your solution. Interviewers probe optimization deeply — if you offer an O(n²) solution, expect to be pushed toward O(n log n) or O(n). Behavioral questions are usually separate (30-minute HR round), but technical interviewers might ask about trade-offs in your approach.

Adobe's process is often 3-4 technical rounds, sometimes with a take-home assignment for certain roles. Their interviews are 45 minutes with typically one substantial problem or two related smaller ones. They care deeply about code quality — variable naming, function decomposition, and error handling matter. You might be asked to extend your solution or discuss how it would fit into a larger codebase. System design appears mainly for senior roles, focusing on Adobe's domains (document services, media processing, analytics).

## Specific Problem Recommendations

Here are 5 problems that provide exceptional value for both companies:

1. **Longest Palindromic Substring (#5)** - Tests both two-pointer techniques (expand around center) and dynamic programming approaches. Perfect for comparing how each company would evaluate different solutions.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1) - Expand around center (Adobe-style)
def longestPalindrome(s: str) -> str:
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l+1:r]

    res = ""
    for i in range(len(s)):
        # Odd length palindromes
        odd = expand(i, i)
        # Even length palindromes
        even = expand(i, i+1)
        res = max(res, odd, even, key=len)
    return res
```

```javascript
// Time: O(n^2) | Space: O(1)
function longestPalindrome(s) {
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    return s.substring(l + 1, r);
  };

  let res = "";
  for (let i = 0; i < s.length; i++) {
    const odd = expand(i, i);
    const even = expand(i, i + 1);
    if (odd.length > res.length) res = odd;
    if (even.length > res.length) res = even;
  }
  return res;
}
```

```java
// Time: O(n^2) | Space: O(1)
public String longestPalindrome(String s) {
    String res = "";
    for (int i = 0; i < s.length(); i++) {
        // Odd length
        String odd = expand(s, i, i);
        // Even length
        String even = expand(s, i, i + 1);
        if (odd.length() > res.length()) res = odd;
        if (even.length() > res.length()) res = even;
    }
    return res;
}

private String expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
        l--;
        r++;
    }
    return s.substring(l + 1, r);
}
```

</div>

2. **Maximum Subarray (#53)** - Simple enough for Adobe's clean-code focus (Kadane's algorithm), but with DP interpretations that Oracle appreciates. Tests fundamental array intuition.

3. **Merge Intervals (#56)** - Adobe tests this heavily for document processing scenarios. Oracle might extend it to DP scheduling variants. The sorting + merging pattern is widely applicable.

4. **Coin Change (#322)** - Oracle's classic DP problem that appears in various forms. Understanding both top-down memoization and bottom-up approaches prepares you for their optimization questions.

5. **Container With Most Water (#11)** - Excellent two-pointer problem that Adobe loves, but also tests optimization thinking that Oracle values. Multiple approaches demonstrate different trade-offs.

## Which to Prepare for First

Start with **Adobe**. Here's why: Adobe's emphasis on clean solutions to array/string/hash table problems builds the foundation Oracle expects. If you can solve Adobe's Medium problems with production-quality code, you're 70% ready for Oracle's technical interviews. The two-pointer skills transfer well to many DP problems (state transitions often involve pointer-like movement).

After solidifying Adobe's core topics, add **2-3 weeks of focused DP study** for Oracle. Work through the standard patterns: 1D DP (Fibonacci-style), 2D DP (grid problems), knapsack variations, and LCS/LIS problems. Practice both memoization and tabulation approaches — Oracle interviewers often ask for both.

Final week: Mix problems from both companies, prioritizing the overlap topics. Time yourself on Medium problems from Oracle's list to build stamina for their more challenging sessions.

Remember: Both companies value clear communication. Explain your thought process, discuss trade-offs, and write readable code. The technical patterns differ somewhat, but the core skills of problem decomposition and systematic thinking apply equally.

For company-specific details: [Oracle Interview Guide](/company/oracle) | [Adobe Interview Guide](/company/adobe)
