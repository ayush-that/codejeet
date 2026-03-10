---
title: "How to Solve Corporate Flight Bookings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Corporate Flight Bookings. Medium difficulty, 66.5% acceptance rate. Topics: Array, Prefix Sum."
date: "2027-06-18"
category: "dsa-patterns"
tags: ["corporate-flight-bookings", "array", "prefix-sum", "medium"]
---

# How to Solve Corporate Flight Bookings

You're given `n` flights numbered 1 to `n` and a list of bookings where each booking reserves seats on a range of flights. Your task is to return an array showing how many seats are booked on each flight. What makes this problem interesting is that a naive approach would be too slow for large inputs, but there's a clever optimization using **prefix sums** that solves it efficiently. The key insight is recognizing that booking seats on a range is similar to adding a value to a subarray, which can be optimized with difference arrays.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `n = 5`, `bookings = [[1,2,10],[2,3,20],[2,5,25]]`

We need to calculate how many seats are booked on flights 1 through 5.

**Step-by-step thinking:**

1. **Initial state:** All flights have 0 seats booked: `[0, 0, 0, 0, 0]`

2. **First booking [1,2,10]:** Add 10 seats to flights 1 and 2
   - Flight 1: +10 → `[10, 0, 0, 0, 0]`
   - Flight 2: +10 → `[10, 10, 0, 0, 0]`

3. **Second booking [2,3,20]:** Add 20 seats to flights 2 and 3
   - Flight 2: +20 → `[10, 30, 0, 0, 0]`
   - Flight 3: +20 → `[10, 30, 20, 0, 0]`

4. **Third booking [2,5,25]:** Add 25 seats to flights 2 through 5
   - Flight 2: +25 → `[10, 55, 20, 0, 0]`
   - Flight 3: +25 → `[10, 55, 45, 0, 0]`
   - Flight 4: +25 → `[10, 55, 45, 25, 0]`
   - Flight 5: +25 → `[10, 55, 45, 25, 25]`

**Final result:** `[10, 55, 45, 25, 25]`

The naive approach above processes each booking individually, updating every flight in the range. For `m` bookings and average range length `k`, this takes O(m×k) time. When `n` and `m` are large (up to 20,000 in constraints), this becomes too slow.

## Brute Force Approach

The most straightforward solution is to simulate exactly what the problem describes: for each booking, iterate through the flight range and add the seats to each flight.

**Why it's insufficient:**

- Time complexity: O(m×k) where `m` is number of bookings and `k` is average range length
- In worst case, each booking could cover all `n` flights, giving O(m×n) time
- With constraints up to 20,000 flights and bookings, this could mean 400 million operations
- The problem is designed to fail with this approach for large inputs

<div class="code-group">

```python
# Time: O(m * k) where k is average range length | Space: O(n)
def corpFlightBookings_brute(bookings, n):
    """
    Brute force approach - too slow for large inputs
    """
    # Initialize result array with zeros
    result = [0] * n

    # Process each booking
    for first, last, seats in bookings:
        # Convert to 0-based indexing
        start = first - 1
        end = last - 1

        # Add seats to each flight in the range
        for i in range(start, end + 1):
            result[i] += seats

    return result
```

```javascript
// Time: O(m * k) where k is average range length | Space: O(n)
function corpFlightBookingsBrute(bookings, n) {
  /**
   * Brute force approach - too slow for large inputs
   */
  // Initialize result array with zeros
  const result = new Array(n).fill(0);

  // Process each booking
  for (const [first, last, seats] of bookings) {
    // Convert to 0-based indexing
    const start = first - 1;
    const end = last - 1;

    // Add seats to each flight in the range
    for (let i = start; i <= end; i++) {
      result[i] += seats;
    }
  }

  return result;
}
```

```java
// Time: O(m * k) where k is average range length | Space: O(n)
public int[] corpFlightBookingsBrute(int[][] bookings, int n) {
    /**
     * Brute force approach - too slow for large inputs
     */
    // Initialize result array with zeros
    int[] result = new int[n];

    // Process each booking
    for (int[] booking : bookings) {
        int first = booking[0];
        int last = booking[1];
        int seats = booking[2];

        // Convert to 0-based indexing
        int start = first - 1;
        int end = last - 1;

        // Add seats to each flight in the range
        for (int i = start; i <= end; i++) {
            result[i] += seats;
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is recognizing this as a **range update problem**. When we need to add a value to a range many times, we can use a **difference array** technique:

1. **Difference array concept:** Instead of updating every element in a range, we mark where the range starts and ends
2. **How it works:**
   - To add `seats` to range `[first, last]`, we:
     - Add `seats` at index `first` (marks the start of the increase)
     - Subtract `seats` at index `last + 1` (marks where the increase ends)
   - After processing all bookings, we compute the prefix sum to get the actual values
3. **Why it's efficient:** Each booking takes O(1) time to process, regardless of range length
4. **Step-by-step for our example:**
   - Initialize diff array: `[0, 0, 0, 0, 0, 0]` (size n+1 to handle last+1)
   - Booking [1,2,10]: diff[1] += 10, diff[3] -= 10 → `[0, 10, 0, -10, 0, 0]`
   - Booking [2,3,20]: diff[2] += 20, diff[4] -= 20 → `[0, 10, 20, -10, -20, 0]`
   - Booking [2,5,25]: diff[2] += 25, diff[6] -= 25 → `[0, 10, 45, -10, -20, 0, -25]`
   - Compute prefix sum (ignoring index 0):
     - Flight 1: 10
     - Flight 2: 10 + 45 = 55
     - Flight 3: 55 + (-10) = 45
     - Flight 4: 45 + (-20) = 25
     - Flight 5: 25 + 0 = 25

## Optimal Solution

Here's the complete implementation using the difference array technique:

<div class="code-group">

```python
# Time: O(m + n) | Space: O(n)
def corpFlightBookings(bookings, n):
    """
    Optimal solution using difference array technique

    The key insight: Instead of updating every flight in a range for each booking,
    we mark where ranges start and end, then compute the final result using prefix sums.

    For each booking [first, last, seats]:
    - Add seats at index first (1-based) to mark range start
    - Subtract seats at index last+1 (1-based) to mark range end

    After processing all bookings, compute prefix sum to get actual seat counts.
    """
    # Initialize difference array with n+2 elements
    # We use n+2 to handle last+1 safely (bookings use 1-based indexing)
    diff = [0] * (n + 2)

    # Process each booking
    for first, last, seats in bookings:
        # Mark the start of the range: add seats at first index
        diff[first] += seats

        # Mark the end of the range: subtract seats at last+1 index
        # This ensures the increase only applies to flights in [first, last]
        diff[last + 1] -= seats

    # Initialize result array
    result = [0] * n

    # Current running sum (prefix sum)
    current = 0

    # Compute prefix sum to get actual seat counts for each flight
    # Note: flights are 1-based in problem, but result array is 0-based
    for i in range(1, n + 1):
        # Update running sum with difference at current position
        current += diff[i]

        # Store result for flight i (convert to 0-based index)
        result[i - 1] = current

    return result
```

```javascript
// Time: O(m + n) | Space: O(n)
function corpFlightBookings(bookings, n) {
  /**
   * Optimal solution using difference array technique
   *
   * The key insight: Instead of updating every flight in a range for each booking,
   * we mark where ranges start and end, then compute the final result using prefix sums.
   *
   * For each booking [first, last, seats]:
   * - Add seats at index first (1-based) to mark range start
   * - Subtract seats at index last+1 (1-based) to mark range end
   *
   * After processing all bookings, compute prefix sum to get actual seat counts.
   */
  // Initialize difference array with n+2 elements
  // We use n+2 to handle last+1 safely (bookings use 1-based indexing)
  const diff = new Array(n + 2).fill(0);

  // Process each booking
  for (const [first, last, seats] of bookings) {
    // Mark the start of the range: add seats at first index
    diff[first] += seats;

    // Mark the end of the range: subtract seats at last+1 index
    // This ensures the increase only applies to flights in [first, last]
    diff[last + 1] -= seats;
  }

  // Initialize result array
  const result = new Array(n).fill(0);

  // Current running sum (prefix sum)
  let current = 0;

  // Compute prefix sum to get actual seat counts for each flight
  // Note: flights are 1-based in problem, but result array is 0-based
  for (let i = 1; i <= n; i++) {
    // Update running sum with difference at current position
    current += diff[i];

    // Store result for flight i (convert to 0-based index)
    result[i - 1] = current;
  }

  return result;
}
```

```java
// Time: O(m + n) | Space: O(n)
public int[] corpFlightBookings(int[][] bookings, int n) {
    /**
     * Optimal solution using difference array technique
     *
     * The key insight: Instead of updating every flight in a range for each booking,
     * we mark where ranges start and end, then compute the final result using prefix sums.
     *
     * For each booking [first, last, seats]:
     * - Add seats at index first (1-based) to mark range start
     * - Subtract seats at index last+1 (1-based) to mark range end
     *
     * After processing all bookings, compute prefix sum to get actual seat counts.
     */
    // Initialize difference array with n+2 elements
    // We use n+2 to handle last+1 safely (bookings use 1-based indexing)
    int[] diff = new int[n + 2];

    // Process each booking
    for (int[] booking : bookings) {
        int first = booking[0];
        int last = booking[1];
        int seats = booking[2];

        // Mark the start of the range: add seats at first index
        diff[first] += seats;

        // Mark the end of the range: subtract seats at last+1 index
        // This ensures the increase only applies to flights in [first, last]
        diff[last + 1] -= seats;
    }

    // Initialize result array
    int[] result = new int[n];

    // Current running sum (prefix sum)
    int current = 0;

    // Compute prefix sum to get actual seat counts for each flight
    // Note: flights are 1-based in problem, but result array is 0-based
    for (int i = 1; i <= n; i++) {
        // Update running sum with difference at current position
        current += diff[i];

        // Store result for flight i (convert to 0-based index)
        result[i - 1] = current;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)**

- `O(m)` to process all bookings (each booking takes O(1) time with the difference array)
- `O(n)` to compute the prefix sum and build the final result
- Total: O(m + n), which is linear in the input size

**Space Complexity: O(n)**

- We use a difference array of size `n+2` → O(n)
- The result array of size `n` → O(n)
- Total: O(n) additional space (excluding input and output)

## Common Mistakes

1. **Off-by-one errors with indexing:**
   - The problem uses 1-based flight numbering, but arrays are 0-based
   - Forgetting to handle `last+1` in the difference array
   - **Fix:** Be explicit about when you're using 1-based vs 0-based indexing. Use `n+2` for the difference array to safely handle `last+1`.

2. **Forgetting to initialize arrays properly:**
   - Not initializing the difference array with zeros
   - Not accounting for the extra element needed for `last+1`
   - **Fix:** Always initialize arrays explicitly. In Python/JS, use list multiplication or `fill()`. In Java, arrays are automatically zero-initialized.

3. **Confusing when to use prefix sum:**
   - Trying to compute prefix sum after each booking instead of after all bookings
   - Not understanding why we need both the add and subtract operations
   - **Fix:** Remember: mark all range boundaries first, then compute prefix sum once at the end.

4. **Not handling edge cases:**
   - Empty bookings array (should return array of zeros)
   - Single flight (n=1)
   - Bookings that end at the last flight (need to handle `last+1` correctly)
   - **Fix:** Test with small cases including: n=1, empty bookings, booking covering all flights.

## When You'll See This Pattern

The difference array/prefix sum technique appears in many range update problems:

1. **Range Addition (LeetCode 370):** Exactly the same pattern - adding values to ranges in an array
2. **Zero Array Transformation series:** These problems build on the same concept with additional constraints
3. **Car Pooling (LeetCode 1094):** Similar pattern but with passengers getting on and off at different stops
4. **Meeting Rooms II (LeetCode 253):** Can be solved by marking start and end times, then computing maximum overlap

The pattern to recognize: **When you need to apply multiple range updates and then query the final state**, think about using a difference array. This is especially useful when:

- You have many range updates
- Range lengths can be large
- You only need the final result, not intermediate states

## Key Takeaways

1. **Difference arrays optimize range updates from O(k) to O(1):** Instead of updating each element in a range, mark the start with `+value` and the position after the end with `-value`, then compute prefix sum once.

2. **Recognize range update problems:** Look for problems where you're adding/subtracting values to contiguous subarrays or ranges. If you see "for each booking/query/operation, update range [l, r]", consider the difference array approach.

3. **1-based vs 0-based indexing matters:** Pay close attention to whether the problem uses 1-based indexing (like flight numbers) and convert carefully. Using `n+2` for the difference array helps avoid index out of bounds errors.

**Related problems:** [Zero Array Transformation II](/problem/zero-array-transformation-ii), [Zero Array Transformation III](/problem/zero-array-transformation-iii)
