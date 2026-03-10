---
title: "How to Solve Minimum Adjacent Swaps to Reach the Kth Smallest Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Adjacent Swaps to Reach the Kth Smallest Number. Medium difficulty, 72.1% acceptance rate. Topics: Two Pointers, String, Greedy."
date: "2029-06-17"
category: "dsa-patterns"
tags:
  [
    "minimum-adjacent-swaps-to-reach-the-kth-smallest-number",
    "two-pointers",
    "string",
    "greedy",
    "medium",
  ]
---

# How to Solve Minimum Adjacent Swaps to Reach the Kth Smallest Number

You're given a string `num` representing a large integer and an integer `k`. You need to find the minimum number of adjacent swaps required to transform `num` into the k-th smallest wonderful number — a permutation of `num`'s digits that's greater than `num`. This problem is tricky because it combines two concepts: finding the k-th next permutation and calculating minimum adjacent swaps to transform one permutation into another.

## Visual Walkthrough

Let's trace through `num = "548935"`, `k = 4`:

**Step 1: Find the k-th next permutation**

1. Start with `"548935"`
2. 1st next permutation: `"548953"` (swap last two digits)
3. 2nd next permutation: `"549358"` (next lexicographic permutation)
4. 3rd next permutation: `"549385"`
5. 4th next permutation: `"549538"` ← This is our target

**Step 2: Calculate minimum adjacent swaps**
We need to transform `"548935"` → `"549538"` using only adjacent swaps.

Original: `5 4 8 9 3 5` (positions: 0-5)
Target: `5 4 9 5 3 8`

Let's track each digit's movement:

- First '5' (pos 0 → pos 0): 0 swaps
- '4' (pos 1 → pos 1): 0 swaps
- '9' (pos 3 → pos 2): needs to move left 1 position
- Second '5' (pos 5 → pos 3): needs to move left 2 positions
- '3' (pos 4 → pos 4): 0 swaps
- '8' (pos 2 → pos 5): needs to move right 3 positions

But here's the catch: when we move '9' left, it affects positions of other digits. We need a systematic approach.

## Brute Force Approach

A naive approach would be:

1. Generate all permutations of `num`
2. Filter to keep only wonderful numbers (greater than `num`)
3. Sort them to find the k-th smallest
4. Calculate minimum adjacent swaps between `num` and the target

The problem? For a string of length `n`, there are `n!` permutations. Even for `n=10`, that's 3.6 million permutations. Generating all permutations is `O(n!)` time, which is completely infeasible.

Even if we could efficiently find the k-th next permutation (which we can), calculating minimum adjacent swaps between two permutations isn't trivial. A brute force approach would try all possible swap sequences, which is also factorial complexity.

## Optimized Approach

The key insight is that this problem decomposes into two independent subproblems:

1. **Find the k-th next permutation**: We can repeatedly apply the "next permutation" algorithm k times. The standard next permutation algorithm (from problem #31) runs in O(n) time.

2. **Calculate minimum adjacent swaps**: Given two permutations of the same multiset, the minimum adjacent swaps needed to transform one into another equals the number of inversions between them when we map indices.

Here's the clever part: For each digit in the original string, we track where it needs to go in the target. Then we simulate bubble sort on the original string, always swapping to move the current element toward its target position. The number of swaps equals the sum of distances each element needs to travel, but we must account for overlapping movements.

A more efficient method: Use a queue for each digit value to track positions, then process left to right, counting how many positions each element needs to jump over.

## Optimal Solution

The optimal solution has two phases:

1. Find the k-th next permutation using the standard next permutation algorithm
2. Calculate minimum adjacent swaps using index mapping and Fenwick Tree (Binary Indexed Tree) to count inversions

<div class="code-group">

```python
# Time: O(k*n + n*logn) | Space: O(n)
def getMinSwaps(num: str, k: int) -> int:
    """
    Calculate minimum adjacent swaps to reach k-th smallest wonderful number.

    Approach:
    1. Find k-th next permutation of num
    2. Calculate minimum adjacent swaps between original and target
    """

    # Convert string to list for mutability
    nums = list(num)
    target = nums.copy()

    # Step 1: Find k-th next permutation by applying next_permutation k times
    def next_permutation(arr):
        """Standard next permutation algorithm (LeetCode #31)"""
        n = len(arr)

        # Find first decreasing element from right
        i = n - 2
        while i >= 0 and arr[i] >= arr[i + 1]:
            i -= 1

        if i >= 0:
            # Find element just larger than arr[i] from right
            j = n - 1
            while arr[j] <= arr[i]:
                j -= 1
            # Swap them
            arr[i], arr[j] = arr[j], arr[i]

        # Reverse the suffix starting from i+1
        left, right = i + 1, n - 1
        while left < right:
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
            right -= 1

        return arr

    # Apply next permutation k times
    for _ in range(k):
        target = next_permutation(target)

    # Step 2: Calculate minimum adjacent swaps between nums and target
    # We'll use index mapping and count inversions

    # Create a list of indices for each digit in original nums
    # Since digits can repeat, we use queues
    from collections import deque
    digit_positions = [deque() for _ in range(10)]

    # Store positions of each digit in original array
    for i, digit in enumerate(nums):
        digit_positions[int(digit)].append(i)

    # Create mapping: for each position in target, where is that digit in original?
    mapped_indices = []
    for digit in target:
        # Get the next occurrence of this digit in original
        original_pos = digit_positions[int(digit)].popleft()
        mapped_indices.append(original_pos)

    # Now calculate minimum swaps = number of inversions in mapped_indices
    # Each inversion represents elements that need to cross each other

    # Use Fenwick Tree to count inversions efficiently
    class FenwickTree:
        def __init__(self, n):
            self.n = n
            self.tree = [0] * (n + 1)

        def update(self, i, delta):
            """Add delta at position i (1-based)"""
            i += 1  # Convert to 1-based
            while i <= self.n:
                self.tree[i] += delta
                i += i & -i  # Move to next index

        def query(self, i):
            """Sum from 0 to i (0-based)"""
            i += 1  # Convert to 1-based
            res = 0
            while i > 0:
                res += self.tree[i]
                i -= i & -i  # Move to parent
            return res

    n = len(mapped_indices)
    fenwick = FenwickTree(n)
    swaps = 0

    # Process from right to left: for each element, count how many smaller
    # elements are to its left (these are inversions)
    for i in range(n - 1, -1, -1):
        # Count how many elements before current position are smaller
        # than the current element's original position
        swaps += fenwick.query(mapped_indices[i] - 1)
        # Mark this position as used
        fenwick.update(mapped_indices[i], 1)

    return swaps
```

```javascript
// Time: O(k*n + n*logn) | Space: O(n)
/**
 * Calculate minimum adjacent swaps to reach k-th smallest wonderful number.
 * @param {string} num - Original number string
 * @param {number} k - Which wonderful number to target (1-indexed)
 * @return {number} Minimum adjacent swaps required
 */
function getMinSwaps(num, k) {
  // Convert string to array for mutability
  const nums = num.split("");
  const target = [...nums];

  // Step 1: Find k-th next permutation
  function nextPermutation(arr) {
    const n = arr.length;

    // Find first decreasing element from right
    let i = n - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) {
      i--;
    }

    if (i >= 0) {
      // Find element just larger than arr[i] from right
      let j = n - 1;
      while (arr[j] <= arr[i]) {
        j--;
      }
      // Swap them
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Reverse the suffix starting from i+1
    let left = i + 1,
      right = n - 1;
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }

    return arr;
  }

  // Apply next permutation k times
  for (let i = 0; i < k; i++) {
    nextPermutation(target);
  }

  // Step 2: Calculate minimum adjacent swaps
  // Create queues for each digit position in original
  const digitPositions = Array.from({ length: 10 }, () => []);

  // Store positions of each digit in original array
  for (let i = 0; i < nums.length; i++) {
    const digit = parseInt(nums[i]);
    digitPositions[digit].push(i);
  }

  // Create mapping from target to original positions
  const mappedIndices = [];
  for (const digitChar of target) {
    const digit = parseInt(digitChar);
    // Get next occurrence of this digit in original
    const originalPos = digitPositions[digit].shift();
    mappedIndices.push(originalPos);
  }

  // Count inversions in mappedIndices using Fenwick Tree
  class FenwickTree {
    constructor(n) {
      this.n = n;
      this.tree = new Array(n + 1).fill(0);
    }

    update(i, delta) {
      i++; // Convert to 1-based
      while (i <= this.n) {
        this.tree[i] += delta;
        i += i & -i; // Move to next index
      }
    }

    query(i) {
      i++; // Convert to 1-based
      let res = 0;
      while (i > 0) {
        res += this.tree[i];
        i -= i & -i; // Move to parent
      }
      return res;
    }
  }

  const n = mappedIndices.length;
  const fenwick = new FenwickTree(n);
  let swaps = 0;

  // Count inversions: for each element, count how many smaller
  // elements appear to its right in mappedIndices
  for (let i = n - 1; i >= 0; i--) {
    // Count elements before current position that are smaller
    swaps += fenwick.query(mappedIndices[i] - 1);
    // Mark this position as used
    fenwick.update(mappedIndices[i], 1);
  }

  return swaps;
}
```

```java
// Time: O(k*n + n*logn) | Space: O(n)
import java.util.*;

class Solution {
    public int getMinSwaps(String num, int k) {
        char[] nums = num.toCharArray();
        char[] target = num.toCharArray();

        // Step 1: Find k-th next permutation
        for (int i = 0; i < k; i++) {
            nextPermutation(target);
        }

        // Step 2: Calculate minimum adjacent swaps
        // Create queues for each digit (0-9)
        List<Queue<Integer>> digitPositions = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            digitPositions.add(new LinkedList<>());
        }

        // Store original positions of each digit
        for (int i = 0; i < nums.length; i++) {
            int digit = nums[i] - '0';
            digitPositions.get(digit).offer(i);
        }

        // Map target indices to original indices
        int[] mappedIndices = new int[target.length];
        for (int i = 0; i < target.length; i++) {
            int digit = target[i] - '0';
            mappedIndices[i] = digitPositions.get(digit).poll();
        }

        // Count inversions using Fenwick Tree
        FenwickTree fenwick = new FenwickTree(nums.length);
        int swaps = 0;

        // Process from right to left
        for (int i = mappedIndices.length - 1; i >= 0; i--) {
            // Count how many smaller elements are to the left
            swaps += fenwick.query(mappedIndices[i] - 1);
            // Mark this position
            fenwick.update(mappedIndices[i], 1);
        }

        return swaps;
    }

    // Standard next permutation algorithm
    private void nextPermutation(char[] arr) {
        int n = arr.length;

        // Find first decreasing element from right
        int i = n - 2;
        while (i >= 0 && arr[i] >= arr[i + 1]) {
            i--;
        }

        if (i >= 0) {
            // Find element just larger than arr[i]
            int j = n - 1;
            while (arr[j] <= arr[i]) {
                j--;
            }
            // Swap
            char temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        // Reverse suffix starting from i+1
        int left = i + 1, right = n - 1;
        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }

    // Fenwick Tree (Binary Indexed Tree) for counting inversions
    class FenwickTree {
        private int n;
        private int[] tree;

        public FenwickTree(int size) {
            this.n = size;
            this.tree = new int[n + 1];
        }

        public void update(int i, int delta) {
            i++; // Convert to 1-based
            while (i <= n) {
                tree[i] += delta;
                i += i & -i; // Move to next index
            }
        }

        public int query(int i) {
            i++; // Convert to 1-based
            int sum = 0;
            while (i > 0) {
                sum += tree[i];
                i -= i & -i; // Move to parent
            }
            return sum;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k\*n + n log n)**

- `k * n`: Applying next permutation k times, where each next permutation is O(n)
- `n log n`: Counting inversions using Fenwick Tree (each update/query is O(log n))

**Space Complexity: O(n)**

- We store the target permutation: O(n)
- We store digit position queues: O(n)
- We store the Fenwick Tree: O(n)
- Total: O(n)

The k\*n term dominates for large k, but in practice k is usually small relative to n.

## Common Mistakes

1. **Not handling duplicate digits correctly**: When digits repeat, you can't just map by value. You need to track which occurrence of a digit goes where. Using queues for each digit value solves this.

2. **Wrong inversion counting**: The minimum adjacent swaps equals the number of inversions in the index mapping, not the sum of absolute differences. Each inversion represents two elements that need to cross each other.

3. **Off-by-one in next permutation**: The standard algorithm has several tricky indices. Common errors include:
   - Starting `i` at `n-1` instead of `n-2`
   - Using `>` instead of `>=` in comparisons
   - Not handling the case when `i < 0` (already last permutation)

4. **Inefficient swap calculation**: Trying to simulate swaps or using bubble sort directly is O(n²). The Fenwick Tree approach is O(n log n) and essential for passing all test cases.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Next Permutation Pattern**: Used in problems where you need to generate permutations in lexicographic order.
   - Related: [Next Permutation](/problem/next-permutation) (Medium) - Direct application
   - Related: [Permutation Sequence](/problem/permutation-sequence) (Hard) - Find k-th permutation directly

2. **Minimum Adjacent Swaps Pattern**: The inversion counting technique appears in problems about transforming one sequence into another.
   - Related: [Minimum Adjacent Swaps to Make a Valid Array](/problem/minimum-adjacent-swaps-to-make-a-valid-array) (Medium) - Similar swap counting
   - Related: [Create Target Array in the Given Order](/problem/create-target-array-in-the-given-order) (Easy) - Simpler index mapping

3. **Fenwick Tree for Inversions**: Counting inversions efficiently is a classic BIT application.
   - Related: [Count of Smaller Numbers After Self](/problem/count-of-smaller-numbers-after-self) (Hard) - Same inversion counting technique

## Key Takeaways

1. **Problem decomposition is key**: Complex problems often break into independent subproblems. Here: (1) find k-th permutation, (2) calculate minimum swaps.

2. **Inversions = Minimum adjacent swaps**: For permutations of the same multiset, the minimum adjacent swaps needed equals the number of inversions in the index mapping. This is a fundamental combinatorial fact.

3. **Handle duplicates systematically**: When elements aren't unique, use queues or similar structures to track which occurrence maps to which position.

4. **Fenwick Trees are powerful for counting**: Whenever you need to count elements smaller/larger than current in a dynamic array, consider using a Fenwick Tree for O(log n) operations.

Related problems: [Next Permutation](/problem/next-permutation)
