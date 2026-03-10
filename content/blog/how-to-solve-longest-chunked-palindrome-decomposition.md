---
title: "How to Solve Longest Chunked Palindrome Decomposition — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Chunked Palindrome Decomposition. Hard difficulty, 59.0% acceptance rate. Topics: Two Pointers, String, Dynamic Programming, Greedy, Rolling Hash."
date: "2029-04-17"
category: "dsa-patterns"
tags:
  [
    "longest-chunked-palindrome-decomposition",
    "two-pointers",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Longest Chunked Palindrome Decomposition

This problem asks us to split a string into the maximum number of substrings where the first substring equals the last, the second equals the second-to-last, and so on. What makes this tricky is that we need to find these matching pairs from the outside in, but the chunks can be of varying lengths—we can't just split at fixed positions. The challenge is to greedily match the shortest possible chunks while ensuring we don't miss better splits later.

## Visual Walkthrough

Let's trace through `text = "ghiabcdefhelloadamhelloabcdefghi"`:

1. Start with left pointer `l = 0`, right pointer `r = len(text)-1 = 34`
2. Compare `text[0:1]` = "g" with `text[34:35]` = "i" → no match
3. Compare `text[0:2]` = "gh" with `text[33:35]` = "hi" → no match
4. Compare `text[0:3]` = "ghi" with `text[32:35]` = "ghi" → MATCH! Found chunk pair #1
5. Move pointers: `l = 3`, `r = 32`
6. Compare `text[3:4]` = "a" with `text[31:32]` = "h" → no match
7. Compare `text[3:5]` = "ab" with `text[30:32]` = "gh" → no match
8. Continue expanding until `text[3:9]` = "abcdef" with `text[26:32]` = "abcdef" → MATCH! Chunk pair #2
9. Move pointers: `l = 9`, `r = 26`
10. Compare `text[9:10]` = "h" with `text[25:26]` = "a" → no match
11. Continue until `text[9:14]` = "hello" with `text[21:26]` = "hello" → MATCH! Chunk pair #3
12. Move pointers: `l = 14`, `r = 21`
13. Compare `text[14:18]` = "adam" with `text[17:21]` = "adam" → MATCH! Chunk pair #4
14. Now `l = 18`, `r = 17` → pointers have crossed, we're done
15. Total chunks = 4 pairs × 2 = 8 chunks

The final decomposition: "ghi" | "abcdef" | "hello" | "adam" | "hello" | "abcdef" | "ghi"

## Brute Force Approach

A naive approach would try all possible split points recursively. For each position `i` from `1` to `n`, check if `text[0:i] == text[n-i:n]`. If they match, recursively solve the substring `text[i:n-i]` and add 2 to the result. The maximum over all valid `i` gives the answer.

This brute force has exponential time complexity O(2^n) because at each level we try all possible split lengths. For a string of length 1000, this is completely infeasible.

```python
def longestDecomposition_brute(text):
    n = len(text)
    if n == 0:
        return 0

    for i in range(1, n//2 + 1):
        if text[:i] == text[n-i:]:
            return 2 + longestDecomposition_brute(text[i:n-i])

    return 1  # Can't split further, this is the middle chunk
```

The problem with this approach is it explores all possibilities without memoization, leading to repeated work on overlapping subproblems.

## Optimized Approach

The key insight is **greedy matching with two pointers and rolling hash**:

1. **Greedy works**: Always take the shortest possible matching prefix and suffix. This maximizes chunk count because shorter matches free up more of the middle section for additional splits.
2. **Proof of greediness**: If we have a matching prefix `P` and suffix `S` of length `k`, and there's a longer match of length `m > k`, we could still take the shorter match. The longer match doesn't give us more chunks—in fact, it might prevent us from finding additional matches in the middle.
3. **Rolling hash for efficiency**: Comparing strings directly is O(k) per comparison. With rolling hash (Rabin-Karp), we can compare in O(1) after O(n) preprocessing.

We use two pointers: `left` starting at 0, `right` starting at n-1. We expand both sides outward, comparing the hash of the prefix ending at `left` with the hash of the suffix starting at `right`. When hashes match, we verify with direct string comparison (to handle collisions), then reset hashes and count 2 chunks.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output storage
def longestDecomposition(text: str) -> int:
    """
    Returns the maximum number of chunks in a chunked palindrome decomposition.

    Approach: Greedy matching with rolling hash (Rabin-Karp).
    Always take the shortest possible matching prefix and suffix.
    """
    n = len(text)
    if n == 0:
        return 0

    # Base for rolling hash (a prime larger than alphabet size)
    base = 131
    # Modulo to prevent overflow (a large prime)
    mod = 10**9 + 7

    left, right = 0, n - 1
    left_hash, right_hash = 0, 0
    power = 1  # Tracks base^length for right side calculation
    count = 0

    while left <= right:
        # Update rolling hash for left side (building prefix)
        left_hash = (left_hash * base + ord(text[left])) % mod

        # Update rolling hash for right side (building suffix in reverse)
        # For right side, we're building from the end toward the middle
        right_hash = (right_hash + ord(text[right]) * power) % mod
        power = (power * base) % mod

        # Check if current prefix and suffix match
        if left_hash == right_hash:
            # Verify with direct string comparison (handle hash collisions)
            # Compare text[left-current_length+1 : left+1] with text[right : right+current_length]
            current_length = left - (n - 1 - right) + 1
            if text[left-current_length+1:left+1] == text[right:right+current_length]:
                # Found matching chunk pair
                count += 2 if left < right else 1  # Add 1 for middle chunk if pointers meet
                # Reset for next chunk
                left_hash, right_hash = 0, 0
                power = 1

        left += 1
        right -= 1

    # If we have leftover characters in the middle (no match found)
    if left_hash != 0 or right_hash != 0:
        count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Returns the maximum number of chunks in a chunked palindrome decomposition.
 * Uses greedy matching with rolling hash (Rabin-Karp).
 */
function longestDecomposition(text) {
  const n = text.length;
  if (n === 0) return 0;

  // Constants for rolling hash
  const base = 131;
  const mod = 10 ** 9 + 7;

  let left = 0,
    right = n - 1;
  let leftHash = 0,
    rightHash = 0;
  let power = 1; // Tracks base^length for right side
  let count = 0;

  while (left <= right) {
    // Update left hash (building prefix from start)
    leftHash = (leftHash * base + text.charCodeAt(left)) % mod;

    // Update right hash (building suffix from end)
    // Note: For right side, we're building in reverse order
    rightHash = (rightHash + text.charCodeAt(right) * power) % mod;
    power = (power * base) % mod;

    // Check if hashes match
    if (leftHash === rightHash) {
      // Verify with actual string comparison to handle collisions
      const currentLength = left - (n - 1 - right) + 1;
      const leftStr = text.substring(left - currentLength + 1, left + 1);
      const rightStr = text.substring(right, right + currentLength);

      if (leftStr === rightStr) {
        // Found matching chunk pair
        count += left < right ? 2 : 1; // 1 for middle chunk if pointers meet
        // Reset for next chunk
        leftHash = 0;
        rightHash = 0;
        power = 1;
      }
    }

    left++;
    right--;
  }

  // Handle any remaining middle chunk
  if (leftHash !== 0 || rightHash !== 0) {
    count++;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int longestDecomposition(String text) {
        int n = text.length();
        if (n == 0) return 0;

        // Constants for rolling hash
        final long BASE = 131;
        final long MOD = 1_000_000_007;

        int left = 0, right = n - 1;
        long leftHash = 0, rightHash = 0;
        long power = 1;  // Tracks BASE^length for right side
        int count = 0;

        while (left <= right) {
            // Update left hash (building prefix from start)
            leftHash = (leftHash * BASE + text.charAt(left)) % MOD;

            // Update right hash (building suffix from end in reverse)
            rightHash = (rightHash + text.charAt(right) * power) % MOD;
            power = (power * BASE) % MOD;

            // Check if current prefix and suffix match
            if (leftHash == rightHash) {
                // Verify with direct string comparison (handle hash collisions)
                int currentLength = left - (n - 1 - right) + 1;
                String leftStr = text.substring(left - currentLength + 1, left + 1);
                String rightStr = text.substring(right, right + currentLength);

                if (leftStr.equals(rightStr)) {
                    // Found matching chunk pair
                    count += (left < right) ? 2 : 1;  // Add 1 for middle chunk if pointers meet
                    // Reset for next chunk
                    leftHash = 0;
                    rightHash = 0;
                    power = 1;
                }
            }

            left++;
            right--;
        }

        // Handle any remaining middle chunk
        if (leftHash != 0 || rightHash != 0) {
            count++;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once with the two pointers
- Rolling hash updates are O(1) per character
- String comparisons only happen when hashes match, and total comparison length across all matches is O(n) because each character is compared at most once

**Space Complexity: O(1)**

- We use only a constant amount of extra space for pointers, hash values, and counters
- The input string is not modified

## Common Mistakes

1. **Not verifying hash matches with string comparison**: Rolling hash can have collisions. Always do a direct string comparison when hashes match to ensure it's a real match, not a collision.

2. **Incorrect pointer updates when finding a match**: After finding a match, you need to reset the hash accumulators but continue moving pointers. A common error is to reset pointers to wrong positions.

3. **Forgetting the middle chunk**: When pointers cross or meet in the middle without a match, you need to add 1 for the middle chunk. The condition `if (leftHash != 0 || rightHash != 0)` handles this.

4. **Wrong base or modulo in rolling hash**: Using a base that's too small increases collision probability. Using a non-prime modulo can cause poor distribution. Stick with primes like 131 for base and 10^9+7 for modulo.

## When You'll See This Pattern

This greedy + two pointers + rolling hash pattern appears in several string problems:

1. **Longest Palindrome Substring (LeetCode 5)**: Uses expanding centers (similar two-pointer idea)
2. **Palindrome Pairs (LeetCode 336)**: Uses rolling hash to efficiently check palindrome suffixes/prefixes
3. **Rabin-Karp String Matching**: The rolling hash technique is directly from this algorithm
4. **Shortest Palindrome (LeetCode 214)**: Finding the longest palindrome prefix uses similar prefix-suffix matching

The core idea is recognizing when you can make greedy choices (shortest matches) and using hashing to compare substrings efficiently.

## Key Takeaways

1. **Greedy works for chunked palindromes**: Taking the shortest possible match at each step maximizes chunk count. This is counterintuitive but provably optimal.

2. **Rolling hash enables O(1) substring comparisons**: After O(n) preprocessing, you can compare any two substrings in O(1), which is crucial for efficiency.

3. **Two pointers naturally handle symmetric problems**: When dealing with palindromes or symmetric structures, maintaining left and right pointers that move toward each other is often the right approach.

Related problems: [Palindrome Rearrangement Queries](/problem/palindrome-rearrangement-queries)
