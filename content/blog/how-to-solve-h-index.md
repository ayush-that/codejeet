---
title: "How to Solve H-Index — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode H-Index. Medium difficulty, 41.2% acceptance rate. Topics: Array, Sorting, Counting Sort."
date: "2026-11-26"
category: "dsa-patterns"
tags: ["h-index", "array", "sorting", "counting-sort", "medium"]
---

## How to Solve H-Index

The H-Index problem asks us to calculate a researcher's h-index given their citation counts for each paper. The h-index is defined as the maximum value `h` such that the researcher has at least `h` papers with at least `h` citations each. What makes this problem interesting is that it's not simply about finding a statistical average—it requires understanding the distribution of citations and finding the optimal threshold where quantity and quality intersect.

## Visual Walkthrough

Let's trace through an example: `citations = [3,0,6,1,5]`

**Step 1: Understanding the definition**
We need to find the largest number `h` where at least `h` papers have `h` or more citations.

**Step 2: Manual calculation**

- Sort the citations: `[0,1,3,5,6]`
- Check possible h-values:
  - h=1: At least 1 paper with ≥1 citation? Yes (5 papers qualify)
  - h=2: At least 2 papers with ≥2 citations? Yes (4 papers: 3,5,6)
  - h=3: At least 3 papers with ≥3 citations? Yes (3 papers: 3,5,6)
  - h=4: At least 4 papers with ≥4 citations? No (only 2 papers: 5,6)
  - h=5: At least 5 papers with ≥5 citations? No (only 2 papers: 5,6)

The largest valid h is 3. So the h-index is 3.

**Step 3: Visual pattern**
When we sort the citations, we can think of it this way:

- Paper 1: 0 citations
- Paper 2: 1 citation
- Paper 3: 3 citations
- Paper 4: 5 citations
- Paper 5: 6 citations

For h=3, we look at the 3rd paper from the end (paper 3 with 3 citations). Since 3 ≥ 3, and there are 3 papers from this point onward, h=3 is valid.

## Brute Force Approach

The most straightforward approach is to test every possible h-value from 0 up to the number of papers:

1. For each candidate h from 0 to n (where n is the number of papers)
2. Count how many papers have at least h citations
3. If the count is ≥ h, record it as a valid h-index
4. Return the maximum valid h

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def hIndexBruteForce(citations):
    n = len(citations)
    max_h = 0

    # Try every possible h from 0 to n
    for h in range(n + 1):
        count = 0
        # Count papers with at least h citations
        for citation in citations:
            if citation >= h:
                count += 1
        # If we have enough papers, update max_h
        if count >= h:
            max_h = max(max_h, h)

    return max_h
```

```javascript
// Time: O(n²) | Space: O(1)
function hIndexBruteForce(citations) {
  const n = citations.length;
  let maxH = 0;

  // Try every possible h from 0 to n
  for (let h = 0; h <= n; h++) {
    let count = 0;
    // Count papers with at least h citations
    for (let citation of citations) {
      if (citation >= h) {
        count++;
      }
    }
    // If we have enough papers, update maxH
    if (count >= h) {
      maxH = Math.max(maxH, h);
    }
  }

  return maxH;
}
```

```java
// Time: O(n²) | Space: O(1)
public int hIndexBruteForce(int[] citations) {
    int n = citations.length;
    int maxH = 0;

    // Try every possible h from 0 to n
    for (int h = 0; h <= n; h++) {
        int count = 0;
        // Count papers with at least h citations
        for (int citation : citations) {
            if (citation >= h) {
                count++;
            }
        }
        // If we have enough papers, update maxH
        if (count >= h) {
            maxH = Math.max(maxH, h);
        }
    }

    return maxH;
}
```

</div>

**Why this is inefficient:** The brute force solution has O(n²) time complexity because for each of the n+1 possible h-values, we scan through all n papers. For n=1000, that's over a million operations. We can do much better.

## Optimized Approach

The key insight is that after sorting the citations in descending order, we can find the h-index by looking for the point where:

1. The citation count at position i is ≥ i+1 (1-based indexing from the start)
2. But the citation count at position i+1 is < i+2

In other words, after sorting in descending order: `[6,5,3,1,0]`

- Position 0: 6 citations ≥ 1? Yes (paper 1 of top 1)
- Position 1: 5 citations ≥ 2? Yes (paper 2 of top 2)
- Position 2: 3 citations ≥ 3? Yes (paper 3 of top 3)
- Position 3: 1 citation ≥ 4? No (paper 4 of top 4 fails)

The h-index is 3, which is the last position where the condition held.

An even more efficient approach uses counting sort since citation counts are non-negative integers. We can create a frequency array where:

- If a paper has ≥ n citations, we count it in the last bucket
- Otherwise, we increment the count at its exact citation count

Then we work backwards from the highest citation count, accumulating counts until we find where accumulated papers ≥ current citation count.

## Optimal Solution

Here's the optimal O(n) solution using counting sort:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def hIndex(citations):
    n = len(citations)

    # Step 1: Create a frequency array (counting sort)
    # papers[i] = number of papers with i citations
    # For papers with ≥ n citations, count them in papers[n]
    papers = [0] * (n + 1)

    for citation in citations:
        # If citation count is >= n, count it in the last bucket
        if citation >= n:
            papers[n] += 1
        else:
            papers[citation] += 1

    # Step 2: Work backwards to find h-index
    total = 0  # Total papers with at least i citations

    for i in range(n, -1, -1):
        total += papers[i]  # Add papers with exactly i citations
        # If we have at least i papers with ≥ i citations, we found h-index
        if total >= i:
            return i

    return 0  # Edge case: no papers or all citations are 0
```

```javascript
// Time: O(n) | Space: O(n)
function hIndex(citations) {
  const n = citations.length;

  // Step 1: Create a frequency array (counting sort)
  // papers[i] = number of papers with i citations
  // For papers with ≥ n citations, count them in papers[n]
  const papers = new Array(n + 1).fill(0);

  for (let citation of citations) {
    // If citation count is >= n, count it in the last bucket
    if (citation >= n) {
      papers[n]++;
    } else {
      papers[citation]++;
    }
  }

  // Step 2: Work backwards to find h-index
  let total = 0; // Total papers with at least i citations

  for (let i = n; i >= 0; i--) {
    total += papers[i]; // Add papers with exactly i citations
    // If we have at least i papers with ≥ i citations, we found h-index
    if (total >= i) {
      return i;
    }
  }

  return 0; // Edge case: no papers or all citations are 0
}
```

```java
// Time: O(n) | Space: O(n)
public int hIndex(int[] citations) {
    int n = citations.length;

    // Step 1: Create a frequency array (counting sort)
    // papers[i] = number of papers with i citations
    // For papers with ≥ n citations, count them in papers[n]
    int[] papers = new int[n + 1];

    for (int citation : citations) {
        // If citation count is >= n, count it in the last bucket
        if (citation >= n) {
            papers[n]++;
        } else {
            papers[citation]++;
        }
    }

    // Step 2: Work backwards to find h-index
    int total = 0;  // Total papers with at least i citations

    for (int i = n; i >= 0; i--) {
        total += papers[i];  // Add papers with exactly i citations
        // If we have at least i papers with ≥ i citations, we found h-index
        if (total >= i) {
            return i;
        }
    }

    return 0;  // Edge case: no papers or all citations are 0
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the citations array to build the frequency array: O(n)
- We make one pass through the frequency array (size n+1) to find the h-index: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We create a frequency array of size n+1 to store counts
- This is optimal since we need to track counts for each possible citation value up to n

## Common Mistakes

1. **Off-by-one errors with indexing**: When working with the sorted array approach, candidates often confuse 0-based and 1-based indexing. Remember: after sorting in descending order, for position i (0-based), we're checking if citations[i] ≥ i+1.

2. **Forgetting to handle citations ≥ n**: In the counting sort approach, if a paper has n or more citations (where n is the number of papers), it should be counted in the last bucket. The h-index cannot exceed n, so any citation ≥ n is effectively the same as n for our calculation.

3. **Not considering h=0 as a valid answer**: If all citations are 0 or the array is empty, the h-index should be 0. Some implementations return -1 or throw an error in these cases.

4. **Using the wrong comparison direction**: The condition is "at least h papers have at least h citations," not "exactly h papers" or "h papers have exactly h citations." Double-check your inequality signs.

## When You'll See This Pattern

The counting sort + backward accumulation pattern appears in several problems:

1. **H-Index II (LeetCode 275)**: The follow-up problem where citations are already sorted in ascending order. The optimal solution uses binary search in O(log n) time.

2. **Counting Sort problems**: Any problem where you need to count frequencies of integers within a known range can use this technique. Examples include:
   - Sort Colors (LeetCode 75): Sort an array of 0s, 1s, and 2s
   - Maximum Gap (LeetCode 164): Find maximum difference between successive elements in sorted form

3. **Threshold finding problems**: Problems where you need to find the largest value satisfying some cumulative condition. For example:
   - Find the smallest missing positive integer (can use similar bucketing)
   - Problems involving percentiles or quantiles

## Key Takeaways

1. **When you see non-negative integers with bounded range**, consider counting sort as an optimization over comparison-based sorting. The O(n) time can be much better than O(n log n) for sorting.

2. **For "at least X with at least Y" type conditions**, working backwards from the maximum possible value often simplifies the logic. Start from the highest possible h and decrease until you find a valid one.

3. **The h-index problem teaches bucket accumulation**: By creating buckets for counts and accumulating from high to low, you can efficiently answer "how many have at least X" queries without rescanning the data.

Related problems: [H-Index II](/problem/h-index-ii)
