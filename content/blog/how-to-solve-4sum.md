---
title: "How to Solve 4Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 4Sum. Medium difficulty, 40.0% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-07-03"
category: "dsa-patterns"
tags: ["4sum", "array", "two-pointers", "sorting", "medium"]
---

# How to Solve 4Sum

The 4Sum problem asks us to find all unique quadruplets in an array that sum to a target value. What makes this problem interesting is that it builds upon the classic Two Sum and 3Sum problems, requiring careful handling of duplicates while maintaining efficiency. The challenge lies in avoiding O(n⁴) brute force solutions while ensuring we don't miss valid combinations or include duplicates.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 0, -1, 0, -2, 2]` with `target = 0`.

First, we sort the array: `[-2, -1, 0, 0, 1, 2]`. This helps us avoid duplicates and use the two-pointer technique.

Our approach will fix two numbers first, then use two pointers to find the remaining pair:

1. Fix `i = 0` (value = -2), `j = 1` (value = -1)
   - Left pointer `left = j + 1 = 2` (value = 0)
   - Right pointer `right = n - 1 = 5` (value = 2)
   - Current sum = -2 + (-1) + 0 + 2 = -1 (too small, move left pointer)

2. With `i = 0`, `j = 1`, `left = 3` (value = 0), `right = 5` (value = 2)
   - Current sum = -2 + (-1) + 0 + 2 = -1 (too small, move left pointer)

3. With `i = 0`, `j = 1`, `left = 4` (value = 1), `right = 5` (value = 2)
   - Current sum = -2 + (-1) + 1 + 2 = 0 ✓ Found a valid quadruplet: [-2, -1, 1, 2]

We continue this process, carefully skipping duplicate values to avoid repeating the same quadruplet. For example, when we have consecutive zeros, we skip the second zero to prevent duplicate combinations.

## Brute Force Approach

The most straightforward approach is to check every possible combination of four numbers:

1. Use four nested loops to iterate through all possible quadruplets
2. Check if their sum equals the target
3. Add valid quadruplets to the result, ensuring uniqueness

<div class="code-group">

```python
# Time: O(n^4) | Space: O(k) where k is number of valid quadruplets
def fourSumBrute(nums, target):
    n = len(nums)
    result = set()

    # Check all possible quadruplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                for l in range(k + 1, n):
                    if nums[i] + nums[j] + nums[k] + nums[l] == target:
                        # Sort to handle duplicates in set
                        quadruplet = tuple(sorted([nums[i], nums[j], nums[k], nums[l]]))
                        result.add(quadruplet)

    return [list(q) for q in result]
```

```javascript
// Time: O(n^4) | Space: O(k) where k is number of valid quadruplets
function fourSumBrute(nums, target) {
  const n = nums.length;
  const resultSet = new Set();

  // Check all possible quadruplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        for (let l = k + 1; l < n; l++) {
          if (nums[i] + nums[j] + nums[k] + nums[l] === target) {
            // Sort to handle duplicates in set
            const quadruplet = [nums[i], nums[j], nums[k], nums[l]].sort((a, b) => a - b).join(",");
            resultSet.add(quadruplet);
          }
        }
      }
    }
  }

  // Convert set back to array of arrays
  return Array.from(resultSet).map((str) => str.split(",").map(Number));
}
```

```java
// Time: O(n^4) | Space: O(k) where k is number of valid quadruplets
public List<List<Integer>> fourSumBrute(int[] nums, int target) {
    Set<List<Integer>> resultSet = new HashSet<>();
    int n = nums.length;

    // Check all possible quadruplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                for (int l = k + 1; l < n; l++) {
                    if (nums[i] + nums[j] + nums[k] + nums[l] == target) {
                        List<Integer> quadruplet = Arrays.asList(nums[i], nums[j], nums[k], nums[l]);
                        Collections.sort(quadruplet);
                        resultSet.add(quadruplet);
                    }
                }
            }
        }
    }

    return new ArrayList<>(resultSet);
}
```

</div>

**Why this is insufficient:** With O(n⁴) time complexity, this approach becomes impractical for arrays with more than 50 elements. For n=200, we'd need to check 1.6 billion combinations! Additionally, using a set to handle duplicates adds overhead and doesn't scale well.

## Optimized Approach

The key insight is to reduce the problem from finding 4 numbers to finding 2 numbers after fixing the first two. Here's the step-by-step reasoning:

1. **Sort the array** - This allows us to:
   - Skip duplicates efficiently
   - Use the two-pointer technique
   - Early termination when values become too large

2. **Fix the first two numbers** - Use two nested loops for indices `i` and `j`

3. **Find the remaining pair** - For each fixed pair `(i, j)`, use two pointers (`left` and `right`) to find two numbers that complete the sum to target

4. **Skip duplicates** - After finding a valid quadruplet or when moving pointers, skip identical values to avoid duplicate results

The optimization comes from:

- Sorting (O(n log n)) is cheap compared to O(n⁴)
- Two-pointer search for the last pair is O(n) per fixed pair
- Total complexity becomes O(n³), which is feasible for n up to ~200

## Optimal Solution

Here's the optimal solution using sorting and two pointers:

<div class="code-group">

```python
# Time: O(n^3) | Space: O(1) excluding output space
def fourSum(nums, target):
    n = len(nums)
    result = []

    # Step 1: Sort the array to enable two-pointer technique and duplicate skipping
    nums.sort()

    # Step 2: Fix the first number
    for i in range(n - 3):
        # Skip duplicate values for the first number
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # Early termination: if smallest possible sum is greater than target
        if nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target:
            break

        # Early termination: if largest possible sum is less than target
        if nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target:
            continue

        # Step 3: Fix the second number
        for j in range(i + 1, n - 2):
            # Skip duplicate values for the second number
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue

            # Early termination for current i, j pair
            if nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target:
                break

            if nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target:
                continue

            # Step 4: Use two pointers to find the remaining pair
            left, right = j + 1, n - 1

            while left < right:
                current_sum = nums[i] + nums[j] + nums[left] + nums[right]

                if current_sum == target:
                    # Found a valid quadruplet
                    result.append([nums[i], nums[j], nums[left], nums[right]])

                    # Skip duplicates for left pointer
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    # Skip duplicates for right pointer
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1

                    # Move both pointers inward
                    left += 1
                    right -= 1

                elif current_sum < target:
                    # Sum is too small, move left pointer rightward
                    left += 1
                else:
                    # Sum is too large, move right pointer leftward
                    right -= 1

    return result
```

```javascript
// Time: O(n^3) | Space: O(1) excluding output space
function fourSum(nums, target) {
  const n = nums.length;
  const result = [];

  // Step 1: Sort the array to enable two-pointer technique and duplicate skipping
  nums.sort((a, b) => a - b);

  // Step 2: Fix the first number
  for (let i = 0; i < n - 3; i++) {
    // Skip duplicate values for the first number
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    // Early termination: if smallest possible sum is greater than target
    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) {
      break;
    }

    // Early termination: if largest possible sum is less than target
    if (nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) {
      continue;
    }

    // Step 3: Fix the second number
    for (let j = i + 1; j < n - 2; j++) {
      // Skip duplicate values for the second number
      if (j > i + 1 && nums[j] === nums[j - 1]) {
        continue;
      }

      // Early termination for current i, j pair
      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) {
        break;
      }

      if (nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) {
        continue;
      }

      // Step 4: Use two pointers to find the remaining pair
      let left = j + 1;
      let right = n - 1;

      while (left < right) {
        const currentSum = nums[i] + nums[j] + nums[left] + nums[right];

        if (currentSum === target) {
          // Found a valid quadruplet
          result.push([nums[i], nums[j], nums[left], nums[right]]);

          // Skip duplicates for left pointer
          while (left < right && nums[left] === nums[left + 1]) {
            left++;
          }
          // Skip duplicates for right pointer
          while (left < right && nums[right] === nums[right - 1]) {
            right--;
          }

          // Move both pointers inward
          left++;
          right--;
        } else if (currentSum < target) {
          // Sum is too small, move left pointer rightward
          left++;
        } else {
          // Sum is too large, move right pointer leftward
          right--;
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O(n^3) | Space: O(1) excluding output space
public List<List<Integer>> fourSum(int[] nums, int target) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;

    // Step 1: Sort the array to enable two-pointer technique and duplicate skipping
    Arrays.sort(nums);

    // Step 2: Fix the first number
    for (int i = 0; i < n - 3; i++) {
        // Skip duplicate values for the first number
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }

        // Early termination: if smallest possible sum is greater than target
        if ((long)nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) {
            break;
        }

        // Early termination: if largest possible sum is less than target
        if ((long)nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) {
            continue;
        }

        // Step 3: Fix the second number
        for (int j = i + 1; j < n - 2; j++) {
            // Skip duplicate values for the second number
            if (j > i + 1 && nums[j] == nums[j - 1]) {
                continue;
            }

            // Early termination for current i, j pair
            if ((long)nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) {
                break;
            }

            if ((long)nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) {
                continue;
            }

            // Step 4: Use two pointers to find the remaining pair
            int left = j + 1;
            int right = n - 1;

            while (left < right) {
                long currentSum = (long)nums[i] + nums[j] + nums[left] + nums[right];

                if (currentSum == target) {
                    // Found a valid quadruplet
                    result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));

                    // Skip duplicates for left pointer
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    // Skip duplicates for right pointer
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }

                    // Move both pointers inward
                    left++;
                    right--;

                } else if (currentSum < target) {
                    // Sum is too small, move left pointer rightward
                    left++;
                } else {
                    // Sum is too large, move right pointer leftward
                    right--;
                }
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- Sorting takes O(n log n)
- Outer loop runs O(n) times
- Inner loop runs O(n) times per outer iteration
- Two-pointer search runs O(n) per inner iteration
- Total: O(n log n) + O(n³) = O(n³)

**Space Complexity: O(1)** excluding the output storage

- We use only a constant amount of extra space for pointers and variables
- The output space is O(k) where k is the number of valid quadruplets

## Common Mistakes

1. **Forgetting to sort the array first** - Without sorting, we can't use the two-pointer technique or efficiently skip duplicates. The algorithm will either be too slow or produce duplicate results.

2. **Incorrect duplicate skipping logic** - A common error is to skip duplicates before checking if a valid quadruplet exists. You should only skip duplicates:
   - For the outer loops (i and j) before entering the inner loops
   - For the two pointers (left and right) after finding a valid quadruplet

3. **Integer overflow in large sums** - When dealing with large numbers, sums can exceed integer limits. Always use 64-bit integers (long in Java, no issue in Python) for intermediate calculations, especially in early termination checks.

4. **Missing early termination conditions** - Without early termination, the algorithm still works but is less efficient. Remember to check:
   - If the smallest possible sum with current i is greater than target
   - If the largest possible sum with current i is less than target
   - Similar checks for the current (i, j) pair

## When You'll See This Pattern

This "k-Sum" pattern appears in several variations:

1. **Two Sum (Easy)** - The simplest version, often solved with hash maps
2. **3Sum (Medium)** - Similar to 4Sum but with one fixed number and two-pointer search
3. **4Sum II (Medium)** - Different approach using hash maps to count pairs
4. **k-Sum problems** - Generalization where you need to find k numbers summing to target

The core technique of reducing a k-Sum problem to a 2-Sum problem (using sorting and two pointers) is applicable whenever k > 2 and the array can be sorted.

## Key Takeaways

1. **Reduce complex problems to simpler ones** - 4Sum reduces to finding pairs (2-Sum) after fixing two numbers. This "fix and search" pattern is powerful for combinatorial problems.

2. **Sorting enables efficiency** - While sorting adds O(n log n) overhead, it enables O(n) two-pointer searches and O(1) duplicate skipping, which is crucial for beating brute force solutions.

3. **Early termination matters** - In interview settings, mentioning and implementing early termination shows you're thinking about optimization beyond just the big-O complexity.

Related problems: [Two Sum](/problem/two-sum), [3Sum](/problem/3sum), [4Sum II](/problem/4sum-ii)
