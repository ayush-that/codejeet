def second_largest(a):
    largest = float("-inf")
    second = float("-inf")
    for x in a:
        if x > largest:
            second = largest
            largest = x
        elif x < largest and x > second:
            second = x
    return -1 if second == float("-inf") else second


n = int(input())
a = list(map(int, input().split()))
print(second_largest(a))
