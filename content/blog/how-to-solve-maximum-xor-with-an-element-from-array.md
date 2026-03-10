---
title: "How to Solve Maximum XOR With an Element From Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum XOR With an Element From Array. Hard difficulty, 57.6% acceptance rate. Topics: Array, Bit Manipulation, Trie."
date: "2028-09-21"
category: "dsa-patterns"
tags: ["maximum-xor-with-an-element-from-array", "array", "bit-manipulation", "trie", "hard"]
---

# How to Solve Maximum XOR With an Element From Array

This problem asks us to answer multiple queries where each query wants the maximum XOR between a given number `xi` and any number from `nums` that is ≤ `mi`. The challenge is that we have both a XOR maximization requirement (which suggests bitwise trie) AND a constraint that the number from `nums` must be ≤ `mi` (which suggests we need to handle queries in a specific order).

**What makes this problem interesting:** It combines two classic patterns—bitwise trie for maximum XOR and offline query processing with sorting. You can't just build a trie with all numbers because of the `mi` constraint, but you also can't process each query independently without timing out.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = [0, 1, 2, 3, 4]
queries = [[3, 1], [1, 5], [2, 4]]
```

**Step 1: Sort queries by `mi`**
We sort queries based on their `mi` value (the maximum allowed number):

- `[3, 1]` → mi = 1
- `[2, 4]` → mi = 4
- `[1, 5]` → mi = 5

**Step 2: Sort nums**
`nums` = [0, 1, 2, 3, 4] (already sorted)

**Step 3: Process queries in order**
We'll maintain a trie that only contains numbers ≤ current `mi`.

**Query 1: [3, 1]**

- Current trie contains numbers ≤ 1: [0, 1]
- Binary: 3 = 011, we want maximum XOR
- For bit 0 (MSB): 3 has 0, we prefer 1 → trie has 0 (from 0) and 1 (from 1) → choose 1
- For bit 1: 3 has 1, we prefer 0 → current path has 1, we check if 0 exists → yes (from 0) → choose 0
- For bit 2: 3 has 1, we prefer 0 → current path has 0 → choose 0
- Result: 110 (binary) = 6
- XOR with 3: 1^0=1, 1^1=0, 0^1=1 → 101 = 5? Wait, let's recalculate carefully...

Actually, let's compute properly:

- Best match in [0,1] for 3 (011):
  - 0 (000): 011^000 = 011 = 3
  - 1 (001): 011^001 = 010 = 2
  - Maximum is 3

**Query 2: [2, 4]**

- Add numbers ≤ 4 to trie: [2, 3, 4] (already have 0,1)
- Binary: 2 = 010
- For bit 0: 2 has 0, prefer 1 → exists (from 3=011)
- For bit 1: 2 has 1, prefer 0 → current path has 1, check if 0 branch exists → yes (from 4=100)
- For bit 2: 2 has 0, prefer 1 → current path has 0, check if 1 exists → no
- Result: 101 (binary) = 5
- XOR with 2: 5^2 = 7

**Query 3: [1, 5]**

- All numbers already in trie (≤5)
- Binary: 1 = 001
- For bit 0: 1 has 0, prefer 1 → exists (from many numbers)
- Continue... best match is 4 (100): 1^4 = 5

This shows the core idea: by processing queries in increasing `mi` order, we can incrementally add numbers to the trie, ensuring it only contains valid numbers for each query.

## Brute Force Approach

The brute force solution processes each query independently:

1. For each query `[xi, mi]`
2. Filter `nums` to only include numbers ≤ `mi`
3. For each filtered number, compute `xi ^ num`
4. Track the maximum value

**Why it's too slow:**

- Time complexity: O(q \* n) where q = number of queries, n = size of nums
- For worst case (q=10⁵, n=10⁵), this is 10¹⁰ operations → too slow
- We need something closer to O((n+q) \* log(max_value))

<div class="code-group">

```python
# Brute Force Solution - Too Slow for Constraints
# Time: O(q * n) | Space: O(1)
def maximizeXor_brute(nums, queries):
    result = []

    for xi, mi in queries:
        max_xor = -1

        # Check every number in nums
        for num in nums:
            # Only consider numbers ≤ mi
            if num <= mi:
                max_xor = max(max_xor, xi ^ num)

        result.append(max_xor)

    return result
```

```javascript
// Brute Force Solution - Too Slow for Constraints
// Time: O(q * n) | Space: O(1)
function maximizeXorBrute(nums, queries) {
  const result = [];

  for (const [xi, mi] of queries) {
    let maxXor = -1;

    // Check every number in nums
    for (const num of nums) {
      // Only consider numbers ≤ mi
      if (num <= mi) {
        maxXor = Math.max(maxXor, xi ^ num);
      }
    }

    result.push(maxXor);
  }

  return result;
}
```

```java
// Brute Force Solution - Too Slow for Constraints
// Time: O(q * n) | Space: O(1)
public int[] maximizeXorBrute(int[] nums, int[][] queries) {
    int[] result = new int[queries.length];

    for (int i = 0; i < queries.length; i++) {
        int xi = queries[i][0];
        int mi = queries[i][1];
        int maxXor = -1;

        // Check every number in nums
        for (int num : nums) {
            // Only consider numbers ≤ mi
            if (num <= mi) {
                maxXor = Math.max(maxXor, xi ^ num);
            }
        }

        result[i] = maxXor;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we need to handle two constraints efficiently:

1. **Maximum XOR**: A bitwise trie can find maximum XOR in O(bit_length) time
2. **≤ mi constraint**: By sorting queries by `mi` and nums by value, we can incrementally add numbers to the trie

**Step-by-step reasoning:**

1. Sort `nums` so we can add them to the trie in increasing order
2. Sort queries by `mi` so we process them in increasing order of allowed values
3. For each query, add all `nums` ≤ current `mi` to the trie (that haven't been added yet)
4. Use the trie to find the number that gives maximum XOR with `xi`
5. If no numbers are in the trie (all nums > mi), answer is -1

**Why a trie works for maximum XOR:**

- At each bit position (starting from MSB), we try to choose the opposite bit of `xi`
- If `xi` has bit 0, we prefer 1 (because 0^1 = 1)
- If `xi` has bit 1, we prefer 0 (because 1^0 = 1)
- The trie lets us check in O(1) if our preferred bit exists at the current position

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution using Trie and Offline Queries
# Time: O((n+q) * L) where L = bit length (max 31 for 32-bit integers)
# Space: O(n * L) for the trie
class TrieNode:
    def __init__(self):
        # Each node has two children: 0 and 1
        self.children = [None, None]

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, num):
        """Insert a number into the trie"""
        node = self.root
        # Start from the most significant bit (31st bit for 32-bit integers)
        for i in range(31, -1, -1):
            bit = (num >> i) & 1  # Get the i-th bit
            if not node.children[bit]:
                node.children[bit] = TrieNode()
            node = node.children[bit]

    def get_max_xor(self, num):
        """Find the maximum XOR value with any number in the trie"""
        if not self.root.children[0] and not self.root.children[1]:
            return -1  # Trie is empty

        node = self.root
        max_xor = 0

        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            # We want the opposite bit to maximize XOR
            opposite_bit = 1 - bit

            if node.children[opposite_bit]:
                # If opposite bit exists, take that path
                max_xor |= (1 << i)  # Set this bit in result
                node = node.children[opposite_bit]
            else:
                # Otherwise, take the same bit
                node = node.children[bit]

        return max_xor

def maximizeXor(nums, queries):
    # Step 1: Sort nums to process them in order
    nums.sort()

    # Step 2: Sort queries by mi, but keep original indices
    # We need to return answers in original query order
    sorted_queries = sorted(enumerate(queries), key=lambda x: x[1][1])

    # Step 3: Initialize trie and result array
    trie = Trie()
    result = [-1] * len(queries)
    nums_idx = 0

    # Step 4: Process queries in increasing mi order
    for orig_idx, (xi, mi) in sorted_queries:
        # Add all nums ≤ mi to the trie
        while nums_idx < len(nums) and nums[nums_idx] <= mi:
            trie.insert(nums[nums_idx])
            nums_idx += 1

        # Get maximum XOR for this query
        result[orig_idx] = trie.get_max_xor(xi)

    return result
```

```javascript
// Optimal Solution using Trie and Offline Queries
// Time: O((n+q) * L) where L = bit length (max 31 for 32-bit integers)
// Space: O(n * L) for the trie
class TrieNode {
  constructor() {
    // Each node has two children: 0 and 1
    this.children = [null, null];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(num) {
    /** Insert a number into the trie */
    let node = this.root;
    // Start from the most significant bit (31st bit for 32-bit integers)
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1; // Get the i-th bit
      if (!node.children[bit]) {
        node.children[bit] = new TrieNode();
      }
      node = node.children[bit];
    }
  }

  getMaxXor(num) {
    /** Find the maximum XOR value with any number in the trie */
    if (!this.root.children[0] && !this.root.children[1]) {
      return -1; // Trie is empty
    }

    let node = this.root;
    let maxXor = 0;

    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      // We want the opposite bit to maximize XOR
      const oppositeBit = 1 - bit;

      if (node.children[oppositeBit]) {
        // If opposite bit exists, take that path
        maxXor |= 1 << i; // Set this bit in result
        node = node.children[oppositeBit];
      } else {
        // Otherwise, take the same bit
        node = node.children[bit];
      }
    }

    return maxXor;
  }
}

function maximizeXor(nums, queries) {
  // Step 1: Sort nums to process them in order
  nums.sort((a, b) => a - b);

  // Step 2: Sort queries by mi, but keep original indices
  // We need to return answers in original query order
  const sortedQueries = queries.map((query, idx) => [idx, query]);
  sortedQueries.sort((a, b) => a[1][1] - b[1][1]);

  // Step 3: Initialize trie and result array
  const trie = new Trie();
  const result = new Array(queries.length).fill(-1);
  let numsIdx = 0;

  // Step 4: Process queries in increasing mi order
  for (const [origIdx, [xi, mi]] of sortedQueries) {
    // Add all nums ≤ mi to the trie
    while (numsIdx < nums.length && nums[numsIdx] <= mi) {
      trie.insert(nums[numsIdx]);
      numsIdx++;
    }

    // Get maximum XOR for this query
    result[origIdx] = trie.getMaxXor(xi);
  }

  return result;
}
```

```java
// Optimal Solution using Trie and Offline Queries
// Time: O((n+q) * L) where L = bit length (max 31 for 32-bit integers)
// Space: O(n * L) for the trie
class TrieNode {
    TrieNode[] children;

    public TrieNode() {
        // Each node has two children: 0 and 1
        children = new TrieNode[2];
    }
}

class Trie {
    TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(int num) {
        /** Insert a number into the trie */
        TrieNode node = root;
        // Start from the most significant bit (31st bit for 32-bit integers)
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;  // Get the i-th bit
            if (node.children[bit] == null) {
                node.children[bit] = new TrieNode();
            }
            node = node.children[bit];
        }
    }

    public int getMaxXor(int num) {
        /** Find the maximum XOR value with any number in the trie */
        if (root.children[0] == null && root.children[1] == null) {
            return -1;  // Trie is empty
        }

        TrieNode node = root;
        int maxXor = 0;

        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            // We want the opposite bit to maximize XOR
            int oppositeBit = 1 - bit;

            if (node.children[oppositeBit] != null) {
                // If opposite bit exists, take that path
                maxXor |= (1 << i);  // Set this bit in result
                node = node.children[oppositeBit];
            } else {
                // Otherwise, take the same bit
                node = node.children[bit];
            }
        }

        return maxXor;
    }
}

class Solution {
    public int[] maximizeXor(int[] nums, int[][] queries) {
        // Step 1: Sort nums to process them in order
        Arrays.sort(nums);

        // Step 2: Sort queries by mi, but keep original indices
        // We need to return answers in original query order
        int[][] sortedQueries = new int[queries.length][3];
        for (int i = 0; i < queries.length; i++) {
            sortedQueries[i][0] = i;      // original index
            sortedQueries[i][1] = queries[i][0];  // xi
            sortedQueries[i][2] = queries[i][1];  // mi
        }

        Arrays.sort(sortedQueries, (a, b) -> a[2] - b[2]);

        // Step 3: Initialize trie and result array
        Trie trie = new Trie();
        int[] result = new int[queries.length];
        int numsIdx = 0;

        // Step 4: Process queries in increasing mi order
        for (int[] query : sortedQueries) {
            int origIdx = query[0];
            int xi = query[1];
            int mi = query[2];

            // Add all nums ≤ mi to the trie
            while (numsIdx < nums.length && nums[numsIdx] <= mi) {
                trie.insert(nums[numsIdx]);
                numsIdx++;
            }

            // Get maximum XOR for this query
            result[origIdx] = trie.getMaxXor(xi);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting `nums`: O(n log n)
- Sorting `queries`: O(q log q)
- Inserting all numbers into trie: O(n \* L) where L = 32 (bits in integer)
- Answering all queries: O(q \* L)
- **Total: O((n+q) \* L + (n+q) log(n+q))**

**Space Complexity:**

- Trie storage: O(n \* L) in worst case (each number creates L nodes)
- Sorting queries with indices: O(q)
- **Total: O(n \* L + q)**

In practice, L = 32 is constant, so we often say O((n+q) \* 32) ≈ O(n+q).

## Common Mistakes

1. **Forgetting to sort queries by `mi`**: This is crucial for the offline processing approach. Without it, you'd need to rebuild the trie for each query or use a more complex data structure.

2. **Not handling empty trie case**: When `mi` is smaller than all numbers in `nums`, the trie will be empty. You must return -1, not try to traverse the trie.

3. **Starting from wrong bit position**: The maximum XOR algorithm must start from the most significant bit (bit 31 for 32-bit integers). Starting from LSB or using the wrong number of bits gives incorrect results.

4. **Not preserving original query order**: After sorting queries by `mi`, you must store original indices to return answers in the correct order. This is a common oversight in offline query problems.

5. **Incorrect bit manipulation**: Using `(1 << i)` instead of `(num >> i) & 1` to extract bits, or forgetting to use `|=` to build the result.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Bitwise Trie for Maximum XOR**: Used in problems where you need to find maximum/minimum XOR between pairs:
   - [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-array) (simpler version without constraints)
   - [Maximum Genetic Difference Query](/problem/maximum-genetic-difference-query) (similar with tree structure)

2. **Offline Query Processing**: Sorting queries by a constraint to process them incrementally:
   - Problems with range queries where you can add/remove elements as you go
   - Mo's algorithm variants
   - Problems with "≤ constraint" that can be handled by sorting

## Key Takeaways

1. **Bitwise trie is the go-to structure for XOR optimization problems**: When you see "maximum XOR" in a problem statement, think trie first. The trie lets you greedily choose optimal bits from MSB to LSB.

2. **Offline processing handles constraints efficiently**: When queries have constraints that limit which elements can be used, consider sorting queries and processing them in an order that lets you maintain a data structure incrementally.

3. **Combine patterns for complex problems**: Hard problems often combine multiple medium-difficulty patterns. Here it's trie + offline queries. Recognizing the component patterns makes hard problems more approachable.

Related problems: [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-an-array), [Maximum Genetic Difference Query](/problem/maximum-genetic-difference-query), [Minimize XOR](/problem/minimize-xor)
