---
title: "Enumeration Interview Questions: Patterns and Strategies"
description: "Master Enumeration problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-12"
category: "dsa-patterns"
tags: ["enumeration", "dsa", "interview prep"]
---

# Enumeration Interview Questions: Patterns and Strategies

You’re in an interview, feeling good about your solution to a problem. You’ve optimized it, considered edge cases, and explained your reasoning clearly. Then the interviewer asks: “What if we need to generate all possible valid combinations?” Suddenly, you realize you’ve been thinking about optimization when the problem actually requires enumeration—generating all possible solutions that meet certain criteria. This exact scenario plays out in interviews at Google, Amazon, and Meta, where enumeration questions make up a significant portion of their problem sets.

Enumeration problems are deceptively simple in concept but challenging in execution. They ask you to systematically generate all possible configurations, combinations, or arrangements that satisfy given constraints. The trap is that candidates often try to optimize prematurely, looking for shortcuts when the problem explicitly requires generating all valid outputs. A classic example is **Subsets II (LeetCode #90)**, where candidates who try to skip duplicates without proper tracking often produce incorrect results or miss valid subsets entirely.

What makes enumeration particularly important is that it tests fundamental computer science thinking: can you systematically explore a solution space without missing possibilities or generating duplicates? It’s not about finding one optimal answer—it’s about finding all valid answers, which requires different mental models and implementation strategies.

## Common Patterns

### 1. Backtracking with Pruning

This is the workhorse of enumeration problems. You recursively build candidates, abandoning partial candidates that cannot possibly lead to valid solutions (pruning). The key insight is that you’re performing a depth-first traversal of the solution space.

**LeetCode problems:** Subsets (#78), Combination Sum (#39), Permutations (#46)

<div class="code-group">

```python
def subsets(nums):
    """
    Generate all subsets of nums (including empty set).
    Time: O(n * 2^n) - 2^n subsets, each takes O(n) to copy
    Space: O(n) - recursion depth + current path
    """
    result = []

    def backtrack(start, current):
        # Add current subset to result
        result.append(current.copy())

        # Explore further elements
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)  # i+1 ensures we don't reuse elements
            current.pop()  # backtrack

    backtrack(0, [])
    return result
```

```javascript
function subsets(nums) {
  /**
   * Generate all subsets of nums (including empty set).
   * Time: O(n * 2^n) - 2^n subsets, each takes O(n) to copy
   * Space: O(n) - recursion depth + current path
   */
  const result = [];

  function backtrack(start, current) {
    // Add current subset to result
    result.push([...current]);

    // Explore further elements
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current); // i+1 ensures we don't reuse elements
      current.pop(); // backtrack
    }
  }

  backtrack(0, []);
  return result;
}
```

```java
public List<List<Integer>> subsets(int[] nums) {
    /**
     * Generate all subsets of nums (including empty set).
     * Time: O(n * 2^n) - 2^n subsets, each takes O(n) to copy
     * Space: O(n) - recursion depth + current path
     */
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> current,
                       List<List<Integer>> result) {
    // Add current subset to result
    result.add(new ArrayList<>(current));

    // Explore further elements
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);
        backtrack(nums, i + 1, current, result);  // i+1 ensures we don't reuse elements
        current.remove(current.size() - 1);  // backtrack
    }
}
```

</div>

### 2. Iterative Bitmask Enumeration

When dealing with subsets of a fixed set, each subset can be represented by a bitmask where bit i indicates whether element i is included. This approach is particularly useful when n ≤ 20 (since 2²⁰ ≈ 1 million operations).

**LeetCode problems:** Subsets (#78), Letter Case Permutation (#784), Maximum Product of Word Lengths (#318)

<div class="code-group">

```python
def subsets_bitmask(nums):
    """
    Generate all subsets using bitmask representation.
    Time: O(n * 2^n) - iterate through 2^n masks, each takes O(n) to build subset
    Space: O(n * 2^n) - to store all subsets (output space)
    """
    n = len(nums)
    result = []

    # Each mask from 0 to 2^n - 1 represents a subset
    for mask in range(1 << n):  # 1 << n = 2^n
        subset = []
        for i in range(n):
            # Check if i-th bit is set in mask
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)

    return result
```

```javascript
function subsetsBitmask(nums) {
  /**
   * Generate all subsets using bitmask representation.
   * Time: O(n * 2^n) - iterate through 2^n masks, each takes O(n) to build subset
   * Space: O(n * 2^n) - to store all subsets (output space)
   */
  const n = nums.length;
  const result = [];

  // Each mask from 0 to 2^n - 1 represents a subset
  for (let mask = 0; mask < 1 << n; mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      // Check if i-th bit is set in mask
      if (mask & (1 << i)) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }

  return result;
}
```

```java
public List<List<Integer>> subsetsBitmask(int[] nums) {
    /**
     * Generate all subsets using bitmask representation.
     * Time: O(n * 2^n) - iterate through 2^n masks, each takes O(n) to build subset
     * Space: O(n * 2^n) - to store all subsets (output space)
     */
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();

    // Each mask from 0 to 2^n - 1 represents a subset
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            // Check if i-th bit is set in mask
            if ((mask & (1 << i)) != 0) {
                subset.add(nums[i]);
            }
        }
        result.add(subset);
    }

    return result;
}
```

</div>

### 3. BFS Level-by-Level Enumeration

For problems where you need to generate all possibilities level by level (like all strings of length k, or all possible states after k operations), BFS is often the right approach. Each level represents all possibilities of a certain size or after a certain number of steps.

**LeetCode problems:** Generate Parentheses (#22), Letter Combinations of a Phone Number (#17), Word Ladder II (#126)

<div class="code-group">

```python
from collections import deque

def letterCombinations(digits):
    """
    Generate all letter combinations for phone digits.
    Time: O(4^n * n) - worst case 4 letters per digit, n digits
    Space: O(4^n) - to store all combinations (output space)
    """
    if not digits:
        return []

    phone_map = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }

    queue = deque([''])

    for digit in digits:
        level_size = len(queue)
        for _ in range(level_size):
            current = queue.popleft()
            for letter in phone_map[digit]:
                queue.append(current + letter)

    return list(queue)
```

```javascript
function letterCombinations(digits) {
  /**
   * Generate all letter combinations for phone digits.
   * Time: O(4^n * n) - worst case 4 letters per digit, n digits
   * Space: O(4^n) - to store all combinations (output space)
   */
  if (!digits.length) return [];

  const phoneMap = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };

  let queue = [""];

  for (let digit of digits) {
    const levelSize = queue.length;
    const nextQueue = [];

    for (let i = 0; i < levelSize; i++) {
      const current = queue[i];
      for (let letter of phoneMap[digit]) {
        nextQueue.push(current + letter);
      }
    }

    queue = nextQueue;
  }

  return queue;
}
```

```java
public List<String> letterCombinations(String digits) {
    /**
     * Generate all letter combinations for phone digits.
     * Time: O(4^n * n) - worst case 4 letters per digit, n digits
     * Space: O(4^n) - to store all combinations (output space)
     */
    List<String> result = new ArrayList<>();
    if (digits == null || digits.length() == 0) {
        return result;
    }

    String[] phoneMap = {
        "", "", "abc", "def", "ghi", "jkl", "mno",
        "pqrs", "tuv", "wxyz"
    };

    Queue<String> queue = new LinkedList<>();
    queue.offer("");

    for (int i = 0; i < digits.length(); i++) {
        int digit = digits.charAt(i) - '0';
        int levelSize = queue.size();

        for (int j = 0; j < levelSize; j++) {
            String current = queue.poll();
            for (char letter : phoneMap[digit].toCharArray()) {
                queue.offer(current + letter);
            }
        }
    }

    result.addAll(queue);
    return result;
}
```

</div>

## When to Use Enumeration vs Alternatives

The key distinction is in the problem statement. Enumeration is required when:

- The problem asks for "all possible" solutions, combinations, or arrangements
- You need to generate every valid configuration
- The output size is explicitly part of the problem (e.g., "return all subsets")

**Enumeration vs Optimization:** If a problem asks for "the maximum" or "the minimum," it's typically an optimization problem that might use similar techniques (like backtracking) but with pruning based on optimality criteria. Enumeration problems require you to keep all valid solutions, not just the best one.

**Backtracking vs BFS/DFS:** Use backtracking when you need to build solutions incrementally and prune invalid partial solutions. Use BFS when you need all solutions of a certain "distance" or "level" (like all strings of length k). Use DFS when the solution space is a tree and you want to explore deeply first.

**Bitmask vs Backtracking:** Bitmask is cleaner for subset problems with n ≤ 20. Backtracking is more flexible for problems with constraints (like "sum must equal target") or when you need to handle duplicates.

**Decision criteria:**

1. If n > 20, 2^n is too large—look for constraints to prune the search space
2. If duplicates in input, you'll need sorting + skipping logic in backtracking
3. If output needs to be in specific order, consider how your enumeration order affects this

## Edge Cases and Gotchas

### 1. Duplicate Handling

This is the most common pitfall in enumeration problems. When the input contains duplicates, naive enumeration will produce duplicate outputs. The solution is to sort the input and skip duplicates during enumeration.

**Example:** In Subsets II (#90), after sorting `[1,2,2]`, when you're at the second `2`, you should skip it if you didn't include the first `2` in the current subset.

### 2. Output Order Matters

Some problems require outputs in lexicographical order or a specific order. If you enumerate in the wrong order, you might need to sort at the end, adding O(n log n) time. Better to enumerate in the correct order from the start.

### 3. Memory Explosion

Enumeration can generate massive output. For example, all subsets of 20 elements is 1,048,576 subsets. If each subset averages 10 elements, that's 10MB of output. In an interview, discuss this tradeoff—sometimes the problem expects you to generate an iterator or use minimal memory.

### 4. Base Cases and Empty Inputs

Always check: What if the input is empty? What if constraints make no solution possible? For example, in Combination Sum (#39), if target < smallest number, there are no solutions. Handle these gracefully.

## Difficulty Breakdown

With 110 enumeration questions split as 25 Easy (23%), 55 Medium (50%), and 30 Hard (27%), here's what this means for your preparation:

**Easy problems** are about understanding the basic enumeration patterns. These are your foundation—master these before moving on. They typically have small constraints (n ≤ 10) and straightforward requirements.

**Medium problems** are where most interview questions live. These add constraints, require duplicate handling, or combine enumeration with other techniques (like checking validity). Spend most of your time here.

**Hard problems** often involve:

- Very large solution spaces that require clever pruning
- Multiple constraints that interact in complex ways
- Combinations of enumeration with other algorithms (like DP or graph search)

Prioritize Medium problems, use Easy for pattern recognition, and tackle Hard problems only after you're comfortable with Mediums.

## Which Companies Ask Enumeration

**Google** (/company/google) loves enumeration problems that test systematic thinking. They often ask problems like Generate Parentheses (#22) and Word Squares (#425) that require generating all valid configurations with constraints.

**Amazon** (/company/amazon) frequently asks subset and combination problems in their interviews, particularly those related to real-world scenarios like product combinations or feature selections.

**Meta** (/company/meta) prefers enumeration problems that can be solved with backtracking, especially those related to their products (like generating all possible post arrangements or friend combinations).

**Microsoft** (/company/microsoft) often includes permutation and combination problems, sometimes with a twist involving strings or arrays.

**Bloomberg** (/company/bloomberg) asks enumeration problems related to data analysis scenarios, like generating all possible report formats or data visualizations.

Each company has a slightly different style: Google tests pure algorithmic thinking, Amazon looks for practical application, Meta emphasizes clean recursive solutions, Microsoft likes string manipulations, and Bloomberg focuses on data-oriented problems.

## Study Tips

1. **Master the three fundamental patterns first:** Backtracking, bitmask, and BFS enumeration. Solve 2-3 problems of each type until the pattern becomes muscle memory.

2. **Recommended problem order:**
   - Start with Subsets (#78) to understand basic backtracking
   - Move to Permutations (#46) to learn about different exploration orders
   - Try Combination Sum (#39) to learn constraint-based pruning
   - Tackle Generate Parentheses (#22) for BFS-style enumeration
   - Finally, attempt Subsets II (#90) to master duplicate handling

3. **Always implement with pruning in mind:** Even when not strictly necessary, practice adding pruning conditions. This trains you to think about optimization, which is crucial for harder problems.

4. **Draw the recursion tree:** For backtracking problems, physically draw the first few levels of the recursion tree. This visualization helps you understand the exploration order and where duplicates might occur.

5. **Time your practice:** Enumeration problems can have exponential time complexity. Get comfortable analyzing and explaining why O(n × 2^n) or O(n!) is acceptable given the constraints.

Remember: Enumeration is about systematic completeness, not optimization. Your goal is to generate all valid solutions without missing any or creating duplicates. This requires careful tracking of state and thoughtful exploration order.

The key to success is recognizing when a problem requires enumeration (look for "all possible" in the description) and then selecting the appropriate pattern based on the constraints and output requirements.

[Practice all Enumeration questions on CodeJeet](/topic/enumeration)
