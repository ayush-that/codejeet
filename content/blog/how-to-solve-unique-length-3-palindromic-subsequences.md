---
title: "How to Solve Unique Length-3 Palindromic Subsequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unique Length-3 Palindromic Subsequences. Medium difficulty, 73.8% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Prefix Sum."
date: "2027-09-11"
category: "dsa-patterns"
tags:
  ["unique-length-3-palindromic-subsequences", "hash-table", "string", "bit-manipulation", "medium"]
---

# How to Solve Unique Length-3 Palindromic Subsequences

This problem asks us to count all **unique** palindromic subsequences of length 3 in a given string `s`. What makes this problem interesting is that we need to find subsequences (not substrings), which means characters don't need to be consecutive, and we must ensure we don't double-count identical palindromes that can be formed in different ways. The challenge is to do this efficiently for strings up to length 100,000.

## Visual Walkthrough

Let's trace through an example: `s = "aabca"`

A length-3 palindrome has the form `x y x` where `x` is any character and `y` is any character (including possibly the same as `x`). So we need to find all unique pairs `(x, y)` where:

1. There are at least two occurrences of character `x` in the string
2. There's at least one occurrence of character `y` between those two `x` characters

For `s = "aabca"`:

- Character `'a'` appears at indices 0, 1, and 4
- Character `'b'` appears at index 2
- Character `'c'` appears at index 3

Let's check each possible `x`:

1. **For `x = 'a'`**: We have `'a'` at indices 0, 1, 4. The leftmost `'a'` is at index 0, rightmost at index 4. Between them (indices 1-3) we have characters `'a'`, `'b'`, `'c'`. So `'a'` can form palindromes with middle characters `'a'`, `'b'`, `'c'`. That's 3 possibilities: `"aaa"`, `"aba"`, `"aca"`.

2. **For `x = 'b'`**: Only one occurrence (index 2), so cannot form `x y x` pattern.

3. **For `x = 'c'`**: Only one occurrence (index 3), so cannot form `x y x` pattern.

Total unique palindromes: 3.

The key insight is that for each character `x`, we only need to know:

- The first occurrence of `x` (left boundary)
- The last occurrence of `x` (right boundary)
- All unique characters between these boundaries

## Brute Force Approach

A naive approach would be to:

1. Generate all possible subsequences of length 3
2. Check if each is a palindrome
3. Use a set to track unique ones

This would require checking all combinations of 3 indices: O(n³) time complexity, which is far too slow for n up to 100,000 (that's 10¹⁵ operations!).

Even a slightly better brute force would be: for each pair of indices `(i, k)` where `s[i] == s[k]`, check all possible middle indices `j` where `i < j < k`. This is still O(n²) in the worst case (when all characters are the same), which is 10¹⁰ operations - still too slow.

## Optimized Approach

The key optimization comes from recognizing that:

1. A length-3 palindrome is determined by its outer characters (which must be the same) and its middle character
2. For each character `x` that appears at least twice in the string, we can look at its **first** and **last** occurrence
3. All unique characters that appear between these two positions can serve as the middle character `y`

Why does this work? Consider character `x`:

- Any palindrome `x y x` must use one `x` from before the middle and one `x` from after the middle
- The leftmost `x` gives us the earliest possible starting point
- The rightmost `x` gives us the latest possible ending point
- Any `x` between these could also work, but they wouldn't give us any _new_ middle characters that aren't already available between the leftmost and rightmost `x`

So for each character, we only need to check the unique characters between its first and last occurrence. We can find these efficiently using prefix sums or sets.

## Optimal Solution

We'll use a two-pass approach:

1. First pass: Record the first and last occurrence of each character
2. Second pass: For each character that appears at least twice, count the unique characters between its first and last occurrence

<div class="code-group">

```python
# Time: O(26 * n) = O(n) since 26 is constant
# Space: O(26) = O(1) for storing first/last indices and character sets
def countPalindromicSubsequence(s: str) -> int:
    # Step 1: Initialize arrays to store first and last occurrence of each lowercase letter
    # We use -1 to indicate the character hasn't been seen yet
    first = [-1] * 26
    last = [-1] * 26

    # Step 2: Record first and last occurrence of each character
    for i, char in enumerate(s):
        idx = ord(char) - ord('a')  # Convert character to index 0-25
        if first[idx] == -1:        # First time seeing this character
            first[idx] = i
        last[idx] = i               # Update last occurrence (will be final position)

    # Step 3: Count unique palindromes for each character that appears at least twice
    result = 0
    for i in range(26):
        # Only process characters that appear at least twice
        if first[i] != -1 and last[i] > first[i]:
            # Use a set to track unique characters between first and last occurrence
            unique_chars = set()
            # Check each position between first and last occurrence (exclusive)
            for j in range(first[i] + 1, last[i]):
                unique_chars.add(s[j])
            # Each unique character in between can form a unique palindrome
            result += len(unique_chars)

    return result
```

```javascript
// Time: O(26 * n) = O(n) since 26 is constant
// Space: O(26) = O(1) for storing first/last indices and character sets
function countPalindromicSubsequence(s) {
  // Step 1: Initialize arrays to store first and last occurrence of each lowercase letter
  // We use -1 to indicate the character hasn't been seen yet
  const first = new Array(26).fill(-1);
  const last = new Array(26).fill(-1);

  // Step 2: Record first and last occurrence of each character
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const idx = char.charCodeAt(0) - "a".charCodeAt(0); // Convert to index 0-25
    if (first[idx] === -1) {
      // First time seeing this character
      first[idx] = i;
    }
    last[idx] = i; // Update last occurrence
  }

  // Step 3: Count unique palindromes for each character that appears at least twice
  let result = 0;
  for (let i = 0; i < 26; i++) {
    // Only process characters that appear at least twice
    if (first[i] !== -1 && last[i] > first[i]) {
      // Use a Set to track unique characters between first and last occurrence
      const uniqueChars = new Set();
      // Check each position between first and last occurrence (exclusive)
      for (let j = first[i] + 1; j < last[i]; j++) {
        uniqueChars.add(s[j]);
      }
      // Each unique character in between can form a unique palindrome
      result += uniqueChars.size;
    }
  }

  return result;
}
```

```java
// Time: O(26 * n) = O(n) since 26 is constant
// Space: O(26) = O(1) for storing first/last indices and character sets
public int countPalindromicSubsequence(String s) {
    // Step 1: Initialize arrays to store first and last occurrence of each lowercase letter
    // We use -1 to indicate the character hasn't been seen yet
    int[] first = new int[26];
    int[] last = new int[26];
    Arrays.fill(first, -1);
    Arrays.fill(last, -1);

    // Step 2: Record first and last occurrence of each character
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        int idx = c - 'a';  // Convert character to index 0-25
        if (first[idx] == -1) {  // First time seeing this character
            first[idx] = i;
        }
        last[idx] = i;  // Update last occurrence (will be final position)
    }

    // Step 3: Count unique palindromes for each character that appears at least twice
    int result = 0;
    for (int i = 0; i < 26; i++) {
        // Only process characters that appear at least twice
        if (first[i] != -1 && last[i] > first[i]) {
            // Use a boolean array to track unique characters between first and last occurrence
            boolean[] seen = new boolean[26];
            // Check each position between first and last occurrence (exclusive)
            for (int j = first[i] + 1; j < last[i]; j++) {
                char c = s.charAt(j);
                seen[c - 'a'] = true;
            }
            // Count how many unique characters we found
            for (boolean b : seen) {
                if (b) result++;
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(26 × n) = O(n)**

- First pass: O(n) to record first/last occurrences
- Second pass: For each of the 26 possible characters, we might scan up to n positions between first and last occurrence. In the worst case (e.g., `"a" * n`), we scan n positions for character 'a'. But 26 is constant, so overall O(n).

**Space Complexity: O(1)**

- We use fixed-size arrays of length 26 for first/last indices
- We use a set/array of size at most 26 to track unique characters between boundaries
- All data structures have constant size independent of input length n

## Common Mistakes

1. **Counting duplicates**: Forgetting that subsequences `"aba"` formed with different pairs of `'a'`s still count as the same palindrome. The solution avoids this by only considering the leftmost and rightmost occurrences of each character.

2. **Incorrect boundary conditions**: Using `last[i] >= first[i]` instead of `last[i] > first[i]`. If `last[i] == first[i]`, the character appears only once and cannot form a palindrome of length 3.

3. **Inefficient middle character counting**: Some candidates try to maintain all characters between boundaries for each pair, which could be O(n²). The optimal solution only needs to check between the first and last occurrence once per character.

4. **Assuming only lowercase letters**: The problem doesn't explicitly state the character set, but the examples and constraints suggest lowercase English letters. Always clarify this in an interview, but for LeetCode, we can assume 'a'-'z'.

## When You'll See This Pattern

This problem uses the **first and last occurrence tracking** pattern combined with **counting unique elements in a range**:

1. **First Unique Character in a String (LeetCode 387)**: Also uses first occurrence tracking to find characters that appear only once.

2. **Find All Anagrams in a String (LeetCode 438)**: Uses sliding window with character frequency counting, similar to how we track characters between boundaries.

3. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses first/last occurrence concepts to manage sliding windows of unique characters.

The core idea is that for problems involving character positions and ranges, tracking extreme positions (first/last) often provides enough information without needing to consider all intermediate positions.

## Key Takeaways

1. **For palindrome problems, consider the symmetry**: Length-3 palindromes have the form `x y x`, so the outer characters determine the "frame" and we just need to count possible middle characters.

2. **Extreme positions often suffice**: Instead of considering all pairs of matching characters, just look at the leftmost and rightmost occurrences. Any other pair won't give you additional middle characters.

3. **Character frequency problems often have O(1) space solutions**: When the alphabet size is fixed (like 26 lowercase letters), we can use fixed-size arrays instead of hash maps, which is more efficient.

Related problems: [Count Palindromic Subsequences](/problem/count-palindromic-subsequences)
