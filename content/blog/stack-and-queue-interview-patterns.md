---
title: "Stack and Queue Patterns for Coding Interviews"
description: "Monotonic stacks, BFS with queues, expression evaluation — the essential stack and queue patterns for interviews."
date: "2026-08-04"
category: "tips"
tags: ["stack", "queue", "monotonic stack", "patterns", "interview prep"]
---

Stacks and queues are fundamental, but knowing when to apply them in interviews is a different skill from knowing how they work. Here are the high-value patterns that show up repeatedly.

## Stack Patterns

### Parentheses Matching

Valid Parentheses: push opening brackets, pop on closing brackets and check for matches. Empty stack at the end means valid. Extends to Minimum Remove to Make Valid Parentheses (stack identifies unmatched brackets) and Longest Valid Parentheses (stack of indices tracks valid substrings).

The core algorithm uses a stack to track unmatched opening brackets. When a closing bracket appears, it must match the type of the bracket at the top of the stack. If the stack is empty when encountering a closing bracket, or if the types don't match, the string is invalid. After processing all characters, a valid string will have an empty stack.

<div class="code-group">

```python
def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in mapping:  # Closing bracket
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # Opening bracket
            stack.append(char)

    return not stack
```

```javascript
function isValid(s) {
  const stack = [];
  const mapping = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (let char of s) {
    if (mapping[char]) {
      // Closing bracket
      const topElement = stack.length ? stack.pop() : "#";
      if (mapping[char] !== topElement) {
        return false;
      }
    } else {
      // Opening bracket
      stack.push(char);
    }
  }

  return stack.length === 0;
}
```

```java
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');

    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {  // Closing bracket
            char topElement = stack.isEmpty() ? '#' : stack.pop();
            if (mapping.get(c) != topElement) {
                return false;
            }
        } else {  // Opening bracket
            stack.push(c);
        }
    }

    return stack.isEmpty();
}
```

</div>

### Monotonic Stack

Maintains elements in strictly increasing or decreasing order. When a new element violates the property, pop until restored. Answers "next greater/smaller element" queries in O(n). The key insight is that by maintaining monotonicity, we can efficiently find relationships between elements without nested loops.

**Next Greater Element I:** Decreasing stack. For each element, pop everything smaller -- those popped elements have found their next greater (the current element). This pattern solves problems where you need to find the next element with a certain property for each element in an array.

<div class="code-group">

```python
def nextGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # Decreasing stack of indices

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result
```

```javascript
function nextGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // Decreasing stack of indices

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }

  return result;
}
```

```java
public int[] nextGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Stack<Integer> stack = new Stack<>();  // Decreasing stack of indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            int idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }

    return result;
}
```

</div>

**Daily Temperatures:** Decreasing stack of indices. When a warmer day appears, popped indices get their answer as the index difference. This is essentially the same as Next Greater Element but returns distances instead of values.

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n
    stack = []  # Decreasing stack of indices

    for i in range(n):
        while stack and temperatures[stack[-1]] < temperatures[i]:
            idx = stack.pop()
            answer[idx] = i - idx
        stack.append(i)

    return answer
```

```javascript
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // Decreasing stack of indices

  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const idx = stack.pop();
      answer[idx] = i - idx;
    }
    stack.push(i);
  }

  return answer;
}
```

```java
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];
    Stack<Integer> stack = new Stack<>();  // Decreasing stack of indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
            int idx = stack.pop();
            answer[idx] = i - idx;
        }
        stack.push(i);
    }

    return answer;
}
```

</div>

**Largest Rectangle in Histogram:** Increasing stack of indices. When a shorter bar appears, pop taller bars and calculate rectangles using the current index and new stack top as boundaries. This technique also solves Maximal Rectangle. The key is that each popped bar forms a rectangle with height equal to its own height and width determined by the distance between the current index and the index after the new top of the stack.

<div class="code-group">

```python
def largestRectangleArea(heights):
    stack = []
    max_area = 0
    heights.append(0)  # Sentinel value to clear stack

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)

    return max_area
```

```javascript
function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;
  heights.push(0); // Sentinel value to clear stack

  for (let i = 0; i < heights.length; i++) {
    while (stack.length && heights[stack[stack.length - 1]] > heights[i]) {
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }

  return maxArea;
}
```

```java
public int largestRectangleArea(int[] heights) {
    Stack<Integer> stack = new Stack<>();
    int maxArea = 0;
    int n = heights.length;

    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }

    return maxArea;
}
```

</div>

### Expression Evaluation

**Basic Calculator II** (no parentheses, +, -, _, /): Track the previous operator. On encountering a new operator, apply the previous one. For +/-, push to stack. For _,/, pop, compute, push result. Sum the stack at the end. The algorithm processes the string character by character, building numbers and applying operators based on precedence.

<div class="code-group">

```python
def calculate(s: str) -> int:
    stack = []
    num = 0
    op = '+'

    for i, char in enumerate(s):
        if char.isdigit():
            num = num * 10 + int(char)

        if (not char.isdigit() and char != ' ') or i == len(s) - 1:
            if op == '+':
                stack.append(num)
            elif op == '-':
                stack.append(-num)
            elif op == '*':
                stack.append(stack.pop() * num)
            elif op == '/':
                stack.append(int(stack.pop() / num))

            op = char
            num = 0

    return sum(stack)
```

```javascript
function calculate(s) {
  const stack = [];
  let num = 0;
  let op = "+";

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (!isNaN(char) && char !== " ") {
      num = num * 10 + parseInt(char);
    }

    if ((isNaN(char) && char !== " ") || i === s.length - 1) {
      if (op === "+") {
        stack.push(num);
      } else if (op === "-") {
        stack.push(-num);
      } else if (op === "*") {
        stack.push(stack.pop() * num);
      } else if (op === "/") {
        stack.push(Math.trunc(stack.pop() / num));
      }

      op = char;
      num = 0;
    }
  }

  return stack.reduce((sum, val) => sum + val, 0);
}
```

```java
public int calculate(String s) {
    Stack<Integer> stack = new Stack<>();
    int num = 0;
    char op = '+';

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        }

        if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
            if (op == '+') {
                stack.push(num);
            } else if (op == '-') {
                stack.push(-num);
            } else if (op == '*') {
                stack.push(stack.pop() * num);
            } else if (op == '/') {
                stack.push(stack.pop() / num);
            }

            op = c;
            num = 0;
        }
    }

    int result = 0;
    while (!stack.isEmpty()) {
        result += stack.pop();
    }
    return result;
}
```

</div>

**Basic Calculator** (with parentheses): Push current result and sign on open-paren, reset, pop and combine on close-paren. This approach uses recursion in an iterative form by using the stack to save state when entering parentheses.

<div class="code-group">

```python
def calculate(s: str) -> int:
    stack = []
    result = 0
    num = 0
    sign = 1

    for char in s:
        if char.isdigit():
            num = num * 10 + int(char)
        elif char == '+':
            result += sign * num
            num = 0
            sign = 1
        elif char == '-':
            result += sign * num
            num = 0
            sign = -1
        elif char == '(':
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif char == ')':
            result += sign * num
            num = 0
            result *= stack.pop()  # Previous sign
            result += stack.pop()  # Previous result

    return result + sign * num
```

```javascript
function calculate(s) {
  const stack = [];
  let result = 0;
  let num = 0;
  let sign = 1;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (!isNaN(char) && char !== " ") {
      num = num * 10 + parseInt(char);
    } else if (char === "+") {
      result += sign * num;
      num = 0;
      sign = 1;
    } else if (char === "-") {
      result += sign * num;
      num = 0;
      sign = -1;
    } else if (char === "(") {
      stack.push(result);
      stack.push(sign);
      result = 0;
      sign = 1;
    } else if (char === ")") {
      result += sign * num;
      num = 0;
      result *= stack.pop(); // Previous sign
      result += stack.pop(); // Previous result
    }
  }

  return result + sign * num;
}
```

```java
public int calculate(String s) {
    Stack<Integer> stack = new Stack<>();
    int result = 0;
    int num = 0;
    int sign = 1;

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+') {
            result += sign * num;
            num = 0;
            sign = 1;
        } else if (c == '-') {
            result += sign * num;
            num = 0;
            sign = -1;
        } else if (c == '(') {
            stack.push(result);
            stack.push(sign);
            result = 0;
            sign = 1;
        } else if (c == ')') {
            result += sign * num;
            num = 0;
            result *= stack.pop();  // Previous sign
            result += stack.pop();  // Previous result
        }
    }

    return result + sign * num;
}
```

</div>

### Min Stack

Stack that supports O(1) min retrieval. Maintain a parallel stack tracking the minimum at each level. Push the min of the new element and current minimum alongside each push. This design ensures that for every element in the main stack, we know the minimum value in the stack up to that point.

<div class="code-group">

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
        else:
            self.min_stack.append(self.min_stack[-1])

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
```

```javascript
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    } else {
      this.minStack.push(this.minStack[this.minStack.length - 1]);
    }
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}
```

```java
class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.peek());
        }
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}
```

</div>

## Queue Patterns

### BFS Template

Queues power BFS: initialize with starting nodes, mark visited, process each by adding unvisited neighbors. Track distance by processing layer by layer (record queue size at each iteration). This template works for trees, graphs, and grid problems.

Key problems: Word Ladder, Rotting Oranges (multi-source), Shortest Path in Binary Matrix. See the [graph algorithms cheatsheet](/blog/graph-algorithms-interview-cheatsheet) for more.

Here's a generic BFS template for grid problems:

<div class="code-group">

```python
from collections import deque

def bfs_grid(grid, start):
    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    queue = deque([start])
    visited = set([start])
    distance = 0

    while queue:
        # Process level by level
        level_size = len(queue)
        for _ in range(level_size):
            r, c = queue.popleft()

            # Process current cell
            # (e.g., check if it's the target)

            # Explore neighbors
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if (0 <= nr < rows and 0 <= nc < cols and
                    (nr, nc) not in visited and
                    grid[nr][nc] != 0):  # Some condition
                    visited.add((nr, nc))
                    queue.append((nr, nc))

        distance += 1

    return -1  # If target not found
```

```javascript
function bfsGrid(grid, start) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const queue = [start];
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);
  let distance = 0;

  while (queue.length > 0) {
    // Process level by level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      // Process current cell
      // (e.g., check if it's the target)

      // Explore neighbors
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !visited.has(key) &&
          grid[nr][nc] !== 0
        ) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    distance++;
  }

  return -1; // If target not found
}
```

```java
import java.util.*;

public int bfsGrid(int[][] grid, int[] start) {
    int rows = grid.length;
    int cols = grid[0].length;
    int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    Queue<int[]> queue = new LinkedList<>();
    queue.offer(start);
    boolean[][] visited = new boolean[rows][cols];
    visited[start[0]][start[1]] = true;
    int distance = 0;

    while (!queue.isEmpty()) {
        // Process level by level
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            int[] current = queue.poll();
            int r = current[0], c = current[1];

            // Process current cell
            // (e.g., check if it's the target)

            // Explore neighbors
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    !visited[nr][nc] && grid[nr][nc] != 0) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
        distance++;
    }

    return -1;  // If target not found
}
```

</div>

### Priority Queue (Heap)

Always dequeues the min/max element. O(log n) insert and extract. Priority queues are essential for problems requiring repeated access to extreme values.

**Merge K Sorted Lists:** Min-heap of size K. Extract minimum, add its next pointer. O(n log K). The heap stores the current node from each list, allowing us to always pick the smallest available element.

<div class="code-group">

```python
import heapq
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []

    # Push first node of each list into heap
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode(0)
    current = dummy

    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next

        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next
```

```javascript
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeKLists(lists) {
  const heap = new MinPriorityQueue({ priority: (node) => node.val });

  // Push first node of each list into heap
  for (let node of lists) {
    if (node) {
      heap.enqueue(node);
    }
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (!heap.isEmpty()) {
    const node = heap.dequeue().element;
    current.next = node;
    current = current.next;

    if (node.next) {
      heap.enqueue(node.next);
    }
  }

  return dummy.next;
}
```

```java
import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);

    // Push first node of each list into heap
    for (ListNode node : lists) {
        if (node != null) {
            heap.offer(node);
        }
    }

    ListNode dummy = new ListNode(0);
    ListNode current = dummy;

    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        current.next = node;
        current = current.next;

        if (node.next != null) {
            heap.offer(node.next);
        }
    }

    return dummy.next;
}
```

</div>

**Kth Largest Element:** Min-heap of size K. After processing all elements, the top is the Kth largest. This approach is more efficient than sorting when K is much smaller than N.

<div class="code-group">

```python
import heapq

def findKthLargest(nums, k):
    heap = []

    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)

    return heap[0]
```

```javascript
function findKthLargest(nums, k) {
  const heap = new MinPriorityQueue();

  for (const num of nums) {
    heap.enqueue(num);
    if (heap.size() > k) {
      heap.dequeue();
    }
  }

  return heap.front().element;
}
```

```java
import java.util.*;

public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();

    for (int num : nums) {
        heap.offer(num);
        if (heap.size() > k) {
            heap.poll();
        }
    }

    return heap.peek();
}
```

</div>

**Find Median from Data Stream:** Max-heap for lower half, min-heap for upper half. Balance sizes to differ by at most 1. Median is from the larger heap's top. This two-heap approach maintains the invariant that all elements in the max-heap are less than or equal to all elements in the min-heap.

<div class="code-group">

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # Lower half (invert values for max-heap)
        self.min_heap = []  # Upper half

    def addNum(self, num: int) -> None:
        # Add to appropriate heap
        if not self.max_heap or num <= -self.max_heap[0]:
            heapq.heappush(self.max_heap, -num)
        else:
            heapq.heappush(self.min_heap, num)

        # Balance heaps
        if len(self.max_heap) > len(self.min_heap) + 1:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        elif len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def findMedian(self) -> float:
        if len(self.max_heap) == len(self.min_heap):
            return (-self.max_heap[0] + self.min_heap[0]) / 2
        else:
            return -self.max_heap[0]
```

```javascript
class MedianFinder {
  constructor() {
    this.maxHeap = new MaxPriorityQueue(); // Lower half
    this.minHeap = new MinPriorityQueue(); // Upper half
  }

  addNum(num) {
    // Add to appropriate heap
    if (this.maxHeap.size() === 0 || num <= this.maxHeap.front().element) {
      this.maxHeap.enqueue(num);
    } else {
      this.minHeap.enqueue(num);
    }

    // Balance heaps
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.enqueue(this.maxHeap.dequeue().element);
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      this.maxHeap.enqueue(this.minHeap.dequeue().element);
    }
  }

  findMedian() {
    if (this.maxHeap.size() === this.minHeap.size()) {
      return (this.maxHeap.front().element + this.minHeap.front().element) / 2;
    } else {
      return this.maxHeap.front().element;
    }
  }
}
```

```java
import java.util.*;

class MedianFinder {
    private PriorityQueue<Integer> maxHeap;  // Lower half
    private PriorityQueue<Integer> minHeap;  // Upper half

    public MedianFinder() {
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        minHeap = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // Add to appropriate heap
        if (maxHeap.isEmpty() || num <= maxHeap.peek()) {
            maxHeap.offer(num);
        } else {
            minHeap.offer(num);
        }

        // Balance heaps
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        } else if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() == minHeap.size()) {
            return (maxHeap.peek() + minHeap.peek()) / 2.0;
        } else {
            return maxHeap.peek();
        }
    }
}
```

</div>

**Task Scheduler:** Max-heap processes the most frequent task. After processing, cooldown queue holds tasks until they can re-enter the heap. This approach maximizes CPU utilization by always scheduling the most frequent available task.

<div class="code-group">

```python
import heapq
from collections import Counter, deque

def leastInterval(tasks, n):
    count = Counter(tasks)
    max_heap = [-cnt for cnt in count.values()]
    heapq.heapify(max_heap)

    time = 0
    queue = deque()  # (next_available_time, count)

    while max_heap or queue:
        time += 1

        if max_heap:
            cnt = heapq.heappop(max_heap) + 1  # +1 because we use negative counts
            if cnt < 0:  # If tasks remain
                queue.append((time + n, cnt))

        if queue and queue[0][0] == time:
            heapq.heappush(max_heap, queue.popleft()[1])

    return time
```

```javascript
function leastInterval(tasks, n) {
  const count = new Map();
  for (const task of tasks) {
    count.set(task, (count.get(task) || 0) + 1);
  }

  const maxHeap = new MaxPriorityQueue();
  for (const cnt of count.values()) {
    maxHeap.enqueue(cnt);
  }

  let time = 0;
  const queue = []; // [next_available_time, count]

  while (maxHeap.size() > 0 || queue.length > 0) {
    time++;

    if (maxHeap.size() > 0) {
      let cnt = maxHeap.dequeue().element - 1;
      if (cnt > 0) {
        queue.push([time + n, cnt]);
      }
    }

    if (queue.length > 0 && queue[0][0] === time) {
      maxHeap.enqueue(queue.shift()[1]);
    }
  }

  return time;
}
```

```java
import java.util.*;

public int leastInterval(char[] tasks, int n) {
    Map<Character, Integer> count = new HashMap<>();
    for (char task : tasks) {
        count.put(task, count.getOrDefault(task, 0) + 1);
    }

    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int cnt : count.values()) {
        maxHeap.offer(cnt);
    }

    int time = 0;
    Queue<int[]> queue = new LinkedList<>();  // [next_available_time, count]

    while (!maxHeap.isEmpty() || !queue.isEmpty()) {
        time++;

        if (!maxHeap.isEmpty()) {
            int cnt = maxHeap.poll() - 1;
            if (cnt > 0) {
                queue.offer(new int[]{time + n, cnt});
            }
        }

        if (!queue.isEmpty() && queue.peek()[0] == time) {
            maxHeap.offer(queue.poll()[1]);
        }
    }

    return time;
}
```

</div>

## Choosing the Right Tool

**Stack:** Nesting, matching, "most recent" context. Parentheses, next greater element, DFS. Use a stack when you need to process elements in LIFO (Last-In-First-Out) order, particularly when dealing with recursive structures, backtracking, or when you need to remember the most recent element to compare with current elements.

**Queue:** Processing in order, BFS, level-by-level traversal. Use a queue when you need FIFO (First-In-First-Out) processing, such as when handling requests in order, traversing trees/graphs level by level, or implementing caches with LRU (Least Recently Used) eviction policies.

**Priority queue:** Repeatedly extracting min/max. Top K, merging sorted structures, scheduling. Use a priority queue when you need to repeatedly access the smallest or largest element, especially when the set of elements changes dynamically and you need efficient updates.

## Practice Problems

**Stack:**

1. Valid Parentheses
2. Min Stack
3. Daily Temperatures
4. Largest Rectangle in Histogram
5. Basic Calculator II

**Queue/BFS:** 6. Rotting Oranges 7. Binary Tree Level Order Traversal

**Priority Queue:** 8. Kth Largest Element in an Array 9. Merge K Sorted Lists 10. Find Median from Data Stream 11. Task Scheduler

Explore problems by company on the [CodeJeet dashboard](/dashboard). Monotonic stack is popular at [Amazon](/company/amazon) and [Google](/company/google); priority queues at [Meta](/company/meta).

To master these patterns, implement each algorithm from scratch without looking at the code examples. Start with the basic versions, then tackle the variations. For example, after implementing Valid Parentheses, try Minimum Remove to Make Valid Parentheses. After mastering Next Greater Element, try the circular array version. The key is to understand the underlying principles so you can adapt them to new problems.
