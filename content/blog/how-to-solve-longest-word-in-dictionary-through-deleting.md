---
title: "How to Solve Longest Word in Dictionary through Deleting — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Word in Dictionary through Deleting. Medium difficulty, 52.5% acceptance rate. Topics: Array, Two Pointers, String, Sorting."
date: "2026-03-29"
category: "dsa-patterns"
tags: ["longest-word-in-dictionary-through-deleting", "array", "two-pointers", "string", "medium"]
---

# How to Solve Longest Word in Dictionary through Deleting

You’re given a string `s` and a list of dictionary words. You need to find the longest dictionary word that can be formed by deleting characters from `s` (without rearranging them). If there’s a tie in length, pick the lexicographically smallest word. This problem is interesting because it combines string matching with sorting and comparison logic—you can’t just check for exact substrings, you need to verify if a word appears as a subsequence of `s`.

## Visual Walkthrough

Let’s walk through an example to build intuition:

**Input:**  
`s = "abpcplea"`  
`dictionary = ["ale","apple","monkey","plea"]`

We need to check each dictionary word to see if it can be formed by deleting characters from `s`.

**Step 1: Check "ale"**  
We use two pointers: `i` for `s` and `j` for "ale".

- Compare `s[0]='a'` with `"ale"[0]='a'`: match, move both pointers.
- Compare `s[1]='b'` with `"ale"[1]='l'`: no match, move only `i`.
- Compare `s[2]='p'` with `'l'`: no match, move `i`.
- Compare `s[3]='c'` with `'l'`: no match, move `i`.
- Compare `s[4]='p'` with `'l'`: no match, move `i`.
- Compare `s[5]='l'` with `'l'`: match, move both.
- Compare `s[6]='e'` with `"ale"[2]='e'`: match, move both.  
  We reached the end of "ale", so it’s valid.

**Step 2: Check "apple"**

- `'a'` matches at `s[0]`.
- `'p'` matches at `s[2]` (skip `'b'`).
- Next `'p'` matches at `s[3]`.
- `'l'` matches at `s[5]`.
- `'e'` matches at `s[6]`.  
  Valid.

**Step 3: Check "monkey"**  
First letter `'m'` never appears in `s`, so invalid.

**Step 4: Check "plea"**

- `'p'` matches at `s[2]`.
- `'l'` matches at `s[5]`.
- `'e'` matches at `s[6]`.
- `'a'` matches at `s[7]`.  
  Valid.

Now we have three valid words: `"ale"` (length 3), `"apple"` (length 5), and `"plea"` (length 4). The longest is `"apple"`, so that’s our answer.

## Brute Force Approach

A naive approach would be to generate all possible subsequences of `s` (by deleting characters), then check which dictionary words match. Generating all subsequences of a string of length `n` takes O(2ⁿ) time—completely infeasible even for moderate `n`.

What a candidate might try instead is to check each dictionary word by scanning `s` for the word’s characters in order. That’s actually the right idea! The brute force mistake would be to implement this inefficiently—for example, by repeatedly searching for each character in `s` without using pointers, leading to O(m·n²) complexity where `m` is the number of dictionary words and `n` is the length of `s`. But the two-pointer method we used in the visual walkthrough is already optimal for checking a single word.

The real optimization comes from how we handle the dictionary: we need to find the _best_ valid word according to length and lexicographic order. A brute force way would be to check all words, store valid ones, then sort them by length (descending) and lexicographic order (ascending), and pick the first. This works, but we can do better by comparing as we go.

## Optimized Approach

The key insight is that we can check each dictionary word in O(n) time using the two-pointer subsequence check. Then, instead of storing all valid words and sorting, we can keep track of the best candidate as we iterate through the dictionary:

1. For each word in the dictionary, check if it’s a subsequence of `s` using two pointers.
2. If it’s valid, compare it with the current best candidate:
   - If it’s longer than the best, it becomes the new best.
   - If it’s the same length but lexicographically smaller, it becomes the new best.
3. Return the best candidate after processing all words.

This avoids storing all valid words and sorting them separately. We can also sort the dictionary first by length (descending) and then lexicographically (ascending), so the first valid word we find is the answer. However, sorting takes O(m log m) time, which may be acceptable but isn’t strictly necessary—the comparison-as-we-go approach is cleaner and often faster in practice.

## Optimal Solution

Here’s the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) where m = number of words, n = length of s
# Space: O(1) excluding input storage
def findLongestWord(s: str, dictionary: list[str]) -> str:
    # Helper function to check if word is a subsequence of s
    def is_subsequence(word: str) -> bool:
        i = 0  # pointer for s
        j = 0  # pointer for word
        # Traverse both strings
        while i < len(s) and j < len(word):
            if s[i] == word[j]:
                # Characters match, move word pointer
                j += 1
            # Always move s pointer
            i += 1
        # If we reached the end of word, all characters were found in order
        return j == len(word)

    best_word = ""
    for word in dictionary:
        # Check if current word is a valid subsequence
        if is_subsequence(word):
            # Update best_word if:
            # 1. Current word is longer, OR
            # 2. Same length but lexicographically smaller
            if len(word) > len(best_word) or \
               (len(word) == len(best_word) and word < best_word):
                best_word = word

    return best_word
```

```javascript
// Time: O(m * n) where m = number of words, n = length of s
// Space: O(1) excluding input storage
function findLongestWord(s, dictionary) {
  // Helper function to check if word is a subsequence of s
  const isSubsequence = (word) => {
    let i = 0; // pointer for s
    let j = 0; // pointer for word
    while (i < s.length && j < word.length) {
      if (s[i] === word[j]) {
        j++; // match found, move word pointer
      }
      i++; // always move s pointer
    }
    return j === word.length; // all characters matched
  };

  let bestWord = "";
  for (const word of dictionary) {
    if (isSubsequence(word)) {
      // Update if word is longer, or same length but lexicographically smaller
      if (word.length > bestWord.length || (word.length === bestWord.length && word < bestWord)) {
        bestWord = word;
      }
    }
  }
  return bestWord;
}
```

```java
// Time: O(m * n) where m = number of words, n = length of s
// Space: O(1) excluding input storage
public String findLongestWord(String s, List<String> dictionary) {
    String bestWord = "";
    for (String word : dictionary) {
        if (isSubsequence(s, word)) {
            // Update bestWord if word is longer, or same length but lexicographically smaller
            if (word.length() > bestWord.length() ||
                (word.length() == bestWord.length() && word.compareTo(bestWord) < 0)) {
                bestWord = word;
            }
        }
    }
    return bestWord;
}

// Helper method to check if word is a subsequence of s
private boolean isSubsequence(String s, String word) {
    int i = 0; // pointer for s
    int j = 0; // pointer for word
    while (i < s.length() && j < word.length()) {
        if (s.charAt(i) == word.charAt(j)) {
            j++; // match found, move word pointer
        }
        i++; // always move s pointer
    }
    return j == word.length(); // all characters matched
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m·n) where `m` is the number of words in the dictionary and `n` is the length of `s`. For each word, we perform a single pass through `s` using the two-pointer method, which takes O(n) time in the worst case. In practice, it’s often faster because we stop early when the word is fully matched.

**Space Complexity:** O(1) extra space (excluding the input storage). We only use a few pointers and a string to track the best word. No additional data structures are needed.

## Common Mistakes

1. **Forgetting to handle ties correctly:** The problem requires returning the lexicographically smallest word when lengths are equal. A common mistake is to only compare lengths and ignore lexicographic order. Always check both conditions when updating the best candidate.

2. **Incorrect subsequence check logic:** Some candidates try to use `indexOf` or similar functions for each character, which can lead to O(n²) time per word if not careful. The two-pointer method is clean and optimal. Remember: you must preserve order, so you can’t just check character counts.

3. **Not optimizing the dictionary iteration:** While checking each word is necessary, you can add early pruning: if a word is shorter than the current best word, you can skip the subsequence check unless it has the same length and might be lexicographically smaller. However, this micro-optimization isn’t required for correctness.

4. **Edge case: empty dictionary or no valid words:** Always handle cases where the dictionary is empty or no word is a subsequence. The solution naturally handles this because `best_word` starts as an empty string and remains empty if no valid word is found, which is the correct output.

## When You'll See This Pattern

The two-pointer subsequence check is a classic pattern for problems involving ordered matching without rearrangement:

1. **Is Subsequence (LeetCode 392):** Direct application of the same two-pointer method to check if one string is a subsequence of another.
2. **Shortest Way to Form String (LeetCode 1055):** Uses repeated subsequence checks to find how many times you need to traverse a source string to form a target.
3. **Number of Matching Subsequences (LeetCode 792):** Extends the subsequence check to multiple words efficiently using preprocessing.

These problems all build on the idea of matching characters in order while allowing gaps—a common theme in string processing.

## Key Takeaways

- **Subsequence checking is a two-pointer sweep:** When you need to verify if string A appears in order within string B (with possible deletions), use one pointer for each string and advance based on matches.
- **Combine criteria during iteration:** Instead of collecting all valid results and sorting, you can maintain the best candidate by comparing length and lexicographic order on the fly.
- **Lexicographic order matters in ties:** When problems specify tie-breaking rules, implement the comparison logic directly in your update condition to avoid post-processing.

Related problems: [Longest Word in Dictionary](/problem/longest-word-in-dictionary)
