---
title: "How to Solve Longest Palindromic Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Palindromic Substring. Medium difficulty, 37.4% acceptance rate. Topics: Two Pointers, String, Dynamic Programming."
date: "2026-02-27"
category: "dsa-patterns"
tags: ["longest-palindromic-substring", "two-pointers", "string", "dynamic-programming", "medium"]
---

# How to Solve Longest Palindromic Substring

Finding the longest palindromic substring is a classic medium-difficulty interview problem that tests your ability to work with strings and recognize patterns. What makes this problem interesting is that while the brute force approach is straightforward, it's far too slow for typical constraints, forcing you to think about more clever approaches. The challenge lies in efficiently checking all possible substrings without the O(n³) time complexity of the naive solution.

## Visual Walkthrough

Let's trace through the example `s = "babad"` to build intuition. A palindrome reads the same forwards and backwards, and we're looking for the longest contiguous substring with this property.

**Key insight**: Palindromes can be centered at either:

1. A single character (odd length): "bab" centered at 'a'
2. Between two characters (even length): "baab" would be centered between two 'a's

For `"babad"`:

- Starting at index 0 ('b'):
  - Odd expansion: "b" (length 1)
  - Even expansion: between 'b' and 'a' → no palindrome
- Starting at index 1 ('a'):
  - Odd expansion: "a" → "bab" (length 3) ← current longest
  - Even expansion: between 'a' and 'b' → "ab" not a palindrome
- Starting at index 2 ('b'):
  - Odd expansion: "b" → "aba" (length 3) ← ties current longest
  - Even expansion: between 'b' and 'a' → "ba" not a palindrome
- And so on...

The longest palindromes are "bab" and "aba", both length 3.

## Brute Force Approach

The most straightforward solution is to check every possible substring:

1. Generate all possible substrings (n² possibilities)
2. For each substring, check if it's a palindrome (O(n) time per check)
3. Keep track of the longest palindrome found

This gives us O(n³) time complexity, which is far too slow for strings of meaningful length (n=1000 would require ~10⁹ operations).

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def longestPalindromeBrute(s: str) -> str:
    n = len(s)
    longest = ""

    # Check all possible substrings
    for i in range(n):
        for j in range(i, n):
            substring = s[i:j+1]
            # Check if palindrome
            if substring == substring[::-1]:
                if len(substring) > len(longest):
                    longest = substring

    return longest
```

```javascript
// Time: O(n³) | Space: O(1)
function longestPalindromeBrute(s) {
  let longest = "";

  // Check all possible substrings
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const substring = s.substring(i, j + 1);
      // Check if palindrome
      if (substring === substring.split("").reverse().join("")) {
        if (substring.length > longest.length) {
          longest = substring;
        }
      }
    }
  }

  return longest;
}
```

```java
// Time: O(n³) | Space: O(1)
public String longestPalindromeBrute(String s) {
    String longest = "";

    // Check all possible substrings
    for (int i = 0; i < s.length(); i++) {
        for (int j = i; j < s.length(); j++) {
            String substring = s.substring(i, j + 1);
            // Check if palindrome
            if (isPalindrome(substring)) {
                if (substring.length() > longest.length()) {
                    longest = substring;
                }
            }
        }
    }

    return longest;
}

private boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every substring from scratch. Instead, we can expand around potential centers:

1. **Center expansion**: For each position in the string (and between characters), try to expand outwards to find the longest palindrome centered there
2. **Two types of centers**: Each character can be the center of an odd-length palindrome, and each gap between characters can be the center of an even-length palindrome
3. **Early termination**: We can stop expanding when characters don't match

This reduces the time complexity to O(n²) because:

- We have 2n-1 possible centers (n characters + n-1 gaps)
- For each center, expansion takes O(n) time in worst case
- Total: O(n) × O(n) = O(n²)

## Optimal Solution

Here's the optimal solution using center expansion:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def longestPalindrome(s: str) -> str:
    if not s:
        return ""

    start = 0  # Starting index of longest palindrome
    max_len = 1  # Length of longest palindrome

    def expand_around_center(left: int, right: int) -> int:
        """
        Expand around center and return length of palindrome found.
        Handles both odd and even length palindromes.
        """
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # Return length of palindrome (right - left - 1)
        return right - left - 1

    for i in range(len(s)):
        # Check odd-length palindromes (center at i)
        len1 = expand_around_center(i, i)
        # Check even-length palindromes (center between i and i+1)
        len2 = expand_around_center(i, i + 1)

        # Get the longer palindrome centered at i
        curr_len = max(len1, len2)

        # Update longest palindrome if current is longer
        if curr_len > max_len:
            max_len = curr_len
            # Calculate start index: center minus half the length
            # For odd: i - (len-1)//2
            # For even: i - (len//2 - 1)
            start = i - (curr_len - 1) // 2

    return s[start:start + max_len]
```

```javascript
// Time: O(n²) | Space: O(1)
function longestPalindrome(s) {
  if (!s || s.length === 0) return "";

  let start = 0; // Starting index of longest palindrome
  let maxLen = 1; // Length of longest palindrome

  /**
   * Expand around center and return length of palindrome found.
   * Handles both odd and even length palindromes.
   */
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    // Return length of palindrome (right - left - 1)
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    // Check odd-length palindromes (center at i)
    const len1 = expandAroundCenter(i, i);
    // Check even-length palindromes (center between i and i+1)
    const len2 = expandAroundCenter(i, i + 1);

    // Get the longer palindrome centered at i
    const currLen = Math.max(len1, len2);

    // Update longest palindrome if current is longer
    if (currLen > maxLen) {
      maxLen = currLen;
      // Calculate start index: center minus half the length
      start = i - Math.floor((currLen - 1) / 2);
    }
  }

  return s.substring(start, start + maxLen);
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";

        int start = 0;  // Starting index of longest palindrome
        int maxLen = 1; // Length of longest palindrome

        for (int i = 0; i < s.length(); i++) {
            // Check odd-length palindromes (center at i)
            int len1 = expandAroundCenter(s, i, i);
            // Check even-length palindromes (center between i and i+1)
            int len2 = expandAroundCenter(s, i, i + 1);

            // Get the longer palindrome centered at i
            int currLen = Math.max(len1, len2);

            // Update longest palindrome if current is longer
            if (currLen > maxLen) {
                maxLen = currLen;
                // Calculate start index: center minus half the length
                start = i - (currLen - 1) / 2;
            }
        }

        return s.substring(start, start + maxLen);
    }

    /**
     * Expand around center and return length of palindrome found.
     * Handles both odd and even length palindromes.
     */
    private int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        // Return length of palindrome (right - left - 1)
        return right - left - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through each of the n characters as potential centers
- For each center, we expand outward which could take O(n) time in worst case (e.g., "aaaaa")
- Total: n × O(n) = O(n²)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures that scale with input size

**Note**: There's also a Manacher's Algorithm solution that runs in O(n) time, but it's complex and rarely expected in interviews. The O(n²) solution is typically sufficient.

## Common Mistakes

1. **Forgetting to handle empty string or single character**: Always check edge cases first. An empty string should return an empty string, and a single character string is always a palindrome.

2. **Incorrect start index calculation**: When updating the start index after finding a longer palindrome, the formula `start = i - (curr_len - 1) // 2` works for both odd and even lengths. Candidates often mess this up by using different formulas for odd vs even cases.

3. **Not checking both odd and even length palindromes**: Remember that palindromes can have even length (like "abba") centered between characters. You need to expand from `(i, i)` for odd and `(i, i+1)` for even.

4. **Off-by-one errors in expansion**: The while loop continues while characters match, then we step back one position on each side. That's why the length is `right - left - 1`, not `right - left + 1`.

## When You'll See This Pattern

The "expand around center" technique appears in several palindrome-related problems:

1. **Palindrome Number (Easy)**: While simpler, it uses similar symmetry checking
2. **Valid Palindrome (Easy)**: Checks if entire string is palindrome after filtering
3. **Palindrome Partitioning (Medium)**: Uses DP to find all palindrome substrings
4. **Longest Palindromic Subsequence (Medium)**: Similar but for subsequences (not contiguous), requiring DP

The core pattern is recognizing that palindromes have symmetry around a center, allowing you to expand outward rather than checking every substring independently.

## Key Takeaways

1. **Center expansion is the key insight**: Instead of checking all O(n²) substrings independently, recognize that palindromes expand symmetrically from centers. There are 2n-1 possible centers (n characters + n-1 gaps).

2. **Handle both odd and even lengths**: Always check two cases - center at a character (odd length) and center between characters (even length). This is a common oversight.

3. **Practice the index math**: The formula for calculating the start index of a palindrome given its center and length (`start = center - (length - 1) // 2`) is worth memorizing for similar problems.

Related problems: [Shortest Palindrome](/problem/shortest-palindrome), [Palindrome Permutation](/problem/palindrome-permutation), [Palindrome Pairs](/problem/palindrome-pairs)
