---
title: "How to Solve Solving Questions With Brainpower — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Solving Questions With Brainpower. Medium difficulty, 60.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-04-27"
category: "dsa-patterns"
tags: ["solving-questions-with-brainpower", "array", "dynamic-programming", "medium"]
---

# How to Solve Solving Questions With Brainpower

You're given a list of exam questions where each question has points and brainpower cost. If you solve a question, you earn points but must skip the next few questions equal to the brainpower cost. You need to maximize your total points by deciding which questions to solve or skip. The tricky part is that skipping questions isn't free—it's forced when you solve a question, creating dependencies between decisions.

## Visual Walkthrough

Let's trace through a concrete example: `questions = [[3,2],[4,3],[4,4],[2,5]]`

We process questions from right to left (this will make sense when we discuss the DP approach):

**Question 3 (index 3):** `[2,5]`

- If we solve: get 2 points, skip next 5 questions (but there are none after)
- If we skip: get 0 points, move to next (none)
- Best: solve for 2 points

**Question 2 (index 2):** `[4,4]`

- If we solve: get 4 points, skip next 4 questions (goes beyond array)
- If we skip: get best from next question (question 3) = 2 points
- Best: solve for 4 points (4 > 2)

**Question 1 (index 1):** `[4,3]`

- If we solve: get 4 points, skip next 3 questions (goes to question 4, which doesn't exist)
- If we skip: get best from next question (question 2) = 4 points
- Best: tie, either gives 4 points

**Question 0 (index 0):** `[3,2]`

- If we solve: get 3 points, skip next 2 questions (goes to question 3) + best from question 3 = 3 + 2 = 5
- If we skip: get best from next question (question 1) = 4 points
- Best: solve for 5 points

Maximum points = 5

## Brute Force Approach

The brute force approach uses recursion to explore all possibilities. At each question `i`, we have two choices:

1. **Solve it**: Earn `points[i]`, then skip `brainpower[i]` questions, so next available question is `i + brainpower[i] + 1`
2. **Skip it**: Move to next question `i + 1`

We recursively explore both paths and take the maximum. This creates a binary decision tree with depth up to `n` (number of questions).

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def mostPointsBrute(questions):
    n = len(questions)

    def dfs(i):
        # Base case: no more questions
        if i >= n:
            return 0

        # Option 1: Skip current question
        skip = dfs(i + 1)

        # Option 2: Solve current question
        points, brainpower = questions[i]
        solve = points + dfs(i + brainpower + 1)

        # Return maximum of both options
        return max(skip, solve)

    return dfs(0)
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function mostPointsBrute(questions) {
  const n = questions.length;

  function dfs(i) {
    // Base case: no more questions
    if (i >= n) return 0;

    // Option 1: Skip current question
    const skip = dfs(i + 1);

    // Option 2: Solve current question
    const [points, brainpower] = questions[i];
    const solve = points + dfs(i + brainpower + 1);

    // Return maximum of both options
    return Math.max(skip, solve);
  }

  return dfs(0);
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
public long mostPointsBrute(int[][] questions) {
    int n = questions.length;
    return dfs(0, questions, n);
}

private long dfs(int i, int[][] questions, int n) {
    // Base case: no more questions
    if (i >= n) return 0;

    // Option 1: Skip current question
    long skip = dfs(i + 1, questions, n);

    // Option 2: Solve current question
    int points = questions[i][0];
    int brainpower = questions[i][1];
    long solve = points + dfs(i + brainpower + 1, questions, n);

    // Return maximum of both options
    return Math.max(skip, solve);
}
```

</div>

**Why it's too slow:** With `n` questions, we have 2 choices at each step, leading to `O(2^n)` time complexity. For `n = 1000`, this is computationally impossible. We're recomputing the same subproblems repeatedly—if we skip question 1, we compute the best from question 2 many times.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with optimal substructure. The optimal solution for questions starting at index `i` depends on optimal solutions for later questions.

**DP State:** `dp[i]` = maximum points we can earn starting from question `i`

**DP Transition:** At question `i`, we have two choices:

1. Skip it: `dp[i] = dp[i + 1]` (best from next question)
2. Solve it: `dp[i] = points[i] + dp[i + brainpower[i] + 1]` (points + best after skipping)

We take the maximum: `dp[i] = max(dp[i + 1], points[i] + dp[i + brainpower[i] + 1])`

**Why process from right to left:** Because `dp[i]` depends on `dp[i + 1]` and `dp[i + brainpower[i] + 1]` (later indices). If we process left to right, we'd need to know future values.

**Base case:** `dp[n] = 0` (no questions left)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def mostPoints(questions):
    n = len(questions)
    # dp[i] = max points starting from question i
    dp = [0] * (n + 1)  # Extra slot for base case

    # Process from right to left
    for i in range(n - 1, -1, -1):
        points, brainpower = questions[i]

        # Option 1: Skip current question
        skip = dp[i + 1]

        # Option 2: Solve current question
        # If solving takes us beyond array, next index is n (base case)
        next_index = i + brainpower + 1
        solve = points + (dp[next_index] if next_index <= n else 0)

        # Take maximum of both options
        dp[i] = max(skip, solve)

    return dp[0]  # Max points starting from first question
```

```javascript
// Time: O(n) | Space: O(n)
function mostPoints(questions) {
  const n = questions.length;
  // dp[i] = max points starting from question i
  const dp = new Array(n + 1).fill(0); // Extra slot for base case

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    const [points, brainpower] = questions[i];

    // Option 1: Skip current question
    const skip = dp[i + 1];

    // Option 2: Solve current question
    // If solving takes us beyond array, next index is n (base case)
    const nextIndex = i + brainpower + 1;
    const solve = points + (nextIndex <= n ? dp[nextIndex] : 0);

    // Take maximum of both options
    dp[i] = Math.max(skip, solve);
  }

  return dp[0]; // Max points starting from first question
}
```

```java
// Time: O(n) | Space: O(n)
public long mostPoints(int[][] questions) {
    int n = questions.length;
    // dp[i] = max points starting from question i
    long[] dp = new long[n + 1];  // Extra slot for base case

    // Process from right to left
    for (int i = n - 1; i >= 0; i--) {
        int points = questions[i][0];
        int brainpower = questions[i][1];

        // Option 1: Skip current question
        long skip = dp[i + 1];

        // Option 2: Solve current question
        // If solving takes us beyond array, next index is n (base case)
        int nextIndex = i + brainpower + 1;
        long solve = points + (nextIndex <= n ? dp[nextIndex] : 0);

        // Take maximum of both options
        dp[i] = Math.max(skip, solve);
    }

    return dp[0];  // Max points starting from first question
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n)` where `n` is the number of questions. We process each question exactly once in a single pass from right to left. Each question requires constant time operations: array access, addition, comparison.

**Space Complexity:** `O(n)` for the DP array. We could optimize to `O(1)` by only keeping track of the next few values we need, but the `O(n)` solution is clean and acceptable for interview settings.

## Common Mistakes

1. **Processing left to right:** This is the most common mistake. If you process left to right, `dp[i]` needs to know `dp[i + brainpower[i] + 1]`, which hasn't been computed yet. Always check dependency direction in DP problems.

2. **Forgetting the +1 in skip calculation:** When you solve question `i`, you skip `brainpower[i]` questions, so the next available question is `i + brainpower[i] + 1`, not `i + brainpower[i]`. The +1 accounts for moving past the current question itself.

3. **Array index out of bounds:** When `i + brainpower[i] + 1` exceeds `n`, we should use the base case value of 0. Always check bounds before accessing the DP array.

4. **Using int instead of long (Java specific):** Points can sum up to large values (up to 10^9 \* 10^5 = 10^14 with constraints). In Java, use `long` to avoid integer overflow.

## When You'll See This Pattern

This problem uses **DP with skip constraints**, similar to:

1. **House Robber (LeetCode 198):** Can't rob adjacent houses, similar to skipping questions after solving one. The DP transition is `dp[i] = max(dp[i+1], nums[i] + dp[i+2])`.

2. **Frog Jump (LeetCode 403):** The frog can jump certain distances, creating dependencies between stones. Both problems involve calculating reachable states based on previous decisions.

3. **Maximum Subarray Sum with Skip (variations):** Many problems where you can "take" an element with some penalty or skip requirement use similar DP formulations.

## Key Takeaways

1. **When decisions affect future availability** (like skipping questions after solving), think DP. The optimal solution at each step depends on optimal solutions for future steps.

2. **Process in reverse when future states determine current state.** If `dp[i]` depends on `dp[i + k]`, process from right to left. If it depends on `dp[i - k]`, process left to right.

3. **The DP state often represents "starting from position i".** Here, `dp[i]` = max points starting from question `i`. This is cleaner than alternatives like "maximum points up to question i".

Related problems: [House Robber](/problem/house-robber), [Frog Jump](/problem/frog-jump)
