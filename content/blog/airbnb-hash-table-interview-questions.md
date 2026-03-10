---
title: "Hash Table Questions at Airbnb: What to Expect"
description: "Prepare for Hash Table interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2028-12-20"
category: "dsa-patterns"
tags: ["airbnb", "hash-table", "interview prep"]
---

If you're preparing for an Airbnb interview, you've likely seen the statistic: **15 out of their 64 most-frequent LeetCode questions involve Hash Tables**. That's nearly 25%. This isn't a coincidence. While many companies love hash tables for their O(1) average-time lookups, Airbnb's product domain—connecting guests, hosts, listings, calendars, and payments—is fundamentally built on mapping relationships. Think of it: a user ID maps to a profile, a listing ID maps to a calendar of availability, a reservation code maps to a transaction. The core data operation is often "find this key and get its associated data," which is the literal definition of a hash table.

In real interviews, you can expect at least one, and very often two, problems where a hash table is either the primary data structure or a critical optimization. It's not just a "nice to know" topic; it's a core focus area. Mastering hash tables is non-negotiable for passing the technical screen.

## Specific Patterns Airbnb Favors

Airbnb's hash table questions rarely test the data structure in isolation. They are almost always a component in solving a more complex problem, typically falling into three overlapping categories:

1.  **Frequency Counting for String/Array Manipulation:** This is the most common entry point. Problems often involve checking anagrams, palindromes, or character uniqueness. The hash table (or dictionary) tracks counts of characters or tokens.
    - **Example:** LeetCode #49 "Group Anagrams" is a classic. You use the sorted string or a character count tuple as a key to group words.
    - **Example:** LeetCode #3 "Longest Substring Without Repeating Characters" uses a hash map to track the last seen index of each character, enabling an O(n) sliding window solution.

2.  **Two-Number/Two-Sum Variants with a Twist:** The classic Two Sum (LeetCode #1) is table stakes. Airbnb prefers problems that layer additional constraints or require you to combine the pattern with another concept.
    - **Example:** Problems where you need to find pairs satisfying a condition based on values or indices. The hash table stores previously seen values (or computed results like `target - current`) for instant lookup.

3.  **Caching for Optimization (Memoization & LRU):** This is where Airbnb problems get interesting. They love questions where a hash table acts as a cache to avoid redundant computation (memoization in recursion) or to manage limited space according to a policy (LRU Cache).
    - **Example:** LeetCode #146 "LRU Cache" is a **perennial favorite at Airbnb**. It requires combining a hash map (for O(1) access by key) with a doubly linked list (for O(1) order maintenance). If you interview at Airbnb, you must know this problem cold.

The unifying theme is **practical utility**. The problems feel less like abstract algorithm puzzles and more like simplified versions of real-world systems they build: rate limiters (counting), duplicate detection (frequency maps), and fast-access caches for user data.

## How to Prepare

Don't just memorize solutions. Internalize the pattern of recognizing when a hash table is the right tool. The trigger is usually one of these needs: **"I need to remember something I saw before"** or **"I need to count how many times I've seen this."**

Let's look at the core pattern for the **Frequency Counting** type, using a variation of the anagram theme.

<div class="code-group">

```python
# Problem: Given a string `s` and a non-empty word `p`, find all start indices
# of `p`'s anagrams in `s`. (LeetCode #438 "Find All Anagrams in a String")
# Time: O(n) where n = len(s) | Space: O(1) because the counter size is fixed (alphabet)
def findAnagrams(s: str, p: str) -> List[int]:
    if len(s) < len(p):
        return []

    result = []
    # Hash table to store frequency of characters in `p` and the current window
    p_count = [0] * 26
    s_window_count = [0] * 26

    # Build initial frequency map for `p` and the first window in `s`
    for i in range(len(p)):
        p_count[ord(p[i]) - ord('a')] += 1
        s_window_count[ord(s[i]) - ord('a')] += 1

    # Compare the first window
    if p_count == s_window_count:
        result.append(0)

    # Slide the window across `s`
    for i in range(len(p), len(s)):
        # Remove the character leaving the window
        left_char_idx = ord(s[i - len(p)]) - ord('a')
        s_window_count[left_char_idx] -= 1

        # Add the new character entering the window
        right_char_idx = ord(s[i]) - ord('a')
        s_window_count[right_char_idx] += 1

        # Compare the updated window to the target `p` frequency map
        if p_count == s_window_count:
            result.append(i - len(p) + 1)

    return result
```

```javascript
// Time: O(n) | Space: O(1) - fixed size maps for 26 letters
function findAnagrams(s, p) {
  const result = [];
  if (s.length < p.length) return result;

  const pCount = new Array(26).fill(0);
  const sWindowCount = new Array(26).fill(0);

  // Initialize frequency maps
  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - 97]++; // 'a' char code is 97
    sWindowCount[s.charCodeAt(i) - 97]++;
  }

  // Helper to compare two frequency arrays
  const arraysEqual = (a, b) => {
    for (let i = 0; i < 26; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Check first window
  if (arraysEqual(pCount, sWindowCount)) {
    result.push(0);
  }

  // Slide the window
  for (let i = p.length; i < s.length; i++) {
    // Remove leftmost char of previous window
    const leftCharIdx = s.charCodeAt(i - p.length) - 97;
    sWindowCount[leftCharIdx]--;

    // Add new char to current window
    const rightCharIdx = s.charCodeAt(i) - 97;
    sWindowCount[rightCharIdx]++;

    // Check current window
    if (arraysEqual(pCount, sWindowCount)) {
      result.push(i - p.length + 1);
    }
  }
  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;

    int[] pCount = new int[26];
    int[] sWindowCount = new int[26];

    // Build initial frequency maps
    for (int i = 0; i < p.length(); i++) {
        pCount[p.charAt(i) - 'a']++;
        sWindowCount[s.charAt(i) - 'a']++;
    }

    // Compare first window
    if (Arrays.equals(pCount, sWindowCount)) {
        result.add(0);
    }

    // Slide the window
    for (int i = p.length(); i < s.length(); i++) {
        // Remove character leaving the window
        sWindowCount[s.charAt(i - p.length()) - 'a']--;
        // Add new character entering the window
        sWindowCount[s.charAt(i) - 'a']++;

        // Compare
        if (Arrays.equals(pCount, sWindowCount)) {
            result.add(i - p.length() + 1);
        }
    }
    return result;
}
```

</div>

For the **Caching** pattern, the LRU Cache implementation is the quintessential example. Here's the skeleton of the approach:

<div class="code-group">

```python
# LeetCode #146 "LRU Cache" Pattern
class ListNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # Hash Table: key -> Node
        # Dummy head and tail for the doubly linked list
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        # Remove node from its current position
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_front(self, node):
        # Add node right after dummy head (most recent)
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        # Move accessed node to front (most recently used)
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._remove(node)
            self._add_to_front(node)
        else:
            if len(self.cache) >= self.cap:
                # Remove LRU node (before dummy tail)
                lru_node = self.tail.prev
                self._remove(lru_node)
                del self.cache[lru_node.key]
            new_node = ListNode(key, value)
            self.cache[key] = new_node
            self._add_to_front(new_node)
```

```javascript
// LRU Cache Pattern in JavaScript
class ListNode {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.cache = new Map(); // Hash Table
    this.head = new ListNode();
    this.tail = new ListNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    const prevNode = node.prev;
    const nextNode = node.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  _addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this._remove(node);
    this._addToFront(node);
    return node.val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.val = value;
      this._remove(node);
      this._addToFront(node);
    } else {
      if (this.cache.size >= this.cap) {
        const lruNode = this.tail.prev;
        this._remove(lruNode);
        this.cache.delete(lruNode.key);
      }
      const newNode = new ListNode(key, value);
      this.cache.set(key, newNode);
      this._addToFront(newNode);
    }
  }
}
```

```java
// LRU Cache Pattern in Java
public class LRUCache {
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;
    }

    private void addNode(DLinkedNode node) {
        // Always add the new node right after head.
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
    private int size;
    private int capacity;
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
            newNode.key = key;
            newNode.value = value;
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

## How Airbnb Tests Hash Table vs Other Companies

Compared to other major companies, Airbnb's hash table questions have a distinct flavor:

- **vs. Google:** Google often tests hash tables in complex system design or with heavy algorithmic twists (e.g., designing a consistent hashing system). Airbnb's problems are more applied and often map directly to a product feature.
- **vs. Meta:** Meta loves to combine hash tables with recursion and tree/graph traversal (e.g., cloning a graph). Airbnb uses hash tables more for linear data structure optimization and system simulation (like a cache).
- **vs. Amazon:** Amazon's hash table problems frequently involve string manipulation for features like search. Airbnb's problems feel more like backend service logic—managing state, sessions, or reservations.

The unique aspect is the **"design-y" feel**. Even in a coding interview, the problem might be framed as, "How would you build a simple version of a feature that tracks X?" The optimal solution invariably uses a hash table for efficient state management.

## Study Order

Tackle hash table concepts in this logical progression:

1.  **Fundamental Operations & Two-Sum:** Master the basic `put`, `get`, and `contains` operations. Solve Two Sum and its immediate variants. This builds muscle memory for the "complement lookup" pattern.
2.  **Frequency Counting:** Learn to use hash tables to count characters, numbers, or tokens. Practice problems on anagrams and palindromes. This teaches you to use the hash table as a summary data structure.
3.  **Sliding Window with Hash Maps:** This is a critical upgrade. Learn to maintain a hash map _within a moving window_ to solve problems like finding substrings with specific character counts. This combines hash tables with the two-pointer technique.
4.  **Design Key Strategies:** Many problems aren't about using a key directly, but designing one (e.g., using a sorted string or a tuple of counts as a key to group objects). This is a higher-level skill.
5.  **Caching & Advanced Designs:** Finally, tackle the complex designs like LRU Cache. This requires synthesizing hash tables with another data structure (a linked list) and is the peak of hash table application interviews.

## Recommended Practice Order

Solve these problems in sequence to build up the patterns:

1.  **Two Sum (LeetCode #1)** - The absolute foundation.
2.  **Valid Anagram (LeetCode #242)** - Basic frequency counting.
3.  **Group Anagrams (LeetCode #49)** - Frequency counting + designing a key.
4.  **Longest Substring Without Repeating Characters (LeetCode #3)** - Hash map + sliding window.
5.  **Find All Anagrams in a String (LeetCode #438)** - Hash map + fixed-size sliding window (see code example above).
6.  **LRU Cache (LeetCode #146)** - The classic design synthesis problem. **Airbnb Favorite.**

After this core sequence, explore problems like **Insert Delete GetRandom O(1) (LeetCode #380)**, which combines a hash table with a dynamic array, another powerful pattern.

The goal is to stop thinking "this is a hash table problem" and start thinking "I need fast access to prior state—a hash table will enable that." That's the mindset that will get you through an Airbnb interview.

[Practice Hash Table at Airbnb](/company/airbnb/hash-table)
