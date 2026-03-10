---
title: "How to Solve Unique Substrings in Wraparound String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unique Substrings in Wraparound String. Medium difficulty, 42.7% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-05-27"
category: "dsa-patterns"
tags: ["unique-substrings-in-wraparound-string", "string", "dynamic-programming", "medium"]
---

# How to Solve Unique Substrings in Wraparound String

This problem asks us to count how many unique non-empty substrings of a given string `s` are also substrings of the infinite wraparound string of the alphabet. What makes this tricky is that we're not actually generating substrings—we're counting possible substrings based on consecutive character patterns in `s`. The wraparound string has a special property: characters follow alphabetical order with 'z' wrapping to 'a'.

## Visual Walkthrough

Let's trace through `s = "zab"` step by step:

The wraparound string is: `"...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd..."`

Valid substrings must be consecutive in the wraparound string. For example:

- `"z"`, `"a"`, `"b"` are valid single characters
- `"za"` is valid because 'z' → 'a' wraps around
- `"ab"` is valid because 'a' → 'b' is consecutive
- `"zab"` is valid because 'z' → 'a' → 'b' forms a consecutive sequence

But `"zb"` is NOT valid because 'z' doesn't directly go to 'b' (it goes to 'a' first).

Now let's find all unique valid substrings in `"zab"`:

1. Single characters: `"z"`, `"a"`, `"b"` (3 substrings)
2. Length 2: `"za"`, `"ab"` (2 substrings)
3. Length 3: `"zab"` (1 substring)

Total: 6 unique valid substrings.

Notice something important: For each position in `s`, if it continues a consecutive sequence, it adds new valid substrings ending at that position. For example:

- At position 0 (`"z"`): adds 1 substring (`"z"`)
- At position 1 (`"a"`): continues from 'z', so adds 2 substrings (`"a"`, `"za"`)
- At position 2 (`"b"`): continues from 'a', so adds 3 substrings (`"b"`, `"ab"`, `"zab"`)

But wait—we need to be careful about duplicates! If we had `s = "zaza"`, the sequence would break at the second 'z', and we'd need to handle that.

## Brute Force Approach

A naive approach would be:

1. Generate all possible substrings of `s` (O(n²) substrings)
2. For each substring, check if it's valid (all characters are consecutive in wraparound sense)
3. Use a set to track unique valid substrings

<div class="code-group">

```python
# Time: O(n³) | Space: O(n²)
def brute_force(s):
    unique_substrings = set()
    n = len(s)

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            substr = s[i:j+1]

            # Check if substring is valid
            valid = True
            for k in range(1, len(substr)):
                # Check if characters are consecutive in wraparound sense
                curr = ord(substr[k])
                prev = ord(substr[k-1])
                if not (curr - prev == 1 or (prev == ord('z') and curr == ord('a'))):
                    valid = False
                    break

            if valid:
                unique_substrings.add(substr)

    return len(unique_substrings)
```

```javascript
// Time: O(n³) | Space: O(n²)
function bruteForce(s) {
  const uniqueSubstrings = new Set();
  const n = s.length;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const substr = s.substring(i, j + 1);

      // Check if substring is valid
      let valid = true;
      for (let k = 1; k < substr.length; k++) {
        // Check if characters are consecutive in wraparound sense
        const curr = substr.charCodeAt(k);
        const prev = substr.charCodeAt(k - 1);
        if (!(curr - prev === 1 || (prev === 122 && curr === 97))) {
          valid = false;
          break;
        }
      }

      if (valid) {
        uniqueSubstrings.add(substr);
      }
    }
  }

  return uniqueSubstrings.size;
}
```

```java
// Time: O(n³) | Space: O(n²)
public int bruteForce(String s) {
    Set<String> uniqueSubstrings = new HashSet<>();
    int n = s.length();

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            String substr = s.substring(i, j + 1);

            // Check if substring is valid
            boolean valid = true;
            for (int k = 1; k < substr.length(); k++) {
                // Check if characters are consecutive in wraparound sense
                char curr = substr.charAt(k);
                char prev = substr.charAt(k - 1);
                if (!(curr - prev == 1 || (prev == 'z' && curr == 'a'))) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                uniqueSubstrings.add(substr);
            }
        }
    }

    return uniqueSubstrings.size();
}
```

</div>

**Why this fails:** With O(n³) time complexity, this solution times out for larger inputs (n up to 10⁵ in LeetCode constraints). We need to find a way to count without explicitly generating all substrings.

## Optimized Approach

The key insight is that valid substrings must be **contiguous sequences** in the wraparound string. This means:

1. For each character position in `s`, we can track the **length of the current consecutive sequence** ending at that position.
2. The number of **new unique valid substrings ending at position i** equals the length of the current consecutive sequence.
3. However, we must track the **maximum sequence length ending with each character** because longer sequences include all shorter ones.

Let's walk through the reasoning:

**Step 1: Understanding the substring relationship**
If we have a valid sequence of length `k` ending at position `i`, then all substrings ending at `i` with lengths 1 through `k` are valid. For example, with sequence `"zab"` (length 3), we get: `"b"`, `"ab"`, `"zab"`.

**Step 2: Avoiding duplicates**
If we later encounter another sequence ending with 'b', we only want to count the **longest** sequence ending with 'b', because it includes all shorter sequences ending with 'b'. For example, if we have `"ab"` and later `"zab"`, we only count `"zab"` (which includes `"ab"` and `"b"`).

**Step 3: The algorithm**

1. Initialize an array `max_len[26]` to track the longest valid sequence ending with each letter.
2. Iterate through `s`, tracking the current consecutive sequence length.
3. For each character, update its max length if the current sequence is longer.
4. Sum all values in `max_len` for the final answer.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - only 26 letters to track
def findSubstringInWraproundString(s: str) -> int:
    # Edge case: empty string
    if not s:
        return 0

    # Track the maximum length of valid substring ending with each letter
    max_len = [0] * 26

    # Current length of consecutive sequence
    current_len = 0

    for i in range(len(s)):
        # Check if current character continues the consecutive sequence
        if i > 0 and (
            # Normal consecutive: 'a' -> 'b', 'b' -> 'c', etc.
            (ord(s[i]) - ord(s[i-1]) == 1) or
            # Wraparound case: 'z' -> 'a'
            (s[i-1] == 'z' and s[i] == 'a')
        ):
            # Continue the sequence
            current_len += 1
        else:
            # Start a new sequence
            current_len = 1

        # Convert character to index (0-25)
        char_index = ord(s[i]) - ord('a')

        # Update max length for this character
        # We take max because longer sequences include all shorter ones
        max_len[char_index] = max(max_len[char_index], current_len)

    # Sum all max lengths to get total unique substrings
    return sum(max_len)
```

```javascript
// Time: O(n) | Space: O(1) - only 26 letters to track
function findSubstringInWraproundString(s) {
  // Edge case: empty string
  if (!s) return 0;

  // Track the maximum length of valid substring ending with each letter
  const maxLen = new Array(26).fill(0);

  // Current length of consecutive sequence
  let currentLen = 0;

  for (let i = 0; i < s.length; i++) {
    // Check if current character continues the consecutive sequence
    if (
      i > 0 &&
      // Normal consecutive: 'a' -> 'b', 'b' -> 'c', etc.
      (s.charCodeAt(i) - s.charCodeAt(i - 1) === 1 ||
        // Wraparound case: 'z' -> 'a'
        (s[i - 1] === "z" && s[i] === "a"))
    ) {
      // Continue the sequence
      currentLen++;
    } else {
      // Start a new sequence
      currentLen = 1;
    }

    // Convert character to index (0-25)
    const charIndex = s.charCodeAt(i) - 97;

    // Update max length for this character
    // We take max because longer sequences include all shorter ones
    maxLen[charIndex] = Math.max(maxLen[charIndex], currentLen);
  }

  // Sum all max lengths to get total unique substrings
  return maxLen.reduce((sum, val) => sum + val, 0);
}
```

```java
// Time: O(n) | Space: O(1) - only 26 letters to track
public int findSubstringInWraproundString(String s) {
    // Edge case: empty string
    if (s == null || s.length() == 0) return 0;

    // Track the maximum length of valid substring ending with each letter
    int[] maxLen = new int[26];

    // Current length of consecutive sequence
    int currentLen = 0;

    for (int i = 0; i < s.length(); i++) {
        // Check if current character continues the consecutive sequence
        if (i > 0 && (
            // Normal consecutive: 'a' -> 'b', 'b' -> 'c', etc.
            (s.charAt(i) - s.charAt(i - 1) == 1) ||
            // Wraparound case: 'z' -> 'a'
            (s.charAt(i - 1) == 'z' && s.charAt(i) == 'a')
        )) {
            // Continue the sequence
            currentLen++;
        } else {
            // Start a new sequence
            currentLen = 1;
        }

        // Convert character to index (0-25)
        int charIndex = s.charAt(i) - 'a';

        // Update max length for this character
        // We take max because longer sequences include all shorter ones
        maxLen[charIndex] = Math.max(maxLen[charIndex], currentLen);
    }

    // Sum all max lengths to get total unique substrings
    int total = 0;
    for (int len : maxLen) {
        total += len;
    }
    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string `s` of length `n`
- Each iteration does constant work: checking consecutive condition, updating array
- The final sum over 26 elements is also constant time

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers regardless of input size
- A few integer variables for tracking current length
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the wraparound case ('z' → 'a')**: Many candidates only check `ord(s[i]) - ord(s[i-1]) == 1` and miss that 'z' followed by 'a' is also valid. Always test with strings containing 'z'.

2. **Not tracking maximum per character**: If you simply sum `current_len` at each step, you'll overcount. For example, with `s = "abab"`, the sequence breaks at the second 'a', but you might incorrectly count substrings that span across the break.

3. **Off-by-one in sequence length**: When starting a new sequence, it should be length 1 (the character itself), not 0. When continuing, you add 1 to the previous length, not set it to 2.

4. **Using a set to track substrings**: This leads to O(n²) space and O(n³) time. The optimization comes from realizing you only need to track the longest sequence ending with each character.

## When You'll See This Pattern

This problem uses **dynamic programming with state compression**—a common pattern where you track the best result ending at each position, but compress it to per-character tracking.

Related problems:

1. **Longest Increasing Subsequence (LeetCode 300)**: Similar idea of tracking sequences, though with different comparison logic.
2. **Arithmetic Slices (LeetCode 413)**: Counting contiguous arithmetic sequences, similar to counting valid substrings here.
3. **Number of Matching Subsequences (LeetCode 792)**: Also involves tracking characters and sequences efficiently.

## Key Takeaways

1. **When counting substrings with a property, think about what ends at each position**: Instead of generating all substrings, track what valid substrings **end** at each position and how they relate to previous positions.

2. **Longer sequences include shorter ones**: If you have a valid sequence of length `k` ending at position `i`, all suffixes of that sequence are also valid. This lets you track only the maximum length.

3. **Compress state when possible**: Instead of tracking sequences for every position, we only need to track per character because sequences with the same ending character overlap.

[Practice this problem on CodeJeet](/problem/unique-substrings-in-wraparound-string)
