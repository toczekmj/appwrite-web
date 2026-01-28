import {Card, Separator, Text} from "@radix-ui/themes";
import {GetAllGenres} from "@/lib/genresDb";
import FolderBrowser from "@/components/Files/FolderBrowser";

export default async function AvailableGenres() {
    const availableGenres = await GetAllGenres();

    return (
        <Card size="3">
                <div className={"flex flex-row gap-2"}>
                    <FolderBrowser folders={availableGenres} />
                    <Card>
                        <div className={"flex flex-col min-w-100"}>
                            <Text size={"4"}>Files</Text>
                            <Separator size={"4"}/>
                        </div>
                    </Card>
                </div>
        </Card>
    );
}