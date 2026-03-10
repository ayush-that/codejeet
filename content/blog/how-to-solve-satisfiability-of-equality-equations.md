---
title: "How to Solve Satisfiability of Equality Equations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Satisfiability of Equality Equations. Medium difficulty, 51.6% acceptance rate. Topics: Array, String, Union-Find, Graph Theory."
date: "2026-06-30"
category: "dsa-patterns"
tags: ["satisfiability-of-equality-equations", "array", "string", "union-find", "medium"]
---

# How to Solve Satisfiability of Equality Equations

You're given equations stating that variables are equal or not equal, and need to determine if all statements can be true simultaneously. What makes this tricky is that equality is transitive: if `a==b` and `b==c`, then `a==c` must hold, and this can conflict with later `a!=c` statements. The challenge is efficiently tracking which variables must be equal versus which must be different.

## Visual Walkthrough

Let's trace through `["a==b","b!=c","c==a"]`:

1. **Process equalities first**: `a==b` means `a` and `b` are in the same group.
   - Groups: `{a,b}`, `{c}`
2. **Process another equality**: `c==a` means `c` and `a` are in the same group.
   - Since `a` is already with `b`, we merge all three: `{a,b,c}`
3. **Now check inequalities**: `b!=c` says `b` and `c` must be in different groups.
   - But they're both in `{a,b,c}` → **CONFLICT!**
   - Return `false`

The key insight: we need to first establish all equality relationships, then verify that no inequality violates them.

## Brute Force Approach

A naive approach might try to assign each variable a value (like 0, 1, 2...) and check all assignments:

1. Generate all possible assignments of 26 variables (a-z) to values
2. For each assignment, check all equations
3. Return true if any assignment satisfies all equations

This is **exponential** (26! possibilities) and completely impractical. Even smarter brute force with backtracking would be too slow for 26 variables with many constraints.

The problem requires a more structured approach because equality creates equivalence classes that must be tracked efficiently.

## Optimized Approach

The optimal solution uses **Union-Find (Disjoint Set Union)**:

1. **First pass**: Process all `==` equations to union variables that must be equal
   - This builds equivalence classes of variables that must have the same value
2. **Second pass**: Process all `!=` equations to check for conflicts
   - If two variables in a `!=` equation belong to the same equivalence class, we have a contradiction
   - Return `false` immediately

**Why Union-Find works perfectly**:

- `==` creates connections between variables (union operations)
- `!=` checks if variables are connected (find operations)
- Union-Find handles the transitive nature of equality efficiently in near-constant time

**Key insight**: Process equalities first to build the "must be equal" groups, then inequalities can't contradict these groups.

## Optimal Solution

Here's the complete solution using Union-Find:

<div class="code-group">

```python
# Time: O(n * α(26)) ≈ O(n) where α is inverse Ackermann function (very slow growing)
# Space: O(26) = O(1) for the parent array
class Solution:
    def equationsPossible(self, equations: List[str]) -> bool:
        # Initialize Union-Find structure for 26 lowercase letters
        parent = list(range(26))  # Each variable starts as its own parent

        def find(x):
            """Find root of x with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]

        def union(x, y):
            """Union two variables."""
            root_x = find(x)
            root_y = find(y)
            if root_x != root_y:
                parent[root_y] = root_x  # Attach y's tree under x's root

        # First pass: union all variables connected by '=='
        for eq in equations:
            if eq[1] == '=':  # Equality equation
                x = ord(eq[0]) - ord('a')  # Convert char to 0-25 index
                y = ord(eq[3]) - ord('a')
                union(x, y)

        # Second pass: check all '!=' equations for conflicts
        for eq in equations:
            if eq[1] == '!':  # Inequality equation
                x = ord(eq[0]) - ord('a')
                y = ord(eq[3]) - ord('a')
                # If two variables that must be different are in same set → conflict
                if find(x) == find(y):
                    return False

        return True
```

```javascript
// Time: O(n * α(26)) ≈ O(n) where α is inverse Ackermann function
// Space: O(26) = O(1) for the parent array
/**
 * @param {string[]} equations
 * @return {boolean}
 */
var equationsPossible = function (equations) {
  // Initialize Union-Find for 26 lowercase letters
  const parent = Array.from({ length: 26 }, (_, i) => i);

  // Find with path compression
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  };

  // Union two variables
  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX !== rootY) {
      parent[rootY] = rootX; // Attach y's tree under x's root
    }
  };

  // First pass: process all equality equations
  for (const eq of equations) {
    if (eq[1] === "=") {
      const x = eq.charCodeAt(0) - "a".charCodeAt(0);
      const y = eq.charCodeAt(3) - "a".charCodeAt(0);
      union(x, y);
    }
  }

  // Second pass: check all inequality equations for conflicts
  for (const eq of equations) {
    if (eq[1] === "!") {
      const x = eq.charCodeAt(0) - "a".charCodeAt(0);
      const y = eq.charCodeAt(3) - "a".charCodeAt(0);
      // Conflict if variables that must be different are in same set
      if (find(x) === find(y)) {
        return false;
      }
    }
  }

  return true;
};
```

```java
// Time: O(n * α(26)) ≈ O(n) where α is inverse Ackermann function
// Space: O(26) = O(1) for the parent array
class Solution {
    public boolean equationsPossible(String[] equations) {
        // Initialize Union-Find for 26 lowercase letters
        int[] parent = new int[26];
        for (int i = 0; i < 26; i++) {
            parent[i] = i;  // Each variable starts as its own parent
        }

        // First pass: process all equality equations
        for (String eq : equations) {
            if (eq.charAt(1) == '=') {
                int x = eq.charAt(0) - 'a';
                int y = eq.charAt(3) - 'a';
                union(parent, x, y);
            }
        }

        // Second pass: check all inequality equations for conflicts
        for (String eq : equations) {
            if (eq.charAt(1) == '!') {
                int x = eq.charAt(0) - 'a';
                int y = eq.charAt(3) - 'a';
                // Conflict if variables that must be different are in same set
                if (find(parent, x) == find(parent, y)) {
                    return false;
                }
            }
        }

        return true;
    }

    // Find with path compression
    private int find(int[] parent, int x) {
        if (parent[x] != x) {
            parent[x] = find(parent, parent[x]);  // Path compression
        }
        return parent[x];
    }

    // Union two variables
    private void union(int[] parent, int x, int y) {
        int rootX = find(parent, x);
        int rootY = find(parent, y);
        if (rootX != rootY) {
            parent[rootY] = rootX;  // Attach y's tree under x's root
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × α(26)) ≈ O(n)**

- We process each equation twice: once for union operations, once for find operations
- Each union/find operation with path compression takes amortized O(α(n)) time, where α is the inverse Ackermann function (extremely slow-growing, effectively constant)
- Since we have only 26 variables, α(26) is essentially constant
- Total: O(n) for n equations

**Space Complexity: O(1)**

- We store a parent array of size 26 (constant)
- The recursion depth for find with path compression is limited
- No additional data structures scale with input size

## Common Mistakes

1. **Processing equations in given order**: If you process `!=` before establishing all `==` relationships, you might miss transitive conflicts. Always process all equalities first.

2. **Forgetting path compression**: Without path compression, find operations become O(n) in worst case, making the solution O(n²). Always implement path compression in Union-Find.

3. **Incorrect character indexing**: Using `eq[0] - 'a'` without proper type conversion (especially in JavaScript) or forgetting that strings are 0-indexed. Double-check your character extraction logic.

4. **Not handling self-inequalities**: An equation like `"a!=a"` should always return `false`. Our solution catches this because `find(a) == find(a)` will be true, triggering the conflict check.

## When You'll See This Pattern

Union-Find appears in problems about connectivity, equivalence, or grouping:

1. **Number of Provinces (LeetCode 547)**: Find connected components in an undirected graph—exactly what Union-Find does naturally.

2. **Redundant Connection (LeetCode 684)**: Find an edge that creates a cycle in an undirected graph—Union-Find can detect cycles during union operations.

3. **Accounts Merge (LeetCode 721)**: Merge accounts with common emails—emails that appear together get unioned, similar to variables in equality equations.

The pattern to recognize: when you need to track "connectedness" or "sameness" that propagates transitively, especially when you have both "connect" and "check if connected" operations.

## Key Takeaways

1. **Union-Find is perfect for equivalence relationships**: When you have statements like "A equals B" that are transitive, Union-Find efficiently maintains equivalence classes.

2. **Two-pass strategy for constraints**: When dealing with both positive (must-be-connected) and negative (must-not-be-connected) constraints, process all positive constraints first to build the structure, then verify negative constraints don't violate it.

3. **Constant factors matter**: Even though we have 26 variables, using efficient Union-Find with path compression ensures optimal performance. Don't skip optimization even for small input ranges.

[Practice this problem on CodeJeet](/problem/satisfiability-of-equality-equations)
