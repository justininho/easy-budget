import type { Actions, PageServerLoad } from './$types';
import pb from '$lib/server/pb';
import type { IExpense } from '$lib/types';

export const load = (async ({ params }) => {
	let expenses: IExpense[] = [];

	// look into auto cancel
	// https://github.com/pocketbase/js-sdk#auto-cancellation
	const records = await pb.collection('expenses').getFullList<IExpense>(200 /* batch size */, {
		// sort in ascending order
		sort: '+created',
	});

	expenses = records.map((record) => ({
		id: record.id,
		name: record.name,
		amount: record.amount
	}));

  return {
    expenses
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {

		const data = await request.formData();

		const ids = data.getAll('id');
		const names = data.getAll('name');
		const amounts = data.getAll('amount');

		// create array of objects from form data
		let expenses = ids.map((id, i) => ({ 
			id,
			name: names[i],
			amount: amounts[i] 
		}))

		if(!expenses.length) {
			return { success: true };
		}

		try {
			expenses.forEach(async (expense) => {
				if(!expense.id) {
					// create
					await pb.collection('expenses').create(expense);
				}
				else {
					// update
					await pb.collection('expenses').update(expense.id.toString(), expense);
				}
			});
		} catch (error) {
			return { success: false, error: "Database Error"}
		}

		return { success: true }
	}
};