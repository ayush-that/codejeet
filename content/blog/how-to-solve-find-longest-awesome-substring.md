---
title: "How to Solve Find Longest Awesome Substring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Longest Awesome Substring. Hard difficulty, 46.6% acceptance rate. Topics: Hash Table, String, Bit Manipulation."
date: "2029-11-11"
category: "dsa-patterns"
tags: ["find-longest-awesome-substring", "hash-table", "string", "bit-manipulation", "hard"]
---

# How to Solve Find Longest Awesome Substring

This problem asks us to find the longest substring where we can rearrange its characters to form a palindrome. What makes this tricky is that we need to check many possible substrings efficiently, and the palindrome condition depends on character frequencies rather than the exact arrangement.

## Visual Walkthrough

Let's trace through `s = "3242415"` to build intuition.

A substring can be rearranged into a palindrome if at most one character has an odd count. For example:

- `"242"` → counts: 2:2, 4:1 → one odd count → valid palindrome "242"
- `"3242"` → counts: 3:1, 2:2, 4:1 → two odd counts → not a palindrome

The key insight: we can track odd/even counts using bitmask. Each bit represents whether a digit (0-9) has odd count (1) or even count (0).

Let's process `s = "3242415"`:

- Start with mask `0000000000` (all digits even)
- `s[0] = '3'`: toggle bit 3 → `0000001000`
- `s[1] = '2'`: toggle bit 2 → `0000001100`
- `s[2] = '4'`: toggle bit 4 → `0000011100`
- `s[3] = '2'`: toggle bit 2 → `0000011000`
- `s[4] = '4'`: toggle bit 4 → `0000001000`
- `s[5] = '1'`: toggle bit 1 → `0000001010`
- `s[6] = '5'`: toggle bit 5 → `0000101010`

Now, a substring `s[i:j]` has at most one odd count if:

1. Mask at `j` equals mask at `i-1` (all digits even in substring), OR
2. Mask at `j` differs from mask at `i-1` by exactly one bit (one odd count)

For example, substring `s[1:4] = "242"`:

- Mask at index 4: `0000001000`
- Mask at index 0: `0000001000`
- They're equal → all digits even in substring → valid!

Substring `s[2:5] = "424"`:

- Mask at index 5: `0000001010`
- Mask at index 1: `0000001100`
- XOR = `0000000110` (bits 1 and 2 differ)
- Not valid (more than one odd)

## Brute Force Approach

A naive solution would check all O(n²) substrings. For each substring, count digit frequencies and check if at most one has odd count. This takes O(n³) time with basic implementation or O(n² × 10) with optimization.

```python
def longestAwesomeBrute(s):
    max_len = 0
    n = len(s)

    for i in range(n):
        counts = [0] * 10
        for j in range(i, n):
            digit = int(s[j])
            counts[digit] += 1

            # Check if substring can be palindrome
            odd_count = 0
            for c in counts:
                if c % 2 == 1:
                    odd_count += 1
                    if odd_count > 1:
                        break

            if odd_count <= 1:
                max_len = max(max_len, j - i + 1)

    return max_len
```

This is O(n² × 10) time and O(1) space (excluding input). For n up to 10⁵, this is far too slow (10¹⁰ operations).

## Optimized Approach

The key insight is using **prefix bitmasks** and a **hash map** to find matching masks efficiently.

1. **Bitmask representation**: Use a 10-bit integer where bit k is 1 if digit k has odd count so far.
2. **Prefix masks**: Store mask after processing each prefix of s.
3. **Palindrome condition**: Substring s[i:j] is awesome if:
   - `mask[j] == mask[i-1]` (all digits have even count in substring), OR
   - `mask[j] ^ mask[i-1]` has exactly one bit set (one digit has odd count)
4. **Efficient search**: For current mask, check:
   - Have we seen this exact mask before? If yes, substring between has all even counts.
   - For each of 10 possible toggles (flip one bit), have we seen that mask? If yes, substring has exactly one odd count.

This reduces the problem to O(n × 10) time: we process each character once, and for each, check 11 possible masks (current + 10 toggles).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n × 10) = O(n) since 10 is constant
# Space: O(2^10) = O(1024) = O(1) for the hash map
def longestAwesome(s: str) -> int:
    # Dictionary to store first occurrence of each mask
    # mask -> first index where this mask appears
    first_seen = {}

    # Initialize: mask 0 (all even) appears before start (index -1)
    first_seen[0] = -1

    mask = 0  # Current bitmask (10 bits for digits 0-9)
    max_len = 0

    for i, char in enumerate(s):
        digit = ord(char) - ord('0')  # Convert char to int

        # Toggle the bit for this digit
        # XOR with (1 << digit) flips the bit
        mask ^= (1 << digit)

        # Case 1: All digits have even count in substring
        # If we've seen this exact mask before, substring between has all even counts
        if mask in first_seen:
            max_len = max(max_len, i - first_seen[mask])
        else:
            # Store first occurrence of this mask
            first_seen[mask] = i

        # Case 2: Exactly one digit has odd count in substring
        # Check all 10 possible masks that differ by one bit
        for digit in range(10):
            # Create mask with one bit toggled
            target_mask = mask ^ (1 << digit)

            # If we've seen this mask before, substring has exactly one odd count
            if target_mask in first_seen:
                max_len = max(max_len, i - first_seen[target_mask])

    return max_len
```

```javascript
// Time: O(n × 10) = O(n) since 10 is constant
// Space: O(2^10) = O(1024) = O(1) for the hash map
function longestAwesome(s) {
  // Map to store first occurrence of each mask
  // mask -> first index where this mask appears
  const firstSeen = new Map();

  // Initialize: mask 0 (all even) appears before start (index -1)
  firstSeen.set(0, -1);

  let mask = 0; // Current bitmask (10 bits for digits 0-9)
  let maxLen = 0;

  for (let i = 0; i < s.length; i++) {
    const digit = s.charCodeAt(i) - "0".charCodeAt(0);

    // Toggle the bit for this digit
    // XOR with (1 << digit) flips the bit
    mask ^= 1 << digit;

    // Case 1: All digits have even count in substring
    // If we've seen this exact mask before, substring between has all even counts
    if (firstSeen.has(mask)) {
      maxLen = Math.max(maxLen, i - firstSeen.get(mask));
    } else {
      // Store first occurrence of this mask
      firstSeen.set(mask, i);
    }

    // Case 2: Exactly one digit has odd count in substring
    // Check all 10 possible masks that differ by one bit
    for (let digit = 0; digit < 10; digit++) {
      // Create mask with one bit toggled
      const targetMask = mask ^ (1 << digit);

      // If we've seen this mask before, substring has exactly one odd count
      if (firstSeen.has(targetMask)) {
        maxLen = Math.max(maxLen, i - firstSeen.get(targetMask));
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n × 10) = O(n) since 10 is constant
// Space: O(2^10) = O(1024) = O(1) for the hash map
class Solution {
    public int longestAwesome(String s) {
        // Map to store first occurrence of each mask
        // mask -> first index where this mask appears
        Map<Integer, Integer> firstSeen = new HashMap<>();

        // Initialize: mask 0 (all even) appears before start (index -1)
        firstSeen.put(0, -1);

        int mask = 0;  // Current bitmask (10 bits for digits 0-9)
        int maxLen = 0;

        for (int i = 0; i < s.length(); i++) {
            int digit = s.charAt(i) - '0';

            // Toggle the bit for this digit
            // XOR with (1 << digit) flips the bit
            mask ^= (1 << digit);

            // Case 1: All digits have even count in substring
            // If we've seen this exact mask before, substring between has all even counts
            if (firstSeen.containsKey(mask)) {
                maxLen = Math.max(maxLen, i - firstSeen.get(mask));
            } else {
                // Store first occurrence of this mask
                firstSeen.put(mask, i);
            }

            // Case 2: Exactly one digit has odd count in substring
            // Check all 10 possible masks that differ by one bit
            for (int d = 0; d < 10; d++) {
                // Create mask with one bit toggled
                int targetMask = mask ^ (1 << d);

                // If we've seen this mask before, substring has exactly one odd count
                if (firstSeen.containsKey(targetMask)) {
                    maxLen = Math.max(maxLen, i - firstSeen.get(targetMask));
                }
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × 10) = O(n)

- We iterate through the string once: O(n)
- For each position, we check the current mask and 10 possible toggles: O(11) = O(1)
- Total: O(n × 11) = O(n)

**Space Complexity**: O(2¹⁰) = O(1024) = O(1)

- We store at most 2¹⁰ = 1024 different masks in the hash map
- This is constant regardless of input size

## Common Mistakes

1. **Forgetting to initialize with mask 0 at index -1**: Without this, we miss substrings starting at index 0 that have all even counts. The mask 0 represents "no characters processed yet, all counts even."

2. **Checking only exact mask matches**: Candidates often forget the case where exactly one digit has odd count. Remember to check all 10 possible masks that differ by one bit.

3. **Using array instead of hash map for mask storage**: An array of size 2¹⁰ works, but candidates might try larger arrays or lists without considering the fixed 10-digit constraint.

4. **Incorrect bit manipulation**: Using addition instead of XOR to toggle bits. XOR (^) flips the bit: 0→1, 1→0. Addition would give wrong results for multiple toggles.

## When You'll See This Pattern

This problem combines **prefix sums** with **bitmask representation** and **hash map lookups** — a powerful pattern for substring problems with parity constraints:

1. **Find Longest Substring with At Most K Distinct Characters** (LeetCode 340): Uses hash map to track character counts, similar sliding window concept.

2. **Subarray Sum Equals K** (LeetCode 560): Uses prefix sums and hash map to find subarrays with target sum, similar to finding matching masks.

3. **Count Number of Nice Subarrays** (LeetCode 1248): Uses prefix sums and parity (odd/even counts) with hash map.

4. **Maximum Size Subarray Sum Equals k** (LeetCode 325): Similar prefix sum + hash map pattern for finding maximum length.

The core pattern: when you need to find subarrays/substrings satisfying some aggregate property (sum, parity, etc.), consider using prefix computations and storing results in a hash map for O(1) lookups.

## Key Takeaways

1. **Bitmask for parity problems**: When dealing with odd/even counts or toggle states, bitmasks provide compact O(1) representation and manipulation.

2. **Prefix + hash map pattern**: For substring problems where the property depends on the difference between two points (like prefix[i] - prefix[j]), store prefix values in a hash map for efficient lookback.

3. **Think about what makes a palindrome**: A string can be rearranged into a palindrome if at most one character has odd count. This transforms a rearrangement problem into a counting problem.

[Practice this problem on CodeJeet](/problem/find-longest-awesome-substring)
