---
title: "How to Solve Merge Strings Alternately — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Merge Strings Alternately. Easy difficulty, 82.1% acceptance rate. Topics: Two Pointers, String."
date: "2026-05-30"
category: "dsa-patterns"
tags: ["merge-strings-alternately", "two-pointers", "string", "easy"]
---

# How to Solve Merge Strings Alternately

You're given two strings and need to merge them by alternating characters, starting with the first string. If one string is longer, you append its remaining characters at the end. While this problem seems straightforward, it's an excellent introduction to **two-pointer string manipulation**—a pattern that appears in many more complex problems. The challenge lies in cleanly handling the different lengths without messy conditional logic.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `word1 = "abc"`
- `word2 = "pqrst"`

We'll merge them by alternating characters:

1. Start with `word1[0] = "a"` → merged = `"a"`
2. Add `word2[0] = "p"` → merged = `"ap"`
3. Add `word1[1] = "b"` → merged = `"apb"`
4. Add `word2[1] = "q"` → merged = `"apbq"`
5. Add `word1[2] = "c"` → merged = `"apbqc"`
6. Now `word1` is exhausted, but `word2` still has `"rst"` remaining
7. Append the rest of `word2` → merged = `"apbqcrst"`

Notice the pattern: we take one character from each string in turn until we run out of characters in one string, then we append whatever remains from the longer string.

## Brute Force Approach

For this problem, there isn't really a "brute force" in the traditional sense of trying all possibilities. However, a naive approach might involve:

1. Creating an empty result string
2. Using nested loops or complex index tracking
3. Handling the length mismatch with multiple separate loops

A suboptimal implementation might look like this:

```python
def mergeAlternately(word1, word2):
    result = ""
    i = 0

    # First handle the overlapping part
    while i < len(word1) and i < len(word2):
        result += word1[i] + word2[i]
        i += 1

    # Then handle remaining characters in word1
    while i < len(word1):
        result += word1[i]
        i += 1

    # Then handle remaining characters in word2
    while i < len(word2):
        result += word2[i]
        i += 1

    return result
```

While this works, it's verbose and uses three separate loops. The optimal solution uses a cleaner approach with a single loop and careful index management.

## Optimal Solution

The optimal approach uses **two pointers** (or indices) to track our position in each string. We iterate through both strings simultaneously, appending characters in alternating order until we reach the end of the shorter string. Then we append the remaining characters from the longer string.

<div class="code-group">

```python
# Time: O(n + m) where n = len(word1), m = len(word2)
# Space: O(n + m) for the result string
def mergeAlternately(word1, word2):
    # Initialize pointers for both strings
    i, j = 0, 0
    # Get lengths to avoid repeated function calls
    n, m = len(word1), len(word2)
    # Initialize result list (more efficient than string concatenation)
    result = []

    # Loop while both pointers are within bounds
    while i < n and j < m:
        # Append character from word1, then word2
        result.append(word1[i])
        result.append(word2[j])
        # Move both pointers forward
        i += 1
        j += 1

    # If word1 has remaining characters, append them all
    while i < n:
        result.append(word1[i])
        i += 1

    # If word2 has remaining characters, append them all
    while j < m:
        result.append(word2[j])
        j += 1

    # Join the list into a single string
    return ''.join(result)
```

```javascript
// Time: O(n + m) where n = word1.length, m = word2.length
// Space: O(n + m) for the result string
function mergeAlternately(word1, word2) {
  // Initialize pointers for both strings
  let i = 0,
    j = 0;
  // Get lengths for efficiency
  const n = word1.length,
    m = word2.length;
  // Initialize result array (more efficient than string concatenation)
  const result = [];

  // Loop while both pointers are within bounds
  while (i < n && j < m) {
    // Append character from word1, then word2
    result.push(word1[i]);
    result.push(word2[j]);
    // Move both pointers forward
    i++;
    j++;
  }

  // If word1 has remaining characters, append them all
  while (i < n) {
    result.push(word1[i]);
    i++;
  }

  // If word2 has remaining characters, append them all
  while (j < m) {
    result.push(word2[j]);
    j++;
  }

  // Join the array into a single string
  return result.join("");
}
```

```java
// Time: O(n + m) where n = word1.length(), m = word2.length()
// Space: O(n + m) for the result string
public String mergeAlternately(String word1, String word2) {
    // Initialize pointers for both strings
    int i = 0, j = 0;
    // Get lengths for efficiency
    int n = word1.length(), m = word2.length();
    // StringBuilder is more efficient than string concatenation
    StringBuilder result = new StringBuilder();

    // Loop while both pointers are within bounds
    while (i < n && j < m) {
        // Append character from word1, then word2
        result.append(word1.charAt(i));
        result.append(word2.charAt(j));
        // Move both pointers forward
        i++;
        j++;
    }

    // If word1 has remaining characters, append them all
    while (i < n) {
        result.append(word1.charAt(i));
        i++;
    }

    // If word2 has remaining characters, append them all
    while (j < m) {
        result.append(word2.charAt(j));
        j++;
    }

    // Convert StringBuilder to String
    return result.toString();
}
```

</div>

**Key implementation details:**

1. **Using lists/arrays/StringBuilder**: Direct string concatenation in a loop is O(n²) in many languages because strings are immutable. Building a list/array and joining once is O(n).
2. **Separate loops for remaining characters**: After the alternating loop, we need two separate loops (not an `if-else`) because either string could be longer.
3. **Pointer movement**: We increment `i` and `j` independently—this is crucial for handling different lengths.

## Complexity Analysis

**Time Complexity: O(n + m)**

- We visit each character exactly once from both strings
- The while loops run a total of (n + m) iterations
- The final join/concatenation is also O(n + m)

**Space Complexity: O(n + m)**

- We store the result string which has length (n + m)
- The auxiliary space for lists/arrays/StringBuilder is also O(n + m)
- We use O(1) extra space for pointers and lengths

## Common Mistakes

1. **Using string concatenation in a loop**:

   ```python
   # BAD: O(n²) time
   result = ""
   for i in range(min(len(word1), len(word2))):
       result += word1[i] + word2[i]  # New string created each time!
   ```

   **Fix**: Use list comprehension or StringBuilder.

2. **Incorrect alternating order**:
   Some candidates append `word2[j]` before `word1[i]`, reversing the required order. Always start with `word1` as specified.

3. **Forgetting to handle unequal lengths**:

   ```python
   # BAD: Only handles equal lengths
   for i in range(min(len(word1), len(word2))):
       result.append(word1[i])
       result.append(word2[i])
   # Missing: append remaining characters
   ```

   **Fix**: Add the two cleanup loops after the main alternating loop.

4. **Off-by-one errors with indices**:
   Using `<=` instead of `<` when comparing indices to lengths can cause IndexOutOfBounds exceptions. Remember: strings are 0-indexed, so valid indices are `0` to `length-1`.

## When You'll See This Pattern

The two-pointer string merging pattern appears in many problems:

1. **Zigzag Iterator (Medium)**: Instead of two strings, you have two lists, but the alternating pattern is identical. The solution extends naturally to k lists.

2. **Merge Sorted Array (Easy)**: While merging sorted arrays uses a similar two-pointer approach, the comparison logic differs (comparing values vs. alternating regardless of value).

3. **Add Strings (Easy)**: Adds two numbers represented as strings digit by digit, handling carry-over—similar pointer movement but with arithmetic.

4. **Longest Common Prefix (Easy)**: Compares characters at the same position across multiple strings until a mismatch is found.

## Key Takeaways

1. **Two-pointer string traversal** is a fundamental pattern for problems that require processing multiple sequences simultaneously. The pointers can move at the same rate (like here) or different rates (like in slow-fast pointer problems).

2. **Handle edge cases early**: Always consider what happens when inputs have different lengths, are empty, or have special characters. Write test cases for: empty strings, one-character strings, strings of equal length, and strings with very different lengths.

3. **Choose the right data structure for building strings**: In interviews, always mention why you're using StringBuilder (Java), list+join (Python/JavaScript), or similar constructs instead of direct concatenation.

Related problems: [Zigzag Iterator](/problem/zigzag-iterator), [Minimum Additions to Make Valid String](/problem/minimum-additions-to-make-valid-string)
