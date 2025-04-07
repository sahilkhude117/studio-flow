import { UserAvatar } from "@/components/ui/user-avatar";
import { Separator } from "@/components/ui/separator";

export const Header = () => {

  return (
    <div>
      <div className="flex h-20 items-center">
      <div className="grow"></div>
      <div className="flex items-center justify-center"></div>
       <div className="mr-5"><UserAvatar/></div>
      </div>
      <Separator className="mt-1" />
    </div>
  )
}