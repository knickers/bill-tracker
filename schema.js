transactions: [
	{
		id: int, //created at timestamp
		due: int, // when a particular instance of a transaction is due
		day: int, // day of the week
		date: int, // day of the month
		name: 'Car Payment',
		link: 'http://google.com',
		skip: int, // period to skip
		period: 'week',
		amount: 200.00,
		payments: {
			int: bool, // due timestamp: payed
			1419664504343: true
		}
	}
]
