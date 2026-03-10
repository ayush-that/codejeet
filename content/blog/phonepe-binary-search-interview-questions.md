---
title: "Binary Search Questions at PhonePe: What to Expect"
description: "Prepare for Binary Search interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-19"
category: "dsa-patterns"
tags: ["phonepe", "binary-search", "interview prep"]
---

## Why Binary Search Matters at PhonePe

With 14 out of 102 questions tagged as Binary Search, this algorithm represents a significant portion of PhonePe's technical interview repertoire. That's roughly 14% of their problem bank—a higher concentration than you'll find at many other companies. This isn't accidental. PhonePe, as a fintech leader handling massive transaction volumes, deals with problems where efficiency isn't just nice-to-have; it's mandatory. Think about features like searching transaction history across millions of records, finding optimal payment routing paths, or identifying fraud patterns in sorted log data. These are real-world applications where O(log n) operations make the difference between a responsive product and an unusable one.

In actual interviews, you're likely to encounter at least one Binary Search question, often disguised within what appears to be a data processing or optimization problem. Interviewers here don't just test if you can implement textbook binary search; they test if you can recognize when it applies to non-obvious scenarios. The questions tend to be medium difficulty with a twist—you'll need to adapt the standard algorithm rather than just recite it.

## Specific Patterns PhonePe Favors

PhonePe's Binary Search problems cluster around two distinct patterns that reflect their engineering needs:

**1. Searching in Modified or Rotated Arrays**
This is their most frequent pattern. They love problems where the sorted array has been manipulated—rotated, with duplicates, or with some custom ordering. This tests your ability to handle edge cases and adapt the basic algorithm. Problems like **Search in Rotated Sorted Array (#33)** and its variant with duplicates (#81) are quintessential examples. The twist is that you need to determine which half of the array is properly sorted before deciding where to search.

**2. Binary Search on Answer (Predicate Search)**
This is where PhonePe separates candidates who memorize patterns from those who understand the technique. Instead of searching for a specific element in an array, you're searching for the minimum or maximum value that satisfies a certain condition. Classic examples include **Capacity To Ship Packages Within D Days (#1011)** and **Koko Eating Bananas (#875)**. These problems model real optimization challenges: "What's the minimum capacity needed to ship within D days?" or "What's the minimum speed to eat all bananas in H hours?"

<div class="code-group">

```python
# Pattern: Binary Search on Answer (Predicate Search)
# Problem: Koko Eating Bananas (#875)
# Time: O(n * log(max(piles))) | Space: O(1)

def minEatingSpeed(piles, h):
    left, right = 1, max(piles)

    while left < right:
        mid = (left + right) // 2
        hours_needed = 0

        # Calculate total hours needed at current speed
        for bananas in piles:
            hours_needed += (bananas + mid - 1) // mid  # Ceiling division

        # Predicate: Can she finish within h hours?
        if hours_needed <= h:
            right = mid  # Try slower speed
        else:
            left = mid + 1  # Need faster speed

    return left
```

```javascript
// Pattern: Binary Search on Answer (Predicate Search)
// Problem: Koko Eating Bananas (#875)
// Time: O(n * log(max(piles))) | Space: O(1)

function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    let hoursNeeded = 0;

    // Calculate total hours needed at current speed
    for (const bananas of piles) {
      hoursNeeded += Math.ceil(bananas / mid);
    }

    // Predicate: Can she finish within h hours?
    if (hoursNeeded <= h) {
      right = mid; // Try slower speed
    } else {
      left = mid + 1; // Need faster speed
    }
  }

  return left;
}
```

```java
// Pattern: Binary Search on Answer (Predicate Search)
// Problem: Koko Eating Bananas (#875)
// Time: O(n * log(max(piles))) | Space: O(1)

public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        int hoursNeeded = 0;

        // Calculate total hours needed at current speed
        for (int bananas : piles) {
            hoursNeeded += (bananas + mid - 1) / mid;  // Ceiling division
        }

        // Predicate: Can she finish within h hours?
        if (hoursNeeded <= h) {
            right = mid;  // Try slower speed
        } else {
            left = mid + 1;  // Need faster speed
        }
    }

    return left;
}
```

</div>

## How to Prepare

Mastering Binary Search for PhonePe requires more than memorizing the algorithm. You need to develop pattern recognition for when to apply it. Here's my approach:

**First, internalize the three key variations:**

1. **Standard Binary Search**: Finding an exact element in a sorted array
2. **Finding boundaries**: First/last occurrence, floor/ceiling values
3. **Binary Search on Answer**: Searching for a minimum/maximum that satisfies a condition

**Practice the mental checklist:**

- Is the data sorted or sortable?
- Can I define a clear predicate (true/false condition)?
- Does the predicate follow a monotonic pattern (all false then all true, or vice versa)?

The most common mistake I see is candidates trying to force Binary Search where it doesn't fit. Remember: Binary Search requires a _monotonic predicate_—as you move through the search space, the condition changes from false to true (or true to false) exactly once.

<div class="code-group">

```python
# Pattern: Searching in Rotated Sorted Array
# Problem: Search in Rotated Sorted Array (#33)
# Time: O(log n) | Space: O(1)

def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Determine which half is properly sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in left half
            else:
                left = mid + 1   # Target is in right half
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in right half
            else:
                right = mid - 1  # Target is in left half

    return -1
```

```javascript
// Pattern: Searching in Rotated Sorted Array
// Problem: Search in Rotated Sorted Array (#33)
// Time: O(log n) | Space: O(1)

function search(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    // Determine which half is properly sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Target is in left half
      } else {
        left = mid + 1; // Target is in right half
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // Target is in right half
      } else {
        right = mid - 1; // Target is in left half
      }
    }
  }

  return -1;
}
```

```java
// Pattern: Searching in Rotated Sorted Array
// Problem: Search in Rotated Sorted Array (#33)
// Time: O(log n) | Space: O(1)

public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) {
            return mid;
        }

        // Determine which half is properly sorted
        if (nums[left] <= nums[mid]) {  // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;  // Target is in left half
            } else {
                left = mid + 1;   // Target is in right half
            }
        } else {  // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;   // Target is in right half
            } else {
                right = mid - 1;  // Target is in left half
            }
        }
    }

    return -1;
}
```

</div>

## How PhonePe Tests Binary Search vs Other Companies

PhonePe's Binary Search questions differ from other companies in three key ways:

**1. Less emphasis on pure algorithm knowledge, more on application**
While companies like Google might ask you to derive the algorithm mathematically, PhonePe assumes you know it and tests whether you can apply it to a business-relevant problem. Their questions often start with a scenario: "We have transaction logs sorted by timestamp..." rather than "Given a sorted array..."

**2. Constraint-heavy problems**
PhonePe problems frequently include additional constraints that mirror real systems: memory limits, time bounds, or specific edge cases like duplicate values. This tests your ability to write production-ready code, not just contest-style solutions.

**3. Integration with other concepts**
Unlike some companies that test Binary Search in isolation, PhonePe often combines it with other patterns. You might need to sort data first, or use Binary Search within a sliding window approach. This reflects their full-stack engineering culture where solutions need to work in integrated systems.

## Study Order

Follow this progression to build your Binary Search skills systematically:

1. **Standard Binary Search implementation** - Master the basic iterative approach with precise boundary handling. Understand why `mid = left + (right - left) / 2` prevents overflow.

2. **Boundary finding variations** - Practice finding the first/last occurrence, floor/ceiling values. This teaches you to handle duplicates and edge cases.

3. **Rotated array problems** - Learn to identify which half is sorted and adjust search boundaries accordingly. This builds adaptability.

4. **Binary Search on Answer** - The most important pattern for PhonePe. Start with obvious applications like square root calculation before moving to optimization problems.

5. **Multi-dimensional Binary Search** - Practice searching in 2D matrices (rows and columns sorted). This occasionally appears in PhonePe interviews for matrix-related data.

6. **Integration problems** - Combine Binary Search with other patterns like prefix sums or sliding windows.

This order works because each step builds on the previous one while increasing complexity. You can't effectively solve rotated array problems without mastering boundary conditions, and you can't handle Binary Search on Answer without understanding how to define and test predicates.

## Recommended Practice Order

Solve these problems in sequence to build the exact skills PhonePe tests:

1. **Binary Search (#704)** - The absolute foundation
2. **First Bad Version (#278)** - Boundary finding variation
3. **Search Insert Position (#35)** - Another boundary variation
4. **Find First and Last Position of Element in Sorted Array (#34)** - Full boundary mastery
5. **Search in Rotated Sorted Array (#33)** - PhonePe's favorite pattern
6. **Search in Rotated Sorted Array II (#81)** - With duplicates (PhonePe loves this)
7. **Find Minimum in Rotated Sorted Array (#153)** - Understanding rotation
8. **Capacity To Ship Packages Within D Days (#1011)** - Binary Search on Answer
9. **Koko Eating Bananas (#875)** - Another optimization problem
10. **Split Array Largest Sum (#410)** - Challenging optimization (if you have time)

This sequence takes you from basic implementation through PhonePe's core patterns to their more challenging problems. Spend extra time on #33, #81, #1011, and #875—these represent the patterns you're most likely to see.

[Practice Binary Search at PhonePe](/company/phonepe/binary-search)
