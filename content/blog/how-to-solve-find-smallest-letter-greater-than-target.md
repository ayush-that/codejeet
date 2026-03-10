---
title: "How to Solve Find Smallest Letter Greater Than Target — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Smallest Letter Greater Than Target. Easy difficulty, 58.9% acceptance rate. Topics: Array, Binary Search."
date: "2026-12-06"
category: "dsa-patterns"
tags: ["find-smallest-letter-greater-than-target", "array", "binary-search", "easy"]
---

# How to Solve Find Smallest Letter Greater Than Target

This problem asks us to find the smallest character in a sorted array that's lexicographically greater than a given target character. What makes this interesting is that it's essentially a binary search problem disguised as a character search, with a twist: if no character is greater than the target, we need to wrap around and return the first character in the array.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `letters = ['c', 'f', 'j']` and `target = 'a'`.

**Step 1:** We need to find the smallest character greater than 'a'. Looking at the array:

- 'c' > 'a' ✓
- 'f' > 'a' ✓
- 'j' > 'a' ✓

The smallest of these is 'c', so we return 'c'.

**Example 2:** `letters = ['c', 'f', 'j']`, `target = 'c'`

- 'c' > 'c'? No (not greater, equal)
- 'f' > 'c' ✓
- 'j' > 'c' ✓

The smallest greater character is 'f'.

**Example 3:** `letters = ['c', 'f', 'j']`, `target = 'j'`

- 'c' > 'j'? No
- 'f' > 'j'? No
- 'j' > 'j'? No

No character is greater than 'j', so we wrap around and return the first character 'c'.

The key insight: we're looking for the **first character that's strictly greater than the target**. If we don't find one, we return the first character.

## Brute Force Approach

The most straightforward approach is to scan through the array from left to right and return the first character that's greater than the target. If we reach the end without finding one, we return the first character.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def nextGreatestLetter(letters, target):
    # Linear scan through the array
    for char in letters:
        # Return first character greater than target
        if char > target:
            return char
    # If no character found, wrap around to first character
    return letters[0]
```

```javascript
// Time: O(n) | Space: O(1)
function nextGreatestLetter(letters, target) {
  // Linear scan through the array
  for (let char of letters) {
    // Return first character greater than target
    if (char > target) {
      return char;
    }
  }
  // If no character found, wrap around to first character
  return letters[0];
}
```

```java
// Time: O(n) | Space: O(1)
public char nextGreatestLetter(char[] letters, char target) {
    // Linear scan through the array
    for (char c : letters) {
        // Return first character greater than target
        if (c > target) {
            return c;
        }
    }
    // If no character found, wrap around to first character
    return letters[0];
}
```

</div>

**Why this isn't optimal:** While this solution works and is easy to understand, it has O(n) time complexity. Since the array is sorted, we can do better with binary search, achieving O(log n) time complexity. In interviews, you're expected to recognize when a sorted array allows for binary search optimization.

## Optimal Solution

The optimal solution uses binary search to find the first character greater than the target. The key insight is that we're looking for the **upper bound** of the target in the array.

Here's how binary search works for this problem:

1. Initialize `left = 0` and `right = len(letters) - 1`
2. While `left <= right`, calculate `mid`
3. If `letters[mid] <= target`, the answer must be to the right
4. If `letters[mid] > target`, this could be our answer, but we need to check if there's a smaller one to the left
5. After the loop, if we haven't found a character greater than target, wrap around

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def nextGreatestLetter(letters, target):
    # Initialize binary search boundaries
    left, right = 0, len(letters) - 1

    # Perform binary search
    while left <= right:
        # Calculate middle index
        mid = left + (right - left) // 2  # Avoids potential overflow

        # If middle character is less than or equal to target,
        # we need to search in the right half
        if letters[mid] <= target:
            left = mid + 1
        else:
            # Middle character is greater than target,
            # but there might be a smaller valid character to the left
            right = mid - 1

    # After the loop, 'left' points to the first character greater than target
    # If left is out of bounds (equal to len(letters)), wrap around to first character
    return letters[left] if left < len(letters) else letters[0]
```

```javascript
// Time: O(log n) | Space: O(1)
function nextGreatestLetter(letters, target) {
  // Initialize binary search boundaries
  let left = 0;
  let right = letters.length - 1;

  // Perform binary search
  while (left <= right) {
    // Calculate middle index
    const mid = Math.floor(left + (right - left) / 2); // Avoids potential overflow

    // If middle character is less than or equal to target,
    // we need to search in the right half
    if (letters[mid] <= target) {
      left = mid + 1;
    } else {
      // Middle character is greater than target,
      // but there might be a smaller valid character to the left
      right = mid - 1;
    }
  }

  // After the loop, 'left' points to the first character greater than target
  // If left is out of bounds (equal to letters.length), wrap around to first character
  return left < letters.length ? letters[left] : letters[0];
}
```

```java
// Time: O(log n) | Space: O(1)
public char nextGreatestLetter(char[] letters, char target) {
    // Initialize binary search boundaries
    int left = 0;
    int right = letters.length - 1;

    // Perform binary search
    while (left <= right) {
        // Calculate middle index
        int mid = left + (right - left) / 2;  // Avoids potential overflow

        // If middle character is less than or equal to target,
        // we need to search in the right half
        if (letters[mid] <= target) {
            left = mid + 1;
        } else {
            // Middle character is greater than target,
            // but there might be a smaller valid character to the left
            right = mid - 1;
        }
    }

    // After the loop, 'left' points to the first character greater than target
    // If left is out of bounds (equal to letters.length), wrap around to first character
    return left < letters.length ? letters[left] : letters[0];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We're using binary search, which halves the search space with each iteration
- In the worst case, we make log₂(n) comparisons

**Space Complexity:** O(1)

- We only use a constant amount of extra space for pointers (left, right, mid)
- No additional data structures are created

## Common Mistakes

1. **Forgetting the wrap-around case:** The problem states that if no character is greater than the target, we should return the first character. Candidates often forget this edge case and return null or an error.

2. **Using `letters[mid] < target` instead of `letters[mid] <= target`:** We need strictly greater characters, so when `letters[mid] == target`, we should continue searching to the right. Using `<` would cause us to incorrectly return the target itself if it exists in the array.

3. **Off-by-one errors with binary search boundaries:** A common mistake is using `while left < right` instead of `while left <= right`, which can cause the search to terminate early and miss the correct answer.

4. **Integer overflow when calculating mid:** Using `(left + right) // 2` can cause overflow in languages with fixed integer sizes (like Java). Always use `left + (right - left) // 2` to avoid this.

## When You'll See This Pattern

This problem teaches the **upper bound binary search** pattern, which appears in many problems:

1. **First Bad Version (LeetCode 278):** Finding the first bad version in a series - same pattern of finding the first element that satisfies a condition.

2. **Search Insert Position (LeetCode 35):** Finding the position where a target should be inserted in a sorted array - very similar to finding the first element greater than or equal to the target.

3. **Find First and Last Position of Element in Sorted Array (LeetCode 34):** Uses both lower bound (first occurrence) and upper bound (last occurrence) binary search patterns.

The key recognition signal: when you need to find the **first** or **last** element that satisfies some condition in a **sorted** array, binary search is likely the optimal approach.

## Key Takeaways

1. **Sorted arrays beg for binary search:** Whenever you see a sorted array and need to find an element or position, binary search should be your first thought.

2. **Upper bound vs lower bound:** Understand the difference between finding the first element greater than target (upper bound) and the first element greater than or equal to target (lower bound). This problem requires the upper bound.

3. **Wrap-around logic is a common pattern:** Many circular or cyclic problems require wrapping around to the beginning when you reach the end. Always check if your solution handles this correctly.

Related problems: [Count Elements With Strictly Smaller and Greater Elements](/problem/count-elements-with-strictly-smaller-and-greater-elements)
