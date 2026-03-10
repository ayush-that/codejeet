---
title: "Google vs Amazon: Interview Question Comparison"
description: "Compare coding interview questions at Google and Amazon — difficulty levels, topic focus, and preparation strategy."
date: "2028-07-13"
category: "tips"
tags: ["google", "amazon", "comparison"]
---

If you're interviewing at both Google and Amazon—or trying to decide which prep to prioritize—you're facing a common but high-stakes scenario. The raw data shows significant overlap: both ask heavily about Arrays, Strings, Hash Tables, and Dynamic Programming. But beneath the surface, the interview experiences, problem styles, and evaluation criteria diverge in meaningful ways. Preparing for one isn't a perfect substitute for the other. The most efficient strategy is to master the shared core, then branch out to company-specific nuances. This guide breaks down the numbers, patterns, and insider tactics to help you build a preparation plan that maximizes your return on invested time.

## Question Volume and Difficulty

Let's decode the numbers. Google's tagged list on LeetCode contains **2,217 questions**, with a difficulty spread of Easy (588), Medium (1,153), and Hard (476). Amazon's list is slightly smaller at **1,938 questions**, split as Easy (530), Medium (1,057), and Hard (351).

What does this actually mean for you?

- **Google's larger Hard count** (476 vs. 351) is notable. It suggests Google's problem set includes more deeply algorithmic, conceptually challenging, or multi-step problems. In practice, Google interviews often lean into "classic" Hard problems that test deep computer science fundamentals (think graph transformations, advanced DP, or complex recursion).
- **Amazon's Medium-heavy profile** aligns with its reputation for practical, business-logic-oriented problems. The interview often feels like a "work sample" — you're more likely to get a problem that mirrors designing a feature for AWS or optimizing a warehouse routing algorithm, wrapped in a Medium-difficulty coding shell.
- **The intensity is similar, but the flavor differs.** Both will push you in a 45-minute slot. Google might push you with a tricky algorithmic insight; Amazon might push you by adding multiple constraints and asking you to evolve the solution.

Don't let the total volume intimidate you. You don't need to solve thousands of problems. You need to recognize that Google's list may require slightly more depth on classical algorithms, while Amazon's requires more attention to clean, maintainable code under evolving requirements.

## Topic Overlap

The top four topics for both companies are identical: **Array, String, Hash Table, Dynamic Programming**. This is your foundation. Mastery here gives you enormous leverage for both interview loops.

- **Array & String:** The bread and butter. Manipulation, searching, sorting, partitioning, sliding window, two-pointer techniques. Expect these everywhere.
- **Hash Table:** The go-to for O(1) lookups. Used for frequency counting, memoization, mapping relationships. Crucial for optimizing solutions.
- **Dynamic Programming:** A key differentiator for seniority. Both companies use DP to assess problem decomposition and optimization thinking.

Where they begin to diverge:

- **Google** shows stronger representation in **Graph, Tree, Depth-First Search, Binary Search, and Greedy** topics. This points to interviews that value classical CS algorithm knowledge and mathematical optimization.
- **Amazon** has a pronounced emphasis on **Simulation, Design, and Heap (Priority Queue)**. The "Simulation" tag is telling—it often involves meticulously working through a procedural or state-based problem (like a game or process). The "Design" tag here often refers to data structure design (e.g., design an LRU cache), which blurs into system design for more senior roles.

The overlap is your best friend. Time spent on Array, String, Hash Table, and DP is doubly valuable.

## Preparation Priority Matrix

Use this matrix to allocate your study time strategically.

**Tier 1: High-ROI Overlap Topics (Study First)**

- **Array & String:** Focus on two-pointer, sliding window, and prefix sum techniques.
- **Hash Table:** Master its use for caches (memoization) and frequency maps.
- **Dynamic Programming:** Start with 1D and 2D DP patterns (knapsack, LCS, LIS). This is a high-leverage area that appears often at both.

**Tier 2: Google-Leaning Topics**

- **Graph (DFS/BFS):** Topological sort, shortest path, cycle detection.
- **Tree:** Traversals, recursion, LCA, serialization.
- **Binary Search:** Especially on non-obvious domains (like finding a threshold).

**Tier 3: Amazon-Leaning Topics**

- **Heap (Priority Queue):** For scheduling, merging K lists, finding medians.
- **Simulation:** Practice problems with clear, step-by-step state changes.
- **Data Structure Design:** Think LRU Cache, Trie for autocomplete, etc.

## Interview Format Differences

This is where the experiences truly split.

**Google:**

- **Structure:** Typically 2 phone screens (45 mins each), followed by a 4-5 round on-site (or virtual). Each round is 45 minutes, usually one main problem with follow-ups.
- **Focus:** Algorithmic elegance and scalability. Interviewers often ask for multiple solutions, starting with brute force, then optimizing to optimal time/space. They deeply probe your reasoning ("Why did you choose that data structure?"). Communication of thought process is paramount.
- **System Design:** Separate round for mid-level and above. It's conceptual and scale-focused (think: design YouTube).

**Amazon:**

- **Structure:** Usually 1 online assessment (OA), 1 phone screen, followed by a 4-5 round final loop ("The Loop"). The Loop includes a dedicated **Behavioral round** based on Leadership Principles.
- **Focus:** Working code and practical trade-offs. Amazon interviewers are known for presenting a problem, then adding new constraints ("What if the input is streamed?"). They value getting to a clean, working solution. Edge cases and testing are often discussed.
- **System Design & Behavioral:** For SDE II+, a low-level system design round (e.g., design a parking lot) is common. The **Leadership Principles** questions are non-negotiable and carry significant weight. Have 2-3 detailed stories ready for each principle.

## Specific Problem Recommendations

Here are 5 problems that offer exceptional prep value for both companies, targeting the overlap and key patterns.

**1. Two Sum (LeetCode #1)**
_Why:_ The quintessential Hash Table problem. It teaches the "complement lookup" pattern that appears in countless variations. Essential for both.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Usage of hash map for O(1) lookups is the core pattern.
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}
```

</div>

**2. Merge Intervals (LeetCode #56)**
_Why:_ A classic Array/Sorting problem that tests your ability to manage overlapping ranges. The pattern appears in scheduling problems at both companies.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (for sorting output)
def merge(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    return merged

# Key: Sort by start time, then merge if overlapping.
```

```javascript
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] current = intervals[i];
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

**3. Longest Palindromic Substring (LeetCode #5)**
_Why:_ Covers String manipulation, two-pointer expansion, and DP. It's a great problem to discuss multiple approaches (brute force, DP O(n²), Manacher's O(n)).

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1) - Expand Around Center
def longestPalindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l+1:r]  # Note: l and r are one step beyond palindrome

    res = ""
    for i in range(len(s)):
        odd = expand(i, i)      # odd length palindrome
        even = expand(i, i+1)   # even length palindrome
        res = max(res, odd, even, key=len)
    return res

# Demonstrates the two-pointer expansion pattern.
```

```javascript
// Time: O(n^2) | Space: O(1)
function longestPalindrome(s) {
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    return s.substring(l + 1, r);
  };

  let res = "";
  for (let i = 0; i < s.length; i++) {
    const odd = expand(i, i);
    const even = expand(i, i + 1);
    if (odd.length > res.length) res = odd;
    if (even.length > res.length) res = even;
  }
  return res;
}
```

```java
// Time: O(n^2) | Space: O(1)
public String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);
        int len2 = expandAroundCenter(s, i, i + 1);
        int len = Math.max(len1, len2);
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substring(start, end + 1);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}
```

</div>

**4. Word Break (LeetCode #139)**
_Why:_ A quintessential Dynamic Programming problem. It teaches the "segmentable substring" DP pattern and is highly relevant for both companies (Google: search/autocomplete; Amazon: text processing services).

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n) - n = len(s), due to substring slicing.
# Can be optimized to O(n^2) with a set for wordDict.
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True  # empty string
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]

# Classic DP where dp[i] means s[0:i] is segmentable.
```

```javascript
// Time: O(n^3) | Space: O(n)
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}
```

```java
// Time: O(n^3) | Space: O(n)
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}
```

</div>

**5. LRU Cache (LeetCode #146)**
_Why:_ A perfect blend of Hash Table and Linked List. It's a classic data structure design problem that tests your ability to combine data structures for efficient operations. Highly relevant for Amazon (system design) and Google (caching systems).

<div class="code-group">

```python
# Time: O(1) for get and put | Space: O(capacity)
class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head, self.tail = Node(), Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add(self, node):
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._add(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]

# Combines hash map for O(1) access with doubly linked list for O(1) order updates.
```

```javascript
// Time: O(1) for get and put | Space: O(capacity)
class Node {
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
    this.cache = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this._remove(node);
      this._add(node);
      return node.val;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this._remove(this.cache.get(key));
    }
    const node = new Node(key, value);
    this.cache.set(key, node);
    this._add(node);
    if (this.cache.size > this.cap) {
      const lru = this.head.next;
      this._remove(lru);
      this.cache.delete(lru.key);
    }
  }
}
```

```java
// Time: O(1) for get and put | Space: O(capacity)
class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void add(Node node) {
        node.prev = tail.prev;
        node.next = tail;
        tail.prev.next = node;
        tail.prev = node;
    }

    private Map<Integer, Node> cache;
    private int cap;
    private Node head, tail;

    public LRUCache(int capacity) {
        cap = capacity;
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
            return node.val;
        }
        return -1;
    }

    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            remove(cache.get(key));
        }
        Node node = new Node(key, value);
        cache.put(key, node);
        add(node);
        if (cache.size() > cap) {
            Node lru = head.next;
            remove(lru);
            cache.remove(lru.key);
        }
    }
}
```

</div>

## Which to Prepare for First?

**If you have interviews at both, start with the shared core.** Spend 70% of your initial coding prep on the Tier 1 overlap topics (Array, String, Hash Table, DP). Solve high-frequency problems from both company lists that fall into these categories.

**Then, branch based on your interview schedule.** If your Google interview is first, dive into Graph and Tree problems. If Amazon is first, prioritize Heap, Simulation, and practice articulating your code in terms of trade-offs and edge cases.

**Never neglect Amazon's Leadership Principles.** This is a unique, non-coding prep bucket that requires dedicated time. Write down your stories.

**Final Pro-Tip:** Google's process is more standardized. Amazon's can vary more by team. Use the shared problems above as your technical bedrock, then layer on the company-specific nuances. Good luck.

For more detailed company-specific guides, visit our pages for [Google](/company/google) and [Amazon](/company/amazon).
