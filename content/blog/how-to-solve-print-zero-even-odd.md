---
title: "How to Solve Print Zero Even Odd — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Print Zero Even Odd. Medium difficulty, 65.3% acceptance rate. Topics: Concurrency."
date: "2027-11-03"
category: "dsa-patterns"
tags: ["print-zero-even-odd", "concurrency", "medium"]
---

# How to Solve Print Zero Even Odd

This is a classic concurrency problem where three threads must coordinate to print numbers in a specific pattern: zero, odd, zero, even, zero, odd, zero, even, and so on. The tricky part is ensuring the threads execute in the correct sequence without race conditions or deadlocks. You're given a class with three methods (`zero`, `even`, `odd`) that will be called by different threads, and you need to synchronize them so they print the sequence correctly for a given number `n`.

## Visual Walkthrough

Let's trace through what should happen when `n = 4`:

1. Thread A calls `zero()` → prints `0`
2. Thread B calls `odd()` → prints `1` (first odd number)
3. Thread A calls `zero()` → prints `0`
4. Thread C calls `even()` → prints `2` (first even number)
5. Thread A calls `zero()` → prints `0`
6. Thread B calls `odd()` → prints `3` (second odd number)
7. Thread A calls `zero()` → prints `0`
8. Thread C calls `even()` → prints `4` (second even number)

The pattern is always: zero → odd → zero → even → zero → odd → zero → even, repeating until we reach `n`. Notice that odd numbers are printed in increasing order (1, 3, 5...), even numbers are printed in increasing order (2, 4, 6...), and zero is printed before every number.

## Brute Force Approach

There's no traditional "brute force" for concurrency problems, but a naive approach might involve busy waiting or inefficient synchronization. For example:

- Each thread could continuously check a shared variable to see if it's their turn
- Use `Thread.sleep()` with arbitrary delays hoping threads execute in order
- Use synchronized blocks without proper signaling

These approaches fail because:

1. **Busy waiting** wastes CPU cycles and can still have race conditions
2. **Arbitrary delays** are unreliable and may work sometimes but fail under different system loads
3. **Improper synchronization** can lead to deadlocks or incorrect ordering

The key insight is that we need a way for threads to wait until it's their turn, then signal the next thread when they're done. This is exactly what condition variables or semaphores are designed for.

## Optimized Approach

The optimal solution uses synchronization primitives to coordinate the three threads. We need to ensure:

1. `zero()` always runs first and before every number
2. After `zero()`, either `odd()` or `even()` runs depending on whether we're printing an odd or even number
3. After `odd()` or `even()` completes, we go back to `zero()` for the next iteration

We can use:

- **Semaphores**: Each thread waits on its own semaphore and signals the next thread's semaphore
- **Locks with condition variables**: Threads wait on conditions and notify others when conditions change
- **Atomic integers with busy waiting**: Less efficient but workable

The cleanest approach uses two semaphores: one for odd numbers and one for even numbers. The `zero()` thread acts as the controller, deciding which number thread to release next.

## Optimal Solution

We'll use semaphores to coordinate the threads. Here's the strategy:

- `zeroSemaphore` starts at 1 (zero goes first)
- `oddSemaphore` and `evenSemaphore` start at 0 (wait for permission)
- `zero()` prints zero, then releases either odd or even semaphore based on the current number
- `odd()` waits for its semaphore, prints the odd number, then releases zero semaphore
- `even()` waits for its semaphore, prints the even number, then releases zero semaphore

<div class="code-group">

```python
import threading

class ZeroEvenOdd:
    def __init__(self, n):
        self.n = n
        # Semaphore for zero thread - starts with 1 permission since zero goes first
        self.zero_sem = threading.Semaphore(1)
        # Semaphore for odd thread - starts with 0 permissions
        self.odd_sem = threading.Semaphore(0)
        # Semaphore for even thread - starts with 0 permissions
        self.even_sem = threading.Semaphore(0)
        # Current number to print (1-indexed)
        self.current = 1

    def zero(self, printNumber):
        for _ in range(self.n):  # Zero is printed n times
            self.zero_sem.acquire()  # Wait for permission to print zero
            printNumber(0)  # Print zero

            if self.current % 2 == 1:
                # If current number is odd, release odd semaphore
                self.odd_sem.release()
            else:
                # If current number is even, release even semaphore
                self.even_sem.release()

    def even(self, printNumber):
        for _ in range(self.n // 2):  # Even numbers: n//2 times for n
            self.even_sem.acquire()  # Wait for permission to print even
            printNumber(self.current)  # Print the current even number
            self.current += 1  # Move to next number
            self.zero_sem.release()  # Release zero for next iteration

    def odd(self, printNumber):
        # Odd numbers: ceil(n/2) times, which is (n+1)//2
        for _ in range((self.n + 1) // 2):
            self.odd_sem.acquire()  # Wait for permission to print odd
            printNumber(self.current)  # Print the current odd number
            self.current += 1  # Move to next number
            self.zero_sem.release()  # Release zero for next iteration
```

```javascript
class ZeroEvenOdd {
  constructor(n) {
    this.n = n;
    this.current = 1;
    // Create promises that will be resolved to act as semaphores
    this.zeroSem = new Promise((resolve) => resolve()); // Zero goes first
    this.oddSem = new Promise((resolve) => (this.oddResolve = resolve));
    this.evenSem = new Promise((resolve) => (this.evenResolve = resolve));
    // Store resolve functions for later use
    this.zeroResolve = null;
    this.nextOddResolve = null;
    this.nextEvenResolve = null;
  }

  async zero(printNumber) {
    for (let i = 0; i < this.n; i++) {
      await this.zeroSem; // Wait for permission to print zero
      printNumber(0); // Print zero

      if (this.current % 2 === 1) {
        // If current number is odd, resolve odd promise
        this.oddResolve();
        // Create new promise for next odd wait
        this.oddSem = new Promise((resolve) => (this.oddResolve = resolve));
      } else {
        // If current number is even, resolve even promise
        this.evenResolve();
        // Create new promise for next even wait
        this.evenSem = new Promise((resolve) => (this.evenResolve = resolve));
      }
      // Create new promise for next zero wait
      this.zeroSem = new Promise((resolve) => (this.zeroResolve = resolve));
    }
  }

  async even(printNumber) {
    for (let i = 0; i < Math.floor(this.n / 2); i++) {
      await this.evenSem; // Wait for permission to print even
      printNumber(this.current); // Print the current even number
      this.current++; // Move to next number
      this.zeroResolve(); // Release zero for next iteration
    }
  }

  async odd(printNumber) {
    for (let i = 0; i < Math.ceil(this.n / 2); i++) {
      await this.oddSem; // Wait for permission to print odd
      printNumber(this.current); // Print the current odd number
      this.current++; // Move to next number
      this.zeroResolve(); // Release zero for next iteration
    }
  }
}
```

```java
import java.util.concurrent.Semaphore;

class ZeroEvenOdd {
    private int n;
    private Semaphore zeroSem, oddSem, evenSem;
    private int current;

    public ZeroEvenOdd(int n) {
        this.n = n;
        this.current = 1;
        // Zero semaphore starts with 1 permit (zero goes first)
        this.zeroSem = new Semaphore(1);
        // Odd and even semaphores start with 0 permits
        this.oddSem = new Semaphore(0);
        this.evenSem = new Semaphore(0);
    }

    // printNumber.accept(x) outputs "x", where x is an integer.
    public void zero(IntConsumer printNumber) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            zeroSem.acquire();  // Wait for permission to print zero
            printNumber.accept(0);  // Print zero

            if (current % 2 == 1) {
                // If current number is odd, release odd semaphore
                oddSem.release();
            } else {
                // If current number is even, release even semaphore
                evenSem.release();
            }
        }
    }

    public void even(IntConsumer printNumber) throws InterruptedException {
        for (int i = 0; i < n / 2; i++) {
            evenSem.acquire();  // Wait for permission to print even
            printNumber.accept(current);  // Print the current even number
            current++;  // Move to next number
            zeroSem.release();  // Release zero for next iteration
        }
    }

    public void odd(IntConsumer printNumber) throws InterruptedException {
        // Odd numbers: ceil(n/2) times, which is (n+1)/2 for integer division
        for (int i = 0; i < (n + 1) / 2; i++) {
            oddSem.acquire();  // Wait for permission to print odd
            printNumber.accept(current);  // Print the current odd number
            current++;  // Move to next number
            zeroSem.release();  // Release zero for next iteration
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Each method runs a loop proportional to n (or n/2)
- Semaphore operations are O(1) on average
- Total operations scale linearly with n

**Space Complexity:** O(1)

- We use a constant amount of extra space (semaphores and a few integers)
- No data structures that grow with n

The synchronization primitives add some overhead, but it's constant per operation, so the overall complexity remains linear.

## Common Mistakes

1. **Incorrect loop counts**: Forgetting that `zero()` runs `n` times, `odd()` runs `ceil(n/2)` times, and `even()` runs `floor(n/2)` times. This leads to threads not terminating or missing numbers.

2. **Race conditions on shared variables**: Accessing `current` without proper synchronization can cause threads to see inconsistent values. Always use synchronization primitives to protect shared state.

3. **Deadlock from incorrect semaphore initialization**: If all semaphores start at 0, all threads wait forever. Zero must start with a permit since it goes first.

4. **Forgetting to signal the next thread**: Each thread must signal the next thread in sequence. If `odd()` or `even()` forgets to release `zeroSem`, the program deadlocks after one iteration.

## When You'll See This Pattern

This pattern appears in any problem requiring strict sequencing of concurrent operations:

1. **Print FooBar Alternately**: Two threads must print "foo" and "bar" in alternating sequence. Similar to our problem but with only two threads instead of three.

2. **Fizz Buzz Multithreaded**: Four threads must coordinate to print numbers, "fizz", "buzz", or "fizzbuzz" based on divisibility rules. More complex sequencing with four actors.

3. **Traffic Light Controlled Intersection**: Multiple threads (cars) must coordinate their movements based on traffic light states, requiring similar synchronization patterns.

The core technique is using semaphores or condition variables to create a handshake mechanism between threads, where each thread waits for a signal from the previous thread and signals the next thread when done.

## Key Takeaways

1. **Semaphores are ideal for sequencing threads**: They naturally model "permissions" where each thread waits for permission from the previous thread and grants permission to the next.

2. **The controller pattern works well**: Having one thread (like `zero()`) act as a controller that decides which thread runs next simplifies the coordination logic.

3. **Always consider termination conditions**: Each thread must know exactly how many times it should run to avoid deadlock or infinite loops. Calculate loop counts carefully based on the problem requirements.

Related problems: [Print FooBar Alternately](/problem/print-foobar-alternately), [Fizz Buzz Multithreaded](/problem/fizz-buzz-multithreaded)
