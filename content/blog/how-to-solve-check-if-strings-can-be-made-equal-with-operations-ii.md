---
title: "How to Solve Check if Strings Can be Made Equal With Operations II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if Strings Can be Made Equal With Operations II. Medium difficulty, 56.1% acceptance rate. Topics: Hash Table, String, Sorting."
date: "2029-04-13"
category: "dsa-patterns"
tags:
  [
    "check-if-strings-can-be-made-equal-with-operations-ii",
    "hash-table",
    "string",
    "sorting",
    "medium",
  ]
---

# How to Solve "Check if Strings Can be Made Equal With Operations II"

This problem asks whether two strings can be made equal through operations that allow swapping characters at positions with even index differences. The tricky part is understanding what these operations actually allow us to do - they don't let us move characters arbitrarily, but they create two independent groups of positions that can be rearranged internally.

## Visual Walkthrough

Let's trace through an example: `s1 = "abcd"`, `s2 = "cdab"`

**Step 1: Understanding the operation**
We can choose indices `i` and `j` where `j - i` is even. This means:

- Positions 0 and 2 can swap (difference 2, even)
- Positions 1 and 3 can swap (difference 2, even)
- Positions 0 and 4 can swap (difference 4, even), etc.

**Step 2: Grouping positions by parity**
The key insight: if `j - i` is even, then `i` and `j` have the same parity (both even or both odd). This creates two independent groups:

- Even indices: positions 0, 2, 4, 6...
- Odd indices: positions 1, 3, 5, 7...

**Step 3: Analyzing our example**
For `s1 = "abcd"`:

- Even positions (0, 2): 'a', 'c'
- Odd positions (1, 3): 'b', 'd'

For `s2 = "cdab"`:

- Even positions (0, 2): 'c', 'a'
- Odd positions (1, 3): 'd', 'b'

**Step 4: Checking if rearrangement is possible**
Within each group, we can rearrange characters freely (through multiple swaps). So we just need to check if:

1. The multiset of characters at even positions in `s1` equals the multiset at even positions in `s2`
2. The multiset of characters at odd positions in `s1` equals the multiset at odd positions in `s2`

In our example:

- Even groups: {'a', 'c'} in both strings ✓
- Odd groups: {'b', 'd'} in both strings ✓

Therefore, `s1` can be transformed into `s2`.

## Brute Force Approach

A naive approach would try to simulate all possible sequences of operations, but this is computationally infeasible. Even if we tried to brute force check all possible rearrangements within constraints, we'd need to:

1. Generate all possible strings reachable from `s1` using the allowed operations
2. Check if `s2` is among them

The problem is the state space grows factorially with string length. For a string of length `n`, the even and odd groups each have about `n/2` positions, giving us `(n/2)! × (n/2)!` possible arrangements. For `n=10`, that's `5! × 5! = 120 × 120 = 14,400` possibilities to check. For `n=20`, it's over 1.4 billion possibilities.

This exponential growth makes brute force completely impractical for the constraints (strings up to length 10^5 in some test cases).

## Optimized Approach

The key insight is recognizing that operations with even index differences create two independent permutation groups:

1. **Even-indexed positions** can be rearranged among themselves
2. **Odd-indexed positions** can be rearranged among themselves

However, characters can NEVER move between even and odd positions because any swap operation requires indices with the same parity.

Therefore, the solution reduces to:

1. Separate characters into even and odd position groups for both strings
2. Sort each group (or use frequency counting) to compare if they contain the same multiset of characters
3. If both even groups match AND both odd groups match, return `true`

We can optimize further by using frequency counting instead of sorting:

- Count character frequencies for even positions in `s1` and `s2`
- Count character frequencies for odd positions in `s1` and `s2`
- Compare if the frequency maps are identical for both parity groups

This gives us O(n) time complexity instead of O(n log n) from sorting.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of strings
# Space: O(1) since we only store 26 counters for each parity (constant space)
def checkStrings(s1: str, s2: str) -> bool:
    """
    Check if s1 can be transformed into s2 using operations that swap
    characters at positions with even index differences.

    The key insight: characters at even indices can only move to other
    even indices, and characters at odd indices can only move to other
    odd indices. So we just need to check if the character multisets
    match for each parity group separately.
    """
    n = len(s1)

    # Frequency counters for even and odd positions
    # We use two arrays of size 26 (one for each letter a-z)
    even_freq_s1 = [0] * 26
    odd_freq_s1 = [0] * 26
    even_freq_s2 = [0] * 26
    odd_freq_s2 = [0] * 26

    # Count frequencies for each position based on parity
    for i in range(n):
        # Convert character to index (0-25)
        char_idx = ord(s1[i]) - ord('a')

        if i % 2 == 0:  # Even index
            even_freq_s1[char_idx] += 1
        else:  # Odd index
            odd_freq_s1[char_idx] += 1

        # Do the same for s2
        char_idx = ord(s2[i]) - ord('a')

        if i % 2 == 0:  # Even index
            even_freq_s2[char_idx] += 1
        else:  # Odd index
            odd_freq_s2[char_idx] += 1

    # Check if frequency arrays match for both parity groups
    # We need both even and odd groups to match
    return even_freq_s1 == even_freq_s2 and odd_freq_s1 == odd_freq_s2
```

```javascript
// Time: O(n) where n is the length of strings
// Space: O(1) since we only store 26 counters for each parity (constant space)
function checkStrings(s1, s2) {
  /**
   * Check if s1 can be transformed into s2 using operations that swap
   * characters at positions with even index differences.
   *
   * The key insight: characters at even indices can only move to other
   * even indices, and characters at odd indices can only move to other
   * odd indices. So we just need to check if the character multisets
   * match for each parity group separately.
   */
  const n = s1.length;

  // Frequency counters for even and odd positions
  // We use arrays of size 26 (one for each letter a-z)
  const evenFreqS1 = new Array(26).fill(0);
  const oddFreqS1 = new Array(26).fill(0);
  const evenFreqS2 = new Array(26).fill(0);
  const oddFreqS2 = new Array(26).fill(0);

  // Count frequencies for each position based on parity
  for (let i = 0; i < n; i++) {
    // Convert character to index (0-25)
    const charIdx1 = s1.charCodeAt(i) - "a".charCodeAt(0);

    if (i % 2 === 0) {
      // Even index
      evenFreqS1[charIdx1]++;
    } else {
      // Odd index
      oddFreqS1[charIdx1]++;
    }

    // Do the same for s2
    const charIdx2 = s2.charCodeAt(i) - "a".charCodeAt(0);

    if (i % 2 === 0) {
      // Even index
      evenFreqS2[charIdx2]++;
    } else {
      // Odd index
      oddFreqS2[charIdx2]++;
    }
  }

  // Check if frequency arrays match for both parity groups
  // We need both even and odd groups to match
  for (let i = 0; i < 26; i++) {
    if (evenFreqS1[i] !== evenFreqS2[i] || oddFreqS1[i] !== oddFreqS2[i]) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) where n is the length of strings
// Space: O(1) since we only store 26 counters for each parity (constant space)
class Solution {
    public boolean checkStrings(String s1, String s2) {
        /**
         * Check if s1 can be transformed into s2 using operations that swap
         * characters at positions with even index differences.
         *
         * The key insight: characters at even indices can only move to other
         * even indices, and characters at odd indices can only move to other
         * odd indices. So we just need to check if the character multisets
         * match for each parity group separately.
         */
        int n = s1.length();

        // Frequency counters for even and odd positions
        // We use arrays of size 26 (one for each letter a-z)
        int[] evenFreqS1 = new int[26];
        int[] oddFreqS1 = new int[26];
        int[] evenFreqS2 = new int[26];
        int[] oddFreqS2 = new int[26];

        // Count frequencies for each position based on parity
        for (int i = 0; i < n; i++) {
            // Convert character to index (0-25)
            int charIdx1 = s1.charAt(i) - 'a';

            if (i % 2 == 0) {  // Even index
                evenFreqS1[charIdx1]++;
            } else {  // Odd index
                oddFreqS1[charIdx1]++;
            }

            // Do the same for s2
            int charIdx2 = s2.charAt(i) - 'a';

            if (i % 2 == 0) {  // Even index
                evenFreqS2[charIdx2]++;
            } else {  // Odd index
                oddFreqS2[charIdx2]++;
            }
        }

        // Check if frequency arrays match for both parity groups
        // We need both even and odd groups to match
        for (int i = 0; i < 26; i++) {
            if (evenFreqS1[i] != evenFreqS2[i] || oddFreqS1[i] != oddFreqS2[i]) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through both strings once to count character frequencies: O(n)
- We compare the frequency arrays (26 elements each): O(1)
- Total: O(n) + O(1) = O(n)

**Space Complexity: O(1)**

- We use four arrays of size 26 (for 'a' to 'z'): 4 × 26 = 104 integers
- This is constant space regardless of input size
- Even if we used sorting instead of frequency counting, we'd need O(n) space to store the separated character groups

## Common Mistakes

1. **Mixing up parity logic**: Some candidates incorrectly think characters can move between even and odd positions. Remember: if `j - i` is even, then `i` and `j` must have the same parity (both even or both odd).

2. **Forgetting to check both groups**: It's not enough to check if the overall character counts match. You must verify that even-position characters match AND odd-position characters match separately. Example: `s1 = "ab"`, `s2 = "ba"` - overall counts match but positions don't.

3. **Inefficient comparison**: Sorting each parity group takes O(n log n) time, which works but is less optimal than frequency counting. For large inputs, this could matter.

4. **Off-by-one errors with indexing**: When separating characters by parity, remember that array indices typically start at 0, so position 0 is even, position 1 is odd, etc. The modulo operation `i % 2` correctly identifies parity.

## When You'll See This Pattern

This problem uses the **"invariant analysis"** pattern - identifying properties that remain unchanged despite allowed operations. Similar problems include:

1. **LeetCode 1502: Can Make Arithmetic Progression From Sequence** - After sorting, check if differences are equal. The invariant is that sorted order reveals the arithmetic structure.

2. **LeetCode 2171: Removing Minimum Number of Magic Beans** - The key insight is that after operations, all non-zero piles should be equal. This requires analyzing what's invariant versus what can change.

3. **LeetCode 2337: Move Pieces to Obtain a String** - Characters '\_' can move freely but 'L' and 'R' have movement restrictions, creating an invariant in their relative order.

The common thread is identifying what CAN change versus what MUST remain the same given the allowed operations.

## Key Takeaways

1. **Look for invariants**: When a problem allows certain operations, ask: "What properties remain unchanged no matter how many operations I perform?" Here, the parity grouping is invariant.

2. **Group by constraints**: When movement is restricted between certain positions, separate elements into groups that can interact with each other. Each group can be rearranged internally but not with other groups.

3. **Frequency counting beats sorting for equality checks**: When comparing if two collections contain the same elements, frequency counting (O(n)) is often more efficient than sorting (O(n log n)), especially when the alphabet size is constant.

[Practice this problem on CodeJeet](/problem/check-if-strings-can-be-made-equal-with-operations-ii)
