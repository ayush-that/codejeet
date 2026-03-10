---
title: "How to Solve Count Unique Characters of All Substrings of a Given String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Unique Characters of All Substrings of a Given String. Hard difficulty, 53.5% acceptance rate. Topics: Hash Table, String, Dynamic Programming."
date: "2027-10-19"
category: "dsa-patterns"
tags:
  [
    "count-unique-characters-of-all-substrings-of-a-given-string",
    "hash-table",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Count Unique Characters of All Substrings of a Given String

This problem asks us to sum the number of unique characters across all possible substrings of a given string. The challenge comes from the sheer number of substrings—O(n²) of them—making brute force enumeration too slow for typical constraints. The key insight is to think in reverse: instead of checking each substring for unique characters, we can determine for each character how many substrings it contributes to as a unique character.

## Visual Walkthrough

Let's trace through a small example: `s = "ABA"`. All substrings are:

- Length 1: `"A"`, `"B"`, `"A"` → unique counts: 1, 1, 1
- Length 2: `"AB"`, `"BA"` → unique counts: 2, 2
- Length 3: `"ABA"` → unique count: 1 (only 'B' is unique)

Total sum = 1+1+1+2+2+1 = 8

Now let's think about contribution: For the first 'A' at index 0:

- It can be part of substrings starting at index 0
- It will be unique in those substrings until we encounter another 'A'
- The next 'A' is at index 2
- So substrings containing only this 'A' (not the other) are those ending before index 2
- Starting positions: 0 only
- Ending positions: 0 or 1 (but not 2, since that would include both A's)
- That gives us 2 substrings (indices [0,0] and [0,1]) where this 'A' is unique

Similarly, for 'B' at index 1:

- Previous same char: none (treat as -1)
- Next same char: none (treat as n, where n=3)
- Starting positions: can be 0 or 1 (but not later than 1)
- Ending positions: can be 1 or 2 (but not before 1)
- So starting positions: 0 to 1 = 2 options
- Ending positions: 1 to 2 = 2 options
- Total substrings where 'B' is unique: 2 × 2 = 4

For the second 'A' at index 2:

- Previous same char: index 0
- Next same char: none (treat as 3)
- Starting positions: can be 1 or 2 (but not 0, since that would include first 'A')
- Ending positions: can be 2 only (since string ends)
- So starting positions: 1 to 2 = 2 options
- Ending positions: 2 only = 1 option
- Total: 2 × 1 = 2

Sum of contributions: 2 + 4 + 2 = 8, matching our brute force calculation.

## Brute Force Approach

The most straightforward approach is to generate all substrings and count unique characters in each:

1. Generate all O(n²) substrings
2. For each substring, use a frequency counter to count characters that appear exactly once
3. Sum these counts

This approach is easy to understand but has O(n³) time complexity (O(n²) substrings × O(n) to process each). For n up to 10⁵ (typical constraints), this is completely infeasible.

<div class="code-group">

```python
# Time: O(n³) | Space: O(n)
def uniqueLetterString_brute(s: str) -> int:
    n = len(s)
    total = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            # Count unique chars in substring s[i:j+1]
            freq = {}
            for k in range(i, j + 1):
                freq[s[k]] = freq.get(s[k], 0) + 1

            # Add count of chars with frequency 1
            for count in freq.values():
                if count == 1:
                    total += 1

    return total
```

```javascript
// Time: O(n³) | Space: O(n)
function uniqueLetterStringBrute(s) {
  const n = s.length;
  let total = 0;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count unique chars in substring s[i..j]
      const freq = new Map();
      for (let k = i; k <= j; k++) {
        const char = s[k];
        freq.set(char, (freq.get(char) || 0) + 1);
      }

      // Add count of chars with frequency 1
      for (const count of freq.values()) {
        if (count === 1) {
          total++;
        }
      }
    }
  }

  return total;
}
```

```java
// Time: O(n³) | Space: O(n)
public int uniqueLetterStringBrute(String s) {
    int n = s.length();
    int total = 0;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count unique chars in substring s[i..j]
            Map<Character, Integer> freq = new HashMap<>();
            for (int k = i; k <= j; k++) {
                char c = s.charAt(k);
                freq.put(c, freq.getOrDefault(c, 0) + 1);
            }

            // Add count of chars with frequency 1
            for (int count : freq.values()) {
                if (count == 1) {
                    total++;
                }
            }
        }
    }

    return total;
}
```

</div>

## Optimized Approach

The key insight is to change our perspective: instead of asking "how many unique characters does this substring have?", we ask "for this character, in how many substrings is it unique?"

For a character at position `i`, it will be unique in a substring if:

1. The substring contains this character
2. The substring does NOT contain any other occurrence of the same character

If we know:

- `prev[i]` = index of previous occurrence of `s[i]`, or -1 if none
- `next[i]` = index of next occurrence of `s[i]`, or n if none

Then the number of substrings where `s[i]` is unique is:

- Number of possible starting positions: `(i - prev[i])`
- Number of possible ending positions: `(next[i] - i)`
- Total contribution: `(i - prev[i]) × (next[i] - i)`

We sum this contribution for all positions `i` to get the total answer.

## Optimal Solution

We need to compute `prev` and `next` arrays efficiently. We can do this with two passes using hash maps to track the last seen position of each character.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def uniqueLetterString(s: str) -> int:
    n = len(s)

    # prev[i] = index of previous occurrence of s[i], or -1 if none
    prev = [-1] * n
    # next[i] = index of next occurrence of s[i], or n if none
    nxt = [n] * n

    # Dictionary to store last seen position of each character
    last_pos = {}

    # First pass: compute prev array (left to right)
    for i in range(n):
        char = s[i]
        if char in last_pos:
            prev[i] = last_pos[char]
        last_pos[char] = i

    # Reset for second pass
    last_pos.clear()

    # Second pass: compute next array (right to left)
    for i in range(n - 1, -1, -1):
        char = s[i]
        if char in last_pos:
            nxt[i] = last_pos[char]
        last_pos[char] = i

    # Calculate total contribution
    total = 0
    for i in range(n):
        # Number of substrings where s[i] is unique
        left_count = i - prev[i]      # Possible starting positions
        right_count = nxt[i] - i      # Possible ending positions
        total += left_count * right_count

    return total
```

```javascript
// Time: O(n) | Space: O(n)
function uniqueLetterString(s) {
  const n = s.length;

  // prev[i] = index of previous occurrence of s[i], or -1 if none
  const prev = new Array(n).fill(-1);
  // next[i] = index of next occurrence of s[i], or n if none
  const next = new Array(n).fill(n);

  // Map to store last seen position of each character
  const lastPos = new Map();

  // First pass: compute prev array (left to right)
  for (let i = 0; i < n; i++) {
    const char = s[i];
    if (lastPos.has(char)) {
      prev[i] = lastPos.get(char);
    }
    lastPos.set(char, i);
  }

  // Reset for second pass
  lastPos.clear();

  // Second pass: compute next array (right to left)
  for (let i = n - 1; i >= 0; i--) {
    const char = s[i];
    if (lastPos.has(char)) {
      next[i] = lastPos.get(char);
    }
    lastPos.set(char, i);
  }

  // Calculate total contribution
  let total = 0;
  for (let i = 0; i < n; i++) {
    // Number of substrings where s[i] is unique
    const leftCount = i - prev[i]; // Possible starting positions
    const rightCount = next[i] - i; // Possible ending positions
    total += leftCount * rightCount;
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n)
public int uniqueLetterString(String s) {
    int n = s.length();

    // prev[i] = index of previous occurrence of s[i], or -1 if none
    int[] prev = new int[n];
    // next[i] = index of next occurrence of s[i], or n if none
    int[] next = new int[n];

    // Initialize arrays
    Arrays.fill(prev, -1);
    Arrays.fill(next, n);

    // Map to store last seen position of each character
    Map<Character, Integer> lastPos = new HashMap<>();

    // First pass: compute prev array (left to right)
    for (int i = 0; i < n; i++) {
        char c = s.charAt(i);
        if (lastPos.containsKey(c)) {
            prev[i] = lastPos.get(c);
        }
        lastPos.put(c, i);
    }

    // Reset for second pass
    lastPos.clear();

    // Second pass: compute next array (right to left)
    for (int i = n - 1; i >= 0; i--) {
        char c = s.charAt(i);
        if (lastPos.containsKey(c)) {
            next[i] = lastPos.get(c);
        }
        lastPos.put(c, i);
    }

    // Calculate total contribution
    int total = 0;
    for (int i = 0; i < n; i++) {
        // Number of substrings where s[i] is unique
        int leftCount = i - prev[i];    // Possible starting positions
        int rightCount = next[i] - i;   // Possible ending positions
        total += leftCount * rightCount;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string to compute `prev` and `next` arrays: O(n) each
- We make one more pass to calculate contributions: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store `prev` and `next` arrays of size n: O(2n)
- We use a hash map/dictionary that in worst case stores all unique characters: O(n)
- Total: O(3n) = O(n)

## Common Mistakes

1. **Off-by-one errors in substring counting**: When calculating `(i - prev[i]) × (next[i] - i)`, remember that `prev[i]` is the index of the previous same character, not the position before it. The substring can start at any position from `prev[i] + 1` to `i`, which gives `i - prev[i]` possibilities.

2. **Forgetting to handle characters with no previous/next occurrence**: Always initialize `prev` with -1 and `next` with n (string length). This correctly handles boundary cases where a character appears only once or at the ends.

3. **Using O(n²) or O(n³) brute force**: The problem constraints (n up to 10⁵) make anything worse than O(n log n) unacceptable. Recognize that substring counting problems often require this contribution-based approach.

4. **Incorrectly resetting the last position map**: When computing the `next` array in reverse, you must clear the map from the previous pass. Otherwise, you'll get incorrect values from the forward pass.

## When You'll See This Pattern

This "contribution per element" pattern appears in many substring/counting problems:

1. **Total Appeal of A String (Hard)**: Almost identical problem—instead of counting unique characters, you count distinct characters. The solution uses the same `(i - prev[i]) × (next[i] - i)` pattern.

2. **Sum of Subarray Minimums (Medium)**: Find sum of minimums of all subarrays. Uses similar logic with monotonic stacks to find previous/next smaller elements.

3. **Number of Subarrays with Bounded Maximum (Medium)**: Count subarrays where max is within bounds. Uses contribution thinking with boundaries.

The pattern to recognize: when asked to sum some property over all substrings/subarrays, consider calculating each element's contribution to the total sum.

## Key Takeaways

1. **Think in reverse**: Instead of examining each substring to compute a property, determine each element's contribution to the total across all substrings. This often reduces O(n²) or O(n³) problems to O(n).

2. **Boundary tracking is key**: For contribution-based approaches, you typically need to find for each element: how far left/right can you extend while maintaining the property? This often involves finding previous/next occurrences or boundaries.

3. **The (i - prev) × (next - i) formula**: Memorize this pattern—it appears in multiple problems involving substring/subarray contributions. The intuition: an element contributes to all substrings that include it but don't include another element with the same value.

Related problems: [Total Appeal of A String](/problem/total-appeal-of-a-string)
