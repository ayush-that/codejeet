---
title: "How to Solve Number of Students Unable to Eat Lunch — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Students Unable to Eat Lunch. Easy difficulty, 79.4% acceptance rate. Topics: Array, Stack, Queue, Simulation."
date: "2027-09-22"
category: "dsa-patterns"
tags: ["number-of-students-unable-to-eat-lunch", "array", "stack", "queue", "easy"]
---

# How to Solve Number of Students Unable to Eat Lunch

This problem simulates a lunch queue where students have sandwich preferences and sandwiches are stacked. The challenge is determining how many students will leave hungry when the available sandwich at the front doesn't match the preference of the student at the front of the line. What makes this interesting is that students can cycle to the back of the queue, creating a potential infinite loop scenario that needs careful termination detection.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- Students: `[1,1,0,0]` (1 = square sandwich preference, 0 = circular)
- Sandwiches: `[0,1,0,1]` (0 = circular sandwich, 1 = square)

**Step-by-step simulation:**

1. **Initial state:**  
   Queue: [1, 1, 0, 0]  
   Stack: [0, 1, 0, 1] (top is 0)

2. **First student (1)** vs **top sandwich (0)**:  
   Mismatch! Student prefers square (1) but top sandwich is circular (0).  
   Student moves to back of queue: [1, 0, 0, 1]  
   Sandwiches unchanged: [0, 1, 0, 1]

3. **Second student (1)** vs **top sandwich (0)**:  
   Mismatch again! Student prefers square (1) but top sandwich is circular (0).  
   Student moves to back: [0, 0, 1, 1]  
   Sandwiches unchanged: [0, 1, 0, 1]

4. **Third student (0)** vs **top sandwich (0)**:  
   Match! Student takes the circular sandwich.  
   Queue: [0, 1, 1]  
   Sandwiches: [1, 0, 1] (top is now 1)

5. **Fourth student (0)** vs **top sandwich (1)**:  
   Mismatch! Student prefers circular (0) but top sandwich is square (1).  
   Student moves to back: [1, 1, 0]  
   Sandwiches unchanged: [1, 0, 1]

6. **Fifth student (1)** vs **top sandwich (1)**:  
   Match! Student takes the square sandwich.  
   Queue: [1, 0]  
   Sandwiches: [0, 1] (top is now 0)

7. **Sixth student (1)** vs **top sandwich (0)**:  
   Mismatch! Student moves to back: [0, 1]  
   Sandwiches unchanged: [0, 1]

8. **Seventh student (0)** vs **top sandwich (0)**:  
   Match! Student takes the circular sandwich.  
   Queue: [1]  
   Sandwiches: [1] (top is now 1)

9. **Eighth student (1)** vs **top sandwich (1)**:  
   Match! Student takes the square sandwich.  
   Queue: []  
   Sandwiches: []

**Result:** All students got sandwiches, so answer is 0.

The key insight: When no student in the queue wants the top sandwich, we've reached a deadlock and the remaining students will go hungry.

## Brute Force Approach

A naive approach would be to literally simulate the entire process: repeatedly check if the front student wants the top sandwich, and if not, move them to the back. We'd need a termination condition to avoid infinite loops.

The brute force simulation works like this:

1. Convert students to a queue (list) and sandwiches to a stack (list)
2. While there are students in the queue:
   - Check if front student matches top sandwich
   - If yes: remove both
   - If no: move student to back
   - Track how many consecutive mismatches occur
   - If consecutive mismatches equals queue length, we have deadlock

While this approach is correct, it can be inefficient in the worst case. Consider when all students prefer one type of sandwich but the top sandwich is the other type. Students would keep cycling indefinitely until we detect the deadlock. The simulation could take O(n²) time in pathological cases where we process each student many times before detecting the deadlock.

## Optimal Solution

The optimal insight is that we don't need to simulate the entire queue rotation. We can count how many students prefer each sandwich type and process sandwiches in order. When we encounter a sandwich that no remaining student wants, we've found our answer.

**Key observation:** Once a sandwich reaches the top of the stack, if no student in the current queue wants it, then NO student will ever want it (because students only cycle within the queue, they don't change preferences). This means we can stop processing as soon as we encounter a sandwich with zero demand from remaining students.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countStudents(students, sandwiches):
    """
    Counts how many students will be unable to eat lunch.

    Args:
        students: List[int] - Student preferences (0=circular, 1=square)
        sandwiches: List[int] - Sandwich stack (0=circular, 1=square)

    Returns:
        int - Number of students unable to eat
    """
    # Count how many students prefer each type of sandwich
    # This is more efficient than simulating the entire queue
    count = [0, 0]
    for student in students:
        count[student] += 1

    # Process sandwiches in order (from top of stack)
    for sandwich in sandwiches:
        # If no student wants this sandwich type, we've reached deadlock
        if count[sandwich] == 0:
            break

        # A student takes this sandwich
        count[sandwich] -= 1

    # Remaining students are those who couldn't eat
    return count[0] + count[1]
```

```javascript
// Time: O(n) | Space: O(1)
function countStudents(students, sandwiches) {
  /**
   * Counts how many students will be unable to eat lunch.
   *
   * @param {number[]} students - Student preferences (0=circular, 1=square)
   * @param {number[]} sandwiches - Sandwich stack (0=circular, 1=square)
   * @return {number} - Number of students unable to eat
   */

  // Count how many students prefer each type of sandwich
  const count = [0, 0];
  for (const student of students) {
    count[student]++;
  }

  // Process sandwiches in order (from top of stack)
  for (const sandwich of sandwiches) {
    // If no student wants this sandwich type, we've reached deadlock
    if (count[sandwich] === 0) {
      break;
    }

    // A student takes this sandwich
    count[sandwich]--;
  }

  // Remaining students are those who couldn't eat
  return count[0] + count[1];
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countStudents(int[] students, int[] sandwiches) {
        /**
         * Counts how many students will be unable to eat lunch.
         *
         * @param students - Student preferences (0=circular, 1=square)
         * @param sandwiches - Sandwich stack (0=circular, 1=square)
         * @return Number of students unable to eat
         */

        // Count how many students prefer each type of sandwich
        int[] count = new int[2]; // index 0 for circular, 1 for square
        for (int student : students) {
            count[student]++;
        }

        // Process sandwiches in order (from top of stack)
        for (int sandwich : sandwiches) {
            // If no student wants this sandwich type, we've reached deadlock
            if (count[sandwich] == 0) {
                break;
            }

            // A student takes this sandwich
            count[sandwich]--;
        }

        // Remaining students are those who couldn't eat
        return count[0] + count[1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting student preferences takes O(n) where n is the number of students
- Processing sandwiches takes O(n) in the worst case
- Overall linear time complexity

**Space Complexity: O(1)**

- We only use a fixed-size array of length 2 to count preferences
- No additional data structures that grow with input size

## Common Mistakes

1. **Infinite loop in simulation approach:** Without proper termination detection, simulating the queue rotation can run forever. Always track when you've made a full cycle without anyone taking a sandwich.

2. **Wrong data structure choice:** Using a list for the student queue and removing from the front (pop(0)) gives O(n) time per operation. Better to use collections.deque in Python or LinkedList in Java for O(1) operations.

3. **Forgetting to handle empty inputs:** While the problem states arrays are non-empty, in interviews you should mention edge cases. What if students or sandwiches is empty? (Answer would be 0 students unable to eat).

4. **Overcomplicating with full simulation:** Many candidates jump into queue simulation without realizing the counting solution is simpler and more efficient. Always look for patterns that avoid unnecessary operations.

## When You'll See This Pattern

This problem uses a **counting/aggregation** pattern where instead of simulating a process step-by-step, we can reason about the overall state using counts. This is common in problems where individual elements have types or categories.

**Related problems:**

1. **Time Needed to Buy Tickets (Easy)** - Similar queue simulation problem where people cycle through a line, but here we can also use counting/aggregation to find the solution more efficiently than full simulation.

2. **Task Scheduler (Medium)** - Uses counting of task frequencies to determine minimum intervals, similar to how we count sandwich preferences here.

3. **Find All Anagrams in a String (Medium)** - Uses frequency counting of characters in a sliding window, which is a more advanced application of the counting pattern.

## Key Takeaways

1. **Look for aggregation opportunities:** When dealing with categorical data (like sandwich preferences), counting frequencies often provides a more efficient solution than simulating individual interactions.

2. **Identify deadlock conditions early:** The key insight was recognizing that if no one wants the current sandwich, the process stops. Look for similar termination conditions in simulation problems.

3. **Queue simulation vs. counting:** When a problem involves queues and preferences, consider whether you need to simulate the actual queue rotation or if you can deduce the answer from aggregate statistics.

Related problems: [Time Needed to Buy Tickets](/problem/time-needed-to-buy-tickets)
