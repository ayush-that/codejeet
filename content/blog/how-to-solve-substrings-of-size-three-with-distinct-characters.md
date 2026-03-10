---
title: "How to Solve Substrings of Size Three with Distinct Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Substrings of Size Three with Distinct Characters. Easy difficulty, 76.6% acceptance rate. Topics: Hash Table, String, Sliding Window, Counting."
date: "2028-09-07"
category: "dsa-patterns"
tags:
  [
    "substrings-of-size-three-with-distinct-characters",
    "hash-table",
    "string",
    "sliding-window",
    "easy",
  ]
---

# How to Solve "Substrings of Size Three with Distinct Characters"

This problem asks us to count all length-3 substrings in a given string that contain only distinct characters. While conceptually straightforward, it's an excellent introduction to the sliding window pattern—a fundamental technique for substring problems. The challenge lies in efficiently checking each possible substring without redundant work.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "xyzzaz"`:

1. **First window (indices 0-2):** `"xyz"`
   - Characters: x, y, z → all distinct ✓
   - Count: 1

2. **Slide window right (indices 1-3):** `"yzz"`
   - Characters: y, z, z → 'z' repeats ✗
   - Count: 1 (unchanged)

3. **Slide window right (indices 2-4):** `"zza"`
   - Characters: z, z, a → 'z' repeats ✗
   - Count: 1 (unchanged)

4. **Slide window right (indices 3-5):** `"zaz"`
   - Characters: z, a, z → 'z' repeats ✗
   - Count: 1 (unchanged)

Final answer: 1

Notice that as we slide the window, we're only changing one character at a time—the leftmost character exits and a new rightmost character enters. This observation is key to optimization.

## Brute Force Approach

The most straightforward solution checks every possible length-3 substring individually:

1. Iterate through all starting indices from 0 to `len(s)-3`
2. For each starting index, extract the 3-character substring
3. Check if all characters in the substring are distinct
4. Count valid substrings

While this approach works correctly, it's inefficient for larger strings because:

- Extracting substrings creates new string objects (O(k) time each, where k=3)
- Checking distinctness typically requires O(k) operations
- Overall complexity is O(n\*k) = O(3n) = O(n), which is actually acceptable for k=3

However, the brute force approach doesn't teach us the sliding window pattern that scales to variable window sizes. Let's see how we can optimize.

## Optimal Solution

We can use a fixed-size sliding window approach. Since our window size is always 3, we can maintain a count of characters in the current window and update it efficiently as we slide:

1. Start with the first 3 characters
2. Check if they're all distinct
3. Slide the window one position to the right
4. Remove the leftmost character from our tracking
5. Add the new rightmost character to our tracking
6. Repeat until we reach the end

Here's the implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of s
# Space: O(1) since we store at most 3 characters
def countGoodSubstrings(s: str) -> int:
    # If string has fewer than 3 characters, no valid substrings exist
    if len(s) < 3:
        return 0

    count = 0

    # Check first window separately
    # A window is good if all 3 characters are different
    if s[0] != s[1] and s[1] != s[2] and s[0] != s[2]:
        count += 1

    # Slide the window across the string
    # i represents the starting index of the current window
    for i in range(1, len(s) - 2):
        # The window consists of s[i], s[i+1], s[i+2]
        # Check if all three characters are distinct
        if s[i] != s[i+1] and s[i+1] != s[i+2] and s[i] != s[i+2]:
            count += 1

    return count
```

```javascript
// Time: O(n) where n is the length of s
// Space: O(1) since we use only primitive variables
function countGoodSubstrings(s) {
  // If string has fewer than 3 characters, no valid substrings exist
  if (s.length < 3) {
    return 0;
  }

  let count = 0;

  // Check first window separately
  // A window is good if all 3 characters are different
  if (s[0] !== s[1] && s[1] !== s[2] && s[0] !== s[2]) {
    count++;
  }

  // Slide the window across the string
  // i represents the starting index of the current window
  for (let i = 1; i <= s.length - 3; i++) {
    // The window consists of s[i], s[i+1], s[i+2]
    // Check if all three characters are distinct
    if (s[i] !== s[i + 1] && s[i + 1] !== s[i + 2] && s[i] !== s[i + 2]) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) where n is the length of s
// Space: O(1) since we use only primitive variables
public int countGoodSubstrings(String s) {
    // If string has fewer than 3 characters, no valid substrings exist
    if (s.length() < 3) {
        return 0;
    }

    int count = 0;

    // Check first window separately
    // A window is good if all 3 characters are different
    if (s.charAt(0) != s.charAt(1) && s.charAt(1) != s.charAt(2) && s.charAt(0) != s.charAt(2)) {
        count++;
    }

    // Slide the window across the string
    // i represents the starting index of the current window
    for (int i = 1; i <= s.length() - 3; i++) {
        // The window consists of s[i], s[i+1], s[i+2]
        // Check if all three characters are distinct
        if (s.charAt(i) != s.charAt(i+1) && s.charAt(i+1) != s.charAt(i+2) && s.charAt(i) != s.charAt(i+2)) {
            count++;
        }
    }

    return count;
}
```

</div>

## Alternative: HashSet Approach

For a more generalizable solution (works with any window size), we can use a HashSet:

<div class="code-group">

```python
# Time: O(n) where n is the length of s
# Space: O(1) since the set stores at most 3 characters
def countGoodSubstrings(s: str) -> int:
    if len(s) < 3:
        return 0

    count = 0

    for i in range(len(s) - 2):
        # Create a set of characters in the current window
        window_chars = set(s[i:i+3])
        # If set has 3 elements, all characters are distinct
        if len(window_chars) == 3:
            count += 1

    return count
```

```javascript
// Time: O(n) where n is the length of s
// Space: O(1) since the set stores at most 3 characters
function countGoodSubstrings(s) {
  if (s.length < 3) {
    return 0;
  }

  let count = 0;

  for (let i = 0; i <= s.length - 3; i++) {
    // Create a set of characters in the current window
    const windowChars = new Set([s[i], s[i + 1], s[i + 2]]);
    // If set has 3 elements, all characters are distinct
    if (windowChars.size === 3) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) where n is the length of s
// Space: O(1) since the set stores at most 3 characters
public int countGoodSubstrings(String s) {
    if (s.length() < 3) {
        return 0;
    }

    int count = 0;

    for (int i = 0; i <= s.length() - 3; i++) {
        // Create a set of characters in the current window
        Set<Character> windowChars = new HashSet<>();
        windowChars.add(s.charAt(i));
        windowChars.add(s.charAt(i+1));
        windowChars.add(s.charAt(i+2));

        // If set has 3 elements, all characters are distinct
        if (windowChars.size() == 3) {
            count++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We examine each window exactly once
- For n characters, there are n-2 windows
- Each window check takes O(1) time (either 3 comparisons or checking a set of size 3)
- Total: O(n) time

**Space Complexity: O(1)**

- We use only a few integer variables for counting
- Even with the HashSet approach, we store at most 3 characters
- No additional data structures scale with input size

## Common Mistakes

1. **Off-by-one errors in loop boundaries**:
   - Starting the loop at 0 but checking `s[i+2]` without ensuring `i+2 < len(s)`
   - Solution: Loop from 0 to `len(s)-3` inclusive, or from 1 to `len(s)-2`

2. **Incorrect distinctness check**:
   - Only checking if adjacent characters are different (e.g., `s[i] != s[i+1] and s[i+1] != s[i+2]`)
   - Missing the check between first and third character
   - Solution: Check all three pairs or use a HashSet

3. **Not handling short strings**:
   - Assuming the input always has at least 3 characters
   - Solution: Add an early return for `len(s) < 3`

4. **Inefficient substring extraction**:
   - Using `s.substring(i, i+3)` in a loop (creates new strings)
   - While acceptable for k=3, it's inefficient for larger k
   - Solution: Compare characters directly or use a sliding window approach

## When You'll See This Pattern

The sliding window pattern appears in many substring and subarray problems:

1. **Longest Substring Without Repeating Characters (LeetCode #3)**
   - Similar concept but with variable window size
   - Uses a hash map to track character positions

2. **Permutation in String (LeetCode #567)**
   - Checks if one string contains a permutation of another
   - Uses frequency counting with sliding window

3. **Find All Anagrams in a String (LeetCode #438)**
   - Extension of the permutation problem
   - Finds all starting indices of anagrams

These problems all involve examining contiguous sequences within a larger sequence, making sliding window the natural approach.

## Key Takeaways

1. **Fixed-size sliding windows** are simpler than variable-size ones because the window boundaries move in lockstep
2. **Direct character comparison** is more efficient than substring extraction when window size is small
3. **Edge cases matter**—always check for minimum length requirements before processing
4. **The HashSet approach** generalizes better to problems with larger or variable window sizes

This problem serves as a gentle introduction to the sliding window technique, which becomes essential for more complex substring problems.

[Practice this problem on CodeJeet](/problem/substrings-of-size-three-with-distinct-characters)
