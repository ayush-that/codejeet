---
title: "How to Solve Greatest English Letter in Upper and Lower Case — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Greatest English Letter in Upper and Lower Case. Easy difficulty, 71.9% acceptance rate. Topics: Hash Table, String, Enumeration."
date: "2028-01-16"
category: "dsa-patterns"
tags:
  ["greatest-english-letter-in-upper-and-lower-case", "hash-table", "string", "enumeration", "easy"]
---

# How to Solve Greatest English Letter in Upper and Lower Case

You're given a string containing English letters. Your task is to find the "greatest" letter that appears in both uppercase and lowercase forms within the string, returning it in uppercase. If no such letter exists, return an empty string. The "greatest" letter means the one latest in alphabetical order (Z > Y > X > ... > A).

What makes this problem interesting is that you need to track both forms of each letter efficiently while also finding the maximum. It's a good exercise in using sets or arrays to track character presence.

## Visual Walkthrough

Let's trace through an example: `s = "AbCdEfGhIjK"`

**Step 1:** We'll track which letters appear in uppercase and lowercase. Let's go through each character:

- 'A' → uppercase A appears
- 'b' → lowercase B appears
- 'C' → uppercase C appears
- 'd' → lowercase D appears
- 'E' → uppercase E appears
- 'f' → lowercase F appears
- 'G' → uppercase G appears
- 'h' → lowercase H appears
- 'I' → uppercase I appears
- 'j' → lowercase J appears
- 'K' → uppercase K appears

**Step 2:** Now check which letters have both forms:

- A: only uppercase ✓, lowercase ✗ → no
- B: uppercase ✗, lowercase ✓ → no
- C: uppercase ✓, lowercase ✗ → no
- D: uppercase ✗, lowercase ✓ → no
- E: uppercase ✓, lowercase ✗ → no
- F: uppercase ✗, lowercase ✓ → no
- G: uppercase ✓, lowercase ✗ → no
- H: uppercase ✗, lowercase ✓ → no
- I: uppercase ✓, lowercase ✗ → no
- J: uppercase ✗, lowercase ✓ → no
- K: uppercase ✓, lowercase ✗ → no

No letter has both forms, so we return `""`.

Let's try another example: `s = "aAbBcCdDeE"`

**Step 1:** Track appearances:

- 'a' → lowercase A appears
- 'A' → uppercase A appears
- 'b' → lowercase B appears
- 'B' → uppercase B appears
- 'c' → lowercase C appears
- 'C' → uppercase C appears
- 'd' → lowercase D appears
- 'D' → uppercase D appears
- 'e' → lowercase E appears
- 'E' → uppercase E appears

**Step 2:** Check which have both forms:

- A: uppercase ✓, lowercase ✓ → YES
- B: uppercase ✓, lowercase ✓ → YES
- C: uppercase ✓, lowercase ✓ → YES
- D: uppercase ✓, lowercase ✓ → YES
- E: uppercase ✓, lowercase ✓ → YES

**Step 3:** Find the greatest (latest alphabetically): E is greater than D, C, B, A. So we return `"E"`.

## Brute Force Approach

A brute force approach would be to check every letter from Z down to A, and for each letter, scan the entire string to see if both its uppercase and lowercase forms exist. This involves:

1. Starting from 'Z' down to 'A'
2. For each letter, scanning the entire string to check for both forms
3. Returning the first letter (from Z downward) that has both forms

This approach has O(26 × n) = O(n) time complexity, which is actually acceptable since 26 is constant. However, it's inefficient because we scan the string up to 26 times. A better approach would track letter appearances in a single pass.

## Optimal Solution

The optimal solution uses two boolean arrays or sets to track which uppercase and lowercase letters appear. Since there are only 26 letters, we can use arrays of size 26 for efficiency. After tracking appearances, we check from Z to A to find the greatest letter with both forms present.

<div class="code-group">

```python
# Time: O(n) - we make one pass through the string
# Space: O(1) - we use fixed-size arrays of 26 booleans
def greatestLetter(s: str) -> str:
    # Track which uppercase and lowercase letters appear
    # Arrays of size 26 for A-Z and a-z
    uppercase_seen = [False] * 26
    lowercase_seen = [False] * 26

    # Step 1: Mark all letters that appear in the string
    for char in s:
        if 'A' <= char <= 'Z':
            # Convert uppercase letter to index 0-25
            index = ord(char) - ord('A')
            uppercase_seen[index] = True
        elif 'a' <= char <= 'z':
            # Convert lowercase letter to index 0-25
            index = ord(char) - ord('a')
            lowercase_seen[index] = True

    # Step 2: Check from Z to A (largest to smallest)
    # We check from 25 down to 0 because Z has index 25, A has index 0
    for i in range(25, -1, -1):
        # If both uppercase and lowercase forms exist
        if uppercase_seen[i] and lowercase_seen[i]:
            # Convert index back to uppercase letter
            return chr(ord('A') + i)

    # Step 3: If no letter has both forms, return empty string
    return ""
```

```javascript
// Time: O(n) - we make one pass through the string
// Space: O(1) - we use fixed-size arrays of 26 booleans
function greatestLetter(s) {
  // Track which uppercase and lowercase letters appear
  // Arrays of size 26 for A-Z and a-z
  const uppercaseSeen = new Array(26).fill(false);
  const lowercaseSeen = new Array(26).fill(false);

  // Step 1: Mark all letters that appear in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char >= "A" && char <= "Z") {
      // Convert uppercase letter to index 0-25
      const index = char.charCodeAt(0) - "A".charCodeAt(0);
      uppercaseSeen[index] = true;
    } else if (char >= "a" && char <= "z") {
      // Convert lowercase letter to index 0-25
      const index = char.charCodeAt(0) - "a".charCodeAt(0);
      lowercaseSeen[index] = true;
    }
  }

  // Step 2: Check from Z to A (largest to smallest)
  // We check from 25 down to 0 because Z has index 25, A has index 0
  for (let i = 25; i >= 0; i--) {
    // If both uppercase and lowercase forms exist
    if (uppercaseSeen[i] && lowercaseSeen[i]) {
      // Convert index back to uppercase letter
      return String.fromCharCode("A".charCodeAt(0) + i);
    }
  }

  // Step 3: If no letter has both forms, return empty string
  return "";
}
```

```java
// Time: O(n) - we make one pass through the string
// Space: O(1) - we use fixed-size arrays of 26 booleans
class Solution {
    public String greatestLetter(String s) {
        // Track which uppercase and lowercase letters appear
        // Arrays of size 26 for A-Z and a-z
        boolean[] uppercaseSeen = new boolean[26];
        boolean[] lowercaseSeen = new boolean[26];

        // Step 1: Mark all letters that appear in the string
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                // Convert uppercase letter to index 0-25
                int index = c - 'A';
                uppercaseSeen[index] = true;
            } else if (c >= 'a' && c <= 'z') {
                // Convert lowercase letter to index 0-25
                int index = c - 'a';
                lowercaseSeen[index] = true;
            }
        }

        // Step 2: Check from Z to A (largest to smallest)
        // We check from 25 down to 0 because Z has index 25, A has index 0
        for (int i = 25; i >= 0; i--) {
            // If both uppercase and lowercase forms exist
            if (uppercaseSeen[i] && lowercaseSeen[i]) {
                // Convert index back to uppercase letter
                return String.valueOf((char) ('A' + i));
            }
        }

        // Step 3: If no letter has both forms, return empty string
        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input string. We make a single pass through the string to mark which letters appear, then a constant-time pass through 26 letters to find the greatest one with both forms.

**Space Complexity:** O(1) because we use fixed-size arrays of 26 booleans each. The space doesn't grow with input size.

## Common Mistakes

1. **Forgetting to check from Z to A:** Some candidates check from A to Z and return the first match, but this would give the smallest letter, not the greatest. Always remember that "greatest" means latest in alphabetical order.

2. **Not handling non-letter characters:** While the problem states the string contains English letters, defensive programming is good practice. Our solution checks character ranges to ensure we only process valid letters.

3. **Using inefficient data structures:** Some candidates use sets or maps without realizing arrays are more efficient for fixed, small alphabets. With only 26 possible values, arrays provide O(1) access and minimal overhead.

4. **Returning lowercase instead of uppercase:** The problem specifically asks for the result in uppercase. Always double-check output format requirements.

## When You'll See This Pattern

This problem uses the **character frequency/counting pattern** with a fixed alphabet size. You'll see similar patterns in:

1. **Valid Anagram (LeetCode 242):** Uses character counting arrays to compare if two strings are anagrams.
2. **First Unique Character in a String (LeetCode 387):** Uses frequency arrays to find the first non-repeating character.
3. **Find the Difference (LeetCode 389):** Uses character counting to find the extra character added to a string.

The key insight is that when dealing with a fixed set of characters (like 26 English letters), arrays indexed by character codes are more efficient than hash maps.

## Key Takeaways

1. **Use arrays for fixed alphabets:** When you have a known, limited set of possible characters (like 26 letters), boolean or integer arrays indexed by character code are more space and time efficient than hash maps.

2. **Pay attention to iteration order:** The direction of iteration matters when finding "maximum" or "minimum" values. For "greatest," iterate from the end; for "smallest," iterate from the beginning.

3. **Convert between characters and indices:** Learn the pattern `char - 'A'` for uppercase and `char - 'a'` for lowercase to convert characters to 0-25 indices, and `'A' + index` to convert back.

Related problems: [Count the Number of Special Characters II](/problem/count-the-number-of-special-characters-ii), [Count the Number of Special Characters I](/problem/count-the-number-of-special-characters-i)
