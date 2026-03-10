---
title: "How to Solve Minimum Length of String After Deleting Similar Ends — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Length of String After Deleting Similar Ends. Medium difficulty, 56.1% acceptance rate. Topics: Two Pointers, String."
date: "2026-03-04"
category: "dsa-patterns"
tags: ["minimum-length-of-string-after-deleting-similar-ends", "two-pointers", "string", "medium"]
---

# How to Solve Minimum Length of String After Deleting Similar Ends

This problem asks us to repeatedly remove matching characters from the beginning and end of a string until we can't anymore, then return the remaining length. What makes this tricky is that we need to remove _all_ matching characters from both ends in each operation, not just one character at a time. For example, if we have "aaabbaa", we can remove all 'a's from both ends in one operation, leaving "bb" as the result.

## Visual Walkthrough

Let's trace through an example step by step: `s = "caabaabac"`

**Step 1:** Check if first and last characters match

- First character: 'c'
- Last character: 'c'
- They match! We can remove them.

**Step 2:** Remove all matching characters from both ends

- From left: 'c' (just one 'c')
- From right: 'c' (just one 'c')
- After removal: "aabaaba"

**Step 3:** Check again

- First character: 'a'
- Last character: 'a'
- They match! We can remove them.

**Step 4:** Remove all matching characters from both ends

- From left: 'a', 'a' (two 'a's in a row)
- From right: 'a' (just one 'a')
- After removal: "baab"

**Step 5:** Check again

- First character: 'b'
- Last character: 'b'
- They match! We can remove them.

**Step 6:** Remove all matching characters from both ends

- From left: 'b' (just one 'b')
- From right: 'b' (just one 'b')
- After removal: "aa"

**Step 7:** Check again

- First character: 'a'
- Last character: 'a'
- They match! We can remove them.

**Step 8:** Remove all matching characters from both ends

- From left: 'a', 'a' (both 'a's)
- From right: nothing left
- After removal: "" (empty string)

**Final result:** Length = 0

The key insight is that we don't need to actually modify the string. We can use two pointers to track what would remain.

## Brute Force Approach

A naive approach would be to literally perform the described algorithm: repeatedly find matching prefixes and suffixes, create new strings by removing them, and continue until no more matches. Here's what that might look like:

<div class="code-group">

```python
def minimumLength(s: str) -> int:
    while len(s) > 1 and s[0] == s[-1]:
        # Find all matching characters from left
        left_char = s[0]
        left_count = 0
        while left_count < len(s) and s[left_count] == left_char:
            left_count += 1

        # Find all matching characters from right
        right_char = s[-1]
        right_count = 0
        while right_count < len(s) and s[-(right_count + 1)] == right_char:
            right_count += 1

        # Remove both prefix and suffix
        s = s[left_count:len(s)-right_count]

    return len(s)
```

```javascript
function minimumLength(s) {
  while (s.length > 1 && s[0] === s[s.length - 1]) {
    // Find all matching characters from left
    const leftChar = s[0];
    let leftCount = 0;
    while (leftCount < s.length && s[leftCount] === leftChar) {
      leftCount++;
    }

    // Find all matching characters from right
    const rightChar = s[s.length - 1];
    let rightCount = 0;
    while (rightCount < s.length && s[s.length - 1 - rightCount] === rightChar) {
      rightCount++;
    }

    // Remove both prefix and suffix
    s = s.substring(leftCount, s.length - rightCount);
  }

  return s.length;
}
```

```java
public int minimumLength(String s) {
    while (s.length() > 1 && s.charAt(0) == s.charAt(s.length() - 1)) {
        // Find all matching characters from left
        char leftChar = s.charAt(0);
        int leftCount = 0;
        while (leftCount < s.length() && s.charAt(leftCount) == leftChar) {
            leftCount++;
        }

        // Find all matching characters from right
        char rightChar = s.charAt(s.length() - 1);
        int rightCount = 0;
        while (rightCount < s.length() && s.charAt(s.length() - 1 - rightCount) == rightChar) {
            rightCount++;
        }

        // Remove both prefix and suffix
        s = s.substring(leftCount, s.length() - rightCount);
    }

    return s.length();
}
```

</div>

**Why this is inefficient:**

- Time complexity: O(n²) in worst case (like "aaaaa" where we remove one character at a time)
- Space complexity: O(n) for creating new strings
- We're doing redundant work by scanning the same characters multiple times

## Optimized Approach

The key insight is that we don't need to actually modify the string or count characters repeatedly. We can use two pointers:

- `left` pointer starts at the beginning
- `right` pointer starts at the end

We move these pointers inward while:

1. The characters at `left` and `right` match
2. We haven't crossed pointers (left < right)
3. We move `left` rightward past all consecutive matching characters
4. We move `right` leftward past all consecutive matching characters

This approach is O(n) because each character is visited at most once by either pointer.

## Optimal Solution

Here's the optimal two-pointer solution with detailed comments:

<div class="code-group">

```python
def minimumLength(s: str) -> int:
    """
    Time: O(n) - Each pointer traverses at most n characters
    Space: O(1) - Only using pointers, no extra data structures
    """
    left, right = 0, len(s) - 1

    # Continue while we have at least 2 characters and they match
    while left < right and s[left] == s[right]:
        # Store the current matching character
        current_char = s[left]

        # Move left pointer rightward past all consecutive matching characters
        # Important: left <= right ensures we don't go past the right pointer
        while left <= right and s[left] == current_char:
            left += 1

        # Move right pointer leftward past all consecutive matching characters
        # Important: left <= right ensures we don't go past the left pointer
        while left <= right and s[right] == current_char:
            right -= 1

    # The remaining length is right - left + 1
    # If left > right, we've removed everything (length = 0)
    return max(0, right - left + 1)
```

```javascript
function minimumLength(s) {
  /**
   * Time: O(n) - Each pointer traverses at most n characters
   * Space: O(1) - Only using pointers, no extra data structures
   */
  let left = 0;
  let right = s.length - 1;

  // Continue while we have at least 2 characters and they match
  while (left < right && s[left] === s[right]) {
    // Store the current matching character
    const currentChar = s[left];

    // Move left pointer rightward past all consecutive matching characters
    // Important: left <= right ensures we don't go past the right pointer
    while (left <= right && s[left] === currentChar) {
      left++;
    }

    // Move right pointer leftward past all consecutive matching characters
    // Important: left <= right ensures we don't go past the left pointer
    while (left <= right && s[right] === currentChar) {
      right--;
    }
  }

  // The remaining length is right - left + 1
  // If left > right, we've removed everything (length = 0)
  return Math.max(0, right - left + 1);
}
```

```java
public int minimumLength(String s) {
    /**
     * Time: O(n) - Each pointer traverses at most n characters
     * Space: O(1) - Only using pointers, no extra data structures
     */
    int left = 0;
    int right = s.length() - 1;

    // Continue while we have at least 2 characters and they match
    while (left < right && s.charAt(left) == s.charAt(right)) {
        // Store the current matching character
        char currentChar = s.charAt(left);

        // Move left pointer rightward past all consecutive matching characters
        // Important: left <= right ensures we don't go past the right pointer
        while (left <= right && s.charAt(left) == currentChar) {
            left++;
        }

        // Move right pointer leftward past all consecutive matching characters
        // Important: left <= right ensures we don't go past the left pointer
        while (left <= right && s.charAt(right) == currentChar) {
            right--;
        }
    }

    // The remaining length is right - left + 1
    // If left > right, we've removed everything (length = 0)
    return Math.max(0, right - left + 1);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each character is visited at most twice (once by each pointer)
- The outer while loop runs until pointers meet or characters don't match
- The inner while loops move pointers without revisiting characters

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the pointers
- No additional data structures are created
- The input string is not modified

## Common Mistakes

1. **Forgetting to check if pointers have crossed:** In the inner while loops, you must check `left <= right` before accessing `s[left]` or `s[right]`. Without this check, you'll get index out of bounds errors when the entire string gets removed.

2. **Not handling the empty string case:** When `left > right`, the result should be 0, not a negative number. That's why we use `max(0, right - left + 1)` or equivalent.

3. **Moving pointers incorrectly in the inner loops:** Some candidates try to move both pointers in the same loop or forget to skip all consecutive matching characters. Remember: we need to remove ALL matching characters from each side, not just one.

4. **Overcomplicating with string manipulation:** The most efficient solution doesn't modify the string at all. Creating new substrings on each iteration leads to O(n²) time complexity in worst case.

## When You'll See This Pattern

The two-pointer technique used here appears in many string and array problems:

1. **Valid Palindrome (LeetCode 125)** - Uses two pointers moving inward to compare characters from both ends.
2. **Container With Most Water (LeetCode 11)** - Uses two pointers at opposite ends, moving inward based on height comparisons.
3. **Two Sum II - Input Array Is Sorted (LeetCode 167)** - Uses two pointers from both ends to find pairs that sum to a target.
4. **Remove Duplicates from Sorted Array (LeetCode 26)** - Uses a slow and fast pointer to track unique elements.

The pattern is recognizable when you need to compare or process elements from both ends of a sequence, often to find pairs, check symmetry, or remove elements conditionally.

## Key Takeaways

1. **Two pointers moving inward** is the optimal pattern for problems involving comparisons from both ends of a string or array. It gives O(n) time and O(1) space.

2. **Always check pointer bounds** when moving them in while loops. The condition `left <= right` prevents accessing invalid indices and handles the empty result case.

3. **Don't modify the original data** unless necessary. Working with indices/pointers is usually more efficient than creating new strings or arrays.

[Practice this problem on CodeJeet](/problem/minimum-length-of-string-after-deleting-similar-ends)
