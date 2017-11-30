
(function () {
	var JLinq = window.JLinq = function (elements) {
		/// <summary>The JLinq object that provides LINQ query syntax to work with JavaScript Arrays.</summary>
		/// <param name="elements" type="Array|ObjectCollection">The Array that this JLinq instance will work with.</param>
		/// <field name="elements" type="Array|ObjectCollection">The internal Array that contains the actual data elements.</field>
		this.elements = elements;
	};

	JLinq.from = function (elements) {
		/// <summary>Creates a JLinq object with JavaScript Arrays.</summary>
		/// <param name="elements" type="Array|ObjectCollection">The Array that this JLinq instance will work with.</param>
		/// <returns type="JLinq"></returns>
		return new JLinq(elements);
	};

	JLinq.prototype =
		{
			aggregate: function (seed, accumulator) {
				/// <summary>Applies an accumulator function over a sequence. The specified seed value is used as the inital accumulator value.</summary>
				/// <param name="seed" type="Number|String">The initial accumulator value.</param>
				/// <param name="accumulator" type="Function">An accumulator function to be invoked on each element.</param>
				/// <returns type="Number|String">The final accumulator value.</returns>
				var result;

				if (seed == undefined) {
					result = this.elements[0];

					for (var i = 1; i < this.elements.length; i++) {
						result = accumulator(result, this.elements[i], i);
					}
				}
				else {
					result = seed;

					for (var i = 0; i < this.elements.length; i++) {
						result = accumulator(result, this.elements[i], i);
					}
				}

				return result;
			},
			all: function (predicate) {
				/// <summary>Determines whether all elements of a sequence satisfy a condition.</summary>
				/// <param name="predicate" type="Function">A function to test each element for a condition.</param>
				/// <returns type="Boolean">true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.</returns>
				var element;

				for (var i = 0; i < this.elements.length; i++) {
					element = this.elements[i];

					if (!predicate(element)) {
						return false;
					}
				}

				return true;
			},
			any: function (predicate) {
				/// <summary>Determines whether any element of a sequence satisfies a condition.</summary>
				/// <param name="predicate" type="Function">A function to test each element for a condition.</param>
				/// <returns type="Boolean">The average of the sequence of values.</returns>
				for (var i = 0; i < this.elements.length; i++) {
					if (predicate(this.elements[i])) {
						return true;
					}
				}

				return false;
			},
			average: function (selector) {
				/// <summary>Computes the average of a seuqence numbers that are obtained by invoking a transform function on each element of the input sequence.</summary>
				/// <param name="selector" type="Function">A transform function to apply to each element.</param>
				/// <returns type="Number">The average of the sequence of values.</returns>
				var n = 0;
				var func;

				if (selector) {
					func = function (total, element) { return total + selector(element); };
				}
				else {
					func = function (total, element) { return total + element; };
				}

				return this.aggregate(0, func) / this.elements.length;
			},
			contains: function (value) {
				/// <summary>Determines whether a sequence contains a specified element.</summary>
				/// <param name="value">The value to locate in the sequence.</param>
				/// <returns type="Boolean">true if the source sequence contains an element that has the specified value; otherwise, false.</returns>
				return this.any(function (element) { return element == value; });
			},
			count: function (predicate) {
				/// <summary>Returns a number that represents how many elements in the specified sequence satisfy a condition.</summary>
				/// <param name="predicate" type="Function">A function to test each element for a condition.</param>
				/// <returns type="Number">A number that represents how many elements in the sequence satisfy the condition in the predicate function.</returns>
				return predicate ? this.where(predicate).elements.length : this.elements.length;
			},
			distinct: function () {
				/// <summary>Returns distinct elements from a sequence.</summary>
				/// <returns type="JLinq">An JLinq instance that contains distinct elements from the source sequence.</returns>
				var newItems = [];
				var item1;

				for (var i = 0; i < this.elements.length; i++) {
					item1 = this.elements[i];

					if (JLinq.from(newItems).any(function (element) { return element == item1; })) {
						continue;
					}

					newItems.push(item1);
				}

				return JLinq.from(newItems);
			},
			except: function (elements2) {
				/// <summary>Produces the set difference of two sequences.</summary>
				/// <param name="item2" type="Array/ObjectCollection">An Array object whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.</param>
				/// <returns type="JLinq">A sequence that contains the set difference of the elements of two sequences.</returns>
				var newItems = [];
				var element;

				for (var i = 0; i < this.elements.length; i++) {
					element = this.elements[i];

					if (JLinq.from(elements2).contains(element)) {
						continue;
					}

					newItems.push(element);
				}

				return JLinq.from(newItems);
			},
			first: function (predicate, defaultValue) {
				/// <summary>Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.</summary>
				/// <param name="predicate" type="Function">A function to test each element for a condition.</param>
				/// <param name="defaultValue">The value to return if no is found.</param>
				/// <returns type="Object">The last element in the sequence that passes the test in the specified predicate function.</returns>
				if (predicate) {
					return this.where(predicate).first();
				}
				else {
					return this.elements.length > 0 ? this.elements[0] : defaultValue;
				}
			},
			foreach: function (action) {
				/// <summary>Performs the specified action on each element of the sequence.</summary>
				/// <param name="action" type="Function">A function to perform on each element of the sequence.</param>
				for (var i = 0; i < this.elements.length; i++) {
					action(this.elements[i]);
				}
			},
			groupBy: function (keySelector) {
				/// <summary>Groups the elements of a sequence according to a specified key selector function.</summary>
				/// <param name="keySelector" type="Function">A function to extract the key for each element.</param>
				/// <returns type="JLinq">A JLinq instance contains a sequence of objects and a key.</returns>
				var keys = this.select(function (element) { return keySelector(element); }).distinct().elements;
				var newItems = [];
				var groupItem;

				for (var i = 0; i < keys.length; i++) {
					groupItem = { 'key': keys[i], 'query': this.where(function (element) { return keySelector(element) == keys[i]; }) };
					newItems.push(groupItem);
				}

				return JLinq.from(newItems);
			},
			intersect: function (elements2) {
				/// <summary>Produces the set intersection of two sequences.</summary>
				/// <param name="elements2" type="Array/ObjectCollection">An Array whose distinct elements that also appear in the first sequence will be returned.</param>
				/// <returns type="JLinq">A JLinq instance contains the elements that form the set intersection of two sequences.</returns>
				var newItems = [];
				var element;

				for (var i = 0; i < elements2.length; i++) {
					element = elements2[i];

					if (this.contains(element)) {
						newItems.push(element);
					}
				}

				return JLinq.from(newItems);
			},
			last: function (predicate, defaultValue) {
				/// <summary>Returns the last element of the sequence that satisfies a condition or a default value if no such element is found.</summary>
				/// <param name="predicate" type="Function">A function to test each element for a condition.</param>
				/// <param name="defaultValue">The value to return if no is found.</param>
				/// <returns type="Object">The last element in the sequence that passes the test in the specified predicate function.</returns>
				if (predicate) {
					return this.where(predicate).last();
				}
				else {
					return this.elements.length > 0 ? this.elements[this.elements.length - 1] : defaultValue;
				}
			},
			max: function (selector) {
				/// <summary>Returns the maximum value in a sequence.</summary>
				/// <param name="selector" type="Function">A transform function to apply to each element.</param>
				/// <returns type="Object">A value that corresponds to the maximum value in the sequence.</returns>
				if (selector) {
					return this.select(selector).orderBy().last();
				}

				return this.orderBy().last();
			},
			min: function (selector) {
				/// <summary>Returns the minimum value in a sequence.</summary>
				/// <param name="selector" type="Function">A transform function to apply to each element.</param>
				/// <returns type="Object">A value that corresponds to the minimum value in the sequence.</returns>
				if (selector) {
					return this.select(selector).orderBy().first();
				}

				return this.orderBy().first();
			},
			orderBy: function (keySelector) {
				/// <summary>Sorts the elements of a sequence in ascending order according to a key.</summary>
				/// <param name="keySelector" type="Function">A function to extract a key from an element.</param>
				/// <returns type="JLinq">A JLinq instance whose elements are sorted according to a key.</returns>
				var newItems = [];

				for (var i = 0; i < this.elements.length; i++) {
					newItems.push(this.elements[i]);
				}

				if (keySelector) {
					newItems = newItems.sort(function (key1, key2) {
						var x = keySelector(key1);
						var y = keySelector(key2);
						return x > y ? 1 : (x < y ? -1 : 0);
					});
				}
				else {
					newItems = newItems.sort(function (key1, key2) {
						return key1 > key2 ? 1 : (key1 < key2 ? -1 : 0);
					});
				}

				return JLinq.from(newItems);
			},
			orderByDescending: function (keySelector) {
				/// <summary>Sorts the elements of a sequence in descending order according to a key.</summary>
				/// <param name="keySelector" type="Function">A function to extract a key from an element.</param>
				/// <returns type="JLinq">A JLinq instance whose elements are sorted according to a key.</returns>
				return this.orderBy(keySelector).reverse();
			},
			reverse: function () {
				/// <summary>Inverts the order of the elements in a sequence.</summary>
				/// <returns type="JLinq">A JLinq instance whose elements correspond to those of the input sequence in reverse order.</returns>
				if (this.elements.reverse) {
					return JLinq.from(this.elements.reverse());
				}
				else {
					var newItems = [];

					for (var i = this.elements.length - 1; i >= 0; i--) {
						newItems.push(this.elements[i]);
					}

					return JLinq.from(newItems);
				}
			},
			select: function (selector) {
				/// <summary>Projects each element of a sequence into a new form.</summary>
				/// <param name="selector" type="Function">A transform function to apply to each element.</param>
				/// <returns type="JLinq">A JLinq instance whose elements are the result of invoking the transform function on each element of source.</returns>
				var newItems = [];
				var element;

				for (var i = 0; i < this.elements.length; i++) {
					newItems.push(selector(this.elements[i], i));
				}

				return JLinq.from(newItems);
			},
			selectMany: function (selector) {
				/// <summary>Projects each element of a sequence to a JLinq and flattens the resulting sequences into one sequence.</summary>
				/// <param name="selector" type="Function">A transform function to apply to each element.</param>
				/// <returns type="JLinq">A JLinq instance whose elements are the result of invoking the one-to-many transform function on each element of the input sequence.</returns>
				var newItems = [];

				for (var i = 0; i < this.elements.length; i++) {
					newItems = newItems.concat(selector(this.elements[i]));
				}

				return JLinq.from(newItems);
			},
			skipWhile: function (predicate) {
				/// <summary>Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.</summary>
				/// <param name="predicate" type="Function">A function to test each source element for a condition; the second parameter of the function represents the index of the source element.</param>
				/// <returns type="JLinq">A JLinq instance that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.</returns>
				var newItems = [];
				var element;

				for (var i = 0; i < this.elements.length; i++) {
					element = this.elements[i];

					if (predicate(element, i)) {
						continue;
					}

					newItems.push(element);
				}

				return JLinq.from(newItems);
			},
			sum: function (selector) {
				/// <summary>Computes the sum of a number sequence.</summary>
				/// <returns type="Number">The sum of the values in the sequence.</returns>
				if (selector) {
					return this.select(selector).aggregate(0, function (total, element) { return total + element; });
				}
				else {
					return this.aggregate(0, function (total, element) { return total + element; });
				}
			},
			take: function (length) {
				var newItems = this.elements.splice(0, length);
				return JLinq.from(newItems);
			},
			takeWhile: function (predicate) {
				/// <summary>Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.</summary>
				/// <param name="predicate" type="Function">A function to test each source element for a condition; the second parameter of the function represents the index of the source element.</param>
				/// <returns type="JLinq">A JLinq instance that contains elements from the input sequence that occur before the element at which the test no longer passes.</returns>
				var newItems = [];
				var element;

				for (var i = 0; i < this.elements.length; i++) {
					element = this.elements[i];

					if (!predicate(element, i)) {
						break;
					}

					newItems.push(element);
				}

				return JLinq.from(newItems);
			},
			toArray: function () {
				/// <summary>Returns an Array from the sequence.</summary>
				/// <returns type="Array">An array that contains the elements from the input sequence.</returns>
				if (this.elements instanceof Array) {
					return this.elements;
				}
				else {
					var newItems = [];

					for (var i = 0; i < this.elements.length; i++) {
						newItems.push(this.elements[i]);
					}

					return newItems;
				}
			},
			union: function (elements2) {
				/// <summary>Produces the set union of two sequences.</summary>
				/// <param name="elements2" type="Array/ObjectCollection">An Array whose distinct elements form the second set for the union.</param>
				/// <returns type="JLinq">A JLinq instance that contains the elements from both input sequences, excluding duplicates.</returns>
				var newItems = [];

				for (var i = 0; i < this.elements.length; i++) {
					newItems.push(this.elements[i]);
				}

				for (var i = 0; i < elements2.length; i++) {
					newItems.push(elements2[i]);
				}

				return JLinq.from(newItems).distinct()
			},
			where: function (predicate) {
				/// <summary>Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.</summary>
				/// <param name="predicate" type="Function">A function to test each source element for a condition; the second parameter of the function represents the index of the source element.</param>
				/// <returns type="JLinq">A JLinq instance that contains elements from the input sequence that satisfy the condition.</returns>
				var newItems = [];
				var element;

				for (var i = 0; i < this.elements.length; i++) {
					element = this.elements[i];

					if (predicate(element, i)) {
						newItems.push(element);
					}
				}

				return JLinq.from(newItems);
			}
		};
})();