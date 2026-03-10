---
title: "How to Solve Minimum Substring Partition of Equal Character Frequency — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Substring Partition of Equal Character Frequency. Medium difficulty, 40.0% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Counting."
date: "2030-01-01"
category: "dsa-patterns"
tags:
  [
    "minimum-substring-partition-of-equal-character-frequency",
    "hash-table",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Minimum Substring Partition of Equal Character Frequency

This problem asks us to partition a string into the minimum number of substrings where each substring is "balanced" — meaning every character that appears in that substring appears the same number of times. For example, in "aabb", both 'a' and 'b' appear twice, so it's balanced. What makes this problem tricky is that we need to find the optimal way to cut the string while ensuring every resulting piece satisfies this frequency equality condition.

## Visual Walkthrough

Let's trace through `s = "ababcc"` to build intuition. We want to find the minimum cuts to partition into balanced substrings.

**Step 1:** Start at index 0. We'll expand a window and check if each substring is balanced:

- `"a"`: Only 'a' appears once → balanced
- `"ab"`: 'a' appears once, 'b' appears once → balanced
- `"aba"`: 'a' appears twice, 'b' appears once → NOT balanced
- `"abab"`: 'a' appears twice, 'b' appears twice → balanced
- `"ababc"`: 'a' appears twice, 'b' appears twice, 'c' appears once → NOT balanced
- `"ababcc"`: 'a' appears twice, 'b' appears twice, 'c' appears twice → balanced

So from index 0, we could end substrings at indices 0, 1, 3, or 5.

**Step 2:** Think about optimal partitioning. If we take `"abab"` (ending at index 3), we then need to partition `"cc"` starting at index 4. `"cc"` is balanced (both 'c's appear twice), so that gives us 2 total substrings.

**Step 3:** But could we do better? If we take `"ababcc"` as one substring (ending at index 5), that's just 1 substring total. So the minimum is 1.

The challenge is we need to systematically explore all possible partitions to find the minimum. This suggests dynamic programming: let `dp[i]` be the minimum number of partitions needed for the substring `s[0:i]` (first i characters).

## Brute Force Approach

A naive approach would be to generate all possible partitions and check each one. For a string of length n, there are 2^(n-1) possible ways to cut between characters (each gap can be cut or not). For each partition, we'd need to check if every substring is balanced, which takes O(n) per substring.

This gives us O(2^n × n) time complexity, which is far too slow for n up to 1000 (as typical in LeetCode constraints). Even for n=20, 2^20 ≈ 1 million operations is borderline.

The brute force teaches us that we need to avoid exponential exploration. We notice that whether a substring is balanced depends only on the substring itself, not on how we partitioned earlier parts. This optimal substructure property suggests dynamic programming could help.

## Optimized Approach

The key insight is that we can use dynamic programming where `dp[i]` represents the minimum number of balanced substrings needed for the prefix `s[0:i]` (first i characters).

**Transition:** To compute `dp[i]`, we look at all possible ending points `j` (where `j < i`) for the last substring. If `s[j:i]` is balanced, then `dp[i] = min(dp[i], dp[j] + 1)`.

**Base case:** `dp[0] = 0` (empty string needs 0 partitions).

**Checking if a substring is balanced:** For any substring `s[j:i]`, we need to check if all characters that appear in it have the same frequency. We can:

1. Count frequencies of each character in the substring
2. Find the first non-zero frequency as reference
3. Check if all other non-zero frequencies equal this reference

However, checking each substring from scratch would be O(26 × n²) since there are O(n²) substrings and each check takes O(26) for lowercase English letters. With n up to 1000, n² = 1,000,000 operations is acceptable.

**Optimization:** We can precompute character frequencies using prefix sums. For each character c (a-z), maintain `prefix[c][i]` = count of c in `s[0:i]`. Then frequency of c in `s[j:i]` = `prefix[c][i] - prefix[c][j]`. This lets us check balance in O(26) time without recounting.

**Final answer:** `dp[n]` gives the minimum partitions for the entire string.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 * 26) where n = len(s), 26 for lowercase letters
# Space: O(n * 26) for prefix sums and O(n) for dp array
def minimumSubstringsInPartition(self, s: str) -> int:
    n = len(s)

    # Step 1: Build prefix sum array for 26 lowercase letters
    # prefix[c][i] = count of character c in s[0:i] (first i characters)
    prefix = [[0] * (n + 1) for _ in range(26)]

    for i in range(1, n + 1):
        # Copy previous counts
        for c in range(26):
            prefix[c][i] = prefix[c][i - 1]

        # Increment count for current character
        char_idx = ord(s[i - 1]) - ord('a')
        prefix[char_idx][i] += 1

    # Step 2: DP array where dp[i] = min partitions for s[0:i]
    # Initialize with large value, dp[0] = 0 for empty string
    dp = [float('inf')] * (n + 1)
    dp[0] = 0

    # Step 3: Fill DP table
    for i in range(1, n + 1):
        # Try all possible starting points j for the last substring
        for j in range(i):
            # Check if substring s[j:i] is balanced

            # Get frequency of first character in substring as reference
            ref_freq = None
            is_balanced = True

            # Check all 26 characters
            for c in range(26):
                freq = prefix[c][i] - prefix[c][j]
                if freq > 0:  # Character appears in this substring
                    if ref_freq is None:
                        ref_freq = freq  # Set reference frequency
                    elif freq != ref_freq:
                        is_balanced = False
                        break

            # If substring is balanced, update dp[i]
            if is_balanced:
                dp[i] = min(dp[i], dp[j] + 1)

    return dp[n]
```

```javascript
// Time: O(n^2 * 26) where n = s.length, 26 for lowercase letters
// Space: O(n * 26) for prefix sums and O(n) for dp array
function minimumSubstringsInPartition(s) {
  const n = s.length;

  // Step 1: Build prefix sum array for 26 lowercase letters
  // prefix[c][i] = count of character c in s[0:i] (first i characters)
  const prefix = Array.from({ length: 26 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    // Copy previous counts
    for (let c = 0; c < 26; c++) {
      prefix[c][i] = prefix[c][i - 1];
    }

    // Increment count for current character
    const charIdx = s.charCodeAt(i - 1) - "a".charCodeAt(0);
    prefix[charIdx][i]++;
  }

  // Step 2: DP array where dp[i] = min partitions for s[0:i]
  // Initialize with Infinity, dp[0] = 0 for empty string
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  // Step 3: Fill DP table
  for (let i = 1; i <= n; i++) {
    // Try all possible starting points j for the last substring
    for (let j = 0; j < i; j++) {
      // Check if substring s[j:i] is balanced

      // Get frequency of first character in substring as reference
      let refFreq = null;
      let isBalanced = true;

      // Check all 26 characters
      for (let c = 0; c < 26; c++) {
        const freq = prefix[c][i] - prefix[c][j];
        if (freq > 0) {
          // Character appears in this substring
          if (refFreq === null) {
            refFreq = freq; // Set reference frequency
          } else if (freq !== refFreq) {
            isBalanced = false;
            break;
          }
        }
      }

      // If substring is balanced, update dp[i]
      if (isBalanced) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }

  return dp[n];
}
```

```java
// Time: O(n^2 * 26) where n = s.length(), 26 for lowercase letters
// Space: O(n * 26) for prefix sums and O(n) for dp array
public int minimumSubstringsInPartition(String s) {
    int n = s.length();

    // Step 1: Build prefix sum array for 26 lowercase letters
    // prefix[c][i] = count of character c in s[0:i] (first i characters)
    int[][] prefix = new int[26][n + 1];

    for (int i = 1; i <= n; i++) {
        // Copy previous counts
        for (int c = 0; c < 26; c++) {
            prefix[c][i] = prefix[c][i - 1];
        }

        // Increment count for current character
        int charIdx = s.charAt(i - 1) - 'a';
        prefix[charIdx][i]++;
    }

    // Step 2: DP array where dp[i] = min partitions for s[0:i]
    // Initialize with large value, dp[0] = 0 for empty string
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = Integer.MAX_VALUE;
    }
    dp[0] = 0;

    // Step 3: Fill DP table
    for (int i = 1; i <= n; i++) {
        // Try all possible starting points j for the last substring
        for (int j = 0; j < i; j++) {
            // Check if substring s[j:i] is balanced

            // Get frequency of first character in substring as reference
            Integer refFreq = null;
            boolean isBalanced = true;

            // Check all 26 characters
            for (int c = 0; c < 26; c++) {
                int freq = prefix[c][i] - prefix[c][j];
                if (freq > 0) {  // Character appears in this substring
                    if (refFreq == null) {
                        refFreq = freq;  // Set reference frequency
                    } else if (freq != refFreq) {
                        isBalanced = false;
                        break;
                    }
                }
            }

            // If substring is balanced, update dp[i]
            if (isBalanced && dp[j] != Integer.MAX_VALUE) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }

    return dp[n];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × 26) where n is the length of the string. Here's why:

- We have O(n²) substrings to check (for each i, we check all j < i)
- For each substring, we check all 26 possible characters to verify balance
- The prefix sum approach lets us get frequency of any character in O(1) time
- With n ≤ 1000, n² = 1,000,000 and ×26 = 26,000,000 operations, which is acceptable

**Space Complexity:** O(n × 26) for the prefix sum array plus O(n) for the DP array. This simplifies to O(n) since 26 is constant.

## Common Mistakes

1. **Forgetting the empty string base case:** `dp[0] = 0` is crucial. Without it, the DP transitions won't work correctly.

2. **Incorrect substring indexing:** When using prefix sums, remember `prefix[c][i]` represents count in `s[0:i]` (first i characters, exclusive of i if using 0-based). The substring `s[j:i]` has frequency = `prefix[c][i] - prefix[c][j]`.

3. **Not handling the case where no characters appear in substring:** When checking balance, we only compare frequencies for characters with `freq > 0`. Comparing against characters that don't appear would incorrectly fail balanced check.

4. **Using greedy approach:** Some candidates try to take the longest balanced substring from the start. This doesn't guarantee optimal solution. Example: `"aabbc"` - greedy takes `"aabb"` (balanced), leaving `"c"`, total 2. But optimal is `"aa"`, `"bb"`, `"c"` which is 3. Wait, that's worse! Actually `"aabbc"` itself isn't balanced, so greedy gives 2 which is correct minimum. But there exist cases where greedy fails.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Partition DP:** Problems where you need to partition a sequence optimally. Similar to:
   - [Partition Array for Maximum Sum](https://leetcode.com/problems/partition-array-for-maximum-sum/): Partition array into subarrays of max length k, replace each subarray with its max value
   - [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/): Minimum cuts to partition string into palindromes

2. **Prefix Sums for Subarray Properties:** When you need to frequently compute properties of subarrays/substrings:
   - [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/): Uses prefix sums to find subarrays summing to k
   - [Number of Substrings Containing All Three Characters](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/): Uses sliding window with character counts

## Key Takeaways

1. **When you need to partition a sequence into valid segments with minimum/maximum count**, think DP where `dp[i]` represents optimal value for prefix ending at i.

2. **Prefix sums are powerful** when you need to repeatedly compute aggregate properties (sum, count, etc.) of subarrays/substrings.

3. **For character frequency problems with fixed alphabet** (like 26 lowercase letters), checking all 26 characters is often acceptable and simplifies code compared to tracking only appearing characters.

Related problems: [Partition Array for Maximum Sum](/problem/partition-array-for-maximum-sum), [Partition String Into Minimum Beautiful Substrings](/problem/partition-string-into-minimum-beautiful-substrings)
