---
title: "How to Solve Car Fleet — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Car Fleet. Medium difficulty, 54.8% acceptance rate. Topics: Array, Stack, Sorting, Monotonic Stack."
date: "2027-05-30"
category: "dsa-patterns"
tags: ["car-fleet", "array", "stack", "sorting", "medium"]
---

# How to Solve Car Fleet

Imagine cars driving toward a destination at different speeds. Some faster cars will catch up to slower cars ahead of them, forming "fleets" that travel together. The tricky part is that once cars form a fleet, they can't pass each other, so we need to figure out how many distinct fleets will arrive at the destination. This problem tests your ability to think about relative motion and use sorting to simplify what seems like a complex simulation.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `target = 12`
- `position = [10, 8, 0, 5, 3]`
- `speed = [2, 4, 1, 1, 3]`

**Step 1: Pair cars with their positions and calculate time to target**
Each car's time to reach the target is: `(target - position) / speed`

Car 0: (12 - 10) / 2 = 1.0 hour  
Car 1: (12 - 8) / 4 = 1.0 hour  
Car 2: (12 - 0) / 1 = 12.0 hours  
Car 3: (12 - 5) / 1 = 7.0 hours  
Car 4: (12 - 3) / 3 = 3.0 hours

**Step 2: Sort by position (closest to target first)**
We need to process cars from closest to farthest from target:

- Car 0 at position 10, time 1.0
- Car 1 at position 8, time 1.0
- Car 3 at position 5, time 7.0
- Car 4 at position 3, time 3.0
- Car 2 at position 0, time 12.0

**Step 3: Process cars to form fleets**
We'll use a stack to track fleets:

1. Car 0 (time 1.0): Stack is empty, push → stack = [1.0]
2. Car 1 (time 1.0): Compare with top of stack (1.0). Since 1.0 ≤ 1.0, car 1 catches up to car 0 → they form a fleet. Don't push.
3. Car 3 (time 7.0): Compare with top of stack (1.0). Since 7.0 > 1.0, car 3 arrives later → new fleet. Push → stack = [1.0, 7.0]
4. Car 4 (time 3.0): Compare with top of stack (7.0). Since 3.0 ≤ 7.0, car 4 catches up to the fleet ahead → don't push.
5. Car 2 (time 12.0): Compare with top of stack (7.0). Since 12.0 > 7.0, arrives later → new fleet. Push → stack = [1.0, 7.0, 12.0]

**Result:** 3 fleets will arrive at the target.

## Brute Force Approach

A naive approach would simulate the cars moving minute by minute, checking for collisions and fleet formations. Here's what that might look like:

1. Initialize all cars at their starting positions
2. For each time unit (e.g., each hour or minute):
   - Move each car forward based on its speed
   - Check if any car catches up to the car immediately ahead of it
   - When cars collide, merge them into a fleet traveling at the slower speed
3. Continue until all cars reach the target
4. Count how many distinct fleets arrived

**Why this fails:**

- Time complexity is impractical: O(max_time × n) where max_time could be huge
- Floating point precision issues with continuous time
- Complex collision detection logic
- The problem constraints (n ≤ 10⁵) make simulation impossible

The key insight is that we don't need to simulate every moment—we can calculate when each car would reach the target if unimpeded, then work backward to see which cars catch up to others.

## Optimized Approach

The optimal solution uses this reasoning:

1. **Calculate time to target for each car**: `time = (target - position) / speed`
2. **Sort cars by position** (closest to target first): Cars ahead can block cars behind them, but not vice versa
3. **Process from closest to farthest**: Use a stack to track arrival times of fleet leaders
   - If a car's time ≤ time of the fleet ahead, it catches up and joins that fleet
   - If a car's time > time of the fleet ahead, it forms a new fleet

**Why sorting works:**
When we process cars from closest to farthest, we're essentially asking: "Will this car catch up to the fleet immediately ahead of it?" Since cars can't pass each other, we only need to compare with the immediately preceding fleet.

**Why a stack works:**
The stack stores the arrival times of fleet leaders. When a new car has a slower (larger) arrival time than the top of the stack, it becomes a new fleet leader. When it has a faster (smaller or equal) arrival time, it gets blocked by the fleet ahead.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for the stack
def carFleet(target, position, speed):
    """
    Calculate how many car fleets will arrive at the target.

    Args:
        target: Destination position
        position: List of starting positions
        speed: List of speeds for each car

    Returns:
        Number of distinct fleets that arrive
    """
    # Step 1: Create pairs of (position, speed) for each car
    cars = [(pos, sp) for pos, sp in zip(position, speed)]

    # Step 2: Sort cars by position in descending order
    # We want to process cars closest to target first
    cars.sort(key=lambda x: x[0], reverse=True)

    # Step 3: Initialize stack to store arrival times of fleet leaders
    stack = []

    # Step 4: Process each car from closest to farthest from target
    for pos, sp in cars:
        # Calculate time needed for this car to reach target
        time_to_target = (target - pos) / sp

        # Step 5: Check if this car forms a new fleet
        # If stack is empty or this car arrives AFTER the fleet ahead,
        # it forms a new fleet
        if not stack or time_to_target > stack[-1]:
            stack.append(time_to_target)
        # Otherwise, this car catches up to the fleet ahead
        # and travels with it (no need to push to stack)

    # Step 6: The number of fleets equals the size of the stack
    return len(stack)
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for the stack
function carFleet(target, position, speed) {
  /**
   * Calculate how many car fleets will arrive at the target.
   *
   * @param {number} target - Destination position
   * @param {number[]} position - Starting positions of cars
   * @param {number[]} speed - Speeds of cars
   * @return {number} - Number of distinct fleets
   */

  // Step 1: Create array of car objects with position and speed
  const cars = position.map((pos, idx) => ({
    position: pos,
    speed: speed[idx],
  }));

  // Step 2: Sort cars by position in descending order
  // Cars closest to target come first
  cars.sort((a, b) => b.position - a.position);

  // Step 3: Initialize stack for arrival times of fleet leaders
  const stack = [];

  // Step 4: Process each car from closest to farthest
  for (const car of cars) {
    // Calculate time for this car to reach target
    const timeToTarget = (target - car.position) / car.speed;

    // Step 5: Determine if this car forms a new fleet
    // If stack is empty OR this car arrives LATER than fleet ahead
    if (stack.length === 0 || timeToTarget > stack[stack.length - 1]) {
      stack.push(timeToTarget);
    }
    // If timeToTarget <= top of stack, car catches up (no push needed)
  }

  // Step 6: Number of fleets equals stack size
  return stack.length;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for the stack
import java.util.*;

class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        /**
         * Calculate how many car fleets will arrive at the target.
         *
         * @param target Destination position
         * @param position Starting positions of cars
         * @param speed Speeds of cars
         * @return Number of distinct fleets
         */

        int n = position.length;

        // Step 1: Create array of car data (position, speed)
        double[][] cars = new double[n][2];
        for (int i = 0; i < n; i++) {
            cars[i][0] = position[i];  // Store position
            cars[i][1] = speed[i];     // Store speed
        }

        // Step 2: Sort by position in descending order
        // Lambda sorts by first element (position) in reverse order
        Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));

        // Step 3: Stack to store arrival times of fleet leaders
        Stack<Double> stack = new Stack<>();

        // Step 4: Process each car from closest to farthest
        for (int i = 0; i < n; i++) {
            double pos = cars[i][0];
            double sp = cars[i][1];

            // Calculate time to reach target
            double timeToTarget = (target - pos) / sp;

            // Step 5: Check if this car forms a new fleet
            // If stack empty OR this car arrives LATER than current fleet leader
            if (stack.isEmpty() || timeToTarget > stack.peek()) {
                stack.push(timeToTarget);
            }
            // If timeToTarget <= stack.peek(), car catches up (no push)
        }

        // Step 6: Stack size equals number of fleets
        return stack.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the cars by position takes O(n log n) time
- Processing each car after sorting takes O(n) time
- Dominated by the sorting step

**Space Complexity: O(n)**

- Storing the car data (position-speed pairs) takes O(n) space
- The stack can grow up to O(n) in worst case (when no cars catch up to each other)
- Sorting may require O(log n) to O(n) additional space depending on the algorithm

## Common Mistakes

1. **Sorting in the wrong direction**: Candidates often sort by position ascending (farthest first) instead of descending (closest first). Remember: we need to process cars that are ahead first because they can block cars behind them.

2. **Comparing speeds instead of times**: The natural instinct is to compare speeds directly, but what matters is the _time to reach target_. A car with higher speed but starting much farther away might still arrive later.

3. **Floating point precision issues**: When calculating `(target - position) / speed`, use floating point division, not integer division. In Java, cast to double: `(target - pos) * 1.0 / sp`.

4. **Forgetting that fleets travel at slower speed**: When a faster car catches up to a slower one, the fleet continues at the slower car's speed. This is why we compare arrival times—if a car would arrive sooner than the car ahead, it gets blocked and arrives at the same time as the slower car.

## When You'll See This Pattern

This problem uses a **monotonic stack** pattern combined with **sorting by one property to simplify comparisons**. You'll see similar patterns in:

1. **Car Fleet II (LeetCode 1776)**: The harder version where you need to calculate collision times for each car. Uses similar relative motion concepts but with more complex data structures.

2. **Daily Temperatures (LeetCode 739)**: Uses a monotonic stack to find the next warmer temperature. The stack maintains temperatures in decreasing order, similar to how we maintain arrival times in increasing order.

3. **Next Greater Element (LeetCode 496)**: Another classic monotonic stack problem where you find the next greater element in an array.

4. **Merge Intervals (LeetCode 56)**: While not using a stack, it shares the pattern of sorting by one dimension (start time) to simplify merging overlapping intervals.

## Key Takeaways

1. **When dealing with relative motion problems**, consider calculating times to a common point rather than simulating step-by-step. This often reduces O(n²) simulations to O(n log n) calculations.

2. **Sorting by position (or time) can simplify collision detection**: By processing elements in a specific order, you only need to compare with the immediately preceding element, not all possible pairs.

3. **Monotonic stacks are perfect for "next greater/smaller" problems**: When you need to maintain elements in sorted order while processing a sequence, a monotonic stack is often the right tool.

**Related problems:** [Car Fleet II](/problem/car-fleet-ii), [Count Collisions on a Road](/problem/count-collisions-on-a-road)
