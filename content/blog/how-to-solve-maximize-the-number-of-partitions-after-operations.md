---
title: "How to Solve Maximize the Number of Partitions After Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize the Number of Partitions After Operations. Hard difficulty, 53.6% acceptance rate. Topics: String, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2028-06-09"
category: "dsa-patterns"
tags:
  [
    "maximize-the-number-of-partitions-after-operations",
    "string",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# Maximize the Number of Partitions After Operations

You're given a string `s` and an integer `k`. You can change at most one character to any lowercase letter, then repeatedly partition `s` by taking the longest prefix with at most `k` distinct characters. Your goal is to maximize the number of partitions after making that optional change. This problem is tricky because it combines greedy partitioning with a strategic character change, requiring careful state tracking across the string.

## Visual Walkthrough

Let's trace through `s = "aabac"`, `k = 2`:

**Without any change:**

1. First prefix: "aab" has distinct characters {a, b} (2 ≤ k). Next char 'a' would still give 2 distinct, but 'c' would make 3. So partition at "aab".
2. Remaining: "ac" has distinct characters {a, c} (2 ≤ k). End of string. Total partitions: 2.

**With one change at index 2 (0-based):**

1. Change 'b' to 'a': s becomes "aaaac"
2. First prefix: "aaaa" has only 'a' (1 ≤ k). Next char 'c' would make 2 distinct, still ≤ k. End of string reached. Total partitions: 1 (worse!).

**With change at index 4:**

1. Change 'c' to 'a': s becomes "aabaa"
2. First prefix: "aaba" has {a, b} (2 ≤ k). Next 'a' would still be 2. End reached. Total partitions: 1.

**With change at index 3:**

1. Change 'a' to 'b': s becomes "aabbc"
2. First prefix: "aabb" has {a, b} (2 ≤ k). Next 'c' would make 3. Partition at "aabb".
3. Remaining: "c" has {c} (1 ≤ k). End reached. Total partitions: 2 (same as no change).

Wait — can we do better? Let's think strategically. The greedy partitioning takes the longest possible prefix each time. To maximize partitions, we want each partition to be as short as possible while still having ≤ k distinct chars. Changing a character can help by either:

1. Breaking a long prefix into two shorter ones
2. Preventing a character from appearing later where it would extend a prefix

For `"aabac"`, `k=2`:

- Without change: partitions are "aab" and "ac"
- If we change index 2 ('b') to 'c': s = "aaacc"
- First prefix: "aa" has only 'a'. Next 'a' still fine. Next 'c' would make {a,c} (2). Next 'c' still fine. End reached. Only 1 partition — worse!

Actually, the optimal might be changing index 1 ('a') to 'c': s = "acbac"

- First prefix: "ac" has {a,c} (2). Next 'b' would make 3. Partition at "ac".
- Remaining: "bac" has {b,a,c} (3 > k). Wait, this fails!

Let's approach systematically: We need to consider all possible changes and simulate partitioning. This brute force is O(n²) — too slow for n up to 1000. We need a smarter approach.

## Brute Force Approach

The brute force solution tries every possible change (n positions × 26 letters) and for each, simulates the greedy partitioning:

1. For each index i (0 to n-1) and each new character c (a-z)
2. Create modified string s'
3. Greedily partition s':
   - Start new partition with empty set
   - Add characters until distinct count > k
   - Count partition, reset, continue
4. Track maximum partitions

This is O(26 × n²) since each partitioning is O(n). For n=1000, that's ~26 million operations — borderline but might pass in some languages. However, the problem constraints likely expect better.

The key insight: We don't need to actually modify the string and re-scan. We can use dynamic programming with state tracking.

## Optimized Approach

Think about the greedy partitioning process: We walk through the string, maintaining the set of distinct characters in the current partition. When adding the next character would exceed k distinct characters, we end the current partition and start a new one.

With the option to change one character, we have an additional decision: use the change now or save it for later? And if we use it, what character do we change to?

This is a classic DP problem with state:

- Current position in string
- Whether we've used our change (0 or 1)
- The current mask of distinct characters in the partition

Wait — tracking the actual characters is expensive. But since there are only 26 lowercase letters, we can use a bitmask! Each bit represents whether a character is present in the current partition.

**DP State:** `dp[i][used][mask]` = maximum partitions starting from position i, having used (or not) the change, with current partition containing characters represented by mask.

**Transition:**

1. If we can add s[i] to current partition (bit already set or adding it won't exceed k):
   - Continue with same partition
2. If we can't add s[i] (mask full and s[i] not in mask):
   - Start new partition at i
   - Increment partition count
3. If we haven't used change:
   - We can change s[i] to any of 26 letters
   - Choose the best outcome

But there's a problem: The greedy algorithm always takes the LONGEST prefix. So if we can extend the current partition, we MUST extend it — we don't have a choice to end early. This means our DP doesn't need to track "maximum partitions" but rather just simulate the greedy process with memoization.

Actually, we can think recursively:

- At position i, with mask m, used u:
  1. If i == n: return 0 (no more partitions)
  2. Let c = s[i]
  3. If c is in m OR popcount(m) < k:
     - Add c to m, continue to i+1 (same partition)
  4. Else if popcount(m) == k and c not in m:
     - We must end current partition here
     - Return 1 + solve(i, 0, u) [start new empty partition at i]
  5. If we haven't used change (u == 0):
     - Try changing s[i] to each letter
     - Take best result

We need memoization because from position i with same (mask, used) we'll get same result.

## Optimal Solution

The optimal solution uses DFS with memoization. The key is recognizing that:

1. We must follow greedy partitioning (take longest possible prefix)
2. The change can be used to either:
   - Add a character that's already in the current mask (allowing extension)
   - Replace with a character that reduces future partition lengths

We implement a recursive function that returns the number of partitions starting from position i with current mask and change usage status.

<div class="code-group">

```python
# Time: O(n * 2^26 * 26) but practically much faster due to constraints
# Space: O(n * 2^26) for memoization
class Solution:
    def maxPartitionsAfterOperations(self, s: str, k: int) -> int:
        n = len(s)

        # Memoization dictionary: (index, mask, used_change) -> max_partitions
        memo = {}

        def dfs(i: int, mask: int, used: int) -> int:
            # Base case: reached end of string
            if i == n:
                return 0

            # Check memo
            key = (i, mask, used)
            if key in memo:
                return memo[key]

            # Convert current character to bit position
            char_bit = 1 << (ord(s[i]) - ord('a'))

            # Case 1: Current character is already in mask OR we have room for more distinct chars
            if (mask & char_bit) or bin(mask).count('1') < k:
                # Can add current char to current partition
                new_mask = mask | char_bit
                # Continue with same partition
                result = dfs(i + 1, new_mask, used)
            else:
                # Cannot add current char - must end current partition here
                # Start new partition at current position with empty mask
                result = 1 + dfs(i, 0, used)

            # Case 2: If we haven't used the change yet, try using it
            if not used:
                # Try changing current character to every possible letter
                for new_char in range(26):
                    new_char_bit = 1 << new_char

                    # If the new character is same as original, we already handled it
                    if new_char_bit == char_bit:
                        continue

                    # Check if we can add the new character to current partition
                    if (mask & new_char_bit) or bin(mask).count('1') < k:
                        new_mask = mask | new_char_bit
                        # Changed character and added to current partition
                        result = max(result, dfs(i + 1, new_mask, 1))
                    else:
                        # Cannot add even after change - must end partition
                        result = max(result, 1 + dfs(i, 0, 1))

            memo[key] = result
            return result

        # Start from index 0, empty mask, haven't used change
        # Add 1 because we count the last partition
        return 1 + dfs(0, 0, 0)
```

```javascript
// Time: O(n * 2^26 * 26) but practically much faster
// Space: O(n * 2^26) for memoization
var maxPartitionsAfterOperations = function (s, k) {
  const n = s.length;
  const memo = new Map();

  // Helper to count bits in mask
  const countBits = (mask) => {
    let count = 0;
    while (mask) {
      count += mask & 1;
      mask >>= 1;
    }
    return count;
  };

  const dfs = (i, mask, used) => {
    // Base case
    if (i === n) return 0;

    // Check memo
    const key = `${i},${mask},${used}`;
    if (memo.has(key)) return memo.get(key);

    const charBit = 1 << (s.charCodeAt(i) - 97); // 'a' is 97

    let result;

    // Case 1: Can add current char to current partition
    if (mask & charBit || countBits(mask) < k) {
      const newMask = mask | charBit;
      result = dfs(i + 1, newMask, used);
    } else {
      // Must end current partition
      result = 1 + dfs(i, 0, used);
    }

    // Case 2: Try using the change if available
    if (!used) {
      for (let newChar = 0; newChar < 26; newChar++) {
        const newCharBit = 1 << newChar;

        // Skip if same as original
        if (newCharBit === charBit) continue;

        if (mask & newCharBit || countBits(mask) < k) {
          const newMask = mask | newCharBit;
          result = Math.max(result, dfs(i + 1, newMask, 1));
        } else {
          result = Math.max(result, 1 + dfs(i, 0, 1));
        }
      }
    }

    memo.set(key, result);
    return result;
  };

  // Start with empty mask, haven't used change
  // Add 1 for the first partition
  return 1 + dfs(0, 0, 0);
};
```

```java
// Time: O(n * 2^26 * 26) but practically much faster
// Space: O(n * 2^26) for memoization
class Solution {
    private Map<String, Integer> memo = new HashMap<>();
    private String s;
    private int k;

    public int maxPartitionsAfterOperations(String s, int k) {
        this.s = s;
        this.k = k;
        // Start from index 0, empty mask, haven't used change
        // Add 1 for the first partition
        return 1 + dfs(0, 0, 0);
    }

    private int dfs(int i, int mask, int used) {
        // Base case: end of string
        if (i == s.length()) return 0;

        // Check memo
        String key = i + "," + mask + "," + used;
        if (memo.containsKey(key)) return memo.get(key);

        char currentChar = s.charAt(i);
        int charBit = 1 << (currentChar - 'a');

        int result;

        // Case 1: Can add current char to current partition
        if ((mask & charBit) != 0 || Integer.bitCount(mask) < k) {
            int newMask = mask | charBit;
            result = dfs(i + 1, newMask, used);
        } else {
            // Must end current partition
            result = 1 + dfs(i, 0, used);
        }

        // Case 2: Try using the change if available
        if (used == 0) {
            for (int newChar = 0; newChar < 26; newChar++) {
                int newCharBit = 1 << newChar;

                // Skip if same as original
                if (newCharBit == charBit) continue;

                if ((mask & newCharBit) != 0 || Integer.bitCount(mask) < k) {
                    int newMask = mask | newCharBit;
                    result = Math.max(result, dfs(i + 1, newMask, 1));
                } else {
                    result = Math.max(result, 1 + dfs(i, 0, 1));
                }
            }
        }

        memo.put(key, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 2^26 × 26) in worst case, but practically much faster because:

1. The mask has only 26 bits, so 2^26 possible masks (67 million) is the theoretical maximum state space
2. However, we only visit reachable states, and with k ≤ 26, the number of masks with ≤ k bits set is much smaller
3. For each state, we try up to 26 possible character changes (only when change not used yet)
4. In practice, with n ≤ 1000 and k small, this runs efficiently

**Space Complexity:** O(n × M) where M is number of reachable mask states. We memoize results for each (i, mask, used) combination. In worst case, this could be n × 2^26, but again, reachable states are fewer.

## Common Mistakes

1. **Not following greedy requirement:** Some candidates try to end partitions early to get more partitions, but the problem requires taking the LONGEST possible prefix each time. The greedy nature is a constraint, not an optimization choice.

2. **Incorrect bitmask handling:** Forgetting to check if a character is already in the mask before counting distinct characters. Always check `(mask & bit) != 0` before assuming it adds a new distinct character.

3. **Missing the +1 for final partition:** The recursive function returns the number of additional partitions from current state. You need to add 1 for the initial partition when starting from index 0.

4. **Not considering all change possibilities:** When using the change, you must try changing to ALL 26 letters, not just ones that seem "helpful." Sometimes changing to a character that's already in the mask is optimal.

## When You'll See This Pattern

This problem combines several patterns:

1. **Bitmask DP with character sets:** When you need to track subsets of a small alphabet (≤ 26 or ≤ 52 for uppercase+lowercase). Similar problems:
   - "Find the Longest Awesome Substring" (LeetCode 1542) - uses bitmask to track character parity
   - "Maximum Number of Vowels in a Substring of Given Length" (LeetCode 1456) - simpler but similar sliding window with character tracking

2. **Greedy partitioning with constraints:** Problems where you must partition according to some rule and can make limited modifications:
   - "Partition Labels" (LeetCode 763) - simpler greedy partitioning
   - "Minimum Deletions to Make String Balanced" (LeetCode 1653) - modifying string to meet constraints

3. **DFS with memoization on string positions:** Common in "choice" problems where you have decisions at each step:
   - "Decode Ways II" (LeetCode 639) - decoding with wildcards
   - "Student Attendance Record II" (LeetCode 552) - tracking state over positions

## Key Takeaways

1. **Bitmask for small alphabets:** When dealing with lowercase/uppercase English letters (26/52 possibilities), bitmasks are efficient for tracking character presence or parity.

2. **Greedy constraints simplify DP:** When the greedy choice is forced (must take longest prefix), your DP doesn't need to consider ending partitions early — only when forced to by the distinct character limit.

3. **Change/operation as DP state:** When allowed a limited number of operations (changes, deletions, etc.), add a dimension to your DP state tracking how many operations used so far.

Related problems: [Can Make Palindrome from Substring](/problem/can-make-palindrome-from-substring)
