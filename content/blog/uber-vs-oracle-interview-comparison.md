---
title: "Uber vs Oracle: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Oracle — difficulty levels, topic focus, and preparation strategy."
date: "2030-01-24"
category: "tips"
tags: ["uber", "oracle", "comparison"]
---

If you're interviewing at both Uber and Oracle, you're looking at two distinct beasts in the tech ecosystem: one a hyper-growth, product-driven mobility platform, and the other a mature, enterprise-focused software giant. While their LeetCode tags might look similar at a glance, the interview experience, problem selection, and underlying evaluation criteria differ meaningfully. Preparing for both simultaneously is possible, but a strategic, layered approach will save you time and mental energy. This comparison breaks down the data and the unwritten rules to help you build a preparation plan with maximum return on investment.

## Question Volume and Difficulty

The raw numbers tell the first part of the story. Uber's tagged question pool is slightly larger (381 vs 340), but the more telling difference is in the difficulty distribution.

**Uber (E54/M224/H103):** The distribution is heavily skewed toward Medium (59%) and Hard (27%) problems, with only 14% tagged as Easy. This signals an interview process that is algorithmically intense. You are very likely to encounter at least one Medium-Hard problem in your coding rounds, and the expectation is that you can navigate complex problem statements, edge cases, and optimal solutions under pressure.

**Oracle (E70/M205/H65):** Here, the Medium difficulty dominates even more strongly (60%), but the share of Hard problems is notably lower (19%), with Easies making up 21%. This suggests that while Oracle's technical bar is still high, the problems may be more focused on clean implementation of classic algorithms and data structures rather than the brain-bending, multi-step optimization challenges Uber sometimes favors. The higher Easy percentage often correlates with earlier phone screens or warmer-up questions.

**Implication:** Prepare for a steeper algorithmic climb at Uber. At Oracle, consistency and correctness across a broader range of standard problems might be weighted more heavily than pulling off a single tricky optimization.

## Topic Overlap

The core technical overlap is substantial, which is good news for your prep.

**Heavy Overlap (Study These First):**

- **Array & String:** The absolute fundamentals. Both companies test these incessantly. Expect manipulations, two-pointer techniques, sliding windows, and matrix traversal.
- **Hash Table:** The workhorse for O(1) lookups. Essential for problems involving counts, mappings, and duplicate detection.
- **Dynamic Programming:** A major focus for both. This is often the differentiator between a pass and a strong pass. You must be comfortable with 1D and 2D DP for classic problems (knapsack, LCS, edit distance) and pattern recognition for newer ones.

**Notable Divergence:**

- **Uber-Intensive Topics:** Uber has a significant number of problems tagged **Depth-First Search (DFS), Breadth-First Search (BFS), and Tree**. This reflects their domain: mapping, routing, and hierarchical data (e.g., trip structures, location hierarchies). **Graph** problems are also more prevalent. Expect questions that model real-world spatial or relational data.
- **Oracle-Intensive Topics:** Oracle shows a stronger relative emphasis on **Database** and **Sorting** topics, aligning with their enterprise database heritage. While you won't write SQL in a coding round, problems involving data merging, joining concepts, or efficient large-scale sorting are fair game. **Linked List** problems also appear more frequently.

## Preparation Priority Matrix

Use this to triage your study time effectively.

1.  **Maximum ROI (Study First):** Array, String, Hash Table, Dynamic Programming. Mastering these will give you a strong base for **both** companies.
2.  **Uber-Specific Priority:** Graph (DFS/BFS), Tree, Heap/Priority Queue. After the core four, dive into graph traversal, shortest path (Dijkstra's), and tree serialization/validation.
3.  **Oracle-Specific Priority:** Sorting, Linked List, and perhaps a review of fundamental database concepts (indexes, joins) for discussion points. Practice stable, in-place implementations.

**High-Value, Overlap Problems:**

- **Merge Intervals (#56):** Tests array sorting and merging logic. Ubiquitous.
- **Two Sum (#1):** The canonical hash table problem.
- **Longest Palindromic Substring (#5):** Excellent for testing DP and two-pointer approaches.
- **Word Break (#139):** A classic DP problem that frequently appears in variations.

## Interview Format Differences

This is where the cultures diverge significantly.

**Uber:**

- **Format:** Typically 4-6 rounds on-site/virtual, including 2-3 coding rounds, 1 system design, and 1-2 behavioral/experience deep dives.
- **Coding Rounds:** 45-60 minutes, often one complex problem or two medium problems. Interviewers look for **optimal solutions** and clean code. You are expected to discuss trade-offs and may be asked to improve time/space complexity. Questions often have a "real-world" feel (e.g., scheduling drivers, calculating fares).
- **Behavioral:** The "Uber Values" are taken seriously. Prepare STAR stories around customer obsession, celebrating differences, and being an owner.
- **System Design:** Expected for senior roles (SDE II+). Think scalable, real-time systems. A classic prompt might be "Design Uber Eats" or "Design a ride-matching service."

**Oracle:**

- **Format:** Process can be more variable, but often involves a technical phone screen followed by a virtual or on-site loop of 3-4 rounds.
- **Coding Rounds:** May be slightly more forgiving on pure algorithm optimization if your approach is sound and your code is robust. Emphasis on **correctness, clarity, and testability**. You might be asked to write more comprehensive unit tests.
- **Behavioral:** Focuses on teamwork, past project experience, and handling legacy systems or large codebases.
- **System Design:** For cloud/service roles (OCI - Oracle Cloud Infrastructure), expect heavy cloud architecture discussions. For more traditional product teams, design might focus on API design, data modeling, or scalability within enterprise constraints.

## Specific Problem Recommendations for Dual Prep

These problems efficiently cover patterns relevant to both companies.

1.  **LRU Cache (#146):** Combines Hash Table and Linked List (or Ordered Dict). Tests design of a data structure, a common theme. Crucial for both.
    <div class="code-group">

    ```python
    # Time: O(1) for get/put | Space: O(capacity)
    class LRUCache:
        def __init__(self, capacity: int):
            self.capacity = capacity
            self.cache = {}  # key -> Node
            self.head = Node(0, 0)  # dummy head
            self.tail = Node(0, 0)  # dummy tail
            self.head.next = self.tail
            self.tail.prev = self.head

        def _remove(self, node):
            # Remove node from its current position
            prev, nxt = node.prev, node.next
            prev.next, nxt.prev = nxt, prev

        def _add(self, node):
            # Add node right before tail (most recent)
            prev_tail = self.tail.prev
            prev_tail.next = node
            node.prev = prev_tail
            node.next = self.tail
            self.tail.prev = node

        def get(self, key: int) -> int:
            if key in self.cache:
                node = self.cache[key]
                self._remove(node)
                self._add(node)  # mark as recently used
                return node.val
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
    ```

    ```javascript
    // Time: O(1) for get/put | Space: O(capacity)
    class LRUCache {
      constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Map preserves insertion order in JS
      }

      get(key) {
        if (!this.cache.has(key)) return -1;
        const value = this.cache.get(key);
        this.cache.delete(key); // Remove and re-insert to mark as most recent
        this.cache.set(key, value);
        return value;
      }

      put(key, value) {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
          // Map.keys() returns an iterator, first key is least recently used
          const lruKey = this.cache.keys().next().value;
          this.cache.delete(lruKey);
        }
      }
    }
    ```

    ```java
    // Time: O(1) for get/put | Space: O(capacity)
    class LRUCache {
        class DLinkedNode {
            int key, value;
            DLinkedNode prev, next;
        }
        private void addNode(DLinkedNode node) { /* add after head */ }
        private void removeNode(DLinkedNode node) { /* remove from list */ }
        private void moveToHead(DLinkedNode node) { removeNode(node); addNode(node); }
        private DLinkedNode popTail() { /* remove node before tail */ }

        private Map<Integer, DLinkedNode> cache = new HashMap<>();
        private int size, capacity;
        private DLinkedNode head, tail;

        public LRUCache(int capacity) {
            this.size = 0;
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
                newNode.key = key; newNode.value = value;
                cache.put(key, newNode);
                addNode(newNode);
                ++size;
                if (size > capacity) {
                    DLinkedNode tail = popTail();
                    cache.remove(tail.key);
                    --size;
                }
            } else {
                node.value = value;
                moveToHead(node);
            }
        }
    }
    ```

    </div>

2.  **Course Schedule (#207):** A perfect Uber-relevant (graph DFS/BFS, topological sort) problem that also tests fundamental cycle detection. The pattern is widely applicable.
3.  **Maximum Subarray (#53):** A foundational DP problem (Kadane's Algorithm) that's short but tests understanding of optimal substructure. It's a classic for a reason.
4.  **Merge k Sorted Lists (#23):** Excellent for testing knowledge of Heap (Priority Queue) and Divide & Conquer. Relevant for Uber's distributed systems context and general algorithmic skill.
5.  **Valid Parentheses (#20):** A simple but essential Stack problem. It's a common warm-up or part of a larger string parsing question. Ensures you don't stumble on the basics.

## Which to Prepare for First

**Prepare for Uber first.** Here’s the strategic reasoning: Uber's problem set is generally more demanding, covering a wider algorithmic spectrum (especially graphs). If you build a study plan that conquers Uber's Medium-Hard problems across Array, String, Hash Table, DP, **and** Graphs/Trees, you will have over-prepared for the core algorithmic portion of Oracle's interview. You can then spend your final days before an Oracle interview reviewing Linked Lists, Sorting deep dives, and brushing up on system design discussions with an enterprise/cloud lens, which is a lighter lift than suddenly needing to learn graph traversal from scratch.

Think of it as building a pyramid. A broad, tall pyramid (Uber prep) easily covers the footprint of a slightly narrower one (Oracle prep). The reverse is not true.

For dedicated company question lists and more format details, visit our guides: [Uber Interview Guide](/company/uber) and [Oracle Interview Guide](/company/oracle).
