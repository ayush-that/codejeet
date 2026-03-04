---
title: "How to Crack Oracle Coding Interviews in 2026"
description: "Complete guide to Oracle coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-06-25"
category: "company-guide"
company: "oracle"
tags: ["oracle", "interview prep", "leetcode"]
---

Oracle's interview process reflects the company's enterprise software heritage while increasingly incorporating the kind of algorithmic challenges you would expect from a top tech employer. The typical loop varies by division — Oracle Cloud Infrastructure (OCI) tends to have the most rigorous coding interviews, while other divisions may lean more toward system design and domain knowledge. Generally, expect a recruiter screen, one or two phone interviews, and an on-site of three to five rounds. Coding rounds are about 45 to 60 minutes, and Oracle interviewers tend to probe deeper into your understanding of data structures and algorithms rather than just looking for a working solution.

Oracle is a company of many sub-organizations, and the interview experience can differ significantly between OCI, Oracle Database, NetSuite, Cerner (healthcare), and other divisions. OCI interviews, in particular, have become more competitive in recent years as Oracle invests heavily in its cloud platform, and the coding questions there rival what you would see at other major cloud providers.

## By the Numbers

Oracle's question pool has **340 questions**. The difficulty distribution skews toward medium and hard more than you might expect from an enterprise-focused company:

- **Easy: 70 questions (21%)**
- **Medium: 205 questions (60%)**
- **Hard: 65 questions (19%)**

The 60% medium rate is the highest among the companies in this guide, and the 21% easy rate is relatively low. The 19% hard rate means roughly one in five problems is hard-level. This distribution suggests that Oracle interviews sit in a middle ground — they are not as brutally hard as Uber or TikTok, but they are more challenging than Bloomberg or Apple. Expect solid medium-level problems with occasional hard questions, especially for senior roles or OCI positions.

## Top Topics to Focus On

**Arrays** — Array problems form the backbone of Oracle interviews. Expect searching, sorting, partitioning, and manipulation problems. Oracle's array questions often involve working with structured data — think about processing tables, records, or sequences, which aligns with Oracle's database-centric worldview. Common patterns include two-pointer techniques, sliding windows, and in-place modifications. For example, you might be asked to merge intervals, find the maximum subarray sum, or rotate an array efficiently.

<div class="code-group">

```python
# Example: Two-pointer technique to find two numbers that sum to a target
def two_sum(nums, target):
    num_to_index = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i
    return []

# Example: In-place array rotation using reversal algorithm
def rotate_array(nums, k):
    n = len(nums)
    k %= n
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
    return nums
```

```javascript
// Example: Two-pointer technique to find two numbers that sum to a target
function twoSum(nums, target) {
  const numToIndex = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numToIndex.has(complement)) {
      return [numToIndex.get(complement), i];
    }
    numToIndex.set(nums[i], i);
  }
  return [];
}

// Example: In-place array rotation using reversal algorithm
function rotateArray(nums, k) {
  const n = nums.length;
  k %= n;
  const reverse = (start, end) => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };
  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return nums;
}
```

```java
// Example: Two-pointer technique to find two numbers that sum to a target
import java.util.HashMap;
import java.util.Map;

public class ArrayExamples {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numToIndex = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numToIndex.containsKey(complement)) {
                return new int[]{numToIndex.get(complement), i};
            }
            numToIndex.put(nums[i], i);
        }
        return new int[]{};
    }

    // Example: In-place array rotation using reversal algorithm
    public void rotateArray(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
}
```

</div>

**Strings** — String processing is a significant topic at Oracle. Parsing, formatting, validation, and transformation problems are all common. Given Oracle's work with SQL, query languages, and data formats, string problems often have a parsing-heavy flavor. You should be comfortable with operations like checking for palindromes, substring searches, anagram detection, and string encoding/decoding. Regular expressions can be useful but focus on manual parsing for interview settings.

<div class="code-group">

```python
# Example: Check if a string is a valid palindrome, ignoring non-alphanumeric chars
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

# Example: Group anagrams together using a hash map
def group_anagrams(strs):
    from collections import defaultdict
    anagram_map = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        anagram_map[key].append(s)
    return list(anagram_map.values())
```

```javascript
// Example: Check if a string is a valid palindrome, ignoring non-alphanumeric chars
function isPalindrome(s) {
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

// Example: Group anagrams together using a hash map
function groupAnagrams(strs) {
  const anagramMap = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!anagramMap.has(key)) anagramMap.set(key, []);
    anagramMap.get(key).push(s);
  }
  return Array.from(anagramMap.values());
}
```

```java
// Example: Check if a string is a valid palindrome, ignoring non-alphanumeric chars
import java.util.*;

public class StringExamples {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    // Example: Group anagrams together using a hash map
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> anagramMap = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            anagramMap.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(anagramMap.values());
    }
}
```

</div>

**Hash Tables** — Hash maps for efficient data retrieval, frequency analysis, and grouping are heavily tested. Oracle interviewers also value understanding of how hash-based structures work under the hood — hash functions, collision handling, and performance characteristics. Be prepared to implement a basic hash table from scratch or discuss scenarios where a hash map's O(1) average time complexity degrades to O(n) due to collisions. Common problems involve finding duplicates, implementing caches (LRU), and solving two-sum variants.

<div class="code-group">

```python
# Example: Implementing a basic hash table with chaining for collision resolution
class BasicHashTable:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.table = [[] for _ in range(capacity)]

    def _hash(self, key):
        return hash(key) % self.capacity

    def put(self, key, value):
        index = self._hash(key)
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        self.table[index].append((key, value))

    def get(self, key):
        index = self._hash(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        raise KeyError(f"Key {key} not found")

# Example: Find the first non-repeating character in a string
def first_unique_char(s):
    from collections import Counter
    freq = Counter(s)
    for i, ch in enumerate(s):
        if freq[ch] == 1:
            return i
    return -1
```

```javascript
// Example: Implementing a basic hash table with chaining for collision resolution
class BasicHashTable {
  constructor(capacity = 10) {
    this.capacity = capacity;
    this.table = Array.from({ length: capacity }, () => []);
  }

  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash) % this.capacity;
  }

  put(key, value) {
    const index = this._hash(key);
    const bucket = this.table[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    bucket.push([key, value]);
  }

  get(key) {
    const index = this._hash(key);
    const bucket = this.table[index];
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    throw new Error(`Key ${key} not found`);
  }
}

// Example: Find the first non-repeating character in a string
function firstUniqueChar(s) {
  const freq = new Map();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }
  return -1;
}
```

```java
// Example: Implementing a basic hash table with chaining for collision resolution
import java.util.*;

class BasicHashTable<K, V> {
    private static class Entry<K, V> {
        K key;
        V value;
        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    private List<Entry<K, V>>[] table;
    private int capacity;

    @SuppressWarnings("unchecked")
    public BasicHashTable(int capacity) {
        this.capacity = capacity;
        this.table = (List<Entry<K, V>>[]) new List[capacity];
        for (int i = 0; i < capacity; i++) {
            table[i] = new LinkedList<>();
        }
    }

    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }

    public void put(K key, V value) {
        int index = hash(key);
        for (Entry<K, V> entry : table[index]) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
        }
        table[index].add(new Entry<>(key, value));
    }

    public V get(K key) {
        int index = hash(key);
        for (Entry<K, V> entry : table[index]) {
            if (entry.key.equals(key)) {
                return entry.value;
            }
        }
        throw new NoSuchElementException("Key not found: " + key);
    }
}

// Example: Find the first non-repeating character in a string
class HashExamples {
    public int firstUniqueChar(String s) {
        Map<Character, Integer> freq = new HashMap<>();
        for (char ch : s.toCharArray()) {
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }
        for (int i = 0; i < s.length(); i++) {
            if (freq.get(s.charAt(i)) == 1) return i;
        }
        return -1;
    }
}
```

</div>

**Dynamic Programming** — DP appears consistently at Oracle, covering both standard patterns and some moderately advanced variants. Expect string-based DP (edit distance, longest common subsequence), sequence problems (longest increasing subsequence, maximum subarray), and 2D grid problems. Oracle's DP problems tend to be clearly stated, with well-defined inputs and outputs. The key is to recognize the overlapping subproblems and optimal substructure, then define the state and transition function.

<div class="code-group">

```python
# Example: Classic 0/1 Knapsack Problem
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

# Example: Longest Common Subsequence (LCS)
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

```javascript
// Example: Classic 0/1 Knapsack Problem
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}

// Example: Longest Common Subsequence (LCS)
function longestCommonSubsequence(text1, text2) {
  const m = text1.length,
    n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

```java
// Example: Classic 0/1 Knapsack Problem
public class DynamicProgrammingExamples {
    public int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        dp[i - 1][w],
                        values[i - 1] + dp[i - 1][w - weights[i - 1]]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }

    // Example: Longest Common Subsequence (LCS)
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}
```

</div>

**Math** — Mathematical reasoning shows up regularly in Oracle interviews. Problems involving number theory (GCD, LCM, primes), arithmetic operations, and integer manipulation are common. Oracle also occasionally asks problems that require understanding of bit manipulation, which falls under this umbrella. Practice problems like checking for prime numbers, computing the greatest common divisor using Euclid's algorithm, and solving problems with bitwise operators (AND, OR, XOR, shifts).

<div class="code-group">

```python
# Example: Euclidean algorithm for GCD and LCM
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return abs(a * b) // gcd(a, b)

# Example: Count the number of set bits (Hamming weight) in an integer
def count_set_bits(n):
    count = 0
    while n:
        n &= n - 1  # clears the lowest set bit
        count += 1
    return count

# Example: Check if a number is prime
def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
```

```javascript
// Example: Euclidean algorithm for GCD and LCM
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Example: Count the number of set bits (Hamming weight) in an integer
function countSetBits(n) {
  let count = 0;
  while (n) {
    n &= n - 1; // clears the lowest set bit
    count++;
  }
  return count;
}

// Example: Check if a number is prime
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
```

```java
// Example: Euclidean algorithm for GCD and LCM
public class MathExamples {
    public int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);
    }

    public int lcm(int a, int b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    // Example: Count the number of set bits (Hamming weight) in an integer
    public int countSetBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1); // clears the lowest set bit
            count++;
        }
        return count;
    }

    // Example: Check if a number is prime
    public boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) return false;
        }
        return true;
    }
}
```

</div>

## Preparation Strategy

**Weeks 1-2: Build Strong Fundamentals.** Start with arrays, strings, hash tables, and basic data structures (linked lists, stacks, queues). Solve 6-8 problems per day, mixing easy and medium difficulty. Oracle values thoroughness, so for each problem, consider multiple approaches and analyze their trade-offs. Write clean, well-commented code — Oracle interviewers notice code quality. For example, when solving a linked list problem, implement both iterative and recursive solutions and discuss their space complexity.

<div class="code-group">

```python
# Example: Reverse a linked list iteratively and recursively
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list_iterative(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev

def reverse_list_recursive(head):
    if not head or not head.next:
        return head
    new_head = reverse_list_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

```javascript
// Example: Reverse a linked list iteratively and recursively
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseListIterative(head) {
  let prev = null;
  let current = head;
  while (current) {
    const nextNode = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }
  return prev;
}

function reverseListRecursive(head) {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

```java
// Example: Reverse a linked list iteratively and recursively
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class LinkedListExamples {
    public ListNode reverseListIterative(ListNode head) {
        ListNode prev = null;
        ListNode current = head;
        while (current != null) {
            ListNode nextNode = current.next;
            current.next = prev;
            prev = current;
            current = nextNode;
        }
        return prev;
    }

    public ListNode reverseListRecursive(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseListRecursive(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}
```

</div>

**Week 3: Trees and Graphs.** Binary trees, BSTs, and graph traversal appear regularly in Oracle interviews. Focus on tree construction, traversal (all orders), BST validation, and common graph algorithms (BFS, DFS, shortest paths, topological sort). Oracle's tree and graph problems tend to be medium-difficulty but may have tricky edge cases involving null nodes, cycles, or disconnected components. Practice implementing both recursive and iterative traversals.

<div class="code-group">

```python
# Example: Binary Tree Inorder Traversal (iterative using a stack)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal_iterative(root):
    result = []
    stack = []
    current = root
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    return result

# Example: Breadth-First Search (BFS) on a graph represented as adjacency list
from collections import deque

def bfs_graph(adj_list, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result
```

```javascript
// Example: Binary Tree Inorder Traversal (iterative using a stack)
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function inorderTraversalIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }
  return result;
}

// Example: Breadth-First Search (BFS) on a graph represented as adjacency list
function bfsGraph(adjList, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  const result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of adjList.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}
```

```java
// Example: Binary Tree Inorder Traversal (iterative using a stack)
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TreeGraphExamples {
    public List<Integer> inorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            result.add(current.val);
            current = current.right;
        }
        return result;
    }

    // Example: Breadth-First Search (BFS) on a graph represented as adjacency list
    public List<Integer> bfsGraph(Map<Integer, List<Integer>> adjList, int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> result = new ArrayList<>();
        queue.offer(start);
        visited.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);
            for (int neighbor : adjList.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        return result;
    }
}
```

</div>

**Week 4: Dynamic Programming.** Cover the 15-20 most common DP patterns. Oracle's DP problems are usually identifiable if you know the standard patterns. Spend extra time on string-based DP and sequence problems, as these appear at a higher rate at Oracle. Practice defining the state and recurrence relation before writing any code. Work on problems like coin change, longest increasing subsequence, and edit distance.

<div class="code-group">

```python
# Example: Coin Change (minimum number of coins)
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

# Example: Longest Increasing Subsequence (LIS)
def length_of_lis(nums):
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

```javascript
// Example: Coin Change (minimum number of coins)
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Example: Longest Increasing Subsequence (LIS)
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = Array(nums.length).fill(1);
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}
```

```java
// Example: Coin Change (minimum number of coins)
import java.util.Arrays;

public class DPPatterns {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    // Example: Longest Increasing Subsequence (LIS)
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);
        int maxLen = 1;
        for (int i = 0; i < nums.length; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLen = Math.max(maxLen, dp[i]);
        }
        return maxLen;
    }
}
```

</div>

**Week 5: System Design and Database Knowledge.** Oracle's interviews — especially for senior roles — often include rounds on system design or database internals. Review database concepts: indexing, query optimization, ACID properties, and transaction isolation levels. For system design, practice designing data-intensive applications: a distributed database, a caching layer, or a data pipeline. Knowledge of SQL is a strong plus and occasionally tested directly. Practice writing complex SQL queries involving joins, subqueries, and window functions.

<div class="code-group">

```python
# Example: SQL-like operations implemented in Python for practice
# Imagine a table 'employees' with columns: id, name, department, salary
employees = [
    (1, 'Alice', 'Engineering', 90000),
    (2, 'Bob', 'Sales', 70000),
    (3, 'Charlie', 'Engineering', 95000),
    (4, 'Diana', 'Marketing', 80000),
]

# Query: Find the average salary per department
from collections import defaultdict
def avg_salary_per_dept(employees):
    dept_totals = defaultdict(lambda: [0, 0])  # [total_salary, count]
    for _, name, dept, salary in employees:
        dept_totals[dept][0] += salary
        dept_totals[dept][1] += 1
    return {dept: total / count for dept, (total, count) in dept_totals.items()}

print(avg_salary_per_dept(employees))
```

```javascript
// Example: SQL-like operations implemented in JavaScript for practice
// Imagine a table 'employees' with columns: id, name, department, salary
const employees = [
  [1, "Alice", "Engineering", 90000],
  [2, "Bob", "Sales", 70000],
  [3, "Charlie", "Engineering", 95000],
  [4, "Diana", "Marketing", 80000],
];

// Query: Find the average salary per department
function avgSalaryPerDept(employees) {
  const deptData = {};
  employees.forEach(([id, name, dept, salary]) => {
    if (!deptData[dept]) {
      deptData[dept] = { total: 0, count: 0 };
    }
    deptData[dept].total += salary;
    deptData[dept].count += 1;
  });
  const result = {};
  for (const dept in deptData) {
    result[dept] = deptData[dept].total / deptData[dept].count;
  }
  return result;
}

console.log(avgSalaryPerDept(employees));
```

```java
// Example: SQL-like operations implemented in Java for practice
import java.util.*;

public class DatabasePractice {
    static class Employee {
        int id;
        String name;
        String department;
        double salary;
        Employee(int id, String name, String department, double salary) {
            this.id = id; this.name = name
```
