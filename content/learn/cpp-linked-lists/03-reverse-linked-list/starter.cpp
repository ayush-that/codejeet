#include <iostream>
using namespace std;

struct Node {
  int data;
  Node* next;
  Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
 public:
  Node* head;
  Node* tail;

  LinkedList() : head(nullptr), tail(nullptr) {}

  ~LinkedList() {
    while (head != nullptr) {
      Node* nextNode = head->next;
      delete head;
      head = nextNode;
    }
  }

  void insertAtTail(int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) {
      head = tail = newNode;
    } else {
      tail->next = newNode;
      tail = newNode;
    }
  }

  // TODO: reverse the list in place using three pointers (previous, current,
  //       nextNode). Don't forget to swap the meaning of head and tail.
  void reverse() {
    // your code here
  }

  void print() const {
    Node* current = head;
    while (current != nullptr) {
      cout << current->data;
      if (current->next != nullptr) cout << " ";
      current = current->next;
    }
    cout << "\n";
  }
};

int main() {
  LinkedList list;
  int value;
  while (cin >> value) {
    if (value == -1) break;
    list.insertAtTail(value);
  }
  list.reverse();
  list.print();
  return 0;
}
