import { ActionIcon, Menu } from "@mantine/core"
import { IconDots, IconTrash } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Class, Node } from "../../app/schema"
import { deleteNode } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"

interface NodeOverFlowMenuProps {
    node: Node | undefined
    theClass: Class | undefined
}
export function NodeOverFlowMenu({ node, theClass }: NodeOverFlowMenuProps) {
    const mapId = useMapId()
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`])
    return (
        <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
                <ActionIcon radius="xl" style={{}} size="md">
                    <IconDots />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => {
                        node && deleteNode(firestore, dispatch, mapId, node, arrows ? Object.values(arrows) : [])
                        theClass && console.error("Not yet implemented")
                    }}
                    icon={<IconTrash size={14} />}>
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}