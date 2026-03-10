---
title: "Goldman Sachs vs Coupang: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Coupang — difficulty levels, topic focus, and preparation strategy."
date: "2030-12-12"
category: "tips"
tags: ["goldman-sachs", "coupang", "comparison"]
---

If you're preparing for interviews at both Goldman Sachs and Coupang, you're looking at two distinct beasts from different worlds of tech. Goldman Sachs represents the high-stakes, algorithmically intense world of quantitative finance tech, while Coupang, South Korea's "Amazon," embodies the fast-paced, large-scale engineering challenges of e-commerce. The good news? There's significant overlap in their fundamental technical screening, which means you can prepare strategically. The key is understanding where their interview philosophies converge and diverge, so you can allocate your limited prep time for maximum return.

## Question Volume and Difficulty

The raw numbers tell a stark story about interview intensity and scope.

**Goldman Sachs (270 questions: 51 Easy, 171 Medium, 48 Hard)**
This is a massive, well-documented question bank. The high volume, especially the dominance of Medium difficulty (63% of questions), indicates a few things. First, their process is highly standardized; you're likely to encounter a known problem or a close variant. Second, they value breadth and the ability to reliably solve common algorithmic patterns under pressure. The presence of nearly 50 Hard problems signals that for certain roles (quantitative strategist, core engineering), they will test for optimal, often non-intuitive solutions. Preparing for Goldman is a marathon of pattern recognition.

**Coupang (53 questions: 3 Easy, 36 Medium, 14 Hard)**
With about one-fifth the public question volume, Coupang's process appears more curated. The distribution is even more skewed toward Medium (68%) and Hard (26%) problems, with almost no Easy ones. This suggests their interviews are designed to be challenging from the outset. They aren't testing if you can code; they're testing if you can solve complex, scaled problems efficiently. The smaller pool might mean questions are recycled less frequently or that they place a higher premium on deriving a solution rather than regurgitating a memorized pattern.

**Implication:** Preparing for Goldman Sachs will give you wide coverage that likely encompasses Coupang's scope. Preparing _only_ for Coupang's list might leave gaps for Goldman's broader array of problems.

## Topic Overlap

The core technical interview for software engineers is remarkably consistent. Both companies heavily test:

- **Array & String Manipulation:** The bedrock of most coding questions.
- **Hash Table:** The go-to data structure for O(1) lookups, essential for optimization.
- **Dynamic Programming:** A critical topic for assessing problem decomposition and optimization skills.

This triad forms the absolute core of shared prep. If you master these, you're 70% ready for the coding portion of both. The overlap ends there in terms of _primary_ focus. Goldman's list extends more deeply into **Graphs, Trees, and Sorting**, reflecting problems around financial modeling, network analysis, and data processing. Coupang's focus, while also including trees/graphs, leans more heavily toward problems that imply **system design concepts**—like designing data structures (LRU Cache) or solving efficiency problems at scale.

## Preparation Priority Matrix

Use this to triage your study time.

1.  **Maximum ROI (Study First):** Array, String, Hash Table, Dynamic Programming.
    - **Specific Problems:** "Two Sum" (#1) is a hash table classic. "Longest Palindromic Substring" (#5) combines string manipulation and DP. "Merge Intervals" (#56) is a quintessential array/sorting pattern.

2.  **Goldman Sachs Unique/Emphasis:** Depth-First Search, Breadth-First Search, Sorting, Greedy Algorithms, Graph Theory.
    - **Focus:** Be ready to traverse and manipulate tree and graph structures. Understand trade-offs between sorting algorithms.

3.  **Coupang Unique/Emphasis:** Design-oriented data structures (LRU Cache, LFU Cache), advanced tree problems (serialization, hard traversals), and complex DP.
    - **Focus:** Think "scalability" and "efficient data access." Problems often have a "how would this work in a real system?" undertone.

## Interview Format Differences

**Goldman Sachs** typically follows a multi-round process: one or two initial phone screens (often with HackerRank) focusing on pure algorithms, followed by a "Superday" on-site (or virtual). The on-site may include 2-4 back-to-back technical interviews, each 45-60 minutes, usually with one medium-to-hard coding problem per session. There is often a separate, significant quantitative/financial math round for certain roles. Behavioral questions ("fit") are usually segregated into a specific round with a hiring manager.

**Coupang's** process is generally leaner and may move faster, reflecting its tech startup roots (despite its size). After an initial recruiter call, you can expect one or two technical phone screens, potentially involving a shared coding editor. The virtual on-site usually consists of 3-4 rounds: 2-3 coding/algorithm sessions and 1 system design round. **This is crucial:** Coupang, as a large-scale e-commerce platform, places a high premium on system design even for mid-level engineers. The coding problems are often directly or indirectly related to scalability challenges.

## Specific Problem Recommendations for Both

Here are 5 problems that offer high strategic value for tackling both interview loops.

1.  **LRU Cache (#146):** A perfect blend of algorithm (hash map + doubly linked list) and practical system design. It's a classic at both companies, testing your ability to design an efficient data structure.
2.  **Word Break (#139):** A foundational Dynamic Programming problem that teaches the "segmentable substring" pattern. It's a common medium-difficulty question that tests if you can move beyond recursion to efficient DP.
3.  **Merge k Sorted Lists (#23):** This problem tests your understanding of sorting, heap (priority queue) data structures, and divide-and-conquer. It's scalable by nature—merging two lists is easy, merging _k_ requires optimal design.
4.  **Course Schedule (#207):** A canonical graph problem (topological sort) that models dependencies. Highly relevant to Goldman's quantitative modeling and Coupang's workflow/dependency management systems.
5.  **Longest Increasing Subsequence (#300):** A DP classic with a known O(n log n) optimization. It appears in both lists and tests deep understanding of sequence analysis and algorithm optimization.

<div class="code-group">

```python
# Example: LRU Cache Implementation (Python)
class ListNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    # Time: O(1) for get and put | Space: O(capacity)
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> node
        # Dummy head and tail for O(1) list ops
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        # Remove node from its current position
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _insert(self, node):
        # Insert node right after head (most recent)
        node.prev, node.next = self.head, self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)  # Mark as recently used
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = ListNode(key, value)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            # Remove LRU (node before tail)
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
```

```javascript
// Example: LRU Cache Implementation (JavaScript)
class ListNode {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  // Time: O(1) for get and put | Space: O(capacity)
  constructor(capacity) {
    this.cap = capacity;
    this.cache = new Map(); // key -> node
    this.head = new ListNode(0, 0);
    this.tail = new ListNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    const prev = node.prev;
    const nxt = node.next;
    prev.next = nxt;
    nxt.prev = prev;
  }

  _insert(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this._remove(node);
      this._insert(node); // Mark as recently used
      return node.val;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this._remove(this.cache.get(key));
    }
    const node = new ListNode(key, value);
    this.cache.set(key, node);
    this._insert(node);
    if (this.cache.size > this.cap) {
      // Remove LRU (node before tail)
      const lru = this.tail.prev;
      this._remove(lru);
      this.cache.delete(lru.key);
    }
  }
}
```

```java
// Example: LRU Cache Implementation (Java)
import java.util.*;

class LRUCache {
    // Time: O(1) for get and put | Space: O(capacity)
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;
    }

    private void addNode(DLinkedNode node) {
        // Always add new node right after head.
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(DLinkedNode node) {
        DLinkedNode prev = node.prev;
        DLinkedNode next = node.next;
        prev.next = next;
        next.prev = prev;
    }

    private void moveToHead(DLinkedNode node) {
        removeNode(node);
        addNode(node);
    }

    private DLinkedNode popTail() {
        DLinkedNode res = tail.prev;
        removeNode(res);
        return res;
    }

    private Map<Integer, DLinkedNode> cache = new HashMap<>();
    private int capacity;
    private DLinkedNode head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        DLinkedNode node = cache.get(key);
        if (node == null) return -1;
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        DLinkedNode node = cache.get(key);
        if (node == null) {
            DLinkedNode newNode = new DLinkedNode();
            newNode.key = key;
            newNode.value = value;
            cache.put(key, newNode);
            addNode(newNode);
            if (cache.size() > capacity) {
                DLinkedNode tail = popTail();
                cache.remove(tail.key);
            }
        } else {
            node.value = value;
            moveToHead(node);
        }
    }
}
```

</div>

## Which to Prepare for First

**Prepare for Goldman Sachs first.** Here’s the strategic reasoning: their question bank is broader and covers almost all the algorithmic ground Coupang tests. By grinding through a curated list of Goldman’s top 100-150 problems (with heavy emphasis on Array, String, Hash Table, DP, Trees, and Graphs), you will build the comprehensive algorithmic muscle memory needed for both.

Once that foundation is solid, **pivot to Coupang-specific preparation.** This involves two key shifts:

1.  **Deep dive on the "Coupang Hard" problems** from their list, as these represent their highest bar.
2.  **Allocate substantial time to System Design.** This is non-negotiable for Coupang. Practice designing scalable versions of the systems implied by their coding problems (e.g., a real distributed cache, an order fulfillment workflow).

In essence, use Goldman's breadth to build your core algorithmic competency, then use Coupang's depth and design focus to sharpen and specialize. This approach ensures you walk into either interview with confidence.

For more detailed company-specific question lists and guides, check out our pages for [Goldman Sachs](/company/goldman-sachs) and [Coupang](/company/coupang).
