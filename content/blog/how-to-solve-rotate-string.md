---
title: "How to Solve Rotate String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rotate String. Easy difficulty, 65.1% acceptance rate. Topics: String, String Matching."
date: "2026-12-22"
category: "dsa-patterns"
tags: ["rotate-string", "string", "string-matching", "easy"]
---

# How to Solve Rotate String

The Rotate String problem asks whether one string can be transformed into another through repeated circular shifts, where each shift moves the first character to the end. While conceptually simple, this problem tests your understanding of string manipulation and pattern matching, with a clever optimization that separates basic from strong solutions.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `s = "abcde"` and `goal = "cdeab"`.

**Step 1:** Check if the strings are the same length. Both have 5 characters, so we can proceed.

**Step 2:** Try all possible rotations:

- Original: `"abcde"` → doesn't match `"cdeab"`
- 1st shift: `"bcdea"` → doesn't match
- 2nd shift: `"cdeab"` → matches! Found a valid rotation.

**Step 3:** Since we found a match at the 2nd rotation, we return `true`.

What makes this interesting? The key insight is that if `goal` is a rotation of `s`, then `goal` must be a substring of `s + s`. Let's verify:

- `s + s = "abcdeabcde"`
- Look for `goal = "cdeab"` within this concatenated string
- Indeed, `"cdeab"` appears starting at index 2 of `"abcdeabcde"`

This observation leads to an elegant one-line solution.

## Brute Force Approach

The most straightforward approach is to try every possible rotation of `s` and check if it equals `goal`. For a string of length `n`, there are `n` possible rotations (including the original string).

**Algorithm:**

1. If `s` and `goal` have different lengths, return `false`
2. For each rotation from 0 to `n-1`:
   - Create the rotated string by taking characters from index `i` to end, then from 0 to `i-1`
   - Compare with `goal`
3. If any rotation matches, return `true`; otherwise, return `false`

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def rotateString(s: str, goal: str) -> bool:
    # Different lengths can't be rotations
    if len(s) != len(goal):
        return False

    n = len(s)

    # Try every possible rotation
    for i in range(n):
        # Create rotated string: from i to end + from start to i-1
        rotated = s[i:] + s[:i]
        if rotated == goal:
            return True

    return False
```

```javascript
// Time: O(n²) | Space: O(n)
function rotateString(s, goal) {
  // Different lengths can't be rotations
  if (s.length !== goal.length) {
    return false;
  }

  const n = s.length;

  // Try every possible rotation
  for (let i = 0; i < n; i++) {
    // Create rotated string: from i to end + from start to i-1
    const rotated = s.substring(i) + s.substring(0, i);
    if (rotated === goal) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(n²) | Space: O(n)
public boolean rotateString(String s, String goal) {
    // Different lengths can't be rotations
    if (s.length() != goal.length()) {
        return false;
    }

    int n = s.length();

    // Try every possible rotation
    for (int i = 0; i < n; i++) {
        // Create rotated string: from i to end + from start to i-1
        String rotated = s.substring(i) + s.substring(0, i);
        if (rotated.equals(goal)) {
            return true;
        }
    }

    return false;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n²) because for each of n rotations, we create a new string of length n (O(n) operation)
- Space complexity is O(n) for the rotated string
- We can do better by avoiding string creation for each rotation

## Optimal Solution

The optimal solution uses the key insight: if `goal` is a rotation of `s`, then `goal` must be a substring of `s + s`. This reduces the problem to a simple substring check.

**Proof of correctness:**
If `goal` is a rotation of `s`, then `goal = s[i:] + s[:i]` for some `i`. This means `goal` appears in `s + s` starting at position `i`. Conversely, if `goal` appears in `s + s` and has the same length as `s`, then `goal` must be a rotation of `s`.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def rotateString(s: str, goal: str) -> bool:
    # Step 1: Check if lengths are equal
    # Different lengths can't be rotations of each other
    if len(s) != len(goal):
        return False

    # Step 2: Concatenate s with itself
    # Any rotation of s will be a substring of s + s
    doubled = s + s

    # Step 3: Check if goal is a substring of doubled
    # The in operator in Python uses efficient string matching
    return goal in doubled
```

```javascript
// Time: O(n) | Space: O(n)
function rotateString(s, goal) {
  // Step 1: Check if lengths are equal
  // Different lengths can't be rotations of each other
  if (s.length !== goal.length) {
    return false;
  }

  // Step 2: Concatenate s with itself
  // Any rotation of s will be a substring of s + s
  const doubled = s + s;

  // Step 3: Check if goal is a substring of doubled
  // indexOf returns -1 if goal is not found
  return doubled.includes(goal);
}
```

```java
// Time: O(n) | Space: O(n)
public boolean rotateString(String s, String goal) {
    // Step 1: Check if lengths are equal
    // Different lengths can't be rotations of each other
    if (s.length() != goal.length()) {
        return false;
    }

    // Step 2: Concatenate s with itself
    // Any rotation of s will be a substring of s + s
    String doubled = s + s;

    // Step 3: Check if goal is a substring of doubled
    // contains() uses efficient string matching internally
    return doubled.contains(goal);
}
```

</div>

**Why this is optimal:**

- String concatenation (`s + s`) is O(n) time and O(n) space
- Substring search (using built-in methods) is typically O(n) time with efficient algorithms like KMP
- Overall O(n) time and O(n) space, which is optimal for this problem

## Complexity Analysis

**Time Complexity: O(n)**

- Checking lengths: O(1)
- Creating `s + s`: O(n) where n is the length of s
- Substring search: Typically O(n) with efficient string matching algorithms (Python's `in`, JavaScript's `includes()`, Java's `contains()` all use optimized implementations)

**Space Complexity: O(n)**

- We need O(n) space to store `s + s`, which has length 2n
- The substring search may use additional O(n) space depending on implementation, but in practice most languages optimize this

**Why O(n) is optimal:**
We must at least examine every character of both strings to determine if they're rotations, so Ω(n) is a lower bound. Our solution achieves this bound.

## Common Mistakes

1. **Not checking string lengths first**
   - Mistake: Jumping straight to the substring check without verifying lengths are equal
   - Why it's wrong: `"ab"` would be considered a rotation of `"abc"` since `"ab"` appears in `"abcabc"`
   - Fix: Always compare lengths first and return `false` if they differ

2. **Using the wrong concatenation**
   - Mistake: Checking if `goal` is in `s` instead of `s + s`
   - Why it's wrong: `"cdeab"` is not in `"abcde"` but is in `"abcdeabcde"`
   - Fix: Always concatenate the string with itself: `s + s`

3. **Inefficient rotation generation**
   - Mistake: Creating all n rotated strings explicitly in a brute force approach
   - Why it's wrong: O(n²) time complexity when O(n) is possible
   - Fix: Use the substring check approach instead

4. **Forgetting edge cases**
   - Mistake: Not handling empty strings properly
   - Why it's wrong: Empty string is a rotation of itself, but some implementations might fail
   - Fix: The length check handles this correctly (0 == 0, and `""` is in `"" + "" = ""`)

## When You'll See This Pattern

The "concatenate with itself" pattern appears in several string rotation and circular array problems:

1. **Rotate Array (LeetCode 189)**
   - While not identical, it involves similar circular shifting concepts
   - The "reverse portions of array" trick is another way to handle rotations

2. **Repeated Substring Pattern (LeetCode 459)**
   - Uses a similar trick: if a string can be constructed by repeating a substring, then it will appear in `(s + s)[1:-1]`
   - Same core insight of concatenating and searching

3. **Circular array problems**
   - Many problems involving circular buffers or rotations can benefit from duplicating the array
   - Example: Finding maximum sum in a circular array often uses array concatenation

The pattern to recognize: **When dealing with rotations or circular structures, consider duplicating the sequence to linearize it.**

## Key Takeaways

1. **String rotation = substring in doubled string**
   - The most important insight: if B is a rotation of A, then B is a substring of A+A
   - This transforms a rotation problem into a substring search problem

2. **Always check lengths first**
   - Different-length strings cannot be rotations
   - This simple check prevents false positives and is an easy optimization

3. **Built-in string methods are optimized**
   - Don't reinvent substring search; use language-provided methods
   - They typically implement efficient algorithms like KMP or Boyer-Moore

Remember this pattern: when you need to check for rotations, duplicates, or circular matches, concatenating with itself is often the key to a clean, efficient solution.

[Practice this problem on CodeJeet](/problem/rotate-string)
