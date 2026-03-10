---
title: "How to Solve Word Break II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Word Break II. Hard difficulty, 55.1% acceptance rate. Topics: Array, Hash Table, String, Dynamic Programming, Backtracking."
date: "2026-12-15"
category: "dsa-patterns"
tags: ["word-break-ii", "array", "hash-table", "string", "hard"]
---

# How to Solve Word Break II

Word Break II asks us to take a string `s` and a dictionary `wordDict`, and return all possible ways to break the string into dictionary words. What makes this problem tricky is that we need to generate **all valid sentences**, not just check if a single segmentation exists. This means we must explore multiple branching possibilities while avoiding exponential blowup through smart memoization.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
s = "catsanddog"
wordDict = ["cat","cats","and","sand","dog"]
```

We want to find all ways to segment "catsanddog" into dictionary words. Let's think recursively:

1. Start at index 0: We can match "cat" (indices 0-2) or "cats" (0-3)
   - If we take "cat" (0-2), we now need to segment "sanddog" starting at index 3
   - If we take "cats" (0-3), we now need to segment "anddog" starting at index 4

2. For "sanddog" (starting at index 3):
   - We can match "sand" (3-6), leaving "dog" (7-9)
   - "dog" is in dictionary, so we get: "cat" + "sand" + "dog"

3. For "anddog" (starting at index 4):
   - We can match "and" (4-6), leaving "dog" (7-9)
   - "dog" is in dictionary, so we get: "cats" + "and" + "dog"

Final results: ["cat sand dog", "cats and dog"]

Notice how we're exploring different branches and combining results. The key insight is that once we've computed all sentences starting from a particular index, we can reuse that result if we encounter the same index again.

## Brute Force Approach

The most straightforward approach is pure recursion: at each position `i`, try every possible word from the dictionary that matches the substring starting at `i`, then recursively process the remainder.

The problem with this approach is exponential time complexity. Consider `s = "aaaaaaaa"` with `wordDict = ["a", "aa", "aaa", "aaaa"]`. At each position, we have up to 4 choices, leading to O(4^n) possibilities. Even worse, we'll recompute the same subproblems repeatedly.

Here's what the brute force might look like:

<div class="code-group">

```python
# Brute force - too slow for many cases
def wordBreakBrute(s, wordDict):
    word_set = set(wordDict)
    results = []

    def backtrack(start, current):
        if start == len(s):
            results.append(" ".join(current))
            return

        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                current.append(word)
                backtrack(end, current)
                current.pop()

    backtrack(0, [])
    return results
```

```javascript
// Brute force - too slow for many cases
function wordBreakBrute(s, wordDict) {
  const wordSet = new Set(wordDict);
  const results = [];

  function backtrack(start, current) {
    if (start === s.length) {
      results.push(current.join(" "));
      return;
    }

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (wordSet.has(word)) {
        current.push(word);
        backtrack(end, current);
        current.pop();
      }
    }
  }

  backtrack(0, []);
  return results;
}
```

```java
// Brute force - too slow for many cases
public List<String> wordBreakBrute(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    List<String> results = new ArrayList<>();

    backtrack(s, 0, new ArrayList<>(), wordSet, results);
    return results;
}

private void backtrack(String s, int start, List<String> current,
                      Set<String> wordSet, List<String> results) {
    if (start == s.length()) {
        results.add(String.join(" ", current));
        return;
    }

    for (int end = start + 1; end <= s.length(); end++) {
        String word = s.substring(start, end);
        if (wordSet.contains(word)) {
            current.add(word);
            backtrack(s, end, current, wordSet, results);
            current.remove(current.size() - 1);
        }
    }
}
```

</div>

This brute force solution will time out on larger inputs because it explores every possible combination without reusing computation.

## Optimized Approach

The key insight is that we can use **memoization** (top-down dynamic programming) to avoid recomputing the same subproblems. We create a memo dictionary that maps a starting index to all possible sentences starting from that index. Once we compute the result for a particular index, we store it and reuse it.

Here's the step-by-step reasoning:

1. **Base case**: If we reach the end of the string (`start == len(s)`), return a list containing an empty string (representing a complete sentence).

2. **Check memo**: Before computing, check if we already have results for this starting index.

3. **Try all possible words**: For each possible end position, check if the substring `s[start:end]` is in the dictionary.

4. **Recurse**: If it is, recursively get all sentences for the remainder (`s[end:]`).

5. **Combine**: For each sentence from the recursive call, prepend the current word (with space if needed).

6. **Memoize**: Store the results for this starting index before returning.

This approach transforms the exponential time complexity into something more manageable by ensuring each subproblem is solved only once.

## Optimal Solution

Here's the memoized DFS solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(n * 2^n)
# Worst-case when every substring is a word (e.g., "aaaa" with dict ["a"])
def wordBreak(s, wordDict):
    # Convert wordDict to set for O(1) lookups
    word_set = set(wordDict)
    # Memoization dictionary: start index -> list of sentences
    memo = {}

    def dfs(start):
        # If we've already computed results for this start index, return them
        if start in memo:
            return memo[start]

        # Base case: reached end of string
        if start == len(s):
            return [""]  # List with empty string for easier combination

        results = []
        # Try every possible end position
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            # If current substring is a valid word
            if word in word_set:
                # Get all sentences for the remainder of the string
                sub_sentences = dfs(end)
                # Combine current word with each sentence from remainder
                for sentence in sub_sentences:
                    if sentence:  # If sentence is not empty
                        results.append(word + " " + sentence)
                    else:  # This is the last word in the sentence
                        results.append(word)

        # Memoize results for this start index
        memo[start] = results
        return results

    return dfs(0)
```

```javascript
// Time: O(n * 2^n) | Space: O(n * 2^n)
// Worst-case when every substring is a word (e.g., "aaaa" with dict ["a"])
function wordBreak(s, wordDict) {
  // Convert wordDict to set for O(1) lookups
  const wordSet = new Set(wordDict);
  // Memoization map: start index -> array of sentences
  const memo = new Map();

  function dfs(start) {
    // If we've already computed results for this start index, return them
    if (memo.has(start)) {
      return memo.get(start);
    }

    // Base case: reached end of string
    if (start === s.length) {
      return [""]; // Array with empty string for easier combination
    }

    const results = [];
    // Try every possible end position
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      // If current substring is a valid word
      if (wordSet.has(word)) {
        // Get all sentences for the remainder of the string
        const subSentences = dfs(end);
        // Combine current word with each sentence from remainder
        for (const sentence of subSentences) {
          if (sentence) {
            // If sentence is not empty
            results.push(word + " " + sentence);
          } else {
            // This is the last word in the sentence
            results.push(word);
          }
        }
      }
    }

    // Memoize results for this start index
    memo.set(start, results);
    return results;
  }

  return dfs(0);
}
```

```java
// Time: O(n * 2^n) | Space: O(n * 2^n)
// Worst-case when every substring is a word (e.g., "aaaa" with dict ["a"])
public List<String> wordBreak(String s, List<String> wordDict) {
    // Convert wordDict to set for O(1) lookups
    Set<String> wordSet = new HashSet<>(wordDict);
    // Memoization map: start index -> list of sentences
    Map<Integer, List<String>> memo = new HashMap<>();

    return dfs(s, 0, wordSet, memo);
}

private List<String> dfs(String s, int start, Set<String> wordSet,
                        Map<Integer, List<String>> memo) {
    // If we've already computed results for this start index, return them
    if (memo.containsKey(start)) {
        return memo.get(start);
    }

    // Base case: reached end of string
    if (start == s.length()) {
        List<String> result = new ArrayList<>();
        result.add("");  // Empty string for easier combination
        return result;
    }

    List<String> results = new ArrayList<>();
    // Try every possible end position
    for (int end = start + 1; end <= s.length(); end++) {
        String word = s.substring(start, end);
        // If current substring is a valid word
        if (wordSet.contains(word)) {
            // Get all sentences for the remainder of the string
            List<String> subSentences = dfs(s, end, wordSet, memo);
            // Combine current word with each sentence from remainder
            for (String sentence : subSentences) {
                if (!sentence.isEmpty()) {  // If sentence is not empty
                    results.add(word + " " + sentence);
                } else {  // This is the last word in the sentence
                    results.add(word);
                }
            }
        }
    }

    // Memoize results for this start index
    memo.put(start, results);
    return results;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n \* 2^n) in the worst case, where n is the length of the string. This worst case occurs when every substring is a valid word (e.g., `s = "aaaa"` with `wordDict = ["a"]`). In this scenario, we have 2^(n-1) possible segmentations, and each sentence has O(n) characters.

**Space Complexity**: O(n \* 2^n) for storing all possible sentences in the memoization table. The recursion stack uses O(n) space.

While this seems high, in practice the memoization prevents exponential blowup for many inputs. The complexity is unavoidable in the worst case because we need to output all possible sentences, and there can be exponentially many of them.

## Common Mistakes

1. **Forgetting to memoize**: This is the most common mistake. Without memoization, you'll get exponential time complexity and likely time out on larger test cases.

2. **Incorrect base case handling**: The base case should return a list containing an empty string (not an empty list). This makes it easier to combine results: `[""]` allows us to handle the case where the current word is the last word in the sentence.

3. **Using list concatenation inefficiently**: Some candidates build sentences by concatenating strings in the recursive calls, which creates many intermediate strings. It's more efficient to build the sentence on the way back up from the recursion.

4. **Not converting wordDict to a set**: Using a list for dictionary lookups gives O(n) time per lookup instead of O(1). Always convert to a set or hash map for efficient lookups.

## When You'll See This Pattern

This problem combines **backtracking/DFS** with **memoization**, a pattern that appears in many "generate all possibilities" problems:

1. **Word Break (LeetCode 139)**: The easier version that just asks if any segmentation exists. It uses DP without needing to generate all sentences.

2. **Palindrome Partitioning (LeetCode 131)**: Generate all possible palindrome partitions of a string. Similar DFS + backtracking structure.

3. **Generate Parentheses (LeetCode 22)**: Generate all valid combinations of n pairs of parentheses. Uses similar recursive generation with constraints.

4. **Combination Sum (LeetCode 39)**: Find all combinations that sum to a target. Similar exploration of possibilities with backtracking.

The pattern to recognize: when you need to generate all valid configurations/combinations and the problem has overlapping subproblems, consider DFS with memoization.

## Key Takeaways

1. **Memoization transforms exponential problems**: When a recursive solution recomputes the same subproblems, memoization can dramatically improve performance by storing and reusing results.

2. **DFS + backtracking for generation problems**: When you need to generate all valid configurations (sentences, partitions, combinations), DFS with backtracking is often the right approach.

3. **Base case design matters**: Carefully design your base case to make combination logic clean. Returning `[""]` instead of `[]` simplifies the code when combining results.

4. **Worst-case output size determines complexity**: When a problem asks for all possible outputs, the time complexity is at least the number of outputs. Sometimes exponential complexity is unavoidable.

Related problems: [Word Break](/problem/word-break), [Concatenated Words](/problem/concatenated-words)
