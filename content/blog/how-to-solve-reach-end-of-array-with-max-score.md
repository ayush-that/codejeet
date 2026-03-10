---
title: "How to Solve Reach End of Array With Max Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reach End of Array With Max Score. Medium difficulty, 33.4% acceptance rate. Topics: Array, Greedy."
date: "2029-05-28"
category: "dsa-patterns"
tags: ["reach-end-of-array-with-max-score", "array", "greedy", "medium"]
---

# How to Solve Reach End of Array With Max Score

This problem asks us to find the maximum possible score when jumping from the start to the end of an array, where each jump's score depends on both the distance jumped and the value at the starting index. The tricky part is that we need to maximize the total score across multiple jumps, not just reach the end with any path.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 5, 3, 1, 4]`

We start at index 0 and must reach index 4. The score for jumping from `i` to `j` is `(j - i) * nums[i]`.

**Step-by-step reasoning:**

1. From index 0 (value 2), we could jump to any later index:
   - Jump to 1: score = (1-0)\*2 = 2
   - Jump to 2: score = (2-0)\*2 = 4
   - Jump to 3: score = (3-0)\*2 = 6
   - Jump to 4: score = (4-0)\*2 = 8

2. But we need to consider the _entire path_, not just the first jump. If we jump from 0→4 directly, we get score 8 and we're done.

3. What if we make multiple jumps? Let's try 0→2→4:
   - 0→2: score = (2-0)\*2 = 4
   - 2→4: score = (4-2)\*3 = 6
   - Total = 4 + 6 = 10 (better than 8!)

4. Try 0→1→4:
   - 0→1: score = (1-0)\*2 = 2
   - 1→4: score = (4-1)\*5 = 15
   - Total = 17 (even better!)

5. Try 0→1→3→4:
   - 0→1: score = 2
   - 1→3: score = (3-1)\*5 = 10
   - 3→4: score = (4-3)\*1 = 1
   - Total = 13 (worse than 17)

The key insight: The best path ending at index `j` depends on choosing the best previous index `i` to jump from, where `i < j`.

## Brute Force Approach

A naive solution would try all possible jump sequences from start to end. For each position, we could jump to any later position, leading to an exponential number of paths.

**Why this fails:**

- With `n` elements, there are potentially `2^(n-2)` paths (for each intermediate position, we can either include it or not).
- For `n=1000`, this is computationally impossible (2^998 ≈ 3×10^300 operations).
- We're doing redundant work: the score to reach position `j` is computed many times for different paths.

Even a dynamic programming approach that tries all `i→j` pairs would be O(n²), which for `n=10^5` would be 10^10 operations — still too slow.

## Optimized Approach

The key optimization comes from rewriting the problem mathematically:

Let `dp[j]` = maximum score to reach index `j`.

To reach `j`, we must jump from some `i < j`:

```
dp[j] = max(dp[i] + (j - i) * nums[i]) for all i < j
```

Expanding this:

```
dp[j] = max(dp[i] - i*nums[i] + j*nums[i]) for all i < j
```

Notice that for fixed `j`, we want to maximize `(dp[i] - i*nums[i]) + j*nums[i]`. The term `j*nums[i]` depends on both `j` and `i`, but we can think of it as: for each potential previous index `i`, we have a "line" with slope `nums[i]` and intercept `dp[i] - i*nums[i]`.

This is a **convex hull trick** problem! We need to maintain the upper envelope of lines and query for the maximum value at `x = j`.

However, there's an even simpler observation: Since `nums[i]` is the slope, and we're querying at increasing `x` values (j increases), and the slopes are arbitrary, we can use a Li Chao segment tree or a dynamic convex hull. But given the constraints, we need O(n log n) or better.

Actually, let's look more carefully. The recurrence is:

```
dp[j] = max(dp[i] + j*nums[i] - i*nums[i])
```

For each `i`, `nums[i]` is fixed, and `dp[i] - i*nums[i]` is fixed once we compute `dp[i]`. So when evaluating `dp[j]`, we want:

```
dp[j] = max(m_i * j + b_i) for all i < j
```

where `m_i = nums[i]` and `b_i = dp[i] - i*nums[i]`.

This is exactly the **line container** problem! We need to:

1. Add lines as we compute them (slope = nums[i], intercept = dp[i] - i\*nums[i])
2. Query for maximum at x = j

We can use a monotonic deque approach if the slopes are monotonic, but they're not guaranteed to be. So we need a full dynamic convex hull.

## Optimal Solution

We'll use a Li Chao segment tree, which handles arbitrary slopes and queries in O(log C) time, where C is the range of x-values. Since x = j ranges from 0 to n-1, we can use a segment tree over [0, n-1].

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxScore(nums):
    n = len(nums)
    if n == 1:
        return 0  # Already at the end, no jumps needed

    # Li Chao Segment Tree for maximum
    # We'll query at integer points from 0 to n-1
    # Each node stores the best line for its segment

    # Line representation: y = m*x + b
    class Line:
        def __init__(self, m, b):
            self.m = m  # slope
            self.b = b  # intercept

        def eval(self, x):
            return self.m * x + self.b

    # Segment tree size: next power of 2 >= n
    size = 1
    while size < n:
        size <<= 1
    tree = [None] * (2 * size)  # Store lines

    def add_line(new_line, node, left, right):
        if tree[node] is None:
            tree[node] = new_line
            return

        mid = (left + right) // 2

        # Check which line is better at mid
        curr = tree[node]
        left_eval_new = new_line.eval(left)
        right_eval_new = new_line.eval(right)
        left_eval_curr = curr.eval(left)
        right_eval_curr = curr.eval(right)

        # If new line is better at both ends, replace completely
        if left_eval_new >= left_eval_curr and right_eval_new >= right_eval_curr:
            tree[node] = new_line
            return
        # If current line is better at both ends, keep it
        if left_eval_new <= left_eval_curr and right_eval_new <= right_eval_curr:
            return

        # Lines cross in this segment, keep the better one at mid
        # and push the worse one to the appropriate child
        if new_line.eval(mid) > curr.eval(mid):
            # Swap so tree[node] is the better one at mid
            tree[node], new_line = new_line, curr

        if new_line.eval(left) > tree[node].eval(left):
            add_line(new_line, node*2, left, mid)
        else:
            add_line(new_line, node*2+1, mid+1, right)

    def query(x, node, left, right):
        if tree[node] is None:
            return float('-inf')

        res = tree[node].eval(x)
        if left == right:
            return res

        mid = (left + right) // 2
        if x <= mid:
            return max(res, query(x, node*2, left, mid))
        else:
            return max(res, query(x, node*2+1, mid+1, right))

    # Initialize DP array
    dp = [0] * n
    # Start at index 0 with score 0

    # Add the first line: from index 0 we can jump
    # slope = nums[0], intercept = dp[0] - 0*nums[0] = 0
    add_line(Line(nums[0], 0), 1, 0, n-1)

    # Compute DP values
    for j in range(1, n):
        # Query maximum at x = j
        dp[j] = query(j, 1, 0, n-1)

        # Add line for index j (for future jumps from j)
        if j < n-1:  # No need to add line for last index
            m = nums[j]  # slope
            b = dp[j] - j * nums[j]  # intercept
            add_line(Line(m, b), 1, 0, n-1)

    return dp[n-1]
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxScore(nums) {
  const n = nums.length;
  if (n === 1) return 0; // Already at the end

  // Line class
  class Line {
    constructor(m, b) {
      this.m = m; // slope
      this.b = b; // intercept
    }

    eval(x) {
      return this.m * x + this.b;
    }
  }

  // Build segment tree size (next power of 2 >= n)
  let size = 1;
  while (size < n) size <<= 1;
  const tree = new Array(2 * size).fill(null);

  // Add line to segment tree
  function addLine(newLine, node, left, right) {
    if (tree[node] === null) {
      tree[node] = newLine;
      return;
    }

    const mid = Math.floor((left + right) / 2);
    const curr = tree[node];

    // Evaluate at endpoints
    const leftNew = newLine.eval(left);
    const rightNew = newLine.eval(right);
    const leftCurr = curr.eval(left);
    const rightCurr = curr.eval(right);

    // If new line dominates completely
    if (leftNew >= leftCurr && rightNew >= rightCurr) {
      tree[node] = newLine;
      return;
    }
    // If current line dominates completely
    if (leftNew <= leftCurr && rightNew <= rightCurr) {
      return;
    }

    // Lines cross in this segment
    if (newLine.eval(mid) > curr.eval(mid)) {
      // Swap so tree[node] has better line at mid
      [tree[node], newLine] = [newLine, curr];
    }

    if (newLine.eval(left) > tree[node].eval(left)) {
      addLine(newLine, node * 2, left, mid);
    } else {
      addLine(newLine, node * 2 + 1, mid + 1, right);
    }
  }

  // Query maximum at point x
  function query(x, node, left, right) {
    if (tree[node] === null) {
      return -Infinity;
    }

    let res = tree[node].eval(x);
    if (left === right) {
      return res;
    }

    const mid = Math.floor((left + right) / 2);
    if (x <= mid) {
      return Math.max(res, query(x, node * 2, left, mid));
    } else {
      return Math.max(res, query(x, node * 2 + 1, mid + 1, right));
    }
  }

  // DP array
  const dp = new Array(n).fill(0);

  // Add initial line from index 0
  addLine(new Line(nums[0], 0), 1, 0, n - 1);

  // Compute DP
  for (let j = 1; j < n; j++) {
    dp[j] = query(j, 1, 0, n - 1);

    // Add line for current index (if not last)
    if (j < n - 1) {
      const m = nums[j];
      const b = dp[j] - j * nums[j];
      addLine(new Line(m, b), 1, 0, n - 1);
    }
  }

  return dp[n - 1];
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    static class Line {
        long m, b;  // slope and intercept

        Line(long m, long b) {
            this.m = m;
            this.b = b;
        }

        long eval(long x) {
            return m * x + b;
        }
    }

    public long maxScore(int[] nums) {
        int n = nums.length;
        if (n == 1) return 0;

        // Build segment tree (Li Chao tree)
        int size = 1;
        while (size < n) size <<= 1;
        Line[] tree = new Line[2 * size];

        // Add line to segment tree
        addLine(new Line(nums[0], 0L), 1, 0, n - 1, tree);

        long[] dp = new long[n];

        for (int j = 1; j < n; j++) {
            // Query maximum at x = j
            dp[j] = query(j, 1, 0, n - 1, tree);

            // Add line for current index (if not last)
            if (j < n - 1) {
                long m = nums[j];
                long b = dp[j] - j * m;
                addLine(new Line(m, b), 1, 0, n - 1, tree);
            }
        }

        return dp[n - 1];
    }

    private void addLine(Line newLine, int node, int left, int right, Line[] tree) {
        if (tree[node] == null) {
            tree[node] = newLine;
            return;
        }

        int mid = left + (right - left) / 2;
        Line curr = tree[node];

        // Check if one line dominates the other
        boolean leftBetter = newLine.eval(left) >= curr.eval(left);
        boolean rightBetter = newLine.eval(right) >= curr.eval(right);

        if (leftBetter && rightBetter) {
            tree[node] = newLine;
            return;
        }
        if (!leftBetter && !rightBetter) {
            return;
        }

        // Lines cross in this segment
        if (newLine.eval(mid) > curr.eval(mid)) {
            // Swap lines
            tree[node] = newLine;
            newLine = curr;
            curr = tree[node];
        }

        if (newLine.eval(left) > curr.eval(left)) {
            addLine(newLine, node * 2, left, mid, tree);
        } else {
            addLine(newLine, node * 2 + 1, mid + 1, right, tree);
        }
    }

    private long query(int x, int node, int left, int right, Line[] tree) {
        if (tree[node] == null) {
            return Long.MIN_VALUE;
        }

        long res = tree[node].eval(x);
        if (left == right) {
            return res;
        }

        int mid = left + (right - left) / 2;
        if (x <= mid) {
            return Math.max(res, query(x, node * 2, left, mid, tree));
        } else {
            return Math.max(res, query(x, node * 2 + 1, mid + 1, right, tree));
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We process each of the n indices once
- For each index, we perform:
  - One query: O(log n) for the segment tree query
  - One insertion (except last): O(log n) for adding a line to the segment tree
- Total: O(n log n)

**Space Complexity:** O(n)

- The segment tree uses O(n) space (2 \* next_power_of_2(n) nodes)
- The DP array uses O(n) space
- Total: O(n)

## Common Mistakes

1. **Trying O(n²) DP:** Many candidates will write the obvious DP solution that checks all `i < j` for each `j`. This is O(n²), which times out for n=10^5. Always check constraints first!

2. **Missing the line transformation:** The key insight is rewriting `dp[i] + (j-i)*nums[i]` as `(dp[i] - i*nums[i]) + j*nums[i]`. Without this, you won't see the line structure.

3. **Handling integer overflow:** Since scores can be large (n up to 10^5, nums[i] up to 10^5), the maximum score is ~10^10, which fits in 64-bit but not 32-bit. Use `long` in Java, `int64` in Python.

4. **Forgetting the base case:** When n=1, we're already at the end with score 0 (no jumps needed). Some implementations might return nums[0] or other incorrect values.

## When You'll See This Pattern

This **convex hull optimization** pattern appears in problems where you have a DP recurrence of the form:

```
dp[i] = min/max(dp[j] + a[i]*b[j] + c[j])
```

which can be rewritten as lines.

Related LeetCode problems:

1. **"Maximum Profit in Job Scheduling"** (LeetCode 1235) - Similar DP optimization with binary search
2. **"Best Time to Buy and Sell Stock IV"** (LeetCode 188) - Uses related optimization techniques
3. **"Cherry Pickup II"** (LeetCode 1463) - Multi-dimensional DP with optimization

## Key Takeaways

1. **Recognize the pattern:** When your DP recurrence has terms that mix `i` and `j` multiplicatively (`a[i]*b[j]`), consider if it can be rewritten as lines for convex hull optimization.

2. **Li Chao segment tree:** A powerful tool for dynamic convex hull when slopes aren't monotonic. It handles arbitrary line additions and point queries in O(log range).

3. **Always check constraints:** The O(n²) DP is obvious but insufficient for n=10^5. This teaches you to look for mathematical optimizations when n is large.

[Practice this problem on CodeJeet](/problem/reach-end-of-array-with-max-score)
