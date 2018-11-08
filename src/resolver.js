/* eslint-disable no-use-before-define */
const createModel = require('./createModel');

const cascadeResolve = (value) => {
	if (value && Array.isArray(value)) {
		return Promise.all(value.map(cascadeResolve));
	} else if (value && typeof value === 'object' && !value.then) {
		return resolver(value);
	}

	return value;
};

const resolved = (keys, values, schema) => {
	const data = keys.reduce((result, key, index) => ({ ...result, [key]: values[index] }), {});

	return schema ? createModel(schema)(data) : data;
};

const resolver = (data, schema) => {
	const keys = Object.keys(data);

	return Promise.all(keys.map((key) => cascadeResolve(data[key]))).then((values) => resolved(keys, values, schema));
};

module.exports = resolver;
