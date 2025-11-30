import { Dialog } from '../ui/ui.js';
import { getItems ,postItems, putItems } from './fetch.js';

export async function getIdDeclaredPlan(studentId) {
    if (!studentId) { return "studentId Not Found" }
    try {
        const declaredPlan = await getItems(`${import.meta.env.VITE_APP_URL}/students/${studentId}/declared-plan`);
        return declaredPlan;
    } catch (err) {
        throw err
    }
}

export async function postDeclaredPlan(studentId, planId) {
    if (!studentId || !planId) { throw "studentId or planId Not Found" }
    try {
        const body = {"planId": Number.parseInt(planId)}
        const declaredPlan = await postItems(`${import.meta.env.VITE_APP_URL}/students/${studentId}/declared-plan`,body)
        if(!declaredPlan.ok){
            switch (declaredPlan.status){
                case 409: Dialog("You may have declared study plan already. Please check again.");
            }
        }
        return declaredPlan;
    } catch (err) {
        
    }
}

export async function putDeclaredPlan(studentId, planId) {
    if (!studentId || !planId) { throw "studentId or planId Not Found" }
    try{
        const body = {"planId": Number.parseInt(planId)}
        const declaredPlan = await putItems(`${import.meta.env.VITE_APP_URL}/students/${studentId}/declared-plan`,body)
        return declaredPlan;
    } catch (err) {
        throw err
    }
}

// export async function deleteItems(params) {
    
// // }