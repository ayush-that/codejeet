---
title: "How to Solve Map Sum Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Map Sum Pairs. Medium difficulty, 57.1% acceptance rate. Topics: Hash Table, String, Design, Trie."
date: "2026-11-07"
category: "dsa-patterns"
tags: ["map-sum-pairs", "hash-table", "string", "design", "medium"]
---

# How to Solve Map Sum Pairs

This problem asks us to design a data structure that stores key-value pairs where keys are strings, and supports two operations: inserting a key with a value, and retrieving the sum of values for all keys that start with a given prefix. What makes this interesting is that we need efficient prefix matching — a classic use case for tries, but hash-based approaches also work with trade-offs.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
mapSum = new MapSum()
mapSum.insert("apple", 3)
mapSum.insert("app", 2)
mapSum.insert("apricot", 5)
mapSum.insert("banana", 1)
```

Our structure now contains:

- "apple": 3
- "app": 2
- "apricot": 5
- "banana": 1

Now let's test some prefix sums:

1. `mapSum.sum("ap")` → We need all keys starting with "ap":
   - "apple" (3)
   - "app" (2)
   - "apricot" (5)
     Total = 3 + 2 + 5 = 10

2. `mapSum.insert("apple", 5)` → This updates "apple" from 3 to 5
   Now `mapSum.sum("ap")` should give us:
   - "apple" (5)
   - "app" (2)
   - "apricot" (5)
     Total = 5 + 2 + 5 = 12

3. `mapSum.sum("b")` → Keys starting with "b":
   - "banana" (1)
     Total = 1

The tricky part is handling updates efficiently. If we update "apple" from 3 to 5, we need to update the prefix sums for "a", "ap", "app", "appl", and "apple".

## Brute Force Approach

A naive solution would store all key-value pairs in a hash map. For the `sum(prefix)` operation, we would iterate through all keys in the map, check if each key starts with the given prefix, and sum the values of matching keys.

<div class="code-group">

```python
class MapSum:
    def __init__(self):
        # Store key-value pairs
        self.map = {}

    def insert(self, key: str, val: int) -> None:
        # Simple insertion - O(1)
        self.map[key] = val

    def sum(self, prefix: str) -> int:
        total = 0
        # Check every key in the map
        for k, v in self.map.items():
            # Check if key starts with prefix
            if k.startswith(prefix):
                total += v
        return total
```

```javascript
class MapSum {
  constructor() {
    this.map = new Map();
  }

  insert(key, val) {
    this.map.set(key, val);
  }

  sum(prefix) {
    let total = 0;
    // Check every key in the map
    for (let [k, v] of this.map) {
      // Check if key starts with prefix
      if (k.startsWith(prefix)) {
        total += v;
      }
    }
    return total;
  }
}
```

```java
class MapSum {
    private Map<String, Integer> map;

    public MapSum() {
        map = new HashMap<>();
    }

    public void insert(String key, int val) {
        map.put(key, val);
    }

    public int sum(String prefix) {
        int total = 0;
        // Check every key in the map
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            // Check if key starts with prefix
            if (entry.getKey().startsWith(prefix)) {
                total += entry.getValue();
            }
        }
        return total;
    }
}
```

</div>

**Why this is insufficient:**

- `insert`: O(1) time, O(1) space
- `sum`: O(N × L) time where N is number of keys and L is average key length (for checking `startsWith`)
- If we have many keys and call `sum` frequently, this becomes very slow
- The problem constraints don't specify limits, but in interviews we need to optimize for the worst case

## Optimized Approach

The key insight is that we need efficient prefix matching. Two main approaches work:

1. **Trie with prefix sums**: Store each key in a trie, and at each node, store the sum of all values for keys that pass through that node. When we insert a key, we update the sum at each node along the path. This gives us O(L) time for both `insert` and `sum`, where L is the key length.

2. **Hash map with all prefixes**: For each key, generate all its prefixes and store the cumulative sum for each prefix in a hash map. When we update a key, we need to know its old value to adjust the prefix sums correctly.

The trie approach is more elegant and space-efficient for sparse prefix distributions. The hash map approach is simpler to implement but uses more space. We'll implement the trie solution as it's the most instructive.

**Step-by-step reasoning:**

1. Each trie node needs:
   - Children nodes for each possible next character
   - A value field to store the sum for all keys with this prefix
2. When inserting a key with value `val`:
   - Traverse the trie, creating nodes as needed
   - At each node, we need to update the sum
   - But we must handle updates: if the key already exists, we need to subtract the old value first
3. When calculating `sum(prefix)`:
   - Traverse the trie following the prefix characters
   - If we reach the end of the prefix, return the sum at that node
   - If we can't follow the full prefix, return 0 (no keys with that prefix)

## Optimal Solution

Here's the trie-based solution with detailed comments:

<div class="code-group">

```python
class TrieNode:
    def __init__(self):
        # Dictionary to store child nodes for each character
        self.children = {}
        # Sum of values for all keys passing through this node
        self.value = 0

class MapSum:
    def __init__(self):
        # Initialize the root of the trie
        self.root = TrieNode()
        # Hash map to store current values for each key
        # Needed to handle updates correctly
        self.key_values = {}

    def insert(self, key: str, val: int) -> None:
        # Calculate the difference between new and old value
        # If key doesn't exist, old value is 0
        delta = val - self.key_values.get(key, 0)

        # Update the current value for this key
        self.key_values[key] = val

        # Start from root and traverse/insert the key
        node = self.root

        # For each character in the key
        for char in key:
            # If child doesn't exist, create it
            if char not in node.children:
                node.children[char] = TrieNode()

            # Move to the child node
            node = node.children[char]

            # Update the sum at this node with the delta
            # This adds the new value and subtracts the old value
            node.value += delta

    def sum(self, prefix: str) -> int:
        # Start from root
        node = self.root

        # Traverse the trie following the prefix characters
        for char in prefix:
            # If we can't follow the prefix path, return 0
            if char not in node.children:
                return 0

            # Move to the child node
            node = node.children[char]

        # Return the sum stored at the final node
        # This represents sum of all values for keys with this prefix
        return node.value
```

```javascript
class TrieNode {
  constructor() {
    // Map to store child nodes for each character
    this.children = new Map();
    // Sum of values for all keys passing through this node
    this.value = 0;
  }
}

class MapSum {
  constructor() {
    // Initialize the root of the trie
    this.root = new TrieNode();
    // Map to store current values for each key
    // Needed to handle updates correctly
    this.keyValues = new Map();
  }

  insert(key, val) {
    // Calculate the difference between new and old value
    // If key doesn't exist, old value is 0
    const oldVal = this.keyValues.get(key) || 0;
    const delta = val - oldVal;

    // Update the current value for this key
    this.keyValues.set(key, val);

    // Start from root and traverse/insert the key
    let node = this.root;

    // For each character in the key
    for (const char of key) {
      // If child doesn't exist, create it
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }

      // Move to the child node
      node = node.children.get(char);

      // Update the sum at this node with the delta
      // This adds the new value and subtracts the old value
      node.value += delta;
    }
  }

  sum(prefix) {
    // Start from root
    let node = this.root;

    // Traverse the trie following the prefix characters
    for (const char of prefix) {
      // If we can't follow the prefix path, return 0
      if (!node.children.has(char)) {
        return 0;
      }

      // Move to the child node
      node = node.children.get(char);
    }

    // Return the sum stored at the final node
    // This represents sum of all values for keys with this prefix
    return node.value;
  }
}
```

```java
class TrieNode {
    // Array or map to store child nodes
    Map<Character, TrieNode> children;
    // Sum of values for all keys passing through this node
    int value;

    public TrieNode() {
        children = new HashMap<>();
        value = 0;
    }
}

class MapSum {
    private TrieNode root;
    private Map<String, Integer> keyValues;

    public MapSum() {
        // Initialize the root of the trie
        root = new TrieNode();
        // Map to store current values for each key
        // Needed to handle updates correctly
        keyValues = new HashMap<>();
    }

    public void insert(String key, int val) {
        // Calculate the difference between new and old value
        // If key doesn't exist, old value is 0
        int delta = val - keyValues.getOrDefault(key, 0);

        // Update the current value for this key
        keyValues.put(key, val);

        // Start from root and traverse/insert the key
        TrieNode node = root;

        // For each character in the key
        for (char c : key.toCharArray()) {
            // If child doesn't exist, create it
            node.children.putIfAbsent(c, new TrieNode());

            // Move to the child node
            node = node.children.get(c);

            // Update the sum at this node with the delta
            // This adds the new value and subtracts the old value
            node.value += delta;
        }
    }

    public int sum(String prefix) {
        // Start from root
        TrieNode node = root;

        // Traverse the trie following the prefix characters
        for (char c : prefix.toCharArray()) {
            // If we can't follow the prefix path, return 0
            if (!node.children.containsKey(c)) {
                return 0;
            }

            // Move to the child node
            node = node.children.get(c);
        }

        // Return the sum stored at the final node
        // This represents sum of all values for keys with this prefix
        return node.value;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `insert(key, val)`: O(L) where L is the length of the key. We traverse/insert each character once.
- `sum(prefix)`: O(P) where P is the length of the prefix. We traverse the trie following the prefix characters.

**Space Complexity:**

- O(N × L) in the worst case where N is the number of keys and L is the average key length. Each character of each key creates a node in the trie. In practice, it's less because prefixes are shared.
- The `keyValues` map uses O(N) additional space.

## Common Mistakes

1. **Forgetting to handle key updates**: If you insert "apple" with value 3, then insert "apple" with value 5, the sum for prefix "ap" should increase by 2 (5 - 3), not by 5. Many candidates forget to track the old value and only add the new value.

2. **Not checking if prefix exists in trie**: In the `sum` method, if the prefix doesn't exist in the trie, you should return 0 immediately. Some candidates try to traverse anyway and get null pointer errors.

3. **Using array instead of hash map for children**: While an array of size 26 works for lowercase English letters, the problem doesn't specify character set. Using a hash map is more general and handles any Unicode character.

4. **Not storing key values separately**: You need the `keyValues` map to calculate the delta when updating a key. Without it, you can't know what to subtract from the prefix sums.

## When You'll See This Pattern

The trie data structure is essential for problems involving:

- Prefix matching (this problem)
- Autocomplete systems
- Word search in dictionaries
- IP routing (longest prefix match)

Related LeetCode problems:

1. **Implement Trie (Prefix Tree)** (LeetCode 208): The basic trie implementation that this problem builds upon.
2. **Add and Search Word** (LeetCode 211): Extends the trie with wildcard search capability.
3. **Word Search II** (LeetCode 212): Uses a trie to efficiently search for multiple words in a board.
4. **Replace Words** (LeetCode 648): Uses a trie to find the shortest root replacement for words.

## Key Takeaways

1. **Tries excel at prefix operations**: When a problem involves searching or counting by prefix, think "trie." The trie allows O(L) time for both insertion and prefix search.

2. **Precompute aggregates at nodes**: By storing the sum of values at each node, we can answer prefix sum queries in O(P) time instead of O(N × L). This is a form of memoization.

3. **Handle updates carefully**: When a value can be updated, you need to track the old value to correctly update all affected prefix sums. The delta approach (new - old) is cleaner than trying to reconstruct from scratch.

Related problems: [Sort the Jumbled Numbers](/problem/sort-the-jumbled-numbers), [Sum of Prefix Scores of Strings](/problem/sum-of-prefix-scores-of-strings)
