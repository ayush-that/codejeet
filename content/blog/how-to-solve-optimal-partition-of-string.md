---
title: "How to Solve Optimal Partition of String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Optimal Partition of String. Medium difficulty, 78.4% acceptance rate. Topics: Hash Table, String, Greedy."
date: "2028-03-05"
category: "dsa-patterns"
tags: ["optimal-partition-of-string", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Optimal Partition of String

This problem asks us to split a string into the **minimum number of substrings** where each substring contains only unique characters (no repeats). What makes this interesting is that we need to partition greedily while tracking seen characters, similar to finding the longest substring without repeating characters—but here we're counting how many such substrings we can create.

## Visual Walkthrough

Let's trace through `s = "abacaba"`:

**Step 1:** Start with an empty current substring.

- Add `'a'` → current substring = `"a"`
- Add `'b'` → current substring = `"ab"`
- Add `'a'` → `'a'` is already in current substring! We must start a new substring here.

**Step 2:** Start fresh with `'a'` (the third character)

- Current substring = `"a"`
- Add `'c'` → `"ac"`
- Add `'a'` → `'a'` is already in current substring! Start new substring.

**Step 3:** Start fresh with `'a'` (the fifth character)

- Current substring = `"a"`
- Add `'b'` → `"ab"`
- Add `'a'` → `'a'` is already in current substring! Start new substring.

**Step 4:** Start fresh with `'a'` (the seventh character)

- Current substring = `"a"` (end of string)

We created 4 substrings: `"ab"`, `"ac"`, `"ab"`, `"a"`.  
Notice we could have made different partitions, but this greedy approach gives us the minimum.

## Brute Force Approach

A naive approach would try all possible partitions. For each position, we could either end the current substring or continue it. This leads to checking 2^(n-1) possibilities (since between n characters there are n-1 gaps where we could cut).

Why this fails:  
For a string of length n, there are 2^(n-1) possible partitions. Even for n=20, that's over 500,000 possibilities. For n=1000, it's astronomically large. We need something smarter.

## Optimized Approach

The key insight: **We can be greedy**. Once we see a character that's already in our current substring, we must end that substring and start a new one. Why does greedy work?

Proof sketch:  
If we have a character that repeats within what could be one substring, we _must_ split somewhere between the two occurrences. The earliest we can split is right before the second occurrence. Splitting earlier doesn't help us—it just creates more substrings. So the greedy approach of extending as far as possible before splitting is optimal.

We need a way to track which characters are in the current substring. A hash set works perfectly:

1. Initialize an empty set and count = 1 (we need at least one substring)
2. For each character in the string:
   - If character is in the set, we've seen it in current substring  
     → Increment count (start new substring)  
     → Clear the set (new substring starts fresh)
   - Add current character to set
3. Return count

This is O(n) time and O(26) = O(1) space since there are only 26 lowercase letters (problem states lowercase English letters).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) because set holds at most 26 characters
def partitionString(s: str) -> int:
    # Track characters in current substring
    seen = set()
    # Start with 1 substring (we'll always have at least one)
    count = 1

    for char in s:
        # If we've already seen this character in current substring
        if char in seen:
            # We need to start a new substring
            count += 1
            # Clear the set for the new substring
            seen.clear()
        # Add current character to the current substring's set
        seen.add(char)

    return count
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) because set holds at most 26 characters
function partitionString(s) {
  // Track characters in current substring
  let seen = new Set();
  // Start with 1 substring (we'll always have at least one)
  let count = 1;

  for (let char of s) {
    // If we've already seen this character in current substring
    if (seen.has(char)) {
      // We need to start a new substring
      count++;
      // Clear the set for the new substring
      seen.clear();
    }
    // Add current character to the current substring's set
    seen.add(char);
  }

  return count;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) because set holds at most 26 characters
class Solution {
    public int partitionString(String s) {
        // Track characters in current substring
        Set<Character> seen = new HashSet<>();
        // Start with 1 substring (we'll always have at least one)
        int count = 1;

        for (char c : s.toCharArray()) {
            // If we've already seen this character in current substring
            if (seen.contains(c)) {
                // We need to start a new substring
                count++;
                // Clear the set for the new substring
                seen.clear();
            }
            // Add current character to the current substring's set
            seen.add(c);
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We iterate through the string exactly once, performing O(1) operations (set lookups and insertions) for each character.

**Space Complexity:** O(1)  
Although we use a set, it only stores characters from the current substring. Since there are only 26 lowercase English letters, the set never exceeds 26 elements. This is constant space regardless of input size.

## Common Mistakes

1. **Starting count at 0 instead of 1**  
   Even an empty string should return 1? Actually, for empty string, we should return 0. But the problem guarantees s.length ≥ 1. For non-empty strings, we always have at least one substring. Starting at 0 and incrementing when we see a repeat misses counting the first substring.

2. **Forgetting to clear the set when starting a new substring**  
   If you don't clear the set, you carry over characters from previous substrings, causing false duplicates. Each substring should be independent.

3. **Using a list instead of a set for tracking characters**  
   Checking if a character is in a list takes O(k) time where k is substring length. With a set, it's O(1). This doesn't change asymptotic complexity (since k ≤ 26), but it's cleaner and more efficient.

4. **Overcomplicating with dynamic programming**  
   Some candidates try DP because "partition" sounds like a DP problem. But greedy works and is simpler. Recognize when greedy applies: when local optimal choices lead to global optimum.

## When You'll See This Pattern

This greedy + set tracking pattern appears in several substring problems:

1. **Longest Substring Without Repeating Characters (LeetCode #3)**  
   Same core idea: use a set to track characters in current window, move left pointer when duplicates appear. Here we're counting partitions instead of finding maximum length.

2. **Partition Labels (LeetCode #763)**  
   Another partitioning problem where greedy works. Instead of tracking individual characters, you track last occurrences, but the "extend as far as possible" logic is similar.

3. **Maximum Number of Vowels in a Substring of Given Length (LeetCode #1456)**  
   Sliding window with character tracking, though simpler since window size is fixed.

The pattern: When you need to process substrings with uniqueness constraints, think about maintaining a set of seen characters and adjusting boundaries when constraints are violated.

## Key Takeaways

1. **Greedy works for partitioning when you can extend until a constraint breaks**  
   If you must split when a duplicate appears, the optimal strategy is to wait until you absolutely have to split.

2. **Sets are perfect for tracking character uniqueness**  
   O(1) lookups and insertions make them ideal for checking if a character has been seen before.

3. **This is essentially the "minimum cuts" version of "longest substring without repeats"**  
   Recognize the relationship: maximizing substring length vs minimizing number of substrings are dual problems with similar solutions.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters), [Longest Substring with At Least K Repeating Characters](/problem/longest-substring-with-at-least-k-repeating-characters), [Partition Labels](/problem/partition-labels)
