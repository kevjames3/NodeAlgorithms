var chalk = require('chalk');

exports.RedBlackTree = function (){
	//Init
	var self = this;
	var rootNode;

	//Private
	function Node(value){
		var self = this;

		self.ValidColors = {
			Red: "red",
			Black: "grey"
		};

		self.Color = self.ValidColors.Red;
		self.Value = value;
		self.Parent = undefined;
		self.Left = undefined;
		self.Rgiht = undefined;

		return self;
	}

	function RotateLeft(){

	}

	function RotateRight(){

	}

	function Compare(val1, val2){
		return val1 - val2;
	}

	//Public Methods
	self.Add = function(item){
		if(rootNode == undefined){
			rootNode = new Node(item);
			rootNode.Color = rootNode.ValidColors.Black;
		} else {
			var currentNode = rootNode;
			var nextNode = undefined;
			while(true) {
				if (Compare(item, currentNode.Value) <= 0){
					nextNode = currentNode.Left;
					if(nextNode == undefined){
						currentNode.Left = new Node(item);
						break;
					}
				} else {
					nextNode = currentNode.Right;
					if(nextNode == undefined){
						currentNode.Right = new Node(item);
						break;
					}
				}
				currentNode = nextNode;
			} 
		}
	}

	self.Delete = function(item){

	}

	self.Contains = function(item){

	}

	self.PrintTree = function(){
		var PrintTreeHelper = function(nodes, depth){
			if(nodes.filter(function(value){ return value != undefined }).length == 0){
				return;
			}

			var queue = [];
			var lineQueue = [];
			while(nodes.length > 0){
				var node = nodes.shift();
				
				if(node){
					queue.push(node.Left);
					queue.push(node.Right);

					if(node.Left){
						lineQueue.push("|");
					} else {
						lineQueue.push("");
					}

					if(node.Right){
						lineQueue.push("\\");
					} else {
						lineQueue.push("");
					}

					process.stdout.write(chalk[node.Color](node.Value) + Array(depth + 1).join(' '));
				} else {
					process.stdout.write(Array(depth + 1).join(''));
					lineQueue.push("");
				}
			}
			console.log("");
			
			lineQueue.forEach(function(item){
				process.stdout.write(item + Array(depth + 1).join(' '));
			});
			console.log("");

			PrintTreeHelper(queue, depth + 1);
		}

		var queue = [];
		var depth = 0;

		queue.push(rootNode);
		PrintTreeHelper(queue, depth);		
	}

	return self;
}

if (require.main === module) {
	var foo = new exports.RedBlackTree();
	foo.Add(1);
	foo.Add(2);
	foo.Add(3);
	foo.Add(-1);
	foo.Add(-2);
	foo.Add(0);
	foo.PrintTree();
}