---
title: "How to Solve The Score of Students Solving Math Expression — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode The Score of Students Solving Math Expression. Hard difficulty, 34.0% acceptance rate. Topics: Array, Hash Table, Math, String, Dynamic Programming."
date: "2026-06-12"
category: "dsa-patterns"
tags: ["the-score-of-students-solving-math-expression", "array", "hash-table", "math", "hard"]
---

# How to Solve "The Score of Students Solving Math Expression"

This problem presents a valid math expression containing single-digit numbers, addition, and multiplication. You're given the correct answer and a list of student answers. Your task is to calculate a score where each student gets:

- 5 points if their answer matches the correct result
- 2 points if their answer is wrong but could be obtained by evaluating the expression in a different order (like forgetting operator precedence)
- 0 points otherwise

What makes this problem tricky is that we need to efficiently compute all possible results from different evaluation orders while handling operator precedence constraints. It's essentially a combination of expression evaluation and dynamic programming with memoization.

## Visual Walkthrough

Let's trace through a small example: `s = "3+2*5"`, `answers = [13, 15, 25]`

**Correct evaluation:**

- Standard math rules: multiplication before addition
- `2*5 = 10`, then `3+10 = 13`
- Correct answer: 13

**Student evaluation possibilities:**
Students might evaluate left-to-right ignoring precedence:

1. `3+2 = 5`, then `5*5 = 25`
2. Or they might get it right: `2*5 = 10`, then `3+10 = 13`

So possible results are {13, 25}. Now scoring:

- Student answer 13: matches correct → 5 points
- Student answer 15: not in possible results → 0 points
- Student answer 25: in possible results but wrong → 2 points

The challenge is efficiently computing all possible results for longer expressions without exponential explosion.

## Brute Force Approach

A naive approach would be to generate all possible evaluation orders by placing parentheses in every possible way. For an expression with `m` operators, there are Catalan(m) possible parenthesizations, which grows exponentially.

For example, `"1+2*3+4"` with 3 operators has 5 possible parenthesizations:

1. `((1+2)*3)+4 = 13`
2. `(1+(2*3))+4 = 11`
3. `1+((2*3)+4) = 11`
4. `1+(2*(3+4)) = 15`
5. `(1+2)*(3+4) = 21`

The brute force would recursively try every split point and combine results from left and right subexpressions. While conceptually simple, for expressions with up to 31 operators (as per constraints), this would be far too slow.

## Optimized Approach

The key insight is that we can use **dynamic programming with memoization** to avoid recomputing results for the same subexpressions. We'll compute all possible results for every substring of the expression.

**Step-by-step reasoning:**

1. **Parse the expression:** Separate numbers and operators. Since all numbers are single-digit, we can extract them directly.

2. **DP state definition:** Let `dp[i][j]` be a set of all possible results for the substring from index `i` to `j` (inclusive of both numbers and operators).

3. **Base case:** For substrings containing only a number (no operators), the only possible result is that number itself.

4. **Recursive relation:** For a substring from `i` to `j`:
   - Find all operator positions `k` between `i` and `j`
   - For each operator at position `k`:
     - Compute all possible results for left substring `[i, k-1]`
     - Compute all possible results for right substring `[k+1, j]`
     - Combine using the operator at position `k`
   - Collect all results in a set (to avoid duplicates)

5. **Memoization:** Store results for each `(i, j)` pair to avoid recomputation.

6. **Bound pruning:** Since answers are limited to 0-1000, we can discard results outside this range early.

7. **Scoring:** Once we have all possible results, score each student answer:
   - 5 points if equal to correct answer
   - 2 points if in possible results (but not correct)
   - 0 points otherwise

## Optimal Solution

Here's the complete implementation using top-down DP with memoization:

<div class="code-group">

```python
# Time: O(n^3 * M^2) where n is length of expression, M is max result (1000)
# Space: O(n^2 * M) for memoization
class Solution:
    def scoreOfStudents(self, s: str, answers: List[int]) -> int:
        # First, compute the correct answer using standard precedence
        def compute_correct(expr: str) -> int:
            """Evaluate expression with * before + precedence."""
            # Parse numbers and operators
            nums = []
            ops = []
            curr = 0

            for ch in expr:
                if ch.isdigit():
                    curr = curr * 10 + int(ch)
                else:
                    nums.append(curr)
                    ops.append(ch)
                    curr = 0
            nums.append(curr)

            # First pass: handle all multiplications
            i = 0
            while i < len(ops):
                if ops[i] == '*':
                    nums[i] = nums[i] * nums[i + 1]
                    nums.pop(i + 1)
                    ops.pop(i)
                else:
                    i += 1

            # Second pass: handle all additions
            result = nums[0]
            for i in range(len(ops)):
                result += nums[i + 1]

            return result

        # Memoization dictionary: (i, j) -> set of possible results
        memo = {}

        def dfs(i: int, j: int) -> Set[int]:
            """Return all possible results for substring s[i:j+1]."""
            if (i, j) in memo:
                return memo[(i, j)]

            # Base case: single number
            if i == j:
                result = {int(s[i])}
                memo[(i, j)] = result
                return result

            result_set = set()

            # Try every operator position as the last operation
            for k in range(i + 1, j, 2):  # Operators are at odd indices
                left_results = dfs(i, k - 1)
                right_results = dfs(k + 1, j)
                op = s[k]

                # Combine results from left and right
                for left in left_results:
                    for right in right_results:
                        if op == '+':
                            val = left + right
                        else:  # op == '*'
                            val = left * right

                        # Prune: only keep results within valid range
                        if val <= 1000:
                            result_set.add(val)

            memo[(i, j)] = result_set
            return result_set

        # Compute correct answer
        correct_answer = compute_correct(s)

        # Compute all possible student answers
        n = len(s)
        possible_answers = dfs(0, n - 1)

        # Score each student answer
        total_score = 0
        for ans in answers:
            if ans == correct_answer:
                total_score += 5
            elif ans in possible_answers:
                total_score += 2

        return total_score
```

```javascript
// Time: O(n^3 * M^2) where n is length of expression, M is max result (1000)
// Space: O(n^2 * M) for memoization
/**
 * @param {string} s
 * @param {number[]} answers
 * @return {number}
 */
var scoreOfStudents = function (s, answers) {
  // Helper function to compute correct answer with precedence
  const computeCorrect = (expr) => {
    // Parse numbers and operators
    const nums = [];
    const ops = [];
    let curr = 0;

    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch >= "0" && ch <= "9") {
        curr = curr * 10 + parseInt(ch);
      } else {
        nums.push(curr);
        ops.push(ch);
        curr = 0;
      }
    }
    nums.push(curr);

    // First pass: handle multiplications
    let i = 0;
    while (i < ops.length) {
      if (ops[i] === "*") {
        nums[i] = nums[i] * nums[i + 1];
        nums.splice(i + 1, 1);
        ops.splice(i, 1);
      } else {
        i++;
      }
    }

    // Second pass: handle additions
    let result = nums[0];
    for (let i = 0; i < ops.length; i++) {
      result += nums[i + 1];
    }

    return result;
  };

  // Memoization map
  const memo = new Map();

  // DFS function to compute all possible results
  const dfs = (i, j) => {
    const key = `${i},${j}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Base case: single digit
    if (i === j) {
      const result = new Set([parseInt(s[i])]);
      memo.set(key, result);
      return result;
    }

    const resultSet = new Set();

    // Try every operator as the last operation
    for (let k = i + 1; k < j; k += 2) {
      const leftResults = dfs(i, k - 1);
      const rightResults = dfs(k + 1, j);
      const op = s[k];

      // Combine results
      for (const left of leftResults) {
        for (const right of rightResults) {
          let val;
          if (op === "+") {
            val = left + right;
          } else {
            // op === '*'
            val = left * right;
          }

          // Only keep results within valid range
          if (val <= 1000) {
            resultSet.add(val);
          }
        }
      }
    }

    memo.set(key, resultSet);
    return resultSet;
  };

  // Compute correct answer
  const correctAnswer = computeCorrect(s);

  // Compute all possible student answers
  const n = s.length;
  const possibleAnswers = dfs(0, n - 1);

  // Score each student answer
  let totalScore = 0;
  for (const ans of answers) {
    if (ans === correctAnswer) {
      totalScore += 5;
    } else if (possibleAnswers.has(ans)) {
      totalScore += 2;
    }
  }

  return totalScore;
};
```

```java
// Time: O(n^3 * M^2) where n is length of expression, M is max result (1000)
// Space: O(n^2 * M) for memoization
class Solution {
    public int scoreOfStudents(String s, int[] answers) {
        // Compute correct answer with operator precedence
        int correctAnswer = computeCorrect(s);

        // Memoization array
        Set<Integer>[][] memo = new Set[s.length()][s.length()];

        // Compute all possible student answers
        Set<Integer> possibleAnswers = dfs(s, 0, s.length() - 1, memo);

        // Score each student answer
        int totalScore = 0;
        for (int ans : answers) {
            if (ans == correctAnswer) {
                totalScore += 5;
            } else if (possibleAnswers.contains(ans)) {
                totalScore += 2;
            }
        }

        return totalScore;
    }

    private int computeCorrect(String expr) {
        // Parse numbers and operators
        List<Integer> nums = new ArrayList<>();
        List<Character> ops = new ArrayList<>();
        int curr = 0;

        for (int i = 0; i < expr.length(); i++) {
            char ch = expr.charAt(i);
            if (Character.isDigit(ch)) {
                curr = curr * 10 + (ch - '0');
            } else {
                nums.add(curr);
                ops.add(ch);
                curr = 0;
            }
        }
        nums.add(curr);

        // First pass: handle multiplications
        int i = 0;
        while (i < ops.size()) {
            if (ops.get(i) == '*') {
                int product = nums.get(i) * nums.get(i + 1);
                nums.set(i, product);
                nums.remove(i + 1);
                ops.remove(i);
            } else {
                i++;
            }
        }

        // Second pass: handle additions
        int result = nums.get(0);
        for (int j = 0; j < ops.size(); j++) {
            result += nums.get(j + 1);
        }

        return result;
    }

    private Set<Integer> dfs(String s, int i, int j, Set<Integer>[][] memo) {
        // Return cached result if available
        if (memo[i][j] != null) {
            return memo[i][j];
        }

        // Base case: single digit
        if (i == j) {
            Set<Integer> result = new HashSet<>();
            result.add(s.charAt(i) - '0');
            memo[i][j] = result;
            return result;
        }

        Set<Integer> resultSet = new HashSet<>();

        // Try every operator as the last operation
        for (int k = i + 1; k < j; k += 2) {
            Set<Integer> leftResults = dfs(s, i, k - 1, memo);
            Set<Integer> rightResults = dfs(s, k + 1, j, memo);
            char op = s.charAt(k);

            // Combine results from left and right
            for (int left : leftResults) {
                for (int right : rightResults) {
                    int val;
                    if (op == '+') {
                        val = left + right;
                    } else { // op == '*'
                        val = left * right;
                    }

                    // Only keep results within valid range
                    if (val <= 1000) {
                        resultSet.add(val);
                    }
                }
            }
        }

        memo[i][j] = resultSet;
        return resultSet;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³ \* M²) where n is the length of the expression and M is the maximum result (1000).

- There are O(n²) subproblems (i, j pairs)
- For each subproblem, we iterate through O(n) operators as split points
- For each split, we combine results from left and right, each potentially having up to M results
- The M² term comes from the nested loops combining left and right results
- In practice, the bound M=1000 and early pruning keep this manageable

**Space Complexity:** O(n² \* M) for the memoization storage, where each of the O(n²) states can store up to M results.

## Common Mistakes

1. **Forgetting operator precedence when computing the correct answer:** Some candidates try to evaluate left-to-right or use the same DP approach for the correct answer. Remember that the correct answer must follow standard math rules (\* before +).

2. **Not pruning results beyond 1000:** The problem states student answers are between 0 and 1000. Without pruning, the DP would generate many large intermediate results, causing memory issues and slowing down the solution.

3. **Using bottom-up DP instead of top-down:** While both work, top-down with memoization is more intuitive for this problem because we naturally think about splitting expressions recursively.

4. **Not handling the base case correctly:** For substrings with a single number, the only possible result is that number itself. Missing this leads to empty result sets.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Expression evaluation with different precedences:** Similar to "Basic Calculator" series where you need to handle operator precedence, but here you need all possible results.

2. **Catalan number DP / parenthesization problems:** The core DP approach is similar to "Different Ways to Add Parentheses" where you compute all possible results by trying different split points.

3. **Interval DP:** The memoization over (i, j) substrings is a classic interval DP pattern seen in problems like "Burst Balloons" and "Stone Game".

## Key Takeaways

1. **When a problem asks for "all possible results" from an expression with operators, think interval DP:** Try every operator as the "last" operation and combine results from left and right subexpressions.

2. **Prune early based on problem constraints:** The 0-1000 bound on answers is not just for scoring—it's crucial for making the DP feasible by limiting the number of intermediate results.

3. **Separate concerns:** Compute the correct answer separately using standard precedence rules, then use DP to find all possible student answers. Don't mix the two computations.

Related problems: [Basic Calculator](/problem/basic-calculator), [Different Ways to Add Parentheses](/problem/different-ways-to-add-parentheses)
