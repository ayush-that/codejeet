---
title: "Sorting Questions at Accenture: What to Expect"
description: "Prepare for Sorting interview questions at Accenture — patterns, difficulty breakdown, and study tips."
date: "2028-01-17"
category: "dsa-patterns"
tags: ["accenture", "sorting", "interview prep"]
---

## Why Sorting Matters at Accenture

Accenture’s technical interviews often include sorting questions not because they’re testing your ability to implement quicksort from scratch, but because sorting is a fundamental tool for solving more complex problems. With 18 sorting-related questions in their question bank (out of 144 total), sorting appears in roughly 12.5% of their problems. In real interviews, you’re more likely to encounter a problem where sorting is the _key step_ rather than the entire problem. For example, you might need to sort custom objects, use sorting to enable a two-pointer solution, or pre-process data so a greedy algorithm works. At Accenture, sorting is treated as a core building block for data manipulation and optimization—a practical skill they value for real-world consulting and development work.

## Specific Patterns Accenture Favors

Accenture’s sorting problems tend to fall into three distinct patterns:

1. **Custom Comparator Sorting**: Problems where you sort objects based on multiple criteria or non-standard rules. This tests your ability to model real business logic.
2. **Sorting as Pre-processing**: Problems where sorting transforms the problem into something simpler, often enabling a greedy or two-pointer approach.
3. **Partial Sorting / K-th Element**: Problems focused on efficiency where you don’t need the entire array sorted, just specific elements.

For example, **Meeting Rooms II (LeetCode #253)** is a classic Accenture-style problem: you sort meeting start times, then use a min-heap to track end times. Another favorite is **Largest Number (LeetCode #179)**, which requires a custom comparator to sort numbers as strings. These aren’t academic sorting exercises—they’re practical problems where sorting is the clever insight.

## How to Prepare

Master the standard sorting algorithms conceptually, but focus your practice on _applying_ sorting to solve problems. Here’s the key pattern: when you encounter a problem involving comparisons, overlapping intervals, or finding pairs/triplets, ask yourself, “Would sorting this data first unlock a simpler solution?”

Let’s look at a critical technique: the custom comparator. Many Accenture problems require sorting objects by multiple fields or custom logic.

<div class="code-group">

```python
# Example: Sort people by height descending, then by name ascending if heights are equal
# Time: O(n log n) | Space: O(1) for in-place sort, O(n) for Timsort’s worst-case
class Person:
    def __init__(self, name, height):
        self.name = name
        self.height = height

def sort_people(people):
    # Key: return a tuple where earlier elements have higher priority
    people.sort(key=lambda p: (-p.height, p.name))
    return people

# Usage
people = [Person("Alice", 170), Person("Bob", 180), Person("Charlie", 170)]
sorted_people = sort_people(people)
for p in sorted_people:
    print(f"{p.name}: {p.height}")
```

```javascript
// Example: Sort people by height descending, then by name ascending
// Time: O(n log n) | Space: O(log n) for V8's Timsort (stack space)
class Person {
  constructor(name, height) {
    this.name = name;
    this.height = height;
  }
}

function sortPeople(people) {
  return people.sort((a, b) => {
    if (a.height !== b.height) {
      return b.height - a.height; // Descending height
    }
    return a.name.localeCompare(b.name); // Ascending name
  });
}

// Usage
const people = [new Person("Alice", 170), new Person("Bob", 180), new Person("Charlie", 170)];
console.log(sortPeople(people));
```

```java
// Example: Sort people by height descending, then by name ascending
// Time: O(n log n) | Space: O(log n) for Arrays.sort() (dual-pivot quicksort)
import java.util.*;

class Person {
    String name;
    int height;

    Person(String name, int height) {
        this.name = name;
        this.height = height;
    }
}

public class Main {
    public static List<Person> sortPeople(List<Person> people) {
        people.sort((a, b) -> {
            if (a.height != b.height) {
                return Integer.compare(b.height, a.height); // Descending
            }
            return a.name.compareTo(b.name); // Ascending
        });
        return people;
    }

    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
            new Person("Alice", 170),
            new Person("Bob", 180),
            new Person("Charlie", 170)
        );
        sortPeople(people);
        for (Person p : people) {
            System.out.println(p.name + ": " + p.height);
        }
    }
}
```

</div>

Another essential pattern is using sorting to enable the two-pointer technique, common in array and string problems.

<div class="code-group">

```python
# Example: Given sorted array, find two numbers summing to target
# Time: O(n log n) for sort + O(n) for two-pointer = O(n log n) | Space: O(1)
def two_sum_sorted(nums, target):
    nums.sort()  # Pre-processing step
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []  # No solution
```

```javascript
// Example: Two-pointer after sorting
// Time: O(n log n) | Space: O(1)
function twoSumSorted(nums, target) {
  nums.sort((a, b) => a - b);
  let left = 0,
    right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}
```

```java
// Example: Two-pointer after sorting
// Time: O(n log n) | Space: O(log n) for Arrays.sort()
import java.util.Arrays;

public class Main {
    public static int[] twoSumSorted(int[] nums, int target) {
        Arrays.sort(nums);
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                return new int[]{left, right};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{};
    }
}
```

</div>

## How Accenture Tests Sorting vs Other Companies

At companies like Google or Meta, sorting problems often involve complex variations or require you to derive a sorting algorithm under constraints (e.g., “Sort this list with only comparisons between specific elements”). Accenture’s approach is more pragmatic: they test whether you recognize when sorting is the right tool for the job. Their questions are often disguised as business problems—scheduling meetings, optimizing resources, ranking items—where the sorting step is the key insight. Difficulty-wise, Accenture’s problems are usually LeetCode Medium, with fewer “trick” questions than FAANG companies. The unique aspect is their focus on readability and maintainability; they might ask you to explain your comparator logic in plain English, reflecting their consulting mindset.

## Study Order

1. **Basic Sorting Algorithms**: Understand how quicksort, mergesort, and heapsort work conceptually. You don’t need to implement them from memory, but know their time/space complexities and trade-offs.
2. **Built-in Sorting with Custom Comparators**: Learn how to sort arrays/lists of objects in your language of choice. This is the most frequently tested skill.
3. **Sorting as Pre-processing**: Practice problems where sorting the input first simplifies the problem (e.g., two-sum, interval merging).
4. **Partial Sorting and Quickselect**: Study algorithms like quickselect for finding the k-th largest element without fully sorting.
5. **Advanced Applications**: Tackle problems where sorting is combined with other structures (heaps, hash maps) for optimal solutions.

This order works because it builds from foundational knowledge to application. You can’t effectively use sorting as a tool if you don’t understand its cost and behavior.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1. **Sort Colors (LeetCode #75)** – Basic in-place sorting (Dutch flag problem).
2. **Meeting Rooms (LeetCode #252)** – Simple interval sorting with one comparator.
3. **Kth Largest Element in an Array (LeetCode #215)** – Partial sorting with quickselect or heap.
4. **Merge Intervals (LeetCode #56)** – Sorting enables linear merging.
5. **Non-overlapping Intervals (LeetCode #435)** – Greedy choice after sorting.
6. **Largest Number (LeetCode #179)** – Custom comparator challenge.
7. **Meeting Rooms II (LeetCode #253)** – Sorting plus heap usage.

This progression moves from basic sorting to increasingly complex applications, ensuring you internalize the patterns.

[Practice Sorting at Accenture](/company/accenture/sorting)
