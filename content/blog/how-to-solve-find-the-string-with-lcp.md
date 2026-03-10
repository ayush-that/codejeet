---
title: "How to Solve Find the String with LCP — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the String with LCP. Hard difficulty, 32.5% acceptance rate. Topics: Array, String, Dynamic Programming, Greedy, Union-Find."
date: "2026-07-19"
category: "dsa-patterns"
tags: ["find-the-string-with-lcp", "array", "string", "dynamic-programming", "hard"]
---

# How to Solve Find the String with LCP

This problem asks us to reconstruct a string from its Longest Common Prefix (LCP) matrix. Given an `n x n` matrix where `lcp[i][j]` represents the length of the longest common prefix between suffixes starting at positions `i` and `j`, we need to find a valid lowercase string that produces exactly this matrix. The challenge lies in verifying consistency—not every matrix can be realized as an LCP matrix of some string—and constructing the string efficiently when possible.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have `n = 3` and the LCP matrix is:

```
lcp = [
    [3, 0, 0],
    [0, 2, 1],
    [0, 1, 1]
]
```

**Step 1: Understanding diagonal entries**  
The diagonal `lcp[i][i]` represents the longest common prefix between a suffix and itself, which is the entire suffix length: `n - i`. So `lcp[0][0]` should be `3` (n - 0), `lcp[1][1]` should be `2` (n - 1), and `lcp[2][2]` should be `1` (n - 2). Our matrix satisfies this basic check.

**Step 2: Symmetry check**  
The LCP matrix must be symmetric: `lcp[i][j] = lcp[j][i]`. Our matrix satisfies this too.

**Step 3: Building the string**  
We'll try to construct the string character by character. Start with position 0: we don't know its character yet, so assign it `'a'`.

Now look at `lcp[0][1] = 0`. This means suffixes starting at 0 and 1 share no common prefix, so `word[0] ≠ word[1]`. Since position 0 is `'a'`, position 1 must be different—assign it `'b'`.

Check `lcp[0][2] = 0`: suffixes at 0 and 2 share no prefix, so `word[0] ≠ word[2]`. Position 0 is `'a'`, so position 2 cannot be `'a'`. It could be `'b'` or a new letter.

**Step 4: Using transitive relationships**  
Look at `lcp[1][2] = 1`: suffixes at 1 and 2 share a prefix of length 1, meaning `word[1] = word[2]`. Since position 1 is `'b'`, position 2 must also be `'b'`. But wait—this conflicts with our earlier deduction that position 2 cannot be `'a'` (which is fine) but also cannot be `'b'` because `lcp[0][2] = 0` would require `word[0] ≠ word[2]`. If position 2 were `'b'`, then `word[0] = 'a'` and `word[2] = 'b'` are different, satisfying `lcp[0][2] = 0`. So `word = "abb"` seems plausible.

**Step 5: Verification**  
For `word = "abb"`:

- Suffixes: `"abb"`, `"bb"`, `"b"`
- `lcp[0][1]`: between `"abb"` and `"bb"` → longest common prefix is `""` (length 0) ✓
- `lcp[0][2]`: between `"abb"` and `"b"` → `""` (length 0) ✓
- `lcp[1][2]`: between `"bb"` and `"b"` → `"b"` (length 1) ✓

The matrix matches! This example shows the core challenge: we must ensure all pairwise constraints are consistent while constructing the string.

## Brute Force Approach

A naive approach would be to generate all possible strings of length `n` (26^n possibilities) and compute their LCP matrices to compare with the input. Computing the LCP matrix for a string takes O(n²) time, leading to O(26^n \* n²) complexity—impossible for n > 5.

Even smarter brute force might try backtracking: assign letters one by one, checking consistency with the LCP matrix so far. However, checking consistency at each step requires verifying O(k²) pairs for the first k positions, leading to O(n³) worst-case time. While better than exponential, this is still inefficient for n up to 1000.

The key insight is that we don't need to explore many possibilities—the LCP matrix itself tells us exactly which positions must have equal characters through the LCP values.

## Optimized Approach

The optimal solution uses **Union-Find (Disjoint Set Union)** to group positions that must have the same character, then verifies all constraints systematically.

**Step-by-step reasoning:**

1. **Basic validity checks**:
   - Matrix must be n x n
   - `lcp[i][i]` must equal `n - i` (suffix length)
   - Matrix must be symmetric: `lcp[i][j] == lcp[j][i]`
   - LCP values must be in range `[0, n - max(i, j)]` (can't exceed possible common prefix)

2. **Grouping equal characters**:
   - If `lcp[i][j] > 0`, then `word[i]` must equal `word[j]` (since they share at least first character)
   - Use Union-Find to group all positions with `lcp[i][j] > 0`
   - Each group will get the same character

3. **Assigning characters**:
   - Assign the smallest available letter (`'a'`, then `'b'`, etc.) to each group
   - If we need more than 26 groups, return `""` (only lowercase letters allowed)

4. **Verifying LCP values**:
   - For each pair `(i, j)`:
     - If `word[i] ≠ word[j]`, then `lcp[i][j]` must be 0
     - If `word[i] = word[j]`, then `lcp[i][j]` should be:
       - `0` if the next characters differ
       - `1 + lcp[i+1][j+1]` if `i+1 < n` and `j+1 < n`
       - `1` otherwise (when at least one is at last position)
   - We must also check that `lcp[i][j]` doesn't imply equality beyond string bounds

5. **Constructing the result**:
   - If all checks pass, build the string from the group assignments
   - Otherwise, return empty string

The Union-Find efficiently handles the equivalence relationships, and the verification ensures the matrix is consistent with the constructed string.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2) for storing the matrix, O(n) for Union-Find
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
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
    def findTheString(self, lcp: List[List[int]]) -> str:
        n = len(lcp)

        # Step 1: Basic validity checks
        for i in range(n):
            if len(lcp[i]) != n:  # Not n x n matrix
                return ""
            if lcp[i][i] != n - i:  # Diagonal check
                return ""
            for j in range(n):
                if lcp[i][j] != lcp[j][i]:  # Symmetry check
                    return ""
                if lcp[i][j] > n - max(i, j):  # Can't exceed possible prefix
                    return ""

        # Step 2: Group positions that must have same character
        uf = UnionFind(n)
        for i in range(n):
            for j in range(i + 1, n):
                if lcp[i][j] > 0:
                    uf.union(i, j)

        # Step 3: Assign characters to groups
        char_assignment = [''] * n
        next_char = ord('a')

        for i in range(n):
            root = uf.find(i)
            if not char_assignment[root]:
                if next_char > ord('z'):
                    return ""  # Need more than 26 letters
                char_assignment[root] = chr(next_char)
                next_char += 1
            char_assignment[i] = char_assignment[root]

        # Step 4: Verify all LCP values are consistent
        for i in range(n):
            for j in range(n):
                # Check if characters match as indicated by LCP
                if lcp[i][j] == 0:
                    if char_assignment[i] == char_assignment[j]:
                        # If characters are same, LCP should be at least 1
                        # Unless we're at the end of string
                        if i + 1 < n and j + 1 < n and lcp[i+1][j+1] > 0:
                            return ""
                else:
                    # Characters must match
                    if char_assignment[i] != char_assignment[j]:
                        return ""

                    # Check LCP recurrence relation
                    expected = 1
                    if i + 1 < n and j + 1 < n:
                        expected += lcp[i+1][j+1]
                    else:
                        expected = 1  # At least the current matching character

                    # LCP can't exceed n - max(i, j)
                    expected = min(expected, n - max(i, j))

                    if lcp[i][j] != expected:
                        return ""

        # Step 5: Construct the result string
        return ''.join(char_assignment)
```

```javascript
// Time: O(n^2) | Space: O(n^2) for matrix, O(n) for Union-Find
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
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
 * @param {number[][]} lcp
 * @return {string}
 */
var findTheString = function (lcp) {
  const n = lcp.length;

  // Step 1: Basic validity checks
  for (let i = 0; i < n; i++) {
    if (lcp[i].length !== n) return ""; // Not n x n matrix
    if (lcp[i][i] !== n - i) return ""; // Diagonal check
    for (let j = 0; j < n; j++) {
      if (lcp[i][j] !== lcp[j][i]) return ""; // Symmetry check
      if (lcp[i][j] > n - Math.max(i, j)) return ""; // Can't exceed possible prefix
    }
  }

  // Step 2: Group positions that must have same character
  const uf = new UnionFind(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (lcp[i][j] > 0) {
        uf.union(i, j);
      }
    }
  }

  // Step 3: Assign characters to groups
  const charAssignment = new Array(n).fill("");
  let nextChar = "a".charCodeAt(0);

  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    if (!charAssignment[root]) {
      if (nextChar > "z".charCodeAt(0)) return ""; // Need more than 26 letters
      charAssignment[root] = String.fromCharCode(nextChar);
      nextChar++;
    }
    charAssignment[i] = charAssignment[root];
  }

  // Step 4: Verify all LCP values are consistent
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Check if characters match as indicated by LCP
      if (lcp[i][j] === 0) {
        if (charAssignment[i] === charAssignment[j]) {
          // If characters are same, LCP should be at least 1
          // Unless we're at the end of string
          if (i + 1 < n && j + 1 < n && lcp[i + 1][j + 1] > 0) {
            return "";
          }
        }
      } else {
        // Characters must match
        if (charAssignment[i] !== charAssignment[j]) return "";

        // Check LCP recurrence relation
        let expected = 1;
        if (i + 1 < n && j + 1 < n) {
          expected += lcp[i + 1][j + 1];
        } else {
          expected = 1; // At least the current matching character
        }

        // LCP can't exceed n - max(i, j)
        expected = Math.min(expected, n - Math.max(i, j));

        if (lcp[i][j] !== expected) return "";
      }
    }
  }

  // Step 5: Construct the result string
  return charAssignment.join("");
};
```

```java
// Time: O(n^2) | Space: O(n^2) for matrix, O(n) for Union-Find
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
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
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
    public String findTheString(int[][] lcp) {
        int n = lcp.length;

        // Step 1: Basic validity checks
        for (int i = 0; i < n; i++) {
            if (lcp[i].length != n) return ""; // Not n x n matrix
            if (lcp[i][i] != n - i) return ""; // Diagonal check
            for (int j = 0; j < n; j++) {
                if (lcp[i][j] != lcp[j][i]) return ""; // Symmetry check
                if (lcp[i][j] > n - Math.max(i, j)) return ""; // Can't exceed possible prefix
            }
        }

        // Step 2: Group positions that must have same character
        UnionFind uf = new UnionFind(n);
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (lcp[i][j] > 0) {
                    uf.union(i, j);
                }
            }
        }

        // Step 3: Assign characters to groups
        char[] charAssignment = new char[n];
        char nextChar = 'a';

        for (int i = 0; i < n; i++) {
            int root = uf.find(i);
            if (charAssignment[root] == 0) {
                if (nextChar > 'z') return ""; // Need more than 26 letters
                charAssignment[root] = nextChar;
                nextChar++;
            }
            charAssignment[i] = charAssignment[root];
        }

        // Step 4: Verify all LCP values are consistent
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // Check if characters match as indicated by LCP
                if (lcp[i][j] == 0) {
                    if (charAssignment[i] == charAssignment[j]) {
                        // If characters are same, LCP should be at least 1
                        // Unless we're at the end of string
                        if (i + 1 < n && j + 1 < n && lcp[i+1][j+1] > 0) {
                            return "";
                        }
                    }
                } else {
                    // Characters must match
                    if (charAssignment[i] != charAssignment[j]) return "";

                    // Check LCP recurrence relation
                    int expected = 1;
                    if (i + 1 < n && j + 1 < n) {
                        expected += lcp[i+1][j+1];
                    } else {
                        expected = 1; // At least the current matching character
                    }

                    // LCP can't exceed n - max(i, j)
                    expected = Math.min(expected, n - Math.max(i, j));

                    if (lcp[i][j] != expected) return "";
                }
            }
        }

        // Step 5: Construct the result string
        return new String(charAssignment);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the length of the string (matrix dimension). We perform:

- O(n²) basic validity checks (nested loops)
- O(n²) Union-Find operations (each union/find is nearly O(1) with path compression)
- O(n²) verification checks
- O(n) string construction

**Space Complexity:** O(n²) to store the input matrix. The Union-Find data structure uses O(n) space, and the character assignment array uses O(n) space.

## Common Mistakes

1. **Missing diagonal check**: Forgetting that `lcp[i][i]` must equal `n - i` (the length of the suffix starting at i). This is a fundamental property of LCP matrices.

2. **Incorrect LCP recurrence verification**: The key recurrence is `lcp[i][j] = 0` if `word[i] ≠ word[j]`, otherwise `lcp[i][j] = 1 + lcp[i+1][j+1]` (if within bounds). Candidates often miss the bounds check or the base case.

3. **Overlooking the 26-letter constraint**: The problem specifies lowercase English letters, so we can't use more than 26 distinct characters. If Union-Find creates more than 26 groups, we must return `""`.

4. **Not checking symmetry**: LCP matrices are symmetric by definition (`lcp[i][j] = lcp[j][i]`). Failing to verify this can lead to accepting invalid matrices.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Union-Find for equivalence relationships**: Problems where you need to group elements that must be equal appear in:
   - [LeetCode 1061: Lexicographically Smallest Equivalent String](https://leetcode.com/problems/lexicographically-smallest-equivalent-string/) - Group characters that are equivalent
   - [LeetCode 721: Accounts Merge](https://leetcode.com/problems/accounts-merge/) - Group accounts with common emails

2. **Matrix verification problems**: Checking if a given matrix satisfies certain properties:
   - [LeetCode 840: Magic Squares In Grid](https://leetcode.com/problems/magic-squares-in-grid/) - Verify magic square properties
   - [LeetCode 766: Toeplitz Matrix](https://leetcode.com/problems/toeplitz-matrix/) - Check diagonal consistency

3. **String reconstruction from constraints**:
   - [LeetCode 1153: String Transforms Into Another String](https://leetcode.com/problems/string-transforms-into-another-string/) - Check if character mappings are consistent

## Key Takeaways

1. **LCP matrices have a recursive structure**: `lcp[i][j] > 0` implies `word[i] = word[j]` and `lcp[i][j] = 1 + lcp[i+1][j+1]` (when within bounds). This recurrence is key to both construction and verification.

2. **Union-Find elegantly handles equality constraints**: When multiple positions must have the same character, Union-Find groups them efficiently, avoiding complex graph traversal or backtracking.

3. **Verification is as important as construction**: For "reverse engineering" problems, always verify that your constructed solution satisfies all given constraints. Missing a single check can lead to accepting invalid inputs.

[Practice this problem on CodeJeet](/problem/find-the-string-with-lcp)
