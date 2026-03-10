---
title: "How to Solve Minimum Number of Swaps to Make the Binary String Alternating — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Swaps to Make the Binary String Alternating. Medium difficulty, 43.9% acceptance rate. Topics: String, Greedy."
date: "2029-02-04"
category: "dsa-patterns"
tags:
  ["minimum-number-of-swaps-to-make-the-binary-string-alternating", "string", "greedy", "medium"]
---

# How to Solve Minimum Number of Swaps to Make the Binary String Alternating

This problem asks us to transform a binary string into an alternating pattern (where no two adjacent characters are equal) using the minimum number of swaps. The challenge lies in determining which alternating pattern to target and calculating swaps efficiently when multiple characters need to be rearranged.

**What makes this tricky:** There are only two possible alternating patterns for any binary string ("0101..." or "1010..."), but we need to check which one is achievable based on the counts of '0's and '1's, and then calculate swaps efficiently without actually performing them.

## Visual Walkthrough

Let's trace through an example: `s = "111000"`

**Step 1: Count characters**

- Count of '1's: 3
- Count of '0's: 3

**Step 2: Check feasibility for each pattern**

- Pattern 1: "010101" (starts with '0')
  - Needs 3 zeros in even positions (0, 2, 4) and 3 ones in odd positions (1, 3, 5)
  - Our string has 3 zeros and 3 ones → possible if counts match
- Pattern 2: "101010" (starts with '1')
  - Needs 3 ones in even positions and 3 zeros in odd positions
  - Our string has 3 zeros and 3 ones → also possible

**Step 3: Calculate swaps needed for each pattern**
For pattern "010101":

- Compare actual string "111000" with target "010101"
- Position 0: actual '1' vs target '0' → mismatch (needs swap)
- Position 1: actual '1' vs target '1' → match
- Position 2: actual '1' vs target '0' → mismatch
- Position 3: actual '0' vs target '1' → mismatch
- Position 4: actual '0' vs target '0' → match
- Position 5: actual '0' vs target '1' → mismatch

We have 4 mismatches. Each swap fixes 2 mismatches, so we need 4/2 = 2 swaps.

For pattern "101010":

- Compare "111000" with "101010"
- Position 0: '1' vs '1' → match
- Position 1: '1' vs '0' → mismatch
- Position 2: '1' vs '1' → match
- Position 3: '0' vs '0' → match
- Position 4: '0' vs '1' → mismatch
- Position 5: '0' vs '0' → match

We have 2 mismatches → 2/2 = 1 swap.

**Step 4: Choose minimum**
Minimum swaps = min(2, 1) = 1

## Brute Force Approach

A naive approach would try all possible swaps and track the minimum needed to reach an alternating string. For a string of length n, there are C(n, 2) possible swap pairs. We could:

1. Generate all possible sequences of swaps
2. For each sequence, check if the result is alternating
3. Track the minimum length of sequences that work

This approach has factorial complexity and is completely impractical for strings longer than 10 characters. Even checking all single swaps (O(n²)) and then all double swaps (O(n⁴)) quickly becomes infeasible.

The key insight we need is that we don't need to actually perform swaps—we can mathematically calculate how many are needed by comparing the string to the two possible target patterns.

## Optimized Approach

The optimal solution follows this reasoning:

1. **Count characters**: First, count how many '0's and '1's we have. Let `count0` and `count1` be these counts.

2. **Check feasibility**: For a string to be transformable into an alternating pattern:
   - If length is even: `count0` must equal `count1`
   - If length is odd: The counts must differ by exactly 1
     If these conditions aren't met, return -1.

3. **Define target patterns**: There are only two possible alternating patterns:
   - Pattern A: "0101..." (starts with '0')
   - Pattern B: "1010..." (starts with '1')

4. **Calculate mismatches for each pattern**: For each position i:
   - If pattern A expects '0' at position i but we have '1', that's a mismatch
   - If pattern A expects '1' at position i but we have '0', that's a mismatch
     Count these mismatches for both patterns.

5. **Calculate swaps**: Each swap fixes exactly 2 mismatches (one at each swapped position), so:
   - Swaps needed = mismatches / 2
     But only if the pattern is feasible given our character counts.

6. **Handle even/odd length differences**:
   - For even length: Both patterns might be feasible
   - For odd length: Only one pattern is feasible (the one starting with the character that has the higher count)

7. **Return minimum**: Return the minimum swaps needed among feasible patterns.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minSwaps(s: str) -> int:
    # Step 1: Count zeros and ones
    count0 = s.count('0')
    count1 = s.count('1')
    n = len(s)

    # Step 2: Check if transformation is possible
    # For even length, counts must be equal
    # For odd length, counts must differ by exactly 1
    if n % 2 == 0:
        if count0 != count1:
            return -1
    else:
        if abs(count0 - count1) != 1:
            return -1

    # Step 3: Helper function to count mismatches for a given starting character
    def count_mismatches(start_char):
        mismatches = 0
        expected = start_char

        for i in range(n):
            # If current character doesn't match what we expect at this position
            if s[i] != expected:
                mismatches += 1
            # Toggle expected character for next position
            expected = '1' if expected == '0' else '0'

        return mismatches

    # Step 4: Calculate swaps for each pattern
    if n % 2 == 0:
        # Even length: both patterns are possible
        # Each swap fixes 2 mismatches, so divide by 2
        swaps_pattern1 = count_mismatches('0') // 2
        swaps_pattern2 = count_mismatches('1') // 2
        return min(swaps_pattern1, swaps_pattern2)
    else:
        # Odd length: only one pattern is possible
        # Pattern must start with the character that has higher count
        if count0 > count1:
            # Must start with '0' (pattern "0101...")
            return count_mismatches('0') // 2
        else:
            # Must start with '1' (pattern "1010...")
            return count_mismatches('1') // 2
```

```javascript
// Time: O(n) | Space: O(1)
function minSwaps(s) {
  // Step 1: Count zeros and ones
  let count0 = 0,
    count1 = 0;
  const n = s.length;

  for (let i = 0; i < n; i++) {
    if (s[i] === "0") count0++;
    else count1++;
  }

  // Step 2: Check if transformation is possible
  // For even length, counts must be equal
  // For odd length, counts must differ by exactly 1
  if (n % 2 === 0) {
    if (count0 !== count1) return -1;
  } else {
    if (Math.abs(count0 - count1) !== 1) return -1;
  }

  // Step 3: Helper function to count mismatches for a given starting character
  function countMismatches(startChar) {
    let mismatches = 0;
    let expected = startChar;

    for (let i = 0; i < n; i++) {
      // If current character doesn't match what we expect at this position
      if (s[i] !== expected) {
        mismatches++;
      }
      // Toggle expected character for next position
      expected = expected === "0" ? "1" : "0";
    }

    return mismatches;
  }

  // Step 4: Calculate swaps for each pattern
  if (n % 2 === 0) {
    // Even length: both patterns are possible
    // Each swap fixes 2 mismatches, so divide by 2
    const swapsPattern1 = countMismatches("0") / 2;
    const swapsPattern2 = countMismatches("1") / 2;
    return Math.min(swapsPattern1, swapsPattern2);
  } else {
    // Odd length: only one pattern is possible
    // Pattern must start with the character that has higher count
    if (count0 > count1) {
      // Must start with '0' (pattern "0101...")
      return countMismatches("0") / 2;
    } else {
      // Must start with '1' (pattern "1010...")
      return countMismatches("1") / 2;
    }
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minSwaps(String s) {
        // Step 1: Count zeros and ones
        int count0 = 0, count1 = 0;
        int n = s.length();

        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == '0') count0++;
            else count1++;
        }

        // Step 2: Check if transformation is possible
        // For even length, counts must be equal
        // For odd length, counts must differ by exactly 1
        if (n % 2 == 0) {
            if (count0 != count1) return -1;
        } else {
            if (Math.abs(count0 - count1) != 1) return -1;
        }

        // Step 3: Helper function to count mismatches for a given starting character
        int countMismatches(char startChar) {
            int mismatches = 0;
            char expected = startChar;

            for (int i = 0; i < n; i++) {
                // If current character doesn't match what we expect at this position
                if (s.charAt(i) != expected) {
                    mismatches++;
                }
                // Toggle expected character for next position
                expected = (expected == '0') ? '1' : '0';
            }

            return mismatches;
        }

        // Step 4: Calculate swaps for each pattern
        if (n % 2 == 0) {
            // Even length: both patterns are possible
            // Each swap fixes 2 mismatches, so divide by 2
            int swapsPattern1 = countMismatches('0') / 2;
            int swapsPattern2 = countMismatches('1') / 2;
            return Math.min(swapsPattern1, swapsPattern2);
        } else {
            // Odd length: only one pattern is possible
            // Pattern must start with the character that has higher count
            if (count0 > count1) {
                // Must start with '0' (pattern "0101...")
                return countMismatches('0') / 2;
            } else {
                // Must start with '1' (pattern "1010...")
                return countMismatches('1') / 2;
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting zeros and ones: O(n)
- Counting mismatches for patterns: O(n) for each pattern, but we check at most 2 patterns
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for counters and temporary variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to check feasibility first**: Many candidates jump straight to counting mismatches without checking if the transformation is even possible given the counts of '0's and '1's. Always check the count conditions first.

2. **Incorrect swap calculation**: Some candidates return the mismatch count instead of dividing by 2. Remember: each swap fixes exactly 2 mismatches (one at each swapped position), so swaps = mismatches / 2.

3. **Not handling odd-length strings correctly**: For odd-length strings, only one pattern is possible (the one starting with the character that appears more frequently). Trying both patterns for odd-length strings will give incorrect results.

4. **Off-by-one errors in pattern generation**: When counting mismatches, ensure you're toggling the expected character correctly after each position. A common mistake is to use `i % 2` to determine expected character, which works but is less intuitive than toggling.

## When You'll See This Pattern

This problem uses a **pattern matching with feasibility check** approach that appears in several other problems:

1. **Minimum Changes To Make Alternating Binary String (LeetCode 1758)**: Similar concept but allows character changes (not just swaps). The pattern recognition is identical.

2. **Minimum Number of Operations to Move All Balls to Each Box (LeetCode 1769)**: While different in specifics, it shares the approach of calculating operations mathematically rather than simulating them.

3. **Minimum Swaps to Make Strings Equal (LeetCode 1247)**: Another swap minimization problem where you analyze mismatch patterns rather than simulating swaps.

The core pattern is: when asked to minimize operations to achieve a target pattern, first identify what target patterns are possible, then calculate operations mathematically rather than simulating them.

## Key Takeaways

1. **Look for mathematical solutions before simulation**: When asked to minimize operations, often you can calculate the answer directly rather than simulating the process. This is especially true for swap problems where each swap affects exactly 2 positions.

2. **Check feasibility constraints first**: Before attempting to solve, identify what conditions make the problem solvable. Here, the counts of '0's and '1's determine whether an alternating string is even possible.

3. **Consider all possible target patterns**: When there are limited possible target states (here, just two alternating patterns), evaluate each one and take the minimum. This is more efficient than exploring all possible sequences of operations.

[Practice this problem on CodeJeet](/problem/minimum-number-of-swaps-to-make-the-binary-string-alternating)
