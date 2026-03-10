---
title: "How to Solve Find Champion I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Champion I. Easy difficulty, 73.3% acceptance rate. Topics: Array, Matrix."
date: "2028-07-02"
category: "dsa-patterns"
tags: ["find-champion-i", "array", "matrix", "easy"]
---

# How to Solve Find Champion I

This problem asks us to find the "champion" team in a tournament where we're given a matrix showing which team beats which. The tricky part is understanding that the champion is defined as the team that beats **all other teams** — but we only have pairwise comparisons, and the matrix isn't necessarily symmetric or complete in the traditional sense.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have 4 teams (0, 1, 2, 3) with this matrix:

```
grid = [
    [0, 1, 1, 0],  # Team 0 beats teams 1 and 2, loses to 3
    [0, 0, 0, 0],  # Team 1 loses to everyone
    [0, 1, 0, 0],  # Team 2 beats team 1, loses to 0 and 3
    [1, 1, 1, 0]   # Team 3 beats everyone (0, 1, 2)
]
```

Let's check each team:

- **Team 0**: Beats teams 1 and 2 (grid[0][1]=1, grid[0][2]=1), but loses to team 3 (grid[0][3]=0). Not champion.
- **Team 1**: Loses to everyone (all 0's in row 1). Not champion.
- **Team 2**: Beats team 1 (grid[2][1]=1), but loses to teams 0 and 3. Not champion.
- **Team 3**: Beats teams 0, 1, and 2 (grid[3][0]=1, grid[3][1]=1, grid[3][2]=1). This is the champion!

The key insight: A team is champion if **every cell in its row** (except the diagonal) equals 1. The diagonal doesn't matter since a team doesn't play against itself.

## Brute Force Approach

The most straightforward approach is to check each team individually. For each team `i`, we look at all other teams `j` (where `j != i`) and verify that `grid[i][j] == 1` for every `j`. If we find any `j` where `grid[i][j] == 0`, team `i` is not the champion.

This brute force approach is actually optimal for this problem! Since we need to check every pair `(i, j)` to determine if a team beats all others, we can't do better than O(n²) in the worst case. However, we can optimize our implementation to be cleaner and more efficient in practice.

What makes this problem interesting is that there's only one champion guaranteed (or possibly none in edge cases), and we need to find it efficiently.

## Optimal Solution

The optimal solution is straightforward: iterate through each team and check if it beats all other teams. We can implement this cleanly by checking each row of the matrix.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def findChampion(grid):
    """
    Find the champion team in a tournament.

    Args:
        grid: 2D list where grid[i][j] = 1 if team i beats team j

    Returns:
        The index of the champion team, or -1 if no champion exists
    """
    n = len(grid)  # Number of teams

    # Check each team to see if it's the champion
    for i in range(n):
        is_champion = True

        # Check if team i beats all other teams j
        for j in range(n):
            # Skip comparing team with itself (diagonal)
            if i == j:
                continue

            # If team i doesn't beat team j, it's not champion
            if grid[i][j] == 0:
                is_champion = False
                break  # No need to check further

        # If we found a champion, return it immediately
        # (Problem guarantees at most one champion)
        if is_champion:
            return i

    # Return -1 if no champion found (shouldn't happen per problem constraints)
    return -1
```

```javascript
// Time: O(n²) | Space: O(1)
function findChampion(grid) {
  /**
   * Find the champion team in a tournament.
   *
   * @param {number[][]} grid - 2D array where grid[i][j] = 1 if team i beats team j
   * @return {number} The index of the champion team, or -1 if no champion exists
   */
  const n = grid.length; // Number of teams

  // Check each team to see if it's the champion
  for (let i = 0; i < n; i++) {
    let isChampion = true;

    // Check if team i beats all other teams j
    for (let j = 0; j < n; j++) {
      // Skip comparing team with itself (diagonal)
      if (i === j) continue;

      // If team i doesn't beat team j, it's not champion
      if (grid[i][j] === 0) {
        isChampion = false;
        break; // No need to check further
      }
    }

    // If we found a champion, return it immediately
    // (Problem guarantees at most one champion)
    if (isChampion) {
      return i;
    }
  }

  // Return -1 if no champion found (shouldn't happen per problem constraints)
  return -1;
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    /**
     * Find the champion team in a tournament.
     *
     * @param grid 2D array where grid[i][j] = 1 if team i beats team j
     * @return The index of the champion team, or -1 if no champion exists
     */
    public int findChampion(int[][] grid) {
        int n = grid.length;  // Number of teams

        // Check each team to see if it's the champion
        for (int i = 0; i < n; i++) {
            boolean isChampion = true;

            // Check if team i beats all other teams j
            for (int j = 0; j < n; j++) {
                // Skip comparing team with itself (diagonal)
                if (i == j) continue;

                // If team i doesn't beat team j, it's not champion
                if (grid[i][j] == 0) {
                    isChampion = false;
                    break;  // No need to check further
                }
            }

            // If we found a champion, return it immediately
            // (Problem guarantees at most one champion)
            if (isChampion) {
                return i;
            }
        }

        // Return -1 if no champion found (shouldn't happen per problem constraints)
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the number of teams. In the worst case, we need to check every cell in the n × n matrix to find the champion. Even though we break early when we find a team that loses to someone, we might need to check most of the matrix if the champion is near the end or doesn't exist.

**Space Complexity:** O(1). We only use a constant amount of extra space for variables like `n`, `i`, `j`, and `is_champion`. We don't create any data structures that grow with input size.

## Common Mistakes

1. **Checking the diagonal**: The most common mistake is including the diagonal in the comparison. Since `grid[i][i]` represents a team against itself, it's always 0 (or could be anything), but it shouldn't affect whether a team is champion. Always skip when `i == j`.

2. **Not breaking early**: When you find that a team loses to another team (`grid[i][j] == 0`), you should immediately break out of the inner loop. There's no need to check the rest of that team's opponents.

3. **Assuming symmetric matrix**: Some candidates assume `grid[i][j]` and `grid[j][i]` should be opposites. While this is true for valid tournament data, don't rely on it in your logic. Check each condition independently.

4. **Forgetting about the single champion guarantee**: The problem guarantees there's exactly one champion, so you can return immediately when you find it. You don't need to check if multiple champions exist or handle that case.

## When You'll See This Pattern

This pattern of checking rows in a matrix for a specific condition appears in several problems:

1. **Find the Town Judge (LeetCode 997)**: Similar concept but reversed — you're looking for a node that everyone trusts but trusts no one. Instead of checking rows, you check columns for incoming edges.

2. **Find the Celebrity (LeetCode 277)**: Almost identical concept — you have an n × n matrix where `knows(a, b)` tells you if a knows b, and you need to find someone everyone knows but who knows no one.

3. **Game of Life (LeetCode 289)**: While different in purpose, it also involves examining each cell in a matrix and its neighbors to apply rules.

The core pattern is **matrix traversal with conditional checking** — you're given relationships in matrix form and need to find an element that satisfies specific row/column conditions.

## Key Takeaways

1. **Matrix problems often have O(n²) lower bounds**: When you need to examine pairwise relationships between n elements, you often can't do better than checking O(n²) relationships.

2. **Skip diagonals in comparison matrices**: When a matrix represents comparisons between different elements (not self-comparisons), the diagonal is meaningless and should be skipped.

3. **Break early for efficiency**: Even with O(n²) complexity, you can optimize constant factors by breaking out of loops as soon as you know an element doesn't meet the criteria.

4. **Read problem constraints carefully**: The guarantee of exactly one champion simplifies the problem significantly. Always note such constraints as they affect implementation decisions.

[Practice this problem on CodeJeet](/problem/find-champion-i)
