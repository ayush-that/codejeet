---
title: "How to Solve Lexicographically Smallest Generated String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest Generated String. Hard difficulty, 31.5% acceptance rate. Topics: String, Greedy, String Matching."
date: "2026-08-21"
category: "dsa-patterns"
tags: ["lexicographically-smallest-generated-string", "string", "greedy", "string-matching", "hard"]
---

# How to Solve Lexicographically Smallest Generated String

This problem asks us to find the lexicographically smallest string that can be generated from two input strings `str1` and `str2` according to specific rules. The tricky part is that the generation rules create dependencies between positions in the output string, and we need to find the smallest possible result while satisfying all constraints simultaneously.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `str1 = "FTT"` (n=3)
- `str2 = "FT"` (m=2)

We need to generate a string `word` of length `n + m - 1 = 3 + 2 - 1 = 4`.

The rules say:

1. If `str1[i] == 'T'`, then the substring `word[i:i+m]` must equal `str2`
2. If `str1[i] == 'F'`, then the substring `word[i:i+m]` must NOT equal `str2`

Let's work through this step by step:

**Step 1: Process str1[0] = 'F'**

- Since it's 'F', `word[0:2]` must NOT equal `str2 = "FT"`
- So `word[0]` and `word[1]` cannot be "FT"
- We want the lexicographically smallest string, so let's try starting with 'A'
- If `word[0] = 'A'`, then `word[1]` can be 'A' (since "AA" ≠ "FT")
- So far: `word = "AA??"`

**Step 2: Process str1[1] = 'T'**

- Since it's 'T', `word[1:3]` MUST equal `str2 = "FT"`
- This means `word[1]` must be 'F' and `word[2]` must be 'T'
- But we already set `word[1] = 'A'`! This creates a conflict
- We need to backtrack and reconsider our earlier choices

**Step 3: Backtrack and find consistent solution**
Let's think systematically:

- For `str1[1] = 'T'`, we need `word[1:3] = "FT"`
- So `word[1] = 'F'` and `word[2] = 'T'`
- For `str1[0] = 'F'`, we need `word[0:2] ≠ "FT"`
- With `word[1] = 'F'`, `word[0]` cannot be 'F' (or we'd get "FF" which is fine, but wait...)
- Actually, "FF" ≠ "FT", so `word[0]` can be 'F'
- But we want lexicographically smallest, so try 'A' first
- If `word[0] = 'A'`, then `word[0:2] = "AF"` ≠ "FT" ✓
- For `str1[2] = 'T'`, we need `word[2:4] = "FT"`
- We already have `word[2] = 'T'`, so we need `word[3] = 'F'`

Final solution: `word = "AFTF"`

This example shows the dependencies between positions and why we need a systematic approach.

## Brute Force Approach

A naive approach would be to try all possible strings of length `n + m - 1` and check which ones satisfy all the constraints. Since each character can be one of 26 letters, there would be 26^(n+m-1) possibilities to check, which is astronomically large even for small inputs.

Even a slightly better brute force would try to build the string character by character, but without proper constraint propagation, we'd end up with exponential backtracking. The key insight is that the constraints create overlapping requirements that we can resolve systematically.

## Optimized Approach

The optimal solution uses a **union-find (disjoint set union)** data structure with lexicographic ordering. Here's the step-by-step reasoning:

1. **Understanding the constraints**: Each position `i` in `str1` imposes constraints on a window of `m` characters in `word`. When `str1[i] = 'T'`, all positions in `word[i:i+m]` are forced to match specific characters from `str2`. When `str1[i] = 'F'`, we get inequality constraints.

2. **Graph representation**: We can think of each position in `word` as a node. The equality constraints (`str1[i] = 'T'`) create edges that force certain positions to have the same character (specifically, they must equal the corresponding character in `str2`).

3. **Union-Find for equality constraints**: First, we process all `str1[i] = 'T'` cases. For each such `i`, we know that `word[i+j]` must equal `str2[j]` for all `0 ≤ j < m`. This creates equivalence classes of positions that must have the same character.

4. **Handling inequality constraints**: After establishing equality constraints, we process `str1[i] = 'F'` cases. For each window, we check if applying the forced characters would make the window equal to `str2`. If it would, we have a contradiction and return `""`.

5. **Lexicographically smallest assignment**: Once we have equivalence classes, we need to assign the smallest possible character to each class while respecting that all positions in a class must have the same character. We can assign 'a' to each class initially, then check if any inequality constraints force us to use a larger character.

6. **Key optimization**: We process constraints in a way that allows us to build the solution greedily. The union-find structure ensures we propagate equality constraints efficiently, and by processing from left to right, we can make locally optimal choices that lead to the globally smallest string.

## Optimal Solution

<div class="code-group">

```python
# Time: O((n+m) * α(n+m)) where α is the inverse Ackermann function (effectively O(1))
# Space: O(n+m) for the union-find structure and result array
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

def smallestGeneratedString(str1: str, str2: str) -> str:
    n, m = len(str1), len(str2)
    total_len = n + m - 1

    # Initialize DSU for all positions in the result string
    dsu = DSU(total_len)

    # Step 1: Process all equality constraints (str1[i] == 'T')
    for i in range(n):
        if str1[i] == 'T':
            # For each position in the window, union it with the requirement
            for j in range(m):
                # Position i+j in word must equal str2[j]
                # We'll handle the actual character assignment later
                # For now, just mark that positions in this window are linked
                # Actually, we need to link positions that must have the same char
                # All positions where str2[j] is the same should be linked
                # But here, each position gets a specific required char from str2
                # So we'll store required chars separately
                pass

    # Better approach: Create arrays to track required characters
    required = [''] * total_len
    must_equal = [[] for _ in range(total_len)]

    # Process 'T' constraints to build equivalence classes
    for i in range(n):
        if str1[i] == 'T':
            for j in range(m):
                pos = i + j
                if required[pos] and required[pos] != str2[j]:
                    # Conflict: same position required to be two different chars
                    return ""
                required[pos] = str2[j]

    # Now link positions that must have the same character
    # We need to know which positions have the same required char
    char_to_positions = {}
    for pos in range(total_len):
        if required[pos]:
            if required[pos] not in char_to_positions:
                char_to_positions[required[pos]] = []
            char_to_positions[required[pos]].append(pos)

    # Union all positions that require the same character
    for char, positions in char_to_positions.items():
        for k in range(1, len(positions)):
            dsu.union(positions[0], positions[k])

    # Step 2: Check inequality constraints (str1[i] == 'F')
    for i in range(n):
        if str1[i] == 'F':
            # Build what the window would look like with current constraints
            window_chars = []
            for j in range(m):
                pos = i + j
                root = dsu.find(pos)
                # If this position has a required char, use it
                # Otherwise, we'll use the smallest possible later
                if required[pos]:
                    window_chars.append(required[pos])
                else:
                    # For now, use placeholder
                    window_chars.append('')

            # Check if we can avoid making this window equal to str2
            # We need at least one position where we can make it different
            can_be_different = False
            for j in range(m):
                if not window_chars[j]:
                    # This position is not fixed, we can choose a char != str2[j]
                    can_be_different = True
                    break
                elif window_chars[j] != str2[j]:
                    # Already different at this position
                    can_be_different = True
                    break

            if not can_be_different:
                # All positions are fixed and match str2 exactly
                return ""

    # Step 3: Assign smallest possible characters
    result = [''] * total_len

    # First, assign required characters
    for pos in range(total_len):
        if required[pos]:
            root = dsu.find(pos)
            # All positions in this component get the same char
            for p in range(total_len):
                if dsu.find(p) == root and not result[p]:
                    result[p] = required[pos]

    # Then, assign 'a' to remaining positions
    for pos in range(total_len):
        if not result[pos]:
            result[pos] = 'a'

    # Final check: verify all constraints
    for i in range(n):
        window = ''.join(result[i:i+m])
        if str1[i] == 'T' and window != str2:
            return ""
        if str1[i] == 'F' and window == str2:
            return ""

    return ''.join(result)
```

```javascript
// Time: O((n+m) * α(n+m)) where α is the inverse Ackermann function
// Space: O(n+m) for the union-find structure and result array
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

function smallestGeneratedString(str1, str2) {
  const n = str1.length;
  const m = str2.length;
  const totalLen = n + m - 1;

  // Initialize DSU
  const dsu = new DSU(totalLen);

  // Track required characters for each position
  const required = new Array(totalLen).fill("");

  // Step 1: Process equality constraints (str1[i] === 'T')
  for (let i = 0; i < n; i++) {
    if (str1[i] === "T") {
      for (let j = 0; j < m; j++) {
        const pos = i + j;
        if (required[pos] && required[pos] !== str2[j]) {
          // Conflict: same position requires two different characters
          return "";
        }
        required[pos] = str2[j];
      }
    }
  }

  // Group positions by required character
  const charToPositions = new Map();
  for (let pos = 0; pos < totalLen; pos++) {
    if (required[pos]) {
      if (!charToPositions.has(required[pos])) {
        charToPositions.set(required[pos], []);
      }
      charToPositions.get(required[pos]).push(pos);
    }
  }

  // Union all positions that require the same character
  for (const [char, positions] of charToPositions) {
    for (let k = 1; k < positions.length; k++) {
      dsu.union(positions[0], positions[k]);
    }
  }

  // Step 2: Check inequality constraints (str1[i] === 'F')
  for (let i = 0; i < n; i++) {
    if (str1[i] === "F") {
      let canBeDifferent = false;

      for (let j = 0; j < m; j++) {
        const pos = i + j;
        if (required[pos]) {
          // Position has a fixed character
          if (required[pos] !== str2[j]) {
            // Already different at this position
            canBeDifferent = true;
            break;
          }
          // If required[pos] === str2[j], continue checking
        } else {
          // Position is not fixed, we can choose a different character
          canBeDifferent = true;
          break;
        }
      }

      if (!canBeDifferent) {
        // All positions are fixed and match str2 exactly
        return "";
      }
    }
  }

  // Step 3: Assign smallest possible characters
  const result = new Array(totalLen).fill("");

  // First, assign required characters to their components
  for (let pos = 0; pos < totalLen; pos++) {
    if (required[pos]) {
      const root = dsu.find(pos);
      // Assign this character to all positions in the same component
      for (let p = 0; p < totalLen; p++) {
        if (dsu.find(p) === root && !result[p]) {
          result[p] = required[pos];
        }
      }
    }
  }

  // Then, assign 'a' to remaining positions
  for (let pos = 0; pos < totalLen; pos++) {
    if (!result[pos]) {
      result[pos] = "a";
    }
  }

  // Final verification
  for (let i = 0; i < n; i++) {
    const window = result.slice(i, i + m).join("");
    if (str1[i] === "T" && window !== str2) {
      return "";
    }
    if (str1[i] === "F" && window === str2) {
      return "";
    }
  }

  return result.join("");
}
```

```java
// Time: O((n+m) * α(n+m)) where α is the inverse Ackermann function
// Space: O(n+m) for the union-find structure and result array
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

public class Solution {
    public String smallestGeneratedString(String str1, String str2) {
        int n = str1.length();
        int m = str2.length();
        int totalLen = n + m - 1;

        DSU dsu = new DSU(totalLen);
        char[] required = new char[totalLen];

        // Step 1: Process equality constraints
        for (int i = 0; i < n; i++) {
            if (str1.charAt(i) == 'T') {
                for (int j = 0; j < m; j++) {
                    int pos = i + j;
                    if (required[pos] != 0 && required[pos] != str2.charAt(j)) {
                        // Conflict: position requires two different characters
                        return "";
                    }
                    required[pos] = str2.charAt(j);
                }
            }
        }

        // Group positions by required character
        Map<Character, List<Integer>> charToPositions = new HashMap<>();
        for (int pos = 0; pos < totalLen; pos++) {
            if (required[pos] != 0) {
                charToPositions.computeIfAbsent(required[pos], k -> new ArrayList<>()).add(pos);
            }
        }

        // Union positions that require the same character
        for (List<Integer> positions : charToPositions.values()) {
            for (int k = 1; k < positions.size(); k++) {
                dsu.union(positions.get(0), positions.get(k));
            }
        }

        // Step 2: Check inequality constraints
        for (int i = 0; i < n; i++) {
            if (str1.charAt(i) == 'F') {
                boolean canBeDifferent = false;

                for (int j = 0; j < m; j++) {
                    int pos = i + j;
                    if (required[pos] != 0) {
                        if (required[pos] != str2.charAt(j)) {
                            // Already different at this position
                            canBeDifferent = true;
                            break;
                        }
                    } else {
                        // Position is not fixed
                        canBeDifferent = true;
                        break;
                    }
                }

                if (!canBeDifferent) {
                    // All positions are fixed and match str2
                    return "";
                }
            }
        }

        // Step 3: Assign smallest possible characters
        char[] result = new char[totalLen];

        // Assign required characters
        for (int pos = 0; pos < totalLen; pos++) {
            if (required[pos] != 0) {
                int root = dsu.find(pos);
                for (int p = 0; p < totalLen; p++) {
                    if (dsu.find(p) == root && result[p] == 0) {
                        result[p] = required[pos];
                    }
                }
            }
        }

        // Assign 'a' to remaining positions
        for (int pos = 0; pos < totalLen; pos++) {
            if (result[pos] == 0) {
                result[pos] = 'a';
            }
        }

        // Final verification
        for (int i = 0; i < n; i++) {
            StringBuilder window = new StringBuilder();
            for (int j = 0; j < m; j++) {
                window.append(result[i + j]);
            }
            if (str1.charAt(i) == 'T' && !window.toString().equals(str2)) {
                return "";
            }
            if (str1.charAt(i) == 'F' && window.toString().equals(str2)) {
                return "";
            }
        }

        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n+m) \* α(n+m)) where α is the inverse Ackermann function, which grows extremely slowly and is effectively constant for all practical purposes. The main operations are:

- Processing all n positions in str1, each looking at m positions in the window: O(n\*m)
- Union-find operations: O((n+m) \* α(n+m))
- Final assignment and verification: O(n\*m)

**Space Complexity:** O(n+m) for:

- The union-find data structure (parent and rank arrays)
- The required characters array
- The result array
- Auxiliary maps/lists for grouping positions

## Common Mistakes

1. **Not handling conflicting requirements early**: Some solutions try to build the string first and only check constraints at the end. This leads to exponential backtracking. Always check for contradictions as soon as possible.

2. **Incorrect union-find implementation**: Forgetting path compression or union-by-rank makes the solution slower. Remember that union-find needs both optimizations to achieve near-constant time operations.

3. **Missing the final verification**: Even after careful construction, always verify all constraints at the end. Edge cases might slip through, especially with complex inequality constraints.

4. **Not considering all positions in inequality windows**: When checking if an 'F' constraint can be satisfied, you must check ALL positions in the window. Finding one position that can be different is sufficient, but you need to check them all to confirm if it's impossible.

## When You'll See This Pattern

This problem combines **union-find for constraint satisfaction** with **greedy lexicographic optimization**. You'll see similar patterns in:

1. **Lexicographically Smallest Equivalent String (LeetCode 1061)**: Uses union-find to group equivalent characters, then assigns the smallest character to each group.

2. **Satisfiability of Equality Equations (LeetCode 990)**: Uses union-find to handle equality constraints, then checks inequality constraints against the established equivalences.

3. **Similar String Groups (LeetCode 839)**: Uses union-find to group similar strings, though the similarity condition is different.

The key insight is recognizing when constraints create equivalence classes that need to be tracked efficiently.

## Key Takeaways

1. **Union-find is powerful for constraint propagation**: When you have equality constraints that create equivalence classes, union-find provides an efficient way to track and merge these classes.

2. **Process constraints in the right order**: Handle hard constraints (equalities) first, then check if soft constraints (inequalities) can be satisfied. This often reveals contradictions early.

3. **Greedy assignment works for lexicographic order**: When building the smallest string, assigning the smallest possible character ('a') to each position and only increasing when forced by constraints typically yields the optimal result.

Related problems: [Lexicographically Smallest Equivalent String](/problem/lexicographically-smallest-equivalent-string)
