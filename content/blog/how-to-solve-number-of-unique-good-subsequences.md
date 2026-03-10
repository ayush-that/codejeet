---
title: "How to Solve Number of Unique Good Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Unique Good Subsequences. Hard difficulty, 52.6% acceptance rate. Topics: String, Dynamic Programming."
date: "2030-01-25"
category: "dsa-patterns"
tags: ["number-of-unique-good-subsequences", "string", "dynamic-programming", "hard"]
---

# How to Solve Number of Unique Good Subsequences

This problem asks us to count the number of unique subsequences in a binary string that are "good" — meaning they're non-empty, have no leading zeros (except for the single character "0" itself). What makes this tricky is that we need to count **unique** subsequences, not all possible subsequences, while also enforcing the "good" constraint. The combination of uniqueness and the leading-zero rule creates a challenging dynamic programming problem.

## Visual Walkthrough

Let's trace through `binary = "101"` step by step to build intuition. We'll build subsequences as we process each character:

**Processing first character '1':**

- We can take it or skip it
- Good subsequences so far: `"1"`

**Processing second character '0':**

- We can append '0' to existing subsequences or skip it
- Appending to `"1"` gives `"10"`
- Also, `"0"` itself is allowed (special case for single zero)
- Good subsequences so far: `"1"`, `"10"`, `"0"`

**Processing third character '1':**

- Append '1' to all existing subsequences:
  - `"1"` + `"1"` = `"11"`
  - `"10"` + `"1"` = `"101"`
  - `"0"` + `"1"` = `"01"` ← NOT good (leading zero)
- Also add `"1"` itself (but we already have it)
- Good subsequences so far: `"1"`, `"10"`, `"0"`, `"11"`, `"101"`

Total: 5 unique good subsequences.

The challenge is doing this efficiently without storing all subsequences explicitly.

## Brute Force Approach

A naive approach would be to generate all possible subsequences (2^n possibilities), filter out duplicates using a set, then filter for "good" subsequences. Here's what that might look like:

<div class="code-group">

```python
def numUniqueGoodSubsequences_brute(binary: str) -> int:
    n = len(binary)
    result = set()

    # Generate all subsequences using bitmask
    for mask in range(1, 1 << n):  # Start from 1 to exclude empty subsequence
        subsequence = []
        for i in range(n):
            if mask & (1 << i):
                subsequence.append(binary[i])

        # Check if good subsequence
        seq_str = ''.join(subsequence)
        if seq_str[0] != '0' or seq_str == "0":
            result.add(seq_str)

    return len(result)
```

```javascript
function numUniqueGoodSubsequencesBrute(binary) {
  const n = binary.length;
  const result = new Set();

  // Generate all subsequences using bitmask
  for (let mask = 1; mask < 1 << n; mask++) {
    let subsequence = "";
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subsequence += binary[i];
      }
    }

    // Check if good subsequence
    if (subsequence[0] !== "0" || subsequence === "0") {
      result.add(subsequence);
    }
  }

  return result.size;
}
```

```java
public int numUniqueGoodSubsequencesBrute(String binary) {
    int n = binary.length();
    Set<String> result = new HashSet<>();

    // Generate all subsequences using bitmask
    for (int mask = 1; mask < (1 << n); mask++) {
        StringBuilder subsequence = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                subsequence.append(binary.charAt(i));
            }
        }

        // Check if good subsequence
        String seq = subsequence.toString();
        if (seq.charAt(0) != '0' || seq.equals("0")) {
            result.add(seq);
        }
    }

    return result.size();
}
```

</div>

**Why this fails:** This approach has exponential time complexity O(2^n × n) and exponential space complexity O(2^n) for storing all subsequences. For a string of length 1000, we'd need to process 2^1000 possibilities — completely infeasible.

## Optimized Approach

The key insight is that we can use dynamic programming to count subsequences without generating them explicitly. We need to track:

1. **How many subsequences end with '0'**
2. **How many subsequences end with '1'**
3. **Whether we've seen a '0' at all** (to handle the special case of "0")

Here's the reasoning:

- When we process a new character, we can either:
  - Append it to all existing subsequences that end with the same or different character
  - Start a new subsequence with just this character
- But we must avoid counting duplicates! If we've seen the same character before, subsequences ending with that character from earlier positions might create duplicates.

The trick: For each character '0' or '1', we only need to remember the **total number of unique subsequences ending with that character so far**. When we see a new character:

- To get new subsequences ending with this character, we can append it to ALL existing subsequences (regardless of what they end with)
- But we must subtract the count from the last time we saw this same character to avoid duplicates

Why does subtracting work? Because if we append character `c` to subsequences, and we've seen `c` before at position `i`, then any subsequence we create now by appending to subsequences that existed before position `i` would create duplicates with what we already counted when we processed `c` at position `i`.

## Optimal Solution

We maintain:

- `end0`: count of unique good subsequences ending with '0'
- `end1`: count of unique good subsequences ending with '1'
- `has0`: whether we've seen a '0' (to handle the "0" case)

As we process each character:

- If it's '1': new subsequences ending with '1' = (end0 + end1 + 1) - previous_end1
- If it's '0': new subsequences ending with '0' = (end0 + end1) - previous_end0
- Update `has0` if we see '0'

The final answer is: end0 + end1 + (has0 ? 1 : 0)

<div class="code-group">

```python
def numUniqueGoodSubsequences(binary: str) -> int:
    """
    Count unique good subsequences in a binary string.
    A good subsequence is non-empty and has no leading zeros (except "0" itself).

    Time: O(n) where n is length of binary string
    Space: O(1) using only constant extra space
    """
    MOD = 10**9 + 7
    end0 = 0  # count of subsequences ending with '0'
    end1 = 0  # count of subsequences ending with '1'
    has0 = 0  # whether we've seen a '0' in the string

    for ch in binary:
        if ch == '1':
            # For '1': we can append to all existing subsequences + start new with '1'
            # Subtract previous end1 to avoid duplicates from earlier '1's
            new_end1 = (end0 + end1 + 1) % MOD
            end1 = new_end1
        else:  # ch == '0'
            # For '0': we can append to all existing subsequences
            # Cannot start new with '0' (except the special "0" case handled separately)
            # Subtract previous end0 to avoid duplicates from earlier '0's
            new_end0 = (end0 + end1) % MOD
            end0 = new_end0
            has0 = 1  # Mark that we've seen at least one '0'

    # Total = subsequences ending with '0' + ending with '1' + (special "0" if exists)
    return (end0 + end1 + has0) % MOD
```

```javascript
/**
 * Count unique good subsequences in a binary string.
 * A good subsequence is non-empty and has no leading zeros (except "0" itself).
 *
 * Time: O(n) where n is length of binary string
 * Space: O(1) using only constant extra space
 */
function numUniqueGoodSubsequences(binary) {
  const MOD = 1_000_000_007;
  let end0 = 0; // count of subsequences ending with '0'
  let end1 = 0; // count of subsequences ending with '1'
  let has0 = 0; // whether we've seen a '0' in the string

  for (let i = 0; i < binary.length; i++) {
    const ch = binary[i];

    if (ch === "1") {
      // For '1': append to all existing subsequences + start new with '1'
      // Subtract previous end1 to avoid duplicates from earlier '1's
      const newEnd1 = (end0 + end1 + 1) % MOD;
      end1 = newEnd1;
    } else {
      // ch === '0'
      // For '0': append to all existing subsequences
      // Cannot start new with '0' (except the special "0" case)
      // Subtract previous end0 to avoid duplicates from earlier '0's
      const newEnd0 = (end0 + end1) % MOD;
      end0 = newEnd0;
      has0 = 1; // Mark that we've seen at least one '0'
    }
  }

  // Total = subsequences ending with '0' + ending with '1' + (special "0" if exists)
  return (end0 + end1 + has0) % MOD;
}
```

```java
/**
 * Count unique good subsequences in a binary string.
 * A good subsequence is non-empty and has no leading zeros (except "0" itself).
 *
 * Time: O(n) where n is length of binary string
 * Space: O(1) using only constant extra space
 */
public int numUniqueGoodSubsequences(String binary) {
    final int MOD = 1_000_000_007;
    long end0 = 0;  // count of subsequences ending with '0'
    long end1 = 0;  // count of subsequences ending with '1'
    int has0 = 0;   // whether we've seen a '0' in the string

    for (int i = 0; i < binary.length(); i++) {
        char ch = binary.charAt(i);

        if (ch == '1') {
            // For '1': append to all existing subsequences + start new with '1'
            // Subtract previous end1 to avoid duplicates from earlier '1's
            long newEnd1 = (end0 + end1 + 1) % MOD;
            end1 = newEnd1;
        } else {  // ch == '0'
            // For '0': append to all existing subsequences
            // Cannot start new with '0' (except the special "0" case)
            // Subtract previous end0 to avoid duplicates from earlier '0's
            long newEnd0 = (end0 + end1) % MOD;
            end0 = newEnd0;
            has0 = 1;  // Mark that we've seen at least one '0'
        }
    }

    // Total = subsequences ending with '0' + ending with '1' + (special "0" if exists)
    return (int)((end0 + end1 + has0) % MOD);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each character in the string exactly once
- For each character, we perform a constant number of arithmetic operations

**Space Complexity:** O(1)

- We only use a fixed number of variables (end0, end1, has0, MOD)
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting the special case for "0"**: The problem states that "0" alone is a good subsequence, but any other subsequence starting with '0' is not. Candidates often miss adding `has0` to the final result or incorrectly include subsequences starting with '0'.

2. **Not handling modulo correctly**: Since the result can be large (up to 2^n), we need to use modulo 10^9+7. Candidates sometimes apply modulo only at the end, which can cause integer overflow during intermediate calculations.

3. **Double-counting subsequences**: When appending a character to existing subsequences, if we've seen the same character before, we might create duplicates. The subtraction of previous counts (end0 or end1) is crucial to avoid this.

4. **Incorrect initialization**: Starting with end0 = 0 and end1 = 0 is correct because we haven't seen any characters yet. Some candidates incorrectly initialize these to 1, thinking they represent the empty subsequence.

## When You'll See This Pattern

This problem uses a **dynamic programming with state compression** pattern that appears in several subsequence counting problems:

1. **Distinct Subsequences II** (LeetCode 940): Very similar pattern of counting unique subsequences by tracking ends with each character and subtracting previous counts to avoid duplicates.

2. **Count Different Palindromic Subsequences** (LeetCode 730): Uses similar DP with character-based states to count unique palindromic subsequences.

3. **Number of Unique Substrings in a String**: While not exactly the same, the technique of avoiding duplicates by considering last occurrence of characters appears in suffix array/automaton solutions.

The core idea is: when counting sequences where order matters (like subsequences), track counts by what character they end with, and use the last occurrence of each character to avoid duplicates.

## Key Takeaways

1. **For unique subsequence counting problems**, think in terms of what subsequences end with each possible character. This lets you avoid storing all subsequences explicitly.

2. **The "last occurrence" trick** is powerful: when appending character `c` to existing subsequences, subtract the count from the last time you processed `c` to avoid creating duplicates.

3. **Pay attention to special cases** in problem definitions. Here, the exception for "0" required separate tracking with the `has0` flag.

4. **State compression** is often possible in DP problems — we only need the current state, not all previous states.

Related problems: [Distinct Subsequences](/problem/distinct-subsequences), [Distinct Subsequences II](/problem/distinct-subsequences-ii)
