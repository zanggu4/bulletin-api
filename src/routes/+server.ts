export const OPTIONS = async () => {
	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		},
		status: 204
	});
};
