---
title: "Depth-First Search Questions at MakeMyTrip: What to Expect"
description: "Prepare for Depth-First Search interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-09"
category: "dsa-patterns"
tags: ["makemytrip", "depth-first-search", "interview prep"]
---

If you're preparing for a software engineering interview at MakeMyTrip, you might have noticed a specific pattern in their question bank: **Depth-First Search (DFS)** appears in roughly 1 out of every 6 problems. With 4 dedicated DFS questions out of 24 total, it's not their absolute top focus (like arrays or strings), but it's a consistent, high-signal secondary topic. In real interviews, this translates to a strong likelihood you'll encounter at least one medium-difficulty DFS problem, often in the second technical round. The reason is practical: MakeMyTrip's core business—travel itineraries, flight/hotel/route mapping, and package bundling—inherently involves navigating hierarchical data (like category trees for destinations) and exploring state spaces (like finding all possible trip combinations within a budget). DFS is the natural tool for these "find all possibilities" or "explore all paths" scenarios.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's DFS questions rarely test simple binary tree traversal. Instead, they focus on **applied DFS on implicit graphs** and **backtracking with pruning**. You can expect problems where the graph isn't given to you with an adjacency list; you have to deduce it from the problem statement and build the traversal logic yourself.

Two patterns dominate:

1.  **Backtracking for Combinatorial Search:** Problems where you must generate all valid combinations or permutations, often with constraints. Think "find all unique travel packages under $X" or "list all possible flight sequences between cities." This is classic DFS with state maintenance and undo steps.
2.  **DFS on Grids (Matrix Traversal):** Given a 2D matrix representing something like a map, seating chart, or connectivity grid, you use DFS to explore regions. MakeMyTrip often adds a twist, like you can only move in certain directions (simulating travel routes) or must track a secondary condition (like a budget or time limit).

For example, a problem like **"Number of Islands" (LeetCode #200)** is a foundational grid DFS they might use as a warm-up. But more representative would be **"Word Search" (LeetCode #79)**, which combines grid DFS with backtracking (you must mark cells as used and then unmark them). Another telling example is **"Combination Sum" (LeetCode #39)**, a pure backtracking problem about finding all unique combinations that sum to a target—directly analogous to finding trip bundles within a budget.

## How to Prepare

The key is to internalize the backtracking template. It has four parts: a goal/base case, a loop over candidates, a choice, the recursive call, and an undo step. Let's look at the core pattern for a combinatorial problem like "find all combinations of `k` numbers from `1..n`" (LeetCode #77).

<div class="code-group">

```python
def combine(n: int, k: int) -> List[List[int]]:
    result = []

    def backtrack(start: int, current: List[int]):
        # 1. Goal/Base Case: We have a complete combination
        if len(current) == k:
            result.append(current.copy())  # Append a copy
            return

        # 2. Iterate over candidate choices (from start to n)
        for i in range(start, n + 1):
            # 3. Make a choice
            current.append(i)
            # 4. Explore recursively with updated state (i+1 avoids reuse)
            backtrack(i + 1, current)
            # 5. Undo the choice (backtrack)
            current.pop()

    backtrack(1, [])
    return result

# Time Complexity: O(C(n, k) * k). We explore each valid combination, and copying a combo takes O(k).
# Space Complexity: O(k) for the recursion call stack and current path, excluding output storage.
```

```javascript
function combine(n, k) {
  const result = [];

  function backtrack(start, current) {
    // 1. Goal/Base Case
    if (current.length === k) {
      result.push([...current]); // Append a copy
      return;
    }

    // 2. Iterate over candidates
    for (let i = start; i <= n; i++) {
      // 3. Make a choice
      current.push(i);
      // 4. Explore recursively
      backtrack(i + 1, current);
      // 5. Undo the choice
      current.pop();
    }
  }

  backtrack(1, []);
  return result;
}

// Time: O(C(n, k) * k) | Space: O(k) for recursion depth and current path.
```

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(1, n, k, new ArrayList<>(), result);
    return result;
}

private void backtrack(int start, int n, int k,
                       List<Integer> current,
                       List<List<Integer>> result) {
    // 1. Goal/Base Case
    if (current.size() == k) {
        result.add(new ArrayList<>(current)); // Crucial: copy the list
        return;
    }

    // 2. Iterate over candidates
    for (int i = start; i <= n; i++) {
        // 3. Make a choice
        current.add(i);
        // 4. Explore recursively
        backtrack(i + 1, n, k, current, result);
        // 5. Undo the choice
        current.remove(current.size() - 1);
    }
}

// Time: O(C(n, k) * k) | Space: O(k) for recursion depth and current list.
```

</div>

For grid DFS, the pattern changes slightly: your "candidates" are the four (or eight) directions, and you must check bounds and conditions.

## How MakeMyTrip Tests Depth-First Search vs Other Companies

Compared to FAANG companies, MakeMyTrip's DFS questions are less about algorithmic novelty and more about **clean implementation of applied logic**. At Google, you might get a DFS problem disguised as a complex graph theory puzzle (e.g., finding Eulerian paths). At Amazon, DFS often appears in object-oriented design contexts (like serializing a tree). At MakeMyTrip, the scenario is more direct: "Here is a grid of seats/flights/cities; find all connected components or possible paths." The difficulty is usually medium, not hard. They care that you can translate a business constraint (e.g., "a customer can't take two overnight buses in a row") into a pruning condition in your backtracking code. The evaluation focuses on correctness, handling edge cases, and code clarity over extreme optimization.

## Study Order

Tackle DFS in this logical sequence to build competence without getting overwhelmed:

1.  **Basic Tree Traversal:** Understand pre-order, in-order, and post-order DFS on a binary tree. This teaches the fundamental recursive call structure.
2.  **DFS on Adjacency Lists:** Practice traversing explicit graphs (like from "Clone Graph", LeetCode #133) to get comfortable with visited sets and handling cycles.
3.  **DFS on Grids (Matrix):** Learn to navigate 2D arrays. Start with "Number of Islands" (#200), then move to "Word Search" (#79). This introduces movement in directions and in-place marking.
4.  **Backtracking (Combinatorial DFS):** This is the core for MakeMyTrip. Start with simple combination generation ("Combinations", #77), then progress to problems with constraints ("Combination Sum", #39, "Subsets", #78).
5.  **Backtracking on Grids:** Combine the last two concepts. Solve problems like "Unique Paths III" (#980) or "Sudoku Solver" (#37), where you explore all paths in a grid with undo steps.
6.  **Memoization + DFS (DFS with DP):** Finally, learn to optimize repeated subproblems using memoization, as seen in "Word Break II" (#140) or "Longest Increasing Path in a Matrix" (#329). This is less common at MakeMyTrip but good for completeness.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **Binary Tree Inorder Traversal (LeetCode #94)** - Pure recursive DFS.
2.  **Number of Islands (#200)** - Foundational grid DFS.
3.  **Combinations (#77)** - Foundational backtracking template.
4.  **Combination Sum (#39)** - Backtracking with a reuse twist.
5.  **Word Search (#79)** - Backtracking on a grid.
6.  **Subsets (#78)** - Backtracking to generate all subsets.
7.  **Target Sum (#494)** - Backtracking that feels like a puzzle (can be optimized with memoization).
8.  **Unique Paths III (#980)** - A harder grid backtracking problem that tests state management.

Mastering this progression will make you confident for any DFS question MakeMyTrip throws your way. Remember, their goal is to see if you can model a real-world travel or booking scenario as a graph traversal problem and implement it correctly. Focus on writing clean, bug-free backtracking code with clear base cases and pruning.

[Practice Depth-First Search at MakeMyTrip](/company/makemytrip/depth-first-search)
