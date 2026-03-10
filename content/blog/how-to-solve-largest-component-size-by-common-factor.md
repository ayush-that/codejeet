---
title: "How to Solve Largest Component Size by Common Factor — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Largest Component Size by Common Factor. Hard difficulty, 42.4% acceptance rate. Topics: Array, Hash Table, Math, Union-Find, Number Theory."
date: "2028-03-04"
category: "dsa-patterns"
tags: ["largest-component-size-by-common-factor", "array", "hash-table", "math", "hard"]
---

# How to Solve Largest Component Size by Common Factor

You're given an array of unique positive integers where numbers are connected if they share a common factor greater than 1. Your task is to find the size of the largest connected component in this graph. What makes this problem tricky is that directly building the graph by checking all pairs for common factors would be O(n² × factor check), which is far too slow for constraints where n can be up to 20,000. The key insight is that we don't need to connect numbers directly to each other—we can connect them through their prime factors instead.

## Visual Walkthrough

Let's trace through a small example: `nums = [4, 6, 15, 35]`

**Step 1: Find prime factors of each number:**

- 4 = 2 × 2 → factor: 2
- 6 = 2 × 3 → factors: 2, 3
- 15 = 3 × 5 → factors: 3, 5
- 35 = 5 × 7 → factors: 5, 7

**Step 2: Connect numbers through their factors using Union-Find:**

- Connect 4 and 6 through factor 2
- Connect 6 and 15 through factor 3
- Connect 15 and 35 through factor 5

**Step 3: Resulting components:**
All numbers are connected! The graph looks like this:

```
4 —(2)— 6 —(3)— 15 —(5)— 35
```

So the largest component size is 4.

**Why this works:** Instead of checking all pairs (O(n²)), we connect each number to its prime factors. Numbers that share a factor will be connected through that factor node. This reduces the problem from O(n²) to O(n × √max(nums)).

## Brute Force Approach

A naive approach would be to:

1. Build a graph where each number is a node
2. For each pair (i, j), check if they share a common factor > 1
3. Run BFS/DFS to find the largest connected component

The problem with this approach is the time complexity:

- Checking if two numbers share a common factor takes O(√min(a,b)) using trial division
- There are O(n²) pairs to check
- Total complexity: O(n² × √M) where M is the maximum number value

For n = 20,000, this is approximately 400 million operations × factor checks, which is far too slow. Even with GCD (which is O(log min(a,b))), O(n²) is still too large.

## Optimized Approach

The key insight is that we don't need to connect numbers directly to each other. Instead, we can:

1. **Use Union-Find (Disjoint Set Union)** to efficiently track connections
2. **Connect numbers through their prime factors** rather than directly to each other
3. **For each number, factorize it and union the number with each of its prime factors**

**Why this works:**

- If two numbers share a prime factor p, they'll both be connected to the same factor node p
- Through transitivity in Union-Find, they'll be in the same component
- We only need to process each number once and connect it to its factors

**Step-by-step reasoning:**

1. Find the maximum number in the array to know our factor range
2. Initialize Union-Find data structure with size up to max(nums) + 1 (for factor nodes)
3. For each number in nums:
   - Find all prime factors of the number
   - Union the number with each of its prime factors
4. After processing all numbers, count how many numbers belong to each component
5. Return the size of the largest component

**Optimization details:**

- We only need to check factors up to √n when factorizing
- We can use a sieve-like approach to find prime factors efficiently
- The Union-Find operations are nearly O(1) with path compression and union by rank

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sqrt(M)) where M is max(nums) | Space: O(M)
class UnionFind:
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [1] * size

    def find(self, x):
        # Path compression: flatten the tree
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree to larger tree
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x != root_y:
            if self.rank[root_x] > self.rank[root_y]:
                self.parent[root_y] = root_x
            elif self.rank[root_x] < self.rank[root_y]:
                self.parent[root_x] = root_y
            else:
                self.parent[root_y] = root_x
                self.rank[root_x] += 1
            return True
        return False

class Solution:
    def largestComponentSize(self, nums):
        if not nums:
            return 0

        # Find maximum number to determine Union-Find size
        max_num = max(nums)

        # Initialize Union-Find with size max_num + 1
        # We'll use indices 0..max_num for factor nodes
        uf = UnionFind(max_num + 1)

        # Process each number
        for num in nums:
            # Factorize the number
            factor = 2
            temp = num

            # Check factors up to sqrt(num)
            while factor * factor <= temp:
                if temp % factor == 0:
                    # Union the number with this prime factor
                    uf.union(num, factor)

                    # Remove all occurrences of this factor
                    while temp % factor == 0:
                        temp //= factor

                factor += 1

            # If there's a prime factor greater than sqrt(original num)
            if temp > 1:
                uf.union(num, temp)

        # Count component sizes
        component_count = {}
        max_size = 0

        for num in nums:
            # Find the root of this number's component
            root = uf.find(num)

            # Update count for this component
            component_count[root] = component_count.get(root, 0) + 1

            # Track maximum size
            max_size = max(max_size, component_count[root])

        return max_size
```

```javascript
// Time: O(n * sqrt(M)) where M is max(nums) | Space: O(M)
class UnionFind {
  constructor(size) {
    this.parent = new Array(size);
    this.rank = new Array(size);

    // Initialize each element as its own parent
    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
      this.rank[i] = 1;
    }
  }

  find(x) {
    // Path compression: make parent point to root
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank: attach smaller tree to larger tree
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
      return true;
    }
    return false;
  }
}

/**
 * @param {number[]} nums
 * @return {number}
 */
var largestComponentSize = function (nums) {
  if (!nums || nums.length === 0) return 0;

  // Find maximum number to determine Union-Find size
  const maxNum = Math.max(...nums);

  // Initialize Union-Find with size maxNum + 1
  const uf = new UnionFind(maxNum + 1);

  // Process each number
  for (const num of nums) {
    // Factorize the number
    let factor = 2;
    let temp = num;

    // Check factors up to sqrt(num)
    while (factor * factor <= temp) {
      if (temp % factor === 0) {
        // Union the number with this prime factor
        uf.union(num, factor);

        // Remove all occurrences of this factor
        while (temp % factor === 0) {
          temp = Math.floor(temp / factor);
        }
      }
      factor++;
    }

    // If there's a prime factor greater than sqrt(original num)
    if (temp > 1) {
      uf.union(num, temp);
    }
  }

  // Count component sizes
  const componentCount = new Map();
  let maxSize = 0;

  for (const num of nums) {
    // Find the root of this number's component
    const root = uf.find(num);

    // Update count for this component
    const count = (componentCount.get(root) || 0) + 1;
    componentCount.set(root, count);

    // Track maximum size
    maxSize = Math.max(maxSize, count);
  }

  return maxSize;
};
```

```java
// Time: O(n * sqrt(M)) where M is max(nums) | Space: O(M)
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int size) {
        parent = new int[size];
        rank = new int[size];

        // Initialize each element as its own parent
        for (int i = 0; i < size; i++) {
            parent[i] = i;
            rank[i] = 1;
        }
    }

    public int find(int x) {
        // Path compression: make parent point to root
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        // Union by rank: attach smaller tree to larger tree
        int rootX = find(x);
        int rootY = find(y);

        if (rootX != rootY) {
            if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            return true;
        }
        return false;
    }
}

class Solution {
    public int largestComponentSize(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        // Find maximum number to determine Union-Find size
        int maxNum = 0;
        for (int num : nums) {
            maxNum = Math.max(maxNum, num);
        }

        // Initialize Union-Find with size maxNum + 1
        UnionFind uf = new UnionFind(maxNum + 1);

        // Process each number
        for (int num : nums) {
            // Factorize the number
            int factor = 2;
            int temp = num;

            // Check factors up to sqrt(num)
            while (factor * factor <= temp) {
                if (temp % factor == 0) {
                    // Union the number with this prime factor
                    uf.union(num, factor);

                    // Remove all occurrences of this factor
                    while (temp % factor == 0) {
                        temp /= factor;
                    }
                }
                factor++;
            }

            // If there's a prime factor greater than sqrt(original num)
            if (temp > 1) {
                uf.union(num, temp);
            }
        }

        // Count component sizes
        Map<Integer, Integer> componentCount = new HashMap<>();
        int maxSize = 0;

        for (int num : nums) {
            // Find the root of this number's component
            int root = uf.find(num);

            // Update count for this component
            int count = componentCount.getOrDefault(root, 0) + 1;
            componentCount.put(root, count);

            // Track maximum size
            maxSize = Math.max(maxSize, count);
        }

        return maxSize;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × √M)**

- `n` is the length of the input array
- `M` is the maximum number in the array
- For each number, we factorize it by checking divisors up to √num
- Union-Find operations (find and union) are amortized O(α(n)) ≈ O(1) with path compression and union by rank

**Space Complexity: O(M)**

- We create a Union-Find structure of size M+1 to accommodate all possible factors
- The component count map uses O(n) space
- Total space dominated by O(M) for the Union-Find arrays

**Why this is efficient:**

- For n = 20,000 and M = 100,000, we perform about 20,000 × 316 ≈ 6.3M operations
- This is much better than the brute force O(n²) ≈ 400M operations

## Common Mistakes

1. **Forgetting to handle the remaining factor after the loop:** After the while loop that checks factors up to √num, if `temp > 1`, it means `temp` is a prime factor greater than √num. For example, with num = 22, after processing factor 2, temp becomes 11, which is > √22 ≈ 4.7.

2. **Not using union by rank and path compression:** Without these optimizations, Union-Find operations can degrade to O(n) in the worst case, making the solution too slow for large inputs.

3. **Incorrect Union-Find size:** The Union-Find needs to be sized to `max(nums) + 1`, not `len(nums)`. This is because we're using the numbers themselves as indices, and we need to accommodate all possible factor values up to the maximum number.

4. **Not removing all occurrences of a factor:** When you find a factor, you need to divide it out completely (using the inner while loop). Otherwise, you might incorrectly identify composite factors as prime factors.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Union-Find for connectivity problems:** Whenever you need to group elements that are connected by some relationship, and you care about the size or count of groups.

2. **Factor-based connectivity:** Problems where elements are connected through shared properties (factors, characters, bits, etc.).

3. **Graph problems that are too dense for explicit edge construction:** When the number of potential edges is O(n²) but you can find a more efficient representation.

**Related problems:**

- **Groups of Strings (Hard):** Strings are connected if they differ by one character or can be swapped. Similar pattern of connecting through shared properties rather than pairwise comparisons.
- **Number of Provinces (Medium):** Classic Union-Find problem for finding connected components.
- **Accounts Merge (Medium):** Merge accounts that share emails, using Union-Find to connect through common emails.

## Key Takeaways

1. **Think in terms of intermediaries:** Instead of connecting elements directly (O(n²)), connect them through shared properties. This is a powerful optimization for dense relationship graphs.

2. **Union-Find is your friend for connectivity:** When you need to track which elements are connected and merge groups efficiently, Union-Find with path compression and union by rank is often the right tool.

3. **Factorize efficiently:** Remember the √n bound for factorization—you only need to check divisors up to √n, and whatever remains is either 1 or a prime factor.

Related problems: [Groups of Strings](/problem/groups-of-strings), [Distinct Prime Factors of Product of Array](/problem/distinct-prime-factors-of-product-of-array)
