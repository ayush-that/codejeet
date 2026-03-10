---
title: "How to Solve Count Number of Special Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Number of Special Subsequences. Hard difficulty, 52.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2030-03-03"
category: "dsa-patterns"
tags: ["count-number-of-special-subsequences", "array", "dynamic-programming", "hard"]
---

# How to Solve Count Number of Special Subsequences

This problem asks us to count all **special subsequences** in a given array, where a subsequence is special if it contains a positive number of 0s, followed by a positive number of 1s, then a positive number of 2s, in that exact order. The tricky part is that subsequences don't need to be contiguous—we can skip elements—but the relative order must be maintained. This makes brute-force enumeration impossible for large arrays, requiring a clever dynamic programming approach.

## Visual Walkthrough

Let's trace through a small example: `nums = [0,1,0,1,2]`

We need to count subsequences that follow the pattern: some 0s, then some 1s, then some 2s.

**Step-by-step thinking:**

1. We'll build three counters:
   - `count0`: subsequences ending with 0 (valid starting sequences)
   - `count1`: subsequences ending with 1 (have seen 0s, now seeing 1s)
   - `count2`: subsequences ending with 2 (complete special sequences)

2. Process each number:
   - **First element 0**:
     - We can start a new subsequence with just this 0 → `count0 += 1`
     - `count0 = 1`, `count1 = 0`, `count2 = 0`
   - **Second element 1**:
     - We can append this 1 to any existing subsequence ending with 0
     - This creates `count0` new subsequences ending with 1 → `count1 += count0`
     - We can also append this 1 to existing subsequences ending with 1
     - `count0 = 1`, `count1 = 1`, `count2 = 0`
   - **Third element 0**:
     - We can start a new subsequence with this 0 → `count0 += 1`
     - We can also append this 0 to existing subsequences ending with 0
     - `count0 = 1 + 1 + 1 = 3` (new single 0 + existing 0s extended with 0)
     - `count0 = 3`, `count1 = 1`, `count2 = 0`
   - **Fourth element 1**:
     - Append to subsequences ending with 0: adds 3 new subsequences ending with 1
     - Append to existing subsequences ending with 1: adds 1 new subsequence ending with 1
     - `count1 = 1 + 3 + 1 = 5`
     - `count0 = 3`, `count1 = 5`, `count2 = 0`
   - **Fifth element 2**:
     - Append to subsequences ending with 1: adds 5 new complete special sequences
     - Append to existing complete sequences: adds 0 new ones (initially)
     - `count2 = 0 + 5 + 0 = 5`
     - Final counts: `count0 = 3`, `count1 = 5`, `count2 = 5`

**Valid special subsequences from our example:**

- [0,1,2] (using indices 0,1,4)
- [0,1,2] (using indices 0,3,4)
- [0,1,2] (using indices 2,3,4)
- [0,0,1,2] (using indices 0,2,3,4)
- [0,0,1,1,2] (using indices 0,2,3,4 with both 1s)

Total: 5 special subsequences, matching our `count2`.

## Brute Force Approach

A naive approach would generate all possible subsequences (2^n possibilities) and check if each one is special. For each subsequence, we would:

1. Remove all elements that aren't 0, 1, or 2
2. Check if it starts with at least one 0, followed by at least one 1, then at least one 2
3. Ensure no 0 appears after a 1, and no 1 appears after a 2

**Why this fails:**

- With n up to 10^5, 2^n is astronomically large
- Even for n=20, we'd have over 1 million subsequences to check
- The problem constraints make brute force completely infeasible

**What candidates might try:**

- Trying to use three nested loops to pick positions for 0s, 1s, and 2s → O(n³) time
- Using recursion to explore all combinations → exponential time
- These approaches fail because they don't leverage the sequential nature of the problem

## Optimized Approach

The key insight is that we don't need to enumerate subsequences—we can **count** them using dynamic programming. Since the pattern is strictly sequential (0s then 1s then 2s), we can maintain three counters:

1. **count0**: Number of valid subsequences ending with 0
   - When we see a new 0, we can:
     - Start a new subsequence with just this 0
     - Append it to any existing subsequence ending with 0

2. **count1**: Number of valid subsequences ending with 1
   - When we see a new 1, we can:
     - Append it to any subsequence ending with 0 (creating a 0-1 sequence)
     - Append it to any existing subsequence ending with 1 (extending the 1s section)

3. **count2**: Number of complete special subsequences ending with 2
   - When we see a new 2, we can:
     - Append it to any subsequence ending with 1 (completing a special sequence)
     - Append it to any existing complete sequence (extending the 2s section)

**Why this works:**

- Each counter represents the number of ways to build subsequences up to the current point
- The transitions between counters enforce the required order (0→1→2)
- By updating counts as we process each element, we avoid redundant computation
- The final answer is simply `count2`, which holds all complete special sequences

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countSpecialSubsequences(nums):
    """
    Counts all special subsequences where:
    - Positive number of 0s, then positive number of 1s, then positive number of 2s
    - Order must be maintained but elements don't need to be contiguous
    """
    # Initialize counters for subsequences ending with 0, 1, and 2
    count0 = 0  # subsequences ending with 0 (valid starts)
    count1 = 0  # subsequences ending with 1 (have seen 0s, now 1s)
    count2 = 0  # subsequences ending with 2 (complete special sequences)

    for num in nums:
        if num == 0:
            # For a new 0:
            # 1. We can start a new subsequence with just this 0
            # 2. We can append this 0 to any existing subsequence ending with 0
            # So: new_count0 = 1 (new sequence) + count0 (extend existing)
            # But wait: we also need to add count0 again for extending?
            # Actually: count0 = count0 + (count0 + 1) is wrong.
            # Correct: When we see a 0, we can:
            # - Start new sequence: +1
            # - Append to each existing 0-ending sequence: +count0
            # So total new 0-ending sequences = 1 + count0
            # But we're updating count0, so: count0 = count0 + (1 + count0)?
            # Let's derive properly:
            # Let x = old count0
            # New possibilities:
            # 1. All old 0-ending sequences remain valid
            # 2. We can append this 0 to each old 0-ending sequence: +x
            # 3. We can start a new sequence with just this 0: +1
            # So new count0 = x + x + 1 = 2x + 1
            count0 = 2 * count0 + 1

        elif num == 1:
            # For a new 1:
            # 1. We can append it to any subsequence ending with 0: +count0
            # 2. We can append it to any existing subsequence ending with 1: +count1
            # All existing 1-ending sequences remain valid
            # So: count1 = count1 + count0 + count1 = 2*count1 + count0
            count1 = 2 * count1 + count0

        else:  # num == 2
            # For a new 2:
            # 1. We can append it to any subsequence ending with 1: +count1
            # 2. We can append it to any existing complete sequence: +count2
            # All existing complete sequences remain valid
            # So: count2 = count2 + count1 + count2 = 2*count2 + count1
            count2 = 2 * count2 + count1

    # The answer is the number of complete special sequences
    return count2 % (10**9 + 7)  # Apply modulo as required
```

```javascript
// Time: O(n) | Space: O(1)
function countSpecialSubsequences(nums) {
  /**
   * Counts all special subsequences where:
   * - Positive number of 0s, then positive number of 1s, then positive number of 2s
   * - Order must be maintained but elements don't need to be contiguous
   */
  let count0 = 0; // subsequences ending with 0
  let count1 = 0; // subsequences ending with 1
  let count2 = 0; // subsequences ending with 2 (complete special sequences)

  const MOD = 1e9 + 7;

  for (const num of nums) {
    if (num === 0) {
      // For a new 0:
      // 1. Start new sequence with just this 0: +1
      // 2. Append to each existing 0-ending sequence: +count0
      // All existing 0-ending sequences remain valid
      // So: count0 = count0 + count0 + 1 = 2*count0 + 1
      count0 = (2 * count0 + 1) % MOD;
    } else if (num === 1) {
      // For a new 1:
      // 1. Append to 0-ending sequences: +count0
      // 2. Append to existing 1-ending sequences: +count1
      // All existing 1-ending sequences remain valid
      // So: count1 = count1 + count0 + count1 = 2*count1 + count0
      count1 = (2 * count1 + count0) % MOD;
    } else {
      // num === 2
      // For a new 2:
      // 1. Append to 1-ending sequences: +count1
      // 2. Append to existing complete sequences: +count2
      // All existing complete sequences remain valid
      // So: count2 = count2 + count1 + count2 = 2*count2 + count1
      count2 = (2 * count2 + count1) % MOD;
    }
  }

  return count2 % MOD;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countSpecialSubsequences(int[] nums) {
        /**
         * Counts all special subsequences where:
         * - Positive number of 0s, then positive number of 1s, then positive number of 2s
         * - Order must be maintained but elements don't need to be contiguous
         */
        long count0 = 0; // subsequences ending with 0
        long count1 = 0; // subsequences ending with 1
        long count2 = 0; // subsequences ending with 2 (complete special sequences)

        final int MOD = 1_000_000_007;

        for (int num : nums) {
            if (num == 0) {
                // For a new 0:
                // 1. Start new sequence with just this 0: +1
                // 2. Append to each existing 0-ending sequence: +count0
                // All existing 0-ending sequences remain valid
                // So: count0 = count0 + count0 + 1 = 2*count0 + 1
                count0 = (2 * count0 + 1) % MOD;
            } else if (num == 1) {
                // For a new 1:
                // 1. Append to 0-ending sequences: +count0
                // 2. Append to existing 1-ending sequences: +count1
                // All existing 1-ending sequences remain valid
                // So: count1 = count1 + count0 + count1 = 2*count1 + count0
                count1 = (2 * count1 + count0) % MOD;
            } else { // num == 2
                // For a new 2:
                // 1. Append to 1-ending sequences: +count1
                // 2. Append to existing complete sequences: +count2
                // All existing complete sequences remain valid
                // So: count2 = count2 + count1 + count2 = 2*count2 + count1
                count2 = (2 * count2 + count1) % MOD;
            }
        }

        return (int)(count2 % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element exactly once
- Each element requires only O(1) operations (simple arithmetic updates)
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only store three counters regardless of input size
- No additional data structures that grow with input
- The input array is given and not counted in our space usage

## Common Mistakes

1. **Forgetting about extending existing sequences**: When seeing a new 0, candidates might only add 1 for a new sequence, forgetting they can also append it to existing 0-ending sequences. The correct update is `count0 = 2*count0 + 1`, not `count0 = count0 + 1`.

2. **Wrong update order for count1 and count2**: The updates must use the **current** values of previous counters. For example, when updating `count1`, we need the current `count0` value (which might have just been updated if the previous element was 0). In our single-pass approach, this happens naturally.

3. **Not using modulo operations early**: With large n, the counts can grow exponentially and overflow even 64-bit integers. We need to apply modulo at each update, not just at the end. In Java, using `long` is essential before casting back to `int`.

4. **Misunderstanding "positive number"**: Each section must have at least one element. This is automatically handled because we only count sequences that actually have elements of each type. A sequence ending with 1 must have passed through count0 first, ensuring at least one 0.

## When You'll See This Pattern

This problem uses **sequential state-based dynamic programming**, a pattern that appears in many counting problems:

1. **Count Number of Ways to Build a String** (LeetCode 1639): Count how many ways to form target from words, maintaining order—similar state transitions.

2. **Decode Ways II** (LeetCode 639): Counting valid decodings with wildcards, using states based on previous characters.

3. **Student Attendance Record II** (LeetCode 552): Count valid attendance records using states for consecutive 'L's and whether 'A' has appeared.

The common theme is maintaining counters for different "states" of partial solutions and defining transitions between states based on new elements.

## Key Takeaways

1. **For counting ordered subsequences**, think in terms of states representing what valid prefix you've built so far. Each new element can transition between these states.

2. **The recurrence relation often has the form**: `new_state = old_state + ways_to_reach_this_state`. Break down: "All existing sequences of this type remain valid" plus "new sequences created by appending current element to previous states."

3. **When counts grow exponentially**, use modulo arithmetic at each step to prevent overflow. Track the mathematical pattern rather than enumerating sequences.

[Practice this problem on CodeJeet](/problem/count-number-of-special-subsequences)
