---
title: "How to Solve Check Whether Two Strings are Almost Equivalent — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check Whether Two Strings are Almost Equivalent. Easy difficulty, 64.1% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-11-12"
category: "dsa-patterns"
tags:
  ["check-whether-two-strings-are-almost-equivalent", "hash-table", "string", "counting", "easy"]
---

# How to Solve "Check Whether Two Strings are Almost Equivalent"

This problem asks us to determine if two strings are "almost equivalent" by comparing the frequency differences of each letter between them. The tricky part isn't the algorithm itself—it's straightforward counting—but rather understanding exactly what "at most 3" means and implementing clean, efficient code that handles all edge cases correctly.

## Visual Walkthrough

Let's walk through an example: `word1 = "abcde"`, `word2 = "aabbc"`

**Step 1: Count frequencies for each string**

- For `word1`: a→1, b→1, c→1, d→1, e→1
- For `word2`: a→2, b→2, c→1, d→0, e→0

**Step 2: Calculate absolute differences for each letter**

- 'a': |1 - 2| = 1
- 'b': |1 - 2| = 1
- 'c': |1 - 1| = 0
- 'd': |1 - 0| = 1
- 'e': |1 - 0| = 1

**Step 3: Check if any difference exceeds 3**
All differences (1, 1, 0, 1, 1) are ≤ 3, so the strings are almost equivalent.

Now consider `word1 = "aaaa"`, `word2 = "a"`:

- 'a': |4 - 1| = 3 (still okay, since ≤ 3)
- All other letters: |0 - 0| = 0
  Result: Almost equivalent.

Finally, `word1 = "aaaa"`, `word2 = ""`:

- 'a': |4 - 0| = 4 (exceeds 3)
  Result: NOT almost equivalent.

The key insight: We need to check **all 26 letters**, not just the letters that appear in either string, because letters with zero frequency in both strings have difference 0, which is fine.

## Brute Force Approach

A naive approach might try to compare the strings directly without counting frequencies first. For example, someone might try to sort both strings and compare them character by character, but this wouldn't work because:

1. The order doesn't matter, only frequencies matter
2. We need to compare frequencies of specific letters, not just overall string similarity

Another brute force approach would be: For each letter from 'a' to 'z', count its occurrences in both strings by scanning each string completely. This would work but is inefficient:

```python
# Inefficient brute force
def checkAlmostEquivalent_brute(word1, word2):
    for char in 'abcdefghijklmnopqrstuvwxyz':
        count1 = 0
        count2 = 0
        # Count in word1
        for c in word1:
            if c == char:
                count1 += 1
        # Count in word2
        for c in word2:
            if c == char:
                count2 += 1
        if abs(count1 - count2) > 3:
            return False
    return True
```

This approach has O(26 × n) time complexity, which simplifies to O(n) but with a large constant factor. More importantly, it scans each string 26 times! We can do much better.

## Optimal Solution

The optimal approach uses frequency counting arrays or hash maps to count all letters in one pass per string, then compares the counts. Since we only have lowercase English letters, a fixed-size array of 26 integers is perfect—it's more efficient than a hash map for this specific case.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed 26-element array
def checkAlmostEquivalent(word1: str, word2: str) -> bool:
    # Step 1: Initialize frequency arrays for 26 lowercase letters
    # Index 0 represents 'a', index 1 represents 'b', ..., index 25 represents 'z'
    freq1 = [0] * 26
    freq2 = [0] * 26

    # Step 2: Count frequencies in word1
    # For each character, convert to 0-25 index by subtracting ord('a')
    for char in word1:
        index = ord(char) - ord('a')  # 'a' -> 0, 'b' -> 1, etc.
        freq1[index] += 1

    # Step 3: Count frequencies in word2
    for char in word2:
        index = ord(char) - ord('a')
        freq2[index] += 1

    # Step 4: Check differences for all 26 letters
    # We must check ALL letters, not just those present in either string
    for i in range(26):
        # Calculate absolute difference between frequencies
        diff = abs(freq1[i] - freq2[i])
        # If any difference exceeds 3, strings are not almost equivalent
        if diff > 3:
            return False

    # Step 5: All differences are ≤ 3
    return True
```

```javascript
// Time: O(n) | Space: O(1) - fixed 26-element array
function checkAlmostEquivalent(word1, word2) {
  // Step 1: Initialize frequency arrays for 26 lowercase letters
  const freq1 = new Array(26).fill(0);
  const freq2 = new Array(26).fill(0);

  // Step 2: Count frequencies in word1
  // charCodeAt() returns Unicode code point, 'a' is 97
  for (let char of word1) {
    const index = char.charCodeAt(0) - "a".charCodeAt(0);
    freq1[index]++;
  }

  // Step 3: Count frequencies in word2
  for (let char of word2) {
    const index = char.charCodeAt(0) - "a".charCodeAt(0);
    freq2[index]++;
  }

  // Step 4: Check differences for all 26 letters
  for (let i = 0; i < 26; i++) {
    // Calculate absolute difference
    const diff = Math.abs(freq1[i] - freq2[i]);
    // If any difference exceeds 3, return false immediately
    if (diff > 3) {
      return false;
    }
  }

  // Step 5: All differences are within limit
  return true;
}
```

```java
// Time: O(n) | Space: O(1) - fixed 26-element array
class Solution {
    public boolean checkAlmostEquivalent(String word1, String word2) {
        // Step 1: Initialize frequency arrays for 26 lowercase letters
        int[] freq1 = new int[26];
        int[] freq2 = new int[26];

        // Step 2: Count frequencies in word1
        // charAt() returns character, subtracting 'a' gives 0-25 index
        for (int i = 0; i < word1.length(); i++) {
            char c = word1.charAt(i);
            int index = c - 'a';  // 'a' - 'a' = 0, 'b' - 'a' = 1, etc.
            freq1[index]++;
        }

        // Step 3: Count frequencies in word2
        for (int i = 0; i < word2.length(); i++) {
            char c = word2.charAt(i);
            int index = c - 'a';
            freq2[index]++;
        }

        // Step 4: Check differences for all 26 letters
        for (int i = 0; i < 26; i++) {
            // Math.abs() gives absolute difference
            int diff = Math.abs(freq1[i] - freq2[i]);
            // If any difference exceeds 3, return false immediately
            if (diff > 3) {
                return false;
            }
        }

        // Step 5: All differences are within limit
        return true;
    }
}
```

</div>

**Why this solution works:**

1. **Fixed-size array**: We know we only have lowercase English letters, so 26 slots suffice.
2. **Single pass per string**: We count all characters in each string with one linear scan.
3. **Check all letters**: We iterate through all 26 indices, not just letters that appear. This handles cases where a letter appears in only one string.
4. **Early exit**: As soon as we find a difference > 3, we return false. We don't need to check remaining letters.

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies in `word1`: O(n) where n is the length of the string
- Counting frequencies in `word2`: O(n)
- Comparing 26 frequency differences: O(26) = O(1)
- Total: O(n + n + 26) = O(n)

**Space Complexity: O(1)**

- We use two fixed-size arrays of 26 integers each
- Regardless of input size, we allocate exactly 52 integers (104 bytes typically)
- This is constant space, not dependent on input size n

## Common Mistakes

1. **Only checking letters that appear in either string**: This misses the case where we need to verify that letters not in either string have difference 0. For example, if `word1 = "zzzz"` and `word2 = "zzzz"`, all letters from 'a' to 'y' have frequency 0 in both, which is fine. But if you only check 'z', you might incorrectly think you need to check other letters.

2. **Using a single frequency array and adding/subtracting**: Some candidates try to use one array: increment for `word1`, decrement for `word2`, then check absolute values. This works, but be careful with negative values when taking absolute difference:

   ```python
   # This approach also works
   freq = [0] * 26
   for c in word1: freq[ord(c)-97] += 1
   for c in word2: freq[ord(c)-97] -= 1
   for count in freq:
       if abs(count) > 3:  # Note: count can be negative!
           return False
   ```

3. **Forgetting to use `abs()` for difference**: The problem says "differences between frequencies," which means absolute difference. `freq1[i] - freq2[i]` could be negative, so you need `abs()`.

4. **Incorrect index calculation**: Mixing up `ord(char) - ord('a')` with `ord(char) - 97` or forgetting that 'a' has ASCII value 97. Stick with `ord(char) - ord('a')` for clarity—it's self-documenting.

## When You'll See This Pattern

This frequency counting pattern appears in many string and array problems:

1. **Valid Anagram (LeetCode 242)**: Similar counting approach to check if two strings have identical character frequencies.
2. **First Unique Character in a String (LeetCode 387)**: Count frequencies to find characters that appear exactly once.
3. **Sort Characters By Frequency (LeetCode 451)**: Count frequencies then sort by frequency.
4. **Find Common Characters (LeetCode 1002)**: Count frequencies across multiple strings and find minimum counts.

The core technique—using a fixed-size array when the domain is known and small—applies to many problems beyond strings. For example, counting numbers in a known range or tracking occurrences of specific values.

## Key Takeaways

1. **When to use fixed-size arrays vs hash maps**: If the possible values are known and limited (like 26 lowercase letters), use a fixed-size array. It's faster and uses less memory than a hash map. Use hash maps when the domain is large or unknown.

2. **The counting pattern**: Many problems reduce to "count occurrences, then process the counts." Recognize when you need frequency information rather than processing elements in their original order.

3. **Check all possibilities, not just present ones**: When a problem involves a fixed set of possibilities (like all lowercase letters), make sure your solution considers all of them, not just those that appear in the input.

Related problems: [Find the Occurrence of First Almost Equal Substring](/problem/find-the-occurrence-of-first-almost-equal-substring)
