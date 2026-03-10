---
title: "How to Solve Sentence Similarity III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sentence Similarity III. Medium difficulty, 48.5% acceptance rate. Topics: Array, Two Pointers, String."
date: "2026-12-17"
category: "dsa-patterns"
tags: ["sentence-similarity-iii", "array", "two-pointers", "string", "medium"]
---

# How to Solve Sentence Similarity III

This problem asks us to determine if two sentences can be made equal by inserting a single sentence into the other. The tricky part is that the inserted sentence can only go at the beginning, middle, or end — not anywhere else. This constraint makes it more interesting than simple string comparison and requires careful thinking about word boundaries.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Example:** `sentence1 = "My name is Haley"`, `sentence2 = "My Haley"`

We need to check if we can insert words into `sentence2` to make it equal to `sentence1`. Let's split both sentences into word arrays:

`sentence1_words = ["My", "name", "is", "Haley"]`  
`sentence2_words = ["My", "Haley"]`

The key insight: For `sentence2` to be a valid insertion into `sentence1`, there must be a common prefix and/or suffix between them, with the inserted words in the middle.

Let's compare from the start:

- Both start with "My" ✓
- Next: "name" vs "Haley" → mismatch!

Now compare from the end (backwards):

- Both end with "Haley" ✓
- Previous: "is" vs "My" → mismatch!

So we have matching prefix of length 1 ("My") and matching suffix of length 1 ("Haley"). The total matched words (1 + 1 = 2) equals the length of `sentence2` (2 words). This means all words in `sentence2` appear in `sentence1` as prefix and suffix, with the middle words ("name", "is") being the inserted portion.

Thus, `sentence2` can be obtained by inserting "name is" into `sentence1` between the prefix "My" and suffix "Haley".

## Brute Force Approach

A naive approach would be to try inserting `sentence2` into every possible position in `sentence1` and check for equality. Since we can only insert at word boundaries, we have `n+1` positions to try (where `n` is the number of words in `sentence1`).

For each position:

1. Split both sentences into word arrays
2. Create a new array by inserting `sentence2_words` at position `i` in `sentence1_words`
3. Check if the resulting array equals `sentence1_words`

This would be O(n²) time complexity because for each of n+1 positions, we're creating a new array of size up to n+m (where m is length of `sentence2`). The space complexity would also be O(n+m) for the temporary arrays.

While this brute force would technically work, it's inefficient and doesn't leverage the key insight about prefix/suffix matching.

## Optimized Approach

The optimal solution uses a **two-pointer technique** to find matching prefixes and suffixes:

1. **Split both sentences** into arrays of words
2. **Find the longest common prefix** by comparing from the start
3. **Find the longest common suffix** by comparing from the end
4. **Check if prefix_length + suffix_length >= min(len1, len2)**

Why does this work? If we can insert `sentence2` into `sentence1`, then all words in `sentence2` must appear in `sentence1` as either:

- A prefix (if inserted at the end)
- A suffix (if inserted at the beginning)
- Both prefix AND suffix (if inserted in the middle)

The "both" case is why we need `>=` instead of `=`. When inserting in the middle, some words from `sentence2` might match both at the beginning AND end of `sentence1`.

**Edge cases to consider:**

- One sentence is longer than the other (the longer one must contain the shorter one plus inserted words)
- Empty sentences (though constraints say at least 1 word)
- Complete match (prefix_length = suffix_length = length of shorter sentence)
- No match at all (prefix_length = suffix_length = 0)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is total words in both sentences
# Space: O(n) for storing split words
def areSentencesSimilar(sentence1: str, sentence2: str) -> bool:
    # Step 1: Split both sentences into word lists
    words1 = sentence1.split()
    words2 = sentence2.split()

    # Ensure words1 is the longer sentence for easier comparison
    if len(words1) < len(words2):
        words1, words2 = words2, words1

    n1, n2 = len(words1), len(words2)

    # Step 2: Find longest common prefix
    prefix_len = 0
    while prefix_len < n2 and words1[prefix_len] == words2[prefix_len]:
        prefix_len += 1

    # Step 3: Find longest common suffix
    suffix_len = 0
    while suffix_len < n2 - prefix_len and words1[n1 - 1 - suffix_len] == words2[n2 - 1 - suffix_len]:
        suffix_len += 1

    # Step 4: Check if all words in shorter sentence are matched
    # If prefix + suffix covers all words in shorter sentence, it's valid
    return prefix_len + suffix_len >= n2
```

```javascript
// Time: O(n) where n is total words in both sentences
// Space: O(n) for storing split words
function areSentencesSimilar(sentence1, sentence2) {
  // Step 1: Split both sentences into word arrays
  let words1 = sentence1.split(" ");
  let words2 = sentence2.split(" ");

  // Ensure words1 is the longer array for easier comparison
  if (words1.length < words2.length) {
    [words1, words2] = [words2, words1];
  }

  const n1 = words1.length;
  const n2 = words2.length;

  // Step 2: Find longest common prefix
  let prefixLen = 0;
  while (prefixLen < n2 && words1[prefixLen] === words2[prefixLen]) {
    prefixLen++;
  }

  // Step 3: Find longest common suffix
  let suffixLen = 0;
  while (suffixLen < n2 - prefixLen && words1[n1 - 1 - suffixLen] === words2[n2 - 1 - suffixLen]) {
    suffixLen++;
  }

  // Step 4: Check if all words in shorter sentence are matched
  return prefixLen + suffixLen >= n2;
}
```

```java
// Time: O(n) where n is total words in both sentences
// Space: O(n) for storing split words
class Solution {
    public boolean areSentencesSimilar(String sentence1, String sentence2) {
        // Step 1: Split both sentences into word arrays
        String[] words1 = sentence1.split(" ");
        String[] words2 = sentence2.split(" ");

        // Ensure words1 is the longer array for easier comparison
        if (words1.length < words2.length) {
            String[] temp = words1;
            words1 = words2;
            words2 = temp;
        }

        int n1 = words1.length;
        int n2 = words2.length;

        // Step 2: Find longest common prefix
        int prefixLen = 0;
        while (prefixLen < n2 && words1[prefixLen].equals(words2[prefixLen])) {
            prefixLen++;
        }

        // Step 3: Find longest common suffix
        int suffixLen = 0;
        while (suffixLen < n2 - prefixLen &&
               words1[n1 - 1 - suffixLen].equals(words2[n2 - 1 - suffixLen])) {
            suffixLen++;
        }

        // Step 4: Check if all words in shorter sentence are matched
        return prefixLen + suffixLen >= n2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the total number of words in both sentences. We split both sentences (O(n)), then perform two linear scans comparing words. Each word is compared at most once in the prefix scan and at most once in the suffix scan.

**Space Complexity: O(n)** for storing the split words. We need to store both sentences as arrays of words. We could optimize to O(1) extra space by using indices without splitting, but that would make the code more complex and the split approach is usually acceptable in interviews.

## Common Mistakes

1. **Not handling different sentence lengths correctly**: Candidates sometimes assume sentences have equal length or forget to ensure the shorter sentence is completely contained in the longer one. Always identify which is shorter and check if all its words appear in the longer sentence.

2. **Off-by-one errors in suffix comparison**: The condition `suffix_len < n2 - prefix_len` is crucial. Without it, you might double-count words that were already matched in the prefix. For example, if sentences are identical, prefix_len = n2, and we shouldn't check any suffix.

3. **Using string comparison instead of word comparison**: Some candidates try to use `startswith()` or `endswith()` on the original strings, but this fails for cases like "A" and "a" (different words) or "Hello world" and "Hello world!" (extra punctuation). Always split into words first.

4. **Forgetting to swap sentences for consistent comparison**: The algorithm assumes `words1` is longer. If you don't swap when needed, the while loops might go out of bounds or give incorrect results.

## When You'll See This Pattern

The two-pointer prefix/suffix matching pattern appears in several problems:

1. **Merge Sorted Array (LeetCode 88)** - Uses two pointers from the end to merge in-place
2. **Valid Palindrome (LeetCode 125)** - Uses two pointers from both ends to check symmetry
3. **Container With Most Water (LeetCode 11)** - Uses two pointers from both ends to find optimal container
4. **Longest Word in Dictionary through Deleting (LeetCode 524)** - Uses pointer matching to check subsequence

The core idea is using two pointers to traverse from opposite ends, often to find matching patterns or optimize some condition. This pattern is especially useful when you need to check if one sequence is contained within another with some flexibility.

## Key Takeaways

1. **Two-pointer from both ends** is a powerful technique for problems involving prefix/suffix matching or containment checks. When you need to check if one sequence can be embedded in another, consider comparing from both ends.

2. **Break strings into words/tokens** when the problem is about word-level operations. String-level operations can fail due to partial word matches or punctuation.

3. **Handle the shorter/longer relationship explicitly**. Many string/array problems become simpler when you standardize which is the container and which is the contained sequence.

[Practice this problem on CodeJeet](/problem/sentence-similarity-iii)
