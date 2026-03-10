---
title: "How to Solve Orderly Queue — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Orderly Queue. Hard difficulty, 66.7% acceptance rate. Topics: Math, String, Sorting."
date: "2027-10-22"
category: "dsa-patterns"
tags: ["orderly-queue", "math", "string", "sorting", "hard"]
---

# How to Solve Orderly Queue

This problem asks us to find the lexicographically smallest string possible by repeatedly taking one of the first `k` characters and moving it to the end. The challenge lies in understanding how the value of `k` fundamentally changes the problem's nature — with `k = 1`, we're limited to rotations, but with `k ≥ 2`, we can achieve any permutation.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: s = "cba", k = 1**

- Starting: "cba"
- Move 'c' to end: "bac"
- Move 'b' to end: "acb"
- Move 'a' to end: "cba" (back to start)
- The smallest among these rotations is "acb"

**Example 2: s = "baaca", k = 3**

- With k ≥ 2, we can effectively bubble sort the string:
  - Move 'b' to end: "aacab"
  - Move 'a' to end: "acaba"
  - Move 'c' to end: "aabac"
  - Continue until sorted: "aaabc"
- The key insight: when k ≥ 2, we can rearrange characters arbitrarily, so we just sort the string.

The critical observation is that **k = 1** and **k ≥ 2** are completely different problems requiring different approaches.

## Brute Force Approach

A naive approach would be to simulate all possible moves using BFS/DFS, exploring the state space of all possible string configurations. For each state, we'd generate k new states by moving each of the first k characters to the end, then continue exploring.

```python
def orderlyQueueBrute(s: str, k: int) -> str:
    from collections import deque

    visited = set()
    queue = deque([s])
    min_string = s

    while queue:
        current = queue.popleft()
        if current < min_string:
            min_string = current

        # Generate all possible next states
        for i in range(k):
            if i < len(current):
                next_str = current[:i] + current[i+1:] + current[i]
                if next_str not in visited:
                    visited.add(next_str)
                    queue.append(next_str)

    return min_string
```

**Why this fails:** The state space grows exponentially. For a string of length n, there are potentially n! unique permutations when k ≥ 2. Even for moderate n (like n=10), this becomes computationally infeasible with 3.6 million states.

## Optimized Approach

The key insight comes from analyzing what operations are possible with different k values:

1. **When k = 1**: We can only rotate the string. The operation is equivalent to taking the first character and moving it to the end. All we can generate are the n possible rotations of the original string. Therefore, we just need to find the lexicographically smallest rotation.

2. **When k ≥ 2**: We can achieve any permutation! Here's why:
   - With k = 2, we can effectively swap adjacent characters by moving one to the end, then the other, then bringing the first back
   - Once we can swap adjacent characters, we can implement bubble sort
   - Therefore, we can rearrange the string into any order, so the optimal solution is simply the sorted string

For k = 1, finding the smallest rotation efficiently requires a clever approach. The optimal method uses the concept of "doubling the string" — by concatenating the string with itself, every rotation appears as a substring of length n. We then find the lexicographically smallest substring.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) when k=1, O(n log n) when k>1 | Space: O(n)
def orderlyQueue(s: str, k: int) -> str:
    # Case 1: k >= 2 - we can rearrange characters arbitrarily
    if k > 1:
        # Simply return the sorted string since we can achieve any permutation
        return ''.join(sorted(s))

    # Case 2: k = 1 - we can only rotate the string
    # We need to find the lexicographically smallest rotation
    smallest = s

    # Check all possible rotations
    # For string of length n, there are n possible rotations
    for i in range(1, len(s)):
        # Rotation starting at index i: s[i:] + s[:i]
        current_rotation = s[i:] + s[:i]

        # Update smallest if current rotation is lexicographically smaller
        if current_rotation < smallest:
            smallest = current_rotation

    return smallest
```

```javascript
// Time: O(n^2) when k=1, O(n log n) when k>1 | Space: O(n)
function orderlyQueue(s, k) {
  // Case 1: k >= 2 - we can rearrange characters arbitrarily
  if (k > 1) {
    // Convert to array, sort, and join back to string
    return s.split("").sort().join("");
  }

  // Case 2: k = 1 - we can only rotate the string
  // We need to find the lexicographically smallest rotation
  let smallest = s;

  // Check all possible rotations
  // For string of length n, there are n possible rotations
  for (let i = 1; i < s.length; i++) {
    // Rotation starting at index i: s.substring(i) + s.substring(0, i)
    const currentRotation = s.substring(i) + s.substring(0, i);

    // Update smallest if current rotation is lexicographically smaller
    if (currentRotation < smallest) {
      smallest = currentRotation;
    }
  }

  return smallest;
}
```

```java
// Time: O(n^2) when k=1, O(n log n) when k>1 | Space: O(n)
import java.util.Arrays;

class Solution {
    public String orderlyQueue(String s, int k) {
        // Case 1: k >= 2 - we can rearrange characters arbitrarily
        if (k > 1) {
            // Convert to char array, sort, and create new string
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            return new String(chars);
        }

        // Case 2: k = 1 - we can only rotate the string
        // We need to find the lexicographically smallest rotation
        String smallest = s;

        // Check all possible rotations
        // For string of length n, there are n possible rotations
        for (int i = 1; i < s.length(); i++) {
            // Rotation starting at index i: s.substring(i) + s.substring(0, i)
            String currentRotation = s.substring(i) + s.substring(0, i);

            // Update smallest if current rotation is lexicographically smaller
            if (currentRotation.compareTo(smallest) < 0) {
                smallest = currentRotation;
            }
        }

        return smallest;
    }
}
```

</div>

**Optimization for k = 1**: While the above solution for k = 1 is O(n²) due to string concatenation and comparison, we can optimize to O(n) using the "doubling" technique:

```python
def orderlyQueueOptimized(s: str, k: int) -> str:
    if k > 1:
        return ''.join(sorted(s))

    # Double the string to easily find all rotations
    doubled = s + s
    smallest = s

    # Each rotation appears as a substring of length n in the doubled string
    for i in range(1, len(s)):
        candidate = doubled[i:i + len(s)]
        if candidate < smallest:
            smallest = candidate

    return smallest
```

This reduces the time complexity for k = 1 from O(n²) to O(n) by avoiding repeated string concatenation.

## Complexity Analysis

**Time Complexity:**

- When k = 1: O(n²) with naive approach, O(n) with optimized doubling approach
  - We check n rotations, each comparison takes O(n) time in worst case
  - With doubling technique, we avoid concatenation, reducing to O(n)
- When k ≥ 2: O(n log n)
  - Dominated by sorting the string

**Space Complexity:**

- When k = 1: O(n) for storing rotations (or O(1) with careful implementation)
- When k ≥ 2: O(n) for the sorted character array
- Overall: O(n) in all cases

## Common Mistakes

1. **Treating all k values the same**: The most common mistake is not recognizing that k = 1 and k ≥ 2 are fundamentally different problems. Candidates often try to apply the same logic to both cases.

2. **Inefficient rotation finding for k = 1**: Many candidates use O(n²) approaches by actually rotating the string n times. While acceptable for interviews, mentioning the O(n) doubling technique shows deeper understanding.

3. **Overcomplicating k ≥ 2 case**: Some candidates try to simulate the sorting process or use complex algorithms, not realizing that any permutation is achievable, so simple sorting suffices.

4. **Off-by-one errors with rotation indices**: When implementing rotation for k = 1, it's easy to make mistakes with substring indices, especially at boundaries (i = 0 or i = n).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Problem decomposition based on constraints**: Similar to problems where different input ranges require completely different algorithms. See:
   - **LeetCode 829: Consecutive Numbers Sum** - Different mathematical approaches based on the relationship between n and k
   - **LeetCode 780: Reaching Points** - Different strategies based on whether tx > ty or vice versa

2. **Finding lexicographically smallest rotation**: This is a classic string algorithm problem. Related problems include:
   - **LeetCode 796: Rotate String** - Checking if one string is a rotation of another
   - **Booth's Algorithm** - The optimal O(n) algorithm for smallest rotation (beyond interview scope but good to know)

3. **Operations that enable sorting**: Problems where you need to determine what permutations are achievable with given operations:
   - **LeetCode 1535: Find the Winner of an Array Game** - Understanding what reordering is possible with given constraints

## Key Takeaways

1. **Always analyze constraint thresholds**: When a problem has a parameter like k, check if different ranges of k lead to qualitatively different problems. The insight that k = 1 vs k ≥ 2 changes everything is the key to this problem.

2. **Understand what permutations are achievable**: Before designing complex algorithms, ask: "What's the full set of reachable states?" Often, the answer simplifies the problem dramatically.

3. **Classic string rotations**: Finding the smallest rotation is a known pattern — concatenate the string with itself and look for the smallest substring of length n.

[Practice this problem on CodeJeet](/problem/orderly-queue)
