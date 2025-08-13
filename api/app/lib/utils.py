def construct_input(user_transc: list, assistant_outputs: list) -> list:
	user_prefix = 'Examinee: '
	assistant_prefix = 'Examiner: '
	return [(assistant_prefix + y, user_prefix + x) for x, y in zip(user_transc, assistant_outputs)]