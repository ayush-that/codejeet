---
title: "How to Solve Baseball Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Baseball Game. Easy difficulty, 80.1% acceptance rate. Topics: Array, Stack, Simulation."
date: "2027-03-26"
category: "dsa-patterns"
tags: ["baseball-game", "array", "stack", "simulation", "easy"]
---

# How to Solve Baseball Game

This problem simulates scoring in a baseball game with special rules where operations can add points, double previous scores, or cancel previous entries. While conceptually straightforward, it's interesting because it requires tracking the history of scores to handle operations that reference previous values. The challenge lies in efficiently managing this history while processing each operation exactly once.

## Visual Walkthrough

Let's trace through an example: `operations = ["5","2","C","D","+"]`

We'll maintain a list `record` to track valid scores:

1. **"5"** → Add integer 5 to record  
   Record: [5]

2. **"2"** → Add integer 2 to record  
   Record: [5, 2]

3. **"C"** → Cancel (remove) the last score  
   Remove 2 from record  
   Record: [5]

4. **"D"** → Double the last score  
   Last score is 5, so 5 × 2 = 10  
   Add 10 to record  
   Record: [5, 10]

5. **"+"** → Sum the last two scores  
   Last two scores are 5 and 10, sum = 15  
   Add 15 to record  
   Record: [5, 10, 15]

Finally, sum all scores: 5 + 10 + 15 = **30**

Notice how operations like "C", "D", and "+" depend on previous scores, which is why we need to maintain the record as we process operations.

## Brute Force Approach

For this problem, there isn't really a "brute force" in the traditional sense since we must process each operation sequentially. However, a naive approach might involve:

1. Creating an empty list to store scores
2. Iterating through each operation
3. For each operation:
   - If it's an integer: convert to int and append
   - If it's "C": remove the last element
   - If it's "D": calculate double of last element and append
   - If it's "+": calculate sum of last two elements and append
4. Sum all elements in the final list

The challenge with even this simple approach is handling edge cases properly:

- What if we get "C" when the record is empty?
- What if we get "D" or "+" with insufficient previous scores?
- How do we efficiently distinguish integers from operations?

The problem guarantees valid operations, so we don't need to handle these error cases, but in a real interview, it's good to mention them.

## Optimal Solution

The optimal solution uses a stack-like approach with a list to track scores. We process each operation exactly once, maintaining the current valid scores. The key insight is that operations "C", "D", and "+" all depend only on the most recent scores, making a simple list with append/pop operations perfect for this task.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# n = number of operations
def calPoints(operations):
    """
    Calculate total score from baseball game operations.

    Args:
        operations: List of strings representing operations

    Returns:
        Integer sum of all valid scores
    """
    # Stack to keep track of valid scores
    record = []

    # Process each operation
    for op in operations:
        if op == "C":
            # Cancel the last valid score (remove from record)
            # This simulates invalidating the last operation
            record.pop()
        elif op == "D":
            # Double the last score and add to record
            # We need to access the last element before appending
            last_score = record[-1]
            record.append(last_score * 2)
        elif op == "+":
            # Sum the last two scores and add to record
            # Access last two elements using negative indexing
            score1 = record[-1]
            score2 = record[-2]
            record.append(score1 + score2)
        else:
            # Integer operation: convert string to int and add
            # This handles positive and negative integers
            record.append(int(op))

    # Return sum of all valid scores in record
    # If record is empty, sum() returns 0
    return sum(record)
```

```javascript
// Time: O(n) | Space: O(n)
// n = number of operations
function calPoints(operations) {
  /**
   * Calculate total score from baseball game operations.
   *
   * @param {string[]} operations - Array of operation strings
   * @return {number} Sum of all valid scores
   */
  // Stack to keep track of valid scores
  const record = [];

  // Process each operation
  for (const op of operations) {
    if (op === "C") {
      // Cancel the last valid score (remove from record)
      // This simulates invalidating the last operation
      record.pop();
    } else if (op === "D") {
      // Double the last score and add to record
      // We need to access the last element before appending
      const lastScore = record[record.length - 1];
      record.push(lastScore * 2);
    } else if (op === "+") {
      // Sum the last two scores and add to record
      // Access last two elements using array length
      const score1 = record[record.length - 1];
      const score2 = record[record.length - 2];
      record.push(score1 + score2);
    } else {
      // Integer operation: convert string to int and add
      // parseInt handles positive and negative integers
      record.push(parseInt(op));
    }
  }

  // Return sum of all valid scores in record
  // If record is empty, reduce returns 0 with initial value
  return record.reduce((sum, score) => sum + score, 0);
}
```

```java
// Time: O(n) | Space: O(n)
// n = number of operations
class Solution {
    public int calPoints(String[] operations) {
        /**
         * Calculate total score from baseball game operations.
         *
         * @param operations Array of operation strings
         * @return Sum of all valid scores
         */
        // Stack to keep track of valid scores
        List<Integer> record = new ArrayList<>();

        // Process each operation
        for (String op : operations) {
            if (op.equals("C")) {
                // Cancel the last valid score (remove from record)
                // This simulates invalidating the last operation
                record.remove(record.size() - 1);
            } else if (op.equals("D")) {
                // Double the last score and add to record
                // We need to access the last element before appending
                int lastScore = record.get(record.size() - 1);
                record.add(lastScore * 2);
            } else if (op.equals("+")) {
                // Sum the last two scores and add to record
                // Access last two elements using list indices
                int score1 = record.get(record.size() - 1);
                int score2 = record.get(record.size() - 2);
                record.add(score1 + score2);
            } else {
                // Integer operation: convert string to int and add
                // Integer.parseInt handles positive and negative integers
                record.add(Integer.parseInt(op));
            }
        }

        // Return sum of all valid scores in record
        int sum = 0;
        for (int score : record) {
            sum += score;
        }
        return sum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We process each of the `n` operations exactly once. For each operation, we perform O(1) operations: appending to a list, removing from the end of a list, or accessing elements by index. The final summation also takes O(n) time, but this doesn't change the overall O(n) complexity.

**Space Complexity: O(n)**  
In the worst case, if all operations are integers (no "C" operations), we store all `n` scores in the record list. Even with "C" operations, we might still store up to O(n) elements if "C" operations are infrequent. The space used by the record list dominates the space complexity.

## Common Mistakes

1. **Not handling negative integers correctly**: The problem states operations can be integers, which includes negative numbers. Using simple string comparison like `op.isdigit()` in Python would fail for negative numbers. Always use proper integer conversion.

2. **Forgetting that "C" removes the score, not just ignores it**: Some candidates think "C" means "don't count this score" but actually it removes the score entirely, affecting subsequent "D" and "+" operations that reference previous scores.

3. **Incorrect order of operations for "+"**: When calculating the sum for "+", you must use the last two scores **before** adding the new sum. Some candidates mistakenly include the new sum in their calculation.

4. **Using the wrong data structure**: While an array/list works fine, using a true stack data structure is also acceptable. However, avoid using a queue or other structures that don't provide efficient access to the most recent elements.

## When You'll See This Pattern

This problem uses a **stack-like processing pattern** where operations depend on recent history. You'll see similar patterns in:

1. **Crawler Log Folder (LeetCode 1598)**: Operations like "../" (go up one level) and "./" (stay) modify a path based on recent history, similar to how "C" modifies the score record.

2. **Evaluate Reverse Polish Notation (LeetCode 150)**: Operations like "+", "-", "\*", "/" apply to the most recent numbers, requiring stack-based evaluation just like our baseball game.

3. **Backspace String Compare (LeetCode 844)**: The backspace operation "#" removes the last character, similar to how "C" removes the last score, and both require tracking the current state.

The common thread is maintaining a current state that gets modified by operations that reference recent history, making a stack the natural choice.

## Key Takeaways

1. **When operations reference recent elements, think stacks**: If you need to access, modify, or remove the most recent items, a stack (or list used as a stack) is usually the right choice.

2. **Simulation problems often have straightforward solutions**: Don't overcomplicate problems that describe a process to simulate. Focus on accurately implementing each step rather than finding clever optimizations.

3. **Edge cases matter even with guaranteed valid input**: While the problem guarantees valid operations, thinking about what could go wrong (empty record, insufficient scores) shows deeper understanding and helps avoid bugs in similar problems without such guarantees.

Related problems: [Crawler Log Folder](/problem/crawler-log-folder)
