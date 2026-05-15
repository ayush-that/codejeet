def left_rotate_by_one(a):
    if not a:
        return
    first = a[0]
    for i in range(len(a) - 1):
        a[i] = a[i + 1]
    a[-1] = first


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
left_rotate_by_one(a)
print(" ".join(str(x) for x in a))
