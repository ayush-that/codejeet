---
title: "How to Solve Daily Temperatures — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Daily Temperatures. Medium difficulty, 68.4% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2026-06-29"
category: "dsa-patterns"
tags: ["daily-temperatures", "array", "stack", "monotonic-stack", "medium"]
---

# How to Solve Daily Temperatures

You're given an array of daily temperatures and need to find, for each day, how many days you must wait until a warmer temperature occurs. If no warmer day exists in the future, the answer should be 0. This problem is interesting because while a brute force approach is straightforward, it's inefficient. The optimal solution requires recognizing a pattern that appears in several other problems: the monotonic stack technique.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`.

We want to find, for each day, the number of days until a warmer temperature. Let's think about this visually:

**Day 0 (73°):** Look ahead to day 1 (74°) → warmer after 1 day → answer[0] = 1  
**Day 1 (74°):** Look ahead to day 2 (75°) → warmer after 1 day → answer[1] = 1  
**Day 2 (75°):** Look ahead to day 3 (71°) → colder, keep looking... day 4 (69°) → colder, day 5 (72°) → colder, day 6 (76°) → warmer after 4 days → answer[2] = 4  
**Day 3 (71°):** Look ahead to day 4 (69°) → colder, day 5 (72°) → warmer after 2 days → answer[3] = 2  
**Day 4 (69°):** Look ahead to day 5 (72°) → warmer after 1 day → answer[4] = 1  
**Day 5 (72°):** Look ahead to day 6 (76°) → warmer after 1 day → answer[5] = 1  
**Day 6 (76°):** Look ahead to day 7 (73°) → colder, no more days → answer[6] = 0  
**Day 7 (73°):** No more days → answer[7] = 0

The brute force approach would check every future day for each current day, which leads to O(n²) time complexity. The key insight is that we can process temperatures in a smarter way using a stack to remember days we haven't yet found a warmer day for.

## Brute Force Approach

The most straightforward solution is to use nested loops: for each day `i`, look at all future days `j` until we find a warmer temperature.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output array
def dailyTemperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n

    # For each day
    for i in range(n):
        # Check all future days
        for j in range(i + 1, n):
            # If we find a warmer day
            if temperatures[j] > temperatures[i]:
                answer[i] = j - i  # Days to wait
                break  # Stop looking for this day

    return answer
```

```javascript
// Time: O(n²) | Space: O(1) excluding output array
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);

  // For each day
  for (let i = 0; i < n; i++) {
    // Check all future days
    for (let j = i + 1; j < n; j++) {
      // If we find a warmer day
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i; // Days to wait
        break; // Stop looking for this day
      }
    }
  }

  return answer;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output array
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];

    // For each day
    for (int i = 0; i < n; i++) {
        // Check all future days
        for (int j = i + 1; j < n; j++) {
            // If we find a warmer day
            if (temperatures[j] > temperatures[i]) {
                answer[i] = j - i;  // Days to wait
                break;  // Stop looking for this day
            }
        }
    }

    return answer;
}
```

</div>

**Why this is insufficient:** For an array of length `n`, this approach takes O(n²) time in the worst case (when temperatures are in descending order). For large inputs (n up to 10⁵), this is far too slow. We need a more efficient approach.

## Optimized Approach

The key insight is that we can use a **monotonic decreasing stack** to solve this in O(n) time. Here's the reasoning:

1. We process temperatures from left to right
2. We maintain a stack that stores indices of days for which we haven't yet found a warmer day
3. The stack maintains temperatures in decreasing order (from bottom to top)
4. When we encounter a temperature that's warmer than the temperature at the index on top of the stack, we've found the "next warmer day" for that day

**Step-by-step reasoning:**

- Initialize an empty stack and an answer array filled with zeros
- For each day `i`:
  - While the stack is not empty AND the current temperature is greater than the temperature at the index on top of the stack:
    - Pop the index from the stack
    - Calculate the difference: `i - popped_index` (days to wait)
    - Store this in the answer array at position `popped_index`
  - Push the current index `i` onto the stack
- Any indices remaining in the stack at the end represent days with no warmer future day (they already have 0 in the answer array)

This works because the stack maintains a decreasing sequence of temperatures. When we see a higher temperature, it becomes the "next warmer day" for all lower temperatures in the stack that it's greater than.

## Optimal Solution

Here's the complete implementation using a monotonic stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def dailyTemperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n  # Initialize answer array with zeros
    stack = []  # Monotonic decreasing stack (stores indices)

    # Process each day
    for i in range(n):
        # While stack is not empty and current temperature is warmer
        # than temperature at index on top of stack
        while stack and temperatures[i] > temperatures[stack[-1]]:
            # Pop the index from stack
            prev_index = stack.pop()
            # Calculate days to wait: current index - previous index
            answer[prev_index] = i - prev_index

        # Push current index onto stack
        stack.append(i)

    return answer
```

```javascript
// Time: O(n) | Space: O(n)
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0); // Initialize answer array with zeros
  const stack = []; // Monotonic decreasing stack (stores indices)

  // Process each day
  for (let i = 0; i < n; i++) {
    // While stack is not empty and current temperature is warmer
    // than temperature at index on top of stack
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      // Pop the index from stack
      const prevIndex = stack.pop();
      // Calculate days to wait: current index - previous index
      answer[prevIndex] = i - prevIndex;
    }

    // Push current index onto stack
    stack.push(i);
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];  // Initialize answer array (defaults to zeros)
    Stack<Integer> stack = new Stack<>();  // Monotonic decreasing stack (stores indices)

    // Process each day
    for (int i = 0; i < n; i++) {
        // While stack is not empty and current temperature is warmer
        // than temperature at index on top of stack
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            // Pop the index from stack
            int prevIndex = stack.pop();
            // Calculate days to wait: current index - previous index
            answer[prevIndex] = i - prevIndex;
        }

        // Push current index onto stack
        stack.push(i);
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
Each index is pushed onto the stack exactly once and popped at most once. Even though we have a while loop inside a for loop, the total number of operations is proportional to `n` because each index can only be popped once. This is a classic example of amortized O(1) operations per element.

**Space Complexity: O(n)**  
In the worst case (when temperatures are in strictly decreasing order), we might push all `n` indices onto the stack before any get popped. The answer array also uses O(n) space, but this is required output.

## Common Mistakes

1. **Using the wrong stack order:** Candidates sometimes try to maintain an increasing stack instead of a decreasing one. Remember: we want to find the next _greater_ element, so we maintain a decreasing stack. When we see a greater element, it resolves the waiting period for smaller elements in the stack.

2. **Forgetting to store indices, not temperatures:** The stack should store indices, not temperatures. We need indices to calculate the day difference (`i - prev_index`). If we store temperatures, we lose the positional information needed for the answer.

3. **Off-by-one errors in the answer calculation:** The correct formula is `current_index - previous_index`, not `current_index - previous_index + 1` or other variations. If day 3 waits until day 5, that's 2 days (day 4 and day 5), which is `5 - 3 = 2`.

4. **Not initializing the answer array properly:** The answer array should be initialized with zeros since days with no warmer future should have 0. In Java, arrays are automatically initialized with zeros, but in Python and JavaScript, you need to explicitly initialize with zeros.

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to find the "next greater element" or maintain a sequence with some ordering property. Recognizing this pattern is key to solving these problems efficiently:

1. **Next Greater Element I (Easy):** Direct application of the monotonic stack to find the next greater element for each element in an array.

2. **Online Stock Span (Medium):** Instead of finding the next greater element, you find how many consecutive previous days had prices less than or equal to the current day. This uses a monotonic decreasing stack to maintain a span of days.

3. **Largest Rectangle in Histogram (Hard):** A more complex application where you use monotonic stacks to find the nearest smaller element on both sides to calculate rectangle areas.

The common thread is maintaining a stack with elements in a specific order (monotonic) and using incoming elements to resolve pending calculations for elements in the stack.

## Key Takeaways

1. **Monotonic stacks are perfect for "next greater/smaller element" problems:** When you need to find the next element that satisfies some condition relative to previous elements, consider using a monotonic stack.

2. **Store indices, not values:** In most array-based problems using monotonic stacks, you need to store indices to calculate distances or positions in the final answer.

3. **Amortized O(n) time is possible:** Even with nested loops, if each element is pushed and popped at most once, the overall time complexity is O(n). This is a common optimization pattern.

Related problems: [Next Greater Element I](/problem/next-greater-element-i), [Online Stock Span](/problem/online-stock-span)
