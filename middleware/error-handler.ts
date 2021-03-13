export const errorHandler  = (error: any, req: any, res: any, next: any) => {
	res.status(error.status || 500).send({
		error: {
			status: error.status || 500,
			message: error.message || 'Internal Server Error',
		},
	});
};