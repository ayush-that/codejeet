---
title: "Counting Questions at Intel: What to Expect"
description: "Prepare for Counting interview questions at Intel — patterns, difficulty breakdown, and study tips."
date: "2031-02-08"
category: "dsa-patterns"
tags: ["intel", "counting", "interview prep"]
---

When you see "Counting" in a technical interview context, your mind might jump to simple frequency maps or `Counter` objects. At Intel, it's a different story. With only 3 Counting questions out of 26 total in their tagged LeetCode problems, this isn't a dominant category. However, its appearance is strategic and telling. These aren't throwaway warm-ups; they are precision instruments designed to test a specific kind of algorithmic thinking: the ability to manage state, handle combinatorial logic, and avoid the exponential blow-up of brute force through careful enumeration. In a company that designs circuits and optimizes at the transistor level, the ability to count possibilities efficiently—whether it's valid configurations, unique paths, or distinct subsequences—is a direct analog to verifying chip logic or optimizing layout. You might only get one such question, but it will be a high-signal probe into your problem-solving rigor.

## Specific Patterns Intel Favors

Intel's Counting problems lean heavily into **Dynamic Programming (DP) for enumeration** and **combinatorial mathematics with constraints**. You won't find many simple hash map counts here. Instead, the focus is on problems where a naive count would be O(2^n) or worse, and you must derive a recurrence relation.

The dominant pattern is **DP on strings or 1D arrays to count distinct subsequences, substrings, or decode ways**. This tests your ability to define a state (`dp[i]` often represents the count of valid ways up to index `i`) and a transition that carefully avoids double-counting. A classic example is **Distinct Subsequences (#115)**, which is a direct test of this precise logic.

Another pattern is **counting with modular arithmetic**, often due to large result sizes. You'll need to be comfortable returning answers modulo (10^9 + 7). This isn't just a detail; it's a hint that the count grows exponentially and your DP must be efficient.

You'll also see **counting valid configurations or placements**, like counting ways to place tiles or arrange objects with restrictions, which often maps to a DP or a clever mathematical formula.

## How to Prepare

The key is to move beyond memorizing solutions and internalize the _state definition_ and _transition logic_. For the core pattern—counting distinct subsequences—let's break down the approach.

The problem: Given two strings `s` and `t`, count the number of distinct subsequences of `s` that equal `t`. A brute-force recursion would explore every subsequence of `s`. The DP insight is that for each prefix of `t`, we count how many ways we can form it using prefixes of `s`.

We define `dp[i][j]` as the number of ways to form `t[0:j]` using `s[0:i]`.

- If `s[i-1] == t[j-1]`, we have two options: use this character in `s` to match `t[j-1]`, or skip it. The count is `dp[i-1][j-1]` (use it) + `dp[i-1][j]` (skip it).
- If they don't match, we can only skip: `dp[i-1][j]`.
  The base case: forming an empty string `t` from any prefix of `s` has 1 way (take nothing).

Here is the implementation with space optimization (using 1D DP):

<div class="code-group">

```python
def numDistinct(s: str, t: str) -> int:
    # dp[j] will store the count for t[0:j] using the processed prefix of s
    dp = [0] * (len(t) + 1)
    dp[0] = 1  # Base case: empty t can be formed in 1 way

    for i in range(1, len(s) + 1):
        # Traverse backwards to avoid overwriting dp[j-1] needed for the current i
        for j in range(len(t), 0, -1):
            if s[i-1] == t[j-1]:
                dp[j] += dp[j-1]
        # dp[0] remains 1 for all i
    return dp[len(t)]

# Time: O(n * m) where n = len(s), m = len(t)
# Space: O(m) for the 1D dp array
```

```javascript
function numDistinct(s, t) {
  const dp = new Array(t.length + 1).fill(0);
  dp[0] = 1; // Base case

  for (let i = 1; i <= s.length; i++) {
    // Iterate backwards to prevent using updated values in the same row
    for (let j = t.length; j >= 1; j--) {
      if (s[i - 1] === t[j - 1]) {
        dp[j] += dp[j - 1];
      }
    }
  }
  return dp[t.length];
}

// Time: O(n * m) | Space: O(m)
```

```java
public int numDistinct(String s, String t) {
    int[] dp = new int[t.length() + 1];
    dp[0] = 1;

    for (int i = 1; i <= s.length(); i++) {
        // Traverse backwards to avoid overwriting the previous state
        for (int j = t.length(); j >= 1; j--) {
            if (s.charAt(i-1) == t.charAt(j-1)) {
                dp[j] += dp[j-1];
            }
        }
    }
    return dp[t.length()];
}

// Time: O(n * m) | Space: O(m)
```

</div>

The backward iteration is crucial for the space-optimized version. Practice this pattern on related problems like **Decode Ways (#91)** (counting ways to decode a digit string) and **Unique Binary Search Trees (#96)** (counting structurally unique BSTs), which uses a different but foundational Catalan number DP.

## How Intel Tests Counting vs Other Companies

At FAANG companies, Counting problems might appear as part of a larger system design or be more intertwined with data structures (e.g., counting islands in a grid, which is really a DFS problem). The difficulty is often in the scale or the clever trick.

At Intel, the difficulty is in **precision and correctness of the recurrence relation**. There's less room for heuristic approaches. Your solution must be provably correct and handle edge cases—like empty strings, large inputs requiring modulo, or single-character patterns—flawlessly. The expectation is that you can derive the DP from first principles during the interview, explaining why the transition works and why it doesn't double-count. It's a more mathematical, proof-oriented style.

## Study Order

1.  **Foundational Frequency Counting:** Start with basic hash map counting (e.g., **Valid Anagram (#242)**). This builds the muscle memory for using dictionaries but is not the end goal.
2.  **1D DP for Counting:** Learn to count ways to decode or climb stairs (**Climbing Stairs (#70)**, **Decode Ways (#91)**). This introduces the concept of `dp[i]` as a count and simple additive transitions.
3.  **2D DP for String Subsequence/Substring Counting:** This is the core. Master **Distinct Subsequences (#115)** and **Interleaving String (#97)**. Focus on drawing the DP table and tracing the logic.
4.  **Combinatorial DP (Catalan Numbers):** Study **Unique Binary Search Trees (#96)**. This introduces counting based on partitions (left/right subtrees) and is a classic pattern.
5.  **Counting with Modular Arithmetic:** Practice problems that explicitly require result modulo 10^9+7, like **Count Sorted Vowel Strings (#1641)**. This gets you comfortable with large numbers.
6.  **Advanced/Non-DP Counting:** Finally, tackle problems that use combinatorics formulas or inclusion-exclusion, like **Count Primes (#204)** (Sieve of Eratosthenes) or **Number of Digit One (#233)**. These are less common but test mathematical insight.

This order builds from simple state to complex state transitions, ensuring you understand the "why" before moving to more abstract patterns.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept.

1.  **Climbing Stairs (#70)** - The simplest counting DP.
2.  **Decode Ways (#91)** - Adds complexity with validation rules.
3.  **Unique Binary Search Trees (#96)** - Introduces partition-based counting.
4.  **Distinct Subsequences (#115)** - The flagship problem for this pattern at Intel. Master it.
5.  **Count Sorted Vowel Strings (#1641)** - Combines counting with combinatorics/DP and result modulo.
6.  **Number of Dice Rolls With Target Sum (#1155)** - A good test of counting ways with dice (a different DP state).

For an extra challenge relevant to constraints, try **Student Attendance Record II (#552)** which involves counting valid sequences with complex rules.

Remember, at Intel, the goal isn't just to get the right answer, but to demonstrate you can architect a correct, efficient counting mechanism from the ground up—a skill that translates directly to hardware verification and performance modeling. Your logic must be as precise as the circuits they design.

[Practice Counting at Intel](/company/intel/counting)
