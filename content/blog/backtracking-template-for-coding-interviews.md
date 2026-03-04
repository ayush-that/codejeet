---
title: "The Backtracking Template That Solves 90% of Problems"
description: "Learn a single backtracking template that handles permutations, combinations, subsets, and constraint satisfaction problems."
date: "2026-07-10"
category: "tips"
tags: ["backtracking", "recursion", "algorithms", "interview prep"]
---

Backtracking problems all follow the same structure. Learn the template and you can adapt it to permutations, combinations, subsets, N-Queens, Sudoku, and nearly every other backtracking problem in interviews.

## The Core Template

```
function backtrack(current_state, choices):
    if current_state is a valid solution:
        add to results; return

    for each choice in available_choices:
        if choice is valid:
            make the choice
            backtrack(updated_state, remaining_choices)
            undo the choice
```

Choose, explore, unchoose. This systematic exploration covers all possibilities while pruning avoids redundant work.

Let's translate this template into concrete code. The `current_state` is often a list or string representing the partial solution being built. The `choices` are the options available at the current decision point. The `undo` step is crucial—it's what allows the algorithm to backtrack and explore other paths after returning from a recursive call.

<div class="code-group">

```python
def backtrack_template(path, choices):
    """
    A generic backtracking template.
    path: list representing the current partial solution.
    choices: list of available choices at this level.
    """
    if is_solution(path):
        result.append(path.copy())  # Append a copy, not the reference
        return

    for choice in choices:
        if is_valid(choice, path):
            path.append(choice)          # Make the choice
            # Update choices for the next level (problem-specific)
            new_choices = update_choices(choices, choice)
            backtrack_template(path, new_choices)
            path.pop()                   # Undo the choice (backtrack)
```

```javascript
function backtrackTemplate(path, choices) {
  /**
   * A generic backtracking template.
   * path: array representing the current partial solution.
   * choices: array of available choices at this level.
   */
  if (isSolution(path)) {
    result.push([...path]); // Push a shallow copy
    return;
  }

  for (let choice of choices) {
    if (isValid(choice, path)) {
      path.push(choice); // Make the choice
      // Update choices for the next level (problem-specific)
      const newChoices = updateChoices(choices, choice);
      backtrackTemplate(path, newChoices);
      path.pop(); // Undo the choice (backtrack)
    }
  }
}
```

```java
import java.util.ArrayList;
import java.util.List;

public class BacktrackTemplate {
    List<List<Integer>> result = new ArrayList<>();

    public void backtrackTemplate(List<Integer> path, List<Integer> choices) {
        /**
         * A generic backtracking template.
         * path: list representing the current partial solution.
         * choices: list of available choices at this level.
         */
        if (isSolution(path)) {
            result.add(new ArrayList<>(path)); // Add a copy
            return;
        }

        for (Integer choice : choices) {
            if (isValid(choice, path)) {
                path.add(choice);              // Make the choice
                // Update choices for the next level (problem-specific)
                List<Integer> newChoices = updateChoices(choices, choice);
                backtrackTemplate(path, newChoices);
                path.remove(path.size() - 1);  // Undo the choice (backtrack)
            }
        }
    }

    // Placeholder methods to be implemented per problem
    private boolean isSolution(List<Integer> path) { return false; }
    private boolean isValid(Integer choice, List<Integer> path) { return false; }
    private List<Integer> updateChoices(List<Integer> choices, Integer choice) { return new ArrayList<>(); }
}
```

</div>

## Subsets

For `[1, 2, 3]`, generate all subsets. At each recursion level, iterate through remaining elements starting from the current index, adding each to the current subset and recursing. Every partial state is a valid result, so add to results at every level. Use a start index to avoid duplicates.

The key insight is that for each element, you have two choices: include it or exclude it. The recursive approach naturally explores both branches. The `start` index ensures we only consider elements that come after the current one, preventing permutations of the same subset (e.g., `[1,2]` and `[2,1]`).

<div class="code-group">

```python
def subsets(nums):
    def backtrack(start, path):
        # Add the current subset (path) to the result.
        # We do this at the beginning to include the empty set.
        result.append(path.copy())

        for i in range(start, len(nums)):
            path.append(nums[i])      # Choose nums[i]
            backtrack(i + 1, path)    # Explore further with this choice
            path.pop()                # Undo the choice (backtrack)

    result = []
    backtrack(0, [])
    return result

# Example: subsets([1,2,3]) returns:
# [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

```javascript
function subsets(nums) {
  const result = [];

  function backtrack(start, path) {
    // Add the current subset (path) to the result.
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]); // Choose nums[i]
      backtrack(i + 1, path); // Explore further
      path.pop(); // Undo the choice (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}

// Example: subsets([1,2,3]) returns:
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

```java
import java.util.ArrayList;
import java.util.List;

public class Subsets {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        // Add the current subset (path) to the result.
        result.add(new ArrayList<>(path));

        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                 // Choose nums[i]
            backtrack(nums, i + 1, path, result); // Explore further
            path.remove(path.size() - 1);      // Undo the choice (backtrack)
        }
    }
}
// Example: subsets([1,2,3]) returns:
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

</div>

For **Subsets II** (input has duplicates): sort first, skip consecutive duplicates at the same recursion level. This duplicate-skipping technique is universal across backtracking.

The sorting ensures duplicates are adjacent. The condition `i > start and nums[i] == nums[i-1]` ensures we skip a duplicate element only if it's not the first element we are considering at this recursion level. If `i == start`, it's the first element of this branch and should be included.

<div class="code-group">

```python
def subsetsWithDup(nums):
    def backtrack(start, path):
        result.append(path.copy())
        for i in range(start, len(nums)):
            # Skip duplicates at the same level
            if i > start and nums[i] == nums[i-1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    nums.sort()  # Crucial step
    result = []
    backtrack(0, [])
    return result

# Example: subsetsWithDup([1,2,2]) returns:
# [[], [1], [1,2], [1,2,2], [2], [2,2]]
```

```javascript
function subsetsWithDup(nums) {
  const result = [];
  nums.sort((a, b) => a - b); // Crucial step

  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      // Skip duplicates at the same level
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(0, []);
  return result;
}
// Example: subsetsWithDup([1,2,2]) returns:
// [[], [1], [1,2], [1,2,2], [2], [2,2]]
```

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SubsetsII {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums); // Crucial step
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            // Skip duplicates at the same level
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.add(nums[i]);
            backtrack(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}
// Example: subsetsWithDup([1,2,2]) returns:
// [[], [1], [1,2], [1,2,2], [2], [2,2]]
```

</div>

## Combinations

Subsets with a size constraint. Add to results only when the combination has exactly K elements. Prune early: if remaining elements cannot reach K, stop recursing.

The pruning condition `if (path.size() == k)` is the goal check. An additional, more advanced pruning condition is: if the number of elements left to choose from (`n - i + 1`) plus the current path size is less than `k`, we can stop that branch early.

**Combination Sum** allows repeated use of elements -- keep the start index at the current element instead of advancing. **Combination Sum II** (no reuse, duplicates in input): advance the index and skip duplicates at each level.

Let's look at the standard combination problem first.

<div class="code-group">

```python
def combine(n, k):
    def backtrack(start, path):
        # Prune: if path size equals k, we have a valid combination
        if len(path) == k:
            result.append(path.copy())
            return
        # Advanced Prune: if not enough numbers left to fill path to size k
        # Remaining numbers: n - i + 1
        # Needed numbers: k - len(path)
        # We iterate i from start to n, but we can stop early.
        # The loop condition handles this implicitly, but we can add an explicit check:
        # for i in range(start, n + 1):
        #     if (n - i + 1) < (k - len(path)):
        #         break
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)  # i+1 ensures we don't reuse the same element
            path.pop()

    result = []
    backtrack(1, [])
    return result

# Example: combine(4, 2) returns:
# [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

```javascript
function combine(n, k) {
  const result = [];

  function backtrack(start, path) {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    // Prune: stop if not enough numbers left
    for (let i = start; i <= n; i++) {
      // Optional explicit pruning:
      // if (n - i + 1 < k - path.length) break;
      path.push(i);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(1, []);
  return result;
}
// Example: combine(4, 2) returns:
// [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

```java
import java.util.ArrayList;
import java.util.List;

public class Combinations {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(1, n, k, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int start, int n, int k, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        // Prune: stop if not enough numbers left
        for (int i = start; i <= n; i++) {
            // Optional explicit pruning:
            // if (n - i + 1 < k - path.size()) break;
            path.add(i);
            backtrack(i + 1, n, k, path, result);
            path.remove(path.size() - 1);
        }
    }
}
// Example: combine(4, 2) returns:
// [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

</div>

Now, let's examine **Combination Sum**, where you can use the same element multiple times to reach a target.

<div class="code-group">

```python
def combinationSum(candidates, target):
    def backtrack(start, path, current_sum):
        if current_sum == target:
            result.append(path.copy())
            return
        if current_sum > target:
            return  # Prune: sum exceeded

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Note: we pass `i` (not i+1) to allow reuse of the same element
            backtrack(i, path, current_sum + candidates[i])
            path.pop()

    result = []
    backtrack(0, [], 0)
    return result

# Example: combinationSum([2,3,6,7], 7) returns:
# [[2,2,3], [7]]
```

```javascript
function combinationSum(candidates, target) {
  const result = [];

  function backtrack(start, path, currentSum) {
    if (currentSum === target) {
      result.push([...path]);
      return;
    }
    if (currentSum > target) return; // Prune

    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      // Pass `i` to allow reuse
      backtrack(i, path, currentSum + candidates[i]);
      path.pop();
    }
  }

  backtrack(0, [], 0);
  return result;
}
// Example: combinationSum([2,3,6,7], 7) returns:
// [[2,2,3], [7]]
```

```java
import java.util.ArrayList;
import java.util.List;

public class CombinationSum {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), 0, result);
        return result;
    }

    private void backtrack(int[] candidates, int target, int start,
                           List<Integer> path, int currentSum,
                           List<List<Integer>> result) {
        if (currentSum == target) {
            result.add(new ArrayList<>(path));
            return;
        }
        if (currentSum > target) return; // Prune

        for (int i = start; i < candidates.length; i++) {
            path.add(candidates[i]);
            // Pass `i` to allow reuse
            backtrack(candidates, target, i, path, currentSum + candidates[i], result);
            path.remove(path.size() - 1);
        }
    }
}
// Example: combinationSum([2,3,6,7], 7) returns:
// [[2,2,3], [7]]
```

</div>

## Permutations

Order matters, so instead of a start index, use a visited array. At each position, try every unused element, mark as used, recurse, then unmark.

The key difference from subsets/combinations is that for permutations, the order of elements matters, so we must consider all elements that haven't been used yet at each step. The `visited` array (or set) tracks which elements are currently in the path.

<div class="code-group">

```python
def permute(nums):
    def backtrack(path):
        if len(path) == len(nums):
            result.append(path.copy())
            return

        for i in range(len(nums)):
            if not visited[i]:
                visited[i] = True
                path.append(nums[i])
                backtrack(path)
                path.pop()
                visited[i] = False  # Undo: mark as unused for other branches

    result = []
    visited = [False] * len(nums)
    backtrack([])
    return result

# Example: permute([1,2,3]) returns:
# [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

```javascript
function permute(nums) {
  const result = [];
  const visited = new Array(nums.length).fill(false);

  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (!visited[i]) {
        visited[i] = true;
        path.push(nums[i]);
        backtrack(path);
        path.pop();
        visited[i] = false; // Undo
      }
    }
  }

  backtrack([]);
  return result;
}
// Example: permute([1,2,3]) returns:
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

```java
import java.util.ArrayList;
import java.util.List;

public class Permutations {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        boolean[] visited = new boolean[nums.length];
        backtrack(nums, new ArrayList<>(), visited, result);
        return result;
    }

    private void backtrack(int[] nums, List<Integer> path,
                           boolean[] visited, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (!visited[i]) {
                visited[i] = true;
                path.add(nums[i]);
                backtrack(nums, path, visited, result);
                path.remove(path.size() - 1);
                visited[i] = false; // Undo
            }
        }
    }
}
// Example: permute([1,2,3]) returns:
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

</div>

For **Permutations II** (duplicates): sort first. At the same recursion level, skip an element if it equals the previous one and the previous was not used in this branch.

The condition `(i > 0 and nums[i] == nums[i-1] and not visited[i-1])` is subtle. It ensures we skip a duplicate only if the previous identical element hasn't been used in the current permutation path. If `visited[i-1]` is `True`, it means the previous duplicate is already in the path, and using the current duplicate is fine (it leads to a different position in the permutation). If it's `False`, it means we are at the same decision level and choosing the same value again would create a duplicate permutation.

<div class="code-group">

```python
def permuteUnique(nums):
    def backtrack(path):
        if len(path) == len(nums):
            result.append(path.copy())
            return

        for i in range(len(nums)):
            # Skip if element is used, OR
            # Skip if it's a duplicate and the previous duplicate is not used (same level)
            if visited[i] or (i > 0 and nums[i] == nums[i-1] and not visited[i-1]):
                continue
            visited[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            visited[i] = False

    nums.sort()  # Crucial step
    result = []
    visited = [False] * len(nums)
    backtrack([])
    return result

# Example: permuteUnique([1,1,2]) returns:
# [[1,1,2], [1,2,1], [2,1,1]]
```

```javascript
function permuteUnique(nums) {
  const result = [];
  nums.sort((a, b) => a - b); // Crucial step
  const visited = new Array(nums.length).fill(false);

  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (visited[i]) continue;
      // Skip duplicates at the same level
      if (i > 0 && nums[i] === nums[i - 1] && !visited[i - 1]) continue;

      visited[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      visited[i] = false;
    }
  }

  backtrack([]);
  return result;
}
// Example: permuteUnique([1,1,2]) returns:
// [[1,1,2], [1,2,1], [2,1,1]]
```

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PermutationsII {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums); // Crucial step
        boolean[] visited = new boolean[nums.length];
        backtrack(nums, new ArrayList<>(), visited, result);
        return result;
    }

    private void backtrack(int[] nums, List<Integer> path,
                           boolean[] visited, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (visited[i]) continue;
            // Skip duplicates at the same level
            if (i > 0 && nums[i] == nums[i - 1] && !visited[i - 1]) continue;

            visited[i] = true;
            path.add(nums[i]);
            backtrack(nums, path, visited, result);
            path.remove(path.size() - 1);
            visited[i] = false;
        }
    }
}
// Example: permuteUnique([1,1,2]) returns:
// [[1,1,2], [1,2,1], [2,1,1]]
```

</div>

## N-Queens Walkthrough

Place N queens on an N x N board with no conflicts. One queen per row structures the recursion: each level is a row, and you try all columns.

**Validate** with three sets: columns, "row - col" diagonals, and "row + col" anti-diagonals. Before placing, check all three. After recursing, remove from all three.

The diagonal trick is critical. For any square `(r, c)`:

- A "downward" diagonal (from top-left to bottom-right) has a constant value of `r - c`.
- An "upward" diagonal (from bottom-left to top-right) has a constant value of `r + c`.
  By storing these values in sets, we can check for diagonal conflicts in O(1) time.

<div class="code-group">

```python
def solveNQueens(n):
    def backtrack(row):
        # Base case: all rows filled
        if row == n:
            # Convert board configuration to required output format
            solution = []
            for r in range(n):
                row_str = []
                for c in range(n):
                    row_str.append('Q' if board[r][c] else '.')
                solution.append(''.join(row_str))
            result.append(solution)
            return

        for col in range(n):
            # Check if column, diag1, diag2 are free
            diag1 = row - col
            diag2 = row + col
            if col in cols or diag1 in diag1_set or diag2 in diag2_set:
                continue

            # Place the queen
            board[row][col] = True
            cols.add(col)
            diag1_set.add(diag1)
            diag2_set.add(diag2)

            backtrack(row + 1)

            # Remove the queen (backtrack)
            board[row][col] = False
            cols.remove(col)
            diag1_set.remove(diag1)
            diag2_set.remove(diag2)

    result = []
    # Using a 2D boolean board is optional; we mainly rely on sets for validation.
    board = [[False] * n for _ in range(n)]
    cols = set()
    diag1_set = set()  # (row - col)
    diag2_set = set()  # (row + col)
    backtrack(0)
    return result

# Example: solveNQueens(4) returns:
# [[".Q..","...Q","Q...","..Q."], ["..Q.","Q...","...Q",".Q.."]]
```

```javascript
function solveNQueens(n) {
  const result = [];
  const board = Array.from({ length: n }, () => Array(n).fill("."));
  const cols = new Set();
  const diag1 = new Set(); // (row - col)
  const diag2 = new Set(); // (row + col)

  function backtrack(row) {
    if (row === n) {
      // Save a copy of the board configuration
      const solution = board.map((rowArr) => rowArr.join(""));
      result.push(solution);
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col;
      const d2 = row + col;
      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
        continue;
      }

      // Place queen
      board[row][col] = "Q";
      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);

      backtrack(row + 1);

      // Remove queen (backtrack)
      board[row][col] = ".";
      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
    }
  }

  backtrack(0);
  return result;
}
// Example: solveNQueens(4) returns:
// [[".Q..","...Q","Q...","..Q."], ["..Q.","Q...","...Q",".Q.."]]
```

```java
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NQueens {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                board[i][j] = '.';
            }
        }
        Set<Integer> cols = new HashSet<>();
        Set<Integer> diag1 = new HashSet<>(); // (row - col)
        Set<Integer> diag2 = new HashSet<>(); // (row + col)
        backtrack(board, 0, n, cols, diag1, diag2, result);
        return result;
    }

    private void backtrack(char[][] board, int row, int n,
                           Set<Integer> cols, Set<Integer> diag1, Set<Integer> diag2,
                           List<List<String>> result) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] r : board) {
                solution.add(new String(r));
            }
            result.add(solution);
            return;
        }

        for (int col = 0; col < n; col++) {
            int d1 = row - col;
            int d2 = row + col;
            if (cols.contains(col) || diag1.contains(d1) || diag2.contains(d2)) {
                continue;
            }

            // Place queen
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(d1);
            diag2.add(d2);

            backtrack(board, row + 1, n, cols, diag1, diag2, result);

            // Remove queen (backtrack)
            board[row][col] = '.';
            cols.remove(col);
            diag1.remove(d1);
            diag2.remove(d2);
        }
    }
}
// Example: solveNQueens(4) returns:
// [[".Q..","...Q","Q...","..Q."], ["..Q.","Q...","...Q",".Q.."]]
```

</div>

## Pruning Strategies

**Constraint checking.** Validate before making a choice (column and diagonal checks in N-Queens, row/column/box checks in Sudoku).

**Sorting for duplicate skipping.** Sort input, skip elements equal to the previous at the same level. Works for Subsets II, Combination Sum II, Permutations II.

**Bound checking.** If remaining elements cannot reach a valid solution, prune. In Combination Sum, stop if the current sum exceeds the target. In the standard combination problem, we saw the advanced prune: `if (n - i + 1) < (k - len(path)): break`.

Let's look at a practical example of bound checking in **Combination Sum III**, where we find all combinations of `k` numbers that add up to `n` using numbers 1-9 only once.

<div class="code-group">

```python
def combinationSum3(k, n):
    def backtrack(start, path, current_sum):
        # Bound checking: if sum already exceeds target, prune
        if current_sum > n:
            return
        if len(path) == k:
            if current_sum == n:
                result.append(path.copy())
            return
        # Bound checking: if not enough numbers left to reach k, prune
        # Remaining numbers: 9 - i + 1
        # Needed numbers: k - len(path)
        for i in range(start, 10):
            # Explicit prune
            if (9 - i + 1) < (k - len(path)):
                break
            path.append(i)
            backtrack(i + 1, path, current_sum + i)
            path.pop()

    result = []
    backtrack(1, [], 0)
    return result

# Example: combinationSum3(3, 7) returns [[1,2,4]]
```

```javascript
function combinationSum3(k, n) {
  const result = [];

  function backtrack(start, path, currentSum) {
    if (currentSum > n) return; // Prune: sum exceeded
    if (path.length === k) {
      if (currentSum === n) result.push([...path]);
      return;
    }
    for (let i = start; i <= 9; i++) {
      // Prune: not enough numbers left
      if (9 - i + 1 < k - path.length) break;
      path.push(i);
      backtrack(i + 1, path, currentSum + i);
      path.pop();
    }
  }

  backtrack(1, [], 0);
  return result;
}
// Example: combinationSum3(3, 7) returns [[1,2,4]]
```

```java
import java.util.ArrayList;
import java.util.List;

public class CombinationSumIII {
    public List<List<Integer>> combinationSum3(int k, int n) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(1, k, n, new ArrayList<>(), 0, result);
        return result;
    }

    private void backtrack(int start, int k, int n,
                           List<Integer> path, int currentSum,
                           List<List<Integer>> result) {
        if (currentSum > n) return; // Prune
        if (path.size() == k) {
            if (currentSum == n) result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i <= 9; i++) {
            // Prune: not enough numbers left
            if ((9 - i + 1) < (k - path.size())) break;
            path.add(i);
            backtrack(i + 1, k, n, path, currentSum + i, result);
            path.remove(path.size() - 1);
        }
    }
}
// Example: combinationSum3(3, 7) returns [[1,2,4]]
```

</div>

## Backtracking vs DP

If the problem has overlapping subproblems, DP is more efficient. If it requires enumerating all solutions with no overlap, backtracking is the right tool. Word Break uses DP for feasibility; Word Break II uses backtracking for all segmentations.

**Word Break (DP)**: Determine if a string can be segmented into dictionary words. This is a decision problem with optimal substructure, solved efficiently with DP (O(n²) time).

**Word Break II (Backtracking)**: Find all possible segmentations. Here, we need to enumerate all valid splits, which is a natural fit for backtracking. We explore each possible prefix that is a word, and recursively process the remaining suffix.

<div class="code-group">

```python
# Word Break II - Backtracking approach
def wordBreak(s, wordDict):
    wordSet = set(wordDict)
    result = []

    def backtrack(start, path):
        if start == len(s):
            result.append(' '.join(path))
            return

        for end in range(start + 1, len(s) + 1):
            prefix = s[start:end]
            if prefix in wordSet:
                path.append(prefix)
                backtrack(end, path)
                path.pop()  # Backtrack

    backtrack(0, [])
    return result

# Example: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
# Returns: ["cats and dog", "cat sand dog"]
```

```javascript
// Word Break II - Backtracking approach
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const result = [];

  function backtrack(start, path) {
    if (start === s.length) {
      result.push(path.join(" "));
      return;
    }

    for (let end = start + 1; end <= s.length; end++) {
      const prefix = s.substring(start, end);
      if (wordSet.has(prefix)) {
        path.push(prefix);
        backtrack(end, path);
        path.pop(); // Backtrack
      }
    }
  }

  backtrack(0, []);
  return result;
}
// Example: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
// Returns: ["cats and dog", "cat sand dog"]
```

```java
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class WordBreakII {
    public List<String> wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        List<String> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), wordSet, result);
        return result;
    }

    private void backtrack(String s, int start, List<String> path,
                           Set<String> wordSet, List<String> result) {
        if (start == s.length()) {
            result.add(String.join(" ", path));
            return;
        }

        for (int end = start + 1; end <= s.length(); end++) {
            String prefix = s.substring(start, end);
            if (wordSet.contains(prefix)) {
                path.add(prefix);
                backtrack(s, end, path, wordSet, result);
                path.remove(path.size()
```
