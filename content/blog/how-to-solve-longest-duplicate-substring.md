---
title: "How to Solve Longest Duplicate Substring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Duplicate Substring. Hard difficulty, 31.1% acceptance rate. Topics: String, Binary Search, Sliding Window, Rolling Hash, Suffix Array."
date: "2027-10-15"
category: "dsa-patterns"
tags: ["longest-duplicate-substring", "string", "binary-search", "sliding-window", "hard"]
---

# How to Solve Longest Duplicate Substring

Finding the longest duplicate substring in a string is a classic hard problem that tests your ability to combine multiple algorithmic techniques. What makes this problem particularly interesting is that a naive approach would be impossibly slow for longer strings, forcing you to think creatively about string matching, search optimization, and hashing techniques.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider the string `s = "banana"`.

**Step 1: Understanding what we're looking for**

- Substrings of "banana" include: "b", "a", "n", "ba", "an", "na", "ban", "ana", "nan", "bana", "anan", "banana"
- We need substrings that appear at least twice in the string
- "a" appears at positions 1, 3, 5 (three times)
- "na" appears at positions 2-3 and 4-5 (twice)
- "ana" appears at positions 1-3 and 3-5 (twice, with overlap)
- "ban" appears only once
- The longest duplicate substring here is "ana" with length 3

**Step 2: The challenge with brute force checking**
If we tried to check every possible substring:

- There are O(n²) possible substrings (n choose starting point × n choose length)
- For each substring, we'd need to check if it appears elsewhere in the string
- This naive approach would be O(n³) - far too slow for strings of meaningful length

**Step 3: The key insight**
Instead of checking all substrings directly, we can use **binary search** on the answer length:

- If a duplicate substring of length L exists, then a duplicate substring of length L-1 must also exist
- If no duplicate substring of length L exists, then no duplicate substring longer than L exists
- This monotonic property lets us binary search for the maximum L

**Step 4: Checking for a duplicate of specific length**
For a given length L, we need to efficiently check if any substring of length L appears at least twice. We can:

1. Extract all substrings of length L using a sliding window
2. Use rolling hash (Rabin-Karp) to compute hashes in O(1) time per substring
3. Store hashes in a set to detect collisions
4. When hashes collide, verify with actual string comparison to handle hash collisions

## Brute Force Approach

The most straightforward approach would be to check every possible substring length from n-1 down to 1, and for each length, check every possible starting position pair to see if the substrings match.

```python
def longestDupSubstring_brute(s: str) -> str:
    n = len(s)
    # Try all possible lengths from largest to smallest
    for length in range(n-1, 0, -1):
        # Check all pairs of starting positions
        for i in range(n - length + 1):
            substr1 = s[i:i+length]
            for j in range(i + 1, n - length + 1):
                substr2 = s[j:j+length]
                if substr1 == substr2:
                    return substr1
    return ""
```

**Why this fails:**

- Time complexity: O(n⁴) in worst case (three nested loops plus string comparison)
- For n = 10,000, this would require ~10¹⁶ operations - completely infeasible
- Even with small optimizations, it's still O(n³) which is too slow for n > 1000

## Optimized Approach

The optimal solution combines three key techniques:

1. **Binary Search on Answer Length**: Instead of checking all lengths, we binary search between 1 and n-1. This reduces the number of length checks from O(n) to O(log n).

2. **Rolling Hash (Rabin-Karp)**: To efficiently check if any substring of length L appears twice, we compute hashes for all substrings of length L in O(n) time using a rolling hash. The rolling hash lets us compute hash(s[i+1:i+L+1]) from hash(s[i:i+L]) in O(1) time.

3. **Collision Handling with HashMap**: We store hashes in a hashmap along with their starting indices. When we find a hash collision, we verify it's not a false positive by comparing the actual substrings.

**Why this combination works:**

- Binary search gives us O(log n) iterations
- Each iteration takes O(n) time to compute and check all substrings of length L
- Rolling hash avoids recomputing hashes from scratch for each substring
- The overall complexity becomes O(n log n), which handles n = 10,000 efficiently

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def longestDupSubstring(s: str) -> str:
    n = len(s)

    # Helper function to check if a duplicate substring of given length exists
    def has_duplicate(length: int) -> str:
        if length == 0:
            return ""

        # Constants for rolling hash
        base = 26  # 26 lowercase letters (problem states lowercase English letters)
        modulus = 2**63 - 1  # Large prime to reduce collisions

        # Compute the initial hash for the first substring of length 'length'
        hash_val = 0
        for i in range(length):
            hash_val = (hash_val * base + (ord(s[i]) - ord('a'))) % modulus

        # Store seen hashes and their starting indices
        # We need to store indices to handle hash collisions
        seen = {hash_val: 0}

        # Precompute base^length % modulus for rolling hash updates
        pow_base = pow(base, length, modulus)

        # Slide the window and update hash
        for i in range(1, n - length + 1):
            # Remove leftmost character and add new rightmost character
            hash_val = (hash_val * base - (ord(s[i-1]) - ord('a')) * pow_base +
                       (ord(s[i+length-1]) - ord('a'))) % modulus

            # Ensure positive hash value
            hash_val = (hash_val + modulus) % modulus

            # Check if we've seen this hash before
            if hash_val in seen:
                # Potential match - verify by comparing actual substrings
                start1 = seen[hash_val]
                start2 = i
                if s[start1:start1+length] == s[start2:start2+length]:
                    return s[start2:start2+length]

            # Store the current hash with its starting index
            seen[hash_val] = i

        return ""

    # Binary search for the maximum length with a duplicate
    left, right = 1, n - 1
    result = ""

    while left <= right:
        mid = left + (right - left) // 2

        # Check if there's a duplicate substring of length 'mid'
        duplicate = has_duplicate(mid)

        if duplicate:
            # Found a duplicate of length 'mid', try longer lengths
            result = duplicate
            left = mid + 1
        else:
            # No duplicate of length 'mid', try shorter lengths
            right = mid - 1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function longestDupSubstring(s) {
  const n = s.length;

  // Helper function to check if a duplicate substring of given length exists
  function hasDuplicate(length) {
    if (length === 0) return "";

    // Constants for rolling hash
    const base = 26; // 26 lowercase letters
    const modulus = BigInt(2 ** 63 - 1); // Large prime

    // Compute initial hash for first substring
    let hash = BigInt(0);
    for (let i = 0; i < length; i++) {
      hash = (hash * BigInt(base) + BigInt(s.charCodeAt(i) - 97)) % modulus;
    }

    // Store seen hashes with their starting indices
    const seen = new Map();
    seen.set(hash.toString(), 0);

    // Precompute base^length % modulus
    let powBase = BigInt(1);
    for (let i = 0; i < length; i++) {
      powBase = (powBase * BigInt(base)) % modulus;
    }

    // Slide window and update hash
    for (let i = 1; i <= n - length; i++) {
      // Update rolling hash
      const leftCharCode = BigInt(s.charCodeAt(i - 1) - 97);
      const rightCharCode = BigInt(s.charCodeAt(i + length - 1) - 97);

      hash = (hash * BigInt(base) - leftCharCode * powBase + rightCharCode) % modulus;

      // Ensure positive hash value
      if (hash < 0) hash += modulus;

      const hashStr = hash.toString();

      // Check if we've seen this hash before
      if (seen.has(hashStr)) {
        // Verify actual strings match (handle hash collisions)
        const start1 = seen.get(hashStr);
        const start2 = i;
        if (s.substring(start1, start1 + length) === s.substring(start2, start2 + length)) {
          return s.substring(start2, start2 + length);
        }
      }

      // Store current hash
      seen.set(hashStr, i);
    }

    return "";
  }

  // Binary search for maximum length with duplicate
  let left = 1,
    right = n - 1;
  let result = "";

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    const duplicate = hasDuplicate(mid);

    if (duplicate) {
      // Found duplicate of length mid, try longer
      result = duplicate;
      left = mid + 1;
    } else {
      // No duplicate of length mid, try shorter
      right = mid - 1;
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public String longestDupSubstring(String s) {
        int n = s.length();

        // Binary search for the maximum length
        int left = 1, right = n - 1;
        String result = "";

        while (left <= right) {
            int mid = left + (right - left) / 2;

            String duplicate = hasDuplicate(s, mid);

            if (!duplicate.isEmpty()) {
                // Found a duplicate of length mid, try longer
                result = duplicate;
                left = mid + 1;
            } else {
                // No duplicate of length mid, try shorter
                right = mid - 1;
            }
        }

        return result;
    }

    private String hasDuplicate(String s, int length) {
        if (length == 0) return "";

        int n = s.length();
        long base = 26;  // lowercase English letters
        long modulus = (long) Math.pow(2, 32);  // Use 2^32 as modulus

        // Compute hash of first substring
        long hash = 0;
        for (int i = 0; i < length; i++) {
            hash = (hash * base + (s.charAt(i) - 'a')) % modulus;
        }

        // Store seen hashes with their starting indices
        Map<Long, Integer> seen = new HashMap<>();
        seen.put(hash, 0);

        // Precompute base^length % modulus
        long powBase = 1;
        for (int i = 0; i < length; i++) {
            powBase = (powBase * base) % modulus;
        }

        // Slide window and update hash
        for (int i = 1; i <= n - length; i++) {
            // Update rolling hash: remove left char, add right char
            int leftChar = s.charAt(i - 1) - 'a';
            int rightChar = s.charAt(i + length - 1) - 'a';

            hash = (hash * base - leftChar * powBase + rightChar) % modulus;

            // Ensure positive hash
            if (hash < 0) hash += modulus;

            // Check if we've seen this hash before
            if (seen.containsKey(hash)) {
                // Verify it's not a hash collision
                int start1 = seen.get(hash);
                int start2 = i;
                if (s.substring(start1, start1 + length).equals(s.substring(start2, start2 + length))) {
                    return s.substring(start2, start2 + length);
                }
            }

            // Store current hash
            seen.put(hash, i);
        }

        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Binary search runs O(log n) iterations
- Each iteration calls `has_duplicate()` which takes O(n) time:
  - Computing initial hash: O(L) but L ≤ n
  - Sliding window with rolling hash updates: O(n)
  - String comparison on hash collisions: O(L) in worst case but rare with good hash
- Total: O(n log n)

**Space Complexity: O(n)**

- The hashmap stores up to O(n) entries (one per starting position)
- Temporary strings for comparison: O(L) where L ≤ n
- Overall linear space usage

The logarithmic factor comes from binary search, while the linear factor comes from processing all substrings of a given length.

## Common Mistakes

1. **Forgetting to handle hash collisions**: Just because two strings have the same hash doesn't mean they're equal. Always verify with actual string comparison when you find a hash match.

2. **Incorrect rolling hash update formula**: The update formula `hash = (hash * base - left_char * base^L + right_char) % modulus` is easy to get wrong. Test it on small examples to verify.

3. **Not using a large enough modulus**: With a small modulus, hash collisions become frequent, degrading performance to O(n²) in worst case. Use a large prime or 2^63-1.

4. **Off-by-one errors in binary search bounds**: The maximum possible duplicate length is n-1 (can't be the whole string), and minimum is 1. Getting these bounds wrong can cause infinite loops or incorrect results.

5. **Not storing starting indices with hashes**: When you detect a hash collision, you need to know where the original substring started to verify it's actually a duplicate, not the same occurrence.

## When You'll See This Pattern

This problem combines several patterns that appear in other coding problems:

1. **Binary Search on Answer**: Problems where you can test if a solution of a certain "size" exists, and the answer has monotonic property.
   - Related: [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
   - Related: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)

2. **Rolling Hash/Rabin-Karp**: Efficient substring search and pattern matching.
   - Related: [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/)
   - Related: [Implement strStr()](https://leetcode.com/problems/implement-strstr/)

3. **String Searching with Hashing**: Any problem requiring finding repeating patterns in strings.
   - Related: [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)
   - Related: [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/)

## Key Takeaways

1. **When faced with "find the maximum X" problems**, consider if you can binary search on the answer. If testing whether a solution of size K exists is easier than finding the maximum directly, binary search can transform an O(n²) problem into O(n log n).

2. **Rolling hash is your friend for substring problems**. When you need to compare many substrings, computing hashes with a rolling window gives O(1) updates versus O(L) recomputation.

3. **Combine techniques for hard problems**. This problem isn't solved by a single algorithm but by combining binary search (for the length) with rolling hash (for efficient substring comparison) with hashmap (for duplicate detection).

[Practice this problem on CodeJeet](/problem/longest-duplicate-substring)
