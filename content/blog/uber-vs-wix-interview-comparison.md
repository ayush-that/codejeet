---
title: "Uber vs Wix: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Wix — difficulty levels, topic focus, and preparation strategy."
date: "2030-04-06"
category: "tips"
tags: ["uber", "wix", "comparison"]
---

# Uber vs Wix: Interview Question Comparison

If you're interviewing at both Uber and Wix, you're looking at two distinct engineering cultures with different technical assessment philosophies. Uber, with its massive scale and complex logistics systems, tests for algorithmic rigor and system design at FAANG-level intensity. Wix, while still demanding strong fundamentals, focuses more on practical web development patterns and data structure fluency at a slightly more approachable volume. The key insight: preparing for Uber will cover most of Wix's technical requirements, but not vice versa. Let's break down exactly what that means for your study plan.

## Question Volume and Difficulty

The numbers tell a clear story about interview intensity. According to LeetCode's company-tagged questions, Uber has **381 questions** (54 Easy, 224 Medium, 103 Hard), while Wix has **56 questions** (16 Easy, 31 Medium, 9 Hard).

**Uber's volume** (nearly 7x Wix's) suggests two things. First, they've conducted significantly more interviews over time, giving you a larger pool of potential questions to study. Second, the high proportion of Medium and Hard problems (86% combined) indicates they consistently push candidates beyond basic algorithmic knowledge. You're expected to handle optimization challenges and edge cases under pressure.

**Wix's smaller pool** doesn't mean easier interviews—it means more focused preparation. With 56 questions, you can realistically review every tagged problem, but you should expect variations on these themes. The difficulty distribution (84% Medium or Hard) shows they still test substantial algorithmic competence, just with less breadth than Uber.

The implication: For Uber, you need broad pattern recognition across hundreds of problems. For Wix, you need deep mastery of a few dozen core patterns.

## Topic Overlap

Both companies heavily test **Array, Hash Table, and String** manipulation. These form the absolute core of your preparation.

**Uber's unique emphasis** includes **Dynamic Programming** (appearing in their top 4 topics), which reflects their optimization-heavy domains like routing, pricing, and resource allocation. You'll also see more **Graph** problems (though not in the top 4) related to their mapping and network systems.

**Wix's distinctive topic** is **Depth-First Search**, which appears in their top 4. This aligns with web development scenarios involving tree traversal (DOM manipulation, component hierarchies, directory structures). While Uber certainly uses DFS, it's not among their most frequently tested topics.

The overlap means studying arrays, hash maps, and strings gives you maximum return on investment for both companies.

## Preparation Priority Matrix

Here's how to allocate your study time strategically:

**High Priority (Overlap Topics - Study First)**

- **Arrays & Strings**: Sliding window, two pointers, prefix sums
- **Hash Tables**: Frequency counting, complement finding, caching
- **Recommended Problems**: Two Sum (#1), Longest Substring Without Repeating Characters (#3), Group Anagrams (#49)

**Medium Priority (Uber-Specific)**

- **Dynamic Programming**: Start with 1D DP (climbing stairs, coin change), then 2D (edit distance, knapsack)
- **Graph Algorithms**: BFS/DFS, Dijkstra's for weighted paths
- **Recommended Problems**: Word Break (#139), Number of Islands (#200)

**Lower Priority (Wix-Specific)**

- **Tree/DFS Patterns**: Path sum, subtree validation, serialization
- **Recommended Problems**: Validate Binary Search Tree (#98), Binary Tree Right Side View (#199)

## Interview Format Differences

**Uber** typically follows the FAANG model: 1-2 phone screens (45-60 minutes each) focusing on coding, followed by a 4-5 hour on-site with 3-4 rounds. These include:

- 2-3 coding rounds (medium-hard problems, often with follow-up optimization)
- 1 system design round (scaling a real-world system like UberEats or driver dispatch)
- 1 behavioral/experience round (leadership principles, conflict resolution)

**Wix** often has a leaner process: 1 technical phone screen (60 minutes), then 3-4 hour final round with:

- 2 coding rounds (medium difficulty, sometimes practical web-adjacent problems)
- 1 system design round (less about massive scale, more about API design and component architecture)
- Possible "pair programming" round building a small feature

Time pressure is similar (45 minutes per coding problem), but Uber's problems tend to have more complex follow-ups.

## Specific Problem Recommendations

These 5 problems provide exceptional coverage for both companies:

1. **LRU Cache (#146)** - Combines hash table and linked list, tests design thinking. Uber uses it for caching ride data; Wix for browser caching simulations.

<div class="code-group">

```python
class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        self.head = Node(0, 0)  # dummy head
        self.tail = Node(0, 0)  # dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]

    def _add(self, node):
        prev = self.tail.prev
        prev.next = node
        node.prev = prev
        node.next = self.tail
        self.tail.prev = node

    def _remove(self, node):
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

# Time: O(1) for get/put | Space: O(capacity)
```

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// Time: O(1) average for get/put | Space: O(capacity)
```

```java
class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private Map<Integer, Node> cache;
    private Node head, tail;
    private int capacity;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        cache = new HashMap<>();
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!cache.containsKey(key)) return -1;
        Node node = cache.get(key);
        remove(node);
        add(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            remove(cache.get(key));
        }
        Node node = new Node(key, value);
        add(node);
        cache.put(key, node);
        if (cache.size() > capacity) {
            Node lru = head.next;
            remove(lru);
            cache.remove(lru.key);
        }
    }

    private void add(Node node) {
        Node prev = tail.prev;
        prev.next = node;
        node.prev = prev;
        node.next = tail;
        tail.prev = node;
    }

    private void remove(Node node) {
        Node prev = node.prev, next = node.next;
        prev.next = next;
        next.prev = prev;
    }
}

// Time: O(1) for get/put | Space: O(capacity)
```

</div>

2. **Merge Intervals (#56)** - Tests array sorting and edge case handling. Uber uses it for time-based scheduling; Wix for calendar or booking features.

3. **Word Break (#139)** - Dynamic programming classic. Tests both memoization and tabulation approaches. Frequently appears at Uber.

4. **Validate Binary Search Tree (#98)** - DFS/recursion with bounds checking. Common at Wix for tree structure validation.

5. **Design Underground System (#1396)** - System design meets data structures. Tests real-time data aggregation—relevant to both companies' domains.

## Which to Prepare for First

**Prepare for Uber first, then adapt for Wix.** Here's why:

1. **Coverage**: Uber's broader topic range (including DP and advanced graphs) will force you to build comprehensive skills. Wix's focus areas are largely subsets of Uber's requirements.

2. **Difficulty**: If you can solve Uber's Medium-Hard problems, Wix's Medium problems will feel more manageable. The reverse isn't true.

3. **Efficiency**: Study Uber's 381 questions using pattern-based approaches (don't memorize individual solutions). Then, review Wix's 56 questions specifically in your final week before their interview.

**Timeline suggestion**: If interviewing at both within a month, spend 70% of time on Uber patterns, 20% on Wix-specific problems, and 10% on behavioral preparation (more important for Uber's leadership principles).

Remember: Both companies value clean, communicative code. Practice explaining your thought process aloud—this matters as much as the solution itself at Wix, and is absolutely critical at Uber.

For more detailed breakdowns, see our [Uber interview guide](/company/uber) and [Wix interview guide](/company/wix).
