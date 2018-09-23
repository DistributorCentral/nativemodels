/* global test, expect */

const { objectModel, datatypes } = require('./../dist');

test('objectModel - basic object model test', () => {
	const model = objectModel({ name: datatypes.string() });

	expect(model({ name: 'name' })).toEqual({ name: 'name' });
});

test('objectModel - object model value check', () => {
	const model = objectModel({ name: datatypes.string() });

	expect(model({ name: 'name' }).name).toEqual('name');
});

test('objectModel - default check', () => {
	const model = objectModel({ name: datatypes.string().default('name') });

	expect(model().name).toEqual('name');
});

test('objectModel - required check', () => {
	const model = objectModel({ name: datatypes.string().required() });

	expect(() => {
		model();
	}).toThrow();
});

test('objectModel - computed type', () => {
	const model = objectModel({
		firstName: datatypes.string(),
		fullName: datatypes.computed((record) => `${record.firstName} ${record.lastName}`),
		lastName: datatypes.string(),
	});

	const user = model({
		firstName: 'John',
		lastName: 'Smith',
	});

	expect(user.fullName).toEqual('John Smith');

	user.firstName = 'James';

	expect(user.fullName).toEqual('James Smith');
});

test('objectModel - fail to set value that does not exist', () => {
	const model = objectModel({ name: datatypes.string() });

	expect(() => {
		model().lastName = 'test';
	}).toThrow();
});

test('objectModel - handle extra data', () => {
	const model = objectModel({ name: datatypes.string() });

	expect(model({ name: 'name', name2: 'remove this' })).toEqual({ name: 'name' });
});

test('objectModel - handle extra data', () => {
	const model = objectModel({
		firstName: datatypes.string(),
		fullName: datatypes.computed((record) => `${record.firstName} ${record.lastName}`),
		lastName: datatypes.string(),
	});

	const johnSmith = model({
		firstName: 'John',
		lastName: 'Smith',
	});
	const janeDoe = { ...johnSmith, firstName: 'Jane', lastName: 'Doe' };

	expect(janeDoe).toEqual({ firstName: 'Jane', fullName: 'John Smith', lastName: 'Doe' });

	const parsedJaneDoe = model(janeDoe);

	expect(parsedJaneDoe).toEqual({ firstName: 'Jane', fullName: 'Jane Doe', lastName: 'Doe' });
});

test('objectModel - allow nulls', () => {
	const model = objectModel({ id: datatypes.int().nullable() });
	const record = model({ id: null });

	expect(record).toEqual({ id: null });
});

test('objectModel - ensure set adheres to schema', () => {
	const model = objectModel({ id: datatypes.int() });
	const record = model({ id: 1 });

	expect(() => {
		record.id = 'test';
	}).toThrow();
});

test('objectModel - default overrides required', () => {
	const model = objectModel({
		id: datatypes
			.int()
			.default(2)
			.required(),
	});

	expect(model()).toEqual({ id: 2 });
});