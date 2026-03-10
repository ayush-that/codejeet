---
title: "How to Solve Process Restricted Friend Requests — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Process Restricted Friend Requests. Hard difficulty, 59.5% acceptance rate. Topics: Union-Find, Graph Theory."
date: "2029-08-24"
category: "dsa-patterns"
tags: ["process-restricted-friend-requests", "union-find", "graph-theory", "hard"]
---

# How to Solve Process Restricted Friend Requests

You're given `n` people labeled `0` to `n-1`, a list of friend requests where each request `[u, v]` means person `u` wants to be friends with person `v`, and a list of restrictions where `[x, y]` means person `x` and `y` cannot be friends. For each request, you need to determine if it can be granted without creating any friend connections that violate restrictions. The challenge is that friendships are transitive: if A is friends with B and B is friends with C, then A and C are also friends, which could indirectly violate a restriction.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 5
- restrictions = [[0,1], [2,3]]
- requests = [[0,2], [1,3], [0,3], [2,4]]

**Step-by-step reasoning:**

1. **Initial state:** Everyone is in their own friend group: {0}, {1}, {2}, {3}, {4}
   - Restrictions mean: 0 and 1 cannot be in same group, 2 and 3 cannot be in same group

2. **Request [0,2]:** Can 0 and 2 become friends?
   - Check all restrictions involving people in 0's group and 2's group
   - 0's group: {0}, 2's group: {2}
   - Restrictions: [0,1] doesn't involve 2, [2,3] doesn't involve 0
   - ✅ No restriction violated → Grant request
   - New groups: {0,2}, {1}, {3}, {4}

3. **Request [1,3]:** Can 1 and 3 become friends?
   - 1's group: {1}, 3's group: {3}
   - Check restrictions: [0,1] involves 1 but not 3, [2,3] involves 3 but not 1
   - ✅ No restriction violated → Grant request
   - New groups: {0,2}, {1,3}, {4}

4. **Request [0,3]:** Can 0 and 3 become friends?
   - 0's group: {0,2}, 3's group: {1,3}
   - Check restrictions:
     - [0,1]: 0 is in first group, 1 is in second group → VIOLATION!
     - [2,3]: 2 is in first group, 3 is in second group → VIOLATION!
   - ❌ Both restrictions violated → Deny request
   - Groups remain: {0,2}, {1,3}, {4}

5. **Request [2,4]:** Can 2 and 4 become friends?
   - 2's group: {0,2}, 4's group: {4}
   - Check restrictions:
     - [0,1]: 0 is in first group, 1 is not in second group
     - [2,3]: 2 is in first group, 3 is not in second group
   - ✅ No restriction violated → Grant request
   - New groups: {0,2,4}, {1,3}

**Result:** [true, true, false, true]

The key insight: we need to track friend groups and check if merging two groups would put any restricted pair into the same group.

## Brute Force Approach

A naive approach would be to simulate each request and check all restrictions:

1. Maintain a list of friend groups (initially each person in their own group)
2. For each request `[u, v]`:
   - Find which groups contain `u` and `v`
   - If they're already in the same group, grant the request
   - Otherwise, check every restriction `[x, y]`:
     - If `x` is in `u`'s group and `y` is in `v`'s group → violation
     - If `y` is in `u`'s group and `x` is in `v`'s group → violation
   - If no violations, merge the two groups

**Why this is inefficient:**

- Finding which group contains a person takes O(n) with simple arrays
- Checking all restrictions for each request takes O(r) where r = number of restrictions
- Merging groups takes O(n) to update all members
- Total: O(n × r × q) where q = number of requests → Too slow for n up to 1000!

The brute force fails because it doesn't efficiently:

1. Find which group a person belongs to
2. Check if merging groups would violate restrictions
3. Merge groups quickly

## Optimized Approach

The optimal solution uses **Union-Find (Disjoint Set Union)** with a clever restriction check:

**Key Insight:** Instead of checking all restrictions for each request, we can:

1. Use Union-Find to efficiently manage friend groups (O(α(n)) per operation)
2. For each request, check only the restrictions involving people whose groups would be merged
3. Use the restriction pairs to create a "cannot-merge" relationship between groups

**Step-by-step reasoning:**

1. **Initialize Union-Find** for n people
2. **Preprocess restrictions:** For each person, track which groups they cannot be with
3. **Process each request:**
   - Find the roots of both people
   - If they're already connected → automatically grant
   - Check if merging would violate any restriction:
     - For each person in the first group, check if they're restricted with anyone in the second group
     - This is still O(n) worst case, but we can optimize
4. **Optimization:** Instead of checking all pairs, we can:
   - Track for each group, which other groups it cannot merge with
   - When checking request `[u, v]`, check if `root(u)`'s cannot-merge set contains `root(v)`
   - Update cannot-merge sets when groups merge

**Even better approach:** Check restrictions directly:

- For request `[u, v]` with roots `rootU` and `rootV`
- For each restriction `[x, y]`:
  - If `(find(x) == rootU and find(y) == rootV)` or `(find(x) == rootV and find(y) == rootU)` → violation
- This is O(r) per request, which is acceptable since r ≤ 10⁵

**Final optimization:** We only need to check restrictions where at least one person is in either of the two groups being merged.

## Optimal Solution

Here's the complete solution using Union-Find with direct restriction checking:

<div class="code-group">

```python
# Time: O(q * (α(n) + r)) where α is inverse Ackermann (near constant)
# Space: O(n + r) for Union-Find and restrictions storage
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression: flatten the tree
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree under larger tree
        rootX = self.find(x)
        rootY = self.find(y)

        if rootX == rootY:
            return False  # Already connected

        if self.rank[rootX] < self.rank[rootY]:
            self.parent[rootX] = rootY
        elif self.rank[rootX] > self.rank[rootY]:
            self.parent[rootY] = rootX
        else:
            self.parent[rootY] = rootX
            self.rank[rootX] += 1
        return True  # Successfully merged

class Solution:
    def friendRequests(self, n: int, restrictions: List[List[int]], requests: List[List[int]]) -> List[bool]:
        uf = UnionFind(n)
        result = []

        for u, v in requests:
            # Find current roots of u and v
            rootU = uf.find(u)
            rootV = uf.find(v)

            # If already in same group, request is automatically granted
            if rootU == rootV:
                result.append(True)
                continue

            # Check if merging would violate any restriction
            can_merge = True
            for x, y in restrictions:
                rootX = uf.find(x)
                rootY = uf.find(y)

                # Check if this restriction would be violated by merging
                # Violation occurs if after merge, x and y would be in same group
                # This happens if:
                # 1. x is in u's group and y is in v's group, OR
                # 2. y is in u's group and x is in v's group
                if (rootX == rootU and rootY == rootV) or (rootX == rootV and rootY == rootU):
                    can_merge = False
                    break

            if can_merge:
                # Merge the groups
                uf.union(u, v)
                result.append(True)
            else:
                result.append(False)

        return result
```

```javascript
// Time: O(q * (α(n) + r)) where α is inverse Ackermann (near constant)
// Space: O(n + r) for Union-Find and restrictions storage
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    // Path compression: flatten the tree
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank: attach smaller tree under larger tree
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already connected
    }

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true; // Successfully merged
  }
}

/**
 * @param {number} n
 * @param {number[][]} restrictions
 * @param {number[][]} requests
 * @return {boolean[]}
 */
var friendRequests = function (n, restrictions, requests) {
  const uf = new UnionFind(n);
  const result = [];

  for (const [u, v] of requests) {
    // Find current roots of u and v
    const rootU = uf.find(u);
    const rootV = uf.find(v);

    // If already in same group, request is automatically granted
    if (rootU === rootV) {
      result.push(true);
      continue;
    }

    // Check if merging would violate any restriction
    let canMerge = true;
    for (const [x, y] of restrictions) {
      const rootX = uf.find(x);
      const rootY = uf.find(y);

      // Check if this restriction would be violated by merging
      // Violation occurs if after merge, x and y would be in same group
      // This happens if:
      // 1. x is in u's group and y is in v's group, OR
      // 2. y is in u's group and x is in v's group
      if ((rootX === rootU && rootY === rootV) || (rootX === rootV && rootY === rootU)) {
        canMerge = false;
        break;
      }
    }

    if (canMerge) {
      // Merge the groups
      uf.union(u, v);
      result.push(true);
    } else {
      result.push(false);
    }
  }

  return result;
};
```

```java
// Time: O(q * (α(n) + r)) where α is inverse Ackermann (near constant)
// Space: O(n + r) for Union-Find and restrictions storage
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression: flatten the tree
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        // Union by rank: attach smaller tree under larger tree
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            return false;  // Already connected
        }

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;  // Successfully merged
    }
}

class Solution {
    public boolean[] friendRequests(int n, int[][] restrictions, int[][] requests) {
        UnionFind uf = new UnionFind(n);
        boolean[] result = new boolean[requests.length];

        for (int i = 0; i < requests.length; i++) {
            int u = requests[i][0];
            int v = requests[i][1];

            // Find current roots of u and v
            int rootU = uf.find(u);
            int rootV = uf.find(v);

            // If already in same group, request is automatically granted
            if (rootU == rootV) {
                result[i] = true;
                continue;
            }

            // Check if merging would violate any restriction
            boolean canMerge = true;
            for (int[] restriction : restrictions) {
                int x = restriction[0];
                int y = restriction[1];

                int rootX = uf.find(x);
                int rootY = uf.find(y);

                // Check if this restriction would be violated by merging
                // Violation occurs if after merge, x and y would be in same group
                // This happens if:
                // 1. x is in u's group and y is in v's group, OR
                // 2. y is in u's group and x is in v's group
                if ((rootX == rootU && rootY == rootV) || (rootX == rootV && rootY == rootU)) {
                    canMerge = false;
                    break;
                }
            }

            if (canMerge) {
                // Merge the groups
                uf.union(u, v);
                result[i] = true;
            } else {
                result[i] = false;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Union-Find operations (find/union): O(α(n)) per operation, where α is the inverse Ackermann function (effectively constant)
- For each of the q requests:
  - 2 find operations: O(α(n))
  - Checking r restrictions: O(r) in worst case
- Total: O(q × (α(n) + r))

**Space Complexity:**

- Union-Find data structures: O(n) for parent and rank arrays
- Restrictions storage: O(r) for the restrictions list
- Result array: O(q)
- Total: O(n + r + q)

**Why this is acceptable:**

- n ≤ 1000, r ≤ 10⁵, q ≤ 1000
- In practice, the restriction check is the bottleneck, but with these constraints, O(q × r) = 10⁸ operations is borderline but often passes with efficient implementation
- We could optimize further by tracking "cannot-merge" sets per group, but the added complexity isn't necessary for these constraints

## Common Mistakes

1. **Not handling transitive friendships:** The most common mistake is checking only direct restrictions without considering that friendships create equivalence classes. If A-B and B-C are friends, then A-C are friends too, which could violate A-C restriction even if A and C never directly became friends.

2. **Inefficient restriction checking:** Checking all restrictions for each request by iterating through all n people in both groups gives O(n²) per request. The key insight is we only need to check the restriction pairs themselves.

3. **Forgetting path compression and union by rank:** Without these optimizations, Union-Find degenerates to O(n) per operation instead of O(α(n)). This can cause timeouts for large n.

4. **Not checking both directions of restrictions:** Restrictions are undirected, so [x,y] means x cannot be with y AND y cannot be with x. When checking if merging groups would violate restrictions, you must check both (x in group1, y in group2) and (y in group1, x in group2).

## When You'll See This Pattern

This problem combines **Union-Find** with **constraint checking**, a pattern that appears in several graph connectivity problems with additional constraints:

1. **Number of Islands II (Hard):** Similar Union-Find structure for dynamically connecting cells, but without the restriction checking component.

2. **Smallest String With Swaps (Medium):** Uses Union-Find to determine which positions can be swapped, then applies constraints (lexicographic ordering) within each connected component.

3. **Satisfiability of Equality Equations (Medium):** Uses Union-Find to handle equality constraints, then checks inequality constraints against the unions—very similar pattern to this problem!

4. **Accounts Merge (Medium):** Uses Union-Find to merge accounts with common emails, then aggregates results—similar merging logic but different constraint structure.

The core pattern: When you need to dynamically merge sets while checking if merges violate constraints, think Union-Find with constraint validation.

## Key Takeaways

1. **Union-Find is ideal for dynamic connectivity problems** where you need to merge sets and query connectivity efficiently. The path compression and union by rank optimizations are essential for performance.

2. **For constraint checking with Union-Find**, process constraints after finding roots, not before. Constraints often need to be checked in the context of the current connectivity state.

3. **Transitive relationships matter** in friendship/equivalence problems. Always think about the full connected component, not just direct relationships.

4. **When optimizing, focus on the bottleneck**: In this problem, the restriction check is more expensive than the Union-Find operations, so we optimize how we check restrictions rather than the Union-Find itself.

Related problems: [Number of Islands II](/problem/number-of-islands-ii), [Smallest String With Swaps](/problem/smallest-string-with-swaps), [Maximum Employees to Be Invited to a Meeting](/problem/maximum-employees-to-be-invited-to-a-meeting)
