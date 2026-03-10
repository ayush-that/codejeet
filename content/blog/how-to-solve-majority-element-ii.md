---
title: "How to Solve Majority Element II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Majority Element II. Medium difficulty, 55.8% acceptance rate. Topics: Array, Hash Table, Sorting, Counting."
date: "2026-08-31"
category: "dsa-patterns"
tags: ["majority-element-ii", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Majority Element II

You're given an array of integers and need to find all elements that appear more than ⌊n/3⌋ times, where n is the array's length. What makes this problem interesting is that there can be at most 2 such elements (since 3 elements would each need more than n/3 occurrences, which sums to more than n). This constraint leads to an elegant solution that doesn't require sorting or storing all counts.

## Visual Walkthrough

Let's trace through the example `[1, 2, 1, 1, 3, 2, 2, 2, 3]` with n=9. We need elements appearing more than ⌊9/3⌋ = 3 times.

**Step 1: Understanding the constraint**

- At most 2 elements can appear > n/3 times
- In our array: 1 appears 3 times, 2 appears 4 times, 3 appears 2 times
- So only 2 qualifies (appears 4 times > 3)

**Step 2: Boyer-Moore Voting Algorithm intuition**
Think of this as an election with 2 "candidate slots." We'll:

1. Find up to 2 candidates that _might_ be majority elements
2. Verify they actually appear > n/3 times

For `[1, 2, 1, 1, 3, 2, 2, 2, 3]`:

- Start with no candidates
- Process 1: candidate1 = 1, count1 = 1
- Process 2: candidate2 = 2, count2 = 1
- Process 1: matches candidate1, count1 = 2
- Process 1: matches candidate1, count1 = 3
- Process 3: doesn't match either, decrement both counts: count1 = 2, count2 = 0
- Process 2: candidate2 is empty, so candidate2 = 2, count2 = 1
- Process 2: matches candidate2, count2 = 2
- Process 2: matches candidate2, count2 = 3
- Process 3: doesn't match either, decrement: count1 = 1, count2 = 2

Candidates found: 1 and 2. Now verify counts: 1 appears 3 times (not > 3), 2 appears 4 times (> 3). Result: [2].

## Brute Force Approach

The most straightforward solution uses a hash map to count all occurrences, then filters for counts > n/3:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def majorityElement(nums):
    n = len(nums)
    threshold = n // 3
    count_map = {}
    result = []

    # Count all occurrences
    for num in nums:
        count_map[num] = count_map.get(num, 0) + 1

    # Check which elements exceed threshold
    for num, count in count_map.items():
        if count > threshold:
            result.append(num)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function majorityElement(nums) {
  const n = nums.length;
  const threshold = Math.floor(n / 3);
  const countMap = new Map();
  const result = [];

  // Count all occurrences
  for (const num of nums) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // Check which elements exceed threshold
  for (const [num, count] of countMap) {
    if (count > threshold) {
      result.push(num);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public List<Integer> majorityElement(int[] nums) {
    int n = nums.length;
    int threshold = n / 3;
    Map<Integer, Integer> countMap = new HashMap<>();
    List<Integer> result = new ArrayList<>();

    // Count all occurrences
    for (int num : nums) {
        countMap.put(num, countMap.getOrDefault(num, 0) + 1);
    }

    // Check which elements exceed threshold
    for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
        if (entry.getValue() > threshold) {
            result.add(entry.getKey());
        }
    }

    return result;
}
```

</div>

**Why this isn't optimal for interviews:**
While this solution has O(n) time and O(n) space, interviewers expect you to know the Boyer-Moore Voting Algorithm extension that achieves O(1) space. The hash map solution is acceptable but doesn't demonstrate knowledge of the optimal pattern.

## Optimized Approach

The key insight comes from the Boyer-Moore Majority Vote Algorithm, extended for the n/3 case:

1. **Mathematical observation**: At most 2 elements can appear > n/3 times
2. **Candidate selection**: Maintain up to 2 candidates with their counts
3. **Voting logic**:
   - If current number matches a candidate, increment that candidate's count
   - If current number doesn't match either candidate:
     - If a candidate has count 0, replace that candidate
     - Otherwise, decrement both candidates' counts
4. **Verification**: After finding candidates, count their actual occurrences to verify

**Why this works**: When we decrement both counts for a number that's not a candidate, we're effectively canceling out one occurrence of each candidate with one occurrence of the non-candidate. This maintains the relative majority status of true majority elements.

## Optimal Solution

Here's the Boyer-Moore Voting Algorithm implementation with O(n) time and O(1) space:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def majorityElement(nums):
    if not nums:
        return []

    # Step 1: Find up to 2 candidates using Boyer-Moore Voting Algorithm
    candidate1, candidate2 = None, None
    count1, count2 = 0, 0

    for num in nums:
        # If current number matches candidate1
        if candidate1 is not None and num == candidate1:
            count1 += 1
        # If current number matches candidate2
        elif candidate2 is not None and num == candidate2:
            count2 += 1
        # If candidate1 is empty, assign current number to it
        elif count1 == 0:
            candidate1 = num
            count1 = 1
        # If candidate2 is empty, assign current number to it
        elif count2 == 0:
            candidate2 = num
            count2 = 1
        # Current number doesn't match either candidate and both have counts > 0
        else:
            count1 -= 1
            count2 -= 1

    # Step 2: Verify candidates actually appear more than n/3 times
    result = []
    n = len(nums)
    threshold = n // 3

    # Count occurrences of candidate1
    count1 = 0
    for num in nums:
        if num == candidate1:
            count1 += 1

    # Count occurrences of candidate2 (if different from candidate1)
    count2 = 0
    if candidate2 != candidate1:
        for num in nums:
            if num == candidate2:
                count2 += 1

    # Add to result if they exceed threshold
    if count1 > threshold:
        result.append(candidate1)
    if count2 > threshold:
        result.append(candidate2)

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function majorityElement(nums) {
  if (nums.length === 0) return [];

  // Step 1: Find up to 2 candidates using Boyer-Moore Voting Algorithm
  let candidate1 = null,
    candidate2 = null;
  let count1 = 0,
    count2 = 0;

  for (const num of nums) {
    // If current number matches candidate1
    if (candidate1 !== null && num === candidate1) {
      count1++;
    }
    // If current number matches candidate2
    else if (candidate2 !== null && num === candidate2) {
      count2++;
    }
    // If candidate1 is empty, assign current number to it
    else if (count1 === 0) {
      candidate1 = num;
      count1 = 1;
    }
    // If candidate2 is empty, assign current number to it
    else if (count2 === 0) {
      candidate2 = num;
      count2 = 1;
    }
    // Current number doesn't match either candidate and both have counts > 0
    else {
      count1--;
      count2--;
    }
  }

  // Step 2: Verify candidates actually appear more than n/3 times
  const result = [];
  const n = nums.length;
  const threshold = Math.floor(n / 3);

  // Count occurrences of candidate1
  count1 = 0;
  for (const num of nums) {
    if (num === candidate1) count1++;
  }

  // Count occurrences of candidate2 (if different from candidate1)
  count2 = 0;
  if (candidate2 !== candidate1) {
    for (const num of nums) {
      if (num === candidate2) count2++;
    }
  }

  // Add to result if they exceed threshold
  if (count1 > threshold) result.push(candidate1);
  if (count2 > threshold) result.push(candidate2);

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public List<Integer> majorityElement(int[] nums) {
    List<Integer> result = new ArrayList<>();
    if (nums.length == 0) return result;

    // Step 1: Find up to 2 candidates using Boyer-Moore Voting Algorithm
    Integer candidate1 = null, candidate2 = null;
    int count1 = 0, count2 = 0;

    for (int num : nums) {
        // If current number matches candidate1
        if (candidate1 != null && num == candidate1) {
            count1++;
        }
        // If current number matches candidate2
        else if (candidate2 != null && num == candidate2) {
            count2++;
        }
        // If candidate1 is empty, assign current number to it
        else if (count1 == 0) {
            candidate1 = num;
            count1 = 1;
        }
        // If candidate2 is empty, assign current number to it
        else if (count2 == 0) {
            candidate2 = num;
            count2 = 1;
        }
        // Current number doesn't match either candidate and both have counts > 0
        else {
            count1--;
            count2--;
        }
    }

    // Step 2: Verify candidates actually appear more than n/3 times
    int n = nums.length;
    int threshold = n / 3;

    // Count occurrences of candidate1
    count1 = 0;
    for (int num : nums) {
        if (num == candidate1) count1++;
    }

    // Count occurrences of candidate2 (if different from candidate1)
    count2 = 0;
    if (candidate2 != null && !candidate2.equals(candidate1)) {
        for (int num : nums) {
            if (num == candidate2) count2++;
        }
    }

    // Add to result if they exceed threshold
    if (count1 > threshold) result.add(candidate1);
    if (count2 > threshold) result.add(candidate2);

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- First pass to find candidates: O(n)
- Second pass to verify candidates: O(n)
- Total: O(2n) = O(n)

**Space Complexity: O(1)**

- We only store 2 candidates and their counts (constant space)
- The result list doesn't count toward space complexity in standard analysis (it's output)

## Common Mistakes

1. **Forgetting the verification step**: The voting algorithm only identifies _potential_ majority elements. You must count their actual occurrences to verify they truly appear > n/3 times. Candidates that survive the voting process aren't guaranteed to be majority elements.

2. **Not handling the case where candidates are the same**: If the array has only one type of number, both candidates might end up being the same value. Always check `candidate2 != candidate1` before counting occurrences separately.

3. **Incorrect threshold calculation**: Using `n/3` without floor division in languages like Python 3 will give a float. Always use integer division: `n // 3` in Python, `Math.floor(n / 3)` in JavaScript, `n / 3` in Java (integer division).

4. **Edge case: empty array or small arrays**: Always check if the array is empty first. For n < 3, the threshold is 0, so any element appears > 0 times. Handle this properly.

## When You'll See This Pattern

The Boyer-Moore Voting Algorithm appears in problems where you need to find elements with frequency above a certain threshold without using extra space proportional to input size:

1. **Majority Element (Easy)**: Find the element appearing more than n/2 times. This is the classic Boyer-Moore problem with one candidate.

2. **Find All Numbers Disappeared in an Array (Easy)**: While not exactly the same, it uses similar in-place marking techniques.

3. **Find the Duplicate Number (Medium)**: Problems requiring O(1) space often use similar cancellation or marking strategies.

The pattern to recognize: when you need to find frequent elements with space constraints, and there's a mathematical bound on how many such elements can exist (like "at most k elements appear > n/(k+1) times").

## Key Takeaways

1. **Mathematical bounds matter**: For "appear more than n/k" problems, there can be at most (k-1) such elements. This constraint enables the voting algorithm.

2. **Two-phase approach**: First identify candidates efficiently, then verify their actual counts. This separation is key to achieving O(1) space.

3. **Cancellation principle**: The voting algorithm works by canceling out k occurrences of different elements. For n/3 case (k=3), we cancel one occurrence of each candidate against one non-candidate.

Related problems: [Majority Element](/problem/majority-element), [Check If a Number Is Majority Element in a Sorted Array](/problem/check-if-a-number-is-majority-element-in-a-sorted-array), [Most Frequent Even Element](/problem/most-frequent-even-element)
