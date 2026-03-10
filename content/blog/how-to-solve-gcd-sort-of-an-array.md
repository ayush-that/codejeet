---
title: "How to Solve GCD Sort of an Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode GCD Sort of an Array. Hard difficulty, 48.5% acceptance rate. Topics: Array, Math, Union-Find, Sorting, Number Theory."
date: "2026-03-03"
category: "dsa-patterns"
tags: ["gcd-sort-of-an-array", "array", "math", "union-find", "hard"]
---

# How to Solve GCD Sort of an Array

You're given an array of integers and can swap any two elements if their greatest common divisor (GCD) is greater than 1. The challenge is to determine if you can sort the array in non-decreasing order through any sequence of such swaps. What makes this problem tricky is that swaps aren't arbitrary—they're only allowed between numbers that share a common factor, creating a complex network of constraints.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [6, 4, 10, 15]`

**Step 1: Identify allowed swaps**

- 6 and 4: gcd(6,4) = 2 > 1 → can swap
- 6 and 10: gcd(6,10) = 2 > 1 → can swap
- 6 and 15: gcd(6,15) = 3 > 1 → can swap
- 4 and 10: gcd(4,10) = 2 > 1 → can swap
- 4 and 15: gcd(4,15) = 1 → cannot swap
- 10 and 15: gcd(10,15) = 5 > 1 → can swap

**Step 2: Build connectivity graph**
Numbers are connected if they share a factor:

- 6 connects to 4, 10, 15
- 4 connects to 6, 10
- 10 connects to 6, 4, 15
- 15 connects to 6, 10

This forms a single connected component containing all numbers.

**Step 3: Check sortability**
Sorted version: `[4, 6, 10, 15]`
Original positions: 6 at index 0, 4 at index 1, 10 at index 2, 15 at index 3

Since all numbers are in the same connected component, we can rearrange them arbitrarily within that component. We can move 4 to position 0, 6 to position 1, etc. Therefore, this array is sortable.

**Key insight**: If two numbers are in the same connected component (share factors directly or indirectly), they can be rearranged arbitrarily within that component. The problem reduces to checking if each number in the sorted array can reach its target position through factor-based connections.

## Brute Force Approach

A naive approach would try to simulate all possible swap sequences, but this is computationally infeasible. Another brute force idea might be:

1. Generate all permutations reachable through allowed swaps (BFS/DFS)
2. Check if any permutation is sorted

This fails because:

- The state space grows factorially with array size
- Even for n=10, there are 3.6 million permutations
- Checking connectivity for each pair requires O(n²) gcd calculations

The fundamental issue is that we're not actually trying to find a sorting sequence—we just need to know if sorting is _possible_. This is a decision problem, not a construction problem.

## Optimized Approach

The key insight is that this is a **connectivity problem**:

1. Numbers are connected if they share a prime factors
2. Connected numbers can be rearranged arbitrarily within their component
3. For sorting to be possible, each number in the sorted array must be in the same connected component as the number currently at that position

**Step-by-step reasoning**:

1. **Factor decomposition**: For each number, find all its prime factors. Numbers sharing any prime factor are connected.

2. **Union-Find (Disjoint Set Union)**: Use DSU to connect numbers through their prime factors. Instead of connecting numbers directly (which would be O(n²)), connect each number to its prime factors. This creates a bipartite graph where numbers connect to factors, and factors connect to numbers.

3. **Component analysis**: After building the DSU structure, each number belongs to a component containing all numbers that share factors (directly or indirectly).

4. **Position checking**: Compare the sorted array with the original. For each position i, check if `nums[i]` (original value at position i) and `sorted_nums[i]` (target value for position i) are in the same DSU component. If all positions satisfy this, sorting is possible.

**Why this works**: If two numbers are in the same component, there exists a chain of numbers where each adjacent pair shares a factor. Through a series of swaps along this chain, any number in the component can reach any position occupied by another number in the same component.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sqrt(m) * α(n)) where m is max(nums), α is inverse Ackermann
# Space: O(n + m) for DSU and factor mapping
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1

class Solution:
    def gcdSort(self, nums: List[int]) -> bool:
        n = len(nums)
        max_num = max(nums)

        # DSU with indices 0..n-1 for numbers and n..n+max_num for prime factors
        # We offset prime factors by n to avoid collision with number indices
        dsu = DSU(n + max_num + 1)

        # Connect each number to its prime factors
        for i, num in enumerate(nums):
            # Factorize num
            temp = num
            factor = 2
            while factor * factor <= temp:
                if temp % factor == 0:
                    # Connect number i to this prime factor (offset by n)
                    dsu.union(i, n + factor)
                    # Remove all occurrences of this factor
                    while temp % factor == 0:
                        temp //= factor
                factor += 1

            # Handle remaining prime factor greater than sqrt(num)
            if temp > 1:
                dsu.union(i, n + temp)

        # Get sorted version for comparison
        sorted_nums = sorted(nums)

        # Check if each number can reach its target position
        for i in range(n):
            # If original nums[i] and target sorted_nums[i] aren't in same component,
            # we cannot get nums[i] to position i
            if dsu.find(i) != dsu.find(nums.index(sorted_nums[i])):
                # But wait! We need to compare components, not positions
                # Actually, we need to check if nums[i] and sorted_nums[i] are in same component
                # Let me correct this approach...
                pass

        # Better approach: For each position, check if current and target values are connected
        # We need to map values to their components
        value_to_component = {}
        for i, num in enumerate(nums):
            comp = dsu.find(i)
            # Store the component for this occurrence of the value
            # We need to track that this specific occurrence is in this component
            # Actually, we should check if for each i, nums[i] and sorted_nums[i] are in same component

        # Correct implementation:
        # We need to know which component each value at each position belongs to
        original_components = [dsu.find(i) for i in range(n)]

        # For the sorted array, we need to know if the value that should be at position i
        # is in the same component as the value currently at position i
        # Create a sorted copy with original indices to track components
        sorted_with_indices = sorted([(num, i) for i, num in enumerate(nums)])

        # Check each position in sorted order
        for new_pos, (_, original_pos) in enumerate(sorted_with_indices):
            # The value that should be at new_pos came from original_pos
            # We need to check if the value at new_pos in original array
            # is in the same component as the value from original_pos
            if dsu.find(new_pos) != dsu.find(original_pos):
                return False

        return True
```

```javascript
// Time: O(n * sqrt(m) * α(n)) where m is max(nums), α is inverse Ackermann
// Space: O(n + m) for DSU and factor mapping
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return;

    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
  }
}

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var gcdSort = function (nums) {
  const n = nums.length;
  const maxNum = Math.max(...nums);

  // DSU with indices 0..n-1 for numbers and n..n+maxNum for prime factors
  // We offset prime factors by n to avoid collision with number indices
  const dsu = new DSU(n + maxNum + 1);

  // Connect each number to its prime factors
  for (let i = 0; i < n; i++) {
    let num = nums[i];
    let factor = 2;

    // Factorize the number
    while (factor * factor <= num) {
      if (num % factor === 0) {
        // Connect number i to this prime factor (offset by n)
        dsu.union(i, n + factor);
        // Remove all occurrences of this factor
        while (num % factor === 0) {
          num = Math.floor(num / factor);
        }
      }
      factor++;
    }

    // Handle remaining prime factor greater than sqrt(original num)
    if (num > 1) {
      dsu.union(i, n + num);
    }
  }

  // Create sorted version with original indices
  const sortedWithIndices = nums.map((num, idx) => [num, idx]);
  sortedWithIndices.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  // Check if each number can reach its target position
  for (let newPos = 0; newPos < n; newPos++) {
    const originalPos = sortedWithIndices[newPos][1];

    // If the component of newPos doesn't match component of originalPos,
    // we cannot get the required value to this position
    if (dsu.find(newPos) !== dsu.find(originalPos)) {
      return false;
    }
  }

  return true;
};
```

```java
// Time: O(n * sqrt(m) * α(n)) where m is max(nums), α is inverse Ackermann
// Space: O(n + m) for DSU and factor mapping
class DSU {
    private int[] parent;
    private int[] rank;

    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank
        int px = find(x);
        int py = find(y);
        if (px == py) return;

        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
    }
}

class Solution {
    public boolean gcdSort(int[] nums) {
        int n = nums.length;
        int maxNum = 0;
        for (int num : nums) {
            maxNum = Math.max(maxNum, num);
        }

        // DSU with indices 0..n-1 for numbers and n..n+maxNum for prime factors
        // We offset prime factors by n to avoid collision with number indices
        DSU dsu = new DSU(n + maxNum + 1);

        // Connect each number to its prime factors
        for (int i = 0; i < n; i++) {
            int num = nums[i];
            int factor = 2;

            // Factorize the number
            while (factor * factor <= num) {
                if (num % factor == 0) {
                    // Connect number i to this prime factor (offset by n)
                    dsu.union(i, n + factor);
                    // Remove all occurrences of this factor
                    while (num % factor == 0) {
                        num /= factor;
                    }
                }
                factor++;
            }

            // Handle remaining prime factor greater than sqrt(original num)
            if (num > 1) {
                dsu.union(i, n + num);
            }
        }

        // Create array of indices to sort
        Integer[] indices = new Integer[n];
        for (int i = 0; i < n; i++) {
            indices[i] = i;
        }

        // Sort indices based on corresponding values in nums
        Arrays.sort(indices, (a, b) -> Integer.compare(nums[a], nums[b]));

        // Check if each number can reach its target position
        for (int newPos = 0; newPos < n; newPos++) {
            int originalPos = indices[newPos];

            // If the component of newPos doesn't match component of originalPos,
            // we cannot get the required value to this position
            if (dsu.find(newPos) != dsu.find(originalPos)) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × √m × α(n + m))

- `n` is the length of the array
- `m` is the maximum value in the array
- √m comes from prime factorization (trial division up to √m)
- α(n + m) is the inverse Ackermann function for DSU operations (effectively constant)

**Space Complexity**: O(n + m)

- DSU data structure needs O(n + m) space for parent and rank arrays
- Additional O(n) for sorting and index tracking
- The factor n+m comes from having n number indices and up to m prime factor indices

## Common Mistakes

1. **Direct number-to-number union**: Connecting numbers directly based on gcd > 1 requires O(n²) gcd calculations, which is too slow for n up to 3×10⁴. The key optimization is connecting numbers through their prime factors.

2. **Incorrect component comparison**: Comparing values instead of components. Remember: two different occurrences of the same value might be in different components if they don't share factors with the same numbers.

3. **Forgetting large prime factors**: When factorizing, numbers can have a prime factor larger than √n. After the while loop, if `temp > 1`, it's a prime factor that needs to be processed.

4. **Index collision in DSU**: Not offsetting prime factor indices properly. Prime factors (up to max(nums)) need their own unique indices that don't collide with number indices (0 to n-1).

## When You'll See This Pattern

This problem combines **number theory** (prime factorization) with **graph connectivity** (Union-Find). You'll see similar patterns in:

1. **Rank Transform of a Matrix (Hard)**: Also uses DSU to connect cells that are related through row/column constraints, though with a different connection rule.

2. **Largest Component Size by Common Factor (Hard)**: Almost identical pattern—connect numbers through shared prime factors using DSU to find the largest connected component.

3. **Similar String Groups (Medium)**: Uses DSU to connect strings that are similar, with connectivity defined by character differences rather than numerical factors.

The core pattern is: when you need to determine if elements can be rearranged based on pairwise relationships, think about building a graph of allowed connections and checking connectivity.

## Key Takeaways

1. **Factor-based connectivity**: When swaps are allowed based on mathematical properties (gcd > 1), think about connecting elements through their prime factors rather than pairwise comparisons.

2. **DSU for indirect relationships**: Union-Find efficiently handles transitive relationships—if A connects to B and B connects to C, then A connects to C, even without direct A-C connection.

3. **Decision vs. construction**: Many problems ask "is it possible?" rather than "show me how." For possibility questions, focus on necessary and sufficient conditions (like component connectivity) rather than constructing actual sequences.

Related problems: [Rank Transform of a Matrix](/problem/rank-transform-of-a-matrix)
