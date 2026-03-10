---
title: "How to Solve Maximum Deletions on a String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Deletions on a String. Hard difficulty, 35.7% acceptance rate. Topics: String, Dynamic Programming, Rolling Hash, String Matching, Hash Function."
date: "2030-01-14"
category: "dsa-patterns"
tags: ["maximum-deletions-on-a-string", "string", "dynamic-programming", "rolling-hash", "hard"]
---

# How to Solve Maximum Deletions on a String

This problem asks us to find the maximum number of operations we can perform on a string `s` where each operation either deletes the entire string, or deletes the first `i` characters if those characters match the next `i` characters. What makes this problem tricky is that after each deletion, we continue with the remaining suffix, creating a recursive structure where optimal decisions depend on future operations. The challenge is to avoid exponential exploration of all possible deletion sequences.

## Visual Walkthrough

Let's trace through `s = "abababab"` step by step:

1. **Initial string**: `"abababab"`
2. **Check possible deletions**: We can delete the entire string (1 operation), or find prefixes that match following substrings:
   - `i=1`: `"a"` vs `"b"` ❌
   - `i=2`: `"ab"` vs `"ab"` ✅ Match! We can delete `"ab"`
   - `i=3`: `"aba"` vs `"bab"` ❌
   - `i=4`: `"abab"` vs `"abab"` ✅ Match! We can delete `"abab"`
   - `i=5`: `"ababa"` vs `"babab"` ❌
   - `i=6`: `"ababab"` vs `"ababab"` ✅ Match! We can delete `"ababab"`

3. **Choose optimal path**: If we delete `"ab"` (i=2):
   - Remaining: `"ababab"` (original positions 2-7)
   - Now check `"ababab"`:
     - `i=2`: `"ab"` vs `"ab"` ✅ Match! Delete `"ab"`
     - Remaining: `"abab"` (positions 4-7)
   - Check `"abab"`:
     - `i=2`: `"ab"` vs `"ab"` ✅ Match! Delete `"ab"`
     - Remaining: `"ab"` (positions 6-7)
   - Check `"ab"`:
     - `i=2`: `"ab"` vs (nothing) ❌
     - Delete entire string
   - Total operations: 4 (delete "ab", delete "ab", delete "ab", delete "ab")

4. **Alternative path**: If we delete `"abab"` (i=4) initially:
   - Remaining: `"abab"` (positions 4-7)
   - Check `"abab"`:
     - `i=2`: `"ab"` vs `"ab"` ✅ Match! Delete `"ab"`
     - Remaining: `"ab"` (positions 6-7)
   - Delete entire string
   - Total operations: 3 (delete "abab", delete "ab", delete "ab")

5. **Best path**: The first path gave us 4 operations, which is better. This shows we need to explore all possibilities to find the maximum.

## Brute Force Approach

A naive approach would recursively try all possible deletions at each step:

1. For the current string, try deleting the entire string (base case)
2. For every possible `i` from 1 to `n/2` (where `n` is current length), check if the first `i` characters equal the next `i` characters
3. If they match, recursively process the remaining suffix starting at position `2i`
4. Take the maximum of all recursive results

The problem with this approach is exponential time complexity. For a string like `"aaaaaaaa"`, at each step we have up to `n/2` possible matches to explore, leading to `O(n!)` worst-case time. Even for moderate string lengths (n=100), this is completely infeasible.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**, making it perfect for dynamic programming:

1. **Optimal substructure**: The maximum deletions for `s[start:]` depends on the maximum deletions for `s[start+2i:]` when we find a match at position `start`
2. **Overlapping subproblems**: When we compute `dp[start]` (max deletions from position `start`), we might need `dp[start+2i]` for multiple values of `i`

We can solve this with memoization or bottom-up DP:

- `dp[i]` = maximum deletions possible starting from index `i` in the original string
- Base case: `dp[n] = 0` (empty string, no operations needed)
- Transition: For position `i`, we can either:
  - Delete entire string: `1` operation
  - Find `j` where `s[i:i+j] == s[i+j:i+2j]` and take `1 + dp[i+2j]`
  - Take the maximum over all valid `j`

To efficiently check substring equality, we can use:

1. **Direct comparison**: O(j) time per check, leading to O(n³) total
2. **Rolling hash**: O(1) time per check after preprocessing, leading to O(n²) total

The rolling hash approach (Rabin-Karp) precomputes hash values for all prefixes, allowing us to compare any two substrings in O(1) time.

## Optimal Solution

We'll implement a bottom-up DP solution with rolling hash for efficient substring comparison:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def deleteString(s: str) -> int:
    n = len(s)
    if n == 1:
        return 1  # Can only delete entire string

    # dp[i] = maximum deletions starting from index i
    dp = [0] * (n + 1)

    # Precompute rolling hash for substring comparison
    # Using base 26 for lowercase English letters
    base = 26
    mod = 10**9 + 7

    # hash_val[i] = hash of s[0:i] (prefix hash)
    hash_val = [0] * (n + 1)
    # power[i] = base^i mod mod
    power = [1] * (n + 1)

    for i in range(1, n + 1):
        # Convert char to value (a=1, b=2, ..., z=26)
        char_val = ord(s[i-1]) - ord('a') + 1
        # Update prefix hash: hash_val[i] = (hash_val[i-1] * base + char_val) % mod
        hash_val[i] = (hash_val[i-1] * base + char_val) % mod
        # Precompute power for hash calculation
        power[i] = (power[i-1] * base) % mod

    def get_hash(l: int, r: int) -> int:
        """Get hash of substring s[l:r] (0-indexed, exclusive end)"""
        # Using formula: hash(s[l:r]) = (hash_val[r] - hash_val[l] * power[r-l]) % mod
        return (hash_val[r] - hash_val[l] * power[r-l]) % mod

    # Process from right to left (bottom-up DP)
    for i in range(n - 1, -1, -1):
        # Option 1: Delete entire current string
        dp[i] = 1

        # Option 2: Try all possible prefix matches
        # Maximum possible i is floor((n-i)/2) since we need i+j <= n
        max_j = (n - i) // 2

        for j in range(1, max_j + 1):
            # Check if s[i:i+j] == s[i+j:i+2j]
            left_hash = get_hash(i, i + j)
            right_hash = get_hash(i + j, i + 2 * j)

            if left_hash == right_hash:
                # Verify actual string equality (to handle hash collisions)
                if s[i:i+j] == s[i+j:i+2*j]:
                    # We can make this deletion, then continue with remaining suffix
                    dp[i] = max(dp[i], 1 + dp[i + 2 * j])

    return dp[0]
```

```javascript
// Time: O(n^2) | Space: O(n)
function deleteString(s) {
  const n = s.length;
  if (n === 1) return 1; // Can only delete entire string

  // dp[i] = maximum deletions starting from index i
  const dp = new Array(n + 1).fill(0);

  // Precompute rolling hash for substring comparison
  const base = 26n; // Use BigInt to avoid overflow
  const mod = 1000000007n;

  // hashVal[i] = hash of s[0:i] (prefix hash)
  const hashVal = new Array(n + 1).fill(0n);
  // power[i] = base^i mod mod
  const power = new Array(n + 1).fill(1n);

  for (let i = 1; i <= n; i++) {
    // Convert char to value (a=1, b=2, ..., z=26)
    const charVal = BigInt(s.charCodeAt(i - 1) - "a".charCodeAt(0) + 1);
    // Update prefix hash
    hashVal[i] = (hashVal[i - 1] * base + charVal) % mod;
    // Precompute power for hash calculation
    power[i] = (power[i - 1] * base) % mod;
  }

  const getHash = (l, r) => {
    // Get hash of substring s[l:r] (0-indexed, exclusive end)
    // Using formula: hash(s[l:r]) = (hashVal[r] - hashVal[l] * power[r-l]) % mod
    const result = (hashVal[r] - ((hashVal[l] * power[r - l]) % mod)) % mod;
    return result >= 0n ? result : result + mod; // Ensure non-negative
  };

  // Process from right to left (bottom-up DP)
  for (let i = n - 1; i >= 0; i--) {
    // Option 1: Delete entire current string
    dp[i] = 1;

    // Option 2: Try all possible prefix matches
    const maxJ = Math.floor((n - i) / 2);

    for (let j = 1; j <= maxJ; j++) {
      // Check if s[i:i+j] == s[i+j:i+2j]
      const leftHash = getHash(i, i + j);
      const rightHash = getHash(i + j, i + 2 * j);

      if (leftHash === rightHash) {
        // Verify actual string equality (to handle hash collisions)
        if (s.substring(i, i + j) === s.substring(i + j, i + 2 * j)) {
          // We can make this deletion, then continue with remaining suffix
          dp[i] = Math.max(dp[i], 1 + dp[i + 2 * j]);
        }
      }
    }
  }

  return dp[0];
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int deleteString(String s) {
        int n = s.length();
        if (n == 1) return 1; // Can only delete entire string

        // dp[i] = maximum deletions starting from index i
        int[] dp = new int[n + 1];

        // Precompute rolling hash for substring comparison
        final long base = 26;
        final long mod = 1000000007;

        // hashVal[i] = hash of s[0:i] (prefix hash)
        long[] hashVal = new long[n + 1];
        // power[i] = base^i mod mod
        long[] power = new long[n + 1];
        power[0] = 1;

        for (int i = 1; i <= n; i++) {
            // Convert char to value (a=1, b=2, ..., z=26)
            long charVal = s.charAt(i - 1) - 'a' + 1;
            // Update prefix hash
            hashVal[i] = (hashVal[i - 1] * base + charVal) % mod;
            // Precompute power for hash calculation
            power[i] = (power[i - 1] * base) % mod;
        }

        // Helper function to get hash of substring s[l:r]
        // Using formula: hash(s[l:r]) = (hashVal[r] - hashVal[l] * power[r-l]) % mod
        java.util.function.BiFunction<Integer, Integer, Long> getHash = (l, r) -> {
            long result = (hashVal[r] - (hashVal[l] * power[r - l]) % mod) % mod;
            return result >= 0 ? result : result + mod; // Ensure non-negative
        };

        // Process from right to left (bottom-up DP)
        for (int i = n - 1; i >= 0; i--) {
            // Option 1: Delete entire current string
            dp[i] = 1;

            // Option 2: Try all possible prefix matches
            int maxJ = (n - i) / 2;

            for (int j = 1; j <= maxJ; j++) {
                // Check if s[i:i+j] == s[i+j:i+2j]
                long leftHash = getHash.apply(i, i + j);
                long rightHash = getHash.apply(i + j, i + 2 * j);

                if (leftHash == rightHash) {
                    // Verify actual string equality (to handle hash collisions)
                    if (s.substring(i, i + j).equals(s.substring(i + j, i + 2 * j))) {
                        // We can make this deletion, then continue with remaining suffix
                        dp[i] = Math.max(dp[i], 1 + dp[i + 2 * j]);
                    }
                }
            }
        }

        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²)

- We have O(n) DP states (one for each starting index)
- For each state, we check up to O(n) possible prefix lengths
- Each substring comparison takes O(1) time with rolling hash (after O(n) preprocessing)
- Total: O(n²)

**Space Complexity**: O(n)

- DP array: O(n)
- Rolling hash arrays: O(n) each, total O(n)
- No recursion stack since we use bottom-up DP

## Common Mistakes

1. **Forgetting to handle hash collisions**: Rolling hash can produce false positives. Always verify with actual string comparison when hashes match. This is why we have the `s.substring()` check after hash equality.

2. **Incorrect DP state definition**: Some candidates try to define `dp[i]` as max deletions for first `i` characters. This doesn't work well because deletions can skip characters. The correct approach is `dp[i]` = max deletions starting from index `i`.

3. **Off-by-one errors in substring indices**: When checking `s[i:i+j] == s[i+j:i+2j]`, remember Python/JavaScript use exclusive end indices. `i+2j` must not exceed `n`.

4. **Not considering the "delete entire string" option**: At every position, we can always delete the entire remaining string as one operation. This is the base case that ensures we always have at least 1 operation.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dynamic Programming on Strings**: Like "Longest Palindromic Substring" or "Edit Distance", where we build solutions for substrings based on smaller substrings.

2. **Rolling Hash/Rabin-Karp**: Used in "Shortest Palindrome" (to find the longest palindrome prefix) and "Longest Happy Prefix" (to find borders of a string). Both involve efficient substring comparison.

3. **Greedy vs DP decision making**: Similar to "Jump Game II" where you need to decide the optimal "jump" (deletion) at each step, but here you must explore all possibilities.

## Key Takeaways

1. **Recognize optimal substructure**: When a problem asks for "maximum operations" and operations transform the problem into a smaller version of itself, think DP with memoization.

2. **Use rolling hash for efficient substring comparison**: When you need to compare many substrings in a string, precomputing prefix hashes reduces O(n) comparisons to O(1).

3. **Bottom-up DP often clearer for string problems**: Processing from the end to the beginning avoids recursion depth issues and makes dependencies explicit.

Related problems: [Shortest Palindrome](/problem/shortest-palindrome), [Longest Happy Prefix](/problem/longest-happy-prefix), [Remove All Occurrences of a Substring](/problem/remove-all-occurrences-of-a-substring)
