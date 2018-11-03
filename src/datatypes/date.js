const base = require('./base');

const isValidDate = (value, strict = false) => {
	if (value instanceof Date) {
		return true;
	}

	if (!strict) {
		const test = new Date(value);

		if (value && test instanceof Date && !isNaN(test)) {
			return true;
		}
	}

	return false;
};

const date = () => ({
	...base,
	parse(value) {
		return value instanceof Date ? value : new Date(value);
	},
	strictCheck(value, name) {
		if (isValidDate(value, true)) {
			return true;
		}

		throw new Error(`Property ${name} is not a date`);
	},
	validate(value, name) {
		if (isValidDate(value)) {
			return true;
		}

		throw new Error(`Property ${name} is not a date`);
	},
});

module.exports = date;
