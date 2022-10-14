import localForage from "localforage";
import {proxy} from 'valtio';

const state = proxy(localForage.getItem('wvaltio')||{wvaltio: "incial"} );

export const setState = (newState) => {
    localForage.setItem('wvaltio', newState)
    state.wvaltio=newState;
};

export default state;