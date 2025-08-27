const describe = (name: string, callback: Function) => {};

describe('CSS file', () => {
	defineOptions({});

	it('Does not report', () => {
		expectValid(`
			.the-component {}
			.the-component .the-component__foo {}
		`);
	});
});
