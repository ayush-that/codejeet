#include <iostream>
#include <vector>
using namespace std;

void moveZerosToEnd(vector<int>& a) {
    size_t write = 0;
    for (size_t read = 0; read < a.size(); read++) {
        if (a[read] != 0) {
            int tmp = a[write];
            a[write] = a[read];
            a[read] = tmp;
            write++;
        }
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    moveZerosToEnd(a);
    for (int i = 0; i < n; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n";
    return 0;
}
