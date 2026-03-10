---
title: "How to Solve Check If String Is a Prefix of Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If String Is a Prefix of Array. Easy difficulty, 52.7% acceptance rate. Topics: Array, Two Pointers, String."
date: "2027-10-13"
category: "dsa-patterns"
tags: ["check-if-string-is-a-prefix-of-array", "array", "two-pointers", "string", "easy"]
---

# How to Solve "Check If String Is a Prefix of Array"

This problem asks us to determine if a given string `s` can be formed by concatenating the first `k` strings from an array `words`, where `k` is a positive integer not exceeding the array length. While conceptually straightforward, this problem tests your ability to handle string concatenation efficiently and manage edge cases carefully. The interesting part is that we need to check if `s` exactly matches the concatenation of some prefix of `words`—not just any subset, but specifically the first `k` elements.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `s = "iloveleetcode"`, `words = ["i","love","leetcode","apples"]`

**Step 1:** Start with an empty result string `result = ""` and iterate through `words`

- `result = "i"`, compare with `s`: `"i"` ≠ `"iloveleetcode"` but `"i"` is a prefix of `s`
- Continue building

**Step 2:** Add second word

- `result = "i" + "love" = "ilove"`
- Compare: `"ilove"` ≠ `"iloveleetcode"` but is a prefix

**Step 3:** Add third word

- `result = "ilove" + "leetcode" = "iloveleetcode"`
- Compare: `"iloveleetcode"` = `"iloveleetcode"` ✓ Exact match!
- Return `true` since we found `k = 3` where concatenation equals `s`

**Another example:** `s = "iloveleetcode"`, `words = ["i","love","code"]`

- `result = "i"` → prefix
- `result = "ilove"` → prefix
- `result = "ilovecode"` → `"ilovecode"` ≠ `"iloveleetcode"` and not a prefix
- Return `false` because we can't form `s` from any prefix

The key insight: we need to build the concatenation incrementally and check two conditions at each step:

1. Does our current concatenation match `s` exactly?
2. Is our current concatenation still a prefix of `s`? (If not, we can stop early)

## Brute Force Approach

A naive approach would be to generate all possible concatenations of prefixes and compare each to `s`. For each `k` from 1 to `words.length`, we could concatenate the first `k` strings and check if it equals `s`. While this would work, it's inefficient because we're repeatedly concatenating strings, which creates new string objects each time.

Here's what the brute force might look like:

```python
def isPrefixString(s, words):
    for k in range(1, len(words) + 1):
        # Concatenate first k words
        concatenated = ""
        for i in range(k):
            concatenated += words[i]

        if concatenated == s:
            return True

        # If concatenated is longer than s, we can stop
        if len(concatenated) > len(s):
            return False

    return False
```

The problem with this approach is the repeated string concatenation. In Python/JavaScript/Java, string concatenation creates a new string object each time, making this O(n²) in the worst case where we concatenate all words. We can do better by building the result incrementally and checking as we go.

## Optimal Solution

The optimal approach builds the concatenated string incrementally while checking two conditions:

1. If at any point our concatenated string equals `s`, return `true`
2. If at any point our concatenated string is longer than `s` or is not a prefix of `s`, return `false`

We also need to handle the case where we run out of words before matching `s`.

<div class="code-group">

```python
# Time: O(n + m) where n = len(words), m = len(s) | Space: O(m) for the result string
def isPrefixString(s: str, words: List[str]) -> bool:
    """
    Check if s can be formed by concatenating the first k strings in words.

    Approach: Build the concatenated string incrementally and check:
    1. If it equals s, return True
    2. If it's longer than s or not a prefix of s, return False
    3. If we run out of words, return False
    """
    result = ""  # Store the concatenated string

    # Iterate through each word in the array
    for word in words:
        # Append the current word to our result
        result += word

        # Check if we've exactly matched s
        if result == s:
            return True

        # Check if result is still a prefix of s
        # If not, we can stop early since adding more words won't help
        if not s.startswith(result):
            return False

        # Optional early exit: if result is already longer than s,
        # we can't possibly match s by adding more words
        if len(result) > len(s):
            return False

    # If we've processed all words without matching s, return False
    return False
```

```javascript
// Time: O(n + m) where n = words.length, m = s.length | Space: O(m) for the result string
/**
 * Check if s can be formed by concatenating the first k strings in words.
 *
 * Approach: Build the concatenated string incrementally and check:
 * 1. If it equals s, return true
 * 2. If it's longer than s or not a prefix of s, return false
 * 3. If we run out of words, return false
 */
function isPrefixString(s, words) {
  let result = ""; // Store the concatenated string

  // Iterate through each word in the array
  for (let word of words) {
    // Append the current word to our result
    result += word;

    // Check if we've exactly matched s
    if (result === s) {
      return true;
    }

    // Check if result is still a prefix of s
    // If not, we can stop early since adding more words won't help
    if (!s.startsWith(result)) {
      return false;
    }

    // Optional early exit: if result is already longer than s,
    // we can't possibly match s by adding more words
    if (result.length > s.length) {
      return false;
    }
  }

  // If we've processed all words without matching s, return false
  return false;
}
```

```java
// Time: O(n + m) where n = words.length, m = s.length() | Space: O(m) for the result string
/**
 * Check if s can be formed by concatenating the first k strings in words.
 *
 * Approach: Build the concatenated string incrementally and check:
 * 1. If it equals s, return true
 * 2. If it's longer than s or not a prefix of s, return false
 * 3. If we run out of words, return false
 */
public boolean isPrefixString(String s, String[] words) {
    StringBuilder result = new StringBuilder();  // Use StringBuilder for efficient concatenation

    // Iterate through each word in the array
    for (String word : words) {
        // Append the current word to our result
        result.append(word);

        // Check if we've exactly matched s
        if (result.toString().equals(s)) {
            return true;
        }

        // Check if result is still a prefix of s
        // If not, we can stop early since adding more words won't help
        if (!s.startsWith(result.toString())) {
            return false;
        }

        // Optional early exit: if result is already longer than s,
        // we can't possibly match s by adding more words
        if (result.length() > s.length()) {
            return false;
        }
    }

    // If we've processed all words without matching s, return false
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where n is the number of words and m is the length of string `s`. We iterate through each word once (O(n)), and each string concatenation and comparison operation takes time proportional to the length of the strings involved. In the worst case, we might concatenate all words and compare with `s`, giving us O(total length of all words + m) = O(n + m) since each word contributes to the total length.

**Space Complexity:** O(m) where m is the length of string `s`. We need to store the concatenated result string, which in the worst case could be as long as `s` itself. In Java, we use `StringBuilder` which is more space-efficient than repeated string concatenation.

## Common Mistakes

1. **Forgetting to check if the concatenation is still a prefix of `s`**: Some candidates only check for exact equality and forget that if `result` is no longer a prefix of `s`, adding more words can't possibly form `s`. This leads to unnecessary iterations.

2. **Not handling the case where concatenation becomes longer than `s`**: If `result.length() > s.length()`, we should return `false` immediately since adding more words will only make it longer. This is an important optimization.

3. **Using inefficient string concatenation**: In languages like Java, using `result += word` in a loop creates a new string object each time, which is O(n²). Always use `StringBuilder` in Java for repeated concatenation.

4. **Missing the requirement that `k` must be positive**: The problem states `k` must be positive, meaning we need at least one word. However, this is handled automatically since we start concatenating from the first word.

5. **Not considering empty strings in `words`**: If `words` contains empty strings, they still count as elements. Our solution handles this correctly since empty strings don't change the concatenation.

## When You'll See This Pattern

This problem uses **incremental string building with early termination**, a pattern common in string processing problems:

1. **Count Prefixes of a Given String (Easy)**: Similar concept but counting how many words are prefixes of a given string.
2. **Check If a Word Occurs As a Prefix of Any Word in a Sentence (Easy)**: Checking if a search word is a prefix of any word in a sentence.
3. **Longest Common Prefix (Easy)**: Finding the longest common prefix among strings by building incrementally and checking character by character.

The core pattern is building a result incrementally while checking conditions at each step to enable early termination when further processing can't possibly yield a valid result.

## Key Takeaways

1. **Build incrementally and check early**: When checking if a sequence of operations produces a target result, build the result step by step and check conditions at each stage. This allows early termination when the result can no longer match the target.

2. **Understand string concatenation costs**: In interview settings, be aware of the time complexity of string operations. Use `StringBuilder` in Java and consider whether you need to build the entire string or can work with indices.

3. **Prefix checking is a powerful optimization**: The `startsWith()` or equivalent method lets you quickly determine if continuing to build the string could possibly match the target, saving unnecessary computation.

Related problems: [Count Prefixes of a Given String](/problem/count-prefixes-of-a-given-string)
