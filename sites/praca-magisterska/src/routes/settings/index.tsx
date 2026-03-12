import { useDashboardSettings } from '#/codeBehind/pages/Settings/useDashboardSettings'
import PropertyUpdateCard from '#/components/dashboard/Settings/PropertyUpdateCard'
import SaveChangesDialog from '#/components/dashboard/Settings/SaveChangesDialog'
import { Card } from '@radix-ui/themes'
import { requireAuth } from '#/lib/auth/routeAuth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/')({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
})

function RouteComponent() {
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
  )
}
