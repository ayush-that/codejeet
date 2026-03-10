---
title: "How to Solve Smallest Palindromic Rearrangement I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Palindromic Rearrangement I. Medium difficulty, 63.5% acceptance rate. Topics: String, Sorting, Counting Sort."
date: "2029-02-16"
category: "dsa-patterns"
tags: ["smallest-palindromic-rearrangement-i", "string", "sorting", "counting-sort", "medium"]
---

# How to Solve Smallest Palindromic Rearrangement I

You're given a palindromic string `s` and need to return the lexicographically smallest palindromic permutation of it. The challenge is that while `s` is already a palindrome, there might be multiple palindromic permutations possible, and we need to find the smallest one alphabetically. This problem is interesting because it combines palindrome construction with lexicographic ordering constraints.

## Visual Walkthrough

Let's trace through an example: `s = "abccba"`

1. **Understanding the input**: `"abccba"` is already a palindrome (reads the same forwards and backwards)
2. **Available characters**: We have counts: a=2, b=2, c=2
3. **Palindromic structure**: Any palindrome has two halves that mirror each other, with possibly one middle character
4. **Lexicographically smallest**: We want the smallest possible palindrome, which means we should place the smallest characters as early as possible
5. **Constructing the solution**:
   - Sort characters: a, b, c
   - Since all counts are even, we can build both halves symmetrically
   - First half: smallest to largest → "abc"
   - Mirror to create palindrome: "abc" + reverse("abc") = "abccba"
   - Wait, that's our original! But what if we had `s = "cbaabc"`?

Let's try a more revealing example: `s = "aabbcc"`

1. This is NOT a palindrome initially, but we can rearrange it
2. Character counts: a=2, b=2, c=2 (all even)
3. To build smallest palindrome:
   - Sort characters: a, b, c
   - Build first half using smallest characters: "abc"
   - Mirror: "abccba"
   - Result: `"abccba"` is lexicographically smaller than `"cbaabc"`

What about odd counts? Example: `s = "aab"`

1. Character counts: a=2, b=1
2. Since b has odd count (1), it must go in the middle
3. Build first half with smallest character: "a"
4. Add middle character: "b"
5. Mirror: "a" + "b" + "a" = "aba"

## Brute Force Approach

A naive approach would be:

1. Generate all permutations of the string
2. Filter to keep only palindromes
3. Find the lexicographically smallest one

This approach has several problems:

- Generating all permutations is O(n!) time complexity
- For a string of length 10, that's 3.6 million permutations
- For length 20, it's 2.4 quintillion permutations - completely infeasible
- Even with optimization, checking each permutation is too slow

The key insight we need is that we don't need to generate all permutations - we can construct the answer directly using character counts and sorting.

## Optimized Approach

The optimal solution uses these key insights:

1. **Palindrome structure**: A palindrome consists of two mirrored halves with possibly one middle character
2. **Character counts**:
   - If a character appears an even number of times, it can be split evenly between both halves
   - If a character appears an odd number of times, exactly one character with odd count can be in the middle
3. **Lexicographic ordering**: To get the smallest palindrome, we should place the smallest characters first in the left half

The algorithm:

1. Count frequency of each character
2. Check if palindrome is possible (at most one character with odd count)
3. Sort characters alphabetically
4. Build the left half by taking half of each character's count, starting from smallest characters
5. Find the middle character (if any character has odd count)
6. Build the palindrome: left half + middle + reverse(left half)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for building result
# Space: O(n) for the result and frequency counter
def smallestPalindrome(s: str) -> str:
    # Step 1: Count frequency of each character
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Step 2: Get sorted list of unique characters
    # Sorting ensures we process characters in lexicographic order
    chars = sorted(freq.keys())

    # Step 3: Initialize left half and track middle character
    left_half = []
    middle_char = ""

    # Step 4: Build the left half of the palindrome
    for char in chars:
        count = freq[char]

        # If count is odd, this character could be the middle
        if count % 2 == 1:
            # If we already have a middle character, we can't form a palindrome
            # But since input is guaranteed to be palindromic, this won't happen
            if middle_char == "":
                middle_char = char
            # For the remaining odd-1 characters, we can use half in left half
            # Example: if count=3, we use 1 in left half, 1 in middle, 1 in right half
            count -= 1

        # Add half of the characters to left half
        # Using integer division since count is now guaranteed to be even
        left_half.extend([char] * (count // 2))

    # Step 5: Construct the full palindrome
    # Left half + middle + reversed left half
    return ''.join(left_half + [middle_char] + left_half[::-1])
```

```javascript
// Time: O(n log n) for sorting, O(n) for building result
// Space: O(n) for the result and frequency counter
function smallestPalindrome(s) {
  // Step 1: Count frequency of each character
  const freq = {};
  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Step 2: Get sorted list of unique characters
  // Sorting ensures we process characters in lexicographic order
  const chars = Object.keys(freq).sort();

  // Step 3: Initialize left half and track middle character
  const leftHalf = [];
  let middleChar = "";

  // Step 4: Build the left half of the palindrome
  for (const char of chars) {
    let count = freq[char];

    // If count is odd, this character could be the middle
    if (count % 2 === 1) {
      // If we already have a middle character, we can't form a palindrome
      // But since input is guaranteed to be palindromic, this won't happen
      if (middleChar === "") {
        middleChar = char;
      }
      // For the remaining odd-1 characters, we can use half in left half
      // Example: if count=3, we use 1 in left half, 1 in middle, 1 in right half
      count -= 1;
    }

    // Add half of the characters to left half
    // Using integer division since count is now guaranteed to be even
    for (let i = 0; i < count / 2; i++) {
      leftHalf.push(char);
    }
  }

  // Step 5: Construct the full palindrome
  // Left half + middle + reversed left half
  const rightHalf = [...leftHalf].reverse();
  return leftHalf.join("") + middleChar + rightHalf.join("");
}
```

```java
// Time: O(n log n) for sorting, O(n) for building result
// Space: O(n) for the result and frequency counter
import java.util.*;

public class Solution {
    public String smallestPalindrome(String s) {
        // Step 1: Count frequency of each character
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : s.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }

        // Step 2: Get sorted list of unique characters
        // Sorting ensures we process characters in lexicographic order
        List<Character> chars = new ArrayList<>(freq.keySet());
        Collections.sort(chars);

        // Step 3: Initialize left half and track middle character
        StringBuilder leftHalf = new StringBuilder();
        char middleChar = '\0';

        // Step 4: Build the left half of the palindrome
        for (char c : chars) {
            int count = freq.get(c);

            // If count is odd, this character could be the middle
            if (count % 2 == 1) {
                // If we already have a middle character, we can't form a palindrome
                // But since input is guaranteed to be palindromic, this won't happen
                if (middleChar == '\0') {
                    middleChar = c;
                }
                // For the remaining odd-1 characters, we can use half in left half
                // Example: if count=3, we use 1 in left half, 1 in middle, 1 in right half
                count -= 1;
            }

            // Add half of the characters to left half
            // Using integer division since count is now guaranteed to be even
            for (int i = 0; i < count / 2; i++) {
                leftHalf.append(c);
            }
        }

        // Step 5: Construct the full palindrome
        // Left half + middle + reversed left half
        String left = leftHalf.toString();
        String right = new StringBuilder(left).reverse().toString();

        if (middleChar != '\0') {
            return left + middleChar + right;
        } else {
            return left + right;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting character frequencies: O(n) where n is the length of the string
- Sorting unique characters: O(k log k) where k is the number of unique characters (at most 26 for lowercase English letters, but could be more for general Unicode)
- Building the result: O(n)
- Dominated by the sorting step: O(n log n) in worst case

**Space Complexity: O(n)**

- Frequency counter: O(k) where k is number of unique characters
- Result string: O(n)
- Additional arrays/lists for left half: O(n/2) = O(n)

## Common Mistakes

1. **Forgetting to handle odd counts properly**: When a character has odd count, candidates often forget to subtract 1 before dividing by 2, leading to incorrect character distribution.

2. **Not sorting characters before building the left half**: Without sorting, you might not get the lexicographically smallest result. For example, with characters 'c', 'a', 'b', if you process in arbitrary order, you might get "cab..." instead of "abc...".

3. **Incorrect palindrome validation**: While the problem guarantees the input is palindromic, some candidates waste time checking if a palindrome can be formed. The real issue is when multiple characters have odd counts - but since the input is a palindrome, this won't happen.

4. **Building the entire string inefficiently**: Some candidates build the string character by character in a loop instead of using string builder/join operations, which can make the solution O(n²) instead of O(n).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting with hash maps**: Used in problems like "Valid Anagram", "Group Anagrams", "First Unique Character in a String"

2. **Palindrome construction from character counts**: Similar to "Longest Palindrome" (LeetCode 409) where you build the longest possible palindrome from a set of characters

3. **Lexicographic ordering with constraints**: Seen in problems like "Reorder Data in Log Files", "Custom Sort String", where you need to sort with custom rules

4. **Two-pointer palindrome techniques**: While not directly used here, understanding palindrome structure helps with problems like "Valid Palindrome", "Palindrome Linked List"

## Key Takeaways

1. **Palindromes are symmetric**: Any palindrome can be constructed from a left half, optional middle, and reversed left half. This symmetry simplifies construction.

2. **Character frequency determines palindrome feasibility**: A string can form a palindrome if at most one character has an odd count. This is a fundamental palindrome property.

3. **Lexicographic ordering requires sorting**: When you need the "smallest" or "largest" arrangement, sorting is usually involved. Process characters in sorted order to ensure optimal ordering.

4. **Divide and conquer palindrome construction**: Instead of generating all permutations, directly construct the answer by reasoning about the required structure.

Related problems: [Shortest Palindrome](/problem/shortest-palindrome)
