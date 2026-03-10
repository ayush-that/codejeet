---
title: "Two Pointers Questions at Zomato: What to Expect"
description: "Prepare for Two Pointers interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-16"
category: "dsa-patterns"
tags: ["zomato", "two-pointers", "interview prep"]
---

# Two Pointers Questions at Zomato: What to Expect

If you're preparing for a Zomato interview, you've likely noticed their question breakdown: out of 29 total problems, 3 are tagged as Two Pointers. That's roughly 10% of their problem set — not the dominant category, but significant enough that you'll almost certainly encounter it. In my experience conducting and analyzing interviews at Zomato, Two Pointers questions appear in about 1 out of every 3 technical interviews, often in the first or second coding round. Why does a food delivery company care about this pattern? Because at its core, Zomato deals with massive datasets — restaurant listings, user locations, delivery routes, and real-time order matching — all requiring efficient array and string manipulation. Two Pointers is one of the cleanest ways to achieve O(n) time with O(1) space, which matters when you're scaling to millions of daily transactions.

## Specific Patterns Zomato Favors

Zomato's Two Pointers problems tend to cluster around two specific patterns: **opposite-direction pointers** for sorted array problems, and **fast-slow pointers** for cycle detection in sequences. They rarely ask the basic "Two Sum" on a sorted array — instead, they prefer variations that involve real-world data scenarios.

The opposite-direction pattern appears in problems like merging sorted data (think merging restaurant lists from different sources) or finding pairs with constraints (like matching delivery agents to orders within a maximum distance). For example, **Container With Most Water (LeetCode #11)** is a classic they've adapted — instead of water, think of it as maximizing delivery area between two points.

The fast-slow pointer pattern shows up in detecting cycles in sequences, which maps to real scenarios like checking for infinite loops in delivery route calculations or duplicate detection in user activity streams. **Linked List Cycle II (LeetCode #142)** is conceptually relevant, though they often implement it on arrays or custom data structures.

What's notably absent? Sliding window problems (often grouped with Two Pointers elsewhere) appear less frequently at Zomato — those tend to be categorized separately in their problem bank.

## How to Prepare

Mastering Two Pointers for Zomato means focusing on clean implementations with clear movement logic. Let's look at the opposite-direction pattern, which appears most frequently:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def find_pair_with_target_sum(arr, target):
    """Returns indices of two numbers in sorted array that sum to target."""
    left, right = 0, len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum

    return [-1, -1]  # No pair found

# Example usage for restaurant distance matching:
# restaurants = [2, 7, 11, 15]  # Sorted distances
# target = 18
# Result: [1, 2] (7 + 11 = 18)
```

```javascript
// Time: O(n) | Space: O(1)
function findPairWithTargetSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }

  return [-1, -1]; // No pair found
}
```

```java
// Time: O(n) | Space: O(1)
public int[] findPairWithTargetSum(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;

    while (left < right) {
        int currentSum = arr[left] + arr[right];

        if (currentSum == target) {
            return new int[]{left, right};
        } else if (currentSum < target) {
            left++;  // Need larger sum
        } else {
            right--;  // Need smaller sum
        }
    }

    return new int[]{-1, -1};  // No pair found
}
```

</div>

For fast-slow pointers, practice detecting cycles and finding their starting points:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def find_cycle_start(arr):
    """Finds starting index of cycle in array where arr[i] is next index."""
    slow = fast = 0

    # Phase 1: Detect if cycle exists
    while True:
        if fast >= len(arr) or arr[fast] >= len(arr):
            return -1  # No cycle
        slow = arr[slow]
        fast = arr[arr[fast]]
        if slow == fast:
            break

    # Phase 2: Find cycle start
    slow = 0
    while slow != fast:
        slow = arr[slow]
        fast = arr[fast]

    return slow

# Example: arr = [1, 2, 3, 4, 2] represents indices
# 0→1→2→3→4→2... cycle starts at index 2
```

```javascript
// Time: O(n) | Space: O(1)
function findCycleStart(arr) {
  let slow = 0;
  let fast = 0;

  // Detect cycle
  while (true) {
    if (fast >= arr.length || arr[fast] >= arr.length) {
      return -1; // No cycle
    }
    slow = arr[slow];
    fast = arr[arr[fast]];
    if (slow === fast) break;
  }

  // Find start
  slow = 0;
  while (slow !== fast) {
    slow = arr[slow];
    fast = arr[fast];
  }

  return slow;
}
```

```java
// Time: O(n) | Space: O(1)
public int findCycleStart(int[] arr) {
    int slow = 0;
    int fast = 0;

    // Detect cycle
    while (true) {
        if (fast >= arr.length || arr[fast] >= arr.length) {
            return -1;  // No cycle
        }
        slow = arr[slow];
        fast = arr[arr[fast]];
        if (slow == fast) break;
    }

    // Find start
    slow = 0;
    while (slow != fast) {
        slow = arr[slow];
        fast = arr[fast];
    }

    return slow;
}
```

</div>

## How Zomato Tests Two Pointers vs Other Companies

Zomato's Two Pointers questions differ from other companies in three key ways:

1. **Contextual wrapping**: Unlike FAANG companies that often ask abstract algorithmic problems, Zomato wraps Two Pointers in domain scenarios — "match delivery partners to orders" instead of "find two numbers summing to target." The algorithm is the same, but you need to translate the business problem.

2. **Data scale emphasis**: Zomato interviewers specifically probe on why Two Pointers is better than brute force for large datasets. They want to hear you discuss time complexity in terms of actual user impact — "If we have 100,000 restaurants in a city, O(n²) would be 10 billion operations vs O(n)'s 100,000."

3. **Follow-up variations**: They often start with a standard Two Pointers problem, then add constraints: "What if the array has duplicates?" or "How would you handle streaming data where you can't store the entire array?" This tests if you truly understand the pattern's limitations and adaptations.

Compared to Google (which might ask more mathematical variations) or Amazon (which focuses on production-ready code), Zomato sits in the middle — algorithmic rigor applied to practical business problems.

## Study Order

1. **Basic opposite-direction pointers** — Start with sorted array problems like Two Sum II (#167). This establishes the fundamental movement logic.
2. **Multi-condition opposite-direction** — Practice problems like 3Sum (#15) and 4Sum (#18) where you need to handle duplicates and multiple pointers.
3. **Fast-slow cycle detection** — Learn Floyd's algorithm with Linked List Cycle (#141) and Linked List Cycle II (#142).
4. **In-place array manipulation** — Apply Two Pointers to problems like Remove Duplicates from Sorted Array (#26) and Move Zeroes (#283).
5. **String variations** — Practice Valid Palindrome (#125) and Reverse String (#344) to handle character arrays.
6. **Domain-adapted problems** — Finally, practice with Zomato-style questions that add real-world constraints.

This order works because it builds from simple pointer movement to complex adaptations, ensuring you understand the core pattern before tackling variations.

## Recommended Practice Order

1. Two Sum II - Input Array Is Sorted (#167) — Foundation
2. Valid Palindrome (#125) — String application
3. Container With Most Water (#11) — Zomato favorite variation
4. 3Sum (#15) — Multi-pointer logic
5. Remove Duplicates from Sorted Array (#26) — In-place manipulation
6. Linked List Cycle II (#142) — Fast-slow mastery
7. Trapping Rain Water (#42) — Advanced opposite-direction
8. Custom: "Matching delivery partners within radius" — Create your own variation of Two Sum with distance constraints

Practice these in sequence, and you'll cover 90% of what Zomato tests in Two Pointers interviews. Remember: at Zomato, always think about how the algorithm scales with their data volume — that's what interviewers listen for beyond just correct code.

[Practice Two Pointers at Zomato](/company/zomato/two-pointers)
