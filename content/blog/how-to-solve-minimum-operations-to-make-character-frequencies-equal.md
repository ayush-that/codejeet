---
title: "How to Solve Minimum Operations to Make Character Frequencies Equal — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Character Frequencies Equal. Hard difficulty, 26.4% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Counting, Enumeration."
date: "2026-09-05"
category: "dsa-patterns"
tags:
  [
    "minimum-operations-to-make-character-frequencies-equal",
    "hash-table",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Minimum Operations to Make Character Frequencies Equal

This problem asks us to transform a string so all characters appear the same number of times, using three operations: delete a character, insert a character, or change a character to its next letter. What makes this tricky is that we need to find the minimal number of operations to achieve equal frequencies, and we have three different types of operations with different costs (though in this problem, each operation counts as 1). The challenge lies in efficiently exploring the possible target frequencies we could aim for.

## Visual Walkthrough

Let's trace through an example: `s = "aaabbbcc"`

**Step 1: Count character frequencies**

- 'a': 3
- 'b': 3
- 'c': 2

**Step 2: Understand the operations**

1. Delete: Remove a character (cost 1)
2. Insert: Add a character (cost 1)
3. Change: Change a character to its next letter (cost 1)

**Step 3: Think about possible target frequencies**
We could aim for all characters to appear 2 times, 3 times, or even 1 time. Let's try target = 2:

Current: a=3, b=3, c=2

- For 'a' (3 → 2): Need to remove 1 'a' (1 operation)
- For 'b' (3 → 2): Need to remove 1 'b' (1 operation)
- For 'c' (2 → 2): Already correct (0 operations)
  Total: 2 operations

**Step 4: Try target = 3:**

- For 'a' (3 → 3): Already correct (0 operations)
- For 'b' (3 → 3): Already correct (0 operations)
- For 'c' (2 → 3): Need to add 1 'c' (1 operation)
  Total: 1 operation

**Step 5: Try target = 1:**

- For 'a' (3 → 1): Need to remove 2 'a's (2 operations)
- For 'b' (3 → 1): Need to remove 2 'b's (2 operations)
- For 'c' (2 → 1): Need to remove 1 'c' (1 operation)
  Total: 5 operations

The minimum is 1 operation (target = 3). But wait — we need to consider that changing a character might be cheaper than adding/removing in some cases!

**Step 6: Consider the "change" operation**
The change operation transforms a character to its next letter. This means if we have too many of one character, we could change some of them to become other characters we need more of.

For our example with target = 3:

- We need 1 more 'c'
- Instead of inserting a 'c' (cost 1), we could change one 'a' or 'b' to 'c'
- But changing 'a' to 'b' costs 1, and 'b' to 'c' costs 1 — same as insertion!

The key insight: We need to systematically check all reasonable target frequencies and calculate the minimum operations considering all three operation types.

## Brute Force Approach

A naive approach would be to try every possible target frequency from 1 up to the maximum frequency in the string. For each target, we'd calculate the operations needed for each character:

1. If current frequency > target: we need to remove (current - target) characters OR change them to other characters
2. If current frequency < target: we need to insert (target - current) characters OR change other characters to this one
3. If current frequency = target: no operations needed

The brute force would need to consider all combinations of which characters to change to which other characters, which becomes exponentially complex. Even a simpler version that only considers add/remove operations would be O(n × max_freq × k) where k is the number of unique characters, but it wouldn't account for the change operation properly.

A truly exhaustive brute force that considers all possible sequences of operations would be O(3^n) — completely infeasible.

## Optimized Approach

The key insight is that we can think about this as a flow problem:

1. **Count frequencies**: First, count how many times each character appears.
2. **Consider reasonable targets**: The target frequency must be between 1 and the length of the string, but more importantly, it should be achievable given our operations.
3. **Calculate operations efficiently**: For a given target frequency T:
   - For characters with frequency f > T: We have excess characters. We can either:
     - Delete (f - T) of them
     - Change some of them to help characters with f < T
   - For characters with frequency f < T: We need more of these. We can either:
     - Insert (T - f) new ones
     - Change excess characters from other types to this type

   The optimal strategy is to use change operations first (when possible) because one change can solve both an excess and a deficit simultaneously!

4. **Algorithm**:
   - Count frequencies of all 26 lowercase letters
   - For each possible target frequency T from 1 to n:
     - Calculate total excess = sum of max(0, f - T) for all frequencies
     - Calculate total deficit = sum of max(0, T - f) for all frequencies
     - The minimum operations = max(total excess, total deficit) because:
       - Each change operation reduces both excess and deficit by 1
       - After using all possible changes, we'll need to either delete remaining excess or insert for remaining deficit
       - So operations = max(excess, deficit)

5. **Optimization**: We only need to check T values that are divisors of the total operations or are close to the average frequency, but to be safe and since n ≤ 10^5, we can check all T from 1 to n.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + 26 * n) = O(n) | Space: O(26) = O(1)
def minOperations(s: str) -> int:
    """
    Calculate minimum operations to make all character frequencies equal.

    Approach:
    1. Count frequency of each lowercase letter
    2. For each possible target frequency (1 to len(s)):
       - Calculate total excess (characters we have too many of)
       - Calculate total deficit (characters we need more of)
       - Minimum operations = max(excess, deficit) because:
         * Each change fixes one excess AND one deficit simultaneously
         * Remaining excess requires deletion
         * Remaining deficit requires insertion
    3. Return the minimum operations across all targets
    """
    n = len(s)
    if n <= 1:
        return 0  # Already good if empty or single character

    # Step 1: Count frequencies of all 26 lowercase letters
    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    # Remove zero frequencies for efficiency
    non_zero_freq = [f for f in freq if f > 0]

    min_ops = float('inf')

    # Step 2: Try every possible target frequency
    # We check up to n because in worst case we might make all characters appear once
    for target in range(1, n + 1):
        excess = 0
        deficit = 0

        # Step 3: Calculate excess and deficit for this target
        for f in non_zero_freq:
            if f > target:
                excess += f - target  # Need to remove or change these
            elif f < target:
                deficit += target - f  # Need to insert or get via change

        # Step 4: Calculate operations needed
        # Each change operation fixes one excess AND one deficit
        # So after changes, we'll have max(excess, deficit) operations left
        # (either deletions for remaining excess or insertions for remaining deficit)
        ops = max(excess, deficit)

        # Update minimum
        if ops < min_ops:
            min_ops = ops

    return min_ops
```

```javascript
// Time: O(n + 26 * n) = O(n) | Space: O(26) = O(1)
/**
 * Calculate minimum operations to make all character frequencies equal.
 * @param {string} s - Input string
 * @return {number} Minimum operations needed
 */
function minOperations(s) {
  const n = s.length;
  if (n <= 1) return 0; // Already good if empty or single character

  // Step 1: Count frequencies of all 26 lowercase letters
  const freq = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    const idx = s.charCodeAt(i) - "a".charCodeAt(0);
    freq[idx]++;
  }

  // Filter out zero frequencies for efficiency
  const nonZeroFreq = freq.filter((f) => f > 0);

  let minOps = Infinity;

  // Step 2: Try every possible target frequency
  for (let target = 1; target <= n; target++) {
    let excess = 0;
    let deficit = 0;

    // Step 3: Calculate excess and deficit for this target
    for (const f of nonZeroFreq) {
      if (f > target) {
        excess += f - target; // Need to remove or change these
      } else if (f < target) {
        deficit += target - f; // Need to insert or get via change
      }
      // If f === target, no operations needed for this character
    }

    // Step 4: Calculate operations needed
    // Each change fixes one excess AND one deficit
    // After changes, we need max(excess, deficit) operations
    const ops = Math.max(excess, deficit);

    // Update minimum
    if (ops < minOps) {
      minOps = ops;
    }
  }

  return minOps;
}
```

```java
// Time: O(n + 26 * n) = O(n) | Space: O(26) = O(1)
class Solution {
    public int minOperations(String s) {
        int n = s.length();
        if (n <= 1) return 0;  // Already good if empty or single character

        // Step 1: Count frequencies of all 26 lowercase letters
        int[] freq = new int[26];
        for (int i = 0; i < n; i++) {
            freq[s.charAt(i) - 'a']++;
        }

        // Count non-zero frequencies for efficiency
        int nonZeroCount = 0;
        for (int f : freq) {
            if (f > 0) nonZeroCount++;
        }

        int[] nonZeroFreq = new int[nonZeroCount];
        int idx = 0;
        for (int f : freq) {
            if (f > 0) {
                nonZeroFreq[idx++] = f;
            }
        }

        int minOps = Integer.MAX_VALUE;

        // Step 2: Try every possible target frequency
        for (int target = 1; target <= n; target++) {
            int excess = 0;
            int deficit = 0;

            // Step 3: Calculate excess and deficit for this target
            for (int f : nonZeroFreq) {
                if (f > target) {
                    excess += f - target;  // Need to remove or change these
                } else if (f < target) {
                    deficit += target - f;  // Need to insert or get via change
                }
                // If f == target, no operations needed
            }

            // Step 4: Calculate operations needed
            // Each change fixes one excess AND one deficit
            // After changes, we need max(excess, deficit) operations
            int ops = Math.max(excess, deficit);

            // Update minimum
            if (ops < minOps) {
                minOps = ops;
            }
        }

        return minOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) where n is the length of the string
- Checking target frequencies: We check up to n targets, but for each target we only process the non-zero frequencies (at most 26). So this is O(26 × n) = O(n)
- Overall: O(n + 26n) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers for frequency counting
- The non-zero frequency list has at most 26 elements
- No other data structures scale with input size
- Overall: O(26) = O(1)

## Common Mistakes

1. **Forgetting to consider the change operation**: Some candidates only consider add/remove operations and miss that changing a character can solve both excess and deficit simultaneously. Remember: change is often more efficient than separate add/remove operations.

2. **Checking unnecessary target frequencies**: While checking all targets from 1 to n works, it's inefficient for large n. A better approach is to only check targets that are divisors of potential total operations or are close to the average frequency. However, with n ≤ 10^5, checking all is acceptable.

3. **Incorrect operation counting**: The formula `max(excess, deficit)` is key. Each change operation reduces both excess and deficit by 1, so after we've done all possible changes, we're left with either excess (requiring deletions) or deficit (requiring insertions) — whichever is larger determines the total operations.

4. **Not handling edge cases**: Empty string, single character string, or strings where all characters are the same. These should return 0 operations since they're already "good" strings.

## When You'll See This Pattern

This problem combines frequency counting with optimization search, a pattern seen in many string manipulation problems:

1. **Minimum Number of Steps to Make Two Strings Anagram**: Similar frequency counting and operation calculation, but with only one operation type (change).

2. **Minimum Deletions to Make Character Frequencies Unique**: Also works with character frequencies but focuses on making all frequencies unique rather than equal.

3. **Rearrange String k Distance Apart**: Uses frequency counting and greedy placement based on frequencies.

The core pattern is: when you need to transform a string based on character frequencies, first count the frequencies, then determine what transformation is needed, and finally calculate the minimal operations to achieve it.

## Key Takeaways

1. **Frequency counting is your first step**: For string transformation problems, always start by counting character frequencies. This gives you the data you need to reason about the problem.

2. **Think in terms of excess and deficit**: When trying to equalize frequencies, calculate what you have too much of (excess) and what you need more of (deficit). Changes can address both simultaneously.

3. **The change operation is powerful**: One change can fix two problems at once (reduce excess of one character and deficit of another). This is why the formula is `max(excess, deficit)` rather than `excess + deficit`.

4. **Check reasonable targets systematically**: Don't just guess target frequencies. Check a range of plausible values, understanding that the optimal target will often be near the average frequency.

Related problems: [Minimum Number of Steps to Make Two Strings Anagram](/problem/minimum-number-of-steps-to-make-two-strings-anagram)
