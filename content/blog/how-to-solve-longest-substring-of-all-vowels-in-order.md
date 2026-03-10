---
title: "How to Solve Longest Substring Of All Vowels in Order — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Substring Of All Vowels in Order. Medium difficulty, 51.6% acceptance rate. Topics: String, Sliding Window."
date: "2028-09-12"
category: "dsa-patterns"
tags: ["longest-substring-of-all-vowels-in-order", "string", "sliding-window", "medium"]
---

# How to Solve Longest Substring Of All Vowels in Order

This problem asks us to find the longest substring where all five vowels (a, e, i, o, u) appear at least once and appear in alphabetical order. What makes this tricky is that we need to track both the presence of all vowels and their ordering constraints while efficiently finding the maximum length substring. A naive approach would check all substrings, but that's O(n²) — we need something smarter.

## Visual Walkthrough

Let's trace through an example: `word = "aeiaaioooaauuaeiou"`

We need to find the longest substring where:

1. All vowels a, e, i, o, u appear at least once
2. They appear in order: all a's, then all e's, then all i's, then all o's, then all u's

**Step-by-step thinking:**

- Start at index 0: "a" (good start, we're in 'a' phase)
- Index 1: "ae" (moved to 'e' phase)
- Index 2: "aei" (moved to 'i' phase)
- Index 3: "aeia" - Here's the problem! We got 'a' after already being in 'i' phase. This breaks the ordering rule.
- So the substring "aeia" is invalid. The valid part was "aei" (length 3), but it doesn't have all vowels.

**Key insight:** We can't just track the current substring. Instead, we should track the current "phase" we're in and reset when we see a vowel that breaks the order.

Let me trace more carefully:

- Start fresh at index 0: "a" (phase: a)
- Index 1: "ae" (phase: e)
- Index 2: "aei" (phase: i)
- Index 3: "aeia" - 'a' appears after 'i', so we need to restart. But wait, maybe we can continue from the last 'a'? Actually, we need to go back to where we last saw 'a'.

Better approach: Track the longest sequence where vowels appear in order. When we see a vowel:

1. If it's 'a', we can always start/continue a sequence
2. If it's 'e', we can only add it if we've seen 'a' in current sequence
3. If it's 'i', we can only add it if we've seen 'e' in current sequence
4. And so on...

For "aeiaaioooaauuaeiou":

- "aei" (length 3, missing o,u)
- Then restart: "aaioooaauuaeiou" - let's check this:
  - a,a (phase a)
  - i (phase i - wait, we skipped e! So invalid)
- Actually, we need to find: "aauuaaeiou" doesn't work either...

The correct longest beautiful substring here is "aeiou" (length 5) starting at index 12: "aeiou"

But there's a longer one: "aaeiou" would be valid if it exists. Let's check the string... at index 10-15: "aaeiou" - yes! That's length 6.

So our algorithm needs to find these ordered vowel sequences efficiently.

## Brute Force Approach

The brute force solution would check every possible substring:

1. For each starting index i (0 to n-1)
2. For each ending index j (i to n-1)
3. Check if substring word[i:j+1] contains all vowels in order
4. Track the maximum length

The checking step for each substring takes O(length) time, making this O(n³) overall. Even with optimization (early stopping when order breaks), it's still O(n²) which is too slow for n up to 5×10⁵.

**Why brute force fails:**

- Checking all substrings is O(n²)
- For each substring, checking vowel conditions is O(n)
- Total O(n³) is infeasible for large inputs
- Even O(n²) would timeout for n=500,000

## Optimized Approach

The key insight is that we don't need to check all substrings. We can process the string in a single pass using a **state machine** approach:

**State Machine Thinking:**
We have 5 states representing which vowels we've seen in order:

- State 0: expecting 'a' (starting state)
- State 1: seen 'a', now expecting 'e' (or more 'a's)
- State 2: seen 'a' and 'e', now expecting 'i'
- State 3: seen 'a', 'e', 'i', now expecting 'o'
- State 4: seen 'a', 'e', 'i', 'o', now expecting 'u'
- State 5: seen all vowels in order (complete beautiful string)

**Transition Rules:**

1. If current char matches expected vowel for current state → stay in same state
2. If current char is next vowel in sequence → advance to next state
3. If current char is 'a' → reset to state 1 (start new sequence)
4. Otherwise (wrong vowel that breaks order) → reset to state 0

**When do we have a valid beautiful substring?**
When we reach state 5 (seen all vowels), the substring from our current sequence start to current index is beautiful. We track the maximum length.

**Why this works:**

- Single pass: O(n) time
- Constant space: only need to track current state, sequence start, and max length
- Handles all ordering constraints naturally through state transitions
- Automatically finds the longest valid substring by tracking sequences

## Optimal Solution

Here's the implementation using the state machine approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestBeautifulSubstring(word: str) -> int:
    """
    Find the longest substring containing all vowels in alphabetical order.

    Approach: Use a state machine with 6 states:
    0: no sequence started
    1: seen 'a'
    2: seen 'a','e'
    3: seen 'a','e','i'
    4: seen 'a','e','i','o'
    5: seen all vowels (complete beautiful substring)
    """
    max_len = 0
    state = 0  # Current state in state machine
    current_len = 0  # Length of current sequence

    # Map vowels to their positions in sequence
    vowel_order = {'a': 1, 'e': 2, 'i': 3, 'o': 4, 'u': 5}

    for char in word:
        if state == 0:
            # No active sequence, only 'a' can start one
            if char == 'a':
                state = 1
                current_len = 1
            # Otherwise, stay in state 0
        elif state == 1:
            # Currently in 'a' sequence
            if char == 'a':
                current_len += 1  # More 'a's are fine
            elif char == 'e':
                state = 2  # Advance to 'e' state
                current_len += 1
            else:
                # Wrong character, reset
                state = 0 if char != 'a' else 1
                current_len = 1 if char == 'a' else 0
        elif state == 2:
            # Have seen 'a','e'
            if char == 'e':
                current_len += 1  # More 'e's are fine
            elif char == 'i':
                state = 3  # Advance to 'i' state
                current_len += 1
            elif char == 'a':
                # Start new sequence with 'a'
                state = 1
                current_len = 1
            else:
                # Wrong character, reset
                state = 0
                current_len = 0
        elif state == 3:
            # Have seen 'a','e','i'
            if char == 'i':
                current_len += 1  # More 'i's are fine
            elif char == 'o':
                state = 4  # Advance to 'o' state
                current_len += 1
            elif char == 'a':
                # Start new sequence with 'a'
                state = 1
                current_len = 1
            else:
                # Wrong character, reset
                state = 0
                current_len = 0
        elif state == 4:
            # Have seen 'a','e','i','o'
            if char == 'o':
                current_len += 1  # More 'o's are fine
            elif char == 'u':
                state = 5  # Advance to complete state
                current_len += 1
                # Update max length since we now have all vowels
                max_len = max(max_len, current_len)
            elif char == 'a':
                # Start new sequence with 'a'
                state = 1
                current_len = 1
            else:
                # Wrong character, reset
                state = 0
                current_len = 0
        elif state == 5:
            # Complete beautiful substring, can continue with 'u's
            if char == 'u':
                current_len += 1
                max_len = max(max_len, current_len)
            elif char == 'a':
                # Start new sequence with 'a'
                state = 1
                current_len = 1
            else:
                # Wrong character, reset
                state = 0
                current_len = 0

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function longestBeautifulSubstring(word) {
  /**
   * Find the longest substring containing all vowels in alphabetical order.
   *
   * State machine approach with 6 states:
   * 0: no sequence
   * 1: seen 'a'
   * 2: seen 'a','e'
   * 3: seen 'a','e','i'
   * 4: seen 'a','e','i','o'
   * 5: seen all vowels (complete)
   */
  let maxLen = 0;
  let state = 0; // Current state
  let currentLen = 0; // Length of current sequence

  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    switch (state) {
      case 0:
        // No active sequence, only 'a' can start one
        if (char === "a") {
          state = 1;
          currentLen = 1;
        }
        break;

      case 1:
        // Currently in 'a' sequence
        if (char === "a") {
          currentLen++;
        } else if (char === "e") {
          state = 2;
          currentLen++;
        } else {
          // Reset: either start new with 'a' or go to state 0
          state = char === "a" ? 1 : 0;
          currentLen = char === "a" ? 1 : 0;
        }
        break;

      case 2:
        // Have seen 'a','e'
        if (char === "e") {
          currentLen++;
        } else if (char === "i") {
          state = 3;
          currentLen++;
        } else if (char === "a") {
          // Start new sequence with 'a'
          state = 1;
          currentLen = 1;
        } else {
          state = 0;
          currentLen = 0;
        }
        break;

      case 3:
        // Have seen 'a','e','i'
        if (char === "i") {
          currentLen++;
        } else if (char === "o") {
          state = 4;
          currentLen++;
        } else if (char === "a") {
          state = 1;
          currentLen = 1;
        } else {
          state = 0;
          currentLen = 0;
        }
        break;

      case 4:
        // Have seen 'a','e','i','o'
        if (char === "o") {
          currentLen++;
        } else if (char === "u") {
          state = 5;
          currentLen++;
          // Update max since we now have all vowels
          maxLen = Math.max(maxLen, currentLen);
        } else if (char === "a") {
          state = 1;
          currentLen = 1;
        } else {
          state = 0;
          currentLen = 0;
        }
        break;

      case 5:
        // Complete beautiful substring
        if (char === "u") {
          currentLen++;
          maxLen = Math.max(maxLen, currentLen);
        } else if (char === "a") {
          state = 1;
          currentLen = 1;
        } else {
          state = 0;
          currentLen = 0;
        }
        break;
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int longestBeautifulSubstring(String word) {
        /**
         * Find the longest substring containing all vowels in alphabetical order.
         *
         * State machine approach:
         * 0: no sequence
         * 1: seen 'a'
         * 2: seen 'a','e'
         * 3: seen 'a','e','i'
         * 4: seen 'a','e','i','o'
         * 5: seen all vowels (complete beautiful substring)
         */
        int maxLen = 0;
        int state = 0;      // Current state in state machine
        int currentLen = 0; // Length of current sequence

        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);

            switch (state) {
                case 0:
                    // No active sequence, only 'a' can start one
                    if (c == 'a') {
                        state = 1;
                        currentLen = 1;
                    }
                    break;

                case 1:
                    // Currently in 'a' sequence
                    if (c == 'a') {
                        currentLen++;
                    } else if (c == 'e') {
                        state = 2;
                        currentLen++;
                    } else {
                        // Reset state
                        state = (c == 'a') ? 1 : 0;
                        currentLen = (c == 'a') ? 1 : 0;
                    }
                    break;

                case 2:
                    // Have seen 'a','e'
                    if (c == 'e') {
                        currentLen++;
                    } else if (c == 'i') {
                        state = 3;
                        currentLen++;
                    } else if (c == 'a') {
                        // Start new sequence with 'a'
                        state = 1;
                        currentLen = 1;
                    } else {
                        state = 0;
                        currentLen = 0;
                    }
                    break;

                case 3:
                    // Have seen 'a','e','i'
                    if (c == 'i') {
                        currentLen++;
                    } else if (c == 'o') {
                        state = 4;
                        currentLen++;
                    } else if (c == 'a') {
                        state = 1;
                        currentLen = 1;
                    } else {
                        state = 0;
                        currentLen = 0;
                    }
                    break;

                case 4:
                    // Have seen 'a','e','i','o'
                    if (c == 'o') {
                        currentLen++;
                    } else if (c == 'u') {
                        state = 5;
                        currentLen++;
                        // Update max length since we now have all vowels
                        maxLen = Math.max(maxLen, currentLen);
                    } else if (c == 'a') {
                        state = 1;
                        currentLen = 1;
                    } else {
                        state = 0;
                        currentLen = 0;
                    }
                    break;

                case 5:
                    // Complete beautiful substring
                    if (c == 'u') {
                        currentLen++;
                        maxLen = Math.max(maxLen, currentLen);
                    } else if (c == 'a') {
                        state = 1;
                        currentLen = 1;
                    } else {
                        state = 0;
                        currentLen = 0;
                    }
                    break;
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once in a single pass through the string
- For each character, we perform constant-time operations (state transitions and length updates)
- No nested loops, no backtracking

**Space Complexity: O(1)**

- We use only a fixed number of variables: `max_len`, `state`, `current_len`
- No additional data structures that scale with input size
- The state machine has a fixed number of states (6)

## Common Mistakes

1. **Not handling repeated vowels correctly**: Candidates often forget that we can have multiple of the same vowel (e.g., "aaeeiioouu" is valid). The solution must allow staying in the same state when seeing the same vowel.

2. **Incorrect reset logic**: When seeing a character that breaks the sequence, you need to reset properly. A common error is always resetting to state 0, but if you see 'a', you should start a new sequence (state 1), not go to state 0.

3. **Forgetting to update max length at the right time**: You should update `max_len` only when you have all vowels (state 5). Some candidates update it in earlier states or forget to update it when continuing with 'u's in state 5.

4. **Overcomplicating with sliding window**: While this looks like a sliding window problem, a pure two-pointer approach gets messy because you need to track which vowels you've seen and their order. The state machine is cleaner.

## When You'll See This Pattern

This state machine pattern appears in problems where you need to track sequences with specific ordering constraints:

1. **Valid Parentheses** (Easy): Similar state tracking for matching brackets
2. **String to Integer (atoi)** (Medium): State machine for parsing numeric strings with optional signs
3. **Valid Number** (Hard): Complex state machine for validating number formats
4. **Count Vowel Substrings of a String** (Easy): Similar vowel counting but without ordering constraints

The key insight is recognizing when a problem has **sequential dependencies** — where what you can do next depends on what you've seen before. State machines elegantly capture these dependencies.

## Key Takeaways

1. **State machines are perfect for ordered sequence validation**: When you need to check if elements appear in a specific order with possible repetitions, think about using a state machine.

2. **Single pass is often possible with careful tracking**: Many substring problems that seem to require O(n²) can be solved in O(n) by tracking the current valid sequence and updating as you go.

3. **Reset logic is critical**: When a sequence becomes invalid, you need to decide whether to completely abandon it or start a new partial sequence. In this problem, seeing 'a' lets us start fresh even in the middle of processing.

Related problems: [Count Vowel Substrings of a String](/problem/count-vowel-substrings-of-a-string), [Longest Nice Subarray](/problem/longest-nice-subarray), [Count of Substrings Containing Every Vowel and K Consonants II](/problem/count-of-substrings-containing-every-vowel-and-k-consonants-ii)
