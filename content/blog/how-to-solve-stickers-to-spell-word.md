---
title: "How to Solve Stickers to Spell Word — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stickers to Spell Word. Hard difficulty, 50.6% acceptance rate. Topics: Array, Hash Table, String, Dynamic Programming, Backtracking."
date: "2027-07-22"
category: "dsa-patterns"
tags: ["stickers-to-spell-word", "array", "hash-table", "string", "hard"]
---

# How to Solve Stickers to Spell Word

You're given a list of sticker words and a target word. Each sticker contains letters that can be cut out and rearranged. You can use unlimited copies of each sticker, and you want to find the minimum number of stickers needed to spell the target. The challenge is that stickers contain multiple letters, and you need to figure out how to combine them efficiently to cover all letters in the target.

What makes this problem tricky: Unlike simpler problems where you just check if you have enough letters, here each sticker provides multiple letters at once, and you need to find the optimal combination. This is essentially a set cover problem with letters as elements and stickers as sets, which is NP-hard in general.

## Visual Walkthrough

Let's trace through an example: `stickers = ["with", "example", "science"]`, `target = "thehat"`

**Target letter counts:** `{t:2, h:2, e:1, a:1}`

**Sticker letter counts:**

- "with": `{w:1, i:1, t:1, h:1}`
- "example": `{e:2, x:1, a:1, m:1, p:1, l:1}`
- "science": `{s:2, c:2, i:1, e:2, n:1}`

**Step-by-step reasoning:**

1. We need 2 't's, but only "with" has 't' (1 per sticker)
2. We need 2 'h's, only "with" has 'h' (1 per sticker)
3. We need 1 'e', multiple stickers have 'e'
4. We need 1 'a', only "example" has 'a'

**Possible approach:**

- Use "with" twice: gives us 2 't's and 2 'h's
- Use "example" once: gives us 1 'e' and 1 'a'

Total: 3 stickers. But wait, "example" also has 'e' which we might not need if we get 'e' elsewhere...

**Better approach:**

- Use "with" once: gives 1 't', 1 'h'
- Use "example" once: gives 1 'e', 1 'a'
- We still need 1 't' and 1 'h'
- Use "with" again: gives 1 't', 1 'h'

Still 3 stickers. But what if we use "science"? It has 'e' but no 't', 'h', or 'a', so it doesn't help much.

The key insight: We need to track which letters we still need at each step and try different sticker combinations.

## Brute Force Approach

A naive approach would be to try all possible combinations of stickers:

1. For each sticker, try using it 0, 1, 2, ... times until we have enough of all letters
2. Track which letters we've covered so far
3. Try all permutations of sticker usage

The problem with this approach: The search space is enormous. If we have `n` stickers and the target has length `m`, we could potentially need up to `m` copies of each sticker (since each sticker might provide only one needed letter). That's `O(n^m)` possibilities to check, which is completely infeasible.

Even with pruning (stopping when we have all letters), the state space is still huge because we need to track which specific letters we still need, not just how many stickers we've used.

## Optimized Approach

The key insight is to use **bitmask dynamic programming** or **memoized DFS**:

1. **State representation**: Instead of tracking which letters we have, track which letters we still need. Since the target has at most 15 letters (constraint), we can use a bitmask where bit `i` is 1 if we still need the `i`-th letter of the target.

2. **State transition**: For a given state (bitmask representing needed letters), try using each sticker. When we use a sticker, we remove from the mask any letters that the sticker provides.

3. **Memoization**: Store the minimum stickers needed for each state to avoid recomputation.

4. **Preprocessing**: Convert each sticker to a letter count array for faster computation.

Why this works: The bitmask has at most `2^m` states (where `m ≤ 15`, so at most 32768 states). For each state, we try `n` stickers. This gives us `O(n * 2^m)` time complexity, which is manageable.

The tricky part: When using a sticker, we might not use all its letters, and we might only partially satisfy the remaining needs. We need to carefully update the mask based on which letters the sticker provides and which we still need.

## Optimal Solution

Here's the memoized DFS approach with bitmask representation:

<div class="code-group">

```python
# Time: O(n * 2^m) where n = number of stickers, m = length of target
# Space: O(2^m) for memoization cache
class Solution:
    def minStickers(self, stickers: List[str], target: str) -> int:
        # Preprocess stickers: convert each to letter count array
        sticker_counts = []
        for sticker in stickers:
            count = [0] * 26
            for ch in sticker:
                count[ord(ch) - ord('a')] += 1
            sticker_counts.append(count)

        # Memoization cache: mask -> min stickers needed
        memo = {}

        def dfs(mask: int) -> int:
            # Base case: no letters needed
            if mask == 0:
                return 0

            # Check if we've computed this state before
            if mask in memo:
                return memo[mask]

            # Initialize result to infinity (impossible)
            res = float('inf')

            # Try each sticker
            for sticker in sticker_counts:
                # Make a copy of the current mask
                next_mask = mask

                # Count how many of each letter we need
                # We'll modify a copy of sticker counts since we need the original
                # for other branches
                temp_counts = sticker[:]  # Copy the sticker counts

                # Check each position in target
                for i in range(len(target)):
                    # If this letter is still needed (bit i is 1)
                    if (mask >> i) & 1:
                        ch = target[i]
                        idx = ord(ch) - ord('a')

                        # If sticker has this letter, use it
                        if temp_counts[idx] > 0:
                            temp_counts[idx] -= 1
                            # Mark this letter as no longer needed
                            next_mask ^= (1 << i)

                # If using this sticker actually helped (changed the mask)
                if next_mask != mask:
                    # Recursively solve for the new state
                    sub_res = dfs(next_mask)
                    if sub_res != -1:
                        res = min(res, 1 + sub_res)

            # If no sticker helped, mark as impossible
            memo[mask] = -1 if res == float('inf') else res
            return memo[mask]

        # Start with all bits set (all letters needed)
        initial_mask = (1 << len(target)) - 1
        return dfs(initial_mask)
```

```javascript
// Time: O(n * 2^m) where n = number of stickers, m = length of target
// Space: O(2^m) for memoization cache
/**
 * @param {string[]} stickers
 * @param {string} target
 * @return {number}
 */
var minStickers = function (stickers, target) {
  // Preprocess stickers: convert each to letter count array
  const stickerCounts = [];
  for (const sticker of stickers) {
    const count = new Array(26).fill(0);
    for (const ch of sticker) {
      count[ch.charCodeAt(0) - 97]++; // 'a' = 97
    }
    stickerCounts.push(count);
  }

  // Memoization cache: mask -> min stickers needed
  const memo = new Map();

  const dfs = (mask) => {
    // Base case: no letters needed
    if (mask === 0) return 0;

    // Check if we've computed this state before
    if (memo.has(mask)) return memo.get(mask);

    // Initialize result to infinity (impossible)
    let res = Infinity;

    // Try each sticker
    for (const sticker of stickerCounts) {
      // Start with current mask
      let nextMask = mask;

      // Make a copy of sticker counts since we'll modify it
      const tempCounts = [...sticker];

      // Check each position in target
      for (let i = 0; i < target.length; i++) {
        // If this letter is still needed (bit i is 1)
        if ((mask >> i) & 1) {
          const ch = target[i];
          const idx = ch.charCodeAt(0) - 97;

          // If sticker has this letter, use it
          if (tempCounts[idx] > 0) {
            tempCounts[idx]--;
            // Mark this letter as no longer needed
            nextMask ^= 1 << i;
          }
        }
      }

      // If using this sticker actually helped (changed the mask)
      if (nextMask !== mask) {
        const subRes = dfs(nextMask);
        if (subRes !== -1) {
          res = Math.min(res, 1 + subRes);
        }
      }
    }

    // If no sticker helped, mark as impossible
    const result = res === Infinity ? -1 : res;
    memo.set(mask, result);
    return result;
  };

  // Start with all bits set (all letters needed)
  const initialMask = (1 << target.length) - 1;
  return dfs(initialMask);
};
```

```java
// Time: O(n * 2^m) where n = number of stickers, m = length of target
// Space: O(2^m) for memoization cache
class Solution {
    public int minStickers(String[] stickers, String target) {
        // Preprocess stickers: convert each to letter count array
        int[][] stickerCounts = new int[stickers.length][26];
        for (int i = 0; i < stickers.length; i++) {
            for (char ch : stickers[i].toCharArray()) {
                stickerCounts[i][ch - 'a']++;
            }
        }

        // Memoization cache: mask -> min stickers needed
        Map<Integer, Integer> memo = new HashMap<>();

        // Start with all bits set (all letters needed)
        int initialMask = (1 << target.length()) - 1;
        return dfs(initialMask, target, stickerCounts, memo);
    }

    private int dfs(int mask, String target, int[][] stickerCounts, Map<Integer, Integer> memo) {
        // Base case: no letters needed
        if (mask == 0) return 0;

        // Check if we've computed this state before
        if (memo.containsKey(mask)) return memo.get(mask);

        // Initialize result to a large number (impossible)
        int res = Integer.MAX_VALUE;

        // Try each sticker
        for (int[] sticker : stickerCounts) {
            // Make a copy of the current mask
            int nextMask = mask;

            // Make a copy of sticker counts since we'll modify it
            int[] tempCounts = sticker.clone();

            // Check each position in target
            for (int i = 0; i < target.length(); i++) {
                // If this letter is still needed (bit i is 1)
                if ((mask >> i & 1) == 1) {
                    char ch = target.charAt(i);
                    int idx = ch - 'a';

                    // If sticker has this letter, use it
                    if (tempCounts[idx] > 0) {
                        tempCounts[idx]--;
                        // Mark this letter as no longer needed
                        nextMask ^= (1 << i);
                    }
                }
            }

            // If using this sticker actually helped (changed the mask)
            if (nextMask != mask) {
                int subRes = dfs(nextMask, target, stickerCounts, memo);
                if (subRes != -1) {
                    res = Math.min(res, 1 + subRes);
                }
            }
        }

        // If no sticker helped, mark as impossible
        res = (res == Integer.MAX_VALUE) ? -1 : res;
        memo.put(mask, res);
        return res;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * 2^m)` where `n` is the number of stickers and `m` is the length of target (≤ 15).

- We have `2^m` possible states (bitmasks)
- For each state, we try all `n` stickers
- For each sticker, we check all `m` positions in the worst case
- Total: `O(n * m * 2^m)`, but since `m ≤ 15`, we simplify to `O(n * 2^m)`

**Space Complexity:** `O(2^m)` for the memoization cache plus `O(n * 26)` for storing sticker counts.

Why this is acceptable: With `m ≤ 15`, `2^m ≤ 32768`, which is manageable. The `n * 2^m` factor might seem large, but in practice many states are unreachable or quickly resolved.

## Common Mistakes

1. **Not using memoization**: Trying pure DFS without caching results in exponential re-computation. The search space has overlapping subproblems (the same set of needed letters can be reached multiple ways), so memoization is essential.

2. **Incorrect state representation**: Trying to track which stickers were used rather than which letters are needed. The order of sticker usage doesn't matter, only which letters remain. The bitmask elegantly captures this.

3. **Forgetting that stickers can be used multiple times**: The solution must allow using the same sticker multiple times. Our approach handles this naturally since we consider each sticker independently at each step.

4. **Not handling impossible cases**: Some targets might be impossible to spell (e.g., if no sticker has a particular letter). The code must return -1 in these cases. Our initialization with infinity/MAX_VALUE and final check handles this.

5. **Inefficient mask update**: When using a sticker, you must only remove letters that the sticker actually provides AND that you still need. The double check `(mask >> i) & 1` and `tempCounts[idx] > 0` ensures this.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask DP**: When you need to represent a subset of elements and the size is small (≤ 20-25), bitmasks are efficient. Similar problems:
   - **Partition to K Equal Sum Subsets**: Represent which numbers are used with bitmask
   - **Shortest Path Visiting All Nodes**: Track visited nodes with bitmask

2. **Memoized DFS/DP on subsets**: When the state space is exponential but manageable with caching. Similar problems:
   - **Can I Win**: Memoization on the set of remaining numbers
   - **Matchsticks to Square**: DFS with memoization on used matchsticks

3. **Set cover problems**: When you need to cover all elements with minimum sets. This is the optimization version of Ransom Note.

## Key Takeaways

1. **Bitmasks are powerful for subset problems**: When you need to track which elements from a small set are selected/used/needed, bitmasks provide an `O(1)` way to represent and manipulate subsets.

2. **Memoization turns exponential into manageable**: Even with exponential state spaces, if the base is small enough (`2^15 = 32768`), memoization can make the problem solvable.

3. **Focus on what matters**: Instead of tracking which stickers were used (order matters, hard to deduplicate), track what remains to be done (letters needed). This reduces state space and eliminates ordering issues.

4. **Preprocessing helps**: Converting strings to character count arrays once at the beginning avoids repeated string operations during the search.

Related problems: [Ransom Note](/problem/ransom-note)
