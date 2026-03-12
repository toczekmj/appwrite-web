import {Button} from "@radix-ui/themes";
import {FolderIcon, FolderOpenIcon} from "lucide-react";

interface FolderButtonProps {
    label: string;
    selected: boolean;
    onFolderClick?: () => void;
}


export default function FolderButton({label, selected, onFolderClick}: FolderButtonProps) {
    return (
        <Button size={"3"}
                variant={selected ? "solid" : "outline"}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "nowrap",
                }}
                onClick={onFolderClick}
        >
            {
                selected ? (
                    <FolderOpenIcon/>

                ) : (
                    <FolderIcon/>
                )
            }

            {label}

        </Button>
    );
}