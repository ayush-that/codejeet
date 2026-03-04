---
title: "10 Common Coding Interview Mistakes and How to Avoid Them"
description: "From jumping into code too quickly to ignoring edge cases — the most frequent interview mistakes and practical fixes."
date: "2026-07-30"
category: "tips"
tags: ["interview tips", "mistakes", "career", "interview prep"]
---

Technical interviews are not just about solving the problem. Plenty of candidates who know the algorithm still fail because of how they approach the interview. These are the ten mistakes that come up most often.

## 1. Jumping Into Code Without a Plan

You read the problem and start typing. Three minutes later, your approach does not work, but you have 20 lines committed.

**Fix:** Spend 3-5 minutes on a plan. State the approach out loud. Write pseudocode. Only code when the interviewer confirms your direction.

**Practical Depth:** A good plan involves identifying the core algorithm or data structure. For example, if the problem is "Find two numbers in an array that sum to a target," your plan should explicitly state you'll use a hash map for O(1) lookups. Write this as pseudocode before touching the keyboard.

**Pseudocode Example for Two Sum:**

```
function twoSum(nums, target):
    create an empty map (value -> index)
    for each index i and number num in nums:
        calculate complement = target - num
        if complement is in map:
            return [map[complement], i]
        else:
            add num and i to the map
    return empty list (no solution found)
```

## 2. Not Clarifying the Problem

Interviewers leave requirements vague deliberately. Wrong assumptions mean solving the wrong problem.

**Fix:** Ask: "Can the array contain negatives?" "Is the string ASCII?" "What if there are multiple valid answers?" Write down agreed constraints.

**Practical Depth:** Different constraints lead to different optimal solutions. For a "find the maximum subarray sum" problem (Kadane's Algorithm), clarifying if all numbers can be negative changes the base logic. Always confirm input size, value ranges, and expected output format.

<div class="code-group">

```python
# Example: Clarifying if we need to handle all-negative arrays for Kadane's Algorithm
def max_subarray_sum(nums):
    """
    Assumptions clarified: Input can contain negatives.
    If all numbers are negative, return the least negative (maximum) number.
    """
    if not nums:
        return 0  # Or handle as per clarified requirement

    current_max = global_max = nums[0]
    for num in nums[1:]:
        current_max = max(num, current_max + num)
        global_max = max(global_max, current_max)
    return global_max
```

```javascript
// Example: Clarifying if we need to handle all-negative arrays for Kadane's Algorithm
function maxSubarraySum(nums) {
  /**
   * Assumptions clarified: Input can contain negatives.
   * If all numbers are negative, return the least negative (maximum) number.
   */
  if (nums.length === 0) return 0; // Or handle as per clarified requirement

  let currentMax = nums[0];
  let globalMax = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}
```

```java
// Example: Clarifying if we need to handle all-negative arrays for Kadane's Algorithm
public int maxSubarraySum(int[] nums) {
    /**
     * Assumptions clarified: Input can contain negatives.
     * If all numbers are negative, return the least negative (maximum) number.
     */
    if (nums == null || nums.length == 0) return 0; // Or handle as per clarified requirement

    int currentMax = nums[0];
    int globalMax = nums[0];

    for (int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        globalMax = Math.max(globalMax, currentMax);
    }
    return globalMax;
}
```

</div>

## 3. Not Walking Through Examples

Jumping from reading to coding without tracing examples leads to bugs you could have caught early.

**Fix:** Walk through given examples step by step. Create your own edge case (empty input, single element) and trace through that too.

**Practical Depth:** Use a systematic method. For a binary search problem, take the example array `[1, 3, 5, 7, 9]` and target `5`. Manually trace the indices (low, high, mid) and value comparisons. This reveals the loop condition (`low <= high`) and how to update pointers (`mid ± 1`).

<div class="code-group">

```python
# Binary Search with manual tracing example
def binary_search(arr, target):
    """
    Example Walkthrough for arr = [1, 3, 5, 7, 9], target = 5
    Step 1: low=0, high=4, mid=2 -> arr[2]=5 == target -> return 2
    """
    low, high = 0, len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

```javascript
// Binary Search with manual tracing example
function binarySearch(arr, target) {
  /**
   * Example Walkthrough for arr = [1, 3, 5, 7, 9], target = 5
   * Step 1: low=0, high=4, mid=2 -> arr[2]=5 == target -> return 2
   */
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}
```

```java
// Binary Search with manual tracing example
public int binarySearch(int[] arr, int target) {
    /**
     * Example Walkthrough for arr = [1, 3, 5, 7, 9], target = 5
     * Step 1: low=0, high=4, mid=2 -> arr[2]=5 == target -> return 2
     */
    int low = 0;
    int high = arr.length - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents potential overflow
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}
```

</div>

## 4. Poor Time Management

Spending 25 minutes on approach with 5 minutes left to code. Or finishing code with no time to test.

**Fix:** For a 45-minute interview: 5 min understand, 5 min plan, 20 min code, 10 min test, 5 min follow-ups. If stuck after 10 minutes, ask for a hint.

**Practical Depth:** Break down the coding phase. For a medium problem like "Implement a stack with getMin() in O(1) time," you should allocate time to define the class structure, implement core methods (push, pop, top, getMin), and then test. Having a mental checklist for each phase prevents over-investing in one part.

## 5. Coding in Silence

Fifteen minutes of quiet typing. The interviewer has no idea what you are thinking.

**Fix:** Narrate continuously. "I am iterating with two pointers. Left starts at 0, right at the end." Verbalizing forces clearer thinking and helps the interviewer give useful hints.

**Practical Depth:** Good narration includes stating your intent, explaining data structure choices, and acknowledging trade-offs. For example, while solving a sliding window problem: "I'll use a hash map to track character frequencies in the current window. This gives O(1) lookups but uses O(k) space for the window size."

<div class="code-group">

```python
# Solving "Longest Substring Without Repeating Characters" with narration
def length_of_longest_substring(s: str) -> int:
    # Narration: "I'll use a sliding window with a set to track unique characters."
    char_set = set()
    left = 0
    max_length = 0

    # Narration: "Right pointer expands the window."
    for right in range(len(s)):
        # Narration: "If duplicate found, shrink window from left until it's gone."
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # Narration: "Add current char and update max length."
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Solving "Longest Substring Without Repeating Characters" with narration
function lengthOfLongestSubstring(s) {
  // Narration: "I'll use a sliding window with a set to track unique characters."
  const charSet = new Set();
  let left = 0;
  let maxLength = 0;

  // Narration: "Right pointer expands the window."
  for (let right = 0; right < s.length; right++) {
    // Narration: "If duplicate found, shrink window from left until it's gone."
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    // Narration: "Add current char and update max length."
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
// Solving "Longest Substring Without Repeating Characters" with narration
public int lengthOfLongestSubstring(String s) {
    // Narration: "I'll use a sliding window with a set to track unique characters."
    Set<Character> charSet = new HashSet<>();
    int left = 0;
    int maxLength = 0;

    // Narration: "Right pointer expands the window."
    for (int right = 0; right < s.length(); right++) {
        // Narration: "If duplicate found, shrink window from left until it's gone."
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        // Narration: "Add current char and update max length."
        charSet.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

## 6. Overcomplicating the Solution

Reaching for a segment tree when a prefix sum works.

**Fix:** Start with the simplest approach. State the brute force first: "The naive approach is O(n^2). I can optimize to O(n) with a hash map." Interviewers appreciate seeing you identify the simple solution before optimizing.

**Practical Depth:** For the problem "Find a subarray with a given sum," the brute force checks all subarrays (O(n²)). The optimal approach uses a hash map with prefix sums (O(n)). Demonstrating this progression shows structured problem-solving.

<div class="code-group">

```python
# Subarray Sum Equals K - From Brute Force to Optimal
def subarray_sum_brute_force(nums, k):
    """Brute Force O(n^2) approach."""
    count = 0
    n = len(nums)
    for start in range(n):
        current_sum = 0
        for end in range(start, n):
            current_sum += nums[end]
            if current_sum == k:
                count += 1
    return count

def subarray_sum_optimal(nums, k):
    """Optimal O(n) approach using prefix sum hash map."""
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency of occurrences
    prefix_map = {0: 1}  # Base case: prefix sum 0 appears once

    for num in nums:
        prefix_sum += num
        # Check if (prefix_sum - k) exists in map
        count += prefix_map.get(prefix_sum - k, 0)
        # Update the frequency of the current prefix sum
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1
    return count
```

```javascript
// Subarray Sum Equals K - From Brute Force to Optimal
function subarraySumBruteForce(nums, k) {
  /** Brute Force O(n^2) approach. */
  let count = 0;
  const n = nums.length;
  for (let start = 0; start < n; start++) {
    let currentSum = 0;
    for (let end = start; end < n; end++) {
      currentSum += nums[end];
      if (currentSum === k) {
        count++;
      }
    }
  }
  return count;
}

function subarraySumOptimal(nums, k) {
  /** Optimal O(n) approach using prefix sum hash map. */
  let count = 0;
  let prefixSum = 0;
  // Map: prefix_sum_value -> frequency of occurrences
  const prefixMap = new Map();
  prefixMap.set(0, 1); // Base case: prefix sum 0 appears once

  for (const num of nums) {
    prefixSum += num;
    // Check if (prefixSum - k) exists in map
    if (prefixMap.has(prefixSum - k)) {
      count += prefixMap.get(prefixSum - k);
    }
    // Update the frequency of the current prefix sum
    prefixMap.set(prefixSum, (prefixMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
// Subarray Sum Equals K - From Brute Force to Optimal
public class SubarraySum {
    // Brute Force O(n^2) approach.
    public int subarraySumBruteForce(int[] nums, int k) {
        int count = 0;
        int n = nums.length;
        for (int start = 0; start < n; start++) {
            int currentSum = 0;
            for (int end = start; end < n; end++) {
                currentSum += nums[end];
                if (currentSum == k) {
                    count++;
                }
            }
        }
        return count;
    }

    // Optimal O(n) approach using prefix sum hash map.
    public int subarraySumOptimal(int[] nums, int k) {
        int count = 0;
        int prefixSum = 0;
        // Map: prefix_sum_value -> frequency of occurrences
        Map<Integer, Integer> prefixMap = new HashMap<>();
        prefixMap.put(0, 1); // Base case: prefix sum 0 appears once

        for (int num : nums) {
            prefixSum += num;
            // Check if (prefixSum - k) exists in map
            count += prefixMap.getOrDefault(prefixSum - k, 0);
            // Update the frequency of the current prefix sum
            prefixMap.put(prefixSum, prefixMap.getOrDefault(prefixSum, 0) + 1);
        }
        return count;
    }
}
```

</div>

## 7. Ignoring Edge Cases

Your solution works for the happy path but crashes on empty input, single elements, or all-negative numbers.

**Fix:** After coding, check a mental list: empty input, single element, all same values, large values, negative numbers. For strings: empty string, single character. Handle these or acknowledge them verbally.

**Practical Depth:** Create a standard edge case checklist. For array/list problems: `[]`, `[1]`, `[1,1,1]`, `[0,0,0]`, `[-1,-2,-3]`, large `n`. For tree problems: `null` root, single node, skewed tree (like a linked list). For graph problems: single node, disconnected graph, cycles.

<div class="code-group">

```python
# Example: Handling edge cases in a function to find the second largest number
def find_second_largest(nums):
    """Handles edge cases explicitly."""
    if not nums or len(nums) < 2:
        # Clarify what to return: None, -1, or raise exception?
        return None  # Based on clarified requirement

    first = second = float('-inf')
    for num in nums:
        if num > first:
            second = first
            first = num
        elif num > second and num != first:
            second = num

    # Edge case: all elements are the same
    if second == float('-inf'):
        return None  # No distinct second largest

    return second
```

```javascript
// Example: Handling edge cases in a function to find the second largest number
function findSecondLargest(nums) {
  /** Handles edge cases explicitly. */
  if (!nums || nums.length < 2) {
    // Clarify what to return: null, -1, or throw error?
    return null; // Based on clarified requirement
  }

  let first = -Infinity;
  let second = -Infinity;

  for (const num of nums) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }

  // Edge case: all elements are the same
  if (second === -Infinity) {
    return null; // No distinct second largest
  }

  return second;
}
```

```java
// Example: Handling edge cases in a function to find the second largest number
public Integer findSecondLargest(int[] nums) {
    /** Handles edge cases explicitly. */
    if (nums == null || nums.length < 2) {
        // Clarify what to return: null, -1, or throw exception?
        return null; // Based on clarified requirement
    }

    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;

    for (int num : nums) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num != first) {
            second = num;
        }
    }

    // Edge case: all elements are the same
    if (second == Integer.MIN_VALUE) {
        return null; // No distinct second largest
    }

    return second;
}
```

</div>

## 8. Not Testing Your Code

You write the solution and declare "I think that works."

**Fix:** Trace through your code line by line with a small example, tracking variable values. Then test an edge case. Finding and fixing bugs during testing is a positive signal.

**Practical Depth:** Use a systematic testing method. For a function that reverses a linked list, test with: a list of multiple nodes (`1->2->3`), a single node (`5`), and an empty list (`null`). For each test, manually step through the pointer manipulations.

<div class="code-group">

```python
# Example: Testing a linked list reversal thoroughly
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    """Iteratively reverses a linked list."""
    prev = None
    current = head

    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    return prev  # New head

# Test Cases to walk through:
# 1. Multiple nodes: 1 -> 2 -> 3 -> None
#    Step: prev=None, curr=1 -> prev=1, curr=2 -> prev=2, curr=3 -> prev=3, curr=None
#    Returns: 3 -> 2 -> 1 -> None
# 2. Single node: 5 -> None
#    Step: prev=None, curr=5 -> prev=5, curr=None
#    Returns: 5 -> None
# 3. Empty list: None
#    Step: loop never enters, returns None
```

```javascript
// Example: Testing a linked list reversal thoroughly
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  /** Iteratively reverses a linked list. */
  let prev = null;
  let current = head;

  while (current) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  return prev; // New head
}

// Test Cases to walk through:
// 1. Multiple nodes: 1 -> 2 -> 3 -> null
//    Step: prev=null, curr=1 -> prev=1, curr=2 -> prev=2, curr=3 -> prev=3, curr=null
//    Returns: 3 -> 2 -> 1 -> null
// 2. Single node: 5 -> null
//    Step: prev=null, curr=5 -> prev=5, curr=null
//    Returns: 5 -> null
// 3. Empty list: null
//    Step: loop never enters, returns null
```

```java
// Example: Testing a linked list reversal thoroughly
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class ReverseLinkedList {
    public ListNode reverseList(ListNode head) {
        /** Iteratively reverses a linked list. */
        ListNode prev = null;
        ListNode current = head;

        while (current != null) {
            ListNode nextTemp = current.next;
            current.next = prev;
            prev = current;
            current = nextTemp;
        }
        return prev; // New head
    }

    // Test Cases to walk through:
    // 1. Multiple nodes: 1 -> 2 -> 3 -> null
    //    Step: prev=null, curr=1 -> prev=1, curr=2 -> prev=2, curr=3 -> prev=3, curr=null
    //    Returns: 3 -> 2 -> 1 -> null
    // 2. Single node: 5 -> null
    //    Step: prev=null, curr=5 -> prev=5, curr=null
    //    Returns: 5 -> null
    // 3. Empty list: null
    //    Step: loop never enters, returns null
}
```

</div>

## 9. Giving Up Too Easily

You hit a wall and say "I do not know."

**Fix:** Verbalize what you know: "I need to find pairs summing to K. A hash map gives O(n) lookups. I am not sure about duplicates." Try brute force as a starting point. Ask clarifying questions about the sticking point.

**Practical Depth:** When stuck, decompose the problem. For "Find the median of two sorted arrays," start by discussing the naive approach: merge both arrays and find the median (O(m+n) time, O(m+n) space). Then discuss the optimization challenge: achieving O(log(min(m, n))) with binary search. This shows engagement even if the optimal solution isn't fully formed.

## 10. Not Analyzing Complexity

The interviewer asks "What is the time complexity?" and you guess wrong.

**Fix:** Practice analyzing every solution you write. State complexity proactively: "The outer loop is O(n), hash lookup is O(1), so total is O(n). Space is O(n) for the map." See the [time complexity reference](/blog/time-complexity-analysis-quick-reference) for details.

**Practical Depth:** Complexity analysis must consider worst-case, average-case, and amortized time. For example, operations on a dynamic array (like Python list) have amortized O(1) for `append`. Also, remember to analyze auxiliary space (extra space used by the algorithm) separately from input space.

<div class="code-group">

```python
# Example: Complexity analysis for a graph BFS
from collections import deque

def bfs_shortest_path(graph, start, end):
    """
    Time Complexity: O(V + E)
    - Each vertex (V) is enqueued/dequeued once -> O(V)
    - Each edge (E) is examined once in adjacency list traversal -> O(E)
    Space Complexity: O(V)
    - Queue can hold up to V vertices in worst case.
    - Visited set holds up to V vertices.
    """
    if start == end:
        return [start]

    visited = {start}
    queue = deque([(start, [start])])  # (node, path)

    while queue:
        node, path = queue.popleft()
        for neighbor in graph.get(node, []):
            if neighbor == end:
                return path + [neighbor]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return []  # No path
```

```javascript
// Example: Complexity analysis for a graph BFS
function bfsShortestPath(graph, start, end) {
  /**
   * Time Complexity: O(V + E)
   * - Each vertex (V) is enqueued/dequeued once -> O(V)
   * - Each edge (E) is examined once in adjacency list traversal -> O(E)
   * Space Complexity: O(V)
   * - Queue can hold up to V vertices in worst case.
   * - Visited set holds up to V vertices.
   */
  if (start === end) return [start];

  const visited = new Set([start]);
  const queue = [[start, [start]]]; // [node, path]

  while (queue.length > 0) {
    const [node, path] = queue.shift(); // Note: shift() is O(n), better to use a proper queue class
    for (const neighbor of graph[node] || []) {
      if (neighbor === end) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  return []; // No path
}
```

```java
// Example: Complexity analysis for a graph BFS
import java.util.*;

public class GraphBFS {
    public List<Integer> bfsShortestPath(Map<Integer, List<Integer>> graph, int start, int end) {
        /**
         * Time Complexity: O(V + E)
         * - Each vertex (V) is enqueued/dequeued once -> O(V)
         * - Each edge (E) is examined once in adjacency list traversal -> O(E)
         * Space Complexity: O(V)
         * - Queue can hold up to V vertices in worst case.
         * - Visited set holds up to V vertices.
         */
        if (start == end) {
            return Arrays.asList(start);
        }

        Set<Integer> visited = new HashSet<>();
        visited.add(start);
        // Queue stores pairs of (node, path)
        Queue<Pair> queue = new LinkedList<>();
        queue.offer(new Pair(start, Arrays.asList(start)));

        while (!queue.isEmpty()) {
            Pair current = queue.poll();
            int node = current.node;
            List<Integer> path = current.path;

            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (neighbor == end) {
                    List<Integer> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    return newPath;
                }
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    List<Integer> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    queue.offer(new Pair(neighbor, newPath));
                }
            }
        }
        return new ArrayList<>(); // No path
    }

    static class Pair {
        int node;
        List<Integer> path;
        Pair(int node, List<Integer> path) {
            this.node = node;
            this.path = path;
        }
    }
}
```

</div>

## The Process

Build a reliable process and practice it during every LeetCode session:

1.  **Read and clarify (2-3 min):** Restate the problem in your own words. Ask specific questions about input constraints, edge cases, and output format. Write down the agreed assumptions.
2.  **Work through examples (3 min):** Use the given examples. Then create your own small, typical case and an edge case. Trace the expected output manually.
3.  **Plan approach, state complexity (3-5 min):** Verbally outline at least two approaches: a brute force and an optimized one. Discuss trade-offs in time and space complexity. Get confirmation from the interviewer before coding.
4.  **Code while narrating (15-20 min):** Write clean, modular code. Name variables meaningfully. Explain each logical block as you write it. If you realize a better approach mid-way, discuss the change with the interviewer.
5.  **Test with examples and edge cases (5-10 min):** Run your code against the initial examples. Then test the edge cases you identified earlier. Verbally walk through the code execution, tracking key variable states. Fix any bugs you find.

The best way to pressure-test your process is mock interviews. For more on this, see the [mock interview guide](/blog/mock-interview-guide-for-software-engineers).
