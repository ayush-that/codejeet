---
title: "How to Solve Check if a String Is an Acronym of Words — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if a String Is an Acronym of Words. Easy difficulty, 82.9% acceptance rate. Topics: Array, String."
date: "2027-01-10"
category: "dsa-patterns"
tags: ["check-if-a-string-is-an-acronym-of-words", "array", "string", "easy"]
---

# How to Solve "Check if a String Is an Acronym of Words"

This problem asks us to determine if a given string `s` is an acronym formed by taking the first character of each string in an array `words` and concatenating them in order. While conceptually straightforward, it tests your ability to handle edge cases and efficiently process arrays and strings—a fundamental skill for many coding interview problems.

What makes this problem interesting is its deceptive simplicity. Many candidates rush to implement a solution without considering edge cases like empty arrays, mismatched lengths, or special characters. The core challenge is to implement a clean, efficient solution that handles all scenarios correctly.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `words = ["apple", "banana", "cherry"]`, `s = "abc"`

**Step 1:** Check if the lengths match

- `words` has 3 elements, so the acronym should have 3 characters
- `s` has length 3 ✓

**Step 2:** Compare each character

- First word: "apple" → first character = "a"
- Compare with first character of `s`: "a" == "a" ✓

**Step 3:** Continue comparison

- Second word: "banana" → first character = "b"
- Compare with second character of `s`: "b" == "b" ✓

**Step 4:** Final comparison

- Third word: "cherry" → first character = "c"
- Compare with third character of `s`: "c" == "c" ✓

**Result:** All characters match, so `s = "abc"` is a valid acronym of `words`.

Now let's consider a failing case: `words = ["cat", "dog"]`, `s = "cdx"`

**Step 1:** Lengths match (both 3) ✓

**Step 2:** Compare characters

- "cat" → "c" vs "c" ✓
- "dog" → "d" vs "d" ✓
- Wait, we've run out of words but `s` has a third character "x"!
- Actually, we made a mistake: `words` has 2 elements, so acronym should be length 2
- But `s` has length 3 → immediate failure

This shows why checking lengths first is crucial.

## Brute Force Approach

The most straightforward approach is exactly what we visualized:

1. Check if the length of `s` equals the number of words
2. For each word in `words`, compare its first character with the corresponding character in `s`

While this is actually the optimal approach for this problem, let's consider what a truly naive candidate might try:

**Inefficient Alternative:** Build the entire acronym string first, then compare with `s`

```python
# Inefficient approach
def isAcronym(words, s):
    acronym = ""
    for word in words:
        acronym += word[0]  # String concatenation creates new strings
    return acronym == s
```

This approach works but is less efficient because:

- String concatenation in a loop creates new string objects at each iteration (O(n²) time in some languages)
- It uses extra memory to store the entire acronym string
- It doesn't short-circuit early when a mismatch is found

The optimal approach avoids building the full string and returns `False` as soon as any mismatch is detected.

## Optimal Solution

The optimal solution directly implements the intuitive approach with careful attention to edge cases. We'll check the length first, then compare character by character.

<div class="code-group">

```python
# Time: O(n) where n is the number of words | Space: O(1)
def isAcronym(words, s):
    """
    Check if string s is an acronym of words array.

    Args:
        words: List of strings
        s: String to check against

    Returns:
        True if s is an acronym of words, False otherwise
    """
    # Step 1: Check if the number of words matches the length of s
    # If they don't match, s cannot be an acronym
    if len(words) != len(s):
        return False

    # Step 2: Compare each character
    # Iterate through words and s simultaneously
    for i in range(len(words)):
        # Get the first character of the current word
        # words[i][0] accesses the first character of the i-th word
        word_first_char = words[i][0]

        # Get the corresponding character from s
        s_char = s[i]

        # If characters don't match, s is not an acronym
        if word_first_char != s_char:
            return False

    # Step 3: All characters matched
    # If we've checked all words and all characters matched, s is an acronym
    return True
```

```javascript
// Time: O(n) where n is the number of words | Space: O(1)
/**
 * Check if string s is an acronym of words array.
 *
 * @param {string[]} words - Array of strings
 * @param {string} s - String to check against
 * @return {boolean} True if s is an acronym of words, False otherwise
 */
function isAcronym(words, s) {
  // Step 1: Check if the number of words matches the length of s
  // If they don't match, s cannot be an acronym
  if (words.length !== s.length) {
    return false;
  }

  // Step 2: Compare each character
  // Iterate through words and s simultaneously
  for (let i = 0; i < words.length; i++) {
    // Get the first character of the current word
    // words[i][0] accesses the first character of the i-th word
    const wordFirstChar = words[i][0];

    // Get the corresponding character from s
    const sChar = s[i];

    // If characters don't match, s is not an acronym
    if (wordFirstChar !== sChar) {
      return false;
    }
  }

  // Step 3: All characters matched
  // If we've checked all words and all characters matched, s is an acronym
  return true;
}
```

```java
// Time: O(n) where n is the number of words | Space: O(1)
class Solution {
    /**
     * Check if string s is an acronym of words array.
     *
     * @param words Array of strings
     * @param s String to check against
     * @return True if s is an acronym of words, False otherwise
     */
    public boolean isAcronym(List<String> words, String s) {
        // Step 1: Check if the number of words matches the length of s
        // If they don't match, s cannot be an acronym
        if (words.size() != s.length()) {
            return false;
        }

        // Step 2: Compare each character
        // Iterate through words and s simultaneously
        for (int i = 0; i < words.size(); i++) {
            // Get the first character of the current word
            // words.get(i).charAt(0) accesses the first character of the i-th word
            char wordFirstChar = words.get(i).charAt(0);

            // Get the corresponding character from s
            char sChar = s.charAt(i);

            // If characters don't match, s is not an acronym
            if (wordFirstChar != sChar) {
                return false;
            }
        }

        // Step 3: All characters matched
        // If we've checked all words and all characters matched, s is an acronym
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of words in the array

- We perform a single pass through the `words` array
- Each iteration does constant-time operations: accessing the first character of a word and comparing it with a character from `s`
- The length check at the beginning is also O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for loop variables and character comparisons
- We don't create any additional data structures that scale with input size
- The input arrays/strings are not modified

## Common Mistakes

1. **Not checking length first:** The most common mistake is starting character comparisons without verifying that `len(words) == len(s)`. This leads to index out of bounds errors or incorrect results when lengths differ.

2. **Assuming non-empty words:** Some candidates forget that words could be empty strings. While the problem constraints typically guarantee non-empty words, it's good practice to handle this edge case. Accessing `word[0]` on an empty string would cause an error.

3. **Case sensitivity issues:** The problem doesn't specify case sensitivity, but in most programming languages, character comparisons are case-sensitive. "A" != "a". Make sure to clarify this with your interviewer if it's not specified.

4. **Building the full acronym string:** As mentioned earlier, some candidates build the entire acronym string first (`"".join(word[0] for word in words)`) and then compare. While this works, it's less efficient and doesn't short-circuit on mismatch.

## When You'll See This Pattern

This problem uses a **two-pointer/parallel iteration** pattern where you process two sequences (array of words and string) in parallel, comparing corresponding elements. This pattern appears in many problems:

1. **Merge Two Sorted Lists (Easy):** Similar parallel iteration through two lists, comparing elements to merge them in order.

2. **Valid Anagram (Easy):** While often solved with hash maps, a two-pointer approach after sorting both strings is also common.

3. **Longest Common Prefix (Easy):** Finding the common prefix among strings involves comparing characters at the same position across multiple strings.

4. **Word Abbreviation (Hard):** The related problem mentioned in the prompt builds on this concept but with more complex rules for abbreviation generation.

## Key Takeaways

1. **Always check boundary conditions first:** Before processing data, verify that the inputs have compatible sizes/lengths. This prevents index errors and can provide early exit opportunities.

2. **Short-circuit evaluation improves efficiency:** When you can determine the result early (like when lengths don't match or a character mismatch occurs), return immediately rather than processing the entire input.

3. **Simple problems test attention to detail:** Even "Easy" problems like this one separate candidates who consider edge cases from those who don't. Always think about empty inputs, single-element cases, and boundary conditions.

Related problems: [Word Abbreviation](/problem/word-abbreviation)
