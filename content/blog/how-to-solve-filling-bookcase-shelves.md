---
title: "How to Solve Filling Bookcase Shelves — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Filling Bookcase Shelves. Medium difficulty, 68.6% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-08-06"
category: "dsa-patterns"
tags: ["filling-bookcase-shelves", "array", "dynamic-programming", "medium"]
---

## How to Solve Filling Bookcase Shelves

You're given an array of books with thickness and height, and a fixed shelf width. Books must stay in order, but you can decide where to break between shelves. The goal is to minimize the total height of the bookcase, where each shelf's height equals the tallest book on that shelf. The tricky part is balancing width constraints with height optimization—placing books together might save vertical space but could exceed width limits.

## Visual Walkthrough

Let's trace through a concrete example:

```
books = [[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]]
shelfWidth = 4
```

We process books left to right. For each book, we consider:

1. Start a new shelf with this book
2. Try adding it to previous books on the same shelf (if width allows)

Let's simulate:

**Book 0** ([1,1]): Start shelf 0, height=1, width used=1  
**Book 1** ([2,3]): Option A: New shelf → height=3, total=1+3=4  
Option B: Same shelf → width=1+2=3≤4, shelf height=max(1,3)=3, total=3  
Choose Option B (better) → height=3, width=3

**Book 2** ([2,3]): Option A: New shelf → total=3+3=6  
Option B: Same shelf → width=3+2=5>4 ❌  
Option C: Start new shelf from book 1 → width=2≤4, height=3, total=3+3=6  
Best: Option A → height=3, width=2 (new shelf starting at book 2)

**Book 3** ([1,1]): Option A: New shelf → total=3+1=4  
Option B: Same shelf → width=2+1=3≤4, height=max(3,1)=3, total=3  
Choose Option B → height=3, width=3

**Book 4** ([1,1]): Option A: New shelf → total=3+1=4  
Option B: Same shelf → width=3+1=4≤4, height=3, total=3  
Choose Option B → height=3, width=4

**Book 5** ([1,1]): Option A: New shelf → total=3+1=4  
Option B: Same shelf → width=4+1=5>4 ❌  
Option C: Start new shelf from book 4 → width=1≤4, height=1, total=3+1=4  
Option D: Start from book 3 → width=1+1=2≤4, height=max(1,1)=1, total=3+1=4  
Best: Option A/C/D all give 4 → height=1, width=1 (new shelf)

**Book 6** ([1,2]): Option A: New shelf → total=4+2=6  
Option B: Same shelf → width=1+1=2≤4, height=max(1,2)=2, total=3+2=5  
Choose Option B → final total=5

The optimal arrangement: Shelf1: books0-2 (height=3), Shelf2: books3-6 (height=2) → total=5.

## Brute Force Approach

A naive approach would try all possible shelf breaks. For n books, there are 2^(n-1) ways to partition them (each gap between books can either be a break or not). For each partition, we'd check width constraints and calculate total height. This exponential approach becomes impossible for n > 20.

Even a greedy "fill shelf until full" approach fails. Consider:

```
books = [[1,10],[10,1],[1,10]]
shelfWidth = 10
```

Greedy: Shelf1: [1,10] and [10,1] (height=10), Shelf2: [1,10] (height=10) → total=20  
Optimal: Shelf1: [1,10] (height=10), Shelf2: [10,1] and [1,10] (height=10) → total=20  
Actually same here, but with different books greedy can fail.

The brute force teaches us we need systematic evaluation of all reasonable placements, not all possible ones.

## Optimized Approach

The key insight: This is a **dynamic programming** problem where `dp[i]` = minimum total height for books 0 through i-1 (first i books).

For each book i (0-indexed), we consider it as the last book on a shelf. We look backward to find where this shelf might start (at book j), ensuring the total thickness from j to i ≤ shelfWidth. The shelf's height is the maximum book height in [j, i].

The recurrence relation:

```
dp[i] = min(dp[j] + max(height[j], height[j+1], ..., height[i]))
       for all j where sum(thickness[j] + ... + thickness[i]) ≤ shelfWidth
```

Where `dp[0] = 0` (no books = 0 height).

We iterate i from 0 to n-1, and for each i, we try all possible j from i down to 0 until width exceeds shelfWidth. This is O(n²) worst case but much better than exponential.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) worst case, O(n * shelfWidth) average | Space: O(n)
def minHeightShelves(books, shelfWidth):
    """
    DP solution: dp[i] = min total height for first i books (books[0..i-1])
    For each book i-1, try making it the last book on a shelf starting at book j
    """
    n = len(books)
    dp = [0] * (n + 1)  # dp[0] = 0 base case

    for i in range(1, n + 1):
        # Book i-1 is the last book on current shelf
        width = 0
        height = 0
        dp[i] = float('inf')

        # Try placing books j..i-1 on same shelf (j from i-1 down to 0)
        for j in range(i - 1, -1, -1):
            width += books[j][0]  # Add thickness of book j

            if width > shelfWidth:
                break  # Shelf width exceeded, stop trying earlier books

            height = max(height, books[j][1])  # Update shelf height
            # Total height = height up to book j-1 + current shelf height
            dp[i] = min(dp[i], dp[j] + height)

    return dp[n]
```

```javascript
// Time: O(n²) worst case, O(n * shelfWidth) average | Space: O(n)
function minHeightShelves(books, shelfWidth) {
  const n = books.length;
  const dp = new Array(n + 1).fill(0); // dp[0] = 0 base case

  for (let i = 1; i <= n; i++) {
    let width = 0;
    let height = 0;
    dp[i] = Infinity;

    // Try placing books j..i-1 on same shelf (j from i-1 down to 0)
    for (let j = i - 1; j >= 0; j--) {
      width += books[j][0]; // Add thickness of book j

      if (width > shelfWidth) {
        break; // Shelf width exceeded
      }

      height = Math.max(height, books[j][1]); // Update shelf height
      // Total height = height up to book j-1 + current shelf height
      dp[i] = Math.min(dp[i], dp[j] + height);
    }
  }

  return dp[n];
}
```

```java
// Time: O(n²) worst case, O(n * shelfWidth) average | Space: O(n)
class Solution {
    public int minHeightShelves(int[][] books, int shelfWidth) {
        int n = books.length;
        int[] dp = new int[n + 1]; // dp[0] = 0 base case

        for (int i = 1; i <= n; i++) {
            int width = 0;
            int height = 0;
            dp[i] = Integer.MAX_VALUE;

            // Try placing books j..i-1 on same shelf (j from i-1 down to 0)
            for (int j = i - 1; j >= 0; j--) {
                width += books[j][0]; // Add thickness of book j

                if (width > shelfWidth) {
                    break; // Shelf width exceeded
                }

                height = Math.max(height, books[j][1]); // Update shelf height
                // Total height = height up to book j-1 + current shelf height
                dp[i] = Math.min(dp[i], dp[j] + height);
            }
        }

        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in worst case, but typically better. In the worst case (all books very thin), we check all j for each i, giving n(n+1)/2 operations = O(n²). However, since we break when width exceeds shelfWidth, the inner loop usually runs only until cumulative thickness > shelfWidth. If average book thickness is t, inner loop runs ~shelfWidth/t times, making it O(n \* (shelfWidth/t)).

**Space Complexity:** O(n) for the dp array. We only need linear space to store minimum heights for prefixes.

## Common Mistakes

1. **Wrong iteration direction:** Iterating j forward instead of backward makes width calculation awkward. Backward iteration lets us naturally accumulate width and track max height as we go.

2. **Forgetting to reset height when starting new shelf:** When trying different j values, height must be the max in [j, i], not carry over from previous j. That's why we reset height inside the j loop.

3. **Incorrect dp indices:** Using dp[i] for books 0..i instead of 0..i-1 causes off-by-one errors. Standard convention: dp[i] = answer for first i books (books[0..i-1]).

4. **Not breaking early when width exceeded:** Continuing the j loop after width > shelfWidth wastes time. Books are in order, so if j..i exceeds width, j-1..i will also exceed it.

## When You'll See This Pattern

This "partition array with constraints to minimize cost" pattern appears in several DP problems:

1. **Palindrome Partitioning II (LeetCode 132):** Partition string into palindromes with minimum cuts. Similar structure: try all possible endings for current partition.

2. **Word Break (LeetCode 139):** Check if string can be segmented into dictionary words. Also considers all possible segment endings.

3. **Minimum Difficulty of a Job Schedule (LeetCode 1335):** Schedule jobs in d days to minimize maximum difficulty per day. Same "partition array with cost per segment" pattern.

The common theme: You have a sequence, need to partition it into segments with some constraint, and want to minimize/maximize a cost function that depends on segment properties.

## Key Takeaways

1. **Recognize partition DP:** When you need to split an ordered sequence with constraints and optimize a cost, think DP where dp[i] represents optimal solution for prefix ending at i.

2. **Backward iteration simplifies:** When checking where current segment might start, iterating backward lets you naturally accumulate segment properties (width, max height).

3. **Break early for efficiency:** If segments have a size constraint (like width), stop trying earlier starting points once the constraint is violated.

[Practice this problem on CodeJeet](/problem/filling-bookcase-shelves)
