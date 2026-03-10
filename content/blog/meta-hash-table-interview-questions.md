---
title: "Hash Table Questions at Meta: What to Expect"
description: "Prepare for Hash Table interview questions at Meta — patterns, difficulty breakdown, and study tips."
date: "2027-03-05"
category: "dsa-patterns"
tags: ["meta", "hash-table", "interview prep"]
---

Meta has 272 Hash Table questions on their tagged list — that's nearly 20% of their entire problem catalog. But what does this number actually mean for your interview? Is it a core focus, or just a statistical quirk? Having conducted and passed interviews there, I can tell you it's absolutely a core focus, but not in the way you might think. Hash tables are rarely the _star_ of the interview question; they are the indispensable _supporting actor_. At Meta, the vast majority of problems that involve arrays, strings, or graphs will have an optimal solution that leans on a hash table (dictionary, map, set) for O(1) lookups to avoid O(n²) brute force. You won't often get a pure "implement a hash table" question. Instead, you'll get a problem about user sessions, friend connections, or ad targeting where the efficient path requires you to recognize that a hash table is the tool that unlocks the optimal solution. Expect to use one in at least one, if not both, of your coding interviews.

## Specific Patterns Meta Favors

Meta's problems are deeply tied to their products: social graphs, caches, and real-time data. Consequently, their hash table use cases are very specific.

1.  **Frequency Counting for Arrays & Strings:** This is the most common entry point. The problem presents a list (posts, IDs, search queries) and asks about duplicates, uniqueness, or majority elements. The hash table stores `element -> count`.
    - **Example:** **Find All Duplicates in an Array (#442)**. The optimal O(n) time, O(1) _extra_ space solution uses array indices cleverly, but the most straightforward and often acceptable first solution uses a hash set to track seen numbers.

2.  **Two-Number/Two-Sum Variants:** This pattern is ubiquitous. It's the foundation for checking complements: "Is there a pair that sums to K?" or "Do these two lists have a common element?" The hash table stores `value -> index` or `value -> count` for instant complement checks.
    - **Example:** **Pairs of Songs With Total Durations Divisible by 60 (#1010).** A classic Meta-style twist on Two Sum. Instead of `(a + b) = k`, you need `(a + b) % 60 == 0`. The hash table stores the _remainders_ of song durations mod 60.

3.  **Hash Table as an Adjacency List for Graphs:** This is huge. Meta's world is graphs (users, pages, groups). The most standard way to represent an unweighted graph for BFS/DFS traversal is `Map<Node, List<Neighbors>>`. You build this from a list of edges.
    - **Example:** **Clone Graph (#133).** You must traverse a graph and copy it. The hash table (`original_node -> cloned_node`) serves a dual purpose: it maps nodes for the final structure _and_ acts as a "visited" set to prevent cycles and infinite recursion.

4.  **Caching/Memoization for Dynamic Programming & DFS:** When a recursive function (like DFS on a tree or a DP state) is called with the same inputs repeatedly, you cache the result. This turns exponential time into polynomial time.
    - **Example:** **Word Break (#139).** The recursive check "can the substring `s[i:]` be segmented?" is called on the same `i` repeatedly. A hash table mapping `i -> boolean` result is the memo that makes DP efficient.

## How to Prepare

The key is to stop thinking "hash table problems" and start thinking "hash table as the enabling tool." Your mental checklist for any array/string/graph problem should be: "Could a lookup table turn an O(n) scan into an O(1) operation?"

Let's look at the **Pairs Divisible by 60** pattern. The brute force is O(n²). The insight is that we only care about remainders mod 60. If a song has duration `t` with remainder `r = t % 60`, what remainder `c` does its complementary partner need? It needs `(r + c) % 60 == 0`, which means `c = (60 - r) % 60`. We use a hash table (or array of size 60) to count how many songs we've seen with each remainder.

<div class="code-group">

```python
def numPairsDivisibleBy60(time):
    # Array of size 60 acts as our frequency hash map for remainders
    remainders = [0] * 60
    count = 0

    for t in time:
        r = t % 60
        complement = (60 - r) % 60  # Handles the r == 0 case
        count += remainders[complement]
        remainders[r] += 1
    return count
# Time: O(n) | Space: O(1) (fixed-size array of 60)
```

```javascript
function numPairsDivisibleBy60(time) {
  const remainders = new Array(60).fill(0);
  let count = 0;

  for (const t of time) {
    const r = t % 60;
    const complement = (60 - r) % 60;
    count += remainders[complement];
    remainders[r]++;
  }
  return count;
}
// Time: O(n) | Space: O(1)
```

```java
public int numPairsDivisibleBy60(int[] time) {
    int[] remainders = new int[60];
    int count = 0;

    for (int t : time) {
        int r = t % 60;
        int complement = (60 - r) % 60;
        count += remainders[complement];
        remainders[r]++;
    }
    return count;
}
// Time: O(n) | Space: O(1)
```

</div>

For the **Graph Adjacency List** pattern, the construction is formulaic. Given a list of edges `[ [A, B], ... ]` for an undirected graph:

<div class="code-group">

```python
from collections import defaultdict

def build_adjacency_list(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)  # If undirected
    # Ensure all nodes from 0 to n-1 are in the map, even if isolated
    for i in range(n):
        graph[i]  # This ensures a key exists
    return graph
# Time: O(E) | Space: O(V + E)
```

```javascript
function buildAdjacencyList(n, edges) {
  const graph = new Map();
  // Initialize map for all nodes
  for (let i = 0; i < n; i++) {
    graph.set(i, []);
  }
  // Add edges
  for (const [u, v] of edges) {
    graph.get(u).push(v);
    graph.get(v).push(u); // If undirected
  }
  return graph;
}
// Time: O(E) | Space: O(V + E)
```

```java
public Map<Integer, List<Integer>> buildAdjacencyList(int n, int[][] edges) {
    Map<Integer, List<Integer>> graph = new HashMap<>();
    // Initialize map for all nodes
    for (int i = 0; i < n; i++) {
        graph.put(i, new ArrayList<>());
    }
    // Add edges
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        graph.get(u).add(v);
        graph.get(v).add(u); // If undirected
    }
    return graph;
}
// Time: O(E) | Space: O(V + E)
```

</div>

## How Meta Tests Hash Table vs Other Companies

At companies like Google or Amazon, you might encounter more algorithmic purity—problems deeply tied to hash table theory (e.g., designing a consistent hashing system, implementing an LRU Cache from scratch). Meta's approach is more _applied_. The difficulty isn't in the hash table itself; it's in recognizing the **key** to hash. What should be the key? An integer? A remainder? A tuple representing a state? A node reference? What should be the value? A count? An index? A list? A cloned node?

For example, **Verifying an Alien Dictionary (#953)**. The problem isn't about hash tables. It's about comparing words. But the efficient solution requires you to hash each alien language character to its order position so you can compare two words in O(L) time. The leap is seeing that the hash table is the translator. Meta loves this: a non-obvious key that simplifies the core logic.

## Study Order

Tackle hash table applications in this logical progression:

1.  **Basic Frequency & Lookup:** Master using a hash map for O(1) existence and count checks. This is your foundation.
2.  **Two-Sum & Complement Patterns:** Learn to store processed elements to answer future questions about pairs. This includes variants with multiples (like the divisible by 60 problem).
3.  **Sliding Window + Hash Map:** This combines two patterns. The hash map tracks counts of characters or elements within the dynamic window (e.g., Longest Substring Without Repeating Characters (#3)).
4.  **Graph Representation:** Practice building adjacency lists from edge lists. This should become muscle memory.
5.  **Caching/Memoization:** Learn to identify overlapping subproblems in recursion. The key is often a tuple of parameters (e.g., `(index, remaining_sum)`).
6.  **Advanced Key Design:** Practice problems where the key is non-trivial, like hashing a state or a custom object.

## Recommended Practice Order

Solve these problems in sequence to build the pattern recognition:

1.  **Two Sum (#1)** - The absolute classic.
2.  **Contains Duplicate (#217)** - Basic existence check.
3.  **Group Anagrams (#49)** - Key design: use a sorted string or character count tuple as the key.
4.  **Longest Substring Without Repeating Characters (#3)** - Sliding Window + Hash Map.
5.  **Clone Graph (#133)** - Graph traversal with a hash map as the node mapper/visited set.
6.  **Pairs of Songs With Total Durations Divisible by 60 (#1010)** - Two-Sum variant with remainders.
7.  **Verifying an Alien Dictionary (#953)** - Applied key hashing for comparison.
8.  **Word Break (#139)** - Memoization (caching) of recursive results.

Remember, at Meta, the hash table is your workhorse. Your goal isn't to implement one, but to instinctively reach for it whenever you need to remember something you've seen before. If you're iterating and thinking "I wish I knew if I've seen this value..." — that's your cue. The hash table is the answer.

[Practice Hash Table at Meta](/company/meta/hash-table)
