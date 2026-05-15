def largest(a):
    best = a[0]
    for i in range(1, len(a)):
        if a[i] > best:
            best = a[i]
    return best


n = int(input())
a = list(map(int, input().split()))
print(largest(a))
