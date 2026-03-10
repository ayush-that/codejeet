---
title: "How to Solve Split Two Strings to Make Palindrome — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split Two Strings to Make Palindrome. Medium difficulty, 32.1% acceptance rate. Topics: Two Pointers, String."
date: "2029-03-29"
category: "dsa-patterns"
tags: ["split-two-strings-to-make-palindrome", "two-pointers", "string", "medium"]
---

# How to Solve Split Two Strings to Make Palindrome

You're given two strings `a` and `b` of equal length, and you need to check if you can split both at the same index to form a palindrome by concatenating `a_prefix + b_suffix` or `b_prefix + a_suffix`. The tricky part is that you're allowed to use different combinations from the two strings, and the palindrome check needs to handle the "crossover" between strings intelligently.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `a = "x"` and `b = "y"`
- We want to check if `a_prefix + b_suffix` or `b_prefix + a_suffix` can be a palindrome

**Example 1:** `a = "ulacfd"`, `b = "jizalu"`

We need to check all possible split points. Let's try split index 3:

- `a_prefix = "ula"`, `a_suffix = "cfd"`
- `b_prefix = "jiz"`, `b_suffix = "alu"`
- `a_prefix + b_suffix = "ulaalu"` → palindrome? Yes! "ulaalu" reads the same forwards and backwards.

But checking every split point would be O(n²) if we naively build and check each concatenated string. The key insight: we can use two pointers to check from the ends inward, allowing us to "skip" mismatched sections by switching strings.

**Example 2:** `a = "abdef"`, `b = "fecab"`

Let's trace the optimal approach:

1. Start pointers at left=0, right=4 (last index)
2. Compare `a[left]` with `b[right]`: 'a' vs 'b' → mismatch
3. But we can try checking if the middle section of either string is a palindrome:
   - Check if `a[0..4]` is palindrome from position 0: it's not
   - Check if `b[0..4]` is palindrome from position 0: it's not
4. Now try the other combination: `b_prefix + a_suffix`
5. Compare `b[left]` with `a[right]`: 'f' vs 'b' → mismatch
6. Check if `a[0..4]` is palindrome from position 0: no
7. Check if `b[0..4]` is palindrome from position 0: no
8. Result: false

The visual pattern shows we need to handle the "crossover" when characters don't match.

## Brute Force Approach

The brute force solution would check every possible split index i from 0 to n (where n is the length of the strings):

For each i:

1. Form `a_prefix + b_suffix` = `a[0:i] + b[i:n]`
2. Form `b_prefix + a_suffix` = `b[0:i] + a[i:n]`
3. Check if either concatenation is a palindrome

This requires O(n) split points, and checking each palindrome takes O(n) time, resulting in O(n²) time complexity. For n up to 10⁵ (typical LeetCode constraints), this is far too slow (10¹⁰ operations).

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for the concatenated strings
def brute_force_checkPalindromeFormation(a: str, b: str) -> bool:
    n = len(a)

    # Helper to check if a string is palindrome
    def is_palindrome(s):
        return s == s[::-1]

    # Check all possible split points
    for i in range(n + 1):
        # Option 1: a_prefix + b_suffix
        candidate1 = a[:i] + b[i:]
        # Option 2: b_prefix + a_suffix
        candidate2 = b[:i] + a[i:]

        if is_palindrome(candidate1) or is_palindrome(candidate2):
            return True

    return False
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForceCheckPalindromeFormation(a, b) {
  const n = a.length;

  // Helper to check if a string is palindrome
  const isPalindrome = (s) => {
    return s === s.split("").reverse().join("");
  };

  // Check all possible split points
  for (let i = 0; i <= n; i++) {
    // Option 1: a_prefix + b_suffix
    const candidate1 = a.substring(0, i) + b.substring(i);
    // Option 2: b_prefix + a_suffix
    const candidate2 = b.substring(0, i) + a.substring(i);

    if (isPalindrome(candidate1) || isPalindrome(candidate2)) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(n²) | Space: O(n)
public boolean bruteForceCheckPalindromeFormation(String a, String b) {
    int n = a.length();

    // Helper to check if a string is palindrome
    boolean isPalindrome(String s) {
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

    // Check all possible split points
    for (int i = 0; i <= n; i++) {
        // Option 1: a_prefix + b_suffix
        String candidate1 = a.substring(0, i) + b.substring(i);
        // Option 2: b_prefix + a_suffix
        String candidate2 = b.substring(0, i) + a.substring(i);

        if (isPalindrome(candidate1) || isPalindrome(candidate2)) {
            return true;
        }
    }

    return false;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every split point explicitly. Instead, we can use a **greedy two-pointer approach**:

1. Start with two pointers: `left` at the beginning and `right` at the end
2. Move inward while characters match in the current string combination
3. When we hit a mismatch, we have two options:
   - The middle section of string `a` (from `left` to `right`) might be a palindrome
   - The middle section of string `b` (from `left` to `right`) might be a palindrome
4. If either is true, we can form a palindrome by splitting at that point

We need to check both combinations:

- `a_prefix + b_suffix`: Start matching from ends using `a[left]` and `b[right]`
- `b_prefix + a_suffix`: Start matching from ends using `b[left]` and `a[right]`

The critical optimization is that once we start matching from the ends, any mismatch means we need to check if the remaining middle section of **either** original string is a palindrome. This reduces the problem to O(n) time.

## Optimal Solution

Here's the optimal O(n) solution using the two-pointer technique:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkPalindromeFormation(a: str, b: str) -> bool:
    """
    Check if we can split a and b at the same index to form a palindrome
    using either a_prefix + b_suffix or b_prefix + a_suffix.
    """

    def is_palindrome(s: str, left: int, right: int) -> bool:
        """
        Check if substring s[left:right+1] is a palindrome.
        Uses two pointers moving inward.
        """
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    def check(a: str, b: str) -> bool:
        """
        Check if we can form palindrome using a_prefix + b_suffix.
        """
        n = len(a)
        left, right = 0, n - 1

        # Step 1: Move inward while characters match
        while left < right and a[left] == b[right]:
            left += 1
            right -= 1

        # Step 2: If we reached the middle, we have a palindrome
        # Otherwise, check if the middle section of either string is palindrome
        if left >= right:
            return True

        # Step 3: Check if remaining middle of a or b is palindrome
        return is_palindrome(a, left, right) or is_palindrome(b, left, right)

    # Check both possible combinations
    return check(a, b) or check(b, a)
```

```javascript
// Time: O(n) | Space: O(1)
function checkPalindromeFormation(a, b) {
  /**
   * Check if substring s[left..right] is a palindrome.
   * Uses two pointers moving inward.
   */
  const isPalindrome = (s, left, right) => {
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    return true;
  };

  /**
   * Check if we can form palindrome using a_prefix + b_suffix.
   */
  const check = (a, b) => {
    const n = a.length;
    let left = 0,
      right = n - 1;

    // Step 1: Move inward while characters match
    while (left < right && a[left] === b[right]) {
      left++;
      right--;
    }

    // Step 2: If we reached the middle, we have a palindrome
    // Otherwise, check if the middle section of either string is palindrome
    if (left >= right) {
      return true;
    }

    // Step 3: Check if remaining middle of a or b is palindrome
    return isPalindrome(a, left, right) || isPalindrome(b, left, right);
  };

  // Check both possible combinations
  return check(a, b) || check(b, a);
}
```

```java
// Time: O(n) | Space: O(1)
public boolean checkPalindromeFormation(String a, String b) {
    /**
     * Check if substring s[left..right] is a palindrome.
     * Uses two pointers moving inward.
     */
    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    /**
     * Check if we can form palindrome using a_prefix + b_suffix.
     */
    private boolean check(String a, String b) {
        int n = a.length();
        int left = 0, right = n - 1;

        // Step 1: Move inward while characters match
        while (left < right && a.charAt(left) == b.charAt(right)) {
            left++;
            right--;
        }

        // Step 2: If we reached the middle, we have a palindrome
        // Otherwise, check if the middle section of either string is palindrome
        if (left >= right) {
            return true;
        }

        // Step 3: Check if remaining middle of a or b is palindrome
        return isPalindrome(a, left, right) || isPalindrome(b, left, right);
    }

    // Check both possible combinations
    return check(a, b) || check(b, a);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make at most two passes through the strings (one for each combination: `a_prefix + b_suffix` and `b_prefix + a_suffix`)
- Each pass uses two pointers that move inward, visiting each character at most once
- The palindrome check for the middle section also uses two pointers but only runs once per combination when needed
- Total operations: ~4n in worst case, which is O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers and boolean flags
- No additional data structures that scale with input size
- The input strings are not modified

## Common Mistakes

1. **Not checking both combinations**: Some candidates only check `a_prefix + b_suffix` and forget to check `b_prefix + a_suffix`. Remember we can use either string as the prefix.

2. **Incorrect palindrome check boundaries**: When checking if the middle section is a palindrome, you must use the current `left` and `right` pointers, not start from 0. The pointers have already moved past the matching prefix/suffix sections.

3. **Off-by-one errors in split index**: The split can happen at any index from 0 to n (inclusive). Index n means empty suffix, index 0 means empty prefix. Our two-pointer approach implicitly handles all these cases.

4. **Assuming the split must be at the mismatch point**: The split doesn't have to be exactly where the mismatch occurs. After a mismatch, we check if the middle of either original string is a palindrome, which corresponds to splitting somewhere within that middle section.

## When You'll See This Pattern

This two-pointer palindrome checking pattern appears in several string problems:

1. **Valid Palindrome II (LeetCode 680)**: Similar concept of checking if a string can be a palindrome by removing at most one character. The "skip" mechanism is analogous to our string switching.

2. **Longest Palindromic Substring (LeetCode 5)**: Uses expanding two pointers from center to find palindromes, though for finding the longest rather than checking existence.

3. **Palindrome Linked List (LeetCode 234)**: Uses fast/slow pointers to find the middle, then reverses the second half to compare - another variation of the two-pointer approach for palindrome checking.

The core pattern is using symmetric pointers that move inward from both ends, handling mismatches by exploring alternative paths (skipping/removing/switching).

## Key Takeaways

1. **Two-pointer inward sweep** is optimal for palindrome problems where you need to check from both ends. This avoids O(n²) brute force checking.

2. **When mismatches occur in palindrome checking**, consider if the problem allows "skipping" or "switching" at the mismatch point. This often indicates you should check if the remaining middle section is itself a palindrome.

3. **For problems with multiple string combinations**, check each combination separately but look for shared subproblems. Here, both combinations reduce to the same "check middle section" subproblem.

[Practice this problem on CodeJeet](/problem/split-two-strings-to-make-palindrome)
