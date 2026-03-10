---
title: "How to Solve Maximum Good People Based on Statements — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Good People Based on Statements. Hard difficulty, 52.3% acceptance rate. Topics: Array, Backtracking, Bit Manipulation, Enumeration."
date: "2030-01-21"
category: "dsa-patterns"
tags:
  ["maximum-good-people-based-on-statements", "array", "backtracking", "bit-manipulation", "hard"]
---

# How to Solve Maximum Good People Based on Statements

This problem presents a classic "truth-teller vs liar" puzzle in algorithmic form. You're given statements from `n` people about each other, where each person is either "good" (always tells truth) or "bad" (may lie or tell truth). The challenge is to determine the **maximum number of good people** possible while ensuring all statements made by good people are consistent with the assignment. What makes this tricky is that bad people can say anything, so we can't trust their statements, but we must ensure every good person's statements match reality.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider 3 people with these statements:

```
statements = [
    [0,1,2],  # Person 0: says 0 is good, 1 is good, 2 is bad
    [2,0,2],  # Person 1: says 0 is bad, 1 is good, 2 is bad
    [2,2,0]   # Person 2: says 0 is bad, 1 is bad, 2 is good
]
```

Where: 0 = good, 1 = bad, 2 = no statement

Let's test the assignment where all are good (0,0,0):

- Person 0 (good) says: "0 is good" ✓, "1 is good" ✓, "2 is bad" ✗ (but 2 is actually good)
- This fails because Person 0's statement about Person 2 contradicts reality.

Now test assignment (good, bad, bad) = (0,1,1):

- Person 0 (good) says: "0 is good" ✓, "1 is good" ✗ (but 1 is actually bad)
- Already fails - Person 0's statement about Person 1 is false.

Test assignment (bad, good, good) = (1,0,0):

- Person 1 (good) says: "0 is bad" ✓, "1 is good" ✓, "2 is bad" ✗ (but 2 is actually good)
- Fails.

Test assignment (good, good, bad) = (0,0,1):

- Person 0 (good) says: "0 is good" ✓, "1 is good" ✓, "2 is bad" ✓ (2 is actually bad)
- Person 1 (good) says: "0 is bad" ✗ (but 0 is actually good)
- Fails.

Test assignment (bad, bad, good) = (1,1,0):

- Person 2 (good) says: "0 is bad" ✓, "1 is bad" ✓, "2 is good" ✓
- All good people's statements match reality! This is valid with 1 good person.

We could continue testing all 2³ = 8 possible assignments to find the maximum good people. This brute force checking is exactly our approach.

## Brute Force Approach

The most straightforward solution is to check **all possible assignments** of good/bad status to the n people. For each assignment:

1. Verify that for every person who is marked as "good", all their statements match the actual assignment
2. Count how many people are marked as "good" in valid assignments
3. Track the maximum count found

For n people, there are 2ⁿ possible assignments. For each assignment, we check all n people, and for each good person, we check all n statements. This gives us O(2ⁿ × n²) time complexity, which becomes infeasible for n > 15 (2¹⁵ = 32,768, 2²⁰ = 1,048,576).

While this brute force approach is conceptually simple, it's too slow for the problem constraints where n can be up to 15. However, 2¹⁵ = 32,768 is actually manageable, so with some optimization, this becomes our working solution!

## Optimized Approach

The key insight is that **n ≤ 15**, which means 2ⁿ ≤ 32,768. This is small enough for brute force enumeration! We can represent each assignment as a bitmask where bit i = 1 if person i is good, 0 if bad.

For each bitmask (0 to 2ⁿ - 1):

1. Extract which people are good from the bitmask
2. For each good person i:
   - For each person j (0 to n-1):
     - If statements[i][j] == 2 (no statement), skip
     - If statements[i][j] != (whether j is good in our bitmask), this assignment is invalid
3. If all good people's statements are consistent, count the number of 1-bits in the mask
4. Track the maximum count

We optimize by:

- Using bit operations for efficiency
- Breaking early when we find a contradiction
- Precomputing nothing since n is small

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n * n^2) | Space: O(1)
def maximumGood(self, statements):
    """
    Find maximum number of good people given their statements.

    Approach: Try all 2^n possible assignments using bitmask.
    For each assignment, verify all statements made by good people.
    """
    n = len(statements)
    max_good = 0

    # Try all possible assignments (0 to 2^n - 1)
    # Each bit position i represents person i's status:
    # 1 = good, 0 = bad
    for mask in range(1 << n):
        valid = True

        # Check all people in this assignment
        for i in range(n):
            # Only verify statements from good people
            if (mask >> i) & 1:  # Person i is good
                # Check all statements made by person i
                for j in range(n):
                    if statements[i][j] == 2:
                        continue  # No statement, skip

                    # statements[i][j] should match whether j is good in our mask
                    expected = (mask >> j) & 1
                    if statements[i][j] != expected:
                        valid = False
                        break  # This assignment is invalid

                if not valid:
                    break  # No need to check other people

        # If this assignment is valid, count good people
        if valid:
            # Count number of 1-bits in mask (good people)
            good_count = bin(mask).count('1')
            max_good = max(max_good, good_count)

    return max_good
```

```javascript
// Time: O(2^n * n^2) | Space: O(1)
/**
 * Find maximum number of good people given their statements.
 *
 * Approach: Try all 2^n possible assignments using bitmask.
 * For each assignment, verify all statements made by good people.
 */
var maximumGood = function (statements) {
  const n = statements.length;
  let maxGood = 0;

  // Try all possible assignments (0 to 2^n - 1)
  // Each bit position i represents person i's status:
  // 1 = good, 0 = bad
  for (let mask = 0; mask < 1 << n; mask++) {
    let valid = true;

    // Check all people in this assignment
    for (let i = 0; i < n && valid; i++) {
      // Only verify statements from good people
      if ((mask >> i) & 1) {
        // Person i is good
        // Check all statements made by person i
        for (let j = 0; j < n; j++) {
          if (statements[i][j] === 2) {
            continue; // No statement, skip
          }

          // statements[i][j] should match whether j is good in our mask
          const expected = (mask >> j) & 1;
          if (statements[i][j] !== expected) {
            valid = false;
            break; // This assignment is invalid
          }
        }
      }
    }

    // If this assignment is valid, count good people
    if (valid) {
      // Count number of 1-bits in mask (good people)
      const goodCount = countBits(mask);
      maxGood = Math.max(maxGood, goodCount);
    }
  }

  return maxGood;
};

// Helper function to count 1-bits in a number
function countBits(num) {
  let count = 0;
  while (num > 0) {
    count += num & 1;
    num >>= 1;
  }
  return count;
}
```

```java
// Time: O(2^n * n^2) | Space: O(1)
class Solution {
    /**
     * Find maximum number of good people given their statements.
     *
     * Approach: Try all 2^n possible assignments using bitmask.
     * For each assignment, verify all statements made by good people.
     */
    public int maximumGood(int[][] statements) {
        int n = statements.length;
        int maxGood = 0;

        // Try all possible assignments (0 to 2^n - 1)
        // Each bit position i represents person i's status:
        // 1 = good, 0 = bad
        for (int mask = 0; mask < (1 << n); mask++) {
            boolean valid = true;

            // Check all people in this assignment
            for (int i = 0; i < n && valid; i++) {
                // Only verify statements from good people
                if (((mask >> i) & 1) == 1) {  // Person i is good
                    // Check all statements made by person i
                    for (int j = 0; j < n; j++) {
                        if (statements[i][j] == 2) {
                            continue;  // No statement, skip
                        }

                        // statements[i][j] should match whether j is good in our mask
                        int expected = (mask >> j) & 1;
                        if (statements[i][j] != expected) {
                            valid = false;
                            break;  // This assignment is invalid
                        }
                    }
                }
            }

            // If this assignment is valid, count good people
            if (valid) {
                // Count number of 1-bits in mask (good people)
                int goodCount = Integer.bitCount(mask);
                maxGood = Math.max(maxGood, goodCount);
            }
        }

        return maxGood;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2ⁿ × n²)

- We iterate through all 2ⁿ possible assignments
- For each assignment, we check up to n people
- For each good person, we check up to n statements
- In worst case, all people are good, so we check n² statements per assignment

**Space Complexity:** O(1)

- We only use a few variables (mask, counters, flags)
- No additional data structures that scale with n

Why is this acceptable? With n ≤ 15:

- 2¹⁵ = 32,768 assignments
- 32,768 × 15² ≈ 7.4 million operations
- Well within typical time limits (1-2 seconds)

## Common Mistakes

1. **Not handling the "no statement" case (value 2)**: Many candidates forget that statements[i][j] = 2 means "no statement" and should be skipped. Always check for this before comparing.

2. **Only checking statements about others, not self**: Person i can make statements about themselves too (statements[i][i]). The problem doesn't prohibit this, so we must handle it. Our solution correctly handles this since j ranges over all people.

3. **Assuming bad people's statements must be false**: Bad people can say anything - truth or lies. We only need to verify statements from good people. A common mistake is to also verify bad people's statements or assume they must lie.

4. **Inefficient bit counting**: Using Integer.bitCount() in Java or bin().count('1') in Python is fine, but in JavaScript, writing an efficient bit counter matters. The helper function using while loop is optimal.

## When You'll See This Pattern

This "bitmask enumeration" pattern appears in problems where:

1. The input size is small (typically n ≤ 20)
2. You need to try all combinations/permutations
3. Each element has a binary state (on/off, selected/not selected)

Related LeetCode problems:

1. **Maximum Score Words Formed by Letters (Hard)** - Similar bitmask approach to try all word combinations
2. **Smallest Sufficient Team (Hard)** - Bitmask DP to track skill coverage
3. **Number of Ways to Wear Different Hats to Each Other (Hard)** - Bitmask DP with hat assignments
4. **Find Minimum Time to Finish All Jobs (Hard)** - Bitmask DP for job assignment

The key recognition signal: "n is small" combined with "each element has two states" suggests bitmask enumeration.

## Key Takeaways

1. **When n ≤ 20, consider bitmask brute force**: The 2ⁿ combinations might be tractable. Always check constraints before dismissing brute force.

2. **Bitmask operations are your friends**: Learn to use (mask >> i) & 1 to check bits, mask | (1 << i) to set bits, and Integer.bitCount() to count set bits.

3. **Only verify constraints that must hold**: In this problem, we only check statements from good people. Bad people can say anything, so we ignore their statements. Read constraints carefully to avoid unnecessary checks.

Related problems: [Maximum Score Words Formed by Letters](/problem/maximum-score-words-formed-by-letters)
