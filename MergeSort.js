function MergeSort(items){
	function Compare (a,b) {
		return a - b;
	}

	function Merge(listA, listB){
		var finalList = [];
		if(listA && listB){
			for(var i = 0, j = 0; i < listA.length && j < listB.length;){
				if (i >= listA.length){
					finalList.push(listB[j]);
					j++;
				} else if (j >= listB.length){
					finalList.push(listA[i]);
					i++;
				} else if(Compare(listA[i], listB[j]) < 0){
					finalList.push(listA[i]);
					i++;
				} else if (Compare(listA, listB) == 0){
					finalList.push(listA[i]);
					finalList.push(listB[j]);
					i++, j++;
				} else if (Compare(listA, listB) > 0){
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

	// function MergeSortHelper(listA, listB){
	// 	if(listA.length == 0 && listB.length > 0){
	// 		return listB;
	// 	} else if (listB.length == 0){
	// 		return [];
	// 	}


	// }

	// if(items && items.length > 0){

	// }

	return items;
}