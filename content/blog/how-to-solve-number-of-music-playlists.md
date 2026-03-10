---
title: "How to Solve Number of Music Playlists — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Music Playlists. Hard difficulty, 60.0% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2027-11-20"
category: "dsa-patterns"
tags: ["number-of-music-playlists", "math", "dynamic-programming", "combinatorics", "hard"]
---

# How to Solve Number of Music Playlists

You need to create a playlist of length `goal` from `n` distinct songs, where every song must be played at least once, and you can only repeat a song after at least `k` other songs have been played. This is a **hard combinatorial counting problem** because you need to count valid sequences while respecting two constraints simultaneously: coverage (all songs used) and spacing (repeat distance). The challenge comes from the exponential number of possible playlists — we need a smart way to count them without enumerating all possibilities.

## Visual Walkthrough

Let's trace through a small example: `n = 2` songs (A, B), `goal = 3` songs in playlist, `k = 1` (must wait 1 other song before repeating).

**Valid playlists must:**

1. Have length 3
2. Use both A and B at least once
3. Never have the same song twice in a row (since k=1)

Let's build playlists systematically:

**Step 1:** Start with first song choice:

- Start with A: `[A, ?, ?]`
- Start with B: `[B, ?, ?]`

**Step 2:** For `[A, ?, ?]`, second song can't be A (k=1), so must be B: `[A, B, ?]`

**Step 3:** For `[A, B, ?]`, third song:

- Can be A (last played B, different from A)
- Can be B (last played B, but k=1 means we need 1 other song between repeats — we have A between the B at position 2 and a potential B at position 3? Wait, careful: The constraint is "k other songs have been played" between repeats, not "k songs since last play". Actually, it means: if we want to play a song again, at least k _different_ songs must have been played since its last occurrence. So for `[A, B, ?]`:
  - To play A again: Last A was at position 1. Since then, only B played (1 song, k=1 ✓). So A is allowed.
  - To play B again: Last B is at position 2 (just played!). Since then, 0 songs played, k=1 ✗. So B is NOT allowed.

So third song can only be A: `[A, B, A]`

**Step 4:** For `[B, ?, ?]` (starting with B), similar logic:
Second song must be A: `[B, A, ?]`
Third song:

- Can be B? Last B at position 1, since then A played (1 song, k=1 ✓)
- Can be A? Last A at position 2 (just played), 0 songs since, k=1 ✗
  So only B: `[B, A, B]`

**Valid playlists:** `[A, B, A]` and `[B, A, B]` → **2 total**.

This small example shows the complexity: we need to track which songs have been used and when they were last played. For larger n and goal, brute force enumeration is impossible — we need dynamic programming.

## Brute Force Approach

A naive approach would generate all possible sequences of length `goal` using `n` songs, check if all songs appear at least once, and check the k-constraint for repeats.

**Why this fails:**

- Number of sequences: `n^goal` — astronomical even for moderate values
- Checking each sequence requires O(goal) time
- Total: O(goal × n^goal) — impossibly slow

Even with pruning (stop early when constraint violated), the search space is still exponential. We need a combinatorial counting method, not enumeration.

## Optimized Approach

The key insight: **This is a dynamic programming counting problem** where we need to track two states:

1. How many songs we've used so far (unique songs played)
2. How many songs are in our current playlist

**DP State Definition:**
Let `dp[i][j]` = number of playlists of length `i` containing exactly `j` unique songs.

**Transitions:**
When adding the i-th song to a playlist of length i-1 with j unique songs:

1. **Add a new song** (increase unique count):
   - We have `n` total songs, `j` already used → `n-j` new songs available
   - Any of these can be added: `dp[i-1][j-1] × (n - (j-1))` ways

2. **Add a repeated song** (keep same unique count):
   - We have `j` songs already used
   - But due to k-constraint: we can't repeat any of the last `k` songs played
   - How many songs are "blocked" from repetition? At position i-1, we have `j` unique songs total. The last `min(j, k)` songs in the playlist must all be distinct (by k-constraint). Actually, more precisely: The k-constraint says we can only repeat a song if k _other_ songs have been played since. So at playlist length i-1 with j unique songs, how many songs are available for repetition?

   **Critical insight:** If we have j unique songs and need k other songs between repeats, then when adding the i-th song:
   - We have j total unique songs available in our "pool"
   - The last min(j, k) songs in our playlist must all be distinct (otherwise k-constraint violated)
   - So the song at position i-1 is one of j songs
   - The song at position i-2 is different from i-1 (if k≥1)
   - ... up to position i-min(j,k)

   Actually, simpler: For repeating a song at position i, we have j choices total, but we must exclude the last min(j, k) songs played because repeating any of those would violate the k-constraint. So available songs for repetition = `j - min(j-1, k)`? Wait, let's think carefully...

   Better approach from known solution: When we want to add a repeat song at position i to a playlist with j unique songs, we have j songs total in our used set. However, we cannot use the last k songs played (which are all distinct if k ≤ j-1). So available songs = `j - k` if `j > k`, else 0.

   But what if k > j-1? Then all j songs are in the "last k songs" (since we only have j songs total), so no repeats allowed. So available = `max(0, j - k)`.

   Therefore: `dp[i][j] += dp[i-1][j] × max(0, j - k)`

**Base Case:**

- `dp[0][0] = 1` (empty playlist, 0 unique songs — 1 way)
- `dp[0][j>0] = 0` (can't have unique songs in empty playlist)

**Answer:**
We want playlists of length `goal` with ALL `n` songs used at least once: `dp[goal][n]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(goal × n) | Space: O(goal × n)
def numMusicPlaylists(n: int, goal: int, k: int) -> int:
    MOD = 10**9 + 7

    # dp[i][j] = number of playlists of length i with j unique songs
    dp = [[0] * (n + 1) for _ in range(goal + 1)]

    # Base case: empty playlist has 1 way to have 0 unique songs
    dp[0][0] = 1

    for i in range(1, goal + 1):  # playlist length
        for j in range(1, min(i, n) + 1):  # unique songs count
            # Case 1: Add a new song (increase unique count)
            # We have n total songs, (j-1) already used, so (n - (j-1)) new songs available
            dp[i][j] = dp[i-1][j-1] * (n - (j-1)) % MOD

            # Case 2: Add a repeated song (same unique count)
            # We have j unique songs available, but can't repeat last k songs
            # If j > k, we have (j - k) choices; if j <= k, no repeats allowed (0 choices)
            if j > k:
                dp[i][j] = (dp[i][j] + dp[i-1][j] * (j - k)) % MOD

    return dp[goal][n]
```

```javascript
// Time: O(goal × n) | Space: O(goal × n)
function numMusicPlaylists(n, goal, k) {
  const MOD = 1_000_000_007;

  // dp[i][j] = number of playlists of length i with j unique songs
  const dp = Array.from({ length: goal + 1 }, () => new Array(n + 1).fill(0));

  // Base case: empty playlist has 1 way to have 0 unique songs
  dp[0][0] = 1;

  for (let i = 1; i <= goal; i++) {
    // playlist length
    // j can be at most i (can't have more unique songs than playlist length)
    // and at most n (total songs available)
    for (let j = 1; j <= Math.min(i, n); j++) {
      // unique songs count
      // Case 1: Add a new song (increase unique count)
      // We have n total songs, (j-1) already used, so (n - (j-1)) new songs available
      dp[i][j] = (dp[i - 1][j - 1] * (n - (j - 1))) % MOD;

      // Case 2: Add a repeated song (same unique count)
      // We have j unique songs available, but can't repeat last k songs
      // If j > k, we have (j - k) choices; if j <= k, no repeats allowed (0 choices)
      if (j > k) {
        dp[i][j] = (dp[i][j] + dp[i - 1][j] * (j - k)) % MOD;
      }
    }
  }

  return dp[goal][n];
}
```

```java
// Time: O(goal × n) | Space: O(goal × n)
class Solution {
    public int numMusicPlaylists(int n, int goal, int k) {
        final int MOD = 1_000_000_007;

        // dp[i][j] = number of playlists of length i with j unique songs
        long[][] dp = new long[goal + 1][n + 1];

        // Base case: empty playlist has 1 way to have 0 unique songs
        dp[0][0] = 1;

        for (int i = 1; i <= goal; i++) {  // playlist length
            // j can be at most i (can't have more unique songs than playlist length)
            // and at most n (total songs available)
            for (int j = 1; j <= Math.min(i, n); j++) {  // unique songs count
                // Case 1: Add a new song (increase unique count)
                // We have n total songs, (j-1) already used, so (n - (j-1)) new songs available
                dp[i][j] = dp[i-1][j-1] * (n - (j-1)) % MOD;

                // Case 2: Add a repeated song (same unique count)
                // We have j unique songs available, but can't repeat last k songs
                // If j > k, we have (j - k) choices; if j <= k, no repeats allowed (0 choices)
                if (j > k) {
                    dp[i][j] = (dp[i][j] + dp[i-1][j] * (j - k)) % MOD;
                }
            }
        }

        return (int) dp[goal][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(goal × n)

- We have a DP table of size (goal+1) × (n+1)
- Each cell takes O(1) time to compute
- The inner loop runs up to min(i, n), but total iterations sum to O(goal × n) in worst case

**Space Complexity:** O(goal × n) for the DP table

- We can optimize to O(n) by only keeping previous row since dp[i][j] only depends on dp[i-1][j] and dp[i-1][j-1]
- But the O(goal × n) version is clearer for understanding

## Common Mistakes

1. **Misunderstanding the k-constraint:** Thinking it's "k songs between repeats" instead of "k _other_ (different) songs between repeats". If k=1 and you have [A, B, A], between the two A's, only B played (1 other song ✓). Some candidates think "1 song between" means positions must differ by 2.

2. **Incorrect repeat count calculation:** Using `j` instead of `max(0, j-k)` for available repeat songs. When `j ≤ k`, no repeats allowed because all j songs are in the "last k" window.

3. **Forgetting modulo operations:** The result can be huge (exponential in goal). Must apply modulo 10^9+7 after each multiplication and addition to prevent overflow.

4. **Base case errors:** Setting `dp[0][0] = 0` instead of 1. The empty playlist is valid when we need 0 unique songs. This is standard in counting DP: 1 way to do nothing.

## When You'll See This Pattern

This "counting sequences with constraints" pattern appears in problems where you need to count valid arrangements/sequences subject to constraints, often solved with DP where state tracks "how many distinct items used" and "current position":

1. **Count the Number of Good Subsequences** (Medium) - Similar DP counting with constraints on subsequences
2. **Distinct Subsequences II** (Hard) - Counting distinct subsequences with constraints
3. **K-th Symbol in Grammar** (Medium) - Counting patterns with state transitions
4. **Student Attendance Record II** (Hard) - Counting valid sequences with constraints on consecutive elements

The pattern: When you need to count valid sequences/arrangements and constraints involve:

- Using all items at least once
- Spacing/distance constraints between repeats
- The count grows exponentially but has overlapping subproblems

## Key Takeaways

1. **DP for counting problems:** When asked "how many ways" and constraints involve state (which items used, last k elements), think DP with state variables that capture essential information.

2. **Two-dimensional DP state:** Often one dimension tracks position/length, another tracks "how many distinct items used so far". Additional dimensions might track "last element" or "window of last k elements" if needed.

3. **Transition analysis:** Carefully analyze available choices at each step. For this problem: new song vs. repeat song, with repeat availability limited by k-constraint.

4. **Modulo arithmetic:** For combinatorial counting problems, results are often huge — always use modulo operations to prevent overflow.

Related problems: [Count the Number of Good Subsequences](/problem/count-the-number-of-good-subsequences)
