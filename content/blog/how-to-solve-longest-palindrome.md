---
title: "How to Solve Longest Palindrome — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Palindrome. Easy difficulty, 55.8% acceptance rate. Topics: Hash Table, String, Greedy."
date: "2026-10-12"
category: "dsa-patterns"
tags: ["longest-palindrome", "hash-table", "string", "greedy", "easy"]
---

# How to Solve Longest Palindrome

This problem asks: given a string of letters (case-sensitive), what's the longest palindrome we can build using those letters? The key insight is that we don't need to find an existing palindrome in the string—we can rearrange the letters however we want. This makes it a counting problem rather than a string manipulation problem. The tricky part is understanding how palindrome structure relates to character frequencies: palindromes can have at most one character with an odd count (placed in the middle), while all other characters must appear in even pairs.

## Visual Walkthrough

Let's trace through an example: `s = "abccccdd"`

**Step 1: Count character frequencies**

- a: 1
- b: 1
- c: 4
- d: 2

**Step 2: Process each count**

- For even counts (c:4, d:2): we can use ALL of them in the palindrome. Add 4 + 2 = 6 to our length.
- For odd counts (a:1, b:1): we can use count-1 (0) from each, OR we can use one full odd count in the center.

**Step 3: Handle odd counts**
We can use at most one odd count fully. Let's take the largest odd count? Actually, any odd count works since we're just taking one character. But we can also take count-1 from each odd count to make them even.

From a:1 → we can take 0 (or 1 if we place it in center)
From b:1 → we can take 0 (or 1 if we place it in center)

Better approach: For each odd count, add `count - 1` to make it even, then track if we saw any odd counts at all.

**Step 4: Calculate final length**

1. Sum all even counts: c:4 + d:2 = 6
2. For odd counts, add `count - 1`: a:0 + b:0 = 0
3. Total so far: 6 + 0 = 6
4. Can we add a center character? Yes, because we have odd counts available. Add 1.
5. Final answer: 7 (which would be "dccaccd" or similar)

This gives us the pattern: sum all even counts, sum (odd count - 1) for odd counts, then add 1 if any odd count exists.

## Brute Force Approach

A truly brute force approach would be to generate all permutations of the string and check each for being a palindrome, but that's O(n!) time—completely impractical.

What some candidates might try is checking every substring for being a palindrome (O(n³) with naive checks, O(n²) with dynamic programming), but that misses the point: we can REARRANGE letters. We're not looking for an existing palindrome in the string.

The key realization is that this isn't a substring problem—it's a counting problem. Any approach that doesn't start with counting character frequencies is going down the wrong path.

## Optimal Solution

The optimal solution uses a frequency counter (hash map) to count each character's occurrences. Then we apply the palindrome building logic:

1. Palindromes are symmetric around the center
2. Even-count characters can all be used (one half on each side)
3. Odd-count characters: we can use `count - 1` from each (making it even), saving the possibility of placing one odd character in the center

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) because character set is limited (52 letters max)
def longestPalindrome(s: str) -> int:
    # Step 1: Count frequency of each character
    # We use a dictionary/hash map to store counts
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1

    # Step 2: Initialize result and track if we've used an odd count
    length = 0
    has_odd = False

    # Step 3: Process each character's count
    for count in char_count.values():
        if count % 2 == 0:
            # Even counts can be fully used in palindrome
            length += count
        else:
            # For odd counts, we can use count-1 (to make it even)
            # and mark that we have an odd count available for center
            length += count - 1
            has_odd = True

    # Step 4: If we have any odd count, we can place one character in center
    if has_odd:
        length += 1

    return length
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) because character set is limited (52 letters max)
function longestPalindrome(s) {
  // Step 1: Count frequency of each character
  const charCount = new Map();
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Step 2: Initialize result and track if we've used an odd count
  let length = 0;
  let hasOdd = false;

  // Step 3: Process each character's count
  for (const count of charCount.values()) {
    if (count % 2 === 0) {
      // Even counts can be fully used in palindrome
      length += count;
    } else {
      // For odd counts, we can use count-1 (to make it even)
      // and mark that we have an odd count available for center
      length += count - 1;
      hasOdd = true;
    }
  }

  // Step 4: If we have any odd count, we can place one character in center
  if (hasOdd) {
    length += 1;
  }

  return length;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) because character set is limited (52 letters max)
public int longestPalindrome(String s) {
    // Step 1: Count frequency of each character
    // Using array since characters are limited to letters
    int[] charCount = new int[128]; // ASCII size covers all letters

    for (char c : s.toCharArray()) {
        charCount[c]++;
    }

    // Step 2: Initialize result and track if we've used an odd count
    int length = 0;
    boolean hasOdd = false;

    // Step 3: Process each character's count
    for (int count : charCount) {
        if (count % 2 == 0) {
            // Even counts can be fully used in palindrome
            length += count;
        } else {
            // For odd counts, we can use count-1 (to make it even)
            // and mark that we have an odd count available for center
            length += count - 1;
            hasOdd = true;
        }
    }

    // Step 4: If we have any odd count, we can place one character in center
    if (hasOdd) {
        length += 1;
    }

    return length;
}
```

</div>

**Alternative cleaner implementation:** We can simplify the logic by always adding `count // 2 * 2` (integer division) for each count, then checking if any count was odd to potentially add 1 for the center.

<div class="code-group">

```python
def longestPalindrome(s: str) -> int:
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1

    length = 0
    for count in char_count.values():
        # Add the largest even number <= count
        length += count // 2 * 2

        # If current count is odd and we haven't added center yet
        if count % 2 == 1 and length % 2 == 0:
            length += 1

    return length
```

```javascript
function longestPalindrome(s) {
  const charCount = new Map();
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  let length = 0;
  for (const count of charCount.values()) {
    // Add the largest even number <= count
    length += Math.floor(count / 2) * 2;

    // If current count is odd and we haven't added center yet
    if (count % 2 === 1 && length % 2 === 0) {
      length += 1;
    }
  }

  return length;
}
```

```java
public int longestPalindrome(String s) {
    int[] charCount = new int[128];
    for (char c : s.toCharArray()) {
        charCount[c]++;
    }

    int length = 0;
    for (int count : charCount) {
        // Add the largest even number <= count
        length += (count / 2) * 2;

        // If current count is odd and we haven't added center yet
        if (count % 2 == 1 && length % 2 == 0) {
            length += 1;
        }
    }

    return length;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to count characters: O(n)
- We iterate through the character counts: O(k) where k is the number of unique characters
- Since k ≤ 52 (26 lowercase + 26 uppercase), this is O(1) in practice
- Total: O(n) + O(1) = O(n)

**Space Complexity: O(1)**

- The hash map/array stores at most 52 entries (all letters)
- This is constant space regardless of input size
- Even with extended character sets, the space is bounded by the character set size

## Common Mistakes

1. **Treating it as a substring problem**: Many candidates start looking for the longest palindrome substring within the given string. Remember: you can REARRANGE the letters! This is a counting problem, not a substring problem.

2. **Forgetting case sensitivity**: "A" and "a" are different characters. A simple array of size 26 won't work—you need 52 for uppercase and lowercase, or 128 for full ASCII.

3. **Incorrect odd count handling**: Adding all odd counts instead of `count - 1`. For example, with counts [3, 3, 1], you can't use all 7 characters—you can use 3-1 + 3-1 + 1-1 = 4, then +1 for center = 5.

4. **Missing the center character**: Forgetting to check if you can add one more character in the center when you have odd counts. With all even counts, the palindrome length equals the sum; with any odd count, you can add +1.

## When You'll See This Pattern

This "character frequency counting" pattern appears in many string problems:

1. **Palindrome Permutation (LeetCode 266)**: Very similar—check if a palindrome can be formed from a string. Uses the same "at most one odd count" logic.

2. **Longest Palindrome by Concatenating Two Letter Words (LeetCode 2131)**: Builds on this concept but with word pairs instead of individual letters.

3. **Largest Palindromic Number (LeetCode 2384)**: Similar counting logic but with digits and additional constraints about leading zeros.

4. **Valid Anagram (LeetCode 242)**: Uses character counting to compare strings.

The core pattern: when order doesn't matter but composition does, count frequencies. This transforms string problems into math/logic problems.

## Key Takeaways

1. **Palindromes are about symmetry**: When building (not finding) palindromes, think in terms of pairs and a possible center. Even counts give you pairs; odd counts give you pairs plus a potential center.

2. **Count first, think later**: For rearrangement problems, always start by counting character frequencies. The counts often reveal the solution structure.

3. **The "odd count rule"**: A palindrome can have at most one character with an odd frequency (in the center). All other characters must have even frequencies when building the palindrome.

This problem teaches the important skill of recognizing when a problem is fundamentally about counting rather than searching or matching patterns in the original order.

---

Related problems: [Palindrome Permutation](/problem/palindrome-permutation), [Longest Palindrome by Concatenating Two Letter Words](/problem/longest-palindrome-by-concatenating-two-letter-words), [Largest Palindromic Number](/problem/largest-palindromic-number)
