---
title: "How to Solve Average Waiting Time — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Average Waiting Time. Medium difficulty, 73.1% acceptance rate. Topics: Array, Simulation."
date: "2028-07-31"
category: "dsa-patterns"
tags: ["average-waiting-time", "array", "simulation", "medium"]
---

# How to Solve Average Waiting Time

This problem simulates a single-chef restaurant where customers arrive at specific times with known preparation durations. The challenge is calculating the average waiting time when customers may need to wait for previous orders to complete. What makes this interesting is that while arrival times are sorted, we must track the chef's availability over time, making this a classic scheduling simulation problem.

## Visual Walkthrough

Let's trace through an example: `customers = [[1,2], [2,5], [4,3]]`

**Customer 1** (arrives at time 1, needs 2 minutes):

- Chef is available immediately (time 1)
- Start cooking at time 1
- Finish at time 1 + 2 = 3
- Waiting time = finish time - arrival = 3 - 1 = 2

**Customer 2** (arrives at time 2, needs 5 minutes):

- Chef finishes previous order at time 3
- Customer arrives at time 2, but chef is busy until time 3
- Start cooking at max(arrival, chef's available time) = max(2, 3) = 3
- Finish at time 3 + 5 = 8
- Waiting time = 8 - 2 = 6

**Customer 3** (arrives at time 4, needs 3 minutes):

- Chef finishes previous order at time 8
- Customer arrives at time 4, but chef is busy until time 8
- Start cooking at max(4, 8) = 8
- Finish at time 8 + 3 = 11
- Waiting time = 11 - 4 = 7

**Total waiting time** = 2 + 6 + 7 = 15
**Average waiting time** = 15 / 3 = 5.0

The key insight: each customer's waiting time depends on when the chef becomes available, which depends on all previous customers.

## Brute Force Approach

A naive approach might try to simulate every minute of the day, but with arrival times up to 10^5 and preparation times up to 10^5, this could require simulating up to 10^10 minutes, which is clearly infeasible.

Another brute force approach would be to consider all possible customer orderings, but with n customers, there are n! permutations to check. For n=100, that's 100! possibilities - astronomically large.

The problem constraints (n ≤ 10^5) tell us we need an O(n) or O(n log n) solution. The brute force approaches fail because they either simulate unnecessary time intervals or explore too many permutations.

## Optimized Approach

The optimal solution uses a simple but clever simulation approach:

1. **Track the chef's current time** - when the chef will next be available
2. **Process customers in arrival order** (already sorted for us)
3. **For each customer**:
   - If the chef is free when customer arrives, start immediately
   - If the chef is busy, customer waits until chef is free
   - Calculate finish time = max(arrival, chef's current time) + preparation time
   - Calculate waiting time = finish time - arrival time
   - Update chef's current time to the finish time

The key insight is that we don't need to simulate every minute or consider different orderings. Since customers must be served in arrival order (first-come, first-served), we can process them sequentially, updating the chef's availability as we go.

This works because:

- Arrival times are non-decreasing, so we process customers in chronological order
- The chef can only work on one order at a time
- Each customer's start time depends only on the previous customer's finish time

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def averageWaitingTime(customers):
    """
    Calculate average waiting time for customers at a single-chef restaurant.

    Args:
        customers: List of [arrival_time, preparation_time] pairs

    Returns:
        Average waiting time as a float
    """
    # Track when the chef will next be available
    chef_available_time = 0
    total_waiting_time = 0

    for arrival, prep_time in customers:
        # Customer can start when they arrive OR when chef is free, whichever is later
        start_time = max(arrival, chef_available_time)

        # Finish time is start time plus preparation time
        finish_time = start_time + prep_time

        # Waiting time is from arrival until food is ready
        waiting_time = finish_time - arrival

        # Add to total waiting time
        total_waiting_time += waiting_time

        # Chef is now busy until this order is complete
        chef_available_time = finish_time

    # Calculate and return average
    return total_waiting_time / len(customers)
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate average waiting time for customers at a single-chef restaurant.
 * @param {number[][]} customers - Array of [arrival_time, preparation_time] pairs
 * @return {number} Average waiting time
 */
function averageWaitingTime(customers) {
  // Track when the chef will next be available
  let chefAvailableTime = 0;
  let totalWaitingTime = 0;

  for (const [arrival, prepTime] of customers) {
    // Customer can start when they arrive OR when chef is free, whichever is later
    const startTime = Math.max(arrival, chefAvailableTime);

    // Finish time is start time plus preparation time
    const finishTime = startTime + prepTime;

    // Waiting time is from arrival until food is ready
    const waitingTime = finishTime - arrival;

    // Add to total waiting time
    totalWaitingTime += waitingTime;

    // Chef is now busy until this order is complete
    chefAvailableTime = finishTime;
  }

  // Calculate and return average
  return totalWaitingTime / customers.length;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate average waiting time for customers at a single-chef restaurant.
     * @param customers 2D array of [arrival_time, preparation_time] pairs
     * @return Average waiting time as a double
     */
    public double averageWaitingTime(int[][] customers) {
        // Track when the chef will next be available
        long chefAvailableTime = 0;
        long totalWaitingTime = 0;

        for (int[] customer : customers) {
            int arrival = customer[0];
            int prepTime = customer[1];

            // Customer can start when they arrive OR when chef is free, whichever is later
            long startTime = Math.max(arrival, chefAvailableTime);

            // Finish time is start time plus preparation time
            long finishTime = startTime + prepTime;

            // Waiting time is from arrival until food is ready
            long waitingTime = finishTime - arrival;

            // Add to total waiting time
            totalWaitingTime += waitingTime;

            // Chef is now busy until this order is complete
            chefAvailableTime = finishTime;
        }

        // Calculate and return average
        return (double) totalWaitingTime / customers.length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each customer exactly once in a single pass through the array
- Each customer requires constant-time operations (max calculation, addition, subtraction)
- Total operations scale linearly with number of customers

**Space Complexity: O(1)**

- We only use a few variables to track:
  - `chef_available_time`: when chef next becomes free
  - `total_waiting_time`: running sum of waiting times
  - Loop variables for current customer
- No additional data structures that scale with input size
- Input array is given, not counted in our space usage

## Common Mistakes

1. **Forgetting to use `max()` for start time calculation**: Some candidates calculate start time as simply `chef_available_time`, forgetting that if a customer arrives after the chef is free, they should start immediately at their arrival time. Always use `max(arrival, chef_available_time)`.

2. **Incorrect waiting time calculation**: Waiting time is `finish_time - arrival_time`, NOT `finish_time - start_time`. The customer starts waiting when they arrive, not when cooking starts. This subtle difference can cost you the correct answer.

3. **Integer overflow in Java**: With up to 10^5 customers and times up to 10^5, the total waiting time can exceed 32-bit integer limits (up to ~10^10). Use `long` for accumulators in Java to avoid overflow.

4. **Dividing integers incorrectly**: In Java and some other languages, integer division truncates. Make sure to cast to `double`/`float` before division, or use floating-point variables from the start.

## When You'll See This Pattern

This "sequential simulation with state tracking" pattern appears in many scheduling and resource allocation problems:

1. **Task Scheduler (LeetCode 621)**: Similar concept of scheduling tasks with cooldown periods, tracking when resources become available.

2. **Car Fleet (LeetCode 853)**: Vehicles catching up to each other based on speed, similar to tracking when one task "finishes" relative to others.

3. **Meeting Rooms II (LeetCode 253)**: Tracking resource (room) availability over time, though this typically requires sorting and priority queues.

4. **CPU Task Scheduling**: Many operating system scheduling problems use similar logic of tracking when processors become available.

The core pattern is: process events in order, maintain current state (resource availability), and update state based on each event's requirements.

## Key Takeaways

1. **When you see "non-decreasing order" in the input, think sequential processing**: Sorted input often means you can solve the problem with a single pass, updating state as you go.

2. **For single-resource scheduling problems, track the resource's next available time**: This simple state variable is often sufficient to solve what seems like a complex scheduling problem.

3. **Simulation problems don't always require simulating every time unit**: Often you can "jump" to the next relevant event (customer arrival/order completion) rather than simulating each minute.

This problem teaches that sometimes the most straightforward simulation is also the most efficient. Don't overcomplicate - understand the constraints and look for the minimal state needed to track progress.

Related problems: [Average Height of Buildings in Each Segment](/problem/average-height-of-buildings-in-each-segment)
