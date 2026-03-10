---
title: "How to Solve Maximum XOR of Two Numbers in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum XOR of Two Numbers in an Array. Medium difficulty, 53.4% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Trie."
date: "2028-08-06"
category: "dsa-patterns"
tags:
  ["maximum-xor-of-two-numbers-in-an-array", "array", "hash-table", "bit-manipulation", "medium"]
---

# How to Solve Maximum XOR of Two Numbers in an Array

This problem asks us to find the maximum XOR value between any two numbers in an array. What makes this problem interesting is that while a brute force approach is straightforward, the optimal solution requires clever bit manipulation and a specialized data structure to achieve efficient performance.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 10, 5, 25, 2, 8]`

The maximum XOR in this array is `28` (from `5 XOR 25 = 28`). Let's understand why:

1. In binary:
   - 3 = 00011
   - 10 = 01010
   - 5 = 00101
   - 25 = 11001
   - 2 = 00010
   - 8 = 01000

2. The key insight: For maximum XOR, we want bits that are opposite at each position. The highest possible XOR would have the leftmost bit set to 1.

3. Looking at our numbers:
   - The maximum number is 25 (11001), which has the leftmost bit (bit position 4) set to 1
   - To maximize XOR with 25, we want a number with bit 4 = 0
   - 5 (00101) has bit 4 = 0, and `25 XOR 5 = 28` (11100)

4. The challenge is finding this optimal pairing efficiently without checking all O(n²) pairs.

## Brute Force Approach

The most straightforward solution is to check every possible pair of numbers:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def findMaximumXOR_brute(nums):
    """
    Brute force approach - check every pair
    """
    max_xor = 0
    n = len(nums)

    # Check every possible pair (i, j)
    for i in range(n):
        for j in range(i, n):  # j starts from i to avoid duplicate pairs
            current_xor = nums[i] ^ nums[j]
            max_xor = max(max_xor, current_xor)

    return max_xor
```

```javascript
// Time: O(n²) | Space: O(1)
function findMaximumXORBrute(nums) {
  /**
   * Brute force approach - check every pair
   */
  let maxXor = 0;
  const n = nums.length;

  // Check every possible pair (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // j starts from i to avoid duplicate pairs
      const currentXor = nums[i] ^ nums[j];
      maxXor = Math.max(maxXor, currentXor);
    }
  }

  return maxXor;
}
```

```java
// Time: O(n²) | Space: O(1)
public int findMaximumXORBrute(int[] nums) {
    /**
     * Brute force approach - check every pair
     */
    int maxXor = 0;
    int n = nums.length;

    // Check every possible pair (i, j)
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {  // j starts from i to avoid duplicate pairs
            int currentXor = nums[i] ^ nums[j];
            maxXor = Math.max(maxXor, currentXor);
        }
    }

    return maxXor;
}
```

</div>

**Why this is insufficient:** With n up to 2×10⁴, O(n²) operations (400 million in worst case) is far too slow. We need an approach that scales better.

## Optimized Approach

The key insight comes from understanding XOR properties and using a **bitwise Trie** (prefix tree):

1. **Bitwise thinking**: For maximum XOR, we want to maximize the number of positions where bits differ. Starting from the most significant bit (MSB), we prefer to have opposite bits.

2. **Trie structure**: We can store all numbers in a binary trie where each node has two children (0 and 1). This allows us to efficiently find, for any number, the number in the array that gives maximum XOR with it.

3. **Greedy approach**: For each number, we traverse the trie trying to take the opposite bit at each position. If the opposite bit exists, we take it (adding 1 to that bit position in our result). If not, we take the same bit.

4. **Build and query**: We build the trie with all numbers, then for each number, query the trie to find its best XOR partner. The maximum across all queries is our answer.

## Optimal Solution

Here's the optimal solution using a bitwise Trie:

<div class="code-group">

```python
# Time: O(n * L) | Space: O(n * L) where L is max bit length (32 for 32-bit integers)
class TrieNode:
    def __init__(self):
        # Each node has two children: for bit 0 and bit 1
        self.children = [None, None]

class Solution:
    def findMaximumXOR(self, nums):
        """
        Find maximum XOR of any two numbers in the array using a bitwise Trie
        """
        if not nums or len(nums) < 2:
            return 0

        # Find maximum number to determine bit length needed
        max_num = max(nums)
        # Calculate number of bits needed (position of highest set bit + 1)
        max_bit_len = max_num.bit_length() if max_num > 0 else 1

        # Initialize root of trie
        root = TrieNode()
        max_xor = 0

        # Build trie and query for maximum XOR simultaneously
        for num in nums:
            # Insert current number into trie
            node = root
            # Query trie for best XOR partner for current number
            query_node = root
            current_xor = 0

            # Process from most significant bit to least significant
            for bit_pos in range(max_bit_len - 1, -1, -1):
                # Extract current bit (0 or 1)
                current_bit = (num >> bit_pos) & 1
                # Opposite bit is what we want for maximum XOR
                opposite_bit = 1 - current_bit

                # --- Insert current number into trie ---
                if node.children[current_bit] is None:
                    node.children[current_bit] = TrieNode()
                node = node.children[current_bit]

                # --- Query for best XOR partner ---
                # Try to take opposite bit if available
                if query_node.children[opposite_bit] is not None:
                    current_xor |= (1 << bit_pos)  # Set this bit in result
                    query_node = query_node.children[opposite_bit]
                else:
                    # Opposite not available, take same bit
                    query_node = query_node.children[current_bit]

            # Update maximum XOR found so far
            max_xor = max(max_xor, current_xor)

        return max_xor
```

```javascript
// Time: O(n * L) | Space: O(n * L) where L is max bit length (32 for 32-bit integers)
class TrieNode {
  constructor() {
    // Each node has two children: for bit 0 and bit 1
    this.children = [null, null];
  }
}

function findMaximumXOR(nums) {
  /**
   * Find maximum XOR of any two numbers in the array using a bitwise Trie
   */
  if (!nums || nums.length < 2) {
    return 0;
  }

  // Find maximum number to determine bit length needed
  const maxNum = Math.max(...nums);
  // Calculate number of bits needed (position of highest set bit + 1)
  const maxBitLen = maxNum > 0 ? Math.floor(Math.log2(maxNum)) + 1 : 1;

  // Initialize root of trie
  const root = new TrieNode();
  let maxXor = 0;

  // Build trie and query for maximum XOR simultaneously
  for (const num of nums) {
    // Insert current number into trie
    let node = root;
    // Query trie for best XOR partner for current number
    let queryNode = root;
    let currentXor = 0;

    // Process from most significant bit to least significant
    for (let bitPos = maxBitLen - 1; bitPos >= 0; bitPos--) {
      // Extract current bit (0 or 1)
      const currentBit = (num >> bitPos) & 1;
      // Opposite bit is what we want for maximum XOR
      const oppositeBit = 1 - currentBit;

      // --- Insert current number into trie ---
      if (!node.children[currentBit]) {
        node.children[currentBit] = new TrieNode();
      }
      node = node.children[currentBit];

      // --- Query for best XOR partner ---
      // Try to take opposite bit if available
      if (queryNode.children[oppositeBit]) {
        currentXor |= 1 << bitPos; // Set this bit in result
        queryNode = queryNode.children[oppositeBit];
      } else {
        // Opposite not available, take same bit
        queryNode = queryNode.children[currentBit];
      }
    }

    // Update maximum XOR found so far
    maxXor = Math.max(maxXor, currentXor);
  }

  return maxXor;
}
```

```java
// Time: O(n * L) | Space: O(n * L) where L is max bit length (32 for 32-bit integers)
class TrieNode {
    TrieNode[] children;

    public TrieNode() {
        // Each node has two children: for bit 0 and bit 1
        children = new TrieNode[2];
    }
}

class Solution {
    public int findMaximumXOR(int[] nums) {
        /**
         * Find maximum XOR of any two numbers in the array using a bitwise Trie
         */
        if (nums == null || nums.length < 2) {
            return 0;
        }

        // Find maximum number to determine bit length needed
        int maxNum = Integer.MIN_VALUE;
        for (int num : nums) {
            maxNum = Math.max(maxNum, num);
        }
        // Calculate number of bits needed (position of highest set bit + 1)
        int maxBitLen = maxNum > 0 ? Integer.toBinaryString(maxNum).length() : 1;

        // Initialize root of trie
        TrieNode root = new TrieNode();
        int maxXor = 0;

        // Build trie and query for maximum XOR simultaneously
        for (int num : nums) {
            // Insert current number into trie
            TrieNode node = root;
            // Query trie for best XOR partner for current number
            TrieNode queryNode = root;
            int currentXor = 0;

            // Process from most significant bit to least significant
            for (int bitPos = maxBitLen - 1; bitPos >= 0; bitPos--) {
                // Extract current bit (0 or 1)
                int currentBit = (num >> bitPos) & 1;
                // Opposite bit is what we want for maximum XOR
                int oppositeBit = 1 - currentBit;

                // --- Insert current number into trie ---
                if (node.children[currentBit] == null) {
                    node.children[currentBit] = new TrieNode();
                }
                node = node.children[currentBit];

                // --- Query for best XOR partner ---
                // Try to take opposite bit if available
                if (queryNode.children[oppositeBit] != null) {
                    currentXor |= (1 << bitPos);  // Set this bit in result
                    queryNode = queryNode.children[oppositeBit];
                } else {
                    // Opposite not available, take same bit
                    queryNode = queryNode.children[currentBit];
                }
            }

            // Update maximum XOR found so far
            maxXor = Math.max(maxXor, currentXor);
        }

        return maxXor;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × L)**

- `n` is the number of elements in the array
- `L` is the maximum bit length (at most 32 for 32-bit integers)
- For each number, we perform L operations to insert it into the trie and L operations to query for its best XOR partner
- In practice, L ≤ 32, so this is effectively O(32n) = O(n)

**Space Complexity: O(n × L)**

- The trie stores each bit of each number
- In worst case, we store n × L nodes
- Each node has 2 children pointers, but many nodes are shared across numbers
- In practice, space is much less than n × L due to prefix sharing

## Common Mistakes

1. **Starting from least significant bit**: Always process from most significant bit (MSB) to least significant bit (LSB). The MSB contributes the most to the XOR value, so we need to prioritize it.

2. **Not calculating correct bit length**: Using a fixed 32 bits for all numbers is inefficient. Calculate the actual maximum bit length needed based on the maximum number in the array.

3. **Forgetting to handle edge cases**:
   - Empty array or single element should return 0
   - All zeros in the array
   - Negative numbers (though constraints typically specify non-negative)

4. **Incorrect opposite bit calculation**: The opposite of bit `b` is `1 - b`, not `~b & 1` (though both work). Be clear in your reasoning.

## When You'll See This Pattern

The bitwise Trie pattern appears in problems where you need to find maximum/minimum XOR, or efficiently query bitwise relationships:

1. **Maximum XOR With an Element From Array (LeetCode 1707)**: Similar concept but with queries - you need to find maximum XOR between a query number and numbers ≤ a limit.

2. **Maximum XOR After Operations (LeetCode 2317)**: While not using a trie, it tests understanding of XOR properties and bit manipulation.

3. **Sum of Prefix Scores of Strings (LeetCode 2416)**: Uses a trie (though for strings, not bits) to efficiently count prefix matches.

4. **Implement Trie (Prefix Tree) (LeetCode 208)**: The fundamental trie implementation problem that builds the foundation for this approach.

## Key Takeaways

1. **Bitwise problems often benefit from prefix structures**: When you need to find optimal bitwise operations between pairs, consider using a binary trie to store prefixes of numbers.

2. **Greedy approach works for XOR maximization**: Starting from MSB, always try to choose the opposite bit if available. This greedy choice leads to the global optimum.

3. **Tries compress shared prefixes**: This makes them space-efficient for storing numbers with common prefixes, which is common in real-world datasets.

4. **Know your bit operations**: Comfort with `>>`, `&`, `|`, and `^` is essential for bit manipulation problems. Practice extracting specific bits and building results bit by bit.

Related problems: [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array), [Maximum XOR After Operations](/problem/maximum-xor-after-operations), [Sum of Prefix Scores of Strings](/problem/sum-of-prefix-scores-of-strings)
