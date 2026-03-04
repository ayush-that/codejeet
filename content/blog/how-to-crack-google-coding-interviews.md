---
title: "How to Crack Google Coding Interviews in 2026"
description: "Complete guide to Google coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-06-01"
category: "company-guide"
company: "google"
tags: ["google", "interview prep", "leetcode"]
---

Google's coding interview is widely regarded as one of the most rigorous in the industry. The process typically involves a recruiter phone screen, one or two technical phone interviews, and then an on-site loop of four to five rounds. Each coding round lasts about 45 minutes, and you are expected to write clean, working code — usually on a whiteboard or in a shared Google Doc. Beyond raw problem-solving, Google interviewers pay close attention to how you communicate your thought process, handle edge cases, and analyze time and space complexity.

What sets Google apart is the sheer breadth of its question bank and its willingness to test candidates on harder problems. If you are preparing for Google, you need depth across multiple topics, not just surface-level familiarity.

## By the Numbers

Google has one of the largest interview question pools of any company, with **2,217 questions** reported across LeetCode. The difficulty distribution tells an important story:

- **Easy: 588 questions (27%)**
- **Medium: 1,153 questions (52%)**
- **Hard: 476 questions (21%)**

That 21% hard rate is significant. Roughly one in five questions you might face will be a hard-level problem, which is higher than most other top tech companies. You should be comfortable with hard problems, not just able to recognize them. The medium category dominates at 52%, which means the bulk of your preparation should focus there — but never at the expense of ignoring the hard tier.

## Top Topics to Focus On

**Arrays** — Google loves array-based problems. Sliding window, two pointers, prefix sums, and subarray problems come up frequently. Make sure you can handle variations fluently, not just the textbook versions.

Let's look at a classic "Sliding Window" problem: **Maximum Sum Subarray of Size K**. This is a fundamental pattern that appears in many Google interview questions.

<div class="code-group">

```python
def max_sum_subarray_of_size_k(arr, k):
    """
    Given an array of integers and a number k,
    find the maximum sum of any contiguous subarray of size k.
    """
    if len(arr) < k:
        return -1  # Or handle error appropriately

    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide the window from start to end
    for i in range(k, len(arr)):
        window_sum = window_sum + arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum

# Example usage:
arr = [2, 1, 5, 1, 3, 2]
k = 3
print(max_sum_subarray_of_size_k(arr, k))  # Output: 9 (subarray [5, 1, 3])
```

```javascript
function maxSumSubarrayOfSizeK(arr, k) {
  /**
   * Given an array of integers and a number k,
   * find the maximum sum of any contiguous subarray of size k.
   */
  if (arr.length < k) {
    return -1; // Or handle error appropriately
  }

  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  // Slide the window from start to end
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Example usage:
const arr = [2, 1, 5, 1, 3, 2];
const k = 3;
console.log(maxSumSubarrayOfSizeK(arr, k)); // Output: 9 (subarray [5, 1, 3])
```

```java
public class MaxSumSubarray {
    public static int maxSumSubarrayOfSizeK(int[] arr, int k) {
        /**
         * Given an array of integers and a number k,
         * find the maximum sum of any contiguous subarray of size k.
         */
        if (arr.length < k) {
            return -1; // Or handle error appropriately
        }

        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        int maxSum = windowSum;

        // Slide the window from start to end
        for (int i = k; i < arr.length; i++) {
            windowSum = windowSum + arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }

        return maxSum;
    }

    public static void main(String[] args) {
        int[] arr = {2, 1, 5, 1, 3, 2};
        int k = 3;
        System.out.println(maxSumSubarrayOfSizeK(arr, k)); // Output: 9 (subarray [5, 1, 3])
    }
}
```

</div>

**Strings** — String manipulation, parsing, and pattern matching are staples. Pay attention to problems involving substrings, anagrams, and string transformations. Many Google string problems have a deceptive simplicity that hides tricky edge cases.

A common Google string problem is checking if two strings are **anagrams**. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

<div class="code-group">

```python
def is_anagram(s: str, t: str) -> bool:
    """
    Check if two strings are anagrams of each other.
    Time Complexity: O(n), where n is the length of the strings.
    Space Complexity: O(1) if we consider a fixed-size count array, or O(k) for k unique characters.
    """
    if len(s) != len(t):
        return False

    # Use a dictionary/hash map to count character frequencies
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1

    for char in t:
        if char not in char_count:
            return False
        char_count[char] -= 1
        if char_count[char] == 0:
            del char_count[char]

    # If all counts are zero, char_count will be empty
    return len(char_count) == 0

# Example usage:
s1, t1 = "anagram", "nagaram"
print(is_anagram(s1, t1))  # Output: True

s2, t2 = "rat", "car"
print(is_anagram(s2, t2))  # Output: False
```

```javascript
function isAnagram(s, t) {
  /**
   * Check if two strings are anagrams of each other.
   * Time Complexity: O(n), where n is the length of the strings.
   * Space Complexity: O(k) for k unique characters.
   */
  if (s.length !== t.length) {
    return false;
  }

  // Use a Map to count character frequencies
  const charCount = new Map();
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (const char of t) {
    if (!charCount.has(char)) {
      return false;
    }
    const newCount = charCount.get(char) - 1;
    if (newCount === 0) {
      charCount.delete(char);
    } else {
      charCount.set(char, newCount);
    }
  }

  // If all counts are zero, charCount will be empty
  return charCount.size === 0;
}

// Example usage:
const s1 = "anagram",
  t1 = "nagaram";
console.log(isAnagram(s1, t1)); // Output: true

const s2 = "rat",
  t2 = "car";
console.log(isAnagram(s2, t2)); // Output: false
```

```java
import java.util.HashMap;
import java.util.Map;

public class AnagramCheck {
    public static boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams of each other.
         * Time Complexity: O(n), where n is the length of the strings.
         * Space Complexity: O(k) for k unique characters.
         */
        if (s.length() != t.length()) {
            return false;
        }

        // Use a HashMap to count character frequencies
        Map<Character, Integer> charCount = new HashMap<>();
        for (char c : s.toCharArray()) {
            charCount.put(c, charCount.getOrDefault(c, 0) + 1);
        }

        for (char c : t.toCharArray()) {
            if (!charCount.containsKey(c)) {
                return false;
            }
            int newCount = charCount.get(c) - 1;
            if (newCount == 0) {
                charCount.remove(c);
            } else {
                charCount.put(c, newCount);
            }
        }

        // If all counts are zero, charCount will be empty
        return charCount.isEmpty();
    }

    public static void main(String[] args) {
        String s1 = "anagram", t1 = "nagaram";
        System.out.println(isAnagram(s1, t1)); // Output: true

        String s2 = "rat", t2 = "car";
        System.out.println(isAnagram(s2, t2)); // Output: false
    }
}
```

</div>

**Hash Tables** — Hashing is fundamental to efficient solutions across nearly every topic. If your first instinct on a problem is not to consider whether a hash map could help, you need to retrain that instinct. Google frequently tests problems where the optimal solution hinges on clever use of hash maps.

A classic problem is the **Two Sum** problem, which is a perfect example of using a hash map to achieve O(n) time complexity.

<div class="code-group">

```python
def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    Assumes exactly one solution and you may not use the same element twice.
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    num_to_index = {}  # Hash map to store number -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i

    # According to problem constraints, we should never reach here
    return []

# Example usage:
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # Output: [0, 1]
```

```javascript
function twoSum(nums, target) {
  /**
   * Given an array of integers nums and an integer target,
   * return indices of the two numbers such that they add up to target.
   * Assumes exactly one solution and you may not use the same element twice.
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  const numToIndex = new Map(); // Hash map to store number -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numToIndex.has(complement)) {
      return [numToIndex.get(complement), i];
    }
    numToIndex.set(nums[i], i);
  }

  // According to problem constraints, we should never reach here
  return [];
}

// Example usage:
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Output: [0, 1]
```

```java
import java.util.HashMap;
import java.util.Map;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        /**
         * Given an array of integers nums and an integer target,
         * return indices of the two numbers such that they add up to target.
         * Assumes exactly one solution and you may not use the same element twice.
         * Time Complexity: O(n)
         * Space Complexity: O(n)
         */
        Map<Integer, Integer> numToIndex = new HashMap<>(); // Hash map to store number -> index

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numToIndex.containsKey(complement)) {
                return new int[]{numToIndex.get(complement), i};
            }
            numToIndex.put(nums[i], i);
        }

        // According to problem constraints, we should never reach here
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("[" + result[0] + ", " + result[1] + "]"); // Output: [0, 1]
    }
}
```

</div>

**Dynamic Programming** — This is where Google separates strong candidates from average ones. Expect DP problems that go beyond the classic knapsack and coin change templates. Practice 2D DP, interval DP, and problems that combine DP with other techniques like binary search or graph traversal.

Let's examine a foundational 1D DP problem: **Climbing Stairs**. You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

<div class="code-group">

```python
def climb_stairs(n: int) -> int:
    """
    Returns the number of distinct ways to climb to the top of n stairs,
    taking 1 or 2 steps at a time.
    This is essentially the Fibonacci sequence.
    Time Complexity: O(n)
    Space Complexity: O(1) with optimized approach
    """
    if n <= 2:
        return n

    # dp[i] represents number of ways to reach step i
    # We only need to keep track of the last two values
    prev1, prev2 = 2, 1  # Ways to reach step 2 and step 1

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current

    return prev1

# Example usage:
print(climb_stairs(2))  # Output: 2 (1+1, 2)
print(climb_stairs(3))  # Output: 3 (1+1+1, 1+2, 2+1)
print(climb_stairs(5))  # Output: 8
```

```javascript
function climbStairs(n) {
  /**
   * Returns the number of distinct ways to climb to the top of n stairs,
   * taking 1 or 2 steps at a time.
   * This is essentially the Fibonacci sequence.
   * Time Complexity: O(n)
   * Space Complexity: O(1) with optimized approach
   */
  if (n <= 2) {
    return n;
  }

  // dp[i] represents number of ways to reach step i
  // We only need to keep track of the last two values
  let prev1 = 2; // Ways to reach step 2
  let prev2 = 1; // Ways to reach step 1

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example usage:
console.log(climbStairs(2)); // Output: 2 (1+1, 2)
console.log(climbStairs(3)); // Output: 3 (1+1+1, 1+2, 2+1)
console.log(climbStairs(5)); // Output: 8
```

```java
public class ClimbingStairs {
    public static int climbStairs(int n) {
        /**
         * Returns the number of distinct ways to climb to the top of n stairs,
         * taking 1 or 2 steps at a time.
         * This is essentially the Fibonacci sequence.
         * Time Complexity: O(n)
         * Space Complexity: O(1) with optimized approach
         */
        if (n <= 2) {
            return n;
        }

        // dp[i] represents number of ways to reach step i
        // We only need to keep track of the last two values
        int prev1 = 2; // Ways to reach step 2
        int prev2 = 1; // Ways to reach step 1

        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }

        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(2)); // Output: 2 (1+1, 2)
        System.out.println(climbStairs(3)); // Output: 3 (1+1+1, 1+2, 2+1)
        System.out.println(climbStairs(5)); // Output: 8
    }
}
```

</div>

**Math** — Number theory, combinatorics, modular arithmetic, and geometry-adjacent problems appear more often at Google than at many other companies. Do not skip this category — a math problem in a Google interview is not unusual, and being unprepared for it can cost you a round.

A common math problem is checking if a number is a **prime number**. While a naive solution checks divisibility up to n-1, an optimized approach only checks up to the square root of n.

<div class="code-group">

```python
import math

def is_prime(n: int) -> bool:
    """
    Check if a number is prime.
    A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
    Time Complexity: O(sqrt(n))
    Space Complexity: O(1)
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False

    # Check for factors from 5 to sqrt(n)
    # We can skip even numbers and multiples of 3 by using 6k ± 1 optimization
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

# Example usage:
print(is_prime(2))   # Output: True
print(is_prime(17))  # Output: True
print(is_prime(49))  # Output: False (7*7)
print(is_prime(1))   # Output: False
```

```javascript
function isPrime(n) {
  /**
   * Check if a number is prime.
   * A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
   * Time Complexity: O(sqrt(n))
   * Space Complexity: O(1)
   */
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  // Check for factors from 5 to sqrt(n)
  // We can skip even numbers and multiples of 3 by using 6k ± 1 optimization
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
    i += 6;
  }
  return true;
}

// Example usage:
console.log(isPrime(2)); // Output: true
console.log(isPrime(17)); // Output: true
console.log(isPrime(49)); // Output: false (7*7)
console.log(isPrime(1)); // Output: false
```

```java
public class PrimeCheck {
    public static boolean isPrime(int n) {
        /**
         * Check if a number is prime.
         * A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
         * Time Complexity: O(sqrt(n))
         * Space Complexity: O(1)
         */
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;

        // Check for factors from 5 to sqrt(n)
        // We can skip even numbers and multiples of 3 by using 6k ± 1 optimization
        int i = 5;
        while (i * i <= n) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
            i += 6;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(2));   // Output: true
        System.out.println(isPrime(17));  // Output: true
        System.out.println(isPrime(49));  // Output: false (7*7)
        System.out.println(isPrime(1));   // Output: false
    }
}
```

</div>

## Preparation Strategy

**Weeks 1-2: Build the Foundation.** Solve 8-10 problems per day focusing on arrays, strings, and hash tables. Prioritize medium difficulty. For each problem, write out the brute force approach first, then optimize. Time yourself — aim for under 25 minutes per medium problem by the end of week two.

**Week 3: Dynamic Programming Deep Dive.** Dedicate an entire week to DP. Start with 1D problems (climbing stairs, house robber), move to 2D (unique paths, edit distance), then tackle harder variants (burst balloons, regular expression matching). Solve at least 30 DP problems this week.

Let's look at a classic 2D DP problem: **Unique Paths**. A robot is located at the top-left corner of an `m x n` grid. The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid. How many possible unique paths are there?

<div class="code-group">

```python
def unique_paths(m: int, n: int) -> int:
    """
    Returns the number of unique paths from top-left to bottom-right
    in an m x n grid, moving only down or right.
    Time Complexity: O(m * n)
    Space Complexity: O(n) with optimized DP
    """
    # Create a 1D DP array representing the current row
    dp = [1] * n

    # For each row (starting from the second row)
    for i in range(1, m):
        # For each column in the current row
        for j in range(1, n):
            # dp[j] (new) = dp[j] (old, from above) + dp[j-1] (from left)
            dp[j] = dp[j] + dp[j - 1]

    return dp[n - 1]

# Example usage:
print(unique_paths(3, 7))  # Output: 28
print(unique_paths(3, 2))  # Output: 3
```

```javascript
function uniquePaths(m, n) {
  /**
   * Returns the number of unique paths from top-left to bottom-right
   * in an m x n grid, moving only down or right.
   * Time Complexity: O(m * n)
   * Space Complexity: O(n) with optimized DP
   */
  // Create a 1D DP array representing the current row
  let dp = new Array(n).fill(1);

  // For each row (starting from the second row)
  for (let i = 1; i < m; i++) {
    // For each column in the current row
    for (let j = 1; j < n; j++) {
      // dp[j] (new) = dp[j] (old, from above) + dp[j-1] (from left)
      dp[j] = dp[j] + dp[j - 1];
    }
  }

  return dp[n - 1];
}

// Example usage:
console.log(uniquePaths(3, 7)); // Output: 28
console.log(uniquePaths(3, 2)); // Output: 3
```

```java
public class UniquePaths {
    public static int uniquePaths(int m, int n) {
        /**
         * Returns the number of unique paths from top-left to bottom-right
         * in an m x n grid, moving only down or right.
         * Time Complexity: O(m * n)
         * Space Complexity: O(n) with optimized DP
         */
        // Create a 1D DP array representing the current row
        int[] dp = new int[n];
        for (int j = 0; j < n; j++) {
            dp[j] = 1;
        }

        // For each row (starting from the second row)
        for (int i = 1; i < m; i++) {
            // For each column in the current row
            for (int j = 1; j < n; j++) {
                // dp[j] (new) = dp[j] (old, from above) + dp[j-1] (from left)
                dp[j] = dp[j] + dp[j - 1];
            }
        }

        return dp[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 7)); // Output: 28
        System.out.println(uniquePaths(3, 2)); // Output: 3
    }
}
```

</div>

**Week 4: Graphs, Trees, and Recursion.** Google frequently tests tree traversal variants, graph search (BFS/DFS), and problems involving connected components or shortest paths. Practice at least 20 graph and tree problems, including hard-level ones.

A fundamental graph traversal algorithm is **Breadth-First Search (BFS)**. Let's implement BFS to traverse a graph represented as an adjacency list.

<div class="code-group">

```python
from collections import deque

def bfs(graph, start):
    """
    Perform Breadth-First Search on a graph.
    graph: adjacency list representation (dict of list)
    start: starting node
    Returns: list of nodes in BFS order
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    """
    visited = set()
    queue = deque([start])
    result = []

    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            result.append(node)
            # Add all unvisited neighbors to the queue
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    queue.append(neighbor)

    return result

# Example usage:
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
print(bfs(graph, 'A'))  # Output: ['A', 'B', 'C', 'D', 'E', 'F']
```

```javascript
function bfs(graph, start) {
  /**
   * Perform Breadth-First Search on a graph.
   * graph: adjacency list representation (object with array values)
   * start: starting node
   * Returns: array of nodes in BFS order
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   */
  const visited = new Set();
  const queue = [start];
  const result = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      // Add all unvisited neighbors to the queue
      const neighbors = graph[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return result;
}

// Example usage:
const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"],
};
console.log(bfs(graph, "A")); // Output: ['A', 'B', 'C', 'D', 'E', 'F']
```

```java
import java.util.*;

public class BFS {
    public static List<String> bfs(Map<String, List<String>> graph, String start) {
        /**
         * Perform Breadth-First Search on a graph.
         * graph: adjacency list representation
         * start: starting node
         * Returns: list of nodes in BFS order
         * Time Complexity: O(V + E)
         * Space Complexity: O(V)
         */
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        List<String> result = new ArrayList<>();

        queue.add(start);

        while (!queue.isEmpty()) {
            String node = queue.poll();
            if (!visited.contains(node)) {
                visited.add(node);
                result.add(node);
                // Add all unvisited neighbors to the queue
                List<String> neighbors = graph.getOrDefault(node, new ArrayList<>());
                for (String neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        queue.add(neighbor);
                    }
                }
            }
        }

        return result;
    }

    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D", "E"));
        graph.put("C", Arrays.asList("A", "F"));
        graph.put("D", Arrays.asList("B"));
        graph.put("E", Arrays.asList("B", "F"));
        graph.put("F", Arrays.asList("C", "E"));

        System.out.println(bfs(graph, "A")); // Output: [A, B, C, D, E, F]
    }
}
```

</div>

**Week 5: Math, Bit Manipulation, and Mixed Topics.** Cover the less common but still important topics. Solve math problems involving GCD, primes, and combinatorics. Practice bit manipulation basics. Do 5-10 hard problems from random topics to build comfort with unfamiliar problem types.

Let's look at a bit manipulation problem: **Counting the number of 1 bits** (also known as Hamming weight). This is a common interview question that tests your understanding of bitwise operations.

<div class="code-group">

```python
def hamming_weight(n: int) -> int:
    """
    Returns the number of '1' bits in the binary representation of a non-negative integer.
    This is also known as the Hamming weight or popcount.
    Time Complexity: O(k) where k is the number of bits (32 for 32-bit integers)
    Space Complexity: O(1)
    """
    count = 0
    while n:
        # n & (n-1) clears the least significant 1-bit
        n = n & (n - 1)
        count += 1
    return count

# Alternative approach using built-in function
def hamming_weight_builtin(n: int) -> int:
    return bin(n).count('1')

# Example usage:
print(hamming_weight(11))    # 11 in binary is 1011 -> Output: 3
print(hamming_weight(128))   # 128 in binary is 10000000 -> Output: 1
print(hamming_weight(2147483645))  # Output: 30
```

```javascript
function hammingWeight(n) {
  /**
   * Returns the number of '1' bits in the binary representation of a non-negative integer.
   * This is also known as the Hamming weight or popcount.
   * Time Complexity: O(k) where k is the number of bits (32 for 32-bit integers)
   * Space Complexity: O(1)
   */
  let count = 0;
  while (n !== 0) {
    // n & (n-1) clears the least significant 1-bit
    n = n & (n - 1);
    count++;
  }
  return count;
}

// Alternative approach using built-in function
function hammingWeightBuiltin(n) {
  return n.toString(2).split("0").join("").length;
}

// Example usage:
console.log(hammingWeight(11)); // 11 in binary is 1011 -> Output: 3
console.log(hammingWeight(128)); // 128 in binary is 10000000 -> Output: 1
console.log(hammingWeight(2147483645)); // Output: 30
```

```java
public class HammingWeight {
    public static int hammingWeight(int n) {
        /**
         * Returns the number of '1' bits in the binary representation of a non-negative integer.
         * This is also known as the Hamming weight or popcount.
         * Time Complexity: O(k) where k is the number of bits (32 for 32-bit integers)
         * Space Complexity: O(1)
         */
        int count = 0;
        while (n != 0) {
            // n & (n-1) clears the least significant 1-bit
            n = n & (n - 1);
            count++;
        }
        return count;
    }

    // Alternative approach using built-in function
    public static int hammingWeightBuiltin(int n) {
        return Integer.bitCount(n);
    }

    public static void main(String[] args) {
        System.out.println(hammingWeight(11));    // 11 in binary is 1011 -> Output: 3
        System.out.println(hammingWeight(128));   // 128 in binary is 10000000 -> Output: 1
        System.out.println(hammingWeight(2147483645));  // Output: 30
    }
}
```

</div>

**Week 6: Mock Interviews and Review.** Do at least 4 full mock interviews (timed, 45 minutes, no hints). Review every problem you struggled with during the previous five weeks. Focus on articulating your thought process out loud — Google cares deeply about how you communicate while solving.

## Key Tips

1. **Always discuss complexity.** Google interviewers expect you to proactively analyze time and space complexity after presenting a solution. Do not wait to be asked. Practice stating complexity for every problem you solve. For example, when solving the Two Sum problem with a hash map, you should immediately state: "This solution has O(n) time complexity because we iterate through the array once, and O(n) space complexity in the worst case to store all elements in the hash map."

2. **Do not jump to code immediately.** Spend the first 5-10 minutes understanding the problem, clarifying constraints, and discussing your approach. Google rewards structured thinking over speed. Ask clarifying questions like: "What is the expected input size?" "Can the input contain negative numbers?" "What should we return if no solution exists?" "Are there any memory constraints?"

3. **Prepare for follow-ups.** Google interviewers commonly extend problems. After you solve the base case, expect a harder variant — what if the input is a stream? What if it does not fit in memory? What if you need to optimize further? Practice thinking one step ahead. For example, after solving the basic Two Sum problem, you might be asked: "What if the input is too large to fit in memory?" (Answer: You might need to use external sorting or a distributed hash map.)

4. **Write clean, modular code.** Even though you may be coding in a doc or on a whiteboard, use meaningful variable names and break logic into helper functions. Google values code readability. For example, instead of writing a monolithic function, separate concerns: validation logic, core algorithm, and result formatting.

5. **Do not neglect system design if you are mid-level or above.** While this guide focuses on coding, L4+ candidates will face at least one system design round. Prepare for that separately. Common Google system design questions include designing YouTube, Google Search, Google Docs, or distributed key-value stores like Bigtable.

[Browse
