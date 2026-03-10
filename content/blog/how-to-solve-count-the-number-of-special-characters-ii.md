---
title: "How to Solve Count the Number of Special Characters II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Special Characters II. Medium difficulty, 43.3% acceptance rate. Topics: Hash Table, String."
date: "2028-11-15"
category: "dsa-patterns"
tags: ["count-the-number-of-special-characters-ii", "hash-table", "string", "medium"]
---

# How to Solve Count the Number of Special Characters II

This problem asks us to count letters that appear in both lowercase and uppercase in a string, with the additional constraint that **all** lowercase occurrences must come **before** the **first** uppercase occurrence. This ordering requirement makes it more interesting than simply checking for existence of both cases—we need to track positions and validate a specific sequence.

## Visual Walkthrough

Let's trace through `word = "aaAbcBC"` step by step:

**Letter 'a':**

- Lowercase 'a' appears at indices 0, 1
- Uppercase 'A' appears at index 2
- All lowercase 'a's (indices 0, 1) come before the first uppercase 'A' (index 2) ✓
- 'a' is special

**Letter 'b':**

- Lowercase 'b' appears at index 3
- Uppercase 'B' appears at index 5
- Lowercase 'b' (index 3) comes before uppercase 'B' (index 5) ✓
- 'b' is special

**Letter 'c':**

- Lowercase 'c' appears at index 4
- Uppercase 'C' appears at index 6
- Lowercase 'c' (index 4) comes before uppercase 'C' (index 6) ✓
- 'c' is special

**Letter 'B':** (already counted with 'b')
**Letter 'C':** (already counted with 'c')

Total special letters: 3

Now let's try `word = "AbcDEfGH"`:

- 'A' has uppercase at index 0 but no lowercase ✗
- 'b' has lowercase at index 1 but no uppercase ✗
- 'c' has lowercase at index 2 but no uppercase ✗
- 'D' has uppercase at index 3 but no lowercase ✗
- 'E' has uppercase at index 4 but no lowercase ✗
- 'f' has lowercase at index 5 but no uppercase ✗
- 'G' has uppercase at index 6 but no lowercase ✗
- 'H' has uppercase at index 7 but no lowercase ✗
  Total special letters: 0

## Brute Force Approach

A naive approach would be: for each letter of the alphabet, scan the string to find:

1. All lowercase positions
2. All uppercase positions
3. Check if both exist
4. Check if max(lowercase positions) < min(uppercase positions)

This requires 26 passes through the string, each taking O(n) time, resulting in O(26n) = O(n) time complexity. While this is technically linear time, it's inefficient because we're making multiple passes and not leveraging what we learn in a single pass.

A more naive brute force might try checking every pair of positions, which would be O(n²) and clearly too slow for larger inputs.

The main issue with the 26-pass approach isn't the time complexity (which is still O(n)), but that it's not the most elegant or efficient single-pass solution. Interviewers would expect you to recognize that we can gather all necessary information in one traversal.

## Optimized Approach

The key insight is that we need to track **two pieces of information per letter**:

1. **Has lowercase appeared?** (and what was the last position)
2. **Has uppercase appeared?** (and what was the first position)

We can solve this in a single pass through the string:

- For each character, determine if it's lowercase or uppercase
- For lowercase: update the "last seen lowercase" position for that letter
- For uppercase: if this is the first uppercase seen for that letter, record its position
- After processing the entire string, for each letter:
  - Check if both lowercase and uppercase exist
  - Check if the last lowercase position < first uppercase position

We need to distinguish between "no uppercase seen" and "uppercase seen at position X". We can use -1 or a large number to represent "not seen".

## Optimal Solution

We'll use two arrays of size 26 (one for each letter) to track:

- `lastLower`: Last position where lowercase letter was seen (-1 if never seen)
- `firstUpper`: First position where uppercase letter was seen (n or large number if never seen)

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size arrays of 26
def numberOfSpecialChars(word: str) -> int:
    n = len(word)
    # Initialize arrays to track positions
    # lastLower[i] = last index where lowercase letter i was seen (-1 if never)
    # firstUpper[i] = first index where uppercase letter i was seen (n if never)
    lastLower = [-1] * 26
    firstUpper = [n] * 26

    # First pass: collect position information
    for i, ch in enumerate(word):
        if 'a' <= ch <= 'z':  # lowercase letter
            idx = ord(ch) - ord('a')
            lastLower[idx] = i  # update last lowercase position
        else:  # uppercase letter
            idx = ord(ch) - ord('A')
            # Only update if this is the first uppercase occurrence
            if firstUpper[idx] == n:
                firstUpper[idx] = i

    # Count special letters
    count = 0
    for i in range(26):
        # Letter must have both lowercase and uppercase occurrences
        if lastLower[i] != -1 and firstUpper[i] != n:
            # All lowercase must come before first uppercase
            if lastLower[i] < firstUpper[i]:
                count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1) - fixed size arrays of 26
function numberOfSpecialChars(word) {
  const n = word.length;
  // Initialize arrays to track positions
  // lastLower[i] = last index where lowercase letter i was seen (-1 if never)
  // firstUpper[i] = first index where uppercase letter i was seen (n if never)
  const lastLower = new Array(26).fill(-1);
  const firstUpper = new Array(26).fill(n);

  // First pass: collect position information
  for (let i = 0; i < n; i++) {
    const ch = word[i];
    if (ch >= "a" && ch <= "z") {
      // lowercase letter
      const idx = ch.charCodeAt(0) - "a".charCodeAt(0);
      lastLower[idx] = i; // update last lowercase position
    } else {
      // uppercase letter
      const idx = ch.charCodeAt(0) - "A".charCodeAt(0);
      // Only update if this is the first uppercase occurrence
      if (firstUpper[idx] === n) {
        firstUpper[idx] = i;
      }
    }
  }

  // Count special letters
  let count = 0;
  for (let i = 0; i < 26; i++) {
    // Letter must have both lowercase and uppercase occurrences
    if (lastLower[i] !== -1 && firstUpper[i] !== n) {
      // All lowercase must come before first uppercase
      if (lastLower[i] < firstUpper[i]) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1) - fixed size arrays of 26
class Solution {
    public int numberOfSpecialChars(String word) {
        int n = word.length();
        // Initialize arrays to track positions
        // lastLower[i] = last index where lowercase letter i was seen (-1 if never)
        // firstUpper[i] = first index where uppercase letter i was seen (n if never)
        int[] lastLower = new int[26];
        int[] firstUpper = new int[26];

        // Fill with initial values
        Arrays.fill(lastLower, -1);
        Arrays.fill(firstUpper, n);

        // First pass: collect position information
        for (int i = 0; i < n; i++) {
            char ch = word.charAt(i);
            if (ch >= 'a' && ch <= 'z') {  // lowercase letter
                int idx = ch - 'a';
                lastLower[idx] = i;  // update last lowercase position
            } else {  // uppercase letter
                int idx = ch - 'A';
                // Only update if this is the first uppercase occurrence
                if (firstUpper[idx] == n) {
                    firstUpper[idx] = i;
                }
            }
        }

        // Count special letters
        int count = 0;
        for (int i = 0; i < 26; i++) {
            // Letter must have both lowercase and uppercase occurrences
            if (lastLower[i] != -1 && firstUpper[i] != n) {
                // All lowercase must come before first uppercase
                if (lastLower[i] < firstUpper[i]) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the string. We make a single pass through the string to collect position information (O(n)), then a constant-time pass through 26 letters to count special characters (O(26) = O(1)).

**Space Complexity:** O(1) because we use fixed-size arrays of length 26 regardless of input size. The space used does not grow with the input string length.

## Common Mistakes

1. **Checking only existence, not ordering:** The most common mistake is to check only if both cases exist without verifying the ordering constraint. Remember: all lowercase must come before the first uppercase.

2. **Using wrong comparison:** When checking ordering, candidates often check `lastLower[i] <= firstUpper[i]` instead of strict `<`. If a lowercase and uppercase appear at the same position (impossible in valid strings), or if the last lowercase equals the first uppercase, the condition fails.

3. **Not handling "first uppercase" correctly:** Some solutions track "last uppercase" instead of "first uppercase". We need the **first** uppercase occurrence to compare against the **last** lowercase occurrence. If any lowercase comes after the first uppercase, the letter is not special.

4. **Incorrect initialization values:** Using 0 for "not seen" causes issues because index 0 is valid. Use -1 for `lastLower` (since indices are non-negative) and n (or a large number) for `firstUpper`.

## When You'll See This Pattern

This problem uses **position tracking with two-state information**, a pattern common in string validation problems:

1. **Valid Parentheses (Easy):** Track opening and closing brackets with a stack, similar to tracking "seen" states.
2. **First Unique Character in a String (Easy):** Use frequency arrays to track character counts, then scan for the first with count = 1.
3. **Isomorphic Strings (Easy):** Track character mappings between two strings, maintaining bidirectional relationships.
4. **Greatest English Letter in Upper and Lower Case (Easy):** Directly related—finds letters existing in both cases without ordering constraints.

The core pattern is using auxiliary data structures (arrays, maps) to accumulate information during a single pass, then using that information to make decisions.

## Key Takeaways

1. **Single-pass accumulation:** When you need to check relationships between different occurrences in a sequence, consider what information you can collect in one pass to answer all questions later.

2. **Two-state tracking:** Problems often require tracking both "has this happened?" and "when did it happen?" Using separate variables or data structures for each piece of information keeps logic clean.

3. **Careful initialization:** Choose sentinel values that won't conflict with valid data. For array indices, -1 and n (or Integer.MAX_VALUE) are good choices for "not found" markers.

Related problems: [Detect Capital](/problem/detect-capital), [Greatest English Letter in Upper and Lower Case](/problem/greatest-english-letter-in-upper-and-lower-case), [Count the Number of Special Characters I](/problem/count-the-number-of-special-characters-i)
