---
title: "How to Solve Minimum Genetic Mutation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Genetic Mutation. Medium difficulty, 56.4% acceptance rate. Topics: Hash Table, String, Breadth-First Search."
date: "2028-03-12"
category: "dsa-patterns"
tags: ["minimum-genetic-mutation", "hash-table", "string", "breadth-first-search", "medium"]
---

# How to Solve Minimum Genetic Mutation

This problem asks us to find the minimum number of mutations needed to transform a starting gene sequence into an ending gene sequence, where each mutation changes exactly one character, and we can only mutate to sequences in a given bank. The challenge lies in finding the shortest path between two nodes in a graph where each valid gene sequence is a node, and edges exist between sequences that differ by exactly one character.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `startGene = "AACCGGTT"`
- `endGene = "AAACGGTA"`
- `bank = ["AACCGGTA", "AACCGCTA", "AAACGGTA"]`

**Step-by-step reasoning:**

1. **Initial state:** We start at "AACCGGTT"
2. **Valid mutations:** We can only change one character at a time, and the result must be in the bank
3. **First mutation:** From "AACCGGTT", we can change:
   - Position 3: "AACCGGTT" → "AACCGGTA" (bank contains "AACCGGTA")
   - Position 7: "AACCGGTT" → "AACCGGCT" (not in bank)
   - Other changes either aren't in bank or don't change exactly one character
4. **Second mutation:** From "AACCGGTA", we can change:
   - Position 2: "AACCGGTA" → "AAACGGTA" (bank contains "AAACGGTA" - our target!)

So we found a path: "AACCGGTT" → "AACCGGTA" → "AAACGGTA" with 2 mutations.

This looks like a graph problem where:

- Each gene sequence is a node
- Edges connect nodes that differ by exactly one character
- We need the shortest path from start to end

## Brute Force Approach

A naive approach would be to try all possible mutation sequences. For each position in the 8-character string, we could try changing it to each of the 3 other possible characters (since there are 4 total characters), check if the result is in the bank, and recursively continue until we reach the end gene or exhaust all possibilities.

**Why this fails:**

1. **Exponential time complexity:** For each of the 8 positions, we have 3 possible changes, leading to 3⁸ possibilities at depth 8, which is 6,561 possibilities. But since we can revisit nodes, the actual search space is even larger.
2. **No guarantee of finding the shortest path:** A naive recursive approach without proper tracking would explore many redundant paths.
3. **Inefficient bank lookup:** Checking if a mutation is in the bank by scanning the entire list each time is O(n) per check.

The brute force approach quickly becomes infeasible for larger banks or when the mutation path is long.

## Optimized Approach

The key insight is that this is essentially a **shortest path problem in an unweighted graph**, which calls for **Breadth-First Search (BFS)**. BFS is perfect here because:

1. It explores all nodes at the current "distance" (number of mutations) before moving to nodes further away
2. The first time we encounter the end gene, we know we've found the shortest path
3. It naturally avoids cycles by tracking visited nodes

**Step-by-step reasoning:**

1. **Graph representation:** We don't need to build the entire graph upfront. Instead, we can generate neighbors on-the-fly:
   - For each position in the current gene (8 positions)
   - For each possible character change (3 other characters)
   - Check if the resulting gene is in the bank
2. **BFS queue:** We'll use a queue to process genes in order of discovery
3. **Visited set:** To avoid revisiting genes and getting stuck in cycles
4. **Mutation count:** Track how many mutations we've made to reach each gene

**Why BFS works:** In an unweighted graph where all edges have the same cost (1 mutation), BFS guarantees that when we first reach the destination, we've taken the minimum number of steps. This is because BFS explores all nodes at distance k before exploring nodes at distance k+1.

## Optimal Solution

Here's the complete BFS solution with detailed comments:

<div class="code-group">

```python
# Time: O(b * 8 * 3) = O(b) where b is bank size
# Space: O(b) for the visited set and queue
from collections import deque

def minMutation(startGene: str, endGene: str, bank: list[str]) -> int:
    # Convert bank to a set for O(1) lookups
    # This is crucial for performance - list lookups would be O(n)
    bank_set = set(bank)

    # If endGene is not in bank, mutation is impossible
    if endGene not in bank_set:
        return -1

    # Valid characters for mutations
    chars = ['A', 'C', 'G', 'T']

    # BFS initialization
    queue = deque()
    queue.append((startGene, 0))  # (current_gene, mutations_so_far)
    visited = set()
    visited.add(startGene)

    # BFS traversal
    while queue:
        current_gene, mutations = queue.popleft()

        # If we've reached the target, return the mutation count
        if current_gene == endGene:
            return mutations

        # Generate all possible mutations from current gene
        # For each of the 8 positions in the gene
        for i in range(8):
            # For each of the 4 possible characters
            for char in chars:
                # Skip if character is same as current (no mutation)
                if char == current_gene[i]:
                    continue

                # Create new gene by changing character at position i
                # Convert to list for mutation, then back to string
                new_gene_list = list(current_gene)
                new_gene_list[i] = char
                new_gene = ''.join(new_gene_list)

                # Check if new gene is valid (in bank) and not visited
                if new_gene in bank_set and new_gene not in visited:
                    # Mark as visited and add to queue
                    visited.add(new_gene)
                    queue.append((new_gene, mutations + 1))

    # If BFS completes without finding endGene, return -1
    return -1
```

```javascript
// Time: O(b * 8 * 3) = O(b) where b is bank size
// Space: O(b) for the visited set and queue
function minMutation(startGene, endGene, bank) {
  // Convert bank to a Set for O(1) lookups
  const bankSet = new Set(bank);

  // If endGene is not in bank, mutation is impossible
  if (!bankSet.has(endGene)) {
    return -1;
  }

  // Valid characters for mutations
  const chars = ["A", "C", "G", "T"];

  // BFS initialization
  const queue = [[startGene, 0]]; // [current_gene, mutations_so_far]
  const visited = new Set();
  visited.add(startGene);

  // BFS traversal
  while (queue.length > 0) {
    const [currentGene, mutations] = queue.shift();

    // If we've reached the target, return the mutation count
    if (currentGene === endGene) {
      return mutations;
    }

    // Generate all possible mutations from current gene
    // For each of the 8 positions in the gene
    for (let i = 0; i < 8; i++) {
      // For each of the 4 possible characters
      for (const char of chars) {
        // Skip if character is same as current (no mutation)
        if (char === currentGene[i]) {
          continue;
        }

        // Create new gene by changing character at position i
        // Convert to array, mutate, then back to string
        const newGeneArray = currentGene.split("");
        newGeneArray[i] = char;
        const newGene = newGeneArray.join("");

        // Check if new gene is valid (in bank) and not visited
        if (bankSet.has(newGene) && !visited.has(newGene)) {
          // Mark as visited and add to queue
          visited.add(newGene);
          queue.push([newGene, mutations + 1]);
        }
      }
    }
  }

  // If BFS completes without finding endGene, return -1
  return -1;
}
```

```java
// Time: O(b * 8 * 3) = O(b) where b is bank size
// Space: O(b) for the visited set and queue
import java.util.*;

public class Solution {
    public int minMutation(String startGene, String endGene, String[] bank) {
        // Convert bank to a Set for O(1) lookups
        Set<String> bankSet = new HashSet<>(Arrays.asList(bank));

        // If endGene is not in bank, mutation is impossible
        if (!bankSet.contains(endGene)) {
            return -1;
        }

        // Valid characters for mutations
        char[] chars = {'A', 'C', 'G', 'T'};

        // BFS initialization
        Queue<Pair<String, Integer>> queue = new LinkedList<>();
        queue.offer(new Pair<>(startGene, 0));  // (current_gene, mutations_so_far)
        Set<String> visited = new HashSet<>();
        visited.add(startGene);

        // BFS traversal
        while (!queue.isEmpty()) {
            Pair<String, Integer> current = queue.poll();
            String currentGene = current.getKey();
            int mutations = current.getValue();

            // If we've reached the target, return the mutation count
            if (currentGene.equals(endGene)) {
                return mutations;
            }

            // Generate all possible mutations from current gene
            // For each of the 8 positions in the gene
            for (int i = 0; i < 8; i++) {
                // For each of the 4 possible characters
                for (char c : chars) {
                    // Skip if character is same as current (no mutation)
                    if (c == currentGene.charAt(i)) {
                        continue;
                    }

                    // Create new gene by changing character at position i
                    char[] newGeneArray = currentGene.toCharArray();
                    newGeneArray[i] = c;
                    String newGene = new String(newGeneArray);

                    // Check if new gene is valid (in bank) and not visited
                    if (bankSet.contains(newGene) && !visited.contains(newGene)) {
                        // Mark as visited and add to queue
                        visited.add(newGene);
                        queue.offer(new Pair<>(newGene, mutations + 1));
                    }
                }
            }
        }

        // If BFS completes without finding endGene, return -1
        return -1;
    }

    // Helper class for storing gene and mutation count together
    class Pair<K, V> {
        private K key;
        private V value;

        public Pair(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() { return key; }
        public V getValue() { return value; }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(b)**

- `b` is the size of the bank
- In the worst case, we might visit every gene in the bank
- For each gene, we generate up to 8 × 3 = 24 possible mutations
- Each mutation check is O(1) thanks to the HashSet
- Total: O(b × 24) = O(b)

**Space Complexity: O(b)**

- We store the bank in a HashSet: O(b)
- The visited set can contain up to b genes: O(b)
- The BFS queue can contain up to b genes: O(b)
- Total: O(3b) = O(b)

## Common Mistakes

1. **Not converting bank to a set:** Using a list for bank lookups makes each check O(n) instead of O(1), turning O(b) algorithm into O(b²).

2. **Forgetting to check if endGene is in bank:** The problem states we can only mutate to genes in the bank. If endGene isn't in bank, we should return -1 immediately.

3. **Not tracking visited genes:** Without a visited set, BFS can get stuck in cycles or revisit nodes, causing infinite loops or exponential time complexity.

4. **Using DFS instead of BFS:** DFS doesn't guarantee the shortest path in an unweighted graph. Candidates might try recursion without proper depth tracking.

5. **Incorrect mutation generation:** Some candidates might try to mutate multiple characters at once or forget that genes are exactly 8 characters long.

## When You'll See This Pattern

This problem uses the **BFS for shortest path in unweighted graph** pattern, which appears in many coding problems:

1. **Word Ladder (LeetCode 127):** Almost identical problem but with words instead of genes. The only difference is word length varies and character set is larger (26 letters).

2. **Open the Lock (LeetCode 752):** Find minimum turns to open a combination lock where each digit can be turned up or down, with some combinations forbidden.

3. **Minimum Knight Moves (LeetCode 1197):** Find minimum moves for a knight to reach a target square on an infinite chessboard.

The pattern to recognize: When you need the shortest transformation between two states where each step has a defined set of valid moves, think BFS.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs:** When all "moves" have equal cost and you need the minimum number of steps, BFS is your go-to algorithm.

2. **Generate neighbors on-the-fly:** For problems with large state spaces, don't build the entire graph upfront. Generate valid neighbors as you explore.

3. **Use sets for O(1) membership checks:** When you need to frequently check if an element is in a collection, convert it to a hash set first.

4. **Always track visited states:** In graph traversal, forgetting to track visited nodes leads to exponential time complexity or infinite loops.

Related problems: [Word Ladder](/problem/word-ladder)
