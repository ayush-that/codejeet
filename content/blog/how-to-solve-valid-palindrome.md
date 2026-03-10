---
title: "How to Solve Valid Palindrome — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Palindrome. Easy difficulty, 52.8% acceptance rate. Topics: Two Pointers, String."
date: "2026-02-18"
category: "dsa-patterns"
tags: ["valid-palindrome", "two-pointers", "string", "easy"]
---

# How to Solve Valid Palindrome

This problem asks us to determine if a string is a palindrome after removing all non-alphanumeric characters and converting everything to lowercase. While the concept is straightforward, the challenge lies in efficiently handling the character filtering and comparison in a single pass. The key insight is that we only need to compare characters from the outside moving inward, ignoring anything that isn't a letter or number.

## Visual Walkthrough

Let's trace through the example `"A man, a plan, a canal: Panama"`:

1. **Initial string**: `"A man, a plan, a canal: Panama"`
2. **After processing**: We'll compare characters from both ends, skipping non-alphanumeric characters:
   - Left pointer (L) starts at index 0: `'A'` (alphanumeric, becomes `'a'` after lowercase)
   - Right pointer (R) starts at last index: `'a'` (alphanumeric, already lowercase)
   - Compare: `'a'` == `'a'` ✓
3. Move pointers inward:
   - L moves to index 1: `' '` (space, not alphanumeric) → skip to index 2
   - R moves to second-last index: `'m'` (alphanumeric)
   - Compare: `'m'` == `'m'` ✓
4. Continue this process:
   - L: `'m'` → `'a'` → `'n'` → `','` (skip) → `' '` (skip) → `'a'`
   - R: `'a'` → `'P'` (becomes `'p'`) → `'n'` → `'a'` → `'l'` → `'a'` → `'n'` → `'a'` → `'c'`
   - Each comparison matches until pointers meet/cross

5. Final result: All compared characters matched, so it's a valid palindrome.

The key observation is we don't need to create a new filtered string. We can compare characters directly while skipping non-alphanumeric ones.

## Brute Force Approach

A naive approach would be:

1. Create a new string with only alphanumeric characters converted to lowercase
2. Compare this new string with its reverse

While this works and is conceptually simple, it requires:

- O(n) time to filter and lowercase the string
- O(n) space to store the new string
- O(n) time to compare with reverse (or O(n) to reverse and O(n) to compare)

The space usage is unnecessary when we can solve the problem with O(1) extra space using two pointers. Also, creating a new string involves iterating through the entire input twice (once to filter, once to compare), whereas the optimal solution can often exit early when it finds a mismatch.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isPalindromeBruteForce(s: str) -> bool:
    # Step 1: Filter and lowercase
    filtered = []
    for char in s:
        if char.isalnum():  # Check if alphanumeric
            filtered.append(char.lower())

    # Step 2: Convert to string
    filtered_str = ''.join(filtered)

    # Step 3: Compare with reverse
    return filtered_str == filtered_str[::-1]
```

```javascript
// Time: O(n) | Space: O(n)
function isPalindromeBruteForce(s) {
  // Step 1: Filter and lowercase
  let filtered = "";
  for (let char of s) {
    if (/[a-zA-Z0-9]/.test(char)) {
      // Check if alphanumeric
      filtered += char.toLowerCase();
    }
  }

  // Step 2: Compare with reverse
  return filtered === filtered.split("").reverse().join("");
}
```

```java
// Time: O(n) | Space: O(n)
public boolean isPalindromeBruteForce(String s) {
    // Step 1: Filter and lowercase
    StringBuilder filtered = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) {  // Check if alphanumeric
            filtered.append(Character.toLowerCase(c));
        }
    }

    // Step 2: Compare with reverse
    String filteredStr = filtered.toString();
    String reversed = new StringBuilder(filteredStr).reverse().toString();
    return filteredStr.equals(reversed);
}
```

</div>

## Optimal Solution

The optimal approach uses two pointers starting at opposite ends of the string. We move them toward each other, skipping non-alphanumeric characters, and compare the lowercase versions of alphanumeric characters we encounter. This approach uses O(1) extra space (excluding the input string itself) and can exit early when it finds a mismatch.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - excluding the input string
def isPalindrome(s: str) -> bool:
    # Initialize two pointers at opposite ends
    left, right = 0, len(s) - 1

    while left < right:
        # Move left pointer to the next alphanumeric character
        # We need to check left < right to avoid going out of bounds
        while left < right and not s[left].isalnum():
            left += 1

        # Move right pointer to the previous alphanumeric character
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare characters (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False

        # Move pointers inward for next comparison
        left += 1
        right -= 1

    # If we've compared all characters without mismatch, it's a palindrome
    return True
```

```javascript
// Time: O(n) | Space: O(1) - excluding the input string
function isPalindrome(s) {
  // Initialize two pointers at opposite ends
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Move left pointer to the next alphanumeric character
    // We need to check left < right to avoid going out of bounds
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) {
      left++;
    }

    // Move right pointer to the previous alphanumeric character
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) {
      right--;
    }

    // Compare characters (case-insensitive)
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }

    // Move pointers inward for next comparison
    left++;
    right--;
  }

  // If we've compared all characters without mismatch, it's a palindrome
  return true;
}
```

```java
// Time: O(n) | Space: O(1) - excluding the input string
public boolean isPalindrome(String s) {
    // Initialize two pointers at opposite ends
    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
        // Move left pointer to the next alphanumeric character
        // We need to check left < right to avoid going out of bounds
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }

        // Move right pointer to the previous alphanumeric character
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }

        // Compare characters (case-insensitive)
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }

        // Move pointers inward for next comparison
        left++;
        right--;
    }

    // If we've compared all characters without mismatch, it's a palindrome
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we visit each character at most twice (once by each pointer)
- Each character operation (checking if alphanumeric, converting to lowercase) is O(1)
- The while loop runs until pointers meet, which takes at most n/2 iterations

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the pointers and temporary variables
- We don't create any new data structures proportional to the input size
- Note: Some languages may use O(n) space for the input string itself, but we're analyzing the extra space used by our algorithm

## Common Mistakes

1. **Forgetting to handle empty strings or strings with no alphanumeric characters**: An empty string or a string like `"!@#$"` should return `true` because when we remove non-alphanumeric characters, we get an empty string, which reads the same forward and backward.

2. **Case sensitivity issues**: Comparing `'A'` and `'a'` directly would incorrectly return `false`. Always convert to lowercase (or uppercase) before comparison.

3. **Infinite loops when skipping non-alphanumeric characters**: Forgetting the `left < right` condition in the inner while loops can cause pointers to go out of bounds or create infinite loops when all characters between pointers are non-alphanumeric.

4. **Using the wrong character classification method**: Different languages have different methods. In Python, `str.isalnum()` works; in Java, `Character.isLetterOrDigit()`; in JavaScript, you need a regex or manual check. Using `isalpha()` instead of `isalnum()` would incorrectly exclude digits.

5. **Off-by-one errors with pointer movement**: After comparing characters, remember to move both pointers inward. Forgetting this creates an infinite loop where the same characters are compared repeatedly.

## When You'll See This Pattern

The two-pointer technique from opposite ends is a fundamental pattern for:

- **Palindrome problems**: Checking if a string or sequence reads the same forwards and backwards
- **Search in sorted arrays**: Finding pairs that sum to a target (like Two Sum II)
- **Partitioning problems**: Moving elements to specific positions (like Move Zeroes)
- **Reversal problems**: Reversing arrays or strings in-place

Related LeetCode problems:

1. **Valid Palindrome II (Easy)**: Similar to this problem but allows deleting at most one character. You'll use the same two-pointer approach but need to handle the "delete one character" case.
2. **Palindrome Linked List (Easy)**: Uses fast/slow pointers to find the middle, then reverses the second half to compare with the first half.
3. **Two Sum II - Input Array Is Sorted (Medium)**: Uses two pointers from opposite ends to find pairs that sum to a target in a sorted array.

## Key Takeaways

1. **Two pointers from opposite ends** is optimal for symmetric comparison problems where you need to compare elements from the outside moving inward.
2. **Always consider early exit opportunities** - if you find a mismatch, you can return immediately without processing the rest of the string.
3. **Pay attention to edge cases**: Empty strings, all non-alphanumeric characters, single characters, and strings with mixed case all need to be handled correctly.

Related problems: [Palindrome Linked List](/problem/palindrome-linked-list), [Valid Palindrome II](/problem/valid-palindrome-ii), [Maximum Product of the Length of Two Palindromic Subsequences](/problem/maximum-product-of-the-length-of-two-palindromic-subsequences)
