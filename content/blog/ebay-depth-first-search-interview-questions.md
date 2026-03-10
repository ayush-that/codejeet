---
title: "Depth-First Search Questions at eBay: What to Expect"
description: "Prepare for Depth-First Search interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-10"
category: "dsa-patterns"
tags: ["ebay", "depth-first-search", "interview prep"]
---

If you're preparing for an eBay software engineering interview, you'll likely encounter Depth-First Search (DFS). With 10 out of their 60 total tagged questions being DFS-related, it's a significant, recurring theme—not a niche topic. This frequency suggests interviewers at eBay view DFS not just as an algorithm, but as a fundamental problem-solving paradigm for navigating hierarchical data, exploring state spaces, and implementing backtracking. In my experience, and from conversations with engineers there, you can expect at least one DFS-based question in most onsite loops, often in the second coding round where problems involve more complex data modeling.

The key insight is that eBay's DFS questions are rarely about simple tree traversal. They are almost always applied. You're not asked to print inorder traversal; you're asked to use that traversal pattern to validate a BST, serialize a customer's bid history, or find dependencies in a service graph. The algorithm is the tool; the real test is recognizing when to reach for it.

## Specific Patterns eBay Favors

eBay's problem set shows a clear preference for **DFS on implicit graphs and trees, combined with backtracking or state tracking**. They lean heavily on problems where you must explore all possible configurations or paths under certain constraints, which mirrors real-world scenarios like inventory allocation, search ranking permutations, or payment routing validation.

You'll see two dominant flavors:

1.  **Backtracking for Generation/Enumeration:** Problems where you must build all valid combinations or permutations, often with a pruning condition. Think "generate all valid search queries" or "find all possible auction bid sequences."
2.  **DFS with Memoization (Top-Down DP):** Problems where a naive recursive exploration would be explosively slow, requiring you to add a cache. This tests if you can identify overlapping subproblems _within_ a DFS framework.

A quintessential example is **LeetCode 39. Combination Sum**. It's a perfect blend of backtracking (exploring combinations) with a pruning condition (stopping when the sum exceeds the target). Another favorite is **LeetCode 133. Clone Graph**, which tests DFS (or BFS) on an explicit graph structure, requiring careful state management to avoid cycles—a direct analog for cloning a network of user or item relationships.

## How to Prepare

The most common mistake is practicing DFS in isolation. At eBay, you must master the transition from a recursive skeleton to a solution that incorporates path tracking, pruning, and state. Let's look at the core backtracking pattern, which is the workhorse for probably half of their DFS questions.

<div class="code-group">

```python
def backtrack_template(path, state, options):
    """
    A generic backtracking DFS skeleton.
    path: current partial solution (e.g., list)
    state: summary of current path (e.g., current sum, last index)
    options: what can be appended next
    """
    # 1. Base Case: Is the current path a complete, valid solution?
    if is_complete(state):
        result.append(path.copy())  # Must copy!
        return

    # 2. Iterate over all possible next choices
    for choice in options:
        # 3. Prune invalid choices early (critical for efficiency)
        if not is_valid(state, choice):
            continue

        # 4. Make the choice
        path.append(choice)
        update(state, choice)

        # 5. Recurse with the new state
        backtrack_template(path, state, generate_options(state))

        # 6. Undo the choice (backtrack)
        undo(state, choice)
        path.pop()

# Example: LeetCode 39. Combination Sum
def combinationSum(candidates, target):
    res = []
    candidates.sort()  # Sorting enables pruning in step 3

    def dfs(start, path, rem):
        # Base case: valid solution
        if rem == 0:
            res.append(path.copy())
            return
        # Explore options
        for i in range(start, len(candidates)):
            num = candidates[i]
            # Prune: if the smallest option exceeds remainder, stop this branch
            if num > rem:
                break  # sorted list allows 'break' not 'continue'
            # Make choice
            path.append(num)
            # Recurse: i (not i+1) allows re-use of same element
            dfs(i, path, rem - num)
            # Undo choice
            path.pop()

    dfs(0, [], target)
    return res
# Time: O(N^(T/M)) where N = candidates, T = target, M = min(candidate). In practice, pruning makes it faster.
# Space: O(T/M) for the recursion depth and path.
```

```javascript
/**
 * Generic Backtracking Skeleton
 */
function backtrackTemplate(path, state, options) {
  if (isComplete(state)) {
    result.push([...path]); // Shallow copy
    return;
  }

  for (let choice of options) {
    if (!isValid(state, choice)) continue;

    // Make choice
    path.push(choice);
    updateState(state, choice);

    // Recurse
    backtrackTemplate(path, state, generateOptions(state));

    // Undo choice
    undoState(state, choice);
    path.pop();
  }
}

// Example: LeetCode 39. Combination Sum
function combinationSum(candidates, target) {
  const res = [];
  candidates.sort((a, b) => a - b);

  function dfs(startIdx, currentPath, remaining) {
    if (remaining === 0) {
      res.push([...currentPath]);
      return;
    }

    for (let i = startIdx; i < candidates.length; i++) {
      const num = candidates[i];
      if (num > remaining) break; // Prune

      currentPath.push(num);
      dfs(i, currentPath, remaining - num); // Note: 'i' not 'i+1'
      currentPath.pop(); // Backtrack
    }
  }

  dfs(0, [], target);
  return res;
}
// Time: O(N^(T/M)) | Space: O(T/M) for recursion depth.
```

```java
import java.util.*;

// Example: LeetCode 39. Combination Sum
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates); // Enable pruning

        backtrack(res, new ArrayList<>(), candidates, target, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> tempList,
                           int[] nums, int remain, int start) {
        // Base case: valid solution
        if (remain == 0) {
            res.add(new ArrayList<>(tempList)); // Must create a new copy
            return;
        }

        for (int i = start; i < nums.length; i++) {
            int num = nums[i];
            // Prune: if this number is too big, all later numbers are also too big (sorted)
            if (num > remain) break;

            // Make choice
            tempList.add(num);
            // Recurse: give current index 'i' to allow reuse
            backtrack(res, tempList, nums, remain - num, i);
            // Undo choice
            tempList.remove(tempList.size() - 1);
        }
    }
}
// Time: O(N^(T/M)) | Space: O(T/M) for recursion depth.
```

</div>

The second critical pattern is **DFS with Memoization**. This is where you add a cache (often a dictionary/hash map) to your recursive function to store results for given states. eBay uses this to test your ability to optimize a working but exponential solution.

<div class="code-group">

```python
# Example Pattern: DFS with Memoization
from functools import lru_cache

def dfs_with_memo(state):
    # 1. Check if result for this state is already computed
    if state in memo:
        return memo[state]

    # 2. Base cases
    if is_base_case(state):
        memo[state] = base_value
        return base_value

    result = initial_value
    # 3. Explore all substates
    for next_state in get_next_states(state):
        sub_result = dfs_with_memo(next_state)
        result = combine(result, sub_result)  # e.g., min, max, add

    # 4. Store and return
    memo[state] = result
    return result

# Concrete Example: LeetCode 139. Word Break (Top-Down DP)
def wordBreak(s, wordDict):
    wordSet = set(wordDict)

    @lru_cache(maxsize=None)  # Built-in memoization decorator
    def can_break(start):
        # Base case: reached end of string
        if start == len(s):
            return True

        # Try all possible end positions
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in wordSet and can_break(end):
                return True
        return False

    return can_break(0)
# Time: O(N^2) worst case after memoization, vs. O(2^N) naive.
# Space: O(N) for recursion depth and memo cache.
```

```javascript
// Example Pattern: DFS with Memoization
function dfsWithMemo(state) {
  if (memo.has(state)) return memo.get(state);

  if (isBaseCase(state)) {
    memo.set(state, baseValue);
    return baseValue;
  }

  let result = initialValue;
  for (let nextState of getNextStates(state)) {
    let subResult = dfsWithMemo(nextState);
    result = combine(result, subResult);
  }

  memo.set(state, result);
  return result;
}

// Concrete Example: LeetCode 139. Word Break
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const memo = new Map();

  function canBreak(start) {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start);

    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (wordSet.has(word) && canBreak(end)) {
        memo.set(start, true);
        return true;
      }
    }
    memo.set(start, false);
    return false;
  }

  return canBreak(0);
}
// Time: O(N^2) | Space: O(N) for recursion and memo.
```

```java
import java.util.*;

// Concrete Example: LeetCode 139. Word Break
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        // memo map: start index -> boolean result
        Map<Integer, Boolean> memo = new HashMap<>();
        return dfs(s, 0, wordSet, memo);
    }

    private boolean dfs(String s, int start, Set<String> wordSet,
                        Map<Integer, Boolean> memo) {
        // Base case
        if (start == s.length()) return true;
        // Check memo
        if (memo.containsKey(start)) return memo.get(start);

        // Try all end positions
        for (int end = start + 1; end <= s.length(); end++) {
            String word = s.substring(start, end);
            if (wordSet.contains(word) && dfs(s, end, wordSet, memo)) {
                memo.put(start, true);
                return true;
            }
        }
        memo.put(start, false);
        return false;
    }
}
// Time: O(N^2) | Space: O(N) for recursion and memo.
```

</div>

## How eBay Tests Depth-First Search vs Other Companies

Compared to FAANG companies, eBay's DFS questions tend to be more "applied" and less "theoretical." At Google, you might get a DFS problem on a novel graph structure testing pure algorithmic cleverness. At Facebook/Meta, DFS often appears in tree manipulation problems. At eBay, the context is usually closer to their domain: e-commerce, logistics, or data relationships. The difficulty is on par with mid-to-high LeetCode Medium; you're unlikely to see a brutal Hard that's purely algorithmic gymnastics. However, they often add a "twist" that requires careful state design, like tracking visited nodes in a particular way or managing a side-effect during traversal. The evaluation focuses on **correctness, clean code, and handling edge cases** over micro-optimizations.

## Study Order

Don't jump into complex backtracking immediately. Build your skills sequentially:

1.  **Basic Tree DFS Traversals (Pre/In/Post-order):** Internalize recursion on trees. This is the foundation. Practice on LeetCode 94, 144, 145.
2.  **Simple Recursive Problems on Trees:** Solve problems where the recursive function returns a value (e.g., max depth, symmetric tree). LeetCode 104, 101.
3.  **Path Problems in Trees:** Learn to pass information down the recursion (path so far) and bubble results up. LeetCode 112, 113, 129.
4.  **Basic Graph DFS on Explicit Graphs:** Learn to handle cycles using a `visited` set. LeetCode 133 (Clone Graph), 200 (Number of Islands).
5.  **Backtracking on Arrays/Strings:** Master the "choose-explore-unchoose" pattern for combination/permutation problems. LeetCode 78, 46, 39.
6.  **DFS with Memoization (Top-Down DP):** Learn to identify overlapping subproblems and add a cache. LeetCode 139, 70 (Climbing Stairs as a warm-up).
7.  **Complex State DFS/Backtracking:** Tackle problems where the state is more than just an index, like with board games or complex constraints. LeetCode 51 (N-Queens), 37 (Sudoku Solver).

This order works because each step uses skills from the previous one. You can't debug a complex backtracking state if you're not comfortable with simple recursion.

## Recommended Practice Order

Solve these problems in sequence to build the competency eBay tests:

1.  **LeetCode 104. Maximum Depth of Binary Tree** (Warm-up recursion)
2.  **LeetCode 112. Path Sum** (Basic path tracking)
3.  **LeetCode 200. Number of Islands** (Graph DFS on implicit grid)
4.  **LeetCode 78. Subsets** (Intro to backtracking)
5.  **LeetCode 39. Combination Sum** (Core eBay pattern: backtracking with pruning)
6.  **LeetCode 133. Clone Graph** (Graph DFS with cycle handling)
7.  **LeetCode 139. Word Break** (DFS with memoization)
8.  **LeetCode 90. Subsets II** (Backtracking with duplicates)
9.  **LeetCode 79. Word Search** (DFS on board with backtracking)
10. **LeetCode 51. N-Queens** (Complex backtracking - final challenge)

Remember, the goal isn't to memorize these problems but to internalize the patterns. When you get an eBay interview question about finding all valid configurations or exploring a dependency graph, you'll recognize the skeleton and focus your mental energy on the unique twist.

[Practice Depth-First Search at eBay](/company/ebay/depth-first-search)
