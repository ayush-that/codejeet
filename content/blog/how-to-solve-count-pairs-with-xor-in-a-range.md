---
title: "How to Solve Count Pairs With XOR in a Range — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Pairs With XOR in a Range. Hard difficulty, 46.3% acceptance rate. Topics: Array, Bit Manipulation, Trie."
date: "2026-04-11"
category: "dsa-patterns"
tags: ["count-pairs-with-xor-in-a-range", "array", "bit-manipulation", "trie", "hard"]
---

# How to Solve Count Pairs With XOR in a Range

This problem asks us to count all pairs `(i, j)` in an array where the XOR of the two numbers falls within a given range `[low, high]`. What makes this problem challenging is that a brute force approach checking all pairs would be O(n²), which is too slow for the typical constraints (n up to 2×10⁴). The key insight is that we can use a **binary trie** to efficiently count how many numbers in our array have XOR values within certain bounds with a given number.

## Visual Walkthrough

Let's walk through a small example: `nums = [1, 4, 2, 7]`, `low = 2`, `high = 6`.

We want to count pairs where `low ≤ nums[i] XOR nums[j] ≤ high`. Let's think about this differently: if we could count pairs with XOR ≤ `high`, and subtract pairs with XOR < `low`, we'd get pairs in our range.

For the first number `1` (binary `001`):

- We'll insert it into an empty trie
- No pairs to count yet

For the second number `4` (binary `100`):

- Check how many existing numbers have XOR with `4` ≤ 6
- `1 XOR 4 = 5` (binary `101`), which is ≤ 6 ✓
- Count = 1
- Insert `4` into trie

For the third number `2` (binary `010`):

- Check XOR with existing numbers:
  - `1 XOR 2 = 3` ≤ 6 ✓
  - `4 XOR 2 = 6` ≤ 6 ✓
- Count = 1 + 2 = 3
- Insert `2` into trie

For the fourth number `7` (binary `111`):

- Check XOR with existing numbers:
  - `1 XOR 7 = 6` ≤ 6 ✓
  - `4 XOR 7 = 3` ≤ 6 ✓
  - `2 XOR 7 = 5` ≤ 6 ✓
- Count = 3 + 3 = 6
- Insert `7` into trie

Now we have 6 pairs with XOR ≤ 6. We'd repeat this process for XOR < 2, then subtract to get pairs in range [2, 6].

## Brute Force Approach

The most straightforward solution is to check every possible pair:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countPairs(nums, low, high):
    n = len(nums)
    count = 0

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            xor_val = nums[i] ^ nums[j]
            if low <= xor_val <= high:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countPairs(nums, low, high) {
  let count = 0;
  const n = nums.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const xorVal = nums[i] ^ nums[j];
      if (xorVal >= low && xorVal <= high) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countPairs(int[] nums, int low, int high) {
    int count = 0;
    int n = nums.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int xorVal = nums[i] ^ nums[j];
            if (xorVal >= low && xorVal <= high) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 20,000, O(n²) means up to 200 million operations, which is too slow. We need a solution closer to O(n × log(max_value)).

## Optimized Approach

The key insight is that we can use a **binary trie** (also called a bitwise trie) to efficiently count pairs. Here's the step-by-step reasoning:

1. **Problem Transformation**: Instead of counting pairs where `low ≤ XOR ≤ high`, we can count pairs where `XOR ≤ high` and subtract pairs where `XOR < low`. This gives us pairs in the range `[low, high]`.

2. **Binary Trie Structure**: A binary trie stores numbers by their binary representation. Each node has two children (0 and 1), and we also store a count of how many numbers pass through each node.

3. **Counting Pairs with XOR ≤ K**: For each number `num`, we traverse the trie while tracking the current XOR value. At each bit position:
   - If the current bit of `K` is 1, we can take either path (0 or 1) from the current node
   - If we take the path that matches the current bit of `num`, the XOR at this bit will be 0
   - If we take the opposite path, the XOR at this bit will be 1
   - When `K`'s bit is 1, all numbers in the opposite path will have XOR < K at this bit position, so we can count them all
   - When `K`'s bit is 0, we must follow the path that gives XOR = 0

4. **Efficiency**: Each query takes O(log(max_value)) time, where max_value is the maximum number in the array (up to 2×10⁴, so about 15 bits).

## Optimal Solution

Here's the complete solution using a binary trie:

<div class="code-group">

```python
# Time: O(n × log(max_value)) | Space: O(n × log(max_value))
class TrieNode:
    def __init__(self):
        # Each node has two children for bits 0 and 1
        self.children = [None, None]
        # Count of numbers that pass through this node
        self.count = 0

class Solution:
    def countPairs(self, nums, low, high):
        # Helper function to count pairs with XOR <= k
        def count_pairs_with_xor_less_equal(k):
            root = TrieNode()
            total_pairs = 0

            for num in nums:
                # For each number, count how many previous numbers
                # have XOR with current num <= k
                total_pairs += query(root, num, k)
                # Insert current number into trie for future queries
                insert(root, num)

            return total_pairs

        # Count pairs with XOR in [low, high] =
        # (pairs with XOR <= high) - (pairs with XOR < low)
        return (count_pairs_with_xor_less_equal(high) -
                count_pairs_with_xor_less_equal(low - 1))

def insert(root, num):
    """Insert a number into the binary trie."""
    node = root
    # Process bits from most significant to least significant
    for i in range(MAX_BITS - 1, -1, -1):
        bit = (num >> i) & 1  # Get the i-th bit
        if not node.children[bit]:
            node.children[bit] = TrieNode()
        node = node.children[bit]
        node.count += 1  # Increment count for this node

def query(root, num, k):
    """Count numbers in trie that have XOR with num <= k."""
    if k < 0:
        return 0  # No numbers satisfy XOR <= negative k

    node = root
    count = 0

    for i in range(MAX_BITS - 1, -1, -1):
        if not node:
            break  # Reached end of trie

        num_bit = (num >> i) & 1  # Current bit of num
        k_bit = (k >> i) & 1      # Current bit of k

        if k_bit == 1:
            # If k's bit is 1, we can take the path where XOR bit is 0
            # (which gives us all numbers with XOR < k at this position)
            if node.children[num_bit]:
                count += node.children[num_bit].count

            # Continue with the path where XOR bit is 1
            # (which matches k's bit of 1)
            node = node.children[1 - num_bit]
        else:
            # If k's bit is 0, we must follow the path where XOR bit is 0
            # (to keep XOR <= k)
            node = node.children[num_bit]

    return count

# Maximum bits needed based on constraints (nums[i] <= 2×10⁴)
MAX_BITS = 15  # 2^14 = 16384, 2^15 = 32768
```

```javascript
// Time: O(n × log(max_value)) | Space: O(n × log(max_value))
class TrieNode {
  constructor() {
    // Each node has two children for bits 0 and 1
    this.children = [null, null];
    // Count of numbers that pass through this node
    this.count = 0;
  }
}

// Maximum bits needed based on constraints (nums[i] <= 2×10⁴)
const MAX_BITS = 15; // 2^14 = 16384, 2^15 = 32768

function insert(root, num) {
  /** Insert a number into the binary trie. */
  let node = root;
  // Process bits from most significant to least significant
  for (let i = MAX_BITS - 1; i >= 0; i--) {
    const bit = (num >> i) & 1; // Get the i-th bit
    if (!node.children[bit]) {
      node.children[bit] = new TrieNode();
    }
    node = node.children[bit];
    node.count++; // Increment count for this node
  }
}

function query(root, num, k) {
  /** Count numbers in trie that have XOR with num <= k. */
  if (k < 0) {
    return 0; // No numbers satisfy XOR <= negative k
  }

  let node = root;
  let count = 0;

  for (let i = MAX_BITS - 1; i >= 0; i--) {
    if (!node) {
      break; // Reached end of trie
    }

    const numBit = (num >> i) & 1; // Current bit of num
    const kBit = (k >> i) & 1; // Current bit of k

    if (kBit === 1) {
      // If k's bit is 1, we can take the path where XOR bit is 0
      // (which gives us all numbers with XOR < k at this position)
      if (node.children[numBit]) {
        count += node.children[numBit].count;
      }

      // Continue with the path where XOR bit is 1
      // (which matches k's bit of 1)
      node = node.children[1 - numBit];
    } else {
      // If k's bit is 0, we must follow the path where XOR bit is 0
      // (to keep XOR <= k)
      node = node.children[numBit];
    }
  }

  return count;
}

function countPairs(nums, low, high) {
  /** Helper function to count pairs with XOR <= k */
  function countPairsWithXorLessEqual(k) {
    const root = new TrieNode();
    let totalPairs = 0;

    for (const num of nums) {
      // For each number, count how many previous numbers
      // have XOR with current num <= k
      totalPairs += query(root, num, k);
      // Insert current number into trie for future queries
      insert(root, num);
    }

    return totalPairs;
  }

  // Count pairs with XOR in [low, high] =
  // (pairs with XOR <= high) - (pairs with XOR < low)
  return countPairsWithXorLessEqual(high) - countPairsWithXorLessEqual(low - 1);
}
```

```java
// Time: O(n × log(max_value)) | Space: O(n × log(max_value))
class TrieNode {
    TrieNode[] children;
    int count;

    public TrieNode() {
        // Each node has two children for bits 0 and 1
        this.children = new TrieNode[2];
        // Count of numbers that pass through this node
        this.count = 0;
    }
}

class Solution {
    // Maximum bits needed based on constraints (nums[i] <= 2×10⁴)
    private static final int MAX_BITS = 15; // 2^14 = 16384, 2^15 = 32768

    public int countPairs(int[] nums, int low, int high) {
        // Count pairs with XOR in [low, high] =
        // (pairs with XOR <= high) - (pairs with XOR < low)
        return countPairsWithXorLessEqual(nums, high) -
               countPairsWithXorLessEqual(nums, low - 1);
    }

    private int countPairsWithXorLessEqual(int[] nums, int k) {
        /** Count pairs where XOR <= k */
        TrieNode root = new TrieNode();
        int totalPairs = 0;

        for (int num : nums) {
            // For each number, count how many previous numbers
            // have XOR with current num <= k
            totalPairs += query(root, num, k);
            // Insert current number into trie for future queries
            insert(root, num);
        }

        return totalPairs;
    }

    private void insert(TrieNode root, int num) {
        /** Insert a number into the binary trie. */
        TrieNode node = root;
        // Process bits from most significant to least significant
        for (int i = MAX_BITS - 1; i >= 0; i--) {
            int bit = (num >> i) & 1; // Get the i-th bit
            if (node.children[bit] == null) {
                node.children[bit] = new TrieNode();
            }
            node = node.children[bit];
            node.count++; // Increment count for this node
        }
    }

    private int query(TrieNode root, int num, int k) {
        /** Count numbers in trie that have XOR with num <= k. */
        if (k < 0) {
            return 0; // No numbers satisfy XOR <= negative k
        }

        TrieNode node = root;
        int count = 0;

        for (int i = MAX_BITS - 1; i >= 0; i--) {
            if (node == null) {
                break; // Reached end of trie
            }

            int numBit = (num >> i) & 1; // Current bit of num
            int kBit = (k >> i) & 1;     // Current bit of k

            if (kBit == 1) {
                // If k's bit is 1, we can take the path where XOR bit is 0
                // (which gives us all numbers with XOR < k at this position)
                if (node.children[numBit] != null) {
                    count += node.children[numBit].count;
                }

                // Continue with the path where XOR bit is 1
                // (which matches k's bit of 1)
                node = node.children[1 - numBit];
            } else {
                // If k's bit is 0, we must follow the path where XOR bit is 0
                // (to keep XOR <= k)
                node = node.children[numBit];
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × log(max_value))

- We process each number in the array: O(n)
- For each number, we perform a query and an insert operation on the trie
- Each trie operation processes all bits of the number: O(log(max_value))
- We do this twice (for `high` and `low-1`), but constants are dropped

**Space Complexity:** O(n × log(max_value))

- The trie stores each number's binary representation
- In the worst case, each number creates a new path in the trie
- Each number contributes O(log(max_value)) nodes

## Common Mistakes

1. **Forgetting to handle the case when k < 0**: When counting pairs with XOR < low, we call `countPairsWithXorLessEqual(low - 1)`. If `low = 0`, this becomes -1, and our query function must handle negative k values by returning 0.

2. **Incorrect bit traversal order**: Bits must be processed from most significant to least significant. Processing in reverse order would give incorrect results because the XOR comparison depends on higher-order bits being more significant.

3. **Not updating node counts correctly**: Each node must track how many numbers pass through it. Forgetting to increment `node.count` during insertion or not checking if a child exists before accessing its count are common bugs.

4. **Using the wrong number of bits**: The number of bits needed depends on the maximum value in the array. Using too few bits loses information; using too many is inefficient. For nums[i] ≤ 2×10⁴, 15 bits is sufficient (2¹⁴ = 16384, 2¹⁵ = 32768).

## When You'll See This Pattern

The binary trie pattern appears in problems involving bitwise operations and range queries:

1. **Maximum XOR of Two Numbers in an Array** (LeetCode 421): Find the maximum XOR value between any two numbers. Uses a similar trie structure but looks for the path that maximizes XOR instead of counting within a range.

2. **Count Triplets That Can Form Two Arrays of Equal XOR** (LeetCode 1442): While not using a trie, it involves similar XOR prefix sum concepts.

3. **Find Maximum XOR With an Element From Array** (LeetCode 1707): Combines XOR with queries, requiring optimization techniques similar to this problem.

The key pattern to recognize: when you need to efficiently find numbers that satisfy a bitwise condition (especially XOR) with a given number, a binary trie is often the right approach.

## Key Takeaways

1. **Binary tries are powerful for bitwise problems**: When dealing with XOR, AND, OR operations on numbers, a binary trie lets you efficiently query based on bit patterns.

2. **Transform range queries**: Counting pairs in a range `[low, high]` can often be transformed into counting pairs `≤ high` minus pairs `< low`. This is a common technique for range-based counting problems.

3. **Bit-by-bit decision making**: When comparing XOR values, decisions are made from most significant bit to least significant. Higher bits dominate the comparison, so they must be processed first.

Related problems: [Count Paths With the Given XOR Value](/problem/count-paths-with-the-given-xor-value)
