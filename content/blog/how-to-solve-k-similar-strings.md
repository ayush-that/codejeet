---
title: "How to Solve K-Similar Strings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode K-Similar Strings. Hard difficulty, 40.6% acceptance rate. Topics: Hash Table, String, Breadth-First Search."
date: "2028-06-15"
category: "dsa-patterns"
tags: ["k-similar-strings", "hash-table", "string", "breadth-first-search", "hard"]
---

# How to Solve K-Similar Strings

This problem asks us to find the minimum number of adjacent swaps needed to transform one anagram into another. What makes this tricky is that while we know we need to swap characters, we need to find the optimal sequence of swaps that minimizes the total count. The challenge lies in avoiding unnecessary swaps that don't bring us closer to the target string.

## Visual Walkthrough

Let's trace through a concrete example: `s1 = "abc"`, `s2 = "acb"`.

Our goal is to transform `"abc"` into `"acb"` with the fewest swaps. Let's visualize the process:

1. **Initial state**: `"abc"` (target: `"acb"`)
2. **First swap**: Swap positions 1 and 2 (0-indexed): `"abc"` → `"acb"`
   - We're done! That took exactly 1 swap.

Now let's try a more complex example: `s1 = "abac"`, `s2 = "baca"`.

1. **Initial state**: `"abac"` (target: `"baca"`)
2. **Option 1**: Swap positions 0 and 1: `"abac"` → `"baac"`
3. **Option 2**: Swap positions 1 and 2: `"abac"` → `"aabc"`

Which path leads to fewer total swaps? We need to explore systematically. This is where BFS comes in - we can treat each string state as a node and swaps as edges connecting states.

## Brute Force Approach

A naive approach would try all possible sequences of swaps until we reach the target. For a string of length `n`, there are `n-1` possible adjacent swaps at each step. If we explore all possibilities without optimization, we could end up with `(n-1)^k` states to explore for `k` swaps.

The brute force BFS would:

1. Start with `s1` as the initial state
2. Generate all possible strings reachable by one swap
3. Check if any equals `s2`
4. If not, repeat for each new string

The problem? This explores many redundant states and has exponential time complexity. For strings with repeated characters, we'll generate the same state multiple times through different swap sequences.

<div class="code-group">

```python
# Brute Force BFS (Too slow for most cases)
def kSimilarity_brute(s1: str, s2: str) -> int:
    from collections import deque

    if s1 == s2:
        return 0

    queue = deque([s1])
    visited = set([s1])
    swaps = 0

    while queue:
        swaps += 1
        level_size = len(queue)

        for _ in range(level_size):
            current = queue.popleft()
            chars = list(current)

            # Try all possible adjacent swaps
            for i in range(len(chars) - 1):
                # Swap adjacent characters
                chars[i], chars[i + 1] = chars[i + 1], chars[i]
                new_str = ''.join(chars)

                if new_str == s2:
                    return swaps

                if new_str not in visited:
                    visited.add(new_str)
                    queue.append(new_str)

                # Swap back for next iteration
                chars[i], chars[i + 1] = chars[i + 1], chars[i]

    return -1  # Should never reach here for anagrams
```

```javascript
// Brute Force BFS (Too slow for most cases)
function kSimilarityBrute(s1, s2) {
  if (s1 === s2) return 0;

  const queue = [s1];
  const visited = new Set([s1]);
  let swaps = 0;

  while (queue.length > 0) {
    swaps++;
    const levelSize = queue.length;

    for (let j = 0; j < levelSize; j++) {
      const current = queue.shift();
      const chars = current.split("");

      // Try all possible adjacent swaps
      for (let i = 0; i < chars.length - 1; i++) {
        // Swap adjacent characters
        [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
        const newStr = chars.join("");

        if (newStr === s2) return swaps;

        if (!visited.has(newStr)) {
          visited.add(newStr);
          queue.push(newStr);
        }

        // Swap back for next iteration
        [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
      }
    }
  }

  return -1; // Should never reach here for anagrams
}
```

```java
// Brute Force BFS (Too slow for most cases)
public int kSimilarityBrute(String s1, String s2) {
    if (s1.equals(s2)) return 0;

    Queue<String> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    queue.offer(s1);
    visited.add(s1);
    int swaps = 0;

    while (!queue.isEmpty()) {
        swaps++;
        int levelSize = queue.size();

        for (int j = 0; j < levelSize; j++) {
            String current = queue.poll();
            char[] chars = current.toCharArray();

            // Try all possible adjacent swaps
            for (int i = 0; i < chars.length - 1; i++) {
                // Swap adjacent characters
                char temp = chars[i];
                chars[i] = chars[i + 1];
                chars[i + 1] = temp;

                String newStr = new String(chars);

                if (newStr.equals(s2)) return swaps;

                if (!visited.contains(newStr)) {
                    visited.add(newStr);
                    queue.offer(newStr);
                }

                // Swap back for next iteration
                temp = chars[i];
                chars[i] = chars[i + 1];
                chars[i + 1] = temp;
            }
        }
    }

    return -1; // Should never reach here for anagrams
}
```

</div>

## Optimized Approach

The key insight is that we don't need to try all possible swaps at each step. We can be smarter about which swaps to make:

1. **Find the first mismatch**: Start from the left and find the first position where `s1[i] != s2[i]`
2. **Look for beneficial swaps**: We want to swap `s1[i]` with a character that will put the correct character in position `i`
3. **Prioritize perfect matches**: If we can find a character `s1[j]` that equals `s2[i]` AND `s1[i]` equals `s2[j]`, that's a perfect swap that fixes two positions at once
4. **Use BFS with pruning**: We still use BFS to guarantee we find the minimum swaps, but we prune the search space by only considering swaps that fix the first mismatch

This optimization dramatically reduces the search space. Instead of exploring `O((n-1)^k)` states, we explore states more strategically.

## Optimal Solution

Here's the optimized BFS solution with pruning:

<div class="code-group">

```python
# Time: O(n * n!) in worst case, but much better with pruning | Space: O(n!)
def kSimilarity(s1: str, s2: str) -> int:
    from collections import deque

    # If strings are already equal, no swaps needed
    if s1 == s2:
        return 0

    # BFS queue stores tuples of (current_string, swaps_count)
    queue = deque([(s1, 0)])
    # Visited set to avoid revisiting the same state
    visited = set([s1])

    while queue:
        current, swaps = queue.popleft()
        # Convert to list for easy swapping
        chars = list(current)

        # Find the first position where current differs from target
        i = 0
        while i < len(chars) and chars[i] == s2[i]:
            i += 1

        # Try swapping character at position i with characters after it
        for j in range(i + 1, len(chars)):
            # Only consider swaps where chars[j] could fix position i
            if chars[j] == s2[i]:
                # Perform the swap
                chars[i], chars[j] = chars[j], chars[i]
                new_str = ''.join(chars)

                # If we reached the target, return swaps + 1
                if new_str == s2:
                    return swaps + 1

                # Add to queue if not visited
                if new_str not in visited:
                    visited.add(new_str)
                    queue.append((new_str, swaps + 1))

                # Swap back for next iteration
                chars[i], chars[j] = chars[j], chars[i]

    return -1  # Should never reach here for valid anagrams
```

```javascript
// Time: O(n * n!) in worst case, but much better with pruning | Space: O(n!)
function kSimilarity(s1, s2) {
  // If strings are already equal, no swaps needed
  if (s1 === s2) return 0;

  // BFS queue stores objects with string and swaps count
  const queue = [{ str: s1, swaps: 0 }];
  // Visited set to avoid revisiting the same state
  const visited = new Set([s1]);

  while (queue.length > 0) {
    const { str: current, swaps } = queue.shift();
    const chars = current.split("");

    // Find the first position where current differs from target
    let i = 0;
    while (i < chars.length && chars[i] === s2[i]) {
      i++;
    }

    // Try swapping character at position i with characters after it
    for (let j = i + 1; j < chars.length; j++) {
      // Only consider swaps where chars[j] could fix position i
      if (chars[j] === s2[i]) {
        // Perform the swap
        [chars[i], chars[j]] = [chars[j], chars[i]];
        const newStr = chars.join("");

        // If we reached the target, return swaps + 1
        if (newStr === s2) return swaps + 1;

        // Add to queue if not visited
        if (!visited.has(newStr)) {
          visited.add(newStr);
          queue.push({ str: newStr, swaps: swaps + 1 });
        }

        // Swap back for next iteration
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
    }
  }

  return -1; // Should never reach here for valid anagrams
}
```

```java
// Time: O(n * n!) in worst case, but much better with pruning | Space: O(n!)
public int kSimilarity(String s1, String s2) {
    // If strings are already equal, no swaps needed
    if (s1.equals(s2)) return 0;

    // BFS queue stores string states
    Queue<String> queue = new LinkedList<>();
    // Visited set to avoid revisiting the same state
    Set<String> visited = new HashSet<>();
    queue.offer(s1);
    visited.add(s1);
    int swaps = 0;

    while (!queue.isEmpty()) {
        int levelSize = queue.size();

        for (int k = 0; k < levelSize; k++) {
            String current = queue.poll();
            char[] chars = current.toCharArray();

            // Find the first position where current differs from target
            int i = 0;
            while (i < chars.length && chars[i] == s2.charAt(i)) {
                i++;
            }

            // Try swapping character at position i with characters after it
            for (int j = i + 1; j < chars.length; j++) {
                // Only consider swaps where chars[j] could fix position i
                if (chars[j] == s2.charAt(i)) {
                    // Perform the swap
                    swap(chars, i, j);
                    String newStr = new String(chars);

                    // If we reached the target, return swaps + 1
                    if (newStr.equals(s2)) return swaps + 1;

                    // Add to queue if not visited
                    if (!visited.contains(newStr)) {
                        visited.add(newStr);
                        queue.offer(newStr);
                    }

                    // Swap back for next iteration
                    swap(chars, i, j);
                }
            }
        }
        swaps++;
    }

    return -1; // Should never reach here for valid anagrams
}

// Helper method to swap characters in array
private void swap(char[] arr, int i, int j) {
    char temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

</div>

## Complexity Analysis

**Time Complexity**: In the worst case, this is `O(n * n!)` where `n` is the length of the string. This worst case occurs when every permutation needs to be explored. However, with our pruning strategy (only swapping to fix the first mismatch), the actual runtime is much better in practice. The pruning reduces the branching factor significantly.

**Space Complexity**: `O(n!)` in the worst case, as we might need to store all permutations in the visited set. However, with pruning, we store far fewer states in practice. The queue also contributes to space usage.

The complexity seems high theoretically, but for the constraints typically seen in coding interviews (strings up to length 20), this solution works efficiently due to the aggressive pruning.

## Common Mistakes

1. **Not checking for the "perfect swap" opportunity**: Some candidates try all swaps instead of prioritizing swaps where `s1[i] == s2[j]` and `s1[j] == s2[i]`. This creates unnecessary branching in the BFS.

2. **Forgetting to handle already-equal strings**: Always check if `s1 == s2` at the beginning to return 0 immediately.

3. **Not using a visited set**: Without tracking visited states, BFS can get stuck in cycles or waste time revisiting the same state through different swap sequences.

4. **Swapping non-adjacent characters**: The problem allows only adjacent swaps, but some candidates mistakenly implement arbitrary swaps. Our solution simulates adjacent swaps by considering all positions `j > i`, but in reality, transforming one adjacent swap into another requires multiple steps in our state space.

## When You'll See This Pattern

This BFS-with-pruning pattern appears in several permutation and transformation problems:

1. **Couples Holding Hands (LeetCode 765)**: Similar concept of finding minimum swaps to arrange couples together. The optimal solution often uses cycle detection in a graph, but BFS approaches also work.

2. **Sliding Puzzle (LeetCode 773)**: Finding the minimum moves to solve a sliding puzzle is essentially the same problem - BFS over state space with pruning.

3. **Word Ladder (LeetCode 127)**: Transforming one word to another by changing one letter at a time uses the same BFS-over-words approach.

The key insight is recognizing when you have a state transformation problem where you need to find the shortest path between two states. BFS is natural for shortest path problems, and pruning is essential when the state space is large.

## Key Takeaways

1. **BFS finds minimum transformations**: When you need the fewest steps to transform one state to another, BFS is your go-to algorithm because it explores all possibilities level by level.

2. **Prune aggressively in permutation spaces**: In problems with factorial state spaces, you must prune. Look for heuristics like "fix the first mismatch" or "make the most beneficial move first."

3. **State representation matters**: Using strings directly as states makes the code cleaner than trying to track swap sequences. Let BFS handle the step counting.

4. **Visited sets prevent cycles**: Always use a visited set in BFS for state transformation problems to avoid infinite loops.

Related problems: [Couples Holding Hands](/problem/couples-holding-hands)
