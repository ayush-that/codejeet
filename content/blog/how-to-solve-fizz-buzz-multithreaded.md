---
title: "How to Solve Fizz Buzz Multithreaded — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fizz Buzz Multithreaded. Medium difficulty, 74.6% acceptance rate. Topics: Concurrency."
date: "2027-12-25"
category: "dsa-patterns"
tags: ["fizz-buzz-multithreaded", "concurrency", "medium"]
---

# How to Solve Fizz Buzz Multithreaded

Fizz Buzz Multithreaded is a concurrency problem where you need to coordinate four threads to print numbers from 1 to n according to FizzBuzz rules, but each thread has a specific printing function. The challenge is ensuring threads execute in the correct order without race conditions or deadlocks.

## Visual Walkthrough

Let's trace through n=5 step-by-step to understand the coordination needed:

1. **Number 1**: Should print "1" via `printNumber`. Only the number thread should run.
2. **Number 2**: Should print "2" via `printNumber`. Only the number thread should run.
3. **Number 3**: Divisible by 3 only → should print "fizz" via `printFizz`. Only the fizz thread should run.
4. **Number 4**: Should print "4" via `printNumber`. Only the number thread should run.
5. **Number 5**: Divisible by 5 only → should print "buzz" via `printBuzz`. Only the buzz thread should run.

The tricky part: We have four threads running concurrently, but only one should print at a time, and they must print in numerical order (1, 2, 3, 4, 5...). Without coordination, threads might print out of order or multiple threads might try to print simultaneously.

## Brute Force Approach

A naive approach might try to let each thread check the current number independently:

```python
# WARNING: This doesn't work due to race conditions!
class FizzBuzz:
    def __init__(self, n):
        self.n = n
        self.current = 1

    def fizz(self):
        while self.current <= self.n:
            if self.current % 3 == 0 and self.current % 5 != 0:
                printFizz()
                self.current += 1

    def buzz(self):
        while self.current <= self.n:
            if self.current % 5 == 0 and self.current % 3 != 0:
                printBuzz()
                self.current += 1

    # ... similar for fizzbuzz and number
```

**Why this fails:**

1. **Race conditions**: Multiple threads might check `self.current` at the same time and all pass their conditions
2. **Incorrect increments**: Threads might increment `self.current` multiple times
3. **No ordering guarantee**: Threads might print out of sequence
4. **Busy waiting**: Threads continuously loop, wasting CPU cycles

This approach needs synchronization primitives to coordinate execution order.

## Optimized Approach

The key insight is that we need to **synchronize threads** so only one runs at a time, and each thread only runs when it's "its turn" based on the current number.

We can use **condition variables** (or semaphores) to implement this coordination:

1. **Shared state**: Track the current number (1 to n)
2. **Condition variables**: One for each type of output (fizz, buzz, fizzbuzz, number)
3. **Coordination logic**:
   - Each thread waits until the current number matches its condition
   - After printing, the thread increments the number and notifies all threads
   - Other threads wake up, check if it's their turn, and proceed or wait again

**Step-by-step reasoning:**

1. Initialize with current number = 1
2. All four threads start running concurrently
3. Each thread checks: Is current number ≤ n AND does current number match my condition?
4. If yes: print, increment number, notify all threads
5. If no: wait for notification
6. Repeat until current number > n

This ensures:

- Only one thread prints at a time
- Threads print in correct numerical order
- No busy waiting (threads sleep when not their turn)
- All threads terminate properly

## Optimal Solution

Here's the complete solution using condition variables:

<div class="code-group">

```python
import threading

class FizzBuzz:
    def __init__(self, n: int):
        self.n = n
        self.current = 1
        self.lock = threading.Lock()
        self.cv = threading.Condition(self.lock)

    # printFizz() outputs "fizz"
    def fizz(self, printFizz: 'Callable[[], None]') -> None:
        with self.cv:
            while self.current <= self.n:
                # Wait until it's fizz's turn (divisible by 3 but not 5)
                while self.current <= self.n and not (
                    self.current % 3 == 0 and self.current % 5 != 0
                ):
                    self.cv.wait()

                if self.current > self.n:
                    break

                # It's fizz's turn - print and increment
                printFizz()
                self.current += 1
                # Notify all threads to check their conditions
                self.cv.notify_all()

    # printBuzz() outputs "buzz"
    def buzz(self, printBuzz: 'Callable[[], None]') -> None:
        with self.cv:
            while self.current <= self.n:
                # Wait until it's buzz's turn (divisible by 5 but not 3)
                while self.current <= self.n and not (
                    self.current % 5 == 0 and self.current % 3 != 0
                ):
                    self.cv.wait()

                if self.current > self.n:
                    break

                # It's buzz's turn - print and increment
                printBuzz()
                self.current += 1
                # Notify all threads to check their conditions
                self.cv.notify_all()

    # printFizzBuzz() outputs "fizzbuzz"
    def fizzbuzz(self, printFizzBuzz: 'Callable[[], None]') -> None:
        with self.cv:
            while self.current <= self.n:
                # Wait until it's fizzbuzz's turn (divisible by both 3 and 5)
                while self.current <= self.n and not (
                    self.current % 3 == 0 and self.current % 5 == 0
                ):
                    self.cv.wait()

                if self.current > self.n:
                    break

                # It's fizzbuzz's turn - print and increment
                printFizzBuzz()
                self.current += 1
                # Notify all threads to check their conditions
                self.cv.notify_all()

    # printNumber(x) outputs "x", where x is an integer.
    def number(self, printNumber: 'Callable[[int], None]') -> None:
        with self.cv:
            while self.current <= self.n:
                # Wait until it's number's turn (not divisible by 3 or 5)
                while self.current <= self.n and not (
                    self.current % 3 != 0 and self.current % 5 != 0
                ):
                    self.cv.wait()

                if self.current > self.n:
                    break

                # It's number's turn - print and increment
                printNumber(self.current)
                self.current += 1
                # Notify all threads to check their conditions
                self.cv.notify_all()
```

```javascript
class FizzBuzz {
  constructor(n) {
    this.n = n;
    this.current = 1;
    this.lock = false;
  }

  // printFizz() outputs "fizz"
  async fizz(printFizz) {
    while (this.current <= this.n) {
      // Wait until it's fizz's turn and acquire lock
      while (this.current <= this.n && !(this.current % 3 === 0 && this.current % 5 !== 0)) {
        await this.wait();
      }

      if (this.current > this.n) break;

      // It's fizz's turn - print and increment
      printFizz();
      this.current++;
      // Release lock and notify waiting threads
      this.notifyAll();
    }
  }

  // printBuzz() outputs "buzz"
  async buzz(printBuzz) {
    while (this.current <= this.n) {
      // Wait until it's buzz's turn and acquire lock
      while (this.current <= this.n && !(this.current % 5 === 0 && this.current % 3 !== 0)) {
        await this.wait();
      }

      if (this.current > this.n) break;

      // It's buzz's turn - print and increment
      printBuzz();
      this.current++;
      // Release lock and notify waiting threads
      this.notifyAll();
    }
  }

  // printFizzBuzz() outputs "fizzbuzz"
  async fizzbuzz(printFizzBuzz) {
    while (this.current <= this.n) {
      // Wait until it's fizzbuzz's turn and acquire lock
      while (this.current <= this.n && !(this.current % 3 === 0 && this.current % 5 === 0)) {
        await this.wait();
      }

      if (this.current > this.n) break;

      // It's fizzbuzz's turn - print and increment
      printFizzBuzz();
      this.current++;
      // Release lock and notify waiting threads
      this.notifyAll();
    }
  }

  // printNumber(x) outputs "x", where x is an integer.
  async number(printNumber) {
    while (this.current <= this.n) {
      // Wait until it's number's turn and acquire lock
      while (this.current <= this.n && !(this.current % 3 !== 0 && this.current % 5 !== 0)) {
        await this.wait();
      }

      if (this.current > this.n) break;

      // It's number's turn - print and increment
      printNumber(this.current);
      this.current++;
      // Release lock and notify waiting threads
      this.notifyAll();
    }
  }

  // Helper methods for synchronization
  wait() {
    return new Promise((resolve) => {
      const check = () => {
        if (!this.lock) {
          this.lock = true;
          resolve();
        } else {
          setTimeout(check, 0);
        }
      };
      check();
    });
  }

  notifyAll() {
    this.lock = false;
  }
}
```

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class FizzBuzz {
    private int n;
    private int current;
    private Lock lock;
    private Condition cv;

    public FizzBuzz(int n) {
        this.n = n;
        this.current = 1;
        this.lock = new ReentrantLock();
        this.cv = lock.newCondition();
    }

    // printFizz() outputs "fizz"
    public void fizz(Runnable printFizz) throws InterruptedException {
        lock.lock();
        try {
            while (current <= n) {
                // Wait until it's fizz's turn (divisible by 3 but not 5)
                while (current <= n && !(current % 3 == 0 && current % 5 != 0)) {
                    cv.await();
                }

                if (current > n) break;

                // It's fizz's turn - print and increment
                printFizz.run();
                current++;
                // Notify all threads to check their conditions
                cv.signalAll();
            }
        } finally {
            lock.unlock();
        }
    }

    // printBuzz() outputs "buzz"
    public void buzz(Runnable printBuzz) throws InterruptedException {
        lock.lock();
        try {
            while (current <= n) {
                // Wait until it's buzz's turn (divisible by 5 but not 3)
                while (current <= n && !(current % 5 == 0 && current % 3 != 0)) {
                    cv.await();
                }

                if (current > n) break;

                // It's buzz's turn - print and increment
                printBuzz.run();
                current++;
                // Notify all threads to check their conditions
                cv.signalAll();
            }
        } finally {
            lock.unlock();
        }
    }

    // printFizzBuzz() outputs "fizzbuzz"
    public void fizzbuzz(Runnable printFizzBuzz) throws InterruptedException {
        lock.lock();
        try {
            while (current <= n) {
                // Wait until it's fizzbuzz's turn (divisible by both 3 and 5)
                while (current <= n && !(current % 3 == 0 && current % 5 == 0)) {
                    cv.await();
                }

                if (current > n) break;

                // It's fizzbuzz's turn - print and increment
                printFizzBuzz.run();
                current++;
                // Notify all threads to check their conditions
                cv.signalAll();
            }
        } finally {
            lock.unlock();
        }
    }

    // printNumber(x) outputs "x", where x is an integer.
    public void number(IntConsumer printNumber) throws InterruptedException {
        lock.lock();
        try {
            while (current <= n) {
                // Wait until it's number's turn (not divisible by 3 or 5)
                while (current <= n && !(current % 3 != 0 && current % 5 != 0)) {
                    cv.await();
                }

                if (current > n) break;

                // It's number's turn - print and increment
                printNumber.accept(current);
                current++;
                // Notify all threads to check their conditions
                cv.signalAll();
            }
        } finally {
            lock.unlock();
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each number from 1 to n is processed exactly once
- Each thread wakes up, checks its condition, and either prints or goes back to waiting
- The while loops run n times total across all threads

**Space Complexity: O(1)**

- We only use a constant amount of extra space (current number, lock, condition variable)
- No data structures that grow with n

**Synchronization Overhead:**

- Thread context switches add some overhead but don't change asymptotic complexity
- Condition variable operations are O(1) per wakeup

## Common Mistakes

1. **Forgetting to re-check conditions after waking up**: Always use `while` not `if` when waiting on a condition variable. Other threads might change the state between when you're woken up and when you acquire the lock.

2. **Not notifying all threads**: Using `notify()` instead of `notifyAll()` can cause deadlock. If you only notify one thread and it's not the correct one to run next, all threads wait forever.

3. **Incorrect termination condition**: Forgetting to check `current > n` after waking up can cause threads to print extra values or access invalid indices.

4. **Race conditions on shared variable**: Accessing `current` without proper synchronization leads to inconsistent state. Always access shared variables within the synchronized block.

5. **Busy waiting**: Continuously checking conditions in a loop without waiting wastes CPU. Always use proper synchronization primitives.

## When You'll See This Pattern

This **thread coordination pattern** appears in many concurrency problems:

1. **Print Zero Even Odd (LeetCode 1116)**: Similar coordination where threads print in a specific sequence (0, 1, 0, 2, 0, 3...).

2. **Print in Order (LeetCode 1114)**: Coordinate three threads to always print "first", "second", "third" in that order.

3. **Traffic Light Controlled Intersection (LeetCode 1279)**: Coordinate multiple threads (cars) accessing a shared resource (intersection).

4. **Dining Philosophers (LeetCode 1226)**: Coordinate multiple threads (philosophers) sharing limited resources (forks).

The common theme: **Multiple threads need to execute in a specific sequence or follow specific rules when accessing shared resources.**

## Key Takeaways

1. **Use condition variables for thread coordination**: When threads need to wait for specific conditions, condition variables with proper locking are the standard solution.

2. **Always use while loops for condition checks**: Spurious wakeups can occur, so always re-check the condition after waking up.

3. **Broadcast changes with notifyAll()**: When multiple threads might be waiting for different conditions, `notifyAll()` ensures the right thread wakes up.

4. **Design around shared state**: Identify what state determines which thread should run next, and protect all access to that state.

This problem teaches fundamental concurrency patterns that are essential for writing correct multithreaded code.

Related problems: [Fizz Buzz](/problem/fizz-buzz), [Print Zero Even Odd](/problem/print-zero-even-odd)
