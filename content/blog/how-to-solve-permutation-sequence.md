---
title: "How to Solve Permutation Sequence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Permutation Sequence. Hard difficulty, 52.2% acceptance rate. Topics: Math, Recursion."
date: "2027-04-04"
category: "dsa-patterns"
tags: ["permutation-sequence", "math", "recursion", "hard"]
---

# How to Solve Permutation Sequence

The problem asks us to find the k-th permutation sequence of numbers from 1 to n, where permutations are listed in lexicographic order. What makes this problem tricky is that n can be up to 9, which means there are up to 362,880 permutations—far too many to generate and sort. We need a mathematical approach to directly compute the k-th permutation without enumerating all possibilities.

## Visual Walkthrough

Let's walk through an example with n=4, k=9 to build intuition. We have numbers [1,2,3,4] and want the 9th permutation.

**Step 1: Understanding the structure**
With n=4, we have 4! = 24 total permutations. These are grouped by the first digit:

- First digit 1: 3! = 6 permutations (1st through 6th)
- First digit 2: 3! = 6 permutations (7th through 12th)
- First digit 3: 3! = 6 permutations (13th through 18th)
- First digit 4: 3! = 6 permutations (19th through 24th)

**Step 2: Finding the first digit**
Since k=9, we're looking for the 9th permutation. Each group has 6 permutations, so:

- Group 1 (1xxx): permutations 1-6
- Group 2 (2xxx): permutations 7-12 ← k=9 falls here!

So our first digit is 2. We've used 6 permutations from group 1, so we have k = 9 - 6 = 3 permutations remaining to find within the [1,3,4] numbers.

**Step 3: Finding the second digit**
Now we have numbers [1,3,4] and want the 3rd permutation. Each group has 2! = 2 permutations:

- Group 1 (21xx): permutations 1-2
- Group 2 (23xx): permutations 3-4 ← k=3 falls here!

So our second digit is 3. We've used 2 permutations from group 1, so k = 3 - 2 = 1. Remaining numbers: [1,4].

**Step 4: Finding the third digit**
With numbers [1,4] and k=1, each group has 1! = 1 permutation:

- Group 1 (231x): permutation 1 ← k=1 falls here!

So our third digit is 1. k = 1 - 1 = 0. Remaining number: [4].

**Step 5: Final digit**
The last remaining number is 4.

**Result:** The 9th permutation is "2314".

## Brute Force Approach

The brute force approach would generate all n! permutations, sort them lexicographically, and return the k-th one. While this is conceptually simple, it's computationally infeasible for n=9 (362,880 permutations) and impossible for larger n due to factorial growth.

Even if we generate permutations in order using backtracking or the next permutation algorithm, we'd still need to generate k permutations, which could be up to 9! = 362,880 operations. This exceeds typical time limits.

The key insight is that we don't need to generate all permutations—we can compute each digit directly using factorial calculations.

## Optimized Approach

The optimal approach uses factorials to determine each digit directly:

1. **Precompute factorials** from 0! to (n-1)! since we'll use them repeatedly.
2. **Adjust k to be 0-indexed** (k-1) because our calculations work better with 0-based indexing.
3. **Maintain a list of available numbers** initially [1, 2, ..., n].
4. **For each position i from 0 to n-1**:
   - Calculate the index of the number to use: `index = k // factorial[n-1-i]`
   - Append `available_numbers[index]` to the result
   - Remove that number from available numbers (since we can't reuse digits)
   - Update k: `k = k % factorial[n-1-i]` (remainder after using this group)
5. **Return the concatenated result**

The intuition: At each step, we determine which "block" of permutations we're in. The size of each block is determined by the factorial of the remaining numbers. The quotient tells us which number to pick, and the remainder tells us our position within that block.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
# O(n^2) because list removal is O(n) in Python
def getPermutation(n: int, k: int) -> str:
    # Step 1: Precompute factorials from 0! to (n-1)!
    # factorial[i] = i!
    factorial = [1] * n
    for i in range(1, n):
        factorial[i] = factorial[i-1] * i

    # Step 2: Create list of available numbers [1, 2, ..., n]
    numbers = [str(i) for i in range(1, n+1)]

    # Step 3: Convert k from 1-indexed to 0-indexed
    k -= 1

    # Step 4: Build the result character by character
    result = []
    for i in range(n):
        # Calculate which number to pick at current position
        # factorial[n-1-i] is the size of each block at this level
        index = k // factorial[n-1-i]

        # Append the selected number to result
        result.append(numbers[index])

        # Remove the used number from available numbers
        numbers.pop(index)

        # Update k to be the position within the selected block
        k %= factorial[n-1-i]

    # Step 5: Join all characters to form the final string
    return ''.join(result)
```

```javascript
// Time: O(n^2) | Space: O(n)
// O(n^2) because splice is O(n) in JavaScript
function getPermutation(n, k) {
  // Step 1: Precompute factorials from 0! to (n-1)!
  const factorial = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    factorial[i] = factorial[i - 1] * i;
  }

  // Step 2: Create list of available numbers [1, 2, ..., n]
  const numbers = [];
  for (let i = 1; i <= n; i++) {
    numbers.push(i.toString());
  }

  // Step 3: Convert k from 1-indexed to 0-indexed
  k--;

  // Step 4: Build the result character by character
  const result = [];
  for (let i = 0; i < n; i++) {
    // Calculate which number to pick at current position
    // factorial[n-1-i] is the size of each block at this level
    const index = Math.floor(k / factorial[n - 1 - i]);

    // Append the selected number to result
    result.push(numbers[index]);

    // Remove the used number from available numbers
    numbers.splice(index, 1);

    // Update k to be the position within the selected block
    k %= factorial[n - 1 - i];
  }

  // Step 5: Join all characters to form the final string
  return result.join("");
}
```

```java
// Time: O(n^2) | Space: O(n)
// O(n^2) because ArrayList.remove() is O(n) in Java
class Solution {
    public String getPermutation(int n, int k) {
        // Step 1: Precompute factorials from 0! to (n-1)!
        int[] factorial = new int[n];
        factorial[0] = 1;
        for (int i = 1; i < n; i++) {
            factorial[i] = factorial[i-1] * i;
        }

        // Step 2: Create list of available numbers [1, 2, ..., n]
        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            numbers.add(i);
        }

        // Step 3: Convert k from 1-indexed to 0-indexed
        k--;

        // Step 4: Build the result character by character
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < n; i++) {
            // Calculate which number to pick at current position
            // factorial[n-1-i] is the size of each block at this level
            int index = k / factorial[n-1-i];

            // Append the selected number to result
            result.append(numbers.get(index));

            // Remove the used number from available numbers
            numbers.remove(index);

            // Update k to be the position within the selected block
            k %= factorial[n-1-i];
        }

        // Step 5: Return the final string
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have an outer loop that runs n times
- Inside the loop, we perform list removal which takes O(n) time in all three languages
- The factorial precomputation takes O(n) time, which is dominated by O(n²)
- Total: O(n²) operations

**Space Complexity:** O(n)

- We store the factorial array of size n
- We store the list of available numbers of size n
- We store the result string of size n
- Total: O(n) extra space

**Why not O(n log n)?** Some might think we could use a balanced BST to achieve O(n log n) by finding and removing elements in O(log n) time. However, with n ≤ 9, the O(n²) solution is perfectly acceptable and simpler to implement in an interview setting.

## Common Mistakes

1. **Forgetting to convert k to 0-indexed:** The problem states k is 1-indexed (first permutation is k=1), but our mathematical calculations work naturally with 0-indexing. Forgetting this adjustment will give you the (k+1)-th permutation instead of the k-th.

2. **Incorrect factorial calculation:** Using n! instead of (n-1)! for the first digit. Remember: when choosing the first digit, there are (n-1)! permutations for each possible first digit, not n!.

3. **Off-by-one errors in the loop:** Using the wrong index when accessing factorials. The correct formula is `factorial[n-1-i]` because as we place more digits, the number of remaining permutations decreases.

4. **Not handling large k correctly:** When k equals n! (the last permutation), some implementations might try to access an index out of bounds. Our solution handles this correctly because when k=n!, after converting to 0-indexed we get k=n!-1, and the modulo operations work correctly.

## When You'll See This Pattern

This combinatorial indexing pattern appears in several problems:

1. **Next Permutation (Medium):** While not identical, both problems deal with permutations in lexicographic order. Understanding how permutations are ordered helps with both problems.

2. **Combination Sum problems:** The idea of using factorials to determine positions in combinatorial sequences appears in various counting problems.

3. **K-th Symbol in Grammar (Medium):** Uses a similar divide-and-conquer approach where you determine which half of the structure contains the answer.

4. **K-th Smallest in Lexicographical Order (Hard):** Uses similar prefix-based counting to skip over ranges of numbers without enumerating them.

The core pattern is: when you need to find the k-th element in a combinatorial sequence, you can often use mathematical properties to determine each digit/choice directly without generating all possibilities.

## Key Takeaways

1. **Combinatorial problems often have mathematical shortcuts:** When dealing with permutations, combinations, or other combinatorial sequences, look for mathematical properties that let you compute results directly instead of enumerating all possibilities.

2. **Think in terms of blocks/groups:** The key insight is recognizing that permutations are grouped by their prefixes, and each group has a predictable size based on factorials.

3. **Convert to 0-indexed for cleaner math:** Many combinatorial calculations are simpler with 0-based indexing. Always check whether your input is 1-indexed and adjust accordingly.

4. **Small constraints can be misleading:** Even though n ≤ 9 seems small, 9! = 362,880 is large enough to make brute force approaches fail under time constraints. Don't be fooled by small input sizes.

Related problems: [Next Permutation](/problem/next-permutation), [Permutations](/problem/permutations)
