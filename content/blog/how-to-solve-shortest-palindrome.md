---
title: "How to Solve Shortest Palindrome — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Palindrome. Hard difficulty, 41.9% acceptance rate. Topics: String, Rolling Hash, String Matching, Hash Function."
date: "2027-10-08"
category: "dsa-patterns"
tags: ["shortest-palindrome", "string", "rolling-hash", "string-matching", "hard"]
---

# How to Solve Shortest Palindrome

You're given a string `s`, and you can only add characters to the _front_ of it to make it a palindrome. Your task is to find the _shortest_ palindrome possible. What makes this problem tricky is that you can't just check if the whole string is a palindrome—you need to find the longest palindrome prefix, then reverse the remaining suffix and add it to the front. The challenge is doing this efficiently when `s` can be up to 10⁴ characters long.

## Visual Walkthrough

Let's trace through an example: `s = "aacecaaa"`

**Step 1: Find the longest palindrome starting from the beginning**

- Check if the whole string is a palindrome: "aacecaaa" → No
- Check if "aacecaa" is a palindrome: "aacecaa" → Yes! (a a c e c a a)
- So the longest palindrome prefix is "aacecaa" (length 7)

**Step 2: Identify what needs to be added**

- The remaining characters after the palindrome prefix: "a" (the last character)
- We need to add the reverse of this suffix to the front

**Step 3: Construct the result**

- Reverse the suffix "a" → "a"
- Add it to the front of the original: "a" + "aacecaaa" = "aaacecaaa"
- Verify: "aaacecaaa" is indeed a palindrome

Another example: `s = "abcd"`

- No palindrome prefix except single characters
- Longest palindrome prefix: "a" (length 1)
- Remaining suffix: "bcd"
- Reverse suffix: "dcb"
- Result: "dcb" + "abcd" = "dcbabcd"

The core challenge is finding that longest palindrome prefix efficiently. A brute force check for each possible prefix would be O(n²), which is too slow for n = 10⁴.

## Brute Force Approach

The most straightforward approach is:

1. Check if the entire string is a palindrome
2. If not, check if string[0:n-1] is a palindrome
3. Continue removing characters from the end until you find a palindrome
4. Reverse the removed portion and prepend it to the original

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def shortestPalindrome_brute(s: str) -> str:
    n = len(s)

    # Helper to check if a substring is palindrome
    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    # Find the longest palindrome starting from index 0
    for i in range(n - 1, -1, -1):
        if is_palindrome(0, i):
            # Found longest palindrome prefix ending at i
            # Reverse the remaining suffix and prepend it
            suffix = s[i+1:]
            return suffix[::-1] + s

    # Should never reach here (single character is always palindrome)
    return s
```

```javascript
// Time: O(n²) | Space: O(n)
function shortestPalindromeBrute(s) {
  const n = s.length;

  // Helper to check if substring is palindrome
  const isPalindrome = (left, right) => {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  };

  // Find longest palindrome starting from beginning
  for (let i = n - 1; i >= 0; i--) {
    if (isPalindrome(0, i)) {
      // Found longest palindrome prefix
      const suffix = s.substring(i + 1);
      return suffix.split("").reverse().join("") + s;
    }
  }

  return s;
}
```

```java
// Time: O(n²) | Space: O(n)
public String shortestPalindromeBrute(String s) {
    int n = s.length();

    // Helper to check if substring is palindrome
    boolean isPalindrome(int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    // Find longest palindrome starting from beginning
    for (int i = n - 1; i >= 0; i--) {
        if (isPalindrome(0, i)) {
            // Found longest palindrome prefix
            String suffix = s.substring(i + 1);
            StringBuilder reversed = new StringBuilder(suffix).reverse();
            return reversed.toString() + s;
        }
    }

    return s;
}
```

</div>

**Why this is too slow:** For a string of length n, we might check up to n palindromes, and each palindrome check takes O(n) time in the worst case. This gives us O(n²) time complexity, which is 10⁸ operations for n = 10⁴—too slow for LeetCode constraints.

## Optimized Approach

The key insight is that we don't need to check every possible palindrome. Instead, we can transform the problem: finding the longest palindrome prefix is equivalent to finding the longest suffix of the _reversed_ string that matches a prefix of the _original_ string.

**Why this works:**

1. Let `rev_s = s[::-1]` (reverse of s)
2. We want to find the longest palindrome prefix of s
3. A palindrome prefix of s is also a suffix of rev_s
4. So we need to find the longest prefix of s that equals a suffix of rev_s

This becomes a string matching problem! We can use:

- **KMP algorithm** (most efficient): Build the LPS (Longest Prefix Suffix) array
- **Rolling hash** (Rabin-Karp): Use polynomial hashing to compare strings in O(1)

The KMP approach is more reliable (no hash collisions) and has cleaner implementation:

1. Create `new_s = s + "#" + rev_s` (the # ensures we don't match across boundaries)
2. Compute the LPS array for `new_s`
3. The last value in LPS tells us the longest prefix of s that's also a suffix of rev_s
4. This is exactly the longest palindrome prefix length!

## Optimal Solution

Here's the KMP-based solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def shortestPalindrome(s: str) -> str:
    # Step 1: Reverse the original string
    rev_s = s[::-1]

    # Step 2: Create new string: s + '#' + rev_s
    # The '#' acts as a separator to prevent matching across boundaries
    new_s = s + '#' + rev_s
    n = len(new_s)

    # Step 3: Build KMP LPS (Longest Prefix Suffix) array
    lps = [0] * n  # lps[i] = longest proper prefix which is also suffix for new_s[0:i+1]

    # Build LPS array using KMP algorithm
    length = 0  # Length of the previous longest prefix suffix
    i = 1       # Start from index 1 (lps[0] is always 0)

    while i < n:
        if new_s[i] == new_s[length]:
            # Characters match, extend the current prefix
            length += 1
            lps[i] = length
            i += 1
        else:
            # Characters don't match
            if length != 0:
                # Try shorter prefix
                length = lps[length - 1]
            else:
                # No matching prefix
                lps[i] = 0
                i += 1

    # Step 4: The last value in LPS tells us the longest palindrome prefix
    # lps[-1] = length of longest prefix of s that is suffix of rev_s
    longest_pal_prefix_len = lps[-1]

    # Step 5: The characters we need to add are the reverse of the remaining suffix
    suffix_to_add = s[longest_pal_prefix_len:]

    # Step 6: Return reverse(suffix) + original string
    return suffix_to_add[::-1] + s
```

```javascript
// Time: O(n) | Space: O(n)
function shortestPalindrome(s) {
  // Step 1: Reverse the original string
  const revS = s.split("").reverse().join("");

  // Step 2: Create new string with separator
  const newS = s + "#" + revS;
  const n = newS.length;

  // Step 3: Build KMP LPS array
  const lps = new Array(n).fill(0);
  let length = 0; // Length of previous longest prefix suffix
  let i = 1; // Start from index 1

  while (i < n) {
    if (newS[i] === newS[length]) {
      // Characters match, extend current prefix
      length++;
      lps[i] = length;
      i++;
    } else {
      // Characters don't match
      if (length !== 0) {
        // Try shorter prefix
        length = lps[length - 1];
      } else {
        // No matching prefix
        lps[i] = 0;
        i++;
      }
    }
  }

  // Step 4: Get longest palindrome prefix length
  const longestPalPrefixLen = lps[n - 1];

  // Step 5: Get the suffix that needs to be added
  const suffixToAdd = s.substring(longestPalPrefixLen);

  // Step 6: Return reverse(suffix) + original
  return suffixToAdd.split("").reverse().join("") + s;
}
```

```java
// Time: O(n) | Space: O(n)
public String shortestPalindrome(String s) {
    // Step 1: Reverse the original string
    String revS = new StringBuilder(s).reverse().toString();

    // Step 2: Create new string with separator
    String newS = s + "#" + revS;
    int n = newS.length();

    // Step 3: Build KMP LPS array
    int[] lps = new int[n];
    int length = 0;  // Length of previous longest prefix suffix
    int i = 1;       // Start from index 1

    while (i < n) {
        if (newS.charAt(i) == newS.charAt(length)) {
            // Characters match, extend current prefix
            length++;
            lps[i] = length;
            i++;
        } else {
            // Characters don't match
            if (length != 0) {
                // Try shorter prefix
                length = lps[length - 1];
            } else {
                // No matching prefix
                lps[i] = 0;
                i++;
            }
        }
    }

    // Step 4: Get longest palindrome prefix length
    int longestPalPrefixLen = lps[n - 1];

    // Step 5: Get the suffix that needs to be added
    String suffixToAdd = s.substring(longestPalPrefixLen);

    // Step 6: Return reverse(suffix) + original
    return new StringBuilder(suffixToAdd).reverse().toString() + s;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Reversing the string: O(n)
- Building the LPS array: O(2n) = O(n) since we process each character of `new_s` once
- Constructing the result: O(n)
- Total: O(n) where n is the length of the input string

**Space Complexity: O(n)**

- Storing the reversed string: O(n)
- LPS array: O(2n) = O(n)
- Result string: O(n) in the worst case (when no palindrome prefix exists)
- Total: O(n)

## Common Mistakes

1. **Forgetting the separator in KMP approach**: Without the '#' separator between `s` and `rev_s`, you might get incorrect matches that span across the boundary. For example, with `s = "aaa"`, without separator you might match the entire string incorrectly.

2. **Off-by-one errors in LPS array construction**: The classic KMP LPS algorithm starts `i` at 1 (not 0) because `lps[0]` is always 0. Also, when characters don't match and `length > 0`, we set `length = lps[length - 1]` (not `length = 0`).

3. **Incorrectly extracting the suffix to add**: After finding `longest_pal_prefix_len`, the suffix to reverse and add is `s[longest_pal_prefix_len:]`, not `s[longest_pal_prefix_len - 1:]`. Remember that `longest_pal_prefix_len` is the _length_ of the palindrome prefix, so we start from that index.

4. **Using substring operations inefficiently**: In Java/JavaScript, repeatedly using `substring()` in a loop can create many intermediate strings. It's better to build the result using `StringBuilder` (Java) or array joins (JavaScript).

## When You'll See This Pattern

The KMP/LPS pattern appears in several string matching problems:

1. **Find the Index of the First Occurrence in a String (LeetCode 28)**: The classic KMP application for substring search.

2. **Repeated Substring Pattern (LeetCode 459)**: Can be solved by checking if the string is a repetition of a substring using LPS array.

3. **Longest Happy Prefix (LeetCode 1392)**: Directly asks for the longest prefix which is also a suffix—exactly what LPS array gives you.

The transformation trick (finding palindrome prefix by matching original with reversed string) is specific to palindrome problems, but the KMP technique is widely applicable to any string matching problem.

## Key Takeaways

1. **Transform palindrome problems into string matching**: When dealing with palindromes, consider creating a new string by combining the original with its reverse. This often reveals structure that's easier to work with.

2. **KMP's LPS array is powerful beyond substring search**: The LPS array can find the longest prefix that's also a suffix, which is useful for many string analysis problems.

3. **Always test edge cases**: Empty string, single character, already palindrome, all same characters, and no palindrome prefix (like "abcd"). These often reveal implementation bugs.

Related problems: [Longest Palindromic Substring](/problem/longest-palindromic-substring), [Find the Index of the First Occurrence in a String](/problem/find-the-index-of-the-first-occurrence-in-a-string), [Palindrome Pairs](/problem/palindrome-pairs)
