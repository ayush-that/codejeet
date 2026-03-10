---
title: "How to Solve Repeated String Match — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Repeated String Match. Medium difficulty, 38.4% acceptance rate. Topics: String, String Matching."
date: "2028-05-07"
category: "dsa-patterns"
tags: ["repeated-string-match", "string", "string-matching", "medium"]
---

# How to Solve Repeated String Match

This problem asks us to find the minimum number of times we need to repeat string `a` so that string `b` becomes a substring of the repeated string. If it's impossible, we return `-1`. What makes this problem interesting is that we can't just keep repeating `a` indefinitely — we need to find the minimum number of repetitions where `b` fits, and we need to recognize when it's impossible. The tricky part is determining when to stop trying and return `-1`.

## Visual Walkthrough

Let's trace through an example: `a = "abcd"`, `b = "cdabcdab"`

We need to find the smallest `k` such that `b` is a substring of `a` repeated `k` times.

1. **k = 1**: `"abcd"` doesn't contain `"cdabcdab"`
2. **k = 2**: `"abcdabcd"` doesn't contain `"cdabcdab"` (we need `"cd"` at the beginning)
3. **k = 3**: `"abcdabcdabcd"` contains `"cdabcdab"` starting at index 2

So the answer is 3. But how do we know when to stop trying? Let's consider another example: `a = "abc"`, `b = "cabcabca"`

1. **k = 1**: `"abc"` doesn't contain `"cabcabca"`
2. **k = 2**: `"abcabc"` doesn't contain `"cabcabca"`
3. **k = 3**: `"abcabcabc"` contains `"cabcabca"` starting at index 1

The key insight: if `b` can be a substring of repeated `a`, then the repeated string only needs to be long enough to cover all possible starting positions in `a`. In the worst case, `b` might start at the end of one copy of `a` and end at the beginning of another copy.

## Brute Force Approach

A naive approach would be to keep repeating `a` until our repeated string is at least as long as `b`, then check if `b` is a substring. If not, we add another copy of `a` and check again. But when do we stop?

The brute force approach might try to repeat `a` until the repeated string is much longer than `b`, but this could be inefficient. A candidate might think: "Let's just repeat `a` until it's `len(b) * 2` long, then check." But this isn't guaranteed to work for all cases.

The real issue with brute force is knowing when to stop. If we don't have a clear stopping condition, we might loop forever or miss the correct answer.

## Optimized Approach

The key insight comes from understanding the worst-case alignment of `b` within repeated `a`:

1. **When is it impossible?** If `b` contains characters not in `a`, it's immediately impossible. We can check this quickly.
2. **How many repetitions do we need at most?** Consider the worst case: `b` starts at the last character of one copy of `a` and ends at the first character of another copy. This means we might need enough repetitions to cover `len(b)/len(a) + 2` copies of `a`.

   More precisely: if `b` can be a substring, it must fit within `ceil(len(b)/len(a)) + 1` repetitions. We add 1 because `b` might start in the middle of one copy and end in the middle of another.

3. **Why not more?** If we repeat `a` `ceil(len(b)/len(a)) + 1` times and still don't find `b`, then adding more copies won't help. Any further repetitions would just create patterns we've already seen.

The algorithm:

1. Check if all characters in `b` exist in `a` (quick impossibility check)
2. Calculate the minimum number of repetitions needed: `ceil(len(b)/len(a))`
3. Build strings with `min_reps`, `min_reps + 1`, and `min_reps + 2` repetitions
4. Check if `b` is a substring of any of these
5. Return the smallest `k` that works, or `-1` if none work

Actually, we only need to check up to `min_reps + 1` repetitions. Let me explain why with an example: if `a = "abc"` (length 3) and `b = "cabcabca"` (length 8), `min_reps = ceil(8/3) = 3`. We need to check 3 and 4 repetitions. If `b` starts at the last character of the first copy, it could span 3 full copies. If it starts earlier or later, it might need 4 copies.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = len(a), m = len(b) | Space: O(n + m)
def repeatedStringMatch(a: str, b: str) -> int:
    """
    Returns the minimum number of times to repeat string 'a'
    so that string 'b' is a substring of the repeated string.
    Returns -1 if impossible.
    """

    # Quick check: if b contains characters not in a, it's impossible
    # This is an optimization that catches obvious failures early
    if set(b) - set(a):
        return -1

    # Calculate the minimum number of repetitions needed
    # We need at least ceil(len(b)/len(a)) copies to have enough length
    min_reps = (len(b) + len(a) - 1) // len(a)  # Ceiling division

    # Build candidate strings with min_reps and min_reps+1 repetitions
    # We check min_reps+1 because b might start in the middle of a copy
    for reps in [min_reps, min_reps + 1]:
        repeated = a * reps
        if b in repeated:
            return reps

    # If b is not found in either candidate, it's impossible
    return -1
```

```javascript
// Time: O(n + m) where n = a.length, m = b.length | Space: O(n + m)
/**
 * Returns the minimum number of times to repeat string 'a'
 * so that string 'b' is a substring of the repeated string.
 * Returns -1 if impossible.
 */
function repeatedStringMatch(a, b) {
  // Quick check: if b contains characters not in a, it's impossible
  // Create sets to check for characters in b that aren't in a
  const setA = new Set(a);
  for (const char of b) {
    if (!setA.has(char)) {
      return -1;
    }
  }

  // Calculate the minimum number of repetitions needed
  // Ceiling division: Math.ceil(b.length / a.length)
  const minReps = Math.ceil(b.length / a.length);

  // Check both min_reps and min_reps + 1 repetitions
  // We need to check +1 because b might start in the middle of a copy
  for (let reps = minReps; reps <= minReps + 1; reps++) {
    const repeated = a.repeat(reps);
    if (repeated.includes(b)) {
      return reps;
    }
  }

  // If b is not found in either candidate, it's impossible
  return -1;
}
```

```java
// Time: O(n + m) where n = a.length(), m = b.length() | Space: O(n + m)
class Solution {
    /**
     * Returns the minimum number of times to repeat string 'a'
     * so that string 'b' is a substring of the repeated string.
     * Returns -1 if impossible.
     */
    public int repeatedStringMatch(String a, String b) {
        // Quick check: if b contains characters not in a, it's impossible
        // We use a boolean array to track which characters appear in a
        boolean[] charsInA = new boolean[26];
        for (char c : a.toCharArray()) {
            charsInA[c - 'a'] = true;
        }
        for (char c : b.toCharArray()) {
            if (!charsInA[c - 'a']) {
                return -1;
            }
        }

        // Calculate the minimum number of repetitions needed
        // Ceiling division: (b.length() + a.length() - 1) / a.length()
        int minReps = (b.length() + a.length() - 1) / a.length();

        // Build candidate strings with min_reps and min_reps+1 repetitions
        // We check +1 because b might start in the middle of a copy
        StringBuilder repeated = new StringBuilder();
        for (int i = 0; i < minReps; i++) {
            repeated.append(a);
        }

        // Check min_reps repetitions
        if (repeated.toString().contains(b)) {
            return minReps;
        }

        // Check min_reps + 1 repetitions
        repeated.append(a);
        if (repeated.toString().contains(b)) {
            return minReps + 1;
        }

        // If b is not found in either candidate, it's impossible
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- The character check takes O(n + m) time to scan both strings
- Building the repeated string takes O(k \* n) time where k is at most `ceil(m/n) + 1`
- The substring search (using built-in `in` operator in Python, `includes()` in JS, `contains()` in Java) typically uses an efficient algorithm like KMP or Boyer-Moore with O(n + m) complexity
- Overall, we have O(n + m) for the character check plus O(n + m) for the substring search

**Space Complexity: O(n + m)**

- We store the repeated string which can be up to O(n + m) in size
- The character check uses additional space: O(1) for the set/array (fixed 26 for lowercase letters), but O(n + m) if we consider general Unicode

## Common Mistakes

1. **Not checking for impossible cases early**: Some candidates forget to check if `b` contains characters not in `a`. This can lead to infinite loops or unnecessary computations.

2. **Incorrect stopping condition**: A common mistake is to keep repeating `a` until the repeated string is much longer than `b` without a clear limit. The correct approach is to stop after `ceil(len(b)/len(a)) + 1` repetitions.

3. **Off-by-one errors in repetition count**: When calculating the ceiling division, some candidates use `len(b) // len(a)` instead of `(len(b) + len(a) - 1) // len(a)` or `Math.ceil(len(b)/len(a))`. This misses cases where `b` is exactly a multiple of `a` in length.

4. **Forgetting to check both `min_reps` and `min_reps + 1`**: Some candidates only check `min_reps` repetitions. Consider `a = "abc"`, `b = "cabcabca"`. With `min_reps = 3`, `"abcabcabc"` doesn't contain `b`, but `"abcabcabcabc"` (4 reps) does.

## When You'll See This Pattern

This problem teaches the **repeated pattern matching** pattern, which appears in various string problems:

1. **Repeated Substring Pattern (LeetCode 459)**: This is the inverse problem — checking if a string can be formed by repeating a substring multiple times. The core technique of understanding how patterns repeat is similar.

2. **Implement strStr() (LeetCode 28)**: Both problems involve substring search, but this one adds the complexity of repeating the source string.

3. **Rabin-Karp Algorithm problems**: The idea of checking a sliding window against a pattern appears in many string matching algorithms. While we use built-in substring search here, understanding how it works helps with more complex pattern matching.

The key insight across these problems is understanding how patterns align and when additional repetitions don't provide new alignment possibilities.

## Key Takeaways

1. **Understand alignment boundaries**: When checking if `b` is a substring of repeated `a`, the worst-case alignment occurs when `b` starts at the end of one copy and ends at the beginning of another. This gives us the upper bound of `ceil(len(b)/len(a)) + 1` repetitions.

2. **Early impossibility checks save time**: Checking if all characters in `b` exist in `a` is a quick way to eliminate impossible cases without building long repeated strings.

3. **Built-in string operations are optimized**: While you could implement KMP or another substring algorithm, in interviews it's usually acceptable to use built-in substring search functions, which are typically well-optimized.

Related problems: [Repeated Substring Pattern](/problem/repeated-substring-pattern)
