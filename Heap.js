exports.Heap = function () {
	var functions = {};
	var priorityQueue = function (compareFunction) {
		var self = this;
		var heap = [];

		var GetChildrenIndex = function(index){
			var left;
			var right;
			
			if(index >= 0){
				left = index * 2;
				right = index * 2 + 1;
			}
			
			return [left, right];
		}
		
		var getParentIndex = function(index){
			return undefined;
		}

		self.Add = function (item) {
			heap.push(item);
		}

		self.Peek = function () {
			return heap[0];
		}

		self.Remove = function () {
			return undefined;
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