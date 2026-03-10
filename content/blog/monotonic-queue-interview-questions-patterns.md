---
title: "Monotonic Queue Interview Questions: Patterns and Strategies"
description: "Master Monotonic Queue problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-03"
category: "dsa-patterns"
tags: ["monotonic-queue", "dsa", "interview prep"]
---

# Monotonic Queue Interview Questions: Patterns and Strategies

You're solving a sliding window problem, tracking the maximum in each window. You implement a brute force O(nk) solution, then optimize with a heap to O(n log k). The interviewer nods, then asks: "Can you do it in O(n)?" This is where monotonic queues enter the conversation. The problem is **Sliding Window Maximum (#239)**, and it's the classic gateway to understanding why this data structure matters.

Monotonic queues are deceptively simple yet incredibly powerful. They maintain elements in either strictly increasing or decreasing order while supporting efficient insertion and deletion from both ends. What makes them interview gold is their ability to solve problems that seem to require more complex data structures in optimal O(n) time. The 17 LeetCode problems tagged with monotonic queue tell a story: 65% are Hard, 35% Medium, and 0% Easy. This isn't beginner material—it's advanced pattern recognition that separates strong candidates from exceptional ones.

## Common Patterns

### Pattern 1: Sliding Window Maximum/Minimum

This is the most fundamental pattern. When you need to track the extreme value in a sliding window, a monotonic queue lets you do it in amortized O(1) per operation.

**Intuition**: Instead of storing all window elements, maintain a queue where elements are in decreasing order (for maximum) or increasing order (for minimum). When a new element arrives, remove all smaller elements from the back—they can never be the maximum once this larger element enters. Remove from the front when elements leave the window.

**Problems**: Sliding Window Maximum (#239), Shortest Subarray with Sum at Least K (#862), Constrained Subsequence Sum (#1425).

<div class="code-group">

```python
def maxSlidingWindow(nums, k):
    """
    Time: O(n) - Each element enters and leaves the deque at most once
    Space: O(k) - Deque stores at most k elements
    """
    from collections import deque

    result = []
    dq = deque()  # stores indices, values decreasing

    for i, num in enumerate(nums):
        # Remove indices outside the window
        if dq and dq[0] <= i - k:
            dq.popleft()

        # Maintain decreasing order
        while dq and nums[dq[-1]] <= num:
            dq.pop()

        dq.append(i)

        # Window is fully formed
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result
```

```javascript
function maxSlidingWindow(nums, k) {
  // Time: O(n) - Each element enters and leaves the deque at most once
  // Space: O(k) - Deque stores at most k elements
  const result = [];
  const deque = []; // stores indices, values decreasing

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside the window
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // Maintain decreasing order
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // Window is fully formed
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}
```

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    // Time: O(n) - Each element enters and leaves the deque at most once
    // Space: O(k) - Deque stores at most k elements
    if (nums.length == 0 || k == 0) return new int[0];

    int[] result = new int[nums.length - k + 1];
    Deque<Integer> deque = new ArrayDeque<>();

    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside the window
        if (!deque.isEmpty() && deque.peekFirst() <= i - k) {
            deque.pollFirst();
        }

        // Maintain decreasing order
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
            deque.pollLast();
        }

        deque.offerLast(i);

        // Window is fully formed
        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }

    return result;
}
```

</div>

### Pattern 2: Next Greater/Smaller Element

When you need to find the next element satisfying a condition for each element in an array, monotonic stacks (which are essentially one-ended monotonic queues) provide an elegant solution.

**Intuition**: Process elements from right to left for "next greater" or left to right for "previous greater." Maintain a monotonic structure where you pop elements that can't be the answer for current or future elements.

**Problems**: Next Greater Element II (#503), Daily Temperatures (#739), Online Stock Span (#901).

<div class="code-group">

```python
def nextGreaterElements(nums):
    """
    Time: O(n) - Each element pushed and popped at most once
    Space: O(n) - Stack stores up to n elements
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices, values decreasing

    # Process circular array by iterating twice
    for i in range(2 * n):
        idx = i % n
        while stack and nums[stack[-1]] < nums[idx]:
            popped = stack.pop()
            result[popped] = nums[idx]
        stack.append(idx)

    return result
```

```javascript
function nextGreaterElements(nums) {
  // Time: O(n) - Each element pushed and popped at most once
  // Space: O(n) - Stack stores up to n elements
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // stores indices, values decreasing

  // Process circular array by iterating twice
  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n;
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[idx]) {
      const popped = stack.pop();
      result[popped] = nums[idx];
    }
    stack.push(idx);
  }

  return result;
}
```

```java
public int[] nextGreaterElements(int[] nums) {
    // Time: O(n) - Each element pushed and popped at most once
    // Space: O(n) - Stack stores up to n elements
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();  // stores indices, values decreasing

    // Process circular array by iterating twice
    for (int i = 0; i < 2 * n; i++) {
        int idx = i % n;
        while (!stack.isEmpty() && nums[stack.peek()] < nums[idx]) {
            int popped = stack.pop();
            result[popped] = nums[idx];
        }
        stack.push(idx);
    }

    return result;
}
```

</div>

### Pattern 3: Monotonic Queue with Prefix Sum

This advanced pattern combines monotonic queues with prefix sums to solve problems about subarrays with constraints.

**Intuition**: When you need to find subarrays satisfying sum constraints, compute prefix sums first. Then use a monotonic queue to efficiently find valid pairs of indices. The queue maintains a useful property (like increasing prefix sums) that lets you quickly determine if constraints are met.

**Problems**: Shortest Subarray with Sum at Least K (#862), Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (#1438).

<div class="code-group">

```python
def shortestSubarray(nums, k):
    """
    Time: O(n) - Each element enters and leaves deque at most once
    Space: O(n) - Prefix sum array and deque
    """
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    dq = deque()  # stores indices, prefix sums increasing
    result = float('inf')

    for i in range(n + 1):
        # Check if we found a valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            result = min(result, i - dq.popleft())

        # Maintain increasing order of prefix sums
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()

        dq.append(i)

    return result if result != float('inf') else -1
```

```javascript
function shortestSubarray(nums, k) {
  // Time: O(n) - Each element enters and leaves deque at most once
  // Space: O(n) - Prefix sum array and deque
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  const deque = []; // stores indices, prefix sums increasing
  let result = Infinity;

  for (let i = 0; i <= n; i++) {
    // Check if we found a valid subarray
    while (deque.length > 0 && prefix[i] - prefix[deque[0]] >= k) {
      result = Math.min(result, i - deque.shift());
    }

    // Maintain increasing order of prefix sums
    while (deque.length > 0 && prefix[i] <= prefix[deque[deque.length - 1]]) {
      deque.pop();
    }

    deque.push(i);
  }

  return result !== Infinity ? result : -1;
}
```

```java
public int shortestSubarray(int[] nums, int k) {
    // Time: O(n) - Each element enters and leaves deque at most once
    // Space: O(n) - Prefix sum array and deque
    int n = nums.length;
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    Deque<Integer> deque = new ArrayDeque<>();  // stores indices, prefix sums increasing
    int result = Integer.MAX_VALUE;

    for (int i = 0; i <= n; i++) {
        // Check if we found a valid subarray
        while (!deque.isEmpty() && prefix[i] - prefix[deque.peekFirst()] >= k) {
            result = Math.min(result, i - deque.pollFirst());
        }

        // Maintain increasing order of prefix sums
        while (!deque.isEmpty() && prefix[i] <= prefix[deque.peekLast()]) {
            deque.pollLast();
        }

        deque.offerLast(i);
    }

    return result != Integer.MAX_VALUE ? result : -1;
}
```

</div>

## When to Use Monotonic Queue vs Alternatives

Recognizing when to reach for a monotonic queue is half the battle. Here's how to distinguish it from similar techniques:

**Monotonic Queue vs Heap**: Both can track maximum/minimum in a sliding window. Use a heap (priority queue) when you need random removals or multiple orderings. Use a monotonic queue when you only need to maintain one ordering and removals follow FIFO order (oldest elements leave first). The monotonic queue gives you O(1) amortized operations vs O(log n) for heap.

**Monotonic Queue vs Two Pointers**: Both work on sliding windows. Use two pointers when the window condition is simple (like sum < threshold). Use monotonic queue when you need to track more complex window properties (like maximum - minimum ≤ limit).

**Monotonic Queue vs Segment Tree**: Both can answer range queries. Use segment tree when you need arbitrary range queries and updates. Use monotonic queue when queries are sequential and follow sliding window pattern.

**Decision Criteria**:

1. Are you processing elements in order with a sliding window?
2. Do you need to maintain maximum/minimum or next greater/smaller relationships?
3. Can older elements become irrelevant when newer, better candidates arrive?
4. Do you need O(n) time complexity where O(n log n) seems natural?

If you answer yes to most of these, think monotonic queue.

## Edge Cases and Gotchas

### 1. Empty Input and Single Element Windows

Always check for empty arrays and window size of 1. In **Sliding Window Maximum (#239)**, if k = 1, you should return the array itself. If nums is empty, return an empty array.

### 2. Integer Overflow with Prefix Sums

When combining with prefix sums (like in **Shortest Subarray with Sum at Least K (#862)**), use 64-bit integers. The sum can exceed 32-bit limits even if individual elements don't.

### 3. Strict vs Non-strict Monotonicity

Some problems require strictly increasing/decreasing queues, others allow equal elements. In **Daily Temperatures (#739)**, you pop equal temperatures because you want strictly warmer days. In other problems, you might keep equal elements. Read the problem statement carefully.

### 4. Circular Array Handling

For problems like **Next Greater Element II (#503)**, you need to handle circular arrays. The standard trick: iterate through 2n elements and use modulo indexing. Don't forget to initialize results with -1 for elements with no next greater.

## Difficulty Breakdown

The distribution (0% Easy, 35% Medium, 65% Hard) tells a clear story: monotonic queue is an advanced technique. This doesn't mean you should avoid it—it means mastery here pays disproportionate dividends. Hard problems that use monotonic queues often become medium-difficulty once you recognize the pattern.

Prioritize Medium problems first to build intuition, then tackle Hards. The Hard problems often combine monotonic queues with other concepts (like DP in **Constrained Subsequence Sum (#1425)**), so you're getting compound learning value.

## Which Companies Ask Monotonic Queue

**Google** (/company/google) loves algorithmic elegance, and monotonic queue problems appear frequently. They particularly enjoy variations on sliding window maximum and next greater element problems.

**Amazon** (/company/amazon) asks monotonic queue questions in their onsite interviews, often as the second or third question in a coding round. They favor practical applications like stock span problems.

**Meta** (/company/meta) includes these in their phone screens and onsites. They prefer problems that combine monotonic queues with other patterns.

**Microsoft** (/company/microsoft) and **Bloomberg** (/company/bloomberg) use these questions to test optimization skills. Bloomberg in particular likes the prefix sum + monotonic queue combination for financial data analysis scenarios.

## Study Tips

1. **Start with the Classics**: Begin with **Sliding Window Maximum (#239)** and **Daily Temperatures (#739)**. These are the most fundamental patterns. Implement them until the deque operations feel natural.

2. **Visualize the Process**: Draw the array and deque. Track which elements are in the deque at each step. This builds intuition for why smaller elements get popped when larger ones arrive.

3. **Practice in Order of Complexity**:
   - First: Pure monotonic queue (Sliding Window Maximum #239)
   - Second: Monotonic stack (Daily Temperatures #739, Next Greater Element II #503)
   - Third: Combined patterns (Shortest Subarray with Sum at Least K #862)
   - Fourth: Advanced combinations (Constrained Subsequence Sum #1425)

4. **Time Yourself**: Once you understand a pattern, solve similar problems under interview conditions. The goal is pattern recognition, not just implementation.

Monotonic queues transform O(n log n) solutions into O(n) solutions. They're not just another data structure—they're a way of thinking about how to maintain relevant information while discarding what's no longer useful. This mirrors how we optimize real-world systems: keep what matters, efficiently discard what doesn't.

[Practice all Monotonic Queue questions on CodeJeet](/topic/monotonic-queue)
