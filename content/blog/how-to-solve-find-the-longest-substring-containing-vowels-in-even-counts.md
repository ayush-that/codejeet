---
title: "How to Solve Find the Longest Substring Containing Vowels in Even Counts — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Longest Substring Containing Vowels in Even Counts. Medium difficulty, 75.7% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Prefix Sum."
date: "2026-11-02"
category: "dsa-patterns"
tags:
  [
    "find-the-longest-substring-containing-vowels-in-even-counts",
    "hash-table",
    "string",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve "Find the Longest Substring Containing Vowels in Even Counts"

This problem asks us to find the longest substring where each vowel (a, e, i, o, u) appears an even number of times. What makes this problem interesting is that we need to track the parity (even/odd) of five different vowels simultaneously, and we're looking for substrings where all five have even counts. The challenge is doing this efficiently without checking every possible substring.

## Visual Walkthrough

Let's trace through an example: `s = "eleetminicoworoep"`

We need to track the parity (even = 0, odd = 1) of each vowel as we move through the string. Think of it as a 5-bit state where each bit represents a vowel's parity:

- Bit 0: 'a' parity
- Bit 1: 'e' parity
- Bit 2: 'i' parity
- Bit 3: 'o' parity
- Bit 4: 'u' parity

Starting with state `00000` (all vowels have even count = 0):

1. `e` → toggle 'e' bit → state = `00010`
2. `l` → not a vowel → state = `00010`
3. `e` → toggle 'e' bit → state = `00000` (back to all even!)
   - Distance from start: index 2 - (-1) = 3 → substring "ele"
4. `e` → toggle 'e' bit → state = `00010`
5. `t` → not a vowel → state = `00010`
6. `m` → not a vowel → state = `00010`
7. `i` → toggle 'i' bit → state = `00110`
8. `n` → not a vowel → state = `00110`
9. `i` → toggle 'i' bit → state = `00010`
10. `c` → not a vowel → state = `00010`
11. `o` → toggle 'o' bit → state = `01010`
12. `w` → not a vowel → state = `01010`
13. `o` → toggle 'o' bit → state = `00010`
14. `r` → not a vowel → state = `00010`
15. `o` → toggle 'o' bit → state = `01010`
16. `e` → toggle 'e' bit → state = `01000`
17. `p` → not a vowel → state = `01000`

The key insight: **when we see the same state twice, the substring between those positions has all vowels with even counts**. Why? Because if the parity state is the same at two different positions, the changes between those positions must have canceled out - meaning all vowels that changed did so an even number of times.

## Brute Force Approach

The brute force solution would check every possible substring `(i, j)` and count the vowels in each substring:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Count vowels in substring s[i:j+1]
4. Check if all counts are even
5. Track the maximum length

This approach has O(n³) time complexity (O(n²) substrings × O(n) to count vowels for each). For n = 10⁵ (typical constraint), this is completely infeasible.

Even with optimization (keeping running counts as we extend j), we'd still have O(n²) time, which is too slow for large inputs.

## Optimized Approach

The key insight comes from recognizing this as a **prefix sum with parity** problem:

1. **Parity tracking**: Instead of counting exact numbers, we only care if each vowel count is even or odd. We can represent this as a 5-bit mask.

2. **Prefix states**: As we process the string left to right, we maintain the current parity state. The state at position `i` represents the parity of vowels from index 0 to i.

3. **Subarray property**: For any substring `(i, j]`, the parity state is the XOR of states at j and i. If they're equal, the XOR is 0, meaning all vowels have even counts in that substring.

4. **Hash map for first occurrence**: We store the first index where each state appears. When we see a state again at position j, the substring from `first_occurrence[state] + 1` to j has all even vowels.

This transforms the problem into: "Find the longest distance between two positions with the same parity state."

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(32) = O(1) since we have at most 32 states (2^5)
def findTheLongestSubstring(s: str) -> int:
    """
    Find the longest substring where each vowel appears an even number of times.

    Approach: Use a bitmask to track vowel parity and a hashmap to store
    the first occurrence of each state. When we see a state again, the
    substring between has all vowels with even counts.
    """
    # Map vowels to their bit positions
    vowel_to_bit = {'a': 0, 'e': 1, 'i': 2, 'o': 3, 'u': 4}

    # Initialize state_map: state -> first index where this state occurred
    # Start with state 0 at index -1 (before the string starts)
    state_map = {0: -1}

    current_state = 0  # 5-bit mask representing parity of each vowel
    max_length = 0

    for i, char in enumerate(s):
        if char in vowel_to_bit:
            # Toggle the bit for this vowel (XOR with 1 at that position)
            bit_position = vowel_to_bit[char]
            current_state ^= (1 << bit_position)

        # Check if we've seen this state before
        if current_state in state_map:
            # The substring from state_map[current_state] + 1 to i
            # has all vowels with even counts
            length = i - state_map[current_state]
            max_length = max(max_length, length)
        else:
            # First time seeing this state, store its index
            state_map[current_state] = i

    return max_length
```

```javascript
// Time: O(n) | Space: O(32) = O(1)
/**
 * Find the longest substring where each vowel appears an even number of times.
 *
 * Approach: Use a bitmask to track vowel parity and a map to store
 * the first occurrence of each state. When we see a state again, the
 * substring between has all vowels with even counts.
 */
function findTheLongestSubstring(s) {
  // Map vowels to their bit positions
  const vowelToBit = {
    a: 0,
    e: 1,
    i: 2,
    o: 3,
    u: 4,
  };

  // Initialize stateMap: state -> first index where this state occurred
  // Start with state 0 at index -1 (before the string starts)
  const stateMap = new Map();
  stateMap.set(0, -1);

  let currentState = 0; // 5-bit mask representing parity of each vowel
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const bitPosition = vowelToBit[char];

    if (bitPosition !== undefined) {
      // Toggle the bit for this vowel (XOR with 1 at that position)
      currentState ^= 1 << bitPosition;
    }

    // Check if we've seen this state before
    if (stateMap.has(currentState)) {
      // The substring from stateMap.get(currentState) + 1 to i
      // has all vowels with even counts
      const length = i - stateMap.get(currentState);
      maxLength = Math.max(maxLength, length);
    } else {
      // First time seeing this state, store its index
      stateMap.set(currentState, i);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(32) = O(1)
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Find the longest substring where each vowel appears an even number of times.
     *
     * Approach: Use a bitmask to track vowel parity and a hashmap to store
     * the first occurrence of each state. When we see a state again, the
     * substring between has all vowels with even counts.
     */
    public int findTheLongestSubstring(String s) {
        // Map vowels to their bit positions
        Map<Character, Integer> vowelToBit = new HashMap<>();
        vowelToBit.put('a', 0);
        vowelToBit.put('e', 1);
        vowelToBit.put('i', 2);
        vowelToBit.put('o', 3);
        vowelToBit.put('u', 4);

        // Initialize stateMap: state -> first index where this state occurred
        // Start with state 0 at index -1 (before the string starts)
        Map<Integer, Integer> stateMap = new HashMap<>();
        stateMap.put(0, -1);

        int currentState = 0;  // 5-bit mask representing parity of each vowel
        int maxLength = 0;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (vowelToBit.containsKey(c)) {
                // Toggle the bit for this vowel (XOR with 1 at that position)
                int bitPosition = vowelToBit.get(c);
                currentState ^= (1 << bitPosition);
            }

            // Check if we've seen this state before
            if (stateMap.containsKey(currentState)) {
                // The substring from stateMap.get(currentState) + 1 to i
                // has all vowels with even counts
                int length = i - stateMap.get(currentState);
                maxLength = Math.max(maxLength, length);
            } else {
                // First time seeing this state, store its index
                stateMap.put(currentState, i);
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length n
- Each character requires O(1) operations: checking if it's a vowel, updating the bitmask, and hash map operations
- Hash map operations (get/put) are O(1) on average

**Space Complexity: O(1)**

- We store at most 32 states in the hash map (2^5 possible bitmasks)
- The vowel mapping uses constant space
- Other variables use constant space
- This is considered O(1) space since it doesn't scale with input size

## Common Mistakes

1. **Forgetting to initialize with state 0 at index -1**: This handles the case where the entire prefix up to some point has all even vowels. Without this, you'd miss substrings starting at index 0.

2. **Using an array instead of hash map for state storage**: Some candidates try to use an array of size 32, which works but is less general. The hash map approach is clearer and handles the sparse nature of the state space.

3. **Incorrect bit manipulation**: Common errors include:
   - Using addition instead of XOR: `current_state += (1 << bit_position)` doesn't toggle the bit
   - Not shifting correctly: `1 << bit_position` creates a mask with 1 at the right position
   - Confusing bit positions for different vowels

4. **Not handling non-vowel characters correctly**: Non-vowels don't change the state, so we should only update the state for vowels. Some candidates try to include all characters in the state, which is incorrect.

## When You'll See This Pattern

This "prefix sum with parity + hash map" pattern appears in several problems:

1. **525. Contiguous Array**: Find the maximum length subarray with equal number of 0s and 1s. Similar idea: use +1 for 1s and -1 for 0s, track running sum, find longest distance between equal sums.

2. **560. Subarray Sum Equals K**: Find number of subarrays summing to k. Use prefix sums and hash map to count occurrences of (prefix_sum - k).

3. **1371. Find the Longest Substring Containing Vowels in Even Counts**: This exact problem - the canonical example of the pattern.

4. **1542. Find Longest Awesome Substring**: Find longest substring that can be made into a palindrome with rearrangements. Similar bitmask approach tracking character parity.

The core pattern: when you need to find subarrays/substrings with some property related to counts or parity, consider using prefix sums/states with a hash map to store first occurrences.

## Key Takeaways

1. **Bitmasks for tracking multiple parity states**: When you need to track even/odd status of multiple independent items, a bitmask is efficient. Each bit represents one item's parity (0 = even, 1 = odd).

2. **Prefix state + hash map for substring problems**: If a substring property depends on the difference between prefix states, store first occurrences in a hash map. Equal states mean the property holds between them.

3. **Initialize with base case**: Always consider what state represents "before the string starts" (usually state 0 at index -1). This handles substrings starting at the beginning.

[Practice this problem on CodeJeet](/problem/find-the-longest-substring-containing-vowels-in-even-counts)
