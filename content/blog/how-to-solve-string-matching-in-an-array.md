---
title: "How to Solve String Matching in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode String Matching in an Array. Easy difficulty, 69.8% acceptance rate. Topics: Array, String, String Matching."
date: "2028-01-29"
category: "dsa-patterns"
tags: ["string-matching-in-an-array", "array", "string", "string-matching", "easy"]
---

# How to Solve String Matching in an Array

You're given an array of strings and need to return all strings that are substrings of any other string in the array. While this sounds straightforward, the challenge lies in doing this efficiently without unnecessary repeated comparisons. The interesting part is that a string can be a substring of multiple other strings, but we only need to report it once.

## Visual Walkthrough

Let's trace through an example: `words = ["mass", "as", "hero", "superhero"]`

We need to check each word against all other words to see if it's a substring:

1. **"mass"**: Check against other words:
   - "as": "mass" contains "as"? Yes → "as" is a substring
   - "hero": "mass" contains "hero"? No
   - "superhero": "mass" contains "superhero"? No
     Result: "as" is found as substring

2. **"as"**: Check against other words:
   - "mass": "as" contains "mass"? No
   - "hero": "as" contains "hero"? No
   - "superhero": "as" contains "superhero"? No
     Result: "as" is not a substring of any other word (but we already know it's a substring of "mass")

3. **"hero"**: Check against other words:
   - "mass": "hero" contains "mass"? No
   - "as": "hero" contains "as"? No
   - "superhero": "hero" contains "superhero"? No
     Wait, but "superhero" contains "hero"! We need to check the reverse too.

4. **"superhero"**: Check against other words:
   - "mass": "superhero" contains "mass"? No
   - "as": "superhero" contains "as"? Yes → "as" is a substring (already found)
   - "hero": "superhero" contains "hero"? Yes → "hero" is a substring

Final result: `["as", "hero"]`

The key insight: For each word `A`, we need to check if there exists ANY other word `B` (where `A ≠ B`) such that `A` is a substring of `B`.

## Brute Force Approach

The most straightforward approach is to compare every pair of words. For each word `words[i]`, check if it's a substring of any other word `words[j]` where `j ≠ i`.

Why this is inefficient:

- We're doing O(n²) comparisons where n is the number of words
- Each substring check can take O(L) time where L is the length of the longer string
- Worst-case time complexity: O(n² × L) where L is the maximum string length

While this might pass for small inputs, it becomes problematic as the array grows. The brute force would look like this:

```python
def stringMatching(words):
    result = []
    n = len(words)

    for i in range(n):
        for j in range(n):
            if i != j and words[i] in words[j]:
                result.append(words[i])
                break  # Found it as substring, no need to check more j's

    return result
```

The main inefficiency is checking every pair twice and not taking advantage of the fact that if `A` is a substring of `B`, we don't need to check if `B` is a substring of `A`.

## Optimal Solution

We can optimize by sorting the words by length. A shorter word can be a substring of a longer word, but a longer word cannot be a substring of a shorter word. This allows us to reduce unnecessary comparisons.

Here's the optimal approach:

1. Sort the words by length (shortest to longest)
2. For each word at position `i`, check if it's a substring of any word at position `j > i` (longer words only)
3. If found, add to result and break (no need to check further)

<div class="code-group">

```python
# Time: O(n² × L) worst case, but optimized with sorting
# Space: O(1) excluding output, O(k) for result where k is number of substring words
def stringMatching(words):
    """
    Return all strings that are substrings of another string in the array.

    Approach:
    1. Sort words by length so shorter words come first
    2. For each word, check if it's a substring of any longer word
    3. If found, add to result and stop checking further for that word
    """
    # Sort words by length - shorter words can be substrings of longer ones
    words.sort(key=len)

    result = []
    n = len(words)

    # Check each word against all longer words
    for i in range(n):
        # For current word at index i, check all longer words (j > i)
        for j in range(i + 1, n):
            # If words[i] is a substring of words[j]
            if words[i] in words[j]:
                result.append(words[i])
                # No need to check other j's for this i
                break

    return result
```

```javascript
// Time: O(n² × L) worst case, but optimized with sorting
// Space: O(1) excluding output, O(k) for result where k is number of substring words
/**
 * Return all strings that are substrings of another string in the array.
 *
 * Approach:
 * 1. Sort words by length so shorter words come first
 * 2. For each word, check if it's a substring of any longer word
 * 3. If found, add to result and stop checking further for that word
 */
function stringMatching(words) {
  // Sort words by length - shorter words can be substrings of longer ones
  words.sort((a, b) => a.length - b.length);

  const result = [];
  const n = words.length;

  // Check each word against all longer words
  for (let i = 0; i < n; i++) {
    // For current word at index i, check all longer words (j > i)
    for (let j = i + 1; j < n; j++) {
      // If words[i] is a substring of words[j]
      if (words[j].includes(words[i])) {
        result.push(words[i]);
        // No need to check other j's for this i
        break;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n² × L) worst case, but optimized with sorting
// Space: O(1) excluding output, O(k) for result where k is number of substring words
import java.util.*;

class Solution {
    /**
     * Return all strings that are substrings of another string in the array.
     *
     * Approach:
     * 1. Sort words by length so shorter words come first
     * 2. For each word, check if it's a substring of any longer word
     * 3. If found, add to result and stop checking further for that word
     */
    public List<String> stringMatching(String[] words) {
        // Sort words by length - shorter words can be substrings of longer ones
        Arrays.sort(words, (a, b) -> a.length() - b.length());

        List<String> result = new ArrayList<>();
        int n = words.length;

        // Check each word against all longer words
        for (int i = 0; i < n; i++) {
            // For current word at index i, check all longer words (j > i)
            for (int j = i + 1; j < n; j++) {
                // If words[i] is a substring of words[j]
                if (words[j].contains(words[i])) {
                    result.add(words[i]);
                    // No need to check other j's for this i
                    break;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × L) in the worst case, where:

- `n` is the number of words
- `L` is the maximum length of any word

However, with sorting by length, we get practical optimizations:

- We only compare each word with longer words, reducing comparisons by about half
- The `in`/`contains` operation is O(L) in the worst case but often exits early
- In practice, this is much faster than the naive O(n²) all-pairs comparison

**Space Complexity:** O(1) extra space excluding the output array. The sorting is done in-place in most languages (Python's `sort()` and JavaScript's `sort()` modify the original array, Java's `Arrays.sort()` sorts in-place).

If we consider the output array, it takes O(k) space where k is the number of words that are substrings of other words.

## Common Mistakes

1. **Not handling duplicate words correctly**: If `words = ["a", "a"]`, both "a"s are substrings of each other. Our solution correctly handles this because when `i=0` and `j=1`, we find "a" in "a" and add it to results.

2. **Forgetting to break after finding a match**: Once we find that `words[i]` is a substring of some `words[j]`, we should break out of the inner loop. Continuing to check other `j` values is wasteful and could lead to duplicates if we're not careful.

3. **Comparing a word with itself**: Always ensure `i ≠ j` when comparing. In our sorted approach, we use `j > i`, which automatically avoids self-comparison.

4. **Case sensitivity**: The problem doesn't specify, but string matching is typically case-sensitive. If case-insensitive matching were required, we'd need to convert to lowercase before comparing.

5. **Empty string edge case**: An empty string is a substring of every string. If the input contains an empty string, it should be included in the output. Our solution handles this correctly since `"" in "anything"` returns `True`.

## When You'll See This Pattern

This pattern of "find relationships between elements in an array" appears in many problems:

1. **Two Sum** (Easy): Find two numbers that add up to a target. Similar in that you compare each element with others, but uses hash maps for O(n) time.

2. **Longest Word in Dictionary** (Medium): Find the longest word that can be built one letter at a time from other words in the dictionary. Uses similar substring checking logic.

3. **Substring XOR Queries** (Medium): Given binary strings and queries, find substrings with specific XOR values. More complex but involves substring searching.

4. **Find All Anagrams in a String** (Medium): Find all start indices of p's anagrams in s. Uses sliding window with frequency counting.

The core technique of sorting by a property (here, length) to reduce comparisons is useful in many optimization problems.

## Key Takeaways

1. **Sorting can simplify comparisons**: When dealing with "is A a subset/substring of B" problems, sorting by size/length often lets you only check in one direction.

2. **Early exit improves efficiency**: Once you find a word is a substring of another, stop checking it against other words. This optimization is simple but effective.

3. **Understand built-in string operations**: Knowing that `in` (Python), `includes()` (JavaScript), and `contains()` (Java) handle substring checking efficiently is crucial. Don't reinvent the wheel with manual character-by-character comparison unless necessary.

Related problems: [Substring XOR Queries](/problem/substring-xor-queries)
