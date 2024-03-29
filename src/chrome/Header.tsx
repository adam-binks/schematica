import { Group, Paper, Title } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { Link } from "react-router-dom"
import { useAppDispatch } from "../app/hooks"
import { Project } from "../app/schema"
import { AccountMenu } from "./AccountMenu"

export default function Header({
    project
}:
    {
        project: Project | undefined
    }) {
    return (
        <Paper
            p={5}
            className="bg-mistyrose z-40"
        >
            <Group mx="lg" position="apart">
                <div className="flex align-bottom">
                    <Link to="/">
                        <Title className="select-none hover:bg-melon px-2 rounded-lg text-darkplatinum" order={4}>
                            Schematica
                        </Title>
                    </Link>
                    {project && <Title className="ml-2 select-none text-gray-500 font-medium" order={4}>
                        {project.name}
                    </Title>}
                </div>
                <Group>
                    <AccountMenu />
                </Group>
            </Group>
        </Paper>
    )
}