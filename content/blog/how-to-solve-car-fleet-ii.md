---
title: "How to Solve Car Fleet II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Car Fleet II. Hard difficulty, 57.8% acceptance rate. Topics: Array, Math, Stack, Heap (Priority Queue), Monotonic Stack."
date: "2029-03-13"
category: "dsa-patterns"
tags: ["car-fleet-ii", "array", "math", "stack", "hard"]
---

# How to Solve Car Fleet II

This problem asks us to determine when each car in a sequence will collide with the car in front of it, given their positions and speeds. Unlike the simpler Car Fleet problem where we only care about how many fleets reach the destination, here we need to calculate the exact collision times for each car. The tricky part is that collisions create chain reactions — when a car collides, it joins the car in front, potentially slowing down and causing more collisions behind it.

## Visual Walkthrough

Let's trace through a small example: `cars = [[1,2],[2,1],[3,3]]`

We have 3 cars:

- Car 0 at position 1, speed 2
- Car 1 at position 2, speed 1
- Car 2 at position 3, speed 3

**Step 1:** Start from the last car (car 2). It has no car in front, so it never collides. `answer[2] = -1`

**Step 2:** Move to car 1. It's behind car 2. Calculate if/when it would catch car 2:

- Relative speed: 1 - 3 = -2 (car 1 is slower, so it can't catch car 2)
- Since car 1 is slower than the car in front, it will never collide. `answer[1] = -1`

**Step 3:** Move to car 0. It's behind car 1:

- Relative speed: 2 - 1 = 1 (car 0 is faster)
- Distance gap: 2 - 1 = 1
- Time to catch car 1: 1 / 1 = 1 second
- But wait! Car 1 might collide with car 2 before 1 second passes. We need to check if car 0 would catch car 1 _before_ car 1 collides with car 2.

Actually, in this case car 1 never collides with car 2, so car 0 will collide with car 1 at time 1. `answer[0] = 1`

The key insight: when checking if car i collides with car i+1, we need to consider that car i+1 might itself collide with some car ahead of it before car i catches up.

## Brute Force Approach

A naive approach would be to simulate time forward, checking at each moment which cars collide. For each car i, we could check all cars j > i to see when/if i collides with j, considering that j might merge with cars ahead of it.

The brute force code might look like this:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def getCollisionTimes(cars):
    n = len(cars)
    answer = [-1.0] * n

    for i in range(n):
        min_time = float('inf')
        for j in range(i + 1, n):
            # Car i can only catch car j if it's faster
            if cars[i][1] > cars[j][1]:
                # Calculate time to catch car j
                time = (cars[j][0] - cars[i][0]) / (cars[i][1] - cars[j][1])

                # Check if car j collides with something before this time
                # This is the tricky part - we'd need to track collisions
                # The brute force gets very complex here
                min_time = min(min_time, time)

        if min_time != float('inf'):
            answer[i] = min_time

    return answer
```

```javascript
// Time: O(n²) | Space: O(n)
function getCollisionTimes(cars) {
  const n = cars.length;
  const answer = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    let minTime = Infinity;
    for (let j = i + 1; j < n; j++) {
      // Car i can only catch car j if it's faster
      if (cars[i][1] > cars[j][1]) {
        // Calculate time to catch car j
        const time = (cars[j][0] - cars[i][0]) / (cars[i][1] - cars[j][1]);
        minTime = Math.min(minTime, time);
      }
    }

    if (minTime !== Infinity) {
      answer[i] = minTime;
    }
  }

  return answer;
}
```

```java
// Time: O(n²) | Space: O(n)
public double[] getCollisionTimes(int[][] cars) {
    int n = cars.length;
    double[] answer = new double[n];
    Arrays.fill(answer, -1.0);

    for (int i = 0; i < n; i++) {
        double minTime = Double.MAX_VALUE;
        for (int j = i + 1; j < n; j++) {
            // Car i can only catch car j if it's faster
            if (cars[i][1] > cars[j][1]) {
                // Calculate time to catch car j
                double time = (double)(cars[j][0] - cars[i][0]) / (cars[i][1] - cars[j][1]);
                minTime = Math.min(minTime, time);
            }
        }

        if (minTime != Double.MAX_VALUE) {
            answer[i] = minTime;
        }
    }

    return answer;
}
```

</div>

**Why this fails:** This approach doesn't properly handle chain collisions. When car i catches car j, car j might have already merged with car k, meaning car i is actually catching a slower "fleet". The brute force becomes O(n²) and extremely complex to implement correctly.

## Optimized Approach

The key insight is to process cars from right to left (back to front) using a monotonic stack. Here's the reasoning:

1. **Right-to-left processing:** When we process car i, we only care about cars ahead of it (i+1, i+2, etc.). By processing from right to left, we ensure that when we check car i, we already know the fate of all cars to its right.

2. **Monotonic stack:** We maintain a stack of cars that haven't yet collided. The stack will store indices of cars in decreasing order of collision time. This is crucial because if car i collides with car stack[-1] at time t1, and car stack[-1] collides with the next car at time t2 where t2 < t1, then car i will actually collide with the fleet that forms after stack[-1] collides.

3. **Collision time formula:** For two cars (p1, s1) and (p2, s2) where car 1 is behind car 2 (p1 < p2), the collision time is:
   - `(p2 - p1) / (s1 - s2)` if s1 > s2 (faster car behind)
   - Never collides if s1 ≤ s2

4. **Stack maintenance:** For each car i:
   - While the stack has cars and either:
     a) Car i is slower than or equal to the car at top of stack (won't catch it), OR
     b) The time for i to catch stack[-1] is greater than the time for stack[-1] to collide with the car ahead of it
   - Pop from the stack (because that car will collide before i catches it)
   - If stack still has cars, calculate collision time for i with the new top
   - Push i onto stack

This approach works because we're effectively building a chain of collisions from right to left, where each car only needs to compare with the next car that hasn't yet been "absorbed" into a collision chain.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def getCollisionTimes(cars):
    n = len(cars)
    answer = [-1.0] * n  # Initialize answer array with -1 (no collision)
    stack = []  # Monotonic stack storing indices of cars

    # Process cars from right to left
    for i in range(n - 1, -1, -1):
        position_i, speed_i = cars[i]

        # While there are cars in stack and either:
        # 1. Current car is not faster than stack top (won't catch it), OR
        # 2. Time to catch stack top is greater than stack top's collision time
        while stack:
            j = stack[-1]  # Get the index of car at top of stack
            position_j, speed_j = cars[j]

            # If current car is not faster, it can never catch the car ahead
            if speed_i <= speed_j:
                stack.pop()
                continue

            # Calculate time for car i to catch car j
            catch_time = (position_j - position_i) / (speed_i - speed_j)

            # If car j has no collision (answer[j] == -1),
            # or if i catches j before j collides with something else
            if answer[j] == -1 or catch_time <= answer[j]:
                # Valid collision - store the time and break
                answer[i] = catch_time
                break
            else:
                # Car j collides with something before i can catch it
                # So i needs to check the next car in the chain
                stack.pop()

        # Add current car to stack for consideration by cars to its left
        stack.append(i)

    return answer
```

```javascript
// Time: O(n) | Space: O(n)
function getCollisionTimes(cars) {
  const n = cars.length;
  const answer = new Array(n).fill(-1);
  const stack = []; // Monotonic stack storing indices of cars

  // Process cars from right to left
  for (let i = n - 1; i >= 0; i--) {
    const [posI, speedI] = cars[i];

    // While there are cars in stack
    while (stack.length > 0) {
      const j = stack[stack.length - 1];
      const [posJ, speedJ] = cars[j];

      // If current car is not faster, it can never catch the car ahead
      if (speedI <= speedJ) {
        stack.pop();
        continue;
      }

      // Calculate time for car i to catch car j
      const catchTime = (posJ - posI) / (speedI - speedJ);

      // If car j has no collision, or if i catches j before j collides
      if (answer[j] === -1 || catchTime <= answer[j]) {
        // Valid collision
        answer[i] = catchTime;
        break;
      } else {
        // Car j collides with something before i can catch it
        stack.pop();
      }
    }

    // Add current car to stack
    stack.push(i);
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(n)
public double[] getCollisionTimes(int[][] cars) {
    int n = cars.length;
    double[] answer = new double[n];
    Arrays.fill(answer, -1.0);
    Deque<Integer> stack = new ArrayDeque<>();  // Monotonic stack storing indices

    // Process cars from right to left
    for (int i = n - 1; i >= 0; i--) {
        int positionI = cars[i][0];
        int speedI = cars[i][1];

        // While there are cars in stack
        while (!stack.isEmpty()) {
            int j = stack.peek();
            int positionJ = cars[j][0];
            int speedJ = cars[j][1];

            // If current car is not faster, it can never catch the car ahead
            if (speedI <= speedJ) {
                stack.pop();
                continue;
            }

            // Calculate time for car i to catch car j
            double catchTime = (double)(positionJ - positionI) / (speedI - speedJ);

            // If car j has no collision, or if i catches j before j collides
            if (answer[j] == -1.0 || catchTime <= answer[j]) {
                // Valid collision
                answer[i] = catchTime;
                break;
            } else {
                // Car j collides with something before i can catch it
                stack.pop();
            }
        }

        // Add current car to stack
        stack.push(i);
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
Each car is pushed onto the stack exactly once and popped at most once. Even though we have a while loop inside the for loop, the total number of operations across all iterations is O(n) because each car can only be popped once.

**Space Complexity:** O(n)  
We use O(n) space for the answer array and O(n) space for the stack in the worst case (when no cars collide).

## Common Mistakes

1. **Processing left to right instead of right to left:** When you process from left to right, you don't know what will happen to cars ahead. A car might collide before you reach it, changing the speed of the fleet you're trying to catch.

2. **Forgetting to check if the car ahead collides before you catch it:** This is the most subtle part. Even if car i is faster than car i+1, car i+1 might collide with car i+2 at time t, and if t is less than the time for i to catch i+1, then i will actually collide with the merged fleet.

3. **Not handling floating-point precision carefully:** The problem requires returning times as floating-point numbers. Be careful with division and comparisons. Using `<=` instead of `<` when comparing times matters because if two cars collide at exactly the same time a third car catches them, it's still a valid collision.

4. **Incorrect stack maintenance:** The stack should maintain cars in order of increasing collision time (from bottom to top). If you push cars without checking if they should be popped first, you'll get incorrect results.

## When You'll See This Pattern

The monotonic stack pattern with right-to-left processing appears in several problems where you need to find the "next" element satisfying some condition, especially when elements can be "eliminated" or "merged":

1. **Next Greater Element (LeetCode 496, 503):** Find the next greater element for each element in an array. The stack maintains candidates for "next greater" in decreasing order.

2. **Daily Temperatures (LeetCode 739):** For each day, find how many days until a warmer temperature. Similar stack structure but processed left-to-right.

3. **Largest Rectangle in Histogram (LeetCode 84):** Find the largest rectangle in a histogram. Uses monotonic stack to track increasing bar heights.

4. **Car Fleet I (LeetCode 853):** The easier version of this problem, where you only need to count how many fleets arrive at the destination.

## Key Takeaways

1. **When you need to consider "future" events, process backwards:** If the fate of an element depends on what happens to elements after it, processing from the end ensures you have all the information you need.

2. **Monotonic stacks are perfect for "next greater/lesser" problems:** When you need to find the next element that satisfies some condition relative to each element, a monotonic stack often provides an O(n) solution.

3. **Chain reactions can be modeled with stacks:** When elements can merge or eliminate each other (like colliding cars), a stack can efficiently track the "surviving" elements that still need to be considered.

Related problems: [Car Fleet](/problem/car-fleet), [Count Collisions on a Road](/problem/count-collisions-on-a-road)
