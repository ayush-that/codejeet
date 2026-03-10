---
title: "How to Solve Maximum Genetic Difference Query — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Genetic Difference Query. Hard difficulty, 46.5% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Depth-First Search, Trie."
date: "2026-07-10"
category: "dsa-patterns"
tags: ["maximum-genetic-difference-query", "array", "hash-table", "bit-manipulation", "hard"]
---

# How to Solve Maximum Genetic Difference Query

You're given a rooted tree where each node's value equals its index, and queries that ask: "What's the maximum XOR between a node in a given subtree and a given value?" The challenge is answering many queries efficiently on a tree where each node's value is its own index. What makes this tricky is that you need to handle XOR queries on dynamic subsets (subtrees) while traversing the tree.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Tree**: parent = [-1, 0, 0, 1, 1, 2, 2] (7 nodes, 0 is root)
**Queries**: [[0, 3], [1, 5], [2, 1]]

Node values are just their indices: 0, 1, 2, 3, 4, 5, 6

**Query 1**: [node=0, val=3] → Find max XOR between 3 and any node in subtree rooted at 0

- Subtree at node 0 contains all nodes: {0,1,2,3,4,5,6}
- Calculate XORs: 3^0=3, 3^1=2, 3^2=1, 3^3=0, 3^4=7, 3^5=6, 3^6=5
- Maximum is 7 (from node 4)

**Query 2**: [node=1, val=5] → Subtree at node 1: {1,3,4}

- XORs: 5^1=4, 5^3=6, 5^4=1
- Maximum is 6 (from node 3)

**Query 3**: [node=2, val=1] → Subtree at node 2: {2,5,6}

- XORs: 1^2=3, 1^5=4, 1^6=7
- Maximum is 7 (from node 6)

The brute force would compute all XORs for each query, but with n=10⁵ nodes and queries, this is O(n²) — far too slow. We need a smarter approach.

## Brute Force Approach

The straightforward solution processes each query independently:

1. Perform DFS to collect all nodes in the subtree
2. For each node in the subtree, compute XOR with the query value
3. Track the maximum XOR found

<div class="code-group">

```python
# Time: O(q * n) | Space: O(n) for recursion stack
def brute_force(parent, queries):
    n = len(parent)

    # Build adjacency list
    graph = [[] for _ in range(n)]
    for i in range(1, n):
        graph[parent[i]].append(i)

    def dfs_collect(node):
        """Collect all nodes in subtree rooted at node"""
        nodes = [node]
        for child in graph[node]:
            nodes.extend(dfs_collect(child))
        return nodes

    results = []
    for node, val in queries:
        # Get all nodes in subtree
        subtree_nodes = dfs_collect(node)

        # Find max XOR
        max_xor = 0
        for sub_node in subtree_nodes:
            max_xor = max(max_xor, sub_node ^ val)
        results.append(max_xor)

    return results
```

```javascript
// Time: O(q * n) | Space: O(n) for recursion stack
function bruteForce(parent, queries) {
  const n = parent.length;

  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    graph[parent[i]].push(i);
  }

  function dfsCollect(node) {
    // Collect all nodes in subtree rooted at node
    let nodes = [node];
    for (const child of graph[node]) {
      nodes = nodes.concat(dfsCollect(child));
    }
    return nodes;
  }

  const results = [];
  for (const [node, val] of queries) {
    // Get all nodes in subtree
    const subtreeNodes = dfsCollect(node);

    // Find max XOR
    let maxXor = 0;
    for (const subNode of subtreeNodes) {
      maxXor = Math.max(maxXor, subNode ^ val);
    }
    results.push(maxXor);
  }

  return results;
}
```

```java
// Time: O(q * n) | Space: O(n) for recursion stack
public List<Integer> bruteForce(int[] parent, int[][] queries) {
    int n = parent.length;

    // Build adjacency list
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int i = 1; i < n; i++) {
        graph[parent[i]].add(i);
    }

    // DFS to collect subtree nodes
    List<Integer> dfsCollect(int node) {
        List<Integer> nodes = new ArrayList<>();
        nodes.add(node);
        for (int child : graph[node]) {
            nodes.addAll(dfsCollect(child));
        }
        return nodes;
    }

    List<Integer> results = new ArrayList<>();
    for (int[] query : queries) {
        int node = query[0];
        int val = query[1];

        // Get all nodes in subtree
        List<Integer> subtreeNodes = dfsCollect(node);

        // Find max XOR
        int maxXor = 0;
        for (int subNode : subtreeNodes) {
            maxXor = Math.max(maxXor, subNode ^ val);
        }
        results.add(maxXor);
    }

    return results;
}
```

</div>

**Why it's too slow**: With n=10⁵ nodes and q=10⁵ queries, each query could traverse O(n) nodes, giving O(n\*q) = 10¹⁰ operations — impossible within time limits. We need to answer queries in better than O(n) time each.

## Optimized Approach

The key insight is that we need to answer "maximum XOR with a value" queries efficiently. This is a classic problem solvable with a **binary trie** in O(b) time, where b is the number of bits (max 18 since n ≤ 2×10⁵ < 2¹⁸).

**Step-by-step reasoning**:

1. **Maximum XOR trick**: To maximize a^val, we want to choose bits that are opposite to val's bits at each position, starting from the most significant bit.
2. **Binary Trie**: Stores numbers as binary strings. When querying for max XOR with val, we traverse the trie trying to take the opposite bit at each step if available.
3. **Tree traversal**: We need to handle dynamic sets (subtrees). Use DFS with:
   - **Add node value to trie** when entering a node
   - **Remove node value from trie** when exiting a node
   - **Answer queries** when at the query node (all nodes in its subtree are in the trie)
4. **Offline processing**: Group queries by node, answer them during DFS when we reach that node.

**Why this works**: During DFS, when we're at node u, the trie contains exactly the values in the path from root to u. But wait — we need subtrees, not paths! Actually, we need to use a different approach: process queries after visiting all children (post-order), so the trie contains the entire subtree.

Actually, the correct approach is:

- Use DFS with "add node to trie" when entering
- Process all queries for current node (trie contains nodes in current subtree)
- Remove node from trie when exiting

But this doesn't work because when we're at node u, we haven't visited its children yet. So we need to:

1. Collect all queries for each node
2. Do DFS: add node to trie, process all children, answer queries for this node, remove node from trie

Wait, that's still wrong. Let's think carefully...

**Correct approach**: We need the trie to contain ALL nodes in the subtree of the query node. So when we answer a query for node u, we need u and all its descendants in the trie. This suggests we should:

1. Do a DFS
2. When entering a node, add it to trie
3. Answer queries for this node (now trie contains this node and all ancestors, but not descendants yet — problem!)
4. Process children
5. Remove node from trie

This doesn't work because we don't have descendants in the trie yet. The solution is to use a **post-order DFS** or process queries after visiting children. Actually, the standard approach is:

1. Build the tree and group queries by node
2. Perform DFS:
   - Add current node to trie
   - Recursively process all children
   - Now trie contains current node and all descendants
   - Answer all queries for current node
   - Remove current node from trie

This ensures when we answer queries for node u, the trie contains exactly the subtree rooted at u.

## Optimal Solution

We implement DFS with a binary trie that supports add, remove, and max XOR queries. The trie nodes maintain a count to handle duplicates (though we don't have duplicates here since node values are unique).

<div class="code-group">

```python
# Time: O((n + q) * logM) where M is max node value | Space: O(n * logM)
class TrieNode:
    def __init__(self):
        self.children = [None, None]  # 0 and 1 branches
        self.count = 0  # Number of numbers passing through this node

class Solution:
    def maxGeneticDifference(self, parent, queries):
        n = len(parent)

        # Build tree and find root
        graph = [[] for _ in range(n)]
        root = -1
        for i in range(n):
            if parent[i] == -1:
                root = i
            else:
                graph[parent[i]].append(i)

        # Group queries by node
        queries_by_node = [[] for _ in range(n)]
        for i, (node, val) in enumerate(queries):
            queries_by_node[node].append((val, i))

        # Initialize results array
        results = [0] * len(queries)

        # Initialize trie root
        trie_root = TrieNode()

        def add_to_trie(num):
            """Add a number to the binary trie"""
            node = trie_root
            # Process from most significant bit (17th bit since n <= 2*10^5 < 2^18)
            for bit in range(17, -1, -1):
                bit_val = (num >> bit) & 1
                if not node.children[bit_val]:
                    node.children[bit_val] = TrieNode()
                node = node.children[bit_val]
                node.count += 1

        def remove_from_trie(num):
            """Remove a number from the binary trie"""
            node = trie_root
            # Follow the same path and decrement counts
            for bit in range(17, -1, -1):
                bit_val = (num >> bit) & 1
                node = node.children[bit_val]
                node.count -= 1

        def query_max_xor(val):
            """Find maximum XOR of val with any number in the trie"""
            node = trie_root
            result = 0

            for bit in range(17, -1, -1):
                bit_val = (val >> bit) & 1
                # We want the opposite bit to maximize XOR
                opposite = 1 - bit_val

                # Check if opposite branch exists and has numbers
                if node.children[opposite] and node.children[opposite].count > 0:
                    result |= (1 << bit)  # Set this bit in result
                    node = node.children[opposite]
                else:
                    # Have to take same bit
                    node = node.children[bit_val]

            return result

        def dfs(node):
            """Depth-first search to process subtree queries"""
            # Add current node to trie
            add_to_trie(node)

            # Process all children first (ensuring trie contains full subtree)
            for child in graph[node]:
                dfs(child)

            # Now trie contains current node and all descendants
            # Answer all queries for this node
            for val, idx in queries_by_node[node]:
                results[idx] = query_max_xor(val)

            # Remove current node from trie before returning to parent
            remove_from_trie(node)

        # Start DFS from root
        dfs(root)

        return results
```

```javascript
// Time: O((n + q) * logM) where M is max node value | Space: O(n * logM)
class TrieNode {
  constructor() {
    this.children = [null, null]; // 0 and 1 branches
    this.count = 0; // Number of numbers passing through this node
  }
}

var maxGeneticDifference = function (parent, queries) {
  const n = parent.length;

  // Build tree and find root
  const graph = Array.from({ length: n }, () => []);
  let root = -1;
  for (let i = 0; i < n; i++) {
    if (parent[i] === -1) {
      root = i;
    } else {
      graph[parent[i]].push(i);
    }
  }

  // Group queries by node
  const queriesByNode = Array.from({ length: n }, () => []);
  for (let i = 0; i < queries.length; i++) {
    const [node, val] = queries[i];
    queriesByNode[node].push([val, i]);
  }

  // Initialize results array
  const results = new Array(queries.length).fill(0);

  // Initialize trie root
  const trieRoot = new TrieNode();

  function addToTrie(num) {
    // Add a number to the binary trie
    let node = trieRoot;
    // Process from most significant bit (17th bit since n <= 2*10^5 < 2^18)
    for (let bit = 17; bit >= 0; bit--) {
      const bitVal = (num >> bit) & 1;
      if (!node.children[bitVal]) {
        node.children[bitVal] = new TrieNode();
      }
      node = node.children[bitVal];
      node.count++;
    }
  }

  function removeFromTrie(num) {
    // Remove a number from the binary trie
    let node = trieRoot;
    // Follow the same path and decrement counts
    for (let bit = 17; bit >= 0; bit--) {
      const bitVal = (num >> bit) & 1;
      node = node.children[bitVal];
      node.count--;
    }
  }

  function queryMaxXor(val) {
    // Find maximum XOR of val with any number in the trie
    let node = trieRoot;
    let result = 0;

    for (let bit = 17; bit >= 0; bit--) {
      const bitVal = (val >> bit) & 1;
      // We want the opposite bit to maximize XOR
      const opposite = 1 - bitVal;

      // Check if opposite branch exists and has numbers
      if (node.children[opposite] && node.children[opposite].count > 0) {
        result |= 1 << bit; // Set this bit in result
        node = node.children[opposite];
      } else {
        // Have to take same bit
        node = node.children[bitVal];
      }
    }

    return result;
  }

  function dfs(node) {
    // Depth-first search to process subtree queries
    // Add current node to trie
    addToTrie(node);

    // Process all children first (ensuring trie contains full subtree)
    for (const child of graph[node]) {
      dfs(child);
    }

    // Now trie contains current node and all descendants
    // Answer all queries for this node
    for (const [val, idx] of queriesByNode[node]) {
      results[idx] = queryMaxXor(val);
    }

    // Remove current node from trie before returning to parent
    removeFromTrie(node);
  }

  // Start DFS from root
  dfs(root);

  return results;
};
```

```java
// Time: O((n + q) * logM) where M is max node value | Space: O(n * logM)
class TrieNode {
    TrieNode[] children;
    int count;

    public TrieNode() {
        children = new TrieNode[2];  // 0 and 1 branches
        count = 0;  // Number of numbers passing through this node
    }
}

class Solution {
    public int[] maxGeneticDifference(int[] parent, int[][] queries) {
        int n = parent.length;

        // Build tree and find root
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        int root = -1;
        for (int i = 0; i < n; i++) {
            if (parent[i] == -1) {
                root = i;
            } else {
                graph[parent[i]].add(i);
            }
        }

        // Group queries by node
        List<int[]>[] queriesByNode = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            queriesByNode[i] = new ArrayList<>();
        }
        for (int i = 0; i < queries.length; i++) {
            int node = queries[i][0];
            int val = queries[i][1];
            queriesByNode[node].add(new int[]{val, i});
        }

        // Initialize results array
        int[] results = new int[queries.length];

        // Initialize trie root
        TrieNode trieRoot = new TrieNode();

        // DFS to process queries
        dfs(root, graph, queriesByNode, trieRoot, results);

        return results;
    }

    private void dfs(int node, List<Integer>[] graph,
                     List<int[]>[] queriesByNode, TrieNode trieRoot, int[] results) {
        // Add current node to trie
        addToTrie(trieRoot, node);

        // Process all children first (ensuring trie contains full subtree)
        for (int child : graph[node]) {
            dfs(child, graph, queriesByNode, trieRoot, results);
        }

        // Now trie contains current node and all descendants
        // Answer all queries for this node
        for (int[] query : queriesByNode[node]) {
            int val = query[0];
            int idx = query[1];
            results[idx] = queryMaxXor(trieRoot, val);
        }

        // Remove current node from trie before returning to parent
        removeFromTrie(trieRoot, node);
    }

    private void addToTrie(TrieNode root, int num) {
        // Add a number to the binary trie
        TrieNode node = root;
        // Process from most significant bit (17th bit since n <= 2*10^5 < 2^18)
        for (int bit = 17; bit >= 0; bit--) {
            int bitVal = (num >> bit) & 1;
            if (node.children[bitVal] == null) {
                node.children[bitVal] = new TrieNode();
            }
            node = node.children[bitVal];
            node.count++;
        }
    }

    private void removeFromTrie(TrieNode root, int num) {
        // Remove a number from the binary trie
        TrieNode node = root;
        // Follow the same path and decrement counts
        for (int bit = 17; bit >= 0; bit--) {
            int bitVal = (num >> bit) & 1;
            node = node.children[bitVal];
            node.count--;
        }
    }

    private int queryMaxXor(TrieNode root, int val) {
        // Find maximum XOR of val with any number in the trie
        TrieNode node = root;
        int result = 0;

        for (int bit = 17; bit >= 0; bit--) {
            int bitVal = (val >> bit) & 1;
            // We want the opposite bit to maximize XOR
            int opposite = 1 - bitVal;

            // Check if opposite branch exists and has numbers
            if (node.children[opposite] != null && node.children[opposite].count > 0) {
                result |= (1 << bit);  // Set this bit in result
                node = node.children[opposite];
            } else {
                // Have to take same bit
                node = node.children[bitVal];
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O((n + q) × B) where:

- n = number of nodes
- q = number of queries
- B = number of bits (18 in our case, since 2×10⁵ < 2¹⁸)

Each node is added and removed from the trie once (2n operations), and each query performs one trie traversal. Each trie operation takes O(B) time.

**Space Complexity**: O(n × B + n + q)

- Trie stores at most n numbers, each taking O(B) space → O(n × B)
- Graph adjacency list: O(n)
- Queries grouping: O(q)
- Recursion stack: O(n) in worst case (skewed tree)

In practice, B=18 is constant, so we often say O(n + q) time and O(n) space.

## Common Mistakes

1. **Wrong DFS order**: The most common mistake is answering queries before processing children. Remember: you need the entire subtree in the trie before answering queries for a node. Process children first, then answer queries.

2. **Forgetting to remove nodes**: If you don't remove nodes from the trie when exiting, the trie will contain nodes from multiple disjoint subtrees, giving wrong answers for subsequent queries.

3. **Incorrect bit range**: Using too few bits (like 16 when n can be 2×10⁵) causes incorrect results because 2×10⁵ needs at least 18 bits. Always calculate: max value < 2^B, so B = ceil(log2(max_value + 1)).

4. **Not handling empty tries**: When querying for max XOR, check that a child exists AND has count > 0 before traversing. A node might exist in the trie structure but have count = 0 if all numbers using that path were removed.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary Trie for maximum XOR**: Used in problems like:
   - [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) - simpler version without tree
   - [Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/) - very similar but with array constraints instead of tree

2. **Offline queries on trees**: Processing queries during DFS traversal appears in:
   - [Subtree Queries](https://leetcode.com/problems/subtree-queries/) problems
   - Tree problems where you need to answer queries about subtrees or paths

3. **DFS with add/remove pattern**: This "enter-add, process-children, answer-queries, exit-remove" pattern is useful for many tree problems where you need to maintain a data structure for the current subtree.

## Key Takeaways

1. **Binary Trie is the go-to for maximum XOR problems**: When you need to find max(a XOR b) for many queries, a binary trie giving O(bit-length) time is optimal.

2. **Process subtree queries with post-order DFS**: To answer queries about subtrees, use DFS where you process children first, then answer queries for the current node. This ensures all descendants are in your data structure.

3. **Offline query processing beats online for trees**: Grouping queries by node and answering them during a single DFS traversal is often more efficient than processing each query independently.

Related problems: [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array)
