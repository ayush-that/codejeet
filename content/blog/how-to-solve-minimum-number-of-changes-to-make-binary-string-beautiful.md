---
title: "How to Solve Minimum Number of Changes to Make Binary String Beautiful — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Changes to Make Binary String Beautiful. Medium difficulty, 76.4% acceptance rate. Topics: String."
date: "2026-07-02"
category: "dsa-patterns"
tags: ["minimum-number-of-changes-to-make-binary-string-beautiful", "string", "medium"]
---

# How to Solve Minimum Number of Changes to Make Binary String Beautiful

This problem asks us to transform a binary string into a "beautiful" string with minimal changes. A string is beautiful if it can be partitioned into substrings of even length where each substring contains only 0's or only 1's. The tricky part is that we need to find the minimal number of character flips while ensuring all partitions have even length, which creates constraints on which characters can be grouped together.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider `s = "110001"` (length 6, which is even as required).

**Step 1: Understanding the constraints**
A beautiful string must be partitionable into substrings where:

1. Each substring has even length
2. Each substring is all 0's or all 1's

This means characters at positions 0 and 1 must be the same (they form the first 2-character substring), positions 2 and 3 must be the same, positions 4 and 5 must be the same, and so on.

**Step 2: Analyzing our example**
`s = "110001"`

- Positions: 0:1, 1:1, 2:0, 3:0, 4:0, 5:1
- Pairs: (0,1), (2,3), (4,5)

For each pair, both characters must be identical for the string to be beautiful without changes:

- Pair 1 (positions 0,1): Both are '1' ✓
- Pair 2 (positions 2,3): Both are '0' ✓
- Pair 3 (positions 4,5): '0' and '1' ✗

**Step 3: Counting required changes**
We need to make the third pair match. We can either:

- Change position 4 from '0' to '1' (1 change)
- Change position 5 from '1' to '0' (1 change)

Either way, we need exactly 1 change.

**Step 4: Another example**
Let's try `s = "101010"` (length 6):

- Pairs: (0,1): '1','0' ✗, (2,3): '1','0' ✗, (4,5): '1','0' ✗
- For each mismatched pair, we need 1 change
- Total changes needed: 3

The key insight: **For each pair of characters at positions (i, i+1), if they don't match, we need exactly 1 change to make them match.**

## Brute Force Approach

A naive approach might try all possible partitions and count changes for each, but this would be extremely inefficient. Let's think about what a brute force solution might look like:

1. Generate all possible ways to partition the string into substrings of even length
2. For each partition, count how many characters need to be changed to make each substring uniform (all 0's or all 1's)
3. Take the minimum across all partitions

The problem with this approach is the combinatorial explosion. For a string of length n, there are many possible partitions, and checking each one would be O(2^(n/2)) in the worst case, which is completely impractical for even moderately sized strings.

Even a simpler brute force that tries to decide for each pair whether to make it all 0's or all 1's would still need to consider 2^(n/2) possibilities, which is exponential time.

## Optimized Approach

The key insight that leads to an optimal solution is recognizing that **the partition is forced by the requirement of even-length substrings**. Since all substrings must have even length, we know exactly where the boundaries are: between each pair of characters.

Think about it this way: If we start at position 0, the first substring must end at an odd index (to have even length). The smallest even length is 2, so the first substring must be at least positions 0 and 1. But could it be longer? Yes, but if it's longer than 2, say length 4 (positions 0-3), then positions 0 and 1 must match (same substring), and positions 2 and 3 must match (same substring), but positions 1 and 2 could be different (different substrings).

However, there's a simpler way to think about this: **We can process the string in pairs of two characters**. For each pair (i, i+1):

- If the two characters are the same, no changes needed for this pair
- If they're different, we need exactly 1 change (change either character to match the other)

But wait, there's a subtlety: What if we have consecutive pairs like "01 01"? Changing the first pair to "00" and the second to "11" would require 2 changes, but maybe there's a better way?

Actually, let's think about the partition requirement more carefully. The string must be partitionable into substrings of even length containing only 0's or only 1's. This means:

1. The string length is even (given in the problem)
2. We can split it into groups of 2 characters where each group is either "00" or "11"

But that's exactly what we just described! Each pair (2-character group) must be uniform. We don't need to consider longer substrings because any longer even-length substring of uniform characters can be broken down into 2-character uniform substrings.

For example: "0000" can be broken into "00" and "00"
Similarly: "111111" can be broken into "11", "11", "11"

So the problem reduces to: **For each pair of characters at positions (2i, 2i+1), we need them to be identical. If they're not, we need 1 change.**

## Optimal Solution

The solution is straightforward once we understand the insight: Iterate through the string in steps of 2, and for each pair of characters, if they don't match, increment our change counter.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minChanges(s: str) -> int:
    """
    Calculate the minimum number of changes needed to make a binary string beautiful.

    A beautiful string can be partitioned into substrings of even length
    where each substring contains only 0's or only 1's.

    Args:
        s: Binary string with even length

    Returns:
        Minimum number of character changes needed
    """
    changes = 0

    # Iterate through the string in steps of 2
    # We check pairs: (0,1), (2,3), (4,5), ...
    for i in range(0, len(s), 2):
        # If the two characters in the current pair don't match,
        # we need to change one of them (either works, count as 1 change)
        if s[i] != s[i + 1]:
            changes += 1

    return changes
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate the minimum number of changes needed to make a binary string beautiful.
 *
 * A beautiful string can be partitioned into substrings of even length
 * where each substring contains only 0's or only 1's.
 *
 * @param {string} s - Binary string with even length
 * @return {number} Minimum number of character changes needed
 */
function minChanges(s) {
  let changes = 0;

  // Iterate through the string in steps of 2
  // We check pairs: (0,1), (2,3), (4,5), ...
  for (let i = 0; i < s.length; i += 2) {
    // If the two characters in the current pair don't match,
    // we need to change one of them (either works, count as 1 change)
    if (s[i] !== s[i + 1]) {
      changes++;
    }
  }

  return changes;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate the minimum number of changes needed to make a binary string beautiful.
     *
     * A beautiful string can be partitioned into substrings of even length
     * where each substring contains only 0's or only 1's.
     *
     * @param s Binary string with even length
     * @return Minimum number of character changes needed
     */
    public int minChanges(String s) {
        int changes = 0;

        // Iterate through the string in steps of 2
        // We check pairs: (0,1), (2,3), (4,5), ...
        for (int i = 0; i < s.length(); i += 2) {
            // If the two characters in the current pair don't match,
            // we need to change one of them (either works, count as 1 change)
            if (s.charAt(i) != s.charAt(i + 1)) {
                changes++;
            }
        }

        return changes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, processing it in steps of 2
- This means we perform n/2 iterations, each taking constant time
- O(n/2) simplifies to O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space (the `changes` counter)
- No additional data structures that grow with input size

## Common Mistakes

1. **Overcomplicating with dynamic programming**: Some candidates try to use DP to track the best partition, but this is unnecessary. The key insight is that the minimal partition is forced by the even-length requirement.

2. **Not understanding the pair constraint**: The most common mistake is not realizing that each adjacent pair (positions 2i and 2i+1) must be identical. Candidates might try to count all mismatches between adjacent characters, which would give wrong answers for patterns like "0101".

3. **Off-by-one errors in the loop**: When iterating in steps of 2, it's easy to go out of bounds if you don't handle the last pair correctly. However, since the string length is guaranteed to be even, `i + 1` will always be valid when `i < len(s)`.

4. **Trying to optimize further**: Some candidates might try to use a sliding window or other complex techniques, but the simple pair-checking approach is already optimal. Over-optimization can lead to bugs without providing any benefit.

## When You'll See This Pattern

This problem uses the **fixed partitioning pattern**, where constraints in the problem force a specific way to divide the input. Similar patterns appear in:

1. **Minimum Changes To Make Alternating Binary String (LeetCode 1758)**: Similar concept but with alternating characters instead of uniform pairs.

2. **Minimum Number of Swaps to Make the String Balanced (LeetCode 1963)**: Also processes the string in a specific way based on balancing constraints.

3. **Split a String in Balanced Strings (LeetCode 1221)**: Counts balanced partitions where the constraint determines natural split points.

The common thread is recognizing when problem constraints dictate a specific structure or partition, allowing you to avoid complex algorithms and use simple iteration instead.

## Key Takeaways

1. **Constraints dictate structure**: When a problem has specific constraints (like "even-length substrings"), look for how those constraints force a particular structure on the solution. Here, it forces us to consider pairs of characters.

2. **Simplify before coding**: Take time to understand what the constraints really mean. The beauty of this problem is that the "even-length, uniform substrings" constraint simplifies to "each pair of characters must be identical."

3. **Test with small examples**: The visual walkthrough with concrete examples like "110001" and "101010" helps reveal the pattern. Always test your reasoning with small cases before coding.

[Practice this problem on CodeJeet](/problem/minimum-number-of-changes-to-make-binary-string-beautiful)
