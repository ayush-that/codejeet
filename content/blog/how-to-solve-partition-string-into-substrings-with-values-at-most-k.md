---
title: "How to Solve Partition String Into Substrings With Values at Most K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition String Into Substrings With Values at Most K. Medium difficulty, 47.5% acceptance rate. Topics: String, Dynamic Programming, Greedy."
date: "2029-07-10"
category: "dsa-patterns"
tags:
  [
    "partition-string-into-substrings-with-values-at-most-k",
    "string",
    "dynamic-programming",
    "greedy",
    "medium",
  ]
---

# How to Solve "Partition String Into Substrings With Values at Most K"

This problem asks us to partition a numeric string into the minimum number of contiguous substrings where each substring's integer value is ≤ k. What makes this interesting is the tension between two competing goals: we want to make substrings as long as possible (to minimize count), but we can't let their values exceed k. The challenge comes from the fact that longer substrings have larger numeric values, and we need to find the optimal balance.

## Visual Walkthrough

Let's trace through `s = "165462"`, `k = 60`:

1. Start at index 0: "1" (1 ≤ 60) ✓  
   Can we extend? "16" (16 ≤ 60) ✓  
   "165" (165 > 60) ✗ → So first substring must be "16"

2. Move to index 2: "5" (5 ≤ 60) ✓  
   "54" (54 ≤ 60) ✓  
   "546" (546 > 60) ✗ → Second substring: "54"

3. Move to index 4: "6" (6 ≤ 60) ✓  
   "62" (62 > 60) ✗ → Third substring: "6"

4. Move to index 5: "2" (2 ≤ 60) ✓ → Fourth substring: "2"

Total partitions: 4

But wait — is this optimal? Let's check if we could do better by making different choices earlier:

What if at index 0 we took just "1" instead of "16"?  
Then: "1" | "6" (6) | "5" (5) | "4" (4) | "6" (6) | "2" (2) → 6 partitions (worse)

What if at index 2 we took just "5" instead of "54"?  
Then: "16" | "5" | "4" | "6" | "2" → 5 partitions (worse)

So our greedy approach of taking the longest valid substring at each step seems to work for this example. But will it always work? Consider `s = "123"`, `k = 23`:

Greedy: "12" | "3" → 2 partitions  
Optimal: "1" | "23" → 2 partitions (same)

What about `s = "123"`, `k = 12`?  
Greedy: "12" | "3" → 2 partitions  
Optimal: "1" | "2" | "3" → 3 partitions (greedy is better!)

Actually, the greedy approach of always taking the longest valid substring DOES work for this problem. Why? Because if you can extend a substring without exceeding k, you're reducing the total partition count. Any alternative that breaks earlier would only create more partitions.

## Brute Force Approach

A naive approach would be to try all possible partition points. For a string of length n, there are n-1 potential cut points between characters. We could generate all 2^(n-1) possible partitions, check if each substring ≤ k, and find the minimum valid partition count.

However, this is exponential time (O(2^n)), which is completely impractical for n up to 10^5 as in the problem constraints. Even for n=20, that's over 1 million possibilities.

What might a candidate try? Some might attempt backtracking with pruning:

- Start building a substring from current position
- When adding the next character would exceed k, cut here and recurse
- Keep track of minimum partitions found

While better than brute force, this could still be exponential in worst case (like when k is very large and all partitions are valid).

## Optimized Approach

The key insight is that this problem has **optimal substructure**: the minimum partitions for the whole string depends on the minimum partitions for prefixes of the string. This screams dynamic programming!

Let `dp[i]` = minimum partitions needed for first i characters (s[0:i]).

Transition: To compute `dp[i]`, look back at all possible previous cut points j where:

1. The substring s[j:i] has value ≤ k
2. `dp[j]` is valid (we could partition first j characters)

Then: `dp[i] = min(dp[j] + 1)` over all valid j

But checking all j from 0 to i-1 would be O(n²), which is still too slow for n=10^5.

Here's the optimization: we only need to look back as far as where the substring value would exceed k. Since numbers grow quickly as we add digits, we can't look back too far. In fact, the maximum lookback is limited by the number of digits in k!

Why? If k has d digits, then any valid substring must have ≤ d digits. If it has exactly d digits, it must be ≤ k numerically. So we only need to check up to d digits back.

Wait — that's not quite right. Consider k=1000 (4 digits). A substring like "9999" has 4 digits but value 9999 > 1000. So we need to check both length AND numeric value.

But here's the efficient approach: iterate through the string, maintaining the current substring value. When adding the next digit would make the value > k, we must cut before this digit. This gives us a greedy O(n) solution!

Proof of greedy correctness:

1. If we can extend the current substring without exceeding k, we should (reduces partition count)
2. If we can't extend, we must cut here
3. This local optimal choice leads to global optimum because any alternative would create more cuts earlier

## Optimal Solution

The greedy algorithm:

1. Initialize count = 1 (we need at least one partition)
2. Initialize current_value = 0
3. For each digit in s:
   - Convert digit to integer: digit_val
   - If current_value \* 10 + digit_val > k:
     - We must cut before this digit
     - Increment count
     - Reset current_value = digit_val
     - If digit_val > k: impossible (return -1)
   - Else:
     - current_value = current_value \* 10 + digit_val
4. Return count

Edge cases:

- Single digit > k → return -1
- Empty string? Not in constraints (s has at least 1 digit)
- Very large k? Works fine with 64-bit integers

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumPartition(s: str, k: int) -> int:
    """
    Partition string into minimum number of substrings ≤ k.
    Returns -1 if any single digit > k.
    """
    count = 1  # We need at least one partition
    current_value = 0

    for char in s:
        digit = int(char)

        # If even a single digit exceeds k, impossible
        if digit > k:
            return -1

        # Check if adding this digit would exceed k
        if current_value * 10 + digit > k:
            # Need to cut before this digit
            count += 1
            current_value = digit
        else:
            # Can extend current substring
            current_value = current_value * 10 + digit

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function minimumPartition(s, k) {
  let count = 1; // At least one partition needed
  let currentValue = 0;

  for (let i = 0; i < s.length; i++) {
    const digit = parseInt(s[i]);

    // Single digit exceeding k makes partition impossible
    if (digit > k) {
      return -1;
    }

    // Check if adding this digit would exceed k
    if (currentValue * 10 + digit > k) {
      // Must cut before this digit
      count++;
      currentValue = digit;
    } else {
      // Can extend current substring
      currentValue = currentValue * 10 + digit;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumPartition(String s, int k) {
        int count = 1;  // Minimum one partition needed
        long currentValue = 0;  // Use long to avoid overflow

        for (int i = 0; i < s.length(); i++) {
            int digit = s.charAt(i) - '0';

            // If a single digit exceeds k, impossible
            if (digit > k) {
                return -1;
            }

            // Check if adding this digit would exceed k
            if (currentValue * 10 + digit > k) {
                // Need to cut before this digit
                count++;
                currentValue = digit;
            } else {
                // Can extend current substring
                currentValue = currentValue * 10 + digit;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the string of length n, processing each character exactly once. Each operation is O(1): digit conversion, arithmetic comparison, and updates.

**Space Complexity:** O(1)  
We only use a few variables (count, current_value), regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Not checking single digits > k**: If a digit like '9' appears when k=5, we must return -1 immediately. Some candidates only check when forming multi-digit numbers.
2. **Integer overflow**: When k is large (up to 10^9), current_value \* 10 + digit could exceed 32-bit integer range. Use 64-bit integers (long in Java, no issue in Python).

3. **Off-by-one in counting**: Starting count at 0 instead of 1. Remember: if we never cut, we have 1 partition. Each cut adds 1 more partition.

4. **Overcomplicating with DP**: While DP would work, it's unnecessary and less efficient. The greedy solution is simpler and faster.

## When You'll See This Pattern

This "greedy partitioning with constraint" pattern appears in several problems:

1. **Partition Labels (LeetCode 763)**: Partition string into as many parts as possible so each letter appears in at most one part. Similar greedy approach of extending until you can't.

2. **Split a String Into the Max Number of Unique Substrings (LeetCode 1593)**: Different constraint (uniqueness), similar partitioning structure.

3. **Maximum Split of Positive Even Integers (LeetCode 2178)**: Split number into maximum number of distinct even integers. Greedy works by taking smallest possible next number.

The common theme: when you need to partition a sequence with some constraint, and taking the longest valid segment at each step leads to optimal solution, greedy is often the right approach.

## Key Takeaways

1. **Greedy can be optimal for partitioning problems** when extending the current segment never hurts future options. Always ask: "If I can extend without violating constraints, could doing so ever make the overall solution worse?"

2. **Watch for integer overflow** when building numeric values from strings. The constraints often push near language limits.

3. **Start with simple examples** to build intuition. Tracing through concrete cases helps identify whether greedy works and what edge cases to handle.

[Practice this problem on CodeJeet](/problem/partition-string-into-substrings-with-values-at-most-k)
