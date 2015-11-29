exports.Heap = function () {
	var functions = {};
	var priorityQueue = function (compareFunction) {
		var self = this;
		var heap = [];

		var GetChildrenIndex = function (index) {
			var left;
			var right;

			if (index >= 0) {
				left = index * 2 + 1;
				right = index * 2 + 2;
			}

			return [left, right];
		}

		var getParentIndex = function (index) {
			return Math.ceil((2 * index / 2) - 1);
		}

		var swap = function (i, j) {
			var temp = heap[i];
			heap[i] = heap[j];
			heap[j] = temp;
		}

		self.Add = function (item) {
			heap.push(item);
			var index = heap.length - 1;
			var parentIndex = getParentIndex(index);
			while (index > 0 &&
				compareFunction(heap[index], heap[parentIndex]) < 0) {
				swap(index, parentIndex);

				index = parentIndex;
				parentIndex = getParentIndex(index)
			}
		}

		self.Peek = function () {
			return heap[0];
		}

		self.Remove = function () {
			var currIndex = 0

			do {
				var children = GetChildrenIndex(currIndex);
				var left = children[0];
				var right = children[1];
				if (compareFunction(heap[left], heap[right]) > 0) {
					heap[currIndex] = heap[right];
					currIndex = right;
				} else {
					heap[currIndex] = heap[left];
					currIndex = left;
				}
			} while (heap[currIndex]);
			
			var emptyIndex = getParentIndex(getParentIndex(currIndex));
			heap.splice(emptyIndex, 1);
		}

		self.Length = function () {
			return heap.length;
		}

		return self;
	};

	functions.MinHeap = function () {
		return priorityQueue(function (a, b) {
			if (a < b) return -1;
			if (a == b) return 0;
			if (a > b) return 1;
		});
	};

	functions.MaxHeap = function () {
		return priorityQueue(function (a, b) {
			if (a < b) return 1;
			if (a == b) return 0;
			if (a > b) return -1;
		});
	}

	return functions;
}