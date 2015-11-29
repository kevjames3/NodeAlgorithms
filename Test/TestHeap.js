var assert = require('assert');
var should = require('should');
var heapFactory = require('../Heap.js').Heap();

describe('Heap', function () {
	var heap; //It does not matter, this is so that we can test the functions
	beforeEach(function () {
		heap = new heapFactory.MinHeap();
	});

	describe('#Add()', function () {
		it('should not add undefined elements', function () {
			heap.Add.bind(null, undefined);
			heap.Length().should.equal(0);
		});
	});

	describe('#Peek()', function () {
		it('should see the item at the beginning of the list', function () {
			heap.Add(0);
			heap.Peek().should.equal(0);
		});
	});

	describe('#Remove()', function () {
		it('It should be able to remove all elements', function(){
			heap.Add(0);
			heap.Add(1);
			heap.Length().should.equal(2);
			heap.Peek().should.equal(0);
		});
	});

	describe('#Length()', function () {
		it('should report the correct length on adding', function () {
			heap.Add(1);
			heap.Add(2);
			heap.Add(3);
			heap.Length().should.equal(3);
		});
		it('should report the correct length on removing', function () {
			heap.Add(1);
			heap.Add(2);
			heap.Add(3);
			heap.Remove();
			heap.Length().should.equal(2);
		});
	});

	describe('MinHeap', function () {
		var minHeap = new heapFactory.MinHeap();
		beforeEach(function () {
			minHeap = new heapFactory.MinHeap();
		});

		describe('#Remove()', function () {
			var tests = [
				{ args: [], expected: undefined },
				{ args: [1, 2], expected: 2 },
				{ args: [4, 2, 3], expected: 3 },
				{ args: [100, 20, 32, 4], expected: 20 }
			];

			tests.forEach(function (test) {
				it('correctly removes the lowest element, and is able to see the next element ' + test.expected, function () {
					test.args.forEach(function (argument) {
						minHeap.Add.call(null, argument);
					});
					minHeap.Remove();
					assert.equal(minHeap.Peek(), test.expected);
				});
			});
		});
		
		describe('#Add()', function () {
			var tests = [
				{ args: [], expected: undefined },
				{ args: [1, 2], expected: 1 },
				{ args: [4, 2, 3], expected: 2 },
				{ args: [100, 20, 32, 4], expected: 4 }
			];

			tests.forEach(function (test) {
				it('correctly sees that ' + test.expected + ' is the minimum', function () {
					test.args.forEach(function (argument) {
						minHeap.Add.call(null, argument);
					});
					assert.equal(minHeap.Peek(), test.expected);
				});
			});
		});
	});

	describe('MaxHeap', function () {
		var maxHeap = new heapFactory.MaxHeap();
		beforeEach(function () {
			maxHeap = new heapFactory.MaxHeap();
		});

		describe('#Add()', function () {
			var tests = [
				{ args: [], expected: undefined },
				{ args: [1, 2], expected: 2 },
				{ args: [4, 2, 3], expected: 4 },
				{ args: [100, 20, 32, 4], expected: 100 }
			];

			tests.forEach(function (test) {
				var message = "correctly returns undefined on no adds";
				if (test.expected) {
					message = 'correctly sees that ' + test.expected + ' is the maximum';
				}

				it(message, function () {
					test.args.forEach(function (argument) {
						maxHeap.Add.call(null, argument);
					});
					assert.equal(maxHeap.Peek(), test.expected);
				});
			});
		});
		
		describe('#Remove()', function () {
			var tests = [
				{ args: [], expected: undefined },
				{ args: [1, 2], expected: 1 },
				{ args: [4, 2, 3], expected: 3 },
				{ args: [100, 20, 32, 4], expected: 32 }
			];

			tests.forEach(function (test) {
				it('correctly removes the largest element, and is able to see the next element ' + test.expected, function () {
					test.args.forEach(function (argument) {
						maxHeap.Add.call(null, argument);
					});
					maxHeap.Remove();
					assert.equal(maxHeap.Peek(), test.expected);
				});
			});
		});
	});
});