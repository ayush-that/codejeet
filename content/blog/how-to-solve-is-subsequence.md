---
title: "How to Solve Is Subsequence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Is Subsequence. Easy difficulty, 48.9% acceptance rate. Topics: Two Pointers, String, Dynamic Programming."
date: "2026-04-29"
category: "dsa-patterns"
tags: ["is-subsequence", "two-pointers", "string", "dynamic-programming", "easy"]
---

# How to Solve Is Subsequence

The problem asks whether one string `s` is a subsequence of another string `t`. A subsequence means all characters of `s` appear in `t` in the same order, though not necessarily consecutively. What makes this problem interesting is its deceptive simplicity—while the optimal solution is straightforward, it teaches fundamental techniques that scale to much harder problems like matching multiple subsequences efficiently.

## Visual Walkthrough

Let's trace through an example: `s = "abc"`, `t = "ahbgdc"`.

We need to check if all characters of `s` appear in `t` in order:

1. Start with first character of `s` ('a') and first character of `t` ('a')
   - 'a' matches 'a' → move to next character in both strings
2. Now `s` pointer is at 'b', `t` pointer is at 'h'
   - 'b' ≠ 'h' → move only `t` pointer to next character ('b')
3. Now `s` pointer at 'b', `t` pointer at 'b'
   - 'b' matches 'b' → move both pointers
4. Now `s` pointer at 'c', `t` pointer at 'g'
   - 'c' ≠ 'g' → move only `t` pointer to 'd'
5. 'c' ≠ 'd' → move `t` pointer to 'c'
6. 'c' matches 'c' → move both pointers
7. `s` pointer has reached end → all characters found in order → return `true`

The key insight: we only advance the `s` pointer when we find a match, but we always advance the `t` pointer each step.

## Brute Force Approach

A naive approach might try to generate all subsequences of `t` and check if `s` is among them. However, a string of length `n` has 2ⁿ possible subsequences (each character can be either included or excluded), making this approach exponential time O(2ⁿ), which is completely impractical for any reasonable input size.

Another brute force idea: for each character in `s`, search through `t` from the last found position. This is actually the same as our optimal approach but implemented less efficiently with repeated searching instead of a single pass.

## Optimal Solution

The optimal solution uses two pointers: one for `s` and one for `t`. We iterate through `t`, and whenever we find a character matching the current character in `s`, we advance the `s` pointer. If we reach the end of `s`, we've found all characters in order.

<div class="code-group">

```python
# Time: O(n) where n is length of t | Space: O(1)
def isSubsequence(s: str, t: str) -> bool:
    # Edge case: empty string is always a subsequence
    if not s:
        return True

    # Initialize pointers for s and t
    s_ptr, t_ptr = 0, 0

    # Iterate through t until we either find all characters of s
    # or reach the end of t
    while s_ptr < len(s) and t_ptr < len(t):
        # If current characters match, move s pointer forward
        if s[s_ptr] == t[t_ptr]:
            s_ptr += 1
        # Always move t pointer forward
        t_ptr += 1

    # If we've matched all characters in s, s_ptr will equal len(s)
    return s_ptr == len(s)
```

```javascript
// Time: O(n) where n is length of t | Space: O(1)
function isSubsequence(s, t) {
  // Edge case: empty string is always a subsequence
  if (s.length === 0) {
    return true;
  }

  // Initialize pointers for s and t
  let sPtr = 0,
    tPtr = 0;

  // Iterate through t until we either find all characters of s
  // or reach the end of t
  while (sPtr < s.length && tPtr < t.length) {
    // If current characters match, move s pointer forward
    if (s[sPtr] === t[tPtr]) {
      sPtr++;
    }
    // Always move t pointer forward
    tPtr++;
  }

  // If we've matched all characters in s, sPtr will equal s.length
  return sPtr === s.length;
}
```

```java
// Time: O(n) where n is length of t | Space: O(1)
public boolean isSubsequence(String s, String t) {
    // Edge case: empty string is always a subsequence
    if (s.isEmpty()) {
        return true;
    }

    // Initialize pointers for s and t
    int sPtr = 0, tPtr = 0;

    // Iterate through t until we either find all characters of s
    // or reach the end of t
    while (sPtr < s.length() && tPtr < t.length()) {
        // If current characters match, move s pointer forward
        if (s.charAt(sPtr) == t.charAt(tPtr)) {
            sPtr++;
        }
        // Always move t pointer forward
        tPtr++;
    }

    // If we've matched all characters in s, sPtr will equal s.length()
    return sPtr == s.length();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of `t`. In the worst case, we iterate through every character of `t` exactly once. The length of `s` doesn't affect the asymptotic complexity since we stop early if we find all characters of `s`.

**Space Complexity:** O(1). We only use a constant amount of extra space for the two pointers, regardless of input size.

## Common Mistakes

1. **Forgetting the empty string edge case:** An empty string is always a subsequence of any string (including another empty string). Candidates who don't handle this explicitly might write code that returns `false` for `s = ""`.

2. **Incorrect pointer movement:** Some candidates try to move both pointers when characters don't match, or forget to always move the `t` pointer. Remember: we only move the `s` pointer on a match, but we always move the `t` pointer.

3. **Off-by-one errors in loop conditions:** Using `<=` instead of `<` when comparing pointers to string lengths can cause index out of bounds errors. Remember that string indices go from 0 to length-1.

4. **Overcomplicating with extra data structures:** Some candidates try to use hash maps or arrays to track character positions, which adds unnecessary space complexity without improving time complexity.

## When You'll See This Pattern

The two-pointer technique for subsequence checking appears in several related problems:

1. **Number of Matching Subsequences (LeetCode 792):** Instead of checking one subsequence, you need to check multiple `s` strings against the same `t`. The optimal solution extends the two-pointer approach by preprocessing `t` to quickly find next occurrences of each character.

2. **Shortest Way to Form String (LeetCode 1055):** Here you need to find how many times you must traverse `t` to form `s` as a subsequence. It's essentially repeated applications of the isSubsequence check.

3. **Append Characters to String to Make Subsequence (LeetCode 2486):** This asks how many characters need to be appended to `t` to make `s` a subsequence. You solve it by finding how much of `s` is already a subsequence of `t`.

## Key Takeaways

- **Two-pointer technique:** When checking order-preserving relationships between two sequences, two pointers (one for each sequence) is often the optimal approach.
- **Greedy matching works:** For subsequence problems, always match the earliest possible occurrence in `t` for each character in `s`. There's never a benefit to skipping an available match.
- **Stop early optimization:** Once you've matched all characters of `s`, you can return immediately without checking the rest of `t`.

Related problems: [Number of Matching Subsequences](/problem/number-of-matching-subsequences), [Shortest Way to Form String](/problem/shortest-way-to-form-string), [Append Characters to String to Make Subsequence](/problem/append-characters-to-string-to-make-subsequence)
