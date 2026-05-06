import { useState } from "react";
import { useAccountStore } from "../store/useAccountStore";
import { Spinner } from "../../../shared/components/layout/Spinner"
import { useEffect as useToastEffect } from "react";
import { useEffect } from "react";
import { getAccounts } from "../../../shared/api/account";

export const Accounts = () => {

    const { accounts, loading, error } = useAccountStore();

    useEffect(() => {
        getAccounts();
    }, [getAccounts]);

    if (loading)  return <Spinner />;
    return (
        <div>
            {accounts.map((account) => (
                <div key={account.id}>
                    <h3>{account.name}</h3>
                    <p>{account.balance}</p>
                </div>
            ))}
        </div>
    )
}