---
title: "How to Solve Count The Repetitions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count The Repetitions. Hard difficulty, 33.7% acceptance rate. Topics: String, Dynamic Programming."
date: "2029-06-23"
category: "dsa-patterns"
tags: ["count-the-repetitions", "string", "dynamic-programming", "hard"]
---

# How to Solve Count The Repetitions

This problem asks us to find the maximum integer `m` such that the string `str2 = [s2, n2]` can be obtained from `str1 = [s1, n1]`. The tricky part is that `n1` and `n2` can be up to 10^6, making brute force concatenation impossible due to memory constraints. The core challenge is finding a pattern in how `s2` appears in repetitions of `s1` without actually building the massive concatenated strings.

## Visual Walkthrough

Let's trace through an example:  
`s1 = "acb"`, `n1 = 4`  
`s2 = "ab"`, `n2 = 2`

We need to find how many times we can obtain `"ab"` from `"acbacbacbacb"` (which is `"acb"` repeated 4 times).

**Step-by-step matching:**

1. Start with `str1 = "acb" × 4`, `str2 = "ab" × 2`
2. We'll match `s2 = "ab"` character by character through repetitions of `s1`:
   - First `s1` ("acb"): match 'a' at index 0, 'b' at index 2 → found 1 complete `s2`
   - Second `s1` ("acb"): match 'a' at index 0, 'b' at index 2 → found another `s2`
   - Third `s1` ("acb"): match 'a' at index 0, 'b' at index 2 → found another `s2`
   - Fourth `s1` ("acb"): match 'a' at index 0, 'b' at index 2 → found another `s2`
3. Total: Found 4 complete `s2` strings in 4 repetitions of `s1`
4. Since we need `str2 = [s2, n2] = "ab" × 2`, and we found 4 `s2` strings, we can form `4 / 2 = 2` complete `str2` strings

But what if matching isn't so clean? Consider when characters in `s2` don't align perfectly with `s1` repetitions. The key insight is that after enough repetitions, the matching pattern will repeat, allowing us to skip ahead instead of processing all `n1` repetitions one by one.

## Brute Force Approach

A naive approach would be to:

1. Actually build `str1` by repeating `s1` `n1` times
2. Try to match as many `s2` strings as possible from it
3. Divide the count by `n2` to get the answer

The problem? If `n1 = 10^6` and `s1` has length 100, `str1` would have 100 million characters! We can't store that in memory, and processing it would be O(n1 × |s1|), which is far too slow.

Even a slightly better brute force that doesn't build the full string but iterates through virtual repetitions would still be O(n1 × |s2|), which at worst case (10^6 × 100) is 100 million operations — potentially acceptable but often too slow in practice, and more importantly, it misses the opportunity for the optimization that interviewers expect.

## Optimized Approach

The key insight is **pattern detection through state tracking**. As we match `s2` through repetitions of `s1`, we'll eventually encounter a repeat of two conditions:

1. We're at the same position in `s1`
2. We're at the same position in `s2`

When this happens, we've found a cycle! The number of `s2` strings found per `s1` repetition will repeat from this point onward.

Here's the step-by-step reasoning:

1. We don't need to store the actual concatenated string — we can process `s1` cyclically
2. Keep track of how many `s2` strings we've completed after each `s1` repetition
3. Use a dictionary to store when we last saw each `(s1_index, s2_index)` pair
4. If we see the same pair again, we've found a cycle:
   - Calculate how many `s2` strings were found in the cycle
   - Calculate how many `s1` repetitions the cycle spans
   - Skip ahead through as many complete cycles as possible
5. Process any remaining repetitions after the last complete cycle

This reduces the complexity from O(n1 × |s2|) to O(|s1| × |s2|) in practice, since we only need to detect the first cycle.

## Optimal Solution

<div class="code-group">

```python
# Time: O(|s1| * |s2|) - We process until we find a repeating state
# Space: O(|s1| * |s2|) - For storing the state tracking dictionary
def getMaxRepetitions(s1: str, n1: int, s2: str, n2: int) -> int:
    """
    Returns the maximum integer m such that str2 = [s2, n2] can be obtained from str1 = [s1, n1].

    Approach: Track state (s1_index, s2_index) to detect cycles in matching pattern.
    Once a cycle is found, we can skip ahead through multiple cycles at once.
    """

    # If s2 contains characters not in s1, it's impossible to match
    if any(ch not in set(s1) for ch in s2):
        return 0

    # Dictionary to track when we last saw each state
    # key: (index_in_s1, index_in_s2) tuple
    # value: (s1_repetition_count, s2_match_count) at that state
    state = {}

    # Current positions in s1 and s2
    s1_idx, s2_idx = 0, 0
    # Counters for how many s1 repetitions processed and s2 strings matched
    s1_rep_count, s2_match_count = 0, 0

    while s1_rep_count < n1:
        # Process one character at a time from s1 (cycling through s1)
        if s1[s1_idx] == s2[s2_idx]:
            s2_idx += 1  # Move to next character in s2

            # If we've completed one s2 string
            if s2_idx == len(s2):
                s2_match_count += 1  # Count one complete s2
                s2_idx = 0  # Reset to start of s2

        # Move to next character in s1
        s1_idx += 1

        # If we've reached the end of s1, start next repetition
        if s1_idx == len(s1):
            s1_rep_count += 1  # Count one complete s1 repetition
            s1_idx = 0  # Reset to start of s1

            # Check if we've seen this state before
            current_state = (s1_idx, s2_idx)
            if current_state in state:
                # We found a cycle! The pattern will repeat from here
                prev_s1_rep, prev_s2_match = state[current_state]

                # Calculate cycle length in terms of s1 repetitions
                cycle_s1_reps = s1_rep_count - prev_s1_rep
                # Calculate how many s2 strings are matched per cycle
                cycle_s2_matches = s2_match_count - prev_s2_match

                # Calculate how many complete cycles we can skip
                cycles_to_skip = (n1 - s1_rep_count) // cycle_s1_reps

                # Skip ahead by adding the matches from skipped cycles
                s2_match_count += cycles_to_skip * cycle_s2_matches
                # Skip ahead by adding the repetitions from skipped cycles
                s1_rep_count += cycles_to_skip * cycle_s1_reps
            else:
                # Store this state for future cycle detection
                state[current_state] = (s1_rep_count, s2_match_count)

    # We've processed all n1 repetitions of s1
    # s2_match_count is how many complete s2 strings we found
    # Each str2 consists of n2 repetitions of s2
    return s2_match_count // n2
```

```javascript
// Time: O(|s1| * |s2|) - We process until we find a repeating state
// Space: O(|s1| * |s2|) - For storing the state tracking map
/**
 * Returns the maximum integer m such that str2 = [s2, n2] can be obtained from str1 = [s1, n1].
 *
 * Approach: Track state (s1_index, s2_index) to detect cycles in matching pattern.
 * Once a cycle is found, we can skip ahead through multiple cycles at once.
 */
function getMaxRepetitions(s1, n1, s2, n2) {
  // If s2 contains characters not in s1, it's impossible to match
  const s1Chars = new Set(s1);
  for (const ch of s2) {
    if (!s1Chars.has(ch)) {
      return 0;
    }
  }

  // Map to track when we last saw each state
  // key: string representation of (index_in_s1, index_in_s2)
  // value: [s1_repetition_count, s2_match_count] at that state
  const state = new Map();

  // Current positions in s1 and s2
  let s1Idx = 0,
    s2Idx = 0;
  // Counters for how many s1 repetitions processed and s2 strings matched
  let s1RepCount = 0,
    s2MatchCount = 0;

  while (s1RepCount < n1) {
    // Process one character at a time from s1 (cycling through s1)
    if (s1[s1Idx] === s2[s2Idx]) {
      s2Idx++; // Move to next character in s2

      // If we've completed one s2 string
      if (s2Idx === s2.length) {
        s2MatchCount++; // Count one complete s2
        s2Idx = 0; // Reset to start of s2
      }
    }

    // Move to next character in s1
    s1Idx++;

    // If we've reached the end of s1, start next repetition
    if (s1Idx === s1.length) {
      s1RepCount++; // Count one complete s1 repetition
      s1Idx = 0; // Reset to start of s1

      // Create key for current state
      const currentState = `${s1Idx},${s2Idx}`;

      if (state.has(currentState)) {
        // We found a cycle! The pattern will repeat from here
        const [prevS1Rep, prevS2Match] = state.get(currentState);

        // Calculate cycle length in terms of s1 repetitions
        const cycleS1Reps = s1RepCount - prevS1Rep;
        // Calculate how many s2 strings are matched per cycle
        const cycleS2Matches = s2MatchCount - prevS2Match;

        // Calculate how many complete cycles we can skip
        const cyclesToSkip = Math.floor((n1 - s1RepCount) / cycleS1Reps);

        // Skip ahead by adding the matches from skipped cycles
        s2MatchCount += cyclesToSkip * cycleS2Matches;
        // Skip ahead by adding the repetitions from skipped cycles
        s1RepCount += cyclesToSkip * cycleS1Reps;
      } else {
        // Store this state for future cycle detection
        state.set(currentState, [s1RepCount, s2MatchCount]);
      }
    }
  }

  // We've processed all n1 repetitions of s1
  // s2MatchCount is how many complete s2 strings we found
  // Each str2 consists of n2 repetitions of s2
  return Math.floor(s2MatchCount / n2);
}
```

```java
// Time: O(|s1| * |s2|) - We process until we find a repeating state
// Space: O(|s1| * |s2|) - For storing the state tracking map
class Solution {
    /**
     * Returns the maximum integer m such that str2 = [s2, n2] can be obtained from str1 = [s1, n1].
     *
     * Approach: Track state (s1_index, s2_index) to detect cycles in matching pattern.
     * Once a cycle is found, we can skip ahead through multiple cycles at once.
     */
    public int getMaxRepetitions(String s1, int n1, String s2, int n2) {
        // If s2 contains characters not in s1, it's impossible to match
        boolean[] s1Chars = new boolean[26];
        for (char c : s1.toCharArray()) {
            s1Chars[c - 'a'] = true;
        }
        for (char c : s2.toCharArray()) {
            if (!s1Chars[c - 'a']) {
                return 0;
            }
        }

        // Map to track when we last saw each state
        // key: encoded state (s1_index * 100 + s2_index works for constraints)
        // value: int array of [s1_repetition_count, s2_match_count]
        Map<Integer, int[]> state = new HashMap<>();

        // Current positions in s1 and s2
        int s1Idx = 0, s2Idx = 0;
        // Counters for how many s1 repetitions processed and s2 strings matched
        int s1RepCount = 0, s2MatchCount = 0;

        while (s1RepCount < n1) {
            // Process one character at a time from s1 (cycling through s1)
            if (s1.charAt(s1Idx) == s2.charAt(s2Idx)) {
                s2Idx++;  // Move to next character in s2

                // If we've completed one s2 string
                if (s2Idx == s2.length()) {
                    s2MatchCount++;  // Count one complete s2
                    s2Idx = 0;  // Reset to start of s2
                }
            }

            // Move to next character in s1
            s1Idx++;

            // If we've reached the end of s1, start next repetition
            if (s1Idx == s1.length()) {
                s1RepCount++;  // Count one complete s1 repetition
                s1Idx = 0;  // Reset to start of s1

                // Encode current state as a single integer
                int currentState = s1Idx * 100 + s2Idx;  // 100 is safe since |s1|, |s2| ≤ 100

                if (state.containsKey(currentState)) {
                    // We found a cycle! The pattern will repeat from here
                    int[] prev = state.get(currentState);
                    int prevS1Rep = prev[0];
                    int prevS2Match = prev[1];

                    // Calculate cycle length in terms of s1 repetitions
                    int cycleS1Reps = s1RepCount - prevS1Rep;
                    // Calculate how many s2 strings are matched per cycle
                    int cycleS2Matches = s2MatchCount - prevS2Match;

                    // Calculate how many complete cycles we can skip
                    int cyclesToSkip = (n1 - s1RepCount) / cycleS1Reps;

                    // Skip ahead by adding the matches from skipped cycles
                    s2MatchCount += cyclesToSkip * cycleS2Matches;
                    // Skip ahead by adding the repetitions from skipped cycles
                    s1RepCount += cyclesToSkip * cycleS1Reps;
                } else {
                    // Store this state for future cycle detection
                    state.put(currentState, new int[]{s1RepCount, s2MatchCount});
                }
            }
        }

        // We've processed all n1 repetitions of s1
        // s2MatchCount is how many complete s2 strings we found
        // Each str2 consists of n2 repetitions of s2
        return s2MatchCount / n2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(|s1| × |s2|)**

- In the worst case, we might need to process all combinations of s1 and s2 indices before finding a cycle
- There are |s1| × |s2| possible states (s1_index, s2_index)
- Once we find a cycle (or process all n1 repetitions without a cycle), we're done
- The cycle skipping part is O(1) since we calculate it directly

**Space Complexity: O(|s1| × |s2|)**

- We store a dictionary/map that tracks each unique state we encounter
- In the worst case, we might store all |s1| × |s2| possible states before finding a cycle
- This is much better than O(n1 × |s1|) which would be required to store the actual concatenated string

## Common Mistakes

1. **Actually building the concatenated strings**: This is the most common mistake. With n1 up to 10^6 and |s1| up to 100, the concatenated string would have 100 million characters, exceeding memory limits. Always remember: if constraints are large, you need a mathematical or pattern-based solution, not a brute force string building approach.

2. **Forgetting the early impossibility check**: If s2 contains characters not in s1, it's impossible to match any s2 strings. Checking this first saves computation and handles an important edge case.

3. **Incorrect cycle calculation**: When calculating how many cycles to skip, candidates often make off-by-one errors. Remember: `cycles_to_skip = (remaining_repetitions) // cycle_length`, not `(total_repetitions) // cycle_length`. We need to consider only the repetitions remaining after we detected the cycle.

4. **Not resetting s2_idx when completing an s2 string**: After matching a complete s2, you must reset s2_idx to 0 to start matching the next s2. Forgetting this causes the algorithm to look for s2 starting from the middle instead of the beginning.

## When You'll See This Pattern

This "state tracking to detect cycles" pattern appears in several other LeetCode problems:

1. **Happy Number (LeetCode 202)**: Track seen numbers to detect cycles in the digit square sum sequence. When you see a repeat, you know you're in a cycle.

2. **Linked List Cycle II (LeetCode 142)**: Use slow/fast pointers to detect cycles, similar to how we track states to detect repeating patterns.

3. **Fraction to Recurring Decimal (LeetCode 166)**: Track remainders in long division to detect repeating decimal patterns. When you see the same remainder again, you've found a repeating cycle.

The common thread: when a process repeats with a finite number of states, you'll eventually hit a previously seen state, creating a cycle. Once you detect the cycle, you can extrapolate or skip ahead.

## Key Takeaways

1. **When constraints are large, look for patterns or cycles**: If n1 and n2 can be up to 10^6, you can't process each repetition individually. Look for mathematical patterns or state cycles that allow you to skip ahead.

2. **State = (position_in_s1, position_in_s2)**: This pair completely describes our matching progress. Tracking when we've seen this state before lets us detect cycles in the matching process.

3. **Cycle detection enables skipping**: Once you find a cycle, you can calculate how many cycles fit in the remaining repetitions and skip ahead, dramatically reducing the time complexity from O(n1) to O(|s1| × |s2|).

[Practice this problem on CodeJeet](/problem/count-the-repetitions)
