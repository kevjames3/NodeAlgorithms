exports.MergeSort = function (items){
	function Compare (a,b) {
		return a - b;
	}

	function Merge(listA, listB){
		var finalList = [];
		if(listA && listB){
			for(var i = 0, j = 0; i < listA.length || j < listB.length;){
				if (i >= listA.length){
					finalList.push(listB[j]);
					j++;
				} else if (j >= listB.length){
					finalList.push(listA[i]);
					i++;
				} else if(Compare(listA[i], listB[j]) < 0){
					finalList.push(listA[i]);
					i++;
				} else if (Compare(listA[i], listB[j]) == 0){
					finalList.push(listA[i]);
					finalList.push(listB[j]);
					i++, j++;
				} else if (Compare(listA[i], listB[j]) > 0){ //it is > 0
					finalList.push(listB[j]);
					j++;
				}
			}
		} else if (listA && !listB){
			finalList = listA;
		} else if (!listA && listB) {
			finalList = listB;
		}

		return finalList;
	}
	
	if(items.length > 1){
		var midpoint = Math.floor(items.length / 2);
		var items_a = exports.MergeSort(items.slice(0, midpoint));
		var items_b = exports.MergeSort(items.slice(midpoint));

		items = Merge(items_a, items_b);
	}

	return items;
}

if (require.main === module) {
    console.log(exports.MergeSort([]));
    console.log(exports.MergeSort([1,2]));
    console.log(exports.MergeSort([3,2]));
    console.log(exports.MergeSort([ 69, 67, 36, 84, 48, 79, 50, 49 ]));
    console.log(exports.MergeSort(Array.apply(null, {length: 100}).map(Function.call, function(){return Math.ceil(Math.random() * 100);} )));
}