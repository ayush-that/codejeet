---
title: "How to Solve Pyramid Transition Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pyramid Transition Matrix. Medium difficulty, 60.6% acceptance rate. Topics: Hash Table, String, Backtracking, Bit Manipulation."
date: "2027-05-04"
category: "dsa-patterns"
tags: ["pyramid-transition-matrix", "hash-table", "string", "backtracking", "medium"]
---

# How to Solve Pyramid Transition Matrix

This problem asks us to determine if we can build a pyramid of colored blocks given a bottom row and a set of allowed triangular patterns. The challenge lies in efficiently exploring the exponential search space of possible color combinations while respecting the transition rules. What makes this problem interesting is how it combines backtracking with clever state representation—it's essentially a constraint satisfaction problem disguised as a pyramid construction.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- `bottom = "BCD"`
- `allowed = ["BCC","CDE","CEA","FFF"]`

**Rules:** Each allowed string `"XYZ"` means that when you have two adjacent blocks `X` and `Y` in a row, you can place block `Z` above them in the next row.

**Step 1:** Start with bottom row `"BCD"` (row length = 3)

```
Row 3: B C D
```

**Step 2:** Generate possible middle rows (row length = 2)

- For positions `(B,C)` → allowed tops: `"C"` (from `"BCC"`)
- For positions `(C,D)` → allowed tops: `"E"` (from `"CDE"`)

Possible middle rows: `"CE"` (only combination that works)

**Step 3:** Generate possible top rows (row length = 1)

- For positions `(C,E)` → allowed tops: `"A"` (from `"CEA"`)

Possible top rows: `"A"`

**Step 4:** We reached a single block at the top, so the pyramid is valid!

The pyramid looks like:

```
    A
   C E
  B C D
```

The tricky part is when there are multiple allowed tops for a position—we need to try all combinations and backtrack if one fails.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible pyramids from the bottom up
2. For each position, try every allowed top block
3. Recursively build upward
4. Check if we reach a single block at the top

The problem with this brute force is the exponential explosion. If each pair has `k` possible tops, and we have `n` blocks in the bottom row, we could have `k^(n-1)` possible pyramids to check. For `n=8` and `k=3`, that's `3^7 = 2187` possibilities—manageable. But for `n=20`, it's `3^19 ≈ 1.16 billion` possibilities, which is too slow.

The key insight we need is **pruning**: we should fail fast when a particular path can't lead to a valid pyramid, rather than exploring all possibilities.

## Optimized Approach

The optimized solution uses **backtracking with memoization**:

1. **Preprocess allowed patterns** into a dictionary for O(1) lookups:
   - Key: `(left_block, right_block)` tuple
   - Value: Set of possible top blocks

2. **Build pyramid recursively** from bottom to top:
   - Given a current row, generate all possible next rows
   - For each possible next row, recurse upward
   - If any path reaches a single block, return success

3. **Add memoization** to avoid redundant work:
   - Cache results for `(current_row)` pairs
   - If we've already computed whether a row can reach the top, reuse the result

4. **Use bitmask optimization** (optional but efficient):
   - Represent colors as bits (A=1, B=2, C=4, etc.)
   - Store allowed tops as bitmasks instead of sets
   - This makes set operations faster via bitwise OR

The critical insight is that the problem has **optimal substructure**: whether a row can form a valid pyramid depends only on the row itself and the allowed patterns, not on how we got there.

## Optimal Solution

Here's the complete solution with backtracking and memoization:

<div class="code-group">

```python
# Time: O(A^N) where A = avg allowed tops per pair, N = bottom length
# Space: O(N^2) for memoization and recursion stack
class Solution:
    def pyramidTransition(self, bottom: str, allowed: List[str]) -> bool:
        # Step 1: Build transition map
        # Map (left, right) -> set of possible tops
        trans = {}
        for pattern in allowed:
            left, right, top = pattern[0], pattern[1], pattern[2]
            key = (left, right)
            if key not in trans:
                trans[key] = set()
            trans[key].add(top)

        # Memoization cache: (row_string) -> can_form_pyramid
        memo = {}

        def can_form(row):
            # Base case: single block means we reached the top
            if len(row) == 1:
                return True

            # Check memoization cache
            if row in memo:
                return memo[row]

            # Step 2: Generate all possible next rows
            # First, get all possible blocks for each position
            possible_blocks = []
            for i in range(len(row) - 1):
                key = (row[i], row[i + 1])
                if key not in trans:
                    # No allowed pattern for this pair
                    memo[row] = False
                    return False
                possible_blocks.append(trans[key])

            # Step 3: Generate all combinations of possible blocks
            # This is the Cartesian product of all sets in possible_blocks
            next_rows = []
            self.generate_combinations(possible_blocks, 0, "", next_rows)

            # Step 4: Try each possible next row
            for next_row in next_rows:
                if can_form(next_row):
                    memo[row] = True
                    return True

            # No valid next row found
            memo[row] = False
            return False

        # Helper to generate all combinations of blocks
        def generate_combinations(blocks, idx, current, results):
            if idx == len(blocks):
                results.append(current)
                return
            for block in blocks[idx]:
                generate_combinations(blocks, idx + 1, current + block, results)

        return can_form(bottom)
```

```javascript
// Time: O(A^N) where A = avg allowed tops per pair, N = bottom length
// Space: O(N^2) for memoization and recursion stack
function pyramidTransition(bottom, allowed) {
  // Step 1: Build transition map
  const trans = new Map();
  for (const pattern of allowed) {
    const left = pattern[0];
    const right = pattern[1];
    const top = pattern[2];
    const key = left + right;

    if (!trans.has(key)) {
      trans.set(key, new Set());
    }
    trans.get(key).add(top);
  }

  // Memoization cache
  const memo = new Map();

  // Helper to generate all combinations
  function generateCombinations(blocks, idx, current, results) {
    if (idx === blocks.length) {
      results.push(current);
      return;
    }
    for (const block of blocks[idx]) {
      generateCombinations(blocks, idx + 1, current + block, results);
    }
  }

  // Main recursive function
  function canForm(row) {
    // Base case: single block means we reached the top
    if (row.length === 1) {
      return true;
    }

    // Check memoization cache
    if (memo.has(row)) {
      return memo.get(row);
    }

    // Step 2: Generate all possible blocks for each position
    const possibleBlocks = [];
    for (let i = 0; i < row.length - 1; i++) {
      const key = row[i] + row[i + 1];
      if (!trans.has(key)) {
        // No allowed pattern for this pair
        memo.set(row, false);
        return false;
      }
      possibleBlocks.push(Array.from(trans.get(key)));
    }

    // Step 3: Generate all combinations
    const nextRows = [];
    generateCombinations(possibleBlocks, 0, "", nextRows);

    // Step 4: Try each possible next row
    for (const nextRow of nextRows) {
      if (canForm(nextRow)) {
        memo.set(row, true);
        return true;
      }
    }

    // No valid next row found
    memo.set(row, false);
    return false;
  }

  return canForm(bottom);
}
```

```java
// Time: O(A^N) where A = avg allowed tops per pair, N = bottom length
// Space: O(N^2) for memoization and recursion stack
class Solution {
    private Map<String, Set<Character>> trans = new HashMap<>();
    private Map<String, Boolean> memo = new HashMap<>();

    public boolean pyramidTransition(String bottom, List<String> allowed) {
        // Step 1: Build transition map
        for (String pattern : allowed) {
            String key = pattern.substring(0, 2);
            char top = pattern.charAt(2);

            trans.putIfAbsent(key, new HashSet<>());
            trans.get(key).add(top);
        }

        return canForm(bottom);
    }

    private boolean canForm(String row) {
        // Base case: single block means we reached the top
        if (row.length() == 1) {
            return true;
        }

        // Check memoization cache
        if (memo.containsKey(row)) {
            return memo.get(row);
        }

        // Step 2: Generate all possible blocks for each position
        List<Set<Character>> possibleBlocks = new ArrayList<>();
        for (int i = 0; i < row.length() - 1; i++) {
            String key = row.substring(i, i + 2);
            if (!trans.containsKey(key)) {
                // No allowed pattern for this pair
                memo.put(row, false);
                return false;
            }
            possibleBlocks.add(trans.get(key));
        }

        // Step 3: Generate all combinations
        List<String> nextRows = new ArrayList<>();
        generateCombinations(possibleBlocks, 0, new StringBuilder(), nextRows);

        // Step 4: Try each possible next row
        for (String nextRow : nextRows) {
            if (canForm(nextRow)) {
                memo.put(row, true);
                return true;
            }
        }

        // No valid next row found
        memo.put(row, false);
        return false;
    }

    private void generateCombinations(List<Set<Character>> blocks, int idx,
                                      StringBuilder current, List<String> results) {
        if (idx == blocks.size()) {
            results.add(current.toString());
            return;
        }
        for (char block : blocks.get(idx)) {
            current.append(block);
            generateCombinations(blocks, idx + 1, current, results);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(A^(N)) in the worst case, where:

- `N` is the length of the bottom row
- `A` is the average number of allowed tops per pair

However, with memoization, we avoid recomputing the same rows multiple times. In practice, the runtime is much better than the worst case because:

1. We prune early when a pair has no allowed top
2. Memoization caches results for rows we've already computed
3. The pyramid shrinks by 1 block each level

**Space Complexity:** O(N²) because:

- The recursion depth is O(N) (from bottom row to top)
- The memoization cache stores results for O(N²) different row strings in the worst case
- Each recursive call uses O(N) space for the next row

## Common Mistakes

1. **Forgetting to handle missing transitions**: If `(left, right)` has no allowed top, we should return `false` immediately. Some candidates continue trying other combinations instead of pruning.

2. **Not using memoization**: Without memoization, the solution becomes exponential. For example, the same intermediate row might be reached through different paths, and recomputing it wastes time.

3. **Incorrect combination generation**: When generating the next row, you need the Cartesian product of all possible blocks at each position. A common mistake is to only take the first possible block at each position or to combine blocks incorrectly.

4. **Off-by-one errors in indexing**: When iterating through pairs `(row[i], row[i+1])`, the loop should go from `0` to `len(row)-2`. Going to `len(row)-1` causes an index out of bounds error.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Backtracking with pruning**: Similar to Sudoku Solver (LeetCode 37) or N-Queens (LeetCode 51), where you try possibilities and backtrack when constraints are violated.

2. **Memoization for optimal substructure**: Like in Word Break (LeetCode 139) or Decode Ways (LeetCode 91), where the solution for a problem depends on solutions to subproblems.

3. **State space search with constraints**: Related to Course Schedule (LeetCode 207) where you need to find a valid ordering given prerequisites.

The core technique is **recursive search with memoization** applied to problems that have:

- A clear recursive structure
- Overlapping subproblems
- Constraints that can be checked locally

## Key Takeaways

1. **Recognize recursive structure**: When a problem can be broken down into smaller instances of the same problem (building a pyramid from row N to row N-1), recursion is often the right approach.

2. **Memoize overlapping subproblems**: If you find yourself computing the same intermediate result multiple times, add a cache. This transforms exponential time to polynomial time in many cases.

3. **Prune early, prune often**: In backtracking problems, check constraints as soon as possible and return `false` immediately if they're violated. This prevents exploring dead ends.

[Practice this problem on CodeJeet](/problem/pyramid-transition-matrix)
