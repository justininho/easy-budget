import { writable } from "svelte/store";
import type { IExpense, IUser } from "$lib/types";

export const currentUser = writable<IUser | undefined>();

function expenseState() {
	const { subscribe, set, update } = writable<IExpense[]>([]);
	return {
		subscribe,
		set,
		update,
		add: (expense?: IExpense) => update(e => {
			e.push({ 
				id: expense?.id,
				name: expense?.name ?? '', 
				cost: expense?.cost ?? 0,
				category: expense?.category ?? '',
				frequency: expense?.frequency ?? '',
				essential: expense?.essential ?? false,
			 }); 
			return e;
		}),
	};
}

export const expenses = expenseState();
