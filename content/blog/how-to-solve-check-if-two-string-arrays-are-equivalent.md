---
title: "How to Solve Check If Two String Arrays are Equivalent — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If Two String Arrays are Equivalent. Easy difficulty, 86.1% acceptance rate. Topics: Array, String."
date: "2027-03-04"
category: "dsa-patterns"
tags: ["check-if-two-string-arrays-are-equivalent", "array", "string", "easy"]
---

# How to Solve "Check If Two String Arrays are Equivalent"

At first glance, this problem seems trivial: just concatenate the arrays and compare the results. However, the challenge lies in doing this efficiently without actually building the full concatenated strings, which could be memory-intensive for large inputs. The interesting part is recognizing that we can compare the arrays element by element, character by character, without ever creating the complete strings.

## Visual Walkthrough

Let's trace through an example step by step to build intuition:

**Input:** `word1 = ["ab", "c"]`, `word2 = ["a", "bc"]`

**Goal:** Check if both arrays represent the same string when concatenated.

**Step-by-step comparison:**

1. Concatenating `word1` gives us `"ab" + "c" = "abc"`
2. Concatenating `word2` gives us `"a" + "bc" = "abc"`
3. Both result in `"abc"`, so they're equivalent

But we want to avoid building those full strings. Let's think about comparing character by character:

**Character-by-character approach:**

- For `word1`: We'll track which string we're in (`"ab"`) and which character position within that string (0 = 'a')
- For `word2`: We'll track which string we're in (`"a"`) and which character position within that string (0 = 'a')
- Compare 'a' from `word1` with 'a' from `word2` → match
- Move to next character in `word1`: still in `"ab"`, position 1 = 'b'
- Move to next character in `word2`: need to move to next string `"bc"`, position 0 = 'b'
- Compare 'b' from `word1` with 'b' from `word2` → match
- Move to next character in `word1`: need to move to next string `"c"`, position 0 = 'c'
- Move to next character in `word2`: still in `"bc"`, position 1 = 'c'
- Compare 'c' from `word1` with 'c' from `word2` → match
- Both arrays exhausted → they're equivalent!

This approach never builds the full concatenated string, saving memory.

## Brute Force Approach

The most straightforward solution is to actually concatenate all strings in each array and compare the results:

<div class="code-group">

```python
# Time: O(n + m) where n = total chars in word1, m = total chars in word2
# Space: O(n + m) for storing the concatenated strings
def arrayStringsAreEqualBrute(word1, word2):
    # Concatenate all strings in word1
    str1 = ""
    for s in word1:
        str1 += s

    # Concatenate all strings in word2
    str2 = ""
    for s in word2:
        str2 += s

    # Compare the two concatenated strings
    return str1 == str2
```

```javascript
// Time: O(n + m) where n = total chars in word1, m = total chars in word2
// Space: O(n + m) for storing the concatenated strings
function arrayStringsAreEqualBrute(word1, word2) {
  // Concatenate all strings in word1
  let str1 = "";
  for (let s of word1) {
    str1 += s;
  }

  // Concatenate all strings in word2
  let str2 = "";
  for (let s of word2) {
    str2 += s;
  }

  // Compare the two concatenated strings
  return str1 === str2;
}
```

```java
// Time: O(n + m) where n = total chars in word1, m = total chars in word2
// Space: O(n + m) for storing the concatenated strings
public boolean arrayStringsAreEqualBrute(String[] word1, String[] word2) {
    // Concatenate all strings in word1
    StringBuilder str1 = new StringBuilder();
    for (String s : word1) {
        str1.append(s);
    }

    // Concatenate all strings in word2
    StringBuilder str2 = new StringBuilder();
    for (String s : word2) {
        str2.append(s);
    }

    // Compare the two concatenated strings
    return str1.toString().equals(str2.toString());
}
```

</div>

**Why this isn't optimal:** While this approach has the same time complexity as the optimal solution, it uses O(n + m) extra space to store the concatenated strings. For very large inputs (imagine arrays with thousands of strings each containing thousands of characters), this could be memory-intensive. The optimal solution achieves the same time complexity with only O(1) extra space.

## Optimal Solution

The optimal approach uses two pointers to traverse both arrays simultaneously without building the full strings. We maintain:

1. Pointers to track which string we're currently in within each array
2. Pointers to track which character we're at within the current string

<div class="code-group">

```python
# Time: O(n + m) where n = total chars in word1, m = total chars in word2
# Space: O(1) - we only use a few integer variables
def arrayStringsAreEqual(word1, word2):
    # Pointers for which string we're in for each array
    i1, i2 = 0, 0
    # Pointers for which character within the current string
    j1, j2 = 0, 0

    # Continue until we've processed all characters in both arrays
    while i1 < len(word1) and i2 < len(word2):
        # Get the current characters from both arrays
        char1 = word1[i1][j1]
        char2 = word2[i2][j2]

        # If characters don't match, arrays represent different strings
        if char1 != char2:
            return False

        # Move to next character in word1
        j1 += 1
        # If we've reached the end of current string in word1, move to next string
        if j1 == len(word1[i1]):
            i1 += 1
            j1 = 0

        # Move to next character in word2
        j2 += 1
        # If we've reached the end of current string in word2, move to next string
        if j2 == len(word2[i2]):
            i2 += 1
            j2 = 0

    # After the loop, check if we've processed all strings in both arrays
    # If one array still has characters left, they're not equivalent
    return i1 == len(word1) and i2 == len(word2)
```

```javascript
// Time: O(n + m) where n = total chars in word1, m = total chars in word2
// Space: O(1) - we only use a few integer variables
function arrayStringsAreEqual(word1, word2) {
  // Pointers for which string we're in for each array
  let i1 = 0,
    i2 = 0;
  // Pointers for which character within the current string
  let j1 = 0,
    j2 = 0;

  // Continue until we've processed all characters in both arrays
  while (i1 < word1.length && i2 < word2.length) {
    // Get the current characters from both arrays
    const char1 = word1[i1][j1];
    const char2 = word2[i2][j2];

    // If characters don't match, arrays represent different strings
    if (char1 !== char2) {
      return false;
    }

    // Move to next character in word1
    j1++;
    // If we've reached the end of current string in word1, move to next string
    if (j1 === word1[i1].length) {
      i1++;
      j1 = 0;
    }

    // Move to next character in word2
    j2++;
    // If we've reached the end of current string in word2, move to next string
    if (j2 === word2[i2].length) {
      i2++;
      j2 = 0;
    }
  }

  // After the loop, check if we've processed all strings in both arrays
  // If one array still has characters left, they're not equivalent
  return i1 === word1.length && i2 === word2.length;
}
```

```java
// Time: O(n + m) where n = total chars in word1, m = total chars in word2
// Space: O(1) - we only use a few integer variables
public boolean arrayStringsAreEqual(String[] word1, String[] word2) {
    // Pointers for which string we're in for each array
    int i1 = 0, i2 = 0;
    // Pointers for which character within the current string
    int j1 = 0, j2 = 0;

    // Continue until we've processed all characters in both arrays
    while (i1 < word1.length && i2 < word2.length) {
        // Get the current characters from both arrays
        char char1 = word1[i1].charAt(j1);
        char char2 = word2[i2].charAt(j2);

        // If characters don't match, arrays represent different strings
        if (char1 != char2) {
            return false;
        }

        // Move to next character in word1
        j1++;
        // If we've reached the end of current string in word1, move to next string
        if (j1 == word1[i1].length()) {
            i1++;
            j1 = 0;
        }

        // Move to next character in word2
        j2++;
        // If we've reached the end of current string in word2, move to next string
        if (j2 == word2[i2].length()) {
            i2++;
            j2 = 0;
        }
    }

    // After the loop, check if we've processed all strings in both arrays
    // If one array still has characters left, they're not equivalent
    return i1 == word1.length && i2 == word2.length;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m), where n is the total number of characters in `word1` and m is the total number of characters in `word2`. We need to examine each character at most once. The while loop continues until we've processed all characters in the shorter array or found a mismatch.

**Space Complexity:** O(1). We only use a constant amount of extra space for the pointer variables (`i1`, `i2`, `j1`, `j2`). This is the key advantage over the brute force approach, which requires O(n + m) space to store the concatenated strings.

## Common Mistakes

1. **Forgetting to reset character pointers when moving to the next string:** When you finish processing one string in an array and move to the next, you must reset the character pointer to 0. Forgetting this will cause an `IndexOutOfBoundsException` or similar error.

2. **Not handling empty strings correctly:** If an array contains empty strings (like `["", "a"]`), you need to properly skip over them. The solution above handles this correctly because when `j1 == len(word1[i1])` for an empty string, it immediately moves to the next string.

3. **Incorrect termination condition:** Some candidates check only if `i1 == len(word1)` or `i2 == len(word2)` but not both. You must ensure that BOTH arrays have been fully processed. If one has characters left and the other doesn't, they're not equivalent.

4. **Using string concatenation in a loop (in some languages):** In Java, using `+` for string concatenation in a loop creates a new string each time, which is O(n²) time. Always use `StringBuilder` for the brute force approach in Java.

## When You'll See This Pattern

This "two-pointer with nested iteration" pattern appears in several other problems:

1. **Merge Two Sorted Lists (LeetCode 21):** Similar pointer management where you traverse two lists simultaneously, moving pointers based on comparisons.

2. **Add Strings (LeetCode 415):** Adding two numbers represented as strings uses similar pointer logic, moving from the end to the beginning and handling carry-over.

3. **Compare Version Numbers (LeetCode 165):** You need to compare version numbers split by dots, which involves similar logic of comparing segment by segment, resetting pointers when you hit a delimiter.

The core pattern is: when you need to compare or process two sequences that have some internal structure (like strings within arrays, digits within numbers, etc.), use separate pointers for the outer sequence and inner elements.

## Key Takeaways

1. **Avoid unnecessary string building:** When comparing or processing concatenated strings, you often don't need to actually build the full concatenation. Process character by character to save memory.

2. **Master the nested pointer technique:** This problem teaches you to manage two levels of pointers - one for the outer array/list and one for the inner elements. This is a valuable pattern for many array/string problems.

3. **Always consider edge cases:** Empty strings, arrays of different lengths, and single-character strings all need to be handled correctly. Test with `[""]` vs `[""]`, `["a"]` vs `["ab"]`, and `["ab", "c"]` vs `["a", "bc"]`.

Related problems: [Check if an Original String Exists Given Two Encoded Strings](/problem/check-if-an-original-string-exists-given-two-encoded-strings)
