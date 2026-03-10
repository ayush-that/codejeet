---
title: "Recursion Interview Questions: Patterns and Strategies"
description: "Master Recursion problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-05-08"
category: "dsa-patterns"
tags: ["recursion", "dsa", "interview prep"]
---

# Recursion Interview Questions: Patterns and Strategies

You've probably heard the joke: "To understand recursion, you must first understand recursion." It's clever, but in coding interviews, recursion is no laughing matter. I've watched countless candidates stumble on problems they could have aced if they'd recognized the recursive pattern hiding in plain sight.

Here's what catches people off guard: recursion problems rarely announce themselves. Take LeetCode 394: "Decode String." At first glance, it looks like a string parsing problem. You might start thinking about stacks and pointers. But the moment you encounter nested brackets like `"3[a2[c]]"`, you need to recognize this as a recursive decomposition problem. The string inside brackets needs to be decoded before it can be multiplied. Candidates who miss this recursive insight often write convoluted iterative solutions that fail on deeper nesting.

Recursion appears in 41 LeetCode questions, with a surprising distribution: 27% Easy, 41% Medium, and 32% Hard. That last number is telling—recursion problems often escalate to hard because they combine with other concepts like memoization, backtracking, or tree manipulation. Let's break down how to master this topic.

## Common Patterns

### 1. Divide and Conquer

This is recursion's bread and butter. You break a problem into smaller subproblems of the same type, solve each recursively, then combine results. The key insight is recognizing when a problem has self-similar structure.

LeetCode problems: Merge Sort (#148), Quick Sort, Binary Search variations.

The intuition: If you can solve a smaller version of the exact same problem, and combine those solutions to solve the larger problem, you have a divide-and-conquer candidate.

<div class="code-group">

```python
# LeetCode 148: Sort List (Merge Sort on Linked List)
# Time: O(n log n) | Space: O(log n) for recursion stack
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def sortList(head):
    if not head or not head.next:
        return head

    # 1. Divide: Split list into two halves
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    mid = slow.next
    slow.next = None  # Break the link

    # 2. Conquer: Sort each half recursively
    left = sortList(head)
    right = sortList(mid)

    # 3. Combine: Merge sorted halves
    dummy = ListNode()
    curr = dummy
    while left and right:
        if left.val < right.val:
            curr.next = left
            left = left.next
        else:
            curr.next = right
            right = right.next
        curr = curr.next

    curr.next = left if left else right
    return dummy.next
```

```javascript
// LeetCode 148: Sort List
// Time: O(n log n) | Space: O(log n) for recursion stack
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  if (!head || !head.next) return head;

  // Divide: Find middle
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  const mid = slow.next;
  slow.next = null; // Split the list

  // Conquer: Sort halves
  const left = sortList(head);
  const right = sortList(mid);

  // Combine: Merge
  const dummy = new ListNode();
  let curr = dummy;
  let l = left,
    r = right;

  while (l && r) {
    if (l.val < r.val) {
      curr.next = l;
      l = l.next;
    } else {
      curr.next = r;
      r = r.next;
    }
    curr = curr.next;
  }

  curr.next = l || r;
  return dummy.next;
}
```

```java
// LeetCode 148: Sort List
// Time: O(n log n) | Space: O(log n) for recursion stack
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;

    // Find middle
    ListNode slow = head;
    ListNode fast = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    ListNode mid = slow.next;
    slow.next = null;  // Split

    // Recursively sort halves
    ListNode left = sortList(head);
    ListNode right = sortList(mid);

    // Merge
    ListNode dummy = new ListNode();
    ListNode curr = dummy;

    while (left != null && right != null) {
        if (left.val < right.val) {
            curr.next = left;
            left = left.next;
        } else {
            curr.next = right;
            right = right.next;
        }
        curr = curr.next;
    }

    curr.next = (left != null) ? left : right;
    return dummy.next;
}
```

</div>

### 2. Backtracking

When you need to explore all possibilities (like generating permutations or solving puzzles), backtracking is your tool. The pattern: make a choice, recurse, then undo the choice to try the next option.

LeetCode problems: N-Queens (#51), Generate Parentheses (#22), Subsets (#78).

The intuition: You're building a solution incrementally, and when you hit a dead end, you retreat to the last valid state and try a different path.

<div class="code-group">

```python
# LeetCode 22: Generate Parentheses
# Time: O(4^n/√n) Catalan number | Space: O(n) for recursion stack
def generateParenthesis(n):
    result = []

    def backtrack(current, open_count, close_count):
        # Base case: valid combination found
        if len(current) == 2 * n:
            result.append("".join(current))
            return

        # Choice 1: Add opening parenthesis if we haven't used all
        if open_count < n:
            current.append('(')
            backtrack(current, open_count + 1, close_count)
            current.pop()  # Undo choice

        # Choice 2: Add closing parenthesis if it won't create imbalance
        if close_count < open_count:
            current.append(')')
            backtrack(current, open_count, close_count + 1)
            current.pop()  # Undo choice

    backtrack([], 0, 0)
    return result
```

```javascript
// LeetCode 22: Generate Parentheses
// Time: O(4^n/√n) | Space: O(n) for recursion stack
function generateParenthesis(n) {
  const result = [];

  function backtrack(current, openCount, closeCount) {
    if (current.length === 2 * n) {
      result.push(current.join(""));
      return;
    }

    if (openCount < n) {
      current.push("(");
      backtrack(current, openCount + 1, closeCount);
      current.pop();
    }

    if (closeCount < openCount) {
      current.push(")");
      backtrack(current, openCount, closeCount + 1);
      current.pop();
    }
  }

  backtrack([], 0, 0);
  return result;
}
```

```java
// LeetCode 22: Generate Parentheses
// Time: O(4^n/√n) | Space: O(n) for recursion stack
public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    backtrack(result, new StringBuilder(), 0, 0, n);
    return result;
}

private void backtrack(List<String> result, StringBuilder current,
                      int open, int close, int max) {
    if (current.length() == max * 2) {
        result.add(current.toString());
        return;
    }

    if (open < max) {
        current.append('(');
        backtrack(result, current, open + 1, close, max);
        current.deleteCharAt(current.length() - 1);
    }

    if (close < open) {
        current.append(')');
        backtrack(result, current, open, close + 1, max);
        current.deleteCharAt(current.length() - 1);
    }
}
```

</div>

### 3. Tree/Graph Traversal

Recursion is natural for trees because of their recursive definition: a tree is a node with children that are trees. Graph DFS also fits this pattern when you track visited nodes.

LeetCode problems: Maximum Depth of Binary Tree (#104), Invert Binary Tree (#226), Number of Islands (#200).

The intuition: Trees are recursively defined data structures, so recursive algorithms mirror that structure perfectly.

<div class="code-group">

```python
# LeetCode 200: Number of Islands (DFS approach)
# Time: O(m*n) | Space: O(m*n) worst case recursion stack
def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # Base cases: out of bounds or not land
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return

        # Mark as visited
        grid[r][c] = '0'

        # Explore all four directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)

    return count
```

```javascript
// LeetCode 200: Number of Islands
// Time: O(m*n) | Space: O(m*n) worst case recursion stack
function numIslands(grid) {
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== "1") {
      return;
    }

    grid[r][c] = "0"; // Mark visited

    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}
```

```java
// LeetCode 200: Number of Islands
// Time: O(m*n) | Space: O(m*n) worst case recursion stack
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    int count = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }

    return count;
}

private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
        return;
    }

    grid[r][c] = '0';  // Mark visited

    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
```

</div>

## When to Use Recursion vs Alternatives

Recognizing when recursion is appropriate—and when it's not—is a key interview skill. Here's my decision framework:

**Use recursion when:**

1. The problem has a natural recursive structure (trees, nested expressions, divide-and-conquer)
2. You need to explore all possibilities (backtracking problems)
3. The depth is guaranteed to be limited (balanced trees, limited input size)
4. The recursive solution is dramatically simpler than iterative

**Use iteration when:**

1. Stack depth could be large (deep recursion risks stack overflow)
2. You need tail recursion optimization but your language doesn't provide it
3. The problem has a simple iterative solution (Fibonacci with memoization is actually better iterative)
4. You're optimizing for memory (recursion uses call stack memory)

**Recursion vs BFS/DFS:** For tree/graph traversal, recursion is essentially DFS. Use BFS when you need shortest path (unweighted graphs) or level-order traversal. Use DFS (recursive) when you need to explore deep paths first or the recursive structure makes code cleaner.

**Example tradeoff:** LeetCode 104 (Maximum Depth of Binary Tree) can be solved recursively in 3 lines or iteratively with a queue. The recursive solution is cleaner unless you're worried about stack overflow on extremely unbalanced trees.

## Edge Cases and Gotchas

Interviewers love testing these recursion pitfalls:

### 1. Missing Base Case or Incorrect Termination

The most common recursion bug. Your function calls itself forever until stack overflow.

**Fix:** Always write your base case first. Ask: "What's the smallest version of this problem that doesn't need recursion?"

```python
# WRONG: Missing base case for empty tree
def treeHeight(node):
    return 1 + max(treeHeight(node.left), treeHeight(node.right))

# CORRECT:
def treeHeight(node):
    if not node:  # Base case
        return 0
    return 1 + max(treeHeight(node.left), treeHeight(node.right))
```

### 2. Not Handling Null/Empty Inputs

Recursive functions often assume non-null inputs in recursive calls, but the initial call might receive null.

**Fix:** Check for null at the start of your public function, not just in base cases.

### 3. Modifying Input When You Shouldn't

In backtracking or graph problems, you might mark cells as visited. If the interviewer wants the input preserved, you need to clone it or use a separate visited structure.

**Fix:** Clarify with interviewer: "Is it okay to modify the input array, or should I work on a copy?"

### 4. Exponential Time Without Memoization

Classic example: naive Fibonacci recursion is O(2^n). Many problems have overlapping subproblems.

**Fix:** Add memoization (caching) when you see the same subproblem being solved repeatedly.

<div class="code-group">

```python
# Naive Fibonacci: O(2^n) - TERRIBLE
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

# With memoization: O(n)
def fib_memo(n, memo={}):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
```

</div>

## Difficulty Breakdown

The 41 recursion problems break down as: 11 Easy (27%), 17 Medium (41%), 13 Hard (32%). Here's what this means for your preparation:

**Easy problems** test basic recursion understanding: tree traversals, simple backtracking. Master these first—they're foundation. If you struggle here, you'll drown in Medium/Hard.

**Medium problems** combine recursion with other concepts: memoization, more complex backtracking constraints, or recursion on non-tree structures. These are your priority—they're most common in interviews.

**Hard problems** often involve:

- Optimization with memoization (DP)
- Complex constraint satisfaction (N-Queens)
- Recursion on implicit graphs (Word Search II)
- Divide-and-conquer with non-trivial combine steps

Spend most time on Medium, ensure you can do all Easys quickly, then tackle a selection of Hards based on target companies.

## Which Companies Ask Recursion

**Amazon** (/company/amazon): Loves tree problems (serialization, traversal variations) and backtracking (word search, permutations). They often ask recursion in phone screens.

**Google** (/company/google): Prefers divide-and-conquer and recursion with memoization. Expect problems like "Decode String" or "Strobogrammatic Number."

**Bloomberg** (/company/bloomberg): Heavy on tree manipulation and traversal. Binary tree problems are common.

**Microsoft** (/company/microsoft): Mix of tree problems and recursive string manipulation. They like problems that can be solved both recursively and iteratively.

**Meta** (/company/meta): Backtracking and graph DFS. Problems like "Number of Islands" and "Subsets" appear frequently.

Each company has patterns: Amazon tests recursion fundamentals, Google tests optimization, Bloomberg tests tree mastery.

## Study Tips

1. **Start with Tree Problems** - Trees are the most intuitive recursive structure. Master pre-order, in-order, post-order traversals recursively before moving to more abstract problems.

2. **Practice the "Three Questions" for Any Recursive Problem:**
   - What's my base case? (When do I stop?)
   - What's my recursive case? (How do I break this down?)
   - How do I combine results? (For divide-and-conquer)

3. **Draw the Recursion Tree** - Literally sketch it out for small inputs. This reveals overlapping subproblems (needing memoization) and helps debug.

4. **Recommended Problem Order:**
   - Week 1: All Easy problems + Maximum Depth of Binary Tree (#104)
   - Week 2: Generate Parentheses (#22), Subsets (#78), Invert Binary Tree (#226)
   - Week 3: Decode String (#394), Number of Islands (#200), Permutations (#46)
   - Week 4: N-Queens (#51), Word Search II (#212), Merge k Sorted Lists (#23)

5. **Always Discuss Stack Overflow Risk** - In interviews, mention when recursion depth could be problematic and how you'd convert to iteration if needed.

Recursion is a mindset shift. Once you start seeing problems as self-similar decompositions, solutions become clearer. The patterns repeat: divide-and-conquer for sorting/search, backtracking for combinations, traversal for trees/graphs. Master these, and you'll handle most recursion questions thrown at you.

[Practice all Recursion questions on CodeJeet](/topic/recursion)
