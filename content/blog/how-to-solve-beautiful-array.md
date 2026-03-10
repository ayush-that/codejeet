---
title: "How to Solve Beautiful Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Beautiful Array. Medium difficulty, 68.7% acceptance rate. Topics: Array, Math, Divide and Conquer."
date: "2028-05-05"
category: "dsa-patterns"
tags: ["beautiful-array", "array", "math", "divide-and-conquer", "medium"]
---

# How to Solve Beautiful Array

The Beautiful Array problem asks us to construct a permutation of numbers from 1 to n where for any three positions i < k < j, the middle element is never the average of the outer two. This means we need to arrange numbers so that no arithmetic progression of length 3 exists. What makes this problem interesting is that a brute-force search through all permutations is impossible for moderate n, forcing us to find a clever mathematical construction.

## Visual Walkthrough

Let's understand the problem with n = 4. We need a permutation of [1,2,3,4] where no number is the average of two others positioned on either side.

A naive arrangement like [1,2,3,4] fails: for i=0 (1), j=2 (3), k=1 (2), we have 2\*2 = 1+3 = 4.

Let's try [1,3,2,4]:

- Check (1,2,3): 2\*3 = 6, 1+2 = 3 ❌
- Check (1,2,4): 2\*3 = 6, 1+4 = 5 ✅
- Check (1,3,4): 2\*2 = 4, 1+4 = 5 ✅
- Check (2,3,4): 2\*2 = 4, 3+4 = 7 ✅
  This fails because 2 is the average of 1 and 3.

The key insight: If we separate odd and even numbers, we avoid certain arithmetic progressions. For n=4, try [1,3,2,4]:

- All odd numbers [1,3] are on the left
- All even numbers [2,4] are on the right
- Check all triples: (1,3,2): 2*3=6, 1+2=3 ✅, (1,3,4): 2*3=6, 1+4=5 ✅, (1,2,4): 2*2=4, 1+4=5 ✅, (3,2,4): 2*2=4, 3+4=7 ✅
  This works! The pattern emerges: odds first, then evens.

## Brute Force Approach

A brute force approach would generate all permutations of [1..n] and check each one for the beautiful property. For each permutation, we'd need to check all triples i < k < j, which is O(n³). With n! permutations, this becomes O(n! \* n³), which is astronomically large even for n=10.

```python
# This is just to illustrate - DO NOT use this in interviews
def brute_force(n):
    from itertools import permutations

    for perm in permutations(range(1, n+1)):
        valid = True
        for i in range(n):
            for j in range(i+2, n):
                for k in range(i+1, j):
                    if 2 * perm[k] == perm[i] + perm[j]:
                        valid = False
                        break
                if not valid:
                    break
            if not valid:
                break
        if valid:
            return list(perm)
    return []
```

The brute force fails because:

1. n! grows too fast (10! = 3.6 million, 12! = 479 million)
2. Checking O(n³) triples for each permutation is prohibitive
3. Even for n=20, this approach is computationally impossible

## Optimized Approach

The key insight comes from observing properties of arithmetic progressions:

1. **Odd-Even Separation**: If A is beautiful, then multiplying all elements by 2 (or any constant) and adding/subtracting a constant preserves the beautiful property. This is because if 2*x = y + z, then 2*(ax+b) = a(2x)+2b = a(y+z)+2b = (ay+b)+(az+b).

2. **Divide and Conquer**: We can construct beautiful arrays recursively:
   - Beautiful array for odds: Take beautiful array of size (n+1)//2, multiply each element by 2 and subtract 1
   - Beautiful array for evens: Take beautiful array of size n//2, multiply each element by 2
   - Concatenate them

Why does this work? Consider any three positions i < k < j:

- If all three are in the odd half: They satisfy the property by induction
- If all three are in the even half: They satisfy the property by induction
- If some are in odd and some in even: The average of an odd and even number is not an integer, so it can't equal any element in our array

The base case is n=1: [1] is trivially beautiful.

## Optimal Solution

We implement a divide-and-conquer approach with memoization to avoid recomputation.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def beautifulArray(self, n: int) -> List[int]:
        # Memoization dictionary to store computed beautiful arrays
        memo = {1: [1]}

        def helper(n):
            # If we've already computed for this n, return cached result
            if n in memo:
                return memo[n]

            # Divide: get beautiful arrays for left (odds) and right (evens)
            # For odds: take beautiful array of size (n+1)//2, then 2*x - 1
            # For evens: take beautiful array of size n//2, then 2*x
            left = helper((n + 1) // 2)  # Size for odd numbers
            right = helper(n // 2)       # Size for even numbers

            # Combine: transform and concatenate
            # Transform left (odds): 2*x - 1 makes numbers odd
            # Transform right (evens): 2*x makes numbers even
            result = [2 * x - 1 for x in left] + [2 * x for x in right]

            # Memoize and return
            memo[n] = result
            return result

        return helper(n)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * @param {number} n
 * @return {number[]}
 */
var beautifulArray = function (n) {
  // Memoization object to store computed beautiful arrays
  const memo = { 1: [1] };

  function helper(n) {
    // Return cached result if available
    if (memo[n]) {
      return memo[n];
    }

    // Recursively compute beautiful arrays for halves
    // Left half handles odd numbers, right half handles even numbers
    const left = helper(Math.floor((n + 1) / 2)); // Size for odds
    const right = helper(Math.floor(n / 2)); // Size for evens

    // Transform and combine: odds = 2*x - 1, evens = 2*x
    const result = [
      ...left.map((x) => 2 * x - 1), // Generate odd numbers
      ...right.map((x) => 2 * x), // Generate even numbers
    ];

    // Cache and return result
    memo[n] = result;
    return result;
  }

  return helper(n);
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    // Memoization map: n -> beautiful array of size n
    private Map<Integer, int[]> memo = new HashMap<>();

    public int[] beautifulArray(int n) {
        // Base case: array of size 1 is always beautiful
        memo.put(1, new int[]{1});
        return helper(n);
    }

    private int[] helper(int n) {
        // Return cached result if available
        if (memo.containsKey(n)) {
            return memo.get(n);
        }

        // Recursively compute beautiful arrays for halves
        // Left: size for odd numbers, Right: size for even numbers
        int[] left = helper((n + 1) / 2);   // Ceiling of n/2
        int[] right = helper(n / 2);        // Floor of n/2

        // Combine transformed halves
        int[] result = new int[n];
        int index = 0;

        // Transform left half to odd numbers: 2*x - 1
        for (int x : left) {
            result[index++] = 2 * x - 1;
        }

        // Transform right half to even numbers: 2*x
        for (int x : right) {
            result[index++] = 2 * x;
        }

        // Cache and return result
        memo.put(n, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each recursive call processes its subproblem exactly once due to memoization
- We make O(log n) recursive calls, but the total work is O(n) because we process each element once when constructing the final array
- The recurrence is T(n) = T((n+1)/2) + T(n/2) + O(n), which solves to O(n)

**Space Complexity: O(n)**

- We store O(n) elements in the result array
- Memoization stores beautiful arrays for different sizes, but total storage is O(n) across all calls
- Recursion depth is O(log n), so call stack uses O(log n) space

## Common Mistakes

1. **Forgetting the base case**: Without the base case of n=1 returning [1], the recursion never terminates. Always define base cases clearly in recursive solutions.

2. **Incorrect odd/even transformation**: Using 2*x for odds instead of 2*x-1, or vice versa. Remember: odds = 2*x - 1, evens = 2*x. Test with n=2 to verify: should get [1,2] or [2,1].

3. **Wrong split sizes**: Using n/2 for both halves instead of (n+1)//2 for odds and n//2 for evens. This causes array size mismatch. For n=5: odds need 3 elements (1,3,5), evens need 2 elements (2,4).

4. **Not using memoization**: Recursively computing without memoization leads to exponential time complexity. Each call would recompute the same subproblems multiple times.

## When You'll See This Pattern

This divide-and-conquer pattern with transformation appears in several problems:

1. **Sort Colors (Dutch National Flag)**: Separating elements into groups (like odds/evens here) using pointer manipulation.

2. **Construct Binary Search Tree from Preorder Traversal**: Building left and right subtrees recursively based on value ranges.

3. **Different Ways to Add Parentheses**: Breaking expressions into left and right parts and combining results.

4. **Reverse Pairs**: Similar transformation idea where multiplying/dividing by 2 creates separable groups.

The core pattern is: when a problem has a property that's preserved under certain transformations, consider constructing solutions for smaller instances and combining them with appropriate transformations.

## Key Takeaways

1. **Look for invariant-preserving transformations**: If multiplying by constants or adding constants preserves the property you need, you can build solutions recursively.

2. **Divide problems by parity or other separators**: When dealing with arithmetic properties, separating by parity (odd/even) often simplifies the problem because certain operations don't cross the parity boundary.

3. **Memoization enables efficient recursion**: When recursive solutions have overlapping subproblems, memoization can reduce exponential time to linear or polynomial time.

[Practice this problem on CodeJeet](/problem/beautiful-array)
