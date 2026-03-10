---
title: "How to Solve Valid Anagram — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Anagram. Easy difficulty, 67.8% acceptance rate. Topics: Hash Table, String, Sorting."
date: "2026-02-12"
category: "dsa-patterns"
tags: ["valid-anagram", "hash-table", "string", "sorting", "easy"]
---

# How to Solve Valid Anagram

An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once. The core challenge here is determining whether two strings contain identical character counts, regardless of order. While conceptually simple, this problem teaches fundamental techniques for character frequency analysis that appear in countless string manipulation problems.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Suppose we have:

- `s = "anagram"`
- `t = "nagaram"`

A valid anagram requires both strings to have exactly the same characters with the same frequencies. Let's count the characters:

**String s = "anagram"**

- a: 3 occurrences
- n: 1 occurrence
- g: 1 occurrence
- r: 1 occurrence
- m: 1 occurrence

**String t = "nagaram"**

- a: 3 occurrences
- n: 1 occurrence
- g: 1 occurrence
- r: 1 occurrence
- m: 1 occurrence

Since both strings have identical character counts, they are valid anagrams. The key insight is that we don't need to check every possible rearrangement—we just need to verify the character frequencies match.

## Brute Force Approach

The most naive approach would be to generate all permutations of one string and check if any equals the other string. For a string of length n, there are n! permutations. Checking each permutation would take O(n!) time, which is astronomically slow for even moderately sized strings (10! = 3.6 million comparisons).

A slightly better but still inefficient approach would be to sort both strings and compare them:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) or O(1) depending on sorting implementation
def isAnagram(s: str, t: str) -> bool:
    # Sort both strings and compare
    return sorted(s) == sorted(t)
```

```javascript
// Time: O(n log n) | Space: O(n) or O(1) depending on sorting implementation
function isAnagram(s, t) {
  // Sort both strings and compare
  return s.split("").sort().join("") === t.split("").sort().join("");
}
```

```java
// Time: O(n log n) | Space: O(n) or O(1) depending on sorting implementation
public boolean isAnagram(String s, String t) {
    // Convert strings to char arrays, sort, and compare
    char[] sArray = s.toCharArray();
    char[] tArray = t.toCharArray();
    Arrays.sort(sArray);
    Arrays.sort(tArray);
    return Arrays.equals(sArray, tArray);
}
```

</div>

While this approach works and is actually quite concise, it has O(n log n) time complexity due to sorting. We can do better with a frequency counting approach that achieves O(n) time.

## Optimal Solution

The optimal solution uses character frequency counting. Since anagrams must have identical character counts, we can:

1. Check if the strings have different lengths (immediate disqualification)
2. Count character frequencies in the first string
3. Subtract counts using the second string
4. Verify all counts return to zero

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - The array size is fixed at 26 for lowercase English letters
def isAnagram(s: str, t: str) -> bool:
    # Early exit: different lengths can't be anagrams
    if len(s) != len(t):
        return False

    # Create a frequency array for 26 lowercase English letters
    # Index 0 represents 'a', index 1 represents 'b', etc.
    freq = [0] * 26

    # Count characters in string s
    for char in s:
        # Convert character to array index (0-25)
        # ord('a') gives us the ASCII value of 'a'
        # Subtracting ord('a') normalizes 'a' to 0, 'b' to 1, etc.
        freq[ord(char) - ord('a')] += 1

    # Subtract counts using string t
    for char in t:
        freq[ord(char) - ord('a')] -= 1

        # Early exit optimization: if any count goes negative,
        # t has more of this character than s
        if freq[ord(char) - ord('a')] < 0:
            return False

    # Final verification: all counts should be zero
    # (But we can skip this check since we already verified lengths match
    # and no counts went negative)
    return True
```

```javascript
// Time: O(n) | Space: O(1) - The array size is fixed at 26 for lowercase English letters
function isAnagram(s, t) {
  // Early exit: different lengths can't be anagrams
  if (s.length !== t.length) {
    return false;
  }

  // Create a frequency array for 26 lowercase English letters
  // Index 0 represents 'a', index 1 represents 'b', etc.
  const freq = new Array(26).fill(0);

  // Count characters in string s
  for (let i = 0; i < s.length; i++) {
    // Convert character to array index (0-25)
    // 'a'.charCodeAt(0) gives us the ASCII value of 'a'
    // Subtracting 'a'.charCodeAt(0) normalizes 'a' to 0, 'b' to 1, etc.
    const index = s.charCodeAt(i) - "a".charCodeAt(0);
    freq[index]++;
  }

  // Subtract counts using string t
  for (let i = 0; i < t.length; i++) {
    const index = t.charCodeAt(i) - "a".charCodeAt(0);
    freq[index]--;

    // Early exit optimization: if any count goes negative,
    // t has more of this character than s
    if (freq[index] < 0) {
      return false;
    }
  }

  // All counts should be zero (guaranteed by length check and no negative counts)
  return true;
}
```

```java
// Time: O(n) | Space: O(1) - The array size is fixed at 26 for lowercase English letters
public boolean isAnagram(String s, String t) {
    // Early exit: different lengths can't be anagrams
    if (s.length() != t.length()) {
        return false;
    }

    // Create a frequency array for 26 lowercase English letters
    // Index 0 represents 'a', index 1 represents 'b', etc.
    int[] freq = new int[26];

    // Count characters in string s
    for (int i = 0; i < s.length(); i++) {
        // Convert character to array index (0-25)
        // 'a' gives us the ASCII value of 'a'
        // Subtracting 'a' normalizes 'a' to 0, 'b' to 1, etc.
        freq[s.charAt(i) - 'a']++;
    }

    // Subtract counts using string t
    for (int i = 0; i < t.length(); i++) {
        int index = t.charAt(i) - 'a';
        freq[index]--;

        // Early exit optimization: if any count goes negative,
        // t has more of this character than s
        if (freq[index] < 0) {
            return false;
        }
    }

    // All counts should be zero (guaranteed by length check and no negative counts)
    return true;
}
```

</div>

**Key implementation details:**

- The `ord(char) - ord('a')` (or equivalent) calculation converts characters to array indices (0-25)
- We increment for the first string and decrement for the second
- The early negative check catches cases where `t` has extra characters not balanced by `s`
- The length check at the beginning is crucial for correctness and early optimization

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through string `s` once: O(n)
- We iterate through string `t` once: O(n)
- Total: O(n + n) = O(n), where n is the length of the strings

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers (for lowercase English letters)
- The array size doesn't grow with input size
- Even if we extend to Unicode (using a hash map), the space would be O(k) where k is the character set size, which is still constant for practical purposes

## Common Mistakes

1. **Forgetting the length check**: Candidates often jump straight into frequency counting without checking lengths first. Different lengths immediately disqualify anagrams. This check provides an O(1) early exit.

2. **Assuming lowercase letters only**: The problem statement often specifies lowercase English letters, but interviewers might ask about Unicode support. Always clarify constraints. For Unicode, use a hash map instead of a fixed array.

3. **Incorrect index calculation**: When using array indexing, `ord(char) - ord('A')` is different from `ord(char) - ord('a')`. Mixing these up leads to array index out of bounds errors or incorrect frequency tracking.

4. **Not handling empty strings**: Empty strings are valid anagrams of each other. Ensure your solution returns `true` for `s = ""` and `t = ""`.

5. **Using two separate frequency arrays**: Some candidates create two frequency arrays and compare them. This works but uses twice the space. The increment/decrement approach with a single array is more elegant.

## When You'll See This Pattern

The character frequency counting pattern appears in many string problems:

1. **Group Anagrams (Medium)**: Instead of comparing two strings, you group multiple strings by their character frequency signatures. The core technique of frequency counting is identical.

2. **Palindrome Permutation (Easy)**: Check if a string can be rearranged into a palindrome. This requires checking character frequencies—a palindrome can have at most one character with an odd count.

3. **Find All Anagrams in a String (Medium)**: Find all starting indices of anagrams of a pattern in a longer string. This uses a sliding window with frequency counting, maintaining character counts as the window moves.

4. **First Unique Character in a String (Easy)**: Find the first non-repeating character by counting frequencies and then scanning the string.

The pattern also extends beyond strings to any problem where you need to compare distributions or counts of discrete elements.

## Key Takeaways

1. **Frequency counting is a fundamental technique**: When order doesn't matter but composition does, think about counting elements. This transforms an O(n²) or O(n log n) comparison problem into O(n).

2. **Clarify character set constraints**: Always ask about the character set (ASCII, lowercase English letters, Unicode). This determines whether you can use a fixed-size array (O(1) space) or need a hash map (O(k) space).

3. **Early exits optimize runtime**: Simple checks like comparing lengths or checking for negative counts during the second pass can significantly improve average-case performance without complicating the algorithm.

4. **The increment/decrement pattern with a single array**: This elegant approach verifies anagrams by ensuring all counts return to zero, using minimal space and allowing for early termination.

Related problems: [Group Anagrams](/problem/group-anagrams), [Palindrome Permutation](/problem/palindrome-permutation), [Find All Anagrams in a String](/problem/find-all-anagrams-in-a-string)
