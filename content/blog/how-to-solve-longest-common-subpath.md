---
title: "How to Solve Longest Common Subpath — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Common Subpath. Hard difficulty, 29.4% acceptance rate. Topics: Array, Binary Search, Rolling Hash, Suffix Array, Hash Function."
date: "2026-05-26"
category: "dsa-patterns"
tags: ["longest-common-subpath", "array", "binary-search", "rolling-hash", "hard"]
---

# How to Solve Longest Common Subpath

You're given `m` paths (arrays of integers representing city IDs) and need to find the length of the longest subpath (contiguous sequence) that appears in **all** paths. This is essentially finding the longest common substring across multiple strings, but with integers instead of characters. The challenge is that `n` (city count) can be up to 10⁵ and paths can be long, making brute force impossible.

What makes this problem tricky:

1. We need to find a common **contiguous** subsequence across all paths, not just any subsequence
2. With multiple paths, we need an efficient way to check if a candidate length works for all paths
3. The constraints require a solution better than O(L²) where L is total path length

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
paths = [
    [0,1,2,3,4],
    [2,3,4,5,6],
    [3,4,5,6,7]
]
```

We want the longest contiguous sequence that appears in all 3 paths.

**Step 1: Check if length 5 works**

- Path 1 subpaths of length 5: `[0,1,2,3,4]`
- Path 2 subpaths of length 5: `[2,3,4,5,6]`
- Path 3 subpaths of length 5: `[3,4,5,6,7]`
- No common subpath → length 5 fails

**Step 2: Check if length 4 works**

- Path 1: `[0,1,2,3]`, `[1,2,3,4]`
- Path 2: `[2,3,4,5]`, `[3,4,5,6]`
- Path 3: `[3,4,5,6]`, `[4,5,6,7]`
- Common subpath `[3,4,5,6]` appears in all 3 paths? Let's check:
  - Path 1: No `[3,4,5,6]` (has `[3,4]` but not `[3,4,5,6]`)
  - Path 2: Has `[3,4,5,6]` ✓
  - Path 3: Has `[3,4,5,6]` ✓
  - But missing from Path 1 → length 4 fails

**Step 3: Check if length 3 works**

- Path 1: `[0,1,2]`, `[1,2,3]`, `[2,3,4]`
- Path 2: `[2,3,4]`, `[3,4,5]`, `[4,5,6]`
- Path 3: `[3,4,5]`, `[4,5,6]`, `[5,6,7]`
- Common subpath `[2,3,4]` appears in Path 1 and 2 but not 3
- Common subpath `[3,4,5]` appears in Path 2 and 3 but not 1
- No length-3 subpath appears in all 3 → length 3 fails

**Step 4: Check if length 2 works**

- Path 1: `[0,1]`, `[1,2]`, `[2,3]`, `[3,4]`
- Path 2: `[2,3]`, `[3,4]`, `[4,5]`, `[5,6]`
- Path 3: `[3,4]`, `[4,5]`, `[5,6]`, `[6,7]`
- `[3,4]` appears in all 3 paths! ✓
- So length 2 works

**Step 5: Check if length 1 works** (always true since cities exist)

- Any single city appears in all paths if that city ID exists in all paths

The answer is 2 (the longest length that works).

The key insight: We can **binary search** on the answer length, and for each candidate length, check if there exists a subpath of that length common to all paths.

## Brute Force Approach

A naive approach would be:

1. Generate all possible subpaths from the first path
2. For each subpath, check if it exists in all other paths
3. Track the maximum length found

The problem with this approach:

- If the first path has length L, there are O(L²) subpaths
- Checking if a subpath exists in another path of length L takes O(L) time with naive string matching
- With m paths, total complexity is O(m × L³) — far too slow for L up to 10⁵

Even with smarter substring search (like KMP), we'd still have O(m × L²) which is too slow. We need a way to check candidate lengths without explicitly comparing every subpath.

## Optimized Approach

The key insight is combining **binary search** with **rolling hash** (Rabin-Karp):

1. **Binary Search on Answer**:
   - We know the answer is between 0 and min(path lengths)
   - For a candidate length k, we check: "Does there exist a subpath of length k common to all paths?"
   - If yes, we try longer lengths; if no, we try shorter lengths
   - Binary search gives us O(log L) checks instead of O(L)

2. **Rolling Hash for Efficient Subpath Checking**:
   - For each path, compute hash values for all subpaths of length k
   - Use a rolling hash to compute these in O(L) time per path
   - Store hashes in a set for quick lookup

3. **Checking Candidate Length k**:
   - Compute all length-k subpath hashes for the first path
   - For each subsequent path:
     - Compute its length-k subpath hashes
     - Keep only hashes that also appear in this path
   - If any hash survives through all paths, then k is valid
   - We also need to handle hash collisions (multiple different subpaths having same hash)

4. **Handling Hash Collisions**:
   - Use a tuple (hash1, hash2) with two different hash functions
   - Or store the actual subpath along with hash for verification
   - This makes collisions extremely unlikely

## Optimal Solution

We'll implement the binary search + rolling hash approach with double hashing for collision resistance.

<div class="code-group">

```python
# Time: O(m * L * log(min_len)) where L is total length of all paths
# Space: O(L) for storing hash sets
class Solution:
    def longestCommonSubpath(self, n: int, paths: List[List[int]]) -> int:
        # Base case: if only one path, answer is its length
        if len(paths) == 1:
            return len(paths[0])

        # Helper function to check if a given length k is valid
        def is_valid_length(k: int) -> bool:
            if k == 0:
                return True

            # Choose large prime numbers for hashing
            mod1, mod2 = 10**9 + 7, 10**9 + 9
            base = n + 1  # Use n+1 as base to ensure unique encoding

            # Precompute powers for rolling hash
            pow1, pow2 = [1], [1]
            for i in range(k):
                pow1.append((pow1[-1] * base) % mod1)
                pow2.append((pow2[-1] * base) % mod2)

            # Get hashes of all subpaths of length k from first path
            common_hashes = set()
            hash1, hash2 = 0, 0

            # Compute initial hash for first k elements
            for i in range(k):
                hash1 = (hash1 * base + paths[0][i]) % mod1
                hash2 = (hash2 * base + paths[0][i]) % mod2

            common_hashes.add((hash1, hash2))

            # Compute rolling hashes for rest of first path
            for i in range(k, len(paths[0])):
                # Remove leftmost element, add new element
                hash1 = (hash1 * base - paths[0][i-k] * pow1[k] + paths[0][i]) % mod1
                hash2 = (hash2 * base - paths[0][i-k] * pow2[k] + paths[0][i]) % mod2
                # Ensure positive modulo
                hash1 = (hash1 + mod1) % mod1
                hash2 = (hash2 + mod2) % mod2
                common_hashes.add((hash1, hash2))

            # Check each subsequent path
            for path_idx in range(1, len(paths)):
                if len(path) < k:
                    return False

                current_hashes = set()
                hash1, hash2 = 0, 0

                # Compute initial hash
                for i in range(k):
                    hash1 = (hash1 * base + paths[path_idx][i]) % mod1
                    hash2 = (hash2 * base + paths[path_idx][i]) % mod2

                if (hash1, hash2) in common_hashes:
                    current_hashes.add((hash1, hash2))

                # Compute rolling hashes
                for i in range(k, len(paths[path_idx])):
                    hash1 = (hash1 * base - paths[path_idx][i-k] * pow1[k] + paths[path_idx][i]) % mod1
                    hash2 = (hash2 * base - paths[path_idx][i-k] * pow2[k] + paths[path_idx][i]) % mod2
                    hash1 = (hash1 + mod1) % mod1
                    hash2 = (hash2 + mod2) % mod2

                    if (hash1, hash2) in common_hashes:
                        current_hashes.add((hash1, hash2))

                # Update common_hashes to intersection
                common_hashes = current_hashes
                if not common_hashes:
                    return False

            return len(common_hashes) > 0

        # Binary search for the maximum valid length
        min_len = min(len(path) for path in paths)
        left, right = 0, min_len

        while left < right:
            mid = (left + right + 1) // 2  # Upper mid to avoid infinite loop
            if is_valid_length(mid):
                left = mid  # Try longer lengths
            else:
                right = mid - 1  # Try shorter lengths

        return left
```

```javascript
// Time: O(m * L * log(min_len)) where L is total length of all paths
// Space: O(L) for storing hash sets
/**
 * @param {number} n
 * @param {number[][]} paths
 * @return {number}
 */
var longestCommonSubpath = function (n, paths) {
  // Base case: if only one path, answer is its length
  if (paths.length === 1) {
    return paths[0].length;
  }

  // Helper function to check if length k is valid
  const isValidLength = (k) => {
    if (k === 0) return true;

    // Large primes for hashing
    const mod1 = 1000000007,
      mod2 = 1000000009;
    const base = n + 1; // Base for encoding

    // Precompute powers for rolling hash
    const pow1 = [1],
      pow2 = [1];
    for (let i = 0; i < k; i++) {
      pow1.push((pow1[pow1.length - 1] * base) % mod1);
      pow2.push((pow2[pow2.length - 1] * base) % mod2);
    }

    // Get hashes from first path
    let commonHashes = new Set();
    let hash1 = 0,
      hash2 = 0;

    // Compute initial hash for first k elements
    for (let i = 0; i < k; i++) {
      hash1 = (hash1 * base + paths[0][i]) % mod1;
      hash2 = (hash2 * base + paths[0][i]) % mod2;
    }
    commonHashes.add(hash1 + "," + hash2);

    // Rolling hash for rest of first path
    for (let i = k; i < paths[0].length; i++) {
      // Remove leftmost, add new element
      hash1 = (hash1 * base - paths[0][i - k] * pow1[k] + paths[0][i]) % mod1;
      hash2 = (hash2 * base - paths[0][i - k] * pow2[k] + paths[0][i]) % mod2;
      // Ensure positive modulo
      hash1 = (hash1 + mod1) % mod1;
      hash2 = (hash2 + mod2) % mod2;
      commonHashes.add(hash1 + "," + hash2);
    }

    // Check each subsequent path
    for (let p = 1; p < paths.length; p++) {
      const path = paths[p];
      if (path.length < k) return false;

      const currentHashes = new Set();
      hash1 = 0;
      hash2 = 0;

      // Compute initial hash
      for (let i = 0; i < k; i++) {
        hash1 = (hash1 * base + path[i]) % mod1;
        hash2 = (hash2 * base + path[i]) % mod2;
      }

      const key = hash1 + "," + hash2;
      if (commonHashes.has(key)) {
        currentHashes.add(key);
      }

      // Rolling hash for rest of path
      for (let i = k; i < path.length; i++) {
        hash1 = (hash1 * base - path[i - k] * pow1[k] + path[i]) % mod1;
        hash2 = (hash2 * base - path[i - k] * pow2[k] + path[i]) % mod2;
        hash1 = (hash1 + mod1) % mod1;
        hash2 = (hash2 + mod2) % mod2;

        const newKey = hash1 + "," + hash2;
        if (commonHashes.has(newKey)) {
          currentHashes.add(newKey);
        }
      }

      // Update to intersection
      commonHashes = currentHashes;
      if (commonHashes.size === 0) {
        return false;
      }
    }

    return commonHashes.size > 0;
  };

  // Binary search for maximum valid length
  let minLen = Math.min(...paths.map((p) => p.length));
  let left = 0,
    right = minLen;

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (isValidLength(mid)) {
      left = mid; // Try longer
    } else {
      right = mid - 1; // Try shorter
    }
  }

  return left;
};
```

```java
// Time: O(m * L * log(min_len)) where L is total length of all paths
// Space: O(L) for storing hash sets
class Solution {
    public int longestCommonSubpath(int n, int[][] paths) {
        // Base case: if only one path, answer is its length
        if (paths.length == 1) {
            return paths[0].length;
        }

        // Binary search bounds
        int minLen = Integer.MAX_VALUE;
        for (int[] path : paths) {
            minLen = Math.min(minLen, path.length);
        }

        int left = 0, right = minLen;
        while (left < right) {
            int mid = left + (right - left + 1) / 2;  // Upper mid
            if (isValidLength(mid, n, paths)) {
                left = mid;  // Try longer lengths
            } else {
                right = mid - 1;  // Try shorter lengths
            }
        }

        return left;
    }

    private boolean isValidLength(int k, int n, int[][] paths) {
        if (k == 0) return true;

        final long MOD1 = 1000000007L, MOD2 = 1000000009L;
        final long base = n + 1;  // Base for encoding

        // Precompute powers for rolling hash
        long[] pow1 = new long[k + 1];
        long[] pow2 = new long[k + 1];
        pow1[0] = pow2[0] = 1;
        for (int i = 1; i <= k; i++) {
            pow1[i] = (pow1[i - 1] * base) % MOD1;
            pow2[i] = (pow2[i - 1] * base) % MOD2;
        }

        // Get hashes from first path
        Set<String> commonHashes = new HashSet<>();
        long hash1 = 0, hash2 = 0;
        int[] firstPath = paths[0];

        // Compute initial hash for first k elements
        for (int i = 0; i < k; i++) {
            hash1 = (hash1 * base + firstPath[i]) % MOD1;
            hash2 = (hash2 * base + firstPath[i]) % MOD2;
        }
        commonHashes.add(hash1 + "," + hash2);

        // Rolling hash for rest of first path
        for (int i = k; i < firstPath.length; i++) {
            // Remove leftmost element, add new element
            hash1 = (hash1 * base - firstPath[i - k] * pow1[k] + firstPath[i]) % MOD1;
            hash2 = (hash2 * base - firstPath[i - k] * pow2[k] + firstPath[i]) % MOD2;
            // Ensure positive modulo
            hash1 = (hash1 + MOD1) % MOD1;
            hash2 = (hash2 + MOD2) % MOD2;
            commonHashes.add(hash1 + "," + hash2);
        }

        // Check each subsequent path
        for (int p = 1; p < paths.length; p++) {
            int[] path = paths[p];
            if (path.length < k) return false;

            Set<String> currentHashes = new HashSet<>();
            hash1 = 0; hash2 = 0;

            // Compute initial hash
            for (int i = 0; i < k; i++) {
                hash1 = (hash1 * base + path[i]) % MOD1;
                hash2 = (hash2 * base + path[i]) % MOD2;
            }

            String key = hash1 + "," + hash2;
            if (commonHashes.contains(key)) {
                currentHashes.add(key);
            }

            // Rolling hash for rest of path
            for (int i = k; i < path.length; i++) {
                hash1 = (hash1 * base - path[i - k] * pow1[k] + path[i]) % MOD1;
                hash2 = (hash2 * base - path[i - k] * pow2[k] + path[i]) % MOD2;
                hash1 = (hash1 + MOD1) % MOD1;
                hash2 = (hash2 + MOD2) % MOD2;

                String newKey = hash1 + "," + hash2;
                if (commonHashes.contains(newKey)) {
                    currentHashes.add(newKey);
                }
            }

            // Update to intersection
            commonHashes = currentHashes;
            if (commonHashes.isEmpty()) {
                return false;
            }
        }

        return !commonHashes.isEmpty();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × L × log(min_len))**

- `log(min_len)`: Binary search over possible lengths (0 to minimum path length)
- For each candidate length `k`:
  - Process each of `m` paths: O(m)
  - For each path of length `L_i`: Compute rolling hashes in O(L_i) time
  - Total across all paths: O(∑L_i) = O(L) where L is total length of all paths
- Overall: O(log(min_len) × m × L)

**Space Complexity: O(L)**

- We store hash sets for subpaths
- In worst case, we store all length-k subpaths from a path, which could be O(L)
- The power arrays are O(k) which is O(min_len) ≤ O(L)

## Common Mistakes

1. **Forgetting to handle hash collisions**: Using a single hash function can lead to false positives. Always use double hashing or store actual subpaths for verification when collisions matter.

2. **Incorrect rolling hash formula**: The rolling hash update must properly remove the leftmost element's contribution. Common error: `hash = (hash - left*power + new) % MOD` without multiplying left by the appropriate power.

3. **Not ensuring positive modulo values**: When subtracting in modular arithmetic, results can be negative. Always add MOD before taking modulo: `hash = (hash + MOD) % MOD`.

4. **Binary search off-by-one errors**: When using `while (left < right)`, remember to use `mid = (left + right + 1) // 2` to avoid infinite loops when moving `left = mid`. Or use `while (left <= right)` with careful updates.

5. **Not checking path length before processing**: If candidate length k > path length, immediately return false instead of trying to compute hashes.

## When You'll See This Pattern

This "binary search on answer + rolling hash" pattern appears in problems where:

1. You need to find the maximum/minimum length satisfying some property
2. Checking if a specific length works is easier than finding the maximum directly
3. You need to compare substrings/subarrays efficiently

**Related problems:**

- **"Longest Duplicate Substring"** (LeetCode 1044): Same pattern - binary search + rolling hash to find longest repeating substring
- **"Repeated DNA Sequences"** (LeetCode 187): Rolling hash to find repeating sequences
- **"Maximum Length of Repeated Subarray"** (LeetCode 718): Finding longest common subarray (similar but for 2 arrays only)

## Key Takeaways

1. **When asked for "longest X that satisfies Y"**, consider binary search on the answer if checking whether length k works is easier than finding the maximum directly.

2. **Rolling hash (Rabin-Karp)** is your go-to for efficiently comparing substrings/subarrays across multiple strings/arrays. It reduces O(k) comparison to O(1) after preprocessing.

3. **For multiple strings/arrays**, compute candidate set from first one, then intersect with each subsequent one. This is more efficient than comparing all pairs.

4. **Always use double hashing** or another collision-resistant method when false positives from hash collisions could affect correctness.

Related problems: [Reconstruct Itinerary](/problem/reconstruct-itinerary), [Maximum Length of Repeated Subarray](/problem/maximum-length-of-repeated-subarray)
