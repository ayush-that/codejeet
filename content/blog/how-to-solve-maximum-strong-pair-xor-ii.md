---
title: "How to Solve Maximum Strong Pair XOR II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Strong Pair XOR II. Hard difficulty, 32.2% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Trie, Sliding Window."
date: "2026-06-25"
category: "dsa-patterns"
tags: ["maximum-strong-pair-xor-ii", "array", "hash-table", "bit-manipulation", "hard"]
---

# How to Solve Maximum Strong Pair XOR II

This problem asks us to find the maximum XOR value between any two numbers in an array that form a "strong pair" — where the absolute difference between them is less than or equal to the smaller number. The challenge lies in efficiently checking the XOR condition while also filtering for pairs that satisfy the strong pair constraint. With a naive approach taking O(n²) time, we need smarter techniques to handle arrays with up to 10⁵ elements.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3, 4]`

First, let's understand what makes a strong pair. The condition `|x - y| <= min(x, y)` means the difference between two numbers can't exceed the smaller number. This is equivalent to saying `max(x, y) <= 2 * min(x, y)`.

Let's check all possible pairs:

- (1,2): |1-2|=1, min=1 → 1≤1 ✓ strong pair, XOR=3
- (1,3): |1-3|=2, min=1 → 2≤1 ✗ not strong
- (1,4): |1-4|=3, min=1 → 3≤1 ✗ not strong
- (2,3): |2-3|=1, min=2 → 1≤2 ✓ strong pair, XOR=1
- (2,4): |2-4|=2, min=2 → 2≤2 ✓ strong pair, XOR=6
- (3,4): |3-4|=1, min=3 → 1≤3 ✓ strong pair, XOR=7

The maximum XOR among strong pairs is 7 (from pair 3,4).

Now, the key insight: if we sort the array, we can use a sliding window to maintain only valid strong pairs. For a sorted array `[1,2,3,4]`, when we're at index `j`, we need to find all `i < j` such that `nums[j] <= 2 * nums[i]`. This is because in a sorted array, `nums[i]` is the smaller number for any pair `(i,j)`.

## Brute Force Approach

The most straightforward solution is to check every possible pair:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maximumStrongPairXor(nums):
    max_xor = 0
    n = len(nums)

    for i in range(n):
        for j in range(i + 1, n):
            # Check if (nums[i], nums[j]) is a strong pair
            x, y = nums[i], nums[j]
            if abs(x - y) <= min(x, y):
                max_xor = max(max_xor, x ^ y)

    return max_xor
```

```javascript
// Time: O(n²) | Space: O(1)
function maximumStrongPairXor(nums) {
  let maxXor = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if (nums[i], nums[j]) is a strong pair
      const x = nums[i],
        y = nums[j];
      if (Math.abs(x - y) <= Math.min(x, y)) {
        maxXor = Math.max(maxXor, x ^ y);
      }
    }
  }

  return maxXor;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maximumStrongPairXor(int[] nums) {
    int maxXor = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check if (nums[i], nums[j]) is a strong pair
            int x = nums[i], y = nums[j];
            if (Math.abs(x - y) <= Math.min(x, y)) {
                maxXor = Math.max(maxXor, x ^ y);
            }
        }
    }

    return maxXor;
}
```

</div>

This approach is too slow for n up to 10⁵, as it would require about 5×10⁹ operations. We need to optimize both the strong pair checking and the XOR maximization.

## Optimized Approach

The optimized solution combines three key techniques:

1. **Sorting and Sliding Window**: After sorting, for each number `nums[j]`, we maintain a window of valid `nums[i]` values where `nums[j] <= 2 * nums[i]`. This ensures all pairs in our current consideration are strong pairs.

2. **Binary Trie for XOR Maximization**: For each `nums[j]`, we want to find the maximum XOR with any number in our current window. A binary trie allows us to do this in O(32) time (for 32-bit integers) instead of O(window size).

3. **Dynamic Window Management**: As we move `j` forward, we add `nums[j]` to the trie and remove numbers from the left of our window that no longer satisfy the strong pair condition with `nums[j]`.

The key insight is that for a sorted array, if `nums[j] > 2 * nums[i]`, then for any `k > j`, `nums[k] > 2 * nums[i]` will also hold (since the array is sorted). So we can safely remove `nums[i]` from our window.

## Optimal Solution

Here's the complete solution using a binary trie with sliding window:

<div class="code-group">

```python
# Time: O(n log n + 32n) | Space: O(n)
class TrieNode:
    def __init__(self):
        self.children = [None, None]  # 0 and 1 branches
        self.count = 0  # Track how many numbers pass through this node

class Solution:
    def maximumStrongPairXor(self, nums):
        # Sort the array to enable sliding window approach
        nums.sort()
        n = len(nums)

        # Initialize the trie root
        root = TrieNode()

        def insert(num):
            """Insert a number into the trie"""
            node = root
            for i in range(31, -1, -1):
                bit = (num >> i) & 1
                if not node.children[bit]:
                    node.children[bit] = TrieNode()
                node = node.children[bit]
                node.count += 1

        def remove(num):
            """Remove a number from the trie"""
            node = root
            for i in range(31, -1, -1):
                bit = (num >> i) & 1
                node = node.children[bit]
                node.count -= 1

        def get_max_xor(num):
            """Find maximum XOR of num with any number in the trie"""
            node = root
            max_xor = 0

            for i in range(31, -1, -1):
                bit = (num >> i) & 1
                # We want the opposite bit to maximize XOR
                opposite = 1 - bit

                # Check if opposite branch exists and has numbers
                if node.children[opposite] and node.children[opposite].count > 0:
                    max_xor |= (1 << i)  # Set this bit in result
                    node = node.children[opposite]
                else:
                    # Take the same bit if opposite not available
                    node = node.children[bit]

            return max_xor

        max_result = 0
        left = 0

        # Sliding window approach
        for right in range(n):
            # Insert current number into trie
            insert(nums[right])

            # Shrink window from left while condition is violated
            # Condition: nums[right] <= 2 * nums[left]
            while nums[right] > 2 * nums[left]:
                remove(nums[left])
                left += 1

            # Find maximum XOR for current window
            max_result = max(max_result, get_max_xor(nums[right]))

        return max_result
```

```javascript
// Time: O(n log n + 32n) | Space: O(n)
class TrieNode {
  constructor() {
    this.children = [null, null]; // 0 and 1 branches
    this.count = 0; // Track how many numbers pass through this node
  }
}

function maximumStrongPairXor(nums) {
  // Sort the array to enable sliding window approach
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Initialize the trie root
  const root = new TrieNode();

  function insert(num) {
    /** Insert a number into the trie */
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node.children[bit]) {
        node.children[bit] = new TrieNode();
      }
      node = node.children[bit];
      node.count++;
    }
  }

  function remove(num) {
    /** Remove a number from the trie */
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      node = node.children[bit];
      node.count--;
    }
  }

  function getMaxXor(num) {
    /** Find maximum XOR of num with any number in the trie */
    let node = root;
    let maxXor = 0;

    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      // We want the opposite bit to maximize XOR
      const opposite = 1 - bit;

      // Check if opposite branch exists and has numbers
      if (node.children[opposite] && node.children[opposite].count > 0) {
        maxXor |= 1 << i; // Set this bit in result
        node = node.children[opposite];
      } else {
        // Take the same bit if opposite not available
        node = node.children[bit];
      }
    }

    return maxXor;
  }

  let maxResult = 0;
  let left = 0;

  // Sliding window approach
  for (let right = 0; right < n; right++) {
    // Insert current number into trie
    insert(nums[right]);

    // Shrink window from left while condition is violated
    // Condition: nums[right] <= 2 * nums[left]
    while (nums[right] > 2 * nums[left]) {
      remove(nums[left]);
      left++;
    }

    // Find maximum XOR for current window
    maxResult = Math.max(maxResult, getMaxXor(nums[right]));
  }

  return maxResult;
}
```

```java
// Time: O(n log n + 32n) | Space: O(n)
class TrieNode {
    TrieNode[] children;
    int count;

    public TrieNode() {
        children = new TrieNode[2];  // 0 and 1 branches
        count = 0;  // Track how many numbers pass through this node
    }
}

class Solution {
    public int maximumStrongPairXor(int[] nums) {
        // Sort the array to enable sliding window approach
        Arrays.sort(nums);
        int n = nums.length;

        // Initialize the trie root
        TrieNode root = new TrieNode();

        // Sliding window approach
        int maxResult = 0;
        int left = 0;

        for (int right = 0; right < n; right++) {
            // Insert current number into trie
            insert(root, nums[right]);

            // Shrink window from left while condition is violated
            // Condition: nums[right] <= 2 * nums[left]
            while (nums[right] > 2 * nums[left]) {
                remove(root, nums[left]);
                left++;
            }

            // Find maximum XOR for current window
            maxResult = Math.max(maxResult, getMaxXor(root, nums[right]));
        }

        return maxResult;
    }

    private void insert(TrieNode root, int num) {
        /** Insert a number into the trie */
        TrieNode node = root;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (node.children[bit] == null) {
                node.children[bit] = new TrieNode();
            }
            node = node.children[bit];
            node.count++;
        }
    }

    private void remove(TrieNode root, int num) {
        /** Remove a number from the trie */
        TrieNode node = root;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            node = node.children[bit];
            node.count--;
        }
    }

    private int getMaxXor(TrieNode root, int num) {
        /** Find maximum XOR of num with any number in the trie */
        TrieNode node = root;
        int maxXor = 0;

        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            // We want the opposite bit to maximize XOR
            int opposite = 1 - bit;

            // Check if opposite branch exists and has numbers
            if (node.children[opposite] != null && node.children[opposite].count > 0) {
                maxXor |= (1 << i);  // Set this bit in result
                node = node.children[opposite];
            } else {
                // Take the same bit if opposite not available
                node = node.children[bit];
            }
        }

        return maxXor;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + 32n)**

- Sorting takes O(n log n) time
- For each of the n elements, we perform:
  - Insertion into trie: O(32) operations (for 32-bit integers)
  - Removal from trie: O(32) operations (at most n times total)
  - Maximum XOR query: O(32) operations
- The sliding window ensures each element is inserted and removed at most once

**Space Complexity: O(n)**

- The trie stores at most n numbers, with each number taking O(32) nodes
- In practice, this is O(32n) which simplifies to O(n)
- Sorting may use O(log n) or O(n) additional space depending on the algorithm

## Common Mistakes

1. **Not sorting the array first**: Without sorting, you can't use the sliding window technique to efficiently maintain strong pairs. The condition `nums[j] <= 2 * nums[i]` only works when `i < j` in a sorted array.

2. **Forgetting to remove elements from the trie**: When the left pointer moves forward, you must remove the corresponding number from the trie. Otherwise, the trie will contain numbers that are no longer in the valid window, leading to incorrect XOR calculations.

3. **Incorrect bit manipulation in trie**: When building the trie or querying for maximum XOR, off-by-one errors in bit shifting are common. Remember that for 32-bit integers, you should iterate from bit 31 down to 0.

4. **Not handling the count field properly**: The count field in each trie node is crucial for knowing when a branch still contains valid numbers after removals. Forgetting to decrement counts during removal or not checking counts during queries will cause errors.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary Trie for XOR Problems**: The binary trie technique is essential for solving maximum XOR problems efficiently. You'll see it in:
   - [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-array) - The foundational problem for using tries with XOR
   - [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array) - A more complex variant with queries

2. **Sliding Window with Two Pointers**: The technique of maintaining a valid window while iterating through a sorted array appears in many problems:
   - [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters) - Different domain but similar two-pointer approach
   - [Container With Most Water](/problem/container-with-most-water) - Another optimization problem using two pointers

## Key Takeaways

1. **Combine multiple techniques for complex constraints**: When a problem has multiple conditions (like strong pair check AND XOR maximization), look for ways to handle each efficiently and combine them.

2. **Sorting enables window-based approaches**: Many array problems become tractable after sorting, allowing you to use sliding windows or two-pointer techniques to maintain valid subsets.

3. **Binary tries are the go-to for XOR optimization**: Whenever you need to maximize/minimize XOR between pairs or answer XOR queries efficiently, consider using a binary trie with O(bit-length) operations.

Related problems: [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-an-array), [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array)
