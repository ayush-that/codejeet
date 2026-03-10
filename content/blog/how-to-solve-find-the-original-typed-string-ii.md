---
title: "How to Solve Find the Original Typed String II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Original Typed String II. Hard difficulty, 45.6% acceptance rate. Topics: String, Dynamic Programming, Prefix Sum."
date: "2028-01-27"
category: "dsa-patterns"
tags: ["find-the-original-typed-string-ii", "string", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Find the Original Typed String II

This problem asks us to determine all possible original strings Alice might have intended to type, given that she may accidentally press keys too long, causing characters to repeat. The tricky part is that **any character** in the final output could be the result of a key being held down, so we need to systematically explore all possible ways to "compress" repeated characters while maintaining the original typing order.

## Visual Walkthrough

Let's trace through a small example: `word = "aabbbcc"`.

We need to find all possible original strings that could produce this output. The rule is: Alice types each character of the original string exactly once, but any character might accidentally repeat some number of times (≥ 1).

For `"aabbbcc"`, let's think about possibilities:

1. **Original string could be `"abbbc"`**:
   - First 'a' repeats once → `"aa"`
   - Then 'b' repeats three times → `"bbb"`
   - Then 'c' repeats once → `"c"` (but we have `"cc"` in output) → This doesn't match!

2. **Original string could be `"abc"`**:
   - 'a' repeats twice → `"aa"`
   - 'b' repeats three times → `"bbb"`
   - 'c' repeats twice → `"cc"`
   - This produces exactly `"aabbbcc"` ✓

3. **Original string could be `"abbc"`**:
   - 'a' repeats twice → `"aa"`
   - 'b' repeats twice → `"bb"` (but we have `"bbb"`) → doesn't match!

The key insight: We need to consider **all possible groupings** of consecutive identical characters. Each group of identical characters in the output could come from either:

- A single original character that repeated
- Multiple original characters that happen to be the same letter

For `"aabbbcc"`, the groups are: `"aa"`, `"bbb"`, `"cc"`.

For group `"aa"` (length 2): It could come from 1 original 'a' (repeated twice) or 2 original 'a's (each repeated once).

For group `"bbb"` (length 3): It could come from 1, 2, or 3 original 'b's.

For group `"cc"` (length 2): It could come from 1 or 2 original 'c's.

We need to find **all combinations** of these choices that produce valid original strings.

## Brute Force Approach

A naive approach would be to generate all possible original strings by trying every possible way to split each group of identical characters:

1. Identify all groups of consecutive identical characters
2. For each group of length `k`, try all possible ways to split it into `m` original characters (where 1 ≤ m ≤ k)
3. Combine all these choices across groups
4. Check which combinations produce valid original strings

The problem with this approach is the combinatorial explosion. If we have `n` groups and each group of length `k` has `k` possible splits, we could have up to `k₁ × k₂ × ... × kₙ` combinations. For a string of length 100, this could be astronomically large.

Even worse, we need to ensure that when we choose to split a group into multiple original characters, those characters must be **identical** in the original string (since they're in the same group in the output). This creates additional constraints.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. We can think of it as: given the final string `word`, we want to find all possible original strings that could have produced it.

Let's define `dp[i]` as the set of all possible original strings that could produce the prefix `word[0:i]` (first `i` characters).

Transition: To compute `dp[i]`, we look at the last group of identical characters ending at position `i-1`. Suppose this group has length `len` and character `ch`. Then for each possible split of this group into `m` original characters (where 1 ≤ m ≤ len), we need to append `m` copies of `ch` to each string in `dp[i-len]`.

But there's a catch: if we split a group into `m` original characters, those `m` characters must be **consecutive identical characters** in the original string. So when we append them to strings in `dp[i-len]`, we need to check if the last character of those strings is also `ch`. If it is, we're actually extending the last group of the original string, not starting a new group.

This leads to two cases:

1. The last character of a string in `dp[i-len]` is different from `ch`: We can append `m` copies of `ch` as a new group.
2. The last character is the same as `ch`: We need to merge with the last group.

Actually, there's a cleaner way: Instead of storing full strings, we can store the **last character** and **count of how many times it appears consecutively at the end** for each possible original string prefix. This is more efficient.

But even better: We notice that we only care about **distinct** original strings. So we can use a set to avoid duplicates. And we can process groups one by one.

The optimal approach:

1. Break `word` into groups of consecutive identical characters
2. Use DP where `dp[i]` = set of possible original strings for first `i` groups
3. For group `i` with character `c` and length `L`:
   - For each string `s` in `dp[i-1]`:
     - For each possible split `k` from 1 to `L`:
       - If `s` ends with `c`, we need to handle merging
       - Otherwise, we append `k` copies of `c`
4. Return all strings in `dp[n]` where `n` is number of groups

However, this still has complexity issues. The real optimization comes from realizing that we don't need to try all splits from 1 to `L` - we only need to consider splits where the resulting original string would be valid.

Actually, let me reveal the actual efficient solution: We can use **DFS with memoization** on group indices and the last character of the current original string being built.

## Optimal Solution

The clean solution uses DFS with memoization. We process groups one by one, and at each step, we decide how many original characters the current group represents. The state is `(group_index, last_char, last_count)` where:

- `group_index`: which group we're processing
- `last_char`: the last character of the current original string being built
- `last_count`: how many times `last_char` appears consecutively at the end of the current original string

For each group with character `c` and length `L`, we try all possible ways to split it into `k` original characters (1 ≤ k ≤ L). If `c == last_char`, then these `k` characters would merge with the existing run, so the new last_count would be `last_count + k`. Otherwise, it starts a new run with last_count = `k`.

We use memoization to avoid recomputing states.

<div class="code-group">

```python
# Time: O(n * m^2) where n is number of groups, m is max group length
# Space: O(n * m * 26) for memoization
from functools import lru_cache
from typing import List

class Solution:
    def possibleStrings(self, word: str) -> List[str]:
        # Step 1: Break the word into groups of consecutive identical characters
        groups = []
        i = 0
        while i < len(word):
            j = i
            while j < len(word) and word[j] == word[i]:
                j += 1
            groups.append((word[i], j - i))  # (character, length)
            i = j

        result = []

        # Step 2: DFS with memoization
        @lru_cache(None)
        def dfs(idx, last_char, last_count):
            """
            Returns set of possible original strings as tuples of (char, count) pairs
            for groups starting from idx, given the last character and its count
            in the current original string being built.
            """
            if idx == len(groups):
                # Base case: processed all groups
                # Convert the state to a string representation
                return {((last_char, last_count),)} if last_count > 0 else {()}

            ch, length = groups[idx]
            res_set = set()

            # Try all possible number of original characters for this group
            for k in range(1, length + 1):
                # For each possible split into k original characters
                if ch == last_char:
                    # Merge with existing run
                    for rest in dfs(idx + 1, ch, last_count + k):
                        res_set.add(((ch, last_count + k),) + rest[1:] if rest else ((ch, last_count + k),))
                else:
                    # Start a new run
                    for rest in dfs(idx + 1, ch, k):
                        if last_count > 0:
                            res_set.add(((last_char, last_count),) + rest)
                        else:
                            res_set.add(rest)

            return res_set

        # Step 3: Convert the result from tuples to strings
        all_tuples = dfs(0, '', 0)
        for tup in all_tuples:
            s = ''
            for ch, count in tup:
                s += ch * count
            result.append(s)

        return sorted(result)  # Return sorted for consistent output
```

```javascript
// Time: O(n * m^2) where n is number of groups, m is max group length
// Space: O(n * m * 26) for memoization
/**
 * @param {string} word
 * @return {string[]}
 */
var possibleStrings = function (word) {
  // Step 1: Break the word into groups of consecutive identical characters
  const groups = [];
  for (let i = 0; i < word.length; ) {
    const ch = word[i];
    let j = i;
    while (j < word.length && word[j] === ch) {
      j++;
    }
    groups.push([ch, j - i]); // [character, length]
    i = j;
  }

  const memo = new Map();

  // Step 2: DFS with memoization
  function dfs(idx, lastChar, lastCount) {
    const key = `${idx},${lastChar},${lastCount}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    if (idx === groups.length) {
      // Base case: processed all groups
      const result = new Set();
      if (lastCount > 0) {
        result.add(JSON.stringify([[lastChar, lastCount]]));
      } else {
        result.add(JSON.stringify([]));
      }
      memo.set(key, result);
      return result;
    }

    const [ch, length] = groups[idx];
    const resSet = new Set();

    // Try all possible number of original characters for this group
    for (let k = 1; k <= length; k++) {
      // For each possible split into k original characters
      if (ch === lastChar) {
        // Merge with existing run
        const nextResults = dfs(idx + 1, ch, lastCount + k);
        for (const restStr of nextResults) {
          const rest = JSON.parse(restStr);
          if (rest.length > 0 && rest[0][0] === ch) {
            // Merge the first element
            const newRest = [[ch, lastCount + k + rest[0][1]], ...rest.slice(1)];
            resSet.add(JSON.stringify(newRest));
          } else {
            const newRest = [[ch, lastCount + k], ...rest];
            resSet.add(JSON.stringify(newRest));
          }
        }
      } else {
        // Start a new run
        const nextResults = dfs(idx + 1, ch, k);
        for (const restStr of nextResults) {
          const rest = JSON.parse(restStr);
          if (lastCount > 0) {
            const newRest = [[lastChar, lastCount], ...rest];
            resSet.add(JSON.stringify(newRest));
          } else {
            resSet.add(restStr);
          }
        }
      }
    }

    memo.set(key, resSet);
    return resSet;
  }

  // Step 3: Convert the result from JSON strings to actual strings
  const allTuplesSet = dfs(0, "", 0);
  const result = [];

  for (const tupleStr of allTuplesSet) {
    const tuples = JSON.parse(tupleStr);
    let s = "";
    for (const [ch, count] of tuples) {
      for (let i = 0; i < count; i++) {
        s += ch;
      }
    }
    result.push(s);
  }

  return result.sort(); // Return sorted for consistent output
};
```

```java
// Time: O(n * m^2) where n is number of groups, m is max group length
// Space: O(n * m * 26) for memoization
import java.util.*;

class Solution {
    public List<String> possibleStrings(String word) {
        // Step 1: Break the word into groups of consecutive identical characters
        List<int[]> groups = new ArrayList<>();
        for (int i = 0; i < word.length();) {
            char ch = word.charAt(i);
            int j = i;
            while (j < word.length() && word.charAt(j) == ch) {
                j++;
            }
            groups.add(new int[]{ch, j - i});
            i = j;
        }

        // Step 2: DFS with memoization
        Map<String, Set<List<int[]>>> memo = new HashMap<>();
        Set<List<int[]>> allTuplesSet = dfs(0, ' ', 0, groups, memo);

        // Step 3: Convert the result to strings
        List<String> result = new ArrayList<>();
        for (List<int[]> tuples : allTuplesSet) {
            StringBuilder sb = new StringBuilder();
            for (int[] tuple : tuples) {
                char ch = (char) tuple[0];
                int count = tuple[1];
                for (int i = 0; i < count; i++) {
                    sb.append(ch);
                }
            }
            result.add(sb.toString());
        }

        Collections.sort(result);
        return result;
    }

    private Set<List<int[]>> dfs(int idx, char lastChar, int lastCount,
                                 List<int[]> groups, Map<String, Set<List<int[]>>> memo) {
        String key = idx + "," + lastChar + "," + lastCount;
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        if (idx == groups.size()) {
            Set<List<int[]>> result = new HashSet<>();
            if (lastCount > 0) {
                List<int[]> single = new ArrayList<>();
                single.add(new int[]{lastChar, lastCount});
                result.add(single);
            } else {
                result.add(new ArrayList<>());
            }
            memo.put(key, result);
            return result;
        }

        int[] group = groups.get(idx);
        char ch = (char) group[0];
        int length = group[1];
        Set<List<int[]>> resSet = new HashSet<>();

        // Try all possible number of original characters for this group
        for (int k = 1; k <= length; k++) {
            if (ch == lastChar) {
                // Merge with existing run
                Set<List<int[]>> nextResults = dfs(idx + 1, ch, lastCount + k, groups, memo);
                for (List<int[]> rest : nextResults) {
                    List<int[]> newList = new ArrayList<>();
                    if (!rest.isEmpty() && rest.get(0)[0] == ch) {
                        // Merge the first element
                        newList.add(new int[]{ch, lastCount + k + rest.get(0)[1]});
                        newList.addAll(rest.subList(1, rest.size()));
                    } else {
                        newList.add(new int[]{ch, lastCount + k});
                        newList.addAll(rest);
                    }
                    resSet.add(newList);
                }
            } else {
                // Start a new run
                Set<List<int[]>> nextResults = dfs(idx + 1, ch, k, groups, memo);
                for (List<int[]> rest : nextResults) {
                    List<int[]> newList = new ArrayList<>();
                    if (lastCount > 0) {
                        newList.add(new int[]{lastChar, lastCount});
                    }
                    newList.addAll(rest);
                    resSet.add(newList);
                }
            }
        }

        memo.put(key, resSet);
        return resSet;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m²) where n is the number of groups and m is the maximum group length. For each group, we try all possible splits (1 to length), and for each split, we explore further states. The memoization ensures we don't recompute states, but there are O(n × m × 26) possible states (26 for possible last characters).

**Space Complexity:** O(n × m × 26) for the memoization storage. Each state stores a set of possible continuations, which in worst case could be exponential, but in practice is much smaller due to constraints.

## Common Mistakes

1. **Not handling character merging correctly**: When the current group's character matches the last character of the original string being built, candidates often forget to merge them into a single run rather than treating them as separate characters.

2. **Generating duplicates**: Without using sets to store results at each state, you'll generate many duplicate original strings. Always use sets for intermediate results.

3. **Exponential blowup without memoization**: Trying to generate all possible original strings without memoization leads to recomputing the same states many times. The DFS tree has overlapping subproblems.

4. **Incorrect base case handling**: Forgetting to handle the case where `lastCount` is 0 (no characters built yet) in the base case can lead to missing some valid original strings.

## When You'll See This Pattern

This type of problem appears in scenarios where you need to reconstruct all possible original inputs given a transformed output, especially when the transformation involves repetition or compression:

1. **Decode Ways (LeetCode 91)**: Similar state-based DP where you decide how to group digits into letters.
2. **Restore IP Addresses (LeetCode 93)**: Another reconstruction problem where you decide how to split the string into valid IP address components.
3. **Palindrome Partitioning (LeetCode 131)**: Finding all ways to partition a string into palindromic substrings uses similar DFS with backtracking.

## Key Takeaways

1. **Reconstruction problems often need DFS/backtracking with memoization**: When you need to find all possible ways to interpret or reconstruct data, think about state-based DFS with memoization to avoid exponential time.

2. **State representation is crucial**: Choosing the right state representation (group index, last character, last count) makes the difference between a workable solution and an intractable one.

3. **Group identical elements first**: When dealing with repeated characters, it's almost always better to group them first rather than processing character by character.

Related problems: [Keyboard Row](/problem/keyboard-row), [Faulty Keyboard](/problem/faulty-keyboard)
