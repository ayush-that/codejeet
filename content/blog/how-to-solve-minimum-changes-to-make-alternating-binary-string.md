---
title: "How to Solve Minimum Changes To Make Alternating Binary String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Changes To Make Alternating Binary String. Easy difficulty, 63.8% acceptance rate. Topics: String."
date: "2026-06-23"
category: "dsa-patterns"
tags: ["minimum-changes-to-make-alternating-binary-string", "string", "easy"]
---

# How to Solve Minimum Changes To Make Alternating Binary String

You're given a binary string and need to find the minimum number of character flips (0→1 or 1→0) to make it alternating. The challenge is that there are exactly two possible alternating patterns for any length string, and we need to efficiently compare our input to both.

## Visual Walkthrough

Let's trace through `s = "0100"`:

An alternating string has no two adjacent equal characters. For length 4, there are only two valid alternating patterns:

1. `"0101"` (starts with '0')
2. `"1010"` (starts with '1')

Now let's compare our input to each pattern:

**Comparison with "0101":**

- Position 0: '0' vs '0' → match (0 changes)
- Position 1: '1' vs '1' → match (0 changes)
- Position 2: '0' vs '0' → match (0 changes)
- Position 3: '0' vs '1' → mismatch (1 change)
  Total changes needed: 1

**Comparison with "1010":**

- Position 0: '0' vs '1' → mismatch (1 change)
- Position 1: '1' vs '0' → mismatch (1 change)
- Position 2: '0' vs '1' → mismatch (1 change)
- Position 3: '0' vs '0' → match (0 changes)
  Total changes needed: 3

The minimum is 1 change (flip the last character from '0' to '1').

## Brute Force Approach

A naive approach might try all possible modifications, but that's exponential. Another brute force would be to generate all alternating strings of length n and compare each to our input. However, there are only 2^n possible binary strings, and generating them all would be O(2^n), which is impractical for n up to 10^5.

What some candidates might try is to make the string alternating by scanning once and flipping whenever they see two consecutive equal characters. Let's test this on `"0100"`:

- Compare positions 0-1: '0' vs '1' → OK
- Compare positions 1-2: '1' vs '0' → OK
- Compare positions 2-3: '0' vs '0' → Problem! Flip position 3 to '1'
  Result: `"0101"` with 1 flip

This seems to work for this example, but consider `"1111"`:

- Compare positions 0-1: '1' vs '1' → Problem! Flip position 1 to '0'
- Compare positions 1-2: '0' vs '1' → OK
- Compare positions 2-3: '1' vs '1' → Problem! Flip position 3 to '0'
  Result: `"1010"` with 2 flips

But wait, we could also get `"0101"` with 2 flips. The greedy approach gives us a valid alternating string, but is it minimum? Let's test `"110"`:

- Compare positions 0-1: '1' vs '1' → Problem! Flip position 1 to '0'
- Compare positions 1-2: '0' vs '0' → Problem! Flip position 2 to '1'
  Result: `"101"` with 2 flips

But the optimal solution is actually 1 flip (change first character to '0' → `"010"`). The greedy approach fails because early flips can force unnecessary later flips.

## Optimal Solution

The key insight is that for a binary alternating string, there are exactly two possibilities:

1. Pattern A: `"010101..."` (even indices are '0', odd indices are '1')
2. Pattern B: `"101010..."` (even indices are '1', odd indices are '0')

We simply need to count how many characters differ from each pattern and take the minimum. We can do this in a single pass through the string.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(s: str) -> int:
    """
    Calculate minimum flips to make binary string alternating.

    There are only two possible alternating patterns for any length:
    1. Pattern A: "010101..." (even indices = '0', odd indices = '1')
    2. Pattern B: "101010..." (even indices = '1', odd indices = '0')

    We count mismatches with both patterns and return the minimum.
    """
    # Counters for mismatches with each pattern
    count_pattern_a = 0  # Pattern: "010101..."
    count_pattern_b = 0  # Pattern: "101010..."

    # Iterate through each character with its index
    for i, char in enumerate(s):
        # Check against Pattern A: even indices should be '0', odd should be '1'
        if i % 2 == 0:
            # Even index: should be '0' in Pattern A
            if char != '0':
                count_pattern_a += 1
            # Even index: should be '1' in Pattern B
            if char != '1':
                count_pattern_b += 1
        else:
            # Odd index: should be '1' in Pattern A
            if char != '1':
                count_pattern_a += 1
            # Odd index: should be '0' in Pattern B
            if char != '0':
                count_pattern_b += 1

    # Return the minimum flips needed
    return min(count_pattern_a, count_pattern_b)
```

```javascript
// Time: O(n) | Space: O(1)
function minOperations(s) {
  /**
   * Calculate minimum flips to make binary string alternating.
   *
   * Two possible alternating patterns:
   * 1. Pattern A: "010101..." (even indices = '0', odd indices = '1')
   * 2. Pattern B: "101010..." (even indices = '1', odd indices = '0')
   *
   * Count mismatches with both patterns and return the minimum.
   */
  let countPatternA = 0; // Pattern: "010101..."
  let countPatternB = 0; // Pattern: "101010..."

  // Iterate through each character with its index
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Check against Pattern A: even indices should be '0', odd should be '1'
    if (i % 2 === 0) {
      // Even index: should be '0' in Pattern A
      if (char !== "0") countPatternA++;
      // Even index: should be '1' in Pattern B
      if (char !== "1") countPatternB++;
    } else {
      // Odd index: should be '1' in Pattern A
      if (char !== "1") countPatternA++;
      // Odd index: should be '0' in Pattern B
      if (char !== "0") countPatternB++;
    }
  }

  // Return the minimum flips needed
  return Math.min(countPatternA, countPatternB);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minOperations(String s) {
        /**
         * Calculate minimum flips to make binary string alternating.
         *
         * Two possible alternating patterns:
         * 1. Pattern A: "010101..." (even indices = '0', odd indices = '1')
         * 2. Pattern B: "101010..." (even indices = '1', odd indices = '0')
         *
         * Count mismatches with both patterns and return the minimum.
         */
        int countPatternA = 0;  // Pattern: "010101..."
        int countPatternB = 0;  // Pattern: "101010..."

        // Iterate through each character with its index
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            // Check against Pattern A: even indices should be '0', odd should be '1'
            if (i % 2 == 0) {
                // Even index: should be '0' in Pattern A
                if (c != '0') countPatternA++;
                // Even index: should be '1' in Pattern B
                if (c != '1') countPatternB++;
            } else {
                // Odd index: should be '1' in Pattern A
                if (c != '1') countPatternA++;
                // Odd index: should be '0' in Pattern B
                if (c != '0') countPatternB++;
            }
        }

        // Return the minimum flips needed
        return Math.min(countPatternA, countPatternB);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the string. We make a single pass through the string, performing constant-time operations at each position.

**Space Complexity:** O(1). We only use a fixed number of integer variables (two counters) regardless of input size. No additional data structures are created.

## Common Mistakes

1. **Trying greedy local fixes:** As shown earlier, flipping whenever you see two consecutive equal characters doesn't guarantee the minimum. This approach might work for some cases but fails on inputs like `"110"`.

2. **Only checking one pattern:** Some candidates realize there are two patterns but only check one (usually starting with '0'). Remember that `"1010"` is just as valid as `"0101"`, and one might require fewer flips.

3. **Off-by-one errors with indices:** When checking patterns, it's easy to mix up which indices should be '0' vs '1'. A good mental check: for Pattern A (starting with '0'), even indices (0, 2, 4...) should be '0', odd indices (1, 3, 5...) should be '1'.

4. **Overcomplicating with DP:** While dynamic programming could solve this, it's unnecessary. The problem has a simple mathematical structure with only two valid states to compare against.

## When You'll See This Pattern

This "compare to known patterns" approach appears in many string manipulation problems:

1. **Minimum Changes To Make Alternating Binary String II** (a variation of this problem) - Same core idea but with additional constraints.

2. **Minimum Number of Swaps to Make the String Balanced** (LeetCode 1963) - Similar pattern of comparing to known valid configurations.

3. **Minimum Add to Make Parentheses Valid** (LeetCode 921) - While not about binary strings, it uses a similar approach of tracking how far you are from a valid state.

4. **Minimum Remove to Make Valid Parentheses** (LeetCode 1249) - Another problem where you compare against a known valid pattern.

The pattern is: when there are a limited number of valid configurations (often just 2 for binary/parity problems), explicitly check against each one rather than trying to derive a complex transformation.

## Key Takeaways

1. **For binary alternating patterns, there are exactly two possibilities:** Always check both the "starts with 0" and "starts with 1" patterns. The minimum flips is the smaller mismatch count.

2. **Simple counting beats complex algorithms:** When a problem has a small fixed number of target states, a direct comparison is often optimal. Don't overengineer with DP or greedy heuristics when simple enumeration works.

3. **Index parity determines character requirements:** In alternating patterns, whether an index is even or odd completely determines what character should be there. This symmetry simplifies the checking logic.

Related problems: [Remove Adjacent Almost-Equal Characters](/problem/remove-adjacent-almost-equal-characters)
