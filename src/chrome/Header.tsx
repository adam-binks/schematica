import { Button, Group, Paper, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { Link } from "react-router-dom"
import { useAppDispatch } from "../app/hooks"
import { createMap } from "../state/mapFunctions"
import { openPane } from "../state/paneReducer"
import { AccountMenu } from "./AccountMenu"

export default function Header() {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <Paper
            p={5}
            className="bg-zinc-200 z-40"
        >
            <Group mx="lg" position="apart">
                <Link to="/">
                    <Title className="select-none hover:bg-violet-200 px-2 rounded-lg" order={4}>
                        PME Tool
                    </Title>
                </Link>
                <Group>
                    <Button
                        onClick={async () => {
                            const id = createMap(firestore)
                            dispatch(openPane({ id, addingArrowFrom: undefined }))
                        }}
                        variant="light"
                        leftIcon={<IconPlus />}
                    >
                        Create map
                    </Button>
                    <AccountMenu />
                </Group>
            </Group>
        </Paper>
    )
}