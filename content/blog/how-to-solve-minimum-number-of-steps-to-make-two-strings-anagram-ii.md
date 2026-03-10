---
title: "How to Solve Minimum Number of Steps to Make Two Strings Anagram II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Steps to Make Two Strings Anagram II. Medium difficulty, 73.0% acceptance rate. Topics: Hash Table, String, Counting."
date: "2028-06-11"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-steps-to-make-two-strings-anagram-ii",
    "hash-table",
    "string",
    "counting",
    "medium",
  ]
---

# How to Solve Minimum Number of Steps to Make Two Strings Anagram II

This problem asks us to find the minimum number of character append operations needed to make two strings anagrams of each other. What makes this interesting is that unlike the simpler version where we can only delete characters, here we can only append characters to either string. This changes the counting logic significantly - we need to think about what characters are missing from each string rather than what needs to be removed.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `s = "leetcode"` and `t = "coats"`.

**Step 1: Count characters in each string**

- `s = "leetcode"`: l:1, e:3, t:1, c:1, o:1, d:1
- `t = "coats"`: c:1, o:1, a:1, t:1, s:1

**Step 2: Compare counts for each character**
We need to consider all characters that appear in either string:

- Character 'l': s has 1, t has 0 → t needs 1 'l'
- Character 'e': s has 3, t has 0 → t needs 3 'e's
- Character 't': s has 1, t has 1 → balanced (no changes needed)
- Character 'c': s has 1, t has 1 → balanced
- Character 'o': s has 1, t has 1 → balanced
- Character 'd': s has 1, t has 0 → t needs 1 'd'
- Character 'a': s has 0, t has 1 → s needs 1 'a'
- Character 's': s has 0, t has 1 → s needs 1 's'

**Step 3: Calculate total operations**

- To fix t: need 1 'l' + 3 'e's + 1 'd' = 5 appends to t
- To fix s: need 1 'a' + 1 's' = 2 appends to s
- Total operations: 5 + 2 = 7

We can verify this makes sense: After 7 appends, both strings will have the same character frequencies.

## Brute Force Approach

A naive approach might try to simulate the process: repeatedly check which characters are missing and append them. However, this would be extremely inefficient. Another brute force approach would be to generate all possible strings we could create by appending characters, then check which ones are anagrams - but this is exponential in complexity.

The key insight is that we don't need to simulate the process. We just need to calculate the difference in character frequencies between the two strings. For each character that appears in either string, if one string has more of that character than the other, the string with fewer occurrences needs additional copies appended.

## Optimized Approach

The optimal solution uses character counting with frequency arrays or hash maps:

1. **Count character frequencies** for both strings separately
2. **For each character** (considering all 26 lowercase English letters or all possible characters):
   - Calculate the absolute difference between the counts in `s` and `t`
   - This difference represents how many of that character need to be appended to one string or the other
3. **Sum all differences** to get the total number of append operations needed

Why does this work? For two strings to be anagrams, they must have identical character frequencies. If `s` has `count_s[c]` of character `c` and `t` has `count_t[c]`, then:

- If `count_s[c] > count_t[c]`: we need to append `(count_s[c] - count_t[c])` copies of `c` to `t`
- If `count_t[c] > count_s[c]`: we need to append `(count_t[c] - count_s[c])` copies of `c` to `s`
- The total for character `c` is `|count_s[c] - count_t[c]|`

Summing this for all characters gives us the total number of append operations.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = len(s), m = len(t)
# Space: O(1) since we use fixed-size arrays of 26 elements
def minSteps(s: str, t: str) -> int:
    # Step 1: Initialize frequency arrays for 26 lowercase letters
    # We use arrays instead of hash maps for O(1) space and faster access
    freq_s = [0] * 26
    freq_t = [0] * 26

    # Step 2: Count character frequencies in string s
    # Convert each character to 0-25 index by subtracting 'a'
    for char in s:
        freq_s[ord(char) - ord('a')] += 1

    # Step 3: Count character frequencies in string t
    for char in t:
        freq_t[ord(char) - ord('a')] += 1

    # Step 4: Calculate total steps needed
    steps = 0
    # Check all 26 possible lowercase letters
    for i in range(26):
        # The absolute difference tells us how many of this character
        # need to be appended to one string or the other
        steps += abs(freq_s[i] - freq_t[i])

    return steps
```

```javascript
// Time: O(n + m) where n = s.length, m = t.length
// Space: O(1) since we use fixed-size arrays of 26 elements
function minSteps(s, t) {
  // Step 1: Initialize frequency arrays for 26 lowercase letters
  // Using arrays is more efficient than objects for this use case
  const freqS = new Array(26).fill(0);
  const freqT = new Array(26).fill(0);

  // Step 2: Count character frequencies in string s
  // charCodeAt() returns ASCII code, subtract 'a'.charCodeAt(0) to get 0-25
  for (let i = 0; i < s.length; i++) {
    const index = s.charCodeAt(i) - "a".charCodeAt(0);
    freqS[index]++;
  }

  // Step 3: Count character frequencies in string t
  for (let i = 0; i < t.length; i++) {
    const index = t.charCodeAt(i) - "a".charCodeAt(0);
    freqT[index]++;
  }

  // Step 4: Calculate total steps needed
  let steps = 0;
  // Check all 26 possible lowercase letters
  for (let i = 0; i < 26; i++) {
    // Absolute difference gives number of appends needed for this character
    steps += Math.abs(freqS[i] - freqT[i]);
  }

  return steps;
}
```

```java
// Time: O(n + m) where n = s.length(), m = t.length()
// Space: O(1) since we use fixed-size arrays of 26 elements
public int minSteps(String s, String t) {
    // Step 1: Initialize frequency arrays for 26 lowercase letters
    // Using int arrays is efficient and avoids autoboxing overhead
    int[] freqS = new int[26];
    int[] freqT = new int[26];

    // Step 2: Count character frequencies in string s
    // Convert char to array index by subtracting 'a'
    for (char c : s.toCharArray()) {
        freqS[c - 'a']++;
    }

    // Step 3: Count character frequencies in string t
    for (char c : t.toCharArray()) {
        freqT[c - 'a']++;
    }

    // Step 4: Calculate total steps needed
    int steps = 0;
    // Check all 26 possible lowercase letters
    for (int i = 0; i < 26; i++) {
        // Math.abs gives the number of this character that need to be appended
        steps += Math.abs(freqS[i] - freqT[i]);
    }

    return steps;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)** where n is the length of string `s` and m is the length of string `t`. We iterate through each string once to count character frequencies (O(n + m)), then iterate through 26 characters to calculate differences (O(26) = O(1)). The dominant term is O(n + m).

**Space Complexity: O(1)** because we use fixed-size arrays of 26 integers regardless of input size. Even if we used hash maps, the space would still be O(1) since there are only 26 possible lowercase English letters. The space doesn't grow with input size.

## Common Mistakes

1. **Forgetting to consider characters that only appear in one string**: Some candidates only check characters that appear in both strings, but we need to consider all 26 possible lowercase letters (or all characters in the character set). Characters that appear in only one string still contribute to the difference.

2. **Using the wrong operation**: This problem is different from "Minimum Number of Steps to Make Two Strings Anagram" where you can only delete characters. Here we can only append. The formula is the same (absolute difference of counts), but the reasoning is different. Make sure you understand why: deletions would require removing excess characters, while appends require adding missing characters.

3. **Incorrect character indexing**: When converting characters to array indices, forgetting to subtract 'a' (or the appropriate base character) is a common off-by-one error. Always test with 'a' (should give index 0) and 'z' (should give index 25).

4. **Overcomplicating with simulation**: Some candidates try to actually simulate the append process or use two-pointer techniques. This is unnecessary and inefficient. The mathematical approach using frequency differences is both simpler and more efficient.

## When You'll See This Pattern

This frequency counting pattern appears in many string and anagram problems:

1. **Valid Anagram (Easy)**: Check if two strings are anagrams by comparing character frequencies.
2. **Group Anagrams (Medium)**: Group strings that are anagrams of each other using character frequency maps as keys.
3. **Find All Anagrams in a String (Medium)**: Use sliding window with frequency counting to find all anagram substrings.
4. **Minimum Number of Steps to Make Two Strings Anagram (Medium)**: The simpler version of this problem where you can only delete characters.

The core technique is using character frequency counts to compare strings without having to compare every permutation. This transforms what seems like a combinatorial problem into a simple counting problem.

## Key Takeaways

1. **Character frequency counting** is a powerful technique for string comparison problems, especially those involving anagrams. It reduces O(n!) permutation checks to O(n) counting operations.

2. **Absolute difference of counts** gives the minimum operations needed to balance two frequency distributions, whether through additions or deletions. The same mathematical principle applies to both versions of this problem.

3. **Fixed-size arrays** are often better than hash maps when the character set is small and known (like 26 lowercase letters). They offer O(1) access with less overhead than hash maps.

Related problems: [Minimum Number of Steps to Make Two Strings Anagram](/problem/minimum-number-of-steps-to-make-two-strings-anagram)
