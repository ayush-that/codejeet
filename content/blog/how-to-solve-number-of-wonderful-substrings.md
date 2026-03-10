---
title: "How to Solve Number of Wonderful Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Wonderful Substrings. Medium difficulty, 66.6% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Prefix Sum."
date: "2027-08-20"
category: "dsa-patterns"
tags: ["number-of-wonderful-substrings", "hash-table", "string", "bit-manipulation", "medium"]
---

# How to Solve Number of Wonderful Substrings

This problem asks us to count substrings where at most one character appears an odd number of times. The twist is that we're only dealing with the first 10 lowercase letters (a-j), which hints at a bitmask approach. What makes this interesting is that we need to efficiently count substrings with a specific parity property without checking all O(n²) possibilities.

## Visual Walkthrough

Let's trace through `word = "aba"` step by step:

A wonderful substring has at most one character with odd frequency. Think about what this means for character counts:

- All even counts: wonderful ✓
- One odd count: wonderful ✓
- Two or more odd counts: not wonderful ✗

We'll use a bitmask to track parity (odd/even) of each character:

- 0 = even count, 1 = odd count
- For 10 letters a-j, we need 10 bits
- 'a' = bit 0, 'b' = bit 1, ..., 'j' = bit 9

Let's process "aba":

1. Start with mask = 0000000000 (all even)
2. Character 'a' (bit 0): mask ^= (1 << 0) = 0000000001
   - Current substring "a": mask has 1 bit set → wonderful ✓
3. Character 'b' (bit 1): mask ^= (1 << 1) = 0000000011
   - Current substring "ab": mask has 2 bits set → not wonderful ✗
   - But wait! We need to check ALL substrings ending at position 1
   - Substring "b" (mask from pos 0 to 1): mask ^ prev_mask = 0000000010 → 1 bit set → wonderful ✓
4. Character 'a' (bit 0): mask ^= (1 << 0) = 0000000010
   - Current substring "aba": mask has 1 bit set → wonderful ✓
   - Check other substrings ending at position 2:
     - "ba" (mask from pos 1 to 2): current_mask ^ mask_at_pos1 = 0000000010 ^ 0000000011 = 0000000001 → 1 bit set → wonderful ✓
     - "a" (mask from pos 2 to 2): current_mask ^ mask_at_pos2 = 0000000010 ^ 0000000010 = 0000000000 → 0 bits set → wonderful ✓

Total wonderful substrings: "a", "b", "aba", "ba", "a" = 5

## Brute Force Approach

The brute force solution checks every possible substring O(n²) and counts character frequencies for each substring O(n), resulting in O(n³) time complexity:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def brute_force(word):
    n = len(word)
    count = 0

    # Check all substrings
    for i in range(n):
        for j in range(i, n):
            # Count frequencies in substring word[i:j+1]
            freq = [0] * 10
            odd_count = 0

            for k in range(i, j + 1):
                idx = ord(word[k]) - ord('a')
                freq[idx] += 1
                # Update odd_count efficiently
                if freq[idx] % 2 == 1:
                    odd_count += 1
                else:
                    odd_count -= 1

            # Check if wonderful
            if odd_count <= 1:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(word) {
  let n = word.length;
  let count = 0;

  // Check all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count frequencies in substring word[i:j+1]
      let freq = new Array(10).fill(0);
      let oddCount = 0;

      for (let k = i; k <= j; k++) {
        let idx = word.charCodeAt(k) - "a".charCodeAt(0);
        freq[idx]++;
        // Update oddCount efficiently
        if (freq[idx] % 2 === 1) {
          oddCount++;
        } else {
          oddCount--;
        }
      }

      // Check if wonderful
      if (oddCount <= 1) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public long bruteForce(String word) {
    int n = word.length();
    long count = 0;

    // Check all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count frequencies in substring word[i:j+1]
            int[] freq = new int[10];
            int oddCount = 0;

            for (int k = i; k <= j; k++) {
                int idx = word.charAt(k) - 'a';
                freq[idx]++;
                // Update oddCount efficiently
                if (freq[idx] % 2 == 1) {
                    oddCount++;
                } else {
                    oddCount--;
                }
            }

            // Check if wonderful
            if (oddCount <= 1) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

This is too slow for n up to 10⁵. We need O(n) or O(n log n).

## Optimized Approach

The key insight: **A substring is wonderful if the XOR of its character parities has at most 1 bit set.**

Think about prefix masks:

- Let `mask[i]` = parity mask for prefix `word[0:i]`
- For substring `word[j:i]`, its mask = `mask[i] ^ mask[j]`
- We want `mask[i] ^ mask[j]` to have at most 1 bit set

This means for current mask `mask[i]`, we need to count previous masks `mask[j]` where:

1. `mask[i] ^ mask[j] = 0` (all even) → `mask[j] = mask[i]`
2. `mask[i] ^ mask[j]` has exactly 1 bit set → `mask[j] = mask[i] ^ (1 << k)` for k = 0..9

We can use a hashmap to count how many times each mask has appeared before.

Step-by-step reasoning:

1. Initialize `count` map with `{0: 1}` (empty prefix has all even counts)
2. Initialize `mask = 0` (current parity mask)
3. For each character:
   - Update mask by toggling the corresponding bit
   - Count how many previous prefixes had the same mask (all even difference)
   - Count how many previous prefixes differed by exactly 1 bit (one odd difference)
   - Add current mask to count map

## Optimal Solution

<div class="code-group">

```python
# Time: O(10n) = O(n) | Space: O(2^10) = O(1024) = O(1)
def wonderfulSubstrings(word: str) -> int:
    # count[mask] stores how many times we've seen this mask before
    count = [0] * 1024  # 2^10 possible masks
    count[0] = 1  # empty prefix has all even counts

    mask = 0  # current parity mask
    result = 0

    for char in word:
        # Toggle the bit for current character
        # 'a' -> bit 0, 'b' -> bit 1, ..., 'j' -> bit 9
        bit = ord(char) - ord('a')
        mask ^= (1 << bit)

        # Case 1: All characters appear even number of times
        # If we've seen this mask before, all characters between
        # that occurrence and now have even counts
        result += count[mask]

        # Case 2: Exactly one character appears odd number of times
        # We need masks that differ by exactly one bit
        for i in range(10):
            # Flip the i-th bit and check if we've seen that mask
            target_mask = mask ^ (1 << i)
            result += count[target_mask]

        # Add current mask to count for future substrings
        count[mask] += 1

    return result
```

```javascript
// Time: O(10n) = O(n) | Space: O(2^10) = O(1024) = O(1)
function wonderfulSubstrings(word) {
  // count[mask] stores how many times we've seen this mask before
  const count = new Array(1024).fill(0); // 2^10 possible masks
  count[0] = 1; // empty prefix has all even counts

  let mask = 0; // current parity mask
  let result = 0;

  for (let char of word) {
    // Toggle the bit for current character
    // 'a' -> bit 0, 'b' -> bit 1, ..., 'j' -> bit 9
    const bit = char.charCodeAt(0) - "a".charCodeAt(0);
    mask ^= 1 << bit;

    // Case 1: All characters appear even number of times
    // If we've seen this mask before, all characters between
    // that occurrence and now have even counts
    result += count[mask];

    // Case 2: Exactly one character appears odd number of times
    // We need masks that differ by exactly one bit
    for (let i = 0; i < 10; i++) {
      // Flip the i-th bit and check if we've seen that mask
      const targetMask = mask ^ (1 << i);
      result += count[targetMask];
    }

    // Add current mask to count for future substrings
    count[mask]++;
  }

  return result;
}
```

```java
// Time: O(10n) = O(n) | Space: O(2^10) = O(1024) = O(1)
public long wonderfulSubstrings(String word) {
    // count[mask] stores how many times we've seen this mask before
    long[] count = new long[1024];  // 2^10 possible masks
    count[0] = 1;  // empty prefix has all even counts

    int mask = 0;  // current parity mask
    long result = 0;

    for (int idx = 0; idx < word.length(); idx++) {
        char c = word.charAt(idx);
        // Toggle the bit for current character
        // 'a' -> bit 0, 'b' -> bit 1, ..., 'j' -> bit 9
        int bit = c - 'a';
        mask ^= (1 << bit);

        // Case 1: All characters appear even number of times
        // If we've seen this mask before, all characters between
        // that occurrence and now have even counts
        result += count[mask];

        // Case 2: Exactly one character appears odd number of times
        // We need masks that differ by exactly one bit
        for (int i = 0; i < 10; i++) {
            // Flip the i-th bit and check if we've seen that mask
            int targetMask = mask ^ (1 << i);
            result += count[targetMask];
        }

        // Add current mask to count for future substrings
        count[mask]++;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(10n) = O(n)**

- We iterate through the string once: O(n)
- For each character, we check 10 possible bit flips: O(10)
- Total: O(10n) = O(n)

**Space Complexity: O(1024) = O(1)**

- We store counts for 2¹⁰ = 1024 possible masks
- This is constant space regardless of input size
- The mask variable uses O(1) space

## Common Mistakes

1. **Forgetting to initialize count[0] = 1**: The empty prefix (mask = 0) should count as one occurrence. Without this, you'll miss substrings that start at the beginning.

2. **Using int instead of long for result**: The result can be up to n²/2 where n ≤ 10⁵, which exceeds 32-bit integer range (2.5×10⁹). Always use 64-bit integers.

3. **Incorrect bit manipulation**: Remember that 'a' corresponds to bit 0, not bit 1. Also, use XOR (^) not OR (|) to toggle bits.

4. **Checking wrong masks for the "one odd" case**: You need to check masks that differ by exactly one bit from current mask, which is `mask ^ (1 << i)` for i = 0..9, not `mask | (1 << i)`.

## When You'll See This Pattern

This problem combines **prefix sums** with **bitmask representation** and **XOR properties**:

1. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hashmap to find subarrays summing to K. Similar to finding masks that match certain criteria.

2. **Find the Longest Awesome Substring (LeetCode 1542)**: Almost identical pattern - find longest substring where characters can be rearranged to form a palindrome (at most one odd count).

3. **Count Number of Nice Subarrays (LeetCode 1248)**: Uses prefix sums with modulo arithmetic to count subarrays with exactly K odd numbers.

The core pattern: When you need to count subarrays/substrings with some parity or count property, think about using prefix tracking with efficient lookup.

## Key Takeaways

1. **Bitmasks for parity**: When dealing with "odd/even" counts for a limited set of items (≤ 32), bitmasks provide O(1) representation and manipulation.

2. **Prefix XOR for substring properties**: The XOR of prefix masks gives the mask for any substring, similar to how prefix sums give subarray sums.

3. **HashMap for frequency counting**: Store counts of previously seen states to efficiently find matching prefixes in O(1) time.

[Practice this problem on CodeJeet](/problem/number-of-wonderful-substrings)
