import { store } from "../app/store";

let wallets = store.getState().wallets;
let provider = wallets.provider;

export const showWallets = () => {
    console.log(wallets);
}

export const contractStuff = () => {
    //provider
    //...
}

export const asyncContractStuff = async() => {
    //await ...
}