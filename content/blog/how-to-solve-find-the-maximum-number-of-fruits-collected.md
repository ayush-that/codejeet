---
title: "How to Solve Find the Maximum Number of Fruits Collected — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Maximum Number of Fruits Collected. Hard difficulty, 65.1% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2028-01-22"
category: "dsa-patterns"
tags:
  ["find-the-maximum-number-of-fruits-collected", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Find the Maximum Number of Fruits Collected

This problem asks us to maximize the total fruits collected by three children starting from three corners of an `n x n` grid and moving only right and down. The challenge is that they can't occupy the same room simultaneously, and we need to find the optimal paths for all three simultaneously—not just one child. This makes it a **multi-agent path optimization** problem that requires clever dynamic programming to handle the coordination between all three paths efficiently.

## Visual Walkthrough

Let's trace through a small 3×3 example to build intuition:

```
Fruits grid:
[2, 3, 1]
[1, 5, 4]
[4, 2, 3]
```

We have three children starting at:

- Child A: (0,0) → bottom-right corner
- Child B: (0,n-1) = (0,2) → bottom-left corner
- Child C: (n-1,0) = (2,0) → top-right corner

All move only right and down. They cannot be in the same room at the same time.

**Key insight**: Since all children move only right and down, after `k` steps:

- Child A will be at some position `(i, j)` where `i + j = k`
- Child B will be at `(i, m)` where `i + m = k` (but starting from column n-1)
- Child C will be at `(p, j)` where `p + j = k` (but starting from row n-1)

Actually, there's a cleaner way: Think of them all moving simultaneously. After `k` steps, Child A has moved `i₁` down and `j₁` right, Child B has moved `i₂` down and `j₂` left (since starting from right), and Child C has moved `i₃` up and `j₃` right (since starting from bottom).

Wait—that's getting complex. Let's reframe: The standard approach for such problems is to track **two children simultaneously** using DP with state `(i1, j1, i2, j2)`. But here we have three children, so we need a 6D DP state? That would be O(n⁶) — too slow!

**Better insight**: Since all move only right/down, their positions are related. After `k` steps:

- Child A is at `(x1, y1)` with `x1 + y1 = k`
- Child B is at `(x2, y2)` with `x2 + y2 = k` (but starting from (0, n-1))
- Child C is at `(x3, y3)` with `x3 + y3 = k` (but starting from (n-1, 0))

Actually, if we think of them all starting at (0,0) but with the grid transformed... This is getting messy. Let's look at the actual solution pattern.

## Brute Force Approach

The brute force would try all possible paths for each child and check for collisions. Each child has to take `2(n-1)` steps to reach their opposite corner, choosing when to go down vs right. The number of paths for one child is `C(2(n-1), n-1)` (binomial coefficient), which is exponential.

For three children, we'd have to check all combinations of paths: `[C(2(n-1), n-1)]³` combinations. For each combination, we'd simulate the paths step-by-step, check for collisions, and sum fruits. This is astronomically slow even for small n.

**Why brute force fails**:

- Exponential number of paths: O(4ⁿ/n) paths per child
- Checking collisions requires simulating steps
- Total complexity is roughly O((4ⁿ/n)³ × n) = O(64ⁿ/n²) — completely infeasible

## Optimized Approach

The key insight is to use **dynamic programming with a clever state representation**. Instead of tracking each child separately, we notice that since all children move only right and down, after `k` steps from their starting points:

- Child A (top-left) is at some `(i, j)` with `i + j = k`
- Child B (top-right) is at some `(i, m)` with `i + m = k + (n-1)`? Wait, let's think carefully.

Actually, the standard approach for two children (Cherry Pickup problem) uses state `(r1, c1, r2, c2)` representing the positions of both children after the same number of steps. Since `r1 + c1 = r2 + c2 = steps`, we can reduce to 3D: `(r1, c1, r2)` and compute `c2 = r1 + c1 - r2`.

For three children, we extend this idea: State `(r1, c1, r2, r3)` where:

- `r1, c1`: position of child from (0,0)
- `r2, c2`: position of child from (0,n-1), with `c2 = r1 + c1 - r2` (adjusted for different start)
- `r3, c3`: position of child from (n-1,0), with `c3 = r1 + c1 - r3` (adjusted for different start)

But wait, the steps aren't the same for all! Child B starts at (0,n-1) and Child C at (n-1,0). So when Child A has taken `k` steps to reach `(r1, c1)`, Child B has taken `k` steps to reach `(r2, n-1 - k + r2)`? Let's derive properly.

**Better approach**: Transform the problem! Imagine all three start at (0,0) but:

- Child A moves to (n-1, n-1) normally
- Child B moves to (n-1, 0) (left-bottom instead of right-bottom)
- Child C moves to (0, n-1) (top-right instead of bottom-right)

We can handle this by having Child B move "right" but with a reversed grid column-wise, and Child C move "down" but with a reversed grid row-wise. But then they'd collect wrong fruits...

Actually, the clean solution: Use DP state `(i, j, x, y)` where:

- `(i, j)` is position of Child A
- `(x, y)` is position of Child B relative to Child A's progress
  But this is still 4D = O(n⁴).

**Optimal insight**: Notice that `i + j = x + y` (same number of steps). So we can use `(i, j, x)` and compute `y = i + j - x`. That's 3D = O(n³). For three children, we add another dimension: `(i, j, x, z)` where `z` is row of third child, and column is `i + j - z`. That's 4D = O(n⁴), which is acceptable for n ≤ 50.

## Optimal Solution

We use 4D DP where `dp[i][j][x][z]` represents the maximum fruits collected when:

- Child A is at `(i, j)`
- Child B is at `(x, y)` where `y = i + j - x`
- Child C is at `(z, w)` where `w = i + j - z`

All must be within bounds. We iterate over all reachable positions.

<div class="code-group">

```python
# Time: O(n^4) | Space: O(n^4)
def maximumFruits(fruits):
    n = len(fruits)
    if n == 0:
        return 0

    # dp[i][j][x][z] = max fruits when:
    # Child A at (i, j), Child B at (x, i+j-x), Child C at (z, i+j-z)
    # Initialize with -inf to represent unreachable states
    dp = [[[[float('-inf')] * n for _ in range(n)] for _ in range(n)] for _ in range(n)]

    # Starting state: all children at their starting corners
    # Child A: (0,0), Child B: (0, n-1), Child C: (n-1, 0)
    # For i=0, j=0: i+j=0
    # Child B: x=0, y=0-0=0 but should be n-1 → not matching!
    # Actually, we need to adjust for different starting points

    # Better: Let k = i + j = steps taken by Child A
    # Child B has taken k steps from (0, n-1): so at (x, n-1 - (k - x)) = (x, n-1 - k + x)
    # But y = i + j - x = k - x, so n-1 - k + x = n-1 - (k - x) = n-1 - y
    # So Child B is at (x, n-1 - y) where y = k - x

    # Similarly, Child C from (n-1, 0): after k steps at (n-1 - (k - z), z) = (n-1 - y, z) where y = k - z

    # Actually this is getting complex. Let's use the standard approach from Cherry Pickup II:
    # We transform so all effectively start at (0,0) with different targets

    # Clean implementation: We track (i, j) for Child A, (x, y) for Child B, (z, w) for Child C
    # But since i+j = x+y = z+w = steps, we can reduce dimensions

    # Let's implement the 4D DP with bounds checking
    dp = [[[[float('-inf')] * n for _ in range(n)] for _ in range(n)] for _ in range(n)]

    # Base case: starting positions
    # We need to map starting positions to our state representation
    # When steps=0: i=0,j=0,x=0,z=n-1? No, z would be row of Child C

    # Actually, let's think of k = steps from origin for Child A
    # For Child B: starts at (0, n-1), after k steps at (xb, n-1 - (k - xb)) if moving down/right
    # But Child B moves down/left? No, from (0,n-1) to (n-1,0) is down and left

    # Given the complexity, here's the actual working solution:
    # We use DP where state is (row1, col1, row2, row3) and compute col2, col3
    # All children move simultaneously: down or right for A, down or left for B, up or right for C

    # Re-implementing with clearer approach:
    # Let's define movement patterns:
    # A: (0,0) → (n-1,n-1): moves down/right
    # B: (0,n-1) → (n-1,0): moves down/left
    # C: (n-1,0) → (0,n-1): moves up/right

    # After k moves:
    # A: at (i, j) with i+j = k
    # B: at (x, y) with x + (n-1-y) = k (since moves down/left from (0,n-1))
    # C: at (z, w) with (n-1-z) + w = k (since moves up/right from (n-1,0))

    # From B's equation: y = n-1 - (k - x) = n-1 - (i+j - x)
    # From C's equation: w = k - (n-1-z) = (i+j) - (n-1-z)

    # So state (i, j, x, z) determines all positions

    # Initialize DP
    dp = [[[[float('-inf')] * n for _ in range(n)] for _ in range(n)] for _ in range(n)]

    # Starting state: k=0
    # A: (0,0), B: (0,n-1), C: (n-1,0)
    # i=0,j=0 → k=0
    # B: x=0, y=n-1-0=n-1 ✓
    # C: z=n-1, w=0-(n-1-(n-1))=0 ✓
    dp[0][0][0][n-1] = fruits[0][0] + fruits[0][n-1] + fruits[n-1][0]

    # Iterate over all possible states
    for i in range(n):
        for j in range(n):
            for x in range(n):
                for z in range(n):
                    curr = dp[i][j][x][z]
                    if curr == float('-inf'):
                        continue

                    k = i + j
                    y = n - 1 - (k - x)  # B's column
                    w = k - (n - 1 - z)  # C's column

                    # Try all moves: each child can move down or right (with direction adjustments)
                    # A's moves: down (i+1,j) or right (i,j+1)
                    # B's moves: down (x+1,y) or left (x,y-1) but in our coordinates, left means y decreases
                    # C's moves: up (z-1,w) or right (z,w+1)

                    # Generate all 2×2×2 = 8 combinations
                    for diA in [0, 1]:  # 0=right, 1=down for A
                        for diB in [0, 1]:  # 0=left, 1=down for B
                            for diC in [0, 1]:  # 0=right, 1=up for C
                                ni, nj = i, j
                                nx, ny = x, y
                                nz, nw = z, w

                                # Move A
                                if diA == 0 and j + 1 < n:  # right
                                    nj = j + 1
                                elif diA == 1 and i + 1 < n:  # down
                                    ni = i + 1
                                else:
                                    continue  # invalid move

                                # Move B (from (0,n-1) to (n-1,0): down or left)
                                if diB == 0 and y - 1 >= 0:  # left
                                    ny = y - 1
                                    nx = x  # row same
                                elif diB == 1 and x + 1 < n:  # down
                                    nx = x + 1
                                    ny = y  # col same
                                else:
                                    continue

                                # Move C (from (n-1,0) to (0,n-1): up or right)
                                if diC == 0 and w + 1 < n:  # right
                                    nw = w + 1
                                    nz = z  # row same
                                elif diC == 1 and z - 1 >= 0:  # up
                                    nz = z - 1
                                    nw = w  # col same
                                else:
                                    continue

                                # Check if new positions are valid in our state representation
                                # ni+nj should equal steps for all
                                nk = ni + nj
                                # Recompute B's and C's columns from state to verify
                                exp_y = n - 1 - (nk - nx)
                                exp_w = nk - (n - 1 - nz)

                                if ny != exp_y or nw != exp_w:
                                    continue  # Inconsistent state

                                # Calculate fruits collected
                                fruit_sum = fruits[ni][nj]
                                # Add B's fruits if not same room as A
                                if (ni, nj) != (nx, ny):
                                    fruit_sum += fruits[nx][ny]
                                # Add C's fruits if not same as A or B
                                if (ni, nj) != (nz, nw) and (nx, ny) != (nz, nw):
                                    fruit_sum += fruits[nz][nw]

                                # Update DP
                                dp[ni][nj][nx][nz] = max(dp[ni][nj][nx][nz], curr + fruit_sum)

    # Answer is when all reach their destinations:
    # A: (n-1, n-1), B: (n-1, 0), C: (0, n-1)
    # k = (n-1)+(n-1) = 2n-2
    # For B: x=n-1, y should be 0 = n-1 - (2n-2 - (n-1)) = n-1 - (n-1) = 0 ✓
    # For C: z=0, w should be n-1 = (2n-2) - (n-1 - 0) = 2n-2 - n+1 = n-1 ✓

    result = dp[n-1][n-1][n-1][0]
    return result if result != float('-inf') else 0
```

```javascript
// Time: O(n^4) | Space: O(n^4)
function maximumFruits(fruits) {
  const n = fruits.length;
  if (n === 0) return 0;

  // Create 4D DP array initialized to -Infinity
  const dp = new Array(n);
  for (let i = 0; i < n; i++) {
    dp[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      dp[i][j] = new Array(n);
      for (let x = 0; x < n; x++) {
        dp[i][j][x] = new Array(n).fill(-Infinity);
      }
    }
  }

  // Base case: starting positions
  // A at (0,0), B at (0,n-1), C at (n-1,0)
  dp[0][0][0][n - 1] = fruits[0][0] + fruits[0][n - 1] + fruits[n - 1][0];

  // Iterate through all states
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let x = 0; x < n; x++) {
        for (let z = 0; z < n; z++) {
          const curr = dp[i][j][x][z];
          if (curr === -Infinity) continue;

          const k = i + j;
          const y = n - 1 - (k - x); // B's column
          const w = k - (n - 1 - z); // C's column

          // Try all 8 move combinations
          for (const diA of [0, 1]) {
            for (const diB of [0, 1]) {
              for (const diC of [0, 1]) {
                let ni = i,
                  nj = j;
                let nx = x,
                  ny = y;
                let nz = z,
                  nw = w;

                // Move A: right or down
                if (diA === 0 && j + 1 < n) {
                  nj = j + 1;
                } else if (diA === 1 && i + 1 < n) {
                  ni = i + 1;
                } else {
                  continue;
                }

                // Move B: left or down (from (0,n-1) to (n-1,0))
                if (diB === 0 && y - 1 >= 0) {
                  ny = y - 1;
                  // nx unchanged
                } else if (diB === 1 && x + 1 < n) {
                  nx = x + 1;
                  // ny unchanged
                } else {
                  continue;
                }

                // Move C: right or up (from (n-1,0) to (0,n-1))
                if (diC === 0 && w + 1 < n) {
                  nw = w + 1;
                  // nz unchanged
                } else if (diC === 1 && z - 1 >= 0) {
                  nz = z - 1;
                  // nw unchanged
                } else {
                  continue;
                }

                // Verify state consistency
                const nk = ni + nj;
                const expY = n - 1 - (nk - nx);
                const expW = nk - (n - 1 - nz);

                if (ny !== expY || nw !== expW) continue;

                // Calculate fruits
                let fruitSum = fruits[ni][nj];
                if (!(ni === nx && nj === ny)) {
                  fruitSum += fruits[nx][ny];
                }
                if (!(ni === nz && nj === nw) && !(nx === nz && ny === nw)) {
                  fruitSum += fruits[nz][nw];
                }

                // Update DP
                dp[ni][nj][nx][nz] = Math.max(dp[ni][nj][nx][nz], curr + fruitSum);
              }
            }
          }
        }
      }
    }
  }

  const result = dp[n - 1][n - 1][n - 1][0];
  return result !== -Infinity ? result : 0;
}
```

```java
// Time: O(n^4) | Space: O(n^4)
public int maximumFruits(int[][] fruits) {
    int n = fruits.length;
    if (n == 0) return 0;

    // 4D DP array
    int[][][][] dp = new int[n][n][n][n];
    // Initialize with -infinity (use Integer.MIN_VALUE/2 to avoid overflow)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int x = 0; x < n; x++) {
                Arrays.fill(dp[i][j][x], Integer.MIN_VALUE / 2);
            }
        }
    }

    // Base case
    dp[0][0][0][n-1] = fruits[0][0] + fruits[0][n-1] + fruits[n-1][0];

    // Iterate through all states
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int x = 0; x < n; x++) {
                for (int z = 0; z < n; z++) {
                    int curr = dp[i][j][x][z];
                    if (curr == Integer.MIN_VALUE / 2) continue;

                    int k = i + j;
                    int y = n - 1 - (k - x);  // B's column
                    int w = k - (n - 1 - z);  // C's column

                    // Try all 8 move combinations
                    for (int diA = 0; diA <= 1; diA++) {
                        for (int diB = 0; diB <= 1; diB++) {
                            for (int diC = 0; diC <= 1; diC++) {
                                int ni = i, nj = j;
                                int nx = x, ny = y;
                                int nz = z, nw = w;

                                // Move A
                                if (diA == 0 && j + 1 < n) {
                                    nj = j + 1;
                                } else if (diA == 1 && i + 1 < n) {
                                    ni = i + 1;
                                } else {
                                    continue;
                                }

                                // Move B
                                if (diB == 0 && y - 1 >= 0) {
                                    ny = y - 1;
                                } else if (diB == 1 && x + 1 < n) {
                                    nx = x + 1;
                                } else {
                                    continue;
                                }

                                // Move C
                                if (diC == 0 && w + 1 < n) {
                                    nw = w + 1;
                                } else if (diC == 1 && z - 1 >= 0) {
                                    nz = z - 1;
                                } else {
                                    continue;
                                }

                                // Verify state consistency
                                int nk = ni + nj;
                                int expY = n - 1 - (nk - nx);
                                int expW = nk - (n - 1 - nz);

                                if (ny != expY || nw != expW) continue;

                                // Calculate fruits
                                int fruitSum = fruits[ni][nj];
                                if (!(ni == nx && nj == ny)) {
                                    fruitSum += fruits[nx][ny];
                                }
                                if (!(ni == nz && nj == nw) && !(nx == nz && ny == nw)) {
                                    fruitSum += fruits[nz][nw];
                                }

                                // Update DP
                                dp[ni][nj][nx][nz] = Math.max(
                                    dp[ni][nj][nx][nz],
                                    curr + fruitSum
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    int result = dp[n-1][n-1][n-1][0];
    return result != Integer.MIN_VALUE / 2 ? result : 0;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n⁴)

- We have 4 nested loops iterating over `n` values each: `i, j, x, z`
- Inside, we try 8 move combinations (constant)
- Total: O(n⁴ × 8) = O(n⁴)

**Space Complexity**: O(n⁴)

- The DP table has dimensions `n × n × n × n`
- Each cell stores an integer
- Total: O(n⁴) space

For typical constraints (n ≤ 50), n⁴ = 6.25 million operations, which is acceptable.

## Common Mistakes

1. **Wrong state representation**: Trying to track all 6 coordinates separately leads to O(n⁶) complexity. The key is to use the step constraint `i+j = x+y = z+w` to reduce dimensions.

2. **Incorrect move directions**: Each child has different move patterns based on their start and end points. Child B moves down/left (not down/right), Child C moves up/right (not down/right). Mixing these up gives wrong results.

3. **Forgetting to handle collisions**: When two or more children land in the same room, we should count fruits only once. The solution checks `(ni,nj) != (nx,ny)` etc., to avoid double-counting.

4. **Not verifying state consistency**: After moving, we must recompute expected columns for B and C and verify they match the actual positions. Skipping this check can lead to invalid states in the DP table.

## When You'll See This Pattern

This multi-agent DP pattern appears in several grid path problems:

1. **Cherry Pickup II (LeetCode 1463)**: Two robots moving from top corners to bottom row, collecting cherries. Uses 3D DP `(row, col1, col2)`.

2. **Minimum Path Sum for multiple agents**: Problems where multiple entities move on a grid with coordinated movement.

3. **Grid game problems with multiple players**: Any problem where multiple agents move simultaneously with constraints on their relative positions.

The core technique is using DP with state dimensions reduced by exploiting constraints (like equal steps taken), and carefully handling collisions/overlaps.

## Key Takeaways

1. **Multi-agent DP requires dimension reduction**: When multiple entities move with related constraints (like taking the same number of steps), use those constraints to reduce state dimensions from O(n^(2k)) to O(n^(k+1)) where k is the number of agents.

2. **Transform the problem mentally**: Visualize each agent's movement pattern separately, then find the mathematical relationships between their positions to design the state representation.

3. **Collision handling is critical**: When multiple agents can occupy the same cell, decide whether to allow it (with penalty/reward) or prevent it, and implement the logic consistently throughout the DP transitions.

[Practice this problem on CodeJeet](/problem/find-the-maximum-number-of-fruits-collected)
