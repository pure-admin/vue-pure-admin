declare const pMapSeries: {
	/**
	Map over promises serially.

	@param input - Mapped over serially in the `mapper` function.
	@param mapper - Expected to return a value. If it's a `Promise`, it's awaited before continuing with the next iteration.
	@returns Fulfills when all promises in `input` and ones returned from `mapper` are fulfilled, or rejects if any of the promises reject.

	@example
	```
	import pMapSeries = require('p-map-series');

	const keywords = [
		getTopKeyword() //=> Promise
		'rainbow',
		'pony'
	];

	let scores = [];

	const mapper = async keyword => {
		const score = await fetchScore(keyword);
		scores.push(score);
		return {keyword, score};
	});

	(async () => {
		console.log(await pMapSeries(keywords, mapper));
		// [
		// 	{
		// 		keyword: 'unicorn',
		// 		score: 99
		// 	},
		// 	{
		// 		keyword: 'rainbow',
		// 		score: 70
		// 	},
		// 	{
		// 		keyword: 'pony',
		// 		score: 79
		// 	}
		// ]
	})();
	```
	*/
	<ValueType, MappedValueType>(
		input: Iterable<PromiseLike<ValueType> | ValueType>,
		mapper: (
			element: ValueType,
			index: number
		) => PromiseLike<MappedValueType> | MappedValueType
	): Promise<MappedValueType[]>;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function pMapSeries<ValueType, MappedValueType>(
	// 	input: Iterable<PromiseLike<ValueType> | ValueType>,
	// 	mapper: (
	// 		element: ValueType,
	// 		index: number
	// 	) => PromiseLike<MappedValueType> | MappedValueType
	// ): Promise<MappedValueType[]>;
	// export = pMapSeries;
	default: typeof pMapSeries;
};

export = pMapSeries;
