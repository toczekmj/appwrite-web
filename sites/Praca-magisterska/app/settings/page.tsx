'use client'

import PropertyUpdateCard from "@/components/Dashboard/Settings/PropertyUpdateCard";
import SaveChangesDialog from "@/components/Dashboard/Settings/SaveChangesDialog";
import {useDashboardSettings} from "@/CodeBehind/Pages/Settings/useDashboardSettings";
import {Card} from "@radix-ui/themes";
import Protected from "@/components/Auth/Protected";

export default function DashboardSettings() {
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
        <Protected>
            <Card>
                <div className={"flex flex-col gap-5"}>

                    <div className="flex flex-col md:flex-row gap-5 justify-between">
                        <PropertyUpdateCard headline={"E-mail"}
                                            placeholder={user ? user.email : "E-mail"}
                                            onchange={updateEmail}
                                            value={email}/>
                        <PropertyUpdateCard headline={"Name"}
                                            placeholder={user ? user.name : "Name"}
                                            onchange={updateName}
                                            value={name}/>
                        <PropertyUpdateCard isConfidential={true}
                                            headline={"Password"}
                                            placeholder={"********"}
                                            onchange={updatePassword}
                                            value={newPassword}/>
                    </div>

                    <SaveChangesDialog email={email}
                                       currentUserInfo={user}
                                       name={name}
                                       password={newPassword}
                                       onSaveSuccess={onSaveSuccess}/>

                </div>
            </Card>
        </Protected>
    );

}