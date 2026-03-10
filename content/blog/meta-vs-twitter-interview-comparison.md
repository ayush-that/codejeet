---
title: "Meta vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at Meta and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2029-04-23"
category: "tips"
tags: ["meta", "twitter", "comparison"]
---

If you're preparing for interviews at both Meta and Twitter (or X, as it's now officially known), you're facing two distinct beasts. One is a massive, established tech giant with a highly standardized and predictable interview process. The other is a leaner, more design-focused company where the process can feel more fluid. The key insight is this: preparing for Meta will give you a strong, broad foundation that covers about 90% of what Twitter might ask, but you'll need to layer on specific, high-impact topics to be fully prepared for Twitter's unique flavor. Let's break down the data and strategy.

## Question Volume and Difficulty: A Tale of Two Scales

The raw numbers tell a clear story. Meta's LeetCode company tag boasts **1,387 questions**, dwarfing Twitter's **53**. This isn't just about size; it's about process maturity.

- **Meta (E414/M762/H211):** The distribution is classic Big Tech: a solid base of Easy questions for screening, a massive middle of Medium problems that form the core of the on-site, and a smaller but significant set of Hard problems for specialized roles or particularly challenging rounds. The sheer volume means their question bank is deep, and while patterns repeat, you're unlikely to get the _exact_ problem you practiced. Your preparation must be about mastering patterns, not memorizing solutions.
- **Twitter (E8/M33/H12):** The smaller pool is revealing. It suggests a less rigidly codified process. The heavy skew toward Medium difficulty (33 out of 53) means that's where you'll live during their interviews. The limited number doesn't mean it's easier; it means the problems they _do_ ask are highly curated and often test multiple concepts at once or have a clever twist. You're more likely to encounter a problem directly from this list or a close variant.

**Implication:** Meta prep is a marathon of pattern recognition. Twitter prep is about depth on their favorite themes and excelling at the medium-difficulty, multi-concept problem.

## Topic Overlap: The Common Core

Both companies heavily test the fundamental data structures. According to their LeetCode tags, the top topics are nearly identical:

- **High Overlap:** **Array, String, Hash Table.** These are the absolute non-negotiables. If you can't manipulate these in your sleep, you won't pass either interview. Problems involving two pointers, sliding windows, and prefix sums on arrays/strings are currency at both companies.
- **Shared Secondary Topics:** Math, Tree, Binary Search, Dynamic Programming, Sorting. These are important, but their weighting might differ.
- **The Telling Difference:** Look at the 4th topic for each. For Meta, it's **Math**. For Twitter, it's **Design**. This is the first major divergence. Meta's "Math" often translates to number manipulation, bitwise operations, or geometry in a purely algorithmic context. Twitter's "Design" tag hints at something broader: they frequently ask problems that blend data structures with real-world system concepts, like designing a data structure under specific API constraints (e.g., Twitter's own "Design Twitter" problem, #355).

## Preparation Priority Matrix

Use this to allocate your study time strategically.

1.  **Max ROI (Study First):** **Array, String, Hash Table.** Master all core patterns: two-sum variants, sliding window, fast & slow pointers, interval merging, anagram grouping. These are guaranteed to appear.
    - **Recommended Problems for Both:** `Two Sum (#1)`, `Merge Intervals (#56)`, `Group Anagrams (#49)`, `Longest Substring Without Repeating Characters (#3)`.

2.  **Meta-Specific Priority:** **Graphs (BFS/DFS), Recursion/Backtracking.** Meta loves problems involving social networks (surprise!), which are graphs. Tree and graph traversal (especially on matrices) are staples. Practice recursive decomposition.
    - **Meta-Focused Problems:** `Clone Graph (#133)`, `Number of Islands (#200)`, `Binary Tree Right Side View (#199)`.

3.  **Twitter-Specific Priority:** **Design (Data Structure Design), and String/Array problems with a "practical" twist.** Don't just practice standard algorithms; practice designing classes that implement specific APIs efficiently. Think `LRU Cache (#146)` or `Insert Delete GetRandom O(1) (#380)`.
    - **Twitter-Focused Problems:** `Design Twitter (#355)`, `LRU Cache (#146)`, `Find Duplicate File in System (#609)` – the last one is a perfect example of a "practical" hash map problem.

## Interview Format Differences

- **Meta:** Highly structured. Typically two 45-minute coding rounds (often back-to-back) in a virtual on-site, plus a system design and a behavioral ("Meta Leadership Principles") round. You'll usually get 2 questions per coding session: a warm-up and a main challenge. You code in a shared editor (CoderPad) and are expected to drive, discuss trade-offs, and write runnable code. The behavioral round carries significant weight.
- **Twitter:** Format can be more variable. The process may feel leaner and faster. Coding rounds might be 60 minutes with one substantial problem or two medium ones. The discussion may lean more heavily into the "why" of your design choices and scalability from the start, even in a coding round, reflecting their "Design" focus. System design is certainly present for relevant levels, but the line between a "coding" problem and a "light system design" problem can be blurrier.

## Specific Problem Recommendations for Dual Preparation

Here are 3 problems that offer exceptional bang-for-your-buck if you're targeting both companies.

1.  **`LRU Cache (#146)`:** This is the quintessential dual-purpose problem. It's a **hard** rating but a **must-know**. For Meta, it tests your ability to combine a hash map (O(1) access) with a linked list (O(1) order maintenance). For Twitter, it's a classic "Design a data structure" problem. Mastering this teaches you about designing for specific API constraints and time complexities.

<div class="code-group">

```python
class ListNode:
    def __init__(self, key=0, val=0, prev=None, next=None):
        self.key = key
        self.val = val
        self.prev = prev
        self.next = next

class LRUCache:
    # Time: O(1) for get/put | Space: O(capacity)
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> node
        # Dummy head & tail for easier edge case handling
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        # Remove node from its current position
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

    def _insert(self, node):
        # Insert node right after head (most recent)
        node.prev = self.head
        node.next = self.head.next
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
            # Remove LRU node (before tail)
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
```

```javascript
class ListNode {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  // Time: O(1) for get/put | Space: O(capacity)
  constructor(capacity) {
    this.cap = capacity;
    this.cache = new Map(); // key -> node
    this.head = new ListNode();
    this.tail = new ListNode();
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
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this._remove(node);
    this._insert(node);
    return node.val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this._remove(this.cache.get(key));
    }
    const node = new ListNode(key, value);
    this.cache.set(key, node);
    this._insert(node);

    if (this.cache.size > this.cap) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.cache.delete(lru.key);
    }
  }
}
```

```java
class LRUCache {
    // Time: O(1) for get/put | Space: O(capacity)
    class DLinkedNode {
        int key, value;
        DLinkedNode prev, next;
    }

    private void addNode(DLinkedNode node) {
        // Always add right after head
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

2.  **`Merge Intervals (#56)`:** A perfect **Medium** problem that tests sorting, array manipulation, and greedy thinking. The pattern is ubiquitous: dealing with overlapping ranges, scheduling, or consolidation. It's fundamental for Meta and appears in Twitter's list in various forms (e.g., `Insert Interval (#57)`).

3.  **`Design Twitter (#355)`:** While this is literally a Twitter problem, it's brilliant for Meta prep too. It forces you to think about system design trade-offs (how do you get a news feed?) while implementing a concrete data structure (graph of followers + merge k sorted lists). It bridges the gap between a coding round and a system design discussion.

## Which to Prepare for First?

**Prepare for Meta first.** Here’s the strategic reasoning:

1.  **Foundation First:** Meta's broad, deep curriculum in core algorithms (Arrays, Strings, Graphs, Trees) will build the rigorous muscle memory you need. It's easier to then specialize for Twitter's design focus than the other way around.
2.  **Pattern Coverage:** The patterns you master for Meta's 1,387 questions will make Twitter's 53-question list feel like a targeted review. You'll look at a Twitter "Design" problem and recognize the underlying data structure patterns.
3.  **Schedule Your Study:** If your interviews are close together, spend 70% of your coding prep on the Meta core. In the final 30% of your time, shift focus: drill every problem under Twitter's LeetCode tag and deeply practice the "Design Data Structure" problem type.

By following this approach, you turn the daunting task of dual-company prep into a logical, layered strategy. You build an unshakable core for Meta, then apply a precise, high-yield overlay for Twitter.

For more detailed company-specific guides, check out our pages for [Meta](/company/meta) and [Twitter](/company/twitter).
