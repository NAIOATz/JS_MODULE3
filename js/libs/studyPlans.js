import { getItems } from "./fetch";

export async function getstudyPlans() {
  try {
    const studyPlan = await getItems(`${import.meta.env.VITE_APP_URL}/study-plans`);
    return studyPlan
  } catch (err) {
    throw err;
  }
}