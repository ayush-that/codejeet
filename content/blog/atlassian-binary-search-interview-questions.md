---
title: "Binary Search Questions at Atlassian: What to Expect"
description: "Prepare for Binary Search interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-22"
category: "dsa-patterns"
tags: ["atlassian", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Atlassian

Atlassian's product suite — Jira, Confluence, Bitbucket — handles massive datasets: issue tracking, code repositories, and collaborative documents. Efficient search through sorted data isn't just an algorithmic curiosity; it's a daily engineering requirement. When you're filtering thousands of Jira tickets or searching through version history, O(log n) operations make the difference between a responsive interface and a sluggish one.

With 7 Binary Search questions out of 62 total in their tagged problems, Binary Search represents about 11% of their algorithmic focus. In real interviews, you're more likely to encounter it in phone screens and technical rounds than in system design discussions. Atlassian interviewers don't just test whether you can implement textbook binary search; they test whether you can recognize when a problem reduces to a search space that can be halved — even when the "array" isn't obvious.

## Specific Patterns Atlassian Favors

Atlassian's Binary Search problems tend to fall into two distinct categories:

1. **Search in Modified Sorted Arrays**: Problems where the sorted array has been rotated, has duplicates, or has some other twist that requires careful boundary handling. They love testing your ability to handle edge cases in what appears to be standard sorted data.

2. **Binary Search on Answer (Predicate Search)**: This is their favorite pattern by far. Instead of searching for a specific element in an array, you're searching for the minimum or maximum value that satisfies a certain condition. The "array" becomes a conceptual search space (like time, distance, or capacity), and you need to design a predicate function that's monotonic.

A classic example is **Koko Eating Bananas (LeetCode #875)**. You're not searching an array; you're searching for the minimum eating speed. The predicate is "can Koko eat all bananas within H hours at speed K?" This pattern appears repeatedly in Atlassian problems because it mirrors real engineering decisions: "What's the minimum server capacity needed?" or "What's the maximum latency we can tolerate?"

## How to Prepare

The key to Atlassian's Binary Search questions is mastering the predicate pattern. Let's implement the core template they expect to see:

<div class="code-group">

```python
def binary_search_predicate(condition, low, high):
    """
    Generalized binary search for minimum value satisfying condition.
    Condition must be monotonic: False, False, ..., True, True
    Returns the first value where condition becomes True
    """
    while low < high:
        mid = low + (high - low) // 2  # Avoid overflow, standard in interviews

        if condition(mid):
            high = mid  # Search left half (including mid)
        else:
            low = mid + 1  # Search right half (excluding mid)

    return low  # low == high, first True value

# Example: Koko Eating Bananas
def minEatingSpeed(piles, h):
    def can_eat(speed):
        hours = 0
        for bananas in piles:
            hours += (bananas + speed - 1) // speed  # Ceiling division
            if hours > h:
                return False
        return True

    low, high = 1, max(piles)
    return binary_search_predicate(can_eat, low, high)

# Time: O(n log m) where n = len(piles), m = max(pile)
# Space: O(1) excluding input storage
```

```javascript
function binarySearchPredicate(condition, low, high) {
  // Generalized binary search for minimum value satisfying condition
  while (low < high) {
    const mid = Math.floor(low + (high - low) / 2);

    if (condition(mid)) {
      high = mid; // Search left half (including mid)
    } else {
      low = mid + 1; // Search right half (excluding mid)
    }
  }

  return low; // low === high, first True value
}

// Example: Koko Eating Bananas
function minEatingSpeed(piles, h) {
  const canEat = (speed) => {
    let hours = 0;
    for (const bananas of piles) {
      hours += Math.ceil(bananas / speed);
      if (hours > h) return false;
    }
    return true;
  };

  let low = 1;
  let high = Math.max(...piles);
  return binarySearchPredicate(canEat, low, high);
}

// Time: O(n log m) where n = piles.length, m = max(pile)
// Space: O(1)
```

```java
public class BinarySearchPredicate {
    // Generalized binary search for minimum value satisfying condition
    public static int binarySearchPredicate(Predicate<Integer> condition, int low, int high) {
        while (low < high) {
            int mid = low + (high - low) / 2;  // Avoid overflow

            if (condition.test(mid)) {
                high = mid;  // Search left half (including mid)
            } else {
                low = mid + 1;  // Search right half (excluding mid)
            }
        }

        return low;  // low == high, first True value
    }

    // Example: Koko Eating Bananas
    public int minEatingSpeed(int[] piles, int h) {
        int low = 1;
        int high = Arrays.stream(piles).max().getAsInt();

        while (low < high) {
            int mid = low + (high - low) / 2;

            if (canEat(piles, h, mid)) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        return low;
    }

    private boolean canEat(int[] piles, int h, int speed) {
        long hours = 0;  // Use long to avoid overflow
        for (int bananas : piles) {
            hours += (bananas + speed - 1) / speed;  // Ceiling division
            if (hours > h) return false;
        }
        return true;
    }
}

// Time: O(n log m) where n = piles.length, m = max(pile)
// Space: O(1)
```

</div>

The second pattern to master is searching in rotated arrays. Here's the clean implementation Atlassian expects:

<div class="code-group">

```python
def search_rotated(nums, target):
    """
    Search in rotated sorted array without duplicates.
    Returns index of target or -1 if not found.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Determine which side is properly sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target in left sorted half
            else:
                left = mid + 1   # Target in right unsorted half
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target in right sorted half
            else:
                right = mid - 1  # Target in left unsorted half

    return -1

# Time: O(log n)
# Space: O(1)
```

```javascript
function searchRotated(nums, target) {
  // Search in rotated sorted array without duplicates
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) return mid;

    // Determine which side is properly sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Target in left sorted half
      } else {
        left = mid + 1; // Target in right unsorted half
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // Target in right sorted half
      } else {
        right = mid - 1; // Target in left unsorted half
      }
    }
  }

  return -1;
}

// Time: O(log n)
// Space: O(1)
```

```java
public class SearchRotated {
    public int search(int[] nums, int target) {
        // Search in rotated sorted array without duplicates
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            // Determine which side is properly sorted
            if (nums[left] <= nums[mid]) {  // Left half is sorted
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;  // Target in left sorted half
                } else {
                    left = mid + 1;   // Target in right unsorted half
                }
            } else {  // Right half is sorted
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;   // Target in right sorted half
                } else {
                    right = mid - 1;  // Target in left unsorted half
                }
            }
        }

        return -1;
    }
}

// Time: O(log n)
// Space: O(1)
```

</div>

## How Atlassian Tests Binary Search vs Other Companies

Atlassian's Binary Search questions differ from other companies in three key ways:

1. **More Applied, Less Academic**: While Google might ask about theoretical lower bounds or variations with infinite arrays, Atlassian problems almost always have a clear business context. You're optimizing resources, finding thresholds, or searching through logs.

2. **Emphasis on Correct Edge Cases**: Atlassian interviewers are notorious for testing edge cases thoroughly. In rotated array problems, they'll test with fully sorted arrays, reverse sorted arrays, and single-element arrays. They want to see you handle the "no rotation" case gracefully.

3. **Mid-Level Difficulty**: Compared to FAANG companies, Atlassian's Binary Search questions tend to be LeetCode Medium level, not Hard. However, they make up for this with follow-up questions: "How would this scale with distributed systems?" or "What metrics would you monitor for this search operation?"

## Study Order

1. **Standard Binary Search**: Master the basic algorithm first. Understand why `mid = left + (right - left) // 2` is used instead of `(left + right) // 2` (integer overflow).

2. **Search Boundaries**: Learn to find the first/last occurrence of a target. This teaches you how to adjust search boundaries when you find a match.

3. **Rotated Sorted Arrays**: Start without duplicates (LeetCode #33), then add duplicates (LeetCode #81). The duplicate version requires an extra `nums[left] == nums[mid]` check.

4. **Binary Search on Answer**: This is the conceptual leap. Practice identifying monotonic predicates and determining search space bounds.

5. **2D Matrix Search**: Search in row/column sorted matrix (LeetCode #74) and sorted matrix (LeetCode #240). These combine Binary Search with matrix traversal.

6. **Advanced Applications**: Find median of two sorted arrays (LeetCode #4) or split array largest sum (LeetCode #410). These are less common at Atlassian but good for completeness.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Search (LeetCode #704)** - The absolute basics
2. **First Bad Version (LeetCode #278)** - Finding boundary with predicate
3. **Search in Rotated Sorted Array (LeetCode #33)** - No duplicates
4. **Search in Rotated Sorted Array II (LeetCode #81)** - With duplicates
5. **Find Minimum in Rotated Sorted Array (LeetCode #153)** - Variation of rotation
6. **Koko Eating Bananas (LeetCode #875)** - Classic predicate search
7. **Capacity To Ship Packages (LeetCode #1011)** - Another predicate pattern
8. **Search a 2D Matrix (LeetCode #74)** - 2D application

After completing these, you'll have covered 90% of Atlassian's Binary Search question types. The remaining 10% are variations that combine Binary Search with other concepts, which you can tackle once the fundamentals are solid.

[Practice Binary Search at Atlassian](/company/atlassian/binary-search)
