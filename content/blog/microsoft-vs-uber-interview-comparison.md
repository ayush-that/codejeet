---
title: "Microsoft vs Uber: Interview Question Comparison"
description: "Compare coding interview questions at Microsoft and Uber — difficulty levels, topic focus, and preparation strategy."
date: "2029-05-01"
category: "tips"
tags: ["microsoft", "uber", "comparison"]
---

# Microsoft vs Uber: Interview Question Comparison

If you're interviewing at both Microsoft and Uber, you're facing two distinct engineering cultures with surprisingly similar technical demands. Microsoft's 1352 tagged questions versus Uber's 381 might suggest wildly different preparation strategies, but the reality is more nuanced. Both companies test core data structures and algorithms heavily, but their interview formats, problem selection, and evaluation criteria differ in ways that matter for your preparation. The key insight: you can prepare for both simultaneously with smart prioritization, but you'll need to adjust your approach for each company's interview style.

## Question Volume and Difficulty

Microsoft's 1352 tagged questions (379 Easy, 762 Medium, 211 Hard) represent one of the largest company-specific question banks on LeetCode. This doesn't mean Microsoft asks more obscure problems—it reflects their longer history of technical interviews and broader range of engineering roles. The Medium-heavy distribution (56% of questions) tells you Microsoft interviews are fundamentally about clean, correct implementations of standard patterns rather than algorithmic brilliance.

Uber's 381 questions (54 Easy, 224 Medium, 103 Hard) show a more concentrated focus. With 59% Medium and 27% Hard questions, Uber leans slightly more toward challenging problems. This aligns with their reputation for favoring candidates who can handle complex, real-world optimization scenarios. The smaller question bank means patterns repeat more frequently—if you master Uber's top 50 problems, you'll see significant overlap in actual interviews.

The implication: Microsoft preparation benefits from breadth across standard patterns, while Uber preparation rewards depth in specific problem types and optimization.

## Topic Overlap

Both companies test **Array, String, Hash Table, and Dynamic Programming** as their top four topics—this is your shared foundation. The overlap is substantial enough that 60-70% of your preparation will serve both companies.

**Microsoft's unique emphasis**: Tree/Graph problems (especially traversal variations), Matrix problems, and Design questions related to system components. Microsoft often asks problems that map to actual product scenarios (document editing, file systems, etc.).

**Uber's unique emphasis**: Graph algorithms (Dijkstra, BFS variations for ride-matching scenarios), Interval problems (scheduling trips), and String manipulation with real-world data formats. Uber problems frequently involve location, mapping, or scheduling constraints.

The shared topics form your preparation core. Master sliding window for arrays/strings, two-pointer techniques, hash map optimizations, and fundamental DP patterns (knapsack, LCS, etc.)—these appear constantly at both companies.

## Preparation Priority Matrix

**Phase 1: Shared Foundation (Highest ROI)**

- **Arrays**: Two Sum variations, sliding window, subarray problems
- **Strings**: Palindrome checks, anagram problems, string transformation
- **Hash Tables**: Frequency counting, complement finding, caching patterns
- **Dynamic Programming**: Fibonacci-style, 0/1 knapsack, LCS variations

**Phase 2: Microsoft-Specific Depth**

- **Trees**: Traversals (especially level-order), LCA problems, validation
- **Graphs**: BFS/DFS applications, topological sort
- **Matrix**: Island problems, search in sorted matrix, rotation

**Phase 3: Uber-Specific Depth**

- **Graphs**: Shortest path (Dijkstra/Bellman-Ford), BFS with weights
- **Intervals**: Merge, insert, schedule conflicts
- **Advanced Strings**: Regex-like matching, parsing coordinates

**Recommended shared problems** (study these first):

- Two Sum (#1) - foundational hash table usage
- Merge Intervals (#56) - appears at both companies frequently
- Longest Substring Without Repeating Characters (#3) - sliding window classic
- Valid Parentheses (#20) - stack fundamentals
- Best Time to Buy and Sell Stock (#121) - simple DP that teaches the pattern

## Interview Format Differences

**Microsoft** typically uses a 4-5 round onsite (or virtual equivalent) with:

- 2-3 coding rounds (45-60 minutes each, often 2 problems per round)
- 1 system design round (mid-level to senior roles)
- 1-2 behavioral/cultural fit rounds
- Emphasis on clean, maintainable code and edge case handling
- Interviewers often work from a question bank but can adapt based on your responses
- Whiteboarding is common even in virtual interviews

**Uber** interviews are known for being intense:

- 4-6 rounds including phone screens
- Coding rounds are problem-solving heavy (often 1 complex problem per 45-minute session)
- Strong emphasis on optimization and follow-up questions ("what if we have millions of requests?")
- System design is expected even for mid-level roles
- Behavioral questions are integrated throughout, often as "tell me about a time you optimized something"
- Virtual interviews use collaborative coding editors with syntax highlighting

The key distinction: Microsoft evaluates how well you engineer solutions, while Uber evaluates how well you optimize them under constraints.

## Specific Problem Recommendations for Both Companies

1. **LRU Cache (#146)** - Combines hash table and linked list, tests system design thinking. Microsoft asks it for caching scenarios, Uber for ride data management.

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
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this._remove(node);
      this._add(node);
      return node.value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this._remove(this.cache.get(key));
    }
    const node = new Node(key, value);
    this._add(node);
    this.cache.set(key, node);
    if (this.cache.size > this.capacity) {
      const lru = this.head.next;
      this._remove(lru);
      this.cache.delete(lru.key);
    }
  }

  _add(node) {
    const prev = this.tail.prev;
    prev.next = node;
    node.prev = prev;
    node.next = this.tail;
    this.tail.prev = node;
  }

  _remove(node) {
    const prev = node.prev;
    const nxt = node.next;
    prev.next = nxt;
    nxt.prev = prev;
  }
}

// Time: O(1) for get/put | Space: O(capacity)
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
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            remove(node);
            add(node);
            return node.value;
        }
        return -1;
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
        Node prev = node.prev;
        Node nxt = node.next;
        prev.next = nxt;
        nxt.prev = prev;
    }
}

// Time: O(1) for get/put | Space: O(capacity)
```

</div>

2. **Word Break (#139)** - Excellent DP problem that tests both memoization and optimization thinking. Microsoft asks it for text processing scenarios, Uber for parsing location data.

3. **Course Schedule (#207)** - Graph/topological sort problem. Microsoft uses it for dependency resolution, Uber for ride scheduling constraints.

4. **Merge k Sorted Lists (#23)** - Tests heap/priority queue usage. Important for both companies' distributed system scenarios.

5. **Find All Anagrams in a String (#438)** - Perfect sliding window problem with hash map optimization. Appears frequently at both companies.

## Which to Prepare for First

Start with **Microsoft's question bank** if you're interviewing at both companies. Here's why:

1. **Breadth-first learning**: Microsoft's larger question bank covers more patterns. Mastering these gives you a foundation that makes Uber-specific preparation faster.
2. **Clean code emphasis**: Microsoft's focus on maintainable solutions builds habits that serve you well at Uber too.
3. **Progressive difficulty**: Microsoft's question distribution (more Mediums, fewer Hards) allows gradual skill building.

Allocate 60% of your time to shared topics, 25% to Microsoft-specific topics, and 15% to Uber-specific topics. As your Microsoft interview approaches, shift to 40% shared, 40% Microsoft-specific, 20% Uber-specific. Then before Uber, rebalance to 30% shared, 20% Microsoft-specific, 50% Uber-specific.

Remember: The patterns matter more than memorizing specific problems. If you understand why the LRU Cache uses a hash map + doubly linked list, and can explain tradeoffs, you'll handle variations at both companies.

For more company-specific insights:

- [/company/microsoft](/company/microsoft)
- [/company/uber](/company/uber)
