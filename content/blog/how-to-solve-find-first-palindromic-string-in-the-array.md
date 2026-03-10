---
title: "How to Solve Find First Palindromic String in the Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find First Palindromic String in the Array. Easy difficulty, 84.0% acceptance rate. Topics: Array, Two Pointers, String."
date: "2027-08-29"
category: "dsa-patterns"
tags: ["find-first-palindromic-string-in-the-array", "array", "two-pointers", "string", "easy"]
---

# How to Solve Find First Palindromic String in the Array

This problem asks us to find the first string in an array that reads the same forwards and backwards. While the concept is straightforward, the challenge lies in implementing an efficient palindrome check and handling edge cases properly. What makes this interesting is that it combines array traversal with string manipulation—two fundamental skills that appear in many interview problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input array: `["abc", "car", "ada", "racecar", "cool"]`

We need to check each string in order until we find a palindrome:

1. **Check "abc"**: Compare first character 'a' with last character 'c' → not equal → not a palindrome
2. **Check "car"**: Compare 'c' with 'r' → not equal → not a palindrome
3. **Check "ada"**: Compare 'a' with 'a' (equal), then compare 'd' with 'd' (equal) → palindrome found!
4. **Return "ada"** immediately since it's the first palindrome in the array

If we had checked all strings and found no palindrome (e.g., `["abc", "def", "ghi"]`), we would return an empty string `""`.

The key insight is that we need to:

1. Iterate through the array from left to right
2. For each string, check if it's a palindrome
3. Return the first palindrome we find, or an empty string if none exist

## Brute Force Approach

A naive approach might involve creating reversed copies of each string and comparing them. While this works, it's inefficient because:

1. Creating a reversed string requires O(n) extra space for each string
2. String reversal operations can be expensive for long strings
3. We're creating unnecessary string objects when we could check in-place

Here's what the brute force might look like:

```python
def firstPalindrome(words):
    for word in words:
        # Create reversed copy and compare
        if word == word[::-1]:
            return word
    return ""
```

While this works and is actually acceptable for this problem (since it's Easy difficulty), it's not the most efficient approach. The `word[::-1]` creates a completely new string in memory, which uses O(n) extra space for each word we check. For interview purposes, it's better to demonstrate the two-pointer technique that checks palindromes in-place.

## Optimal Solution

The optimal solution uses the two-pointer technique to check if each string is a palindrome. We iterate through the array, and for each string, we use two pointers—one starting at the beginning and one at the end—moving toward the center while comparing characters. This approach uses O(1) extra space for the palindrome check (excluding the input array).

<div class="code-group">

```python
# Time: O(n * m) where n = number of words, m = average word length
# Space: O(1) excluding the input array
def firstPalindrome(words):
    # Iterate through each word in the array
    for word in words:
        # Initialize two pointers: left at start, right at end
        left, right = 0, len(word) - 1

        # Check if the word is a palindrome using two pointers
        is_palindrome = True
        while left < right:
            # If characters don't match, it's not a palindrome
            if word[left] != word[right]:
                is_palindrome = False
                break
            # Move pointers toward the center
            left += 1
            right -= 1

        # If we found a palindrome, return it immediately
        if is_palindrome:
            return word

    # If no palindrome found, return empty string
    return ""
```

```javascript
// Time: O(n * m) where n = number of words, m = average word length
// Space: O(1) excluding the input array
function firstPalindrome(words) {
  // Iterate through each word in the array
  for (let word of words) {
    // Initialize two pointers: left at start, right at end
    let left = 0;
    let right = word.length - 1;
    let isPalindrome = true;

    // Check if the word is a palindrome using two pointers
    while (left < right) {
      // If characters don't match, it's not a palindrome
      if (word[left] !== word[right]) {
        isPalindrome = false;
        break;
      }
      // Move pointers toward the center
      left++;
      right--;
    }

    // If we found a palindrome, return it immediately
    if (isPalindrome) {
      return word;
    }
  }

  // If no palindrome found, return empty string
  return "";
}
```

```java
// Time: O(n * m) where n = number of words, m = average word length
// Space: O(1) excluding the input array
public String firstPalindrome(String[] words) {
    // Iterate through each word in the array
    for (String word : words) {
        // Initialize two pointers: left at start, right at end
        int left = 0;
        int right = word.length() - 1;
        boolean isPalindrome = true;

        // Check if the word is a palindrome using two pointers
        while (left < right) {
            // If characters don't match, it's not a palindrome
            if (word.charAt(left) != word.charAt(right)) {
                isPalindrome = false;
                break;
            }
            // Move pointers toward the center
            left++;
            right--;
        }

        // If we found a palindrome, return it immediately
        if (isPalindrome) {
            return word;
        }
    }

    // If no palindrome found, return empty string
    return "";
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- `n` is the number of words in the array
- `m` is the average length of the words
- We iterate through all `n` words, and for each word, we check up to `m/2` character comparisons in the worst case
- In the best case, we find a palindrome in the first word: O(m)
- In the worst case, no word is a palindrome: O(n × m)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the pointers and boolean flag
- The input array is not counted toward space complexity (it's given)
- Even if we consider the space for the output string, it's just a reference to an existing string in the array

## Common Mistakes

1. **Not handling empty strings properly**: An empty string is technically a palindrome (reads the same forwards and backwards). If you have `["", "abc"]`, the answer should be `""`. Some implementations might crash with index errors when checking `word[0]` on an empty string. Always check the length first.

2. **Off-by-one errors in pointer logic**: The condition should be `left < right`, not `left <= right`. When `left == right`, we're at the middle character of an odd-length string, and we don't need to compare it with itself. Using `<=` would work but adds an unnecessary comparison.

3. **Continuing to check after finding a non-palindrome**: Once you find mismatching characters, you should break out of the inner loop immediately. Continuing to check the rest of the characters wastes time.

4. **Forgetting to return empty string when no palindrome exists**: This is an easy oversight. Always handle the case where you traverse the entire array without finding a palindrome.

5. **Case sensitivity issues**: The problem doesn't specify case sensitivity, but typically palindrome checks are case-sensitive. "Racecar" is not the same as "racecaR" unless specified otherwise.

## When You'll See This Pattern

The two-pointer technique for palindrome checking appears in many problems:

1. **Valid Palindrome (LeetCode 125)**: The classic problem that asks if a string is a palindrome after removing non-alphanumeric characters and ignoring case. This is essentially the same palindrome check but with preprocessing.

2. **Palindrome Linked List (LeetCode 234)**: While this uses a linked list instead of an array, the core idea of comparing elements from both ends moving toward the center is the same.

3. **Longest Palindromic Substring (LeetCode 5)**: This expands on the palindrome check by finding the longest palindrome within a string, often using expanding centers which is a variation of the two-pointer approach.

4. **Valid Palindrome II (LeetCode 680)**: This adds complexity by allowing one deletion—can the string become a palindrome by removing at most one character?

The pattern is recognizable when you need to compare elements from opposite ends of a sequence, whether it's a string, array, or linked list.

## Key Takeaways

1. **Two-pointer technique is ideal for symmetric comparisons**: When you need to compare elements from both ends moving toward the center, two pointers (one from start, one from end) is the natural and efficient approach.

2. **Early termination improves efficiency**: Once you know a string isn't a palindrome (mismatch found), stop checking it. Similarly, once you find the first palindrome in the array, return it immediately.

3. **Edge cases matter**: Always consider empty strings, single-character strings (which are always palindromes), and the case where no palindrome exists. These edge cases often reveal bugs in the implementation.

4. **Space efficiency matters in interviews**: While creating a reversed string (`word == word[::-1]`) works, interviewers appreciate seeing the in-place two-pointer solution that uses O(1) extra space.

Related problems: [Valid Palindrome](/problem/valid-palindrome)
