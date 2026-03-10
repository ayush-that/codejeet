---
title: "How to Solve Check If N and Its Double Exist — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If N and Its Double Exist. Easy difficulty, 41.7% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Sorting."
date: "2027-02-28"
category: "dsa-patterns"
tags: ["check-if-n-and-its-double-exist", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve "Check If N and Its Double Exist"

This problem asks us to determine whether an array contains two elements where one is exactly double the other. The challenge lies in efficiently checking all possible pairs while handling edge cases like zeros and negative numbers. What makes this interesting is that we need to check both directions: for each number, we need to see if either its double or its half exists elsewhere in the array.

## Visual Walkthrough

Let's trace through an example: `arr = [10, 2, 5, 3]`

We want to find if there exist indices `i` and `j` where `arr[i] = 2 * arr[j]`.

**Step-by-step with a hash set approach:**

1. Start with an empty set to store numbers we've seen
2. Check `10`: Is `10*2=20` in the set? No. Is `10/2=5` in the set? No. Add `10` to set → `{10}`
3. Check `2`: Is `2*2=4` in the set? No. Is `2/2=1` in the set? No. Add `2` to set → `{10, 2}`
4. Check `5`: Is `5*2=10` in the set? **Yes!** `10` exists. We found a pair: `5` and `10` (since `10 = 2 * 5`)

We can stop here because we found a valid pair. The key insight is that by storing numbers as we iterate, we can check both forward (current number's double) and backward (current number's half) relationships efficiently.

## Brute Force Approach

The most straightforward solution is to check every possible pair of indices:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def checkIfExist(arr):
    n = len(arr)
    # Check every possible pair (i, j)
    for i in range(n):
        for j in range(n):
            # Ensure i != j and arr[i] == 2 * arr[j]
            if i != j and arr[i] == 2 * arr[j]:
                return True
    return False
```

```javascript
// Time: O(n²) | Space: O(1)
function checkIfExist(arr) {
  const n = arr.length;
  // Check every possible pair (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Ensure i != j and arr[i] == 2 * arr[j]
      if (i !== j && arr[i] === 2 * arr[j]) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n²) | Space: O(1)
public boolean checkIfExist(int[] arr) {
    int n = arr.length;
    // Check every possible pair (i, j)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // Ensure i != j and arr[i] == 2 * arr[j]
            if (i != j && arr[i] == 2 * arr[j]) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

**Why this isn't optimal:** With nested loops, we have O(n²) time complexity. For an array of 10,000 elements, that's 100 million operations. While this works for small inputs, it's too slow for larger arrays. We need a solution that avoids checking every pair explicitly.

## Optimal Solution

We can solve this in O(n) time using a hash set. The key insight is that for each number `x`, we need to check if either `2*x` or `x/2` exists in the array. By storing numbers as we iterate, we can perform these checks in constant time.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def checkIfExist(arr):
    # Use a set to store numbers we've seen so far
    seen = set()

    # Iterate through each number in the array
    for num in arr:
        # Check if either condition is satisfied:
        # 1. We've seen a number that is double the current number
        # 2. We've seen a number that is half of the current number
        # Note: We check num*2 first, then check num/2 if num is even
        if (num * 2 in seen) or (num % 2 == 0 and num // 2 in seen):
            return True

        # Add current number to the set for future checks
        seen.add(num)

    # If we finish the loop without finding a pair, return False
    return False
```

```javascript
// Time: O(n) | Space: O(n)
function checkIfExist(arr) {
  // Use a Set to store numbers we've seen so far
  const seen = new Set();

  // Iterate through each number in the array
  for (const num of arr) {
    // Check if either condition is satisfied:
    // 1. We've seen a number that is double the current number
    // 2. We've seen a number that is half of the current number
    // Note: We check num*2 first, then check num/2 if num is even
    if (seen.has(num * 2) || (num % 2 === 0 && seen.has(num / 2))) {
      return true;
    }

    // Add current number to the set for future checks
    seen.add(num);
  }

  // If we finish the loop without finding a pair, return false
  return false;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean checkIfExist(int[] arr) {
    // Use a HashSet to store numbers we've seen so far
    Set<Integer> seen = new HashSet<>();

    // Iterate through each number in the array
    for (int num : arr) {
        // Check if either condition is satisfied:
        // 1. We've seen a number that is double the current number
        // 2. We've seen a number that is half of the current number
        // Note: We check num*2 first, then check num/2 if num is even
        if (seen.contains(num * 2) || (num % 2 == 0 && seen.contains(num / 2))) {
            return true;
        }

        // Add current number to the set for future checks
        seen.add(num);
    }

    // If we finish the loop without finding a pair, return false
    return false;
}
```

</div>

**Why this works:** For each number, we check if its complement (either double or half) already exists in our set. We add numbers to the set _after_ checking, which ensures we don't match a number with itself. The check for `num % 2 == 0` before checking `num / 2` is crucial because we can only have `num/2` as an integer if `num` is even.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once: O(n)
- Each set operation (add and contains) is O(1) on average
- Total: O(n) operations

**Space Complexity: O(n)**

- In the worst case, we store all `n` elements in the hash set
- This occurs when no pair is found, or when the pair is found at the very end

The hash set approach gives us the best possible time complexity for this problem since we must examine each element at least once.

## Common Mistakes

1. **Forgetting to check both directions**: Some candidates only check if `2*num` exists in the set, forgetting that `num` might be the double of a previously seen number. Always check both `num*2` and `num/2` (when `num` is even).

2. **Not handling the even check for division**: When checking `num/2`, you must ensure `num` is even first. Otherwise, `num/2` might not be an integer, and you'd be looking for a non-integer value in an integer array.

3. **Matching a number with itself**: If you add the number to the set before checking, you might incorrectly match a number with itself. For example, with `arr = [0]`, if you add `0` to the set first, then check `0*2 in seen`, you'll get `True` even though there's only one zero. Always check before adding.

4. **Overcomplicating with sorting and binary search**: While sorting and using binary search gives O(n log n) time, it's more complex to implement correctly and offers no advantage over the O(n) hash set solution. The hash set approach is simpler and faster.

## When You'll See This Pattern

This "complement checking" pattern with hash sets appears in many array problems:

1. **Two Sum (LeetCode #1)**: Find two numbers that add up to a target. Store numbers in a hash map as you iterate, checking if `target - current` exists.

2. **Contains Duplicate (LeetCode #217)**: Check if any value appears at least twice. Use a hash set to track seen elements.

3. **Keep Multiplying Found Values by Two (LeetCode #2154)**: This is essentially a variation of our problem where you repeatedly check if double of current number exists.

The core pattern is: when you need to find a relationship between elements (sum, difference, multiple), store elements as you process them to enable O(1) lookups for complements.

## Key Takeaways

1. **Hash sets enable O(1) membership checks**: When you need to quickly check if a value exists in a collection, hash sets are often the right choice.

2. **Check complements in both directions**: For multiplicative relationships, remember to check both `num*2` and `num/2` (with proper evenness check).

3. **Add after checking to avoid self-matching**: When using a "seen so far" approach, always check for complements before adding the current element to avoid matching an element with itself.

This problem teaches the important interview skill of recognizing when a hash-based approach can transform an O(n²) brute force solution into an O(n) optimal solution.

Related problems: [Keep Multiplying Found Values by Two](/problem/keep-multiplying-found-values-by-two)
