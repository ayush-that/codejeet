---
title: "Hash Map Patterns That Show Up in Every Interview"
description: "Frequency counting, two-sum patterns, grouping, and caching — the hash map techniques interviewers love to test."
date: "2026-07-20"
category: "tips"
tags: ["hash map", "arrays", "patterns", "interview prep"]
---

Hash maps provide O(1) average-time lookups, inserts, and deletes, making them the go-to tool for eliminating nested loops and tracking frequencies. If you are not reaching for a hash map within the first few minutes of most array and string problems, you are probably overcomplicating your approach.

## Pattern 1: Frequency Counting

Count how often each element appears, then use those counts.

**Valid Anagram:** Count character frequencies in both strings, compare maps. **Top K Frequent Elements:** Build a frequency map, extract K highest. Optimal: bucket sort by frequency for O(n). **First Unique Character in a String:** Build frequency map, iterate again to find the first character with count 1.

The core technique involves iterating through a collection and using a hash map to store each element as a key and its count as the value. This transforms problems that might require O(n²) nested comparisons into O(n) single-pass solutions. For problems with a bounded key space (like 26 lowercase letters), a fixed-size array can be more efficient, but the conceptual pattern remains the same.

<div class="code-group">

```python
# Valid Anagram
def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = {}
    for char in s:
        count[char] = count.get(char, 0) + 1
    for char in t:
        if char not in count:
            return False
        count[char] -= 1
        if count[char] == 0:
            del count[char]
    return len(count) == 0

# Top K Frequent Elements (Bucket Sort Approach)
def topKFrequent(nums, k):
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Bucket where index represents frequency
    bucket = [[] for _ in range(len(nums) + 1)]
    for num, freq in freq_map.items():
        bucket[freq].append(num)

    result = []
    for i in range(len(bucket) - 1, 0, -1):
        for num in bucket[i]:
            result.append(num)
            if len(result) == k:
                return result
    return result

# First Unique Character in a String
def firstUniqChar(s: str) -> int:
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i
    return -1
```

```javascript
// Valid Anagram
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }
  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
    if (count[char] === 0) delete count[char];
  }
  return Object.keys(count).length === 0;
}

// Top K Frequent Elements (Bucket Sort Approach)
function topKFrequent(nums, k) {
  const freqMap = {};
  for (const num of nums) {
    freqMap[num] = (freqMap[num] || 0) + 1;
  }

  const bucket = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of Object.entries(freqMap)) {
    bucket[freq].push(num);
  }

  const result = [];
  for (let i = bucket.length - 1; i > 0; i--) {
    for (const num of bucket[i]) {
      result.push(Number(num));
      if (result.length === k) return result;
    }
  }
  return result;
}

// First Unique Character in a String
function firstUniqChar(s) {
  const freq = {};
  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }
  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }
  return -1;
}
```

```java
// Valid Anagram
import java.util.HashMap;

public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    HashMap<Character, Integer> count = new HashMap<>();
    for (char c : s.toCharArray()) {
        count.put(c, count.getOrDefault(c, 0) + 1);
    }
    for (char c : t.toCharArray()) {
        if (!count.containsKey(c)) return false;
        count.put(c, count.get(c) - 1);
        if (count.get(c) == 0) count.remove(c);
    }
    return count.isEmpty();
}

// Top K Frequent Elements (Bucket Sort Approach)
import java.util.*;

public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    List<Integer>[] bucket = new List[nums.length + 1];
    for (int i = 0; i < bucket.length; i++) bucket[i] = new ArrayList<>();

    for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
        bucket[entry.getValue()].add(entry.getKey());
    }

    List<Integer> result = new ArrayList<>();
    for (int i = bucket.length - 1; i > 0 && result.size() < k; i--) {
        result.addAll(bucket[i]);
    }
    return result.stream().mapToInt(i -> i).toArray();
}

// First Unique Character in a String
import java.util.HashMap;

public int firstUniqChar(String s) {
    HashMap<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }
    for (int i = 0; i < s.length(); i++) {
        if (freq.get(s.charAt(i)) == 1) return i;
    }
    return -1;
}
```

</div>

## Pattern 2: The Two Sum Family

**Two Sum:** For each element, check if `target - element` exists in the map. If not, add the current element. One pass, O(n).

**Four Sum II:** Count sums of pairs from the first two arrays (sum as key, count as value), then look up complements from the last two arrays. Reduces O(n^4) to O(n^2).

The principle: store one element's contribution in a hash map and look up the other's complement. This pattern extends to any problem where you need to find pairs or tuples that satisfy a specific relationship (like summing to a target). The key insight is to trade space for time by storing previously seen values, allowing you to answer the "have I seen the complement?" question in constant time.

<div class="code-group">

```python
# Two Sum
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Four Sum II
def fourSumCount(nums1, nums2, nums3, nums4):
    sum_map = {}
    count = 0
    for a in nums1:
        for b in nums2:
            current_sum = a + b
            sum_map[current_sum] = sum_map.get(current_sum, 0) + 1
    for c in nums3:
        for d in nums4:
            complement = -(c + d)
            if complement in sum_map:
                count += sum_map[complement]
    return count
```

```javascript
// Two Sum
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

// Four Sum II
function fourSumCount(nums1, nums2, nums3, nums4) {
  const sumMap = new Map();
  let count = 0;
  for (const a of nums1) {
    for (const b of nums2) {
      const sum = a + b;
      sumMap.set(sum, (sumMap.get(sum) || 0) + 1);
    }
  }
  for (const c of nums3) {
    for (const d of nums4) {
      const complement = -(c + d);
      if (sumMap.has(complement)) {
        count += sumMap.get(complement);
      }
    }
  }
  return count;
}
```

```java
// Two Sum
import java.util.HashMap;

public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}

// Four Sum II
import java.util.HashMap;

public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
    HashMap<Integer, Integer> sumMap = new HashMap<>();
    int count = 0;
    for (int a : nums1) {
        for (int b : nums2) {
            int sum = a + b;
            sumMap.put(sum, sumMap.getOrDefault(sum, 0) + 1);
        }
    }
    for (int c : nums3) {
        for (int d : nums4) {
            int complement = -(c + d);
            count += sumMap.getOrDefault(complement, 0);
        }
    }
    return count;
}
```

</div>

## Pattern 3: Grouping by Key

Hash maps naturally group elements by a computed key.

**Group Anagrams:** Sort each string as the canonical key. All anagrams share the same sorted form. Alternatively, use a tuple of character counts. **Isomorphic Strings:** Map characters bidirectionally between two strings. Check consistency with two hash maps.

Grouping problems require you to define a transformation function that produces a "signature" or "key" for each element. Elements that should be grouped together will produce the same key. This pattern is powerful for categorization problems beyond anagrams, such as grouping transactions by user or grouping words by their length pattern.

<div class="code-group">

```python
# Group Anagrams
def groupAnagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())

# Alternative using tuple of character counts
def groupAnagramsCount(strs):
    groups = {}
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        key = tuple(count)
        groups.setdefault(key, []).append(s)
    return list(groups.values())

# Isomorphic Strings
def isIsomorphic(s, t):
    if len(s) != len(t):
        return False
    s_to_t = {}
    t_to_s = {}
    for cs, ct in zip(s, t):
        if cs in s_to_t and s_to_t[cs] != ct:
            return False
        if ct in t_to_s and t_to_s[ct] != cs:
            return False
        s_to_t[cs] = ct
        t_to_s[ct] = cs
    return True
```

```javascript
// Group Anagrams
function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.values());
}

// Isomorphic Strings
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const sToT = new Map();
  const tToS = new Map();
  for (let i = 0; i < s.length; i++) {
    const cs = s[i];
    const ct = t[i];
    if (sToT.has(cs) && sToT.get(cs) !== ct) return false;
    if (tToS.has(ct) && tToS.get(ct) !== cs) return false;
    sToT.set(cs, ct);
    tToS.set(ct, cs);
  }
  return true;
}
```

```java
// Group Anagrams
import java.util.*;

public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}

// Isomorphic Strings
import java.util.HashMap;

public boolean isIsomorphic(String s, String t) {
    if (s.length() != t.length()) return false;
    HashMap<Character, Character> sToT = new HashMap<>();
    HashMap<Character, Character> tToS = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        char cs = s.charAt(i);
        char ct = t.charAt(i);
        if (sToT.containsKey(cs) && sToT.get(cs) != ct) return false;
        if (tToS.containsKey(ct) && tToS.get(ct) != cs) return false;
        sToT.put(cs, ct);
        tToS.put(ct, cs);
    }
    return true;
}
```

</div>

## Pattern 4: Prefix Sums with Hash Maps

Store prefix sums in a hash map and use the complement trick for subarray queries.

**Subarray Sum Equals K:** Maintain running prefix sum and a map counting occurrences of each prefix sum. For current sum `curr`, check if `curr - k` exists. If `prefix[j] - prefix[i] == k`, the subarray from i+1 to j sums to k.

**Contiguous Array:** Convert 0s to -1s, find longest subarray with sum 0. Store the first index where each prefix sum occurs. Same prefix sum at two indices means the range between them sums to 0.

**Path Sum III:** Apply prefix sums to tree paths during DFS.

This is one of the most powerful hash map patterns for array problems. The prefix sum technique transforms subarray sum problems into a Two-Sum-like problem. The hash map stores previously seen prefix sums (or their indices) to allow O(1) lookup of whether a subarray with the desired sum exists ending at the current position.

<div class="code-group">

```python
# Subarray Sum Equals K
def subarraySum(nums, k):
    prefix_sum_count = {0: 1}
    current_sum = 0
    count = 0
    for num in nums:
        current_sum += num
        # Check if there's a previous prefix sum such that current_sum - prev = k
        complement = current_sum - k
        if complement in prefix_sum_count:
            count += prefix_sum_count[complement]
        # Add current prefix sum to the map
        prefix_sum_count[current_sum] = prefix_sum_count.get(current_sum, 0) + 1
    return count

# Contiguous Array
def findMaxLength(nums):
    # Map prefix sum to first occurrence index
    sum_index_map = {0: -1}
    max_len = 0
    current_sum = 0
    for i, num in enumerate(nums):
        # Treat 0 as -1
        current_sum += 1 if num == 1 else -1
        if current_sum in sum_index_map:
            # Subarray from sum_index_map[current_sum] + 1 to i has sum 0
            max_len = max(max_len, i - sum_index_map[current_sum])
        else:
            sum_index_map[current_sum] = i
    return max_len
```

```javascript
// Subarray Sum Equals K
function subarraySum(nums, k) {
  const prefixSumCount = new Map();
  prefixSumCount.set(0, 1);
  let currentSum = 0;
  let count = 0;
  for (const num of nums) {
    currentSum += num;
    const complement = currentSum - k;
    if (prefixSumCount.has(complement)) {
      count += prefixSumCount.get(complement);
    }
    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
  }
  return count;
}

// Contiguous Array
function findMaxLength(nums) {
  const sumIndexMap = new Map();
  sumIndexMap.set(0, -1);
  let maxLen = 0;
  let currentSum = 0;
  for (let i = 0; i < nums.length; i++) {
    currentSum += nums[i] === 1 ? 1 : -1;
    if (sumIndexMap.has(currentSum)) {
      maxLen = Math.max(maxLen, i - sumIndexMap.get(currentSum));
    } else {
      sumIndexMap.set(currentSum, i);
    }
  }
  return maxLen;
}
```

```java
// Subarray Sum Equals K
import java.util.HashMap;

public int subarraySum(int[] nums, int k) {
    HashMap<Integer, Integer> prefixSumCount = new HashMap<>();
    prefixSumCount.put(0, 1);
    int currentSum = 0;
    int count = 0;
    for (int num : nums) {
        currentSum += num;
        int complement = currentSum - k;
        if (prefixSumCount.containsKey(complement)) {
            count += prefixSumCount.get(complement);
        }
        prefixSumCount.put(currentSum, prefixSumCount.getOrDefault(currentSum, 0) + 1);
    }
    return count;
}

// Contiguous Array
import java.util.HashMap;

public int findMaxLength(int[] nums) {
    HashMap<Integer, Integer> sumIndexMap = new HashMap<>();
    sumIndexMap.put(0, -1);
    int maxLen = 0;
    int currentSum = 0;
    for (int i = 0; i < nums.length; i++) {
        currentSum += nums[i] == 1 ? 1 : -1;
        if (sumIndexMap.containsKey(currentSum)) {
            maxLen = Math.max(maxLen, i - sumIndexMap.get(currentSum));
        } else {
            sumIndexMap.put(currentSum, i);
        }
    }
    return maxLen;
}
```

</div>

## Pattern 5: Hash-Based Data Structures

**LRU Cache:** Hash map + doubly linked list. O(1) lookup via map, O(1) eviction via list. `get` moves the node to the head; `put` inserts at head and evicts from tail at capacity.

**Insert Delete GetRandom O(1):** Hash map (value to index) + dynamic array. Insert appends and records index. Delete swaps with last element and pops. GetRandom picks a random array index.

**Time-Based Key-Value Store:** Hash map where each key maps to a sorted list of (timestamp, value) pairs. `get` uses binary search.

These problems demonstrate how hash maps serve as the foundation for designing more complex data structures that require O(1) operations. The key is to combine the hash map's constant-time lookup with another data structure that maintains order or allows random access.

<div class="code-group">

```python
# LRU Cache Implementation
class ListNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_node(self, node):
        # Add right after head
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _remove_node(self, node):
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _move_to_head(self, node):
        self._remove_node(node)
        self._add_node(node)

    def _pop_tail(self):
        node = self.tail.prev
        self._remove_node(node)
        return node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_head(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            new_node = ListNode(key, value)
            self.cache[key] = new_node
            self._add_node(new_node)
            if len(self.cache) > self.capacity:
                tail = self._pop_tail()
                del self.cache[tail.key]

# Insert Delete GetRandom O(1)
import random

class RandomizedSet:
    def __init__(self):
        self.val_to_index = {}
        self.values = []

    def insert(self, val: int) -> bool:
        if val in self.val_to_index:
            return False
        self.val_to_index[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.val_to_index:
            return False
        idx = self.val_to_index[val]
        last_val = self.values[-1]
        # Swap with last element
        self.values[idx] = last_val
        self.val_to_index[last_val] = idx
        # Remove last element
        self.values.pop()
        del self.val_to_index[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.values)
```

```javascript
// LRU Cache Implementation
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
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new ListNode();
    this.tail = new ListNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addNode(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _removeNode(node) {
    const prevNode = node.prev;
    const nextNode = node.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  _moveToHead(node) {
    this._removeNode(node);
    this._addNode(node);
  }

  _popTail() {
    const node = this.tail.prev;
    this._removeNode(node);
    return node;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this._moveToHead(node);
    return node.val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.val = value;
      this._moveToHead(node);
    } else {
      const newNode = new ListNode(key, value);
      this.cache.set(key, newNode);
      this._addNode(newNode);
      if (this.cache.size > this.capacity) {
        const tail = this._popTail();
        this.cache.delete(tail.key);
      }
    }
  }
}

// Insert Delete GetRandom O(1)
class RandomizedSet {
  constructor() {
    this.valToIndex = new Map();
    this.values = [];
  }

  insert(val) {
    if (this.valToIndex.has(val)) return false;
    this.valToIndex.set(val, this.values.length);
    this.values.push(val);
    return true;
  }

  remove(val) {
    if (!this.valToIndex.has(val)) return false;
    const idx = this.valToIndex.get(val);
    const lastVal = this.values[this.values.length - 1];
    // Swap with last element
    this.values[idx] = lastVal;
    this.valToIndex.set(lastVal, idx);
    // Remove last element
    this.values.pop();
    this.valToIndex.delete(val);
    return true;
  }

  getRandom() {
    const randomIndex = Math.floor(Math.random() * this.values.length);
    return this.values[randomIndex];
  }
}
```

```java
// LRU Cache Implementation
import java.util.HashMap;

class LRUCache {
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;
        DLinkedNode() {}
        DLinkedNode(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private HashMap<Integer, DLinkedNode> cache = new HashMap<>();
    private int capacity;
    private DLinkedNode head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }

    private void addNode(DLinkedNode node) {
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
        DLinkedNode node = tail.prev;
        removeNode(node);
        return node;
    }

    public int get(int key) {
        DLinkedNode node = cache.get(key);
        if (node == null) return -1;
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        DLinkedNode node = cache.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
        } else {
            DLinkedNode newNode = new DLinkedNode(key, value);
            cache.put(key, newNode);
            addNode(newNode);
            if (cache.size() > capacity) {
                DLinkedNode tail = popTail();
                cache.remove(tail.key);
            }
        }
    }
}

// Insert Delete GetRandom O(1)
import java.util.*;

class RandomizedSet {
    private Map<Integer, Integer> valToIndex;
    private List<Integer> values;
    private Random rand;

    public RandomizedSet() {
        valToIndex = new HashMap<>();
        values = new ArrayList<>();
        rand = new Random();
    }

    public boolean insert(int val) {
        if (valToIndex.containsKey(val)) return false;
        valToIndex.put(val, values.size());
        values.add(val);
        return true;
    }

    public boolean remove(int val) {
        if (!valToIndex.containsKey(val)) return false;
        int idx = valToIndex.get(val);
        int lastVal = values.get(values.size() - 1);
        // Swap with last element
        values.set(idx, lastVal);
        valToIndex.put(lastVal, idx);
        // Remove last element
        values.remove(values.size() - 1);
        valToIndex.remove(val);
        return true;
    }

    public int getRandom() {
        return values.get(rand.nextInt(values.size()));
    }
}
```

</div>

## Common Pitfalls

**Hash collisions.** Assume O(1) in interviews unless asked. If pressed, mention chaining or open addressing. In practice, modern hash table implementations handle collisions efficiently, but it's good to understand that worst-case performance can degrade to O(n) if all keys hash to the same bucket.

**Mutable keys.** In Python, convert lists to tuples for dict keys. In Java, override `hashCode` and `equals` for custom objects. If you use a mutable object as a key and then change it, the hash code changes and the object becomes unfindable in the hash map.

**Overusing hash maps.** If the key space is bounded and small (e.g., 26 letters), a fixed-size array is simpler and more memory efficient. For example, a character frequency counter for lowercase English letters can use `int[26]` instead of a `HashMap<Character, Integer>`.

**Space complexity underestimation.** Hash maps provide O(1) operations but still require O(n) space. In memory-constrained environments, this can be significant.

## Practice Problems

**Frequency counting:**

1. Valid Anagram
2. Top K Frequent Elements
3. First Unique Character in a String

**Two Sum family:** 4. Two Sum 5. Four Sum II

**Grouping:** 6. Group Anagrams 7. Isomorphic Strings

**Prefix sums:** 8. Subarray Sum Equals K 9. Contiguous Array

**Data structure design:** 10. LRU Cache 11. Insert Delete GetRandom O(1)

Explore hash map problems by company on the [CodeJeet dashboard](/dashboard). Especially frequent at [Amazon](/company/amazon) and [Meta](/company/meta).
