---
title: "How to Solve Lexicographical Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographical Numbers. Medium difficulty, 76.2% acceptance rate. Topics: Depth-First Search, Trie."
date: "2027-08-23"
category: "dsa-patterns"
tags: ["lexicographical-numbers", "depth-first-search", "trie", "medium"]
---

# How to Solve Lexicographical Numbers

The problem asks us to return all integers from 1 to `n` sorted in lexicographical order (like dictionary order), not numerical order. This is tricky because we can't simply sort the numbers numerically—we need to generate them in the correct order directly. The challenge comes from achieving O(n) time while using only O(1) extra space (excluding the output list).

## Visual Walkthrough

Let's trace through `n = 13` to understand lexicographical order:

**Lexicographical order:** 1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9

Compare this to **numerical order:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13

Notice the pattern: after 1, we go to 10, then 11, 12, 13. Only after exhausting all numbers starting with "1" do we go to 2. This looks like a depth-first traversal of a number tree:

```
        1        2        3    ...    9
       / \      / \      / \         / \
     10...19  20...29  30...39     90...99
     /  \
   100...109
```

For `n = 13`, we traverse: 1 → 10 → 11 → 12 → 13 → (backtrack) → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

The key insight: we can generate numbers in lexicographical order by performing a DFS on this implicit tree, where from any number `x`, we first try `x * 10` (append 0), then increment the last digit.

## Brute Force Approach

A naive approach would be:

1. Generate all numbers from 1 to `n`
2. Convert them to strings
3. Sort the strings lexicographically
4. Convert back to integers

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def lexicalOrder_brute(n):
    # Convert numbers to strings for lexicographical comparison
    nums = list(range(1, n + 1))
    # Sort strings lexicographically
    nums_str = [str(num) for num in nums]
    nums_str.sort()
    # Convert back to integers
    return [int(num_str) for num_str in nums_str]
```

```javascript
// Time: O(n log n) | Space: O(n)
function lexicalOrderBrute(n) {
  // Generate array of numbers
  const nums = Array.from({ length: n }, (_, i) => i + 1);
  // Convert to strings and sort lexicographically
  const sorted = nums.map(String).sort();
  // Convert back to numbers
  return sorted.map(Number);
}
```

```java
// Time: O(n log n) | Space: O(n)
public List<Integer> lexicalOrderBrute(int n) {
    List<String> nums = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        nums.add(String.valueOf(i));
    }
    // Sort strings lexicographically
    Collections.sort(nums);
    // Convert back to integers
    List<Integer> result = new ArrayList<>();
    for (String s : nums) {
        result.add(Integer.parseInt(s));
    }
    return result;
}
```

</div>

**Why this fails:** The problem requires O(n) time, but sorting takes O(n log n). Additionally, we're using O(n) extra space for the string conversions. The constraints specifically ask for O(1) extra space (excluding output).

## Optimized Approach

The optimal solution uses DFS (Depth-First Search) on the implicit number tree. Think of each number as a node where:

- The first child is `current * 10` (append a 0)
- The next sibling is `current + 1` (increment last digit)

**Key observations:**

1. From number `k`, we should first explore `k * 10` if `k * 10 ≤ n` (go deeper)
2. If we can't go deeper, we go to the next sibling: `k + 1`
3. But if `k + 1 > n` OR if incrementing would change the most significant digit (e.g., 19 → 20), we need to backtrack by dividing by 10, then increment

**Example with n = 13:**

- Start with `curr = 1`
- Add 1 to result
- Try go deeper: `1 * 10 = 10 ≤ 13` → set `curr = 10`
- Add 10 to result
- Try go deeper: `10 * 10 = 100 > 13` → can't go deeper
- Try next sibling: `10 + 1 = 11 ≤ 13` → set `curr = 11`
- Continue this process...

**Why this is O(n) time:** We generate exactly `n` numbers, and each number requires constant amortized time to compute the next number.

**Why this is O(1) space:** We only use a few variables (`curr`, index for result list), not counting the output list which doesn't count toward space complexity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output list
def lexicalOrder(n):
    result = []
    curr = 1

    # We need to generate exactly n numbers
    for _ in range(n):
        # Add current number to result
        result.append(curr)

        # Try to go deeper in the tree (multiply by 10)
        if curr * 10 <= n:
            curr *= 10
        else:
            # If we can't go deeper, we need to find the next number
            # First, if we've reached the end of current level (curr % 10 == 9)
            # or if curr + 1 would exceed n, we need to backtrack
            while curr % 10 == 9 or curr + 1 > n:
                # Backtrack to parent by dividing by 10
                curr //= 10
                # If we've backtracked all the way to 0, we're done
                if curr == 0:
                    return result

            # Move to next sibling (increment by 1)
            curr += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function lexicalOrder(n) {
  const result = [];
  let curr = 1;

  // Generate exactly n numbers
  for (let i = 0; i < n; i++) {
    // Add current number to result
    result.push(curr);

    // Try to go deeper: multiply by 10
    if (curr * 10 <= n) {
      curr *= 10;
    } else {
      // Can't go deeper - find next number
      // If at end of current level (last digit is 9) or next would exceed n
      while (curr % 10 === 9 || curr + 1 > n) {
        // Backtrack to parent
        curr = Math.floor(curr / 10);
        // If we backtracked to 0, we're done
        if (curr === 0) {
          return result;
        }
      }
      // Move to next sibling
      curr += 1;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output list
public List<Integer> lexicalOrder(int n) {
    List<Integer> result = new ArrayList<>();
    int curr = 1;

    // Generate exactly n numbers
    for (int i = 0; i < n; i++) {
        // Add current number to result
        result.add(curr);

        // Try to go deeper in the tree
        if (curr * 10 <= n) {
            curr *= 10;  // Go to first child
        } else {
            // Can't go deeper - need to find next number
            // If we're at the end of current level (last digit is 9)
            // or next number would exceed n, we need to backtrack
            while (curr % 10 == 9 || curr + 1 > n) {
                curr /= 10;  // Backtrack to parent
                // If we've backtracked all the way, we're done
                if (curr == 0) {
                    return result;
                }
            }
            // Move to next sibling
            curr += 1;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We generate exactly `n` numbers in the output
- Each number takes constant amortized time to compute:
  - Either we multiply by 10 (O(1))
  - Or we backtrack (divide by 10) at most O(log n) times, but each backtrack only happens once per "branch" of the tree
  - Overall, each of the `n` numbers requires O(1) amortized operations

**Space Complexity: O(1) extra space**

- We only use a constant amount of extra space (`curr` variable)
- The output list of size `n` is not counted toward space complexity (it's required by the problem)
- No recursion stack is used (iterative solution)

## Common Mistakes

1. **Forgetting to handle the backtrack condition properly**: The condition `curr % 10 == 9` is crucial. When the last digit is 9 (e.g., 19, 29), adding 1 would change the tens digit, so we need to backtrack first. Many candidates only check `curr + 1 > n`.

2. **Infinite loop when n contains 9s**: For `n = 19`, after reaching 19, if you don't handle the `curr % 10 == 9` case, you might try `19 + 1 = 20 > 19`, backtrack to 1, then `1 + 1 = 2`, skipping numbers.

3. **Incorrect base case for backtracking**: Some implementations forget to check if `curr == 0` after backtracking. When we backtrack from 9, we go to 0, but we should stop there since we've processed all numbers.

4. **Using recursion without proper bounds**: A recursive DFS solution seems natural but uses O(log n) stack space, violating the O(1) space requirement. The iterative solution is necessary.

## When You'll See This Pattern

This DFS-on-implicit-tree pattern appears in several problems:

1. **Lexicographical Numbers (this problem)**: The classic example of DFS on number tree.

2. **Print all numbers from 1 to n in dictionary order**: Exactly the same problem, sometimes asked in different wording.

3. **K-th Smallest in Lexicographical Order (LeetCode 440)**: A harder variant where you need to find the k-th element without generating all numbers. Uses the same tree traversal concept with counting nodes in subtrees.

4. **Implement Trie (Prefix Tree) problems**: The number tree here is essentially a Trie of digit strings. Similar traversal patterns apply.

5. **Alien Dictionary**: While not identical, it also deals with lexicographical ordering and graph/tree traversal.

## Key Takeaways

1. **Lexicographical order of numbers corresponds to DFS on an implicit tree** where each node's children are created by appending digits 0-9. Recognizing this tree structure is the key insight.

2. **When you need O(1) space for tree traversal, consider iterative DFS** with careful backtracking logic instead of recursion.

3. **The pattern of "try to go deeper first, then sideways"** is a hallmark of DFS. In this case: multiply by 10 (go deeper) before adding 1 (go sideways).

4. **Boundary conditions matter**: The `curr % 10 == 9` check is non-obvious but essential. Always test with examples containing 9s (like n=19, n=199) to catch these edge cases.

[Practice this problem on CodeJeet](/problem/lexicographical-numbers)
