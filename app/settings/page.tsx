'use client'

import PropertyUpdateCard from "@/components/Dashboard/Settings/PropertyUpdateCard";
import SaveChangesDialog from "@/components/Dashboard/Settings/SaveChangesDialog";
import {useDashboardSettings} from "@/Hooks/Settings/useDashboardSettings";
import {Card} from "@radix-ui/themes";
import {useAuth} from "@/components/Auth/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function DashboardSettings() {
    const {currentUserInfo} = useAuth();
    const router = useRouter();
    useEffect(() => {
        console.log(currentUserInfo);
        if (!currentUserInfo) {
            router.push('/login');
        }
    }, [currentUserInfo, router]);

    const {
        user,
        name,
        email,
        newPassword,
        onSaveSuccess,
        updateEmail,
        updateName,
        updatePassword,
    } = useDashboardSettings()

    return (
        <Card>
            <div className={"flex flex-col gap-5"}>

                <div className="flex flex-col md:flex-row gap-5">
                    <PropertyUpdateCard headline={"E-mail"}
                                        placeholder={user ? user.email : "E-mail"}
                                        onchange={updateEmail}
                                        value={email} />
                    <PropertyUpdateCard headline={"Name"}
                                        placeholder={user ? user.name : "Name"}
                                        onchange={updateName}
                                        value={name} />
                    <PropertyUpdateCard isConfidential={true}
                                        headline={"Password"}
                                        placeholder={"********"}
                                        onchange={updatePassword}
                                        value={newPassword} />
                </div>

                <SaveChangesDialog email={email}
                                   currentUserInfo={user}
                                   name={name}
                                   password={newPassword}
                                   onSaveSuccess={onSaveSuccess} />

            </div>
        </Card>
    );
}