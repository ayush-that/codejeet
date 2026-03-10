---
title: "How to Solve Minimum Additions to Make Valid String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Additions to Make Valid String. Medium difficulty, 51.0% acceptance rate. Topics: String, Dynamic Programming, Stack, Greedy."
date: "2028-12-23"
category: "dsa-patterns"
tags: ["minimum-additions-to-make-valid-string", "string", "dynamic-programming", "stack", "medium"]
---

# How to Solve Minimum Additions to Make Valid String

We need to transform any string into a valid string by inserting the minimum number of characters 'a', 'b', or 'c'. A valid string is one that can be formed by concatenating "abc" multiple times (like "abc", "abcabc", etc.). The challenge is figuring out where characters are missing and counting only the _minimum_ insertions needed, not just checking if the string is valid.

## Visual Walkthrough

Let's trace through `word = "aabcb"`:

We want the final string to be a sequence of "abc" patterns. Let's process character by character:

1. **Start**: We expect 'a' first. We see 'a' → good, move to expect 'b'
2. **Next**: Expect 'b', see 'a' → mismatch! We need to insert 'b' and 'c' to complete current "abc", then start new "abc" with this 'a'. That's 2 insertions. Now we're at 'a' with expectation 'b'
3. **Next**: Expect 'b', see 'b' → good, move to expect 'c'
4. **Next**: Expect 'c', see 'c' → good, move to expect 'a' (next "abc")
5. **Next**: Expect 'a', see 'b' → mismatch! Need to insert 'a' before 'b' (1 insertion). Now at 'b' with expectation 'c'
6. **End**: We're expecting 'c' but string ends. Need to insert 'c' (1 insertion)

Total: 2 + 1 + 1 = 4 insertions. Let's verify: Starting with "aabcb", we can insert to get "abcabcabc":

- Insert 'b','c' after first 'a': "a" + "bc" + "abcb" = "abcabcb"
- Insert 'a' before last 'b': "abcabc" + "a" + "b" = "abcabcab"
- Insert 'c' at end: "abcabcabc"

The key insight: We can track what character we _expect_ next as we scan the string. When we see an unexpected character, we insert what's missing to complete the current "abc" pattern.

## Brute Force Approach

A brute force approach would try all possible insertion points and combinations, which is exponential. More realistically, a naive candidate might:

1. Check if the string is already valid by verifying it's exactly "abc" repeated
2. If not, try to match characters greedily but without proper state tracking

The problem with a simplistic approach is handling cases where characters appear out of order. For example, in "cab", we need to insert 'a' and 'b' before 'c' to form "abcabc", but a naive check might just append missing characters at the end.

A more systematic (but still inefficient) brute force would be to generate all possible strings by inserting characters at all possible positions, then check which ones are valid, and return the minimum insertions. This is O(3^n) where n is the string length, completely impractical.

## Optimized Approach

The optimal solution uses a **state machine** approach. Think of the valid string as a sequence of "abc" patterns. As we process each character:

1. We maintain what character we _expect_ next (initially 'a')
2. For each character in the input:
   - If it matches what we expect, great! Move to next expected character in the cycle (a→b→c→a...)
   - If it doesn't match, we need to insert characters to get back on track:
     - Count the necessary insertions
     - Update our expected character based on what we inserted and what we saw

Actually, there's an even cleaner approach: Use a **stack** or **counter** approach. We can track how many complete or partial "abc" patterns we have. The most elegant solution uses a simple counter:

- When we see 'a', we might be starting a new pattern
- When we see 'b', it must be preceded by 'a' in the current pattern
- When we see 'c', it must be preceded by 'b' in the current pattern

We can maintain a counter that represents how many patterns are "open" (waiting for completion). But the simplest greedy approach is:

1. Initialize `expected = 'a'` and `insertions = 0`
2. For each character `ch` in word:
   - While `ch != expected`: Insert the expected character, count it, move to next expected
   - After matching (or inserting until match), move to next expected in cycle

However, this while loop could be O(n²) in worst case. The optimal O(n) solution uses the observation that we only need to track the state of what we're expecting and handle three cases cleanly.

## Optimal Solution

The clean O(n) solution: Track what character we expect next. When we see an unexpected character, we insert the missing characters to complete the current "abc" and reset our expectation based on the current character.

<div class="code-group">

```python
# Time: O(n) where n is length of word
# Space: O(1) - only using a few variables
def addMinimum(word: str) -> int:
    # We'll track what character we expect next in the "abc" pattern
    # The sequence is always: expect 'a', then 'b', then 'c', then repeat

    # Initialize: we expect 'a' first in any valid string
    expected = 'a'
    insertions = 0

    # Define what comes next in the cycle
    def next_char(ch):
        if ch == 'a':
            return 'b'
        elif ch == 'b':
            return 'c'
        else:  # ch == 'c'
            return 'a'

    # Process each character in the input
    for ch in word:
        # If current character doesn't match what we expect,
        # we need to insert characters until it does
        while ch != expected:
            # Count this insertion
            insertions += 1
            # Move to next expected character in "abc" cycle
            expected = next_char(expected)

        # Now ch matches expected, move to next expected character
        expected = next_char(expected)

    # After processing all characters, we might be in the middle of a pattern
    # For example, if we end expecting 'b', we need to insert 'b' and 'c'
    # If we end expecting 'c', we need to insert 'c'
    # If we end expecting 'a', we're at pattern boundary - nothing to insert

    while expected != 'a':  # We're done when we're back to start of next "abc"
        insertions += 1
        expected = next_char(expected)

    return insertions
```

```javascript
// Time: O(n) where n is length of word
// Space: O(1) - only using a few variables
function addMinimum(word) {
  // Track what character we expect next in the "abc" pattern
  // Sequence: expect 'a', then 'b', then 'c', then repeat

  let expected = "a"; // We expect 'a' first
  let insertions = 0;

  // Helper function to get next character in cycle
  const nextChar = (ch) => {
    if (ch === "a") return "b";
    if (ch === "b") return "c";
    return "a"; // ch === 'c'
  };

  // Process each character in the input
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];

    // Insert characters until current character matches expected
    while (ch !== expected) {
      insertions++; // Count one insertion
      expected = nextChar(expected); // Move to next in cycle
    }

    // Character matches, move to next expected
    expected = nextChar(expected);
  }

  // Handle incomplete pattern at the end
  // If we don't end at 'a', we need to complete the current "abc"
  while (expected !== "a") {
    insertions++;
    expected = nextChar(expected);
  }

  return insertions;
}
```

```java
// Time: O(n) where n is length of word
// Space: O(1) - only using a few variables
class Solution {
    public int addMinimum(String word) {
        // We expect 'a' first in any valid "abc" sequence
        char expected = 'a';
        int insertions = 0;

        // Helper to get next character in "abc" cycle
        char nextChar(char ch) {
            if (ch == 'a') return 'b';
            if (ch == 'b') return 'c';
            return 'a';  // ch == 'c'
        }

        // Process each character in the input string
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);

            // Keep inserting until current character matches expected
            while (ch != expected) {
                insertions++;  // Count one insertion
                expected = nextChar(expected);  // Move to next in cycle
            }

            // Now ch matches expected, move to next expected character
            expected = nextChar(expected);
        }

        // Complete any unfinished "abc" pattern at the end
        // If we're not back to expecting 'a', we need more insertions
        while (expected != 'a') {
            insertions++;
            expected = nextChar(expected);
        }

        return insertions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input string. Although we have nested loops (a while inside a for), each character in the input causes at most 2 insertions to be counted (when we're very out of sync). In the worst case, if the input is all 'c's, we process each character and count 2 insertions per character, but that's still O(n). More formally, the inner while loop runs at most twice per outer loop iteration.

**Space Complexity: O(1)**. We only use a constant amount of extra space: variables for the expected character, insertion count, and loop indices. No additional data structures that grow with input size.

## Common Mistakes

1. **Not handling the end of string correctly**: Forgetting to complete the last "abc" pattern. Example: "ab" needs 1 insertion ('c'), but some solutions return 0. Always check what you're expecting when the string ends.

2. **Overcounting insertions**: When seeing an unexpected character, some candidates insert all of "abc" instead of just what's needed. Example: For "ac", we need only 'b' (1 insertion), not 'b' + 'c' + 'a' (3 insertions).

3. **Using complex data structures unnecessarily**: This problem can be solved with simple state tracking. Using a stack or DP table adds unnecessary complexity and space.

4. **Infinite loops with while condition**: In the while loop `while (ch != expected)`, if you don't update `expected` inside the loop, you get an infinite loop. Always move to `nextChar(expected)` in the loop body.

## When You'll See This Pattern

This **state machine with expected sequence** pattern appears in several string validation problems:

1. **Valid Parentheses (Easy)**: Similar idea of expecting certain characters (closing brackets) based on what you've seen. Instead of "abc" cycle, it's matching pairs.

2. **Check If String Is Transformable With Substring Sort Operations (Hard)**: While more complex, it involves tracking what characters should come next in a sorted sequence.

3. **Minimum Number of Swaps to Make String Balanced (Medium)**: Tracking imbalance and fixing it incrementally, similar to counting needed insertions.

The core pattern is: **When you need to transform a sequence to match a specific pattern, track what should come next and count/perform minimal operations to get there.**

## Key Takeaways

1. **State tracking beats brute force**: For pattern-matching problems, track what you expect next rather than trying all possibilities. A simple expected-character approach often yields O(n) solutions.

2. **Handle boundaries carefully**: The end of input often needs special handling (completing partial patterns). Always ask: "What state am I in when I finish processing?"

3. **Greedy works for cyclical patterns**: When the target is a repeating pattern like "abc", local decisions (fixing mismatches immediately) lead to globally optimal solutions.

Related problems: [Merge Strings Alternately](/problem/merge-strings-alternately)
