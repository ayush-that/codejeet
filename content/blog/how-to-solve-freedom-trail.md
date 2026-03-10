---
title: "How to Solve Freedom Trail — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Freedom Trail. Hard difficulty, 59.2% acceptance rate. Topics: String, Dynamic Programming, Depth-First Search, Breadth-First Search."
date: "2027-01-27"
category: "dsa-patterns"
tags: ["freedom-trail", "string", "dynamic-programming", "depth-first-search", "hard"]
---

# How to Solve Freedom Trail

The Freedom Trail problem asks us to find the minimum steps to spell a keyword using a rotating ring, where each step can rotate the ring clockwise or counterclockwise, and pressing the center button counts as an additional step. The challenge lies in the exponential number of possible rotation sequences—we need to efficiently track the minimum steps from each character position on the ring to each character in the key.

## Visual Walkthrough

Let's trace through a small example: `ring = "godding"`, `key = "gd"`.

**Initial state:** The ring starts at index 0 (character 'g'). The key pointer is at index 0 (need 'g').

**Step 1:** We're already at 'g' at index 0. Press the button: +1 step. Total: 1 step.

**Step 2:** Now we need 'd'. From current position (index 0), we can rotate:

- Clockwise: positions 1('o'), 2('d') → 2 steps to reach 'd'
- Counterclockwise: positions 6('g'), 5('n'), 4('i'), 3('d') → 4 steps to reach 'd'

Choose clockwise: 2 rotation steps + 1 press step = 3 steps. Total: 1 + 3 = 4 steps.

But wait—is this optimal? What if we had rotated differently initially? This shows why we need dynamic programming: we must consider all possible paths from each character position to each key character.

## Brute Force Approach

A naive approach would try all possible rotation sequences using DFS or BFS. For each character in the key, from each current position on the ring, we'd:

1. Find all indices of the needed character in the ring
2. For each such index, calculate the rotation distance
3. Recursively explore all paths

The problem? This leads to exponential time complexity. If the ring has length `n` and key has length `m`, and each character appears `k` times on average in the ring, we'd have `O(k^m)` possible paths. For `ring = "abababab"` and `key = "abababab"`, this becomes completely infeasible.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with overlapping subproblems. We can define:

- `dp[i][j]` = minimum steps to spell `key[i:]` starting when the `ring[j]` is aligned at 12:00

For the last character of the key (`i = m-1`):

- If `ring[j] == key[m-1]`, we just need 1 press step
- Otherwise, we need to rotate to a matching position first

For earlier characters (`i < m-1`):

- We need to rotate from current position `j` to some position `k` where `ring[k] == key[i]`
- The cost is: rotation distance + 1 (press) + `dp[i+1][k]` (future steps)

We need to track all positions of each character in the ring, which we can precompute with a hash map.

The rotation distance between indices `i` and `j` on a ring of length `n` is:

- Clockwise: `(j - i + n) % n`
- Counterclockwise: `(i - j + n) % n`
- Minimum: `min(clockwise, counterclockwise)`

## Optimal Solution

We'll use bottom-up DP, working backwards from the end of the key to the beginning.

<div class="code-group">

```python
# Time: O(m * n^2) where m = len(key), n = len(ring)
# Space: O(m * n) for the DP table
def findRotateSteps(ring, key):
    n, m = len(ring), len(key)

    # Precompute positions of each character in the ring
    char_positions = {}
    for i, ch in enumerate(ring):
        if ch not in char_positions:
            char_positions[ch] = []
        char_positions[ch].append(i)

    # DP table: dp[i][j] = min steps to spell key[i:] starting at ring[j]
    dp = [[float('inf')] * n for _ in range(m + 1)]

    # Base case: after spelling all characters, no more steps needed
    for j in range(n):
        dp[m][j] = 0

    # Fill DP table from the end of key backwards
    for i in range(m - 1, -1, -1):
        for j in range(n):
            # For each position j on ring, try all positions k that match key[i]
            for k in char_positions[key[i]]:
                # Calculate rotation distance from j to k
                # Clockwise distance
                clockwise = (k - j) % n
                # Counterclockwise distance
                counterclockwise = (j - k) % n
                # Minimum rotation steps
                rotation = min(clockwise, counterclockwise)

                # Total steps = rotation + 1 (press) + future steps from position k
                dp[i][j] = min(dp[i][j], rotation + 1 + dp[i + 1][k])

    # Start from position 0 (ring's initial alignment)
    return dp[0][0]
```

```javascript
// Time: O(m * n^2) where m = key.length, n = ring.length
// Space: O(m * n) for the DP table
function findRotateSteps(ring, key) {
  const n = ring.length,
    m = key.length;

  // Precompute positions of each character in the ring
  const charPositions = new Map();
  for (let i = 0; i < n; i++) {
    const ch = ring[i];
    if (!charPositions.has(ch)) {
      charPositions.set(ch, []);
    }
    charPositions.get(ch).push(i);
  }

  // DP table: dp[i][j] = min steps to spell key[i:] starting at ring[j]
  const dp = Array.from({ length: m + 1 }, () => Array(n).fill(Infinity));

  // Base case: after spelling all characters, no more steps needed
  for (let j = 0; j < n; j++) {
    dp[m][j] = 0;
  }

  // Fill DP table from the end of key backwards
  for (let i = m - 1; i >= 0; i--) {
    for (let j = 0; j < n; j++) {
      // For each position j on ring, try all positions k that match key[i]
      const positions = charPositions.get(key[i]) || [];
      for (const k of positions) {
        // Calculate rotation distance from j to k
        // Clockwise distance
        const clockwise = (k - j + n) % n;
        // Counterclockwise distance
        const counterclockwise = (j - k + n) % n;
        // Minimum rotation steps
        const rotation = Math.min(clockwise, counterclockwise);

        // Total steps = rotation + 1 (press) + future steps from position k
        dp[i][j] = Math.min(dp[i][j], rotation + 1 + dp[i + 1][k]);
      }
    }
  }

  // Start from position 0 (ring's initial alignment)
  return dp[0][0];
}
```

```java
// Time: O(m * n^2) where m = key.length(), n = ring.length()
// Space: O(m * n) for the DP table
class Solution {
    public int findRotateSteps(String ring, String key) {
        int n = ring.length(), m = key.length();

        // Precompute positions of each character in the ring
        Map<Character, List<Integer>> charPositions = new HashMap<>();
        for (int i = 0; i < n; i++) {
            char ch = ring.charAt(i);
            charPositions.putIfAbsent(ch, new ArrayList<>());
            charPositions.get(ch).add(i);
        }

        // DP table: dp[i][j] = min steps to spell key[i:] starting at ring[j]
        int[][] dp = new int[m + 1][n];

        // Initialize with large values
        for (int i = 0; i <= m; i++) {
            Arrays.fill(dp[i], Integer.MAX_VALUE / 2); // Avoid overflow
        }

        // Base case: after spelling all characters, no more steps needed
        for (int j = 0; j < n; j++) {
            dp[m][j] = 0;
        }

        // Fill DP table from the end of key backwards
        for (int i = m - 1; i >= 0; i--) {
            for (int j = 0; j < n; j++) {
                // For each position j on ring, try all positions k that match key[i]
                for (int k : charPositions.getOrDefault(key.charAt(i), new ArrayList<>())) {
                    // Calculate rotation distance from j to k
                    // Clockwise distance
                    int clockwise = (k - j + n) % n;
                    // Counterclockwise distance
                    int counterclockwise = (j - k + n) % n;
                    // Minimum rotation steps
                    int rotation = Math.min(clockwise, counterclockwise);

                    // Total steps = rotation + 1 (press) + future steps from position k
                    dp[i][j] = Math.min(dp[i][j], rotation + 1 + dp[i + 1][k]);
                }
            }
        }

        // Start from position 0 (ring's initial alignment)
        return dp[0][0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m * n^2)` where `m` is the length of the key and `n` is the length of the ring.

- We have `m * n` states in our DP table
- For each state `(i, j)`, we iterate through all positions `k` where `ring[k] == key[i]`
- In the worst case, each character appears at all `n` positions, giving us `O(n)` iterations per state
- Thus: `O(m * n * n) = O(m * n^2)`

**Space Complexity:** `O(m * n)` for the DP table.

- We store a 2D array of size `(m+1) * n`
- The character position map uses `O(n)` additional space

## Common Mistakes

1. **Forgetting the +1 for the press step**: Each character requires not just rotation but also pressing the button. This is an easy oversight that adds up significantly.

2. **Incorrect rotation distance calculation**: The modulo operation must handle negative values correctly. Use `(target - current + n) % n` for clockwise and `(current - target + n) % n` for counterclockwise.

3. **Using greedy approach**: Some candidates try to always choose the nearest matching character, but this can lead to suboptimal results. Example: `ring = "ababc"`, `key = "ac"`. The nearest 'a' to start is at index 0, but going to index 2 might be better overall.

4. **Not precomputing character positions**: Searching for matching positions in the ring for each DP state would add an extra `O(n)` factor, making the solution `O(m * n^3)`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Circular array distance calculation**: Similar to problems like [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference/) where you need to find minimum distance on a circle.

2. **String DP with position states**: Problems like [Edit Distance](https://leetcode.com/problems/edit-distance/) and [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) also use DP where one dimension tracks position in one string and another tracks position in another string.

3. **Optimization over circular paths**: [Minimum Rotation to Get Equal](https://leetcode.com/problems/minimum-rotations-to-get-equal/) problems involve similar circular optimization thinking.

## Key Takeaways

1. **Circular distance formula**: The minimum distance between two points on a circle of length `n` is `min(|i-j|, n-|i-j|)`, which can be computed using modulo arithmetic.

2. **DP with position states**: When a problem involves moving between positions with overlapping subproblems, consider DP where one dimension represents the "progress" (like key index) and another represents the "state" (like ring position).

3. **Precomputation for efficiency**: When you need to repeatedly find positions of specific characters, precomputing a map from character to list of indices saves significant time.

[Practice this problem on CodeJeet](/problem/freedom-trail)
