---
title: "How to Solve Card Flipping Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Card Flipping Game. Medium difficulty, 49.9% acceptance rate. Topics: Array, Hash Table."
date: "2029-07-27"
category: "dsa-patterns"
tags: ["card-flipping-game", "array", "hash-table", "medium"]
---

# How to Solve Card Flipping Game

You're given two arrays representing cards with numbers on front and back. You can flip any card, and your goal is to find the smallest number that appears on at least one card and **doesn't** appear on both sides of any card. This problem is tricky because you need to find numbers that are "safe" to choose - numbers that won't appear on both sides of the same card no matter how you flip.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
fronts = [1, 2, 4, 4, 7]
backs  = [1, 3, 4, 1, 2]
```

**Step 1: Identify "bad" numbers**
We look for cards where the front and back have the same number - these numbers can never be our answer because no matter how we flip that card, that number will always be visible.

- Card 0: fronts[0] = 1, backs[0] = 1 → 1 is a "bad" number
- Card 2: fronts[2] = 4, backs[2] = 4 → 4 is a "bad" number
- Other cards have different numbers on front and back

**Step 2: Consider all possible numbers**
We look at all numbers that appear on any card: {1, 2, 3, 4, 7}

**Step 3: Filter out "bad" numbers**
From our set, remove numbers that appear on both sides of any card: {1, 4} are bad
Remaining candidates: {2, 3, 7}

**Step 4: Find the smallest candidate**
The smallest number in {2, 3, 7} is 2

**Step 5: Verify 2 works**

- Card 1 has 2 on front and 3 on back → we can flip it to show 3 if needed
- Card 4 has 7 on front and 2 on back → we can leave it as is to show 7
- No card has 2 on both sides
- We can arrange cards so 2 is never visible if we don't want it to be

Thus, the answer is 2.

## Brute Force Approach

A naive approach would be to try every possible number we could choose, then check if we can arrange the cards so that number isn't visible. For each candidate number:

1. For each card, if either side equals the candidate, we must flip it to hide that number
2. After flipping, check if the candidate appears on any visible side
3. If not, the candidate is valid

The problem with this approach is efficiency. We'd need to:

- Consider all unique numbers from both arrays (up to 2n numbers)
- For each candidate, process all n cards
- This gives us O(n²) time complexity, which is too slow for n up to 1000

## Optimized Approach

The key insight is that we only need to avoid numbers that appear on **both sides of the same card**. Here's the step-by-step reasoning:

1. **Identify "bad" numbers**: Any number that appears on both sides of any card can never be our answer. No matter how we flip that card, that number will always be visible.

2. **Consider all possible numbers**: We need to look at every number that appears on any card (front or back) as a potential answer.

3. **Filter candidates**: From all possible numbers, remove the "bad" numbers that appear on both sides of some card.

4. **Find the minimum**: The smallest remaining number is our answer. If no numbers remain, return 0.

Why does this work? If a number doesn't appear on both sides of any card, then for every card that has that number:

- The number appears on only one side
- We can flip that card to hide the number
- Therefore, we can arrange all cards so that number is never visible

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def flipgame(fronts, backs):
    """
    Find the smallest number that appears on at least one card
    but doesn't appear on both sides of any card.
    """
    n = len(fronts)

    # Step 1: Identify numbers that appear on both sides of the same card
    # These numbers can never be our answer
    bad_numbers = set()
    for i in range(n):
        if fronts[i] == backs[i]:
            bad_numbers.add(fronts[i])

    # Step 2: Consider all numbers from both arrays as potential answers
    # We start with a large value to find the minimum
    answer = float('inf')

    # Check all numbers in fronts array
    for num in fronts:
        # Only consider numbers that aren't "bad"
        if num not in bad_numbers:
            answer = min(answer, num)

    # Check all numbers in backs array
    for num in backs:
        if num not in bad_numbers:
            answer = min(answer, num)

    # Step 3: Return answer or 0 if no valid number exists
    return 0 if answer == float('inf') else answer
```

```javascript
// Time: O(n) | Space: O(n)
function flipgame(fronts, backs) {
  const n = fronts.length;

  // Step 1: Create a set to store numbers that appear on both sides
  // of the same card (these are invalid as answers)
  const badNumbers = new Set();

  for (let i = 0; i < n; i++) {
    if (fronts[i] === backs[i]) {
      badNumbers.add(fronts[i]);
    }
  }

  // Step 2: Initialize answer to a large value
  let answer = Infinity;

  // Check all numbers in fronts array
  for (let i = 0; i < n; i++) {
    const num = fronts[i];
    // Only consider numbers that aren't in our "bad" set
    if (!badNumbers.has(num)) {
      answer = Math.min(answer, num);
    }
  }

  // Check all numbers in backs array
  for (let i = 0; i < n; i++) {
    const num = backs[i];
    if (!badNumbers.has(num)) {
      answer = Math.min(answer, num);
    }
  }

  // Step 3: Return 0 if no valid number found, otherwise return answer
  return answer === Infinity ? 0 : answer;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int flipgame(int[] fronts, int[] backs) {
        int n = fronts.length;

        // Step 1: Use a HashSet to track numbers that appear on both sides
        // of the same card (these cannot be chosen)
        Set<Integer> badNumbers = new HashSet<>();

        for (int i = 0; i < n; i++) {
            if (fronts[i] == backs[i]) {
                badNumbers.add(fronts[i]);
            }
        }

        // Step 2: Initialize answer to a large value
        int answer = Integer.MAX_VALUE;

        // Check all numbers in fronts array
        for (int i = 0; i < n; i++) {
            int num = fronts[i];
            // Skip numbers that are in the "bad" set
            if (!badNumbers.contains(num)) {
                answer = Math.min(answer, num);
            }
        }

        // Check all numbers in backs array
        for (int i = 0; i < n; i++) {
            int num = backs[i];
            if (!badNumbers.contains(num)) {
                answer = Math.min(answer, num);
            }
        }

        // Step 3: Return 0 if no valid number found
        return answer == Integer.MAX_VALUE ? 0 : answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the arrays to identify "bad" numbers: O(n)
- We make two passes (one for fronts, one for backs) to find the minimum valid number: O(2n) = O(n)
- Set operations (add and contains) are O(1) on average
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- In the worst case, all cards could have the same number on both sides, so our "bad numbers" set could contain up to n elements
- We don't use any other data structures that scale with input size
- Total: O(n) for the HashSet/Set

## Common Mistakes

1. **Only checking numbers that appear exactly once**: Some candidates think they need to find numbers that appear only once total. This is incorrect - a number can appear multiple times on different cards as long as it never appears on both sides of the same card.

2. **Forgetting to check both arrays**: You must check numbers from both the fronts and backs arrays. A valid number might only appear in the backs array but never on both sides of any card.

3. **Incorrect initialization of answer**: Using 0 as initial minimum can cause problems since 0 might be smaller than all valid numbers. Always initialize to a value larger than any possible answer (like infinity or Integer.MAX_VALUE).

4. **Not handling the "no valid answer" case**: If all numbers appear on both sides of some card, we should return 0. Don't forget to check if your answer variable was never updated.

## When You'll See This Pattern

This problem uses the **"exclusion set"** pattern, where you:

1. Identify elements that definitely cannot be part of the solution
2. Consider all possible candidates
3. Filter out the excluded ones
4. Find the optimal among the remaining

Similar problems include:

1. **"Intersection of Two Arrays" (LeetCode 349)**: Uses sets to efficiently find common elements between two arrays, similar to how we use a set to track "bad" numbers.

2. **"First Missing Positive" (LeetCode 41)**: Uses the concept of marking/eliminating numbers that cannot be the answer, though with a different implementation strategy.

3. **"Find All Numbers Disappeared in an Array" (LeetCode 448)**: Uses marking techniques to track which numbers are present/absent.

## Key Takeaways

1. **Look for exclusion criteria**: When a problem asks for elements that satisfy certain conditions, often it's easier to first identify elements that definitely don't work, then choose from the remainder.

2. **Hash sets are efficient for membership testing**: When you need to repeatedly check if elements are in a collection, sets provide O(1) lookups compared to O(n) for arrays/lists.

3. **Consider the complement approach**: Instead of directly finding what you want, sometimes it's easier to find what you don't want and subtract it from all possibilities.

[Practice this problem on CodeJeet](/problem/card-flipping-game)
