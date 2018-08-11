/* global test, expect */

const { objectModel, datatypes } = require('./../src');

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