---
title: "Monotonic Stack Interview Questions: Patterns and Strategies"
description: "Master Monotonic Stack problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-28"
category: "dsa-patterns"
tags: ["monotonic-stack", "dsa", "interview prep"]
---

# Monotonic Stack Interview Questions: Patterns and Strategies

I remember watching a candidate completely unravel on what seemed like a straightforward problem: "Given an array of daily temperatures, return an array where each element tells you how many days you have to wait until a warmer temperature." The candidate immediately started with nested loops, got an O(n²) solution, then spent 20 minutes trying to optimize it with binary search and heaps, never realizing they were missing the perfect data structure for the job. That problem, Daily Temperatures (#739), is a classic monotonic stack problem that catches people off guard precisely because it looks like it should be solvable with simpler techniques.

Monotonic stacks appear in only about 2% of LeetCode problems, but they're disproportionately important in interviews because they test whether you can recognize subtle patterns. With 54 questions in this category (57% medium, 39% hard), you're almost guaranteed to see one if you're interviewing at top tech companies. What makes them tricky is that the stack itself isn't the solution—it's a tool for maintaining order while processing elements in a way that reveals relationships you couldn't see with a single pass.

## Common Patterns

### Pattern 1: Next Greater Element

This is the most fundamental pattern. You maintain a decreasing monotonic stack (values decrease from bottom to top) to find the next greater element for each item. The intuition: when you encounter a value larger than the top of the stack, you've found the "next greater element" for everything smaller than it.

<div class="code-group">

```python
def nextGreaterElement(nums):
    """
    Find next greater element for each element in array.
    Returns array where result[i] = next greater element after nums[i]
    or -1 if none exists.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # decreasing monotonic stack (stores indices)

    for i in range(n):
        # While current element > element at top of stack
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result

# Time: O(n) - each element pushed and popped at most once
# Space: O(n) - stack can hold all elements in worst case
```

```javascript
function nextGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // decreasing monotonic stack (stores indices)

  for (let i = 0; i < n; i++) {
    // While current element > element at top of stack
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }

  return result;
}

// Time: O(n) - each element pushed and popped at most once
// Space: O(n) - stack can hold all elements in worst case
```

```java
public int[] nextGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();  // decreasing monotonic stack

    for (int i = 0; i < n; i++) {
        // While current element > element at top of stack
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            int idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }

    return result;
}

// Time: O(n) - each element pushed and popped at most once
// Space: O(n) - stack can hold all elements in worst case
```

</div>

Related problems: Next Greater Element I (#496), Next Greater Element II (#503), Daily Temperatures (#739).

### Pattern 2: Previous Smaller Element

The mirror image of Pattern 1. You maintain an increasing monotonic stack (values increase from bottom to top) to find the previous smaller element. This pattern is crucial for problems involving maximum area calculations.

<div class="code-group">

```python
def previousSmallerElement(nums):
    """
    Find previous smaller element for each element.
    Returns array where result[i] = index of previous smaller element
    or -1 if none exists.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # increasing monotonic stack (stores indices)

    for i in range(n):
        # Pop elements >= current to maintain increasing order
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()

        if stack:
            result[i] = stack[-1]  # Previous smaller element index
        else:
            result[i] = -1

        stack.append(i)

    return result

# Time: O(n) - each element processed once
# Space: O(n) - worst case stack size
```

```javascript
function previousSmallerElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // increasing monotonic stack

  for (let i = 0; i < n; i++) {
    // Pop elements >= current to maintain increasing order
    while (stack.length && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }

    if (stack.length) {
      result[i] = stack[stack.length - 1];
    } else {
      result[i] = -1;
    }

    stack.push(i);
  }

  return result;
}

// Time: O(n) - each element processed once
// Space: O(n) - worst case stack size
```

```java
public int[] previousSmallerElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        // Pop elements >= current to maintain increasing order
        while (!stack.isEmpty() && nums[stack.peek()] >= nums[i]) {
            stack.pop();
        }

        if (!stack.isEmpty()) {
            result[i] = stack.peek();
        } else {
            result[i] = -1;
        }

        stack.push(i);
    }

    return result;
}

// Time: O(n) - each element processed once
// Space: O(n) - worst case stack size
```

</div>

Related problems: Largest Rectangle in Histogram (#84), Maximal Rectangle (#85), Trapping Rain Water (#42).

### Pattern 3: Circular Array Processing

When dealing with circular arrays, you can simulate two passes by iterating through 2n elements and using modulo arithmetic. The key insight: after the first pass, elements remaining in the stack need to find their matches in the "next" pass.

<div class="code-group">

```python
def nextGreaterElementsCircular(nums):
    """
    Find next greater element in circular array.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # decreasing monotonic stack

    # Process 2n elements to cover circular nature
    for i in range(2 * n):
        idx = i % n
        while stack and nums[idx] > nums[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = nums[idx]

        # Only push during first pass to avoid duplicates
        if i < n:
            stack.append(idx)

    return result

# Time: O(n) - each element processed at most twice
# Space: O(n) - stack size
```

```javascript
function nextGreaterElementsCircular(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n;
    while (stack.length && nums[idx] > nums[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      result[prevIdx] = nums[idx];
    }

    if (i < n) {
      stack.push(idx);
    }
  }

  return result;
}

// Time: O(n) - each element processed at most twice
// Space: O(n) - stack size
```

```java
public int[] nextGreaterElementsCircular(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < 2 * n; i++) {
        int idx = i % n;
        while (!stack.isEmpty() && nums[idx] > nums[stack.peek()]) {
            int prevIdx = stack.pop();
            result[prevIdx] = nums[idx];
        }

        if (i < n) {
            stack.push(idx);
        }
    }

    return result;
}

// Time: O(n) - each element processed at most twice
// Space: O(n) - stack size
```

</div>

Related problems: Next Greater Element II (#503), Online Stock Span (#901).

## When to Use Monotonic Stack vs Alternatives

The telltale signs that a problem needs a monotonic stack:

1. **You need to find "next/previous greater/smaller" elements** - This is the most obvious clue. If the problem asks about relationships between elements based on their values and positions, think monotonic stack.

2. **The naive solution involves nested loops looking ahead/behind** - If you find yourself writing `for i in range(n): for j in range(i+1, n):` to find relationships, there's probably a monotonic stack solution.

3. **You need to maintain some ordering while processing** - When you need to remember elements in a specific order as you traverse, and you only care about certain elements (like the most recent ones that satisfy a condition).

**Decision criteria:**

- Use monotonic stack over two-pointer when relationships aren't symmetric and you need to remember multiple candidates.
- Use monotonic stack over heap when you need to maintain positional relationships (heaps lose ordering information).
- Use monotonic stack over dynamic programming when the state transitions depend on nearest greater/smaller elements.

**When NOT to use monotonic stack:**

- Simple comparisons that can be done with a single variable (like tracking just the minimum seen so far)
- Problems where you need random access to all stored elements
- When the relationship isn't strictly monotonic (greater/less than)

## Edge Cases and Gotchas

1. **Empty input arrays** - Always check for empty or single-element arrays first. Many monotonic stack solutions assume at least 2 elements.

2. **Duplicate values** - This is the most common trap. Decide whether you want strict inequality (`>`) or non-strict (`>=`). For example, in Largest Rectangle in Histogram (#84), you need `>=` when finding previous smaller elements to correctly handle equal heights.

3. **Circular array boundaries** - When dealing with circular problems, remember that indices wrap around. The modulo operation `i % n` is cleaner than manual boundary checks.

4. **Stack stores indices vs values** - Almost always store indices, not values. You'll need the indices to:
   - Calculate distances (like in Daily Temperatures)
   - Access the original array for comparisons
   - Update result arrays at correct positions

5. **Off-by-one in distance calculations** - When calculating "days until warmer" or similar distances, remember whether you want `i - idx` or `i - idx - 1`. Test with a simple 2-element case.

## Difficulty Breakdown

With 57% medium and 39% hard problems, monotonic stack questions skew difficult. This tells you two things:

1. **Companies use these to differentiate candidates** - If you're applying to competitive roles, you need to master these patterns.

2. **Start with the mediums** - The 31 medium problems contain all the fundamental patterns. Master these before attempting the hards. The hard problems usually combine monotonic stacks with other techniques (like dynamic programming in Maximal Rectangle).

3. **The 2 easy problems are misleading** - They're easy only if you already know the pattern. Use them to verify your understanding, not to learn the concept.

## Which Companies Ask Monotonic Stack

[Google](/company/google) loves these problems, especially variations on Next Greater Element and histogram problems. They often combine monotonic stacks with other concepts.

[Amazon](/company/amazon) frequently asks Daily Temperatures (#739) and stock span problems. They like practical applications of the pattern.

[Meta](/company/meta) tends toward the harder problems like Largest Rectangle in Histogram (#84) and Maximal Rectangle (#85).

[Bloomberg](/company/bloomberg) asks these regularly, often in the context of financial data processing (stock prices, temperature trends).

[Microsoft](/company/microsoft) prefers cleaner algorithmic implementations, often testing edge case handling.

## Study Tips

1. **Learn the patterns, not just problems** - Don't memorize solutions. Understand why each pattern works. Draw the stack operations on paper for the first few problems.

2. **Recommended problem order:**
   - Start with Next Greater Element I (#496) - basic pattern
   - Move to Daily Temperatures (#739) - adds distance calculation
   - Try Next Greater Element II (#503) - introduces circular arrays
   - Attempt Largest Rectangle in Histogram (#84) - combines previous and next smaller
   - Finally tackle Maximal Rectangle (#85) - 2D application

3. **Implement from scratch every time** - Even if you think you know the solution, code it without looking. The muscle memory matters.

4. **Time yourself on mediums** - Once you understand the patterns, practice solving medium problems in under 20 minutes. Interview pressure changes everything.

5. **Explain the algorithm out loud** - Practice walking through your solution verbally. Interviewers want to hear your thought process, not just see code.

Remember: monotonic stack problems look intimidating because they compress what would be O(n²) comparisons into O(n) operations. Once you see the pattern, they become satisfyingly elegant. The stack isn't storing random data—it's maintaining a specific order that lets you answer questions about element relationships in constant time per element.

[Practice all Monotonic Stack questions on CodeJeet](/topic/monotonic-stack)
